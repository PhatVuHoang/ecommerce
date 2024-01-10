require("dotenv").config();
const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const routes = require("./routes");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Ecommerce NodeJS API",
    version: "1.0.0",
    description:
      "This is a REST API application made with Express. It retrieves data from JSONPlaceholder.",
    license: {
      name: "http://localhost:3000",
      url: "http://localhost:3000",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const app = express();

// middlewares
app.use(cors());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
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
