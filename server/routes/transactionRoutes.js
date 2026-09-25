const express = require("express");

const {
  depositMoney,
  withdrawMoney,
  transferMoney,
  getTransactionHistory,
} = require("../controllers/transactionController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// Deposit Money
// ========================================

router.post(
  "/deposit",
  authenticateToken,
  depositMoney
);

// ========================================
// Withdraw Money
// ========================================

router.post(
  "/withdraw",
  authenticateToken,
  withdrawMoney
);

// ========================================
// Transfer Money
// ========================================

router.post(
  "/transfer",
  authenticateToken,
  transferMoney
);

// ========================================
// Transaction History
// ========================================

router.get(
  "/history",
  authenticateToken,
  getTransactionHistory
);

module.exports = router;