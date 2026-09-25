const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Account = sequelize.define(
  "Account",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },

    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    accountType: {
      type: DataTypes.ENUM("savings", "current"),
      defaultValue: "savings",
      allowNull: false,
    },

    balance: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.0,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("active", "blocked", "closed"),
      defaultValue: "active",
      allowNull: false,
    },
  },
  {
    tableName: "accounts",
    timestamps: true,
  }
);

// User has many accounts
User.hasMany(Account, {
  foreignKey: "userId",
});

// Account belongs to User
Account.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = Account;