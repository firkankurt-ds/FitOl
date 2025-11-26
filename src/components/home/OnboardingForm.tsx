'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types';
import { saveUserProfile } from '@/lib/storage';

interface OnboardingFormProps {
    onComplete: (profile: UserProfile) => void;
}

export function OnboardingForm({ onComplete }: OnboardingFormProps) {
    const [formData, setFormData] = useState<UserProfile>({
        firstName: '',
        lastName: '',
        gender: 'Male',
        weight: 70,
        age: 25,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveUserProfile(formData);
        onComplete(formData);
    };

    return (
        <div className="p-6 flex flex-col h-full justify-center">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-blue-600 mb-2">Welcome to FitOl</h1>
                <p className="text-gray-500">Let's get to know you better.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                            required
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                            required
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                        <input
                            required
                            type="number"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                        <input
                            required
                            type="number"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold text-lg mt-8 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                    Start Journey
                </button>
            </form>
        </div>
    );
}
