const express = require("express");
const router = express.Router();

let sales = [];
let saleIdCounter = 1;

// Get all sales
router.get("/", (req, res) => {
  res.json(sales);
});

// Create new sale (call this when order is marked Delivered)
router.post("/", (req, res) => {
  const { customer, item, quantity, price, date, location } = req.body;

  if (!customer || !item || !quantity || !price || !date) {
    return res.status(400).json({ message: "Missing sale fields" });
  }

  const newSale = {
    id: saleIdCounter++,
    customer,
    item,
    quantity,
    price,
    date,
    location: location || "Unknown"
  };

  sales.push(newSale);
  res.status(201).json(newSale);
});

module.exports = router;
