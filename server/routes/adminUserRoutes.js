const express = require("express");

const {
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
} = require("../controllers/adminUserController");

const authenticateToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ========================================
// Get All Users
// ========================================

router.get(
  "/all",
  authenticateToken,
  adminMiddleware,
  getAllUsers
);

// ========================================
// Get User By ID
// ========================================

router.get(
  "/:id",
  authenticateToken,
  adminMiddleware,
  getUserById
);

// ========================================
// Block User
// ========================================

router.put(
  "/block/:id",
  authenticateToken,
  adminMiddleware,
  blockUser
);

// ========================================
// Unblock User
// ========================================

router.put(
  "/unblock/:id",
  authenticateToken,
  adminMiddleware,
  unblockUser
);

module.exports = router;