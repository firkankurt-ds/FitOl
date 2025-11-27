"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Mail, Github, Edit2, Weight, CalendarDays, UserCircle, Ruler, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { UserProfile } from "@/types";
import { getUserProfile, saveUserProfile } from "@/lib/storage";
import { Modal } from "@/components/ui/Modal";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    useEffect(() => {
        // Load profile from storage or use defaults
        const storedProfile = getUserProfile();

        if (storedProfile) {
            setProfile(storedProfile);
        } else if (session?.user) {
            // If no local profile but session exists, create one
            const newProfile: UserProfile = {
                firstName: session.user.name?.split(' ')[0] || 'User',
                lastName: session.user.name?.split(' ')[1] || '',
                age: 25,
                weight: 70,
                gender: 'Male',
                height: 175,
                image: session.user.image || undefined
            };
            saveUserProfile(newProfile);
            setProfile(newProfile);
        } else {
            // No session and no profile -> redirect to signin
            // But we check this after a short delay to ensure hydration
            const timer = setTimeout(() => {
                const currentProfile = getUserProfile();
                if (!currentProfile && status === 'unauthenticated') {
                    router.push('/auth/signin');
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [session, status, router]);

    const handleSaveProfile = (updatedProfile: UserProfile) => {
        saveUserProfile(updatedProfile);
        setProfile(updatedProfile);
        setIsEditing(false);
    };

    const handleLogout = () => {
        signOut({ callbackUrl: '/auth/signin' });
    };

    if (status === "loading" || !profile) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-slate-100 p-6">
            <div className="max-w-md mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <Link href="/" className="p-2 -ml-2 hover:bg-slate-800 rounded-full transition-colors">
                            <ArrowLeft size={24} className="text-slate-100" />
                        </Link>
                        <h1 className="text-2xl font-bold ml-2">My Profile</h1>
                    </div>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 bg-slate-800 hover:bg-indigo-600 rounded-xl transition-colors text-indigo-400 hover:text-white"
                    >
                        <Edit2 size={20} />
                    </button>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl"
                >
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative mb-4">
                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden border-4 border-slate-800">
                                {session?.user?.image || profile.image ? (
                                    <img src={session?.user?.image || profile.image} alt={session?.user?.name || "User"} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={40} className="text-white" />
                                )}
                            </div>
                            <button
                                onClick={() => document.getElementById('profile-photo-input')?.click()}
                                className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center shadow-lg transition-colors border-2 border-slate-900"
                            >
                                <Edit2 size={14} className="text-white" />
                            </button>
                            <input
                                id="profile-photo-input"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            const base64String = reader.result as string;
                                            const updatedProfile = { ...profile, image: base64String };
                                            saveUserProfile(updatedProfile);
                                            setProfile(updatedProfile);
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </div>
                        <h2 className="text-2xl font-bold text-white">{profile.firstName} {profile.lastName}</h2>
                        <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                            <Mail size={14} /> {session?.user?.email}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-800/40 backdrop-blur-md p-4 rounded-2xl flex flex-col items-center border border-white/5">
                            <UserCircle size={20} className="mb-2 text-indigo-400" />
                            <span className="text-lg font-bold">{profile.gender}</span>
                            <span className="text-[10px] uppercase tracking-wider text-slate-500">Gender</span>
                        </div>
                        <div className="bg-slate-800/40 backdrop-blur-md p-4 rounded-2xl flex flex-col items-center border border-white/5">
                            <Weight size={20} className="mb-2 text-indigo-400" />
                            <span className="text-lg font-bold">{profile.weight}</span>
                            <span className="text-[10px] uppercase tracking-wider text-slate-500">Kg</span>
                        </div>
                        <div className="bg-slate-800/40 backdrop-blur-md p-4 rounded-2xl flex flex-col items-center border border-white/5">
                            <Ruler size={20} className="mb-2 text-indigo-400" />
                            <span className="text-lg font-bold">{profile.height || 175}</span>
                            <span className="text-[10px] uppercase tracking-wider text-slate-500">Cm</span>
                        </div>
                        <div className="bg-slate-800/40 backdrop-blur-md p-4 rounded-2xl flex flex-col items-center border border-white/5">
                            <CalendarDays size={20} className="mb-2 text-indigo-400" />
                            <span className="text-lg font-bold">{profile.age}</span>
                            <span className="text-[10px] uppercase tracking-wider text-slate-500">Age</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={() => setShowLogoutConfirm(true)}
                            className="block w-full bg-slate-800/50 hover:bg-red-900/20 hover:text-red-400 text-slate-300 text-center font-medium py-3 rounded-xl transition-colors border border-white/10 hover:border-red-900/50 flex items-center justify-center gap-2"
                        >
                            <LogOut size={18} /> Sign Out
                        </button>
                    </div>
                </motion.div>
            </div>

            <Modal
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                title="Edit Profile"
            >
                <ProfileForm
                    initialData={profile}
                    onSave={handleSaveProfile}
                    onCancel={() => setIsEditing(false)}
                />
            </Modal>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] shadow-2xl w-full max-w-sm relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>

                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                <LogOut size={32} className="text-red-500" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3 text-center">Sign Out?</h3>
                            <p className="text-slate-400 text-center mb-8 leading-relaxed">
                                Are you sure you want to sign out? You will need to sign in again to access your account.
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all border border-white/5 hover:border-white/10"
                                >
                                    No, Stay
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-0.5"
                                >
                                    Yes, Sign Out
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
