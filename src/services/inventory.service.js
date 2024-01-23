"use strict";

const inventoryModel = require("../models/inventory.model");
const { getProductById } = require("../models/repositories/product.repository");
const { BadRequestError } = require("../core/error.response");

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "",
  }) {
    const product = await getProductById(productId);
    if (!product) throw new BadRequestError("The product does not exists!");
    const query = { inventoryShopId: shopId, inventoryProductId: productId };
    const updateSet = {
      $inc: {
        inventoryStock: stock,
      },
      $set: {
        inventoryLocaltion: location,
      },
    };
    const options = {
      upsert: true,
      new: true,
    };

    return await inventoryModel.findOneAndUpdate(query, updateSet, options);
  }
}

module.exports = InventoryService;
