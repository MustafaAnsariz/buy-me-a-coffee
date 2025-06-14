// File: actions/useractions.js
"use server";

import mongoose from "mongoose";
import User from "@/models/User";

let cachedConnection = null;

async function connectDB() {
  if (cachedConnection) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    cachedConnection = mongoose.connection;
    console.log("Connected to MongoDB for fetchActiveCreators");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to database");
  }
}

export const fetchActiveCreators = async (limit = 10) => {
  try {
    await connectDB();

    const query = {
      $and: [
        { RazorpayId: { $exists: true, $ne: "" } },
        { RazorpaySecret: { $exists: true, $ne: "" } }
      ]
    };

    const activeCreators = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(limit ? parseInt(limit) : undefined)
      .select("username name profilePicture")
      .lean();

    return activeCreators;
  } catch (error) {
    console.error("Error fetching active creators:", error);
    throw error; // Let the component handle the error
  }
};
