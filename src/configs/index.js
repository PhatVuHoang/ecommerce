"use strict";

const develop = {
  app: {
    port: parseInt(process.env.PORT_DEV, 10) || 3000,
  },
  database: {
    uri: process.env.MONGODB_URI_DEV,
  },
};

const production = {
  app: {
    port: parseInt(process.env.PORT_PROD, 10) || 3000,
  },
  database: {
    uri: process.env.MONGODB_URI_PROD,
  },
};

const config = { develop, production };
const env = process.env.NODE_ENV || "develop";
module.exports = config[env];
