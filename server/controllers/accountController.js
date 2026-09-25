const Account = require("../models/Account");
const User = require("../models/User");

// Create Bank Account
const createAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate account number
    const accountNumber =
      Date.now().toString() +
      Math.floor(100 + Math.random() * 900).toString();

    // Create account
    const account = await Account.create({
      userId,
      accountNumber,
      accountType: "savings",
      balance: 0.0,
      status: "active",
    });

    res.status(201).json({
      message: "Bank account created successfully",
      account: {
        id: account.id,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        balance: account.balance,
        status: account.status,
      },
    });
  } catch (error) {
    console.error("Account creation error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get My Account
const getMyAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const accounts = await Account.findAll({
      where: {
        userId,
      },
      attributes: [
        "id",
        "accountNumber",
        "accountType",
        "balance",
        "status",
        "createdAt",
      ],
    });

    res.status(200).json({
      message: "Accounts retrieved successfully",
      accounts,
    });
  } catch (error) {
    console.error("Get account error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createAccount,
  getMyAccount,
};