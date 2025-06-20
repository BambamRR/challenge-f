"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("coupons", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      type: {
        type: Sequelize.ENUM("percent", "fixed"),
        allowNull: false,
      },
      value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      one_shot: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      max_uses: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      uses_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      valid_from: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      valid_until: {
        type: Sequelize.DATE,
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

    await queryInterface.addConstraint('coupons', {
      fields: ['code'],
      type: 'check',
      name: 'coupons_code_normilized',
      where: Sequelize.literal("code = lower(code) AND code ~ '^[a-z0-9]+'"),
    })

    await queryInterface.addConstraint('coupons', {
      fields: ['value', 'type'],
      type: 'check',
      name: 'coupons_value_percent_type',
      where: Sequelize.literal("(type = 'percent' AND value BETWEEN 1 AND 80) OR (type = 'fixed' AND value > 0)")
    })

    await queryInterface.addConstraint('coupons', {
      fields: ['uses_count'],
      type: 'check',
      name: 'coupons_uses_count_non_negative',
      where: Sequelize.literal("uses_count >= 0")
    })

    await queryInterface.addConstraint('coupons', {
      fields: ['valid_from', 'valid_until'],
      type: 'check',
      name: 'coupons_valid_until_max_5_years',
      where: Sequelize.literal("valid_until <= valid_from + interval '5 years'")
    })

    await queryInterface.addConstraint('coupons', {
      fields: ['one_shot', 'max_uses'],
      type: 'check',
      name: 'coupons_one_shot_max_uses',
      where: Sequelize.literal("(one_shot = true AND max_uses IS NULL) OR (one_shot = false AND max_uses >=1)")
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('coupons')
    await queryInterface.sequelize.query("DROP TYPE IF EXISTS \"enum_coupons_type\";")
  },
};
