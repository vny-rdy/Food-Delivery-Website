const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Each user can have one cart
    items: [
        {
            itemName: { type: String, required: true },
            quantity: { type: Number, required: true, default: 1 },
            amount: { type: Number, required: true },
            image: { type: String, required: true },
        },
    ],
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;