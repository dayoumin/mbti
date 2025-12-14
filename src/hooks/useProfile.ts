'use client';

import { useEffect, useState } from 'react';
import { profileService, MyProfileData } from '@/services/ProfileService';

export function useProfile() {
  const [profile, setProfile] = useState<MyProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const data = await profileService.getMyProfile();
        if (!cancelled) setProfile(data);
      } catch (err) {
        console.error('프로필 로드 실패:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  return { profile, loading };
}

