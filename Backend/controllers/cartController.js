const Cart = require("../models/cartModel");

// Add an item to the cart
const addToCart = async (req, res) => {
    const { userId, itemName, quantity, amount, image } = req.body;

    // Validate incoming data
    if (!userId || !itemName || !quantity || !amount || !image) {
        return res.status(400).json({ error: "Invalid request data" });
    }

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex((item) => item.itemName === itemName);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ itemName, quantity, amount, image });
        }

        await cart.save();
        res.status(200).json({ message: "Item added to cart successfully", cart });
    } catch (error) {
        console.log("Request body:", req.body);
        console.error("Error in addToCart:", error.message); // Log the error
        res.status(500).json({ error: "Failed to add item to cart", details: error.message });
    }
};
// Retrieve user's cart
const getCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve cart" });
    }
};

// Remove item from cart
const removeItem = async (req, res) => {
    const { userId, itemId } = req.body;

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

        await cart.save();
        res.status(200).json({ message: "Item removed successfully", items: cart.items });
    } catch (error) {
        res.status(500).json({ error: "Failed to remove item" });
    }
};

module.exports = {
    addToCart,
    getCart,
    removeItem,
};