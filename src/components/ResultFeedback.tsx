'use client';

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Send, CheckCircle } from 'lucide-react';
import { tursoService } from '../services/TursoService';

interface ResultFeedbackProps {
  testType: string;
  resultName: string;
}

export default function ResultFeedback({ testType, resultName }: ResultFeedbackProps) {
  const [feedback, setFeedback] = useState<'accurate' | 'inaccurate' | null>(null);
  const [comment, setComment] = useState('');
  const [showComment, setShowComment] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFeedback = async (isAccurate: boolean) => {
    const newFeedback = isAccurate ? 'accurate' : 'inaccurate';
    setFeedback(newFeedback);
    setErrorMessage(null);

    if (!isAccurate) {
      setShowComment(true);
    } else {
      // 바로 제출
      const ok = await submitFeedback(true, '');
      if (!ok) setFeedback(null);
    }
  };

  const submitFeedback = async (isAccurate: boolean, commentText: string): Promise<boolean> => {
    if (isSubmitting) return false;

    setIsSubmitting(true);
    try {
      const result = await tursoService.saveFeedback(testType, resultName, isAccurate, commentText || undefined);
      if (!result.success) {
        setErrorMessage('피드백 저장에 실패했어요. 잠시 후 다시 시도해주세요.');
        return false;
      }
      setSubmitted(true);
      return true;
    } catch (error) {
      console.error('피드백 저장 실패:', error);
      setErrorMessage('피드백 저장에 실패했어요. 잠시 후 다시 시도해주세요.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitComment = async () => {
    await submitFeedback(false, comment);
  };

  if (submitted) {
    return (
      <div className="w-full p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200/50">
        <div className="flex items-center justify-center gap-2 text-emerald-600">
          <CheckCircle className="w-5 h-5" />
          <span className="font-bold text-sm">소중한 의견 감사합니다!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200/50">
      <p className="text-sm font-bold text-slate-700 text-center mb-3">
        이 결과가 나와 맞나요?
      </p>
      {errorMessage && (
        <p className="text-xs text-rose-500 text-center mb-2">{errorMessage}</p>
      )}

      {!feedback ? (
        <div className="flex justify-center gap-3">
          <button
            onClick={() => handleFeedback(true)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border-2 border-emerald-200 text-emerald-600 font-bold text-sm hover:bg-emerald-50 hover:border-emerald-300 transition-all active:scale-95"
          >
            <ThumbsUp className="w-4 h-4" />
            맞아요
          </button>
          <button
            onClick={() => handleFeedback(false)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border-2 border-rose-200 text-rose-500 font-bold text-sm hover:bg-rose-50 hover:border-rose-300 transition-all active:scale-95"
          >
            <ThumbsDown className="w-4 h-4" />
            아니에요
          </button>
        </div>
      ) : showComment ? (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 text-center">
            어떤 부분이 맞지 않았나요? (선택사항)
          </p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="예: 저는 더 내성적인 것 같아요..."
            className="w-full p-3 rounded-lg border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
            rows={2}
          />
          <button
            onClick={handleSubmitComment}
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-lg bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-600 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              '제출 중...'
            ) : (
              <>
                <Send className="w-4 h-4" />
                의견 보내기
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 text-emerald-600">
          <CheckCircle className="w-5 h-5" />
          <span className="font-bold text-sm">감사합니다!</span>
        </div>
      )}
    </div>
  );
}
