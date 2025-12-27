'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import type { DecisionStyleResult } from '@/data/insight/stage3-decision-style';

// ============================================================================
// Types
// ============================================================================

interface StageConfig {
  stage: number;
  title: string;
  emoji: string;
  icon: LucideIcon;
  gradient: string;
  iconGradient: string;
  borderColor: string;
  subtitleColor: string;
}

interface InsightStage3Props {
  config: StageConfig;
  result: DecisionStyleResult | null;
  onClick?: () => void;
}

// ============================================================================
// InsightStageCard - 공통 카드 컴포넌트
// ============================================================================

interface InsightStageCardProps {
  config: StageConfig;
  subtitle: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

function InsightStageCard({ config, subtitle, children, onClick }: InsightStageCardProps) {
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={`w-full bg-gradient-to-br ${config.gradient} rounded-2xl p-4 ${config.borderColor} border text-left transition-all hover:shadow-md`}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 bg-gradient-to-br ${config.iconGradient} rounded-xl flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-gray-900">{config.title}</div>
            <div className={`text-sm ${config.subtitleColor}`}>{subtitle}</div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      {/* 커스텀 콘텐츠 */}
      {children}
    </button>
  );
}

// ============================================================================
// InsightStage3 - 판단 스타일
// ============================================================================

export default function InsightStage3({ config, result, onClick }: InsightStage3Props) {
  return (
    <InsightStageCard
      config={config}
      subtitle={result?.profile.nameKr || '분석 중...'}
      onClick={onClick}
    >
      {result && (
        <div className="bg-slate-50/80 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{result.profile.emoji}</span>
            <span className="font-medium text-primary">{result.profile.nameKr}</span>
          </div>
          <p className="text-sm text-secondary line-clamp-2">
            {result.profile.description}
          </p>
        </div>
      )}
    </InsightStageCard>
  );
}
