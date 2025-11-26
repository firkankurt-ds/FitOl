'use client';

import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

interface CalendarProps {
    workoutData: any;
}

export default function Calendar({ workoutData }: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 10, 25)); // Start Nov 2025
    const router = useRouter();

    const days = eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentMonth)),
        end: endOfWeek(endOfMonth(currentMonth)),
    });

    const handleDayClick = (day: Date) => {
        const dateString = format(day, 'yyyy-MM-dd');
        router.push(`/training/${dateString}`);
    };

    const hasWorkout = (day: Date) => {
        const dayName = format(day, 'EEEE'); // e.g., "Tuesday"
        return workoutData[dayName] && workoutData[dayName].length > 0;
    };

    return (
        <div className="w-full max-w-md mx-auto bg-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-slate-700 rounded-full">
                    <ChevronLeft className="text-slate-300" />
                </button>
                <h2 className="text-xl font-bold text-white">
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-slate-700 rounded-full">
                    <ChevronRight className="text-slate-300" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-center text-slate-400 text-sm font-medium">
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => {
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isToday = isSameDay(day, new Date());
                    const isWorkoutDay = hasWorkout(day);

                    return (
                        <button
                            key={idx}
                            onClick={() => handleDayClick(day)}
                            className={clsx(
                                "aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all",
                                !isCurrentMonth && "opacity-30",
                                isCurrentMonth && "hover:bg-slate-700",
                                isToday && "border-2 border-blue-500",
                                isWorkoutDay ? "bg-slate-700 text-white" : "bg-transparent text-slate-500"
                            )}
                        >
                            <span className="text-sm">{format(day, 'd')}</span>
                            {isWorkoutDay && (
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1"></div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
