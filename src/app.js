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
app.use("/v1/api/", routes);

// handle errors
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "ERROR",
    code: statusCode,
    message: error.message || "Internal server error",
  });
});

module.exports = app;
