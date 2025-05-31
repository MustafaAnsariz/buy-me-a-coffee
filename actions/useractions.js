"use server";

import Razorpay from "razorpay";
import Payment from "@/models/Payment";
import mongoose from "mongoose";
import User from "@/models/User";
// import {set} from "mongoose"; // 'set' from mongoose is not typically used like this for updates.
// import Email from "next-auth/providers/email"; // This import seems unused in the provided code.

export const initiate = async (amount, to_user, paymentform) => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }
    await mongoose.connect(process.env.MONGODB_URI);
    // console.log("Connected to MongoDB for initiate");

    const user = await User.findOne({ username: to_user });
    if (!user) {
      throw new Error(`User ${to_user} not found for payment initiation.`);
    }
    if (!user.RazorpayId || !user.RazorpaySecret) {
        throw new Error(`Razorpay credentials not configured for user ${to_user}.`);
    }
    const secret = user.RazorpaySecret;
    const _id = user.RazorpayId;

    var instance = new Razorpay({
      key_id: _id,
      key_secret: secret,
    });

    const options = {
      amount: Number(amount) * 100, // Ensure amount is a number
      currency: "INR",
    };

    let x = await instance.orders.create(options);

    await Payment.create({
      oid: x.id,
      amount: Number(amount), // Ensure amount is a number
      to_user: to_user,
      name: paymentform.name,
      message: paymentform.message,
    });

    return x;
  } catch (error) {
    console.error("Error in initiate function:", error);
    // Re-throw the error or handle it as per your application's error handling strategy
    // For instance, you might want to throw a more generic error to the client
    throw new Error("Failed to initiate payment. " + error.message);
  }
};

export const fetchuser = async (username) => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }
  await mongoose.connect(process.env.MONGODB_URI);
  // console.log("Connected to MongoDB for fetchuser");
  let u = await User.findOne({ username: username });
  if (!u) {
    // console.warn(`User not found with username: ${username}`);
    throw new Error("User not found");
  }
  let user = u.toObject({flattenObjectIds: true});
  return user;
};

export const updateProfile = async (OldUsername, data) => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }
  await mongoose.connect(process.env.MONGODB_URI);
  // console.log("Connected to MongoDB for updateProfile");
  let ndata = data; 

  if (OldUsername !== ndata.username) {
    // Username is intended to be changed
    const existingUserWithNewUsername = await User.findOne({ username: ndata.username });
    
    // Check if the new username is already taken by a DIFFERENT user
    // (i.e., different email, assuming email is unique and the primary identifier for user account)
    if (existingUserWithNewUsername && existingUserWithNewUsername.email !== ndata.email) {
      throw new Error("Username already exists. Please choose a different one.");
    }
    
    // Update the user document with all new data, including the new username
    // It's crucial to identify the user by a non-changing field like email or _id
    const userUpdateResult = await User.updateOne({ email: ndata.email }, { $set: ndata });

    if (userUpdateResult.matchedCount === 0) {
      throw new Error("Original user profile not found to update (matched by email).");
    }
    // Optional: Check userUpdateResult.modifiedCount if needed, though not strictly necessary for this flow.

    // Update payment records to reflect the new username
    await Payment.updateMany(
      { to_user: OldUsername },
      { $set: { to_user: ndata.username } }
    );

    // For username changes, return the submitted data (ndata).
    // The Dashboard component will handle the session update by forcing a re-login.
    // This avoids potential race conditions with fetching the user by the new username immediately.
    return { ...ndata }; 

  } else {
    // Username did not change, just update other fields
    // Identify user by email
    const updateResult = await User.updateOne({ email: ndata.email }, { $set: ndata });

    if (updateResult.matchedCount === 0) {
      throw new Error("Original user profile not found to update (matched by email).");
    }

    // Fetch and return the fully updated user document since username didn't change
    const updatedUserDocument = await User.findOne({ email: ndata.email });
    if (!updatedUserDocument) {
      // This should ideally not happen if the update was successful
      throw new Error("Failed to retrieve user profile after update.");
    }
    return updatedUserDocument.toObject({ flattenObjectIds: true });
  }
};
