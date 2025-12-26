'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share2 } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import HeroSection from './HeroSection';
import InsightSection from './InsightSection';
import RelationshipSection from './RelationshipSection';
import ActivitySection from './ActivitySection';
import TestResultsSection from './TestResultsSection';
import AchievementsSection from './AchievementsSection';

// ============================================================================
// 로딩 스켈레톤
// ============================================================================

function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-32" />
            <div className="h-4 bg-gray-200 rounded w-48" />
          </div>
        </div>
        <div className="mt-4 h-2 bg-gray-200 rounded-full" />
      </div>

      {/* Sections skeleton */}
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-2xl p-6">
          <div className="h-5 bg-gray-200 rounded w-24 mb-4" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(j => (
              <div key={j} className="h-24 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// 메인 프로필 페이지
// ============================================================================

export default function ProfilePage() {
  const router = useRouter();
  const { profile, loading } = useProfile();

  const handleBack = () => {
    router.back();
  };

  const handleShare = async () => {
    // TODO: 프로필 공유 로직
    if (navigator.share) {
      try {
        await navigator.share({
          title: '나의 케미 프로필',
          text: `나의 프로필을 확인해보세요!`,
          url: window.location.href,
        });
      } catch {
        // 사용자가 취소하거나 공유 실패
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      // TODO: 복사 완료 토스트
    }
  };

  const handleStartTest = (testKey: string) => {
    router.push(`/?test=${testKey}`);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-20 lg:pb-4 lg:ml-60">
      {/* 헤더 - 모바일에서만 표시 */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">뒤로</span>
          </button>
          <h1 className="font-bold text-gray-900">내 프로필</h1>
          <button
            onClick={handleShare}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {loading ? (
          <ProfileSkeleton />
        ) : !profile ? (
          <EmptyProfile onStartTest={handleStartTest} />
        ) : (
          <Suspense fallback={<ProfileSkeleton />}>
            {/* Hero: 레벨 + 태그 + 완성도 */}
            <HeroSection profile={profile} onShare={handleShare} />

            {/* 인사이트 저니 */}
            <InsightSection />

            {/* 관계 속 나 */}
            <RelationshipSection profile={profile} onStartTest={handleStartTest} />

            {/* 활동 & 경쟁 */}
            <ActivitySection />

            {/* 테스트 결과 */}
            <TestResultsSection profile={profile} onStartTest={handleStartTest} />

            {/* 도전 & 기록 */}
            <AchievementsSection profile={profile} />
          </Suspense>
        )}
      </main>
    </div>
  );
}

// ============================================================================
// 빈 프로필 안내
// ============================================================================

interface EmptyProfileProps {
  onStartTest: (testKey: string) => void;
}

function EmptyProfile({ onStartTest }: EmptyProfileProps) {
  return (
    <div className="bg-white rounded-2xl p-8 text-center">
      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
        <span className="text-4xl">✨</span>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        프로필을 시작해보세요!
      </h2>
      <p className="text-gray-500 mb-6">
        테스트를 완료하면 나만의 프로필이 만들어집니다
      </p>
      <button
        onClick={() => onStartTest('human')}
        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all"
      >
        첫 테스트 시작하기
      </button>
    </div>
  );
}
