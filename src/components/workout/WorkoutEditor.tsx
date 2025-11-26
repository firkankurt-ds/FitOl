'use client';

import React, { useState, useEffect } from 'react';
import { Workout, WorkoutExercise, WorkoutSet, Program } from '@/types';
import { getPrograms, saveWorkout, getWorkoutByDate, deleteWorkout } from '@/lib/storage';
import { Plus, Trash2, Save, Check, Dumbbell, ChevronDown, RotateCcw, Eye } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { format, parseISO, isBefore, startOfDay } from 'date-fns';

interface WorkoutEditorProps {
    date: string;
}

export function WorkoutEditor({ date }: WorkoutEditorProps) {
    const router = useRouter();
    const [workout, setWorkout] = useState<Workout>({
        id: uuidv4(),
        date,
        exercises: [],
        completed: false,
    });
    const [programs, setPrograms] = useState<Program[]>([]);
    const [selectedProgramId, setSelectedProgramId] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    // Check if this is a past date (read-only mode)
    const workoutDate = startOfDay(parseISO(date));
    const today = startOfDay(new Date());
    const isReadOnly = isBefore(workoutDate, today);


    useEffect(() => {
        setPrograms(getPrograms());
        const existing = getWorkoutByDate(date);
        if (existing) {
            setWorkout(existing);
            if (existing.programId) setSelectedProgramId(existing.programId);
        }
    }, [date]);

    const handleProgramSelect = (programId: string) => {
        setSelectedProgramId(programId);
        if (!programId) return;

        const program = programs.find((p) => p.id === programId);
        if (!program) return;

        // Confirm before overwriting if exercises exist
        if (workout.exercises.length > 0) {
            if (!confirm('This will replace your current exercises. Continue?')) return;
        }

        const newExercises: WorkoutExercise[] = program.exercises.map((ex) => ({
            id: uuidv4(),
            name: ex.name,
            sets: Array.from({ length: ex.defaultSets }).map(() => ({
                id: uuidv4(),
                reps: ex.defaultReps,
                weight: 0,
                completed: false,
            })),
        }));

        setWorkout({
            ...workout,
            programId: program.id,
            programName: program.name,
            exercises: newExercises,
        });
    };

    const addSet = (exerciseIndex: number) => {
        const newExercises = [...workout.exercises];
        const previousSet = newExercises[exerciseIndex].sets[newExercises[exerciseIndex].sets.length - 1];

        newExercises[exerciseIndex].sets.push({
            id: uuidv4(),
            reps: previousSet ? previousSet.reps : 10,
            weight: previousSet ? previousSet.weight : 0,
            completed: false,
        });
        setWorkout({ ...workout, exercises: newExercises });
    };

    const removeSet = (exerciseIndex: number, setIndex: number) => {
        const newExercises = [...workout.exercises];
        newExercises[exerciseIndex].sets.splice(setIndex, 1);
        setWorkout({ ...workout, exercises: newExercises });
    };

    const updateSet = (exerciseIndex: number, setIndex: number, field: keyof WorkoutSet, value: any) => {
        const newExercises = [...workout.exercises];
        newExercises[exerciseIndex].sets[setIndex] = {
            ...newExercises[exerciseIndex].sets[setIndex],
            [field]: value,
        };
        setWorkout({ ...workout, exercises: newExercises });
    };

    const handleSave = () => {
        setIsSaving(true);
        saveWorkout(workout);
        setTimeout(() => {
            setIsSaving(false);
            router.push('/');
        }, 500);
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to reset this workout? All data will be lost.')) {
            deleteWorkout(date);
            router.push('/');
        }
    };

    return (
        <div className="space-y-6 pb-24">
            {/* Read-only indicator */}
            {isReadOnly && workout.exercises.length > 0 && (
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 flex items-center gap-3">
                    <Eye className="text-indigo-400" size={20} />
                    <div>
                        <h3 className="text-slate-200 font-bold text-sm">Workout Details</h3>
                        <p className="text-slate-400 text-xs">This is a past workout and cannot be edited</p>
                    </div>
                </div>
            )}

            {/* Program Selector */}
            {!isReadOnly && (
                <div className="bg-slate-800 p-5 rounded-3xl shadow-lg border border-slate-700/50">
                    <label className="block text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Select Program</label>
                    <div className="relative">
                        <select
                            className="w-full p-4 pr-10 border border-slate-600 rounded-2xl appearance-none bg-slate-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium"
                            value={selectedProgramId}
                            onChange={(e) => handleProgramSelect(e.target.value)}
                        >
                            <option value="">-- Custom / Empty --</option>
                            {programs.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-4 text-slate-400 pointer-events-none" size={20} />
                    </div>
                </div>
            )}

            {/* Exercises List */}
            <div className="space-y-4">
                {workout.exercises.map((exercise, exIndex) => (
                    <div key={exercise.id} className="bg-slate-800 rounded-3xl shadow-lg border border-slate-700/50 overflow-hidden">
                        <div className="bg-slate-900/50 p-5 border-b border-slate-700/50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-100 text-lg">{exercise.name}</h3>
                            <button className="text-slate-500 hover:text-red-400 transition-colors">
                                {/* Could add remove exercise here */}
                            </button>
                        </div>

                        <div className="p-5 space-y-3">
                            <div className="grid grid-cols-10 gap-3 text-xs font-bold text-slate-500 text-center mb-2 uppercase tracking-wider">
                                <div className="col-span-1">#</div>
                                <div className="col-span-3">Kg</div>
                                <div className="col-span-3">Repetitions</div>
                                <div className="col-span-3">Status</div>
                            </div>

                            {exercise.sets.map((set, setIndex) => (
                                <div key={set.id} className="grid grid-cols-10 gap-3 items-center">
                                    <div className="col-span-1 flex justify-center">
                                        <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-slate-400">
                                            {setIndex + 1}
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            type="number"
                                            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-xl text-center font-bold text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            value={set.weight}
                                            onChange={(e) => updateSet(exIndex, setIndex, 'weight', e.target.value)}
                                            placeholder="0"
                                            disabled={isReadOnly}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            type="number"
                                            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-xl text-center font-bold text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            value={set.reps}
                                            onChange={(e) => updateSet(exIndex, setIndex, 'reps', e.target.value)}
                                            placeholder="0"
                                            disabled={isReadOnly}
                                        />
                                    </div>
                                    <div className="col-span-3 flex justify-center gap-2">
                                        {!isReadOnly && (
                                            <>
                                                <button
                                                    onClick={() => updateSet(exIndex, setIndex, 'completed', !set.completed)}
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${set.completed
                                                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                                                        : 'bg-slate-700 text-slate-500 hover:bg-slate-600'
                                                        }`}
                                                >
                                                    <Check size={18} strokeWidth={3} />
                                                </button>
                                                <button
                                                    onClick={() => removeSet(exIndex, setIndex)}
                                                    className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
                                        {isReadOnly && set.completed && (
                                            <div className="w-10 h-10 rounded-xl bg-green-500 text-white shadow-lg shadow-green-500/20 flex items-center justify-center">
                                                <Check size={18} strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {!isReadOnly && (
                                <button
                                    onClick={() => addSet(exIndex)}
                                    className="w-full py-3 mt-4 border border-dashed border-slate-600 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-700/50 hover:text-indigo-400 hover:border-indigo-500/50 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus size={18} /> Add Set
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {workout.exercises.length === 0 && (
                    <div className="text-center py-12 text-slate-300 bg-slate-800/50 rounded-3xl border border-dashed border-slate-700">
                        <Dumbbell size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="font-medium">Browse programs!</p>
                    </div>
                )}
            </div>

            {/* Floating Action Bar */}
            {!isReadOnly && workout.exercises.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 flex justify-center z-50">
                    <div className="w-full max-w-md flex gap-4">
                        {workout.id && getWorkoutByDate(date) && (
                            <button
                                onClick={handleReset}
                                className="bg-slate-700 text-slate-300 py-4 px-6 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:bg-slate-600 transition-all active:scale-[0.98]"
                            >
                                <RotateCcw size={20} /> Reset Workout Data
                            </button>
                        )}
                        <button
                            onClick={() => {
                                setWorkout({ ...workout, completed: true });
                                handleSave();
                            }}
                            disabled={isSaving}
                            className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 hover:shadow-indigo-500/40 transition-all active:scale-[0.98]"
                        >
                            {isSaving ? 'Saving...' : (
                                <>
                                    <Save size={20} /> Finish Workout
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
