'use client';

import { useState, useEffect } from 'react';
import {
  Target,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Play,
  Brain,
  Heart,
  Coffee,
  Users,
  TrendingUp,
  Clipboard,
} from 'lucide-react';

// ============================================================================
// 목표 데이터 (content-plan.ts와 동기화)
// ============================================================================

interface ContentGoal {
  tag: string;
  target: number;
  contentType: string;
  category: string;
  description: string;
}

interface StageGoals {
  stage: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  goals: ContentGoal[];
}

const STAGE_GOALS: StageGoals[] = [
  {
    stage: 4,
    name: '관심사 지도',
    description: '다양한 관심사 태그를 수집하여 사용자 관심사 지도 생성',
    icon: <Sparkles className="w-5 h-5" />,
    goals: [
      { tag: 'interest-cat', target: 5, contentType: 'vs-poll', category: 'cat', description: '고양이 VS Poll 5개' },
      { tag: 'interest-dog', target: 5, contentType: 'vs-poll', category: 'dog', description: '강아지 VS Poll 5개' },
      { tag: 'interest-coffee', target: 5, contentType: 'vs-poll', category: 'coffee', description: '커피 VS Poll 5개' },
      { tag: 'interest-travel', target: 5, contentType: 'vs-poll', category: 'travel', description: '여행 VS Poll 5개' },
      { tag: 'interest-money', target: 5, contentType: 'vs-poll', category: 'money', description: '재테크 VS Poll 5개' },
    ],
  },
  {
    stage: 5,
    name: '관계 패턴',
    description: '관계 스타일 태그를 수집하여 대인관계 패턴 분석',
    icon: <Heart className="w-5 h-5" />,
    goals: [
      { tag: 'compromising', target: 3, contentType: 'situation-reaction', category: 'relationship', description: '타협 반응 상황반응 3개' },
      { tag: 'self-first', target: 3, contentType: 'vs-poll', category: 'lifestyle', description: '자기우선 VS Poll 3개' },
      { tag: 'other-first', target: 3, contentType: 'vs-poll', category: 'love', description: '타인배려 VS Poll 3개' },
      { tag: 'competing', target: 3, contentType: 'situation-reaction', category: 'work', description: '경쟁 반응 상황반응 3개' },
      { tag: 'diplomatic', target: 3, contentType: 'situation-reaction', category: 'social', description: '외교적 반응 상황반응 3개' },
    ],
  },
];

// 현재 태그 사용량 (실제로는 스크립트에서 가져옴)
const CURRENT_USAGE: Record<string, Record<string, number>> = {
  interest: {
    'interest-love': 20,
    'interest-lifestyle': 178,
    'interest-cat': 0,
    'interest-dog': 0,
    'interest-coffee': 0,
    'interest-travel': 0,
    'interest-money': 0,
  },
  relationship: {
    'assertive': 10,
    'close-bonding': 9,
    'space-needing': 9,
    'accommodating': 6,
    'avoiding': 2,
    'collaborating': 2,
    'competing': 2,
    'diplomatic': 1,
    'compromising': 0,
    'self-first': 0,
    'other-first': 0,
  },
};

// ============================================================================
// Component
// ============================================================================

export default function TagCoverage() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const getCurrentUsage = (tag: string): number => {
    const category = tag.startsWith('interest-') ? 'interest' : 'relationship';
    return CURRENT_USAGE[category]?.[tag] || 0;
  };

  const getGoalStatus = (goal: ContentGoal): 'done' | 'partial' | 'none' => {
    const current = getCurrentUsage(goal.tag);
    if (current >= goal.target) return 'done';
    if (current > 0) return 'partial';
    return 'none';
  };

  const getStageProgress = (stage: StageGoals): { completed: number; total: number; percentage: number } => {
    const completed = stage.goals.filter(g => getGoalStatus(g) === 'done').length;
    return {
      completed,
      total: stage.goals.length,
      percentage: Math.round((completed / stage.goals.length) * 100),
    };
  };

  const generateCommand = (goal: ContentGoal): string => {
    const remaining = goal.target - getCurrentUsage(goal.tag);
    if (remaining <= 0) return '';
    return `${goal.category} ${goal.contentType} ${remaining}개 만들어줘 (${goal.tag} 태그 필수)`;
  };

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const getNextAction = (): ContentGoal | null => {
    for (const stage of STAGE_GOALS) {
      for (const goal of stage.goals) {
        if (getGoalStatus(goal) !== 'done') {
          return goal;
        }
      }
    }
    return null;
  };

  const nextAction = getNextAction();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[var(--db-text)] flex items-center gap-2">
          <Target className="w-6 h-6 text-[var(--db-brand)]" />
          콘텐츠 생성 목표
        </h2>
        <p className="text-sm text-[var(--db-muted)] mt-1">
          인사이트 Stage 해금을 위한 콘텐츠 생성 계획
        </p>
      </div>

      {/* 다음 작업 추천 */}
      {nextAction && (
        <div className="db-card p-4 border-2 border-[var(--db-brand)]/50 bg-[var(--db-brand)]/5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--db-brand)]/20 flex items-center justify-center">
                <Play className="w-5 h-5 text-[var(--db-brand)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--db-text)]">📋 다음 작업</h3>
                <p className="text-xs text-[var(--db-muted)] mt-1">{nextAction.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <code className="px-2 py-1 bg-[var(--db-panel)] rounded text-xs text-[var(--db-text)]">
                    {generateCommand(nextAction)}
                  </code>
                  <button
                    onClick={() => copyCommand(generateCommand(nextAction))}
                    className="p-1.5 rounded hover:bg-[var(--db-panel)] transition-colors"
                    title="복사"
                  >
                    <Clipboard className={`w-4 h-4 ${copiedCommand === generateCommand(nextAction) ? 'text-green-400' : 'text-[var(--db-muted)]'}`} />
                  </button>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-[var(--db-muted)]">남은 수량</span>
              <div className="text-2xl font-bold text-[var(--db-brand)]">
                {nextAction.target - getCurrentUsage(nextAction.tag)}개
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage별 목표 */}
      {STAGE_GOALS.map((stage) => {
        const progress = getStageProgress(stage);
        const isComplete = progress.percentage === 100;

        return (
          <div key={stage.stage} className="db-card overflow-hidden">
            {/* Stage Header */}
            <div className={`p-4 ${isComplete ? 'bg-green-500/10' : 'bg-[var(--db-panel)]'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isComplete ? 'bg-green-500/20 text-green-400' : 'bg-[var(--db-brand)]/20 text-[var(--db-brand)]'
                  }`}>
                    {stage.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--db-text)] flex items-center gap-2">
                      Stage {stage.stage}: {stage.name}
                      {isComplete && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                    </h3>
                    <p className="text-xs text-[var(--db-muted)]">{stage.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${isComplete ? 'text-green-400' : 'text-[var(--db-text)]'}`}>
                    {progress.percentage}%
                  </div>
                  <div className="text-xs text-[var(--db-muted)]">
                    {progress.completed}/{progress.total} 완료
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 h-2 bg-[var(--db-border)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isComplete ? 'bg-green-500' : 'bg-[var(--db-brand)]'}`}
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>

            {/* Goals List */}
            <div className="divide-y divide-[var(--db-border)]">
              {stage.goals.map((goal) => {
                const status = getGoalStatus(goal);
                const current = getCurrentUsage(goal.tag);
                const remaining = goal.target - current;
                const command = generateCommand(goal);

                return (
                  <div
                    key={goal.tag}
                    className={`p-4 ${status === 'done' ? 'bg-green-500/5' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {status === 'done' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : status === 'partial' ? (
                          <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[var(--db-text)]">{goal.tag}</span>
                            <span className={`px-1.5 py-0.5 rounded text-xs ${
                              status === 'done' ? 'bg-green-500/20 text-green-400' :
                              status === 'partial' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {current}/{goal.target}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--db-muted)] mt-0.5">{goal.description}</p>
                        </div>
                      </div>

                      {status !== 'done' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyCommand(command)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--db-panel)] hover:bg-[var(--db-border)] rounded-lg text-xs text-[var(--db-text)] transition-colors"
                          >
                            {copiedCommand === command ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                                복사됨
                              </>
                            ) : (
                              <>
                                <Clipboard className="w-3.5 h-3.5" />
                                명령어 복사
                              </>
                            )}
                          </button>
                          <span className="text-sm font-medium text-red-400">{remaining}개 필요</span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2 h-1.5 bg-[var(--db-border)] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          status === 'done' ? 'bg-green-500' :
                          status === 'partial' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, (current / goal.target) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* 워크플로우 안내 */}
      <div className="db-card p-4">
        <h3 className="text-sm font-semibold text-[var(--db-text)] mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[var(--db-brand)]" />
          콘텐츠 생성 워크플로우
        </h3>
        <div className="space-y-2 text-sm text-[var(--db-muted)]">
          <div className="flex items-start gap-2">
            <span className="text-[var(--db-brand)] font-bold">1.</span>
            <span>이 대시보드에서 <strong className="text-[var(--db-text)]">다음 작업</strong> 확인</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[var(--db-brand)] font-bold">2.</span>
            <span><strong className="text-[var(--db-text)]">명령어 복사</strong> 버튼 클릭 → Claude에게 요청</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[var(--db-brand)] font-bold">3.</span>
            <span>콘텐츠 생성 완료 후 <code className="px-1 py-0.5 bg-[var(--db-panel)] rounded text-xs">node scripts/analyze-tag-coverage.mjs</code> 실행</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[var(--db-brand)] font-bold">4.</span>
            <span>대시보드 새로고침하여 진행률 확인</span>
          </div>
        </div>
      </div>
    </div>
  );
}
