import connectDB from "@/lib/mongodb";
import { Product } from "@/models/Product";
import ShopGrid, { ProductItem } from "@/components/shop/ShopGrid";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

async function getProducts(): Promise<ProductItem[]> {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();

    if (products.length > 0) {
      return products.map((p: any) => ({
        _id: p._id.toString(),
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        stockCount: p.stockCount,
        category: p.category,
        images: p.images,
        dimensions: p.dimensions,
        materials: p.materials,
        isFeatured: p.isFeatured,
      }));
    }
  } catch (err) {
    console.error("Failed to fetch products from MongoDB:", err);
  }

  // Fallback sample decor pieces for instant UI testing
  return [
    {
      _id: "decor-1",
      name: "Gilded Lotus Wall Mandala",
      slug: "gilded-lotus-wall-mandala",
      description: "Hand-painted textured MDF mandala finished with 24k gold leaf accents and protective matte resin.",
      price: 2499,
      stockCount: 5,
      category: "Wall Art",
      images: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"],
      dimensions: "18 x 18 inches",
      materials: ["Birch Wood", "Gold Leaf", "Acrylic"],
      isFeatured: true,
    },
    {
      _id: "decor-2",
      name: "Amber Terrazzo Desk Tray",
      slug: "amber-terrazzo-desk-tray",
      description: "Hand-cast eco-resin valet tray with warm amber stone flecks—ideal for organizing desk essentials.",
      price: 899,
      stockCount: 12,
      category: "Desk & Table",
      images: ["https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80"],
      dimensions: "9 x 4.5 inches",
      materials: ["Jesmonite", "Natural Pigments"],
      isFeatured: true,
    },
  ];
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 max-w-2xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Handcrafted Studio</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Artisan <span className="text-amber-400">Decor</span> Collection
        </h1>
        <p className="mt-4 text-lg text-neutral-400">
          One-of-a-kind decorative pieces designed and handcrafted by Gilded Sharma to bring warmth and character to your space.
        </p>
      </div>

      <ShopGrid products={products} />
    </section>
  );
}