const ProductService = require("../services/ProductService");
const productService = new ProductService();

class ProductController {
  static async createProduct(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400).send({ message: "Request body is missing." });
      }
      const product = await productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async findProductById(req, res) {
    try {
      const product = await productService.findProductById(req.params);
      res.status(200).json(product);
    } catch (error) {
      if (error.status === 404) {
        res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  static async findAllProducts(req, res) {
    try {
      const product = await productService.findAllProducts(req.query);
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async deleteProduct(req, res) {
    try {
      const product = await productService.deleteProduct(req.params);
      res.status(200).json(product);
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
  static async patchProduct(req, res) {
    try {
      const id = req.params.id;
      const patch = req.body;

      if (!Array.isArray(patch)) {
        return res.status(400).json({ message: "Invalid patch format" });
      }

      const product = await productService.patchProduct(id, patch);
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = ProductController;
