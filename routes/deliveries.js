const express = require("express");
const router = express.Router();
const Delivery = require("../models/Delivery");

// GET all deliveries
router.get("/", async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.json(deliveries);
  } catch (err) {
    console.error("Error fetching deliveries:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST a new delivery
router.post("/", async (req, res) => {
  const { orderId, customer, address, item, driver, status } = req.body;

  if (!orderId || !customer || !item || !driver) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newDelivery = new Delivery({
      orderId,
      customer,
      address: address || "Unknown",
      item,
      driver,
      status: status || "Pending",
    });

    await newDelivery.save();
    res.status(201).json(newDelivery);
  } catch (err) {
    console.error("Error creating delivery:", err);
    res.status(500).json({ message: "Failed to create delivery" });
  }
});

// PATCH update delivery status
router.patch("/:id/status", async (req, res) => {
  const deliveryId = req.params.id;
  const { status } = req.body;

  try {
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });

    delivery.status = status;
    await delivery.save();

    res.json(delivery);
  } catch (err) {
    console.error("Error updating delivery status:", err);
    res.status(500).json({ message: "Failed to update delivery" });
  }
});

module.exports = router;
