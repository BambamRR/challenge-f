require('dotenv').config()
module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password:  process.env.DB_PASSWORD,
    database:  process.env.DB_NAME,
    host:  process.env.DB_HOST,
    dialect:  'postgres',
    logging: console.log 
  },
  test: {
    username: process.env.DB_USERNAME,
    password:  process.env.DB_PASSWORD,
    database:  process.env.DB_NAME,
    host:  process.env.DB_HOST_TEST,
    dialect:  'postgres'
  },
  production: {
    username: process.env.DB_USERNAME,
    password:  process.env.DB_PASSWORD,
    database:  process.env.DB_NAME,
    host:  process.env.DB_HOST_PROD,
    dialect:  'postgres'
  }
}
