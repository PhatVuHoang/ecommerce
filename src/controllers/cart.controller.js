"use strict";

const { Created, OK } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  async addToCart(req, res, next) {
    new Created({
      message: "add to cart success",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  }

  async updateCart(req, res, next) {
    new OK({
      message: "update success",
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  }

  async deleteCart(req, res, next) {
    new OK({
      message: "delete success",
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res);
  }

  async listToCart(req, res, next) {
    new OK({
      message: "get list success",
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  }
}

module.exports = new CartController();
