const express = require("express");
const router = express.Router();

let deliveries = [];
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

// Update delivery status
router.patch("/:id/status", (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  const delivery = deliveries.find((d) => d.id === id);
  if (!delivery) return res.status(404).json({ message: "Delivery not found" });

  delivery.status = status;
  res.json(delivery);
});

module.exports = router;
