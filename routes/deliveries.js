const express = require("express");
const router = express.Router();
const deliveries = require("./deliveriesMemory");

let deliveryIdCounter = 1;

// Get all deliveries
router.get("/", (req, res) => {
  res.json(deliveries);
});

// Create a new delivery
router.post("/", (req, res) => {
  const { orderId, customer, address, item, driver, status } = req.body;

  if (!orderId || !customer || !address || !item || !driver) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Check if this delivery already exists (avoid duplicates)
  const exists = deliveries.some(
    (d) => d.orderId === orderId && d.driver === driver
  );
  if (exists) {
    return res.status(409).json({ message: "Delivery already exists for this order and driver" });
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
  if (!delivery) {
    return res.status(404).json({ message: "Delivery not found" });
  }

  delivery.status = status;
  res.json(delivery);
});

module.exports = router;
