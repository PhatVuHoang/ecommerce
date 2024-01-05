require("dotenv").config();
const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const routes = require("./routes");
const app = express();

// middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// databases
require("./databases/init.mongodb");
const { checkOverload } = require("./helpers/check.connect");
checkOverload();
// routes
app.use("/", routes);
// handle errors

module.exports = app;
