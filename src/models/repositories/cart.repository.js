const { NotFoundError } = require("../../core/error.response");
const cartModel = require("../cart.model");
const { getProductById } = require("./product.repository");

const createUserCart = async ({ userId, product }) => {
  const query = { cart_userId: userId, cart_state: "active" };
  const foundProduct = await getProductById(product.productId);
  if (!foundProduct) {
    throw new NotFoundError("product is not found");
  }
  const updateOrInsert = {
    $addToSet: {
      cart_products: {
        ...product,
        name: foundProduct.productName,
        price: foundProduct.productPrice,
      },
    },
  };
  const options = {
    upsert: true,
    new: true,
  };

  return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
};

const updateUserCartQuantity = async ({ userId, product }) => {
  const { productId, quantity } = product;
  const query = {
    cart_userId: userId,
    "cart_products.productId": productId,
    cart_state: "active",
  };
  const updateSet = {
    $inc: {
      "cart_products.$.quantity": quantity,
    },
  };
  const options = {
    upsert: true,
    new: true,
  };

  return await cartModel.findOneAndUpdate(query, updateSet, options);
};

module.exports = {
  createUserCart,
  updateUserCartQuantity,
};
