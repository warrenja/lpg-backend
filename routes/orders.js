const express = require("express");
const router = express.Router();
const Delivery = require("../models/Delivery");

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

// Update order status & auto-create delivery in DB
router.patch("/:id/status", async (req, res) => {
  const orderId = parseInt(req.params.id);
  const { status } = req.body;

  const order = orders.find((o) => o.id === orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = status;

  try {
    if (order.assignedDriver && status !== "Pending") {
      // Check if delivery already exists in DB
      const existing = await Delivery.findOne({ orderId: order.id });
      if (!existing) {
        const newDelivery = new Delivery({
          orderId: order.id,
          customer: order.customer,
          address: "Unknown", // Update if needed
          item: order.item,
          driver: order.assignedDriver,
          status,
        });

        await newDelivery.save();
        console.log(`✅ Delivery created for order ${order.id}`);
      }
    }

    res.json(order);
  } catch (err) {
    console.error("Error creating delivery:", err);
    res.status(500).json({ message: "Error creating delivery" });
  }
});

module.exports = router;
