"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Code2,
  ArrowRight,
  Calendar,
  ShoppingBag,
  Globe,
  Smartphone,
  TrendingUp,
} from "lucide-react";
import { ProjectItem } from "@/components/portfolio/PortfolioGrid";
import { ProductItem } from "@/components/shop/ShopGrid";
import { useCart } from "@/context/CartContext";

interface HomeClientProps {
  featuredProjects: ProjectItem[];
  featuredProducts: ProductItem[];
}

export default function HomeClient({ featuredProjects, featuredProducts }: HomeClientProps) {
  const { addToCart } = useCart();

  return (
    <div className="space-y-28 pb-24">
      {/* 1. HERO SECTION: Dual Identity (React Developer & Artisan Creator) */}
      <section className="relative overflow-hidden pt-16 sm:pt-24">
        {/* Subtle Ambient Gold Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-amber-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>KUNDAN KUMAR SHARMA • GILDED SHARMA</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:leading-[1.12]">
              Crafting Scalable{" "}
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                Digital Apps
              </span>{" "}
              & Handcrafted{" "}
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                Artisan Decor
              </span>
            </h1>

            <p className="mt-6 text-base leading-relaxed text-neutral-400 sm:text-lg">
              React & Next.js Frontend Developer by day, handmade decor artist by passion. Explore my
              production web & mobile engineering work, shop one-of-a-kind handcrafted pieces, or
              book a consultation for your next digital launch.
            </p>

            {/* Dual-Intent CTAs */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/portfolio"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 px-7 py-3.5 text-sm font-bold text-neutral-950 transition-transform hover:scale-105 sm:w-auto"
              >
                <Code2 className="h-4 w-4" />
                <span>Explore Dev Portfolio</span>
              </Link>

              <Link
                href="/shop"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/80 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:border-amber-400/50 hover:text-amber-300 sm:w-auto"
              >
                <ShoppingBag className="h-4 w-4 text-amber-400" />
                <span>Shop Handmade Decor</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURED DEV PROJECTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Engineering Showcase
            </span>
            <h2 className="mt-1 text-3xl font-extrabold text-white">Featured Dev Projects</h2>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300"
          >
            <span>View All Projects</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {featuredProjects.map((project, idx) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 transition-colors hover:border-amber-500/40"
            >
              <div className="aspect-video w-full overflow-hidden bg-neutral-800">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                  {project.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-neutral-400">{project.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED HANDMADE DECOR */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Artisan Studio
            </span>
            <h2 className="mt-1 text-3xl font-extrabold text-white">Handcrafted Decor Pieces</h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300"
          >
            <span>Visit Full Store</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product, idx) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 transition-colors hover:border-amber-500/40"
            >
              <div className="aspect-square w-full overflow-hidden bg-neutral-800">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors">
                      {product.name}
                    </h3>
                    <span className="font-extrabold text-amber-400">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-neutral-400">
                    {product.description}
                  </p>
                </div>

                <button
                  onClick={() =>
                    addToCart({
                      _id: product._id,
                      name: product.name,
                      slug: product.slug,
                      price: product.price,
                      image: product.images[0],
                      stockCount: product.stockCount,
                    })
                  }
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-800 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-500 hover:text-neutral-950"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Quick Add to Bag</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. DIGITAL SERVICES & BOOKING CTA BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-neutral-900 via-neutral-900 to-amber-950/30 p-8 sm:p-12"
        >
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-7">
              <span className="inline-block rounded-full bg-amber-500/15 px-3.5 py-1 text-xs font-bold text-amber-400">
                Available for Freelance & Agency Projects
              </span>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Need a High-Converting Website, Mobile App, or Marketing Strategy?
              </h2>
              <p className="text-neutral-300">
                Book a 1-on-1 discovery call directly on my calendar to discuss architecture,
                timelines, and custom pricing.
              </p>

              <div className="flex flex-wrap gap-4 pt-2 text-xs font-medium text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-amber-400" /> Next.js & React Websites
                </span>
                <span className="flex items-center gap-1.5">
                  <Smartphone className="h-4 w-4 text-amber-400" /> iOS & Android Apps
                </span>
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-amber-400" /> SEO & Growth Campaigns
                </span>
              </div>
            </div>

            <div className="flex lg:col-span-5 lg:justify-end">
              <Link
                href="/services"
                className="inline-flex items-center gap-2.5 rounded-full bg-amber-500 px-8 py-4 text-sm font-extrabold text-neutral-950 shadow-lg shadow-amber-500/20 transition-transform hover:scale-105"
              >
                <Calendar className="h-5 w-5" />
                <span>Schedule Consultation</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}