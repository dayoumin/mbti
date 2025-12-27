'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Sparkles, AlertCircle, Check } from 'lucide-react';
import { getDeviceId } from '@/utils/device';

interface CreatePollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (pollId: string) => void;
}

const CATEGORIES = [
  { id: 'cat', label: '고양이', emoji: '🐱' },
  { id: 'dog', label: '강아지', emoji: '🐶' },
  { id: 'pet', label: '반려동물', emoji: '🐾' },
  { id: 'lifestyle', label: '라이프스타일', emoji: '✨' },
  { id: 'general', label: '일반', emoji: '💬' },
];

export default function CreatePollModal({
  isOpen,
  onClose,
  onCreated,
}: CreatePollModalProps) {
  const [question, setQuestion] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [category, setCategory] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const handleSubmit = async () => {
    if (!question.trim() || !optionA.trim() || !optionB.trim()) {
      setError('모든 항목을 입력해주세요');
      return;
    }

    if (question.length < 5) {
      setError('질문은 5자 이상 입력해주세요');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          deviceId: getDeviceId(),
          question: question.trim(),
          optionA: optionA.trim(),
          optionB: optionB.trim(),
          category,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === 'CONTENT_REJECTED') {
          setError(`부적절한 내용: ${data.error}`);
        } else {
          setError(data.error || '투표 생성에 실패했습니다');
        }
        return;
      }

      setSuccess(true);
      onCreated?.(data.pollId);

      // 2초 후 닫기 (타이머 ref에 저장하여 cleanup 가능하게)
      closeTimerRef.current = setTimeout(() => {
        resetForm();
        onClose();
      }, 2000);
    } catch {
      setError('네트워크 오류가 발생했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    // 진행 중인 타이머 정리
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setQuestion('');
    setOptionA('');
    setOptionB('');
    setCategory('general');
    setError(null);
    setSuccess(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md bg-slate-50 rounded-2xl shadow-xl overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-bold text-slate-800">투표 만들기</h2>
          </div>
          <button
            onClick={() => { resetForm(); onClose(); }}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 성공 화면 */}
        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">투표가 생성되었어요!</h3>
            <p className="text-sm text-slate-500">다른 사람들의 의견을 받아보세요</p>
          </div>
        ) : (
          /* 폼 */
          <div className="p-4 space-y-4">
            {/* 카테고리 선택 */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">카테고리</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${category === cat.id
                        ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                        : 'bg-slate-100 text-slate-600 border-2 border-transparent hover:bg-slate-200'
                      }`}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 질문 */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">
                질문 <span className="text-slate-400">({question.length}/100)</span>
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value.slice(0, 100))}
                placeholder="예: 고양이 사료, 습식 vs 건식?"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400"
              />
            </div>

            {/* 선택지 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">🅰️ 선택지 A</label>
                <input
                  type="text"
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value.slice(0, 30))}
                  placeholder="습식"
                  className="w-full px-3 py-2.5 bg-purple-50 border border-purple-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">🅱️ 선택지 B</label>
                <input
                  type="text"
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value.slice(0, 30))}
                  placeholder="건식"
                  className="w-full px-3 py-2.5 bg-pink-50 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                />
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span className="text-xs text-rose-600">{error}</span>
              </div>
            )}

            {/* 안내 */}
            <p className="text-xs text-slate-400 text-center">
              부적절한 내용은 자동으로 필터링됩니다
            </p>
          </div>
        )}

        {/* 푸터 */}
        {!success && (
          <div className="p-4 pt-0">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !question.trim() || !optionA.trim() || !optionB.trim()}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? '생성 중...' : '투표 만들기'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
