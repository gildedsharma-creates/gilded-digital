import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { Product } from "@/models/Product";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    await connectDB();
    const { items } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: "Cart is empty." }, { status: 400 });
    }

    let subtotal = 0;

    for (const item of items) {
      if (mongoose.Types.ObjectId.isValid(item._id)) {
        const dbProduct = await Product.findById(item._id);
        if (!dbProduct) {
          return NextResponse.json(
            { success: false, error: `Product "${item.name}" not found.` },
            { status: 404 }
          );
        }
        if (dbProduct.stockCount < item.quantity) {
          return NextResponse.json(
            { success: false, error: `Insufficient stock for "${dbProduct.name}".` },
            { status: 409 }
          );
        }
        subtotal += dbProduct.price * item.quantity;
      } else {
        // Fallback for local sample preview items
        subtotal += item.price * item.quantity;
      }
    }

    const shippingFee = subtotal >= 1500 ? 0 : 99;
    const totalAmountINR = subtotal + shippingFee;

    // Razorpay expects amount in smallest currency unit (paise: ₹1 = 100 paise)
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(totalAmountINR * 100),
      currency: "INR",
      receipt: `gilded_rcpt_${Date.now()}`,
    });

    return NextResponse.json(
      {
        success: true,
        orderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}