"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, MessageSquareText, Tag, UserRound } from "lucide-react";
import type { ProjectFeedItem } from "@/lib/project-types";

const tiltClasses = [
  "rotate-[-2.2deg]",
  "rotate-[1.6deg]",
  "rotate-[-1.2deg]",
  "rotate-[2deg]",
];

const fallbackImage =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200";

export default function DiscoveryProjectCard({
  project,
  index,
  onOpenDetails,
}: {
  project: ProjectFeedItem;
  index: number;
  onOpenDetails: (project: ProjectFeedItem) => void;
}) {
  const tags = project.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <motion.div
      whileHover={{ y: -8, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`shrink-0 snap-start ${tiltClasses[index % tiltClasses.length]}`}
    >
      <article className="group relative flex h-[29rem] w-[18.75rem] flex-col overflow-hidden rounded-[2rem] border border-white/12 bg-neutral-950/90 shadow-[0_24px_60px_rgba(0,0,0,0.55)] [backface-visibility:hidden] [clip-path:inset(0_round_2rem)] [transform:translateZ(0)]">
        <div className="relative h-56 overflow-hidden border-b border-white/10">
          <Image
            src={project.imageUrl || fallbackImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/35 to-transparent" />
          <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-white/75 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_14px_rgba(234,40,30,0.55)]" />
            Open Build
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/55">
              Project Spotlight
            </p>
            <h3 className="mt-2 text-3xl font-black uppercase leading-none tracking-tight text-white">
              {project.title}
            </h3>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
            <span className="inline-flex items-center gap-2 truncate">
              <UserRound className="h-3.5 w-3.5 text-primary" />
              {project.owner.name || "Anonymous Builder"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[10px] text-gray-300">
              <MessageSquareText className="h-3.5 w-3.5 text-primary" />
              {project.commentsCount}
            </span>
          </div>

          <p className="line-clamp-4 text-sm leading-6 text-gray-300">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-gray-200"
                >
                  <Tag className="h-3.5 w-3.5 text-primary" />
                  {tag}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-dashed border-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
                No tags added
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onOpenDetails(project)}
            className="mt-auto inline-flex items-center justify-between rounded-[1.25rem] border border-primary/40 bg-linear-to-r from-zinc-950 via-neutral-900 to-zinc-950 px-4 py-3 text-left transition-all duration-300 hover:border-primary/70 hover:shadow-[0_16px_32px_rgba(234,40,30,0.22)]"
          >
            <span>
              <span className="block text-[10px] font-black uppercase tracking-[0.24em] text-primary/75">
                Public thread
              </span>
              <span className="mt-1 block text-sm font-black uppercase tracking-[0.08em] text-white">
                See Details
              </span>
            </span>
            <ArrowUpRight className="h-5 w-5 text-white" />
          </button>
        </div>
      </article>
    </motion.div>
  );
}
