"use strict";

const { NotFoundError } = require("../core/error.response");
const cartModel = require("../models/cart.model");
const {
  createUserCart,
  updateUserCartQuantity,
} = require("../models/repositories/cart.repository");
const { getProductById } = require("../models/repositories/product.repository");

/**
 * Key features: Cart service
 * - add product to cart [user]
 * - reduce product quantity by one [user]
 * - increase product quantity by one [user]
 * - get cart [user]
 * - delete cart [user]
 * - delete item cart [user]
 */

class CartService {
  static async addToCart({ userId, product = {} }) {
    // check cart is existed
    const userCart = await cartModel.findOne({ cart_userId: userId });
    if (!userCart) {
      return await createUserCart({ userId, product });
    }

    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    return await updateUserCartQuantity({ userId, product });
  }

  /**
   * shop_order_ids: [
   *  {
   *    shopId,
   *    item_products: [
   *      {
   *         quantity,
   *         price,
   *         shopId,
   *         old_quantity,
   *         productId
   *      }
   *    ],
   *    version
   *  }
   * ]
   */
  static async addToCartV2({ userId, shop_order_ids = {} }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];
    const foudProduct = await getProductById(productId);
    if (!foudProduct) {
      throw new NotFoundError("Not found a product");
    }

    if (foudProduct.productShop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError("Product do not belong to the shop");
    }

    if (quantity === 0) {
      CartService.deleteUserCart({ userId, productId });
    }

    return await updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" };
    const updateSet = {
      $pull: {
        cart_products: {
          productId,
        },
      },
    };
    const deleteCart = await cartModel.updateOne(query, updateSet);
    return deleteCart;
  }

  static async getListUserCart({ userId }) {
    return await cartModel
      .findOne({
        cart_userId: +userId,
      })
      .lean();
  }
}

module.exports = CartService;
