import { NextResponse } from "next/server";
import crypto from "crypto";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      customerName,
      customerEmail,
      items,
      shippingAddress,
    } = body;

    // 1. Verify HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature. Verification failed." },
        { status: 400 }
      );
    }

    // 2. Deduct inventory and build verified line items
    let calculatedSubtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      if (mongoose.Types.ObjectId.isValid(item._id)) {
        const dbProduct = await Product.findById(item._id);
        if (dbProduct) {
          dbProduct.stockCount = Math.max(0, dbProduct.stockCount - item.quantity);
          await dbProduct.save();

          calculatedSubtotal += dbProduct.price * item.quantity;
          verifiedItems.push({
            productId: dbProduct._id,
            name: dbProduct.name,
            price: dbProduct.price,
            quantity: item.quantity,
            image: dbProduct.images[0] || item.image,
          });
        }
      } else {
        calculatedSubtotal += item.price * item.quantity;
        verifiedItems.push({
          productId: new mongoose.Types.ObjectId(),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        });
      }
    }

    const shippingFee = calculatedSubtotal >= 1500 ? 0 : 99;
    const totalAmount = calculatedSubtotal + shippingFee;

    // 3. Save paid order to MongoDB
    const newOrder = await Order.create({
      userId: userId || "guest_customer",
      customerName,
      customerEmail,
      items: verifiedItems,
      totalAmount,
      shippingAddress,
      paymentId: razorpay_payment_id,
      status: "Processing",
    });

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}