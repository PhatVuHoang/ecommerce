"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const inventoryController = require("../../controllers/inventory.controller");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.use(authentication);
router.post("/addStock", asyncHandler(inventoryController.addStock));

module.exports = router;
