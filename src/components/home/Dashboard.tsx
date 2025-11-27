"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserProfile, Workout } from '@/types';
import { getWorkoutByDate } from '@/lib/storage';
import { ProfileHeader } from './ProfileHeader';
import { Calendar, Dumbbell, TrendingUp, ChevronRight, PlayCircle } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface DashboardProps {
    profile: UserProfile;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export function Dashboard({ profile }: DashboardProps) {
    const [todayWorkout, setTodayWorkout] = useState<Workout | undefined>(undefined);
    const todayStr = format(new Date(), 'yyyy-MM-dd');

    useEffect(() => {
        setTodayWorkout(getWorkoutByDate(todayStr));
    }, [todayStr]);

    return (
        <div className="flex flex-col h-full pb-24 relative">
            <ProfileHeader profile={profile} />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="p-6 space-y-8 flex-1 overflow-y-auto"
            >
                {/* Today's Workout Section */}
                <motion.div variants={item}>
                    <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                        Plan Your Day
                    </h2>
                    {todayWorkout ? (
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-slate-800/40 backdrop-blur-md p-5 rounded-3xl shadow-xl border border-white/5 relative overflow-hidden group"
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0 z-0">
                                <img src="/bg-plan.png" alt="Plan BG" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/40"></div>
                            </div>

                            <div className="flex justify-between items-center mb-3 relative z-10">
                                <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-indigo-500/30">
                                    {todayWorkout.programName || 'Custom Workout'}
                                </span>
                                <span className="text-xs text-slate-300 font-medium bg-black/20 px-2 py-1 rounded-lg">
                                    {todayWorkout.exercises.length} Exercises
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-6 relative z-10 drop-shadow-lg">
                                {todayWorkout.completed ? 'Mission Accomplished!' : 'Ready to train?'}
                            </h3>
                            <Link
                                href={`/workout/${todayStr}`}
                                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-4 rounded-2xl flex items-center justify-center font-bold text-lg hover:shadow-lg hover:shadow-indigo-500/25 transition-all active:scale-[0.98] relative z-10 border border-white/10"
                            >
                                {todayWorkout.completed ? 'View Summary' : 'Edit Workout Details'}
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-slate-800/40 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/5 text-center relative overflow-hidden group"
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0 z-0">
                                <img src="/bg-plan.png" alt="Plan BG" className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40"></div>
                            </div>

                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-lg shadow-indigo-500/30 animate-pulse">
                                <Dumbbell className="text-white" size={32} />
                            </div>

                            <Link
                                href={`/workout/${todayStr}`}
                                className="w-full bg-white text-slate-900 py-4 rounded-2xl flex items-center justify-center font-bold text-lg hover:bg-indigo-50 transition-all active:scale-[0.98] relative z-10 shadow-xl shadow-white/10 group-hover:shadow-white/20"
                            >
                                <PlayCircle size={24} className="mr-2 text-indigo-600" />
                                Start Your Workout!
                            </Link>
                        </motion.div>
                    )}
                </motion.div>

                {/* Navigation Grid */}
                <motion.div variants={item}>
                    <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-violet-500 rounded-full"></span>
                        Workouts and Progress
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/calendar">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-slate-800/40 backdrop-blur-md p-5 rounded-3xl shadow-xl border border-white/5 hover:bg-slate-800/60 transition-all group h-full relative overflow-hidden"
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0 z-0">
                                    <img src="/bg-workouts.png" alt="Workouts BG" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-purple-900/20"></div>
                                </div>

                                <div className="w-12 h-12 bg-purple-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10 border border-purple-500/30">
                                    <Calendar className="text-purple-300" size={24} />
                                </div>
                                <h3 className="font-bold text-white text-lg relative z-10">Calendar</h3>
                                <p className="text-xs text-slate-300 mt-1 relative z-10">View Schedule</p>
                            </motion.div>
                        </Link>

                        <Link href="/programs">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-slate-800/40 backdrop-blur-md p-5 rounded-3xl shadow-xl border border-white/5 hover:bg-slate-800/60 transition-all group h-full relative overflow-hidden"
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0 z-0">
                                    <img src="/bg-workouts.png" alt="Workouts BG" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-bl from-slate-900/90 to-orange-900/20"></div>
                                </div>

                                <div className="w-12 h-12 bg-orange-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10 border border-orange-500/30">
                                    <Dumbbell className="text-orange-300" size={24} />
                                </div>
                                <h3 className="font-bold text-white text-lg relative z-10">Programs</h3>
                                <p className="text-xs text-slate-300 mt-1 relative z-10">Manage Routines</p>
                            </motion.div>
                        </Link>

                        <Link href="/progress" className="col-span-2">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-slate-800/40 backdrop-blur-md p-5 rounded-3xl shadow-xl border border-white/5 hover:bg-slate-800/60 transition-all flex items-center justify-between group relative overflow-hidden"
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0 z-0">
                                    <img src="/bg-workouts.png" alt="Workouts BG" className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 to-green-900/20"></div>
                                </div>

                                <div className="flex items-center relative z-10">
                                    <div className="w-12 h-12 bg-green-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform border border-green-500/30">
                                        <TrendingUp className="text-green-300" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">Progress Chart</h3>
                                        <p className="text-xs text-slate-300">See your progress</p>
                                    </div>
                                </div>
                                <ChevronRight className="text-slate-400 group-hover:text-white transition-colors relative z-10" size={24} />
                            </motion.div>
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
