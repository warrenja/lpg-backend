const express = require("express");
const router = express.Router();

let orders = [];
let orderIdCounter = 1;

// GET all orders
router.get("/", (req, res) => {
  res.json(orders);
});

// POST new order
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

  orders.unshift(newOrder); // add to beginning
  res.status(201).json(newOrder);
});

module.exports = router;
