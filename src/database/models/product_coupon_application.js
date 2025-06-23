// src/database/models/product_coupon_application.js
module.exports = (sequelize, DataTypes) => {
  const ProductCouponApplication = sequelize.define(
    "ProductCouponApplication",
    {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      coupon_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      applied_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      removed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "product_coupon_applications",
      timestamps: false,
      underscored: true,
    }
  );

  ProductCouponApplication.associate = (models) => {
    ProductCouponApplication.belongsTo(models.Product, {
      foreignKey: "product_id",
    });

    ProductCouponApplication.belongsTo(models.Coupon, {
      foreignKey: "coupon_id",
    });
  };

  return ProductCouponApplication;
};
