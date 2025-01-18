import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  const [billingDetails, setBillingDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    country: "",
    state: "",
    zip: "",
  });

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (totalAmount) => {
    if (!validateBillingDetails()) {
      alert("Please fill in all required billing details.");
      return;
    }

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      key: "rzp_test_UN7RYbjuHhXEWY", // Replace with your Razorpay test key
      amount: totalAmount * 100, // Amount in paise
      currency: "INR",
      name: "Food Delivery",
      description: "Order Payment",
      image: "https://example.com/logo.png", // Replace with your logo
      handler: function (response) {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        navigate("/"); // Redirect to orders page after successful payment
      },
      prefill: {
        name: `${billingDetails.firstName} ${billingDetails.lastName}`,
        email: billingDetails.email,
        contact: "9999999999", // Replace with a valid contact number
      },
      theme: {
        color: "#F37254",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const validateBillingDetails = () => {
    const { firstName, lastName, email, address, country, state, zip } = billingDetails;
    return firstName && lastName && email && address && country && state && zip;
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails({ ...billingDetails, [name]: value });
  };

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-gray-700">No order found!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Your Order</h1>
        <div className="flex flex-col items-center">
          <img
            src={`https://food-delivery-website-6y8r.onrender.com/${order.image}`}
            alt={order.itemName}
            className="w-48 h-48 object-cover rounded-md shadow mb-4"
          />
          <h2 className="text-lg font-semibold text-gray-700">{order.itemName}</h2>
          <p className="text-gray-600 mt-2">
            <span className="font-semibold">Quantity:</span> {order.quantity}
          </p>
          <p className="text-gray-600 mt-2">
            <span className="font-semibold">Total Amount:</span> ₹{order.amount.toFixed(2)}
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Billing Details</h2>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="w-full p-2 border rounded mb-2"
            onChange={handleBillingChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="w-full p-2 border rounded mb-2"
            onChange={handleBillingChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded mb-2"
            onChange={handleBillingChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            className="w-full p-2 border rounded mb-2"
            onChange={handleBillingChange}
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            className="w-full p-2 border rounded mb-2"
            onChange={handleBillingChange}
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            className="w-full p-2 border rounded mb-2"
            onChange={handleBillingChange}
          />
          <input
            type="text"
            name="zip"
            placeholder="Zip Code"
            className="w-full p-2 border rounded mb-4"
            onChange={handleBillingChange}
          />
        </div>

        <button
          className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
          onClick={() => handlePayment(order.amount)}
        >
          Pay Now
        </button>
        <button
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
          onClick={() => navigate("/menu")} // Navigate back to the menu
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default OrderPage;
