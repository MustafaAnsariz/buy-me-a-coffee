import Payment from "@/models/Payment";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  await mongoose.connect(process.env.MONGODB_URI);
  // Only fetch payments where done is true and payment sorted by createdAt in descending order and flatten the object
  // const payments = await Payment.find({ done: true }).sort({ createdAt: -1 }).lean();
  const payments = await Payment.find({ done: true }).sort({ createdAt: -1 }).lean();
  return NextResponse.json(payments);
}