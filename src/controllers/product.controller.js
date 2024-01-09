const ProductService = require("../services/product.service");
const { Created, OK } = require("../core/success.response");

class ProductController {
  createProduct = async (req, res, next) => {
    const { product_type } = req.body;
    new Created({
      message: "Create product success",
      metadata: await ProductService.createProduct(product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    new OK({
      message: "update product success",
      metadata: await ProductService.updateProduct(
        req.body.product_type,
        req.params.id,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  };

  publishProduct = async (req, res, next) => {
    new OK({
      message: "Publish product success",
      metadata: await ProductService.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  unPublishProduct = async (req, res, next) => {
    new OK({
      message: "Unpublish product success",
      metadata: await ProductService.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  searchProducts = async (req, res, next) => {
    const result = await ProductService.getListSearchProducts({
      keySearch: req.query.keySearch,
    });
    new OK({
      message: "Get list products success",
      metadata: result,
      options: {
        total: result.length,
      },
    }).send(res);
  };

  /**
   * @desc Get all drafts product for shop
   * @param { Number } limit
   * @param { Number } skip
   * @return { JSON }
   */
  getAllDraftsForShop = async (req, res, next) => {
    const result = await ProductService.findAllDraftForShop({
      ...req.query,
      product_shop: req.user.userId,
    });
    new OK({
      message: "Get list success",
      metadata: result,
      options: {
        total: result.length,
      },
    }).send(res);
  };

  /**
   * @desc Get all drafts product for shop
   * @param { Number } limit
   * @param { Number } skip
   * @return { JSON }
   */
  getAllPublishForShop = async (req, res, next) => {
    const result = await ProductService.findAllPublishForShop({
      ...req.query,
      product_shop: req.user.userId,
    });
    new OK({
      message: "Get list success",
      metadata: result,
      options: {
        total: result.length,
      },
    }).send(res);
  };

  getAllProducts = async (req, res, next) => {
    const result = await ProductService.findAllProducts(req.query);
    new OK({
      message: "Get list products success",
      metadata: result,
      options: {
        total: result.length,
      },
    }).send(res);
  };

  getProduct = async (req, res, next) => {
    new OK({
      message: "Get product success",
      metadata: await ProductService.findProduct({
        product_id: req.params.id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
