'use client';

import React, { useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { saveProgram, getUniqueExercises } from '@/lib/storage';
import { Program, ProgramExercise } from '@/types';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function NewProgramPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [exercises, setExercises] = useState<ProgramExercise[]>([]);
    const [newExerciseName, setNewExerciseName] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [defaultSets, setDefaultSets] = useState(3);
    const [defaultReps, setDefaultReps] = useState(10);

    const handleAddExercise = () => {
        if (!newExerciseName.trim()) return;
        setExercises([
            ...exercises,
            {
                name: newExerciseName,
                defaultSets: Number(defaultSets),
                defaultReps: Number(defaultReps)
            }
        ]);
        setNewExerciseName('');
        setDefaultSets(3);
        setDefaultReps(10);
    };

    const handleRemoveExercise = (index: number) => {
        const newExercises = [...exercises];
        newExercises.splice(index, 1);
        setExercises(newExercises);
    };

    const handleSave = () => {
        if (!name.trim() || exercises.length === 0) {
            alert('Please enter a program name and at least one exercise.');
            return;
        }

        const newProgram: Program = {
            id: uuidv4(),
            name,
            exercises
        };

        saveProgram(newProgram);
        router.push('/programs');
    };

    return (
        <MobileLayout>
            <div className="p-4 bg-slate-950 min-h-screen pb-24">
                <div className="flex items-center mb-6">
                    <Link href="/programs" className="p-2 -ml-2 hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-slate-100" />
                    </Link>
                    <h1 className="text-xl font-bold text-slate-100 ml-2">Create Program</h1>
                </div>

                <div className="space-y-6">
                    {/* Program Name */}
                    <div className="bg-slate-800 p-5 rounded-3xl shadow-lg border border-slate-700/50">
                        <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Program Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Push Day"
                            className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-slate-600"
                        />
                    </div>

                    {/* Add Exercise Form */}
                    <div className="bg-slate-800 p-5 rounded-3xl shadow-lg border border-slate-700/50">
                        <h2 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Add Exercise</h2>
                        <div className="space-y-3 relative">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={newExerciseName}
                                    onChange={(e) => {
                                        setNewExerciseName(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                    placeholder="Exercise Name"
                                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                                {showSuggestions && newExerciseName && (
                                    <div className="absolute z-50 left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                                        {getUniqueExercises()
                                            .filter(ex => ex.toLowerCase().includes(newExerciseName.toLowerCase()))
                                            .map((ex, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        setNewExerciseName(ex);
                                                        setShowSuggestions(false);
                                                    }}
                                                    className="w-full text-left px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors border-b border-slate-800 last:border-0"
                                                >
                                                    {ex}
                                                </button>
                                            ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="text-xs text-slate-500 mb-1 block">Sets</label>
                                    <input
                                        type="number"
                                        value={defaultSets}
                                        onChange={(e) => setDefaultSets(Number(e.target.value))}
                                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-center"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-slate-500 mb-1 block">Reps</label>
                                    <input
                                        type="number"
                                        value={defaultReps}
                                        onChange={(e) => setDefaultReps(Number(e.target.value))}
                                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-center"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleAddExercise}
                                className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus size={18} /> Add to Program
                            </button>
                        </div>
                    </div>

                    {/* Exercise List */}
                    {exercises.length > 0 && (
                        <div className="space-y-3">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">Exercises ({exercises.length})</h2>
                            {exercises.map((ex, i) => (
                                <div key={i} className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-slate-200">{ex.name}</h3>
                                        <p className="text-sm text-slate-500">{ex.defaultSets} sets × {ex.defaultReps} reps</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveExercise(i)}
                                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Save Button */}
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 flex justify-center z-50">
                    <button
                        onClick={handleSave}
                        className="w-full max-w-md bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 hover:shadow-indigo-500/40 transition-all active:scale-[0.98]"
                    >
                        <Save size={20} /> Save Program
                    </button>
                </div>
            </div>
        </MobileLayout>
    );
}
