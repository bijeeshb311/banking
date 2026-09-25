const Transaction = require("../models/Transaction");
const Account = require("../models/Account");
const sequelize = require("../config/database");

// ========================================
// Deposit Money
// ========================================

const depositMoney = async (req, res) => {
  try {
    const userId = req.user.id;

    const { accountNumber, amount } = req.body;

    if (!accountNumber || !amount) {
      return res.status(400).json({
        message: "Account number and amount are required",
      });
    }

    const depositAmount = Number(amount);

    if (isNaN(depositAmount) || depositAmount <= 0) {
      return res.status(400).json({
        message: "Deposit amount must be greater than 0",
      });
    }

    const account = await Account.findOne({
      where: {
        accountNumber,
        userId,
      },
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    if (account.status !== "active") {
      return res.status(400).json({
        message: "Account is not active",
      });
    }

    const currentBalance = Number(account.balance);
    const newBalance = currentBalance + depositAmount;

    account.balance = newBalance;

    await account.save();

    const transaction = await Transaction.create({
      userId,
      accountId: account.id,
      type: "deposit",
      amount: depositAmount,
      description: "Money deposited into account",
    });

    res.status(201).json({
      message: "Money deposited successfully",

      transaction: {
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
      },

      account: {
        accountNumber: account.accountNumber,
        balance: account.balance,
        status: account.status,
      },
    });
  } catch (error) {
    console.error("Deposit error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ========================================
// Withdraw Money
// ========================================

const withdrawMoney = async (req, res) => {
  try {
    const userId = req.user.id;

    const { accountNumber, amount } = req.body;

    if (!accountNumber || !amount) {
      return res.status(400).json({
        message: "Account number and amount are required",
      });
    }

    const withdrawAmount = Number(amount);

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      return res.status(400).json({
        message: "Withdrawal amount must be greater than 0",
      });
    }

    const account = await Account.findOne({
      where: {
        accountNumber,
        userId,
      },
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    if (account.status !== "active") {
      return res.status(400).json({
        message: "Account is not active",
      });
    }

    const currentBalance = Number(account.balance);

    if (withdrawAmount > currentBalance) {
      return res.status(400).json({
        message: "Insufficient balance",
        currentBalance,
      });
    }

    const newBalance = currentBalance - withdrawAmount;

    account.balance = newBalance;

    await account.save();

    const transaction = await Transaction.create({
      userId,
      accountId: account.id,
      type: "withdraw",
      amount: withdrawAmount,
      description: "Money withdrawn from account",
    });

    res.status(201).json({
      message: "Money withdrawn successfully",

      transaction: {
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
      },

      account: {
        accountNumber: account.accountNumber,
        balance: account.balance,
        status: account.status,
      },
    });
  } catch (error) {
    console.error("Withdrawal error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ========================================
// Transfer Money
// ========================================

const transferMoney = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;

    const {
      fromAccountNumber,
      toAccountNumber,
      amount,
    } = req.body;

    // Check required fields
    if (!fromAccountNumber || !toAccountNumber || !amount) {
      await transaction.rollback();

      return res.status(400).json({
        message:
          "From account number, to account number and amount are required",
      });
    }

    // Check same account
    if (fromAccountNumber === toAccountNumber) {
      await transaction.rollback();

      return res.status(400).json({
        message: "Cannot transfer money to the same account",
      });
    }

    const transferAmount = Number(amount);

    // Check amount
    if (isNaN(transferAmount) || transferAmount <= 0) {
      await transaction.rollback();

      return res.status(400).json({
        message: "Transfer amount must be greater than 0",
      });
    }

    // Find sender account
    const fromAccount = await Account.findOne({
      where: {
        accountNumber: fromAccountNumber,
        userId,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!fromAccount) {
      await transaction.rollback();

      return res.status(404).json({
        message: "Sender account not found",
      });
    }

    // Check sender account status
    if (fromAccount.status !== "active") {
      await transaction.rollback();

      return res.status(400).json({
        message: "Sender account is not active",
      });
    }

    // Check sender balance
    const senderBalance = Number(fromAccount.balance);

    if (transferAmount > senderBalance) {
      await transaction.rollback();

      return res.status(400).json({
        message: "Insufficient balance",
        currentBalance: senderBalance,
      });
    }

    // Find receiver account
    const toAccount = await Account.findOne({
      where: {
        accountNumber: toAccountNumber,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!toAccount) {
      await transaction.rollback();

      return res.status(404).json({
        message: "Receiver account not found",
      });
    }

    // Check receiver status
    if (toAccount.status !== "active") {
      await transaction.rollback();

      return res.status(400).json({
        message: "Receiver account is not active",
      });
    }

    // Calculate new balances
    const newSenderBalance =
      senderBalance - transferAmount;

    const receiverBalance = Number(toAccount.balance);

    const newReceiverBalance =
      receiverBalance + transferAmount;

    // Update sender
    fromAccount.balance = newSenderBalance;

    await fromAccount.save({
      transaction,
    });

    // Update receiver
    toAccount.balance = newReceiverBalance;

    await toAccount.save({
      transaction,
    });

    // Create sender transaction
    const senderTransaction = await Transaction.create(
      {
        userId,
        accountId: fromAccount.id,
        type: "transfer",
        amount: transferAmount,
        description:
          `Transfer to account ${toAccount.accountNumber}`,
      },
      {
        transaction,
      }
    );

    // Create receiver transaction
    const receiverTransaction = await Transaction.create(
      {
        userId: toAccount.userId,
        accountId: toAccount.id,
        type: "transfer",
        amount: transferAmount,
        description:
          `Transfer received from account ${fromAccount.accountNumber}`,
      },
      {
        transaction,
      }
    );

    // Commit database transaction
    await transaction.commit();

    res.status(201).json({
      message: "Money transferred successfully",

      transfer: {
        transactionId: senderTransaction.id,
        amount: transferAmount,
        fromAccount: fromAccount.accountNumber,
        toAccount: toAccount.accountNumber,
      },

      senderAccount: {
        accountNumber: fromAccount.accountNumber,
        balance: fromAccount.balance,
      },

      receiverAccount: {
        accountNumber: toAccount.accountNumber,
        balance: toAccount.balance,
      },
    });
  } catch (error) {
    await transaction.rollback();

    console.error("Transfer error:", error);

    res.status(500).json({
      message: "Transfer failed",
      error: error.message,
    });
  }
};

// ========================================
// Get Transaction History
// ========================================

const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await Transaction.findAll({
      where: {
        userId,
      },

      order: [
        ["createdAt", "DESC"],
      ],

      attributes: [
        "id",
        "accountId",
        "type",
        "amount",
        "description",
        "createdAt",
      ],
    });

    res.status(200).json({
      message: "Transaction history retrieved successfully",
      transactions,
    });
  } catch (error) {
    console.error("Transaction history error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  depositMoney,
  withdrawMoney,
  transferMoney,
  getTransactionHistory,
};