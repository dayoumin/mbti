'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare, MessageCircle, Heart, ChevronRight, ChevronDown,
  Flame, Users, Trophy, Sparkles, PawPrint
} from 'lucide-react';
import { getIconComponent } from '@/utils';
import { feedbackService } from '@/services/FeedbackService';
import { resultService } from '@/services/ResultService';
import { VS_POLLS } from '@/data/content/polls/vs-polls';
import { SUBJECT_CONFIG } from '@/data/config';
import { CHEMI_DATA } from '@/data/index';
import { DETAIL_TEST_KEYS } from '@/config/testKeys';
import { MOCK_COMMUNITY_PREVIEW, getCategoryLabel } from '@/data/content/community';
import type { SubjectKey, SubjectConfig, SubjectData } from '@/data/types';

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
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
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

      <div className="space-y-2.5">
        {MOCK_COMMUNITY_PREVIEW.map(post => (
          <button
            key={post.id}
            onClick={onOpenCommunity}
            className="w-full p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left group"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                post.category === 'tip' ? 'bg-emerald-50 text-emerald-600' :
                post.category === 'qna' ? 'bg-amber-50 text-amber-600' :
                'bg-pink-50 text-pink-600'
              }`}>
                {getCategoryLabel(post.category)}
              </span>
              <span className="text-[11px] text-slate-400">{post.author}</span>
            </div>
            <h4 className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors truncate">
              {post.title}
            </h4>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Heart className="w-3 h-3" /> {post.likes}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
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
            const stats = await feedbackService.getPollStats(poll.id);
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
        <div className="h-24 bg-white/50 rounded-lg"></div>
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
            <p className="text-[11px] text-orange-500 flex items-center gap-1">
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
              className="flex items-center gap-2.5 p-2.5 bg-white/60 rounded-lg"
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                index === 0 ? 'bg-amber-400 text-white' :
                index === 1 ? 'bg-slate-300 text-white' :
                'bg-orange-200 text-orange-700'
              }`}>
                {index + 1}
              </span>
              <p className="text-xs text-slate-700 font-medium truncate flex-1">
                {poll.question}
              </p>
              <span className="text-[11px] text-slate-400">{poll.totalVotes}표</span>
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
// 세부 반려동물 테스트 섹션
// ============================================================================

// petMatch 결과 → 세부 테스트 키 매핑
const PET_RESULT_TO_DETAIL_TEST: Record<string, SubjectKey[]> = {
  '강아지': ['dogBreed'],
  '고양이': ['catBreed'],
  '소동물': ['smallPet'],
  '물고기': ['fishType'],
  '새': ['birdType'],
  '파충류': ['reptileType'],
};

function DetailTestsSection({ onStartTest }: { onStartTest: (key: SubjectKey) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasPetMatchResult, setHasPetMatchResult] = useState(false);
  const [recommendedTestKeys, setRecommendedTestKeys] = useState<SubjectKey[]>([]);

  useEffect(() => {
    const checkPetMatch = async () => {
      try {
        const results = await resultService.getMyResults();
        const petMatchResult = results.find(r => r.testType === 'petMatch');
        if (petMatchResult) {
          setHasPetMatchResult(true);
          // 결과명으로 추천 테스트 키 찾기
          const recommended = PET_RESULT_TO_DETAIL_TEST[petMatchResult.resultKey] || [];
          setRecommendedTestKeys(recommended);
        }
      } catch (e) {
        console.error('Failed to check petMatch result:', e);
      }
    };
    checkPetMatch();
  }, []);

  const detailTests = DETAIL_TEST_KEYS.map(key => {
    const config = SUBJECT_CONFIG[key];
    const data = CHEMI_DATA[key];
    if (!config || !data) return null;
    return { key, config, data };
  }).filter(Boolean) as Array<{ key: SubjectKey; config: SubjectConfig; data: SubjectData }>;

  return (
    <section className="bg-amber-50/50 rounded-2xl border border-amber-100 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-amber-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
            <PawPrint className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-amber-700">반려동물 세부 추천</h3>
            <p className="text-[11px] text-amber-500">
              {hasPetMatchResult ? '추천 품종 테스트 보기' : '어떤 품종이 맞을까?'}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-amber-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-2 animate-fade-in">
          {!hasPetMatchResult && (
            <div className="p-3 bg-white rounded-xl border border-amber-200 mb-3">
              <p className="text-xs text-amber-700 mb-2">
                💡 <b>반려동물 매칭 테스트</b>를 먼저 하면 맞춤 품종을 추천받을 수 있어요!
              </p>
              <button
                onClick={() => onStartTest('petMatch')}
                className="w-full py-2.5 bg-amber-500 text-white text-xs font-bold rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" /> 반려동물 매칭 먼저 하기
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {detailTests.map(({ key, config, data }) => {
              const IconComponent = getIconComponent(config.icon);
              const isRecommended = recommendedTestKeys.includes(key);

              return (
                <button
                  key={key}
                  onClick={() => onStartTest(key)}
                  className={`p-2.5 rounded-xl text-left transition-all hover:shadow-md group ${
                    isRecommended
                      ? 'bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-amber-300'
                      : 'bg-white border border-slate-100 hover:border-amber-200'
                  }`}
                >
                  {isRecommended && (
                    <span className="text-[8px] font-bold text-amber-600 bg-amber-200 px-1.5 py-0.5 rounded-full mb-1 inline-block">
                      추천
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent mood="happy" className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-slate-700 truncate">
                        {data.title?.replace(' 추천', '') || config.label}
                      </p>
                      <p className="text-[8px] text-slate-400">
                        {data.resultLabels?.length || 0}가지
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
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
      className={`hidden xl:flex flex-col w-80 h-screen fixed right-0 top-0 bg-[#F0F2F5] overflow-y-auto no-scrollbar pt-6 px-4 pb-4 space-y-4 border-l border-slate-200/50 ${className}`}
      role="complementary"
      aria-label="사이드 정보"
    >
      {/* 커뮤니티 미리보기 */}
      <CommunityPreview onOpenCommunity={onOpenCommunity} />

      {/* 오늘의 랭킹 */}
      <RankingMini onOpenRanking={onOpenRanking} />

      {/* 세부 반려동물 테스트 */}
      <DetailTestsSection onStartTest={onStartTest} />

      {/* 하단 여백 */}
      <div className="h-4" />
    </aside>
  );
}
