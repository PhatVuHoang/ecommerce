"use strict";

const develop = {
  app: {
    port: parseInt(process.env.PORT_DEV, 10) || 3000,
  },
  database: {
    host: process.env.MONGODB_HOST_DEV || "localhost",
    port: parseInt(process.env.MONGODB_PORT_DEV, 10) || 27017,
    name: process.env.MONGODB_NAME_DEV || "devDB",
  },
};

const production = {
  app: {
    port: parseInt(process.env.PORT_PROD, 10) || 3000,
  },
  database: {
    host: process.env.MONGODB_HOST_PROD || "localhost",
    port: parseInt(process.env.MONGODB_PORT_PROD, 10) || 27017,
    name: process.env.MONGODB_NAME_PROD || "prodDB",
  },
};

const config = { develop, production };
const env = process.env.NODE_ENV || "develop";
module.exports = config[env];
