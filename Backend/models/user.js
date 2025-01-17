const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  
  phone: { type: String, required: true, unique: true },
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/, // Alphanumeric and underscores only
  },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
},{ timestamps: true });

userSchema.index({ username: 1 }); // Index for username (optional)
module.exports = mongoose.model("User", userSchema);
