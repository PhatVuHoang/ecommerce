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

// routes

// handle errors

module.exports = app;
