'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Trophy, TrendingUp, Users, ChevronRight, Flame, Star, BarChart3, MessageCircle, Send, ArrowLeft } from 'lucide-react';
import { tursoService } from '@/services/TursoService';
import { VS_POLLS } from '@/data/content/polls';
import { getDeviceId } from '@/utils/device';
import { formatRelativeTime } from '@/utils/format';

// ============================================================================
// 댓글 관련 타입 및 헬퍼
// ============================================================================

interface Comment {
  id: number;
  authorId: string;  // 해시화된 익명 ID
  isOwner: boolean;  // 본인 댓글 여부
  content: string;
  likes: number;
  createdAt: string;
}

async function getCommentCount(targetType: string, targetId: string): Promise<number> {
  try {
    const res = await fetch(`/api/comments?targetType=${targetType}&targetId=${targetId}&limit=1`);
    if (!res.ok) return 0;
    const data = await res.json();
    return data.total || 0;
  } catch {
    return 0;
  }
}

async function getComments(targetType: string, targetId: string, limit = 20, offset = 0): Promise<{ comments: Comment[]; total: number; hasMore: boolean }> {
  try {
    const deviceId = getDeviceId();
    const res = await fetch(`/api/comments?targetType=${targetType}&targetId=${targetId}&limit=${limit}&offset=${offset}&deviceId=${deviceId}`);
    if (!res.ok) return { comments: [], total: 0, hasMore: false };
    return await res.json();
  } catch {
    return { comments: [], total: 0, hasMore: false };
  }
}

async function postComment(targetType: string, targetId: string, content: string): Promise<boolean> {
  try {
    const deviceId = getDeviceId();
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, targetType, targetId, content }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

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
  commentCount: number;
}

interface ResultRankingItem {
  resultName: string;
  resultEmoji: string;
  testType: string;
  count: number;
}

interface TodayRankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPollClick?: (pollId: string) => void;
  onViewAllClick?: () => void;
  defaultTab?: 'polls' | 'results';
}

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function TodayRankingModal({
  isOpen,
  onClose,
  onPollClick,
  onViewAllClick,
  defaultTab = 'polls',
}: TodayRankingModalProps) {
  const [activeTab, setActiveTab] = useState<'polls' | 'results'>(defaultTab);
  const [pollRankings, setPollRankings] = useState<PollRankingItem[]>([]);
  const [resultRankings, setResultRankings] = useState<ResultRankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // 댓글 뷰 상태
  const [commentView, setCommentView] = useState<{ pollId: string; question: string } | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentTotal, setCommentTotal] = useState(0);

  // 모달이 열릴 때 defaultTab으로 초기화
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  // 데이터 로드
  useEffect(() => {
    if (!isOpen) return;

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

            // 댓글 수 로드
            const commentCount = await getCommentCount('poll', poll.id);

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
              commentCount,
            };
          })
        );

        // 투표수 순으로 정렬
        const sortedPolls = pollStats
          .filter(p => p.totalVotes > 0)
          .sort((a, b) => b.totalVotes - a.totalVotes)
          .slice(0, 10); // 모달에서는 10개까지

        setPollRankings(sortedPolls);

        // 전체 참여자 수 계산
        const total = pollStats.reduce((sum, p) => sum + p.totalVotes, 0);
        setTotalParticipants(total);

        // 테스트 결과 랭킹 로드 (Turso DB 기반)
        const loadResultRankings = async () => {
          try {
            const res = await fetch('/api/ranking?type=results&limit=10');
            if (!res.ok) throw new Error('Failed to fetch rankings');
            const data = await res.json();

            setResultRankings(data.rankings || []);
          } catch (error) {
            console.error('[TodayRankingModal] 결과 랭킹 로드 실패:', error);
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
                .slice(0, 10);

              setResultRankings(sortedResults);
            } catch {
              setResultRankings([]);
            }
          }
        };

        await loadResultRankings();
      } catch (error) {
        console.error('[TodayRankingModal] 랭킹 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRankings();
  }, [isOpen]);

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // 모달 열릴 때 포커스
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // 닫기 (애니메이션 포함)
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setCommentView(null);
      setComments([]);
      setCommentInput('');
      onClose();
    }, 200);
  };

  // 댓글 보기 열기
  const openCommentView = async (pollId: string, question: string) => {
    setCommentView({ pollId, question });
    setCommentLoading(true);
    try {
      const data = await getComments('poll', pollId);
      setComments(data.comments);
      setCommentTotal(data.total);
    } catch {
      setComments([]);
    } finally {
      setCommentLoading(false);
    }
  };

  // 댓글 제출
  const handleSubmitComment = async () => {
    if (!commentView || !commentInput.trim() || submitting) return;

    setSubmitting(true);
    try {
      const success = await postComment('poll', commentView.pollId, commentInput.trim());
      if (success) {
        // 댓글 목록 새로고침
        const data = await getComments('poll', commentView.pollId);
        setComments(data.comments);
        setCommentTotal(data.total);
        setCommentInput('');

        // 랭킹의 댓글 수도 업데이트
        setPollRankings(prev => prev.map(p =>
          p.pollId === commentView.pollId
            ? { ...p, commentCount: data.total }
            : p
        ));
      }
    } catch (error) {
      console.error('[TodayRankingModal] 댓글 작성 실패:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // 댓글 뷰에서 뒤로가기
  const closeCommentView = () => {
    setCommentView(null);
    setComments([]);
    setCommentInput('');
  };

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

  if (!isOpen) return null;

  const hasData = pollRankings.length > 0 || resultRankings.length > 0;

  return (
    <>
      {/* 오버레이 */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-200 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* 모달 */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="오늘의 랭킹"
        tabIndex={-1}
        className={`fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto z-50
          bg-white rounded-2xl shadow-2xl overflow-hidden
          max-h-[80vh] flex flex-col
          ${isClosing ? 'animate-modal-out' : 'animate-modal-in'}
        `}
      >
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-orange-500 to-rose-500 p-4 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {commentView ? (
                // 댓글 뷰 헤더
                <>
                  <button
                    onClick={closeCommentView}
                    className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="min-w-0">
                    <h2 className="font-bold text-lg truncate">
                      댓글 {commentTotal > 0 && <span className="text-sm font-normal">({commentTotal})</span>}
                    </h2>
                    <p className="text-white/80 text-xs truncate">{commentView.question}</p>
                  </div>
                </>
              ) : (
                // 일반 헤더
                <>
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">오늘의 랭킹</h2>
                    <p className="text-white/80 text-xs">실시간 참여 현황</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              {!commentView && totalParticipants > 0 && (
                <div className="text-right">
                  <p className="text-2xl font-black">{totalParticipants}</p>
                  <p className="text-xs text-white/80">총 참여</p>
                </div>
              )}
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                aria-label="닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 댓글 뷰 */}
        {commentView ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* 댓글 목록 */}
            <div className="flex-1 overflow-y-auto p-4">
              {commentLoading ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
                  ))}
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium mb-1">아직 댓글이 없어요</p>
                  <p className="text-gray-400 text-xs">첫 번째 댓글을 남겨보세요!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">
                          익명#{comment.authorId.slice(0, 4)}{comment.isOwner && ' (나)'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatRelativeTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 댓글 입력 */}
            <div className="p-4 border-t border-gray-100 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitComment();
                    }
                  }}
                  placeholder="댓글을 입력하세요..."
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  disabled={submitting}
                  maxLength={500}
                />
                <button
                  onClick={handleSubmitComment}
                  disabled={!commentInput.trim() || submitting}
                  className="w-10 h-10 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl flex items-center justify-center hover:from-orange-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1 text-right">
                {commentInput.length}/500
              </p>
            </div>
          </div>
        ) : (
          <>
        {/* 탭 */}
        <div className="flex border-b border-gray-100 flex-shrink-0">
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
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-14 bg-gray-100 rounded-xl"></div>
              ))}
            </div>
          ) : !hasData ? (
            <div className="text-center py-12">
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
                <div className="text-center py-8 text-gray-400 text-sm">
                  아직 투표 데이터가 없어요
                </div>
              ) : (
                pollRankings.map((poll, idx) => (
                  <div
                    key={poll.pollId}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-orange-50 transition-all group"
                  >
                    {/* 순위 */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
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
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs text-gray-400">{getCategoryName(poll.category)}</span>
                        {poll.topOption && (
                          <span className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded-full">
                            {poll.topOption.emoji} {poll.topOption.text} {poll.topOption.percentage}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 참여수 */}
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Users className="w-3 h-3" />
                        <span className="text-xs font-bold">{poll.totalVotes}</span>
                      </div>
                    </div>

                    {/* 댓글 버튼 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openCommentView(poll.pollId, poll.question);
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-200 hover:bg-orange-200 text-gray-600 hover:text-orange-600 transition-colors flex-shrink-0"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span className="text-xs font-medium">{poll.commentCount || 0}</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            // 결과 랭킹
            <div className="space-y-2">
              {resultRankings.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  아직 테스트 결과가 없어요
                </div>
              ) : (
                resultRankings.map((result, idx) => (
                  <div
                    key={`${result.testType}-${result.resultName}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
                  >
                    {/* 순위 */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      idx === 0 ? 'bg-amber-400 text-white' :
                      idx === 1 ? 'bg-gray-400 text-white' :
                      idx === 2 ? 'bg-orange-400 text-white' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {idx + 1}
                    </div>

                    {/* 이모지 */}
                    <span className="text-2xl flex-shrink-0">{result.resultEmoji}</span>

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
                    <div className="flex items-center gap-1 text-orange-500 flex-shrink-0">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs font-bold">{result.count}회</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        {hasData && onViewAllClick && !commentView && (
          <div className="p-4 border-t border-gray-100 flex-shrink-0">
            <button
              onClick={() => {
                onViewAllClick();
                handleClose();
              }}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-sm font-bold rounded-xl hover:from-orange-600 hover:to-rose-600 transition-all flex items-center justify-center gap-1.5"
            >
              전체 랭킹 보기
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes modal-in {
          from {
            opacity: 0;
            transform: translate(-50%, -48%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes modal-out {
          from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -48%) scale(0.95);
          }
        }

        .animate-modal-in {
          animation: modal-in 0.2s ease-out forwards;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .animate-modal-out {
          animation: modal-out 0.2s ease-in forwards;
          left: 50%;
        }
      `}</style>
    </>
  );
}
