"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Image as ImageIcon, Tag, Type } from "lucide-react";
import { useState, useTransition } from "react";
import { createProject } from "@/app/actions/project";
import type { CreateProjectFieldErrors } from "@/app/actions/project";
import ImageUpload from "./ImageUpload";

export default function CreateProjectModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<CreateProjectFieldErrors>({});
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createProject(formData);
      if ("error" in result) {
        setErrors(result.error);
      } else {
        onClose();
        alert("Project launched successfully.");
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-100"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-101 p-4 md:p-6 focus:outline-none"
          >
            <div className="glass-morphism rounded-[2.25rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl border border-white/10 backdrop-blur-xl relative overflow-hidden max-h-[88vh] overflow-y-auto">
              <div className="absolute top-0 right-0 p-6">
                <button
                  onClick={onClose}
                  className="p-3 hover:bg-white/10 rounded-full transition-colors border border-white/5"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-10 pr-14">
                <div className="p-4 bg-linear-to-tr from-primary/20 to-secondary/20 rounded-3xl border border-white/10">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tighter">
                    Launch New Project
                  </h2>
                  <p className="text-gray-400 text-base sm:text-lg font-medium">
                    Share your vision with the world
                  </p>
                </div>
              </div>

              <form action={handleSubmit} className="space-y-6 md:space-y-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-300 uppercase tracking-widest flex items-center gap-3">
                      <div className="p-2 bg-primary/20 rounded-xl">
                        <Type className="w-4 h-4 text-primary" />
                      </div>
                      Project Title
                    </label>
                    <input
                      name="title"
                      className="w-full px-6 py-4 glass-morphism rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-600 border border-white/5 text-lg"
                      placeholder="Enter a catchy title..."
                    />
                    {errors.title && (
                      <p className="text-red-400 text-sm font-medium">
                        {errors.title[0]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-300 uppercase tracking-widest flex items-center gap-3">
                      <div className="p-2 bg-secondary/20 rounded-xl">
                        <Tag className="w-4 h-4 text-secondary" />
                      </div>
                      Technologies & Tags
                    </label>
                    <input
                      name="tags"
                      className="w-full px-6 py-4 glass-morphism rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-600 border border-white/5 text-lg"
                      placeholder="React, AI, Sustainability..."
                    />
                    {errors.tags && (
                      <p className="text-red-400 text-sm font-medium">
                        {errors.tags[0]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-300 uppercase tracking-widest flex items-center gap-3">
                      <div className="p-2 bg-accent/20 rounded-xl">
                        <ImageIcon className="w-4 h-4 text-accent" />
                      </div>
                      Project Cover Image
                    </label>
                    <ImageUpload
                      onUploadComplete={(url) => setUploadedImageUrl(url)}
                    />
                    <input
                      type="hidden"
                      name="imageUrl"
                      value={uploadedImageUrl || ""}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-300 uppercase tracking-widest flex items-center gap-3">
                      <div className="p-2 bg-primary/20 rounded-xl">
                        <Type className="w-4 h-4 text-primary" />
                      </div>
                      Project Description
                    </label>
                    <textarea
                      name="description"
                      rows={4}
                      className="w-full px-6 py-4 glass-morphism rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-600 border border-white/5 text-lg resize-none"
                      placeholder="Describe your project vision..."
                    />
                    {errors.description && (
                      <p className="text-red-400 text-sm font-medium">
                        {errors.description[0]}
                      </p>
                    )}
                  </div>
                </div>

                {errors.server && (
                  <p className="text-red-400 text-sm font-medium">
                    {errors.server[0]}
                  </p>
                )}

                <div className="pt-2 md:pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-4 glass-morphism rounded-2xl font-bold hover:bg-white/10 transition-colors border border-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 py-4 bg-linear-to-r from-zinc-950 via-neutral-900 to-zinc-950 rounded-2xl font-bold text-white border border-primary/45 hover:border-primary/70 hover:shadow-[0_12px_30px_rgba(234,40,30,0.28)] transition-all active:scale-95"
                  >
                    {isPending ? "Launching..." : "Launch Project"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
