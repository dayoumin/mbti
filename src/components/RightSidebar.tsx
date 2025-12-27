'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare, MessageCircle, Heart, ChevronRight,
  Flame, Users, Trophy, Crown, Medal, BarChart2, TrendingUp
} from 'lucide-react';
import { tursoService } from '@/services/TursoService';
import { VS_POLLS } from '@/data/content/polls';
import { SUBJECT_CONFIG, MAIN_TEST_KEYS } from '@/data/config';
import { MOCK_COMMUNITY_PREVIEW, getPostCategoryLabel, getPostCategoryStyle } from '@/data/content/community';
import type { SubjectKey } from '@/data/types';

// ============================================================================
// 타입 정의
// ============================================================================

interface RightSidebarProps {
  onOpenCommunity: () => void;
  onOpenRanking: () => void;
  onStartTest: (testKey: SubjectKey) => void;
  className?: string;
}

interface TopPollItem {
  pollId: string;
  question: string;
  totalVotes: number;
}

// ============================================================================
// 커뮤니티 미리보기 섹션
// ============================================================================

function CommunityPreview({ onOpenCommunity }: { onOpenCommunity: () => void }) {
  return (
    <section className="bg-slate-50 rounded-2xl border border-subtle shadow-sm overflow-hidden">
      {/* 헤더 - 히어로 배너와 동일한 스타일 */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-pink-600" />
          </div>
          <h3 className="text-base font-bold text-slate-800">커뮤니티</h3>
        </div>
        <button
          onClick={onOpenCommunity}
          className="text-xs font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-0.5 transition-colors"
        >
          전체보기 <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 게시물 목록 */}
      <div className="px-3 pb-3 space-y-2">
        {MOCK_COMMUNITY_PREVIEW.map(post => (
          <button
            key={post.id}
            onClick={onOpenCommunity}
            className="w-full p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left group"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getPostCategoryStyle(post.category)}`}>
                {getPostCategoryLabel(post.category)}
              </span>
              <span className="text-xs text-slate-400">{post.author}</span>
            </div>
            <h4 className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors truncate">
              {post.title}
            </h4>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Heart className="w-3 h-3" /> {post.likes}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <MessageCircle className="w-3 h-3" /> {post.comments}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// 오늘의 랭킹 미니 섹션
// ============================================================================

function RankingMini({ onOpenRanking }: { onOpenRanking: () => void }) {
  const [topPolls, setTopPolls] = useState<TopPollItem[]>([]);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopPolls = async () => {
      try {
        const pollStats = await Promise.all(
          VS_POLLS.slice(0, 5).map(async (poll) => {
            const stats = await tursoService.getPollStats(poll.id);
            return {
              pollId: poll.id,
              question: poll.question,
              totalVotes: stats.totalVotes,
            };
          })
        );

        const sorted = pollStats
          .filter(p => p.totalVotes > 0)
          .sort((a, b) => b.totalVotes - a.totalVotes);

        setTopPolls(sorted.slice(0, 3));
        setTotalParticipants(pollStats.reduce((sum, p) => sum + p.totalVotes, 0));
      } catch (error) {
        console.error('[RankingMini] 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTopPolls();
  }, []);

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-2xl border border-orange-100 p-4 animate-pulse">
        <div className="h-24 bg-slate-50/50 rounded-lg"></div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-2xl border border-orange-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-rose-500 rounded-lg flex items-center justify-center shadow-sm">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-orange-700">오늘의 랭킹</h3>
            <p className="text-xs text-orange-500 flex items-center gap-1">
              <Users className="w-3 h-3" /> {totalParticipants.toLocaleString()}명 참여
            </p>
          </div>
        </div>
        <button
          onClick={onOpenRanking}
          className="text-xs font-bold text-orange-400 hover:text-orange-600 flex items-center gap-0.5 transition-colors"
        >
          더보기 <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {topPolls.length > 0 ? (
          topPolls.map((poll, index) => (
            <div
              key={poll.pollId}
              className="flex items-center gap-2.5 p-2.5 bg-slate-50/60 rounded-lg"
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${index === 0 ? 'bg-amber-400 text-white' :
                  index === 1 ? 'bg-slate-300 text-white' :
                    'bg-orange-200 text-orange-700'
                }`}>
                {index + 1}
              </span>
              <p className="text-xs text-slate-700 font-medium truncate flex-1">
                {poll.question}
              </p>
              <span className="text-xs text-slate-400">{poll.totalVotes}표</span>
            </div>
          ))
        ) : (
          <div className="py-4 text-center text-xs text-orange-400">
            아직 투표 데이터가 없어요
          </div>
        )}
      </div>

      <button
        onClick={onOpenRanking}
        className="w-full mt-4 py-2.5 bg-gradient-to-r from-orange-400 to-rose-400 text-white text-xs font-bold rounded-xl hover:from-orange-500 hover:to-rose-500 transition-all flex items-center justify-center gap-1.5"
      >
        <Trophy className="w-4 h-4" /> 전체 랭킹 보기
      </button>
    </section>
  );
}

// ============================================================================
// 테스트 결과 랭킹 미니 섹션 (자동 집계)
// ============================================================================

// 랭킹 가능한 매칭 테스트 (결과가 다양한 것들)
const RANKABLE_MATCHING_TESTS: SubjectKey[] = MAIN_TEST_KEYS.filter(key => {
  const config = SUBJECT_CONFIG[key];
  return config.testType === 'matching' || ['human', 'cat', 'dog'].includes(key);
});

interface RankingResultItem {
  resultName: string;
  resultEmoji: string;
  count: number;
  percentage: number;
}

function TestResultRankingMini({ onOpenRanking }: { onOpenRanking: () => void }) {
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [rankings, setRankings] = useState<RankingResultItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const currentTest = RANKABLE_MATCHING_TESTS[currentTestIndex];
  const testConfig = SUBJECT_CONFIG[currentTest];

  // 다음 테스트로 순환
  const nextTest = useCallback(() => {
    setCurrentTestIndex(prev => (prev + 1) % RANKABLE_MATCHING_TESTS.length);
  }, []);

  // 랭킹 로드
  const loadRanking = useCallback(async () => {
    if (!currentTest) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/ranking?type=results&testType=${currentTest}&limit=3`);
      if (res.ok) {
        const data = await res.json();
        setRankings(data.rankings || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error('[TestResultRankingMini] Load error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentTest]);

  useEffect(() => {
    loadRanking();
  }, [loadRanking]);

  // 5초마다 자동 순환
  useEffect(() => {
    const interval = setInterval(nextTest, 8000);
    return () => clearInterval(interval);
  }, [nextTest]);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="w-4 h-4 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-slate-400" />;
    if (rank === 3) return <Medal className="w-4 h-4 text-amber-600" />;
    return null;
  };

  if (!testConfig) return null;

  return (
    <section className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-sm">
            <BarChart2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-purple-700">테스트 결과 랭킹</h3>
            <p className="text-xs text-purple-500 flex items-center gap-1">
              <span>{testConfig.emoji}</span> {testConfig.label}
            </p>
          </div>
        </div>
        <button
          onClick={onOpenRanking}
          className="text-xs font-bold text-purple-400 hover:text-purple-600 flex items-center gap-0.5 transition-colors"
        >
          더보기 <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-10 bg-slate-50/50 rounded-lg" />
          <div className="h-10 bg-slate-50/50 rounded-lg" />
          <div className="h-10 bg-slate-50/50 rounded-lg" />
        </div>
      ) : rankings.length > 0 ? (
        <div className="space-y-2">
          {rankings.map((item, index) => (
            <div
              key={`${currentTest}-${item.resultName}`}
              className="flex items-center gap-2 p-2.5 bg-slate-50/70 rounded-lg"
            >
              <span className="w-6 flex justify-center">{getRankBadge(index + 1)}</span>
              <span className="text-lg">{item.resultEmoji}</span>
              <span className="flex-1 text-xs font-bold text-slate-700 truncate">{item.resultName}</span>
              <span className="text-xs font-bold text-purple-600">{item.percentage}%</span>
            </div>
          ))}
          <p className="text-xs text-purple-400 text-center mt-2">
            {total.toLocaleString()}명 참여
          </p>
        </div>
      ) : (
        <div className="py-4 text-center text-xs text-purple-400">
          아직 결과 데이터가 없어요
        </div>
      )}

      {/* 테스트 인디케이터 */}
      <div className="flex justify-center gap-1 mt-3">
        {RANKABLE_MATCHING_TESTS.slice(0, 5).map((key, idx) => (
          <button
            key={key}
            onClick={() => setCurrentTestIndex(idx)}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentTestIndex ? 'bg-purple-500' : 'bg-purple-200'
              }`}
            aria-label={SUBJECT_CONFIG[key]?.label || key}
          />
        ))}
        {RANKABLE_MATCHING_TESTS.length > 5 && (
          <span className="text-xs text-purple-300 ml-1">+{RANKABLE_MATCHING_TESTS.length - 5}</span>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// 인기 테스트 TOP 3 섹션 (전체 통계 기반)
// ============================================================================

interface PopularTestItem {
  testType: string;
  count: number;
  emoji: string;
  label: string;
}

function PopularTestsSection({ onStartTest }: { onStartTest: (key: SubjectKey) => void }) {
  const [popularTests, setPopularTests] = useState<PopularTestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPopularTests = async () => {
      try {
        const res = await fetch('/api/ranking?type=popular-tests&limit=3');
        if (res.ok) {
          const data = await res.json();
          const tests = (data.popularTests || []).map((t: { testType: string; count: number }) => {
            const config = SUBJECT_CONFIG[t.testType as SubjectKey];
            return {
              testType: t.testType,
              count: t.count,
              emoji: config?.emoji || '📋',
              label: config?.label || t.testType,
            };
          });
          setPopularTests(tests.slice(0, 3));
        }
      } catch (error) {
        console.error('[PopularTestsSection] Load error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPopularTests();
  }, []);

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-4 animate-pulse">
        <div className="h-24 bg-slate-50/50 rounded-lg"></div>
      </section>
    );
  }

  if (popularTests.length === 0) return null;

  return (
    <section className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-sm">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-emerald-700">지금 인기 테스트</h3>
          <p className="text-xs text-emerald-500">다른 사람들이 많이 하는 테스트</p>
        </div>
      </div>

      <div className="space-y-2">
        {popularTests.map((test, index) => (
          <button
            key={test.testType}
            onClick={() => onStartTest(test.testType as SubjectKey)}
            className="w-full flex items-center gap-2.5 p-2.5 bg-white/70 rounded-lg hover:bg-white transition-colors group"
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
              index === 0 ? 'bg-emerald-500 text-white' :
              index === 1 ? 'bg-emerald-300 text-emerald-800' :
              'bg-emerald-100 text-emerald-600'
            }`}>
              {index + 1}
            </span>
            <span className="text-lg">{test.emoji}</span>
            <span className="flex-1 text-xs font-bold text-slate-700 truncate group-hover:text-emerald-600 transition-colors">
              {test.label}
            </span>
            <span className="text-xs text-slate-400">{test.count.toLocaleString()}명</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
          </button>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function RightSidebar({
  onOpenCommunity,
  onOpenRanking,
  onStartTest,
  className = ''
}: RightSidebarProps) {
  return (
    <aside
      className={`hidden xl:flex flex-col w-80 h-screen fixed right-0 top-0 p-4 z-40 ${className}`}
      role="complementary"
      aria-label="사이드 정보"
    >
      <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
        {/* 테스트 결과 랭킹 (자동 집계) - 맨 위 */}
        <TestResultRankingMini onOpenRanking={onOpenRanking} />

        {/* VS 투표 랭킹 */}
        <RankingMini onOpenRanking={onOpenRanking} />

        {/* 커뮤니티 미리보기 */}
        <CommunityPreview onOpenCommunity={onOpenCommunity} />

        {/* 인기 테스트 TOP 3 (전체 통계 기반) */}
        <PopularTestsSection onStartTest={onStartTest} />

        {/* 하단 여백 */}
        <div className="h-4" />
      </div>
    </aside>
  );
}
