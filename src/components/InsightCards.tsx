'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Brain,
  Sparkles,
  Target,
  Map,
  Lock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { insightService } from '@/services/InsightService';
import { eventBus } from '@/services/EventBus';
import type { Stage2Rule } from '@/data/insight/stage2-rules';
import type { DecisionStyleResult } from '@/data/insight/stage3-decision-style';
import type { InterestMapResult } from '@/data/insight/stage4-interest-map';

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
// InsightCards - 메인 컴포넌트
// ============================================================================

export default function InsightCards({
  compact = false,
  maxStages = 4,
  onCardClick,
}: InsightCardsProps) {
  const [stages, setStages] = useState<StageData[]>([]);
  const [stage2Rules, setStage2Rules] = useState<Stage2Rule[] | null>(null);
  const [stage3Result, setStage3Result] = useState<DecisionStyleResult | null>(null);
  const [stage4Result, setStage4Result] = useState<InterestMapResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadInsightData = useCallback(() => {
    setIsLoading(true);

    try {
      // 해금된 스테이지 조회
      const unlockedStages = insightService.getUnlockedStages();
      const progress = insightService.getProgressToNextStage();

      // 스테이지 데이터 구성
      const stageConfigs = [
        { stage: 1, title: '기본 성향', emoji: '🧠' },
        { stage: 2, title: '성격 조합', emoji: '🔗' },
        { stage: 3, title: '판단 스타일', emoji: '⚖️' },
        { stage: 4, title: '관심사 지도', emoji: '🗺️' },
      ];

      const stageData: StageData[] = stageConfigs.slice(0, maxStages).map((config) => {
        const isUnlocked = unlockedStages.some((s) => s.stage === config.stage);
        const isNextStage = progress?.nextStage === config.stage;

        return {
          ...config,
          unlocked: isUnlocked,
          progress: isNextStage ? progress?.progress : undefined,
          remaining: isNextStage ? progress?.remaining : undefined,
        };
      });

      setStages(stageData);

      // Stage 2-4 인사이트 로드
      if (insightService.isStageUnlocked(2)) {
        setStage2Rules(insightService.getStage2Insight(3));
      }
      if (insightService.isStageUnlocked(3)) {
        setStage3Result(insightService.getStage3Insight());
      }
      if (insightService.isStageUnlocked(4)) {
        setStage4Result(insightService.getStage4Insight());
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
      // 약간의 딜레이 후 갱신 (InsightService가 먼저 처리하도록)
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
        {stages.map((stage) => (
          <StageCard
            key={stage.stage}
            stage={stage}
            stage2Rules={stage.stage === 2 ? stage2Rules : null}
            stage3Result={stage.stage === 3 ? stage3Result : null}
            stage4Result={stage.stage === 4 ? stage4Result : null}
            onClick={() => onCardClick?.(stage.stage)}
          />
        ))}
      </div>
    </div>
  );
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
// StageCard - 개별 스테이지 카드
// ============================================================================

function StageCard({
  stage,
  stage2Rules,
  stage3Result,
  stage4Result,
  onClick,
}: {
  stage: StageData;
  stage2Rules: Stage2Rule[] | null;
  stage3Result: DecisionStyleResult | null;
  stage4Result: InterestMapResult | null;
  onClick?: () => void;
}) {
  if (!stage.unlocked) {
    return <LockedStageCard stage={stage} />;
  }

  // Stage별 컨텐츠 렌더링
  switch (stage.stage) {
    case 1:
      return <Stage1Card stage={stage} onClick={onClick} />;
    case 2:
      return <Stage2Card stage={stage} rules={stage2Rules} onClick={onClick} />;
    case 3:
      return <Stage3Card stage={stage} result={stage3Result} onClick={onClick} />;
    case 4:
      return <Stage4Card stage={stage} result={stage4Result} onClick={onClick} />;
    default:
      return null;
  }
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
// Stage1Card - 기본 성향
// ============================================================================

function Stage1Card({ stage, onClick }: { stage: StageData; onClick?: () => void }) {
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
    <button
      onClick={onClick}
      className="w-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200 text-left transition-all hover:shadow-md"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-gray-900">{stage.title}</div>
            <div className="text-sm text-purple-600">
              {insight?.testResults.length || 0}개 테스트 완료
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      {/* 상위 태그 */}
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
    </button>
  );
}

// ============================================================================
// Stage2Card - 성격 조합
// ============================================================================

function Stage2Card({
  stage,
  rules,
  onClick,
}: {
  stage: StageData;
  rules: Stage2Rule[] | null;
  onClick?: () => void;
}) {
  const topRule = rules?.[0];

  return (
    <button
      onClick={onClick}
      className="w-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200 text-left transition-all hover:shadow-md"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-gray-900">{stage.title}</div>
            <div className="text-sm text-blue-600">{rules?.length || 0}개 패턴 발견</div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      {/* 상위 룰 표시 */}
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
    </button>
  );
}

// ============================================================================
// Stage3Card - 판단 스타일
// ============================================================================

function Stage3Card({
  stage,
  result,
  onClick,
}: {
  stage: StageData;
  result: DecisionStyleResult | null;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200 text-left transition-all hover:shadow-md"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-gray-900">{stage.title}</div>
            <div className="text-sm text-amber-600">
              {result?.profile.nameKr || '분석 중...'}
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      {/* 프로필 표시 */}
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
    </button>
  );
}

// ============================================================================
// Stage4Card - 관심사 지도
// ============================================================================

function Stage4Card({
  stage,
  result,
  onClick,
}: {
  stage: StageData;
  result: InterestMapResult | null;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-4 border border-green-200 text-left transition-all hover:shadow-md"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
            <Map className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-gray-900">{stage.title}</div>
            <div className="text-sm text-green-600">
              {result?.interestProfile.nameKr || '분석 중...'}
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      {/* 관심사 바 차트 */}
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
    </button>
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

  const stageEmojis: Record<number, string> = {
    1: '🧠',
    2: '🔗',
    3: '⚖️',
    4: '🗺️',
    5: '💕',
    6: '🔮',
  };

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          <span className="font-bold">다음 인사이트</span>
        </div>
        <span className="text-2xl">{stageEmojis[progress.nextStage] || '✨'}</span>
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
