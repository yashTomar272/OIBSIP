const router = require('express').Router();
const { protect, permit } = require('../middlewares/authMiddleware');
const { getInventory, upsertInventory, allOrders, updateOrderStatus } = require('../controllers/adminController');
const Inventory = require('../models/Inventory');

router.get('/inventory', protect, permit('admin'), getInventory);
router.put('/inventory', protect, permit('admin'), upsertInventory);
router.get('/orders', protect, permit('admin'), allOrders);
router.put('/orders/:id/status', protect, permit('admin'), updateOrderStatus);
router.get('/low-stock', async (req, res) => {
  try {
    const inv = await Inventory.findOne();
    if (!inv) return res.json([]);

    const low = [];
    ['bases','sauces','cheeses','veggies','meats'].forEach((key) => {
      inv[key].forEach((opt) => {
        if (opt.qty <= opt.threshold) low.push(opt);
      });
    });

    res.json(low);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
