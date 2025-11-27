"use client";

import React from 'react';
import { UserProfile } from '@/types';
import { User, Weight, CalendarDays, LogIn, Ruler } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ProfileHeaderProps {
    profile: UserProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
    const { data: session } = useSession();

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative text-white p-8 rounded-b-[2.5rem] shadow-2xl shadow-indigo-900/50 overflow-hidden"
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img src="/bg-header.png" alt="Header" className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900/80 mix-blend-multiply"></div>
            </div>

            {/* Decorative Circle */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl z-0"></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-semibold tracking-wide text-white"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                    {profile.firstName.length > 10 ? "Hi, let's start!" : `Hi, ${profile.firstName}`}
                </motion.h1>
                <Link href="/profile">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-1 cursor-pointer hover:scale-105 transition-transform shadow-lg">
                        {session?.user?.image || profile.image ? (
                            <img src={session?.user?.image || profile.image} alt="Profile" className="w-full h-full rounded-xl object-cover" />
                        ) : (
                            <div className="w-full h-full rounded-xl bg-indigo-500/50 flex items-center justify-center text-white font-bold text-xl">
                                {profile.firstName.charAt(0)}
                            </div>
                        )}
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col items-center justify-center hover:bg-white/15 transition-colors"
                >
                    <User size={18} className="mb-2 text-indigo-200" />
                    <span className="text-lg font-bold text-white">{profile.gender}</span>
                    <span className="text-[10px] text-indigo-200 uppercase tracking-wider font-bold mt-1">Gender</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col items-center justify-center hover:bg-white/15 transition-colors"
                >
                    <Weight size={18} className="mb-2 text-indigo-200" />
                    <span className="text-lg font-bold text-white">{profile.weight} <span className="text-xs text-indigo-300">kg</span></span>
                    <span className="text-[10px] text-indigo-200 uppercase tracking-wider font-bold mt-1">Weight</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col items-center justify-center hover:bg-white/15 transition-colors"
                >
                    <Ruler size={18} className="mb-2 text-indigo-200" />
                    <span className="text-lg font-bold text-white">{profile.height || 175} <span className="text-xs text-indigo-300">cm</span></span>
                    <span className="text-[10px] text-indigo-200 uppercase tracking-wider font-bold mt-1">Height</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col items-center justify-center hover:bg-white/15 transition-colors"
                >
                    <CalendarDays size={18} className="mb-2 text-indigo-200" />
                    <span className="text-lg font-bold text-white">{profile.age}</span>
                    <span className="text-[10px] text-indigo-200 uppercase tracking-wider font-bold mt-1">Age</span>
                </motion.div>
            </div>
        </motion.div>
    );
}
