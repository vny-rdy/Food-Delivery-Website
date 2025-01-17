const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp, setUsername,signup,login,setPassword } = require("../controllers/authController");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/set-username", setUsername);
router.post("/signup",signup);
router.post("/login",login);
router.post("/set-password",setPassword);
module.exports = router;
