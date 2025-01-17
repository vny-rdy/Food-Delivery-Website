const express = require('express');
const dotenv = require('dotenv');
const connectMongoDB = require('./config/dbMongo').default;
const cors = require('cors');
const bodyParser = require('body-parser');
// const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/authRoutes')
const menuRoutes = require('./routes/menuRoutes')
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')

const app = express();
const PORT = 5001;
dotenv.config();
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Connect Databases
connectMongoDB();

// app.use('/api/home', homeRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/order",orderRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
