const express = require('express');
const Cart = require('../models/Cart');
const Pizza = require('../models/pizza');
const router = express.Router();
const mongoose = require("mongoose");

// 🔹 Fetch cart for a user
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId }).populate('items.pizza');
    res.json(cart || { user: req.params.userId, items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add item to cart
router.post('/add', async (req, res) => {
  try {
    let { userId, pizzaId, base, sauce, cheese, veggies = [], meat = [], quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    if (!mongoose.Types.ObjectId.isValid(pizzaId)) {
      return res.status(400).json({ error: "Invalid pizzaId" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    cart.items.push({
      pizza: pizzaId,
      base: base || null,
      sauce: sauce || null,
      cheese: cheese || null,
      veggies: Array.isArray(veggies) ? veggies : [],
      meat: Array.isArray(meat) ? meat : [],
      quantity: quantity || 1
    });

    await cart.save();
    await cart.populate("items.pizza");

    res.json(cart);
  } catch (err) {
    console.error("Cart add error:", err);
    res.status(500).json({ error: err.message });
  }
});


// 🔹 Remove item from cart
router.delete('/:userId/:itemId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Clear cart
router.delete('/clear/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.params.userId },
      { items: [] },
      { new: true }
    );
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
