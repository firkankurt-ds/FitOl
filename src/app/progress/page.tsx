'use client';

import React, { useEffect, useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { getWorkouts } from '@/lib/storage';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, ChevronRight } from 'lucide-react';

export default function ProgressPage() {
    const [exercises, setExercises] = useState<string[]>([]);

    useEffect(() => {
        const workouts = getWorkouts();
        const uniqueExercises = new Set<string>();

        workouts.forEach(w => {
            w.exercises.forEach(e => {
                uniqueExercises.add(e.name);
            });
        });

        setExercises(Array.from(uniqueExercises).sort());
    }, []);

    return (
        <MobileLayout>
            <div className="p-4 bg-slate-950 min-h-screen">
                <div className="flex items-center mb-6">
                    <Link href="/" className="p-2 -ml-2 hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-slate-100" />
                    </Link>
                    <h1 className="text-xl font-bold text-slate-100 ml-2">Progress Tracking</h1>
                </div>

                <div className="bg-slate-800 rounded-3xl shadow-lg border border-slate-700/50 overflow-hidden">
                    <div className="p-5 bg-slate-900/50 border-b border-slate-700/50">
                        <h2 className="font-bold text-slate-100 flex items-center gap-2">
                            <TrendingUp size={20} className="text-indigo-400" />
                            Select Exercise
                        </h2>
                    </div>
                    <div className="divide-y divide-slate-700/50">
                        {exercises.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                No exercises recorded yet.
                                <br />
                                Complete a workout to see progress!
                            </div>
                        ) : (
                            exercises.map((name) => (
                                <Link
                                    key={name}
                                    href={`/exercises/${encodeURIComponent(name)}`}
                                    className="flex items-center justify-between p-5 hover:bg-slate-700/50 transition-colors group"
                                >
                                    <span className="font-medium text-slate-200 group-hover:text-white transition-colors">{name}</span>
                                    <ChevronRight size={20} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </MobileLayout>
    );
}
