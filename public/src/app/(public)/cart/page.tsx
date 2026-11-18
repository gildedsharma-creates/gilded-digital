"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();

  const shippingFee = subtotal === 0 || subtotal >= 1500 ? 0 : 99;
  const grandTotal = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <section className="mx-auto flex min-h-[65vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
        <div className="mb-5 rounded-full border border-neutral-800 bg-neutral-900 p-5 text-amber-400">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold text-white">Your Shopping Bag is Empty</h1>
        <p className="mt-2 max-w-md text-neutral-400">
          Explore handcrafted wall mandalas, resin trays, and artisan decor pieces created in the Gilded Sharma studio.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-neutral-950 transition-transform hover:scale-105"
        >
          <span>Browse Handmade Decor</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
          Your <span className="text-amber-400">Shopping Bag</span>
        </h1>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Cart Items List */}
        <div className="space-y-4 lg:col-span-8">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="flex flex-col gap-4 rounded-2xl border border-neutral-800/80 bg-neutral-900/50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 shrink-0 rounded-xl object-cover bg-neutral-800"
                  />
                  <div>
                    <Link
                      href={`/shop/${item.slug}`}
                      className="font-bold text-neutral-100 hover:text-amber-400 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm font-semibold text-amber-400">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-neutral-500">{item.stockCount} available in studio</p>
                  </div>
                </div>

                {/* Quantity & Remove Controls */}
                <div className="flex items-center justify-between gap-6 sm:justify-end">
                  <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-950 p-1">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-9 text-center text-sm font-semibold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      disabled={item.quantity >= item.stockCount}
                      className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="rounded-lg p-2 text-neutral-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary Box */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 space-y-5">
            <h2 className="text-lg font-bold text-white">Order Summary</h2>

            <div className="space-y-3 border-b border-neutral-800 pb-4 text-sm">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span className="font-medium text-neutral-200">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Shipping</span>
                <span className="font-medium text-neutral-200">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-400">FREE</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>
              {subtotal < 1500 && (
                <p className="text-xs text-amber-400/90">
                  Add ₹{(1500 - subtotal).toLocaleString("en-IN")} more for free insured shipping!
                </p>
              )}
            </div>

            <div className="flex justify-between text-base font-extrabold text-white">
              <span>Total</span>
              <span className="text-amber-400">₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>

            <Link
              href="/checkout"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3.5 text-sm font-bold text-neutral-950 transition-colors hover:bg-amber-400"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}