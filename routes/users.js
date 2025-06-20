const express = require("express");
const router = express.Router();

// In-memory user store for example
const users = [
  { id: 1, username: "warren", password: "Warren42", role: "driver" },
  // Add more users here
];

router.get("/", (req, res) => {
  res.json(users);
});

// Export only driver usernames
router.get("/drivers", (req, res) => {
  const drivers = users.filter((u) => u.role === "driver");
  res.json(drivers);
});

module.exports = router;
