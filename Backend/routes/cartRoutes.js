const express = require("express");
const { addToCart, getCart,removeItem } = require("../controllers/cartController");
const router = express.Router();

router.post("/addToCart", addToCart);
router.get("/:userId", getCart);
router.post("/removeItem", removeItem);
module.exports = router;