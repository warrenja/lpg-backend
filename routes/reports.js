const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();

    const totalOrders = orders.length;

    const totalSales = orders.reduce((sum, o) => {
      const amount = o.amount || "0";
      return sum + parseInt(amount.replace(/[^\d]/g, ""));
    }, 0);

    const statusCount = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});

    const itemCount = orders.reduce((acc, o) => {
      acc[o.item] = (acc[o.item] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalOrders,
      totalSales,
      statusCount,
      itemCount,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate report", error: err.message });
  }
});

module.exports = router;
