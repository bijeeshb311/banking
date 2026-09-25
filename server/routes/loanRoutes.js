const express = require("express");

const {
  applyForLoan,
  getMyLoans,
} = require("../controllers/loanController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// Apply for Loan
// ========================================

router.post(
  "/apply",
  authenticateToken,
  applyForLoan
);

// ========================================
// Get My Loans
// ========================================

router.get(
  "/my-loans",
  authenticateToken,
  getMyLoans
);

module.exports = router;