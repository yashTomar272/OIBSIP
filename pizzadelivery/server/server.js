const express = require("express");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const connectDB = require("./src/config/db");
const initStockMonitor = require("./src/utils/stockMonitor");

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/pizza", require("./src/routes/pizzaRoutes"));
app.use("/api/user", require("./src/routes/userRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));
app.use("/api/pay", require("./src/routes/paymentRoutes"));
app.use("/api/cart", require("./src/routes/cartRoutes"));
app.use("/api/email", require("./src/routes/emailLogs"));
app.use("/api/orders", require("./src/routes/orderRoutes"));

// Home route
app.get("/", (_req, res) => {
  res.send("Pizza API running");
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error("ERR:", err);

  res.status(err.status || 500).json({
    message: err.message || "Server Error",
  });
});

const PORT = process.env.PORT || 5000;

// Start server only after MongoDB connects
async function startServer() {
  try {
    await connectDB();

    console.log("✅ Database connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    // Start stock monitoring after DB connection
    initStockMonitor();

  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();