const ProductService = require("../services/product.service");
const { Created } = require("../core/success.response");

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
}

module.exports = new ProductController();
