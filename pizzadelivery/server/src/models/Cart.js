const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  pizza: { type: mongoose.Schema.Types.ObjectId, ref: "Pizza", required: true },
  base: String,
  sauce: String,
  cheese: String,
  veggies: [String],
  meat: [String],
  quantity: { type: Number, default: 1 }
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, unique: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
