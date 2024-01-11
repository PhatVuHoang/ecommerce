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

module.exports = {
  insertInventory,
};
