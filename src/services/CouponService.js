const { Op } = require("sequelize");
const { Coupon } = require("../database/models");

class CouponService {
  async createCoupon(dto) {
    let { code, type, value, oneShot, valid_from, valid_until } = dto;

    if (typeof code !== "string") {
      const error = new Error("Field 'code' must be a string");
      error.status = 400;
      throw error;
    }
    if (/\s/.test(code)) {
      const error = new Error("Field 'code' must not contain spaces");
      error.status = 400;
      throw error;
    }
    if (code.length < 4 || code.length > 20) {
      const error = new Error("Field 'code' length must be 4–20 chars");
      error.status = 400;
      throw error;
    }
    if (!/^[a-z0-9]+$/.test(code)) {
      const error = new Error("Field 'code' must be alphanumeric only");
      error.status = 400;
      throw error;
    }
    const reserved = ["admin", "auth", "null", "undefined"];
    if (reserved.includes(code)) {
      const error = new Error(`Code '${code}' is reserved`);
      error.status = 400;
      throw error;
    }
    const exists = await Coupon.findOne({ where: { code } });
    if (exists) {
      const error = new Error(`Coupon '${code}' already exists`);
      error.status = 409;
      throw error;
    }

    if (type !== "percent" && type !== "fixed") {
      const error = new Error("Field 'type' must be 'percent' or 'fixed'");
      error.status = 400;
      throw error;
    }
    if (typeof value !== "number" || isNaN(value)) {
      const error = new Error("Field 'value' must be a number");
      error.status = 400;
      throw error;
    }
    if (type === "percent") {
      if (value < 1 || value > 80) {
        const error = new Error("Percent value must be between 1 and 80");
        error.status = 400;
        throw error;
      }
    } else {
      // fixed
      if (value <= 0) {
        const error = new Error("Fixed value must be positive");
        error.status = 400;
        throw error;
      }
    }
    if (typeof oneShot !== "boolean") {
      const error = new Error("Field 'oneShot' must be boolean");
      error.status = 400;
      throw error;
    }
    const from = new Date(valid_from);
    const until = new Date(valid_until);
    if (isNaN(from) || isNaN(until)) {
      const error = new Error("Fields 'valid_from' and 'valid_until' must be valid ISO dates");
      error.status = 400;
      throw error;
    }
    if (until <= from) {
      const error = new Error("'valid_until' must be after 'valid_from'");
      error.status = 400;
      throw error;
    }
    const maxUntil = new Date(from);
    maxUntil.setFullYear(maxUntil.getFullYear() + 5);
    if (until > maxUntil) {
      const error = new Error("Validity cannot exceed 5 years from 'valid_from'");
      error.status = 400;
      throw error;
    }
    const now = new Date();
    if (from > now) {
      const error = new Error("'valid_from' cannot be in the future");
      error.status = 400;
      throw error;
    }
    const coupon = await Coupon.create({
      code,
      type,
      value,
      one_shot: oneShot,
      max_uses: oneShot ? null : dto.max_uses || null,
      uses_count: 0,
      valid_from: from,
      valid_until: until,
    });

    return coupon;
  }

  async _getAllCoupons(query = {}) {
    const { id, page = 1, limit = 10, search, type, onlyActive = false, sortBy = "code", sortOrder = "asc" } = query;

    const filters = {
      page: +page,
      limit: +limit,
      search: search?.trim().toLowerCase() || null,
      type: type === "fixed" || type === "percent" ? type : null,
      onlyActive: onlyActive === "true" || onlyActive === true,
      sortBy,
      sortOrder: sortOrder.toLowerCase() === "desc" ? "desc" : "asc",
    };

    const where = {};
    if (id) where.id = id;

    if (filters.search) {
      where.code = { [Op.iLike]: `%${filters.search}%` };
    }
    if (filters.type) {
      where.type = filters.type;
    }
    if (filters.onlyActive) {
      const now = new Date();
      where.valid_from = { [Op.lte]: now };
      where.valid_until = { [Op.gte]: now };
    }

    const offset = (filters.page - 1) * filters.limit;
    const result = await Coupon.findAndCountAll({
      where,
      limit: filters.limit,
      offset,
      order: [[filters.sortBy, filters.sortOrder.toUpperCase()]],
    });

    const data = result.rows.map((c) => ({
      id: c.id,
      code: c.code,
      type: c.type,
      value: parseFloat(c.value),
      oneShot: c.one_shot,
      maxUses: c.max_uses,
      usesCount: c.uses_count,
      validFrom: c.valid_from,
      validUntil: c.valid_until,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
      deletedAt: c.deleted_at,
    }));

    return {
      data,
      meta: {
        page: filters.page,
        limit: filters.limit,
        totalItems: result.count,
        totalPages: Math.ceil(result.count / filters.limit),
      },
    };
  }

  async findAllCoupons(query) {
    return await this._getAllCoupons(query);
  }

  async findCouponById(query) {
    return await this._getAllCoupons(query);
  }

  async findCouponByCode(query) {
    return await this._getAllCoupons(query);
  }
}

module.exports = CouponService;
