// src/utils/updateInventoryFromOrder.js
const Inventory = require("../models/Inventory");

// order.items => [{ base, sauce, cheese, veggies:[], meat:[], quantity }]
async function updateInventoryFromOrder(order) {
  if (!order || !Array.isArray(order.items)) return;

  let inv = await Inventory.findOne();
  if (!inv) return; // inventory not initialized

  // helper: name match (case-insensitive)
  const dec = (arr, name, qty) => {
    const idx = arr.findIndex(o => o.name?.toLowerCase() === String(name).toLowerCase());
    if (idx > -1) {
      arr[idx].qty = Math.max(0, (arr[idx].qty || 0) - qty);
    }
  };

  for (const it of order.items) {
    const qty = Number(it.quantity || 1);

    if (it.base)   dec(inv.bases,   it.base,   qty);
    if (it.sauce)  dec(inv.sauces,  it.sauce,  qty);
    if (it.cheese) dec(inv.cheeses, it.cheese, qty);

    if (Array.isArray(it.veggies)) {
      for (const v of it.veggies) dec(inv.veggies, v, qty);
    }
    if (Array.isArray(it.meat)) {
      for (const m of it.meat) dec(inv.meats, m, qty);
    }
  }

  await inv.save();
}

module.exports = updateInventoryFromOrder;
