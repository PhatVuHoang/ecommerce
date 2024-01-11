"use strict";
const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Inventory";
const COLLECTION = "Inventories";

const inventorySchema = new Schema(
  {
    inventoryProductId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    inventoryLocation: {
      type: String,
      default: "unknow",
    },
    inventoryStock: {
      type: Number,
      required: true,
    },
    inventoryShopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    inventoryReservation: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION,
  }
);

module.exports = model(DOCUMENT_NAME, inventorySchema);
