const Order = require("../models/orderModel"); // Assuming you have an Order model/schema

// Controller function to confirm an order
const confirmOrder = async (req, res) => {
    const { userId, itemName, quantity, amount, image } = req.body;

    try {
        // Save the order to the database
        const newOrder = new Order({ userId, itemName, quantity, amount, image });
        await newOrder.save();

        res.status(201).json({ message: "Order confirmed successfully!" });
    } catch (error) {
        console.error("Error confirming order:", error);
        res.status(500).json({ error: "Failed to confirm order" });
    }
};

const getUserOrders = async (req, res) => {
    const userId = req.params.userId;

    try {
        const orders = await Order.find({ userId }); // Find orders for the specific user
        res.status(200).json({ orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};

module.exports = {
    confirmOrder,
    getUserOrders,
};