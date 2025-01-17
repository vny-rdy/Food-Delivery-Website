import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom"; // Using useNavigate for redirect
import MainNavbar from "../../components/navbar/Navbar";

const Menu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("All");
    const [sortOrder, setSortOrder] = useState("none");
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(localStorage.getItem("username") || null); // Check if user is logged in based on local storage
    const [popupMessage, setPopupMessage] = useState(""); // State for popup message
    const [showPopup, setShowPopup] = useState(false); // State for showing popup
    const [showOrderPopup, setShowOrderPopup] = useState(false); // State for order confirmation popup
    const [currentOrder, setCurrentOrder] = useState(null); // State for the current order
    const navigate = useNavigate(); // Use navigate hook

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get("https://food-delivery-website-6y8r.onrender.com/api/menus/menu");
                const itemsWithQuantity = response.data.map(item => ({ ...item, quantity: 1 }));
                setMenuItems(itemsWithQuantity);
                setFilteredItems(itemsWithQuantity);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch menu items:", err);
                setError("Failed to load menu items");
                setLoading(false);
            }
        };
        fetchMenuItems();
    }, []);

    const handleFilterChange = (category) => {
        setFilter(category);
        if (category === "All") {
            setFilteredItems(menuItems);
        } else {
            setFilteredItems(menuItems.filter((item) => item.category === category));
        }
    };

    const handleSortChange = () => {
        let sortedItems = [...filteredItems];
        if (sortOrder === "none" || sortOrder === "desc") {
            sortedItems.sort((a, b) => a.price - b.price);
            setSortOrder("asc");
        } else if (sortOrder === "asc") {
            sortedItems.sort((a, b) => b.price - a.price);
            setSortOrder("desc");
        }
        setFilteredItems(sortedItems);
    };

    const handleQuantityChange = (item, action) => {
        const updatedItems = [...filteredItems];
        const index = updatedItems.findIndex(i => i._id === item._id);
        if (index > -1) {
            if (action === 'increase') {
                updatedItems[index].quantity += 1;
            } else if (action === 'decrease' && updatedItems[index].quantity > 1) {
                updatedItems[index].quantity -= 1;
            }
            setFilteredItems(updatedItems);
        }
    };

    const handleAddToCart = async (item) => {
        if (!user) {
            navigate("/signup");
        } else {
            const cartItem = {
                userId: user,
                itemName: item.name,
                quantity: item.quantity || 1,
                amount: item.price,
                image: item.image,
            };
    
            console.log("Cart Item:", cartItem); // Log the cart item
    
            try {
                await axios.post("https://food-delivery-website-6y8r.onrender.com/api/cart/addToCart", cartItem);
    
                // Update frontend state
                const existingItemIndex = cart.findIndex((i) => i._id === item._id);
                if (existingItemIndex !== -1) {
                    const updatedCart = [...cart];
                    updatedCart[existingItemIndex].quanxtity += item.quantity;
                    setCart(updatedCart);
                } else {
                    setCart([...cart, cartItem]);
                }
    
                setPopupMessage(`Yay!😊 ${item.quantity} delicious ${item.name} added to your cart! 🎉`);
                setShowPopup(true);
    
                setTimeout(() => {
                    setShowPopup(false);
                }, 3000);
            } catch (error) {
                console.error("Error adding item to cart:", error);
                alert("Something went wrong. Please try again.");
            }
        }
    };
    

    const handleOrder = (item) => {
        if (!user) {
            navigate("/signup");
        } else {
            setCurrentOrder(item);
            setShowOrderPopup(true); // Show the confirmation popup
        }
    };

    const confirmOrder = async () => {
        if (!currentOrder) return; // Ensure there's an order to confirm
    
        const orderData = {
            userId: user, // The ID of the logged-in user
            itemName: currentOrder.name,
            quantity: currentOrder.quantity,
            amount: currentOrder.quantity * currentOrder.price, // Total amount for the order
            image: currentOrder.image,
        };
    
        try {
            await axios.post("https://food-delivery-website-6y8r.onrender.com/api/order/confirmOrder", orderData);
    
            // Navigate to the order page with the confirmed order
            navigate(`/order/${user}`, { state: { order: orderData } });
    
            // Reset the current order
            setCurrentOrder(null);
            setShowOrderPopup(false);
        } catch (error) {
            console.error("Error confirming order:", error);
            alert("Failed to confirm order. Please try again.");
        }
    };


    const cancelOrder = () => {
        setShowOrderPopup(false);
        setCurrentOrder(null);
    };




    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <MainNavbar />
            <div className="p-6 bg-slate-100">
                <h1 className="text-3xl font-bold">Menu</h1>
                <div className="flex gap-4 my-4">
                    {["All", "Appetizers", "Main Course", "Desserts"].map((category) => (
                        <button
                            key={category}
                            onClick={() => handleFilterChange(category)}
                            className={`px-4 py-2 rounded ${
                                filter === category ? "bg-slate-400 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handleSortChange}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                        {sortOrder === "none" ? "Sort by Price" : sortOrder === "asc" ? "Price: Low to High" : "Price: High to Low"}
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                    {filteredItems.map((item) => (
                        <div key={item._id} className="border p-4 rounded shadow">
                            <img
                                src={`https://food-delivery-website-6y8r.onrender.com/${item.image}`}
                                alt={item.name}
                                className="w-full h-40 object-cover mb-4"
                            />
                            <h2 className="text-lg font-bold">{item.name}</h2>
                            <p className="text-gray-600">{item.category}</p>
                            <p className="text-gray-800 font-bold">₹{item.price.toFixed(2)}</p>
                            <p className={`mt-2 ${item.availability ? "text-green-600" : "text-red-600"}`}>
                                {item.availability ? "Available" : "Out of Stock"}
                            </p>

                            {/* Quantity control */}
                            <div className="flex items-center gap-2 mt-4">
                                <button
                                    onClick={() => handleQuantityChange(item, 'decrease')}
                                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded"
                                >
                                    -
                                </button>
                                <span className="text-lg">{item.quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(item, 'increase')}
                                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded"
                                >
                                    +
                                </button>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <button
                                    onClick={() => handleAddToCart(item)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Add to Cart
                                </button>
                                <button onClick={() => handleOrder(item)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                                    Order
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cart information */}
                {cart.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold">Cart</h2>
                        <ul>
                            {cart.map((item, index) => (
                                <li key={index}>
                                    {item.name} x{item.quantity} - ₹{(item.price * item.quantity).toFixed(2)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
            </div>
             {/* Order Confirmation Popup */}
             {showOrderPopup && currentOrder && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-bold">Confirm Your Order</h2>
                        <p>
                            {currentOrder.quantity} x {currentOrder.name} - ₹
                            {(currentOrder.quantity * currentOrder.price).toFixed(2)}
                        </p>
                        <div className="flex gap-4 mt-4">
                            <button onClick={confirmOrder} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Confirm Order
                            </button>
                            <button onClick={cancelOrder} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            

            {/* Popup for item added to cart */}
            {showPopup && (
                <div className="popup fixed top-[20%] right-[-15%] transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-lg z-50">
                    <p>{popupMessage}</p>
                    <button
                        onClick={() => setShowPopup(false)}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Close
                    </button>
                </div>
            )}
            
        </div>
    );
};

export default Menu;
