'use client';

import { useState, useEffect } from 'react';
import { Award, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import type { MyProfileData } from '@/services/ProfileService';
import { formatRelativeTime } from '@/utils/format';
import { resultService, type TestResultCamel } from '@/services/ResultService';
import { SUBJECT_CONFIG } from '@/data/config';
import type { SubjectKey } from '@/data/types';

// ============================================================================
// 타입
// ============================================================================

interface AchievementsSectionProps {
  profile: MyProfileData;
}

// ============================================================================
// AchievementsSection 컴포넌트
// ============================================================================

export default function AchievementsSection({ profile }: AchievementsSectionProps) {
  const [showHistory, setShowHistory] = useState(false);

  const { badges, hiddenCombos, nextMilestone } = profile;

  // 해금된 배지와 조합
  const unlockedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);
  const unlockedCombos = hiddenCombos.filter(c => c.unlocked);

  return (
    <section className="bg-slate-50 rounded-2xl p-4 md:p-6">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-amber-500" />
        <h2 className="font-bold text-gray-900">도전 & 기록</h2>
      </div>

      {/* 다음 마일스톤 */}
      {nextMilestone && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-amber-800">
              다음 목표: {nextMilestone.target}%
            </span>
            <span className="text-sm text-amber-600">
              {nextMilestone.testsNeeded}개 더 필요
            </span>
          </div>
          <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all"
              style={{ width: `${Math.min(100, (profile.completionRate / nextMilestone.target) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-amber-600 mt-2">
            🎁 {nextMilestone.reward}
          </p>
        </div>
      )}

      {/* 배지 그리드 */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          배지 ({unlockedBadges.length}/{badges.length})
        </h3>
        <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {unlockedBadges.map(badge => (
            <div
              key={badge.id}
              className="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl flex flex-col items-center justify-center p-2 group cursor-pointer"
              title={badge.name}
            >
              <span className="text-2xl">{badge.emoji}</span>
              <span className="text-[10px] text-amber-700 text-center mt-1 line-clamp-1">
                {badge.name}
              </span>
            </div>
          ))}
          {lockedBadges.map(badge => (
            <div
              key={badge.id}
              className="aspect-square bg-gray-100 rounded-xl flex flex-col items-center justify-center p-2 opacity-50"
              title={badge.requirement}
            >
              <span className="text-2xl grayscale">{badge.emoji}</span>
              <span className="text-[10px] text-gray-400 text-center mt-1 line-clamp-1">
                ???
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 발견한 조합 */}
      {hiddenCombos.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            발견한 조합 ({unlockedCombos.length}/{hiddenCombos.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {unlockedCombos.map(combo => (
              <div
                key={combo.id}
                className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 flex items-center gap-3"
              >
                <span className="text-2xl">{combo.emoji}</span>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{combo.name}</p>
                  <p className="text-xs text-gray-500">{combo.description}</p>
                </div>
              </div>
            ))}
            {hiddenCombos
              .filter(c => !c.unlocked)
              .slice(0, 2)
              .map(combo => (
                <div
                  key={combo.id}
                  className="bg-gray-100 rounded-xl p-3 flex items-center gap-3 opacity-60"
                >
                  <span className="text-2xl">❓</span>
                  <div>
                    <p className="font-medium text-gray-500 text-sm">???</p>
                    <p className="text-xs text-gray-400">
                      {combo.completedTests.length}/{combo.requiredTests.length} 진행 중
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 100% 달성 축하 */}
      {profile.completionRate === 100 && (
        <div className="bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 rounded-xl p-4 text-center mb-4">
          <span className="text-4xl mb-2 block">🎉</span>
          <p className="font-bold text-amber-800">완벽한 프로필!</p>
          <p className="text-sm text-amber-600">모든 테스트를 완료했어요</p>
        </div>
      )}

      {/* 히스토리 토글 */}
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <Clock className="w-4 h-4" />
        <span>테스트 기록</span>
        {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* 히스토리 (접기/펼치기) */}
      {showHistory && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <TestHistory />
        </div>
      )}
    </section>
  );
}

// ============================================================================
// TestHistory 하위 컴포넌트
// ============================================================================

function TestHistory() {
  const [results, setResults] = useState<TestResultCamel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      try {
        const allResults = await resultService.getMyResults();
        // 최신순 정렬
        allResults.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setResults(allResults.slice(0, 20)); // 최근 20개만
      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, []);

  if (loading) {
    return (
      <div className="space-y-2 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <p className="text-center text-gray-400 py-4">
        테스트 기록이 없어요
      </p>
    );
  }

  // 날짜별 그룹화
  const groupedResults = results.reduce((acc, result) => {
    const date = new Date(result.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let key: string;
    if (date.toDateString() === today.toDateString()) {
      key = '오늘';
    } else if (date.toDateString() === yesterday.toDateString()) {
      key = '어제';
    } else {
      key = `${date.getMonth() + 1}월 ${date.getDate()}일`;
    }

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(result);
    return acc;
  }, {} as Record<string, TestResultCamel[]>);

  return (
    <div className="space-y-4">
      {Object.entries(groupedResults).map(([date, dateResults]) => (
        <div key={date}>
          <p className="text-xs text-gray-400 mb-2">{date}</p>
          <div className="space-y-2">
            {dateResults.map((result, index) => {
              const config = SUBJECT_CONFIG[result.testType as SubjectKey];

              return (
                <div
                  key={`${result.testType}-${index}`}
                  className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                >
                  <span className="text-xl">{result.resultEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">
                      {result.resultKey}
                    </p>
                    <p className="text-xs text-gray-400">
                      {config?.label || result.testType}
                    </p>
                  </div>
                  <span className="text-xs text-gray-300">
                    {formatRelativeTime(result.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
