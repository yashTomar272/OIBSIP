const mongoose = require("mongoose");

const emailLogSchema = new mongoose.Schema({
  to: String,
  subject: String,
  body: String,
  sentAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["sent", "failed"], default: "sent" }
});

module.exports = mongoose.model("EmailLog", emailLogSchema);
