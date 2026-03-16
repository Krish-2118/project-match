"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Rocket } from "lucide-react";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6">
    <path
      fill="#EA4335"
      d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.4 14.7 2.4 12 2.4 6.9 2.4 2.7 6.6 2.7 11.7S6.9 21 12 21c6.8 0 9.4-4.8 9.4-7.3 0-.5-.1-.9-.1-1.3H12Z"
    />
    <path
      fill="#34A853"
      d="M3.8 7.5l3.2 2.3c.9-1.8 2.8-3.1 5-3.1 1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.4 14.7 2.4 12 2.4c-3.5 0-6.5 2-8.2 5.1Z"
    />
    <path
      fill="#FBBC05"
      d="M12 21c2.6 0 4.8-.9 6.4-2.5l-3-2.4c-.8.6-1.9 1-3.4 1-3.8 0-5.2-2.6-5.4-3.9l-3.3 2.5C5 19 8.2 21 12 21Z"
    />
    <path
      fill="#4285F4"
      d="M21.4 12.4H12v3.9h5.4c-.3 1.5-1.3 2.6-2.4 3.2l3 2.4c1.8-1.7 3.4-4.2 3.4-8 0-.5-.1-.9-.1-1.5Z"
    />
  </svg>
);

export default function SignUpPage() {
  const { data: session, status } = useSession();
  const [pendingProvider, setPendingProvider] = useState<
    "github" | "google" | null
  >(null);

  const handleProviderSignIn = async (provider: "github" | "google") => {
    setPendingProvider(provider);

    if (status === "authenticated") {
      await signOut({ redirect: false });
    }

    await signIn(provider, { callbackUrl: "/?tab=projects" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
      <div className="bg-gradient" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full px-6 py-8 sm:px-10 sm:py-10 glass-morphism rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-2xl sm:rounded-3xl mx-auto mb-6 flex items-center justify-center -rotate-12 shadow-[0_0_30px_rgba(234,40,30,0.4)]"
          >
            <Rocket className="text-white w-8 h-8 sm:w-10 sm:h-10" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-2 text-white uppercase">
            Join Match
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
            Find your Dream Team.
          </p>
        </div>

        {status === "authenticated" ? (
          <p className="mb-6 text-center text-sm text-amber-300">
            Signed in as {session?.user?.email || "another account"}. Choosing a
            provider below will sign out the current account and switch to the
            new one.
          </p>
        ) : null}

        <div className="space-y-4">
          <button
            onClick={() => handleProviderSignIn("github")}
            disabled={status === "loading" || pendingProvider !== null}
            className="w-full py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 border-2 border-white/35 bg-zinc-950/90 text-white hover:bg-zinc-900 hover:border-white/60 hover:shadow-[0_0_20px_rgba(255,255,255,0.12)] transition-all active:scale-95 shadow-xl"
          >
            <Github className="w-6 h-6" />
            {pendingProvider === "github"
              ? "Switching to GitHub..."
              : "Sign Up with GitHub"}
          </button>
          <button
            onClick={() => handleProviderSignIn("google")}
            disabled={status === "loading" || pendingProvider !== null}
            className="w-full py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 border-2 border-primary/45 bg-primary/10 text-white hover:bg-primary/16 hover:border-primary/70 hover:shadow-[0_0_20px_rgba(234,40,30,0.25)] transition-all active:scale-95"
          >
            <GoogleIcon />
            {pendingProvider === "google"
              ? "Switching to Google..."
              : "Continue with Google"}
          </button>
        </div>

        <p className="mt-10 text-center text-sm font-bold text-gray-500">
          Already a member?{" "}
          <a
            href="/auth/signin"
            className="text-primary hover:text-white transition-colors cursor-pointer"
          >
            Sign In
          </a>
        </p>
      </motion.div>

      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-0 pointer-events-none" />
    </div>
  );
}
