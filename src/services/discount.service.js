"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const {
  findAllDiscountCodesUnSelect,
} = require("../models/repositories/discount.repository");
const {
  findAllProducts,
} = require("../models/repositories/product.repository");
const { convertToObjectIdMongodb } = require("../utils");

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

    // check expired
    if (new Date() < new Date(startDate) || new Date() > new Date(endDate)) {
      throw new BadRequestError("Discount code has expired");
    }

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

  static async updateDiscountCode() {}

  /**
   * Get all discount codes available with products
   */
  static async getAllDiscountCodeWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
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
}

module.exports = DiscountService;
