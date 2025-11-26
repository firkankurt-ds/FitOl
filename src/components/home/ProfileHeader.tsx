import React from 'react';
import { UserProfile } from '@/types';
import { User, Weight, CalendarDays } from 'lucide-react';

interface ProfileHeaderProps {
    profile: UserProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
    return (
        <div className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-8 rounded-b-[2.5rem] shadow-2xl shadow-indigo-900/50 relative overflow-hidden">
            {/* Decorative Circle */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Hi, {profile.firstName}</h1>
                    <p className="text-indigo-100 font-medium">Are you ready to give today's workout your all?</p>
                </div>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl font-bold border border-white/10 shadow-inner">
                    {profile.firstName[0]}{profile.lastName[0]}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8 relative z-10">
                <div className="bg-black/20 backdrop-blur-sm p-4 rounded-2xl flex flex-col items-center border border-white/5">
                    <User size={20} className="mb-2 text-indigo-200" />
                    <span className="text-lg font-bold">{profile.gender === 'Male' ? 'Male' : profile.gender === 'Female' ? 'Female' : 'Other'}</span>
                    <span className="text-[10px] uppercase tracking-wider text-indigo-200 opacity-70">Gender</span>
                </div>
                <div className="bg-black/20 backdrop-blur-sm p-4 rounded-2xl flex flex-col items-center border border-white/5">
                    <Weight size={20} className="mb-2 text-indigo-200" />
                    <span className="text-lg font-bold">{profile.weight}</span>
                    <span className="text-[10px] uppercase tracking-wider text-indigo-200 opacity-70">Kg</span>
                </div>
                <div className="bg-black/20 backdrop-blur-sm p-4 rounded-2xl flex flex-col items-center border border-white/5">
                    <CalendarDays size={20} className="mb-2 text-indigo-200" />
                    <span className="text-lg font-bold">{profile.age}</span>
                    <span className="text-[10px] uppercase tracking-wider text-indigo-200 opacity-70">Age</span>
                </div>
            </div>
        </div>
    );
}
