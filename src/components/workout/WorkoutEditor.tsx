'use client';

import React, { useState, useEffect } from 'react';
import { Workout, WorkoutExercise, WorkoutSet, Program } from '@/types';
import { getPrograms, saveWorkout, getWorkoutByDate, deleteWorkout, getUniqueExercises } from '@/lib/storage';
import { Plus, Trash2, Save, Check, Dumbbell, ChevronDown, RotateCcw, Eye, Edit2, X } from 'lucide-react';
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
    const [isEditingPast, setIsEditingPast] = useState(false);

    // New Exercise State
    const [showAddExercise, setShowAddExercise] = useState(false);
    const [newExerciseName, setNewExerciseName] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Check if this is a past date
    const workoutDate = startOfDay(parseISO(date));
    const today = startOfDay(new Date());
    const isPastDate = isBefore(workoutDate, today);

    // Read-only if it's a past date AND we are not explicitly editing it
    const isReadOnly = isPastDate && !isEditingPast;

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
                weight: 20,
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
            weight: previousSet ? previousSet.weight : 20,
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

    const handleAddExercise = () => {
        if (!newExerciseName.trim()) return;

        const newExercise: WorkoutExercise = {
            id: uuidv4(),
            name: newExerciseName,
            sets: [
                { id: uuidv4(), reps: 10, weight: 20, completed: false },
                { id: uuidv4(), reps: 10, weight: 20, completed: false },
                { id: uuidv4(), reps: 10, weight: 20, completed: false },
            ]
        };

        setWorkout({
            ...workout,
            exercises: [...workout.exercises, newExercise]
        });

        setNewExerciseName('');
        setShowAddExercise(false);
    };

    const removeExercise = (index: number) => {
        if (!confirm('Remove this exercise?')) return;
        const newExercises = [...workout.exercises];
        newExercises.splice(index, 1);
        setWorkout({ ...workout, exercises: newExercises });
    };

    const handleSave = () => {
        setIsSaving(true);
        saveWorkout(workout);
        setTimeout(() => {
            setIsSaving(false);
            if (isPastDate) {
                // If we were editing a past workout, just exit edit mode
                setIsEditingPast(false);
            } else {
                router.push('/');
            }
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
            {isReadOnly && (
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Eye className="text-indigo-400" size={20} />
                        <div>
                            <h3 className="text-slate-200 font-bold text-sm">Workout Details</h3>
                            <p className="text-slate-400 text-xs">Past workout</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditingPast(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                    >
                        <Edit2 size={14} /> Edit
                    </button>
                </div>
            )}

            {/* Edit Mode Indicator */}
            {isEditingPast && (
                <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Edit2 className="text-indigo-400" size={20} />
                        <div>
                            <h3 className="text-indigo-200 font-bold text-sm">Editing Past Workout</h3>
                            <p className="text-indigo-400/70 text-xs">Changes will update your progress</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditingPast(false)}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* Program Selector - Only show if no exercises or if we want to switch (could be improved) */}
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
                            {!isReadOnly && (
                                <button
                                    onClick={() => removeExercise(exIndex)}
                                    className="text-slate-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
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
                                        <div className="relative">
                                            <input
                                                type="number"
                                                className="w-full p-3 pr-8 bg-slate-700 border border-slate-600 rounded-xl text-center font-bold text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                value={set.weight}
                                                onChange={(e) => updateSet(exIndex, setIndex, 'weight', Math.max(0, Number(e.target.value)))}
                                                placeholder="0"
                                                disabled={isReadOnly}
                                                min="0"
                                                step="5"
                                            />
                                            {!isReadOnly && (
                                                <div className="absolute right-1 top-1 bottom-1 flex flex-col">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateSet(exIndex, setIndex, 'weight', Number(set.weight) + 5)}
                                                        className="flex-1 w-6 bg-slate-600 hover:bg-indigo-600 text-white rounded-t flex items-center justify-center transition-colors text-xs"
                                                    >
                                                        +
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateSet(exIndex, setIndex, 'weight', Math.max(0, Number(set.weight) - 5))}
                                                        className="flex-1 w-6 bg-slate-600 hover:bg-indigo-600 text-white rounded-b flex items-center justify-center transition-colors text-xs"
                                                    >
                                                        −
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <div className="relative">
                                            <input
                                                type="number"
                                                className="w-full p-3 pr-8 bg-slate-700 border border-slate-600 rounded-xl text-center font-bold text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                value={set.reps}
                                                onChange={(e) => updateSet(exIndex, setIndex, 'reps', Math.max(0, Number(e.target.value)))}
                                                placeholder="0"
                                                disabled={isReadOnly}
                                            />
                                            {!isReadOnly && (
                                                <div className="absolute right-1 top-1 bottom-1 flex flex-col">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateSet(exIndex, setIndex, 'reps', Number(set.reps) + 1)}
                                                        className="flex-1 w-6 bg-slate-600 hover:bg-indigo-600 text-white rounded-t flex items-center justify-center transition-colors text-xs"
                                                    >
                                                        +
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateSet(exIndex, setIndex, 'reps', Math.max(0, Number(set.reps) - 1))}
                                                        className="flex-1 w-6 bg-slate-600 hover:bg-indigo-600 text-white rounded-b flex items-center justify-center transition-colors text-xs"
                                                    >
                                                        −
                                                    </button>
                                                </div>
                                            )}
                                        </div>
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

                {/* Add Exercise Button */}
                {!isReadOnly && (
                    <div className="pt-4">
                        {showAddExercise ? (
                            <div className="bg-slate-800 p-5 rounded-3xl shadow-lg border border-slate-700/50 animate-in fade-in slide-in-from-bottom-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-slate-100">Add New Exercise</h3>
                                    <button onClick={() => setShowAddExercise(false)} className="text-slate-500 hover:text-white">
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="flex gap-3 relative">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={newExerciseName}
                                            onChange={(e) => {
                                                setNewExerciseName(e.target.value);
                                                setShowSuggestions(true);
                                            }}
                                            onFocus={() => setShowSuggestions(true)}
                                            placeholder="Exercise Name (e.g. Bench Press)"
                                            className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            autoFocus
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
                                    <button
                                        onClick={handleAddExercise}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 rounded-2xl font-bold transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAddExercise(true)}
                                className="w-full py-4 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-3xl text-slate-300 font-bold flex items-center justify-center gap-2 transition-all hover:border-indigo-500/50 hover:text-indigo-400"
                            >
                                <Plus size={20} /> Add Exercise
                            </button>
                        )}
                    </div>
                )}

                {workout.exercises.length === 0 && !showAddExercise && (
                    <div className="text-center py-12 text-slate-300 bg-slate-800/50 rounded-3xl border border-dashed border-slate-700">
                        <Dumbbell size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="font-medium">Browse programs or add an exercise!</p>
                    </div>
                )}
            </div>

            {/* Floating Action Bar */}
            {!isReadOnly && workout.exercises.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 flex justify-center z-50">
                    <div className="w-full max-w-md flex gap-4">
                        {workout.id && getWorkoutByDate(date) && !isEditingPast && (
                            <button
                                onClick={handleReset}
                                className="bg-slate-700 text-slate-300 py-4 px-6 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:bg-slate-600 transition-all active:scale-[0.98]"
                            >
                                <RotateCcw size={20} /> Reset
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
                                    <Save size={20} /> {isEditingPast ? 'Update Workout' : 'Finish Workout'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
