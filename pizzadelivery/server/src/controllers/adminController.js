const Inventory = require('../models/Inventory');
const Order = require('../models/Order');

exports.getInventory = async (_req, res) => {
  let inv = await Inventory.findOne();
  if (!inv) inv = await Inventory.create({ bases: [], sauces: [], cheeses: [], veggies: [], meats: [] });
  res.json(inv);
};

exports.upsertInventory = async (req, res) => {
  const data = req.body; // full object with arrays
  let inv = await Inventory.findOne();
  if (!inv) inv = await Inventory.create(data);
  else {
    inv.bases = data.bases ?? inv.bases;
    inv.sauces = data.sauces ?? inv.sauces;
    inv.cheeses = data.cheeses ?? inv.cheeses;
    inv.veggies = data.veggies ?? inv.veggies;
    inv.meats = data.meats ?? inv.meats;
    await inv.save();
  }
  res.json({ message: 'Inventory updated', inv });
};

exports.allOrders = async (_req, res) => {
  const list = await Order.find().populate('user','name email').sort({ createdAt: -1 });
  res.json(list);
};

exports.updateOrderStatus = async (req, res) => {
try {
    const { status } = req.body; // yaha se frontend se jo status aayega wo set karenge

    // check valid status
    const validStatuses = ["RECEIVED", "IN_KITCHEN", "OUT_FOR_DELIVERY", "DELIVERED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status; // frontend se jo bheja wahi update karenge
    await order.save();

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
