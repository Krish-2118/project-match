"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Zap, Users, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

const steps = [
    {
        icon: Users,
        title: "Match based on shared stacks",
        description: "Our algorithm connects you with builders who possess the complementary skills your project desperately needs.",
        delay: 0.1
    },
    {
        icon: Zap,
        title: "Swipe to Collaborate",
        description: "Intuitively swipe right on projects and teammates that excite you. A mutual swipe opens the door to instant connection.",
        delay: 0.2
    },
    {
        icon: ShieldCheck,
        title: "Verified Student Portfolios",
        description: "Review comprehensive, authenticated portfolios built by students demonstrating real, shipped code.",
        delay: 0.3
    }
];

export default function HowItWorks() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/30">
            {/* Cinematic Background */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(234,40,30,0.1),transparent_70%)] pointer-events-none" />
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 py-12 md:py-24 relative z-10">
                <Link href="/landing" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors tracking-widest uppercase mb-16">
                    <ArrowLeft className="w-4 h-4" /> Back Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-6 mb-24"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-black tracking-[0.2em] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 text-primary transition-transform" />
                        <Sparkles className="w-3 h-3 relative z-10" />
                        <span className="relative z-10 uppercase">The Platform for Builders</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                        How <span className="text-primary block md:inline">Project Match</span> Works
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                        We&apos;re fundamentally changing how elite student developers find their co-founders, teammates, and next big ideas.
                        We&apos;ve built the ecosystem for high-impact collaboration. From initial idea to final deployment, here&apos;s how Project Match empowers your journey.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: step.delay }}
                            className="bg-neutral-900 border border-white/5 rounded-3xl p-8 hover:bg-neutral-800 hover:border-white/10 transition-colors group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                                <step.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight mb-3 text-white">{step.title}</h3>
                            <p className="text-sm font-medium text-gray-500 leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mt-32 text-center"
                >
                    <h2 className="text-2xl font-black tracking-widest uppercase mb-8">Ready to Build?</h2>
                    <Link href="/signup" className="inline-block px-10 py-5 bg-primary text-white font-black text-sm tracking-widest uppercase rounded-[2rem] hover:bg-white hover:text-black hover:scale-105 transition-all shadow-[0_0_40px_rgba(234,40,30,0.3)]">
                        Get Started Free
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
