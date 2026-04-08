"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navigation from "./Navigation";
import Deck from "./Deck";
import UserCard from "./feed/UserCard";
import TeammateDetailsModal from "./feed/TeammateDetailsModal";
import ProfileView from "./profile/ProfileView";
import { swipeUser } from "../actions/swipe";
import { Coffee, Plus, Rocket, House } from "lucide-react";
import CreateProjectModal from "./CreateProjectModal";
import MatchModal from "./MatchModal";
import MessagesView from "./messages/MessagesView";
import type { ChatUserSummary, ConversationSummary } from "@/lib/chat-types";
import type { ProjectFeedItem } from "@/lib/project-types";
import ProjectBrowser from "./projects/ProjectBrowser";

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  tags: string;
  createdAt: string;
  commentsCount: number;
  owner: { name: string | null };
}

export interface UserProfile {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  skills: string | null;
  major: string | null;
  university: string | null;
  year: string | null;
  github?: string | null;
  email?: string | null;
}

export default function MainApp({
  projects,
  teammates,
  userProfile,
  matches,
  myProjects,
  initialConversations,
  realtimeConfigured,
  initialTab = "projects",
}: {
  projects: ProjectFeedItem[];
  teammates: UserProfile[];
  userProfile: UserProfile;
  matches: UserProfile[];
  myProjects: Project[];
  initialConversations: ConversationSummary[];
  realtimeConfigured: boolean;
  initialTab?: string;
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [projectView, setProjectView] = useState<"discover" | "mine">(
    "discover",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [matchData, setMatchData] = useState<UserProfile | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [selectedTeammate, setSelectedTeammate] = useState<UserProfile | null>(
    null,
  );
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(
    initialConversations.reduce(
      (count, conversation) => count + conversation.unreadCount,
      0,
    ),
  );

  const handleUserSwipe = async (user: UserProfile, dir: "left" | "right") => {
    const result = await swipeUser(user.id, dir === "right" ? "LIKE" : "PASS");
    if (result?.success === false) {
      return;
    }

    if (result?.isMatch) {
      setMatchData(user);
      setIsMatchModalOpen(true);
    }

    window.setTimeout(() => {
      router.refresh();
    }, 320);
  };

  const handleOpenTeammateDetails = (user: UserProfile) => {
    setSelectedTeammate(user);
  };

  const activeProjectItems = useMemo<ProjectFeedItem[]>(
    () => (projectView === "discover" ? projects : myProjects),
    [myProjects, projectView, projects],
  );

  return (
    <div className="relative h-[100dvh] overflow-y-auto overflow-x-hidden overscroll-y-auto bg-black text-white [-webkit-overflow-scrolling:touch]">
      {/* Enhanced background with cinematic glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(234,40,30,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />

      <main
        className={`container mx-auto max-w-5xl px-3 sm:px-6 md:px-8 py-5 sm:py-8 relative z-10 ${
          activeTab === "teammates" ? "pb-24 sm:pb-32" : "pb-28 sm:pb-32"
        }`}
      >
        {activeTab === "projects" && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-4 sm:mb-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="text-center lg:text-left space-y-2 px-1 sm:px-0">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase leading-tight">
                    <span className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-1 align-middle">
                      <Rocket className="w-7 h-7 sm:w-8 sm:h-8 text-primary shrink-0" />
                      <span className="leading-none">Discover</span>
                      <span className="text-primary font-light leading-none">
                        Projects
                      </span>
                    </span>
                  </h1>
                  <p className="text-gray-500 text-[11px] sm:text-xs tracking-[0.14em] sm:tracking-[0.2em] font-bold uppercase opacity-60 px-2 sm:px-0">
                    Scroll sideways, open details, and join the public thread
                  </p>
                </div>

                <div className="flex w-full flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 lg:w-auto">
                  <Link
                    href="/landing"
                    className="group relative inline-flex h-12 min-w-35 sm:min-w-37.5 items-center justify-center gap-2 px-6 sm:px-7 rounded-xl border border-white/20 bg-white/3 text-xs font-bold uppercase tracking-[0.16em] text-gray-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/9 hover:shadow-[0_10px_25px_rgba(255,255,255,0.12)] active:translate-y-0 active:scale-[0.99] cursor-pointer text-center"
                  >
                    <span className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-b from-white/8 to-transparent opacity-70" />
                    <span className="relative inline-flex h-full items-center justify-center gap-2 w-full leading-none">
                      <House className="w-4 h-4 text-primary transition-transform duration-300 group-hover:scale-110" />
                      Home
                    </span>
                  </Link>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="group relative inline-flex h-12 min-w-42.5 sm:min-w-47.5 items-center justify-center gap-2 px-7 sm:px-10 rounded-xl border border-primary/45 bg-linear-to-r from-zinc-950 via-neutral-900 to-zinc-950 text-xs font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/70 hover:from-zinc-900 hover:via-neutral-800 hover:to-zinc-900 hover:shadow-[0_12px_30px_rgba(234,40,30,0.28)] active:translate-y-0 active:scale-[0.99] outline-none cursor-pointer"
                  >
                    <span className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-b from-primary/20 to-transparent opacity-70" />
                    <span className="relative inline-flex h-full items-center justify-center gap-2 w-full leading-none">
                      <Plus className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-90" />
                      Add Project
                    </span>
                  </button>
                </div>
              </div>
            </header>

            <div className="flex justify-center lg:justify-start">
              <div className="inline-flex rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
                <button
                  type="button"
                  onClick={() => setProjectView("discover")}
                  className={`rounded-[1rem] px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] transition-all sm:px-5 ${
                    projectView === "discover"
                      ? "bg-linear-to-r from-zinc-950 via-neutral-900 to-zinc-950 text-white shadow-[0_10px_20px_rgba(234,40,30,0.18)]"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  Discover
                </button>
                <button
                  type="button"
                  onClick={() => setProjectView("mine")}
                  className={`rounded-[1rem] px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] transition-all sm:px-5 ${
                    projectView === "mine"
                      ? "bg-linear-to-r from-zinc-950 via-neutral-900 to-zinc-950 text-white shadow-[0_10px_20px_rgba(234,40,30,0.18)]"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  My Projects
                </button>
              </div>
            </div>

            <ProjectBrowser
              projects={activeProjectItems}
              emptyTitle={
                projectView === "discover"
                  ? "No projects available yet"
                  : "You have not posted any projects yet"
              }
              emptyMessage={
                projectView === "discover"
                  ? "Create the first project or check back later."
                  : "Use Add Project to publish your first build here."
              }
            />
          </div>
        )}

        {activeTab === "teammates" && (
          <div className="mx-auto flex min-h-[calc(100dvh-6.5rem)] w-full max-w-[23rem] flex-col gap-3 sm:min-h-[calc(100dvh-8rem)] sm:max-w-[29rem] sm:gap-5 md:max-w-[33rem] md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-1 space-y-2 px-1 text-center sm:mb-2 sm:space-y-3 sm:px-0">
              <h1 className="flex flex-wrap items-center justify-center gap-2 text-[clamp(2rem,7vw,4.15rem)] font-black uppercase tracking-tighter leading-[0.9]">
                <Coffee className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                Find Your{" "}
                <span className="text-primary font-light">Dream Team</span>
              </h1>
              <p className="mx-auto max-w-[18rem] text-gray-500 text-[10px] sm:max-w-[24rem] sm:text-[11px] tracking-[0.14em] sm:tracking-[0.18em] font-bold uppercase opacity-60">
                Swipe left or right to decide, swipe up for the full profile
              </p>
            </header>

            <div className="flex min-h-0 flex-1 items-stretch justify-center">
              <Deck
                items={teammates}
                renderItem={(user: UserProfile) => (
                  <UserCard
                    user={user}
                    onViewDetails={() => handleOpenTeammateDetails(user)}
                  />
                )}
                onSwipe={handleUserSwipe}
                onSwipeUp={handleOpenTeammateDetails}
                emptyState={
                  <div className="text-center space-y-6 py-20">
                    <div className="p-6 bg-linear-to-tr from-secondary/20 to-accent/20 rounded-full w-fit mx-auto">
                      <Coffee className="w-12 h-12 text-secondary/60" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-400 text-lg font-medium">
                        No teammates available yet
                      </p>
                      <p className="text-gray-500 text-sm">
                        New profiles will appear here when more people join.
                      </p>
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <MessagesView
            currentUserId={userProfile.id || ""}
            matches={matches as ChatUserSummary[]}
            initialConversations={initialConversations}
            realtimeConfigured={realtimeConfigured}
            onUnreadCountChange={setUnreadCount}
          />
        )}

        {activeTab === "profile" && (
          <ProfileView
            profile={userProfile}
            myProjects={myProjects}
            matches={matches}
          />
        )}
      </main>

      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={unreadCount}
      />
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <MatchModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        matchUser={matchData}
      />
      <TeammateDetailsModal
        user={selectedTeammate}
        onClose={() => setSelectedTeammate(null)}
      />
    </div>
  );
}
