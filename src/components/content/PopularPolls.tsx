'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Heart, Users, Plus, ChevronRight, X, Check, Zap, MessageCircle } from 'lucide-react';
import { getDeviceId } from '@/utils/device';
import { useLike } from '@/hooks/useLike';
import CreatePollModal from './CreatePollModal';
import CommentSystem from '../CommentSystem';

interface UserPoll {
  id: string;
  question: string;
  optionA: { text: string; emoji: string };
  optionB: { text: string; emoji: string };
  category: string;
  status: string;
  createdAt: string;
  voteCount: number;
  likeCount: number;
  score?: number;
}

interface PopularPollsProps {
  className?: string;
  limit?: number;
  showCreateButton?: boolean;
}

export default function PopularPolls({
  className = '',
  limit = 5,
  showCreateButton = true,
}: PopularPollsProps) {
  const [polls, setPolls] = useState<UserPoll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState<UserPoll | null>(null);

  const loadPolls = useCallback(async () => {
    try {
      const res = await fetch(`/api/poll?action=popular&limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        setPolls(data.polls || []);
      }
    } catch (error) {
      console.error('[PopularPolls] Load error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadPolls();
  }, [loadPolls]);

  const handlePollCreated = () => {
    loadPolls(); // 새로고침
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-2xl p-4 shadow-sm border border-slate-100 ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-slate-200 rounded w-1/3" />
          <div className="h-16 bg-slate-100 rounded-xl" />
          <div className="h-16 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`bg-white rounded-2xl p-4 shadow-sm border border-slate-100 ${className}`}>
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-orange-100 to-rose-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
            </div>
            <span className="text-xs font-bold text-orange-600">인기 투표</span>
          </div>
          {showCreateButton && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1 px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-600 text-xs font-bold rounded-full transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              만들기
            </button>
          )}
        </div>

        {/* 투표 목록 */}
        {polls.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-slate-400 mb-3">아직 인기 투표가 없어요</p>
            {showCreateButton && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full"
              >
                <Plus className="w-4 h-4" />
                첫 번째 투표 만들기
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {polls.map((poll, index) => (
              <PollItem
                key={poll.id}
                poll={poll}
                rank={index + 1}
                onClick={() => setSelectedPoll(poll)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 투표 만들기 모달 */}
      <CreatePollModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handlePollCreated}
      />

      {/* 투표 상세 모달 */}
      {selectedPoll && (
        <PollDetailModal
          poll={selectedPoll}
          onClose={() => setSelectedPoll(null)}
          onVoted={loadPolls}
        />
      )}
    </>
  );
}

interface PollItemProps {
  poll: UserPoll;
  rank: number;
  onClick: () => void;
}

function PollItem({ poll, rank, onClick }: PollItemProps) {
  const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}`;

  return (
    <div
      onClick={onClick}
      className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer group"
    >
      <div className="flex items-start gap-2">
        {/* 순위 */}
        <span className="text-lg min-w-[24px] text-center">{rankEmoji}</span>

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate group-hover:text-purple-600 transition-colors">
            {poll.question}
          </p>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
            {/* 선택지 미리보기 */}
            <span className="truncate max-w-[100px]">
              {poll.optionA.emoji} {poll.optionA.text}
            </span>
            <span className="text-slate-300">vs</span>
            <span className="truncate max-w-[100px]">
              {poll.optionB.emoji} {poll.optionB.text}
            </span>
          </div>
        </div>

        {/* 통계 */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-0.5">
            <Users className="w-3 h-3" />
            {poll.voteCount}
          </span>
          <span className="flex items-center gap-0.5">
            <Heart className="w-3 h-3" />
            {poll.likeCount}
          </span>
          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );
}

// ========== 투표 상세 모달 ==========

interface PollDetailModalProps {
  poll: UserPoll;
  onClose: () => void;
  onVoted?: () => void;
}

function PollDetailModal({ poll, onClose, onVoted }: PollDetailModalProps) {
  const [selectedOption, setSelectedOption] = useState<'a' | 'b' | null>(null);
  const [results, setResults] = useState<{ a: number; b: number; total: number }>({ a: 50, b: 50, total: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const { liked, likeCount, handleLike } = useLike({ targetType: 'poll', targetId: poll.id });

  // 투표 통계 로드
  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      try {
        const statsRes = await fetch(`/api/poll?pollId=${poll.id}`);
        if (statsRes.ok && !cancelled) {
          const stats = await statsRes.json();
          if (stats.totalVotes > 0) {
            const aOpt = stats.options.find((o: { optionId: string }) => o.optionId === 'a');
            const bOpt = stats.options.find((o: { optionId: string }) => o.optionId === 'b');
            setResults({
              a: aOpt?.percentage ?? 50,
              b: bOpt?.percentage ?? 50,
              total: stats.totalVotes,
            });
          }
        }
      } catch {
        // ignore
      }
    };

    loadStats();
    return () => { cancelled = true; };
  }, [poll.id]);

  // 투표 처리
  const handleVote = async (choice: 'a' | 'b') => {
    if (selectedOption || isLoading) return;
    setIsLoading(true);
    setSelectedOption(choice);

    try {
      const res = await fetch('/api/poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: getDeviceId(),
          pollId: poll.id,
          optionId: choice,
        }),
      });

      if (res.ok) {
        // 통계 새로고침
        const statsRes = await fetch(`/api/poll?pollId=${poll.id}`);
        if (statsRes.ok) {
          const stats = await statsRes.json();
          const aOpt = stats.options.find((o: { optionId: string }) => o.optionId === 'a');
          const bOpt = stats.options.find((o: { optionId: string }) => o.optionId === 'b');
          setResults({
            a: aOpt?.percentage ?? 50,
            b: bOpt?.percentage ?? 50,
            total: stats.totalVotes,
          });
        }
        onVoted?.();
      }
    } catch (error) {
      console.error('[PollDetailModal] Vote error:', error);
      setSelectedOption(null);
    } finally {
      setIsLoading(false);
    }
  };

  const isWinner = (choice: 'a' | 'b') => {
    if (!selectedOption) return false;
    return (choice === 'a' && results.a > results.b) || (choice === 'b' && results.b > results.a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-[9px] font-black text-purple-600">VS</span>
            </div>
            <span className="text-sm font-bold text-purple-600">인기 투표</span>
            {selectedOption && (
              <span className="ml-2 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-emerald-600" />
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 본문 */}
        <div className="p-4 space-y-4">
          {/* 질문 */}
          <p className="text-base font-bold text-slate-800 leading-snug">
            {poll.question}
          </p>

          {/* 투표 옵션 */}
          <div className="flex gap-3">
            {/* Option A */}
            <button
              onClick={() => handleVote('a')}
              disabled={!!selectedOption || isLoading}
              className={`flex-1 relative overflow-hidden rounded-xl border-2 transition-all ${
                selectedOption === 'a' ? 'border-purple-400 bg-purple-50' :
                selectedOption ? 'border-slate-200 bg-slate-50' :
                'border-purple-200 bg-white hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              {selectedOption && (
                <div
                  className="absolute bottom-0 left-0 right-0 bg-purple-200/60 transition-all duration-500"
                  style={{ height: `${results.a}%` }}
                />
              )}
              <div className="relative z-10 p-4 text-center">
                <span className="text-2xl block mb-1">{poll.optionA.emoji}</span>
                <span className="text-sm font-bold text-slate-700 block">{poll.optionA.text}</span>
                {selectedOption && (
                  <div className="text-lg font-black text-purple-600 mt-1">{results.a}%</div>
                )}
              </div>
              {isWinner('a') && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-[10px]">👑</span>
                </div>
              )}
            </button>

            {/* Option B */}
            <button
              onClick={() => handleVote('b')}
              disabled={!!selectedOption || isLoading}
              className={`flex-1 relative overflow-hidden rounded-xl border-2 transition-all ${
                selectedOption === 'b' ? 'border-pink-400 bg-pink-50' :
                selectedOption ? 'border-slate-200 bg-slate-50' :
                'border-pink-200 bg-white hover:border-pink-300 hover:bg-pink-50'
              }`}
            >
              {selectedOption && (
                <div
                  className="absolute bottom-0 left-0 right-0 bg-pink-200/60 transition-all duration-500"
                  style={{ height: `${results.b}%` }}
                />
              )}
              <div className="relative z-10 p-4 text-center">
                <span className="text-2xl block mb-1">{poll.optionB.emoji}</span>
                <span className="text-sm font-bold text-slate-700 block">{poll.optionB.text}</span>
                {selectedOption && (
                  <div className="text-lg font-black text-pink-600 mt-1">{results.b}%</div>
                )}
              </div>
              {isWinner('b') && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-[10px]">👑</span>
                </div>
              )}
            </button>
          </div>

          {/* 투표 후: 액션 버튼 */}
          {selectedOption && (
            <div className="pt-3 border-t border-slate-100 space-y-3">
              {/* 참여자 수 + 좋아요 */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">
                    {results.total > 0 ? `${results.total.toLocaleString()}명 참여` : '첫 번째 투표!'}
                  </span>
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1 transition-colors ${
                      liked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-400'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
                    <span>{likeCount}</span>
                  </button>
                </div>
                <span className="flex items-center gap-1 font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                  <Zap className="w-3 h-3" />
                  +5pt
                </span>
              </div>

              {/* 댓글 버튼 */}
              <button
                onClick={() => setCommentsOpen(!commentsOpen)}
                className={`w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  commentsOpen
                    ? 'bg-slate-100 text-slate-600'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                의견 나누기
              </button>

              {/* 댓글 섹션 */}
              {commentsOpen && (
                <div className="pt-3 border-t border-slate-100">
                  <CommentSystem
                    targetType="poll"
                    targetId={poll.id}
                    placeholder="이 투표에 대한 의견을 남겨주세요..."
                    maxDisplay={3}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
