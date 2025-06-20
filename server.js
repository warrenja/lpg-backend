const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/healthcheck", (req, res) => {
  res.status(200).send("✅ Backend is healthy");
});

// routes
const ordersRoute = require("./routes/orders");
const receiptsRoute = require("./routes/receipts");
const salesRoute = require("./routes/sales");
const deliveriesRoute = require("./routes/deliveries");
const reportsRoute = require("./routes/reports");

app.use("/orders", ordersRoute);
app.use("/receipts", receiptsRoute);
app.use("/sales", salesRoute);
app.use("/deliveries", deliveriesRoute);
app.use("/reports", reportsRoute);

app.get("/", (req, res) => {
  res.send("🔥 Backend working!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
