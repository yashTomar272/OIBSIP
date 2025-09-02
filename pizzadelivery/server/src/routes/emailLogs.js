const express = require("express");
const EmailLog = require("../models/EmailLog");
const router = express.Router();

router.get("/logs", async (req, res) => {
  try {
    const logs = await EmailLog.find().sort({ sentAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

module.exports = router;
