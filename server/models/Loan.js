const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Loan = sequelize.define(
  "Loan",
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

    loanType: {
      type: DataTypes.ENUM(
        "personal",
        "home",
        "education",
        "vehicle"
      ),
      allowNull: false,
    },

    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    interestRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },

    tenureMonths: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "approved",
        "rejected",
        "completed"
      ),
      defaultValue: "pending",
      allowNull: false,
    },

    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "loans",
    timestamps: true,
  }
);

// User → Loan relationship

User.hasMany(Loan, {
  foreignKey: "userId",
});

Loan.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = Loan;