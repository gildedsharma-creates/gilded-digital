import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

// GET: Fetch orders (filter by userId for customers, or return all for admin)
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const query = userId ? { userId } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: orders }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create a new handmade decor order & decrement stock
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { userId, customerName, customerEmail, items, shippingAddress, paymentId } = body;

    if (!customerName || !customerEmail || !items || items.length === 0 || !shippingAddress) {
      return NextResponse.json(
        { success: false, error: "Missing required customer, item, or shipping details." },
        { status: 400 }
      );
    }

    let calculatedSubtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const isValidObjectId = mongoose.Types.ObjectId.isValid(item._id);

      if (isValidObjectId) {
        const dbProduct = await Product.findById(item._id);
        if (!dbProduct) {
          return NextResponse.json(
            { success: false, error: `Product "${item.name}" is no longer available.` },
            { status: 404 }
          );
        }
        if (dbProduct.stockCount < item.quantity) {
          return NextResponse.json(
            {
              success: false,
              error: `Only ${dbProduct.stockCount} left in stock for "${dbProduct.name}".`,
            },
            { status: 409 }
          );
        }

        // Decrement inventory count
        dbProduct.stockCount -= item.quantity;
        await dbProduct.save();

        calculatedSubtotal += dbProduct.price * item.quantity;
        verifiedItems.push({
          productId: dbProduct._id,
          name: dbProduct.name,
          price: dbProduct.price,
          quantity: item.quantity,
          image: dbProduct.images[0] || item.image,
        });
      } else {
        // Fallback for sample preview items before DB seeding
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

    // Free shipping on orders >= ₹1,500, otherwise ₹99 flat shipping
    const shippingFee = calculatedSubtotal >= 1500 ? 0 : 99;
    const totalAmount = calculatedSubtotal + shippingFee;

    const newOrder = await Order.create({
      userId: userId || "guest_customer",
      customerName,
      customerEmail,
      items: verifiedItems,
      totalAmount,
      shippingAddress,
      paymentId: paymentId || `COD_${Date.now()}`,
      status: "Pending",
    });

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}