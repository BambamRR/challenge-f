const { Sequelize } = require('sequelize')

const { DB_NAME, DB_HOST, DB_PASSWORD, DB_USERNAME, DB_DIALECT } = process.env

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'postgres',
})

try {
    sequelize.authenticate();
    console.log("Connection has been validated ")
} catch (error) {
    console.error(error)
}

module.exports = sequelize