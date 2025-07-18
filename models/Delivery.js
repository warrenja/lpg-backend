// models/Delivery.js
const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId, // <-- FIXED: now matches Order _id
    required: true,
    ref: "Order"
  },
  customer: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default: "Unknown",
  },
  item: {
    type: String,
    required: true,
  },
  driver: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "In Transit", "Delivered"],
    default: "Pending",
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Delivery", deliverySchema);
