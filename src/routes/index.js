"use strict";

const express = require("express");
const access = require("./access");
const product = require("./product");
const discount = require("./discount");
const cart = require("./cart");
const { apiKey, permission } = require("../auth/checkAuth");

const router = express.Router();

router.use(apiKey);
router.use(permission("0000"));

router.use("/cart", cart);
router.use("/discount", discount);
router.use("/product", product);
router.use("/authentication", access);

module.exports = router;
