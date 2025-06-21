const { Op } = require("sequelize");
const { Product, ProductCouponApplication } = require("../database/models");

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

    return product;
  }
  //generic service to use in another functions
  async _getProducts(query = {}) {
    const {
      id,
      page = 1,
      limit = 10,
      search,
      minPrice,
      maxPrice,
      hasDiscount = false,
      includeDeleted = false,
      onlyOutOfStock = false,
      withCouponApplied = false,
      sortBy = "name",
      sortOrder = "asc",
    } = query;

    console.log("ID AQUI : ", id)

    const filters = {
      page: +page,
      limit: +limit,
      search: search || null,
      minPrice: minPrice ? +minPrice : null,
      maxPrice: maxPrice ? +maxPrice : null,
      hasDiscount: hasDiscount === "true" || hasDiscount === true,
      includeDeleted: includeDeleted === "true" || includeDeleted === true,
      onlyOutOfStock: onlyOutOfStock === "true" || onlyOutOfStock === true,
      withCouponApplied: withCouponApplied === "true" || withCouponApplied === true,
      sortBy,
      sortOrder: sortOrder.toLowerCase() === "desc" ? "desc" : "asc",
    };
    //building where object with query informations
    const where = {};
    if (id) where.id = id;

    if (filters.search) {
      where.name = { [Op.iLike]: `%${filters.search}%` };
    }
    if (filters.minPrice != null || filters.maxPrice != null) {
      where.price = {};
      if (filters.minPrice != null) where.price[Op.gte] = filters.minPrice;
      if (filters.maxPrice != null) where.price[Op.lte] = filters.maxPrice;
    }

    if (filters.onlyOutOfStock) {
      where.stock = 0;
    }
    //building include option to insert JOIN in function
    const include = [];
    if (filters.hasDiscount || filters.withCouponApplied) {
      include.push({
        model: ProductCouponApplication,
        required: filters.hasDiscount || filters.withCouponApplied,
        where: { removed_at: null },
        include: [{ model: withCouponApplied, required: true }],
      });
    }

    const offset = (filters.page - 1) * filters.limit;

    const result = await Product.findAndCountAll({
      where,
      include,
      paranoid: !filters.includeDeleted,
      limit: filters.limit,
      offset,
      order: [[filters.sortBy, filters.sortOrder.toUpperCase()]],
    });

    if (!query || result.lentgh === 0) {
      throw new Error("No data with these parameters");
    }

    return result;
  }

  async findProductById(id) {
    return this._getProducts(id)
  }
}

module.exports = ProductService;
