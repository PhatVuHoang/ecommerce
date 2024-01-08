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
    new OK({
      message: "Get list products success",
      metadata: await ProductService.getListSearchProducts(req.query.keySearch),
    }).send(res);
  };

  /**
   * @desc Get all drafts product for shop
   * @param { Number } limit
   * @param { Number } skip
   * @return { JSON }
   */
  getAllDraftsForShop = async (req, res, next) => {
    new OK({
      message: "Get list success",
      metadata: await ProductService.findAllDraftForShop({
        ...req.params,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @desc Get all drafts product for shop
   * @param { Number } limit
   * @param { Number } skip
   * @return { JSON }
   */
  getAllPublishForShop = async (req, res, next) => {
    new OK({
      message: "Get list success",
      metadata: await ProductService.findAllPublishForShop({
        ...req.params,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
