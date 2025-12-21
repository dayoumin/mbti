'use client';

import { useState, useEffect, useMemo } from 'react';
import { Trophy, ChevronRight, Star } from 'lucide-react';
import { CHEMI_DATA } from '@/data';
import { RANKABLE_TESTS } from '@/data/config';
import { RANKING_CATEGORIES } from '@/data/ranking-categories';
import type { SubjectKey, SubjectData } from '@/data/types';

// Context 사용
import { useMyResults, type MyResult } from '@/contexts/MyResultsContext';

interface CategoryRank {
  category: string;
  emoji: string;
  rank: number;
  total: number;
}

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
    if (foundIndex === -1) {
      // 결과명이 데이터와 불일치 (테스트 데이터 변경 등)
      console.warn(`[MyRankingMini] Result "${resultName}" not found in ${testType} for category ${category.name}`);
      return;
    }

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
  // Context에서 결과 가져오기 (Provider가 없으면 에러 발생하므로 try-catch로 처리하지 않음)
  const { myResults } = useMyResults();
  const [currentIndex, setCurrentIndex] = useState(0);

  // myResults 변경 시 currentIndex 범위 초과 방지
  useEffect(() => {
    if (myResults.length > 0 && currentIndex >= myResults.length) {
      setCurrentIndex(myResults.length - 1);
    }
  }, [myResults.length, currentIndex]);

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
