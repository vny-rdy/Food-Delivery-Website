import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MainNavbar from "../../components/navbar/Navbar";

const Admin = () => {
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState([]);  // Initialize as an array
    const [formState, setFormState] = useState({
        id: null,
        name: "",
        category: "Appetizers",
        price: "",
        image: "",  // This will now be a file
        availability: true,
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const adminLoggedIn = localStorage.getItem("isAdminLoggedIn");
        if (adminLoggedIn !== "true") {
            navigate("/"); // Redirect to home if not logged in
        } else {
            fetchMenuItems();
        }
    }, [navigate]);

    const fetchMenuItems = async () => {
        try {
            const response = await axios.get("http://localhost:5001/api/menus/menu");
            // Ensure response is an array
            if (Array.isArray(response.data)) {
                setMenuItems(response.data);
            } else {
                console.error("API response is not an array", response.data);
                setMenuItems([]); // Fallback to empty array
            }
        } catch (error) {
            console.error("Failed to fetch menu items:", error);
            setMenuItems([]);  // Fallback to empty array if there's an error
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormState((prev) => ({ ...prev, [name]: files[0] }));
    };

    const handleAddOrUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", formState.name);
        formData.append("category", formState.category);
        formData.append("price", formState.price);
        formData.append("availability", formState.availability);
        formData.append("image", formState.image); // Append the file

        try {
            if (isEditing) {
                // Update item
                await axios.put(`http://localhost:5001/api/menus/menu/${formState.id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data", // Set the content type for file uploads
                    },
                });
            } else {
                // Add new item
                await axios.post("http://localhost:5001/api/menus/menu", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data", // Set the content type for file uploads
                    },
                });
            }
            fetchMenuItems();
            setFormState({
                id: null,
                name: "",
                category: "Appetizers",
                price: "",
                image: "", // Reset image file
                availability: true,
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save menu item:", error);
        }
    };

    const handleEdit = (item) => {
        setFormState(item);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5001/api/menus/menu/${id}`);
            fetchMenuItems();
        } catch (error) {
            console.error("Failed to delete menu item:", error);
        }
    };

    return (
        <div>
            <MainNavbar />
            <div className="p-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>

                {/* Form to Add/Edit Menu Item */}
                <form onSubmit={handleAddOrUpdate} className="mt-6">
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formState.name}
                            onChange={handleInputChange}
                            required
                            className="border p-2"
                        />
                    </div>
                    <div>
                        <label>Category:</label>
                        <select
                            name="category"
                            value={formState.category}
                            onChange={handleInputChange}
                            required
                            className="border p-2"
                        >
                            <option value="Appetizers">Appetizers</option>
                            <option value="Main Course">Main Course</option>
                            <option value="Desserts">Desserts</option>
                        </select>
                    </div>
                    <div>
                        <label>Price:</label>
                        <input
                            type="number"
                            name="price"
                            value={formState.price}
                            onChange={handleInputChange}
                            required
                            className="border p-2"
                        />
                    </div>
                    <div>
                        <label>Image:</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleFileChange}
                            required
                            className="border p-2"
                        />
                    </div>
                    <div>
                        <label>Availability:</label>
                        <input
                            type="checkbox"
                            name="availability"
                            checked={formState.availability}
                            onChange={(e) =>
                                setFormState((prev) => ({
                                    ...prev,
                                    availability: e.target.checked,
                                }))
                            }
                            className="ml-2"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 mt-4"
                    >
                        {isEditing ? "Update Item" : "Add Item"}
                    </button>
                </form>

                {/* List of Menu Items */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold">Menu Items</h2>
                    <ul>
                        {menuItems.map((item) => (
                            <li key={item._id} className="flex justify-between items-center border p-2 mt-2">
                                <span>{item.name}</span>
                                <div>
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="bg-yellow-500 text-white p-2 mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="bg-red-500 text-white p-2"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Admin;
