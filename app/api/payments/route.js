// File: app/api/payments/route.js
import mongoose from "mongoose";
import Payment from "@/models/Payment"; // Ensure this path is correct for your Payment model
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ success: false, error: "Username query parameter is required" }, { status: 400 });
    }

    // Fetch payments where 'done' is true AND 'to_user' matches the provided username.
    // Sorted by creation date in descending order.
    const payments = await Payment.find({ done: true, to_user: username })
      .sort({ createdAt: -1 })
      .lean(); // .lean() for faster queries if you don't need Mongoose documents

    return NextResponse.json({ success: true, payments });

  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
