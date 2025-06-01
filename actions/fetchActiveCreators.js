// File: actions/useractions.js
"use server";

import mongoose from "mongoose";
import User from "@/models/User";
// ... other imports and functions ...

export const fetchActiveCreators = async (limit = 10) => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }
  await mongoose.connect(process.env.MONGODB_URI);
  // console.log("Connected to MongoDB for fetchActiveCreators");

  try {
    const activeCreators = await User.find({
      RazorpayId: { $ne: null, $ne: "" }, // RazorpayId is not null and not an empty string
      RazorpaySecret: { $ne: null, $ne: "" } // RazorpaySecret is not null and not an empty string
    })
    .sort({ createdAt: -1 }) // Optional: sort by newest, or by last payment received, etc.
    .limit(limit)
    .select("username name profilePicture") // Select only needed fields
    .lean(); // Use .lean() for faster, plain JS objects

    return activeCreators;
  } catch (error) {
    console.error("Error fetching active creators:", error);
    return []; // Return an empty array on error
  }
};
