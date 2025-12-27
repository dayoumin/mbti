'use client';

import { useRouter } from 'next/navigation';
import ProfilePage from '@/components/profile/ProfilePage';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import RightSidebar from '@/components/RightSidebar';
import type { NavTab } from '@/components/nav/types';
import type { SubjectKey } from '@/data/types';

export default function ProfileRoute() {
  const router = useRouter();

  const handleNavTabChange = (tab: NavTab) => {
    if (tab === 'profile') return; // 이미 프로필 페이지
    router.push('/');
    // 탭 상태는 메인 페이지에서 처리
  };

  const handleStartTest = (testKey: string | SubjectKey) => {
    router.push(`/?test=${testKey}`);
  };

  const handleOpenCommunity = () => {
    // 메인 페이지의 커뮤니티 탭으로 이동
    router.push('/?tab=talk');
  };

  const handleOpenRanking = () => {
    // 메인 페이지의 랭킹 탭으로 이동
    router.push('/?tab=ranking');
  };

  return (
    <>
      {/* PC 좌측 사이드바 */}
      <Sidebar
        activeTab="profile"
        onTabChange={handleNavTabChange}
        onStartTest={handleStartTest}
      />

      {/* 프로필 콘텐츠 */}
      <ProfilePage />

      {/* PC 우측 사이드바 */}
      <RightSidebar
        onOpenCommunity={handleOpenCommunity}
        onOpenRanking={handleOpenRanking}
        onStartTest={handleStartTest}
      />

      {/* 모바일 하단 네비게이션 */}
      <BottomNav
        activeTab="profile"
        onTabChange={handleNavTabChange}
      />
    </>
  );
}
