"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "An unknown error occurred.";
  if (error === "Configuration") {
    errorMessage =
      "There is a problem with the server configuration. Check if your environment variables are set correctly.";
  } else if (error === "AccessDenied") {
    errorMessage = "You do not have permission to sign in.";
  } else if (error === "Verification") {
    errorMessage =
      "The verification token has expired or has already been used.";
  } else if (error === "JWTSessionError") {
    errorMessage =
      "Old session cookie detected. Please clear your browser cookies and try again.";
  } else if (error) {
    errorMessage = `Sign in failed: ${error}. Please try again later.`;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
      <div className="bg-gradient" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full p-8 glass-morphism rounded-[2.5rem] shadow-2xl relative z-10 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
          className="w-20 h-20 bg-red-500/10 rounded-3xl mx-auto mb-6 flex items-center justify-center rotate-12 border border-red-500/20"
        >
          <AlertTriangle className="text-red-500 w-10 h-10" />
        </motion.div>

        <h1 className="text-3xl font-black tracking-tighter mb-4 text-white uppercase">
          Authentication Error
        </h1>

        <p className="text-gray-300 font-medium mb-8">{errorMessage}</p>

        <div className="space-y-4">
          <Link
            href="/auth/signin"
            className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 border border-red-300/40 hover:bg-red-400 hover:text-white hover:shadow-[0_12px_35px_rgba(239,68,68,0.35)] transition-all duration-300 active:scale-95 shadow-xl"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="block w-full py-4 bg-white/5 text-white rounded-2xl font-bold hover:bg-white/10 transition-all active:scale-95 border border-white/10"
          >
            Return Home
          </Link>
        </div>
      </motion.div>

      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[120px] z-0" />
    </div>
  );
}
