// routes/reports.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Utility: Convert amount string (e.g. "KSh 1500") to number
const parseAmount = (str) => {
  if (!str) return 0;
  const num = parseInt(String(str).replace(/[^\d]/g, ""), 10);
  return isNaN(num) ? 0 : num;
};

// GET /reports?range=weekly|monthly|yearly OR ?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get("/", async (req, res) => {
  const { range, from, to } = req.query;

  try {
    let orders = await Order.find().sort({ createdAt: -1 });

    // Filter by predefined range
    if (range) {
      const now = new Date();
      let fromDate = new Date(0);

      if (range === "weekly") fromDate = new Date(now.setDate(now.getDate() - 7));
      else if (range === "monthly") fromDate = new Date(now.setMonth(now.getMonth() - 1));
      else if (range === "yearly") fromDate = new Date(now.setFullYear(now.getFullYear() - 1));

      orders = orders.filter((o) => new Date(o.createdAt) >= fromDate);
    }

    // Filter by custom date range
    if (from || to) {
      const fromDate = from ? new Date(from) : new Date(0);
      const toDate = to ? new Date(to) : new Date();
      orders = orders.filter((o) => {
        const createdAt = new Date(o.createdAt);
        return createdAt >= fromDate && createdAt <= toDate;
      });
    }

    let totalRevenue = 0;
    const grouped = {};

    orders.forEach((order) => {
      const status = order.status || "Unknown";
      const amount = parseAmount(order.amount);
      totalRevenue += amount;

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
      range: range || `${from || "all"} to ${to || "now"}`,
      totalOrders: orders.length,
      totalRevenue,
      groupedByStatus: grouped,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to generate report",
      error: err.message,
    });
  }
});

module.exports = router;
