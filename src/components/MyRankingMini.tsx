'use client';

import { useState, useEffect, useMemo } from 'react';
import { Trophy, ChevronRight, Star } from 'lucide-react';
import { CHEMI_DATA } from '@/data';
import { RANKABLE_TESTS } from '@/data/config';
import { resultService } from '@/services/ResultService';
import type { SubjectKey, ResultLabel, SubjectData } from '@/data/types';

// ============================================================================
// 타입 정의
// ============================================================================

interface MyResult {
  testType: SubjectKey;
  resultName: string;
  resultEmoji: string;
  createdAt: string;
}

interface CategoryRank {
  category: string;
  emoji: string;
  rank: number;
  total: number;
}

// ============================================================================
// 랭킹 카테고리 정의 (RankingTab.tsx에서 가져옴)
// ============================================================================

const RANKING_CATEGORIES: Record<string, { id: string; name: string; emoji: string; getScore: (result: ResultLabel) => number }[]> = {
  petMatch: [
    {
      id: 'activity', name: '활동성', emoji: '🏃',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.activity === 'high') score += 3;
        else if (c.activity === 'medium') score += 2;
        else if (c.activity === 'low') score += 1;
        if (c.time === 'high') score += 2;
        return score;
      }
    },
    {
      id: 'easy', name: '초보 친화', emoji: '🌱',
      getScore: (result) => {
        const c = result.condition;
        let score = 6;
        if (c.activity === 'high') score -= 1;
        if (c.time === 'high') score -= 1;
        if (c.space === 'high') score -= 1;
        return Math.max(0, score);
      }
    },
  ],
  plant: [
    {
      id: 'easy', name: '초보 추천', emoji: '🌱',
      getScore: (result) => {
        const c = result.condition;
        let score = 6;
        if (c.care === 'high') score -= 2;
        if (c.water === 'high') score -= 1;
        return Math.max(0, score);
      }
    },
    {
      id: 'neglect', name: '방치 가능', emoji: '😴',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.water === 'low') score += 3;
        else if (c.water === 'medium') score += 2;
        return score;
      }
    },
  ],
  coffee: [
    {
      id: 'strong', name: '진한 맛', emoji: '💪',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.bitter === 'high') score += 3;
        if (c.caffeine === 'high') score += 2;
        return score;
      }
    },
    {
      id: 'sweet', name: '달달함', emoji: '🍬',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.sweet === 'high') score += 3;
        else if (c.sweet === 'medium') score += 2;
        return score;
      }
    },
  ],
  idealType: [
    {
      id: 'passion', name: '열정', emoji: '🔥',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.passion === 'high') score += 3;
        else if (c.passion === 'medium') score += 2;
        return score;
      }
    },
    {
      id: 'stable', name: '안정', emoji: '🏠',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.commit === 'high') score += 3;
        else if (c.commit === 'medium') score += 2;
        return score;
      }
    },
  ],
  food: [
    {
      id: 'adventure', name: '모험심', emoji: '🌶️',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.adventure === 'high') score += 3;
        else if (c.adventure === 'medium') score += 2;
        return score;
      }
    },
    {
      id: 'comfort', name: '편안함', emoji: '🍚',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.comfort === 'high') score += 3;
        else if (c.comfort === 'medium') score += 2;
        return score;
      }
    },
  ],
};

// ============================================================================
// 카테고리 순위 계산
// ============================================================================

function calculateCategoryRanks(testType: SubjectKey, resultName: string): CategoryRank[] {
  const data = CHEMI_DATA[testType] as SubjectData | undefined;
  if (!data) return [];

  const categories = RANKING_CATEGORIES[testType] || [];
  const ranks: CategoryRank[] = [];

  categories.forEach(category => {
    const rankedResults = data.resultLabels
      .map(result => ({ result, score: category.getScore(result) }))
      .sort((a, b) => b.score - a.score);

    const foundIndex = rankedResults.findIndex(r => r.result.name === resultName);
    // 결과를 찾지 못한 경우 해당 카테고리 스킵
    if (foundIndex === -1) return;

    ranks.push({
      category: category.name,
      emoji: category.emoji,
      rank: foundIndex + 1,
      total: data.resultLabels.length,
    });
  });

  return ranks;
}

// ============================================================================
// 컴포넌트
// ============================================================================

interface MyRankingMiniProps {
  onOpenRanking?: () => void;
  className?: string;
}

export default function MyRankingMini({ onOpenRanking, className = '' }: MyRankingMiniProps) {
  const [myResults, setMyResults] = useState<MyResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 내 테스트 결과 로드
  useEffect(() => {
    const loadResults = async () => {
      try {
        const results = await resultService.getMyResults();
        // RANKABLE_TESTS에 있는 테스트만 필터링
        const rankableKeys = RANKABLE_TESTS.map(t => t.key);
        const filtered = results
          .filter(r => rankableKeys.includes(r.testType as SubjectKey))
          .map(r => ({
            testType: r.testType as SubjectKey,
            resultName: r.resultKey,  // resultKey가 실제 결과 이름
            resultEmoji: r.resultEmoji,
            createdAt: r.createdAt,
          }));

        // 중복 제거 (같은 테스트의 최신 결과만 유지)
        const unique = filtered.reduce((acc, curr) => {
          const existing = acc.find(r => r.testType === curr.testType);
          if (!existing) {
            acc.push(curr);
          } else if (new Date(curr.createdAt) > new Date(existing.createdAt)) {
            // 더 최신 결과로 교체
            const idx = acc.indexOf(existing);
            acc[idx] = curr;
          }
          return acc;
        }, [] as MyResult[]);

        setMyResults(unique);
      } catch (e) {
        console.error('[MyRankingMini] Failed to load results:', e);
      }
    };
    loadResults();
  }, []);

  // 8초마다 자동 로테이션
  useEffect(() => {
    if (myResults.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % myResults.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [myResults.length]);

  // 현재 표시할 결과의 카테고리 순위
  const currentResult = myResults[currentIndex];
  const categoryRanks = useMemo(() => {
    if (!currentResult) return [];
    return calculateCategoryRanks(currentResult.testType, currentResult.resultName);
  }, [currentResult]);

  // 테스트 정보
  const testInfo = currentResult ? RANKABLE_TESTS.find(t => t.key === currentResult.testType) : null;

  // 결과가 없으면 표시 안함
  if (myResults.length === 0) {
    return null;
  }

  return (
    <div className={`bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-bold text-amber-700">내 결과 순위</span>
        </div>
        {myResults.length > 1 && (
          <div className="flex gap-0.5">
            {myResults.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-amber-500' : 'bg-amber-200'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 현재 결과 */}
      {currentResult && testInfo && (
        <button
          onClick={onOpenRanking}
          className="w-full bg-white/70 rounded-lg p-2.5 hover:bg-white transition-colors text-left group"
        >
          {/* 테스트 이름 + 내 결과 */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{testInfo.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-700 truncate">
                {testInfo.name}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                {currentResult.resultEmoji} {currentResult.resultName}
              </p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-500 transition-colors flex-shrink-0" />
          </div>

          {/* 카테고리별 순위 */}
          {categoryRanks.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {categoryRanks.map((rank) => (
                <span
                  key={rank.category}
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    rank.rank === 1
                      ? 'bg-amber-100 text-amber-700'
                      : rank.rank <= 3
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {rank.emoji} {rank.category} {rank.rank}위
                </span>
              ))}
            </div>
          )}
        </button>
      )}
    </div>
  );
}
