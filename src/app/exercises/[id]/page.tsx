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
                <div className="bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-700/50 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Max Weight Progression</h2>
                            <p className="text-3xl font-bold text-white">
                                {history.length > 0 ? `${history[history.length - 1].maxWeight} kg` : '0 kg'}
                            </p>
                        </div>
                        <div className="text-xs font-medium text-slate-500 bg-slate-900/50 px-3 py-1 rounded-full">
                            Last {history.length} sessions
                        </div>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.5} />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                    axisLine={false}
                                    tickLine={false}
                                    dx={-10}
                                    domain={['dataMin - 5', 'auto']}
                                    tickCount={8}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '16px',
                                        color: '#f8fafc',
                                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                                        backdropFilter: 'blur(8px)'
                                    }}
                                    itemStyle={{ color: '#818cf8' }}
                                    cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="weight"
                                    stroke="#6366f1"
                                    strokeWidth={4}
                                    dot={{ r: 4, fill: '#1e293b', stroke: '#818cf8', strokeWidth: 2 }}
                                    activeDot={{ r: 8, fill: '#818cf8', stroke: '#fff', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* History List */}
                <div className="space-y-4">
                    <h2 className="font-bold text-slate-100 text-lg flex items-center gap-2">
                        <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                        History
                    </h2>
                    {history.slice().reverse().map((record, i) => (
                        <div key={i} className="bg-slate-800/50 backdrop-blur-sm p-5 rounded-3xl shadow-lg border border-slate-700/50 hover:bg-slate-800 transition-all group">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-bold text-slate-200 text-lg">
                                    {format(parseISO(record.date), 'MMMM d, yyyy')}
                                </span>
                                <span className="text-sm font-bold text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 shadow-sm shadow-indigo-500/10">
                                    Max: {record.maxWeight} kg
                                </span>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {record.sets.map((set: any, j: number) => (
                                    <div key={j} className="text-xs bg-slate-900/80 px-2 py-2 rounded-xl border border-slate-700/50 text-slate-400 font-medium text-center hover:border-indigo-500/30 transition-colors">
                                        <div className="text-slate-200 font-bold">{set.weight}</div>
                                        <div className="text-[10px] opacity-70">× {set.reps}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {history.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            No history available for this exercise yet.
                        </div>
                    )}
                </div>
            </div>
        </MobileLayout>
    );
}
