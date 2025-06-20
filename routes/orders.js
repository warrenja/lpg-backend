const express = require("express");
const router = express.Router();
const deliveries = require("./deliveriesMemory");

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

// Assign driver
router.patch("/:id/driver", (req, res) => {
  const orderId = parseInt(req.params.id);
  const { driver } = req.body;

  const order = orders.find((o) => o.id === orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.assignedDriver = driver;
  res.json(order);
});

// Update order status and create delivery if possible
router.patch("/:id/status", (req, res) => {
  const orderId = parseInt(req.params.id);
  const { status } = req.body;

  const order = orders.find((o) => o.id === orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = status;

  // Check if assigned driver exists and status is not pending
  if (order.assignedDriver && status !== "Pending") {
    const deliveryExists = deliveries.some((d) => d.orderId === order.id);
    if (!deliveryExists) {
      deliveries.push({
        id: deliveries.length + 1,
        orderId: order.id,
        customer: order.customer,
        address: "Unknown", // Update later if needed
        item: order.item,
        driver: order.assignedDriver,
        status,
        assignedAt: new Date().toISOString(),
      });
    }
  }

  res.json(order);
});

module.exports = router;
