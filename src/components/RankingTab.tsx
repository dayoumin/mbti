'use client';

import { useState, useMemo, useEffect } from 'react';
import { CHEMI_DATA } from '@/data';
import { SubjectKey, ResultLabel, SubjectData } from '@/data/types';
import { resultService } from '@/services/ResultService';
import {
  ChevronLeft,
  Trophy,
  Medal,
  Crown,
  Star,
  TrendingUp,
  Users,
  Sparkles,
  ChevronRight,
  BarChart3,
} from 'lucide-react';

// ============================================================================
// 타입 정의
// ============================================================================

interface RankingTabProps {
  onClose: () => void;
  onStartTest?: (testKey: SubjectKey) => void;
}

interface UserRanking {
  testType: SubjectKey;
  resultName: string;
  resultEmoji: string;
  rank: number;
  totalResults: number;
  categoryRanks: { category: string; rank: number; emoji: string }[];
}

// ============================================================================
// 랭킹 카테고리 정의
// ============================================================================

const RANKING_CATEGORIES: Record<string, { id: string; name: string; emoji: string; description: string; getScore: (result: ResultLabel) => number }[]> = {
  petMatch: [
    {
      id: 'activity',
      name: '활동성',
      emoji: '🏃',
      description: '활발하고 에너지 넘치는 순',
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
      id: 'easy',
      name: '초보 친화',
      emoji: '🌱',
      description: '키우기 쉬운 순',
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
      id: 'easy',
      name: '초보 추천',
      emoji: '🌱',
      description: '관리가 쉬운 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 6;
        if (c.care === 'high') score -= 2;
        if (c.water === 'high') score -= 1;
        return Math.max(0, score);
      }
    },
    {
      id: 'neglect',
      name: '방치 가능',
      emoji: '😴',
      description: '물 잘 안 줘도 되는 순',
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
      id: 'strong',
      name: '진한 맛',
      emoji: '💪',
      description: '진하고 강한 맛 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.bitter === 'high') score += 3;
        if (c.caffeine === 'high') score += 2;
        return score;
      }
    },
    {
      id: 'sweet',
      name: '달달함',
      emoji: '🍬',
      description: '달콤한 순',
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
      id: 'passion',
      name: '열정',
      emoji: '🔥',
      description: '열정적인 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.passion === 'high') score += 3;
        else if (c.passion === 'medium') score += 2;
        return score;
      }
    },
    {
      id: 'stable',
      name: '안정',
      emoji: '🏠',
      description: '안정적인 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.commit === 'high') score += 3;
        else if (c.commit === 'medium') score += 2;
        return score;
      }
    },
  ],
};

const RANKABLE_TESTS: { key: SubjectKey; emoji: string; name: string }[] = [
  { key: 'petMatch', emoji: '🐾', name: '반려동물' },
  { key: 'plant', emoji: '🌱', name: '식물' },
  { key: 'coffee', emoji: '☕', name: '커피' },
  { key: 'idealType', emoji: '💕', name: '이상형' },
];

// ============================================================================
// 내 테스트 결과 기반 랭킹 계산
// ============================================================================

function calculateMyRanking(testType: SubjectKey, resultName: string): UserRanking | null {
  const data = CHEMI_DATA[testType] as SubjectData | undefined;
  if (!data) return null;

  const myResult = data.resultLabels.find(r => r.name === resultName);
  if (!myResult) return null;

  const categories = RANKING_CATEGORIES[testType] || [];
  const categoryRanks: UserRanking['categoryRanks'] = [];

  categories.forEach(category => {
    const rankedResults = data.resultLabels
      .map(result => ({ result, score: category.getScore(result) }))
      .sort((a, b) => b.score - a.score);

    const myRank = rankedResults.findIndex(r => r.result.name === resultName) + 1;
    categoryRanks.push({
      category: category.name,
      rank: myRank,
      emoji: category.emoji,
    });
  });

  return {
    testType,
    resultName: myResult.name,
    resultEmoji: myResult.emoji,
    rank: 1, // 전체 랭킹에서의 순위 (추후 계산)
    totalResults: data.resultLabels.length,
    categoryRanks,
  };
}

// ============================================================================
// 컴포넌트
// ============================================================================

function RankCard({
  test,
  myResult,
  onClick,
}: {
  test: { key: SubjectKey; emoji: string; name: string };
  myResult: { resultName: string; resultEmoji: string } | null;
  onClick: () => void;
}) {
  const data = CHEMI_DATA[test.key] as SubjectData | undefined;
  if (!data) return null;

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all text-left group"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-2xl">
          {test.emoji}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
            {data.title.replace(' 테스트', '').replace(' 매칭', '')} 랭킹
          </h3>
          {myResult ? (
            <p className="text-xs text-emerald-600 flex items-center gap-1">
              <Star className="w-3 h-3 fill-emerald-500" />
              내 결과: {myResult.resultEmoji} {myResult.resultName}
            </p>
          ) : (
            <p className="text-xs text-gray-400">테스트 후 내 순위 확인</p>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-400 transition-colors" />
      </div>
    </button>
  );
}

function TestRankingDetail({
  testType,
  myResultName,
  onBack,
  onStartTest,
}: {
  testType: SubjectKey;
  myResultName: string | null;
  onBack: () => void;
  onStartTest?: (testKey: SubjectKey) => void;
}) {
  const data = CHEMI_DATA[testType] as SubjectData | undefined;
  const categories = RANKING_CATEGORIES[testType] || [];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categories.length > 0 ? categories[0].id : null
  );

  const rankedResults = useMemo(() => {
    if (!data || !selectedCategory) return null;
    const category = categories.find(c => c.id === selectedCategory);
    if (!category) return null;

    return data.resultLabels
      .map(result => ({
        result,
        score: category.getScore(result),
        isMyResult: result.name === myResultName,
      }))
      .sort((a, b) => b.score - a.score)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [data, selectedCategory, categories, myResultName]);

  const myRank = rankedResults?.find(r => r.isMyResult)?.rank;

  if (!data) return null;

  return (
    <div className="space-y-4">
      {/* 뒤로가기 */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800"
      >
        <ChevronLeft className="w-4 h-4" /> 랭킹 목록으로
      </button>

      {/* 테스트 정보 */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">{data.title} 랭킹</h2>
            <p className="text-white/80 text-sm">{data.resultLabels.length}가지 결과 비교</p>
          </div>
        </div>
        {myResultName && myRank && (
          <div className="mt-3 p-3 bg-white/20 rounded-xl flex items-center justify-between">
            <span className="text-sm">내 결과</span>
            <span className="font-bold">{myRank}위 / {data.resultLabels.length}</span>
          </div>
        )}
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* 랭킹 리스트 */}
      <div className="space-y-2">
        {rankedResults?.map(({ result, rank, isMyResult }) => (
          <div
            key={result.name}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              isMyResult
                ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400'
                : rank <= 3
                ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
                : 'bg-white border-gray-100'
            }`}
          >
            {/* 순위 */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              rank === 1 ? 'bg-amber-400 text-white' :
              rank === 2 ? 'bg-gray-400 text-white' :
              rank === 3 ? 'bg-orange-400 text-white' :
              'bg-gray-200 text-gray-600'
            }`}>
              {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : rank}
            </div>

            {/* 결과 정보 */}
            <span className="text-2xl">{result.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`font-bold ${isMyResult ? 'text-amber-800' : 'text-gray-800'}`}>
                  {result.name}
                </p>
                {isMyResult && (
                  <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded">
                    나
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 line-clamp-1">{result.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 테스트 시작 CTA */}
      {!myResultName && onStartTest && (
        <button
          onClick={() => onStartTest(testType)}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all"
        >
          테스트하고 내 순위 확인하기
        </button>
      )}
    </div>
  );
}

export default function RankingTab({ onClose, onStartTest }: RankingTabProps) {
  const [selectedTest, setSelectedTest] = useState<SubjectKey | null>(null);
  const [myResults, setMyResults] = useState<Record<SubjectKey, { resultName: string; resultEmoji: string } | null>>({} as Record<SubjectKey, { resultName: string; resultEmoji: string } | null>);

  // 내 테스트 결과 로드
  useEffect(() => {
    const loadMyResults = async () => {
      const results: Record<string, { resultName: string; resultEmoji: string } | null> = {};
      for (const test of RANKABLE_TESTS) {
        try {
          const history = await resultService.getResultsByType(test.key);
          if (history.length > 0) {
            const latest = history[0]; // 가장 최근 결과
            const data = CHEMI_DATA[test.key] as SubjectData | undefined;
            const resultLabel = data?.resultLabels.find(r => r.name === latest.resultKey);
            results[test.key] = {
              resultName: latest.resultKey,
              resultEmoji: resultLabel?.emoji || '📊',
            };
          } else {
            results[test.key] = null;
          }
        } catch {
          results[test.key] = null;
        }
      }
      setMyResults(results as Record<SubjectKey, { resultName: string; resultEmoji: string } | null>);
    };
    loadMyResults();
  }, []);

  const completedCount = Object.values(myResults).filter(Boolean).length;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-100 to-slate-200 z-50 overflow-hidden">
      {/* 헤더 */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="font-bold text-slate-800 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                랭킹
              </h1>
              <p className="text-[10px] text-slate-500">
                {completedCount}/{RANKABLE_TESTS.length} 테스트 완료
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="overflow-y-auto h-[calc(100vh-70px)] pb-20">
        <div className="max-w-lg mx-auto px-4 py-4">
          {selectedTest ? (
            <TestRankingDetail
              testType={selectedTest}
              myResultName={myResults[selectedTest]?.resultName || null}
              onBack={() => setSelectedTest(null)}
              onStartTest={onStartTest}
            />
          ) : (
            <div className="space-y-4">
              {/* 통계 요약 */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold">내 랭킹 현황</h2>
                    <p className="text-white/80 text-xs">테스트별 결과 순위</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/20 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black">{completedCount}</p>
                    <p className="text-xs text-white/80">완료한 테스트</p>
                  </div>
                  <div className="bg-white/20 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black">{RANKABLE_TESTS.length - completedCount}</p>
                    <p className="text-xs text-white/80">남은 테스트</p>
                  </div>
                </div>
              </div>

              {/* 테스트별 랭킹 카드 */}
              <div>
                <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Medal className="w-4 h-4 text-amber-500" />
                  테스트별 랭킹
                </h3>
                <div className="space-y-2">
                  {RANKABLE_TESTS.map(test => (
                    <RankCard
                      key={test.key}
                      test={test}
                      myResult={myResults[test.key] || null}
                      onClick={() => setSelectedTest(test.key)}
                    />
                  ))}
                </div>
              </div>

              {/* 전체 랭킹 설명 */}
              <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-indigo-800 mb-1">랭킹이란?</h4>
                    <p className="text-xs text-indigo-600 leading-relaxed">
                      각 테스트 결과를 다양한 기준으로 순위를 매깁니다.
                      예를 들어 반려동물 테스트는 &apos;활동성&apos;, &apos;초보 친화&apos; 등의 기준으로
                      어떤 동물이 가장 활발한지, 키우기 쉬운지 비교할 수 있어요!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
