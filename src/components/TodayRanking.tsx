'use client';

import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Users, ChevronRight, Flame, Star, BarChart3 } from 'lucide-react';
import { tursoService } from '@/services/TursoService';
import { VS_POLLS } from '@/data/content/polls';

// ============================================================================
// 타입 정의
// ============================================================================

interface PollRankingItem {
  pollId: string;
  question: string;
  category: string;
  totalVotes: number;
  topOption: {
    id: string;
    text: string;
    emoji: string;
    percentage: number;
  } | null;
}

interface ResultRankingItem {
  resultName: string;
  resultEmoji: string;
  testType: string;
  count: number;
}

interface TodayRankingProps {
  onPollClick?: (pollId: string) => void;
  className?: string;
}

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function TodayRanking({ onPollClick, className = '' }: TodayRankingProps) {
  const [activeTab, setActiveTab] = useState<'polls' | 'results'>('polls');
  const [pollRankings, setPollRankings] = useState<PollRankingItem[]>([]);
  const [resultRankings, setResultRankings] = useState<ResultRankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalParticipants, setTotalParticipants] = useState(0);

  // 데이터 로드
  useEffect(() => {
    const loadRankings = async () => {
      setLoading(true);
      try {
        // 투표 랭킹 로드
        const pollStats = await Promise.all(
          VS_POLLS.map(async (poll) => {
            const stats = await tursoService.getPollStats(poll.id);
            const topOption = stats.options.length > 0
              ? stats.options.reduce((a, b) => a.count > b.count ? a : b)
              : null;

            return {
              pollId: poll.id,
              question: poll.question,
              category: poll.category,
              totalVotes: stats.totalVotes,
              topOption: topOption ? {
                id: topOption.optionId,
                text: topOption.optionId === 'a' ? poll.optionA.text : poll.optionB.text,
                emoji: topOption.optionId === 'a' ? poll.optionA.emoji : poll.optionB.emoji,
                percentage: topOption.percentage,
              } : null,
            };
          })
        );

        // 투표수 순으로 정렬
        const sortedPolls = pollStats
          .filter(p => p.totalVotes > 0)
          .sort((a, b) => b.totalVotes - a.totalVotes)
          .slice(0, 5);

        setPollRankings(sortedPolls);

        // 전체 참여자 수 계산
        const total = pollStats.reduce((sum, p) => sum + p.totalVotes, 0);
        setTotalParticipants(total);

        // 테스트 결과 랭킹 로드 (Turso DB 기반, localStorage 폴백)
        const loadResultRankings = async () => {
          try {
            const res = await fetch('/api/ranking?type=results&limit=5');
            if (!res.ok) throw new Error('Failed to fetch rankings');
            const data = await res.json();
            setResultRankings(data.rankings || []);
          } catch {
            // DB 실패 시 localStorage 폴백
            try {
              const resultsKey = 'chemi_test_results';
              const results = JSON.parse(localStorage.getItem(resultsKey) || '[]');
              const resultCounts: Record<string, { count: number; emoji: string; testType: string }> = {};

              results.forEach((r: { result_key?: string; result_emoji?: string; test_type?: string }) => {
                const key = r.result_key;
                if (key) {
                  if (!resultCounts[key]) {
                    resultCounts[key] = { count: 0, emoji: r.result_emoji || '📊', testType: r.test_type || '' };
                  }
                  resultCounts[key].count++;
                }
              });

              const sortedResults = Object.entries(resultCounts)
                .map(([name, data]) => ({
                  resultName: name,
                  resultEmoji: data.emoji,
                  testType: data.testType,
                  count: data.count,
                }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

              setResultRankings(sortedResults);
            } catch {
              setResultRankings([]);
            }
          }
        };

        await loadResultRankings();
      } catch (error) {
        console.error('[TodayRanking] 랭킹 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRankings();
  }, []);

  // 카테고리 이름 한글화
  const getCategoryName = (category: string): string => {
    const names: Record<string, string> = {
      cat: '🐱 고양이',
      dog: '🐕 강아지',
      love: '💕 연애',
      lifestyle: '☕ 라이프',
      personality: '🧠 성격',
      plant: '🌱 식물',
      general: '💬 일반',
    };
    return names[category] || category;
  };

  // 테스트 타입 이름
  const getTestTypeName = (testType: string): string => {
    const names: Record<string, string> = {
      human: '성격',
      cat: '고양이',
      dog: '강아지',
      idealType: '이상형',
      petMatch: '반려동물',
      coffee: '커피',
      plant: '식물',
      rabbit: '토끼',
      hamster: '햄스터',
      conflictStyle: '갈등',
    };
    return names[testType] || testType;
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const hasData = pollRankings.length > 0 || resultRankings.length > 0;

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-orange-500 to-rose-500 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg">오늘의 랭킹</h2>
              <p className="text-white/80 text-xs">실시간 참여 현황</p>
            </div>
          </div>
          {totalParticipants > 0 && (
            <div className="text-right">
              <p className="text-2xl font-black">{totalParticipants}</p>
              <p className="text-xs text-white/80">총 참여</p>
            </div>
          )}
        </div>
      </div>

      {/* 탭 */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('polls')}
          className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'polls'
              ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50/50'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          투표 랭킹
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'results'
              ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50/50'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Star className="w-4 h-4" />
          결과 랭킹
        </button>
      </div>

      {/* 콘텐츠 */}
      <div className="p-4">
        {!hasData ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">아직 데이터가 없어요</p>
            <p className="text-gray-400 text-xs">투표하고 테스트해서 랭킹에 참여해보세요!</p>
          </div>
        ) : activeTab === 'polls' ? (
          // 투표 랭킹
          <div className="space-y-2">
            {pollRankings.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-sm">
                아직 투표 데이터가 없어요
              </div>
            ) : (
              pollRankings.map((poll, idx) => (
                <button
                  key={poll.pollId}
                  onClick={() => onPollClick?.(poll.pollId)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-orange-50 transition-all group"
                >
                  {/* 순위 */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    idx === 0 ? 'bg-amber-400 text-white' :
                    idx === 1 ? 'bg-gray-400 text-white' :
                    idx === 2 ? 'bg-orange-400 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {idx + 1}
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-bold text-gray-800 truncate group-hover:text-orange-600 transition-colors">
                      {poll.question}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400">{getCategoryName(poll.category)}</span>
                      {poll.topOption && (
                        <span className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded-full">
                          {poll.topOption.emoji} {poll.topOption.text} {poll.topOption.percentage}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 참여수 */}
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Users className="w-3 h-3" />
                      <span className="text-xs font-bold">{poll.totalVotes}</span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-400" />
                </button>
              ))
            )}

            {/* 더보기 힌트 */}
            {pollRankings.length > 0 && (
              <p className="text-center text-xs text-gray-400 pt-2">
                투표에 참여하면 순위가 바뀔 수 있어요! 🔥
              </p>
            )}
          </div>
        ) : (
          // 결과 랭킹
          <div className="space-y-2">
            {resultRankings.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-sm">
                아직 테스트 결과가 없어요
              </div>
            ) : (
              resultRankings.map((result, idx) => (
                <div
                  key={`${result.testType}-${result.resultName}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
                >
                  {/* 순위 */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    idx === 0 ? 'bg-amber-400 text-white' :
                    idx === 1 ? 'bg-gray-400 text-white' :
                    idx === 2 ? 'bg-orange-400 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {idx + 1}
                  </div>

                  {/* 이모지 */}
                  <span className="text-2xl">{result.resultEmoji}</span>

                  {/* 정보 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {result.resultName}
                    </p>
                    <span className="text-xs text-gray-400">
                      {getTestTypeName(result.testType)} 테스트
                    </span>
                  </div>

                  {/* 카운트 */}
                  <div className="flex items-center gap-1 text-orange-500">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-xs font-bold">{result.count}회</span>
                  </div>
                </div>
              ))
            )}

            {/* 힌트 */}
            {resultRankings.length > 0 && (
              <p className="text-center text-xs text-gray-400 pt-2">
                테스트하면 결과 랭킹에 반영돼요! ✨
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
