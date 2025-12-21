'use client';

import { useState } from 'react';
import {
  Dog,
  Cat,
  Fish,
  Flower2,
  Rabbit,
  Eye,
  Layers,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  Target,
  Zap,
  Star,
  ChevronRight,
  Database,
  Code2,
} from 'lucide-react';
import {
  CARE_TARGETS,
  CARE_ROADMAP,
  DATA_STRUCTURE,
  UI_INTEGRATION,
  CareTarget,
  CareTargetDefinition,
  CareFeature,
  RoadmapPhase,
  Priority,
  FeatureStatus,
} from '../data/care-system';

// ============================================================================
// Icons
// ============================================================================

const TARGET_ICONS: Record<CareTarget, React.ReactNode> = {
  dog: <Dog className="w-5 h-5" />,
  cat: <Cat className="w-5 h-5" />,
  fish: <Fish className="w-5 h-5" />,
  plant: <Flower2 className="w-5 h-5" />,
  hamster: <span className="text-lg">🐹</span>,
  rabbit: <Rabbit className="w-5 h-5" />,
};

const PRIORITY_COLORS: Record<Priority, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e',
};

const STATUS_STYLES: Record<FeatureStatus, { bg: string; text: string; label: string }> = {
  planned: { bg: 'bg-slate-500/20', text: 'text-slate-400', label: '예정' },
  'in-progress': { bg: 'bg-blue-500/20', text: 'text-blue-400', label: '진행중' },
  done: { bg: 'bg-green-500/20', text: 'text-green-400', label: '완료' },
};

// ============================================================================
// Main Component
// ============================================================================

export default function CareSystem() {
  const [activeTab, setActiveTab] = useState<'overview' | 'targets' | 'roadmap' | 'data' | 'references'>('overview');
  const [selectedTarget, setSelectedTarget] = useState<CareTarget>('dog');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'overview', label: '개요', icon: <Eye className="w-4 h-4" /> },
          { key: 'targets', label: '대상별 기능', icon: <Layers className="w-4 h-4" /> },
          { key: 'roadmap', label: '로드맵', icon: <Calendar className="w-4 h-4" /> },
          { key: 'data', label: '데이터 구조', icon: <Database className="w-4 h-4" /> },
          { key: 'references', label: '앱 레퍼런스', icon: <ExternalLink className="w-4 h-4" /> },
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
      {activeTab === 'targets' && (
        <TargetsTab selectedTarget={selectedTarget} setSelectedTarget={setSelectedTarget} />
      )}
      {activeTab === 'roadmap' && <RoadmapTab />}
      {activeTab === 'data' && <DataTab />}
      {activeTab === 'references' && <ReferencesTab />}
    </div>
  );
}

// ============================================================================
// Overview Tab
// ============================================================================

function OverviewTab() {
  const totalFeatures = CARE_TARGETS.reduce((sum, t) => sum + t.features.length, 0);
  const phase1Features = CARE_TARGETS.reduce(
    (sum, t) => sum + t.features.filter((f) => f.phase === 1).length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="db-card p-6">
        <h3 className="text-lg font-bold text-[var(--db-text)] mb-3">
          케어 시스템이란?
        </h3>
        <p className="text-[var(--db-muted)] mb-4">
          테스트 결과와 연동하여 <strong className="text-[var(--db-text)]">반려동물/식물 돌봄</strong>을
          도와주는 기능입니다. 알림, 기록, 건강 추적을 통해 지속적인 앱 사용을 유도합니다.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-[var(--db-panel)]">
            <div className="text-3xl font-black text-[var(--db-brand)]">{CARE_TARGETS.length}</div>
            <div className="text-sm text-[var(--db-muted)]">지원 대상</div>
          </div>
          <div className="p-4 rounded-xl bg-[var(--db-panel)]">
            <div className="text-3xl font-black text-[var(--db-brand)]">{totalFeatures}</div>
            <div className="text-sm text-[var(--db-muted)]">총 기능</div>
          </div>
          <div className="p-4 rounded-xl bg-[var(--db-panel)]">
            <div className="text-3xl font-black text-[var(--db-brand)]">{phase1Features}</div>
            <div className="text-sm text-[var(--db-muted)]">Phase 1 기능</div>
          </div>
        </div>
      </div>

      {/* Target Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {CARE_TARGETS.map((target) => (
          <TargetCard key={target.id} target={target} />
        ))}
      </div>

      {/* UI Integration */}
      <div className="db-card p-6">
        <h3 className="text-lg font-bold text-[var(--db-text)] mb-4">
          UI 연동 전략
        </h3>
        <div className="grid gap-4">
          {Object.entries(UI_INTEGRATION).map(([key, value]) => (
            <div key={key} className="p-4 rounded-xl bg-[var(--db-panel)]">
              <h4 className="font-semibold text-[var(--db-text)] capitalize mb-2">
                {key === 'navigation' ? '🧭 네비게이션' :
                 key === 'testConnection' ? '🔗 테스트 연동' :
                 '📊 대시보드'}
              </h4>
              <p className="text-sm text-[var(--db-muted)] mb-2">{value.description}</p>
              {'features' in value && (
                <ul className="text-sm text-[var(--db-muted)] space-y-1">
                  {value.features.map((f: string, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 text-[var(--db-brand)]" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              {'flow' in value && (
                <p className="text-sm text-[var(--db-brand)]">{value.flow}</p>
              )}
              {'location' in value && (
                <p className="text-xs text-[var(--db-muted)] mt-1">위치: {value.location}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Target Card
// ============================================================================

function TargetCard({ target }: { target: CareTargetDefinition }) {
  const phase1Count = target.features.filter((f) => f.phase === 1).length;

  return (
    <div
      className="p-4 rounded-xl transition-all hover:scale-[1.02]"
      style={{ background: `${target.color}15`, borderLeft: `3px solid ${target.color}` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${target.color}30`, color: target.color }}
        >
          {TARGET_ICONS[target.id]}
        </div>
        <div>
          <h4 className="font-semibold text-[var(--db-text)]">
            {target.emoji} {target.name}
          </h4>
          <p className="text-xs text-[var(--db-muted)]">
            {target.features.length}개 기능 (P1: {phase1Count}개)
          </p>
        </div>
      </div>
      <p className="text-sm text-[var(--db-muted)]">{target.description}</p>
      <div className="flex flex-wrap gap-1 mt-3">
        {target.careCategories.map((cat) => (
          <span
            key={cat.id}
            className="text-xs px-2 py-0.5 rounded-full bg-[var(--db-panel)] text-[var(--db-muted)]"
          >
            {cat.emoji} {cat.name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Targets Tab
// ============================================================================

function TargetsTab({
  selectedTarget,
  setSelectedTarget,
}: {
  selectedTarget: CareTarget;
  setSelectedTarget: (t: CareTarget) => void;
}) {
  const target = CARE_TARGETS.find((t) => t.id === selectedTarget)!;

  return (
    <div className="space-y-6">
      {/* Target Selector */}
      <div className="flex gap-2 flex-wrap">
        {CARE_TARGETS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTarget(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedTarget === t.id
                ? 'text-white'
                : 'bg-[var(--db-panel)] text-[var(--db-muted)] hover:text-[var(--db-text)]'
            }`}
            style={selectedTarget === t.id ? { background: t.color } : undefined}
          >
            {TARGET_ICONS[t.id]}
            {t.name}
          </button>
        ))}
      </div>

      {/* Target Detail */}
      <div className="db-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `${target.color}20` }}
          >
            {target.emoji}
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--db-text)]">{target.name} 케어</h3>
            <p className="text-[var(--db-muted)]">{target.description}</p>
            <p className="text-sm text-[var(--db-brand)] mt-1">
              연동 테스트: {target.linkedTest}
            </p>
          </div>
        </div>

        {/* Care Categories */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {target.careCategories.map((cat) => (
            <div key={cat.id} className="p-3 rounded-xl bg-[var(--db-panel)]">
              <h4 className="font-semibold text-[var(--db-text)] mb-2">
                {cat.emoji} {cat.name}
              </h4>
              <ul className="text-sm text-[var(--db-muted)] space-y-1">
                {cat.items.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Features */}
        <h4 className="font-semibold text-[var(--db-text)] mb-3">기능 목록</h4>
        <div className="space-y-3">
          {target.features.map((feature) => (
            <FeatureRow key={feature.id} feature={feature} color={target.color} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Feature Row
// ============================================================================

function FeatureRow({ feature, color }: { feature: CareFeature; color: string }) {
  const statusStyle = STATUS_STYLES[feature.status];

  return (
    <div className="p-4 rounded-xl bg-[var(--db-panel)] flex items-start gap-4">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: `${color}20` }}
      >
        {feature.icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h5 className="font-semibold text-[var(--db-text)]">{feature.name}</h5>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}
          >
            {statusStyle.label}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: `${PRIORITY_COLORS[feature.priority]}20`, color: PRIORITY_COLORS[feature.priority] }}
          >
            {feature.priority === 'high' ? '높음' : feature.priority === 'medium' ? '중간' : '낮음'}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--db-brand)]/20 text-[var(--db-brand)]">
            P{feature.phase}
          </span>
        </div>
        <p className="text-sm text-[var(--db-muted)]">{feature.description}</p>
        <div className="flex gap-4 mt-2 text-xs text-[var(--db-muted)]">
          <span>난이도: {'⭐'.repeat(feature.difficulty)}</span>
          <span>임팩트: {'🔥'.repeat(feature.impact)}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Roadmap Tab
// ============================================================================

function RoadmapTab() {
  return (
    <div className="space-y-6">
      {CARE_ROADMAP.map((phase) => (
        <div key={phase.phase} className="db-card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--db-brand)]/20 flex items-center justify-center">
              <span className="text-xl font-black text-[var(--db-brand)]">P{phase.phase}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--db-text)]">{phase.title}</h3>
              <p className="text-sm text-[var(--db-muted)]">{phase.description}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Features */}
            <div className="p-4 rounded-xl bg-[var(--db-panel)]">
              <h4 className="font-semibold text-[var(--db-text)] mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-[var(--db-brand)]" />
                주요 기능
              </h4>
              <ul className="space-y-2">
                {phase.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--db-muted)]">
                    <CheckCircle2 className="w-4 h-4 text-[var(--db-brand)] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Targets */}
            <div className="p-4 rounded-xl bg-[var(--db-panel)]">
              <h4 className="font-semibold text-[var(--db-text)] mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[var(--db-brand)]" />
                대상
              </h4>
              <div className="flex flex-wrap gap-2">
                {phase.targets.map((targetId) => {
                  const target = CARE_TARGETS.find((t) => t.id === targetId);
                  if (!target) return null;
                  return (
                    <span
                      key={targetId}
                      className="px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ background: target.color }}
                    >
                      {target.emoji} {target.name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Data Tab
// ============================================================================

function DataTab() {
  return (
    <div className="space-y-6">
      <div className="db-card p-6">
        <h3 className="text-lg font-bold text-[var(--db-text)] mb-4 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-[var(--db-brand)]" />
          데이터 구조 (구현 참고용)
        </h3>
        <p className="text-sm text-[var(--db-muted)] mb-6">
          실제 구현 시 사용할 TypeScript 인터페이스입니다.
        </p>

        <div className="space-y-4">
          {Object.entries(DATA_STRUCTURE).map(([key, value]) => (
            <div key={key} className="p-4 rounded-xl bg-[var(--db-panel)]">
              <h4 className="font-semibold text-[var(--db-text)] mb-2 capitalize">
                {key === 'petProfile' ? '🐾 반려동물/식물 프로필' :
                 key === 'careSchedule' ? '📅 케어 스케줄' :
                 '📝 케어 기록'}
              </h4>
              <pre className="text-xs text-[var(--db-muted)] overflow-x-auto bg-[#0a0a0a] p-3 rounded-lg">
                {value}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// References Tab
// ============================================================================

function ReferencesTab() {
  return (
    <div className="space-y-6">
      {CARE_TARGETS.map((target) => (
        <div key={target.id} className="db-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: `${target.color}20`, color: target.color }}
            >
              {TARGET_ICONS[target.id]}
            </div>
            <h3 className="text-lg font-bold text-[var(--db-text)]">
              {target.emoji} {target.name} 앱 레퍼런스
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {target.appReferences.map((app, i) => (
              <a
                key={i}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-[var(--db-panel)] hover:bg-[var(--db-panel-hover)] transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-[var(--db-text)] group-hover:text-[var(--db-brand)]">
                    {app.name}
                  </h4>
                  <ExternalLink className="w-3 h-3 text-[var(--db-muted)]" />
                </div>
                <ul className="text-sm text-[var(--db-muted)] space-y-1">
                  {app.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
