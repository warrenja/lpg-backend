const express = require("express");
const router = express.Router();
const deliveries = require("./deliveriesMemory"); // shared memory array

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

// Update order status and auto-create delivery if needed
router.patch("/:id/status", (req, res) => {
  const orderId = parseInt(req.params.id);
  const { status } = req.body;

  const order = orders.find((o) => o.id === orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = status;

  // Auto-create delivery if driver is assigned and status is not Pending
  if (order.assignedDriver && status !== "Pending") {
    const alreadyDelivered = deliveries.some((d) => d.orderId === order.id);
    if (!alreadyDelivered) {
      deliveries.push({
        id: deliveries.length + 1,
        orderId: order.id,
        customer: order.customer,
        address: "Unknown", // Optional: Replace with real address if you collect it later
        item: order.item,
        driver: order.assignedDriver,
        status: status,
        assignedAt: new Date().toISOString(),
      });
    }
  }

  res.json(order);
});

// Assign driver to order
router.patch("/:id/driver", (req, res) => {
  const orderId = parseInt(req.params.id);
  const { driver } = req.body;

  const order = orders.find((o) => o.id === orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.assignedDriver = driver;
  res.json(order);
});

module.exports = router;
