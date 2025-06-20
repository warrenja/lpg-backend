// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  customer: { type: String, required: true },
  item: { type: String, required: true },
  amount: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "In Transit", "Delivered"],
    default: "Pending",
  },
  assignedDriver: { type: String, default: null },
});

module.exports = mongoose.model("Order", orderSchema);
