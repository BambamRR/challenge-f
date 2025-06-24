const ProductService = require("../services/ProductService");
const productService = new ProductService();

class ProductController {
  static async createProduct(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400).send({ message: "Request body is missing." });
      }
      const product = await productService.createProduct(req.body);
      res.status(201).send(product);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  static async findProductById(req, res) {
    try {
      const product = await productService.findProductById(req.params);
      res.status(200).send(product);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  static async findAllProducts(req, res) {
    try {
      const product = await productService.findAllProducts(req.query);
      res.status(200).send(product);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
  static async deleteProduct(req, res) {
    try {
      const product = await productService.deleteProduct(req.params);
      res.status(200).send(product);
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).send({ message: error.message });
      }
      res.status(500).send({ message: error.message });
    }
  }
}

module.exports = ProductController;
