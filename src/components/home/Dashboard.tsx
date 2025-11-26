import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserProfile, Workout } from '@/types';
import { getWorkoutByDate } from '@/lib/storage';
import { ProfileHeader } from './ProfileHeader';
import { Calendar, Dumbbell, TrendingUp, ChevronRight, PlayCircle } from 'lucide-react';
import { format } from 'date-fns';

interface DashboardProps {
    profile: UserProfile;
}

export function Dashboard({ profile }: DashboardProps) {
    const [todayWorkout, setTodayWorkout] = useState<Workout | undefined>(undefined);
    const todayStr = format(new Date(), 'yyyy-MM-dd');

    useEffect(() => {
        setTodayWorkout(getWorkoutByDate(todayStr));
    }, [todayStr]);

    return (
        <div className="flex flex-col h-full bg-slate-950 pb-24">
            <ProfileHeader profile={profile} />

            <div className="p-6 space-y-8 flex-1 overflow-y-auto">
                {/* Today's Workout Section */}
                <div>
                    <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                        Plan Your Day
                    </h2>
                    {todayWorkout ? (
                        <div className="bg-slate-800 p-5 rounded-3xl shadow-lg border border-slate-700/50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full -mr-8 -mt-8 blur-xl group-hover:bg-indigo-500/20 transition-all"></div>

                            <div className="flex justify-between items-center mb-3 relative z-10">
                                <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                                    {todayWorkout.programName || 'Custom Workout'}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">
                                    {todayWorkout.exercises.length} Exercises
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-6 relative z-10">
                                {todayWorkout.completed ? 'Mission Accomplished!' : 'Ready to train?'}
                            </h3>
                            <Link
                                href={`/workout/${todayStr}`}
                                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-4 rounded-2xl flex items-center justify-center font-bold text-lg hover:shadow-lg hover:shadow-indigo-500/25 transition-all active:scale-[0.98]"
                            >
                                {todayWorkout.completed ? 'View Summary' : 'Edit Workout Details'}
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-slate-800 p-6 rounded-3xl shadow-lg border border-slate-700/50 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50"></div>
                            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                                <Dumbbell className="text-slate-400" size={28} />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2 relative z-10">Rest Day?</h3>
                            <p className="text-sm text-slate-400 mb-6 relative z-10">No workout scheduled for today.</p>
                            <Link
                                href={`/workout/${todayStr}`}
                                className="inline-flex items-center text-indigo-400 font-bold hover:text-indigo-300 transition-colors relative z-10"
                            >
                                <PlayCircle size={20} className="mr-2" />
                                Start Your Workout!
                            </Link>
                        </div>
                    )}
                </div>

                {/* Navigation Grid */}
                <div>
                    <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-violet-500 rounded-full"></span>
                        Workouts and Progress
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/calendar" className="bg-slate-800 p-5 rounded-3xl shadow-lg border border-slate-700/50 hover:bg-slate-750 transition-all group">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Calendar className="text-purple-400" size={24} />
                            </div>
                            <h3 className="font-bold text-slate-100 text-lg">Calendar</h3>
                            <p className="text-xs text-slate-400 mt-1">View Schedule</p>
                        </Link>

                        <Link href="/programs" className="bg-slate-800 p-5 rounded-3xl shadow-lg border border-slate-700/50 hover:bg-slate-750 transition-all group">
                            <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Dumbbell className="text-orange-400" size={24} />
                            </div>
                            <h3 className="font-bold text-slate-100 text-lg">Programs</h3>
                            <p className="text-xs text-slate-400 mt-1">Manage Routines</p>
                        </Link>

                        <Link href="/progress" className="bg-slate-800 p-5 rounded-3xl shadow-lg border border-slate-700/50 hover:bg-slate-750 transition-all col-span-2 flex items-center justify-between group">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                    <TrendingUp className="text-green-400" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-100 text-lg">Progress Chart</h3>
                                    <p className="text-xs text-slate-400">See your progress</p>
                                </div>
                            </div>
                            <ChevronRight className="text-slate-600 group-hover:text-slate-400 transition-colors" size={24} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
