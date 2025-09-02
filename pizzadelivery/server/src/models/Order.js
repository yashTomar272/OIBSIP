const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  pizza: { type: mongoose.Schema.Types.ObjectId, ref: "Pizza", required: true },
  base: String,
  sauce: String,
  cheese: String,
  veggies: [String],
  meat: [String],
  quantity: { type: Number, default: 1 }
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, default: 0 },
    paid: { type: Boolean, default: false },
    status: { type: String, enum: ["RECEIVED", "IN_KITCHEN", "OUT_FOR_DELIVERY", "DELIVERED"], default: "RECEIVED" },
    razorpay: {
      orderId: String,
      paymentId: String,
      signature: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
