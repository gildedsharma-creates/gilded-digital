import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import { Product } from "@/models/Product";
import AddToCartSection from "@/components/shop/AddToCartSection";
import { Ruler, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  let product: any = null;
  try {
    await connectDB();
    product = await Product.findOne({ slug }).lean();
  } catch (err) {
    console.error("Failed to fetch product detail:", err);
  }

  // Fallback sample if database is empty or slug matches sample
  if (!product) {
    if (slug === "gilded-lotus-wall-mandala") {
      product = {
        _id: "decor-1",
        name: "Gilded Lotus Wall Mandala",
        slug: "gilded-lotus-wall-mandala",
        description: "Hand-painted textured MDF mandala finished with 24k gold leaf accents and protective matte resin coating. Designed to bring serenity and elegance to living rooms or entryways.",
        price: 2499,
        stockCount: 5,
        category: "Wall Art",
        images: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80"],
        dimensions: "18 x 18 inches",
        materials: ["Birch Wood", "Gold Leaf", "Acrylic", "Resin"],
      };
    } else {
      notFound();
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/shop"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-400 hover:text-amber-400 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Artisan Store</span>
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Product Image Gallery */}
        <div className="lg:col-span-7">
          <div className="aspect-square w-full overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900">
            <img
              src={product.images[0] || "/placeholder-decor.jpg"}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Product Details & Purchase Controls */}
        <div className="space-y-6 lg:col-span-5">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-400">
              <Sparkles className="h-3 w-3" />
              <span>{product.category}</span>
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">{product.name}</h1>
            <p className="mt-2 text-2xl font-extrabold text-amber-400">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          </div>

          <p className="leading-relaxed text-neutral-300">{product.description}</p>

          <div className="space-y-3 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 text-sm">
            {product.dimensions && (
              <div className="flex items-center gap-2 text-neutral-300">
                <Ruler className="h-4 w-4 text-amber-400" />
                <span>Dimensions: <strong className="text-white">{product.dimensions}</strong></span>
              </div>
            )}
            {product.materials && product.materials.length > 0 && (
              <div className="text-neutral-300">
                <span className="text-neutral-500">Materials: </span>
                <span className="font-medium text-white">{product.materials.join(", ")}</span>
              </div>
            )}
            <div className="text-neutral-300">
              <span className="text-neutral-500">Studio Availability: </span>
              <span className={`font-semibold ${product.stockCount > 0 ? "text-emerald-400" : "text-red-400"}`}>
                {product.stockCount > 0 ? `${product.stockCount} in stock` : "Sold Out"}
              </span>
            </div>
          </div>

          {/* Interactive Client Add to Cart Component */}
          <AddToCartSection product={{
            _id: product._id.toString(),
            name: product.name,
            slug: product.slug,
            price: product.price,
            image: product.images[0],
            stockCount: product.stockCount,
          }} />
        </div>
      </div>
    </section>
  );
}