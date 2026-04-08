"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, Github, X } from "lucide-react";
import Image from "next/image";

export default function MatchModal({
  isOpen,
  onClose,
  matchUser,
}: {
  isOpen: boolean;
  onClose: () => void;
  matchUser: {
    name: string | null;
    image: string | null;
    major: string | null;
    university: string | null;
    github?: string | null;
  } | null;
}) {
  if (!matchUser) return null;

  const details = [matchUser.major, matchUser.university]
    .filter(Boolean)
    .join(" / ");
  const githubUrl = matchUser.github?.trim() || null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl"
          />
          <div className="fixed inset-0 z-[201] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-3 sm:p-5 md:p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                className="relative w-full max-w-[28rem]"
              >
                <div className="glass-morphism relative max-h-[calc(100vh-1.5rem)] overflow-y-auto rounded-[2rem] border border-white/10 p-5 shadow-2xl backdrop-blur-xl sm:max-h-[calc(100vh-2.5rem)] sm:rounded-[2.5rem] sm:p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

                  <div className="absolute right-5 top-5 z-20 sm:right-6 sm:top-6">
                    <button
                      onClick={onClose}
                      aria-label="Close match modal"
                      className="rounded-full border border-white/10 bg-black/40 p-2.5 text-white/60 transition-colors hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="absolute right-8 top-10 opacity-20 sm:right-10 sm:top-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="h-12 w-12 rounded-full border-2 border-primary/30 sm:h-16 sm:w-16"
                    />
                  </div>
                  <div className="absolute bottom-8 left-8 opacity-15 sm:bottom-10 sm:left-10">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="h-10 w-10 rounded-full bg-secondary/20 blur-sm sm:h-12 sm:w-12"
                    />
                  </div>

                  <div className="relative z-10 text-center">
                    <div className="mb-7 pt-6 sm:mb-8 sm:pt-8">
                      <motion.div
                        animate={{ scale: [1, 1.14, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute left-1/2 top-[3.25rem] -z-10 h-28 w-28 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl sm:top-[4.25rem] sm:h-36 sm:w-36"
                      />
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="inline-block"
                      >
                        <Heart className="mx-auto h-20 w-20 fill-primary text-primary drop-shadow-[0_0_30px_rgba(255,87,34,0.45)] sm:h-24 sm:w-24" />
                      </motion.div>
                    </div>

                    <h2 className="mx-auto max-w-[12ch] text-balance text-4xl font-black italic tracking-tighter text-white sm:text-5xl">
                      IT&apos;S A MATCH!
                    </h2>
                    <p className="mx-auto mt-3 max-w-[18ch] text-balance text-sm font-bold uppercase tracking-[0.22em] text-gray-400 sm:mt-4 sm:text-base">
                      You both liked each other
                    </p>

                    <div className="mx-auto mt-8 max-w-sm rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 sm:mt-10 sm:rounded-[2.25rem] sm:p-7">
                      <div className="relative mx-auto mb-5 h-28 w-28 overflow-hidden rounded-[1.6rem] border-4 border-primary bg-gray-900 shadow-2xl sm:mb-6 sm:h-36 sm:w-36 sm:rounded-[2rem]">
                        {matchUser.image ? (
                          <Image
                            src={matchUser.image}
                            alt={matchUser.name || "Match"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-5xl font-black text-white/10">
                            ?
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <h3 className="break-words text-2xl font-black text-white sm:text-3xl">
                          {matchUser.name || "New Match"}
                        </h3>
                        {details ? (
                          <p className="text-sm font-bold text-primary sm:text-base">
                            {details}
                          </p>
                        ) : (
                          <p className="text-sm font-medium text-gray-500">
                            Profile details not available yet
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
                      {githubUrl ? (
                        <button
                          onClick={() => window.open(githubUrl, "_blank", "noopener,noreferrer")}
                          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white px-4 py-4 text-base font-black text-black shadow-lg transition-all hover:scale-[1.01] sm:py-5 sm:text-lg"
                        >
                          <Github className="h-5 w-5 sm:h-6 sm:w-6" />
                          View GitHub Profile
                        </button>
                      ) : null}
                      <button
                        onClick={onClose}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-bold text-white/80 transition-all hover:bg-white/10 hover:text-white sm:py-5 sm:text-base"
                      >
                        Keep Swiping
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
