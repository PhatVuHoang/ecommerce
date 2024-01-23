"use strict";

const express = require("express");
const access = require("./access");
const product = require("./product");
const discount = require("./discount");
const cart = require("./cart");
const checkout = require("./checkout");
const inventory = require("./inventory");
const { apiKey, permission } = require("../auth/checkAuth");

const router = express.Router();

router.use(apiKey);
router.use(permission("0000"));

router.use("/inventory", inventory);
router.use("/checkout", checkout);
router.use("/cart", cart);
router.use("/discount", discount);
router.use("/product", product);
router.use("/authentication", access);

module.exports = router;
