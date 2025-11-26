'use client';

import React, { useEffect, useState } from 'react';

interface ExerciseCardProps {
    exercise: any;
    date: string;
    index: number;
}

export default function ExerciseCard({ exercise, date, index }: ExerciseCardProps) {
    const [sets, setSets] = useState<any[]>([]);

    // Initialize sets based on "4x6-8" string
    useEffect(() => {
        const numSets = parseInt(exercise.sets_reps.split('x')[0]) || 3;
        const initialSets = [];

        // Load saved data
        const savedData = JSON.parse(localStorage.getItem(`workout_${date}_${index}`) || '{}');

        for (let i = 0; i < numSets; i++) {
            initialSets.push({
                weight: savedData[i]?.weight || '',
                reps: savedData[i]?.reps || ''
            });
        }
        setSets(initialSets);
    }, [exercise, date, index]);

    const handleChange = (setIndex: number, field: 'weight' | 'reps', value: string) => {
        const newSets = [...sets];
        newSets[setIndex] = { ...newSets[setIndex], [field]: value };
        setSets(newSets);

        // Save to local storage
        const dataToSave = newSets.reduce((acc, curr, idx) => {
            acc[idx] = curr;
            return acc;
        }, {});
        localStorage.setItem(`workout_${date}_${index}`, JSON.stringify(dataToSave));
    };

    return (
        <div className="bg-slate-800 rounded-2xl p-4 mb-4 border border-slate-700">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-white">{exercise.name}</h3>
                    <p className="text-sm text-slate-400">{exercise.sets_reps} • {exercise.rir}</p>
                </div>
                {/* Placeholder for Visual */}
                <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center text-xs text-slate-500">
                    Img
                </div>
            </div>

            <div className="space-y-2">
                {sets.map((set, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <span className="text-slate-500 w-6 text-sm">#{i + 1}</span>
                        <input
                            type="number"
                            placeholder="kg"
                            value={set.weight}
                            onChange={(e) => handleChange(i, 'weight', e.target.value)}
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-center focus:border-blue-500 outline-none"
                        />
                        <input
                            type="number"
                            placeholder="reps"
                            value={set.reps}
                            onChange={(e) => handleChange(i, 'reps', e.target.value)}
                            className="w-20 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-center focus:border-blue-500 outline-none"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
