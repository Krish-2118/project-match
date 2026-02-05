"use client";

import { motion } from "framer-motion";
import { Rocket, Tag, User } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  tags: string;
  owner: { name: string | null };
}

export default function ProjectCard({ project }: { project: Project }) {
  const tagsList = project.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .filter((tag, index, all) => all.indexOf(tag) === index)
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full bg-neutral-900 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl border border-white/5 group"
    >
      <div className="relative h-[60%] w-full overflow-hidden bg-black">
        {project.imageUrl ? (
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-neutral-900 to-secondary/20 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(192,38,211,0.15),transparent_70%)]" />
            <Rocket className="w-20 h-20 text-white/10 animate-pulse" />
            <span className="absolute inset-0 flex items-center justify-center text-7xl font-black text-white/[0.05] uppercase tracking-[1em] select-none">
              {project.title.substring(0, 1)}
            </span>
          </div>
        )}

        <div className="absolute top-6 left-6 px-4 py-2 bg-neutral-950 rounded-full border border-white/10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
            Recruiting
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent">
          <motion.div layoutId={`title-${project.id}`}>
            <h3 className="text-4xl font-black text-white tracking-tighter leading-none mb-2">
              {project.title}
            </h3>
          </motion.div>
          <div className="flex items-center gap-2 text-white/60">
            <User className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">
              {project.owner.name || "Stealth Mod"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 flex flex-col gap-6 bg-neutral-900">
        <p className="text-gray-200 text-base leading-relaxed font-bold">{project.description}</p>

        <div className="mt-auto flex flex-wrap gap-2">
          {tagsList.map((tag) => (
            <div
              key={tag}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 hover:bg-white/10 transition-colors cursor-default"
            >
              <Tag className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-black text-white uppercase tracking-tighter">
                {tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
