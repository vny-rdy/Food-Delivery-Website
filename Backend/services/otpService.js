const twilio = require("twilio");
const Otp =require('../models/otpModel')
// Twilio credentials from your Twilio account
const accountSid = "ACefa706e9d2bb71d37678d74c9d880a4b"; // Twilio Account SID
const authToken = "363c93945c4e9aa8e0b6965b8774ba93";   // Twilio Auth Token
const client = twilio(accountSid, authToken);


exports.generateOtp = async (phone) => {
    if (!phone.startsWith('+')) {
      phone = `+91${phone}`; // Assuming Indian numbers
    }
  
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
  
    try {
      const record = await Otp.findOneAndUpdate(
        { phone },
        { otp, createdAt: new Date() },
        { upsert: true, new: true }
      );
      console.log(`Saved OTP in DB: ${record}`);
  
      await client.messages.create({
        body: `Your OTP is: ${otp}`, 
        to: phone,
        from: "+1 914 491 5791"
      });
      console.log(`OTP sent to ${phone}: ${otp}`);
      return otp;
    } catch (error) {
      console.error("Failed to send OTP via SMS:", error);
      throw new Error("Could not send OTP");
    }
  };
  

  exports.verifyOtp = async (phone, otp) => {
    if (!phone.startsWith('+')) {
        phone = `+91${phone}`; // Assuming Indian numbers
      }
    console.log(`Verifying OTP for phone: ${phone}, OTP provided: ${otp}`);
  
    try {
      const record = await Otp.findOne({ phone, otp });
      if (record) {
        console.log("OTP matched. Deleting the record...");
        await Otp.deleteOne({ phone, otp });
        return true;
      }
  
      console.log("OTP did not match or was not found.");
      return false;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return false;
    }
  };
  
  