'use client';

import React, { useEffect, useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { getWorkouts } from '@/lib/storage';
import { Workout } from '@/types';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

export default function ExerciseDetailPage() {
    const params = useParams();
    const exerciseName = decodeURIComponent(params.id as string);
    const [history, setHistory] = useState<{ date: string; maxWeight: number; sets: any[] }[]>([]);

    useEffect(() => {
        const workouts = getWorkouts();
        const data: { date: string; maxWeight: number; sets: any[] }[] = [];

        workouts.forEach((w) => {
            const ex = w.exercises.find((e) => e.name === exerciseName);
            if (ex) {
                // Cast to Number to handle string inputs
                const maxWeight = Math.max(...ex.sets.map((s) => Number(s.weight) || 0));
                data.push({
                    date: w.date,
                    maxWeight: maxWeight > 0 ? maxWeight : 0,
                    sets: ex.sets,
                });
            }
        });

        // Sort by date
        data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setHistory(data);
    }, [exerciseName]);

    const chartData = history.map(h => ({
        date: format(parseISO(h.date), 'MMM d'),
        weight: h.maxWeight
    }));

    return (
        <MobileLayout>
            <div className="p-4 bg-slate-950 min-h-screen">
                <div className="flex items-center mb-6">
                    <Link href="/progress" className="p-2 -ml-2 hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-slate-100" />
                    </Link>
                    <h1 className="text-xl font-bold text-slate-100 ml-2">{exerciseName}</h1>
                </div>

                {/* Chart */}
                <div className="bg-slate-800 p-4 rounded-3xl shadow-lg border border-slate-700/50 mb-6 h-64">
                    <h2 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Max Weight Progression</h2>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#f8fafc' }}
                                itemStyle={{ color: '#818cf8' }}
                            />
                            <Line type="monotone" dataKey="weight" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#818cf8' }} activeDot={{ r: 6, fill: '#fff' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* History List */}
                <div className="space-y-4">
                    <h2 className="font-bold text-slate-100">History</h2>
                    {history.slice().reverse().map((record, i) => (
                        <div key={i} className="bg-slate-800 p-5 rounded-3xl shadow-lg border border-slate-700/50">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-medium text-slate-200">
                                    {format(parseISO(record.date), 'MMMM d, yyyy')}
                                </span>
                                <span className="text-sm font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                                    Max: {record.maxWeight} kg
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {record.sets.map((set: any, j: number) => (
                                    <div key={j} className="text-xs bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 font-medium">
                                        {set.weight}kg × {set.reps}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MobileLayout>
    );
}
