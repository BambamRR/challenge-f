const { Product } = require("../database/models");

class ProductService {
  async createProduct(dto) {
    const { name, description, price, stock } = dto;
    if (!name || !price || !stock || !description) {
      throw new Error("Missing required fields: name, description, price or stock");
    }
    const product = await Product.create({
      name,
      description,
      price,
      stock,
    });

    return product
  }
}

module.exports = ProductService;
