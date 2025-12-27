'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useProfile } from '@/hooks/useProfile';
import { profileService } from '@/services/ProfileService';

// ============================================================================
// 프로필 컴팩트 카드 (메인 화면용)
// ============================================================================

export function CompactProfile() {
  const router = useRouter();
  const { profile, loading } = useProfile();
  const { data: session } = useSession();

  const handleViewFull = () => {
    router.push('/profile');
  };

  if (loading) {
    return (
      <div className="bg-slate-100 rounded-2xl p-5 animate-pulse">
        <div className="h-20 bg-slate-200 rounded-xl" />
      </div>
    );
  }

  if (!profile || profile.completedTests === 0) {
    return (
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
            <span className="text-2xl">✨</span>
          </div>
          <div>
            <p className="font-medium text-slate-800">나의 프로필을 시작해보세요!</p>
            <p className="text-sm text-slate-500">테스트를 하면 프로필이 채워집니다</p>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-xs">성격 알아보기</span>
          <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-xs">반려동물 케미</span>
        </div>
      </div>
    );
  }

  const { level, title } = profileService.getProfileLevel(profile.completionRate);

  return (
    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
      {/* 상단: 레벨 & 완성도 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg bg-slate-600">
            Lv.{level}
          </div>
          <div>
            <p className="font-medium text-slate-800">{title}</p>
            <p className="text-xs text-slate-500">{profile.completedTests}/{profile.totalTests} 테스트 완료</p>
          </div>
        </div>
        <button
          onClick={handleViewFull}
          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-medium text-slate-700 transition-all"
        >
          더보기
        </button>
      </div>

      {/* 완성도 프로그레스 바 */}
      <div className="mb-4">
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 bg-slate-500"
            style={{ width: `${profile.completionRate}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-1 text-right">{profile.completionRate}% 완성</p>
      </div>

      {/* 미니 요약 */}
      <div className="flex flex-wrap gap-2">
        {profile.personality && (
          <span className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-full text-xs flex items-center gap-1">
            <span>{profile.personality.resultEmoji}</span>
            <span>{profile.personality.resultName}</span>
          </span>
        )}
        {profile.petChemi.recommendedPet && (
          <span className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-full text-xs flex items-center gap-1">
            <span>🐾</span>
            <span>{profile.petChemi.recommendedPet}</span>
          </span>
        )}
        {profile.lifestyle.coffee && (
          <span className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-full text-xs flex items-center gap-1">
            <span>{profile.lifestyle.coffee.resultEmoji}</span>
            <span>{profile.lifestyle.coffee.resultName}</span>
          </span>
        )}
        {profile.petChemi.scores.length > 0 && (
          <span className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-full text-xs">
            {profile.petChemi.scores.map(s => s.petEmoji).join('')}
          </span>
        )}
      </div>

      {/* 로그인 안내 (비로그인 + 테스트 1개 이상 완료 시) */}
      {!session && profile.completedTests >= 1 && (
        <div className="mt-4 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-orange-600">
            <span>⚠️</span>
            <span>브라우저 초기화 시 데이터가 사라질 수 있어요</span>
          </div>
          <a
            href="/login"
            className="mt-2 block text-center py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-medium text-slate-700 transition-all"
          >
            로그인하고 안전하게 저장하기
          </a>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 기본 Export
// ============================================================================

export default CompactProfile;
