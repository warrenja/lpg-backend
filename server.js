const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/healthcheck", (req, res) => {
  res.status(200).send("✅ Backend is healthy");
});

// Routes
const ordersRoute = require("./routes/orders");
const receiptsRoute = require("./routes/receipts");
const salesRoute = require("./routes/sales");
const deliveriesRoute = require("./routes/deliveries");
const reportsRoute = require("./routes/reports");
const usersRoute = require("./routes/users");

// Use routes (no /api prefix)
app.use("/orders", ordersRoute);
app.use("/receipts", receiptsRoute);
app.use("/sales", salesRoute);
app.use("/deliveries", deliveriesRoute);
app.use("/reports", reportsRoute);
app.use("/users", usersRoute);

// Root route
app.get("/", (req, res) => {
  res.send("🔥 Backend working!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
