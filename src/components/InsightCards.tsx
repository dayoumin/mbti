'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Brain,
  Sparkles,
  Target,
  Map,
  Lock,
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

// Import stage components
import InsightStage1 from './insight/InsightStage1';
import InsightStage2 from './insight/InsightStage2';
import InsightStage3 from './insight/InsightStage3';
import { InsightStage4, InsightStage5, InsightStage6, InsightStage7 } from './insight/InsightStage4';

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
        // Stage 7은 Stage 6 해금 후 사용 가능 (async)
        let cancelled = false;

        insightService.getStage7Insight().then(result => {
          if (cancelled) return; // 언마운트됐으면 무시
          if (result) {
            setStage7Result(result);
          }
        }).catch(err => {
          if (cancelled) return; // 언마운트됐으면 무시
          console.error('[InsightCards] Stage 7 error:', err);
        });

        // Cleanup: 언마운트 시 취소 플래그 설정
        return () => {
          cancelled = true;
        };
      }
    } catch (error) {
      console.error('[InsightCards] Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [maxStages]);

  // maxStages 변경 시 재로드
  useEffect(() => {
    return loadInsightData();
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
      return <InsightStage1 config={config} onClick={onClick} />;
    case 2:
      return <InsightStage2 config={config} rules={result as Stage2Rule[] | null} onClick={onClick} />;
    case 3:
      return <InsightStage3 config={config} result={result as DecisionStyleResult | null} onClick={onClick} />;
    case 4:
      return <InsightStage4 config={config} result={result as InterestMapResult | null} onClick={onClick} />;
    case 5:
      return <InsightStage5 config={config} result={result as RelationshipPatternResult | null} onClick={onClick} />;
    case 6:
      return <InsightStage6 config={config} result={result as HiddenPatternResult | null} onClick={onClick} />;
    case 7:
      return <InsightStage7 config={config} result={result as AIAnalysisResult | null} onClick={onClick} />;
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
          className={`flex-shrink-0 px-4 py-3 rounded-2xl transition-all ${stage.unlocked
              ? 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200'
              : 'bg-gray-50 border border-gray-200'
            }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{stage.emoji}</span>
            <div className="text-left">
              <div
                className={`text-sm font-medium ${stage.unlocked ? 'text-purple-700' : 'text-gray-400'
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
        <div className="h-2 bg-slate-50/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-slate-50 rounded-full transition-all"
            style={{ width: `${progress.progress}%` }}
          />
        </div>
      </div>

      <p className="text-sm opacity-90">{progress.remaining}</p>
    </div>
  );
}
