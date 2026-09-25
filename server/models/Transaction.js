const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Account = require("./Account");

const Transaction = sequelize.define(
  "Transaction",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM("deposit", "withdraw", "transfer"),
      allowNull: false,
    },

    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "transactions",
    timestamps: true,
  }
);

// User has many transactions
User.hasMany(Transaction, {
  foreignKey: "userId",
});

// Transaction belongs to User
Transaction.belongsTo(User, {
  foreignKey: "userId",
});

// Account has many transactions
Account.hasMany(Transaction, {
  foreignKey: "accountId",
});

// Transaction belongs to Account
Transaction.belongsTo(Account, {
  foreignKey: "accountId",
});

module.exports = Transaction;