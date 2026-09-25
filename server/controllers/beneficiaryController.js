const Beneficiary = require("../models/Beneficiary");
const Account = require("../models/Account");

// ========================================
// Add Beneficiary
// ========================================

const addBeneficiary = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      name,
      accountNumber,
      bankName,
    } = req.body;

    // Check required fields
    if (!name || !accountNumber || !bankName) {
      return res.status(400).json({
        message:
          "Name, account number and bank name are required",
      });
    }

    // Check whether account exists
    const account = await Account.findOne({
      where: {
        accountNumber,
      },
    });

    if (!account) {
      return res.status(404).json({
        message: "Bank account not found",
      });
    }

    // Prevent adding own account
    const ownAccount = await Account.findOne({
      where: {
        accountNumber,
        userId,
      },
    });

    if (ownAccount) {
      return res.status(400).json({
        message: "You cannot add your own account as beneficiary",
      });
    }

    // Check duplicate beneficiary
    const existingBeneficiary =
      await Beneficiary.findOne({
        where: {
          userId,
          accountNumber,
        },
      });

    if (existingBeneficiary) {
      return res.status(400).json({
        message: "Beneficiary already exists",
      });
    }

    // Create beneficiary
    const beneficiary = await Beneficiary.create({
      userId,
      name,
      accountNumber,
      bankName,
      status: "active",
    });

    res.status(201).json({
      message: "Beneficiary added successfully",

      beneficiary: {
        id: beneficiary.id,
        name: beneficiary.name,
        accountNumber: beneficiary.accountNumber,
        bankName: beneficiary.bankName,
        status: beneficiary.status,
      },
    });
  } catch (error) {
    console.error("Add beneficiary error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ========================================
// Get My Beneficiaries
// ========================================

const getMyBeneficiaries = async (req, res) => {
  try {
    const userId = req.user.id;

    const beneficiaries = await Beneficiary.findAll({
      where: {
        userId,
      },

      order: [
        ["createdAt", "DESC"],
      ],

      attributes: [
        "id",
        "name",
        "accountNumber",
        "bankName",
        "status",
        "createdAt",
      ],
    });

    res.status(200).json({
      message: "Beneficiaries retrieved successfully",
      beneficiaries,
    });
  } catch (error) {
    console.error(
      "Get beneficiaries error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ========================================
// Delete Beneficiary
// ========================================

const deleteBeneficiary = async (req, res) => {
  try {
    const userId = req.user.id;

    const { id } = req.params;

    const beneficiary = await Beneficiary.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!beneficiary) {
      return res.status(404).json({
        message: "Beneficiary not found",
      });
    }

    await beneficiary.destroy();

    res.status(200).json({
      message: "Beneficiary deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete beneficiary error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  addBeneficiary,
  getMyBeneficiaries,
  deleteBeneficiary,
};