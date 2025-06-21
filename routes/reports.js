// routes/reports.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Helper to filter by date range
const filterByDate = (orders, range) => {
  const now = new Date();
  let from;

  if (range === "weekly") from = new Date(now.setDate(now.getDate() - 7));
  else if (range === "monthly") from = new Date(now.setMonth(now.getMonth() - 1));
  else if (range === "yearly") from = new Date(now.setFullYear(now.getFullYear() - 1));
  else from = new Date(0); // all time

  return orders.filter((o) => new Date(o.createdAt) >= from);
};

router.get("/", async (req, res) => {
  const { range } = req.query;
  try {
    let orders = await Order.find().sort({ createdAt: -1 });

    if (range) orders = filterByDate(orders, range);

    let totalRevenue = 0;
    const grouped = {};

    orders.forEach((order) => {
      const status = order.status || "Unknown";

      // Safely parse amount
      const rawAmount = order.amount || "KSh 0";
      const amountNum = parseInt(String(rawAmount).replace(/[^\d]/g, ""), 10);
      totalRevenue += amountNum;

      if (!grouped[status]) grouped[status] = [];

      grouped[status].push({
        id: order._id,
        customer: order.customer,
        item: order.item,
        amount: order.amount,
        date: new Date(order.createdAt).toLocaleDateString(),
        time: new Date(order.createdAt).toLocaleTimeString(),
      });
    });

    res.json({
      range: range || "all-time",
      totalOrders: orders.length,
      totalRevenue,
      groupedByStatus: grouped,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate report", error: err.message });
  }
});

module.exports = router;
