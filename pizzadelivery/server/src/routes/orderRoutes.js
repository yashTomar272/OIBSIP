const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Inventory = require("../models/Inventory");
const Order = require("../models/Order");

// ✅ Place Order after Payment Verified
router.post("/place", async (req, res) => {
  try {
    const { userId, paymentId } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate("items.pizza");
    if (!cart || !cart.items.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // ✅ Create Order
    const order = new Order({
      user: userId,
      items: cart.items,
      totalAmount: cart.items.reduce(
        (sum, it) => sum + (it.pizza.price || 0) * (it.quantity || 1),
        0
      ),
      paymentId,
      status: "Placed"
    });
    await order.save();

    // ✅ Reduce Inventory
    const inv = await Inventory.findOne();
    if (inv) {
      cart.items.forEach((it) => {
        if (it.base) {
          const base = inv.bases.find((b) => b.name === it.base);
          if (base) base.qty -= it.quantity;
        }
        if (it.sauce) {
          const sauce = inv.sauces.find((s) => s.name === it.sauce);
          if (sauce) sauce.qty -= it.quantity;
        }
        if (it.cheese) {
          const cheese = inv.cheeses.find((c) => c.name === it.cheese);
          if (cheese) cheese.qty -= it.quantity;
        }
        if (it.veggies && it.veggies.length) {
          it.veggies.forEach((v) => {
            const veg = inv.veggies.find((vg) => vg.name === v);
            if (veg) veg.qty -= it.quantity;
          });
        }
        if (it.meat && it.meat.length) {
          it.meat.forEach((m) => {
            const meat = inv.meats.find((mt) => mt.name === m);
            if (meat) meat.qty -= it.quantity;
          });
        }
      });
      await inv.save();
    }

    // ✅ Clear Cart
    cart.items = [];
    await cart.save();

    res.json({ success: true, message: "Order placed successfully", order });
  } catch (err) {
    console.error("Order place failed:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
