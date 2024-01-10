require("dotenv").config();
const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const routes = require("./routes");
const fs = require("fs");
const path = require("path");
const yaml = require("yaml");

const file = fs.readFileSync(path.resolve("swagger.yaml"), "utf-8");
const swaggerDocument = yaml.parse(file);

const app = express();

// middlewares
app.use(cors());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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
if (process.env.NODE_ENV === "production") {
  const { checkOverload } = require("./helpers/check.connect");
  checkOverload();
}

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
