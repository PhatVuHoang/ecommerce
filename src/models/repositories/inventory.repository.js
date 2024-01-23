const { convertToObjectIdMongodb } = require("../../utils");
const inventoryModel = require("../inventory.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknow",
}) => {
  return await inventoryModel.create({
    inventoryProductId: productId,
    inventoryShopId: shopId,
    inventoryLocation: location,
    inventoryStock: stock,
  });
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
    inventoryProductId: convertToObjectIdMongodb(productId),
    inventoryStock: { $gte: quantity },
  };
  const updateSet = {
    $inc: {
      inventoryStock: -quantity,
    },
    $push: {
      inventoryReservation: {
        quantity,
        cartId,
        createdAt: new Date(),
      },
    },
  };
  const options = {
    upsert: true,
    new: true,
  };

  return await inventoryModel.updateOne(query, updateSet, options);
};

module.exports = {
  insertInventory,
  reservationInventory,
};
