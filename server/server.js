const express = require("express");
const cors = require("cors");

const sequelize = require("./config/database");

// ========================================
// Import Models
// ========================================

require("./models/User");
require("./models/Account");
require("./models/Transaction");
require("./models/Beneficiary");
require("./models/Loan");

// ========================================
// Import Routes
// ========================================

const userRoutes = require("./routes/userRoutes");
const accountRoutes = require("./routes/accountRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const beneficiaryRoutes = require("./routes/beneficiaryRoutes");
const loanRoutes = require("./routes/loanRoutes");
const adminLoanRoutes = require("./routes/adminLoanRoutes");

const authenticateToken = require("./middleware/authMiddleware");

const app = express();

const PORT = 3000;

// ========================================
// Middleware
// ========================================

app.use(cors());

app.use(express.json());

// ========================================
// Home Route
// ========================================

app.get("/", (req, res) => {
  res.json({
    message: "Banking Finance API is running",
  });
});

// ========================================
// User Routes
// ========================================

app.use("/api/users", userRoutes);

// ========================================
// Account Routes
// ========================================

app.use("/api/accounts", accountRoutes);

// ========================================
// Transaction Routes
// ========================================

app.use(
  "/api/transactions",
  transactionRoutes
);

// ========================================
// Beneficiary Routes
// ========================================

app.use(
  "/api/beneficiaries",
  beneficiaryRoutes
);

// ========================================
// Loan Routes
// ========================================

app.use(
  "/api/loans",
  loanRoutes
);

// ========================================
// Admin Loan Routes
// ========================================

app.use(
  "/api/admin/loans",
  adminLoanRoutes
);

// ========================================
// Protected Test Route
// ========================================

app.get(
  "/api/protected",
  authenticateToken,
  (req, res) => {
    res.json({
      message:
        "You successfully accessed a protected route!",
      user: req.user,
    });
  }
);

// ========================================
// Start Server
// ========================================

async function startServer() {
  try {
    await sequelize.authenticate();

    console.log(
      "Database connected successfully!"
    );

    await sequelize.sync();

    console.log(
      "Database tables created successfully!"
    );

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Server startup failed:"
    );

    console.error(error.message);
  }
}

startServer();