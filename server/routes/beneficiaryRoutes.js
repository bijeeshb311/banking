const express = require("express");

const {
  addBeneficiary,
  getMyBeneficiaries,
  deleteBeneficiary,
} = require("../controllers/beneficiaryController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// Add Beneficiary
// ========================================

router.post(
  "/add",
  authenticateToken,
  addBeneficiary
);

// ========================================
// Get My Beneficiaries
// ========================================

router.get(
  "/my-beneficiaries",
  authenticateToken,
  getMyBeneficiaries
);

// ========================================
// Delete Beneficiary
// ========================================

router.delete(
  "/delete/:id",
  authenticateToken,
  deleteBeneficiary
);

module.exports = router;