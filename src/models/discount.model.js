"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

const discountSchema = new Schema(
  {
    discountName: {
      type: String,
      required: true,
    },
    discountDescription: {
      type: String,
      required: true,
    },
    discountType: {
      type: String,
      default: "fixed_amount",
      enum: ["fixed_amount", "percentage"],
    },
    discountValue: {
      type: Number,
      required: true,
    },
    discountCode: {
      type: String,
      required: true,
    },
    discountStartDate: {
      type: Date,
      required: true,
    },
    discountEndDate: {
      type: Date,
      required: true,
    },
    // quantity discount can be used
    discountMaxUses: {
      type: Number,
      required: true,
    },
    // quantity discount used
    discountUsedCount: {
      type: Number,
      required: true,
    },
    // list user used this discount
    discountUsersUsed: {
      type: Array,
      default: [],
    },
    // quantity user can used this quantity
    discountMaxUsePerUser: {
      type: Number,
      required: true,
    },
    discountMinOrderValue: {
      type: Number,
      required: true,
    },
    discountShopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    discountIsActive: {
      type: Boolean,
      default: true,
    },
    discountApplyTo: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    // products can apply discount
    discountProductIds: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, discountSchema);
