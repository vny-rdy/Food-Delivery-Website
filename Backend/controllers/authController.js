const otpService = require("../services/otpService"); // Simulated OTP service
const User = require("../models/user"); // Mongoose Model
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
// Validate Indian phone numbers
const validatePhone = (phone) => /^(?:\+91|91)?[6789]\d{9}$/.test(phone);
const JWT_SECRET = "e8f5c6b2a5b9d8c3f7e2a4b5c6d8f2e4a6b7c9d1e2f3a5c6e7d9b8a1f2c3e4d5";

// Send OTP
exports.sendOtp = async (req, res) => {
  let { phone } = req.body;

  if (!phone.startsWith('+')) {
    phone = `+91${phone}`; // Assuming Indian numbers
  }

  if (!phone || !validatePhone(phone)) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing phone number. Please provide a valid Indian phone number.",
    });
  }

  try {
    const existingUser = await User.findOne({phone});
    await otpService.generateOtp(phone);
    res.status(200).json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP. Please try again later." });
  }
};
// Verify OTP
exports.verifyOtp = async (req, res) => {
  let { phone, otp } = req.body;
  if (!phone.startsWith('+')) {
    phone = `+91${phone}`; // Assuming Indian numbers
  }

  if (!phone || !otp) {
    return res.status(400).json({
      success: false,
      message: "Both phone number and OTP are required.",
    });
  }

  try {
    const isValid = await otpService.verifyOtp(phone, otp);
    if (isValid) {
      return res.status(200).json({ success: true, message: "OTP verified successfully." });
    } else {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "Failed to verify OTP. Please try again later." });
  }
};

// Set or update username
exports.setUsername = async (req, res) => {
  const { phone, username } = req.body;

  if (!phone || !username) {
    return res.status(400).json({
      success: false,
      message: "Both phone number and username are required.",
    });
  }

  try {
    const user = await User.findOneAndUpdate(
      { phone },
      { username },
      { upsert: true, new: true }
    );
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error setting username:", error);
    res.status(500).json({ success: false, message: "Failed to set username. Please try again later." });
  }
};

exports.signup = async (req, res) => {
  const { phone, username, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = new User({ phone, username, password: hashedPassword });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "7d" });

    // Respond with token and user details
    res.json({
      success: true,
      token,
      user: { id: newUser._id, username: newUser.username, phone: newUser.phone },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login Route
exports.login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    // Find user by phone number
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    // Respond with token and user details
    res.json({
      success: true,
      token,
      user: { id: user._id, username: user.username, phone: user.phone },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
exports.setPassword = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({
      success: false,
      message: "Phone number and password are required.",
    });
  }

  try {
    console.log("setPassword endpoint triggered:", req.body);

    // Find user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      console.log("User not found for phone:", phone);
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    console.log("User fetched from database:", user);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Generated hashed password:", hashedPassword);

    // Update and save the user's password
    user.password = hashedPassword;
    await user.save().catch((err) => {
      console.error("Error saving user:", err);
      throw err;
    });

    console.log("Password successfully updated for user:", user);

    res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    console.error("Error setting password:", error);
    res.status(500).json({
      success: false,
      message: "Failed to set password. Please try again later.",
    });
  }
};

