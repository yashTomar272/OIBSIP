const cron = require('node-cron');
const Inventory = require('../models/Inventory');
const sendEmail = require('./sendEmail');

function formatLow(items) {
  return items.map((i) => `<li>${i.name} — <strong>${i.qty}</strong> left (threshold ${i.threshold})</li>`).join('');
}

async function checkAndNotify() {
  const inv = await Inventory.findOne();
  if (!inv) return;

  const low = [];
  ['bases','sauces','cheeses','veggies','meats'].forEach((key) => {
    inv[key].forEach((opt) => {
      if (opt.qty <= opt.threshold) low.push(opt);
    });
  });

  if (low.length) {
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: 'Low stock alert — Pizza App',
      html: `<p>Following items are low:</p><ul>${formatLow(low)}</ul>`
    });
  }
}

module.exports = function initStockMonitor() {
  const expr = process.env.LOW_STOCK_CHECK_CRON || '15 * * * *';
  cron.schedule(expr, () => {
    checkAndNotify().catch(console.error);
  });
};
