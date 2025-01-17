const Menu = require("../models/menuModel");
const path = require("path");

// Configure multer for file uploads
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the folder to store images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to filenames
  },
});

const upload = multer({ storage: storage }).single("image");

// Fetch all menu items
const getMenu = async (req, res) => {
  try {
    const searchQuery = req.query.search || '';
    const menuItems = await Menu.find({
      name: { $regex: searchQuery, $options: 'i' },
    });
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
};

// Add a new menu item
const addMenuItem = async (req, res) => {
  const { userId, itemName, quantity, amount, image } = req.body;

    try {
        // Check if cart already exists for the user
        let cart = await Cart.findOne({ userId });
        
        // If cart doesn't exist, create a new cart
        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ itemName, quantity, amount, image }],
                totalAmount: amount * quantity,
            });
        } else {
            // If cart exists, check if item already exists in the cart
            const existingItem = cart.items.find(item => item.itemName === itemName);
            if (existingItem) {
                // Update the quantity and amount for the existing item
                existingItem.quantity += quantity;
                existingItem.amount = amount;
            } else {
                // Add the new item to the cart
                cart.items.push({ itemName, quantity, amount, image });
            }
            // Recalculate the total amount of the cart
            cart.totalAmount = cart.items.reduce((total, item) => total + item.amount * item.quantity, 0);
        }

        // Save the cart in the database
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Error adding item to cart' });
    }
};


// Update a menu item by ID
const updateMenuItem = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: "Image upload failed" });
    }

    try {
      // If a new image is uploaded, set the new image path
      const updatedData = {
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        availability: req.body.availability,
        image: req.file ? req.file.path : req.body.image, // Keep the existing image if not updated
      };

      const updatedItem = await Menu.findByIdAndUpdate(req.params.id, updatedData, { new: true });
      if (!updatedItem) return res.status(404).json({ error: "Menu item not found" });

      res.status(200).json(updatedItem);
    } catch (error) {
      res.status(400).json({ error: "Failed to update menu item" });
    }
  });
};

// Delete a menu item by ID
const deleteMenuItem = async (req, res) => {
  try {
    const deletedItem = await Menu.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ error: "Menu item not found" });
    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete menu item" });
  }
};

module.exports = { getMenu, addMenuItem, updateMenuItem, deleteMenuItem };
