"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const {
  findAllDiscountCodesUnSelect,
  updateDiscountById,
  checkDiscountIsExists,
} = require("../models/repositories/discount.repository");
const {
  findAllProducts,
} = require("../models/repositories/product.repository");
const { convertToObjectIdMongodb, removeUndefinedObject } = require("../utils");

/**
 * Discount serivces
 * 1 - Generator discount code [Shop | Admin]
 * 2 - Get discount amount [User]
 * 3 - Get all discount codes [User | Shop]
 * 4 - Verify discount code [User]
 * 5 - Delete discount code [Admin | Shop]
 * 6 - Cancel discount code [User]
 */

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      startDate,
      endDate,
      isActive,
      shopId,
      minOrderValue,
      productId,
      applyTo,
      name,
      description,
      type,
      value,
      maxValue,
      maxUses,
      usedCount,
      maxUsePerUser,
      userUsed,
    } = payload;

    if (new Date(startDate) > new Date(endDate)) {
      throw new BadRequestError("Start date must be before end date");
    }

    // create index for discount code
    const foundDiscount = await discountModel
      .findOne({
        discountCode: code,
        discountShopId: convertToObjectIdMongodb(shopId),
      })
      .lean();
    if (foundDiscount && foundDiscount.discountIsActive) {
      throw new BadRequestError("Discount code is existed");
    }

    const newDiscount = await discountModel.create({
      discountName: name,
      discountDescription: description,
      discountType: type,
      discountCode: code,
      discountValue: value,
      discountMaxValue: maxValue,
      discountMinOrderValue: minOrderValue || 0,
      discountStartDate: new Date(startDate),
      discountEndDate: new Date(endDate),
      discountMaxUses: maxUses,
      discountUsedCount: usedCount,
      discountUsersUsed: userUsed,
      discountShopId: shopId,
      discountMaxUsePerUser: maxUsePerUser,
      discountIsActive: isActive,
      discountApplyTo: applyTo,
      discountProductIds: applyTo === "all" ? [] : productId,
    });

    return newDiscount;
  }

  static async updateDiscountCode(discountId, payload) {
    const objectParams = removeUndefinedObject(payload);
    const updateDiscount = await updateDiscountById(discountId, objectParams);
    return updateDiscount;
  }

  /**
   * Get all discount codes available with products
   */
  static async getAllDiscountCodeWithProduct({
    code,
    shopId,
    limit = 50,
    page = 1,
  }) {
    // create index for discountCode
    const foundDiscount = await discountModel.findOne({
      discountCode: code,
      discountShopId: convertToObjectIdMongodb(shopId),
    });

    if (!foundDiscount || !foundDiscount.discountIsActive) {
      throw new NotFoundError("Discount code is not exist");
    }

    const { discountApplyTo, discountProductIds } = foundDiscount;
    let productIds;
    if (discountApplyTo === "all") {
      productIds = await findAllProducts({
        filter: {
          productShop: convertToObjectIdMongodb(shopId),
          isPublish: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["productName"],
      });
    }

    if (discountApplyTo === "specific") {
      productIds = await findAllProducts({
        filter: {
          _id: {
            $in: discountProductIds,
          },
          isPublish: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["productName"],
      });
    }

    return productIds;
  }

  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discountShopId: convertToObjectIdMongodb(shopId),
        discountIsActive: true,
      },
      unselect: ["__v", "discountShopId"],
    });

    return discounts;
  }

  /**
   * Apply discount code
   */
  static async getDiscountAmount({ code, userId, shopId, products }) {
    const foundDiscount = await checkDiscountIsExists({
      discountShopId: convertToObjectIdMongodb(shopId),
      discountCode: code,
    });

    if (!foundDiscount) {
      throw new NotFoundError("Discount does not exist");
    }

    const {
      discountIsActive,
      discountMaxUses,
      discountStartDate,
      discountEndDate,
      discountMinOrderValue,
      discountMaxUsePerUser,
      discountUsersUsed,
      discountType,
      discountValue,
      discountProductIds,
    } = foundDiscount;
    if (!discountIsActive) {
      throw new BadRequestError("Discount expired");
    }

    if (!discountMaxUses) {
      throw new BadRequestError("Discount are out");
    }

    if (
      new Date() < new Date(discountStartDate) ||
      new Date() > new Date(discountEndDate)
    ) {
      throw new BadRequestError("Discount code has expired");
    }

    let totalOrder = 0;
    if (discountMinOrderValue > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < discountMinOrderValue) {
        throw new BadRequestError(
          `Discount requires a minimum order value of ${discountMinOrderValue}`
        );
      }
    }

    if (discountMaxUsePerUser > 0) {
      const userUseDiscount = discountUsersUsed.find(
        (user) => user.userId === userId
      );
      if (userUseDiscount) {
        const totalUse = discountUsersUsed.reduce((acc, user) => {
          if (user.userId === userId) {
            return acc + 1;
          }

          return acc;
        }, 0);

        if (totalUse === discountMaxUsePerUser) {
          throw new BadRequestError("Maximum number of uses");
        }
      }
    }

    const amount =
      discountType === "fixed_amount"
        ? discountValue
        : totalOrder * (discountValue / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ shopId, code }) {
    const deleted = await discountModel.findOneAndDelete({
      discountCode: code,
      discountShopId: convertToObjectIdMongodb(shopId),
    });

    return deleted;
  }

  static async cancelDiscountCode({ code, shopId, userId }) {
    const foundDiscount = await checkDiscountIsExists({
      filter: {
        discountCode: code,
        discountShopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) {
      throw new NotFoundError("Discount does not exist");
    }

    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discountUsersUsed: userId,
      },
      $inc: {
        discountMaxUses: 1,
        discountUsedCount: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;
