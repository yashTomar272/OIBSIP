const Inventory = require('../models/Inventory');
const Order = require('../models/Order');
const User = require("../models/User");

// basic pricing (demo)
function calcAmount(items) {
  let base = 199;                         // base pizza price
  base += (items.veggies?.length || 0) * 20;
  base += (items.meat?.length || 0) * 40;
  return base;
}

exports.getOptions = async (_req, res) => {
  const inv = await Inventory.findOne();
  if (!inv) return res.json({ bases: [], sauces: [], cheeses: [], veggies: [], meats: [] });
  res.json(inv);
};

exports.createOrderDraft = async (req, res) => {
  const { items } = req.body; // {base,sauce,cheese,veggies,meat}
  if (!items?.base || !items?.sauce || !items?.cheese) {
    return res.status(400).json({ message: 'base, sauce, and cheese are required' });
  }
  const amount = calcAmount(items);
  const order = await Order.create({ user: req.user._id, items, amount, status: 'RECEIVED', paid: false });
  res.json({ orderId: order._id, amount });
};

exports.markPaidAndReduceStock = async (req, res) => {
  const { orderId, paymentInfo } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.paid = true;
  order.paymentInfo = paymentInfo || {};
  await order.save();

  // reduce stock
  const inv = await Inventory.findOne();
  if (inv) {
    const dec = (arr, name) => {
      const idx = arr.findIndex((x) => x.name === name);
      if (idx > -1) arr[idx].qty = Math.max(0, (arr[idx].qty || 0) - 1);
    };
    if (order.items.base) dec(inv.bases, order.items.base);
    if (order.items.sauce) dec(inv.sauces, order.items.sauce);
    if (order.items.cheese) dec(inv.cheeses, order.items.cheese);
    (order.items.veggies || []).forEach((v) => dec(inv.veggies, v));
    (order.items.meat || []).forEach((m) => dec(inv.meats, m));
    await inv.save();
  }

  // live notify user
  const io = req.app.get('io');
  io.to(String(order.user)).emit('order:update', { orderId: order._id, status: order.status, paid: order.paid });

  res.json({ message: 'Order confirmed', order });
};

exports.myOrders = async (req, res) => {
  const list = await Order.find({ user: req.user._id })
  .populate("items.pizza")   // pizza ka detail

  console.log("myOrders list:", list);
  res.json(list);
};


// ✅ Update Address Controller
exports.changeAddress = async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    // 🔑 req.user तुम्हारे protect middleware से मिल रहा है
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.address = address;
    await user.save();

    return res.status(200).json({
      message: "Address updated successfully",
      address: user.address,
    });
  } catch (error) {
    console.error("Update Address Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
