'use client';

import { useState } from 'react';
import {
  Share2,
  Users,
  Gamepad2,
  MessageCircle,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Target,
  TrendingUp,
  Shield,
  Scale,
  Zap,
  Clock,
  Star,
} from 'lucide-react';
import {
  COMMUNITY_STRATEGY,
  CORE_PRINCIPLES,
  REWARD_SYSTEM,
  CREATOR_ECOSYSTEM,
  PhaseItem,
  Risk,
  RewardActivity,
  RewardBadge,
  RewardTier,
  ContributionRecord,
  RevenueShareTier,
  ExpertType,
  ExpertService,
} from '../data/community';
import { Gift, Award, Trophy, Coins, Sparkles, DollarSign, UserCheck, Rocket, GraduationCap, Stethoscope, HandHeart } from 'lucide-react';

// ============================================================================
// Phase Icons
// ============================================================================

const PHASE_ICONS: Record<string, React.ReactNode> = {
  'phase-1': <Share2 className="w-5 h-5" />,
  'phase-2': <Users className="w-5 h-5" />,
  'phase-3': <Gamepad2 className="w-5 h-5" />,
  'phase-4': <MessageCircle className="w-5 h-5" />,
};

// ============================================================================
// Main Component
// ============================================================================

export default function CommunityStrategy() {
  const [activePhase, setActivePhase] = useState<string>('phase-1');
  const [activeTab, setActiveTab] = useState<'overview' | 'phases' | 'metrics' | 'rewards' | 'creators' | 'risks'>('overview');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2">
        {[
          { key: 'overview', label: '개요', icon: <Target className="w-4 h-4" /> },
          { key: 'phases', label: 'Phase 상세', icon: <Zap className="w-4 h-4" /> },
          { key: 'metrics', label: '지표 설계', icon: <TrendingUp className="w-4 h-4" /> },
          { key: 'rewards', label: '보상 시스템', icon: <Gift className="w-4 h-4" /> },
          { key: 'creators', label: '크리에이터 생태계', icon: <Sparkles className="w-4 h-4" /> },
          { key: 'risks', label: '리스크 & 정책', icon: <Shield className="w-4 h-4" /> },
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
      {activeTab === 'phases' && (
        <PhasesTab activePhase={activePhase} setActivePhase={setActivePhase} />
      )}
      {activeTab === 'metrics' && <MetricsTab />}
      {activeTab === 'rewards' && <RewardsTab />}
      {activeTab === 'creators' && <CreatorsTab />}
      {activeTab === 'risks' && <RisksTab />}
    </div>
  );
}

// ============================================================================
// Overview Tab
// ============================================================================

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Core Principles */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">핵심 원칙</h3>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          {CORE_PRINCIPLES.map((principle) => (
            <div
              key={principle.id}
              className="p-4 rounded-xl"
              style={{ background: 'rgba(122, 162, 255, 0.08)' }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{principle.icon}</span>
                <div>
                  <h4 className="font-semibold text-[var(--db-text)] mb-1">
                    {principle.title}
                  </h4>
                  <p className="text-sm text-[var(--db-muted)]">
                    {principle.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phase Timeline */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">로드맵 타임라인</h3>
        </div>
        <div className="p-5">
          <div className="flex items-start gap-4">
            {COMMUNITY_STRATEGY.phases.map((phase, idx) => (
              <div key={phase.id} className="flex-1 relative">
                {/* Connector */}
                {idx < COMMUNITY_STRATEGY.phases.length - 1 && (
                  <div
                    className="absolute top-6 left-1/2 w-full h-0.5"
                    style={{ background: 'var(--db-muted)', opacity: 0.3 }}
                  />
                )}

                {/* Phase Card */}
                <div className="relative z-10 text-center">
                  <div
                    className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `${phase.color}22`, color: phase.color }}
                  >
                    {PHASE_ICONS[phase.id]}
                  </div>
                  <h4 className="font-semibold text-[var(--db-text)] text-sm mb-1">
                    {phase.title.replace('Phase ', 'P').split(':')[0]}
                  </h4>
                  <p className="text-xs text-[var(--db-muted)] mb-2">
                    {phase.subtitle}
                  </p>
                  <span
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                    style={{ background: `${phase.color}22`, color: phase.color }}
                  >
                    <Clock className="w-3 h-3" />
                    {phase.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <QuickStatCard
          label="총 기능 항목"
          value={COMMUNITY_STRATEGY.phases.reduce((sum, p) => sum + p.items.length, 0)}
          icon={<Zap className="w-5 h-5" />}
          color="#7aa2ff"
        />
        <QuickStatCard
          label="핵심 지표"
          value={COMMUNITY_STRATEGY.coreMetrics.length}
          icon={<TrendingUp className="w-5 h-5" />}
          color="#55e6c1"
        />
        <QuickStatCard
          label="리스크 항목"
          value={COMMUNITY_STRATEGY.risks.length}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="#ffd166"
        />
        <QuickStatCard
          label="모더레이션 규칙"
          value={COMMUNITY_STRATEGY.moderationRules.length}
          icon={<Shield className="w-5 h-5" />}
          color="#ff6b6b"
        />
      </div>
    </div>
  );
}

function QuickStatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="db-card p-5">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
        style={{ background: `${color}22` }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-[var(--db-text)]">{value}</p>
      <p className="text-sm text-[var(--db-muted)]">{label}</p>
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
  const currentPhase = COMMUNITY_STRATEGY.phases.find((p) => p.id === activePhase);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Phase Selector */}
      <div className="col-span-3 space-y-2">
        {COMMUNITY_STRATEGY.phases.map((phase) => (
          <button
            key={phase.id}
            onClick={() => setActivePhase(phase.id)}
            className={`w-full text-left p-4 rounded-xl transition-all ${
              activePhase === phase.id
                ? 'bg-[var(--db-brand)]/20 border border-[var(--db-brand)]/50'
                : 'bg-[var(--db-panel)] hover:bg-[var(--db-panel)]/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `${phase.color}22`, color: phase.color }}
              >
                {PHASE_ICONS[phase.id]}
              </div>
              <div>
                <h4 className="font-semibold text-[var(--db-text)] text-sm">
                  {phase.title.split(':')[0]}
                </h4>
                <p className="text-xs text-[var(--db-muted)]">{phase.duration}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Phase Detail */}
      <div className="col-span-9 space-y-4">
        {currentPhase && (
          <>
            {/* Phase Header */}
            <div
              className="p-5 rounded-xl"
              style={{ background: `${currentPhase.color}15` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{currentPhase.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-[var(--db-text)]">
                    {currentPhase.title}
                  </h3>
                  <p className="text-sm text-[var(--db-muted)]">
                    {currentPhase.subtitle} · {currentPhase.duration}
                  </p>
                </div>
              </div>

              {/* Key Principles */}
              {currentPhase.keyPrinciples && (
                <div className="mt-4 p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <h4 className="text-sm font-semibold text-[var(--db-text)] mb-2">
                    핵심 원칙
                  </h4>
                  <ul className="space-y-1">
                    {currentPhase.keyPrinciples.map((principle, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-[var(--db-muted)]"
                      >
                        <ChevronRight className="w-4 h-4 mt-0.5 text-[var(--db-brand)]" />
                        {principle}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-2 gap-4">
              {currentPhase.items.map((item) => (
                <PhaseItemCard key={item.id} item={item} phaseColor={currentPhase.color} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PhaseItemCard({ item, phaseColor }: { item: PhaseItem; phaseColor: string }) {
  const [expanded, setExpanded] = useState(false);

  const priorityColors = {
    high: '#ff6b6b',
    medium: '#ffd166',
    low: '#55e6c1',
  };

  return (
    <div className="db-card overflow-hidden">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-[var(--db-text)]">{item.title}</h4>
          <span
            className="px-2 py-0.5 rounded text-xs font-medium"
            style={{
              background: `${priorityColors[item.priority]}22`,
              color: priorityColors[item.priority],
            }}
          >
            {item.priority === 'high' ? '높음' : item.priority === 'medium' ? '중간' : '낮음'}
          </span>
        </div>

        <p className="text-sm text-[var(--db-muted)] mb-3">{item.description}</p>

        {/* Difficulty & Impact */}
        <div className="flex gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--db-muted)]">난이도</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: n <= item.difficulty ? '#ff6b6b' : 'rgba(255,255,255,0.1)',
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--db-muted)]">임팩트</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className="w-3 h-3"
                  style={{
                    color: n <= item.impact ? '#ffd166' : 'rgba(255,255,255,0.1)',
                    fill: n <= item.impact ? '#ffd166' : 'transparent',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Expand/Collapse */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-[var(--db-brand)] hover:underline flex items-center gap-1"
        >
          {expanded ? '접기' : '상세 보기'}
          <ChevronRight
            className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`}
          />
        </button>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
            {item.details && (
              <div>
                <h5 className="text-xs font-semibold text-[var(--db-muted)] mb-1">상세</h5>
                <ul className="space-y-1">
                  {item.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-[var(--db-text)]">
                      <CheckCircle2 className="w-3 h-3 mt-0.5 text-[var(--db-brand)]" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {item.metrics && (
              <div>
                <h5 className="text-xs font-semibold text-[var(--db-muted)] mb-1">측정 지표</h5>
                <div className="flex flex-wrap gap-1">
                  {item.metrics.map((metric, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-xs"
                      style={{ background: `${phaseColor}22`, color: phaseColor }}
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {item.risks && (
              <div>
                <h5 className="text-xs font-semibold text-[var(--db-muted)] mb-1">리스크</h5>
                <ul className="space-y-1">
                  {item.risks.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-[var(--db-warning)]">
                      <AlertTriangle className="w-3 h-3 mt-0.5" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Metrics Tab
// ============================================================================

function MetricsTab() {
  const categories = [
    { key: 'viral', label: '바이럴', color: '#7aa2ff' },
    { key: 'retention', label: '리텐션', color: '#55e6c1' },
    { key: 'engagement', label: '인게이지먼트', color: '#ffd166' },
    { key: 'safety', label: '안전', color: '#ff6b6b' },
  ] as const;

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const metrics = COMMUNITY_STRATEGY.coreMetrics.filter(
          (m) => m.category === category.key
        );

        return (
          <div key={category.key} className="db-card">
            <div
              className="db-card-header px-5 py-4 flex items-center gap-3"
              style={{ borderLeftColor: category.color, borderLeftWidth: 3 }}
            >
              <h3 className="text-lg font-semibold text-[var(--db-text)]">
                {category.label} 지표
              </h3>
              <span
                className="px-2 py-0.5 rounded text-xs"
                style={{ background: `${category.color}22`, color: category.color }}
              >
                {metrics.length}개
              </span>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-3 gap-4">
                {metrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="p-4 rounded-lg"
                    style={{ background: 'rgba(0,0,0,0.3)' }}
                  >
                    <h4 className="font-semibold text-[var(--db-text)] mb-1">
                      {metric.name}
                    </h4>
                    <p className="text-sm text-[var(--db-muted)]">
                      {metric.description}
                    </p>
                    {metric.target && (
                      <div className="mt-2 flex items-center gap-2">
                        <Target className="w-3 h-3 text-[var(--db-brand)]" />
                        <span className="text-xs text-[var(--db-brand)]">
                          목표: {metric.target}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// Rewards Tab
// ============================================================================

function RewardsTab() {
  return (
    <div className="space-y-6">
      {/* Core Principles */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-[var(--db-brand)]" />
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            보상 시스템 원칙
          </h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-3 gap-3">
            {REWARD_SYSTEM.principles.map((principle, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg flex items-start gap-2"
                style={{ background: 'rgba(122, 162, 255, 0.08)' }}
              >
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-[var(--db-brand)] flex-shrink-0" />
                <span className="text-sm text-[var(--db-text)]">{principle}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Point Activities */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4 flex items-center gap-2">
          <Coins className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            포인트 활동
          </h3>
          <span className="text-sm text-[var(--db-muted)] ml-2">
            기여도에 따른 차등 보상
          </span>
        </div>
        <div className="p-5">
          <div className="space-y-4">
            {/* Basic Activities */}
            <ActivitySection
              title="기본 참여"
              color="#94a3b8"
              activities={REWARD_SYSTEM.activities.filter(a => a.category === 'basic')}
            />
            {/* Contribution Activities */}
            <ActivitySection
              title="기여 활동 (핵심!)"
              color="#3b82f6"
              activities={REWARD_SYSTEM.activities.filter(a => a.category === 'contribution')}
            />
            {/* Achievement Activities */}
            <ActivitySection
              title="커뮤니티 인정"
              color="#22c55e"
              activities={REWARD_SYSTEM.activities.filter(a => a.category === 'achievement')}
            />
          </div>
        </div>
      </div>

      {/* Tiers */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            등급 시스템
          </h3>
          <span className="text-sm text-[var(--db-muted)] ml-2">
            포인트 누적으로 등급 상승
          </span>
        </div>
        <div className="p-5">
          <div className="flex gap-4">
            {REWARD_SYSTEM.tiers.map((tier, idx) => (
              <TierCard key={tier.id} tier={tier} isLast={idx === REWARD_SYSTEM.tiers.length - 1} />
            ))}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            배지 시스템
          </h3>
        </div>
        <div className="p-5">
          <div className="space-y-4">
            {/* Vote Badges */}
            <BadgeSection
              title="투표 배지"
              badges={REWARD_SYSTEM.badges.filter(b => b.id.includes('vote') || b.id === 'first-vote')}
            />
            {/* Contribution Badges */}
            <BadgeSection
              title="기여 배지"
              badges={REWARD_SYSTEM.badges.filter(b => ['idea-maker', 'trend-setter', 'analyst'].includes(b.id))}
            />
            {/* Community Badges */}
            <BadgeSection
              title="커뮤니티 배지"
              badges={REWARD_SYSTEM.badges.filter(b => ['influencer', 'helper'].includes(b.id))}
            />
          </div>
        </div>
      </div>

      {/* Future Monetization (Memo) */}
      <div className="db-card opacity-60">
        <div className="db-card-header px-5 py-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[var(--db-muted)]" />
          <h3 className="text-lg font-semibold text-[var(--db-muted)]">
            장기 검토 사항 (1년 후)
          </h3>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            {REWARD_SYSTEM.futureMonetization.map((item, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg text-sm text-[var(--db-muted)]"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivitySection({
  title,
  color,
  activities,
}: {
  title: string;
  color: string;
  activities: RewardActivity[];
}) {
  return (
    <div>
      <h4
        className="text-sm font-semibold mb-2 flex items-center gap-2"
        style={{ color }}
      >
        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
        {title}
      </h4>
      <div className="grid grid-cols-3 gap-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="p-3 rounded-lg"
            style={{ background: 'rgba(0,0,0,0.3)' }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-[var(--db-text)] text-sm">
                {activity.name}
              </span>
              <span
                className="px-2 py-0.5 rounded text-xs font-bold"
                style={{ background: '#f59e0b22', color: '#f59e0b' }}
              >
                +{activity.points}P
              </span>
            </div>
            <p className="text-xs text-[var(--db-muted)]">{activity.description}</p>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs text-[var(--db-muted)]">난이도</span>
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: n <= activity.difficulty ? color : 'rgba(255,255,255,0.1)',
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TierCard({ tier, isLast }: { tier: RewardTier; isLast: boolean }) {
  return (
    <div className="flex-1 relative">
      {/* Connector */}
      {!isLast && (
        <div
          className="absolute top-8 left-1/2 w-full h-0.5"
          style={{ background: 'var(--db-muted)', opacity: 0.2 }}
        />
      )}

      <div className="relative z-10">
        <div
          className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center text-2xl mb-3"
          style={{ background: `${tier.color}22` }}
        >
          {tier.emoji}
        </div>
        <div className="text-center">
          <h4 className="font-bold text-[var(--db-text)]" style={{ color: tier.color }}>
            {tier.name}
          </h4>
          <p className="text-xs text-[var(--db-muted)] mb-2">
            {tier.minPoints.toLocaleString()}P+
          </p>
          <div className="space-y-1">
            {tier.perks.map((perk, idx) => (
              <div
                key={idx}
                className="text-xs px-2 py-1 rounded"
                style={{ background: `${tier.color}15`, color: tier.color }}
              >
                {perk}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BadgeSection({
  title,
  badges,
}: {
  title: string;
  badges: RewardBadge[];
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-[var(--db-muted)] mb-2">{title}</h4>
      <div className="flex gap-3 flex-wrap">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="p-3 rounded-lg min-w-[140px]"
            style={{ background: 'rgba(0,0,0,0.3)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{badge.emoji}</span>
              <span className="font-medium text-[var(--db-text)] text-sm">
                {badge.name}
              </span>
            </div>
            <p className="text-xs text-[var(--db-muted)] mb-2">{badge.requirement}</p>
            {badge.perks.length > 0 && (
              <div className="space-y-1">
                {badge.perks.map((perk, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-[var(--db-brand)] flex items-center gap-1"
                  >
                    <Star className="w-3 h-3" />
                    {perk}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Creators Tab (크리에이터 생태계)
// ============================================================================

function CreatorsTab() {
  return (
    <div className="space-y-6">
      {/* Vision & Core Principle */}
      <div className="db-card">
        <div className="p-6" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--db-text)]">
                {CREATOR_ECOSYSTEM.vision}
              </h3>
              <p className="text-sm text-[var(--db-muted)]">
                {CREATOR_ECOSYSTEM.corePrinciple}
              </p>
            </div>
          </div>

          {/* Differentiators */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {CREATOR_ECOSYSTEM.differentiators.map((diff, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-3 rounded-lg"
                style={{ background: 'rgba(0,0,0,0.3)' }}
              >
                <Rocket className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span className="text-sm text-[var(--db-text)]">{diff}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contribution Types */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-[var(--db-brand)]" />
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            기여 유형 & 크레딧 표시
          </h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 gap-4">
            {CREATOR_ECOSYSTEM.contributionTypes.map((contribution) => (
              <ContributionCard key={contribution.id} contribution={contribution} />
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Share Tiers */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            크리에이터 수익 공유 등급
          </h3>
          <span className="text-xs text-[var(--db-muted)] ml-2 px-2 py-1 rounded bg-amber-500/20 text-amber-400">
            1년+ 후 도입 예정
          </span>
        </div>
        <div className="p-5">
          <div className="flex gap-4">
            {CREATOR_ECOSYSTEM.revenueShareTiers.map((tier, idx) => (
              <RevenueShareCard
                key={tier.id}
                tier={tier}
                isLast={idx === CREATOR_ECOSYSTEM.revenueShareTiers.length - 1}
              />
            ))}
          </div>

          {/* Revenue Examples */}
          <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
            <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              수익 공유 예시
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {CREATOR_ECOSYSTEM.revenueShareExamples.map((example, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm text-[var(--db-text)]"
                >
                  <ChevronRight className="w-3 h-3 text-green-400" />
                  {example}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[var(--db-brand)]" />
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            크리에이터 시스템 로드맵
          </h3>
        </div>
        <div className="p-5">
          <div className="flex gap-6">
            {CREATOR_ECOSYSTEM.roadmap.map((phase, idx) => (
              <div key={idx} className="flex-1 relative">
                {/* Connector */}
                {idx < CREATOR_ECOSYSTEM.roadmap.length - 1 && (
                  <div
                    className="absolute top-4 left-1/2 w-full h-0.5"
                    style={{ background: 'var(--db-muted)', opacity: 0.2 }}
                  />
                )}

                <div className="relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-3 mx-auto ${
                      idx === 0
                        ? 'bg-[var(--db-brand)] text-[#081023]'
                        : 'bg-[var(--db-panel)] text-[var(--db-muted)]'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <h4 className="text-sm font-semibold text-[var(--db-text)] text-center mb-3">
                    {phase.phase}
                  </h4>
                  <div className="space-y-2">
                    {phase.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="flex items-start gap-2 text-xs text-[var(--db-muted)] p-2 rounded"
                        style={{ background: 'rgba(0,0,0,0.2)' }}
                      >
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-[var(--db-brand)] flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expert System Section */}
      <ExpertSystemSection />
    </div>
  );
}

// ============================================================================
// Expert System Section (전문가 협업 시스템)
// ============================================================================

function ExpertSystemSection() {
  const expertSystem = CREATOR_ECOSYSTEM.expertSystem;

  return (
    <>
      {/* Expert Vision Header */}
      <div className="db-card">
        <div className="p-6" style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(14, 165, 233, 0.15) 100%)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--db-text)]">
                {expertSystem.vision}
              </h3>
              <span className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-400">
                6개월+ 후 도입 예정
              </span>
            </div>
          </div>

          {/* Principles */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {expertSystem.principles.map((principle, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-3 rounded-lg"
                style={{ background: 'rgba(0,0,0,0.3)' }}
              >
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-sm text-[var(--db-text)]">{principle}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expert Types */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            전문가 유형
          </h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 gap-4">
            {expertSystem.expertTypes.map((expert) => (
              <ExpertTypeCard key={expert.id} expert={expert} />
            ))}
          </div>
        </div>
      </div>

      {/* Expert Services */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4 flex items-center gap-2">
          <HandHeart className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            전문가 서비스
          </h3>
        </div>
        <div className="p-5">
          <div className="space-y-3">
            {expertSystem.services.map((service) => (
              <ExpertServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>

      {/* Benefits (3-way) */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            Win-Win-Win 구조
          </h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-3 gap-4">
            <BenefitColumn
              title="유저"
              emoji="👤"
              color="#3b82f6"
              benefits={expertSystem.benefits.forUsers}
            />
            <BenefitColumn
              title="전문가"
              emoji="🎓"
              color="#22c55e"
              benefits={expertSystem.benefits.forExperts}
            />
            <BenefitColumn
              title="플랫폼"
              emoji="🏢"
              color="#8b5cf6"
              benefits={expertSystem.benefits.forPlatform}
            />
          </div>
        </div>
      </div>

      {/* Expert Roadmap */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            전문가 시스템 로드맵
          </h3>
        </div>
        <div className="p-5">
          <div className="flex gap-6">
            {expertSystem.roadmap.map((phase, idx) => (
              <div key={idx} className="flex-1 relative">
                {idx < expertSystem.roadmap.length - 1 && (
                  <div
                    className="absolute top-4 left-1/2 w-full h-0.5"
                    style={{ background: 'var(--db-muted)', opacity: 0.2 }}
                  />
                )}
                <div className="relative z-10">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-3 mx-auto bg-[var(--db-panel)] text-[var(--db-muted)]"
                  >
                    {idx + 1}
                  </div>
                  <h4 className="text-sm font-semibold text-[var(--db-text)] text-center mb-3">
                    {phase.phase}
                  </h4>
                  <div className="space-y-2">
                    {phase.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="flex items-start gap-2 text-xs text-[var(--db-muted)] p-2 rounded"
                        style={{ background: 'rgba(0,0,0,0.2)' }}
                      >
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-green-400 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ExpertTypeCard({ expert }: { expert: ExpertType }) {
  return (
    <div
      className="p-4 rounded-xl"
      style={{ background: 'rgba(0,0,0,0.3)' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{expert.emoji}</span>
        <h4 className="font-semibold text-[var(--db-text)]">{expert.title}</h4>
      </div>
      <p className="text-sm text-[var(--db-muted)] mb-3">{expert.role}</p>

      <div className="mb-3">
        <h5 className="text-xs font-semibold text-[var(--db-muted)] mb-1">자격 요건</h5>
        <div className="flex flex-wrap gap-1">
          {expert.qualifications.map((qual, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded text-xs"
              style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}
            >
              {qual}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h5 className="text-xs font-semibold text-[var(--db-muted)] mb-1">콘텐츠 유형</h5>
        <div className="flex flex-wrap gap-1">
          {expert.contentTypes.map((type, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded text-xs"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--db-text)' }}
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExpertServiceCard({ service }: { service: ExpertService }) {
  const phaseColors: Record<string, string> = {
    'Phase 2': '#3b82f6',
    'Phase 3': '#8b5cf6',
  };
  const color = phaseColors[service.phase] || '#94a3b8';

  return (
    <div
      className="p-4 rounded-xl flex items-start gap-4"
      style={{ background: 'rgba(0,0,0,0.3)' }}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-[var(--db-text)]">{service.name}</h4>
          <span
            className="px-2 py-0.5 rounded text-xs"
            style={{ background: `${color}22`, color }}
          >
            {service.phase}
          </span>
        </div>
        <p className="text-sm text-[var(--db-muted)]">{service.description}</p>
      </div>
      <div className="text-right">
        <span className="text-xs text-[var(--db-muted)]">수익 모델</span>
        <p className="text-sm text-green-400 font-medium">{service.revenueModel}</p>
      </div>
    </div>
  );
}

function BenefitColumn({
  title,
  emoji,
  color,
  benefits,
}: {
  title: string;
  emoji: string;
  color: string;
  benefits: string[];
}) {
  return (
    <div
      className="p-4 rounded-xl"
      style={{ background: `${color}10` }}
    >
      <div className="text-center mb-3">
        <span className="text-2xl">{emoji}</span>
        <h4 className="font-semibold text-sm" style={{ color }}>
          {title}
        </h4>
      </div>
      <div className="space-y-2">
        {benefits.map((benefit, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2 text-xs text-[var(--db-text)]"
          >
            <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color }} />
            {benefit}
          </div>
        ))}
      </div>
    </div>
  );
}

function ContributionCard({ contribution }: { contribution: ContributionRecord }) {
  return (
    <div
      className="p-4 rounded-xl"
      style={{ background: 'rgba(0,0,0,0.3)' }}
    >
      <h4 className="font-semibold text-[var(--db-text)] mb-1">{contribution.title}</h4>
      <p className="text-sm text-[var(--db-muted)] mb-3">{contribution.description}</p>

      {/* Display Example */}
      <div
        className="p-2 rounded-lg mb-3 text-sm"
        style={{ background: 'rgba(122, 162, 255, 0.1)' }}
      >
        <code className="text-[var(--db-brand)]">{contribution.displayExample}</code>
      </div>

      {/* Profile Records */}
      <div>
        <h5 className="text-xs font-semibold text-[var(--db-muted)] mb-2">프로필 기록</h5>
        <div className="flex flex-wrap gap-1">
          {contribution.profileRecord.map((record, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded text-xs"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--db-text)' }}
            >
              {record}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function RevenueShareCard({ tier, isLast }: { tier: RevenueShareTier; isLast: boolean }) {
  return (
    <div className="flex-1 relative">
      {/* Connector */}
      {!isLast && (
        <div
          className="absolute top-10 left-1/2 w-full h-0.5"
          style={{ background: 'var(--db-muted)', opacity: 0.2 }}
        />
      )}

      <div className="relative z-10">
        <div
          className="w-20 h-20 mx-auto rounded-xl flex flex-col items-center justify-center mb-3"
          style={{ background: `${tier.color}22` }}
        >
          <span className="text-2xl font-bold" style={{ color: tier.color }}>
            {tier.sharePercent}%
          </span>
          <span className="text-xs text-[var(--db-muted)]">수익 공유</span>
        </div>
        <div className="text-center">
          <h4 className="font-bold text-sm" style={{ color: tier.color }}>
            {tier.name}
          </h4>
          <p className="text-xs text-[var(--db-muted)] mt-1 mb-2">
            {tier.requirement}
          </p>
          <p
            className="text-xs px-2 py-1 rounded"
            style={{ background: `${tier.color}15`, color: tier.color }}
          >
            {tier.description}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Risks Tab
// ============================================================================

function RisksTab() {
  return (
    <div className="space-y-6">
      {/* Risks */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            주요 리스크 & 대응
          </h3>
        </div>
        <div className="p-5 space-y-4">
          {COMMUNITY_STRATEGY.risks.map((risk) => (
            <RiskCard key={risk.id} risk={risk} />
          ))}
        </div>
      </div>

      {/* Moderation Rules */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            모더레이션 규칙
          </h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 gap-4">
            {COMMUNITY_STRATEGY.moderationRules.map((rule) => (
              <div
                key={rule.id}
                className="p-4 rounded-lg"
                style={{ background: 'rgba(0,0,0,0.3)' }}
              >
                <h4 className="font-semibold text-[var(--db-text)] mb-1">
                  {rule.title}
                </h4>
                <p className="text-sm text-[var(--db-muted)] mb-2">
                  {rule.description}
                </p>
                <div className="flex items-center gap-2">
                  <Shield className="w-3 h-3 text-[var(--db-danger)]" />
                  <span className="text-xs text-[var(--db-danger)]">
                    {rule.action}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legal Notes */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4 flex items-center gap-2">
          <Scale className="w-5 h-5 text-[var(--db-brand)]" />
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            법/정책 고지 문구
          </h3>
        </div>
        <div className="p-5">
          <ul className="space-y-2">
            {COMMUNITY_STRATEGY.legalNotes.map((note, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{ background: 'rgba(122, 162, 255, 0.08)' }}
              >
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-[var(--db-brand)]" />
                <span className="text-sm text-[var(--db-text)]">{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function RiskCard({ risk }: { risk: Risk }) {
  const severityColors = {
    high: '#ff6b6b',
    medium: '#ffd166',
    low: '#55e6c1',
  };

  return (
    <div
      className="p-4 rounded-xl"
      style={{
        background: `${severityColors[risk.severity]}08`,
        borderLeft: `3px solid ${severityColors[risk.severity]}`,
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle
            className="w-5 h-5"
            style={{ color: severityColors[risk.severity] }}
          />
          <h4 className="font-semibold text-[var(--db-text)]">{risk.title}</h4>
        </div>
        <span
          className="px-2 py-0.5 rounded text-xs font-medium"
          style={{
            background: `${severityColors[risk.severity]}22`,
            color: severityColors[risk.severity],
          }}
        >
          {risk.severity === 'high' ? '높음' : risk.severity === 'medium' ? '중간' : '낮음'}
        </span>
      </div>
      <p className="text-sm text-[var(--db-muted)] mb-3">{risk.description}</p>
      <div>
        <h5 className="text-xs font-semibold text-[var(--db-muted)] mb-2">대응 방안</h5>
        <ul className="space-y-1">
          {risk.mitigation.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-[var(--db-text)]">
              <CheckCircle2 className="w-3 h-3 mt-1 text-[var(--db-ok)]" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
