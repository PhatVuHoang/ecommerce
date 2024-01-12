"use strict";

const express = require("express");
const discountController = require("../../controllers/discount.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.get(
  "/list-product-code",
  asyncHandler(discountController.getAllDiscountCodeWithProduct)
);
router.get("/amount", asyncHandler(discountController.getDiscountAmount));

router.use(authentication);

router.post("/", asyncHandler(discountController.createDiscount));
router.get("/", asyncHandler(discountController.getAllDiscountCodesByShop));

module.exports = router;
