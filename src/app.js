require("dotenv").config();
const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

// middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// databases
require("./databases/init.mongodb");
const { checkOverload } = require("./helpers/check.connect");
checkOverload();
// routes

// handle errors

module.exports = app;
