const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true },
    image: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);