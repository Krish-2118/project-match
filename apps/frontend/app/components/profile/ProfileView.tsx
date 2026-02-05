"use client";

import { updateProfile, uploadImage } from "@/app/actions/profile";
import { unmatchUser } from "@/app/actions/swipe";
import {
  Calendar,
  Camera,
  CheckCircle2,
  Github,
  Link as LinkIcon,
  LogOut,
  Save,
  User,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import ProjectCard from "../feed/ProjectCard";

interface Profile {
  id?: string;
  name: string | null;
  bio: string | null;
  skills: string | null;
  major: string | null;
  university: string | null;
  year: string | null;
  image?: string | null;
  github?: string | null;
  website?: string | null;
  banner?: string | null;
  email?: string | null;
}

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  tags: string;
  owner: { name: string | null };
}

export default function ProfileView({
  profile,
  myProjects,
  matches,
}: { profile: Profile; myProjects: Project[]; matches: Profile[] }) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("about");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  // Image state
  const [avatarUrl, setAvatarUrl] = useState(profile.image);
  const [bannerUrl, setBannerUrl] = useState(profile.banner);
  const [isUploading, setIsUploading] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const skillsList = (profile.skills || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((skill, index, all) => all.indexOf(skill) === index);

  const clerkEnabled = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
      !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("..."),
  );

  const handleSignOut = () => {
    window.location.href = clerkEnabled ? "/sign-out" : "/landing";
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "banner",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        // Optimistic update
        if (type === "avatar") setAvatarUrl(base64);
        else setBannerUrl(base64);

        const result = await uploadImage(base64);
        if (result.imageUrl) {
          if (type === "avatar") setAvatarUrl(result.imageUrl);
          else setBannerUrl(result.imageUrl);
        } else {
          console.error("Upload failed", result.error);
          alert(`Upload failed: ${result.error}`);
          // Revert optimistic update
          if (type === "avatar") setAvatarUrl(profile.image);
          else setBannerUrl(profile.banner);
        }
        setIsUploading(false);
      };
    } catch (error) {
      console.error("Error processing image:", error);
      setIsUploading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      // Append current image URLs if they've changed
      if (avatarUrl && avatarUrl !== profile.image) formData.set("image", avatarUrl);
      if (bannerUrl && bannerUrl !== profile.banner) formData.set("banner", bannerUrl);

      const result = await updateProfile(formData);
      if (result.success) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    });
  };

  const handleUnmatch = async (userId: string) => {
    if (!confirm("Are you sure you want to unmatch?")) return;
    const result = await unmatchUser(userId);
    if (result.success) {
      window.location.reload();
    } else {
      alert("Failed to unmatch.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 animate-in fade-in duration-700">
      {/* Banner Section */}
      <div className="relative h-48 md:h-64 rounded-b-[2rem] overflow-hidden bg-gradient-to-r from-primary/30 via-accent/20 to-secondary/30 border-b border-white/5 shadow-2xl group">
        {bannerUrl ? (
          <Image src={bannerUrl} alt="Banner" fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(192,38,211,0.1),transparent_70%)]" />
        )}
        <button
          type="button"
          onClick={() => bannerInputRef.current?.click()}
          className="absolute bottom-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 hover:bg-black/70 transition-colors z-20"
        >
          <Camera className="w-5 h-5 text-white/70" />
        </button>
        <input
          type="file"
          ref={bannerInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleImageChange(e, "banner")}
        />
      </div>

      {/* Profile Header Block */}
      <div className="px-6 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] border-4 border-black bg-neutral-900 overflow-hidden shadow-2xl flex items-center justify-center relative">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={profile.name || ""} fill className="object-cover" />
              ) : (
                <User className="w-16 h-16 text-white/10" />
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-2 right-2 p-2 bg-primary rounded-xl shadow-lg hover:scale-110 transition-transform active:scale-95"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
            <input
              type="file"
              ref={avatarInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "avatar")}
            />
          </div>

          <div className="flex-1 pb-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white mb-1">
                  {profile.name || "Set your name"}
                </h1>
                <p className="text-primary font-bold text-sm tracking-widest uppercase">
                  {profile.major || "Major not set"} • {profile.university || "University not set"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="p-3 bg-neutral-900 border border-white/5 rounded-2xl text-red-500 hover:bg-red-950/30 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 mt-8">
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Matches/Friends Section */}
          <div className="bg-neutral-900 rounded-3xl p-6 border border-white/5 shadow-xl">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" /> Friends & Matches
            </h3>
            {matches.length > 0 ? (
              <div className="space-y-4">
                {matches.map((match) => (
                  <div key={match.id} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-full bg-neutral-800 overflow-hidden relative">
                      {match.image ? (
                        <Image
                          src={match.image}
                          alt={match.name || "Match"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-gray-600 m-auto mt-2.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{match.name}</p>
                      <p className="text-xs text-gray-500 truncate">{match.major}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={`mailto:${match.email || ""}`}
                        className="p-1.5 bg-neutral-800 rounded-lg hover:bg-neutral-700 text-white transition-colors"
                        title="Email"
                      >
                        <LinkIcon className="w-3 h-3" />
                      </a>
                      <button
                        type="button"
                        onClick={() => match.id && handleUnmatch(match.id)}
                        className="p-1.5 bg-neutral-800 rounded-lg hover:bg-red-900/50 text-red-500 transition-colors"
                        title="Unmatch"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <p className="text-gray-500 text-sm font-bold">No friends yet.</p>
                <p className="text-xs text-gray-600 mt-1">Start swiping to find teammates!</p>
              </div>
            )}
          </div>

          <div className="bg-neutral-900 rounded-3xl p-6 border border-white/5 shadow-xl">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> About Me
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-bold text-gray-300">
                  {profile.year || "Year not set"}
                </span>
              </div>
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span className="text-sm font-bold truncate">
                    {profile.website.replace(/^https?:\/\//, "")}
                  </span>
                </a>
              )}
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span className="text-sm font-bold truncate">
                    github.com/{profile.github.split("/").pop()}
                  </span>
                </a>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
              <h4 className="font-bold text-xs uppercase tracking-widest text-gray-600 mb-4">
                Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-neutral-950 border border-white/10 rounded-lg text-[10px] font-black text-white/80 uppercase tracking-tighter"
                  >
                    {skill}
                  </span>
                ))}
                {skillsList.length === 0 && (
                  <span className="text-gray-500 text-xs italic">Add skills to show off</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-neutral-900 rounded-3xl overflow-hidden border border-white/5 shadow-xl">
            <div className="flex border-b border-white/5 px-4">
              <button
                type="button"
                onClick={() => setActiveTab("about")}
                className={`px-6 py-4 text-sm font-black uppercase tracking-wider transition-all border-b-2 ${
                  activeTab === "about"
                    ? "border-primary text-white"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                Edit Profile
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("activity")}
                className={`px-6 py-4 text-sm font-black uppercase tracking-wider transition-all border-b-2 ${
                  activeTab === "activity"
                    ? "border-primary text-white"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                My Projects
              </button>
            </div>

            <div className="p-8">
              {activeTab === "about" ? (
                <form action={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label
                        htmlFor="pid_name"
                        className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1"
                      >
                        Full Name
                      </label>
                      <input
                        id="pid_name"
                        name="name"
                        defaultValue={profile.name || ""}
                        className="w-full px-5 py-3.5 bg-black border border-white/10 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder:text-gray-700 font-bold"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    <div className="space-y-3">
                      <label
                        htmlFor="pid_major"
                        className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1"
                      >
                        Major
                      </label>
                      <input
                        id="pid_major"
                        name="major"
                        defaultValue={profile.major || ""}
                        className="w-full px-5 py-3.5 bg-black border border-white/10 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder:text-gray-700 font-bold"
                        placeholder="e.g. Computer Science"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label
                        htmlFor="pid_university"
                        className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1"
                      >
                        University
                      </label>
                      <input
                        id="pid_university"
                        name="university"
                        defaultValue={profile.university || ""}
                        className="w-full px-5 py-3.5 bg-black border border-white/10 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder:text-gray-700 font-bold"
                        placeholder="e.g. Stanford University"
                      />
                    </div>
                    <div className="space-y-3">
                      <label
                        htmlFor="pid_year"
                        className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1"
                      >
                        Year
                      </label>
                      <select
                        id="pid_year"
                        name="year"
                        defaultValue={profile.year || ""}
                        className="w-full px-5 py-3.5 bg-black border border-white/10 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white font-bold"
                      >
                        <option value="Freshman">Freshman</option>
                        <option value="Sophomore">Sophomore</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                        <option value="Graduate">Graduate</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label
                      htmlFor="pid_bio"
                      className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1"
                    >
                      Bio
                    </label>
                    <textarea
                      id="pid_bio"
                      name="bio"
                      defaultValue={profile.bio || ""}
                      className="w-full px-5 py-3.5 bg-black border border-white/10 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder:text-gray-700 min-h-[140px] resize-none font-bold leading-relaxed"
                      placeholder="Tell your story..."
                    />
                  </div>

                  <div className="space-y-3">
                    <label
                      htmlFor="pid_skills"
                      className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1"
                    >
                      Skills (comma separated)
                    </label>
                    <input
                      id="pid_skills"
                      name="skills"
                      defaultValue={profile.skills || ""}
                      className="w-full px-5 py-3.5 bg-black border border-white/10 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder:text-gray-700 font-bold"
                      placeholder="e.g. React, Python, UI Design"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label
                        htmlFor="pid_website"
                        className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1"
                      >
                        Portfolio / Website
                      </label>
                      <input
                        id="pid_website"
                        name="website"
                        defaultValue={profile.website || ""}
                        className="w-full px-5 py-3.5 bg-black border border-white/10 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder:text-gray-700 font-bold"
                        placeholder="https://your-portfolio.com"
                      />
                    </div>
                    <div className="space-y-3">
                      <label
                        htmlFor="pid_github"
                        className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1"
                      >
                        GitHub URL
                      </label>
                      <input
                        id="pid_github"
                        name="github"
                        defaultValue={profile.github || ""}
                        className="w-full px-5 py-3.5 bg-black border border-white/10 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder:text-gray-700 font-bold"
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isPending}
                      className={`w-full py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 transition-all ${
                        status === "success"
                          ? "bg-emerald-500 text-white"
                          : status === "error"
                            ? "bg-red-500 text-white"
                            : "bg-white text-black hover:bg-gray-200 active:scale-95 disabled:opacity-50"
                      }`}
                    >
                      {status === "success" ? (
                        <>
                          <CheckCircle2 className="w-6 h-6" />
                          Saved Successfully!
                        </>
                      ) : status === "error" ? (
                        <>
                          <X className="w-6 h-6" />
                          Error - Try Again
                        </>
                      ) : (
                        <>
                          <Save className="w-6 h-6" />
                          {isPending ? "Saving..." : "Save Changes"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-8">
                  {myProjects.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {myProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 space-y-4">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                        <Zap className="w-8 h-8 text-gray-600" />
                      </div>
                      <p className="text-gray-500 font-bold">
                        You haven&apos;t posted any projects yet.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
