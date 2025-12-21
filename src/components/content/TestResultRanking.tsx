'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trophy, Users, ChevronDown, TrendingUp, Crown, Medal, BarChart2 } from 'lucide-react';
import { SUBJECT_CONFIG, MAIN_TEST_KEYS } from '@/data/config';
import type { SubjectKey } from '@/data/types';

interface RankingItem {
  resultName: string;
  resultEmoji: string;
  testType: string;
  count: number;
  percentage: number;
}

interface AgeStats {
  [ageGroup: string]: Array<{
    resultName: string;
    count: number;
    percentage: number;
  }>;
}

const AGE_GROUP_LABELS: Record<string, string> = {
  '10s': '10대',
  '20s': '20대',
  '30s': '30대',
  '40s+': '40대+',
};

// 매칭 테스트만 필터 (결과가 다양한 것들)
const RANKABLE_TESTS: SubjectKey[] = MAIN_TEST_KEYS.filter(key => {
  const config = SUBJECT_CONFIG[key];
  return config.testType === 'matching' || ['human', 'cat', 'dog'].includes(key);
});

interface TestResultRankingProps {
  className?: string;
  defaultTestType?: SubjectKey;
  showTestSelector?: boolean;
  maxDisplay?: number;
}

export default function TestResultRanking({
  className = '',
  defaultTestType,
  showTestSelector = true,
  maxDisplay = 10,
}: TestResultRankingProps) {
  const [selectedTest, setSelectedTest] = useState<SubjectKey>(defaultTestType || 'coffee');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [ageStats, setAgeStats] = useState<AgeStats>({});
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showTestDropdown, setShowTestDropdown] = useState(false);
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);

  // 랭킹 로드
  const loadRanking = useCallback(async () => {
    setIsLoading(true);
    try {
      const ageParam = selectedAgeGroup !== 'all' ? `&ageGroup=${selectedAgeGroup}` : '';
      const res = await fetch(
        `/api/ranking?type=results&testType=${selectedTest}&limit=${maxDisplay}${ageParam}`
      );

      if (res.ok) {
        const data = await res.json();
        setRankings(data.rankings || []);
        setTotal(data.total || 0);
      }

      // 전체 보기일 때 연령대별 통계도 로드
      if (selectedAgeGroup === 'all') {
        const ageRes = await fetch(`/api/ranking?type=by-age&testType=${selectedTest}`);
        if (ageRes.ok) {
          const ageData = await ageRes.json();
          setAgeStats(ageData.ageStats || {});
        }
      }
    } catch (error) {
      console.error('[TestResultRanking] Load error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTest, selectedAgeGroup, maxDisplay]);

  useEffect(() => {
    loadRanking();
  }, [loadRanking]);

  // 순위 배지
  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-slate-400">{rank}</span>;
  };

  const testConfig = SUBJECT_CONFIG[selectedTest];
  const testLabel = testConfig?.label || selectedTest;
  const testEmoji = testConfig?.emoji || '📊';

  if (isLoading) {
    return (
      <div className={`bg-white rounded-2xl p-4 shadow-sm border border-slate-100 ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-slate-200 rounded w-2/3" />
          <div className="h-12 bg-slate-100 rounded-xl" />
          <div className="h-12 bg-slate-100 rounded-xl" />
          <div className="h-12 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
      {/* 헤더 */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-xl flex items-center justify-center shadow-sm">
              <BarChart2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">테스트 결과 랭킹</h2>
              <p className="text-xs text-slate-500">{total.toLocaleString()}명 참여</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 테스트 선택 */}
            {showTestSelector && (
              <div className="relative">
                <button
                  onClick={() => { setShowTestDropdown(!showTestDropdown); setShowAgeDropdown(false); }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-full text-xs font-medium text-slate-600 border border-slate-200 hover:border-purple-300 transition-colors"
                >
                  <span>{testEmoji}</span>
                  <span>{testLabel}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showTestDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showTestDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-20 max-h-64 overflow-y-auto">
                    {RANKABLE_TESTS.map(key => {
                      const config = SUBJECT_CONFIG[key];
                      return (
                        <button
                          key={key}
                          onClick={() => { setSelectedTest(key); setShowTestDropdown(false); }}
                          className={`w-full px-3 py-2 text-xs text-left hover:bg-purple-50 flex items-center gap-2 ${
                            selectedTest === key ? 'text-purple-600 font-bold bg-purple-50' : 'text-slate-600'
                          }`}
                        >
                          <span>{config.emoji}</span>
                          <span>{config.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 연령대 필터 */}
            <div className="relative">
              <button
                onClick={() => { setShowAgeDropdown(!showAgeDropdown); setShowTestDropdown(false); }}
                className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-full text-xs font-medium text-slate-600 border border-slate-200 hover:border-purple-300 transition-colors"
              >
                {selectedAgeGroup === 'all' ? '전체' : AGE_GROUP_LABELS[selectedAgeGroup]}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAgeDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showAgeDropdown && (
                <div className="absolute right-0 top-full mt-1 w-24 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-20">
                  <button
                    onClick={() => { setSelectedAgeGroup('all'); setShowAgeDropdown(false); }}
                    className={`w-full px-3 py-2 text-xs text-left hover:bg-purple-50 ${
                      selectedAgeGroup === 'all' ? 'text-purple-600 font-bold' : 'text-slate-600'
                    }`}
                  >
                    전체
                  </button>
                  {Object.entries(AGE_GROUP_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => { setSelectedAgeGroup(key); setShowAgeDropdown(false); }}
                      className={`w-full px-3 py-2 text-xs text-left hover:bg-purple-50 ${
                        selectedAgeGroup === key ? 'text-purple-600 font-bold' : 'text-slate-600'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 랭킹 리스트 */}
      <div className="p-4 space-y-2">
        {rankings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-slate-400 mb-2">아직 데이터가 없어요</p>
            <p className="text-xs text-slate-300">테스트를 완료하면 자동으로 집계됩니다</p>
          </div>
        ) : (
          rankings.map((item, index) => (
            <div
              key={`${item.testType}-${item.resultName}`}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                index < 3 ? 'bg-gradient-to-r from-purple-50 to-transparent' : 'bg-slate-50'
              }`}
            >
              {/* 순위 */}
              <div className="flex-shrink-0 w-8 flex justify-center">
                {getRankBadge(index + 1)}
              </div>

              {/* 결과 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.resultEmoji}</span>
                  <span className="font-bold text-slate-800 truncate">{item.resultName}</span>
                </div>
              </div>

              {/* 통계 */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-bold text-purple-600">{item.percentage}%</div>
                  <div className="text-xs text-slate-400">{item.count.toLocaleString()}명</div>
                </div>

                {/* 프로그레스 바 */}
                <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 연령대별 비교 (전체 보기일 때만) */}
      {selectedAgeGroup === 'all' && Object.keys(ageStats).length > 0 && (
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold text-indigo-600">연령대별 1위</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {Object.entries(AGE_GROUP_LABELS).map(([age, label]) => {
              const stats = ageStats[age];
              const top = stats?.[0];
              if (!top) return null;

              return (
                <div key={age} className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xs font-bold text-slate-500 mb-1">{label}</div>
                  <div className="flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="text-sm font-bold text-slate-800 truncate">{top.resultName}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{top.percentage}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
