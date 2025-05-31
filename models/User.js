import mongoose from "mongoose";
import Razorpay from "razorpay";
const {Schema, model} = mongoose;

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true},
    name: {type: String},
    profilePicture: {type: String},
    coverPicture: {type: String},
    RazorpayId: {type: String},
    RazorpaySecret: {type: String},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},

   // Add any additional fields if needed
 } )

 export default  mongoose.models.User || model("User", userSchema);
