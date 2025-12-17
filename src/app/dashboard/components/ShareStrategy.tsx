'use client';

import { useState } from 'react';
import {
  Share2,
  MessageCircle,
  Image,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  Smartphone,
  Link2,
  Download,
  ExternalLink,
  Target,
  Zap,
  TrendingUp,
  Eye,
} from 'lucide-react';
import {
  SHARE_STRATEGY,
  ShareTask,
} from '../data/share-strategy';

// ============================================================================
// Phase Icons
// ============================================================================

const PHASE_ICONS: Record<string, React.ReactNode> = {
  'phase-0': <CheckCircle2 className="w-5 h-5" />,
  'phase-1': <MessageCircle className="w-5 h-5" />,
  'phase-2': <Image className="w-5 h-5" />,
  'phase-3': <BarChart3 className="w-5 h-5" />,
};

// ============================================================================
// Status Badge Component
// ============================================================================

function StatusBadge({ status }: { status: string }) {
  const config = {
    done: { bg: 'rgba(124, 255, 138, 0.15)', color: 'var(--db-ok)', label: '완료' },
    in_progress: { bg: 'rgba(255, 214, 102, 0.15)', color: 'var(--db-warning)', label: '진행중' },
    planned: { bg: 'rgba(122, 162, 255, 0.15)', color: 'var(--db-brand)', label: '예정' },
    blocked: { bg: 'rgba(255, 107, 129, 0.15)', color: 'var(--db-danger)', label: '대기' },
  }[status] || { bg: 'rgba(122, 162, 255, 0.15)', color: 'var(--db-muted)', label: status };

  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
}

// ============================================================================
// Priority Badge Component
// ============================================================================

function PriorityBadge({ priority }: { priority: string }) {
  const config = {
    high: { bg: 'rgba(255, 107, 129, 0.15)', color: 'var(--db-danger)', label: '높음' },
    medium: { bg: 'rgba(255, 214, 102, 0.15)', color: 'var(--db-warning)', label: '중간' },
    low: { bg: 'rgba(122, 162, 255, 0.15)', color: 'var(--db-muted)', label: '낮음' },
  }[priority] || { bg: 'rgba(122, 162, 255, 0.15)', color: 'var(--db-muted)', label: priority };

  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
}

// ============================================================================
// Impact Badge Component
// ============================================================================

function ImpactBadge({ impact }: { impact: string }) {
  const config = {
    high: { bg: 'rgba(124, 255, 138, 0.15)', color: 'var(--db-ok)', label: '높음' },
    medium: { bg: 'rgba(255, 214, 102, 0.15)', color: 'var(--db-warning)', label: '중간' },
    low: { bg: 'rgba(122, 162, 255, 0.15)', color: 'var(--db-muted)', label: '낮음' },
  }[impact] || { bg: 'rgba(122, 162, 255, 0.15)', color: 'var(--db-muted)', label: impact };

  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function ShareStrategy() {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'platforms' | 'specs' | 'impact'>('roadmap');
  const [activePhase, setActivePhase] = useState<string>('phase-1');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2">
        {[
          { key: 'roadmap', label: '로드맵', icon: <Target className="w-4 h-4" /> },
          { key: 'platforms', label: '플랫폼 전략', icon: <Share2 className="w-4 h-4" /> },
          { key: 'specs', label: '이미지 스펙', icon: <Image className="w-4 h-4" /> },
          { key: 'impact', label: '효과 분석', icon: <TrendingUp className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-[var(--db-brand)] text-[#081023]'
                : 'bg-[var(--db-panel)] text-[var(--db-muted)] hover:text-[var(--db-text)]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'roadmap' && (
        <RoadmapTab activePhase={activePhase} setActivePhase={setActivePhase} />
      )}
      {activeTab === 'platforms' && <PlatformsTab />}
      {activeTab === 'specs' && <ImageSpecsTab />}
      {activeTab === 'impact' && <ImpactTab />}
    </div>
  );
}

// ============================================================================
// Roadmap Tab
// ============================================================================

function RoadmapTab({
  activePhase,
  setActivePhase,
}: {
  activePhase: string;
  setActivePhase: (phase: string) => void;
}) {
  const { roadmap } = SHARE_STRATEGY;
  const currentPhase = roadmap.find((p) => p.id === activePhase);

  // 진행 상황 계산
  const totalTasks = roadmap.reduce((sum, phase) => sum + phase.tasks.length, 0);
  const doneTasks = roadmap.reduce(
    (sum, phase) => sum + phase.tasks.filter((t) => t.status === 'done').length,
    0
  );
  const progressPercent = Math.round((doneTasks / totalTasks) * 100);

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">공유 기능 진행 현황</h3>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="h-3 rounded-full bg-[var(--db-panel)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progressPercent}%`,
                    background: 'linear-gradient(90deg, var(--db-brand), var(--db-brand2))',
                  }}
                />
              </div>
            </div>
            <span className="text-sm font-medium text-[var(--db-text)]">
              {doneTasks}/{totalTasks} ({progressPercent}%)
            </span>
          </div>

          {/* Phase Pills */}
          <div className="flex gap-2 flex-wrap">
            {roadmap.map((phase) => {
              const phaseDone = phase.tasks.filter((t) => t.status === 'done').length;
              const phaseTotal = phase.tasks.length;
              const isComplete = phaseDone === phaseTotal;

              return (
                <button
                  key={phase.id}
                  onClick={() => setActivePhase(phase.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    activePhase === phase.id
                      ? 'bg-[var(--db-brand)] text-[#081023]'
                      : 'bg-[var(--db-panel)] text-[var(--db-muted)] hover:text-[var(--db-text)]'
                  }`}
                >
                  {PHASE_ICONS[phase.id]}
                  <span>{phase.name}</span>
                  {isComplete && <CheckCircle2 className="w-4 h-4" />}
                  {!isComplete && (
                    <span className="text-xs opacity-70">
                      {phaseDone}/{phaseTotal}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Phase Detail */}
      {currentPhase && (
        <div className="db-card">
          <div className="db-card-header px-5 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[var(--db-text)] flex items-center gap-2">
                {PHASE_ICONS[currentPhase.id]}
                {currentPhase.name}
              </h3>
              <p className="text-sm text-[var(--db-muted)] mt-1">{currentPhase.description}</p>
            </div>
            <StatusBadge status={currentPhase.status} />
          </div>
          <div className="p-5 space-y-3">
            {currentPhase.tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* 3초 훅 원칙 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)] flex items-center gap-2">
            <Eye className="w-5 h-5 text-[var(--db-brand)]" />
            3초 훅 원칙
          </h3>
          <p className="text-sm text-[var(--db-muted)] mt-1">
            공유 이미지가 3초 안에 시선을 끌어야 합니다
          </p>
        </div>
        <div className="p-5">
          <div className="flex gap-4">
            {SHARE_STRATEGY.hookPrinciple.map((hook, idx) => (
              <div
                key={idx}
                className="flex-1 p-4 rounded-xl"
                style={{ background: 'rgba(122, 162, 255, 0.08)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[var(--db-muted)]">{hook.position}</span>
                  <span className="text-xs font-bold text-[var(--db-brand)]">{hook.percent}</span>
                </div>
                <p className="text-sm font-medium text-[var(--db-text)] mb-1">{hook.content}</p>
                <p className="text-xs text-[var(--db-muted)]">예: {hook.example}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Task Card Component
// ============================================================================

function TaskCard({ task }: { task: ShareTask }) {
  const ownerLabel = {
    ai: '🤖 AI',
    user: '👤 사용자',
    both: '🤝 협업',
  }[task.owner];

  const statusIcon = {
    done: <CheckCircle2 className="w-4 h-4 text-[var(--db-ok)]" />,
    in_progress: <Clock className="w-4 h-4 text-[var(--db-warning)]" />,
    planned: <Target className="w-4 h-4 text-[var(--db-brand)]" />,
    blocked: <AlertCircle className="w-4 h-4 text-[var(--db-danger)]" />,
  }[task.status];

  return (
    <div
      className="p-4 rounded-xl flex items-start gap-4"
      style={{ background: 'rgba(122, 162, 255, 0.05)' }}
    >
      <div className="mt-0.5">{statusIcon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-[var(--db-text)]">{task.task}</span>
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
        <p className="text-sm text-[var(--db-muted)] mb-2">{task.description}</p>
        <div className="flex items-center gap-4 text-xs text-[var(--db-muted)]">
          <span>{ownerLabel}</span>
          {task.blockedBy && (
            <span className="text-[var(--db-danger)]">
              ⛔ {task.blockedBy} 완료 필요
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Platforms Tab
// ============================================================================

function PlatformsTab() {
  const { platforms } = SHARE_STRATEGY;

  const methodIcons: Record<string, React.ReactNode> = {
    sdk: <Smartphone className="w-4 h-4" />,
    link: <Link2 className="w-4 h-4" />,
    image: <Download className="w-4 h-4" />,
    manual: <ExternalLink className="w-4 h-4" />,
  };

  const methodLabels: Record<string, string> = {
    sdk: 'SDK 연동',
    link: '링크 공유',
    image: '이미지 다운로드',
    manual: '수동 업로드',
  };

  return (
    <div className="space-y-6">
      {/* Platform Cards */}
      <div className="grid grid-cols-2 gap-4">
        {platforms.map((platform) => (
          <div key={platform.platform} className="db-card">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{platform.icon}</span>
                  <div>
                    <h3 className="font-semibold text-[var(--db-text)]">{platform.platform}</h3>
                    <p className="text-xs text-[var(--db-muted)]">우선순위 #{platform.priority}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    platform.implemented
                      ? 'bg-[rgba(124,255,138,0.15)] text-[var(--db-ok)]'
                      : 'bg-[rgba(255,214,102,0.15)] text-[var(--db-warning)]'
                  }`}
                >
                  {platform.implemented ? '구현됨' : '미구현'}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--db-muted)]">타겟:</span>
                  <span className="text-[var(--db-text)]">{platform.targetAudience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--db-muted)]">포맷:</span>
                  <span className="text-[var(--db-text)]">{platform.contentFormat}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--db-muted)]">최적 시간:</span>
                  <span className="text-[var(--db-text)]">{platform.bestTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--db-muted)]">공유 방식:</span>
                  <span className="flex items-center gap-1 text-[var(--db-brand)]">
                    {methodIcons[platform.shareMethod]}
                    {methodLabels[platform.shareMethod]}
                  </span>
                </div>
              </div>

              <div
                className="mt-4 p-3 rounded-lg text-xs text-[var(--db-muted)]"
                style={{ background: 'rgba(122, 162, 255, 0.05)' }}
              >
                💡 {platform.notes}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Image Specs Tab
// ============================================================================

function ImageSpecsTab() {
  const { imageSpecs } = SHARE_STRATEGY;

  return (
    <div className="space-y-6">
      {/* Spec Cards */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">이미지 비율 스펙</h3>
          <p className="text-sm text-[var(--db-muted)] mt-1">
            플랫폼별 최적 이미지 크기
          </p>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-5 gap-4">
            {imageSpecs.map((spec) => (
              <div
                key={spec.param}
                className={`p-4 rounded-xl text-center ${
                  spec.implemented
                    ? 'border-2 border-[var(--db-ok)]'
                    : ''
                }`}
                style={{ background: 'rgba(122, 162, 255, 0.08)' }}
              >
                {/* Visual Ratio Preview */}
                <div className="flex justify-center mb-3">
                  <div
                    className="bg-[var(--db-brand)] rounded"
                    style={{
                      width: spec.ratio === '9:16' ? 30 : spec.ratio === '1:1' ? 40 : 50,
                      height: spec.ratio === '9:16' ? 53 : spec.ratio === '1:1' ? 40 : spec.ratio === '3:4' ? 53 : 26,
                      opacity: spec.implemented ? 1 : 0.5,
                    }}
                  />
                </div>
                <h4 className="font-semibold text-[var(--db-text)] mb-1">{spec.name}</h4>
                <p className="text-xs text-[var(--db-brand)] font-mono mb-1">{spec.ratio}</p>
                <p className="text-xs text-[var(--db-muted)] mb-2">
                  {spec.width}×{spec.height}
                </p>
                <p className="text-xs text-[var(--db-muted)]">{spec.usage}</p>
                {spec.implemented && (
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs bg-[rgba(124,255,138,0.15)] text-[var(--db-ok)]">
                    구현됨
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* API Endpoint Preview */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">API 엔드포인트 (예정)</h3>
        </div>
        <div className="p-5 space-y-3">
          <div
            className="p-4 rounded-xl font-mono text-sm"
            style={{ background: 'rgba(0,0,0,0.3)' }}
          >
            <p className="text-[var(--db-muted)] mb-2"># 테스트 결과 OG 이미지</p>
            <p className="text-[var(--db-text)]">
              GET /api/og/result?subject=<span className="text-[var(--db-brand)]">dog</span>&result=<span className="text-[var(--db-brand)]">golden</span>&ratio=<span className="text-[var(--db-warning)]">default</span>
            </p>
          </div>
          <div
            className="p-4 rounded-xl font-mono text-sm"
            style={{ background: 'rgba(0,0,0,0.3)' }}
          >
            <p className="text-[var(--db-muted)] mb-2"># VS 투표 결과 이미지</p>
            <p className="text-[var(--db-text)]">
              GET /api/og/vs-poll?optionA=<span className="text-[var(--db-brand)]">강아지</span>&optionB=<span className="text-[var(--db-brand)]">고양이</span>&voteA=<span className="text-[var(--db-warning)]">62</span>&voteB=<span className="text-[var(--db-warning)]">38</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Impact Tab
// ============================================================================

function ImpactTab() {
  const { viralImpact } = SHARE_STRATEGY;

  return (
    <div className="space-y-6">
      {/* Impact Analysis */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">바이럴 효과 분석</h3>
          <p className="text-sm text-[var(--db-muted)] mt-1">
            기능 구현 전후 예상 효과
          </p>
        </div>
        <div className="p-5 space-y-4">
          {viralImpact.map((item) => (
            <div
              key={item.feature}
              className="p-4 rounded-xl"
              style={{ background: 'rgba(122, 162, 255, 0.05)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-[var(--db-text)]">{item.feature}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--db-muted)]">효과:</span>
                  <ImpactBadge impact={item.impact} />
                  <span className="text-xs text-[var(--db-muted)]">난이도:</span>
                  <ImpactBadge impact={item.effort} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-[rgba(255,107,129,0.1)]">
                  <p className="text-xs text-[var(--db-danger)] mb-1">현재 상태</p>
                  <p className="text-sm text-[var(--db-text)]">{item.currentState}</p>
                </div>
                <div className="p-3 rounded-lg bg-[rgba(124,255,138,0.1)]">
                  <p className="text-xs text-[var(--db-ok)] mb-1">구현 후</p>
                  <p className="text-sm text-[var(--db-text)]">{item.afterImplement}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Matrix */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">우선순위 매트릭스</h3>
          <p className="text-sm text-[var(--db-muted)] mt-1">
            효과 대비 난이도 분석
          </p>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-3 gap-1" style={{ height: 200 }}>
            {/* 효과 높음 / 난이도 낮음 - 최우선 */}
            <div className="col-start-1 row-start-1 p-3 rounded-tl-xl bg-[rgba(124,255,138,0.15)] flex flex-col">
              <span className="text-xs text-[var(--db-ok)] font-medium mb-2">🎯 최우선</span>
              {viralImpact
                .filter((i) => i.impact === 'high' && i.effort === 'low')
                .map((i) => (
                  <span key={i.feature} className="text-xs text-[var(--db-text)]">• {i.feature}</span>
                ))}
            </div>
            {/* 효과 높음 / 난이도 중간 */}
            <div className="col-start-2 row-start-1 p-3 bg-[rgba(255,214,102,0.15)] flex flex-col">
              <span className="text-xs text-[var(--db-warning)] font-medium mb-2">⚡ 중요</span>
              {viralImpact
                .filter((i) => i.impact === 'high' && i.effort === 'medium')
                .map((i) => (
                  <span key={i.feature} className="text-xs text-[var(--db-text)]">• {i.feature}</span>
                ))}
            </div>
            {/* 효과 높음 / 난이도 높음 */}
            <div className="col-start-3 row-start-1 p-3 rounded-tr-xl bg-[rgba(122,162,255,0.15)] flex flex-col">
              <span className="text-xs text-[var(--db-brand)] font-medium mb-2">📋 계획</span>
              {viralImpact
                .filter((i) => i.impact === 'high' && i.effort === 'high')
                .map((i) => (
                  <span key={i.feature} className="text-xs text-[var(--db-text)]">• {i.feature}</span>
                ))}
            </div>
            {/* 효과 중간 / 난이도 낮음 */}
            <div className="col-start-1 row-start-2 p-3 bg-[rgba(124,255,138,0.08)] flex flex-col">
              <span className="text-xs text-[var(--db-ok)] font-medium opacity-70 mb-2">✓ 빠른 개선</span>
              {viralImpact
                .filter((i) => i.impact === 'medium' && i.effort === 'low')
                .map((i) => (
                  <span key={i.feature} className="text-xs text-[var(--db-text)]">• {i.feature}</span>
                ))}
            </div>
            {/* 효과 중간 / 난이도 중간 */}
            <div className="col-start-2 row-start-2 p-3 bg-[rgba(255,214,102,0.08)] flex flex-col">
              <span className="text-xs text-[var(--db-warning)] font-medium opacity-70 mb-2">~ 검토</span>
              {viralImpact
                .filter((i) => i.impact === 'medium' && i.effort === 'medium')
                .map((i) => (
                  <span key={i.feature} className="text-xs text-[var(--db-text)]">• {i.feature}</span>
                ))}
            </div>
            {/* 효과 중간 / 난이도 높음 */}
            <div className="col-start-3 row-start-2 p-3 bg-[rgba(122,162,255,0.08)] flex flex-col">
              <span className="text-xs text-[var(--db-muted)] font-medium mb-2">? 보류</span>
              {viralImpact
                .filter((i) => i.impact === 'medium' && i.effort === 'high')
                .map((i) => (
                  <span key={i.feature} className="text-xs text-[var(--db-text)]">• {i.feature}</span>
                ))}
            </div>
            {/* Labels */}
            <div className="col-start-1 row-start-3 p-2 rounded-bl-xl bg-[var(--db-panel)] flex items-center justify-center">
              <span className="text-xs text-[var(--db-muted)]">난이도 낮음</span>
            </div>
            <div className="col-start-2 row-start-3 p-2 bg-[var(--db-panel)] flex items-center justify-center">
              <span className="text-xs text-[var(--db-muted)]">난이도 중간</span>
            </div>
            <div className="col-start-3 row-start-3 p-2 rounded-br-xl bg-[var(--db-panel)] flex items-center justify-center">
              <span className="text-xs text-[var(--db-muted)]">난이도 높음</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Wins */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)] flex items-center gap-2">
            <Zap className="w-5 h-5 text-[var(--db-warning)]" />
            Quick Wins (빠른 개선)
          </h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 gap-4">
            {viralImpact
              .filter((i) => i.impact === 'high' && i.effort === 'low')
              .map((item) => (
                <div
                  key={item.feature}
                  className="p-4 rounded-xl border-2 border-[var(--db-ok)]"
                  style={{ background: 'rgba(124, 255, 138, 0.05)' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-[var(--db-ok)]" />
                    <span className="font-semibold text-[var(--db-text)]">{item.feature}</span>
                  </div>
                  <p className="text-sm text-[var(--db-muted)]">
                    <span className="text-[var(--db-danger)]">{item.currentState}</span>
                    {' → '}
                    <span className="text-[var(--db-ok)]">{item.afterImplement}</span>
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
