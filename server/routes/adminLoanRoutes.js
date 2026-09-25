const express = require("express");

const {
  getAllLoans,
  approveLoan,
  rejectLoan,
} = require("../controllers/adminLoanController");

const authenticateToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ========================================
// Get All Loans
// ========================================

router.get(
  "/all",
  authenticateToken,
  adminMiddleware,
  getAllLoans
);

// ========================================
// Approve Loan
// ========================================

router.put(
  "/approve/:id",
  authenticateToken,
  adminMiddleware,
  approveLoan
);

router.put(
  "/reject/:id",
  authenticateToken,
  adminMiddleware,
  rejectLoan
);

module.exports = router;