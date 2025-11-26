'use client';

import React, { useEffect, useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { OnboardingForm } from '@/components/home/OnboardingForm';
import { Dashboard } from '@/components/home/Dashboard';
import { getUserProfile, initializeDefaults } from '@/lib/storage';
import { UserProfile } from '@/types';

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize default data (programs)
    initializeDefaults();

    // Check for existing user
    const user = getUserProfile();
    setProfile(user);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      {profile ? (
        <Dashboard profile={profile} />
      ) : (
        <OnboardingForm onComplete={setProfile} />
      )}
    </MobileLayout>
  );
}
