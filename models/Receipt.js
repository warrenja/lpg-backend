const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  customerName: String,
  item: String, // Changed from items[] to a single item string
  totalAmount: Number,
  paymentMethod: String, // Optional, in case you want to include this later
  dateGenerated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Receipt", receiptSchema);
