"use strict";

const { getUnSelectData, getSelectData } = require("../../utils");
const discountModel = require("../discount.model");

const findAllDiscountCodesUnSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unselect,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const discounts = await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unselect))
    .lean();

  return discounts;
};

const findAllDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  select,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const discounts = await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return discounts;
};

const updateDiscountById = async (discountId, payload) => {
  return await discountModel.findOneAndUpdate(discountId, objectParams, {
    isNew: true,
  });
};

const checkDiscountIsExists = async (filter) => {
  return await discountModel.findOne(filter).lean();
};

module.exports = {
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
  updateDiscountById,
  checkDiscountIsExists,
};
