'use client';

import { useState, useEffect } from 'react';
import { Brain, ChevronRight, type LucideIcon } from 'lucide-react';
import { insightService } from '@/services/InsightService';

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

interface InsightStage1Props {
  config: StageConfig;
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
// InsightStage1 - 기본 성향
// ============================================================================

export default function InsightStage1({ config, onClick }: InsightStage1Props) {
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
              className="px-2.5 py-1 bg-slate-50/80 rounded-full text-xs font-medium text-purple-700"
            >
              {tag.tag} {tag.percentage}%
            </span>
          ))}
        </div>
      )}
    </InsightStageCard>
  );
}
