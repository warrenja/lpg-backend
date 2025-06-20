const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const app = express();

connectDB();

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
const usersRoute = require("./routes/users"); // 👈 Added for fetching drivers

app.use("/orders", ordersRoute);
app.use("/receipts", receiptsRoute);
app.use("/sales", salesRoute);
app.use("/deliveries", deliveriesRoute);
app.use("/reports", reportsRoute);
app.use("/users", usersRoute); // 👈 Registered users route

// Root
app.get("/", (req, res) => {
  res.send("🔥 Backend working!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
