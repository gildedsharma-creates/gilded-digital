"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, ShieldCheck, AlertCircle, CreditCard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.displayName || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<{ id: string; paymentId: string } | null>(null);

  const shippingFee = subtotal >= 1500 ? 0 : 99;
  const grandTotal = subtotal + shippingFee;

  const handleRazorpayCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      // 1. Create Razorpay Order on server
      const orderRes = await fetch("/api/payments/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Unable to initiate payment.");
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Gilded Sharma",
        description: "Handcrafted Artisan Decor Purchase",
        order_id: orderData.orderId,
        prefill: {
          name: customerName,
          email: customerEmail,
        },
        theme: {
          color: "#f59e0b", // Amber-500 matching Gilded Sharma branding
        },
        handler: async function (response: any) {
          try {
            // 3. Verify payment signature & create MongoDB Order
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user?.uid,
                customerName,
                customerEmail,
                items,
                shippingAddress: { street, city, state, postalCode, country },
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || "Payment verification failed.");
            }

            setCompletedOrder({
              id: verifyData.data._id,
              paymentId: response.razorpay_payment_id,
            });
            clearCart();
          } catch (err: any) {
            setErrorMsg(err.message);
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setErrorMsg(response.error.description || "Payment failed. Please try again.");
        setSubmitting(false);
      });
      rzp.open();
    } catch (err: any) {
      setErrorMsg(err.message);
      setSubmitting(false);
    }
  };

  if (completedOrder) {
    return (
      <section className="mx-auto max-w-xl px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-amber-500/30 bg-neutral-900/70 p-8 shadow-2xl"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Payment Successful & Order Confirmed!</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Thank you for supporting <span className="text-amber-400">Gilded Sharma</span>. Your handcrafted piece is now queued for studio dispatch.
          </p>

          <div className="mt-6 space-y-2 rounded-2xl border border-neutral-800 bg-neutral-950 p-4 text-xs text-neutral-300">
            <div>
              <span className="text-neutral-500">Order Reference ID: </span>
              <span className="font-mono font-bold text-amber-400">{completedOrder.id}</span>
            </div>
            <div>
              <span className="text-neutral-500">Razorpay Payment ID: </span>
              <span className="font-mono text-emerald-400">{completedOrder.paymentId}</span>
            </div>
          </div>

          <Link
            href="/shop"
            className="mt-8 inline-block rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-neutral-950 transition-transform hover:scale-105"
          >
            Continue Exploring Studio
          </Link>
        </motion.div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white">Nothing to checkout</h1>
        <p className="mt-2 text-neutral-400">Add handmade decor pieces to your bag first.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-amber-500 px-6 py-2.5 text-sm font-bold text-neutral-950"
        >
          Go to Shop
        </Link>
      </section>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-10 text-3xl font-extrabold text-white sm:text-4xl">
          Secure <span className="text-amber-400">Checkout</span>
        </h1>

        <form onSubmit={handleRazorpayCheckout} className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Shipping Form */}
          <div className="space-y-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8 lg:col-span-7">
            <h2 className="text-lg font-bold text-white">Delivery Address</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-400">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ananya Sharma"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-400">Email *</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="ananya@example.com"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-400">Street Address *</label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="House No. 42, Sector 18"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-400">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="New Delhi"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-400">State *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Delhi"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-400">PIN Code *</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="110001"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-bold text-neutral-950 transition-colors hover:bg-amber-400 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Opening Razorpay...</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  <span>Pay ₹{grandTotal.toLocaleString("en-IN")} via UPI / Card</span>
                </>
              )}
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 space-y-4">
              <h2 className="text-lg font-bold text-white">Order Summary</h2>
              <div className="divide-y divide-neutral-800">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <p className="font-medium text-neutral-200">{item.name}</p>
                      <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-neutral-200">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-800 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Insured Shipping</span>
                  <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between pt-2 text-base font-extrabold text-white">
                  <span>Total</span>
                  <span className="text-amber-400">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-neutral-950/70 p-3 text-xs text-neutral-400">
                <ShieldCheck className="h-4 w-4 shrink-0 text-amber-400" />
                <span>256-bit encrypted checkout powered by Razorpay (UPI, Cards, NetBanking).</span>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
}