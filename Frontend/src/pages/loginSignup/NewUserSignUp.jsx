import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./signup.css";

const NewUserSignup = () => {
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }

    if (!phone || !username || !password) {
      setPasswordError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post("https://food-delivery-website-i79e.onrender.com/api/auth/signup", {
        phone,
        username,
        password,
      });
      if (response.data.success) {
        localStorage.setItem("username", username);
        alert("Signup successful!");
        navigate("/", { state: { username } });
      } else {
        alert(response.data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error.response?.data || error.message);
      alert("Signup failed. Please try again.");
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="signup-container">
      <h2 className="text-center">New User</h2>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input-field"
        />
        {passwordError && <p className="error">{passwordError}</p>}
        <button onClick={handleSignup} className="btn-primary">Signup</button>
      </div>

      <div className="login-container text-center">
        <p>
          Already have an account?{" "}
          <button onClick={handleLogin} className="btn-link text-blue-500 hover:font-semibold">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default NewUserSignup;
