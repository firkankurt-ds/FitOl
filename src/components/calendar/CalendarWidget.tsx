'use client';

import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { getWorkouts } from '@/lib/storage';
import { Workout } from '@/types';

export function CalendarWidget() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [workouts, setWorkouts] = useState<Workout[]>([]);

    useEffect(() => {
        setWorkouts(getWorkouts());
    }, []);

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Calculate padding days for the start of the month
    const startDay = getDay(monthStart); // 0 (Sunday) to 6 (Saturday)
    const paddingDays = Array.from({ length: startDay });

    const getWorkoutForDate = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return workouts.find(w => w.date === dateStr);
    };

    return (
        <div className="bg-slate-800 rounded-3xl shadow-lg border border-slate-700/50 p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button onClick={prevMonth} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
                    <ChevronLeft size={20} className="text-slate-400" />
                </button>
                <h2 className="text-lg font-bold text-slate-100">
                    {format(currentDate, 'MMMM yyyy')}
                </h2>
                <button onClick={nextMonth} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
                    <ChevronRight size={20} className="text-slate-400" />
                </button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="text-center text-xs font-bold text-slate-500 py-1">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {paddingDays.map((_, i) => (
                    <div key={`pad-${i}`} className="aspect-square" />
                ))}

                {days.map((day) => {
                    const workout = getWorkoutForDate(day);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <Link
                            key={day.toString()}
                            href={`/workout/${format(day, 'yyyy-MM-dd')}`}
                            className={`
                aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all
                ${isToday ? 'bg-indigo-500/20 border-2 border-indigo-500' : 'hover:bg-slate-700 bg-slate-900/50'}
              `}
                        >
                            <span className={`text-sm font-medium ${isToday ? 'text-indigo-400' : 'text-slate-300'}`}>
                                {format(day, 'd')}
                            </span>

                            {workout && (
                                <div className="mt-1">
                                    <div className={`w-1.5 h-1.5 rounded-full ${workout.completed ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-orange-400'}`} />
                                </div>
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-6 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <span>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                    <span>Planned</span>
                </div>
            </div>
        </div>
    );
}
