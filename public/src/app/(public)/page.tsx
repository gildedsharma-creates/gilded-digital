import connectDB from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { Product } from "@/models/Product";
import HomeClient from "@/components/home/HomeClient";
import { ProjectItem } from "@/components/portfolio/PortfolioGrid";
import { ProductItem } from "@/components/shop/ShopGrid";

export const dynamic = "force-dynamic";

async function getHomeData() {
  let featuredProjects: ProjectItem[] = [];
  let featuredProducts: ProductItem[] = [];

  try {
    await connectDB();

    const projects = await Project.find({}).sort({ isFeatured: -1, createdAt: -1 }).limit(2).lean();
    featuredProjects = projects.map((p: any) => ({
      _id: p._id.toString(),
      title: p.title,
      slug: p.slug,
      summary: p.summary,
      thumbnail: p.thumbnail,
      liveUrl: p.liveUrl,
      githubUrl: p.githubUrl,
      techStack: p.techStack,
      isFeatured: p.isFeatured,
    }));

    const products = await Product.find({}).sort({ isFeatured: -1, createdAt: -1 }).limit(3).lean();
    featuredProducts = products.map((p: any) => ({
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
  } catch (err) {
    console.error("Home page DB fetch error:", err);
  }

  // Fallback samples so the landing page looks complete immediately
  if (featuredProjects.length === 0) {
    featuredProjects = [
      {
        _id: "sample-1",
        title: "Gilded Commerce Engine",
        slug: "gilded-commerce-engine",
        summary: "Full-stack Next.js and MongoDB storefront with real-time inventory sync and Framer Motion transitions.",
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
        techStack: ["Next.js", "TypeScript", "MongoDB", "Tailwind CSS"],
        isFeatured: true,
      },
      {
        _id: "sample-2",
        title: "PulseFit Mobile App",
        slug: "pulsefit-mobile-app",
        summary: "Cross-platform React Native workout tracker with Firebase real-time leaderboards and analytics.",
        thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
        techStack: ["React Native", "Firebase", "Expo"],
        isFeatured: true,
      },
    ];
  }

  if (featuredProducts.length === 0) {
    featuredProducts = [
      {
        _id: "decor-1",
        name: "Gilded Lotus Wall Mandala",
        slug: "gilded-lotus-wall-mandala",
        description: "Hand-painted textured MDF mandala finished with 24k gold leaf accents and protective resin.",
        price: 2499,
        stockCount: 5,
        category: "Wall Art",
        images: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"],
        isFeatured: true,
      },
      {
        _id: "decor-2",
        name: "Amber Terrazzo Desk Tray",
        slug: "amber-terrazzo-desk-tray",
        description: "Hand-cast eco-resin valet tray with warm amber stone flecks for desk organization.",
        price: 899,
        stockCount: 12,
        category: "Desk & Table",
        images: ["https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80"],
        isFeatured: true,
      },
      {
        _id: "decor-3",
        name: "Brass & Resin Tea Light Holder",
        slug: "brass-resin-tea-light",
        description: "Sculpted tabletop candle holder infused with dried marigolds and metallic gold flakes.",
        price: 649,
        stockCount: 8,
        category: "Lighting",
        images: ["https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=800&q=80"],
        isFeatured: true,
      },
    ];
  }

  return { featuredProjects, featuredProducts };
}

export default async function HomePage() {
  const { featuredProjects, featuredProducts } = await getHomeData();

  return <HomeClient featuredProjects={featuredProjects} featuredProducts={featuredProducts} />;
}