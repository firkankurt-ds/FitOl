'use client';

import React, { useEffect, useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { getPrograms } from '@/lib/storage';
import { Program } from '@/types';
import Link from 'next/link';
import { ArrowLeft, Dumbbell, ChevronRight } from 'lucide-react';

export default function ProgramsPage() {
    const [programs, setPrograms] = useState<Program[]>([]);

    useEffect(() => {
        setPrograms(getPrograms());
    }, []);

    return (
        <MobileLayout>
            <div className="p-4 bg-slate-950 min-h-screen">
                <div className="flex items-center mb-6">
                    <Link href="/" className="p-2 -ml-2 hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-slate-100" />
                    </Link>
                    <h1 className="text-xl font-bold text-slate-100 ml-2">Workout Programs</h1>
                </div>

                <div className="space-y-4">
                    {programs.map((program) => (
                        <Link
                            key={program.id}
                            href={`/programs/${program.id}`}
                            className="block bg-slate-800 p-5 rounded-3xl shadow-lg border border-slate-700/50 hover:bg-slate-750 hover:border-indigo-500/30 transition-all group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                        <Dumbbell size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-100 text-lg">{program.name}</h3>
                                        <p className="text-sm text-slate-400">{program.exercises.length} Exercises</p>
                                    </div>
                                </div>
                                <ChevronRight className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </MobileLayout>
    );
}
