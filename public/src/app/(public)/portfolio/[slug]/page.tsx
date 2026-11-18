import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { ExternalLink, Github, ArrowLeft, Code2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;

  let project: any = null;
  try {
    await connectDB();
    project = await Project.findOne({ slug }).lean();
  } catch (err) {
    console.error("Failed to fetch project detail:", err);
  }

  if (!project) {
    if (slug === "gilded-commerce-engine") {
      project = {
        _id: "sample-1",
        title: "Gilded Commerce Engine",
        slug: "gilded-commerce-engine",
        summary: "Full-stack Next.js and MongoDB storefront with real-time inventory sync, Framer Motion transitions, and Razorpay checkout.",
        description: "Engineered from scratch using Next.js App Router and TypeScript. Features server-side rendering for lightning-fast SEO, atomic Tailwind CSS design, robust Mongoose database models with automated stock decrementation, secure Razorpay webhook signature verification, and smooth Framer Motion catalog filtering.",
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        techStack: ["Next.js", "TypeScript", "MongoDB", "Tailwind CSS", "Razorpay", "Firebase"],
      };
    } else {
      notFound();
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/portfolio"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-400 hover:text-amber-400 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Dev Portfolio</span>
      </Link>

      <div className="space-y-8">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-400">
            <Code2 className="h-3 w-3" />
            <span>Case Study</span>
          </span>
          <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-5xl">{project.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-neutral-400">{project.summary}</p>
        </div>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-4">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-neutral-950 transition-transform hover:scale-105"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View Live Application</span>
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:border-amber-400/50"
            >
              <Github className="h-4 w-4" />
              <span>Source Repository</span>
            </a>
          )}
        </div>

        {/* Thumbnail Hero Image */}
        <div className="aspect-video w-full overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900">
          <img src={project.thumbnail} alt={project.title} className="h-full w-full object-cover" />
        </div>

        {/* Tech Stack Used */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-amber-400">Tech Stack & Architecture</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.techStack.map((tech: string) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2 text-sm font-semibold text-neutral-200"
              >
                <CheckCircle2 className="h-4 w-4 text-amber-400" />
                <span>{tech}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Detailed Overview */}
        <div className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white">Engineering Overview</h2>
          <p className="leading-relaxed text-neutral-300">{project.description}</p>
        </div>
      </div>
    </section>
  );
}