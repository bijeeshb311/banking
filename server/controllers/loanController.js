const Loan = require("../models/Loan");

// ========================================
// Apply for Loan
// ========================================

const applyForLoan = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      loanType,
      amount,
      interestRate,
      tenureMonths,
      reason,
    } = req.body;

    // Validate required fields
    if (
      !loanType ||
      !amount ||
      !interestRate ||
      !tenureMonths
    ) {
      return res.status(400).json({
        message:
          "Loan type, amount, interest rate and tenure are required",
      });
    }

    // Validate loan type
    const allowedLoanTypes = [
      "personal",
      "home",
      "education",
      "vehicle",
    ];

    if (!allowedLoanTypes.includes(loanType)) {
      return res.status(400).json({
        message:
          "Invalid loan type. Use personal, home, education or vehicle",
      });
    }

    const loanAmount = Number(amount);
    const rate = Number(interestRate);
    const tenure = Number(tenureMonths);

    // Validate numbers
    if (
      isNaN(loanAmount) ||
      loanAmount <= 0
    ) {
      return res.status(400).json({
        message: "Loan amount must be greater than 0",
      });
    }

    if (
      isNaN(rate) ||
      rate <= 0
    ) {
      return res.status(400).json({
        message: "Interest rate must be greater than 0",
      });
    }

    if (
      isNaN(tenure) ||
      tenure <= 0
    ) {
      return res.status(400).json({
        message: "Tenure must be greater than 0",
      });
    }

    // Create loan
    const loan = await Loan.create({
      userId,
      loanType,
      amount: loanAmount,
      interestRate: rate,
      tenureMonths: tenure,
      status: "pending",
      reason: reason || null,
    });

    res.status(201).json({
      message: "Loan application submitted successfully",

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
    console.error("Loan application error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ========================================
// Get My Loans
// ========================================

const getMyLoans = async (req, res) => {
  try {
    const userId = req.user.id;

    const loans = await Loan.findAll({
      where: {
        userId,
      },

      order: [
        ["createdAt", "DESC"],
      ],

      attributes: [
        "id",
        "loanType",
        "amount",
        "interestRate",
        "tenureMonths",
        "status",
        "reason",
        "createdAt",
      ],
    });

    res.status(200).json({
      message: "Loans retrieved successfully",
      loans,
    });
  } catch (error) {
    console.error("Get loans error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  applyForLoan,
  getMyLoans,
};