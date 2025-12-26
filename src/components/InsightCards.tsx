'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  Brain,
  Sparkles,
  Target,
  Map,
  Lock,
  ChevronRight,
  TrendingUp,
  Heart,
  Eye,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { insightService } from '@/services/InsightService';
import { eventBus } from '@/services/EventBus';
import type { Stage2Rule } from '@/data/insight/stage2-rules';
import type { DecisionStyleResult } from '@/data/insight/stage3-decision-style';
import type { InterestMapResult } from '@/data/insight/stage4-interest-map';
import type { RelationshipPatternResult } from '@/data/insight/stage5-relationship-pattern';
import type { HiddenPatternResult } from '@/data/insight/stage6-hidden-pattern';
import type { AIAnalysisResult } from '@/data/insight/stage7-ai-analysis';

// ============================================================================
// Stage 설정 데이터 (SSOT)
// ============================================================================

interface StageConfig {
  stage: number;
  title: string;
  emoji: string;
  icon: LucideIcon;
  gradient: string;         // 배경 그라디언트
  iconGradient: string;     // 아이콘 그라디언트
  borderColor: string;      // 테두리 색상
  subtitleColor: string;    // 부제목 색상
}

const STAGE_CONFIGS: StageConfig[] = [
  {
    stage: 1,
    title: '기본 성향',
    emoji: '🧠',
    icon: Brain,
    gradient: 'from-purple-50 to-pink-50',
    iconGradient: 'from-purple-500 to-pink-500',
    borderColor: 'border-purple-200',
    subtitleColor: 'text-purple-600',
  },
  {
    stage: 2,
    title: '성격 조합',
    emoji: '🔗',
    icon: Sparkles,
    gradient: 'from-blue-50 to-purple-50',
    iconGradient: 'from-blue-500 to-purple-500',
    borderColor: 'border-blue-200',
    subtitleColor: 'text-blue-600',
  },
  {
    stage: 3,
    title: '판단 스타일',
    emoji: '⚖️',
    icon: Target,
    gradient: 'from-amber-50 to-orange-50',
    iconGradient: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-200',
    subtitleColor: 'text-amber-600',
  },
  {
    stage: 4,
    title: '관심사 지도',
    emoji: '🗺️',
    icon: Map,
    gradient: 'from-green-50 to-teal-50',
    iconGradient: 'from-green-500 to-teal-500',
    borderColor: 'border-green-200',
    subtitleColor: 'text-green-600',
  },
  {
    stage: 5,
    title: '관계 패턴',
    emoji: '💕',
    icon: Heart,
    gradient: 'from-rose-50 to-pink-50',
    iconGradient: 'from-rose-500 to-pink-500',
    borderColor: 'border-rose-200',
    subtitleColor: 'text-rose-600',
  },
  {
    stage: 6,
    title: '숨은 패턴',
    emoji: '🔮',
    icon: Eye,
    gradient: 'from-violet-50 to-purple-50',
    iconGradient: 'from-violet-500 to-purple-500',
    borderColor: 'border-violet-200',
    subtitleColor: 'text-violet-600',
  },
  {
    stage: 7,
    title: 'AI 종합 분석',
    emoji: '✨',
    icon: Zap,
    gradient: 'from-indigo-50 to-cyan-50',
    iconGradient: 'from-indigo-500 to-cyan-500',
    borderColor: 'border-indigo-200',
    subtitleColor: 'text-indigo-600',
  },
];

// ============================================================================
// Types
// ============================================================================

interface InsightCardsProps {
  /** 컴팩트 모드 (작은 카드) */
  compact?: boolean;
  /** 표시할 최대 스테이지 수 */
  maxStages?: number;
  /** 카드 클릭 핸들러 */
  onCardClick?: (stage: number) => void;
}

interface StageData {
  stage: number;
  title: string;
  emoji: string;
  unlocked: boolean;
  progress?: number;
  remaining?: string;
}

// ============================================================================
// InsightStageCard - 공통 카드 컴포넌트
// ============================================================================

interface InsightStageCardProps {
  config: StageConfig;
  subtitle: string;
  children?: ReactNode;
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
// InsightCards - 메인 컴포넌트
// ============================================================================

export default function InsightCards({
  compact = false,
  maxStages = 6,
  onCardClick,
}: InsightCardsProps) {
  const [stages, setStages] = useState<StageData[]>([]);
  const [stage2Rules, setStage2Rules] = useState<Stage2Rule[] | null>(null);
  const [stage3Result, setStage3Result] = useState<DecisionStyleResult | null>(null);
  const [stage4Result, setStage4Result] = useState<InterestMapResult | null>(null);
  const [stage5Result, setStage5Result] = useState<RelationshipPatternResult | null>(null);
  const [stage6Result, setStage6Result] = useState<HiddenPatternResult | null>(null);
  const [stage7Result, setStage7Result] = useState<AIAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadInsightData = useCallback(() => {
    setIsLoading(true);

    try {
      // 해금된 스테이지 조회
      const unlockedStages = insightService.getUnlockedStages();
      const progress = insightService.getProgressToNextStage();

      // 스테이지 데이터 구성
      const stageData: StageData[] = STAGE_CONFIGS.slice(0, maxStages).map((config) => {
        const isUnlocked = unlockedStages.some((s) => s.stage === config.stage);
        const isNextStage = progress?.nextStage === config.stage;

        return {
          stage: config.stage,
          title: config.title,
          emoji: config.emoji,
          unlocked: isUnlocked,
          progress: isNextStage ? progress?.progress : undefined,
          remaining: isNextStage ? progress?.remaining : undefined,
        };
      });

      setStages(stageData);

      // Stage 2-7 인사이트 로드
      if (insightService.isStageUnlocked(2)) {
        setStage2Rules(insightService.getStage2Insight(3));
      }
      if (insightService.isStageUnlocked(3)) {
        setStage3Result(insightService.getStage3Insight());
      }
      if (insightService.isStageUnlocked(4)) {
        setStage4Result(insightService.getStage4Insight());
      }
      if (insightService.isStageUnlocked(5)) {
        setStage5Result(insightService.getStage5Insight());
      }
      if (insightService.isStageUnlocked(6)) {
        setStage6Result(insightService.getStage6Insight());
      }
      if (insightService.isStageUnlocked(6)) {
        // Stage 7은 Stage 6 해금 후 사용 가능
        setStage7Result(insightService.getStage7Insight());
      }
    } catch (error) {
      console.error('[InsightCards] Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [maxStages]);

  // maxStages 변경 시 재로드
  useEffect(() => {
    loadInsightData();
  }, [loadInsightData]);

  // 활동 완료 시 자동 갱신 (eventBus 구독)
  useEffect(() => {
    const unsubscribe = eventBus.subscribe(() => {
      setTimeout(() => {
        loadInsightData();
      }, 100);
    });

    return () => {
      unsubscribe();
    };
  }, [loadInsightData]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (compact) {
    return <CompactView stages={stages} onCardClick={onCardClick} />;
  }

  // Stage별 결과 매핑
  const stageResults: Record<number, unknown> = {
    2: stage2Rules,
    3: stage3Result,
    4: stage4Result,
    5: stage5Result,
    6: stage6Result,
    7: stage7Result,
  };

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          <h3 className="font-bold text-gray-900">나의 인사이트</h3>
        </div>
        <span className="text-xs text-gray-500">
          {stages.filter((s) => s.unlocked).length}/{stages.length} 해금
        </span>
      </div>

      {/* 스테이지 카드들 */}
      <div className="space-y-3">
        {stages.map((stage) => {
          if (!stage.unlocked) {
            return <LockedStageCard key={stage.stage} stage={stage} />;
          }

          const config = STAGE_CONFIGS.find((c) => c.stage === stage.stage);
          if (!config) return null;

          return (
            <StageCardContent
              key={stage.stage}
              config={config}
              result={stageResults[stage.stage]}
              onClick={() => onCardClick?.(stage.stage)}
            />
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// StageCardContent - Stage별 콘텐츠 렌더링
// ============================================================================

function StageCardContent({
  config,
  result,
  onClick,
}: {
  config: StageConfig;
  result: unknown;
  onClick?: () => void;
}) {
  switch (config.stage) {
    case 1:
      return <Stage1Content config={config} onClick={onClick} />;
    case 2:
      return <Stage2Content config={config} rules={result as Stage2Rule[] | null} onClick={onClick} />;
    case 3:
      return <Stage3Content config={config} result={result as DecisionStyleResult | null} onClick={onClick} />;
    case 4:
      return <Stage4Content config={config} result={result as InterestMapResult | null} onClick={onClick} />;
    case 5:
      return <Stage5Content config={config} result={result as RelationshipPatternResult | null} onClick={onClick} />;
    case 6:
      return <Stage6Content config={config} result={result as HiddenPatternResult | null} onClick={onClick} />;
    case 7:
      return <Stage7Content config={config} result={result as AIAnalysisResult | null} onClick={onClick} />;
    default:
      return null;
  }
}

// ============================================================================
// CompactView - 작은 카드 뷰
// ============================================================================

function CompactView({
  stages,
  onCardClick,
}: {
  stages: StageData[];
  onCardClick?: (stage: number) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {stages.map((stage) => (
        <button
          key={stage.stage}
          onClick={() => onCardClick?.(stage.stage)}
          className={`flex-shrink-0 px-4 py-3 rounded-2xl transition-all ${
            stage.unlocked
              ? 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200'
              : 'bg-gray-50 border border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{stage.emoji}</span>
            <div className="text-left">
              <div
                className={`text-sm font-medium ${
                  stage.unlocked ? 'text-purple-700' : 'text-gray-400'
                }`}
              >
                {stage.title}
              </div>
              {!stage.unlocked && stage.progress !== undefined && (
                <div className="text-xs text-gray-400">{Math.round(stage.progress)}%</div>
              )}
            </div>
            {!stage.unlocked && <Lock className="w-3 h-3 text-gray-400" />}
          </div>
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// LockedStageCard - 잠긴 스테이지
// ============================================================================

function LockedStageCard({ stage }: { stage: StageData }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <div className="font-medium text-gray-400">
              Stage {stage.stage}: {stage.title}
            </div>
            {stage.remaining && (
              <div className="text-sm text-gray-400">{stage.remaining}</div>
            )}
          </div>
        </div>
        {stage.progress !== undefined && (
          <div className="text-right">
            <div className="text-sm font-medium text-gray-500">
              {Math.round(stage.progress)}%
            </div>
            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-400 rounded-full transition-all"
                style={{ width: `${stage.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Stage1Content - 기본 성향
// ============================================================================

function Stage1Content({ config, onClick }: { config: StageConfig; onClick?: () => void }) {
  const [insight, setInsight] = useState<{
    testResults: { testId: string; resultName: string }[];
    dominantTags: { tag: string; percentage: number }[];
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchInsight = async () => {
      const data = await insightService.getStage1Insight();
      if (cancelled) return;

      if (data) {
        setInsight({
          testResults: data.testResults.map((r) => ({
            testId: r.testId,
            resultName: r.resultName,
          })),
          dominantTags: data.dominantTags.map((t) => ({
            tag: t.tag,
            percentage: t.percentage,
          })),
        });
      }
    };
    fetchInsight();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <InsightStageCard
      config={config}
      subtitle={`${insight?.testResults.length || 0}개 테스트 완료`}
      onClick={onClick}
    >
      {insight && insight.dominantTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {insight.dominantTags.slice(0, 3).map((tag) => (
            <span
              key={tag.tag}
              className="px-2.5 py-1 bg-white/80 rounded-full text-xs font-medium text-purple-700"
            >
              {tag.tag} {tag.percentage}%
            </span>
          ))}
        </div>
      )}
    </InsightStageCard>
  );
}

// ============================================================================
// Stage2Content - 성격 조합
// ============================================================================

function Stage2Content({
  config,
  rules,
  onClick,
}: {
  config: StageConfig;
  rules: Stage2Rule[] | null;
  onClick?: () => void;
}) {
  const topRule = rules?.[0];

  return (
    <InsightStageCard
      config={config}
      subtitle={`${rules?.length || 0}개 패턴 발견`}
      onClick={onClick}
    >
      {topRule && (
        <div className="bg-white/80 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{topRule.insight.emoji}</span>
            <span className="font-medium text-gray-900">{topRule.insight.title}</span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {topRule.insight.description}
          </p>
        </div>
      )}
    </InsightStageCard>
  );
}

// ============================================================================
// Stage3Content - 판단 스타일
// ============================================================================

function Stage3Content({
  config,
  result,
  onClick,
}: {
  config: StageConfig;
  result: DecisionStyleResult | null;
  onClick?: () => void;
}) {
  return (
    <InsightStageCard
      config={config}
      subtitle={result?.profile.nameKr || '분석 중...'}
      onClick={onClick}
    >
      {result && (
        <div className="bg-white/80 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{result.profile.emoji}</span>
            <span className="font-medium text-gray-900">{result.profile.nameKr}</span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {result.profile.description}
          </p>
        </div>
      )}
    </InsightStageCard>
  );
}

// ============================================================================
// Stage4Content - 관심사 지도
// ============================================================================

function Stage4Content({
  config,
  result,
  onClick,
}: {
  config: StageConfig;
  result: InterestMapResult | null;
  onClick?: () => void;
}) {
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
              <div className="flex-1 h-2 bg-white/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-teal-400 rounded-full"
                  style={{ width: `${entry.percentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-600 w-8">{entry.percentage}%</span>
            </div>
          ))}
        </div>
      )}
    </InsightStageCard>
  );
}

// ============================================================================
// Stage5Content - 관계 패턴
// ============================================================================

function Stage5Content({
  config,
  result,
  onClick,
}: {
  config: StageConfig;
  result: RelationshipPatternResult | null;
  onClick?: () => void;
}) {
  return (
    <InsightStageCard
      config={config}
      subtitle={result?.profile.nameKr || '관계 태그 수집 중...'}
      onClick={onClick}
    >
      {result ? (
        <div className="bg-white/80 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{result.conflictStyle.primary.emoji}</span>
            <span className="font-medium text-gray-900">
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
        <div className="bg-white/60 rounded-xl p-3 text-center">
          <p className="text-sm text-gray-500">
            관계/갈등 관련 콘텐츠를 더 참여해보세요
          </p>
        </div>
      )}
    </InsightStageCard>
  );
}

// ============================================================================
// Stage6Content - 숨은 패턴
// ============================================================================

function Stage6Content({
  config,
  result,
  onClick,
}: {
  config: StageConfig;
  result: HiddenPatternResult | null;
  onClick?: () => void;
}) {
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
            <div className="bg-white/80 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{result.contradictions[0].emoji}</span>
                <span className="font-medium text-gray-900 text-sm">
                  {result.contradictions[0].interpretation}
                </span>
              </div>
              <p className="text-xs text-gray-600 line-clamp-1">
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
        <div className="bg-white/60 rounded-xl p-3 text-center">
          <p className="text-sm text-gray-500">
            10개 이상의 태그가 필요해요 (콘텐츠 더 참여하기)
          </p>
        </div>
      )}
    </InsightStageCard>
  );
}

// ============================================================================
// Stage7Content - AI 종합 분석
// ============================================================================

function Stage7Content({
  config,
  result,
  onClick,
}: {
  config: StageConfig;
  result: AIAnalysisResult | null;
  onClick?: () => void;
}) {
  return (
    <InsightStageCard
      config={config}
      subtitle={result?.coreIdentity ? '분석 완료' : 'Stage 6 해금 필요'}
      onClick={onClick}
    >
      {result ? (
        <div className="space-y-2">
          {/* 핵심 정체성 */}
          <div className="bg-white/80 rounded-xl p-3">
            <p className="text-sm text-gray-900 font-medium line-clamp-2">
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
          <div className="text-xs text-gray-500 text-right">
            신뢰도: {result.meta.confidenceLevel === 'high' ? '높음' : result.meta.confidenceLevel === 'medium' ? '보통' : '낮음'}
          </div>
        </div>
      ) : (
        <div className="bg-white/60 rounded-xl p-3 text-center">
          <p className="text-sm text-gray-500">
            Stage 6까지 해금하면 AI 종합 분석을 받을 수 있어요
          </p>
        </div>
      )}
    </InsightStageCard>
  );
}

// ============================================================================
// InsightProgress - 진행률 위젯
// ============================================================================

export function InsightProgress() {
  const [progress, setProgress] = useState<{
    currentStage: number;
    nextStage: number;
    progress: number;
    remaining: string;
  } | null>(null);

  const loadProgress = useCallback(() => {
    const data = insightService.getProgressToNextStage();
    setProgress(data);
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // 활동 완료 시 자동 갱신 (eventBus 구독)
  useEffect(() => {
    const unsubscribe = eventBus.subscribe(() => {
      setTimeout(() => {
        loadProgress();
      }, 100);
    });

    return () => {
      unsubscribe();
    };
  }, [loadProgress]);

  if (!progress) {
    return null;
  }

  const stageConfig = STAGE_CONFIGS.find((c) => c.stage === progress.nextStage);

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          <span className="font-bold">다음 인사이트</span>
        </div>
        <span className="text-2xl">{stageConfig?.emoji || '✨'}</span>
      </div>

      <div className="mb-2">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="opacity-90">Stage {progress.nextStage}</span>
          <span className="font-medium">{Math.round(progress.progress)}%</span>
        </div>
        <div className="h-2 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${progress.progress}%` }}
          />
        </div>
      </div>

      <p className="text-sm opacity-90">{progress.remaining}</p>
    </div>
  );
}
