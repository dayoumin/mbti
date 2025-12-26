'use client';

import { useState, useEffect, useMemo } from 'react';
import { Grid3X3, RefreshCw } from 'lucide-react';
import { resultService, type TestResultCamel } from '@/services/ResultService';
import { SUBJECT_CONFIG } from '@/data/config';
import type { MyProfileData } from '@/services/ProfileService';
import type { SubjectKey } from '@/data/types';

// ============================================================================
// 타입
// ============================================================================

interface TestResultsSectionProps {
  profile: MyProfileData;
  onStartTest?: (testKey: string) => void;
}

type CategoryKey = 'all' | 'personality' | 'pet' | 'lifestyle';

interface Category {
  key: CategoryKey;
  label: string;
  emoji: string;
  testKeys: SubjectKey[];
}

// ============================================================================
// 카테고리 정의
// ============================================================================

const CATEGORIES: Category[] = [
  { key: 'all', label: '전체', emoji: '📋', testKeys: [] },
  {
    key: 'personality',
    label: '성격/관계',
    emoji: '🧠',
    testKeys: ['human', 'idealType', 'conflictStyle', 'attachment'] as SubjectKey[],
  },
  {
    key: 'pet',
    label: '반려동물',
    emoji: '🐾',
    testKeys: ['cat', 'dog', 'petMatch', 'catBreed', 'dogBreed', 'smallPet', 'fishType', 'birdType', 'reptileType'] as SubjectKey[],
  },
  {
    key: 'lifestyle',
    label: '라이프',
    emoji: '✨',
    testKeys: ['coffee', 'tea', 'plant', 'food', 'alcohol', 'bread', 'fruit', 'perfume', 'aroma', 'travel', 'homeStyle', 'movieGenre'] as SubjectKey[],
  },
];

// ============================================================================
// TestResultsSection 컴포넌트
// ============================================================================

export default function TestResultsSection({ profile, onStartTest }: TestResultsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [results, setResults] = useState<TestResultCamel[]>([]);
  const [loading, setLoading] = useState(true);

  // 결과 로드
  useEffect(() => {
    const loadResults = async () => {
      try {
        const allResults = await resultService.getMyResults();
        setResults(allResults);
      } catch (error) {
        console.error('Failed to load results:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, []);

  // 필터링된 결과
  const filteredResults = useMemo(() => {
    if (activeCategory === 'all') {
      return results;
    }

    const category = CATEGORIES.find(c => c.key === activeCategory);
    if (!category) return results;

    return results.filter(r => category.testKeys.includes(r.testType as SubjectKey));
  }, [results, activeCategory]);

  // 테스트 타입별 최신 결과만 추출
  const uniqueResults = useMemo(() => {
    const map = new Map<string, TestResultCamel>();
    filteredResults.forEach(r => {
      if (!map.has(r.testType) || new Date(r.createdAt) > new Date(map.get(r.testType)!.createdAt)) {
        map.set(r.testType, r);
      }
    });
    return Array.from(map.values());
  }, [filteredResults]);

  if (loading) {
    return (
      <section className="bg-white rounded-2xl p-4 md:p-6">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-32 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl p-4 md:p-6">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-4">
        <Grid3X3 className="w-5 h-5 text-gray-600" />
        <h2 className="font-bold text-gray-900">테스트 결과</h2>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {CATEGORIES.map(category => (
          <button
            key={category.key}
            onClick={() => setActiveCategory(category.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === category.key
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{category.emoji}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* 결과 그리드 */}
      {uniqueResults.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {uniqueResults.map(result => {
            const config = SUBJECT_CONFIG[result.testType as SubjectKey];

            return (
              <button
                key={result.testType}
                onClick={() => onStartTest?.(result.testType)}
                className="bg-gray-50 hover:bg-gray-100 rounded-xl p-3 text-left transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl">{result.resultEmoji}</span>
                  <RefreshCw className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
                <p className="font-medium text-gray-800 text-sm mb-0.5 line-clamp-1">
                  {result.resultKey}
                </p>
                <p className="text-xs text-gray-400">
                  {config?.label || result.testType}
                </p>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-3xl opacity-50">📋</span>
          </div>
          <p className="text-gray-500 mb-4">
            {activeCategory === 'all'
              ? '아직 테스트 결과가 없어요'
              : `${CATEGORIES.find(c => c.key === activeCategory)?.label} 테스트를 해보세요`}
          </p>
          {activeCategory !== 'all' && (
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.find(c => c.key === activeCategory)?.testKeys.slice(0, 3).map(testKey => {
                const config = SUBJECT_CONFIG[testKey];
                if (!config) return null;

                return (
                  <button
                    key={testKey}
                    onClick={() => onStartTest?.(testKey)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full text-sm transition-colors"
                  >
                    {config.emoji} {config.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
