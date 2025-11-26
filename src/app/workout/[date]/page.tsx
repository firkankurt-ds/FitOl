'use client';

import React from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { WorkoutEditor } from '@/components/workout/WorkoutEditor';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import { format, parseISO } from 'date-fns';

export default function WorkoutPage() {
    const params = useParams();
    const dateStr = params.date as string;

    // Safe date parsing
    let displayDate = dateStr;
    try {
        displayDate = format(parseISO(dateStr), 'MMMM d, yyyy');
    } catch (e) {
        // fallback
    }

    return (
        <MobileLayout>
            <div className="p-4 min-h-screen bg-slate-950">
                <div className="flex items-center mb-6">
                    <Link href="/" className="p-2 -ml-2 hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-slate-100" />
                    </Link>
                    <h1 className="text-xl font-bold text-slate-100 ml-2">{displayDate}</h1>
                </div>

                <WorkoutEditor date={dateStr} />
            </div>
        </MobileLayout>
    );
}
