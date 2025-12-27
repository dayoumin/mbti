'use client';

import { useState, useEffect, useRef } from 'react';
import { Trophy, BarChart3, Star, ChevronRight } from 'lucide-react';
import { useRankingData } from './ranking/hooks/useRankingData';
import { useComments } from './ranking/hooks/useComments';
import RankingHeader from './ranking/RankingHeader';
import CommentView from './ranking/CommentView';
import PollRankingTab from './ranking/PollRankingTab';
import ResultRankingTab from './ranking/ResultRankingTab';

// ============================================================================
// 타입 정의
// ============================================================================

interface TodayRankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewAllClick?: () => void;
  defaultTab?: 'polls' | 'results';
}

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function TodayRankingModal({
  isOpen,
  onClose,
  onViewAllClick,
  defaultTab = 'polls',
}: TodayRankingModalProps) {
  const [activeTab, setActiveTab] = useState<'polls' | 'results'>(defaultTab);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // 커스텀 훅 사용
  const { pollRankings, resultRankings, loading, totalParticipants, error: rankingError } = useRankingData(isOpen);

  const {
    commentView,
    comments,
    commentLoading,
    commentInput,
    setCommentInput,
    submitting,
    commentTotal,
    error: commentError,
    openCommentView,
    handleSubmitComment,
    closeCommentView,
  } = useComments((pollId, count) => {
    // 댓글 수 업데이트 콜백
    // 부모 상태는 직접 수정하지 않고, 다음 로드 시 자동 반영
  });

  // 모달이 열릴 때 defaultTab으로 초기화
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

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
      closeCommentView();
      onClose();
    }, 200);
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
          bg-slate-50 rounded-2xl shadow-2xl overflow-hidden
          max-h-[80vh] flex flex-col
          ${isClosing ? 'animate-modal-out' : 'animate-modal-in'}
        `}
      >
        {/* 헤더 */}
        <RankingHeader
          commentView={commentView}
          commentTotal={commentTotal}
          totalParticipants={totalParticipants}
          onClose={handleClose}
          onBackFromComments={closeCommentView}
        />

        {/* 댓글 뷰 */}
        {commentView ? (
          <CommentView
            comments={comments}
            commentLoading={commentLoading}
            commentInput={commentInput}
            setCommentInput={setCommentInput}
            submitting={submitting}
            error={commentError}
            onSubmit={handleSubmitComment}
          />
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
            <div className="flex-1 overflow-y-auto">
              {rankingError ? (
                <div className="text-center py-12 p-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-8 h-8 text-red-400" />
                  </div>
                  <p className="text-gray-700 text-sm font-medium mb-1">데이터를 불러올 수 없어요</p>
                  <p className="text-gray-400 text-xs mb-3">{rankingError.message}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-xs text-orange-600 hover:text-orange-700 underline"
                  >
                    새로고침
                  </button>
                </div>
              ) : loading ? (
                <div className="animate-pulse space-y-3 p-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-14 bg-gray-100 rounded-xl"></div>
                  ))}
                </div>
              ) : !hasData ? (
                <div className="text-center py-12 p-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium mb-1">아직 데이터가 없어요</p>
                  <p className="text-gray-400 text-xs">투표하고 테스트해서 랭킹에 참여해보세요!</p>
                </div>
              ) : activeTab === 'polls' ? (
                <PollRankingTab
                  pollRankings={pollRankings}
                  loading={loading}
                  onPollClick={openCommentView}
                />
              ) : (
                <ResultRankingTab
                  resultRankings={resultRankings}
                  loading={loading}
                />
              )}
            </div>

            {/* 하단 버튼 */}
            {hasData && onViewAllClick && (
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
