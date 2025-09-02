const Pizza = require('../models/pizza');

exports.addPizza = async (req, res) => {
  try {
    const { name, url, price, category } = req.body;

    // Validation
    if (!name || !url || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, url, price, category) are required!"
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0"
      });
    }

    const pizza = new Pizza({ name, url, price, category });
    await pizza.save();

    res.status(200).json({
      success: true,
      message: "Pizza added successfully",
      data: pizza
    });
  } catch (err) {
    console.error("Error adding pizza:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};
exports.getPizza = async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.status(200).json({
      success: true,
      data: pizzas
    });
  } catch (err) {
    console.error("Error fetching pizzas:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};
exports.deletePizza = async (req, res) => {
  try {
    const { id } = req.params;
    const pizza = await Pizza.findByIdAndDelete(id);

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: "Pizza not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Pizza deleted successfully"
    });
  } catch (err) {
    console.error("Error deleting pizza:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};
// 🍕 Update Pizza (Edit)
exports.updatePizza = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image } = req.body;

    const pizza = await Pizza.findByIdAndUpdate(
      id,
      { name, description, price, image },
      { new: true, runValidators: true }
    );

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: "Pizza not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Pizza updated successfully",
      pizza,
    });
  } catch (err) {
    console.error("Error updating pizza:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
// 🍕 Get Single Pizza by ID
exports.getPizzaById = async (req, res) => {
  try {
    const { id } = req.params; 
    console.log("Fetching pizza with ID:", id); // Debug log
    const pizza = await Pizza.findById(id);

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: "Pizza not found"
      });
    }

    res.status(200).json({
      success: true,
      data: pizza
    });
  } catch (err) {
    console.error("Error fetching pizza by ID:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
};

