'use client';

/**
 * SituationReactionCard - 상황별 반응 투표 카드
 *
 * "이럴 때 나는?" 형식의 상황별 투표
 * - 상황 설명 + 4개 선택지
 * - 투표 후 통계 표시
 * - 관련 상황 더보기 (RelatedContentSection 사용)
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { MessageCircle, ChevronDown, ChevronUp, Users } from 'lucide-react';
import type { SituationReaction, SituationCategory } from '@/data/content/types';
import { SITUATION_CATEGORY_LABELS } from '@/data/content/situation-reactions';
import { contentRecommendationService } from '@/services/ContentRecommendationService';
import { RelatedContentSection, type RelatedItem } from './RelatedContentSection';
import CommentSystem from '@/components/CommentSystem';

// ============================================================================
// 타입 정의
// ============================================================================

interface SituationReactionCardProps {
  situation: SituationReaction;
  isAnswered: boolean;
  previousAnswer?: string;
  onAnswer: (situationId: string, optionId: string) => void;
  allSituations?: SituationReaction[];
  answeredSituationIds?: string[];
}

// ============================================================================
// 컴포넌트
// ============================================================================

export function SituationReactionCard({
  situation,
  isAnswered,
  previousAnswer,
  onAnswer,
  allSituations = [],
  answeredSituationIds = [],
}: SituationReactionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(previousAnswer || null);
  const [showResult, setShowResult] = useState(isAnswered);
  const [showComments, setShowComments] = useState(false);
  const [stats, setStats] = useState<Record<string, number> | null>(null);

  // prop 변경 시 동기화 (참여 기록이 나중에 로드될 때)
  useEffect(() => {
    if (isAnswered && previousAnswer) {
      setSelectedOption(previousAnswer);
      setShowResult(true);
      // 통계도 초기화
      const equalShare = Math.floor(100 / situation.options.length);
      const mockStats: Record<string, number> = {};
      situation.options.forEach((opt, i) => {
        mockStats[opt.id] = i === 0 ? 100 - (equalShare * (situation.options.length - 1)) : equalShare;
      });
      setStats(mockStats);
    }
  }, [isAnswered, previousAnswer, situation.options]);

  // 카테고리 정보
  const categoryInfo = SITUATION_CATEGORY_LABELS[situation.category] || {
    name: situation.category,
    emoji: '🤔',
    desc: '',
  };

  // 관련 상황 추천 - RelatedItem 형식으로 변환
  const relatedSituationItems = useMemo((): RelatedItem[] => {
    if (!showResult || allSituations.length === 0) return [];
    const similar = contentRecommendationService.getSimilarSituationReactions(situation, allSituations, 6);
    return similar
      .filter(s => !answeredSituationIds.includes(s.content.id))
      .slice(0, 3)
      .map(s => ({
        id: s.content.id,
        title: s.content.situation,
        category: s.content.category,
        reason: s.reason,
      }));
  }, [showResult, situation, allSituations, answeredSituationIds]);

  // 관련 상황 클릭 시 스크롤 이동
  const handleSituationSelect = useCallback((situationId: string) => {
    const element = document.getElementById(`situation-${situationId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-blue-400');
      setTimeout(() => element.classList.remove('ring-2', 'ring-blue-400'), 2000);
    }
  }, []);

  // 선택 처리
  const handleSelect = async (optionId: string) => {
    if (showResult) return;
    setSelectedOption(optionId);
    setShowResult(true);
    onAnswer(situation.id, optionId);

    // TODO: API에서 실제 통계 가져오기
    // 현재는 균등 분포로 표시
    const equalShare = Math.floor(100 / situation.options.length);
    const mockStats: Record<string, number> = {};
    situation.options.forEach((opt, i) => {
      mockStats[opt.id] = i === 0 ? 100 - (equalShare * (situation.options.length - 1)) : equalShare;
    });
    setStats(mockStats);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="w-4 h-4 text-blue-500" />
        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
          {categoryInfo.emoji} {categoryInfo.name}
        </span>
      </div>

      {/* 상황 설명 */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg">
          {situation.situation}
        </p>
        <p className="text-base font-bold text-slate-800 mt-3">
          {situation.question}
        </p>
      </div>

      {/* 선택지 */}
      <div className="space-y-2">
        {situation.options.map((option) => {
          const isSelected = selectedOption === option.id;
          const percent = stats?.[option.id] ?? 0;

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={showResult}
              className={`
                w-full p-3 rounded-xl text-left transition-all relative overflow-hidden
                ${showResult
                  ? isSelected
                    ? 'bg-blue-100 border-2 border-blue-400'
                    : 'bg-gray-50 border border-gray-200'
                  : 'bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300'
                }
              `}
            >
              {/* 결과 바 (선택 후) */}
              {showResult && (
                <div
                  className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                    isSelected ? 'bg-blue-200/50' : 'bg-gray-200/50'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              )}

              <div className="relative flex items-center gap-2">
                <span className="text-lg">{option.emoji}</span>
                <span className={`text-sm flex-1 ${isSelected ? 'font-medium text-blue-700' : 'text-gray-700'}`}>
                  {option.text}
                </span>
                {showResult && (
                  <span className={`text-xs font-bold ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                    {percent}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 투표 수 */}
      {showResult && stats && (
        <div className="mt-3 flex items-center justify-end gap-1 text-xs text-gray-400">
          <Users className="w-3 h-3" />
          <span>참여자 통계</span>
        </div>
      )}

      {/* 관련 상황 더보기 */}
      {showResult && (
        <RelatedContentSection
          items={relatedSituationItems}
          onSelect={handleSituationSelect}
          contentType="situation"
        />
      )}

      {/* 댓글 토글 버튼 */}
      {showResult && (
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
      {showResult && showComments && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <CommentSystem
            targetType="situation"
            targetId={situation.id}
            placeholder="이 상황에 대한 의견을 남겨보세요..."
            maxDisplay={3}
          />
        </div>
      )}
    </div>
  );
}

export default SituationReactionCard;
