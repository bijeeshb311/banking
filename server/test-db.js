const sequelize = require("./config/database");

async function testDatabase() {
  try {
    await sequelize.authenticate();

    console.log("=================================");
    console.log("Database connected successfully!");
    console.log("Database: banking");
    console.log("=================================");
  } catch (error) {
    console.error("=================================");
    console.error("Database connection failed!");
    console.error(error.message);
    console.error("=================================");
  } finally {
    await sequelize.close();
  }
}

testDatabase();