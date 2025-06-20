"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("products", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        onUpdate: "CURRENT_TIMESTAMP",
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
        onUpdate: "CURRENT_TIMESTAMP",
      },
    });

    await queryInterface.addConstraint("products", {
      fields: ["price"],
      type: "check",
      name: "products_price_minimum",
      where: {
        price: {
          [Sequelize.Op.gte]: 0.01,
        },
      },
    });

    await queryInterface.addConstraint("products", {
      fields: ["stock"],
      type: "check",
      name: "products_stock_range",
      where: Sequelize.literal('stock BETWEEN 0 AND 999999'),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("products");
  },
};
