const router = require('express').Router();
const { protect } = require('../middlewares/authMiddleware');
const { getOptions, createOrderDraft, markPaidAndReduceStock, myOrders,changeAddress } = require('../controllers/userController');

router.get('/options', protect, getOptions);
router.post('/order/draft', protect, createOrderDraft);
router.post('/order/confirm', protect, markPaidAndReduceStock);
router.get('/orders', protect, myOrders);
router.put("/update-address", protect, changeAddress);

module.exports = router;
