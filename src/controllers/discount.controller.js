"use strict";

const { Created, OK } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  async createDiscount(req, res, next) {
    new Created({
      message: "Create a new discount success",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  }

  async getAllDiscountCodesByShop(req, res, next) {
    new OK({
      message: "Get all discount code success",
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  }

  async getAllDiscountCodeWithProduct(req, res, next) {
    new OK({
      message: "Get all discount code success",
      metadata: await DiscountService.getAllDiscountCodeWithProduct({
        ...req.query,
      }),
    }).send(res);
  }

  async getDiscountAmount(req, res, next) {
    new OK({
      message: "Get discount amount success",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  }

  // async deleteDiscount(req, res, next) {
  //   new OK({
  //     message: 'Delete discount code success',
  //     metadata: await DiscountService.deleteDiscountCode()
  //   })
  // }
}

module.exports = new DiscountController();
