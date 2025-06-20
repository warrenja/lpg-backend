const express = require("express");
const router = express.Router();

// In-memory storage
let orders = [];
let orderIdCounter = 1;

let sales = [];
let saleIdCounter = 1;

// Get all orders
router.get("/", (req, res) => {
  res.json(orders);
});

// Create new order
router.post("/", (req, res) => {
  const { customerId, customer, item, amount, location } = req.body;

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
    location: location || "Unknown",
    createdAt: new Date().toISOString()
  };

  orders.unshift(newOrder);
  res.status(201).json(newOrder);
});

// Update order status
router.patch("/:id/status", (req, res) => {
  const orderId = parseInt(req.params.id);
  const { status } = req.body;

  const order = orders.find((o) => o.id === orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = status;

  // Create a sales record if marked as Delivered
  if (status === "Delivered") {
    const newSale = {
      id: saleIdCounter++,
      customer: order.customer,
      item: order.item,
      quantity: 1,
      price: parseInt(order.amount.replace(/[^\d]/g, "")),
      date: new Date().toISOString().split("T")[0],
      location: order.location || "Unknown"
    };

    sales.push(newSale);
    console.log("✅ Sale recorded:", newSale);
  }

  res.json(order);
});

// Optional: expose sales from here too
router.get("/sales", (req, res) => {
  res.json(sales);
});

module.exports = router;
