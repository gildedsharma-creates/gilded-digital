import connectDB from "@/lib/mongodb";
import { Project } from "@/models/Project";
import PortfolioGrid, { ProjectItem } from "@/components/portfolio/PortfolioGrid";
import { Code2 } from "lucide-react";

export const dynamic = "force-dynamic";

async function getProjects(): Promise<ProjectItem[]> {
  try {
    await connectDB();
    const projects = await Project.find({}).sort({ createdAt: -1 }).lean();

    if (projects.length > 0) {
      return projects.map((p: any) => ({
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
    }
  } catch (err) {
    console.error("Failed to fetch projects from MongoDB:", err);
  }

  // Fallback sample data so you can preview the UI immediately
  return [
    {
      _id: "sample-1",
      title: "Gilded Commerce Engine",
      slug: "gilded-commerce-engine",
      summary: "Full-stack Next.js and MongoDB storefront with real-time inventory sync, Framer Motion transitions, and Stripe checkout.",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
      techStack: ["Next.js", "TypeScript", "MongoDB", "Tailwind CSS"],
      isFeatured: true,
    },
    {
      _id: "sample-2",
      title: "PulseFit Mobile App",
      slug: "pulsefit-mobile-app",
      summary: "Cross-platform React Native workout tracker with Firebase real-time leaderboards and custom nutrition analytics.",
      thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
      techStack: ["React Native", "Firebase", "Expo"],
      isFeatured: false,
    },
  ];
}

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-12 max-w-2xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-400">
          <Code2 className="h-3.5 w-3.5" />
          <span>Engineering & Craft</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Selected <span className="text-amber-400">Projects</span>
        </h1>
        <p className="mt-4 text-lg text-neutral-400">
          Web applications, mobile experiences, and digital products engineered with clean architecture and responsive motion design.
        </p>
      </div>

      {/* Interactive Filtered Grid */}
      <PortfolioGrid projects={projects} />
    </section>
  );
}