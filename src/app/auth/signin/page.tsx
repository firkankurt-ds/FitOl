"use client";

import { signIn } from "next-auth/react";
import { Github, Chrome, Dumbbell } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SignInPage() {
    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/bg-signin.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950"></div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 w-full max-w-md text-center relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20">
                    <Dumbbell className="text-white w-8 h-8" />
                </div>

                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">FitOl</h1>
                <p className="text-slate-300 mb-8 text-lg">Your journey to greatness starts here.</p>

                <div className="space-y-3">
                    <button
                        onClick={() => signIn("github", { callbackUrl: "/profile" })}
                        className="w-full bg-slate-800/50 hover:bg-slate-800 text-white font-medium py-4 px-4 rounded-2xl flex items-center justify-center gap-3 transition-all border border-white/10 hover:border-white/20 group"
                    >
                        <Github className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                        <span>Continue with GitHub</span>
                    </button>

                    <button
                        onClick={() => signIn("google", { callbackUrl: "/profile" })}
                        className="w-full bg-white hover:bg-slate-100 text-slate-900 font-medium py-4 px-4 rounded-2xl flex items-center justify-center gap-3 transition-all border border-slate-200 shadow-lg shadow-white/5"
                    >
                        <Chrome className="w-5 h-5 text-red-500" />
                        <span>Continue with Google</span>
                    </button>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-700"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-slate-900 px-2 text-slate-500">Or</span>
                        </div>
                    </div>

                    <button
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-4 px-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-500/20"
                    >
                        <span>Sign in</span>
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5">
                    <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
