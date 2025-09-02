// src/routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { createOrder, verifyPayment } = require("../controllers/paymentController");

// Create Razorpay order (amount in paise)
router.post("/razorpay/order", protect, createOrder);

// Verify payment + save order + reduce inventory + clear cart
router.post("/razorpay/verify", protect, verifyPayment);

module.exports = router;
