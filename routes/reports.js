const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Helper to filter orders by time range
const filterByDate = (orders, range) => {
  const now = new Date();
  let from;

  if (range === "weekly") from = new Date(now.setDate(now.getDate() - 7));
  else if (range === "monthly") from = new Date(now.setMonth(now.getMonth() - 1));
  else if (range === "yearly") from = new Date(now.setFullYear(now.getFullYear() - 1));
  else from = new Date(0); // all-time

  return orders.filter((o) => new Date(o.createdAt) >= from);
};

router.get("/", async (req, res) => {
  const { range } = req.query; // optional: ?range=weekly|monthly|yearly
  try {
    let orders = await Order.find().sort({ createdAt: -1 });

    if (range) {
      orders = filterByDate(orders, range);
    }

    const grouped = {};

    orders.forEach((order) => {
      const status = order.status || "Unknown";
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
      groupedByStatus: grouped,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate detailed report", error: err.message });
  }
});

module.exports = router;
