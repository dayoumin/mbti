'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { insightService, type UnlockedStage } from '@/services/InsightService';
import { INSIGHT_UNLOCK } from '@/data/gamification/points';

// ============================================================================
// 타입
// ============================================================================

interface StageConfig {
  stage: number;
  title: string;
  subtitle: string;
  emoji: string;
  gradient: string;
  unlockCondition: string;
}

// ============================================================================
// Stage 설정
// ============================================================================

const STAGE_CONFIGS: StageConfig[] = [
  {
    stage: 1,
    title: '기본 성향',
    subtitle: '나의 첫 번째 인사이트',
    emoji: '🌱',
    gradient: 'from-green-400 to-emerald-500',
    unlockCondition: `테스트 ${INSIGHT_UNLOCK.STAGE_1.tests}개 완료`,
  },
  {
    stage: 2,
    title: '성격 조합',
    subtitle: '나만의 조합 발견',
    emoji: '🧩',
    gradient: 'from-blue-400 to-indigo-500',
    unlockCondition: `테스트 ${INSIGHT_UNLOCK.STAGE_2.tests}개 완료`,
  },
  {
    stage: 3,
    title: '판단 스타일',
    subtitle: '의사결정 방식 분석',
    emoji: '⚖️',
    gradient: 'from-purple-400 to-violet-500',
    unlockCondition: `투표 ${INSIGHT_UNLOCK.STAGE_3.polls}개 참여`,
  },
  {
    stage: 4,
    title: '관심사 지도',
    subtitle: '나의 관심 분야',
    emoji: '🗺️',
    gradient: 'from-orange-400 to-red-500',
    unlockCondition: `활동 ${INSIGHT_UNLOCK.STAGE_4.activities}개 완료`,
  },
  {
    stage: 5,
    title: '관계 패턴',
    subtitle: '대인관계 스타일',
    emoji: '💫',
    gradient: 'from-pink-400 to-rose-500',
    unlockCondition: `관계 활동 ${INSIGHT_UNLOCK.STAGE_5.relationshipActivities}개 완료`,
  },
  {
    stage: 6,
    title: '숨은 패턴',
    subtitle: '나도 몰랐던 나',
    emoji: '🔮',
    gradient: 'from-cyan-400 to-teal-500',
    unlockCondition: `활동 ${INSIGHT_UNLOCK.STAGE_6.activities}개 완료`,
  },
];

// ============================================================================
// InsightSection 컴포넌트
// ============================================================================

export default function InsightSection() {
  const [unlockedStages, setUnlockedStages] = useState<number[]>([]);
  const [nextStageProgress, setNextStageProgress] = useState<{
    stage: number;
    current: number;
    required: number;
    type: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // 해금 상태 로드
  useEffect(() => {
    try {
      // 동기 메서드들
      const unlocked = insightService.getUnlockedStages();
      setUnlockedStages(unlocked.map(s => s.stage));

      // 다음 해금까지 진행률 계산
      const stats = insightService.getActivityStats();

      // 해금되지 않은 첫 번째 스테이지 찾기
      for (const config of STAGE_CONFIGS) {
        if (!unlocked.find(u => u.stage === config.stage)) {
          let current = 0;
          let required = 0;
          let type = '';

          switch (config.stage) {
            case 1:
              current = stats.testCount;
              required = INSIGHT_UNLOCK.STAGE_1.tests;
              type = '테스트';
              break;
            case 2:
              current = stats.testCount;
              required = INSIGHT_UNLOCK.STAGE_2.tests;
              type = '테스트';
              break;
            case 3:
              current = stats.pollCount;
              required = INSIGHT_UNLOCK.STAGE_3.polls;
              type = '투표';
              break;
            case 4:
              current = stats.totalActivities;
              required = INSIGHT_UNLOCK.STAGE_4.activities;
              type = '활동';
              break;
            case 5:
              current = stats.relationshipActivities;
              required = INSIGHT_UNLOCK.STAGE_5.relationshipActivities;
              type = '관계 활동';
              break;
            case 6:
              current = stats.totalActivities;
              required = INSIGHT_UNLOCK.STAGE_6.activities;
              type = '활동';
              break;
          }

          setNextStageProgress({ stage: config.stage, current, required, type });
          break;
        }
      }
    } catch (error) {
      console.error('Failed to load insight data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <section className="bg-slate-50 rounded-2xl p-4 md:p-6">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-32 mb-4" />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-square bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 rounded-2xl p-4 md:p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <h2 className="font-bold text-gray-900">인사이트 저니</h2>
        </div>
        <span className="text-sm text-gray-500">
          {unlockedStages.length}/{STAGE_CONFIGS.length} 해금
        </span>
      </div>

      {/* Stage 그리드 */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
        {STAGE_CONFIGS.map(config => {
          const isUnlocked = unlockedStages.includes(config.stage);
          const isNext = nextStageProgress?.stage === config.stage;

          return (
            <button
              key={config.stage}
              className={`relative aspect-square rounded-xl p-2 transition-all ${isUnlocked
                ? `bg-gradient-to-br ${config.gradient} shadow-md hover:shadow-lg hover:scale-105`
                : isNext
                  ? 'bg-gray-100 border-2 border-dashed border-gray-300 hover:border-gray-400'
                  : 'bg-gray-100 opacity-50'
                }`}
              disabled={!isUnlocked && !isNext}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className={`text-2xl mb-1 ${!isUnlocked && 'grayscale'}`}>
                  {config.emoji}
                </span>
                <span
                  className={`text-xs font-medium text-center ${isUnlocked ? 'text-white' : 'text-gray-500'
                    }`}
                >
                  {config.title}
                </span>
              </div>

              {/* 해금됨 표시 */}
              {isUnlocked && (
                <div className="absolute top-1 right-1 w-4 h-4 bg-slate-50 rounded-full flex items-center justify-center">
                  <span className="text-xs">✓</span>
                </div>
              )}

              {/* 다음 해금 진행률 표시 */}
              {isNext && nextStageProgress && (
                <div className="absolute bottom-1 left-1 right-1">
                  <div className="h-1 bg-gray-300 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (nextStageProgress.current / nextStageProgress.required) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 다음 해금 안내 */}
      {nextStageProgress && (
        <div className="bg-indigo-50 rounded-xl p-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-900">
              다음 인사이트: Stage {nextStageProgress.stage}
            </p>
            <p className="text-xs text-indigo-600">
              {nextStageProgress.type} {nextStageProgress.current}/{nextStageProgress.required}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-indigo-400" />
        </div>
      )}

      {/* 모두 해금됨 */}
      {unlockedStages.length === STAGE_CONFIGS.length && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 text-center">
          <p className="text-sm font-medium text-amber-900">
            🎉 모든 인사이트를 해금했어요!
          </p>
        </div>
      )}
    </section>
  );
}
