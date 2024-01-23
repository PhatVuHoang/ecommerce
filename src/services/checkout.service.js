"use strict";

const { findCartById } = require("../models/repositories/cart.repository");
const { BadRequestError } = require("../core/error.response");
const {
  checkProductByServer,
} = require("../models/repositories/product.repository");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");
const orderModel = require("../models/order.model");
class CheckoutService {
  /**
    {
      cartId,
      userId,
      shop_order_ids: [
        {
          shopId,
          shop_discount: [
            {
              shopId,
              discountId,
              codeId
            }
          ],
          item_products: [
            {
              price,
              quantity,
              productId
            }
          ]
        }
      ]
    } 
   */
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    // check cartId is exist
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new BadRequestError("cart is not existed");

    const checkout_order = {
      totalPrice: 0, // tong tien hang
      feeShip: 0, // phi van chuyen
      totalDiscount: 0, // tong tien discount giam gia
      totalCheckout: 0, // tong thanh toan
    };

    const shop_order_ids_new = [];
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];
      const checkProductServer = await checkProductByServer(item_products);
      if (!checkProductServer[0]) throw new BadRequestError("Order wrong");

      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      checkout_order.totalPrice += checkoutPrice;
      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, // tien truoc khi giam gia
        priceApplyDiscount: checkoutPrice,
        item_products,
      };

      // neu shop_discount > 0, check discount co hop le hay khong?
      if (shop_discounts.length > 0) {
        const { discount = 0 } = await getDiscountAmount({
          code: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        });

        checkout_order.totalDiscount += discount;
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment,
  }) {
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({
        cartId,
        shop_order_ids,
        userId,
      });

    // check lai mot lan nua xem vuot ton kho hay khong
    // get new array Products
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireLock.push(!!keyLock);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    if (acquireLock.includes(false)) {
      throw new BadRequestError(
        "Mot so san pham da duoc cap nhat! Vui long quay lai gio hang..."
      );
    }

    const newOrder = await orderModel.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });

    // truong hop: neu insert thanh cong, thi remove product co trong cart
    if (newOrder) {
      // remove product in my cart
    }
  }

  // 1- query orders [users]
  static async getOrdersByUser() {}

  // 1 - query order using id [users]

  static async getOneOrderByUser() {}

  // 1 - cancel order [users]
  static async cancelOrderByUser() {}

  // 1- update order status [shop | admin]
  static async updateOrderStatusByShop() {}
}

module.exports = CheckoutService;
