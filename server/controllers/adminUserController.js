const User = require("../models/User");

// ========================================
// Get All Users
// ========================================

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "name",
        "email",
        "role",
        "status",
        "createdAt",
      ],

      order: [
        ["createdAt", "DESC"],
      ],
    });

    res.status(200).json({
      message: "All users retrieved successfully",
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ========================================
// Get User By ID
// ========================================

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: [
        "id",
        "name",
        "email",
        "role",
        "status",
        "createdAt",
      ],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ========================================
// Block User
// ========================================

const blockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        message: "Admin users cannot be blocked",
      });
    }

    if (user.status === "blocked") {
      return res.status(400).json({
        message: "User is already blocked",
      });
    }

    user.status = "blocked";

    await user.save();

    res.status(200).json({
      message: "User blocked successfully",

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Block user error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ========================================
// Unblock User
// ========================================

const unblockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.status === "active") {
      return res.status(400).json({
        message: "User is already active",
      });
    }

    user.status = "active";

    await user.save();

    res.status(200).json({
      message: "User unblocked successfully",

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Unblock user error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ========================================
// Export
// ========================================

module.exports = {
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
};