const express = require("express");
const cors = require("cors");  // make sure this is imported
const connectDB = require("./db");
const app = express();

connectDB();

app.use(cors());  // add this line
app.use(express.json());

app.get("/healthcheck", (req, res) => {
  res.status(200).send("✅ Backend is healthy");
});

// routes
const ordersRoute = require("./routes/orders");
app.use("/orders", ordersRoute);

const receiptsRoute = require("./routes/receipts");
app.use("/receipts", receiptsRoute);


app.get("/", (req, res) => {
  res.send("🔥 Backend working!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
 console.log(`✅ Server running on port ${PORT}`);
});
