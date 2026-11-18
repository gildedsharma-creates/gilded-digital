"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { uploadImageToFirebase } from "@/lib/uploadImage";
import {
  Lock,
  LogOut,
  PlusCircle,
  Package,
  Calendar,
  Code2,
  Loader2,
  CheckCircle2,
  Upload,
} from "lucide-react";

type AdminTab = "add-product" | "add-project" | "orders" | "bookings";

export default function AdminDashboardPage() {
  const { user, isAdmin, loading, signInWithGoogle, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("add-product");

  // Product Form State
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState("Wall Art");
  const [prodPrice, setProdPrice] = useState("");
  const [prodStock, setProdStock] = useState("5");
  const [prodDimensions, setProdDimensions] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodFile, setProdFile] = useState<File | null>(null);
  const [prodFeatured, setProdFeatured] = useState(true);

  // Project Form State
  const [projTitle, setProjTitle] = useState("");
  const [projSummary, setProjSummary] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projTech, setProjTech] = useState("Next.js, TypeScript, Tailwind CSS, MongoDB");
  const [projLiveUrl, setProjLiveUrl] = useState("");
  const [projGithubUrl, setProjGithubUrl] = useState("");
  const [projFile, setProjFile] = useState<File | null>(null);
  const [projFeatured, setProjFeatured] = useState(true);

  // Orders & Bookings Lists
  const [orders, setOrders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    async function loadAdminData() {
      const [ordersRes, bookingsRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/bookings"),
      ]);
      const ordersJson = await ordersRes.json();
      const bookingsJson = await bookingsRes.json();
      if (ordersJson.success) setOrders(ordersJson.data);
      if (bookingsJson.success) setBookings(bookingsJson.data);
    }
    loadAdminData();
  }, [isAdmin]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodFile) return alert("Please select a product image.");
    setSubmitting(true);
    try {
      const imageUrl = await uploadImageToFirebase(prodFile, "products");
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: prodName,
          category: prodCategory,
          price: Number(prodPrice),
          stockCount: Number(prodStock),
          dimensions: prodDimensions,
          description: prodDesc,
          images: [imageUrl],
          isFeatured: prodFeatured,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setProdName("");
      setProdPrice("");
      setProdDimensions("");
      setProdDesc("");
      setProdFile(null);
      showToast("Handmade product published to store!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projFile) return alert("Please select a project thumbnail.");
    setSubmitting(true);
    try {
      const thumbnailUrl = await uploadImageToFirebase(projFile, "projects");
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: projTitle,
          summary: projSummary,
          description: projDesc || projSummary,
          thumbnail: thumbnailUrl,
          liveUrl: projLiveUrl,
          githubUrl: projGithubUrl,
          techStack: projTech.split(",").map((t) => t.trim()).filter(Boolean),
          isFeatured: projFeatured,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setProjTitle("");
      setProjSummary("");
      setProjDesc("");
      setProjLiveUrl("");
      setProjGithubUrl("");
      setProjFile(null);
      showToast("Portfolio project added!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto flex min-h-[65vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 rounded-full border border-amber-500/30 bg-amber-500/10 p-4 text-amber-400">
          <Lock className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-white">Gilded Sharma Studio Login</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Sign in with your authorized Google account to manage products, projects, and bookings.
        </p>
        <button
          onClick={signInWithGoogle}
          className="mt-6 rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-neutral-950 transition-transform hover:scale-105"
        >
          Sign in with Google
        </button>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="mx-auto flex min-h-[65vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold text-red-400">Access Restricted</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Signed in as <span className="text-white">{user.email}</span>, which does not have admin privileges.
        </p>
        <button
          onClick={logout}
          className="mt-6 rounded-full border border-neutral-700 px-5 py-2 text-sm text-neutral-300 hover:text-white"
        >
          Sign Out
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Top Bar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            Studio <span className="text-amber-400">Admin Dashboard</span>
          </h1>
          <p className="text-sm text-neutral-400">Welcome back, Kundan ({user.email})</p>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm text-neutral-300 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>

      {toastMsg && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {[
          { id: "add-product", label: "Add Handmade Decor", icon: PlusCircle },
          { id: "add-project", label: "Add Dev Project", icon: Code2 },
          { id: "orders", label: `Orders (${orders.length})`, icon: Package },
          { id: "bookings", label: `Bookings (${bookings.length})`, icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-amber-500 text-neutral-950"
                  : "border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ADD HANDMADE PRODUCT */}
      {activeTab === "add-product" && (
        <form
          onSubmit={handleCreateProduct}
          className="max-w-2xl space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8"
        >
          <h2 className="text-xl font-bold text-white">Publish New Handmade Decor</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-neutral-400">Product Title *</label>
              <input
                type="text"
                required
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                placeholder="Gilded Lotus Wall Mandala"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-neutral-400">Category *</label>
              <input
                type="text"
                required
                value={prodCategory}
                onChange={(e) => setProdCategory(e.target.value)}
                placeholder="Wall Art / Desk & Table / Lighting"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs text-neutral-400">Price (₹ INR) *</label>
              <input
                type="number"
                required
                value={prodPrice}
                onChange={(e) => setProdPrice(e.target.value)}
                placeholder="1499"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-neutral-400">Stock Count *</label>
              <input
                type="number"
                required
                value={prodStock}
                onChange={(e) => setProdStock(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-neutral-400">Dimensions</label>
              <input
                type="text"
                value={prodDimensions}
                onChange={(e) => setProdDimensions(e.target.value)}
                placeholder="12 x 12 inches"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-neutral-400">Description *</label>
            <textarea
              rows={3}
              required
              value={prodDesc}
              onChange={(e) => setProdDesc(e.target.value)}
              placeholder="Materials used, finish details, care instructions..."
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-neutral-400">Product Photo *</label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-neutral-700 bg-neutral-950 p-4 text-sm text-neutral-400 hover:border-amber-400">
              <Upload className="h-5 w-5 text-amber-400" />
              <span>{prodFile ? prodFile.name : "Choose image file to upload to Firebase"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setProdFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm text-neutral-300">
            <input
              type="checkbox"
              checked={prodFeatured}
              onChange={(e) => setProdFeatured(e.target.checked)}
              className="accent-amber-500"
            />
            <span>Feature on Home Page</span>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-neutral-950 hover:bg-amber-400 disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>Publish Product</span>
          </button>
        </form>
      )}

      {/* TAB 2: ADD DEV PROJECT */}
      {activeTab === "add-project" && (
        <form
          onSubmit={handleCreateProject}
          className="max-w-2xl space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8"
        >
          <h2 className="text-xl font-bold text-white">Add Portfolio Project</h2>

          <div>
            <label className="mb-1 block text-xs text-neutral-400">Project Title *</label>
            <input
              type="text"
              required
              value={projTitle}
              onChange={(e) => setProjTitle(e.target.value)}
              placeholder="Next.js SaaS Analytics Dashboard"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-neutral-400">Short Summary *</label>
            <textarea
              rows={2}
              required
              value={projSummary}
              onChange={(e) => setProjSummary(e.target.value)}
              placeholder="High-level overview of the problem solved and architecture..."
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-neutral-400">Tech Stack (comma separated) *</label>
            <input
              type="text"
              required
              value={projTech}
              onChange={(e) => setProjTech(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-neutral-400">Live Demo URL</label>
              <input
                type="url"
                value={projLiveUrl}
                onChange={(e) => setProjLiveUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-neutral-400">GitHub Repo URL</label>
              <input
                type="url"
                value={projGithubUrl}
                onChange={(e) => setProjGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-neutral-400">Project Thumbnail *</label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-neutral-700 bg-neutral-950 p-4 text-sm text-neutral-400 hover:border-amber-400">
              <Upload className="h-5 w-5 text-amber-400" />
              <span>{projFile ? projFile.name : "Choose thumbnail screenshot"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setProjFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-neutral-950 hover:bg-amber-400 disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>Save Project</span>
          </button>
        </form>
      )}

      {/* TAB 3: INCOMING ORDERS */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-neutral-400">No decor orders placed yet.</p>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-white">
                    {order.customerName} ({order.customerEmail})
                  </span>
                  <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-400">
                    {order.status} • ₹{order.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Ship to: {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                </p>
                <div className="pt-2 text-xs text-neutral-300">
                  Items:{" "}
                  {order.items
                    .map((i: any) => `${i.name} (x${i.quantity})`)
                    .join(", ")}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: SERVICE BOOKINGS */}
      {activeTab === "bookings" && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <p className="text-neutral-400">No service consultations scheduled yet.</p>
          ) : (
            bookings.map((b) => (
              <div
                key={b._id}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-white">
                    {b.clientName} • <span className="text-amber-400">{b.serviceType}</span>
                  </span>
                  <span className="text-xs font-semibold text-neutral-300">
                    {new Date(b.appointmentDate).toLocaleDateString("en-IN")} at {b.timeSlot}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Contact: {b.clientEmail} | {b.clientPhone}
                </p>
                <p className="pt-1 text-sm text-neutral-300">{b.projectScope}</p>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}