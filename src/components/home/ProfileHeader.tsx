'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types';
import { User, Weight, CalendarDays, LogIn, Ruler, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileHeaderProps {
    profile: UserProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
    const { data: session } = useSession();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogout = () => {
        signOut({ callbackUrl: '/auth/signin' });
    };

    return (
        <>
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

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/30 transition-all group"
                    >
                        <LogOut size={20} className="text-white group-hover:text-red-200" />
                    </button>

                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl font-semibold tracking-wide text-white text-center absolute left-1/2 transform -translate-x-1/2"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        {profile.firstName.length > 10 ? "Hi!" : `Hi, ${profile.firstName}`}
                    </motion.h1>

                    <Link href="/profile">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-0.5 cursor-pointer hover:scale-105 transition-transform shadow-lg">
                            {session?.user?.image || profile.image ? (
                                <img src={session?.user?.image || profile.image} alt="Profile" className="w-full h-full rounded-[14px] object-cover" />
                            ) : (
                                <div className="w-full h-full rounded-[14px] bg-indigo-500/50 flex items-center justify-center text-white font-bold text-lg">
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

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-slate-900 border border-white/10 p-6 rounded-3xl shadow-2xl w-full max-w-sm"
                        >
                            <h3 className="text-xl font-bold text-white mb-2 text-center">Sign Out?</h3>
                            <p className="text-slate-400 text-center mb-6">Are you sure you want to sign out of your account?</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-red-600/20"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
