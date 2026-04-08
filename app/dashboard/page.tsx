"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, LogOut, Zap, Users, Target } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    console.log("Logging out...");
    router.push("/");
  };

  const stats = [
    { label: "Projects", value: "0", icon: Target, color: "from-pink-500 to-rose-500" },
    { label: "Active Matches", value: "0", icon: Zap, color: "from-cyan-500 to-blue-500" },
    { label: "Team Members", value: "0", icon: Users, color: "from-purple-500 to-indigo-500" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-black text-sm">PM</span>
              </div>
              <span className="font-bold text-xl">Project Match</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/create"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-pink-500/50 transition-all"
              >
                <Plus className="w-4 h-4" />
                Create Project
              </Link>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  Profile
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-white/20 rounded-lg shadow-lg backdrop-blur-sm">
                    <Link href="/profile" className="block px-4 py-2 hover:bg-white/10 transition">
                      View Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-white/10 transition flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-32">
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
              Your Dashboard
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl">Manage your projects and connect with amazing teammates</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1, ease: [0, 0.7, 0.29, 0.97] }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 transition-all"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                  <div className="relative space-y-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} p-2 flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                      <p className="text-4xl font-black text-white mt-1">{stat.value}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Projects Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, ease: [0, 0.7, 0.29, 0.97] }}
            className="rounded-2xl p-8 border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Your Projects</h2>
                <p className="text-gray-400 text-sm mt-1">Create or manage your projects here</p>
              </div>
              <Link
                href="/create"
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/50 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Project
              </Link>
            </div>

            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-6xl mb-4">🚀</div>
              <p className="text-gray-400 text-lg text-center">
                No projects yet. <br />
                Let&apos;s launch your first project!
              </p>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, ease: [0, 0.7, 0.29, 0.97] }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Link
              href="/projects"
              className="group rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur-sm hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all overflow-hidden"
            >
              <div className="space-y-2">
                <h3 className="text-lg font-bold group-hover:text-cyan-400 transition">Browse Projects</h3>
                <p className="text-gray-400">Discover exciting projects and find your next team</p>
              </div>
            </Link>
            <Link
              href="/profile"
              className="group rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur-sm hover:border-pink-500/50 hover:bg-pink-500/10 transition-all overflow-hidden"
            >
              <div className="space-y-2">
                <h3 className="text-lg font-bold group-hover:text-pink-400 transition">Edit Profile</h3>
                <p className="text-gray-400">Update your skills and showcase your expertise</p>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
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