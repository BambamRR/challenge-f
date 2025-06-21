module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING(300),
      price: DataTypes.DECIMAL(10, 2),
      stock: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE,
    },
    {
      tableName: "products",
      timestamps: true,
      paranoid: true,
      underscored: true,
    }
  );
  Product.associate = (models) => {
    Product.hasMany(models.ProductCouponApplication, {
      foreignKey: "product_id",
    });
  };
  return Product;
};
