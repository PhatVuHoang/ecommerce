"use strict";
const { OK } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");

class InventoryController {
  async addStock(req, res, next) {
    new OK({
      message: "Add stock success",
      metadata: await InventoryService.addStockToInventory(req.body),
    }).send(res);
  }
}

module.exports = new InventoryController();
