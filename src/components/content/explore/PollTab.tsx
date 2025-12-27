'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Vote, CheckCircle, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { VSPoll } from '@/data/content/types';
import { getCategoryInfo } from '@/data/content/categories';
import { nextActionService, type NextAction } from '@/services/NextActionService';
import { NextActionInline } from '@/components/NextActionCard';
import CommentSystem from '@/components/CommentSystem';
import { contentRecommendationService } from '@/services/ContentRecommendationService';
import { RelatedContentSection, type RelatedItem } from '@/components/content/RelatedContentSection';

interface PollCardProps {
  poll: VSPoll;
  isVoted: boolean;
  previousVote?: 'a' | 'b';
  onVote: (pollId: string, choice: 'a' | 'b') => void;
  onNextAction?: (action: NextAction) => void;
  allPolls?: VSPoll[];
  votedPollIds?: string[];
}

export function PollCard({ poll, isVoted, previousVote, onVote, onNextAction, allPolls = [], votedPollIds = [] }: PollCardProps) {
  const [localVoted, setLocalVoted] = useState<'a' | 'b' | null>(null);
  const [showComments, setShowComments] = useState(false);
  // total: null=로딩중, -1=API실패, 0=첫투표, >0=실제통계
  const [realStats, setRealStats] = useState<{ a: number; b: number; total: number } | null>(null);
  const voted = previousVote ?? localVoted;
  // API 실패(-1) 또는 0표 시 균등 분포 표시 (가짜 통계 방지)
  const hasRealVotes = realStats && realStats.total > 0;
  const results = hasRealVotes ? { a: realStats.a, b: realStats.b } : { a: 50, b: 50 };

  // 투표 후 실제 통계 가져오기
  useEffect(() => {
    if (!voted || realStats) return;

    const controller = new AbortController();

    fetch(`/api/poll?pollId=${poll.id}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        // totalVotes가 0 이상이면 통계 표시 (0표도 유효한 상태)
        if (typeof data.totalVotes === 'number') {
          const aOpt = data.options?.find((o: { optionId: string }) => o.optionId === 'a');
          const bOpt = data.options?.find((o: { optionId: string }) => o.optionId === 'b');
          setRealStats({
            a: aOpt?.percentage ?? 50,
            b: bOpt?.percentage ?? 50,
            total: data.totalVotes,
          });
        } else {
          // API 응답이 비정상인 경우
          setRealStats({ a: 50, b: 50, total: -1 });
        }
      })
      .catch((error) => {
        // AbortError는 정상적인 cleanup이므로 무시
        if (error.name === 'AbortError') return;
        // API 실패 시 명시적으로 실패 상태 설정
        setRealStats({ a: 50, b: 50, total: -1 });
      });

    return () => controller.abort();
  }, [voted, poll.id, realStats]);

  // 다음 액션 추천
  const nextActions = voted
    ? nextActionService.getRecommendations({
      endpoint: 'poll_result',
      category: poll.category,
    }).slice(0, 2)
    : [];

  // 관련 투표 추천 (태그 기반, 미참여 우선) - RelatedItem 형식으로 변환
  const relatedPollItems = useMemo((): RelatedItem[] => {
    if (!voted || allPolls.length === 0) return [];
    const similar = contentRecommendationService.getSimilarPolls(poll, allPolls, 6);
    return similar
      .filter(s => !votedPollIds.includes(s.content.id))
      .slice(0, 3)
      .map(s => ({
        id: s.content.id,
        title: s.content.question,
        category: s.content.category,
        reason: s.reason,
      }));
  }, [voted, poll, allPolls, votedPollIds]);

  // 관련 투표 클릭 시 스크롤 이동
  const handlePollSelect = useCallback((pollId: string) => {
    const element = document.getElementById(`poll-${pollId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-purple-400');
      setTimeout(() => element.classList.remove('ring-2', 'ring-purple-400'), 2000);
    }
  }, []);

  const handleVote = (choice: 'a' | 'b') => {
    if (voted) return;
    setLocalVoted(choice);
    onVote(poll.id, choice);
  };

  const categoryInfo = getCategoryInfo(poll.category);

  return (
    <div className="bg-slate-50 rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <Vote className="w-4 h-4 text-purple-500" />
        <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
          {categoryInfo.emoji} {categoryInfo.name}
        </span>
        {(isVoted || voted) && (
          <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full ml-auto flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> 투표완료
          </span>
        )}
      </div>

      <p className="text-sm font-bold text-slate-700 mb-4 text-center">{poll.question}</p>

      <div className="flex gap-3" role="group" aria-label="투표 선택지">
        {/* Option A */}
        <button
          onClick={() => handleVote('a')}
          disabled={!!voted}
          aria-label={`${poll.optionA.text}${voted === 'a' ? ' (선택됨)' : ''}`}
          aria-pressed={voted === 'a'}
          aria-disabled={!!voted}
          className={`flex-1 relative overflow-hidden rounded-xl border-2 transition-all ${voted === 'a' ? 'border-purple-400 bg-purple-50' :
            voted ? 'border-gray-200 bg-gray-50' :
              'border-purple-200 bg-slate-50 hover:border-purple-300 hover:bg-purple-50'
            }`}
        >
          <div className="p-3 text-center relative z-10">
            <span className="text-2xl block mb-1">{poll.optionA.emoji}</span>
            <span className="text-xs font-bold text-slate-700">{poll.optionA.text}</span>
            {voted && (
              <div className="mt-2 text-lg font-black text-purple-600">{results.a}%</div>
            )}
          </div>
          {voted && (
            <div
              className="absolute bottom-0 left-0 right-0 bg-purple-200/50 transition-all duration-500"
              style={{ height: `${results.a}%` }}
            />
          )}
        </button>

        {/* VS */}
        <div className="flex items-center">
          <span className="text-xs font-black text-slate-400">VS</span>
        </div>

        {/* Option B */}
        <button
          onClick={() => handleVote('b')}
          disabled={!!voted}
          aria-label={`${poll.optionB.text}${voted === 'b' ? ' (선택됨)' : ''}`}
          aria-pressed={voted === 'b'}
          aria-disabled={!!voted}
          className={`flex-1 relative overflow-hidden rounded-xl border-2 transition-all ${voted === 'b' ? 'border-pink-400 bg-pink-50' :
            voted ? 'border-gray-200 bg-gray-50' :
              'border-pink-200 bg-slate-50 hover:border-pink-300 hover:bg-pink-50'
            }`}
        >
          <div className="p-3 text-center relative z-10">
            <span className="text-2xl block mb-1">{poll.optionB.emoji}</span>
            <span className="text-xs font-bold text-slate-700">{poll.optionB.text}</span>
            {voted && (
              <div className="mt-2 text-lg font-black text-pink-600">{results.b}%</div>
            )}
          </div>
          {voted && (
            <div
              className="absolute bottom-0 left-0 right-0 bg-pink-200/50 transition-all duration-500"
              style={{ height: `${results.b}%` }}
            />
          )}
        </button>
      </div>

      {/* 참여자 수 표시 */}
      {voted && (
        <div className="mt-3 text-center">
          <span className="text-xs text-slate-400">
            {hasRealVotes
              ? `${realStats.total.toLocaleString()}명 참여`
              : realStats?.total === 0
                ? '첫 번째 투표입니다! 🎉'
                : realStats?.total === -1
                  ? '투표가 기록되었습니다'
                  : '통계 로딩 중...'}
          </span>
        </div>
      )}

      {/* 다음 액션 추천 */}
      {voted && nextActions.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <NextActionInline actions={nextActions} onActionClick={onNextAction} />
        </div>
      )}

      {/* 관련 투표 더보기 */}
      {voted && (
        <RelatedContentSection
          items={relatedPollItems}
          onSelect={handlePollSelect}
          contentType="poll"
        />
      )}

      {/* 댓글 토글 버튼 */}
      {voted && (
        <button
          onClick={() => setShowComments(!showComments)}
          className="w-full mt-3 py-2 flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-slate-700 border-t border-gray-100 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>댓글</span>
          {showComments ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      )}

      {/* 댓글 섹션 */}
      {voted && showComments && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <CommentSystem
            targetType="poll"
            targetId={poll.id}
            placeholder="이 투표에 대한 의견을 남겨보세요..."
            maxDisplay={3}
          />
        </div>
      )}
    </div>
  );
}

interface PollTabProps {
  polls: VSPoll[];
  votedPollIds: string[];
  onVote: (pollId: string, choice: 'a' | 'b') => void;
  onNextAction?: (action: NextAction) => void;
}

export default function PollTab({ polls, votedPollIds, onVote, onNextAction }: PollTabProps) {
  return (
    <>
      {polls.length > 0 ? (
        polls.map((poll) => {
          const voted = votedPollIds.includes(poll.id);
          return (
            <div key={poll.id} id={`poll-${poll.id}`}>
              <PollCard
                poll={poll}
                isVoted={voted}
                onVote={onVote}
                onNextAction={onNextAction}
                allPolls={polls}
                votedPollIds={votedPollIds}
              />
            </div>
          );
        })
      ) : (
        <div className="text-center py-12 text-gray-400">
          <p>이 카테고리에 투표가 없습니다</p>
        </div>
      )}
    </>
  );
}
