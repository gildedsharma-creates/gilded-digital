"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Code2, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export interface ProjectItem {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  thumbnail: string;
  liveUrl?: string;
  githubUrl?: string;
  techStack: string[];
  isFeatured: boolean;
}

export default function PortfolioGrid({ projects }: { projects: ProjectItem[] }) {
  const [selectedTech, setSelectedTech] = useState<string>("All");

  // Extract unique tech tags dynamically from all projects
  const filterTags = useMemo(() => {
    const tags = new Set<string>(["All"]);
    projects.forEach((p) => p.techStack.forEach((tech) => tags.add(tech)));
    return Array.from(tags);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedTech === "All") return projects;
    return projects.filter((p) => p.techStack.includes(selectedTech));
  }, [projects, selectedTech]);

  return (
    <div className="space-y-10">
      {/* Interactive Filter Pills */}
      <div className="flex flex-wrap items-center gap-2.5">
        {filterTags.map((tech) => {
          const isActive = selectedTech === tech;
          return (
            <button
              key={tech}
              onClick={() => setSelectedTech(tech)}
              className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive ? "text-neutral-950" : "text-neutral-300 hover:text-white bg-neutral-900/80 border border-neutral-800"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="portfolio-filter-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-amber-400"
                />
              )}
              <span className="relative z-10">{tech}</span>
            </button>
          );
        })}
      </div>

      {/* Animated Project Cards Grid */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-12 text-center text-neutral-400">
          No projects found matching <span className="text-amber-400">{selectedTech}</span>.
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.article
                key={project._id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/60 backdrop-blur-sm transition-colors hover:border-amber-500/40"
              >
                {/* Thumbnail Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-800">
                  <img
                    src={project.thumbnail || "/placeholder-project.jpg"}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {project.isFeatured && (
                    <span className="absolute top-3 left-3 rounded-full bg-neutral-950/80 border border-amber-500/40 px-3 py-1 text-xs font-semibold text-amber-400 backdrop-blur-md">
                      Featured
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xl font-bold text-neutral-100 group-hover:text-amber-400 transition-colors">
                        <Link href={`/portfolio/${project.slug}`}>{project.title}</Link>
                      </h3>
                      <Link
                        href={`/portfolio/${project.slug}`}
                        className="rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-amber-400"
                        aria-label={`View ${project.title} details`}
                      >
                        <ArrowUpRight className="h-5 w-5" />
                      </Link>
                    </div>

                    <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-neutral-400">
                      {project.summary}
                    </p>

                    {/* Tech Stack Badges */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-neutral-800/90 px-2.5 py-1 text-xs font-medium text-neutral-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* External Action Links */}
                  <div className="mt-6 flex items-center gap-4 border-t border-neutral-800/80 pt-4 text-sm font-medium">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
                      >
                        <Github className="h-4 w-4" />
                        <span>Source Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}