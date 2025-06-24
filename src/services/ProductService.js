const { Op, Model } = require("sequelize");
const { Product, ProductCouponApplication, Coupon } = require("../database/models");

class ProductService {
  async createProduct(dto) {
    let { name, description, price, stock } = dto;
    if (!name || !price || !stock || !description) {
      throw new Error("Missing required fields: name, description, price or stock");
    }

    name = name?.trim().replace(/\s+/g, " ");
    if (!name) {
      throw new Error('Field "name" is required');
    }
    if (name.length < 3 || name.length > 100) {
      throw new Error('Field "name" must be between 3 and 100 characters');
    }
    if (!/^[a-zA-Z0-9\s\-_,.]+$/.test(name)) {
      throw new Error('Field "name" contains invalid characters');
    }
    //validation for unique name
    const exists = await Product.findOne({
      where: { name: { [Op.iLike]: name } }
    });
    if (exists) {
      throw new Error('A product with this name already exists');
    }

     if (description.length > 300) {
      throw new Error('Field "description" must be at most 300 characters');
    }
    //have a check in database with thi rule, see migration create-product
    stock = Number(stock);
    if (!Number.isInteger(stock) || stock < 0 || stock > 999999) {
      throw new Error('Field "stock" must be an integer between 0 and 999999');
    }

    if (typeof price === 'string') {
       price = price.replace(/\./g, '').replace(',', '.');
    }

    price = parseFloat(price);
    if (isNaN(price) || price < 0.01 || price > 1000000) {
      throw new Error('Field "price" must be between 0.01 and 1 000 000');
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

    console.log("ID AQUI : ", id);

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
        include: [{ model: Coupon, required: true }],
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
      distinct: true,
      subQuery: false,
    });

    if (!query || result.rows.length === 0) {
      throw new Error("No data with these parameters");
    }

    const data = result.rows.map((product) => {
      const applicated = product.ProductCouponApplication?.[0];
      const coupon = applicated?.Coupon;
      let finalPrice = parseFloat(product.price);
      let discount = null;

      if (coupon) {
        if (coupon.type === "percent") {
          finalPrice = finalPrice * (1 - coupon.value / 100);
        } else {
          finalPrice = finalPrice - parseFloat(coupon.value);
        }

        discount = {
          type: coupon.type,
          value: coupon.value,
          applied_at: applicated.applied_at,
        };
      }

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        stock: product.stock,
        is_out_of_stock: product.stock === 0,
        price: parseFloat(product.price),
        finalPrice: parseFloat(finalPrice.toFixed(2)),
        discount,
        hasCouponApplied: !!coupon,
        created_at: product.created_at,
        updated_at: product.updated_at,
      };
    });

    return {
      ...filters,
      data,
      meta: {
        page: filters.page,
        limit: filters.limit,
        totalItems: result.count,
        totalPages: Math.ceil(result.count / filters.limit),
      },
    };
  }

  async findProductById(query) {
    return await this._getProducts(query);
  }

  async findAllProducts(query) {
    return await this._getProducts(query);
  }
}

module.exports = ProductService;
