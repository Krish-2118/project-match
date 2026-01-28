"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, Github, X } from "lucide-react";
import Image from "next/image";

export default function MatchModal({
    isOpen,
    onClose,
    matchUser
}: {
    isOpen: boolean;
    onClose: () => void;
    matchUser: { name: string | null; image: string | null; major: string | null; university: string | null } | null
}) {
    if (!matchUser) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-[201] p-6 text-center"
                    >
                        <div className="relative mb-12">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-2xl"
                            />
                            <Heart className="w-24 h-24 text-primary fill-primary mx-auto relative z-10 drop-shadow-[0_0_20px_rgba(192,38,211,0.5)]" />
                        </div>

                        <h2 className="text-5xl font-black italic tracking-tighter text-white mb-2">IT&apos;S A MATCH!</h2>
                        <p className="text-gray-400 mb-10 font-bold uppercase tracking-widest text-sm">You both liked each other</p>

                        <div className="glass-morphism rounded-[2.5rem] p-8 border border-white/10 mb-8 aspect-square flex flex-col items-center justify-center gap-6">
                            <div className="w-32 h-32 rounded-[2rem] border-4 border-primary bg-gray-900 overflow-hidden relative shadow-2xl">
                                {matchUser.image ? (
                                    <Image src={matchUser.image} alt={matchUser.name || "Match"} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/10 text-4xl font-black">
                                        ?
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white">{matchUser.name}</h3>
                                <p className="text-primary font-bold">{matchUser.major} @ {matchUser.university}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => window.open(`https://github.com/${matchUser.name?.toLowerCase().replace(/\s+/g, '')}`, '_blank')}
                                className="w-full py-4 bg-white text-black rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-105 transition-transform"
                            >
                                <Github className="w-5 h-5" />
                                View GitHub
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-4 glass-morphism text-white/50 rounded-2xl font-bold hover:text-white transition-colors"
                            >
                                Keep Swiping
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute -top-12 -right-4 p-2 text-white/30 hover:text-white transition-colors"
                        >
                            <X className="w-8 h-8" />
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
