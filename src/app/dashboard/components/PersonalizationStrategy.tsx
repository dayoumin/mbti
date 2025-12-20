'use client';

import { useState } from 'react';
import {
  Target,
  Users,
  Zap,
  Layout,
  Map,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
  Lightbulb,
  BarChart3,
  UserCog,
  Eye,
  Code,
  FileCode,
} from 'lucide-react';
import {
  PERSONALIZATION_STRATEGY,
  PERSONALIZATION_PRINCIPLES,
  USER_SEGMENTS,
  RECOMMENDATION_ALGORITHMS,
  COLD_START_STRATEGIES,
  UI_PATTERNS,
  USER_PROFILING_SYSTEM,
  IMPLEMENTATION_ROADMAP,
  EXISTING_CODE_ISSUES,
  Principle,
  UserSegment,
  AlgorithmDefinition,
  ColdStartStrategy,
  UIPattern,
  RoadmapPhase,
  CodeIssue,
} from '../data/personalization-strategy';

// ============================================================================
// Tab Types
// ============================================================================

type TabKey = 'overview' | 'principles' | 'segments' | 'algorithms' | 'ui-patterns' | 'profiling' | 'roadmap' | 'issues';

// ============================================================================
// Main Component
// ============================================================================

export default function PersonalizationStrategy() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: '개요', icon: <Eye className="w-4 h-4" /> },
    { key: 'principles', label: '핵심 원칙', icon: <Target className="w-4 h-4" /> },
    { key: 'segments', label: '사용자 세그먼트', icon: <Users className="w-4 h-4" /> },
    { key: 'algorithms', label: '추천 알고리즘', icon: <Zap className="w-4 h-4" /> },
    { key: 'ui-patterns', label: 'UI 패턴', icon: <Layout className="w-4 h-4" /> },
    { key: 'profiling', label: '프로파일링', icon: <UserCog className="w-4 h-4" /> },
    { key: 'roadmap', label: '구현 로드맵', icon: <Map className="w-4 h-4" /> },
    { key: 'issues', label: '코드 이슈', icon: <AlertTriangle className="w-4 h-4" /> },
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
      {activeTab === 'principles' && <PrinciplesTab />}
      {activeTab === 'segments' && <SegmentsTab />}
      {activeTab === 'algorithms' && <AlgorithmsTab />}
      {activeTab === 'ui-patterns' && <UIPatternsTab />}
      {activeTab === 'profiling' && <ProfilingTab />}
      {activeTab === 'roadmap' && <RoadmapTab />}
      {activeTab === 'issues' && <IssuesTab />}
    </div>
  );
}

// ============================================================================
// Stat Card Component
// ============================================================================

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="db-card p-4">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${color}20`, color }}
        >
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--db-text)]">{value}</p>
          <p className="text-xs text-[var(--db-muted)]">{label}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Overview Tab
// ============================================================================

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="db-card p-6">
        <h3 className="text-lg font-bold text-[var(--db-text)] mb-3">
          개인화 리텐션 전략이란?
        </h3>
        <p className="text-[var(--db-muted)] mb-4">
          유튜브처럼 <strong className="text-[var(--db-text)]">사용자 관심사 중심 개인화 추천</strong> 시스템을 구축합니다.
          단순히 "다음 테스트"를 보여주는 것이 아니라, <strong className="text-[var(--db-text)]">70% 관심 콘텐츠 + 20% 관련 콘텐츠 + 10% 새로운 것</strong>을 조합하여 추천합니다.
        </p>

        {/* Problem vs Solution */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <h4 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              현재 문제
            </h4>
            <ul className="space-y-2 text-sm text-[var(--db-muted)]">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                다음 퀴즈 하나만 제시
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                카테고리 기반 단순 연결
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                모든 사용자 동일 콘텐츠
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                활동 데이터 수집만 하고 활용 안함
              </li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
            <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              목표
            </h4>
            <ul className="space-y-2 text-sm text-[var(--db-muted)]">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                2-3개 선택지 제공
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                관심사 점수 기반 추천
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                스타일/연령대 반영
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                데이터 기반 개인화
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 70-20-10 Rule Visualization */}
      <div className="db-card p-6">
        <h3 className="text-lg font-bold text-[var(--db-text)] mb-4">
          70-20-10 법칙
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-8 rounded-lg overflow-hidden flex">
            <div className="bg-[#7aa2ff] h-full" style={{ width: '70%' }} />
            <div className="bg-[#55e6c1] h-full" style={{ width: '20%' }} />
            <div className="bg-[#ff6b9d] h-full" style={{ width: '10%' }} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="w-4 h-4 rounded bg-[#7aa2ff] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[var(--db-text)]">70% 관심 콘텐츠</p>
            <p className="text-xs text-[var(--db-muted)]">익숙하고 좋아하는 것</p>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 rounded bg-[#55e6c1] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[var(--db-text)]">20% 관련 콘텐츠</p>
            <p className="text-xs text-[var(--db-muted)]">관심사 확장</p>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 rounded bg-[#ff6b9d] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[var(--db-text)]">10% 새로운 것</p>
            <p className="text-xs text-[var(--db-muted)]">새 발견 유도</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="핵심 원칙"
          value={PERSONALIZATION_PRINCIPLES.length}
          icon={<Target className="w-5 h-5" />}
          color="#7aa2ff"
        />
        <StatCard
          label="사용자 세그먼트"
          value={USER_SEGMENTS.length}
          icon={<Users className="w-5 h-5" />}
          color="#55e6c1"
        />
        <StatCard
          label="추천 알고리즘"
          value={RECOMMENDATION_ALGORITHMS.length}
          icon={<Zap className="w-5 h-5" />}
          color="#ff6b9d"
        />
        <StatCard
          label="구현 단계"
          value={IMPLEMENTATION_ROADMAP.length}
          icon={<Map className="w-5 h-5" />}
          color="#ffd166"
        />
      </div>

      {/* Available Data */}
      <div className="db-card p-6">
        <h3 className="text-lg font-bold text-[var(--db-text)] mb-4">
          활용 가능한 기존 데이터 (11가지)
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { source: 'ResultService', data: ['completedTests', 'incompleteTests'] },
            { source: 'ProfileService', data: ['personality.traits (5개 차원)', 'petChemi.scores'] },
            { source: 'GamificationService', data: ['testsByType', 'quizzesByCategory', 'pollsByCategory', 'currentStreak', 'dailyActivities'] },
            { source: 'FeedbackService', data: ['minorityVotes', 'bestCategory'] },
            { source: 'NextActionService', data: ['TEST_TO_CONTENT 그래프'] },
          ].map((item) => (
            <div key={item.source} className="p-3 rounded-lg bg-[var(--db-panel)] border border-[var(--db-border)]">
              <p className="text-sm font-semibold text-[var(--db-text)] mb-2">{item.source}</p>
              <ul className="space-y-1">
                {item.data.map((d) => (
                  <li key={d} className="text-xs text-[var(--db-muted)] flex items-center gap-1">
                    <code className="px-1.5 py-0.5 rounded bg-[var(--db-bg)] text-[#7aa2ff]">{d}</code>
                  </li>
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
// Principles Tab
// ============================================================================

function PrinciplesTab() {
  const [selectedPrinciple, setSelectedPrinciple] = useState<Principle>(PERSONALIZATION_PRINCIPLES[0]);

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Left: Principle List */}
      <div className="col-span-1 space-y-3">
        {PERSONALIZATION_PRINCIPLES.map((principle) => (
          <button
            key={principle.id}
            onClick={() => setSelectedPrinciple(principle)}
            className={`w-full text-left p-4 rounded-xl transition-all ${
              selectedPrinciple.id === principle.id
                ? 'bg-[var(--db-panel)] border-2'
                : 'bg-[var(--db-bg)] border border-[var(--db-border)] hover:border-[var(--db-muted)]'
            }`}
            style={{
              borderColor: selectedPrinciple.id === principle.id ? principle.color : undefined,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{principle.icon}</span>
              <div>
                <p className="font-semibold text-[var(--db-text)]">{principle.title}</p>
                <p className="text-xs text-[var(--db-muted)]">{principle.subtitle}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Right: Principle Detail */}
      <div className="col-span-2 db-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
            style={{ background: `${selectedPrinciple.color}20` }}
          >
            {selectedPrinciple.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--db-text)]">{selectedPrinciple.title}</h3>
            <p className="text-sm text-[var(--db-muted)]">{selectedPrinciple.subtitle}</p>
          </div>
        </div>

        <p className="text-[var(--db-muted)] mb-6">{selectedPrinciple.description}</p>

        <div className="space-y-4">
          <h4 className="font-semibold text-[var(--db-text)] flex items-center gap-2">
            <Lightbulb className="w-4 h-4" style={{ color: selectedPrinciple.color }} />
            적용 예시
          </h4>
          <ul className="space-y-2">
            {selectedPrinciple.examples.map((example, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-[var(--db-panel)]"
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: `${selectedPrinciple.color}30`, color: selectedPrinciple.color }}
                >
                  {idx + 1}
                </span>
                <p className="text-sm text-[var(--db-text)]">{example}</p>
              </li>
            ))}
          </ul>
        </div>

        {selectedPrinciple.metrics && (
          <div className="mt-6 p-4 rounded-lg bg-[var(--db-bg)] border border-[var(--db-border)]">
            <h4 className="font-semibold text-[var(--db-text)] mb-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" style={{ color: selectedPrinciple.color }} />
              측정 지표
            </h4>
            <div className="flex gap-2 flex-wrap">
              {selectedPrinciple.metrics.map((metric) => (
                <span
                  key={metric}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: `${selectedPrinciple.color}20`, color: selectedPrinciple.color }}
                >
                  {metric}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Segments Tab
// ============================================================================

function SegmentsTab() {
  const [selectedSegment, setSelectedSegment] = useState<UserSegment>(USER_SEGMENTS[0]);

  return (
    <div className="space-y-6">
      {/* Segment Cards */}
      <div className="grid grid-cols-4 gap-4">
        {USER_SEGMENTS.map((segment) => (
          <button
            key={segment.id}
            onClick={() => setSelectedSegment(segment)}
            className={`p-4 rounded-xl text-left transition-all ${
              selectedSegment.id === segment.id
                ? 'ring-2 ring-[var(--db-brand)]'
                : 'hover:bg-[var(--db-panel)]'
            }`}
            style={{
              background: selectedSegment.id === segment.id ? `${segment.color}15` : undefined,
            }}
          >
            <span className="text-3xl">{segment.icon}</span>
            <p className="font-semibold text-[var(--db-text)] mt-2">{segment.name}</p>
            <p className="text-xs text-[var(--db-muted)] mt-1 line-clamp-2">{segment.description}</p>
          </button>
        ))}
      </div>

      {/* Selected Segment Detail */}
      <div className="db-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
            style={{ background: `${selectedSegment.color}20` }}
          >
            {selectedSegment.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--db-text)]">{selectedSegment.name}</h3>
            <p className="text-sm text-[var(--db-muted)]">{selectedSegment.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Characteristics */}
          <div>
            <h4 className="font-semibold text-[var(--db-text)] mb-3">특성</h4>
            <ul className="space-y-2">
              {selectedSegment.characteristics.map((char, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-[var(--db-muted)]">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: selectedSegment.color }} />
                  {char}
                </li>
              ))}
            </ul>
          </div>

          {/* Triggers */}
          <div>
            <h4 className="font-semibold text-[var(--db-text)] mb-3">감지 조건</h4>
            <ul className="space-y-2">
              {selectedSegment.triggers.map((trigger, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-[var(--db-muted)]">
                  <Zap className="w-4 h-4 shrink-0 mt-0.5" style={{ color: selectedSegment.color }} />
                  {trigger}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Strategy */}
        <div className="mt-6 p-4 rounded-lg" style={{ background: `${selectedSegment.color}10` }}>
          <h4 className="font-semibold text-[var(--db-text)] mb-2">추천 전략</h4>
          <p className="text-sm" style={{ color: selectedSegment.color }}>{selectedSegment.recommendationStrategy}</p>
        </div>

        {/* Retention Tips */}
        <div className="mt-4">
          <h4 className="font-semibold text-[var(--db-text)] mb-3">리텐션 팁</h4>
          <div className="flex gap-2 flex-wrap">
            {selectedSegment.retentionTips.map((tip, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg text-xs bg-[var(--db-panel)] text-[var(--db-text)]"
              >
                {tip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Algorithms Tab
// ============================================================================

function AlgorithmsTab() {
  return (
    <div className="space-y-6">
      {/* Cold Start Strategies */}
      <div className="db-card p-6">
        <h3 className="text-lg font-bold text-[var(--db-text)] mb-4">콜드 스타트 전략</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--db-border)]">
                <th className="text-left py-3 px-4 font-semibold text-[var(--db-text)]">활동 수준</th>
                <th className="text-left py-3 px-4 font-semibold text-[var(--db-text)]">완료 테스트</th>
                <th className="text-left py-3 px-4 font-semibold text-[var(--db-text)]">전략</th>
                <th className="text-left py-3 px-4 font-semibold text-[var(--db-text)]">알고리즘</th>
                <th className="text-left py-3 px-4 font-semibold text-[var(--db-text)]">우선순위</th>
              </tr>
            </thead>
            <tbody>
              {COLD_START_STRATEGIES.map((strategy) => (
                <tr key={strategy.activityLevel} className="border-b border-[var(--db-border)]">
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      strategy.activityLevel === 'cold' ? 'bg-blue-500/20 text-blue-400' :
                      strategy.activityLevel === 'warming' ? 'bg-yellow-500/20 text-yellow-400' :
                      strategy.activityLevel === 'active' ? 'bg-green-500/20 text-green-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {strategy.activityLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[var(--db-muted)]">{strategy.completedTests}</td>
                  <td className="py-3 px-4 text-[var(--db-text)]">{strategy.strategy}</td>
                  <td className="py-3 px-4">
                    <code className="px-2 py-1 rounded bg-[var(--db-bg)] text-[#7aa2ff] text-xs">
                      {strategy.algorithm}
                    </code>
                  </td>
                  <td className="py-3 px-4 text-[var(--db-muted)] text-xs">{strategy.priority.join(' → ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Algorithm Cards */}
      <div className="grid grid-cols-2 gap-4">
        {RECOMMENDATION_ALGORITHMS.map((algo) => (
          <div key={algo.id} className="db-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{algo.icon}</span>
              <div>
                <h4 className="font-semibold text-[var(--db-text)]">{algo.name}</h4>
                <p className="text-xs text-[var(--db-muted)]">{algo.useCase}</p>
              </div>
            </div>
            <p className="text-sm text-[var(--db-muted)] mb-4">{algo.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <p className="text-xs font-semibold text-green-400 mb-2">장점</p>
                <ul className="space-y-1">
                  {algo.pros.slice(0, 2).map((pro, idx) => (
                    <li key={idx} className="text-xs text-[var(--db-muted)] flex items-start gap-1">
                      <span className="text-green-400">+</span> {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-red-400 mb-2">단점</p>
                <ul className="space-y-1">
                  {algo.cons.slice(0, 2).map((con, idx) => (
                    <li key={idx} className="text-xs text-[var(--db-muted)] flex items-start gap-1">
                      <span className="text-red-400">-</span> {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[var(--db-bg)] border border-[var(--db-border)]">
              <p className="text-xs font-semibold text-[var(--db-text)] mb-1">구현</p>
              <p className="text-xs text-[var(--db-muted)]">{algo.implementation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// UI Patterns Tab
// ============================================================================

function UIPatternsTab() {
  const [selectedPattern, setSelectedPattern] = useState<UIPattern>(UI_PATTERNS[0]);

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Left: Pattern List */}
      <div className="col-span-1 space-y-3">
        {UI_PATTERNS.map((pattern) => (
          <button
            key={pattern.id}
            onClick={() => setSelectedPattern(pattern)}
            className={`w-full text-left p-4 rounded-xl transition-all ${
              selectedPattern.id === pattern.id
                ? 'bg-[var(--db-panel)] border-2 border-[var(--db-brand)]'
                : 'bg-[var(--db-bg)] border border-[var(--db-border)] hover:border-[var(--db-muted)]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{pattern.icon}</span>
              <div>
                <p className="font-semibold text-[var(--db-text)]">{pattern.name}</p>
                <p className="text-xs text-[var(--db-muted)] line-clamp-1">{pattern.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Right: Pattern Detail */}
      <div className="col-span-2 db-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-4xl">{selectedPattern.icon}</span>
          <div>
            <h3 className="text-xl font-bold text-[var(--db-text)]">{selectedPattern.name}</h3>
            <p className="text-sm text-[var(--db-muted)]">{selectedPattern.description}</p>
          </div>
        </div>

        {/* Wireframe */}
        <div className="mb-6">
          <h4 className="font-semibold text-[var(--db-text)] mb-3 flex items-center gap-2">
            <Layout className="w-4 h-4" />
            와이어프레임
          </h4>
          <pre className="p-4 rounded-lg bg-[#0a0f1a] text-[#55e6c1] text-xs overflow-x-auto font-mono">
            {selectedPattern.wireframe}
          </pre>
        </div>

        {/* Use Cases */}
        <div className="mb-6">
          <h4 className="font-semibold text-[var(--db-text)] mb-3">사용 위치</h4>
          <div className="flex gap-2 flex-wrap">
            {selectedPattern.useCases.map((useCase, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg text-xs bg-[var(--db-brand)]/20 text-[var(--db-brand)]"
              >
                {useCase}
              </span>
            ))}
          </div>
        </div>

        {/* Implementation */}
        <div className="p-4 rounded-lg bg-[var(--db-bg)] border border-[var(--db-border)]">
          <h4 className="font-semibold text-[var(--db-text)] mb-2 flex items-center gap-2">
            <Code className="w-4 h-4" />
            구현
          </h4>
          <code className="text-sm text-[#7aa2ff]">{selectedPattern.implementation}</code>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Profiling Tab
// ============================================================================

function ProfilingTab() {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="db-card p-6">
        <h3 className="text-lg font-bold text-[var(--db-text)] mb-3">
          사용자 프로파일링 시스템
        </h3>
        <p className="text-[var(--db-muted)]">
          테스트/퀴즈/투표 참여 데이터에서 사용자 특성을 <strong className="text-[var(--db-text)]">암묵적으로 추론</strong>합니다.
          이 데이터는 개인화 추천과 타겟팅 광고에 활용됩니다.
        </p>
      </div>

      {/* User Attributes */}
      <div className="db-card p-6">
        <h3 className="text-lg font-bold text-[var(--db-text)] mb-4">추론 가능한 사용자 속성</h3>
        <div className="grid grid-cols-2 gap-4">
          {USER_PROFILING_SYSTEM.userAttributes.map((attr) => (
            <div key={attr.id} className="p-4 rounded-lg bg-[var(--db-panel)] border border-[var(--db-border)]">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-[var(--db-text)]">{attr.name}</h4>
                <code className="px-2 py-0.5 rounded bg-[var(--db-bg)] text-[#7aa2ff] text-xs">{attr.id}</code>
              </div>
              <p className="text-xs text-[var(--db-muted)] mb-3">{attr.description}</p>
              <div className="flex gap-1 flex-wrap mb-2">
                {attr.possibleValues.slice(0, 4).map((val) => (
                  <span key={val} className="px-2 py-0.5 rounded text-xs bg-[var(--db-bg)] text-[var(--db-muted)]">
                    {val}
                  </span>
                ))}
              </div>
              <p className="text-xs text-[#55e6c1]">{attr.adUseCase}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ad Segments */}
      <div className="db-card p-6">
        <h3 className="text-lg font-bold text-[var(--db-text)] mb-4">광고 타겟팅 세그먼트</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--db-border)]">
                <th className="text-left py-3 px-4 font-semibold text-[var(--db-text)]">세그먼트</th>
                <th className="text-left py-3 px-4 font-semibold text-[var(--db-text)]">설명</th>
                <th className="text-left py-3 px-4 font-semibold text-[var(--db-text)]">광고주</th>
                <th className="text-left py-3 px-4 font-semibold text-[var(--db-text)]">도달 범위</th>
              </tr>
            </thead>
            <tbody>
              {USER_PROFILING_SYSTEM.adTargetSegments.map((segment) => (
                <tr key={segment.id} className="border-b border-[var(--db-border)]">
                  <td className="py-3 px-4">
                    <span className="font-medium text-[var(--db-text)]">{segment.name}</span>
                    <br />
                    <code className="text-xs text-[var(--db-muted)]">{segment.id}</code>
                  </td>
                  <td className="py-3 px-4 text-[var(--db-muted)]">{segment.description}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 flex-wrap">
                      {segment.advertisers.slice(0, 2).map((ad) => (
                        <span key={ad} className="px-2 py-0.5 rounded text-xs bg-[var(--db-panel)] text-[var(--db-text)]">
                          {ad}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-[#55e6c1]">{segment.estimatedReach}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Privacy Considerations */}
      <div className="db-card p-6 border-l-4 border-yellow-500">
        <h3 className="text-lg font-bold text-[var(--db-text)] mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          개인정보 보호 고려사항
        </h3>
        <ul className="space-y-2">
          {USER_PROFILING_SYSTEM.privacyConsiderations.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-[var(--db-muted)]">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-green-400" />
              {item}
            </li>
          ))}
        </ul>
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
      {IMPLEMENTATION_ROADMAP.map((phase) => (
        <div key={phase.phase} className="db-card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
              phase.status === 'done' ? 'bg-green-500/20 text-green-400' :
              phase.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
              phase.status === 'planned' ? 'bg-blue-500/20 text-blue-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {phase.phase}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-[var(--db-text)]">{phase.title}</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  phase.status === 'done' ? 'bg-green-500/20 text-green-400' :
                  phase.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
                  phase.status === 'planned' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {phase.status}
                </span>
              </div>
              <p className="text-sm text-[var(--db-muted)]">{phase.description}</p>
            </div>
          </div>

          {/* Tasks */}
          <div className="mb-4">
            <h4 className="font-semibold text-[var(--db-text)] mb-3">작업 목록</h4>
            <ul className="space-y-2">
              {phase.tasks.map((task, idx) => (
                <li key={idx} className="flex items-start gap-3 p-2 rounded-lg bg-[var(--db-panel)]">
                  {task.status === 'done' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  ) : task.status === 'in-progress' ? (
                    <Clock className="w-5 h-5 text-yellow-400 shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-[var(--db-muted)] shrink-0" />
                  )}
                  <div>
                    <p className="text-sm text-[var(--db-text)]">{task.name}</p>
                    {task.details && (
                      <p className="text-xs text-[var(--db-muted)] mt-1">{task.details}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Deliverables */}
          <div>
            <h4 className="font-semibold text-[var(--db-text)] mb-2">산출물</h4>
            <div className="flex gap-2 flex-wrap">
              {phase.deliverables.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs bg-[var(--db-bg)] text-[var(--db-muted)] flex items-center gap-1"
                >
                  <FileCode className="w-3 h-3" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Issues Tab
// ============================================================================

function IssuesTab() {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="db-card p-4 border-l-4 border-red-500">
          <p className="text-2xl font-bold text-red-400">
            {EXISTING_CODE_ISSUES.filter(i => i.severity === 'high').length}
          </p>
          <p className="text-sm text-[var(--db-muted)]">High 이슈</p>
        </div>
        <div className="db-card p-4 border-l-4 border-yellow-500">
          <p className="text-2xl font-bold text-yellow-400">
            {EXISTING_CODE_ISSUES.filter(i => i.severity === 'medium').length}
          </p>
          <p className="text-sm text-[var(--db-muted)]">Medium 이슈</p>
        </div>
        <div className="db-card p-4 border-l-4 border-blue-500">
          <p className="text-2xl font-bold text-blue-400">
            {EXISTING_CODE_ISSUES.filter(i => i.severity === 'low').length}
          </p>
          <p className="text-sm text-[var(--db-muted)]">Low 이슈</p>
        </div>
      </div>

      {/* Issue Cards */}
      {EXISTING_CODE_ISSUES.map((issue, idx) => (
        <div
          key={idx}
          className={`db-card p-6 border-l-4 ${
            issue.severity === 'high' ? 'border-red-500' :
            issue.severity === 'medium' ? 'border-yellow-500' :
            'border-blue-500'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${
                  issue.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                  issue.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {issue.severity}
                </span>
                <span className="text-xs text-[var(--db-muted)]">Phase {issue.phase}에서 해결</span>
              </div>
              <h3 className="text-lg font-bold text-[var(--db-text)]">{issue.title}</h3>
              <p className="text-sm text-[var(--db-muted)]">{issue.description}</p>
            </div>
          </div>

          {/* Locations */}
          {issue.locations.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-[var(--db-text)] mb-2 text-sm">영향 받는 파일</h4>
              <div className="space-y-1">
                {issue.locations.map((loc, locIdx) => (
                  <div key={locIdx} className="flex items-center gap-3 text-xs p-2 rounded bg-[var(--db-panel)]">
                    <code className="text-[#7aa2ff]">{loc.file}:{loc.lines}</code>
                    <span className="text-[var(--db-muted)]">- {loc.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Problem & Solution */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-red-500/10">
              <h4 className="font-semibold text-red-400 mb-1 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                문제
              </h4>
              <p className="text-xs text-[var(--db-muted)]">{issue.problem}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10">
              <h4 className="font-semibold text-green-400 mb-1 text-sm flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                해결 방향
              </h4>
              <p className="text-xs text-[var(--db-muted)]">{issue.solution}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}