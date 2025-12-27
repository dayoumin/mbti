'use client';

import { useRouter } from 'next/navigation';
import ProfilePage from '@/components/profile/ProfilePage';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import type { NavTab } from '@/components/nav/types';

export default function ProfileRoute() {
  const router = useRouter();

  const handleNavTabChange = (tab: NavTab) => {
    if (tab === 'profile') return; // 이미 프로필 페이지
    router.push('/');
    // 탭 상태는 메인 페이지에서 처리
  };

  const handleStartTest = (testKey: string) => {
    router.push(`/?test=${testKey}`);
  };

  return (
    <>
      {/* PC 사이드바 */}
      <Sidebar
        activeTab="profile"
        onTabChange={handleNavTabChange}
        onStartTest={handleStartTest}
      />

      {/* 프로필 콘텐츠 */}
      <ProfilePage />

      {/* 모바일 하단 네비게이션 */}
      <BottomNav
        activeTab="profile"
        onTabChange={handleNavTabChange}
      />
    </>
  );
}
