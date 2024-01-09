"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

const router = express.Router();

router.get("/search", asyncHandler(productController.searchProducts));
router.get("/", asyncHandler(productController.getAllProducts));
router.get("/detail/:id", asyncHandler(productController.getProduct));

router.use(authentication);
router.get("/draft", asyncHandler(productController.getAllDraftsForShop));
router.get("/publish", asyncHandler(productController.getAllPublishForShop));
router.post("/", asyncHandler(productController.createProduct));
router.patch("/:id", asyncHandler(productController.updateProduct));
router.post("/publish/:id", asyncHandler(productController.publishProduct));
router.post("/unPublish/:id", asyncHandler(productController.unPublishProduct));

module.exports = router;
