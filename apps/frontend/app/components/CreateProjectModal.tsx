"use client";

import { createProject } from "@/app/actions/project";
import { AnimatePresence, motion } from "framer-motion";
import { Image as ImageIcon, Plus, Rocket, Tag, Type, X } from "lucide-react";
import { useState, useTransition } from "react";
import ImageUpload from "./ImageUpload";

export default function CreateProjectModal({
  isOpen,
  onClose,
}: { isOpen: boolean; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createProject(formData);
      if (result?.error) {
        setErrors(result.error);
      } else {
        onClose();
        alert("Project rocket launched! 🚀");
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[101] p-6 focus:outline-none"
          >
            <div className="glass-morphism rounded-[2.5rem] p-8 shadow-2xl border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/20 rounded-2xl">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-black">Launch New Project</h2>
                  <p className="text-sm text-gray-400">Share your vision with the world</p>
                </div>
              </div>

              <form action={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="title"
                      className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"
                    >
                      <Type className="w-3 h-3" /> Title
                    </label>
                    <input
                      id="title"
                      name="title"
                      className="w-full px-5 py-3 glass-morphism rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-700"
                      placeholder="Enter a catchy title..."
                    />
                    {errors.title && (
                      <p className="text-red-400 text-xs font-medium">{errors.title[0]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="tags"
                      className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"
                    >
                      <Tag className="w-3 h-3" /> Tags (comma separated)
                    </label>
                    <input
                      id="tags"
                      name="tags"
                      className="w-full px-5 py-3 glass-morphism rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-700"
                      placeholder="React, AI, Sustainability..."
                    />
                    {errors.tags && (
                      <p className="text-red-400 text-xs font-medium">{errors.tags[0]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="project-cover-image"
                      className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"
                    >
                      <ImageIcon className="w-3 h-3" /> Cover Image
                    </label>
                    <ImageUpload
                      inputId="project-cover-image"
                      onUploadComplete={(url) => setUploadedImageUrl(url)}
                    />
                    <input type="hidden" name="imageUrl" value={uploadedImageUrl || ""} />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="description"
                      className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      className="w-full px-5 py-3 glass-morphism rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[120px] placeholder:text-gray-700"
                      placeholder="What are you building? Who are you looking for?"
                    />
                    {errors.description && (
                      <p className="text-red-400 text-xs font-medium">{errors.description[0]}</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-4 bg-gradient-to-r from-primary to-secondary rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_30px_-10px_rgba(192,38,211,0.5)] active:scale-95 transition-all disabled:opacity-50"
                >
                  <Rocket className={`w-6 h-6 ${isPending ? "animate-pulse" : ""}`} />
                  {isPending ? "Launching..." : "Launch Project"}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
