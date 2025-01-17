const mongoose= require('mongoose');
const menuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: ["Appetizers", "Main Course", "Desserts"], required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    availability: { type: Boolean, default: true },
  },
  { timestamps: true } );
  menuSchema.index({name:1});
  module.exports=mongoose.model("Menu",menuSchema);
