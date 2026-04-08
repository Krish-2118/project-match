"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Briefcase,
  CalendarDays,
  Code,
  Github,
  Mail,
  MapPin,
  X,
} from "lucide-react";
import type { UserProfile } from "@/app/components/MainApp";

const fallbackAvatarSrc = "/default-avatar.svg";

export default function TeammateDetailsModal({
  user,
  onClose,
}: {
  user: UserProfile | null;
  onClose: () => void;
}) {
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);
  const imageSrc = user?.image || fallbackAvatarSrc;
  const resolvedImageSrc =
    failedImageSrc === imageSrc ? fallbackAvatarSrc : imageSrc;

  useEffect(() => {
    if (!user) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [user]);

  if (!user) {
    return null;
  }

  const skillsList =
    user.skills
      ?.split(",")
      .map((skill) => skill.trim())
      .filter(Boolean) ?? [];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="glass-morphism relative mx-auto my-4 max-h-[calc(100dvh-2rem)] w-full max-w-4xl overflow-y-auto overscroll-contain rounded-[2.25rem] border border-white/10"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="grid lg:min-h-[min(92vh,44rem)] lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative min-h-[24rem] overflow-hidden bg-black">
            <Image
              src={resolvedImageSrc}
              alt={user.name || "Profile picture"}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              onError={() => setFailedImageSrc(imageSrc)}
              className="object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/25 to-transparent" />
            <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/60 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-amber-300 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Top teammate
            </div>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-6 top-6 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-black/60 text-white transition-colors hover:border-white/30"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <h2 className="text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">
                {user.name || "Anonymous"}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
                {user.bio ||
                  "No bio added yet. Open the conversation and ask what they are building next."}
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 bg-neutral-950/90 p-6 lg:border-l lg:border-t-0 sm:p-8">
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-gray-500">
                  Full profile
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Swipe left or right to decide, or explore the full profile here
                  before making the call.
                </p>
              </div>

              <div className="grid gap-3">
                <div className="flex items-center gap-3 rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-4 py-3">
                  <div className="rounded-xl bg-primary/12 p-2 text-primary">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                      Major
                    </p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {user.major || "Undisclosed Program"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-4 py-3">
                  <div className="rounded-xl bg-white/6 p-2 text-white/70">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                      University
                    </p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {user.university || "Secret Location"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-4 py-3">
                  <div className="rounded-xl bg-white/6 p-2 text-white/70">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                      Year
                    </p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {user.year || "Not shared"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-primary/12 p-2 text-primary">
                    <Code className="h-4 w-4" />
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-gray-500">
                    Skills
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {skillsList.length > 0 ? (
                    skillsList.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-white"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No skills shared yet.</p>
                  )}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {user.github ? (
                  <a
                    href={user.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] border border-white/12 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white transition-colors hover:border-white/25"
                  >
                    <Github className="h-4 w-4" />
                    Open GitHub
                  </a>
                ) : null}
                {user.email ? (
                  <a
                    href={`mailto:${user.email}`}
                    className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-bold text-white transition-colors hover:border-primary/60"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
