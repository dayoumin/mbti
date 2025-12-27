'use client';

import { X, Flame, ArrowLeft } from 'lucide-react';
import { CommentView } from './hooks/useComments';

interface RankingHeaderProps {
  commentView: CommentView | null;
  commentTotal: number;
  totalParticipants: number;
  onClose: () => void;
  onBackFromComments: () => void;
}

export default function RankingHeader({
  commentView,
  commentTotal,
  totalParticipants,
  onClose,
  onBackFromComments,
}: RankingHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-rose-500 p-4 text-white flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {commentView ? (
            // 댓글 뷰 헤더
            <>
              <button
                onClick={onBackFromComments}
                className="w-10 h-10 bg-slate-50/20 rounded-xl flex items-center justify-center hover:bg-slate-50/30 transition-colors"
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
              <div className="w-10 h-10 bg-slate-50/20 rounded-xl flex items-center justify-center">
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
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-50/20 hover:bg-slate-50/30 flex items-center justify-center transition-colors"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
