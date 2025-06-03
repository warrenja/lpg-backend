const express = require("express");
const router = express.Router();

// Mock user middleware (for testing only)
// Pretend every request comes from an admin user
router.use((req, res, next) => {
  req.user = { id: 1, role: "admin", name: "Admin User" };
  next();
});

// Middleware to check if user is admin
function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
}

let receipts = [];
let receiptId = 1;

router.get("/", (req, res) => {
  res.json(receipts);
});

// Only admins can create receipts
router.post("/", isAdmin, (req, res) => {
  const { orderId, customer, amount, paymentMethod } = req.body;
  if (!orderId || !customer || !amount || !paymentMethod) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const receipt = {
    id: receiptId++,
    orderId,
    customer,
    amount,
    paymentMethod,
    date: new Date().toISOString(),
  };
  receipts.unshift(receipt);
  res.status(201).json(receipt);
});

module.exports = router;
