// models/Receipt.js
const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  customerName: String,
  items: [{ product: String, quantity: Number, price: Number }],
  totalAmount: Number,
  dateGenerated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Receipt", receiptSchema);
