"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check, Sparkles, Ruler } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stockCount: number;
  category: string;
  images: string[];
  dimensions?: string;
  materials?: string[];
  isFeatured: boolean;
}

export default function ShopGrid({ products }: { products: ProductItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addToCart } = useCart();

  const categories = useMemo(() => {
    const cats = new Set<string>(["All"]);
    products.forEach((p) => cats.add(p.category));
    return Array.from(cats);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const handleAdd = (product: ProductItem) => {
    addToCart({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] || "/placeholder-decor.jpg",
      stockCount: product.stockCount,
    });

    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1400);
  };

  return (
    <div className="space-y-10">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2.5">
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "text-neutral-950"
                  : "border border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="shop-category-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-amber-400"
                />
              )}
              <span className="relative z-10">{category}</span>
            </button>
          );
        })}
      </div>

      {/* Product Cards Grid */}
      <motion.div layout className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, index) => {
            const isOutOfStock = product.stockCount <= 0;
            const isJustAdded = addedId === product._id;

            return (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/50 transition-colors hover:border-amber-500/40"
              >
                {/* Product Image */}
                <Link
                  href={`/shop/${product.slug}`}
                  className="relative aspect-square w-full overflow-hidden bg-neutral-800"
                >
                  <img
                    src={product.images[0] || "/placeholder-decor.jpg"}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-neutral-950/80 px-3 py-1 text-xs font-medium text-neutral-200 backdrop-blur-md">
                    {product.category}
                  </span>
                  {isOutOfStock && (
                    <span className="absolute top-3 right-3 rounded-full bg-red-500/90 px-3 py-1 text-xs font-bold text-white">
                      Sold Out
                    </span>
                  )}
                </Link>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/shop/${product.slug}`}
                        className="text-lg font-bold text-neutral-100 transition-colors group-hover:text-amber-400"
                      >
                        {product.name}
                      </Link>
                      <span className="shrink-0 text-lg font-extrabold text-amber-400">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-2 text-sm text-neutral-400">
                      {product.description}
                    </p>

                    {product.dimensions && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-neutral-400">
                        <Ruler className="h-3.5 w-3.5 text-amber-500/80" />
                        <span>{product.dimensions}</span>
                      </div>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <div className="mt-6 pt-4 border-t border-neutral-800/80">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      disabled={isOutOfStock}
                      onClick={() => handleAdd(product)}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                        isOutOfStock
                          ? "cursor-not-allowed bg-neutral-800 text-neutral-500"
                          : isJustAdded
                          ? "bg-emerald-500 text-neutral-950"
                          : "bg-amber-500 text-neutral-950 hover:bg-amber-400"
                      }`}
                    >
                      {isOutOfStock ? (
                        <span>Out of Stock</span>
                      ) : isJustAdded ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Added to Bag</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-4 w-4" />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}