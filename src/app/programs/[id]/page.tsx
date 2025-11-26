'use client';

import React, { useEffect, useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { getPrograms } from '@/lib/storage';
import { Program } from '@/types';
import Link from 'next/link';
import { ArrowLeft, List } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function ProgramDetailPage() {
    const params = useParams();
    const [program, setProgram] = useState<Program | null>(null);

    useEffect(() => {
        const programs = getPrograms();
        const found = programs.find((p) => p.id === params.id);
        if (found) setProgram(found);
    }, [params.id]);

    if (!program) {
        return (
            <MobileLayout>
                <div className="p-4 bg-slate-950 min-h-screen text-slate-400">Loading...</div>
            </MobileLayout>
        );
    }

    return (
        <MobileLayout>
            <div className="p-4 bg-slate-950 min-h-screen">
                <div className="flex items-center mb-6">
                    <Link href="/programs" className="p-2 -ml-2 hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-slate-100" />
                    </Link>
                    <h1 className="text-xl font-bold text-slate-100 ml-2">{program.name}</h1>
                </div>

                <div className="bg-slate-800 rounded-3xl shadow-lg border border-slate-700/50 overflow-hidden">
                    <div className="p-5 bg-slate-900/50 border-b border-slate-700/50">
                        <h2 className="font-bold text-slate-100 flex items-center gap-2">
                            <List size={20} className="text-indigo-400" />
                            Exercise List
                        </h2>
                    </div>
                    <div className="divide-y divide-slate-700/50">
                        {program.exercises.map((exercise, index) => (
                            <div key={index} className="p-5 hover:bg-slate-700/30 transition-colors">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-slate-200 text-lg">{index + 1}. {exercise.name}</span>
                                </div>
                                <div className="text-sm text-slate-400 font-medium flex items-center gap-2">
                                    <span className="bg-slate-700/50 px-2 py-1 rounded text-slate-300">{exercise.defaultSets} Sets</span>
                                    <span className="text-slate-600">×</span>
                                    <span className="bg-slate-700/50 px-2 py-1 rounded text-slate-300">{exercise.defaultReps} Reps</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MobileLayout>
    );
}
