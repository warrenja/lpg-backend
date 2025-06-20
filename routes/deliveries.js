const express = require("express");
const router = express.Router();
const deliveries = require("./deliveriesMemory");

let deliveryIdCounter = 1;

// Get all deliveries
router.get("/", (req, res) => {
  res.json(deliveries);
});

// Create new delivery
router.post("/", (req, res) => {
  const { orderId, customer, address, item, driver, status } = req.body;

  if (!orderId || !customer || !address || !item || !driver) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newDelivery = {
    id: deliveryIdCounter++,
    orderId,
    customer,
    address,
    item,
    driver,
    status: status || "Pending",
    assignedAt: new Date().toISOString(),
  };

  deliveries.push(newDelivery);
  res.status(201).json(newDelivery);
});

module.exports = router;
