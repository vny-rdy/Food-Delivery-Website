import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google'; // You need to install this package
import './signup.css';
import NewUserSignup from "./NewUserSignUp";

const Signup = () => {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");  
  const [confirmPassword, setConfirmPassword] = useState("");  
  const [passwordError, setPasswordError] = useState("");  
  const [showUsernameSection, setShowUsernameSection] = useState(false); // Control username input visibility
  const [showPasswordSection, setShowPasswordSection] = useState(false); // Control password input visibility
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5001/api/auth/send-otp", { phone });
      if (response.data.success) {
        setOtpSent(true);
        alert("OTP sent successfully!");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!phone || !otp) {
      alert("Phone and OTP are required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/api/auth/verify-otp", { phone, otp });
      if (response.data.success) {
        setShowUsernameSection(true); // Show username section after OTP verification
      } else {
        alert(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error.response?.data || error.message);
      alert("Failed to verify OTP. Please try again.");
    }
  };

  const handleSetUsername = () => {
    if (!username) {
      alert("Username is required.");
      return;
    }
    setShowPasswordSection(true); // Show password section after username is entered
  };

  const handleSetPassword = async () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }

    if (!password || !confirmPassword) {
      setPasswordError("Password and Confirm Password are required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/api/auth/set-username", { phone, username, password });
      if (response.data.success) {
        localStorage.setItem("username", username);
        alert("Username and password set successfully!");
        navigate("/", { state: { username } });
      } else {
        alert(response.data.message || "Failed to set username and password.");
      }
    } catch (error) {
      console.error("Error setting username and password:", error);
      alert("Failed to set username and password. Please try again.");
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleGoogleSignIn = async (response) => {
    console.log('Google login response:', response);
  
    if (response.credential) {
      try {
        // Send the Google token to the backend for verification
        const { data } = await axios.post('http://localhost:5001/api/google-auth/google-login', {
          token: response.credential,  // Send the Google token here
        });
  
        if (data.success) {
          alert('Google login successful!');
          // Handle the successful login (e.g., navigate or store user data)
          navigate('/');
        } else {
          alert('Google login failed');
        }
      } catch (error) {
        console.error('Error during Google login:', error);
        alert('An error occurred during Google login.');
      }
    }
  };
  
  return (
    <div className="signup-container">
      <h1>For Registered Phone Numbers Only</h1>
      {!otpSent ? (
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-field"
          />
          <button onClick={handleSendOtp} className="btn-primary">Send OTP</button>
        </div>
      ) : (
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="input-field"
          />
          <button onClick={handleVerifyOtp} className="btn-primary">Verify OTP</button>
        </div>
      )}

      {showUsernameSection && !showPasswordSection && (
        <div className="username-popup input-group">
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
          />
          <button onClick={handleSetUsername} className="btn-primary">Set Username</button>
        </div>
      )}

      {showPasswordSection && (
        <div className="password-popup input-group">
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
          <button onClick={handleSetPassword} className="btn-primary">Set Password</button>
        </div>
      )}

      <div className="google-signin">
        <GoogleLogin
          onSuccess={handleGoogleSignIn} // Handle success response
          onError={() => alert('Google login failed!')}
          useOneTap
        />
      </div>
      <div className="login-container text-center">
        <p>Already have an account? <button onClick={handleLogin} className="btn-link text-blue-500 hover:font-semibold">Login</button></p>
      </div>
      <h1>For New Users</h1>
      <button className="btn-primary"
      onClick={() => navigate('/newUserSignup')}
      >Sign Up</button>
    </div>
  );
};

export default Signup;
