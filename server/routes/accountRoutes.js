const express = require("express");

const {
  createAccount,
  getMyAccount,
} = require("../controllers/accountController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Create bank account
router.post(
  "/create",
  authenticateToken,
  createAccount
);

// Get my accounts
router.get(
  "/my-account",
  authenticateToken,
  getMyAccount
);

module.exports = router;