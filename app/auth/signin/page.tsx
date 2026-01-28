"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Github, Mail, Sparkles } from "lucide-react";
import { useState } from "react";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
            <div className="bg-gradient" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-md w-full p-8 glass-morphism rounded-[2.5rem] shadow-2xl relative z-10"
            >
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                        className="w-20 h-20 bg-gradient-to-tr from-primary to-accent rounded-3xl mx-auto mb-6 flex items-center justify-center rotate-12 shadow-lg"
                    >
                        <Sparkles className="text-white w-10 h-10" />
                    </motion.div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Project Match
                    </h1>
                    <p className="text-gray-400 font-medium">Connect. Build. Innovate.</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => signIn("github", { callbackUrl: "/" })}
                        className="w-full py-4 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-200 transition-all active:scale-95 shadow-xl"
                    >
                        <Github className="w-6 h-6" />
                        Continue with GitHub
                    </button>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-black px-4 text-gray-500 font-bold tracking-widest">Or Magic Link</span>
                        </div>
                    </div>

                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setIsLoading(true);
                            await signIn("nodemailer", { email, callbackUrl: "/" });
                            setIsLoading(false);
                        }}
                        className="space-y-4"
                    >
                        <input
                            type="email"
                            placeholder="name@university.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-6 py-4 glass-morphism rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white placeholder:text-gray-600"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-primary/20 hover:bg-primary/30 text-primary-foreground border border-primary/30 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Mail className="w-5 h-5" />
                            {isLoading ? "Sending..." : "Send Magic Link"}
                        </button>
                    </form>
                </div>

                <p className="mt-10 text-center text-sm text-gray-500">
                    By continuing, you agree to our <span className="text-gray-400 underline cursor-pointer">Terms</span>
                </p>
            </motion.div>

            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[120px] -z-0" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[120px] -z-0" />
        </div>
    );
}
