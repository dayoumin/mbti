'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import type { InterestMapResult } from '@/data/insight/stage4-interest-map';
import type { RelationshipPatternResult } from '@/data/insight/stage5-relationship-pattern';
import type { HiddenPatternResult } from '@/data/insight/stage6-hidden-pattern';
import type { AIAnalysisResult } from '@/data/insight/stage7-ai-analysis';

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

interface InsightStage4Props {
  config: StageConfig;
  result: InterestMapResult | null;
  onClick?: () => void;
}

interface InsightStage5Props {
  config: StageConfig;
  result: RelationshipPatternResult | null;
  onClick?: () => void;
}

interface InsightStage6Props {
  config: StageConfig;
  result: HiddenPatternResult | null;
  onClick?: () => void;
}

interface InsightStage7Props {
  config: StageConfig;
  result: AIAnalysisResult | null;
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
// InsightStage4 - 관심사 지도
// ============================================================================

export function InsightStage4({ config, result, onClick }: InsightStage4Props) {
  return (
    <InsightStageCard
      config={config}
      subtitle={result?.interestProfile.nameKr || '분석 중...'}
      onClick={onClick}
    >
      {result && result.entries.length > 0 && (
        <div className="space-y-2">
          {result.entries.slice(0, 3).map((entry) => (
            <div key={entry.category.id} className="flex items-center gap-2">
              <span className="w-6 text-center">{entry.category.emoji}</span>
              <div className="flex-1 h-2 bg-slate-50/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-teal-400 rounded-full"
                  style={{ width: `${entry.percentage}%` }}
                />
              </div>
              <span className="text-xs text-secondary w-8">{entry.percentage}%</span>
            </div>
          ))}
        </div>
      )}
    </InsightStageCard>
  );
}

// ============================================================================
// InsightStage5 - 관계 패턴
// ============================================================================

export function InsightStage5({ config, result, onClick }: InsightStage5Props) {
  return (
    <InsightStageCard
      config={config}
      subtitle={result?.profile.nameKr || '관계 태그 수집 중...'}
      onClick={onClick}
    >
      {result ? (
        <div className="bg-slate-50/80 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{result.conflictStyle.primary.emoji}</span>
            <span className="font-medium text-primary">
              {result.conflictStyle.primary.nameKr}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 bg-rose-100 rounded-full text-xs text-rose-700">
              {result.intimacyPreference.interpretation}
            </span>
            <span className="px-2 py-0.5 bg-pink-100 rounded-full text-xs text-pink-700">
              {result.careDirection.interpretation}
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50/60 rounded-xl p-3 text-center">
          <p className="text-sm text-muted">
            관계/갈등 관련 콘텐츠를 더 참여해보세요
          </p>
        </div>
      )}
    </InsightStageCard>
  );
}

// ============================================================================
// InsightStage6 - 숨은 패턴
// ============================================================================

export function InsightStage6({ config, result, onClick }: InsightStage6Props) {
  return (
    <InsightStageCard
      config={config}
      subtitle={result ? `일관성 ${result.consistency.score}%` : '태그 수집 중...'}
      onClick={onClick}
    >
      {result ? (
        <div className="space-y-2">
          {/* 모순 패턴 */}
          {result.contradictions.length > 0 && (
            <div className="bg-slate-50/80 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{result.contradictions[0].emoji}</span>
                <span className="font-medium text-primary text-sm">
                  {result.contradictions[0].interpretation}
                </span>
              </div>
              <p className="text-xs text-secondary line-clamp-1">
                {result.contradictions[0].insight}
              </p>
            </div>
          )}

          {/* 희귀 조합 */}
          {result.rarePatterns.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {result.rarePatterns.slice(0, 2).map((pattern, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-violet-100 rounded-full text-xs text-violet-700"
                >
                  {pattern.emoji} {pattern.interpretation}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-50/60 rounded-xl p-3 text-center">
          <p className="text-sm text-muted">
            10개 이상의 태그가 필요해요 (콘텐츠 더 참여하기)
          </p>
        </div>
      )}
    </InsightStageCard>
  );
}

// ============================================================================
// InsightStage7 - AI 종합 분석
// ============================================================================

export function InsightStage7({ config, result, onClick }: InsightStage7Props) {
  return (
    <InsightStageCard
      config={config}
      subtitle={result?.coreIdentity ? '분석 완료' : 'Stage 6 해금 필요'}
      onClick={onClick}
    >
      {result ? (
        <div className="space-y-2">
          {/* 핵심 정체성 */}
          <div className="bg-slate-50/80 rounded-xl p-3">
            <p className="text-sm text-primary font-medium line-clamp-2">
              &ldquo;{result.coreIdentity}&rdquo;
            </p>
          </div>

          {/* 핵심 특성 */}
          {result.keyTraits.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {result.keyTraits.slice(0, 3).map((trait, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-indigo-100 rounded-full text-xs text-indigo-700"
                >
                  {trait.emoji} {trait.trait}
                </span>
              ))}
            </div>
          )}

          {/* 신뢰도 */}
          <div className="text-xs text-muted text-right">
            신뢰도: {result.meta.confidenceLevel === 'high' ? '높음' : result.meta.confidenceLevel === 'medium' ? '보통' : '낮음'}
          </div>
        </div>
      ) : (
        <div className="bg-slate-50/60 rounded-xl p-3 text-center">
          <p className="text-sm text-muted">
            Stage 6까지 해금하면 AI 종합 분석을 받을 수 있어요
          </p>
        </div>
      )}
    </InsightStageCard>
  );
}

export default InsightStage4;
