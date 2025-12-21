'use client';

import { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  Zap,
  Activity,
  Eye,
  Settings,
  FileCheck,
  Rocket,
  Users,
  TrendingUp,
  AlertCircle,
  Bot,
  Play,
  BarChart3,
  Terminal,
} from 'lucide-react';
import {
  OPERATIONS_SYSTEM,
  OperationsCheck,
  MonitoringMetric,
  IncidentResponse,
  Phase,
} from '../data/operations-system';

// ============================================================================
// Status Badge Components
// ============================================================================

function StatusBadge({ status }: { status: string }) {
  const config = {
    ready: { bg: 'rgba(124,255,138,0.15)', color: 'var(--db-ok)', label: '준비됨' },
    partial: { bg: 'rgba(255,214,102,0.15)', color: 'var(--db-warning)', label: '부분' },
    planned: { bg: 'rgba(122,162,255,0.15)', color: 'var(--db-muted)', label: '예정' },
  }[status] || { bg: 'rgba(122,162,255,0.15)', color: 'var(--db-muted)', label: status };

  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const config = {
    critical: { bg: 'rgba(255, 107, 129, 0.2)', color: '#ff6b81', label: '필수' },
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

function PhaseBadge({ phase }: { phase: Phase }) {
  const config = {
    pre_launch: { bg: 'rgba(122,162,255,0.15)', color: 'var(--db-brand)', label: 'Pre-Launch' },
    alpha: { bg: 'rgba(255,214,102,0.15)', color: 'var(--db-warning)', label: 'Alpha' },
    beta: { bg: 'rgba(124,255,138,0.15)', color: 'var(--db-ok)', label: 'Beta' },
    production: { bg: 'rgba(255,107,129,0.15)', color: 'var(--db-danger)', label: 'Production' },
  }[phase];

  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const config = {
    critical: { bg: 'rgba(255, 107, 129, 0.2)', color: '#ff6b81', label: '심각' },
    high: { bg: 'rgba(255, 107, 129, 0.15)', color: 'var(--db-danger)', label: '높음' },
    medium: { bg: 'rgba(255, 214, 102, 0.15)', color: 'var(--db-warning)', label: '중간' },
    low: { bg: 'rgba(122, 162, 255, 0.15)', color: 'var(--db-muted)', label: '낮음' },
  }[severity] || { bg: 'rgba(122, 162, 255, 0.15)', color: 'var(--db-muted)', label: severity };

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

export default function OperationsSystem() {
  const [activeTab, setActiveTab] = useState<'overview' | 'checks' | 'monitoring' | 'incidents' | 'checklist' | 'alpha'>('overview');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'overview', label: '개요', icon: <Shield className="w-4 h-4" /> },
          { key: 'checks', label: '점검 항목', icon: <FileCheck className="w-4 h-4" /> },
          { key: 'monitoring', label: '모니터링', icon: <Activity className="w-4 h-4" /> },
          { key: 'incidents', label: '인시던트', icon: <AlertTriangle className="w-4 h-4" /> },
          { key: 'checklist', label: '체크리스트', icon: <Target className="w-4 h-4" /> },
          { key: 'alpha', label: '알파 가이드', icon: <Rocket className="w-4 h-4" /> },
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
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'checks' && <ChecksTab />}
      {activeTab === 'monitoring' && <MonitoringTab />}
      {activeTab === 'incidents' && <IncidentsTab />}
      {activeTab === 'checklist' && <ChecklistTab />}
      {activeTab === 'alpha' && <AlphaGuideTab />}
    </div>
  );
}

// ============================================================================
// Overview Tab
// ============================================================================

function OverviewTab() {
  const { currentStatus, checks } = OPERATIONS_SYSTEM;

  const categoryStats = {
    automated: checks.filter(c => c.category === 'automated'),
    manual: checks.filter(c => c.category === 'manual'),
    monitoring: checks.filter(c => c.category === 'monitoring'),
    response: checks.filter(c => c.category === 'response'),
  };

  const readyCount = checks.filter(c => c.status === 'ready').length;
  const totalCount = checks.length;
  const progressPercent = Math.round((readyCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Current Phase */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[var(--db-text)] flex items-center gap-2">
              <Rocket className="w-5 h-5 text-[var(--db-brand)]" />
              현재 단계
            </h3>
            <PhaseBadge phase={currentStatus.phase} />
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-4 mb-6">
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
              {readyCount}/{totalCount} 준비됨 ({progressPercent}%)
            </span>
          </div>

          <p className="text-sm text-[var(--db-brand)] font-medium p-3 rounded-lg bg-[rgba(122,162,255,0.1)]">
            💡 {currentStatus.recommendation}
          </p>
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Automated */}
        <div className="db-card">
          <div className="db-card-header px-5 py-4">
            <h3 className="text-base font-semibold text-[var(--db-text)] flex items-center gap-2">
              <Bot className="w-5 h-5 text-[var(--db-ok)]" />
              자동 검증
            </h3>
          </div>
          <div className="p-5">
            <ul className="space-y-2 mb-3">
              {currentStatus.automated.ready.map((item, idx) => (
                <li key={idx} className="text-sm text-[var(--db-text)] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--db-ok)]" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-[var(--db-muted)]">{currentStatus.automated.note}</p>
          </div>
        </div>

        {/* Manual */}
        <div className="db-card">
          <div className="db-card-header px-5 py-4">
            <h3 className="text-base font-semibold text-[var(--db-text)] flex items-center gap-2">
              <Eye className="w-5 h-5 text-[var(--db-warning)]" />
              수동 점검
            </h3>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-[var(--db-muted)] mb-1">준비됨</p>
                <ul className="space-y-1">
                  {currentStatus.manual.ready.map((item, idx) => (
                    <li key={idx} className="text-sm text-[var(--db-text)] flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-[var(--db-ok)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs text-[var(--db-muted)] mb-1">예정</p>
                <ul className="space-y-1">
                  {currentStatus.manual.planned.map((item, idx) => (
                    <li key={idx} className="text-sm text-[var(--db-text)] flex items-center gap-2">
                      <Clock className="w-3 h-3 text-[var(--db-warning)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-xs text-[var(--db-muted)] mt-3">{currentStatus.manual.note}</p>
          </div>
        </div>

        {/* Monitoring */}
        <div className="db-card">
          <div className="db-card-header px-5 py-4">
            <h3 className="text-base font-semibold text-[var(--db-text)] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[var(--db-brand)]" />
              모니터링
            </h3>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-[var(--db-muted)] mb-1">준비됨</p>
                <ul className="space-y-1">
                  {currentStatus.monitoring.ready.map((item, idx) => (
                    <li key={idx} className="text-sm text-[var(--db-text)] flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-[var(--db-ok)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs text-[var(--db-muted)] mb-1">예정</p>
                <ul className="space-y-1">
                  {currentStatus.monitoring.planned.map((item, idx) => (
                    <li key={idx} className="text-sm text-[var(--db-text)] flex items-center gap-2">
                      <Clock className="w-3 h-3 text-[var(--db-warning)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-xs text-[var(--db-muted)] mt-3">{currentStatus.monitoring.note}</p>
          </div>
        </div>

        {/* Category Summary */}
        <div className="db-card">
          <div className="db-card-header px-5 py-4">
            <h3 className="text-base font-semibold text-[var(--db-text)] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[var(--db-brand)]" />
              카테고리별 현황
            </h3>
          </div>
          <div className="p-5 space-y-3">
            {Object.entries(categoryStats).map(([key, items]) => {
              const ready = items.filter(i => i.status === 'ready').length;
              const total = items.length;
              const labels = {
                automated: '자동 검증',
                manual: '수동 점검',
                monitoring: '모니터링',
                response: '대응',
              };

              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-sm text-[var(--db-muted)] w-20">{labels[key as keyof typeof labels]}</span>
                  <div className="flex-1 h-2 rounded-full bg-[var(--db-panel)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--db-brand)]"
                      style={{ width: `${(ready / total) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-[var(--db-text)]">{ready}/{total}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Checks Tab
// ============================================================================

function ChecksTab() {
  const { checks } = OPERATIONS_SYSTEM;
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categoryIcons = {
    automated: <Bot className="w-4 h-4" />,
    manual: <Eye className="w-4 h-4" />,
    monitoring: <Activity className="w-4 h-4" />,
    response: <Zap className="w-4 h-4" />,
  };

  const filteredChecks = filterCategory === 'all'
    ? checks
    : checks.filter(c => c.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'automated', 'manual', 'monitoring', 'response'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterCategory === cat
                ? 'bg-[var(--db-brand)] text-[#081023]'
                : 'bg-[var(--db-panel)] text-[var(--db-muted)] hover:text-[var(--db-text)]'
            }`}
          >
            {cat !== 'all' && categoryIcons[cat as keyof typeof categoryIcons]}
            {cat === 'all' ? '전체' :
              cat === 'automated' ? '자동 검증' :
              cat === 'manual' ? '수동 점검' :
              cat === 'monitoring' ? '모니터링' : '대응'}
          </button>
        ))}
      </div>

      {/* Checks List */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            점검 항목 ({filteredChecks.length}개)
          </h3>
        </div>
        <div className="p-5 space-y-3">
          {filteredChecks.map((check) => (
            <CheckCard key={check.id} check={check} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CheckCard({ check }: { check: OperationsCheck }) {
  return (
    <div
      className="p-4 rounded-xl"
      style={{ background: 'rgba(122, 162, 255, 0.05)' }}
    >
      <div className="flex items-start gap-4">
        <div className="mt-0.5">
          {check.status === 'ready' ? (
            <CheckCircle2 className="w-5 h-5 text-[var(--db-ok)]" />
          ) : check.status === 'partial' ? (
            <AlertCircle className="w-5 h-5 text-[var(--db-warning)]" />
          ) : (
            <Clock className="w-5 h-5 text-[var(--db-muted)]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-medium text-[var(--db-text)]">{check.name}</span>
            <StatusBadge status={check.status} />
            <PriorityBadge priority={check.priority} />
          </div>
          <p className="text-sm text-[var(--db-muted)] mb-2">{check.description}</p>
          <div className="flex items-center gap-4 text-xs text-[var(--db-muted)] flex-wrap">
            <span className="flex items-center gap-1">
              {check.owner === 'ai' && <Bot className="w-3 h-3" />}
              {check.owner === 'human' && <Users className="w-3 h-3" />}
              {check.owner === 'system' && <Settings className="w-3 h-3" />}
              {check.owner === 'ai' ? 'AI' : check.owner === 'human' ? '사람' : '시스템'}
            </span>
            {check.frequency && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {check.frequency}
              </span>
            )}
            <span className="flex items-center gap-1">
              {check.phase.map(p => (
                <PhaseBadge key={p} phase={p} />
              ))}
            </span>
          </div>
          {check.command && (
            <div className="mt-2 p-2 rounded-lg bg-[rgba(0,0,0,0.2)] font-mono text-xs text-[var(--db-brand)] flex items-center gap-2">
              <Terminal className="w-3 h-3" />
              {check.command}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Monitoring Tab
// ============================================================================

function MonitoringTab() {
  const { metrics } = OPERATIONS_SYSTEM;

  const dashboardMetrics = metrics.filter(m => m.dashboard);
  const otherMetrics = metrics.filter(m => !m.dashboard);

  return (
    <div className="space-y-6">
      {/* Dashboard Metrics */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[var(--db-brand)]" />
            대시보드 지표
          </h3>
          <p className="text-sm text-[var(--db-muted)] mt-1">실시간 모니터링 대상</p>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          {dashboardMetrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </div>

      {/* Other Metrics */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">기타 지표</h3>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          {otherMetrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ metric }: { metric: MonitoringMetric }) {
  return (
    <div
      className="p-4 rounded-xl"
      style={{
        background: metric.implemented
          ? 'rgba(124,255,138,0.08)'
          : 'rgba(122, 162, 255, 0.05)',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-[var(--db-text)]">{metric.name}</span>
        {metric.implemented ? (
          <CheckCircle2 className="w-4 h-4 text-[var(--db-ok)]" />
        ) : (
          <Clock className="w-4 h-4 text-[var(--db-muted)]" />
        )}
      </div>
      <p className="text-sm text-[var(--db-muted)] mb-3">{metric.description}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--db-text)]">목표: {metric.target}</span>
        {metric.alertThreshold && (
          <span className="text-[var(--db-danger)]">⚠️ {metric.alertThreshold}</span>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Incidents Tab
// ============================================================================

function IncidentsTab() {
  const { incidents } = OPERATIONS_SYSTEM;

  return (
    <div className="space-y-6">
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[var(--db-warning)]" />
            인시던트 대응 시나리오
          </h3>
          <p className="text-sm text-[var(--db-muted)] mt-1">
            예상 문제 상황과 대응 방법
          </p>
        </div>
        <div className="p-5 space-y-4">
          {incidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      </div>
    </div>
  );
}

function IncidentCard({ incident }: { incident: IncidentResponse }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: 'rgba(255, 107, 129, 0.05)' }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-[var(--db-warning)]" />
          <span className="font-medium text-[var(--db-text)]">{incident.scenario}</span>
        </div>
        <div className="flex items-center gap-2">
          <SeverityBadge severity={incident.severity} />
          <span className="text-[var(--db-muted)]">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <div className="p-3 rounded-lg bg-[rgba(122,162,255,0.08)]">
            <p className="text-xs text-[var(--db-brand)] mb-1">탐지 방법</p>
            <p className="text-sm text-[var(--db-text)]">{incident.detection}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-[rgba(255,107,129,0.08)]">
              <p className="text-xs text-[var(--db-danger)] mb-2">대응</p>
              <ol className="space-y-1">
                {incident.response.map((step, idx) => (
                  <li key={idx} className="text-sm text-[var(--db-text)] flex items-start gap-2">
                    <span className="text-[var(--db-danger)]">{idx + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <div className="p-3 rounded-lg bg-[rgba(124,255,138,0.08)]">
              <p className="text-xs text-[var(--db-ok)] mb-2">예방</p>
              <ul className="space-y-1">
                {incident.preventive.map((item, idx) => (
                  <li key={idx} className="text-sm text-[var(--db-text)] flex items-start gap-2">
                    <span className="text-[var(--db-ok)]">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Checklist Tab
// ============================================================================

function ChecklistTab() {
  const { checklists } = OPERATIONS_SYSTEM;
  const [activePhase, setActivePhase] = useState<Phase>('pre_launch');

  const currentChecklist = checklists.find(c => c.phase === activePhase);

  return (
    <div className="space-y-6">
      {/* Phase Selection */}
      <div className="flex gap-2">
        {checklists.map((checklist) => {
          const doneCount = checklist.items.filter(i => i.done).length;
          const totalCount = checklist.items.length;

          return (
            <button
              key={checklist.phase}
              onClick={() => setActivePhase(checklist.phase)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activePhase === checklist.phase
                  ? 'bg-[var(--db-brand)] text-[#081023]'
                  : 'bg-[var(--db-panel)] text-[var(--db-muted)] hover:text-[var(--db-text)]'
              }`}
            >
              {checklist.label}
              <span className="text-xs opacity-70">
                {doneCount}/{totalCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Checklist Detail */}
      {currentChecklist && (
        <div className="db-card">
          <div className="db-card-header px-5 py-4">
            <h3 className="text-lg font-semibold text-[var(--db-text)]">
              {currentChecklist.label} 체크리스트
            </h3>
            <p className="text-sm text-[var(--db-muted)] mt-1">
              {currentChecklist.description}
            </p>
          </div>
          <div className="p-5 space-y-2">
            {currentChecklist.items.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl flex items-start gap-3"
                style={{
                  background: item.done
                    ? 'rgba(124,255,138,0.08)'
                    : 'rgba(122, 162, 255, 0.05)',
                }}
              >
                {item.done ? (
                  <CheckCircle2 className="w-5 h-5 text-[var(--db-ok)] mt-0.5" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-[var(--db-muted)] mt-0.5" />
                )}
                <div className="flex-1">
                  <span
                    className={`text-sm ${
                      item.done ? 'text-[var(--db-muted)] line-through' : 'text-[var(--db-text)]'
                    }`}
                  >
                    {item.task}
                  </span>
                  {item.notes && (
                    <p className="text-xs text-[var(--db-muted)] mt-1">{item.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Alpha Guide Tab
// ============================================================================

function AlphaGuideTab() {
  const { alphaGuide } = OPERATIONS_SYSTEM;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)] flex items-center gap-2">
            <Rocket className="w-5 h-5 text-[var(--db-brand)]" />
            알파 테스트 가이드
          </h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-[rgba(122,162,255,0.08)]">
              <p className="text-xs text-[var(--db-muted)] mb-1">기간</p>
              <p className="text-lg font-bold text-[var(--db-text)]">{alphaGuide.duration}</p>
            </div>
            <div className="p-4 rounded-xl bg-[rgba(122,162,255,0.08)]">
              <p className="text-xs text-[var(--db-muted)] mb-1">대상 사용자</p>
              <p className="text-lg font-bold text-[var(--db-text)]">{alphaGuide.targetUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals & Data */}
      <div className="grid grid-cols-2 gap-4">
        <div className="db-card">
          <div className="db-card-header px-5 py-4">
            <h3 className="text-base font-semibold text-[var(--db-text)] flex items-center gap-2">
              <Target className="w-5 h-5 text-[var(--db-ok)]" />
              목표
            </h3>
          </div>
          <div className="p-5">
            <ul className="space-y-2">
              {alphaGuide.goals.map((goal, idx) => (
                <li key={idx} className="text-sm text-[var(--db-text)] flex items-start gap-2">
                  <span className="text-[var(--db-ok)]">•</span>
                  {goal}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="db-card">
          <div className="db-card-header px-5 py-4">
            <h3 className="text-base font-semibold text-[var(--db-text)] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[var(--db-brand)]" />
              수집 데이터
            </h3>
          </div>
          <div className="p-5">
            <ul className="space-y-2">
              {alphaGuide.dataToCollect.map((data, idx) => (
                <li key={idx} className="text-sm text-[var(--db-text)] flex items-start gap-2">
                  <span className="text-[var(--db-brand)]">•</span>
                  {data}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Success & Exit Criteria */}
      <div className="grid grid-cols-2 gap-4">
        <div className="db-card">
          <div className="db-card-header px-5 py-4">
            <h3 className="text-base font-semibold text-[var(--db-text)] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[var(--db-ok)]" />
              성공 기준
            </h3>
          </div>
          <div className="p-5">
            <ul className="space-y-2">
              {alphaGuide.successCriteria.map((criteria, idx) => (
                <li key={idx} className="text-sm text-[var(--db-text)] flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--db-ok)] mt-0.5" />
                  {criteria}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="db-card">
          <div className="db-card-header px-5 py-4">
            <h3 className="text-base font-semibold text-[var(--db-text)] flex items-center gap-2">
              <Play className="w-5 h-5 text-[var(--db-warning)]" />
              종료 기준
            </h3>
          </div>
          <div className="p-5">
            <ul className="space-y-2">
              {alphaGuide.exitCriteria.map((criteria, idx) => (
                <li key={idx} className="text-sm text-[var(--db-text)] flex items-start gap-2">
                  <Zap className="w-4 h-4 text-[var(--db-warning)] mt-0.5" />
                  {criteria}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}