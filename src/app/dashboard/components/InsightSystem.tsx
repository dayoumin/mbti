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
  Eye,
  RefreshCw,
} from 'lucide-react';
import InsightCards, { InsightProgress } from '@/components/InsightCards';
import {
  INSIGHT_CONCEPT,
  INSIGHT_STAGES,
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
  getUnlockConditionText,
} from '../data/insight-system';
import {
  PERSONALITY_TAGS,
  DECISION_TAGS,
  RELATIONSHIP_TAGS,
  INTEREST_TAGS,
  LIFESTYLE_TAGS,
  VALID_INSIGHT_TAGS,
} from '@/data/insight/insight-tags';
import { TEST_TAG_MAPPINGS } from '@/data/insight/test-tag-mappings';

// ============================================================================
// Types
// ============================================================================

type TabKey = 'overview' | 'preview' | 'stages' | 'tags' | 'mappings' | 'service' | 'rules' | 'roadmap' | 'pricing' | 'matching' | 'metrics';

// ============================================================================
// Main Component
// ============================================================================

export default function InsightSystem() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: '개요', icon: <Brain className="w-4 h-4" /> },
    { key: 'preview', label: '라이브 프리뷰', icon: <Eye className="w-4 h-4" /> },
    { key: 'stages', label: '7단계 해금', icon: <Layers className="w-4 h-4" /> },
    { key: 'tags', label: '태그 SSOT', icon: <Tag className="w-4 h-4" /> },
    { key: 'mappings', label: '테스트 매핑', icon: <Zap className="w-4 h-4" /> },
    { key: 'service', label: '서비스 구현', icon: <CheckCircle2 className="w-4 h-4" /> },
    { key: 'rules', label: '룰 엔진', icon: <Sparkles className="w-4 h-4" /> },
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
      {activeTab === 'preview' && <PreviewTab />}
      {activeTab === 'stages' && <StagesTab />}
      {activeTab === 'tags' && <TagsTab />}
      {activeTab === 'mappings' && <MappingsTab />}
      {activeTab === 'service' && <ServiceTab />}
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

      {/* Simple Explanation - 한눈에 이해하기 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            한눈에 이해하기
          </h3>
        </div>
        <div className="p-5 space-y-6">
          {/* 비유 설명 */}
          <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
            <h4 className="font-semibold text-[var(--db-text)] mb-3">넷플릭스 추천처럼 생각하면 됩니다</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">📺</span>
                </div>
                <div>
                  <p className="text-sm text-[var(--db-text)] font-medium">넷플릭스</p>
                  <p className="text-sm text-[var(--db-muted)]">여러 영화 시청 → &quot;당신은 로맨스 좋아하네요&quot;</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--db-brand)]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🎯</span>
                </div>
                <div>
                  <p className="text-sm text-[var(--db-brand)] font-medium">우리 앱</p>
                  <p className="text-sm text-[var(--db-muted)]">여러 테스트 완료 → &quot;당신은 감성적인 성향이네요&quot;</p>
                </div>
              </div>
            </div>
          </div>

          {/* 실제 흐름 예시 */}
          <div className="p-4 bg-[var(--db-bg)] rounded-xl">
            <h4 className="font-semibold text-[var(--db-text)] mb-4">실제 작동 예시</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">1</span>
                <span className="text-[var(--db-muted)]">와인 테스트 →</span>
                <span className="px-2 py-0.5 bg-pink-500/20 text-pink-400 rounded text-xs">&quot;감성파&quot;</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">2</span>
                <span className="text-[var(--db-muted)]">커피 테스트 →</span>
                <span className="px-2 py-0.5 bg-pink-500/20 text-pink-400 rounded text-xs">&quot;분위기파&quot;</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">3</span>
                <span className="text-[var(--db-muted)]">연애 테스트 →</span>
                <span className="px-2 py-0.5 bg-pink-500/20 text-pink-400 rounded text-xs">&quot;로맨티스트&quot;</span>
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--db-border)]">
                <div className="flex items-center gap-3">
                  <ChevronRight className="w-5 h-5 text-[var(--db-brand)]" />
                  <span className="text-[var(--db-brand)] font-medium">시스템이 분석</span>
                </div>
                <div className="mt-2 ml-8 p-3 bg-[var(--db-brand)]/10 rounded-lg">
                  <p className="text-[var(--db-text)]">
                    💡 <strong>인사이트</strong>: &quot;당신은 &apos;감성/분위기&apos; 성향이 강해요!&quot;
                  </p>
                  <p className="text-sm text-[var(--db-muted)] mt-1">3개 테스트 모두에서 감성 관련 결과가 나왔어요</p>
                </div>
              </div>
            </div>
          </div>

          {/* 기술 난이도 */}
          <div className="p-4 bg-[var(--db-bg)] rounded-xl">
            <h4 className="font-semibold text-[var(--db-text)] mb-4">구현 난이도 (생각보다 쉬움!)</h4>
            <div className="space-y-3">
              {[
                { step: '결과 저장', desc: '테스트 결과를 DB에 저장', difficulty: 1, status: '이미 있음' },
                { step: '태그 매핑', desc: '각 결과에 "감성", "논리" 같은 태그 부여', difficulty: 2, status: '보통' },
                { step: '패턴 분석', desc: '사용자의 태그들을 모아서 패턴 찾기', difficulty: 2, status: '보통' },
                { step: '인사이트 생성', desc: '"당신은 OO형" 문장 생성', difficulty: 1, status: '쉬움' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-[var(--db-panel)] text-[var(--db-muted)] flex items-center justify-center text-xs">{i + 1}</span>
                    <div>
                      <span className="text-[var(--db-text)] text-sm font-medium">{item.step}</span>
                      <span className="text-[var(--db-muted)] text-xs ml-2">{item.desc}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map((star) => (
                        <span key={star} className={`text-xs ${star <= item.difficulty ? 'text-amber-400' : 'text-[var(--db-border)]'}`}>★</span>
                      ))}
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      item.status === '이미 있음' ? 'bg-green-500/20 text-green-400' :
                      item.status === '쉬움' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-500/10 rounded-lg">
              <p className="text-sm text-green-400">
                💡 핵심: 결과에 태그 붙이고, 태그 세면 끝!
              </p>
              <code className="block mt-2 p-2 bg-[var(--db-panel)] rounded text-xs text-[var(--db-muted)] font-mono overflow-x-auto">
                {`const userTags = getUserResults().map(r => r.tags).flat();
const topTag = getMostFrequent(userTags);
const insight = \`당신은 \${topTag} 성향이 강해요!\`;`}
              </code>
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="해금 단계" value="7단계" icon={<Layers className="w-5 h-5" />} />
        <StatCard label="인사이트 태그" value={`${VALID_INSIGHT_TAGS.size}개`} icon={<Tag className="w-5 h-5" />} />
        <StatCard label="테스트 매핑" value={`${Object.keys(TEST_TAG_MAPPINGS).length}개`} icon={<Zap className="w-5 h-5" />} />
        <StatCard label="인사이트 룰" value={`${RULE_PLAN.total}개`} icon={<Sparkles className="w-5 h-5" />} />
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
// Preview Tab - 라이브 프리뷰
// ============================================================================

function PreviewTab() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="db-card">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--db-text)]">라이브 프리뷰</h3>
                <p className="text-sm text-[var(--db-muted)]">현재 localStorage 데이터 기반 실시간 미리보기</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--db-brand)] text-[#081023] rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <RefreshCw className="w-4 h-4" />
              새로고침
            </button>
          </div>
          <div className="p-3 bg-[var(--db-bg)] rounded-lg">
            <p className="text-sm text-[var(--db-muted)]">
              💡 테스트/퀴즈/투표를 완료하면 자동으로 인사이트 데이터가 축적됩니다.
              새로고침 버튼을 눌러 최신 상태를 확인하세요.
            </p>
          </div>
        </div>
      </div>

      {/* 2열 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 좌측: 인사이트 카드 */}
        <div className="db-card">
          <div className="db-card-header px-5 py-4">
            <h3 className="text-lg font-semibold text-[var(--db-text)] flex items-center gap-2">
              <Brain className="w-5 h-5" />
              인사이트 카드
            </h3>
          </div>
          <div className="p-5">
            <div key={refreshKey} className="[&_button]:!bg-[var(--db-bg)] [&_button]:!border-[var(--db-border)] [&_.font-bold]:!text-[var(--db-text)] [&_.text-gray-900]:!text-[var(--db-text)] [&_.text-gray-600]:!text-[var(--db-muted)] [&_.text-gray-400]:!text-[var(--db-muted)] [&_.text-gray-500]:!text-[var(--db-muted)]">
              <InsightCards maxStages={4} />
            </div>
          </div>
        </div>

        {/* 우측: 진행률 위젯 */}
        <div className="space-y-6">
          <div className="db-card">
            <div className="db-card-header px-5 py-4">
              <h3 className="text-lg font-semibold text-[var(--db-text)] flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                진행률 위젯
              </h3>
            </div>
            <div className="p-5">
              <div key={refreshKey}>
                <InsightProgress />
              </div>
            </div>
          </div>

          {/* 컴팩트 뷰 */}
          <div className="db-card">
            <div className="db-card-header px-5 py-4">
              <h3 className="text-lg font-semibold text-[var(--db-text)] flex items-center gap-2">
                <Layers className="w-5 h-5" />
                컴팩트 뷰
              </h3>
            </div>
            <div className="p-5">
              <div key={refreshKey} className="[&_button]:!bg-[var(--db-bg)] [&_button]:!border-[var(--db-border)] [&_.text-purple-700]:!text-[var(--db-brand)] [&_.text-gray-400]:!text-[var(--db-muted)]">
                <InsightCards compact maxStages={4} />
              </div>
            </div>
          </div>

          {/* 사용법 */}
          <div className="db-card">
            <div className="db-card-header px-5 py-4">
              <h3 className="text-lg font-semibold text-[var(--db-text)]">사용법</h3>
            </div>
            <div className="p-5 space-y-3">
              <div className="p-3 bg-[var(--db-bg)] rounded-lg">
                <code className="text-sm text-[var(--db-brand)] font-mono">
                  {`import InsightCards from '@/components/InsightCards';`}
                </code>
              </div>
              <div className="p-3 bg-[var(--db-bg)] rounded-lg">
                <code className="text-sm text-[var(--db-brand)] font-mono">
                  {`<InsightCards maxStages={4} />`}
                </code>
              </div>
              <div className="p-3 bg-[var(--db-bg)] rounded-lg">
                <code className="text-sm text-[var(--db-brand)] font-mono">
                  {`<InsightCards compact />`}
                </code>
              </div>
              <div className="p-3 bg-[var(--db-bg)] rounded-lg">
                <code className="text-sm text-[var(--db-brand)] font-mono">
                  {`<InsightProgress />`}
                </code>
              </div>
            </div>
          </div>
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
            <p className="text-sm text-[var(--db-muted)]">{getUnlockConditionText(stage.unlockCondition)}</p>
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
    { name: '성격 태그 (Personality)', tags: PERSONALITY_TAGS, color: 'purple', description: 'Big Five 기반', emoji: '🧠' },
    { name: '판단 태그 (Decision)', tags: DECISION_TAGS, color: 'blue', description: '의사결정 스타일', emoji: '⚖️' },
    { name: '관계 태그 (Relationship)', tags: RELATIONSHIP_TAGS, color: 'pink', description: 'TKI 갈등 모델', emoji: '💬' },
    { name: '관심사 태그 (Interest)', tags: INTEREST_TAGS, color: 'green', description: '카테고리 자동 추출', emoji: '🗺️' },
    { name: '라이프스타일 태그 (Lifestyle)', tags: LIFESTYLE_TAGS, color: 'amber', description: '생활 방식', emoji: '🏠' },
  ];

  return (
    <div className="space-y-6">
      {/* SSOT 설명 */}
      <div className="db-card">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--db-brand)]/20 flex items-center justify-center">
              <Tag className="w-5 h-5 text-[var(--db-brand)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--db-text)]">단일 소스 원칙 (SSOT)</h3>
              <p className="text-sm text-[var(--db-muted)]">모든 인사이트 태그는 insight-tags.ts에서 정의</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-[var(--db-bg)] rounded-lg text-center">
              <div className="text-2xl font-bold text-[var(--db-brand)]">{VALID_INSIGHT_TAGS.size}</div>
              <div className="text-xs text-[var(--db-muted)]">전체 태그</div>
            </div>
            <div className="p-3 bg-[var(--db-bg)] rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-400">{PERSONALITY_TAGS.length}</div>
              <div className="text-xs text-[var(--db-muted)]">성격 태그</div>
            </div>
            <div className="p-3 bg-[var(--db-bg)] rounded-lg text-center">
              <div className="text-2xl font-bold text-green-400">{INTEREST_TAGS.length}</div>
              <div className="text-xs text-[var(--db-muted)]">관심사 태그</div>
            </div>
            <div className="p-3 bg-[var(--db-bg)] rounded-lg text-center">
              <div className="text-2xl font-bold text-pink-400">{RELATIONSHIP_TAGS.length}</div>
              <div className="text-xs text-[var(--db-muted)]">관계 태그</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-green-500/10 rounded-lg">
            <p className="text-sm text-green-400">
              <code className="bg-[var(--db-panel)] px-1.5 py-0.5 rounded text-xs">src/data/insight/insight-tags.ts</code>
              {' '}에서 타입 안전하게 관리
            </p>
          </div>
        </div>
      </div>

      {/* Tag Groups */}
      {tagGroups.map((group) => (
        <div key={group.name} className="db-card">
          <div className="db-card-header px-5 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--db-text)] flex items-center gap-2">
                <span>{group.emoji}</span>
                {group.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--db-muted)]">{group.description}</span>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  group.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                  group.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                  group.color === 'pink' ? 'bg-pink-500/20 text-pink-400' :
                  group.color === 'green' ? 'bg-green-500/20 text-green-400' :
                  'bg-amber-500/20 text-amber-400'
                }`}>{group.tags.length}개</span>
              </div>
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
                    group.color === 'pink' ? 'bg-pink-500/20 text-pink-400' :
                    group.color === 'green' ? 'bg-green-500/20 text-green-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Psychology Evidence */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)] flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            심리학적 근거
          </h3>
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
// Mappings Tab - 테스트별 태그 매핑 현황
// ============================================================================

function MappingsTab() {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const mappings = Object.entries(TEST_TAG_MAPPINGS);

  return (
    <div className="space-y-6">
      {/* 개요 */}
      <div className="db-card">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--db-text)]">테스트 → 태그 매핑</h3>
              <p className="text-sm text-[var(--db-muted)]">각 테스트의 차원 점수를 인사이트 태그로 변환</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-[var(--db-bg)] rounded-lg text-center">
              <div className="text-2xl font-bold text-[var(--db-brand)]">{mappings.length}</div>
              <div className="text-xs text-[var(--db-muted)]">테스트 매핑</div>
            </div>
            <div className="p-3 bg-[var(--db-bg)] rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-400">
                {mappings.filter(([, m]) => m.category === 'personality').length}
              </div>
              <div className="text-xs text-[var(--db-muted)]">성격 테스트</div>
            </div>
            <div className="p-3 bg-[var(--db-bg)] rounded-lg text-center">
              <div className="text-2xl font-bold text-green-400">
                {mappings.filter(([, m]) => m.category === 'pet').length}
              </div>
              <div className="text-xs text-[var(--db-muted)]">반려동물</div>
            </div>
            <div className="p-3 bg-[var(--db-bg)] rounded-lg text-center">
              <div className="text-2xl font-bold text-pink-400">
                {mappings.filter(([, m]) => m.countsAsRelationship).length}
              </div>
              <div className="text-xs text-[var(--db-muted)]">관계 테스트</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-purple-500/10 rounded-lg">
            <p className="text-sm text-purple-400">
              <code className="bg-[var(--db-panel)] px-1.5 py-0.5 rounded text-xs">src/data/insight/test-tag-mappings.ts</code>
              {' '}에서 관리
            </p>
          </div>
        </div>
      </div>

      {/* 테스트 목록 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {mappings.map(([testId, mapping]) => (
          <button
            key={testId}
            onClick={() => setSelectedTest(selectedTest === testId ? null : testId)}
            className={`db-card p-4 text-left transition-all ${
              selectedTest === testId ? 'ring-2 ring-[var(--db-brand)]' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`px-2 py-0.5 rounded text-xs ${
                mapping.category === 'personality' ? 'bg-purple-500/20 text-purple-400' :
                mapping.category === 'pet' ? 'bg-green-500/20 text-green-400' :
                mapping.category === 'relationship' ? 'bg-pink-500/20 text-pink-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {mapping.category}
              </span>
              {mapping.countsAsRelationship && (
                <span className="text-pink-400 text-xs">💕</span>
              )}
            </div>
            <h4 className="font-semibold text-[var(--db-text)]">{testId}</h4>
            <p className="text-xs text-[var(--db-muted)] mt-1">
              {Object.keys(mapping.dimensions).length}개 차원
            </p>
          </button>
        ))}
      </div>

      {/* 선택된 테스트 상세 */}
      {selectedTest && TEST_TAG_MAPPINGS[selectedTest] && (
        <div className="db-card">
          <div className="db-card-header px-5 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--db-text)]">
                {selectedTest} 테스트 매핑
              </h3>
              <span className={`px-2 py-0.5 rounded text-xs ${
                TEST_TAG_MAPPINGS[selectedTest].countsAsRelationship
                  ? 'bg-pink-500/20 text-pink-400'
                  : 'bg-[var(--db-panel)] text-[var(--db-muted)]'
              }`}>
                {TEST_TAG_MAPPINGS[selectedTest].countsAsRelationship ? '관계 활동 O' : '관계 활동 X'}
              </span>
            </div>
          </div>
          <div className="p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--db-border)]">
                    <th className="text-left py-3 text-[var(--db-muted)]">차원</th>
                    <th className="text-left py-3 text-[var(--db-muted)]">HIGH (60%+) → 태그</th>
                    <th className="text-left py-3 text-[var(--db-muted)]">LOW (&lt;40%) → 태그</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(TEST_TAG_MAPPINGS[selectedTest].dimensions).map(([dim, tags]) => (
                    <tr key={dim} className="border-b border-[var(--db-border)]/50">
                      <td className="py-3 text-[var(--db-text)] font-medium">{dim}</td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {tags.high.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {tags.low.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 bg-[var(--db-bg)] rounded-lg">
              <p className="text-xs text-[var(--db-muted)]">
                💡 MEDIUM (40-60%)은 중립으로, 태그가 부여되지 않습니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Service Tab - InsightService 구현 상태
// ============================================================================

function ServiceTab() {
  const serviceFeatures = [
    { name: '이벤트 구독', status: 'done', desc: 'EventBus를 통한 test_complete, quiz_solve, poll_vote 이벤트 구독' },
    { name: '활동 통계', status: 'done', desc: 'testCount, quizCount, pollCount, totalActivities, relationshipActivities 추적' },
    { name: '태그 집계', status: 'done', desc: '유효한 인사이트 태그만 필터링하여 localStorage 저장' },
    { name: '스테이지 해금', status: 'done', desc: 'Stage 1-6 해금 조건 체크 및 자동 해금' },
    { name: 'Stage 1 인사이트', status: 'done', desc: '기본 성향 인사이트 생성 (테스트 결과 + 상위 태그)' },
    { name: '진행률 계산', status: 'done', desc: '다음 스테이지까지 진행률 및 남은 조건 표시 (음수 방지)' },
    { name: 'Stage 2 성격 조합', status: 'done', desc: '15개 성격 조합 룰 + matchStage2Rules() 구현 (stage2-rules.ts)' },
    { name: 'Stage 3 판단 스타일', status: 'done', desc: '4차원 8프로필 + generateDecisionStyleResult() 구현 (stage3-decision-style.ts)' },
    { name: 'Stage 4 관심사 지도', status: 'done', desc: '6카테고리 7프로필 + generateInterestMapResult() 구현 (stage4-interest-map.ts)' },
    { name: 'Stage 5 관계 패턴', status: 'pending', desc: '해금 로직만 완료, 인사이트 생성 함수 미구현' },
    { name: 'Stage 6 숨은 패턴', status: 'pending', desc: '해금 로직만 완료, 인사이트 생성 함수 미구현' },
    { name: 'Stage 7 AI 분석', status: 'pending', desc: 'Claude API 연동 필요 (유료)' },
  ];

  const codeExamples = [
    {
      title: '태그 추출',
      code: `// 테스트 결과에서 태그 추출
const tags = extractTagsFromTestResult(testId, dimensions, dimCounts);
// → ['extroverted', 'adventurous', 'emotional']`,
    },
    {
      title: '활동 통계 조회',
      code: `// 사용자 활동 통계
const stats = insightService.getActivityStats();
// → { testCount: 3, pollCount: 15, totalActivities: 25 }`,
    },
    {
      title: '스테이지 해금 체크',
      code: `// Stage 3 해금 여부
const isUnlocked = insightService.isStageUnlocked(3);
// → true (pollCount >= 10)`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 구현 상태 요약 */}
      <div className="db-card">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--db-text)]">InsightService 구현 상태</h3>
              <p className="text-sm text-[var(--db-muted)]">Stage 1-4 완료, Stage 5-7 대기</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-400">
                {serviceFeatures.filter(f => f.status === 'done').length}
              </div>
              <div className="text-xs text-[var(--db-muted)]">완료</div>
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {serviceFeatures.filter(f => f.status === 'partial').length}
              </div>
              <div className="text-xs text-[var(--db-muted)]">진행 중</div>
            </div>
            <div className="p-3 bg-[var(--db-bg)] rounded-lg text-center">
              <div className="text-2xl font-bold text-[var(--db-muted)]">
                {serviceFeatures.filter(f => f.status === 'pending').length}
              </div>
              <div className="text-xs text-[var(--db-muted)]">대기</div>
            </div>
          </div>
        </div>
      </div>

      {/* 기능 목록 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">기능 구현 현황</h3>
        </div>
        <div className="p-5 space-y-3">
          {serviceFeatures.map((feature, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-[var(--db-bg)] rounded-lg">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                feature.status === 'done' ? 'bg-green-500/20' :
                feature.status === 'partial' ? 'bg-yellow-500/20' :
                'bg-[var(--db-panel)]'
              }`}>
                {feature.status === 'done' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : feature.status === 'partial' ? (
                  <Zap className="w-4 h-4 text-yellow-400" />
                ) : (
                  <Lock className="w-4 h-4 text-[var(--db-muted)]" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[var(--db-text)]">{feature.name}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    feature.status === 'done' ? 'bg-green-500/20 text-green-400' :
                    feature.status === 'partial' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-[var(--db-panel)] text-[var(--db-muted)]'
                  }`}>
                    {feature.status === 'done' ? '완료' :
                     feature.status === 'partial' ? '진행 중' : '대기'}
                  </span>
                </div>
                <p className="text-sm text-[var(--db-muted)] mt-1">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 코드 예시 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">사용 예시</h3>
        </div>
        <div className="p-5 space-y-4">
          {codeExamples.map((example, i) => (
            <div key={i} className="p-4 bg-[var(--db-bg)] rounded-lg">
              <h4 className="font-medium text-[var(--db-text)] mb-2">{example.title}</h4>
              <pre className="p-3 bg-[var(--db-panel)] rounded text-xs text-[var(--db-muted)] overflow-x-auto font-mono">
                {example.code}
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* 파일 위치 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">관련 파일</h3>
        </div>
        <div className="p-5">
          <div className="space-y-2">
            {[
              { path: 'src/services/InsightService.ts', desc: '메인 서비스 클래스' },
              { path: 'src/data/insight/insight-tags.ts', desc: '태그 정의 (SSOT)' },
              { path: 'src/data/insight/test-tag-mappings.ts', desc: '테스트별 태그 매핑' },
              { path: 'src/data/insight/stage2-rules.ts', desc: 'Stage 2 성격 조합 룰 15개' },
              { path: 'src/data/insight/stage3-decision-style.ts', desc: 'Stage 3 판단 스타일 분석' },
              { path: 'src/data/insight/stage4-interest-map.ts', desc: 'Stage 4 관심사 지도' },
              { path: 'src/data/gamification/points.ts', desc: '해금 조건 상수 (INSIGHT_UNLOCK)' },
              { path: 'src/services/EventBus.ts', desc: '이벤트 발행/구독' },
            ].map((file, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-[var(--db-bg)] rounded">
                <code className="text-xs text-[var(--db-brand)]">{file.path}</code>
                <span className="text-xs text-[var(--db-muted)]">{file.desc}</span>
              </div>
            ))}
          </div>
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
