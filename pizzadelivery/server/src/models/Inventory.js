const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, default: 0 },
  threshold: { type: Number, default: 20 }
});

const inventorySchema = new mongoose.Schema(
  {
    bases: [optionSchema],
    sauces: [optionSchema],
    cheeses: [optionSchema],
    veggies: [optionSchema],
    meats: [optionSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inventory', inventorySchema);
