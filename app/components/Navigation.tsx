"use client";

import { motion } from "framer-motion";
import { Coffee, MessageCircle, Rocket, User } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCount?: number;
}

export default function Navigation({
  activeTab,
  setActiveTab,
  unreadCount = 0,
}: NavigationProps) {
  const tabs = [
    { id: "projects", label: "Projects", icon: Rocket },
    { id: "teammates", label: "Teammates", icon: Coffee },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 px-3 w-full max-w-max">
      <nav className="glass-morphism px-3 py-2.5 sm:px-6 sm:py-4 rounded-3xl flex items-center gap-2 sm:gap-8 shadow-2xl border border-white/10 backdrop-blur-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative p-2.5 sm:p-3 transition-all duration-300 group"
            >
              <Icon
                className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
                  isActive
                    ? "text-white scale-110"
                    : "text-gray-400 hover:text-white hover:scale-105"
                }`}
              />
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-linear-to-tr from-primary/20 to-secondary/20 rounded-2xl -z-10 border border-primary/30"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {!isActive && (
                <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              )}
              {tab.id === "messages" && unreadCount > 0 ? (
                <span className="absolute -top-2 -right-2 flex min-w-5 items-center justify-center rounded-full border border-black bg-accent px-1.5 py-0.5 text-[10px] font-black text-white shadow-[0_0_12px_rgba(234,40,30,0.35)]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
