const express = require("express");
const router = express.Router();

// Reuse same sales and orders data
const sales = require("./sales").sales; // If exported
const orders = require("./orders").orders;

router.get("/summary", (req, res) => {
  const locationMap = {};
  const itemMap = {};
  const statusMap = { Delivered: 0, Pending: 0 };

  orders.forEach(order => {
    const location = order.location || "Unknown";
    const item = order.item;
    const status = order.status;

    locationMap[location] = (locationMap[location] || 0) + 1;
    itemMap[item] = (itemMap[item] || 0) + 1;
    statusMap[status] = (statusMap[status] || 0) + 1;
  });

  res.json({
    locations: Object.entries(locationMap).map(([name, orders]) => ({ name, orders })),
    inventory: Object.entries(itemMap).map(([item, count]) => ({ item, count })),
    statuses: Object.entries(statusMap).map(([status, count]) => ({ status, count })),
  });
});

module.exports = router;
