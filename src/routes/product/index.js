"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

const router = express.Router();

router.get("/search", asyncHandler(productController.searchProducts));
router.get("/all", asyncHandler(productController.getAllProducts));
router.get("/detail/:id", asyncHandler(productController.getProduct));

router.use(authentication);
router.get("/draft", asyncHandler(productController.getAllDraftsForShop));
router.get("/publish", asyncHandler(productController.getAllPublishForShop));
router.post("/", asyncHandler(productController.createProduct));
router.put("/publish/:id", asyncHandler(productController.publishProduct));
router.put("/unPublish/:id", asyncHandler(productController.unPublishProduct));

module.exports = router;
