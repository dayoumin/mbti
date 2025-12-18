'use client';

import { useState } from 'react';
import {
  Brain,
  BarChart3,
  MessageCircle,
  ChevronRight,
  Star,
  Clock,
  Zap,
  Target,
  TrendingUp,
  Calendar,
  Users,
  CheckCircle2,
  Eye,
  Layers,
  Calculator,
  Lightbulb,
  Sparkles,
  ExternalLink,
  AlertCircle,
  Search,
} from 'lucide-react';
import {
  CONTENT_SYSTEM,
  ContentTypeDefinition,
  ContentType,
  CATEGORIES,
  CategoryDefinition,
  CONTENT_ROADMAP,
  CONTENT_ESTIMATES,
  calculateContentTotals,
  ContentEstimate,
  SEASONAL_CONTENT,
  SeasonalContent,
  getActiveSeasonalContent,
  getUpcomingSeasonalContent,
  TREND_SOURCES,
  TREND_CONTENT_EXAMPLES,
  TREND_OPERATION_GUIDE,
  TrendSourceInfo,
  TrendContent,
  FOLLOWUP_CATEGORIES,
  FOLLOWUP_ROADMAP,
  FOLLOWUP_STRATEGY,
  FollowUpCategory,
  FollowUpElement,
} from '../data/content-system';
import { Share2, Link, Bell, ThumbsUp } from 'lucide-react';

// ============================================================================
// Icons
// ============================================================================

const TYPE_ICONS: Record<ContentType, React.ReactNode> = {
  quiz: <Brain className="w-5 h-5" />,
  poll: <BarChart3 className="w-5 h-5" />,
  qna: <MessageCircle className="w-5 h-5" />,
};

// ============================================================================
// Main Component
// ============================================================================

export default function ContentSystem() {
  const [activeTab, setActiveTab] = useState<'overview' | 'types' | 'categories' | 'estimates' | 'roadmap' | 'seasonal' | 'followup'>('overview');
  const [selectedType, setSelectedType] = useState<ContentType>('quiz');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'overview', label: '개요', icon: <Eye className="w-4 h-4" /> },
          { key: 'types', label: '콘텐츠 타입', icon: <Layers className="w-4 h-4" /> },
          { key: 'categories', label: '카테고리', icon: <Target className="w-4 h-4" /> },
          { key: 'seasonal', label: '시즌/트렌드', icon: <Sparkles className="w-4 h-4" /> },
          { key: 'estimates', label: '수량 예측', icon: <Calculator className="w-4 h-4" /> },
          { key: 'roadmap', label: '구현 로드맵', icon: <Calendar className="w-4 h-4" /> },
          { key: 'followup', label: '후속 참여', icon: <Share2 className="w-4 h-4" /> },
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
      {activeTab === 'types' && (
        <TypesTab selectedType={selectedType} setSelectedType={setSelectedType} />
      )}
      {activeTab === 'categories' && <CategoriesTab />}
      {activeTab === 'seasonal' && <SeasonalTab />}
      {activeTab === 'estimates' && <EstimatesTab />}
      {activeTab === 'roadmap' && <RoadmapTab />}
      {activeTab === 'followup' && <FollowUpTab />}
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
          콘텐츠 시스템이란?
        </h3>
        <p className="text-[var(--db-muted)] mb-4">
          테스트만으로는 재방문 이유가 약합니다. <strong className="text-[var(--db-text)]">퀴즈, 투표, Q&A</strong>를
          통해 매일 올 이유를 만들고, 사용자 간 네트워크를 형성합니다.
        </p>

        <div className="grid grid-cols-3 gap-4 mt-6">
          {CONTENT_SYSTEM.types.map((type) => (
            <div
              key={type.id}
              className="p-4 rounded-xl"
              style={{ background: `${type.color}15` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `${type.color}30`, color: type.color }}
                >
                  {TYPE_ICONS[type.id]}
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--db-text)]">
                    {type.icon} {type.name}
                  </h4>
                  <p className="text-xs text-[var(--db-muted)]">
                    {type.subTypes.length}개 서브타입
                  </p>
                </div>
              </div>
              <p className="text-sm text-[var(--db-muted)]">{type.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Flow Diagram */}
      <div className="db-card p-6">
        <h3 className="text-lg font-bold text-[var(--db-text)] mb-4">
          사용자 여정 & 콘텐츠 역할
        </h3>
        <div className="flex items-center justify-between">
          {[
            { step: '신규 유입', content: '퀴즈 공유', color: '#7aa2ff' },
            { step: '테스트 완료', content: '결과 기반 투표', color: '#55e6c1' },
            { step: '친구 초대', content: '케미 퀴즈', color: '#ff6b9d' },
            { step: '매일 방문', content: '오늘의 퀴즈/투표', color: '#ffd166' },
            { step: '커뮤니티', content: 'Q&A 참여', color: '#a29bfe' },
          ].map((item, idx, arr) => (
            <div key={item.step} className="flex items-center">
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-2 mx-auto"
                  style={{ background: `${item.color}20` }}
                >
                  <span className="text-2xl font-bold" style={{ color: item.color }}>
                    {idx + 1}
                  </span>
                </div>
                <p className="text-sm font-medium text-[var(--db-text)]">{item.step}</p>
                <p className="text-xs text-[var(--db-muted)]">{item.content}</p>
              </div>
              {idx < arr.length - 1 && (
                <ChevronRight className="w-6 h-6 text-[var(--db-muted)] mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="콘텐츠 타입"
          value={CONTENT_SYSTEM.types.length}
          icon={<Layers className="w-5 h-5" />}
          color="#7aa2ff"
        />
        <StatCard
          label="서브타입 합계"
          value={CONTENT_SYSTEM.types.reduce((sum, t) => sum + t.subTypes.length, 0)}
          icon={<Zap className="w-5 h-5" />}
          color="#55e6c1"
        />
        <StatCard
          label="카테고리"
          value={CATEGORIES.length}
          icon={<Target className="w-5 h-5" />}
          color="#ffd166"
        />
        <StatCard
          label="예시 콘텐츠"
          value={CONTENT_SYSTEM.types.reduce((sum, t) => sum + t.examples.length, 0)}
          icon={<Star className="w-5 h-5" />}
          color="#ff6b6b"
        />
      </div>
    </div>
  );
}

function StatCard({
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
// Types Tab
// ============================================================================

function TypesTab({
  selectedType,
  setSelectedType,
}: {
  selectedType: ContentType;
  setSelectedType: (type: ContentType) => void;
}) {
  const typeData = CONTENT_SYSTEM.types.find((t) => t.id === selectedType);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Type Selector */}
      <div className="col-span-3 space-y-2">
        {CONTENT_SYSTEM.types.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`w-full text-left p-4 rounded-xl transition-all ${
              selectedType === type.id
                ? 'bg-[var(--db-brand)]/20 border border-[var(--db-brand)]/50'
                : 'bg-[var(--db-panel)] hover:bg-[var(--db-panel)]/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `${type.color}22`, color: type.color }}
              >
                {TYPE_ICONS[type.id]}
              </div>
              <div>
                <h4 className="font-semibold text-[var(--db-text)] text-sm">
                  {type.icon} {type.name}
                </h4>
                <p className="text-xs text-[var(--db-muted)]">
                  {type.subTypes.length}개 서브타입
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Type Detail */}
      <div className="col-span-9 space-y-4">
        {typeData && (
          <>
            {/* Header */}
            <div
              className="p-5 rounded-xl"
              style={{ background: `${typeData.color}15` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{typeData.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-[var(--db-text)]">
                    {typeData.name}
                  </h3>
                  <p className="text-sm text-[var(--db-muted)]">
                    {typeData.description}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="mt-4 p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <h4 className="text-sm font-semibold text-[var(--db-text)] mb-2">
                  주요 기능
                </h4>
                <ul className="grid grid-cols-2 gap-2">
                  {typeData.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-[var(--db-muted)]"
                    >
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-[var(--db-brand)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* SubTypes */}
            <div className="db-card">
              <div className="db-card-header px-5 py-4">
                <h3 className="text-lg font-semibold text-[var(--db-text)]">
                  서브타입
                </h3>
              </div>
              <div className="p-5 grid grid-cols-2 gap-4">
                {typeData.subTypes.map((subType) => (
                  <SubTypeCard key={subType.id} subType={subType} color={typeData.color} />
                ))}
              </div>
            </div>

            {/* Examples */}
            <div className="db-card">
              <div className="db-card-header px-5 py-4">
                <h3 className="text-lg font-semibold text-[var(--db-text)]">
                  예시 콘텐츠
                </h3>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 gap-3">
                  {typeData.examples.map((example, idx) => {
                    const category = CATEGORIES.find((c) => c.id === example.category);
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-lg flex items-start gap-3"
                        style={{ background: 'rgba(0,0,0,0.3)' }}
                      >
                        <span className="text-xl">{category?.icon || '💬'}</span>
                        <div>
                          <h4 className="font-medium text-[var(--db-text)] text-sm">
                            {example.title}
                          </h4>
                          <p className="text-xs text-[var(--db-muted)]">
                            {example.description}
                          </p>
                          {example.type && (
                            <span
                              className="inline-block mt-1 px-2 py-0.5 rounded text-xs"
                              style={{ background: `${typeData.color}22`, color: typeData.color }}
                            >
                              {example.type}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Retention Strategy */}
            <div className="db-card">
              <div className="db-card-header px-5 py-4">
                <h3 className="text-lg font-semibold text-[var(--db-text)]">
                  재방문 전략
                </h3>
              </div>
              <div className="p-5 grid grid-cols-3 gap-4">
                <RetentionCard
                  title="일일"
                  items={typeData.retention.daily}
                  icon={<Clock className="w-4 h-4" />}
                  color="#7aa2ff"
                />
                <RetentionCard
                  title="주간"
                  items={typeData.retention.weekly}
                  icon={<Calendar className="w-4 h-4" />}
                  color="#55e6c1"
                />
                <RetentionCard
                  title="소셜"
                  items={typeData.retention.social}
                  icon={<Users className="w-4 h-4" />}
                  color="#ff6b9d"
                />
              </div>
            </div>

            {/* Data Structure */}
            <div className="db-card">
              <div className="db-card-header px-5 py-4">
                <h3 className="text-lg font-semibold text-[var(--db-text)]">
                  데이터 구조
                </h3>
              </div>
              <div className="p-5">
                <pre className="text-xs text-[var(--db-muted)] bg-black/30 p-4 rounded-lg overflow-x-auto">
                  {typeData.dataStructure}
                </pre>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SubTypeCard({ subType, color }: { subType: ContentTypeDefinition['subTypes'][0]; color: string }) {
  const frequencyLabels = {
    once: '1회',
    daily: '매일',
    weekly: '주간',
    seasonal: '시즌',
    event: '이벤트',
  };

  return (
    <div className="p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-[var(--db-text)]">{subType.name}</h4>
        <span
          className="px-2 py-0.5 rounded text-xs"
          style={{ background: `${color}22`, color }}
        >
          {frequencyLabels[subType.frequency]}
        </span>
      </div>
      <p className="text-sm text-[var(--db-muted)] mb-3">{subType.description}</p>
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--db-muted)]">난이도</span>
          <div className="flex gap-0.5">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="w-2 h-2 rounded-full"
                style={{
                  background: n <= subType.difficulty ? '#ff6b6b' : 'rgba(255,255,255,0.1)',
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
                  color: n <= subType.impact ? '#ffd166' : 'rgba(255,255,255,0.1)',
                  fill: n <= subType.impact ? '#ffd166' : 'transparent',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RetentionCard({
  title,
  items,
  icon,
  color,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="p-4 rounded-lg" style={{ background: `${color}10` }}>
      <div className="flex items-center gap-2 mb-3">
        <span style={{ color }}>{icon}</span>
        <h4 className="font-semibold text-[var(--db-text)]">{title}</h4>
      </div>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-[var(--db-muted)]">
            <ChevronRight className="w-3 h-3 mt-1" style={{ color }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// Categories Tab
// ============================================================================

function CategoriesTab() {
  return (
    <div className="space-y-6">
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            콘텐츠 카테고리
          </h3>
          <p className="text-sm text-[var(--db-muted)]">
            각 카테고리별 퀴즈/투표 주제와 관련 테스트
          </p>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-3 gap-4">
            {CATEGORIES.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ category }: { category: CategoryDefinition }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="db-card overflow-hidden">
      <div
        className="p-4"
        style={{ borderTop: `3px solid ${category.color}` }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{category.icon}</span>
          <div>
            <h4 className="font-semibold text-[var(--db-text)]">{category.name}</h4>
            <p className="text-xs text-[var(--db-muted)]">
              테스트: {category.relatedTests.join(', ') || '없음'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-[var(--db-brand)] hover:underline flex items-center gap-1"
        >
          {expanded ? '접기' : '주제 보기'}
          <ChevronRight
            className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`}
          />
        </button>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
            <div>
              <h5 className="text-xs font-semibold text-[var(--db-muted)] mb-2">
                투표 주제
              </h5>
              <div className="flex flex-wrap gap-1">
                {category.pollTopics.map((topic, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-xs bg-[var(--db-panel)] text-[var(--db-text)]"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-xs font-semibold text-[var(--db-muted)] mb-2">
                퀴즈 주제
              </h5>
              <div className="flex flex-wrap gap-1">
                {category.quizTopics.map((topic, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-xs"
                    style={{ background: `${category.color}22`, color: category.color }}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Estimates Tab
// ============================================================================

function EstimatesTab() {
  const totals = calculateContentTotals();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-4">
        <TotalCard
          label="시나리오 퀴즈"
          range={totals.scenarioQuiz}
          color="#ff6b9d"
          icon="🎮"
        />
        <TotalCard
          label="지식 퀴즈"
          range={totals.knowledgeQuiz}
          color="#7aa2ff"
          icon="🧠"
        />
        <TotalCard
          label="VS 투표"
          range={totals.vsPolls}
          color="#55e6c1"
          icon="⚔️"
        />
        <TotalCard
          label="선택 투표"
          range={totals.choicePolls}
          color="#ffd166"
          icon="📊"
        />
        <TotalCard
          label="총 콘텐츠"
          range={totals.totalContent}
          color="#a29bfe"
          icon="📦"
          highlight
        />
      </div>

      {/* Category Table */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            카테고리별 수량 예측
          </h3>
          <p className="text-sm text-[var(--db-muted)]">
            각 카테고리를 클릭하면 아이디어를 볼 수 있습니다
          </p>
        </div>
        <div className="p-5">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-black/20 rounded-t-lg text-sm font-semibold text-[var(--db-muted)]">
            <div>카테고리</div>
            <div className="text-center">시나리오 퀴즈</div>
            <div className="text-center">지식 퀴즈</div>
            <div className="text-center">VS 투표</div>
            <div className="text-center">선택 투표</div>
            <div className="text-center">소계</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/5">
            {CONTENT_ESTIMATES.map((cat) => {
              const subtotal = {
                min: cat.scenarioQuiz.min + cat.knowledgeQuiz.min + cat.vsPolls.min + cat.choicePolls.min,
                max: cat.scenarioQuiz.max + cat.knowledgeQuiz.max + cat.vsPolls.max + cat.choicePolls.max,
              };
              const isExpanded = expandedCategory === cat.category;

              return (
                <div key={cat.category}>
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : cat.category)}
                    className="w-full grid grid-cols-6 gap-4 px-4 py-3 hover:bg-white/5 transition-colors text-sm"
                  >
                    <div className="flex items-center gap-2 text-left">
                      <span className="text-xl">{cat.icon}</span>
                      <span className="font-medium text-[var(--db-text)]">{cat.name}</span>
                      <ChevronRight
                        className={`w-4 h-4 text-[var(--db-muted)] transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </div>
                    <RangeCell range={cat.scenarioQuiz} color="#ff6b9d" />
                    <RangeCell range={cat.knowledgeQuiz} color="#7aa2ff" />
                    <RangeCell range={cat.vsPolls} color="#55e6c1" />
                    <RangeCell range={cat.choicePolls} color="#ffd166" />
                    <RangeCell range={subtotal} color="#a29bfe" highlight />
                  </button>

                  {/* Expanded Ideas */}
                  {isExpanded && (
                    <div className="px-4 pb-4 grid grid-cols-2 gap-4">
                      <IdeaList
                        title="시나리오 퀴즈 아이디어"
                        ideas={cat.ideas.scenarioQuiz}
                        color="#ff6b9d"
                        icon="🎮"
                      />
                      <IdeaList
                        title="VS 투표 아이디어"
                        ideas={cat.ideas.vsPolls}
                        color="#55e6c1"
                        icon="⚔️"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Table Footer */}
          <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-[var(--db-brand)]/10 rounded-b-lg text-sm font-bold">
            <div className="text-[var(--db-brand)]">합계</div>
            <RangeCell range={totals.scenarioQuiz} color="#ff6b9d" />
            <RangeCell range={totals.knowledgeQuiz} color="#7aa2ff" />
            <RangeCell range={totals.vsPolls} color="#55e6c1" />
            <RangeCell range={totals.choicePolls} color="#ffd166" />
            <RangeCell range={totals.totalContent} color="#a29bfe" highlight />
          </div>
        </div>
      </div>

      {/* Implementation Priority */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            구현 우선순위 제안
          </h3>
        </div>
        <div className="p-5 grid grid-cols-3 gap-4">
          <PriorityCard
            phase="Phase 1"
            title="바로 가능"
            items={[
              'VS 투표 10~15개 (데이터만 작성)',
              '지식 퀴즈 20개 (4지선다)',
            ]}
            color="#55e6c1"
          />
          <PriorityCard
            phase="Phase 2"
            title="1~2주"
            items={[
              '시나리오 퀴즈 3~5개',
              '선택 투표 10개',
            ]}
            color="#ffd166"
          />
          <PriorityCard
            phase="Phase 3"
            title="지속"
            items={[
              '오늘의 퀴즈 시스템',
              '결과 통계/트렌드 리포트',
              '케미 퀴즈 (친구 초대)',
            ]}
            color="#a29bfe"
          />
        </div>
      </div>
    </div>
  );
}

function TotalCard({
  label,
  range,
  color,
  icon,
  highlight,
}: {
  label: string;
  range: { min: number; max: number };
  color: string;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-xl ${highlight ? 'ring-2 ring-[var(--db-brand)]/50' : ''}`}
      style={{ background: `${color}15` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-sm text-[var(--db-muted)]">{label}</span>
      </div>
      <p className="text-2xl font-bold" style={{ color }}>
        {range.min}~{range.max}
      </p>
    </div>
  );
}

function RangeCell({
  range,
  color,
  highlight,
}: {
  range: { min: number; max: number };
  color: string;
  highlight?: boolean;
}) {
  return (
    <div className={`text-center ${highlight ? 'font-bold' : ''}`}>
      <span style={{ color }}>
        {range.min}~{range.max}
      </span>
    </div>
  );
}

function IdeaList({
  title,
  ideas,
  color,
  icon,
}: {
  title: string;
  ideas: string[];
  color: string;
  icon: string;
}) {
  return (
    <div className="p-4 rounded-lg" style={{ background: `${color}10` }}>
      <div className="flex items-center gap-2 mb-3">
        <span>{icon}</span>
        <h4 className="font-semibold text-[var(--db-text)] text-sm">{title}</h4>
      </div>
      <ul className="space-y-1">
        {ideas.map((idea, idx) => (
          <li key={idx} className="flex items-center gap-2 text-sm text-[var(--db-muted)]">
            <Lightbulb className="w-3 h-3" style={{ color }} />
            {idea}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PriorityCard({
  phase,
  title,
  items,
  color,
}: {
  phase: string;
  title: string;
  items: string[];
  color: string;
}) {
  return (
    <div className="p-4 rounded-xl" style={{ background: `${color}15` }}>
      <div className="flex items-center gap-2 mb-3">
        <span
          className="px-2 py-0.5 rounded text-xs font-bold"
          style={{ background: color, color: '#081023' }}
        >
          {phase}
        </span>
        <span className="text-sm font-medium text-[var(--db-text)]">{title}</span>
      </div>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-[var(--db-muted)]">
            <CheckCircle2 className="w-4 h-4 mt-0.5" style={{ color }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// Roadmap Tab
// ============================================================================

function RoadmapTab() {
  return (
    <div className="space-y-6">
      {/* Timeline */}
      <div className="db-card p-6">
        <h3 className="text-lg font-bold text-[var(--db-text)] mb-4">
          구현 타임라인
        </h3>
        <div className="flex items-start gap-4">
          {CONTENT_ROADMAP.map((phase, idx) => {
            const phaseColors = ['#7aa2ff', '#55e6c1', '#ffd166'];
            return (
              <div key={phase.id} className="flex-1 relative">
                {idx < CONTENT_ROADMAP.length - 1 && (
                  <div
                    className="absolute top-6 left-1/2 w-full h-0.5"
                    style={{ background: 'var(--db-muted)', opacity: 0.3 }}
                  />
                )}
                <div className="relative z-10 text-center">
                  <div
                    className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `${phaseColors[idx]}22`, color: phaseColors[idx] }}
                  >
                    <span className="text-lg font-bold">{idx + 1}</span>
                  </div>
                  <h4 className="font-semibold text-[var(--db-text)] text-sm mb-1">
                    {phase.name}
                  </h4>
                  <span
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                    style={{ background: `${phaseColors[idx]}22`, color: phaseColors[idx] }}
                  >
                    <Clock className="w-3 h-3" />
                    {phase.duration}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase Details */}
      {CONTENT_ROADMAP.map((phase, idx) => {
        const phaseColors = ['#7aa2ff', '#55e6c1', '#ffd166'];
        return (
          <div key={phase.id} className="db-card">
            <div
              className="db-card-header px-5 py-4 flex items-center gap-3"
              style={{ borderLeftColor: phaseColors[idx], borderLeftWidth: 3 }}
            >
              <h3 className="text-lg font-semibold text-[var(--db-text)]">
                {phase.name}
              </h3>
              <span
                className="px-2 py-0.5 rounded text-xs"
                style={{ background: `${phaseColors[idx]}22`, color: phaseColors[idx] }}
              >
                {phase.items.length}개 항목
              </span>
            </div>
            <div className="p-5">
              <div className="space-y-3">
                {phase.items.map((item, itemIdx) => {
                  const typeData = CONTENT_SYSTEM.types.find((t) => t.id === item.type);
                  const priorityColors = {
                    high: '#ff6b6b',
                    medium: '#ffd166',
                    low: '#55e6c1',
                  };
                  return (
                    <div
                      key={itemIdx}
                      className="flex items-center gap-4 p-3 rounded-lg"
                      style={{ background: 'rgba(0,0,0,0.3)' }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${typeData?.color}22`, color: typeData?.color }}
                      >
                        {TYPE_ICONS[item.type]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-[var(--db-text)]">
                            {typeData?.icon} {item.subType}
                          </h4>
                          <span
                            className="px-2 py-0.5 rounded text-xs"
                            style={{
                              background: `${priorityColors[item.priority]}22`,
                              color: priorityColors[item.priority],
                            }}
                          >
                            {item.priority === 'high' ? '높음' : item.priority === 'medium' ? '중간' : '낮음'}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--db-muted)]">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      {/* Result Reveal Strategies */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            결과 공개 전략
          </h3>
          <p className="text-sm text-[var(--db-muted)]">
            투표 결과를 언제 공개할지 선택하여 재방문 유도
          </p>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          {CONTENT_SYSTEM.revealStrategies.map((strategy) => (
            <div
              key={strategy.id}
              className="p-4 rounded-lg"
              style={{ background: 'rgba(0,0,0,0.3)' }}
            >
              <h4 className="font-semibold text-[var(--db-text)] mb-1">
                {strategy.name}
              </h4>
              <p className="text-sm text-[var(--db-muted)] mb-2">
                {strategy.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {strategy.examples.map((example, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-xs bg-[var(--db-panel)] text-[var(--db-text)]"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Reports */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            <TrendingUp className="w-5 h-5 inline mr-2" />
            트렌드 리포트 설계
          </h3>
          <p className="text-sm text-[var(--db-muted)]">
            기간별로 보여줄 데이터와 시각화 방식
          </p>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          {CONTENT_SYSTEM.trendReports.map((report) => {
            const periodLabels = {
              daily: '일간',
              weekly: '주간',
              monthly: '월간',
              quarterly: '분기',
            };
            const periodColors = {
              daily: '#7aa2ff',
              weekly: '#55e6c1',
              monthly: '#ffd166',
              quarterly: '#ff6b9d',
            };
            return (
              <div
                key={report.period}
                className="p-4 rounded-lg"
                style={{ background: `${periodColors[report.period]}10` }}
              >
                <h4
                  className="font-semibold mb-3"
                  style={{ color: periodColors[report.period] }}
                >
                  {periodLabels[report.period]} 리포트
                </h4>
                <ul className="space-y-2">
                  {report.metrics.map((metric) => (
                    <li key={metric.id} className="text-sm">
                      <span className="text-[var(--db-text)]">{metric.name}</span>
                      <span className="text-[var(--db-muted)]"> - {metric.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Seasonal/Trend Tab
// ============================================================================

function SeasonalTab() {
  const [subTab, setSubTab] = useState<'seasonal' | 'trend'>('seasonal');
  const activeSeasons = getActiveSeasonalContent();
  const upcomingSeasons = getUpcomingSeasonalContent(30);

  return (
    <div className="space-y-6">
      {/* Sub Tab Navigation */}
      <div className="flex gap-2">
        <button
          onClick={() => setSubTab('seasonal')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            subTab === 'seasonal'
              ? 'bg-[var(--db-brand)] text-[#081023]'
              : 'bg-[var(--db-panel)] text-[var(--db-muted)] hover:text-[var(--db-text)]'
          }`}
        >
          📅 시즌 콘텐츠
        </button>
        <button
          onClick={() => setSubTab('trend')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            subTab === 'trend'
              ? 'bg-[var(--db-brand)] text-[#081023]'
              : 'bg-[var(--db-panel)] text-[var(--db-muted)] hover:text-[var(--db-text)]'
          }`}
        >
          🔥 트렌드 콘텐츠
        </button>
      </div>

      {subTab === 'seasonal' ? (
        <SeasonalContentView activeSeasons={activeSeasons} upcomingSeasons={upcomingSeasons} />
      ) : (
        <TrendContentSection />
      )}
    </div>
  );
}

function SeasonalContentView({
  activeSeasons,
  upcomingSeasons
}: {
  activeSeasons: SeasonalContent[];
  upcomingSeasons: SeasonalContent[];
}) {
  const [expandedSeason, setExpandedSeason] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Active Seasons Alert */}
      {activeSeasons.length > 0 && (
        <div className="db-card p-5 border-l-4 border-[var(--db-brand)]">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-[var(--db-brand)]" />
            <h3 className="font-semibold text-[var(--db-text)]">
              현재 활성화된 시즌 ({activeSeasons.length}개)
            </h3>
          </div>
          <div className="flex gap-3 flex-wrap">
            {activeSeasons.map(season => (
              <span
                key={season.id}
                className="px-3 py-1 rounded-full text-sm font-medium bg-[var(--db-brand)]/20 text-[var(--db-brand)]"
              >
                {season.icon} {season.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Seasons */}
      {upcomingSeasons.length > 0 && (
        <div className="db-card p-5">
          <h3 className="font-semibold text-[var(--db-text)] mb-3">
            📆 다가오는 시즌 (30일 이내)
          </h3>
          <div className="flex gap-2 flex-wrap">
            {upcomingSeasons.map(season => (
              <span
                key={season.id}
                className="px-3 py-1 rounded-full text-sm bg-[var(--db-panel)] text-[var(--db-muted)]"
              >
                {season.icon} {season.name} ({season.period.start}~)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* All Seasons Grid */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            연간 시즌 콘텐츠 ({SEASONAL_CONTENT.length}개)
          </h3>
          <p className="text-sm text-[var(--db-muted)]">
            클릭하면 퀴즈/투표 아이디어를 볼 수 있습니다
          </p>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          {SEASONAL_CONTENT.map(season => {
            const isExpanded = expandedSeason === season.id;
            const isActive = activeSeasons.some(s => s.id === season.id);

            return (
              <div
                key={season.id}
                className={`rounded-xl overflow-hidden transition-all ${
                  isActive ? 'ring-2 ring-[var(--db-brand)]' : ''
                }`}
              >
                <button
                  onClick={() => setExpandedSeason(isExpanded ? null : season.id)}
                  className="w-full p-4 text-left hover:bg-white/5 transition-colors"
                  style={{ background: 'rgba(0,0,0,0.3)' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{season.icon}</span>
                      <div>
                        <h4 className="font-semibold text-[var(--db-text)]">
                          {season.name}
                          {isActive && (
                            <span className="ml-2 px-2 py-0.5 rounded text-xs bg-[var(--db-brand)] text-[#081023]">
                              NOW
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-[var(--db-muted)]">
                          {season.period.start} ~ {season.period.end}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--db-muted)]">
                      <span>퀴즈 {season.quizIdeas.length}</span>
                      <span>·</span>
                      <span>투표 {season.pollIdeas.length}</span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 border-t border-white/10 space-y-4" style={{ background: 'rgba(0,0,0,0.2)' }}>
                    {/* Quiz Ideas */}
                    <div>
                      <h5 className="text-xs font-semibold text-[var(--db-muted)] mb-2 flex items-center gap-1">
                        <Brain className="w-3 h-3" /> 퀴즈 아이디어
                      </h5>
                      <ul className="space-y-1">
                        {season.quizIdeas.map((idea, idx) => (
                          <li key={idx} className="text-sm text-[var(--db-text)] flex items-start gap-2">
                            <span className="text-[var(--db-muted)]">•</span>
                            {idea}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Poll Ideas */}
                    <div>
                      <h5 className="text-xs font-semibold text-[var(--db-muted)] mb-2 flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" /> 투표 아이디어
                      </h5>
                      <ul className="space-y-1">
                        {season.pollIdeas.map((idea, idx) => (
                          <li key={idx} className="text-sm text-[var(--db-text)] flex items-start gap-2">
                            <span className="text-[var(--db-muted)]">•</span>
                            {idea}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tips */}
                    {season.tips && season.tips.length > 0 && (
                      <div className="pt-3 border-t border-white/10">
                        <h5 className="text-xs font-semibold text-amber-400 mb-2">💡 운영 팁</h5>
                        <ul className="space-y-1">
                          {season.tips.map((tip, idx) => (
                            <li key={idx} className="text-sm text-[var(--db-muted)]">
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FollowUp Tab
// ============================================================================

function FollowUpTab() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const GOAL_COLORS: Record<string, string> = {
    engagement: '#7aa2ff',
    viral: '#ff6b9d',
    retention: '#55e6c1',
    ugc: '#ffd166',
  };

  const GOAL_LABELS: Record<string, string> = {
    engagement: '참여',
    viral: '바이럴',
    retention: '리텐션',
    ugc: 'UGC',
  };

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="db-card p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#ff6b9d]/20 flex items-center justify-center">
            <Share2 className="w-6 h-6 text-[#ff6b9d]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--db-text)] mb-2">
              후속 참여 전략이란?
            </h3>
            <p className="text-[var(--db-muted)]">
              퀴즈/투표 결과 후 <strong className="text-[var(--db-text)]">바이럴과 재참여</strong>를 유도하는 요소들입니다.
              단순 공유 외에도 즉각 반응, 결과 기반 후속, 소셜 연결, 지연 참여 등 다양한 방식으로
              사용자를 계속 붙잡아 둡니다.
            </p>
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-4 gap-4">
        {FOLLOWUP_CATEGORIES.map((category) => {
          const categoryColors: Record<string, string> = {
            'immediate-reaction': '#7aa2ff',
            'result-based': '#55e6c1',
            'social-connection': '#ff6b9d',
            'delayed-engagement': '#ffd166',
          };
          const color = categoryColors[category.id] || '#7aa2ff';
          const isSelected = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(isSelected ? null : category.id)}
              className={`p-4 rounded-xl text-left transition-all ${
                isSelected ? 'ring-2' : ''
              }`}
              style={{
                background: `${color}15`,
                // @ts-expect-error CSS variable for ring color
                '--tw-ring-color': color
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{category.icon}</span>
                <div>
                  <h4 className="font-semibold text-[var(--db-text)]">{category.name}</h4>
                  <p className="text-xs text-[var(--db-muted)]">{category.elements.length}개 요소</p>
                </div>
              </div>
              <p className="text-sm text-[var(--db-muted)]">{category.description}</p>
            </button>
          );
        })}
      </div>

      {/* All Elements or Filtered */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            {selectedCategory
              ? `${FOLLOWUP_CATEGORIES.find(c => c.id === selectedCategory)?.name} 요소`
              : '전체 후속 참여 요소'
            }
          </h3>
          <p className="text-sm text-[var(--db-muted)]">
            바이럴 효과와 구현 난이도로 우선순위 판단
          </p>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 gap-4">
            {FOLLOWUP_CATEGORIES
              .filter(cat => !selectedCategory || cat.id === selectedCategory)
              .flatMap(cat => cat.elements.map(el => ({ ...el, categoryId: cat.id, categoryIcon: cat.icon })))
              .map((element) => {
                const categoryColors: Record<string, string> = {
                  'immediate-reaction': '#7aa2ff',
                  'result-based': '#55e6c1',
                  'social-connection': '#ff6b9d',
                  'delayed-engagement': '#ffd166',
                };
                const catColor = categoryColors[element.categoryId] || '#7aa2ff';

                return (
                  <div
                    key={element.id}
                    className="p-4 rounded-xl"
                    style={{ background: 'rgba(0,0,0,0.3)' }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span>{element.categoryIcon}</span>
                        <h4 className="font-semibold text-[var(--db-text)]">{element.name}</h4>
                      </div>
                      <div className="flex gap-1">
                        {element.goal.map(g => (
                          <span
                            key={g}
                            className="px-2 py-0.5 rounded text-xs"
                            style={{ background: `${GOAL_COLORS[g]}22`, color: GOAL_COLORS[g] }}
                          >
                            {GOAL_LABELS[g]}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[var(--db-muted)] mb-3">{element.description}</p>

                    {/* Ratings */}
                    <div className="flex gap-6 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--db-muted)]">바이럴</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star
                              key={n}
                              className="w-3 h-3"
                              style={{
                                color: n <= element.viralEffect ? '#ff6b9d' : 'rgba(255,255,255,0.1)',
                                fill: n <= element.viralEffect ? '#ff6b9d' : 'transparent',
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--db-muted)]">난이도</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3].map((n) => (
                            <div
                              key={n}
                              className="w-2 h-2 rounded-full"
                              style={{
                                background: n <= element.effort ? catColor : 'rgba(255,255,255,0.1)',
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Examples */}
                    <div className="flex flex-wrap gap-1">
                      {element.examples.map((ex, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-xs bg-[var(--db-panel)] text-[var(--db-text)]"
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Implementation Roadmap */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            구현 로드맵
          </h3>
        </div>
        <div className="p-5">
          <div className="space-y-4">
            {FOLLOWUP_ROADMAP.map((phase, idx) => {
              const phaseColors = ['#7aa2ff', '#55e6c1', '#ffd166', '#ff6b9d'];
              const color = phaseColors[idx % phaseColors.length];

              return (
                <div
                  key={phase.phase}
                  className="p-4 rounded-xl"
                  style={{ background: `${color}10`, borderLeft: `3px solid ${color}` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="px-3 py-1 rounded-lg text-sm font-bold"
                      style={{ background: color, color: '#081023' }}
                    >
                      {phase.phase}
                    </span>
                    <span className="text-xs text-[var(--db-muted)]">{phase.duration}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {phase.items.map((item, itemIdx) => {
                      const priorityColors: Record<string, string> = {
                        high: '#ff6b6b',
                        medium: '#ffd166',
                        low: '#55e6c1',
                      };
                      return (
                        <div
                          key={itemIdx}
                          className="p-3 rounded-lg flex items-start gap-2"
                          style={{ background: 'rgba(0,0,0,0.2)' }}
                        >
                          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color }} />
                          <div>
                            <span className="text-sm text-[var(--db-text)]">{item.name}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className="px-1.5 py-0.5 rounded text-xs"
                                style={{
                                  background: `${priorityColors[item.priority]}22`,
                                  color: priorityColors[item.priority]
                                }}
                              >
                                {item.priority === 'high' ? '높음' : item.priority === 'medium' ? '중간' : '낮음'}
                              </span>
                              <span className="text-xs text-[var(--db-muted)]">{item.reason}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Wins - High Viral, Low Effort */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            <Zap className="w-5 h-5 inline mr-2 text-[var(--db-brand)]" />
            Quick Wins (고효과 + 저난이도)
          </h3>
          <p className="text-sm text-[var(--db-muted)]">
            바이럴 효과 4+ & 구현 난이도 1인 요소들
          </p>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-3">
            {FOLLOWUP_CATEGORIES
              .flatMap(cat => cat.elements)
              .filter(el => el.viralEffect >= 4 && el.effort === 1)
              .map(el => (
                <div
                  key={el.id}
                  className="px-4 py-2 rounded-lg bg-[var(--db-brand)]/20 border border-[var(--db-brand)]/30"
                >
                  <span className="font-medium text-[var(--db-brand)]">{el.name}</span>
                  <span className="ml-2 text-xs text-[var(--db-muted)]">
                    바이럴 {el.viralEffect}★
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TrendContentSection() {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="db-card p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--db-text)] mb-2">
              트렌드 기반 콘텐츠란?
            </h3>
            <p className="text-[var(--db-muted)]">
              시즌 콘텐츠는 예측 가능하지만, <strong className="text-[var(--db-text)]">실시간 이슈와 트렌드</strong>를
              반영한 콘텐츠는 더 높은 참여율을 이끌어냅니다. 뉴스, SNS, 커뮤니티에서 핫한 주제를 발굴하여
              퀴즈/투표로 만들어 보세요.
            </p>
          </div>
        </div>
      </div>

      {/* Operation Guide */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            트렌드 운영 플로우
          </h3>
        </div>
        <div className="p-5">
          <div className="flex items-start gap-4">
            {TREND_OPERATION_GUIDE.map((step, idx) => (
              <div key={step.step} className="flex-1 relative">
                {idx < TREND_OPERATION_GUIDE.length - 1 && (
                  <div
                    className="absolute top-6 left-1/2 w-full h-0.5 bg-white/10"
                  />
                )}
                <div className="relative z-10 text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/20 flex items-center justify-center mb-3">
                    <span className="text-lg font-bold text-amber-400">{step.step}</span>
                  </div>
                  <h4 className="font-semibold text-[var(--db-text)] text-sm mb-1">
                    {step.title}
                  </h4>
                  <p className="text-xs text-[var(--db-muted)] mb-2">
                    {step.description}
                  </p>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-[var(--db-panel)] text-[var(--db-muted)]">
                    <Clock className="w-3 h-3" />
                    {step.frequency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend Sources */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            <Search className="w-5 h-5 inline mr-2" />
            트렌드 모니터링 소스
          </h3>
          <p className="text-sm text-[var(--db-muted)]">
            주기적으로 체크할 트렌드 소스와 모니터링 키워드
          </p>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          {TREND_SOURCES.map(source => (
            <div
              key={source.id}
              className="p-4 rounded-xl"
              style={{ background: 'rgba(0,0,0,0.3)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{source.icon}</span>
                  <div>
                    <h4 className="font-semibold text-[var(--db-text)]">{source.name}</h4>
                    <p className="text-xs text-[var(--db-muted)]">{source.checkFrequency}</p>
                  </div>
                </div>
                {source.checkUrl && (
                  <a
                    href={source.checkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[var(--db-panel)] hover:bg-[var(--db-brand)]/20 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-[var(--db-muted)]" />
                  </a>
                )}
              </div>
              <p className="text-sm text-[var(--db-muted)] mb-3">{source.description}</p>
              {source.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {source.keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-400"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Example Trends */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            트렌드 콘텐츠 예시
          </h3>
          <p className="text-sm text-[var(--db-muted)]">
            이런 식으로 트렌드를 콘텐츠화할 수 있습니다
          </p>
        </div>
        <div className="p-5 space-y-3">
          {TREND_CONTENT_EXAMPLES.map(trend => {
            const sourceInfo = TREND_SOURCES.find(s => s.id === trend.source);
            const priorityColors = {
              high: '#ff6b6b',
              medium: '#ffd166',
              low: '#55e6c1',
            };

            return (
              <div
                key={trend.id}
                className="p-4 rounded-xl flex items-start gap-4"
                style={{ background: 'rgba(0,0,0,0.3)' }}
              >
                <span className="text-2xl">{sourceInfo?.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-[var(--db-text)]">{trend.keyword}</h4>
                    <span
                      className="px-2 py-0.5 rounded text-xs"
                      style={{
                        background: `${priorityColors[trend.priority || 'medium']}22`,
                        color: priorityColors[trend.priority || 'medium'],
                      }}
                    >
                      {trend.priority === 'high' ? '높음' : trend.priority === 'low' ? '낮음' : '중간'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[var(--db-muted)] mb-3">
                    <span>{sourceInfo?.name}</span>
                    <span>·</span>
                    <span>{trend.detectedAt}</span>
                    {trend.expiresAt && (
                      <>
                        <span>·</span>
                        <span className="text-amber-400">~{trend.expiresAt} 까지</span>
                      </>
                    )}
                  </div>
                  <div className="space-y-1">
                    {trend.quizIdea && (
                      <div className="flex items-center gap-2 text-sm">
                        <Brain className="w-4 h-4 text-[#7aa2ff]" />
                        <span className="text-[var(--db-text)]">{trend.quizIdea}</span>
                      </div>
                    )}
                    {trend.pollIdea && (
                      <div className="flex items-center gap-2 text-sm">
                        <BarChart3 className="w-4 h-4 text-[#55e6c1]" />
                        <span className="text-[var(--db-text)]">{trend.pollIdea}</span>
                      </div>
                    )}
                  </div>
                  {trend.notes && (
                    <p className="mt-2 text-xs text-amber-400">💡 {trend.notes}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Structure Reference */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            데이터 구조 (향후 구현용)
          </h3>
        </div>
        <div className="p-5">
          <pre className="text-xs text-[var(--db-muted)] bg-black/30 p-4 rounded-lg overflow-x-auto">
{`interface TrendContent {
  id: string;
  source: 'news' | 'sns' | 'community' | 'search' | 'manual';
  keyword: string;           // 트렌드 키워드
  detectedAt: string;        // 발견 일자 (YYYY-MM-DD)
  relevance: ContentCategory[];  // 관련 카테고리
  status: 'idea' | 'ready' | 'published' | 'expired';
  quizIdea?: string;
  pollIdea?: string;
  expiresAt?: string;        // 유효기간
  notes?: string;
  priority?: 'high' | 'medium' | 'low';
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
