'use client';

import { useState, useEffect } from 'react';
import { Share2, Check } from 'lucide-react';
import { profileService, type MyProfileData } from '@/services/ProfileService';
import { insightService, type TagAggregation } from '@/services/InsightService';

// ============================================================================
// 타입
// ============================================================================

interface HeroSectionProps {
  profile: MyProfileData;
  onShare?: () => void;
}

// ============================================================================
// 레벨 색상 매핑
// ============================================================================

const LEVEL_COLORS: Record<number, { bg: string; text: string; gradient: string }> = {
  1: { bg: 'bg-purple-500', text: 'text-purple-600', gradient: 'from-purple-500 to-purple-600' },
  2: { bg: 'bg-orange-500', text: 'text-orange-600', gradient: 'from-orange-500 to-orange-600' },
  3: { bg: 'bg-blue-500', text: 'text-blue-600', gradient: 'from-blue-500 to-blue-600' },
  4: { bg: 'bg-teal-500', text: 'text-teal-600', gradient: 'from-teal-500 to-teal-600' },
  5: { bg: 'bg-amber-500', text: 'text-amber-600', gradient: 'from-amber-500 to-amber-600' },
};

// ============================================================================
// HeroSection 컴포넌트
// ============================================================================

export default function HeroSection({ profile, onShare }: HeroSectionProps) {
  const [topTags, setTopTags] = useState<TagAggregation[]>([]);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  const { level, title } = profileService.getProfileLevel(profile.completionRate);
  const colors = LEVEL_COLORS[level] || LEVEL_COLORS[1];

  // 핵심 태그 로드
  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await insightService.getTopTags(3);
        setTopTags(tags);
      } catch {
        // 에러 무시
      }
    };
    loadTags();
  }, []);

  // 공유 핸들러
  const handleShare = async () => {
    if (onShare) {
      onShare();
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus('copied');
        setTimeout(() => setShareStatus('idle'), 2000);
      } catch {
        // 복사 실패
      }
    }
  };

  // 대표 성향 (첫 번째 테스트 결과)
  const primaryResult = profile.personality;

  return (
    <section className="bg-white rounded-2xl overflow-hidden shadow-sm">
      {/* 상단 그라디언트 헤더 */}
      <div className={`bg-gradient-to-r ${colors.gradient} p-4 md:p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            {/* 레벨 배지 */}
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg md:text-xl">Lv.{level}</span>
            </div>

            {/* 제목 및 진행률 */}
            <div>
              <h2 className="text-white font-bold text-lg md:text-xl">{title}</h2>
              <p className="text-white/80 text-sm">
                {profile.completedTests}/{profile.totalTests} 테스트 완료
              </p>
            </div>
          </div>

          {/* 공유 버튼 - PC에서 표시 */}
          <button
            onClick={handleShare}
            className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-white text-sm font-medium transition-colors"
          >
            {shareStatus === 'copied' ? (
              <>
                <Check className="w-4 h-4" />
                복사됨
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                공유
              </>
            )}
          </button>
        </div>
      </div>

      {/* 하단 정보 */}
      <div className="p-4 md:p-6">
        {/* 완성도 프로그레스 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-gray-500">프로필 완성도</span>
            <span className={`text-sm font-medium ${colors.text}`}>
              {profile.completionRate}%
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${colors.bg}`}
              style={{ width: `${profile.completionRate}%` }}
            />
          </div>
        </div>

        {/* 대표 성향 + 핵심 태그 */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
          {/* 대표 성향 */}
          {primaryResult && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">{primaryResult.resultEmoji}</span>
              <div>
                <p className="text-xs text-gray-400">대표 성향</p>
                <p className="font-medium text-gray-800">{primaryResult.resultName}</p>
              </div>
            </div>
          )}

          {/* 구분선 */}
          {primaryResult && topTags.length > 0 && (
            <div className="hidden md:block w-px h-8 bg-gray-200" />
          )}

          {/* 핵심 태그 */}
          {topTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {topTags.map(tag => (
                <span
                  key={tag.tag}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                >
                  #{tag.tag}
                </span>
              ))}
            </div>
          )}

          {/* 태그 없을 때 */}
          {!primaryResult && topTags.length === 0 && (
            <p className="text-sm text-gray-400">
              테스트를 더 완료하면 나만의 태그가 생겨요
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
