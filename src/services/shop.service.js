"use strict";

const shopModel = require("../models/shop.model");

const findByEmail = async ({
  email,
  select = {
    email: 1,
    password: 2,
    name: 1,
    roles: 1,
  },
}) => {
  const response = await shopModel.findOne({ email }).select(select).lean();
  return response;
};

module.exports = {
  findByEmail,
};
