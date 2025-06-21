module.exports = (sequelize, DataTypes) => {
  const Coupon = sequelize.define(
    "Coupon",
    {
      code: DataTypes.STRING,
      type: DataTypes.ENUM("percent", "fixed"),
      value: DataTypes.DECIMAL(10, 2),
      one_shot: DataTypes.BOOLEAN,
      max_uses: DataTypes.INTEGER,
      uses_count: DataTypes.INTEGER,
      valid_from: DataTypes.DATE,
      valid_until: DataTypes.DATE,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE,
    },
    {
      tableName: "coupons",
      timestamps: true,
      paranoid: true,
      underscored: true,
    }
  );
  Coupon.associate = (models) => {
    Coupon.hasMany(models.ProductCouponApplication, {
      foreignKey: "coupon_id",
    });
  };
  return Coupon;
};
