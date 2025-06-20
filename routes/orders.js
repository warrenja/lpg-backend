const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Delivery = require("../models/Delivery");

router.get("/", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

router.post("/", async (req, res) => {
  const { customerId, customer, item, amount } = req.body;

  if (!customerId || !customer || !item || !amount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newOrder = new Order({
    customerId,
    customer,
    item,
    amount,
    status: "Pending",
    assignedDriver: null,
  });

  await newOrder.save();
  res.status(201).json(newOrder);
});

router.patch("/:id/driver", async (req, res) => {
  const { driver } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.assignedDriver = driver;
  await order.save();

  res.json(order);
});

router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = status;
  await order.save();

  // 🔥 Save delivery only if driver is assigned and status is not Pending
  if (order.assignedDriver && status !== "Pending") {
    const existing = await Delivery.findOne({ orderId: order._id });
    if (!existing) {
      await Delivery.create({
        orderId: order._id,
        customer: order.customer,
        item: order.item,
        driver: order.assignedDriver,
        status,
        address: "Unknown",
        assignedAt: new Date(),
      });
    }
  }

  res.json(order);
});

module.exports = router;
