"use client";

import { motion } from "framer-motion";
import { Rocket, Users, ArrowRight, Zap, Globe, Target } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
    const features = [
        {
            icon: Zap,
            title: "Instant Matching",
            description: "Swipe right on projects that ignite your passion. No complex applications, just instant connection.",
            color: "text-primary"
        },
        {
            icon: Globe,
            title: "Global Collaboration",
            description: "Connect with brilliant minds across campus and beyond. Build teams that scale with your vision.",
            color: "text-secondary"
        },
        {
            icon: Target,
            title: "Focused Goals",
            description: "Find teammates who share your technical stack and ambition. Get stuff done faster and better.",
            color: "text-accent"
        }
    ];

    return (
        <div className="min-h-screen relative bg-black text-white overflow-x-hidden">
            <div className="bg-gradient" />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between glass-morphism px-6 py-3 rounded-2xl border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-tr from-primary to-accent rounded-lg">
                            <Rocket className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-black text-xl tracking-tighter">Project Match</span>
                    </div>
                    <Link
                        href="/auth/signin"
                        className="px-5 py-2 glass-morphism rounded-xl text-sm font-bold hover:bg-white/5 transition-all active:scale-95"
                    >
                        Sign In
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10"
                    />

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 leading-tight"
                    >
                        Launch Your <br /> Next Vision
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-medium"
                    >
                        The premium networking platform for undergrads. Swipe through projects, connect with teammates, and build the future together.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-6"
                    >
                        <Link
                            href="/auth/signin"
                            className="group relative px-8 py-5 bg-gradient-to-r from-primary to-secondary rounded-2xl font-black text-lg flex items-center gap-3 hover:shadow-[0_0_40px_-10px_rgba(192,38,211,0.5)] transition-all active:scale-95"
                        >
                            Get Started for Free
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, i) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="glass-morphism p-8 rounded-[2rem] border-white/5 hover:border-white/10 transition-colors group"
                                >
                                    <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center bg-white/5 group-hover:scale-110 transition-transform`}>
                                        <Icon className={`w-8 h-8 ${feature.color}`} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                                    <p className="text-gray-400 leading-relaxed font-medium">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section className="py-20 px-6 relative">
                <div className="max-w-4xl mx-auto glass-morphism p-12 rounded-[3rem] text-center border-white/5 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent -z-10" />
                    <Users className="w-16 h-16 text-primary mx-auto mb-8 animate-pulse" />
                    <h2 className="text-4xl font-black mb-6">Built by Undergrads, <br /> For Undergrads</h2>
                    <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                        Join thousands of students turning their academic skills into real-world impact. Your next big thing is one swipe away.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <div className="px-6 py-2 glass-morphism rounded-full text-sm font-bold border-white/10">3,000+ Students</div>
                        <div className="px-6 py-2 glass-morphism rounded-full text-sm font-bold border-white/10">500+ Projects</div>
                        <div className="px-6 py-2 glass-morphism rounded-full text-sm font-bold border-white/10">100+ Universities</div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 mt-20">
                <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
                    <p>© 2026 Project Match. Built with ❤️ for the next generation of builders.</p>
                </div>
            </footer>
        </div>
    );
}
