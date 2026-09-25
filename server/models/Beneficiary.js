const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Beneficiary = sequelize.define(
  "Beneficiary",
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

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    bankName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("active", "blocked"),
      defaultValue: "active",
      allowNull: false,
    },
  },
  {
    tableName: "beneficiaries",
    timestamps: true,
  }
);

// User → Beneficiary relationship

User.hasMany(Beneficiary, {
  foreignKey: "userId",
});

Beneficiary.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = Beneficiary;