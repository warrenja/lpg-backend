const express = require("express");
const router = express.Router();

let orders = [];
let orderIdCounter = 1;

// Get all orders
router.get("/", (req, res) => {
  res.json(orders);
});

// Create new order
router.post("/", (req, res) => {
  const { customerId, customer, item, amount } = req.body;

  if (!customerId || !customer || !item || !amount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newOrder = {
    id: orderIdCounter++,
    customerId,
    customer,
    item,
    amount,
    status: "Pending",
    assignedDriver: null,
  };

  orders.unshift(newOrder);
  res.status(201).json(newOrder);
});

// PATCH update order status (Admin only)
router.patch("/:id/status", (req, res) => {
  const orderId = parseInt(req.params.id);
  const { status } = req.body;

  const order = orders.find((o) => o.id === orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = status;
  res.json(order);
});

module.exports = router;
