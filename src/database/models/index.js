// src/database/models/index.js
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
// Aponte para o seu config.js, não config.json
const config = require('../config.js')[process.env.NODE_ENV || 'development'];

// Cria a instância Sequelize
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging || false,
    dialectOptions: config.dialectOptions || {},
  }
);

const db = {};

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file !== path.basename(__filename) &&
      file !== 'conn.js' &&
      file.endsWith('.js')
    );
  })
  .forEach(file => {
    const modelFactory = require(path.join(__dirname, file));
    if (typeof modelFactory === 'function') {
      const model = modelFactory(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    }
  });

Object.keys(db).forEach(modelName => {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

// Exporta a instância e modelos
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
