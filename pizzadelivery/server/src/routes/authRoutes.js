const router = require('express').Router();
const { body } = require('express-validator');
const { register, verifyEmail, login, forgot, reset, me } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', [
  body('name').notEmpty(),
  body('email').isEmail(),
   body('address').notEmpty().withMessage("Address is required"),
  body('password').isLength({ min: 6 })
], register);

router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/forgot', forgot);
router.post('/reset', reset);
router.get('/me', protect, me);

module.exports = router;
