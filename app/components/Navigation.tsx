"use client";

import { motion } from "framer-motion";
import { Coffee, MessageCircle, Rocket, User } from "lucide-react";

interface NavigationProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
    const tabs = [
        { id: "projects", label: "Projects", icon: Rocket },
        { id: "teammates", label: "Teammates", icon: Coffee },
        { id: "messages", label: "Messages", icon: MessageCircle },
        { id: "profile", label: "Profile", icon: User },
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <nav className="glass-morphism px-4 py-3 rounded-full flex items-center gap-6 shadow-2xl">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="relative p-2 transition-colors duration-300"
                        >
                            <Icon
                                className={`w-6 h-6 transition-colors duration-300 ${isActive ? "text-primary" : "text-gray-400 hover:text-white"
                                    }`}
                            />
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                                    initial={false}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            {tab.id === "messages" && (
                                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
