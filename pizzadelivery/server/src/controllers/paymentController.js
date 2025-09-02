// src/controllers/paymentController.js
const crypto = require("crypto");
const razorpay = require("../utils/razorpay");
const Order = require("../models/Order");
const Cart = require("../models/Cart"); // <- ensure path/model exists
const updateInventoryFromOrder = require("../utils/updateInventoryFromOrder");

// POST /api/pay/razorpay/order
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body; // in paise
    if (!amount || amount < 100) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const options = {
      amount: Math.round(amount),
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    return res.json({ success: true, order });
  } catch (err) {
    console.error("createOrder error:", err);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

// POST /api/pay/razorpay/verify
// Frontend se: { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId }
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;
    if (!isValid) return res.status(400).json({ success: false, message: "Payment verification failed" });

    // 1) Fetch user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.pizza");
    if (!cart || !cart.items?.length) {
      return res.status(400).json({ success: false, message: "Cart empty" });
    }

    // 2) Create order in DB
    const amount = cart.items.reduce((s, it) => s + (it.pizza?.price || 0) * (it.quantity || 1), 0);

    const newOrder = await Order.create({
      user: userId,
      items: cart.items.map(it => ({
        pizza: it.pizza?._id || it.pizza,
        base: it.base,
        sauce: it.sauce,
        cheese: it.cheese,
        veggies: it.veggies || [],
        meat: it.meat || [],
        quantity: it.quantity || 1,
      })),
      totalAmount: amount,
      paid: true,
      status: "RECEIVED",
      razorpay: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      },
    });

    // 3) Reduce inventory based on order
    await updateInventoryFromOrder(newOrder);

    // 4) Clear cart
    cart.items = [];
    await cart.save();

    // 5) (optional) socket notify admin/users here if using io
    const io = req.app.get("io");
    if (io) io.emit("order:new", { orderId: newOrder._id });

    return res.json({ success: true, message: "Payment verified & order placed", orderId: newOrder._id });
  } catch (err) {
    console.error("verifyPayment error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
