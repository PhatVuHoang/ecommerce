"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.post("/signup", asyncHandler(accessController.signup));
router.post("/login", asyncHandler(accessController.login));

router.use(authentication);
router.post("/logout", asyncHandler(accessController.logout));

module.exports = router;
