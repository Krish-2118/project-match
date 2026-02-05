"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Globe,
  Layout,
  MessageSquare,
  Rocket,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen relative text-white selection:bg-primary/30 selection:text-white">
      {/* Dynamic Background */}
      <div className="bg-gradient-mesh" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto flex items-center justify-between glass-morphism px-8 py-4 rounded-full"
        >
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-tr from-primary to-accent rounded-xl shadow-lg shadow-primary/20">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Project Match</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-white transition-colors">
                How it Works
              </a>
              <a href="#testimonials" className="hover:text-white transition-colors">
                Stories
              </a>
            </div>
            <Link
              href="/sign-in"
              className="px-6 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-100 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism border-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-gray-200">
              The #1 Platform for Student Builders
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.9]"
          >
            Build Your <br />
            <span className="text-gradient">Dream Team</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
            Stop working alone. Connect with ambitious designers, developers, and visionaries on your
            campus.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/sign-in"
              className="px-10 py-5 bg-gradient-to-r from-primary to-primary-dark rounded-full font-bold text-lg flex items-center gap-2 shadow-[0_0_40px_-5px_rgba(124,58,237,0.5)] hover:shadow-[0_0_60px_-5px_rgba(124,58,237,0.6)] hover:scale-105 transition-all"
            >
              Start Matching <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="px-10 py-5 glass-morphism rounded-full font-bold text-lg hover:bg-white/5 transition-all"
            >
              How it Works
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Zap,
                title: "Instant Matching",
                desc: "Swipe right to connect. Our algorithm learns your preferences to find the perfect technical and cultural fit.",
                color: "text-yellow-400",
              },
              {
                icon: Globe,
                title: "Cross-Campus",
                desc: "Break out of your silo. Find collaborators from different majors, universities, and backgrounds.",
                color: "text-blue-400",
              },
              {
                icon: Target,
                title: "Goal Aligned",
                desc: "Filter by commitment level. Whether it's a weekend hackathon or a startup venture, find people on your wavelength.",
                color: "text-pink-400",
              },
            ].map((feature, i) => (
              <motion.div key={i} variants={item} className="glass-card p-10 rounded-[2.5rem] h-full">
                <div className={`p-4 rounded-2xl bg-white/5 w-fit mb-6 ${feature.color}`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-lg">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-6 relative bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6">How It Works</h2>
            <p className="text-xl text-gray-400">From idea to launch in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            {[
              {
                step: "01",
                title: "Create Profile",
                desc: "Showcase your skills, portfolio, and what you're looking for.",
                icon: Layout,
              },
              {
                step: "02",
                title: "Swipe & Match",
                desc: "Browse projects or teammates. Swipe right to connect.",
                icon: Users,
              },
              {
                step: "03",
                title: "Build Together",
                desc: "Chat, collaborate, and bring your vision to life.",
                icon: Code2,
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                <div className="w-24 h-24 mx-auto glass-morphism rounded-full flex items-center justify-center mb-8 relative z-10 border-2 border-primary/20 shadow-[0_0_30px_-5px_rgba(124,58,237,0.3)] bg-[#030014]">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  <span className="text-primary/50 mr-2 text-lg font-mono">{step.step}.</span>
                  {step.title}
                </h3>
                <p className="text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section id="testimonials" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                Trusted by <br />
                <span className="text-gradient">Builders</span>
              </h2>
              <p className="text-xl text-gray-400 mb-10 max-w-lg">
                Join thousands of students turning their academic skills into real-world impact. Your
                next big thing is one swipe away.
              </p>
              <div className="flex gap-4 flex-wrap">
                {["3,000+ Users", "500+ Projects", "100+ Universities"].map((stat) => (
                  <div
                    key={stat}
                    className="px-6 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-semibold"
                  >
                    {stat}
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="grid gap-6">
              {[
                {
                  quote:
                    "I found my co-founder on Project Match in 2 days. We just got into Y Combinator!",
                  author: "Alex Chen",
                  role: "Stanford CS '25",
                },
                {
                  quote:
                    "Finally, a way to find designers who actually want to build side projects.",
                  author: "Sarah Jones",
                  role: "MIT Design '24",
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  viewport={{ once: true }}
                  className="glass-card p-8 rounded-3xl"
                >
                  <MessageSquare className="w-8 h-8 text-primary/40 mb-4" />
                  <p className="text-xl font-medium mb-6">"{card.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent" />
                    <div>
                      <div className="font-bold">{card.author}</div>
                      <div className="text-sm text-gray-500">{card.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto glass-card rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-primary/10 to-transparent -z-10" />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black mb-8 tracking-tighter"
          >
            Ready to <span className="text-gradient">Ship?</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-3 px-12 py-6 bg-white text-black rounded-full font-bold text-xl hover:bg-gray-100 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              Join Project Match <ArrowRight className="w-6 h-6" />
            </Link>
            <p className="mt-6 text-gray-500 text-sm">No credit card required • Free for students</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-gray-500" />
            <span className="font-bold text-gray-500">Project Match</span>
          </div>
          <p className="text-gray-600 text-sm">
            © 2026 Project Match Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-gray-500">
            <a href="#" className="hover:text-white transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Github
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
