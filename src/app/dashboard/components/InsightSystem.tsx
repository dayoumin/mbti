'use client';

import { useState } from 'react';
import {
  Brain,
  Layers,
  Tag,
  BookOpen,
  Map,
  DollarSign,
  BarChart3,
  Users,
  Sparkles,
  Lock,
  Unlock,
  ChevronRight,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import {
  INSIGHT_CONCEPT,
  INSIGHT_STAGES,
  PERSONALITY_TAGS,
  DECISION_TAGS,
  RELATIONSHIP_TAGS,
  PSYCHOLOGICAL_EVIDENCE,
  SAMPLE_RULES,
  RULE_PLAN,
  IMPLEMENTATION_ROADMAP,
  SUCCESS_METRICS,
  PRICING_TIERS,
  PREMIUM_FEATURES,
  PEOPLE_MATCHING_SYSTEM,
  RELATIONSHIP_MATCH,
  GAMIFICATION_STRATEGY,
} from '../data/insight-system';

// ============================================================================
// Types
// ============================================================================

type TabKey = 'overview' | 'stages' | 'tags' | 'rules' | 'roadmap' | 'pricing' | 'matching' | 'metrics';

// ============================================================================
// Main Component
// ============================================================================

export default function InsightSystem() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: '개요', icon: <Brain className="w-4 h-4" /> },
    { key: 'stages', label: '7단계 해금', icon: <Layers className="w-4 h-4" /> },
    { key: 'tags', label: '태그 시스템', icon: <Tag className="w-4 h-4" /> },
    { key: 'rules', label: '룰 엔진', icon: <Zap className="w-4 h-4" /> },
    { key: 'roadmap', label: '로드맵', icon: <Map className="w-4 h-4" /> },
    { key: 'pricing', label: '수익화', icon: <DollarSign className="w-4 h-4" /> },
    { key: 'matching', label: '사람 매칭', icon: <Users className="w-4 h-4" /> },
    { key: 'metrics', label: '성공 지표', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
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
      {activeTab === 'stages' && <StagesTab />}
      {activeTab === 'tags' && <TagsTab />}
      {activeTab === 'rules' && <RulesTab />}
      {activeTab === 'roadmap' && <RoadmapTab />}
      {activeTab === 'pricing' && <PricingTab />}
      {activeTab === 'matching' && <MatchingTab />}
      {activeTab === 'metrics' && <MetricsTab />}
    </div>
  );
}

// ============================================================================
// Overview Tab
// ============================================================================

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="db-card">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--db-text)]">{INSIGHT_CONCEPT.title}</h2>
              <p className="text-[var(--db-muted)]">{INSIGHT_CONCEPT.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Differentiation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="db-card p-5">
          <h3 className="font-semibold text-[var(--db-muted)] mb-3">
            {INSIGHT_CONCEPT.differentiation.traditional.name}
          </h3>
          <p className="text-[var(--db-text)] mb-2">
            {INSIGHT_CONCEPT.differentiation.traditional.description}
          </p>
          <p className="text-sm text-[var(--db-muted)]">
            {INSIGHT_CONCEPT.differentiation.traditional.limitation}
          </p>
        </div>
        <div className="db-card p-5 border-2 border-[var(--db-brand)]">
          <h3 className="font-semibold text-[var(--db-brand)] mb-3">
            {INSIGHT_CONCEPT.differentiation.ours.name}
          </h3>
          <p className="text-[var(--db-text)] mb-2">
            {INSIGHT_CONCEPT.differentiation.ours.description}
          </p>
          <p className="text-sm text-[var(--db-brand)]">
            {INSIGHT_CONCEPT.differentiation.ours.advantage}
          </p>
        </div>
      </div>

      {/* Psychological Basis */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)] flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            심리학적 기반
          </h3>
        </div>
        <div className="p-5 space-y-3">
          {Object.entries(INSIGHT_CONCEPT.psychologicalBasis).map(([key, value]) => (
            <div key={key} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-[var(--db-text)]">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="해금 단계" value="7단계" icon={<Layers className="w-5 h-5" />} />
        <StatCard label="인사이트 룰" value={`${RULE_PLAN.total}개`} icon={<Zap className="w-5 h-5" />} />
        <StatCard label="태그 종류" value={`${PERSONALITY_TAGS.length + DECISION_TAGS.length + RELATIONSHIP_TAGS.length}개`} icon={<Tag className="w-5 h-5" />} />
        <StatCard label="로드맵" value={`${IMPLEMENTATION_ROADMAP.length} Phase`} icon={<Map className="w-5 h-5" />} />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="db-card p-4">
      <div className="flex items-center gap-3">
        <div className="text-[var(--db-brand)]">{icon}</div>
        <div>
          <div className="text-2xl font-bold text-[var(--db-text)]">{value}</div>
          <div className="text-sm text-[var(--db-muted)]">{label}</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Stages Tab
// ============================================================================

function StagesTab() {
  const [selectedStage, setSelectedStage] = useState<number>(1);

  return (
    <div className="space-y-6">
      {/* Stage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {INSIGHT_STAGES.map((stage) => (
          <button
            key={stage.id}
            onClick={() => setSelectedStage(stage.id)}
            className={`db-card p-4 text-left transition-all ${
              selectedStage === stage.id ? 'ring-2 ring-[var(--db-brand)]' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stage.emoji}</span>
              {stage.cost === 'paid' ? (
                <Lock className="w-4 h-4 text-amber-400" />
              ) : (
                <Unlock className="w-4 h-4 text-green-400" />
              )}
            </div>
            <h4 className="font-semibold text-[var(--db-text)] mb-1">
              Stage {stage.id}: {stage.name}
            </h4>
            <p className="text-sm text-[var(--db-muted)]">{stage.unlockCondition}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs ${
                stage.analysisMethod === 'aggregation' ? 'bg-blue-500/20 text-blue-400' :
                stage.analysisMethod === 'rule-matching' ? 'bg-purple-500/20 text-purple-400' :
                'bg-amber-500/20 text-amber-400'
              }`}>
                {stage.analysisMethod === 'aggregation' ? '집계' :
                 stage.analysisMethod === 'rule-matching' ? '룰 매칭' : 'AI 생성'}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Stage Detail */}
      {INSIGHT_STAGES.filter(s => s.id === selectedStage).map((stage) => (
        <div key={stage.id} className="db-card">
          <div className="db-card-header px-5 py-4">
            <h3 className="text-lg font-semibold text-[var(--db-text)]">
              {stage.emoji} Stage {stage.id}: {stage.name}
            </h3>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-[var(--db-muted)] mb-1">설명</h4>
              <p className="text-[var(--db-text)]">{stage.description}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-[var(--db-muted)] mb-1">사용자 가치</h4>
              <p className="text-[var(--db-text)]">{stage.userValue}</p>
            </div>
            {stage.nudgeMessage && (
              <div className="p-3 bg-[var(--db-brand)]/10 rounded-lg">
                <h4 className="text-sm font-medium text-[var(--db-brand)] mb-1">유도 메시지</h4>
                <p className="text-[var(--db-text)]">{stage.nudgeMessage}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Tags Tab
// ============================================================================

function TagsTab() {
  const tagGroups = [
    { name: '성격 태그', tags: PERSONALITY_TAGS, color: 'purple', description: 'Big Five 기반' },
    { name: '결정 태그', tags: DECISION_TAGS, color: 'blue', description: '투표 선택지용' },
    { name: '관계 태그', tags: RELATIONSHIP_TAGS, color: 'pink', description: 'TKI 갈등 모델' },
  ];

  return (
    <div className="space-y-6">
      {tagGroups.map((group) => (
        <div key={group.name} className="db-card">
          <div className="db-card-header px-5 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--db-text)]">{group.name}</h3>
              <span className="text-sm text-[var(--db-muted)]">{group.description}</span>
            </div>
          </div>
          <div className="p-5">
            <div className="flex flex-wrap gap-2">
              {group.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    group.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                    group.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-pink-500/20 text-pink-400'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-3 text-sm text-[var(--db-muted)]">
              총 {group.tags.length}개
            </div>
          </div>
        </div>
      ))}

      {/* Psychology Evidence */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">심리학적 근거</h3>
        </div>
        <div className="p-5 space-y-4">
          {Object.entries(PSYCHOLOGICAL_EVIDENCE).map(([key, evidence]) => (
            <div key={key} className="p-4 bg-[var(--db-bg)] rounded-lg">
              <h4 className="font-semibold text-[var(--db-text)] mb-2">{evidence.name}</h4>
              {'validity' in evidence && (
                <p className="text-sm text-[var(--db-muted)] mb-2">{evidence.validity}</p>
              )}
              {'reliability' in evidence && (
                <p className="text-sm text-[var(--db-muted)]">신뢰도: {evidence.reliability}</p>
              )}
              {'findings' in evidence && (
                <p className="text-sm text-[var(--db-muted)]">연구 결과 포함</p>
              )}
              {'note' in evidence && (
                <p className="text-sm text-[var(--db-muted)] italic">{evidence.note}</p>
              )}
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
  return (
    <div className="space-y-6">
      {/* Rule Plan Summary */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">룰 카테고리별 계획</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(RULE_PLAN).filter(([key]) => key !== 'total').map(([key, value]) => (
              <div key={key} className="text-center p-4 bg-[var(--db-bg)] rounded-lg">
                <div className="text-2xl font-bold text-[var(--db-brand)]">
                  {typeof value === 'object' ? value.count : value}개
                </div>
                <div className="text-sm text-[var(--db-muted)]">{key}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <span className="text-lg font-semibold text-[var(--db-text)]">
              총 {RULE_PLAN.total}개 룰 예정
            </span>
          </div>
        </div>
      </div>

      {/* Sample Rules */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">샘플 룰 ({SAMPLE_RULES.length}개)</h3>
        </div>
        <div className="p-5 space-y-4">
          {SAMPLE_RULES.map((rule) => (
            <div key={rule.id} className="p-4 bg-[var(--db-bg)] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{rule.insight.emoji}</span>
                  <h4 className="font-semibold text-[var(--db-text)]">{rule.insight.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    rule.confidence === 'high' ? 'bg-green-500/20 text-green-400' :
                    rule.confidence === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {rule.confidence}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs bg-[var(--db-panel)] text-[var(--db-muted)]">
                    {rule.category}
                  </span>
                </div>
              </div>
              <p className="text-sm text-[var(--db-muted)] mb-2">{rule.insight.description}</p>
              {rule.insight.actionTip && (
                <p className="text-sm text-[var(--db-brand)]">💡 {rule.insight.actionTip}</p>
              )}
            </div>
          ))}
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
      {/* Development Phases */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">구현 로드맵</h3>
        </div>
        <div className="p-5 space-y-4">
          {IMPLEMENTATION_ROADMAP.map((phase, index) => {
            const isMonetization = phase.phase === 'Phase 7';
            return (
              <div
                key={phase.phase}
                className={`p-4 rounded-lg ${
                  isMonetization
                    ? 'bg-amber-500/10 border border-amber-500/30'
                    : 'bg-[var(--db-bg)]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isMonetization
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-[var(--db-brand)]/20 text-[var(--db-brand)]'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--db-text)]">{phase.phase}: {phase.title}</h4>
                      {'priority' in phase && (
                        <span className="text-xs text-[var(--db-brand)]">{phase.priority}</span>
                      )}
                    </div>
                  </div>
                  {'note' in phase && (
                    <span className="text-xs text-amber-400">{phase.note}</span>
                  )}
                </div>
                <ul className="space-y-1 ml-11">
                  {phase.tasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--db-muted)]">
                      <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 ml-11">
                  <span className="text-sm text-[var(--db-brand)]">→ {phase.deliverable}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Pricing Tab
// ============================================================================

function PricingTab() {
  return (
    <div className="space-y-6">
      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Free */}
        <div className="db-card p-5">
          <h3 className="text-lg font-semibold text-[var(--db-text)] mb-4">{PRICING_TIERS.free.name}</h3>
          <ul className="space-y-2">
            {PRICING_TIERS.free.includes.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--db-muted)]">
                <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* One-time */}
        <div className="db-card p-5">
          <h3 className="text-lg font-semibold text-[var(--db-text)] mb-4">{PRICING_TIERS.oneTime.name}</h3>
          <ul className="space-y-3">
            {PRICING_TIERS.oneTime.items.map((item, i) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <span className="text-[var(--db-muted)]">{item.name}</span>
                <span className="text-[var(--db-brand)] font-medium">{item.price}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Subscription */}
        <div className="db-card p-5 border-2 border-[var(--db-brand)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--db-text)]">{PRICING_TIERS.subscription.name}</h3>
            <Sparkles className="w-5 h-5 text-[var(--db-brand)]" />
          </div>
          <div className="mb-4">
            <div className="text-2xl font-bold text-[var(--db-brand)]">
              {PRICING_TIERS.subscription.price.monthly}/월
            </div>
            <div className="text-sm text-[var(--db-muted)]">
              또는 {PRICING_TIERS.subscription.price.yearly}/년
            </div>
          </div>
          <ul className="space-y-2">
            {PRICING_TIERS.subscription.includes.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--db-muted)]">
                <CheckCircle2 className="w-4 h-4 text-[var(--db-brand)] mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Premium Features */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">프리미엄 기능 상세</h3>
        </div>
        <div className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--db-border)]">
                  <th className="text-left py-3 text-[var(--db-muted)]">기능</th>
                  <th className="text-left py-3 text-[var(--db-muted)]">설명</th>
                  <th className="text-left py-3 text-[var(--db-muted)]">가격</th>
                  <th className="text-left py-3 text-[var(--db-muted)]">모델</th>
                  <th className="text-left py-3 text-[var(--db-muted)]">재구매</th>
                </tr>
              </thead>
              <tbody>
                {PREMIUM_FEATURES.map((feature) => (
                  <tr key={feature.id} className="border-b border-[var(--db-border)]/50">
                    <td className="py-3 text-[var(--db-text)] font-medium">{feature.name}</td>
                    <td className="py-3 text-[var(--db-muted)]">{feature.description}</td>
                    <td className="py-3 text-[var(--db-brand)]">{feature.price}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        feature.pricingModel === 'subscription' ? 'bg-purple-500/20 text-purple-400' :
                        feature.pricingModel === 'bundle' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {feature.pricingModel}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        feature.repurchaseMotivation === 'high' ? 'bg-green-500/20 text-green-400' :
                        feature.repurchaseMotivation === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {feature.repurchaseMotivation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Matching Tab
// ============================================================================

function MatchingTab() {
  return (
    <div className="space-y-6">
      {/* Unique Value */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            {PEOPLE_MATCHING_SYSTEM.name} - {PEOPLE_MATCHING_SYSTEM.subtitle}
          </h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-red-500/10 rounded-lg">
              <h4 className="font-medium text-red-400 mb-2">문제</h4>
              <p className="text-sm text-[var(--db-muted)]">{PEOPLE_MATCHING_SYSTEM.uniqueValue.problem}</p>
            </div>
            <div className="p-4 bg-green-500/10 rounded-lg">
              <h4 className="font-medium text-green-400 mb-2">솔루션</h4>
              <p className="text-sm text-[var(--db-muted)]">{PEOPLE_MATCHING_SYSTEM.uniqueValue.solution}</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-[var(--db-text)] mb-2">데이터 포인트</h4>
            <div className="flex flex-wrap gap-2">
              {PEOPLE_MATCHING_SYSTEM.uniqueValue.dataPoints.map((point, i) => (
                <span key={i} className="px-3 py-1 bg-[var(--db-panel)] rounded-full text-sm text-[var(--db-muted)]">
                  {point}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Match Types */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">매칭 유형</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PEOPLE_MATCHING_SYSTEM.matchTypes.map((type) => (
              <div key={type.id} className="p-4 bg-[var(--db-bg)] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{type.emoji}</span>
                  <h4 className="font-semibold text-[var(--db-text)]">{type.name}</h4>
                </div>
                <p className="text-sm text-[var(--db-muted)] mb-2">{type.description}</p>
                <p className="text-xs text-[var(--db-brand)]">사용: {type.useCase}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Relationship Match (Free Viral) */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            {RELATIONSHIP_MATCH.name} (바이럴용)
          </h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-green-500/10 rounded-lg">
              <h4 className="font-medium text-green-400 mb-2">{RELATIONSHIP_MATCH.tiers.free.name}</h4>
              <ul className="space-y-1">
                {RELATIONSHIP_MATCH.tiers.free.includes.map((item, i) => (
                  <li key={i} className="text-sm text-[var(--db-muted)]">• {item}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-purple-500/10 rounded-lg">
              <h4 className="font-medium text-purple-400 mb-2">{RELATIONSHIP_MATCH.tiers.premium.name}</h4>
              <ul className="space-y-1">
                {RELATIONSHIP_MATCH.tiers.premium.includes.map((item, i) => (
                  <li key={i} className="text-sm text-[var(--db-muted)]">• {item}</li>
                ))}
              </ul>
              <div className="mt-3 pt-3 border-t border-[var(--db-border)]">
                <div className="text-sm text-[var(--db-brand)]">
                  {RELATIONSHIP_MATCH.tiers.premium.pricing.perPerson}/명 |
                  3인 {RELATIONSHIP_MATCH.tiers.premium.pricing.bundle3} |
                  5인 {RELATIONSHIP_MATCH.tiers.premium.pricing.bundle5}
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 bg-[var(--db-brand)]/10 rounded-lg">
            <p className="text-sm text-[var(--db-text)]">
              🔗 공유 텍스트: &ldquo;{RELATIONSHIP_MATCH.viral.shareText}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Metrics Tab
// ============================================================================

function MetricsTab() {
  return (
    <div className="space-y-6">
      {/* User Behavior Metrics */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">사용자 행동 지표</h3>
        </div>
        <div className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--db-border)]">
                  <th className="text-left py-3 text-[var(--db-muted)]">지표</th>
                  <th className="text-left py-3 text-[var(--db-muted)]">목표</th>
                  <th className="text-left py-3 text-[var(--db-muted)]">측정 방법</th>
                </tr>
              </thead>
              <tbody>
                {SUCCESS_METRICS.userBehavior.map((metric, i) => (
                  <tr key={i} className="border-b border-[var(--db-border)]/50">
                    <td className="py-3 text-[var(--db-text)]">{metric.metric}</td>
                    <td className="py-3 text-[var(--db-brand)] font-medium">{metric.target}</td>
                    <td className="py-3 text-[var(--db-muted)]">{metric.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">품질 지표</h3>
        </div>
        <div className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--db-border)]">
                  <th className="text-left py-3 text-[var(--db-muted)]">지표</th>
                  <th className="text-left py-3 text-[var(--db-muted)]">목표</th>
                  <th className="text-left py-3 text-[var(--db-muted)]">측정 방법</th>
                </tr>
              </thead>
              <tbody>
                {SUCCESS_METRICS.quality.map((metric, i) => (
                  <tr key={i} className="border-b border-[var(--db-border)]/50">
                    <td className="py-3 text-[var(--db-text)]">{metric.metric}</td>
                    <td className="py-3 text-[var(--db-brand)] font-medium">{metric.target}</td>
                    <td className="py-3 text-[var(--db-muted)]">{metric.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Gamification */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">게이미피케이션 전략</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="p-3 bg-[var(--db-brand)]/10 rounded-lg">
            <p className="text-sm text-[var(--db-text)]">
              📈 리텐션 효과: {GAMIFICATION_STRATEGY.retentionBenchmark.effect}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {GAMIFICATION_STRATEGY.mechanics.map((mechanic, i) => (
              <div key={i} className="p-4 bg-[var(--db-bg)] rounded-lg">
                <h4 className="font-semibold text-[var(--db-text)] mb-2">{mechanic.name}</h4>
                <p className="text-sm text-[var(--db-muted)] mb-2">{mechanic.description}</p>
                <p className="text-xs text-[var(--db-brand)]">{mechanic.purpose}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
