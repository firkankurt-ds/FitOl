'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types';
import { saveUserProfile } from '@/lib/storage';
import { motion } from 'framer-motion';

interface OnboardingFormProps {
    onComplete: (profile: UserProfile) => void;
}

export function OnboardingForm({ onComplete }: OnboardingFormProps) {
    const [formData, setFormData] = useState<UserProfile>({
        firstName: '',
        lastName: '',
        gender: 'Male',
        weight: 85,
        age: 30,
        height: 180,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveUserProfile(formData);
        onComplete(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-950">
            {/* Simple Premium Background - No Image */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-violet-950"></div>
                {/* Decorative circles */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-md w-full relative z-10"
            >
                {/* Glassmorphism Container */}
                <div className="bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                    <div className="mb-8 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl font-semibold text-white mb-3"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            Welcome to{' '}
                            <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
                                className="inline-block bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent font-bold"
                                style={{
                                    textShadow: '0 0 30px rgba(139, 92, 246, 0.5)',
                                }}
                            >
                                FitOl
                            </motion.span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-indigo-200/80 text-sm"
                        >
                            Let's get to know you better.
                        </motion.p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-indigo-200 mb-2 uppercase tracking-wider">First Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white placeholder-slate-400 transition-all"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    placeholder="John"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-indigo-200 mb-2 uppercase tracking-wider">Last Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white placeholder-slate-400 transition-all"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-indigo-200 mb-2 uppercase tracking-wider">Gender</label>
                            <select
                                className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white transition-all appearance-none cursor-pointer"
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                            >
                                <option value="Male" className="bg-slate-800">Male</option>
                                <option value="Female" className="bg-slate-800">Female</option>
                                <option value="Other" className="bg-slate-800">Other</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-indigo-200 mb-2 uppercase tracking-wider">Weight (kg)</label>
                                <input
                                    required
                                    type="number"
                                    className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white transition-all"
                                    value={formData.weight === 0 ? '' : formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value === '' ? 0 : Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-indigo-200 mb-2 uppercase tracking-wider">Height (cm)</label>
                                <input
                                    required
                                    type="number"
                                    className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white transition-all"
                                    value={formData.height === 0 ? '' : (formData.height || '')}
                                    onChange={(e) => setFormData({ ...formData, height: e.target.value === '' ? 0 : Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-indigo-200 mb-2 uppercase tracking-wider">Age</label>
                                <input
                                    required
                                    type="number"
                                    className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white transition-all"
                                    value={formData.age === 0 ? '' : formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value === '' ? 0 : Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-4 rounded-2xl font-bold text-lg mt-8 hover:shadow-lg hover:shadow-indigo-500/25 transition-all border border-white/10"
                        >
                            Start Journey
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
