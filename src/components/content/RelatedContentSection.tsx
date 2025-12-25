'use client';

/**
 * RelatedContentSection - 관련 콘텐츠 더보기 공통 컴포넌트
 *
 * Quiz, Poll, SituationReaction 등에서 재사용
 * - 타입별 스타일 (색상, 아이콘)
 * - 접기/펼치기 UI
 * - 클릭 시 스크롤 이동
 */

import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Lightbulb, Vote, MessageCircle } from 'lucide-react';

// ============================================================================
// 타입 정의
// ============================================================================

export interface RelatedItem {
  id: string;
  title: string;           // question, situation 등
  emoji?: string;
  category: string;
  reason?: string;         // "태그 일치: 축의금, 결혼"
}

export type ContentType = 'quiz' | 'poll' | 'situation';

interface RelatedContentSectionProps {
  items: RelatedItem[];
  onSelect: (id: string) => void;
  contentType: ContentType;
  title?: string;           // 커스텀 타이틀
  maxVisible?: number;      // 기본 3
  className?: string;
}

// ============================================================================
// 타입별 스타일 설정
// ============================================================================

const TYPE_CONFIG: Record<ContentType, {
  label: string;
  color: string;
  bgColor: string;
  hoverBgColor: string;
  textColor: string;
  Icon: typeof Lightbulb;
}> = {
  quiz: {
    label: '퀴즈',
    color: 'orange',
    bgColor: 'bg-orange-50',
    hoverBgColor: 'hover:bg-orange-100',
    textColor: 'text-orange-600',
    Icon: Lightbulb,
  },
  poll: {
    label: '투표',
    color: 'purple',
    bgColor: 'bg-purple-50',
    hoverBgColor: 'hover:bg-purple-100',
    textColor: 'text-purple-600',
    Icon: Vote,
  },
  situation: {
    label: '상황',
    color: 'blue',
    bgColor: 'bg-blue-50',
    hoverBgColor: 'hover:bg-blue-100',
    textColor: 'text-blue-600',
    Icon: MessageCircle,
  },
};

// ============================================================================
// 컴포넌트
// ============================================================================

export function RelatedContentSection({
  items,
  onSelect,
  contentType,
  title,
  maxVisible = 3,
  className = '',
}: RelatedContentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 표시할 아이템 없으면 렌더링 안함
  if (items.length === 0) return null;

  const config = TYPE_CONFIG[contentType];
  const displayItems = isExpanded ? items : items.slice(0, maxVisible);
  const hasMore = items.length > maxVisible;

  const displayTitle = title || `비슷한 ${config.label} ${items.length}개`;

  return (
    <div className={`mt-3 ${className}`}>
      {/* 헤더 */}
      <div className={`flex items-center gap-1.5 px-2 py-1.5 text-xs ${config.textColor}`}>
        <Sparkles className="w-3.5 h-3.5" />
        <span className="font-medium">{displayTitle}</span>
      </div>

      {/* 관련 콘텐츠 목록 - 기본 표시 */}
      <div className="mt-1 space-y-1.5">
        {displayItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`w-full p-2.5 text-left ${config.bgColor} ${config.hoverBgColor} rounded-lg transition-colors group`}
          >
            <div className="flex items-start gap-2">
              {/* 이모지 또는 아이콘 */}
              <span className="text-base flex-shrink-0">
                {item.emoji || <config.Icon className={`w-4 h-4 ${config.textColor}`} />}
              </span>

              <div className="flex-1 min-w-0">
                {/* 제목 */}
                <p className="text-xs text-gray-700 line-clamp-2 group-hover:text-gray-900">
                  {item.title}
                </p>

                {/* 추천 이유 */}
                {item.reason && (
                  <p className={`text-[10px] ${config.textColor} mt-0.5 opacity-80`}>
                    {item.reason}
                  </p>
                )}
              </div>

              {/* 이동 화살표 */}
              <span className={`text-xs ${config.textColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                →
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* 더보기 버튼 (3개 초과 시) */}
      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full mt-1.5 py-1.5 flex items-center justify-center gap-1 text-xs ${config.textColor} ${config.bgColor} ${config.hoverBgColor} rounded-lg transition-colors`}
        >
          <span>{isExpanded ? '접기' : `${items.length - maxVisible}개 더보기`}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      )}
    </div>
  );
}

export default RelatedContentSection;
