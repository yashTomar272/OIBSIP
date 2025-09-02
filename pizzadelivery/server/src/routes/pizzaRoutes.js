const router = require('express').Router();
const { protect } = require('../middlewares/authMiddleware');
const { addPizza,getPizza,deletePizza,updatePizza,getPizzaById } = require('../controllers/pizzaController');


router.post("/add-pizza", protect, addPizza);
router.get("/get-pizza", protect, getPizza);
router.get("/get-pizza-id/:id", protect, getPizzaById);
router.delete("/delete-pizza/:id", protect, deletePizza);
router.put("/update-pizza/:id", protect, updatePizza);

module.exports = router;