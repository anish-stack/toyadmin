const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  product: [
    {
      id: { type: String },
      name: { type: String },
      price: { type: Number },
      quantity: { type: Number },
      image: [{ type: String }], // Define image as an array of strings
      sizes: { type: String }
    }
  ],

  Name:{
    type:String,
  },
  ContactNumber:{
    type:Number,
  },
  Email:{
    type:String,
  },
  State:{
    type:String,

  },
  Address:{
    type:String,
  },
  Landmark:{
    type:String,
  },
  TotalCost:{
    type:String,

  },
 
  orderStatus: {
    type: String,
    enum: ["Pending", "Success", "Delivered", "Canceled"],
    default: "Pending",
  },
}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;