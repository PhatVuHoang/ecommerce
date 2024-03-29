"use strict";

const { Types } = require("mongoose");
const { product } = require("../product.model");
const { getSelectData, getUnSelectData } = require("../../utils");

const findAllDraftForShop = async ({ query, limit, page }) => {
  return await queryProduct({ query, limit, page });
};

const publishProductByShop = async ({ productShop, productId }) => {
  const foundShop = await product.findOne({
    productShop: new Types.ObjectId(productShop),
    _id: new Types.ObjectId(productId),
  });

  if (!foundShop) {
    return null;
  }

  foundShop.isDraft = false;
  foundShop.isPublish = true;

  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const unPublishProductByShop = async ({ productShop, productId }) => {
  const foundShop = await product.findOne({
    productShop: new Types.ObjectId(productShop),
    _id: new Types.ObjectId(productId),
  });

  if (!foundShop) {
    return null;
  }

  foundShop.isDraft = true;
  foundShop.isPublish = false;

  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const findAllPublishForShop = async ({ query, limit, page }) => {
  return await queryProduct({ query, limit, page });
};

const queryProduct = async ({ query, limit, page }) => {
  const skip = (page - 1) * limit;
  return await product
    .find(query)
    .populate("productShop", "name email -_id")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(["__v"]))
    .lean();
};

const searchProductByUser = async ({ keySearch, page, limit }) => {
  const skip = (page - 1) * limit;
  const regexSearch = new RegExp(keySearch);
  const result = await product
    .find(
      {
        isPublish: true,
        $text: {
          $search: regexSearch,
        },
      },
      {
        score: {
          $meta: "textScore",
        },
      }
    )
    .sort({
      score: {
        $meta: "textScore",
      },
    })
    .skip(skip)
    .select(getUnSelectData(["__v"]))
    .lean();
  return result;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return products;
};

const findProduct = async ({ productId, unSelect }) => {
  return await product.findById(productId).select(getUnSelectData(unSelect));
};

const updateProductById = async ({
  productId,
  payload,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(productId, payload, {
    new: isNew,
  });
};

module.exports = {
  findAllDraftForShop,
  publishProductByShop,
  unPublishProductByShop,
  findAllPublishForShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
};
