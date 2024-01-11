"use strict";

const { BadRequestError } = require("../core/error.response");
const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const {
  findAllDraftForShop,
  publishProductByShop,
  unPublishProductByShop,
  findAllPublishForShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repository");
const { updateNestedObject, removeUndefinedObject } = require("../utils");

class ProductFactory {
  static productRegistry = {}; // key - class
  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError(`Invalid Product Type: ${type}`);
    }
    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError(`Invalid Product Type: ${type}`);
    }
    return new productClass(payload).updateProduct(productId);
  }

  static async findAllDraftForShop({ productShop, limit = 50, page = 1 }) {
    const query = { productShop, isDraft: true };
    return await findAllDraftForShop({ query, page, limit });
  }

  static async publishProductByShop({ productShop, productId }) {
    return await publishProductByShop({ productShop, productId });
  }

  static async unPublishProductByShop({ productShop, productId }) {
    return await unPublishProductByShop({ productShop, productId });
  }

  static async findAllPublishForShop({ productShop, limit = 50, page = 1 }) {
    const query = { productShop, isPublish: true };
    return await findAllPublishForShop({ query, page, limit });
  }

  static async getListSearchProducts({ keySearch, limit = 50, page = 1 }) {
    return await searchProductByUser({ keySearch, limit, page });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublish: true },
  }) {
    return await findAllProducts({
      filter,
      limit,
      page,
      sort,
      select: ["productName", "productPrice", "productThumb"],
    });
  }

  static async findProduct({ productId }) {
    return await findProduct({
      productId,
      unSelect: ["__v"],
    });
  }
}

class Product {
  constructor({
    productName,
    productThumb,
    productDescription,
    productPrice,
    productQuantity,
    productType,
    productShop,
    productAttributes,
  }) {
    this.productName = productName;
    this.productThumb = productThumb;
    this.productDescription = productDescription;
    this.productPrice = productPrice;
    this.productQuantity = productQuantity;
    this.productType = productType;
    this.productShop = productShop;
    this.productAttributes = productAttributes;
  }

  async createProduct(productId) {
    return await product.create({ ...this, _id: productId });
  }

  async updateProduct(productId, payload) {
    return await updateProductById({ productId, payload, model: product });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.productAttributes,
      productShop: this.productShop,
    });
    if (!newClothing) {
      throw new BadRequestError("Create new clothing error");
    }

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      throw new BadRequestError("Create new product error");
    }

    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = removeUndefinedObject(updateNestedObject(this));
    if (objectParams.productAttributes) {
      await updateProductById({
        productId,
        payload: objectParams,
        model: clothing,
      });
    }
    const updateProduct = await super.updateProduct(productId, objectParams);
    return updateProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.productAttributes,
      productShop: this.productShop,
    });
    if (!newElectronic) {
      throw new BadRequestError("Create new electronic error");
    }

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError("Create new product error");
    }

    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = removeUndefinedObject(updateNestedObject(this));
    if (objectParams.productAttributes) {
      await updateProductById({
        productId,
        payload: objectParams,
        model: electronic,
      });
    }
    const updateProduct = await super.updateProduct(productId, objectParams);
    return updateProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.productAttributes,
      productShop: this.productShop,
    });
    if (!newFurniture) {
      throw new BadRequestError("Create new electronic error");
    }

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) {
      throw new BadRequestError("Create new product error");
    }

    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = removeUndefinedObject(updateNestedObject(this));
    if (objectParams.productAttributes) {
      await updateProductById({
        productId,
        payload: objectParams,
        model: furniture,
      });
    }
    const updateProduct = await super.updateProduct(productId, objectParams);
    return updateProduct;
  }
}

// register product types
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
