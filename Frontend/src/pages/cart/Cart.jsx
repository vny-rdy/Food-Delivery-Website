import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MainNavbar from "../../components/navbar/Navbar";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = localStorage.getItem("username"); // Assuming user ID is stored in localStorage
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/signup"); // Redirect to signup if user is not logged in
            return;
        }

        const fetchCartItems = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/cart/${user}`);
                setCartItems(response.data.items || []);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch cart items:", err);
                setError("Failed to load cart items");
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [user, navigate]);

    const handleRemoveItem = async (itemId) => {
        try {
            const response = await axios.post(`http://localhost:5001/api/cart/removeItem`, { user, itemId });
            setCartItems(response.data.items); // Update the cart after removing the item
            alert("Item removed from cart successfully!");
        } catch (error) {
            console.error("Error removing item from cart:", error);
            alert("Failed to remove item. Please try again.");
        }
    };

    const handleCheckout = () => {
        if (!user) {
            navigate("/signup");
        } else if (Cart.length === 0) {
            alert("Your cart is empty!");
        } else {
            navigate("/orders", { state: { orders: cart } });
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <MainNavbar />
            <div className="p-6 bg-slate-100">
                <h1 className="text-3xl font-bold">Your Cart</h1>

                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <div>
                        <ul>
                            {cartItems.map((item) => (
                                <li key={item._id} className="flex gap-4 items-center p-4 border-b">
                                    <img
                                        src={`http://localhost:5001/${item.image}`}
                                        alt={item.itemName}
                                        className="w-20 h-20 object-cover"
                                    />
                                    <div className="flex-grow">
                                        <h2 className="text-lg font-bold">{item.itemName}</h2>
                                        <p className="text-gray-600">₹{item.amount.toFixed(2)}</p>
                                        <p>Quantity: {item.quantity}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveItem(item._id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold">
                                Total: ₹
                                {cartItems.reduce(
                                    (total, item) => total + item.amount * item.quantity,
                                    0
                                ).toFixed(2)}
                            </h2>
                            <button
                                onClick={handleCheckout}
                                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 mt-4"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;