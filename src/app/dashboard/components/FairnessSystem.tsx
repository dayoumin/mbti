'use client';

import { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Ban,
  Eye,
  Target,
  Zap,
  TrendingUp,
  Lock,
  UserX,
  MessageSquare,
  Vote,
  HelpCircle,
} from 'lucide-react';
import {
  FAIRNESS_SYSTEM,
  FairnessRule,
  AbusePattern,
  FairnessPhase,
} from '../data/fairness-system';

// ============================================================================
// Status Badge Components
// ============================================================================

function StatusBadge({ implemented }: { implemented: boolean }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        implemented
          ? 'bg-[rgba(124,255,138,0.15)] text-[var(--db-ok)]'
          : 'bg-[rgba(255,214,102,0.15)] text-[var(--db-warning)]'
      }`}
    >
      {implemented ? '구현됨' : '예정'}
    </span>
  );
}

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

export default function FairnessSystem() {
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'patterns' | 'roadmap'>('overview');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2">
        {[
          { key: 'overview', label: '개요', icon: <Shield className="w-4 h-4" /> },
          { key: 'rules', label: '규칙', icon: <Lock className="w-4 h-4" /> },
          { key: 'patterns', label: '어뷰징 패턴', icon: <AlertTriangle className="w-4 h-4" /> },
          { key: 'roadmap', label: '로드맵', icon: <Target className="w-4 h-4" /> },
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
      {activeTab === 'rules' && <RulesTab />}
      {activeTab === 'patterns' && <PatternsTab />}
      {activeTab === 'roadmap' && <RoadmapTab />}
    </div>
  );
}

// ============================================================================
// Overview Tab
// ============================================================================

function OverviewTab() {
  const { currentStatus, metrics, rules } = FAIRNESS_SYSTEM;

  const implementedCount = rules.filter(r => r.implemented).length;
  const totalRules = rules.length;
  const progressPercent = Math.round((implementedCount / totalRules) * 100);

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)] flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--db-brand)]" />
            공정성 시스템 현황
          </h3>
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
              {implementedCount}/{totalRules} 규칙 ({progressPercent}%)
            </span>
          </div>

          {/* Current Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[rgba(124,255,138,0.08)]">
              <h4 className="text-sm font-medium text-[var(--db-ok)] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                구현 완료
              </h4>
              <ul className="space-y-2">
                {currentStatus.implemented.map((item, idx) => (
                  <li key={idx} className="text-sm text-[var(--db-text)] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--db-ok)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-[rgba(255,214,102,0.08)]">
              <h4 className="text-sm font-medium text-[var(--db-warning)] mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                구현 예정
              </h4>
              <ul className="space-y-2">
                {currentStatus.planned.map((item, idx) => (
                  <li key={idx} className="text-sm text-[var(--db-text)] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--db-warning)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--db-brand)]" />
            공정성 지표
          </h3>
        </div>
        <div className="p-5 grid grid-cols-4 gap-4">
          {metrics.map((metric) => {
            const statusConfig = {
              good: { bg: 'rgba(124,255,138,0.15)', color: 'var(--db-ok)', icon: <CheckCircle2 className="w-4 h-4" /> },
              needs_work: { bg: 'rgba(255,214,102,0.15)', color: 'var(--db-warning)', icon: <AlertTriangle className="w-4 h-4" /> },
              not_implemented: { bg: 'rgba(122,162,255,0.15)', color: 'var(--db-muted)', icon: <Clock className="w-4 h-4" /> },
            }[metric.currentStatus];

            return (
              <div
                key={metric.name}
                className="p-4 rounded-xl"
                style={{ background: statusConfig.bg }}
              >
                <div className="flex items-center gap-2 mb-2" style={{ color: statusConfig.color }}>
                  {statusConfig.icon}
                  <span className="text-sm font-medium">{metric.name}</span>
                </div>
                <p className="text-xs text-[var(--db-muted)] mb-2">{metric.description}</p>
                <p className="text-sm font-bold text-[var(--db-text)]">목표: {metric.target}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Guide */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">공정성 보장 원칙</h3>
        </div>
        <div className="p-5 grid grid-cols-3 gap-4">
          {[
            {
              icon: <Vote className="w-6 h-6" />,
              title: '투표 공정성',
              items: ['1인 1표 (deviceId)', '투표 후 결과 공개', '조작 탐지'],
            },
            {
              icon: <MessageSquare className="w-6 h-6" />,
              title: '댓글 품질',
              items: ['간격 제한 (30초)', '일일/주간 한도', '스팸 차단'],
            },
            {
              icon: <UserX className="w-6 h-6" />,
              title: '봇 방지',
              items: ['Rate Limit', '패턴 탐지', 'IP 모니터링'],
            },
          ].map((section) => (
            <div
              key={section.title}
              className="p-4 rounded-xl"
              style={{ background: 'rgba(122, 162, 255, 0.08)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-[var(--db-brand)]">{section.icon}</div>
                <span className="font-medium text-[var(--db-text)]">{section.title}</span>
              </div>
              <ul className="space-y-1">
                {section.items.map((item, idx) => (
                  <li key={idx} className="text-sm text-[var(--db-muted)]">• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Rules Tab
// ============================================================================

function RulesTab() {
  const { rules } = FAIRNESS_SYSTEM;
  const [filterTarget, setFilterTarget] = useState<string>('all');

  const targetIcons: Record<string, React.ReactNode> = {
    vote: <Vote className="w-4 h-4" />,
    comment: <MessageSquare className="w-4 h-4" />,
    quiz: <HelpCircle className="w-4 h-4" />,
    feedback: <Eye className="w-4 h-4" />,
    all: <Shield className="w-4 h-4" />,
  };

  const filteredRules = filterTarget === 'all'
    ? rules
    : rules.filter(r => r.target === filterTarget);

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'vote', 'comment', 'quiz', 'feedback'].map((target) => (
          <button
            key={target}
            onClick={() => setFilterTarget(target)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterTarget === target
                ? 'bg-[var(--db-brand)] text-[#081023]'
                : 'bg-[var(--db-panel)] text-[var(--db-muted)] hover:text-[var(--db-text)]'
            }`}
          >
            {targetIcons[target]}
            {target === 'all' ? '전체' : target}
          </button>
        ))}
      </div>

      {/* Rules List */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            공정성 규칙 ({filteredRules.length}개)
          </h3>
        </div>
        <div className="p-5 space-y-3">
          {filteredRules.map((rule) => (
            <RuleCard key={rule.id} rule={rule} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RuleCard({ rule }: { rule: FairnessRule }) {
  const actionConfig = {
    block: { icon: <Ban className="w-4 h-4" />, color: 'var(--db-danger)', label: '차단' },
    warn: { icon: <AlertTriangle className="w-4 h-4" />, color: 'var(--db-warning)', label: '경고' },
    throttle: { icon: <Clock className="w-4 h-4" />, color: 'var(--db-brand)', label: '지연' },
  }[rule.action];

  return (
    <div
      className="p-4 rounded-xl flex items-start gap-4"
      style={{ background: 'rgba(122, 162, 255, 0.05)' }}
    >
      <div className="mt-0.5">
        {rule.implemented ? (
          <CheckCircle2 className="w-5 h-5 text-[var(--db-ok)]" />
        ) : (
          <Clock className="w-5 h-5 text-[var(--db-warning)]" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-medium text-[var(--db-text)]">{rule.name}</span>
          <StatusBadge implemented={rule.implemented} />
          <PriorityBadge priority={rule.priority} />
          <span
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
            style={{ background: 'rgba(122,162,255,0.1)', color: actionConfig.color }}
          >
            {actionConfig.icon}
            {actionConfig.label}
          </span>
        </div>
        <p className="text-sm text-[var(--db-muted)] mb-2">{rule.description}</p>
        <div className="flex items-center gap-4 text-xs text-[var(--db-muted)]">
          <span>대상: {rule.target}</span>
          <span>제한: {rule.limit}{rule.window ? ` / ${rule.window}` : ''}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Patterns Tab
// ============================================================================

function PatternsTab() {
  const { abusePatterns } = FAIRNESS_SYSTEM;

  return (
    <div className="space-y-6">
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[var(--db-warning)]" />
            어뷰징 패턴 탐지
          </h3>
          <p className="text-sm text-[var(--db-muted)] mt-1">
            비정상적 사용 패턴과 대응 방법
          </p>
        </div>
        <div className="p-5 space-y-4">
          {abusePatterns.map((pattern) => (
            <PatternCard key={pattern.id} pattern={pattern} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PatternCard({ pattern }: { pattern: AbusePattern }) {
  return (
    <div
      className="p-4 rounded-xl"
      style={{ background: 'rgba(255, 107, 129, 0.05)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[var(--db-warning)]" />
          <span className="font-medium text-[var(--db-text)]">{pattern.name}</span>
        </div>
        <SeverityBadge severity={pattern.severity} />
      </div>
      <p className="text-sm text-[var(--db-muted)] mb-3">{pattern.description}</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-[rgba(122,162,255,0.08)]">
          <p className="text-xs text-[var(--db-brand)] mb-1">탐지 방법</p>
          <p className="text-sm text-[var(--db-text)]">{pattern.detection}</p>
        </div>
        <div className="p-3 rounded-lg bg-[rgba(255,107,129,0.08)]">
          <p className="text-xs text-[var(--db-danger)] mb-1">대응</p>
          <p className="text-sm text-[var(--db-text)]">{pattern.response}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Roadmap Tab
// ============================================================================

function RoadmapTab() {
  const { roadmap } = FAIRNESS_SYSTEM;
  const [activePhase, setActivePhase] = useState<string>('phase-1');

  const currentPhase = roadmap.find(p => p.id === activePhase);

  return (
    <div className="space-y-6">
      {/* Phase Selection */}
      <div className="flex gap-2">
        {roadmap.map((phase) => {
          const doneCount = phase.items.filter(i => i.implemented).length;
          const totalCount = phase.items.length;
          const isComplete = doneCount === totalCount;

          return (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activePhase === phase.id
                  ? 'bg-[var(--db-brand)] text-[#081023]'
                  : 'bg-[var(--db-panel)] text-[var(--db-muted)] hover:text-[var(--db-text)]'
              }`}
            >
              {isComplete ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              {phase.name}
              <span className="text-xs opacity-70">
                {doneCount}/{totalCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Phase Detail */}
      {currentPhase && (
        <div className="db-card">
          <div className="db-card-header px-5 py-4">
            <h3 className="text-lg font-semibold text-[var(--db-text)]">{currentPhase.name}</h3>
            <p className="text-sm text-[var(--db-muted)] mt-1">{currentPhase.description}</p>
          </div>
          <div className="p-5 space-y-3">
            {currentPhase.items.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl flex items-start gap-4"
                style={{ background: 'rgba(122, 162, 255, 0.05)' }}
              >
                <div className="mt-0.5">
                  {item.implemented ? (
                    <CheckCircle2 className="w-5 h-5 text-[var(--db-ok)]" />
                  ) : (
                    <Clock className="w-5 h-5 text-[var(--db-warning)]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-[var(--db-text)]">{item.task}</span>
                    <StatusBadge implemented={item.implemented} />
                    <PriorityBadge priority={item.priority} />
                  </div>
                  <p className="text-sm text-[var(--db-muted)]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
