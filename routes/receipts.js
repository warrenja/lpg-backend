// routes/receipts.js
const express = require("express");
const router = express.Router();
const Receipt = require("../models/Receipt");
const Order = require("../models/Order");

// POST /api/receipts/generate
router.post("/generate", async (req, res) => {
  const { orderId } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order || order.status !== "Delivered") {
      return res.status(400).json({ message: "Order not delivered or not found" });
    }

    const receipt = new Receipt({
      orderId: order._id,
      customerName: order.customerName,
      items: order.items,
      totalAmount: order.totalAmount,
    });

    await receipt.save();
    res.status(201).json(receipt);
  } catch (err) {
    res.status(500).json({ message: "Failed to generate receipt", error: err.message });
  }
});

module.exports = router;
