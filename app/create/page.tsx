"use client";

import { useState } from "react";
import { useTransition } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createProject } from "@/app/actions/project";

// Navigation
const Navigation = () => {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-linear-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-sm">PM</span>
            </div>
            <span className="font-bold text-xl">Project Match</span>
          </Link>
          <Link
            href="/auth/signin"
            className="px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default function CreateProjectPage() {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (formData: FormData) => {
    setSuccess("");
    setError("");

    const skills = (formData.get("skills") as string | null)?.trim();
    const tags = (formData.get("tags") as string | null)?.trim();
    const mergedTags = [tags, skills].filter(Boolean).join(", ");
    formData.set("tags", mergedTags);
    formData.set("imageUrl", "");

    startTransition(async () => {
      const result = await createProject(formData);
      if ("success" in result) {
        setSuccess(
          "Project submitted successfully. It is now live in your projects.",
        );
      } else if ("error" in result) {
        const firstError =
          result.error.server?.[0] ||
          result.error.title?.[0] ||
          result.error.description?.[0] ||
          result.error.tags?.[0] ||
          "Could not submit project. Please try again.";
        setError(firstError);
      }
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <div className="max-w-4xl mx-auto px-6 pt-32 pb-32">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          {/* Header */}
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0, 0.7, 0.29, 0.97] }}
            className="space-y-4"
          >
            <h1 className="text-6xl md:text-7xl font-black leading-tight">
              Launch Your Project
            </h1>
            <p className="text-gray-300 text-xl max-w-2xl">
              Share your vision and find amazing teammates to build it with you.
            </p>
          </motion.div>

          {/* Form */}
          <form
            action={handleSubmit}
            className="space-y-7 rounded-2xl border border-white/10 bg-white/2 p-6 md:p-8"
          >
            {/* Project Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, ease: [0, 0.7, 0.29, 0.97] }}
              className="space-y-2"
            >
              <label className="block text-lg font-semibold">
                Project Title
              </label>
              <input
                name="title"
                placeholder="e.g., AI Medical Diagnosis System"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, ease: [0, 0.7, 0.29, 0.97] }}
              className="space-y-2"
            >
              <label className="block text-lg font-semibold">Description</label>
              <textarea
                name="description"
                placeholder="Tell us about your project vision..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 h-32 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </motion.div>

            {/* Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills Required */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, ease: [0, 0.7, 0.29, 0.97] }}
                className="space-y-2"
              >
                <label className="block text-lg font-semibold">
                  Skills Required
                </label>
                <input
                  name="skills"
                  placeholder="e.g., React, Python, ML"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                />
              </motion.div>

              {/* Team Size */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, ease: [0, 0.7, 0.29, 0.97] }}
                className="space-y-2"
              >
                <label className="block text-lg font-semibold">Team Size</label>
                <input
                  name="teamSize"
                  placeholder="e.g., 4-6 people"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                />
              </motion.div>

              {/* Difficulty */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, ease: [0, 0.7, 0.29, 0.97] }}
                className="space-y-2"
              >
                <label className="block text-lg font-semibold">
                  Difficulty
                </label>
                <input
                  name="difficulty"
                  placeholder="e.g., Advanced, Intermediate"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                />
              </motion.div>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, ease: [0, 0.7, 0.29, 0.97] }}
                className="space-y-2"
              >
                <label className="block text-lg font-semibold">Tags</label>
                <input
                  name="tags"
                  placeholder="e.g., AI, Healthcare, Startup"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                />
              </motion.div>
            </div>

            {error ? (
              <p className="text-sm font-semibold text-red-400">{error}</p>
            ) : null}
            {success ? (
              <p className="text-sm font-semibold text-emerald-400">
                {success}
              </p>
            ) : null}

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, ease: [0, 0.7, 0.29, 0.97] }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isPending}
              className="w-full px-8 py-4 bg-linear-to-r from-pink-500 via-purple-500 to-cyan-400 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-pink-500/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Submitting..." : "Launch Project 🚀"}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-linear-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">PM</span>
              </div>
              <span className="font-bold text-xl">Project Match</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2026 Project Match. Connecting builders worldwide.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
