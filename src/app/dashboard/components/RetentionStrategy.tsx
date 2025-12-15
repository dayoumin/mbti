'use client';

import { useState } from 'react';
import {
  Target,
  Zap,
  TrendingUp,
  Bell,
  Flame,
  Trophy,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  BarChart3,
  Calendar,
} from 'lucide-react';
import {
  RETENTION_STRATEGY,
  RETENTION_PRINCIPLES,
  RetentionTactic,
  RetentionPhase,
} from '../data/retention-strategy';

// ============================================================================
// Main Component
// ============================================================================

export default function RetentionStrategy() {
  const [activeTab, setActiveTab] = useState<'principles' | 'phases' | 'metrics' | 'triggers'>('principles');
  const [activePhase, setActivePhase] = useState<string>('phase-1');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'principles', label: '핵심 원칙', icon: <Target className="w-4 h-4" /> },
          { key: 'phases', label: 'Phase별 전략', icon: <Zap className="w-4 h-4" /> },
          { key: 'metrics', label: '지표 정의', icon: <TrendingUp className="w-4 h-4" /> },
          { key: 'triggers', label: '알림/넛지', icon: <Bell className="w-4 h-4" /> },
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
      {activeTab === 'principles' && <PrinciplesTab />}
      {activeTab === 'phases' && (
        <PhasesTab activePhase={activePhase} setActivePhase={setActivePhase} />
      )}
      {activeTab === 'metrics' && <MetricsTab />}
      {activeTab === 'triggers' && <TriggersTab />}
    </div>
  );
}

// ============================================================================
// Principles Tab
// ============================================================================

function PrinciplesTab() {
  return (
    <div className="space-y-6">
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">리텐션 핵심 원칙</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {RETENTION_PRINCIPLES.map((principle) => (
            <div
              key={principle.id}
              className="p-4 rounded-xl"
              style={{ background: 'rgba(122, 162, 255, 0.08)' }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{principle.icon}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-[var(--db-text)] mb-1">{principle.title}</h4>
                  <p className="text-sm text-[var(--db-muted)] mb-3">{principle.description}</p>
                  <ul className="space-y-1">
                    {principle.details.map((detail, i) => (
                      <li key={i} className="text-xs text-[var(--db-muted)] flex items-start gap-2">
                        <span className="text-[var(--db-brand)]">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Summary */}
      <div className="db-card p-5">
        <h3 className="font-semibold text-[var(--db-text)] mb-4">핵심 요약</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-emerald-500/10">
            <Flame className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
            <p className="text-sm font-bold text-[var(--db-text)]">습관 형성</p>
            <p className="text-xs text-[var(--db-muted)]">매일 1분 액션</p>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/10">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-amber-400" />
            <p className="text-sm font-bold text-[var(--db-text)]">가변 보상</p>
            <p className="text-xs text-[var(--db-muted)]">예측 불가 보상</p>
          </div>
          <div className="p-4 rounded-xl bg-rose-500/10">
            <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-rose-400" />
            <p className="text-sm font-bold text-[var(--db-text)]">손실 회피</p>
            <p className="text-xs text-[var(--db-muted)]">스트릭 끊김 경고</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Phases Tab
// ============================================================================

function PhasesTab({
  activePhase,
  setActivePhase,
}: {
  activePhase: string;
  setActivePhase: (phase: string) => void;
}) {
  const phases = RETENTION_STRATEGY.phases;
  const currentPhase = phases.find((p) => p.id === activePhase) || phases[0];

  return (
    <div className="space-y-6">
      {/* Phase Selector */}
      <div className="flex gap-2 flex-wrap">
        {phases.map((phase) => (
          <button
            key={phase.id}
            onClick={() => setActivePhase(phase.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activePhase === phase.id
                ? 'bg-emerald-500 text-white'
                : 'bg-[var(--db-panel)] text-[var(--db-muted)] hover:text-[var(--db-text)]'
            }`}
          >
            {phase.title}
          </button>
        ))}
      </div>

      {/* Phase Header */}
      <div className="db-card p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[var(--db-text)]">{currentPhase.title}</h3>
            <p className="text-sm text-[var(--db-muted)]">{currentPhase.description}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--db-muted)]">기간</p>
            <p className="font-bold text-[var(--db-brand)]">{currentPhase.timeframe}</p>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-emerald-500/10">
          <p className="text-sm text-emerald-400">
            <Target className="w-4 h-4 inline mr-2" />
            목표: {currentPhase.goal}
          </p>
        </div>
      </div>

      {/* Tactics */}
      <div className="space-y-4">
        {currentPhase.tactics.map((tactic) => (
          <TacticCard key={tactic.id} tactic={tactic} />
        ))}
      </div>
    </div>
  );
}

function TacticCard({ tactic }: { tactic: RetentionTactic }) {
  const [expanded, setExpanded] = useState(false);

  const statusColors = {
    done: 'bg-emerald-500/20 text-emerald-400',
    'in-progress': 'bg-amber-500/20 text-amber-400',
    planned: 'bg-blue-500/20 text-blue-400',
    research: 'bg-purple-500/20 text-purple-400',
  };

  const priorityColors = {
    critical: 'text-rose-400',
    high: 'text-amber-400',
    medium: 'text-blue-400',
    low: 'text-gray-400',
  };

  const categoryIcons = {
    daily: <Calendar className="w-4 h-4" />,
    weekly: <Clock className="w-4 h-4" />,
    milestone: <Trophy className="w-4 h-4" />,
    social: <Users className="w-4 h-4" />,
    content: <BarChart3 className="w-4 h-4" />,
  };

  return (
    <div className="db-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-start gap-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-[var(--db-brand)]/20 flex items-center justify-center text-[var(--db-brand)]">
          {categoryIcons[tactic.category]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-[var(--db-text)]">{tactic.name}</h4>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[tactic.status]}`}>
              {tactic.status === 'done' ? '완료' : tactic.status === 'in-progress' ? '진행중' : tactic.status === 'planned' ? '계획' : '연구'}
            </span>
            <span className={`text-xs font-medium ${priorityColors[tactic.priority]}`}>
              {tactic.priority === 'critical' ? '필수' : tactic.priority === 'high' ? '높음' : tactic.priority === 'medium' ? '중간' : '낮음'}
            </span>
          </div>
          <p className="text-sm text-[var(--db-muted)]">{tactic.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-[var(--db-muted)]">노력</p>
            <p className="text-sm font-bold text-[var(--db-text)]">{tactic.effort}/5</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[var(--db-muted)]">영향</p>
            <p className="text-sm font-bold text-emerald-400">{tactic.impact}/5</p>
          </div>
          <ChevronRight
            className={`w-5 h-5 text-[var(--db-muted)] transition-transform ${expanded ? 'rotate-90' : ''}`}
          />
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
          <div>
            <p className="text-xs text-[var(--db-muted)] mb-2">메커니즘</p>
            <p className="text-sm text-[var(--db-text)]">{tactic.mechanism}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--db-muted)] mb-2">구현 상세</p>
            <ul className="space-y-1">
              {tactic.implementation.map((item, i) => (
                <li key={i} className="text-sm text-[var(--db-muted)] flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {tactic.metrics.length > 0 && (
            <div>
              <p className="text-xs text-[var(--db-muted)] mb-2">측정 지표</p>
              <div className="flex flex-wrap gap-2">
                {tactic.metrics.map((metric, i) => (
                  <span key={i} className="px-2 py-1 bg-[var(--db-brand)]/10 text-[var(--db-brand)] text-xs rounded">
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          )}
          {tactic.risks && tactic.risks.length > 0 && (
            <div>
              <p className="text-xs text-[var(--db-muted)] mb-2">리스크</p>
              <ul className="space-y-1">
                {tactic.risks.map((risk, i) => (
                  <li key={i} className="text-sm text-rose-400 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Metrics Tab
// ============================================================================

function MetricsTab() {
  return (
    <div className="space-y-6">
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">리텐션 핵심 지표</h3>
        </div>
        <div className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-xs font-medium text-[var(--db-muted)]">지표</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[var(--db-muted)]">설명</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-[var(--db-muted)]">목표</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-[var(--db-muted)]">벤치마크</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-[var(--db-muted)]">중요도</th>
                </tr>
              </thead>
              <tbody>
                {RETENTION_STRATEGY.metrics.map((metric) => (
                  <tr key={metric.id} className="border-b border-white/5">
                    <td className="py-3 px-4">
                      <span className="font-medium text-[var(--db-text)]">{metric.name}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-[var(--db-muted)]">{metric.description}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-emerald-400">{metric.target}</span>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-[var(--db-muted)]">{metric.benchmark}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          metric.importance === 'critical'
                            ? 'bg-rose-500/20 text-rose-400'
                            : metric.importance === 'high'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {metric.importance === 'critical' ? '핵심' : metric.importance === 'high' ? '높음' : '중간'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Visual Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="db-card p-5 text-center">
          <p className="text-3xl font-black text-emerald-400 mb-1">40%</p>
          <p className="text-sm font-medium text-[var(--db-text)]">D1 목표</p>
          <p className="text-xs text-[var(--db-muted)]">다음날 재방문</p>
        </div>
        <div className="db-card p-5 text-center">
          <p className="text-3xl font-black text-amber-400 mb-1">25%</p>
          <p className="text-sm font-medium text-[var(--db-text)]">D7 목표</p>
          <p className="text-xs text-[var(--db-muted)]">7일 후 재방문</p>
        </div>
        <div className="db-card p-5 text-center">
          <p className="text-3xl font-black text-blue-400 mb-1">15%</p>
          <p className="text-sm font-medium text-[var(--db-text)]">D30 목표</p>
          <p className="text-xs text-[var(--db-muted)]">30일 후 재방문</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Triggers Tab
// ============================================================================

function TriggersTab() {
  return (
    <div className="space-y-6">
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">리텐션 트리거 (알림/넛지)</h3>
        </div>
        <div className="p-5 space-y-4">
          {RETENTION_STRATEGY.triggers.map((trigger) => (
            <div
              key={trigger.id}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--db-brand)]/20 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-[var(--db-brand)]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-[var(--db-text)]">{trigger.name}</h4>
                    <span className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-400">
                      {trigger.channel}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--db-muted)] mb-2">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {trigger.timing}
                  </p>
                  <div className="p-3 rounded-lg bg-black/20 mb-2">
                    <p className="text-sm text-[var(--db-text)]">{trigger.message}</p>
                  </div>
                  <button className="px-3 py-1.5 bg-[var(--db-brand)] text-[#081023] text-xs font-bold rounded-lg">
                    {trigger.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PWA Push Note */}
      <div className="db-card p-5">
        <h3 className="font-semibold text-[var(--db-text)] mb-3">PWA 푸시 알림 동의</h3>
        <div className="space-y-2 text-sm text-[var(--db-muted)]">
          <p>• <strong className="text-amber-400">최적 타이밍</strong>: 첫 테스트 완료 후 결과 화면에서 요청</p>
          <p>• 회원가입 시 요청 ❌ → 전환율 저하</p>
          <p>• 가치를 경험한 후 동의율 2~3배 높음</p>
          <p>• iOS Safari는 PWA 설치 후에만 가능 (2023년~)</p>
        </div>
      </div>
    </div>
  );
}
