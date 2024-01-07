"use strict";

const express = require("express");
const access = require("./access");
const { apiKey, permission } = require("../auth/checkAuth");

const router = express.Router();

router.use(apiKey);
router.use(permission("0000"));

router.use("/authentication", access);

module.exports = router;
