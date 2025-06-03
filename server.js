const express = require('express');
const connectDB = require('./db');
const app = express();

connectDB();

app.use(express.json());

// Import orders routes
const ordersRoute = require('./routes/orders');
app.use('/orders', ordersRoute);

app.get('/', (req, res) => {
  res.send('🔥 Backend working!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
