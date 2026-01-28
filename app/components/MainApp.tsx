"use client";

import { useState } from "react";
import Navigation from "./Navigation";
import Deck from "./Deck";
import ProjectCard from "./feed/ProjectCard";
import UserCard from "./feed/UserCard";
import ProfileView from "./profile/ProfileView";
import { swipeProject, swipeUser } from "../actions/swipe";
import { Coffee, Plus, Rocket, Sparkles, MessageSquare } from "lucide-react";
import { seedData } from "../actions/profile";
import CreateProjectModal from "./CreateProjectModal";
import MatchModal from "./MatchModal";

interface Project {
    id: string;
    title: string;
    description: string;
    imageUrl?: string | null;
    tags: string;
    owner: { name: string | null };
}

interface UserProfile {
    id: string;
    name: string | null;
    image: string | null;
    bio: string | null;
    skills: string | null;
    major: string | null;
    university: string | null;
    year: string | null;
    email?: string | null;
}

export default function MainApp({
    projects,
    teammates,
    userProfile,
    matches,
    myProjects
}: {
    projects: Project[],
    teammates: UserProfile[],
    userProfile: UserProfile,
    matches: UserProfile[],
    myProjects: Project[]
}) {
    const [activeTab, setActiveTab] = useState("projects");
    const [isSeeding, setIsSeeding] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [matchData, setMatchData] = useState<UserProfile | null>(null);
    const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

    const handleUserSwipe = async (user: UserProfile, dir: "left" | "right") => {
        const result = await swipeUser(user.id, dir === "right" ? "LIKE" : "PASS");
        if (result?.isMatch) {
            const found = teammates.find(t => t.id === result.swipedId);
            if (found) {
                setMatchData(found);
                setIsMatchModalOpen(true);
            }
        }
    };

    const handleSeed = async () => {
        setIsSeeding(true);
        try {
            await seedData();
            window.location.reload();
        } catch (error) {
            console.error("Seeding failed", error);
        } finally {
            setIsSeeding(false);
        }
    };

    return (
        <div className="min-h-screen relative bg-black text-white selection:bg-primary selection:text-white">
            <div className="bg-gradient" />

            <main className="container mx-auto px-4 py-8 pb-32 max-w-4xl">
                {activeTab === "projects" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <header className="flex items-center justify-between">
                            <div className="space-y-1 text-left">
                                <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                                    <Rocket className="text-primary" />
                                    <span>Projects</span>
                                </h1>
                                <p className="text-gray-400 text-sm">Right to Join, Left to Pass</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="p-4 glass-morphism rounded-3xl hover:bg-white/5 active:scale-95 transition-all text-primary shadow-lg border-primary/20"
                            >
                                <Plus className="w-6 h-6" />
                            </button>
                        </header>

                        <Deck
                            items={projects}
                            renderItem={(project: Project) => <ProjectCard project={project} />}
                            onSwipe={(project: Project, dir: "left" | "right") => swipeProject(project.id, dir === "right" ? "LIKE" : "PASS")}
                            emptyState={
                                <div className="text-center space-y-4 py-20">
                                    <Sparkles className="w-12 h-12 text-gray-600 mx-auto" />
                                    <p className="text-gray-500">No more projects in your area.</p>
                                    <button
                                        onClick={handleSeed}
                                        disabled={isSeeding}
                                        className="px-6 py-2 glass-morphism rounded-full text-sm hover:bg-white/10 transition-colors"
                                    >
                                        {isSeeding ? "Seeding..." : "Seed Sample Data"}
                                    </button>
                                </div>
                            }
                        />
                    </div>
                )}

                {activeTab === "teammates" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <header className="text-center space-y-2">
                            <h1 className="text-4xl font-black tracking-tight flex items-center justify-center gap-3">
                                <Coffee className="text-secondary" />
                                <span>Teammates</span>
                            </h1>
                            <p className="text-gray-400">Connect with brilliant minds</p>
                        </header>

                        <Deck
                            items={teammates}
                            renderItem={(user: UserProfile) => <UserCard user={user} />}
                            onSwipe={handleUserSwipe}
                            emptyState={
                                <div className="text-center space-y-4 py-20">
                                    <Coffee className="w-12 h-12 text-gray-600 mx-auto" />
                                    <p className="text-gray-500">You&apos;ve seen everyone! Check back later.</p>
                                </div>
                            }
                        />
                    </div>
                )}

                {activeTab === "messages" && (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                        <MessageSquare className="w-12 h-12 text-gray-600" />
                        <h2 className="text-2xl font-bold">Messages Coming Soon</h2>
                        <p className="text-gray-500 max-w-xs">We&apos;re building a premium chat experience for your matches.</p>
                    </div>
                )}
                {activeTab === "profile" && (
                    <ProfileView
                        profile={userProfile}
                        myProjects={myProjects}
                        matches={matches}
                    />
                )}
            </main>

            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
            <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <MatchModal
                isOpen={isMatchModalOpen}
                onClose={() => setIsMatchModalOpen(false)}
                matchUser={matchData}
            />
        </div>
    );
}
