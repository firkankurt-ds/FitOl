import React from 'react';

interface MobileLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export function MobileLayout({ children, className = '' }: MobileLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-950 flex justify-center">
            <div className={`w-full max-w-md bg-slate-900 min-h-screen shadow-2xl shadow-black ${className}`}>
                {children}
            </div>
        </div>
    );
}
