'use client';

import { useState, useMemo, useEffect } from 'react';
import { CHEMI_DATA } from '@/data';
import { SubjectKey, SubjectData } from '@/data/types';
import { RANKABLE_TESTS } from '@/data/config';
import { RANKING_CATEGORIES } from '@/data/ranking-categories';
import { resultService } from '@/services/ResultService';
import {
  ChevronLeft,
  Trophy,
  Medal,
  Star,
  Sparkles,
  ChevronRight,
  BarChart3,
  Vote,
  HelpCircle,
  Flame,
  MessageCircle,
  Heart,
} from 'lucide-react';
import { VS_POLLS } from '@/data/content/polls';
import { ALL_KNOWLEDGE_QUIZZES } from '@/data/content/quizzes';
import { MOCK_COMMUNITY_POSTS } from '@/data/content/community';

// ============================================================================
// 타입 정의
// ============================================================================

interface RankingTabProps {
  onClose: () => void;
  onStartTest?: (testKey: SubjectKey) => void;
  onNavigate?: (target: 'poll' | 'quiz' | 'community') => void;
}

interface UserRanking {
  testType: SubjectKey;
  resultName: string;
  resultEmoji: string;
  rank: number;
  totalResults: number;
  categoryRanks: { category: string; rank: number; emoji: string }[];
}

// RANKING_CATEGORIES는 @/data/ranking-categories에서 import

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

  // 내 결과가 있으면 카테고리별 순위 계산
  const myRanking = myResult ? calculateMyRanking(test.key, myResult.resultName) : null;

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
            <div>
              <p className="text-xs text-emerald-600 flex items-center gap-1">
                <Star className="w-3 h-3 fill-emerald-500" />
                내 결과: {myResult.resultEmoji} {myResult.resultName}
              </p>
              {/* 카테고리별 순위 미리보기 */}
              {myRanking && myRanking.categoryRanks.length > 0 && (
                <div className="flex gap-2 mt-1">
                  {myRanking.categoryRanks.slice(0, 3).map((rank) => (
                    <span
                      key={rank.category}
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        rank.rank === 1
                          ? 'bg-amber-100 text-amber-700'
                          : rank.rank <= 3
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {rank.emoji} {rank.rank}위
                    </span>
                  ))}
                </div>
              )}
            </div>
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
  showBackButton = true,
}: {
  testType: SubjectKey;
  myResultName: string | null;
  onBack: () => void;
  onStartTest?: (testKey: SubjectKey) => void;
  showBackButton?: boolean;
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
      {/* 뒤로가기 - 모바일에서만 표시 */}
      {showBackButton && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800"
        >
          <ChevronLeft className="w-4 h-4" /> 랭킹 목록으로
        </button>
      )}

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
                  <span className="px-1.5 py-0.5 bg-amber-500 text-white text-xs font-bold rounded">
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

// ============================================================================
// 좌측 사이드바 (테스트 목록) - PC용
// ============================================================================
function RankingSidebar({
  myResults,
  selectedTest,
  onSelectTest,
  completedCount,
}: {
  myResults: Record<SubjectKey, { resultName: string; resultEmoji: string } | null>;
  selectedTest: SubjectKey | null;
  onSelectTest: (key: SubjectKey) => void;
  completedCount: number;
}) {
  return (
    <aside className="w-72 flex-shrink-0 space-y-4">
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
          {RANKABLE_TESTS.map(test => {
            const isSelected = selectedTest === test.key;
            const data = CHEMI_DATA[test.key] as SubjectData | undefined;
            const myResult = myResults[test.key];

            return (
              <button
                key={test.key}
                onClick={() => onSelectTest(test.key)}
                className={`w-full p-3 rounded-xl text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-100 border-2 border-indigo-400 shadow-md'
                    : 'bg-white border border-gray-100 hover:border-indigo-200 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{test.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm truncate ${isSelected ? 'text-indigo-700' : 'text-slate-800'}`}>
                      {data?.title.replace(' 테스트', '').replace(' 매칭', '')} 랭킹
                    </p>
                    {myResult ? (
                      <p className="text-xs text-emerald-600 flex items-center gap-1 truncate">
                        <Star className="w-3 h-3 fill-emerald-500 flex-shrink-0" />
                        {myResult.resultEmoji} {myResult.resultName}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400">테스트 후 확인</p>
                    )}
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                  )}
                </div>
              </button>
            );
          })}
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
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ============================================================================
// 우측 사이드바 (크로스 프로모션) - PC용
// ============================================================================
function RankingDiscoverySidebar({ onNavigate }: { onNavigate?: (target: string) => void }) {
  // 인기 투표 TOP 3
  const topPolls = VS_POLLS.slice(0, 3);

  // 오늘의 퀴즈 (랜덤 3개)
  const todayQuizzes = ALL_KNOWLEDGE_QUIZZES.slice(0, 3);

  // HOT 커뮤니티 글
  const hotPosts = [...MOCK_COMMUNITY_POSTS].sort((a, b) => b.likes - a.likes).slice(0, 3);

  return (
    <aside className="hidden xl:block w-72 flex-shrink-0">
      <div className="sticky top-4 space-y-4">
        {/* 인기 투표 */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-3 flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Vote className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">인기 투표</h3>
          </div>
          <div className="px-3 pb-3 space-y-2">
            {topPolls.map((poll) => (
              <button
                key={poll.id}
                onClick={() => onNavigate?.('poll')}
                className="w-full p-2.5 bg-slate-50 rounded-xl hover:bg-purple-50 transition-colors text-left group"
              >
                <p className="text-xs font-bold text-slate-700 truncate group-hover:text-purple-600">
                  {poll.question}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                  <span>{poll.optionA.emoji} vs {poll.optionB.emoji}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 오늘의 퀴즈 */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-3 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">오늘의 퀴즈</h3>
          </div>
          <div className="px-3 pb-3 space-y-2">
            {todayQuizzes.map((quiz) => (
              <button
                key={quiz.id}
                onClick={() => onNavigate?.('quiz')}
                className="w-full p-2.5 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors text-left group"
              >
                <p className="text-xs font-bold text-slate-700 line-clamp-2 group-hover:text-blue-600">
                  {quiz.question}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* HOT 커뮤니티 */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-3 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">HOT 게시물</h3>
          </div>
          <div className="px-3 pb-3 space-y-2">
            {hotPosts.map((post, index) => (
              <button
                key={post.id}
                onClick={() => onNavigate?.('community')}
                className="w-full flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl hover:bg-rose-50 transition-colors text-left group"
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                  index === 0 ? 'bg-amber-400 text-white' :
                  index === 1 ? 'bg-slate-300 text-white' :
                  'bg-orange-200 text-orange-700'
                }`}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-700 truncate group-hover:text-rose-600">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-0.5">
                      <Heart className="w-3 h-3" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <MessageCircle className="w-3 h-3" /> {post.comments}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}

// ============================================================================
// 메인 컴포넌트
// ============================================================================
export default function RankingTab({ onClose, onStartTest, onNavigate }: RankingTabProps) {
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

  // PC에서 첫 번째 테스트 자동 선택
  useEffect(() => {
    if (!selectedTest && RANKABLE_TESTS.length > 0) {
      const firstCompleted = RANKABLE_TESTS.find(t => myResults[t.key]);
      setSelectedTest(firstCompleted?.key || RANKABLE_TESTS[0].key);
    }
  }, [myResults, selectedTest]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-slate-100 to-slate-200 lg:left-60">
      {/* 헤더 */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-10">
        <div className="px-4 py-3">
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
              <p className="text-xs text-slate-500">
                {completedCount}/{RANKABLE_TESTS.length} 테스트 완료
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto pb-24 lg:pb-6">
        {/* PC 레이아웃 - lg 이상에서만 표시 */}
        <div className="hidden lg:flex gap-6 px-6 py-6 max-w-7xl mx-auto">
          <RankingSidebar
            myResults={myResults}
            selectedTest={selectedTest}
            onSelectTest={setSelectedTest}
            completedCount={completedCount}
          />
          <div className="flex-1 min-w-0">
            {selectedTest && (
              <TestRankingDetail
                testType={selectedTest}
                myResultName={myResults[selectedTest]?.resultName || null}
                onBack={() => setSelectedTest(null)}
                onStartTest={onStartTest}
                showBackButton={false}
              />
            )}
          </div>
          <RankingDiscoverySidebar onNavigate={(target) => {
            onClose();
            onNavigate?.(target as 'poll' | 'quiz' | 'community');
          }} />
        </div>

        {/* 모바일 레이아웃 */}
        <div className="lg:hidden px-4 py-4">
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
