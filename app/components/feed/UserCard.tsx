"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUp, Briefcase, Code, MapPin, Star } from "lucide-react";

interface User {
    id: string;
    name: string | null;
    image: string | null;
    bio: string | null;
    skills: string | null;
    major: string | null;
    university: string | null;
    year?: string | null;
    github?: string | null;
    email?: string | null;
}

export default function UserCard({
    user,
    onViewDetails,
}: {
    user: User;
    onViewDetails?: () => void;
}) {
    const skillsList = user.skills?.split(",").map(s => s.trim()).slice(0, 2) || [];
    const fallbackAvatarSrc = "/default-avatar.svg";
    const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);
    const imageSrc = user.image || fallbackAvatarSrc;
    const resolvedImageSrc =
        failedImageSrc === imageSrc ? fallbackAvatarSrc : imageSrc;

    return (
        <div className="w-full h-full select-none bg-neutral-950 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl border border-white/10">
            <div className="relative -mb-px h-[65%] w-full shrink-0 overflow-hidden bg-neutral-950">
                <Image
                    src={resolvedImageSrc}
                    alt={user.name || "Profile picture"}
                    fill
                    sizes="(max-width: 640px) 100vw, 23rem"
                    onError={() => setFailedImageSrc(imageSrc)}
                    draggable={false}
                    className="pointer-events-none h-full w-full object-cover"
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-neutral-950 via-neutral-950/88 to-transparent" />

                <div className="pointer-events-none absolute top-6 left-6">
                    <div className="px-4 py-2 bg-black/80 backdrop-blur-xl rounded-full border border-white/10 flex items-center gap-2">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Top Teammate</span>
                    </div>
                </div>

                <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-3xl font-black text-white tracking-widest uppercase leading-tight mb-3">
                        {user.name || "Anonymous"}
                    </h3>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="p-1.5 bg-primary/20 rounded-lg">
                                <Briefcase className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-sm font-black uppercase tracking-widest leading-none">
                                {user.major || "Undisclosed Program"}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-white/50">
                            <div className="p-1.5 bg-white/5 rounded-lg">
                                <MapPin className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-bold leading-none tracking-wide">{user.university || "Secret Location"}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-[1] -mt-px flex-1 p-6 flex flex-col justify-between gap-4 bg-neutral-950 pointer-events-none">
                <div className="relative">
                    <p className="text-gray-300 text-sm leading-relaxed font-medium">
                        {user.bio || "Crafting the next big digital experience. Let's build something world-changing together."}
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-primary/10 rounded-lg">
                                <Code className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-primary/60">Tech Stack</span>
                        </div>
                        <button
                            type="button"
                            onPointerDown={(event) => event.stopPropagation()}
                            onClick={(event) => {
                                event.stopPropagation();
                                onViewDetails?.();
                            }}
                            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white transition-colors hover:border-primary/45 hover:text-primary"
                        >
                            <ArrowUp className="h-3.5 w-3.5" />
                            View Details
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {skillsList.map((skill, i) => (
                            <span
                                key={i}
                                className="px-3 py-1.5 bg-neutral-950 border border-white/5 rounded-lg text-xs font-bold text-white/70 uppercase tracking-widest hover:border-primary/30 transition-colors"
                            >
                                {skill}
                            </span>
                        ))}
                        {skillsList.length === 0 ? (
                            <span className="px-3 py-1.5 bg-neutral-950 border border-white/5 rounded-lg text-xs font-bold text-white/40 uppercase tracking-widest">
                                No skills yet
                            </span>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
