'use client';

import React from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { CalendarWidget } from '@/components/calendar/CalendarWidget';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CalendarPage() {
    return (
        <MobileLayout>
            <div className="p-4 bg-slate-950 min-h-screen">
                <div className="flex items-center mb-6">
                    <Link href="/" className="p-2 -ml-2 hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-slate-100" />
                    </Link>
                    <h1 className="text-xl font-bold text-slate-100 ml-2">Calendar</h1>
                </div>

                <CalendarWidget />
            </div>
        </MobileLayout>
    );
}
