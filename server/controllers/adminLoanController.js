const Loan = require("../models/Loan");
const User = require("../models/User");

// ========================================
// Get All Loan Applications
// ========================================

const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      include: [
        {
          model: User,
          attributes: [
            "id",
            "name",
            "email",
          ],
        },
      ],

      order: [
        ["createdAt", "DESC"],
      ],
    });

    res.status(200).json({
      message: "All loans retrieved successfully",
      loans,
    });
  } catch (error) {
    console.error(
      "Get all loans error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ========================================
// Approve Loan
// ========================================

const approveLoan = async (req, res) => {
  try {
    const { id } = req.params;

    const loan = await Loan.findByPk(id);

    if (!loan) {
      return res.status(404).json({
        message: "Loan not found",
      });
    }

    if (loan.status !== "pending") {
      return res.status(400).json({
        message:
          "Only pending loans can be approved",
      });
    }

    loan.status = "approved";

    await loan.save();

    res.status(200).json({
      message: "Loan approved successfully",

      loan: {
        id: loan.id,
        loanType: loan.loanType,
        amount: loan.amount,
        interestRate: loan.interestRate,
        tenureMonths: loan.tenureMonths,
        status: loan.status,
        reason: loan.reason,
      },
    });
  } catch (error) {
    console.error(
      "Approve loan error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ========================================
// Reject Loan
// ========================================

const rejectLoan = async (req, res) => {
  try {
    const { id } = req.params;

    const loan = await Loan.findByPk(id);

    if (!loan) {
      return res.status(404).json({
        message: "Loan not found",
      });
    }

    if (loan.status !== "pending") {
      return res.status(400).json({
        message:
          "Only pending loans can be rejected",
      });
    }

    loan.status = "rejected";

    await loan.save();

    res.status(200).json({
      message: "Loan rejected successfully",

      loan: {
        id: loan.id,
        loanType: loan.loanType,
        amount: loan.amount,
        interestRate: loan.interestRate,
        tenureMonths: loan.tenureMonths,
        status: loan.status,
        reason: loan.reason,
      },
    });
  } catch (error) {
    console.error(
      "Reject loan error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllLoans,
  approveLoan,
  rejectLoan,
};