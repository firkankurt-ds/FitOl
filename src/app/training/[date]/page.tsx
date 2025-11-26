'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import program from '@/data/workout_program.json';
import ExerciseCard from '@/components/ExerciseCard';

export default function TrainingPage() {
    const params = useParams();
    const router = useRouter();
    const dateString = params.date as string;
    const date = new Date(dateString);
    const dayName = format(date, 'EEEE'); // e.g., "Tuesday"

    // @ts-ignore
    const workout = program[dayName] || [];

    return (
        <main className="min-h-screen bg-slate-900 p-4">
            <header className="flex items-center gap-4 mb-6 sticky top-0 bg-slate-900/90 backdrop-blur-sm py-4 z-10">
                <button
                    onClick={() => router.back()}
                    className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-white"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-white">Training Info</h1>
                    <p className="text-sm text-slate-400">{format(date, 'EEEE, MMM d')}</p>
                </div>
            </header>

            {workout.length > 0 ? (
                <div className="max-w-md mx-auto">
                    {workout.map((ex: any, idx: number) => (
                        <ExerciseCard key={idx} exercise={ex} date={dateString} index={idx} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-slate-500 mt-20">
                    <p>Rest Day! No workout scheduled.</p>
                </div>
            )}
        </main>
    );
}
