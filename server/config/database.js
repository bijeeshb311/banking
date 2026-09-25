const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "banking",       // Database name
  "postgres",      // PostgreSQL username
  "YOUR_PASSWORD", // PostgreSQL password
  {
    host: "localhost",
    port: 5432,
    dialect: "postgres",
    logging: false,
  }
);

module.exports = sequelize;