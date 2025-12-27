'use client';

import { useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import type { NextAction, ActionPriority } from '@/services/NextActionService';
import { analyticsService, SourceEndpoint } from '@/services/AnalyticsService';

// ============================================================================
// Types
// ============================================================================

interface TrackingContext {
  sourceEndpoint: SourceEndpoint;
  sourceCategory?: string;
}

interface NextActionCardProps {
  action: NextAction;
  onClick?: (action: NextAction) => void;
  variant?: 'default' | 'compact' | 'prominent';
  position?: number;
  tracking?: TrackingContext;
}

interface NextActionListProps {
  actions: NextAction[];
  onActionClick?: (action: NextAction) => void;
  maxItems?: number;
  title?: string;
  variant?: 'default' | 'compact' | 'prominent';
  tracking?: TrackingContext;
}

// ============================================================================
// 스타일 설정
// ============================================================================

const PRIORITY_STYLES: Record<ActionPriority, { bg: string; border: string; text: string }> = {
  primary: {
    bg: 'bg-gradient-to-r from-indigo-500 to-purple-500',
    border: 'border-indigo-300',
    text: 'text-white',
  },
  secondary: {
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-700',
  },
  tertiary: {
    bg: 'bg-slate-50',
    border: 'border-slate-100',
    text: 'text-slate-600',
  },
};

// ============================================================================
// NextActionCard - 단일 액션 카드
// ============================================================================

export function NextActionCard({ action, onClick, variant = 'default', position = 0, tracking }: NextActionCardProps) {
  const styles = PRIORITY_STYLES[action.priority];
  const isPrimary = action.priority === 'primary';
  const hasTrackedView = useRef(false);

  // 노출 추적 (한 번만)
  useEffect(() => {
    if (tracking && !hasTrackedView.current) {
      hasTrackedView.current = true;
      analyticsService.trackRecommendationView(
        tracking.sourceEndpoint,
        tracking.sourceCategory,
        action.type,
        action.targetCategory || action.targetId || '',
        action.priority,
        position
      );
    }
  }, [tracking, action, position]);

  const handleClick = () => {
    // 클릭 추적
    if (tracking) {
      analyticsService.trackRecommendationClick(
        tracking.sourceEndpoint,
        tracking.sourceCategory,
        action.type,
        action.targetId || '',
        action.targetCategory || '',
        action.priority,
        position
      );
    }
    onClick?.(action);
  };

  // Compact variant (작은 버튼 스타일)
  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-xl border transition-all
          hover:scale-[1.02] active:scale-[0.98]
          ${isPrimary ? styles.bg + ' ' + styles.text : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}
        `}
      >
        <span className="text-base">{action.icon}</span>
        <span className="text-sm font-medium">{action.label}</span>
      </button>
    );
  }

  // Prominent variant (큰 CTA 카드)
  if (variant === 'prominent') {
    return (
      <button
        onClick={handleClick}
        className={`
          w-full p-4 rounded-2xl border-2 transition-all
          hover:scale-[1.01] active:scale-[0.99] shadow-lg
          ${styles.bg} ${styles.border} ${styles.text}
        `}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{action.icon}</span>
          <div className="flex-1 text-left">
            <p className={`font-bold ${isPrimary ? 'text-white' : 'text-primary'}`}>
              {action.label}
            </p>
            <p className={`text-sm ${isPrimary ? 'text-white/80' : 'text-muted'}`}>
              {action.description}
            </p>
          </div>
          <div className={`
            px-4 py-2 rounded-xl font-bold text-sm
            ${isPrimary ? 'bg-slate-50/20 text-white' : 'bg-indigo-500 text-white'}
          `}>
            {action.ctaText}
          </div>
        </div>
      </button>
    );
  }

  // Default variant (기본 카드)
  return (
    <button
      onClick={handleClick}
      className={`
        w-full p-3 rounded-xl border transition-all text-left
        hover:scale-[1.01] active:scale-[0.99]
        ${isPrimary
          ? styles.bg + ' ' + styles.text + ' shadow-md'
          : styles.bg + ' ' + styles.border + ' ' + styles.text + ' hover:border-slate-300'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <span className={`text-2xl ${isPrimary ? '' : 'opacity-80'}`}>{action.icon}</span>
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-sm truncate ${isPrimary ? 'text-white' : 'text-primary'}`}>
            {action.label}
          </p>
          <p className={`text-xs truncate ${isPrimary ? 'text-white/70' : 'text-muted'}`}>
            {action.description}
          </p>
        </div>
        <ChevronRight className={`w-5 h-5 flex-shrink-0 ${isPrimary ? 'text-white/70' : 'text-subtle'}`} />
      </div>
    </button>
  );
}

// ============================================================================
// NextActionList - 액션 목록
// ============================================================================

export function NextActionList({
  actions,
  onActionClick,
  maxItems = 4,
  title,
  variant = 'default',
  tracking
}: NextActionListProps) {
  const displayActions = actions.slice(0, maxItems);

  if (displayActions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {title && (
        <h3 className="text-sm font-bold text-slate-600 flex items-center gap-2">
          <span>✨</span> {title}
        </h3>
      )}

      <div className="space-y-2">
        {displayActions.map((action, index) => (
          <NextActionCard
            key={`${action.type}-${action.targetId || action.targetCategory || index}`}
            action={action}
            onClick={onActionClick}
            variant={variant}
            position={index}
            tracking={tracking}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// NextActionBanner - 배너형 (결과 화면 하단용)
// ============================================================================

interface NextActionBannerProps {
  primaryAction: NextAction;
  secondaryActions?: NextAction[];
  onActionClick?: (action: NextAction) => void;
  tracking?: TrackingContext;
}

export function NextActionBanner({
  primaryAction,
  secondaryActions = [],
  onActionClick,
  tracking
}: NextActionBannerProps) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl p-4 space-y-3">
      <p className="text-xs font-bold text-slate-500 text-center">다음으로 해볼까요?</p>

      {/* Primary Action */}
      <NextActionCard
        action={primaryAction}
        onClick={onActionClick}
        variant="prominent"
        position={0}
        tracking={tracking}
      />

      {/* Secondary Actions */}
      {secondaryActions.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center pt-2">
          {secondaryActions.slice(0, 3).map((action, index) => (
            <NextActionCard
              key={`${action.type}-${index}`}
              action={action}
              onClick={onActionClick}
              variant="compact"
              position={index + 1}
              tracking={tracking}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// NextActionInline - 인라인형 (작은 공간용)
// ============================================================================

interface NextActionInlineProps {
  actions: NextAction[];
  onActionClick?: (action: NextAction) => void;
  tracking?: TrackingContext;
}

export function NextActionInline({ actions, onActionClick, tracking }: NextActionInlineProps) {
  const hasTrackedView = useRef(false);

  // 노출 추적 (한 번만, 첫 번째 액션 기준)
  useEffect(() => {
    if (tracking && actions.length > 0 && !hasTrackedView.current) {
      hasTrackedView.current = true;
      actions.slice(0, 3).forEach((action, index) => {
        analyticsService.trackRecommendationView(
          tracking.sourceEndpoint,
          tracking.sourceCategory,
          action.type,
          action.targetCategory || action.targetId || '',
          action.priority,
          index
        );
      });
    }
  }, [tracking, actions]);

  const handleClick = (action: NextAction, index: number) => {
    if (tracking) {
      analyticsService.trackRecommendationClick(
        tracking.sourceEndpoint,
        tracking.sourceCategory,
        action.type,
        action.targetId || '',
        action.targetCategory || '',
        action.priority,
        index
      );
    }
    onActionClick?.(action);
  };

  if (actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {actions.slice(0, 3).map((action, index) => (
        <button
          key={`${action.type}-${index}`}
          onClick={() => handleClick(action, index)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200
                     text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
        >
          <span>{action.icon}</span>
          <span>{action.ctaText}</span>
        </button>
      ))}
    </div>
  );
}

export type { TrackingContext };
export default NextActionCard;
