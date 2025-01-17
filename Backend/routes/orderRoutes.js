const express = require("express");
const router = express.Router();
const { confirmOrder } = require("../controllers/orderController"); // Import the controller
const { getUserOrders } = require("../controllers/orderController"); // Function to get user orders


// POST request to confirm the order
router.post("/confirmOrder", confirmOrder);

// GET request to fetch orders for a specific user
router.get("/:userId", getUserOrders);

// POST request to handle payment processing


module.exports = router;