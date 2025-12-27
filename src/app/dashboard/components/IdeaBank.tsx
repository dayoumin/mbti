'use client';

import { useState } from 'react';
import {
  Lightbulb,
  ChevronRight,
  Star,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Zap,
  Filter,
  BarChart3,
  Target,
  Layers,
  ExternalLink,
} from 'lucide-react';
import {
  THEMES,
  Theme,
  ContentIdea,
  getIdeaStats,
  getTotalStats,
  getHighPriorityIdeas,
  getQuickWins,
  ContentCategory,
  IdeaStatus,
  ViralPotential,
} from '../data/idea-bank';

// ============================================================================
// Constants
// ============================================================================

const CATEGORY_INFO: Record<ContentCategory, { name: string; icon: string; color: string }> = {
  worldcup: { name: '월드컵', icon: '🏆', color: '#ff6b9d' },
  'tier-vote': { name: '티어 투표', icon: '📊', color: '#7aa2ff' },
  'balance-game': { name: '밸런스 게임', icon: '⚖️', color: '#55e6c1' },
  'mbti-test': { name: 'MBTI 테스트', icon: '🧠', color: '#ffd166' },
  quiz: { name: '퀴즈', icon: '❓', color: '#a29bfe' },
  checklist: { name: '체크리스트', icon: '✅', color: '#00b894' },
  recommend: { name: '추천', icon: '🎯', color: '#fdcb6e' },
  other: { name: '기타', icon: '💡', color: '#636e72' },
};

const STATUS_INFO: Record<IdeaStatus, { name: string; icon: string; color: string }> = {
  idea: { name: '아이디어', icon: '📝', color: '#95a5a6' },
  review: { name: '검토 중', icon: '🔍', color: '#3498db' },
  planning: { name: '기획 중', icon: '🎨', color: '#9b59b6' },
  ready: { name: '준비됨', icon: '✅', color: '#2ecc71' },
  'in-progress': { name: '진행 중', icon: '🚧', color: '#f39c12' },
  completed: { name: '완료', icon: '✨', color: '#27ae60' },
  paused: { name: '보류', icon: '⏸️', color: '#7f8c8d' },
};

const VIRAL_INFO: Record<ViralPotential, { name: string; color: string; stars: number }> = {
  'very-high': { name: '매우 높음', color: '#e74c3c', stars: 5 },
  high: { name: '높음', color: '#ff6b6b', stars: 4 },
  medium: { name: '보통', color: '#ffd166', stars: 3 },
  low: { name: '낮음', color: '#95a5a6', stars: 2 },
};

// ============================================================================
// Main Component
// ============================================================================

export default function IdeaBank() {
  const [activeTab, setActiveTab] = useState<'overview' | 'themes' | 'priority' | 'quick-wins'>('overview');
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [expandedIdea, setExpandedIdea] = useState<string | null>(null);

  const totalStats = getTotalStats();
  const ideaStats = getIdeaStats();

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'overview', label: '개요', icon: <BarChart3 className="w-4 h-4" /> },
          { key: 'themes', label: '테마별 아이디어', icon: <Layers className="w-4 h-4" /> },
          { key: 'priority', label: '우선순위', icon: <Target className="w-4 h-4" /> },
          { key: 'quick-wins', label: 'Quick Wins', icon: <Zap className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.key
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
      {activeTab === 'overview' && <OverviewTab stats={totalStats} themeStats={ideaStats} />}
      {activeTab === 'themes' && (
        <ThemesTab
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
          expandedIdea={expandedIdea}
          setExpandedIdea={setExpandedIdea}
        />
      )}
      {activeTab === 'priority' && <PriorityTab />}
      {activeTab === 'quick-wins' && <QuickWinsTab />}
    </div>
  );
}

// ============================================================================
// Overview Tab
// ============================================================================

function OverviewTab({
  stats,
  themeStats,
}: {
  stats: ReturnType<typeof getTotalStats>;
  themeStats: ReturnType<typeof getIdeaStats>;
}) {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="db-card p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--db-text)] mb-2">
              아이디어 뱅크란?
            </h3>
            <p className="text-[var(--db-muted)]">
              월드컵, 퀴즈, 투표 등 <strong className="text-[var(--db-text)]">모든 콘텐츠 아이디어를 테마별로 수집·관리</strong>하는 곳입니다.
              아이디어 단계부터 구현 완료까지 전 과정을 추적하고, 바이럴 가능성과 구현 난이도를 평가하여
              우선순위를 정합니다. 데이터가 쌓일수록 후속 콘텐츠 기획에 도움이 됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="테마" value={stats.totalThemes} icon="🎨" color="#7aa2ff" />
        <StatCard label="총 아이디어" value={stats.totalIdeas} icon="💡" color="#ffd166" />
        <StatCard
          label="높은 우선순위"
          value={stats.highPriorityIdeas}
          icon="🔥"
          color="#ff6b6b"
        />
        <StatCard
          label="매우 높은 바이럴"
          value={stats.veryHighViralIdeas}
          icon="🚀"
          color="#ff6b9d"
        />
      </div>

      {/* Status Progress */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">진행 상황</h3>
        </div>
        <div className="p-5 grid grid-cols-3 gap-4">
          <ProgressCard
            label="준비됨"
            value={stats.readyToImplement}
            total={stats.totalIdeas}
            color="#2ecc71"
            icon="✅"
          />
          <ProgressCard
            label="진행 중"
            value={stats.inProgress}
            total={stats.totalIdeas}
            color="#f39c12"
            icon="🚧"
          />
          <ProgressCard
            label="완료"
            value={stats.completed}
            total={stats.totalIdeas}
            color="#9b59b6"
            icon="✨"
          />
        </div>
      </div>

      {/* Theme Stats Table */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            테마별 통계
          </h3>
        </div>
        <div className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--db-muted)] border-b border-white/10">
                  <th className="pb-3">테마</th>
                  <th className="pb-3 text-center">총 아이디어</th>
                  <th className="pb-3 text-center">진행 중</th>
                  <th className="pb-3 text-center">완료</th>
                  <th className="pb-3 text-center">바이럴 높음</th>
                </tr>
              </thead>
              <tbody>
                {themeStats.map((stat) => {
                  const theme = THEMES.find((t) => t.id === stat.themeId);
                  if (!theme) return null;
                  return (
                    <tr key={stat.themeId} className="border-b border-white/5">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{theme.icon}</span>
                          <span className="font-medium text-[var(--db-text)]">{stat.themeName}</span>
                        </div>
                      </td>
                      <td className="py-3 text-center text-[var(--db-text)]">
                        {stat.totalIdeas}
                      </td>
                      <td className="py-3 text-center">
                        <span className="text-[#f39c12]">{stat.byStatus.inProgress}</span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="text-[#9b59b6]">{stat.byStatus.completed}</span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="text-[#ff6b9d]">
                          {stat.byViral.veryHigh + stat.byViral.high}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
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
  icon: string;
  color: string;
}) {
  return (
    <div className="db-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-sm text-[var(--db-muted)]">{label}</span>
      </div>
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

function ProgressCard({
  label,
  value,
  total,
  color,
  icon,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
  icon: string;
}) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="p-4 rounded-xl" style={{ background: `${color}15` }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-[var(--db-text)]">
          {icon} {label}
        </span>
        <span className="text-xs text-[var(--db-muted)]">{percentage}%</span>
      </div>
      <p className="text-2xl font-bold mb-2" style={{ color }}>
        {value}
      </p>
      <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${percentage}%`, background: color }} />
      </div>
    </div>
  );
}

// ============================================================================
// Themes Tab
// ============================================================================

function ThemesTab({
  selectedTheme,
  setSelectedTheme,
  expandedIdea,
  setExpandedIdea,
}: {
  selectedTheme: string | null;
  setSelectedTheme: (id: string | null) => void;
  expandedIdea: string | null;
  setExpandedIdea: (id: string | null) => void;
}) {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Theme Selector */}
      <div className="col-span-3 space-y-2">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setSelectedTheme(theme.id === selectedTheme ? null : theme.id)}
            className={`w-full text-left p-4 rounded-xl transition-all ${selectedTheme === theme.id
                ? 'bg-[var(--db-brand)]/20 border border-[var(--db-brand)]/50'
                : 'bg-[var(--db-panel)] hover:bg-[var(--db-panel)]/80'
              }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{theme.icon}</span>
              <div>
                <h4 className="font-semibold text-[var(--db-text)] text-sm">{theme.name}</h4>
                <p className="text-xs text-[var(--db-muted)]">{theme.ideas.length}개 아이디어</p>
              </div>
            </div>
            <div className="text-xs text-[var(--db-muted)]">
              데이터: {theme.estimatedData.current}/{theme.estimatedData.max}
            </div>
          </button>
        ))}
      </div>

      {/* Theme Detail */}
      <div className="col-span-9 space-y-4">
        {selectedTheme ? (
          <ThemeDetail
            theme={THEMES.find((t) => t.id === selectedTheme)!}
            expandedIdea={expandedIdea}
            setExpandedIdea={setExpandedIdea}
          />
        ) : (
          <div className="db-card p-12 text-center">
            <Lightbulb className="w-12 h-12 text-[var(--db-muted)] mx-auto mb-4" />
            <p className="text-[var(--db-muted)]">왼쪽에서 테마를 선택하세요</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ThemeDetail({
  theme,
  expandedIdea,
  setExpandedIdea,
}: {
  theme: Theme;
  expandedIdea: string | null;
  setExpandedIdea: (id: string | null) => void;
}) {
  return (
    <>
      {/* Theme Header */}
      <div className="db-card p-5" style={{ background: `${theme.color}15` }}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{theme.icon}</span>
          <div>
            <h3 className="text-xl font-bold text-[var(--db-text)]">{theme.name}</h3>
            <p className="text-sm text-[var(--db-muted)]">{theme.description}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-3 rounded-lg bg-black/20">
            <p className="text-xs text-[var(--db-muted)] mb-1">타겟 오디언스</p>
            <p className="text-sm text-[var(--db-text)]">{theme.targetAudience}</p>
          </div>
          <div className="p-3 rounded-lg bg-black/20">
            <p className="text-xs text-[var(--db-muted)] mb-1">예상 데이터 규모</p>
            <p className="text-sm text-[var(--db-text)]">
              {theme.estimatedData.min}~{theme.estimatedData.max}개
              <span className="ml-2 text-xs" style={{ color: theme.color }}>
                (현재 {theme.estimatedData.current}개)
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Ideas List */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            아이디어 목록 ({theme.ideas.length}개)
          </h3>
        </div>
        <div className="p-5 space-y-3">
          {theme.ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              themeColor={theme.color}
              isExpanded={expandedIdea === idea.id}
              onToggle={() => setExpandedIdea(expandedIdea === idea.id ? null : idea.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function IdeaCard({
  idea,
  themeColor,
  isExpanded,
  onToggle,
}: {
  idea: ContentIdea;
  themeColor: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const categoryInfo = CATEGORY_INFO[idea.category];
  const statusInfo = STATUS_INFO[idea.status];
  const viralInfo = VIRAL_INFO[idea.viral.potential];

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <button
        onClick={onToggle}
        className="w-full p-4 text-left hover:bg-slate-50/5 transition-colors"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{categoryInfo.icon}</span>
              <h4 className="font-semibold text-[var(--db-text)]">{idea.title}</h4>
              <span
                className="px-2 py-0.5 rounded text-xs"
                style={{ background: `${statusInfo.color}22`, color: statusInfo.color }}
              >
                {statusInfo.icon} {statusInfo.name}
              </span>
              {idea.strategy?.priority && (
                <span
                  className="px-2 py-0.5 rounded text-xs"
                  style={{
                    background:
                      idea.strategy.priority === 'high'
                        ? '#ff6b6b22'
                        : idea.strategy.priority === 'medium'
                          ? '#ffd16622'
                          : '#95a5a622',
                    color:
                      idea.strategy.priority === 'high'
                        ? '#ff6b6b'
                        : idea.strategy.priority === 'medium'
                          ? '#ffd166'
                          : '#95a5a6',
                  }}
                >
                  {idea.strategy.priority === 'high' ? '높음' : idea.strategy.priority === 'medium' ? '중간' : '낮음'}
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--db-muted)] mb-2">{idea.description}</p>
            <div className="flex items-center gap-4 text-xs text-[var(--db-muted)]">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                바이럴: {viralInfo.name}
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                난이도: {idea.implementation.difficulty}/3
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {idea.implementation.estimatedTime}
              </div>
            </div>
          </div>
          <ChevronRight
            className={`w-5 h-5 text-[var(--db-muted)] transition-transform flex-shrink-0 ml-2 ${isExpanded ? 'rotate-90' : ''
              }`}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 border-t border-white/10 space-y-4" style={{ background: 'rgba(0,0,0,0.2)' }}>
          {/* Viral Reasons */}
          <div>
            <h5 className="text-sm font-semibold text-[var(--db-text)] mb-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" style={{ color: viralInfo.color }} />
              바이럴 포인트
            </h5>
            <ul className="space-y-1">
              {idea.viral.reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-[var(--db-muted)]">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: viralInfo.color }} />
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* Implementation */}
          <div>
            <h5 className="text-sm font-semibold text-[var(--db-text)] mb-2">구현 정보</h5>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 rounded bg-black/30">
                <p className="text-xs text-[var(--db-muted)]">난이도</p>
                <p className="text-sm text-[var(--db-text)]">{idea.implementation.difficulty}/3</p>
              </div>
              <div className="p-2 rounded bg-black/30">
                <p className="text-xs text-[var(--db-muted)]">예상 시간</p>
                <p className="text-sm text-[var(--db-text)]">{idea.implementation.estimatedTime}</p>
              </div>
            </div>
            {idea.implementation.dependencies.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-[var(--db-muted)] mb-1">선행 작업</p>
                <div className="flex flex-wrap gap-1">
                  {idea.implementation.dependencies.map((dep, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-xs bg-[var(--db-panel)] text-[var(--db-text)]"
                    >
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Examples */}
          {idea.examples && idea.examples.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-[var(--db-text)] mb-2">예시</h5>
              <ul className="space-y-1">
                {idea.examples.map((example, idx) => (
                  <li key={idx} className="text-sm text-[var(--db-muted)] flex items-start gap-2">
                    <span className="text-[var(--db-muted)]">•</span>
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Strategy Notes */}
          {idea.strategy?.notes && idea.strategy.notes.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-amber-400 mb-2">💡 전략적 고려사항</h5>
              <ul className="space-y-1">
                {idea.strategy.notes.map((note, idx) => (
                  <li key={idx} className="text-sm text-[var(--db-muted)]">
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related File */}
          {idea.relatedFile && (
            <div className="pt-3 border-t border-white/10">
              <a
                href={`/${idea.relatedFile}`}
                className="flex items-center gap-2 text-sm text-[var(--db-brand)] hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                관련 파일: {idea.relatedFile}
              </a>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-3 border-t border-white/10 text-xs text-[var(--db-muted)]">
            추가: {idea.addedAt}
            {idea.updatedAt && ` · 수정: ${idea.updatedAt}`}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Priority Tab
// ============================================================================

function PriorityTab() {
  const highPriorityIdeas = getHighPriorityIdeas();

  return (
    <div className="space-y-6">
      <div className="db-card p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
            <Target className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--db-text)] mb-2">우선순위 높은 아이디어</h3>
            <p className="text-[var(--db-muted)]">
              전략적으로 <strong className="text-[var(--db-text)]">우선순위가 높게 설정된</strong> 아이디어들입니다.
              상태별로 정렬되어 있으며, 준비된 것부터 진행하세요.
            </p>
          </div>
        </div>
      </div>

      {highPriorityIdeas.length === 0 ? (
        <div className="db-card p-12 text-center">
          <AlertCircle className="w-12 h-12 text-[var(--db-muted)] mx-auto mb-4" />
          <p className="text-[var(--db-muted)]">우선순위가 높은 아이디어가 없습니다</p>
        </div>
      ) : (
        <div className="db-card">
          <div className="p-5 space-y-3">
            {highPriorityIdeas.map((idea) => {
              const categoryInfo = CATEGORY_INFO[idea.category];
              const statusInfo = STATUS_INFO[idea.status];
              const viralInfo = VIRAL_INFO[idea.viral.potential];

              return (
                <div
                  key={idea.id}
                  className="p-4 rounded-xl"
                  style={{ background: 'rgba(0,0,0,0.3)' }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{idea.themeIcon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{categoryInfo.icon}</span>
                        <h4 className="font-semibold text-[var(--db-text)]">{idea.title}</h4>
                        <span
                          className="px-2 py-0.5 rounded text-xs"
                          style={{ background: `${statusInfo.color}22`, color: statusInfo.color }}
                        >
                          {statusInfo.icon} {statusInfo.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400">
                          우선순위 높음
                        </span>
                      </div>
                      <p className="text-sm text-[var(--db-muted)] mb-3">{idea.description}</p>
                      <div className="flex items-center gap-4 text-xs text-[var(--db-muted)]">
                        <span>{idea.themeName}</span>
                        <span>·</span>
                        <span>바이럴: {viralInfo.name}</span>
                        <span>·</span>
                        <span>난이도: {idea.implementation.difficulty}/3</span>
                        <span>·</span>
                        <span>{idea.implementation.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Quick Wins Tab
// ============================================================================

function QuickWinsTab() {
  const quickWins = getQuickWins();

  return (
    <div className="space-y-6">
      <div className="db-card p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Zap className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--db-text)] mb-2">Quick Wins</h3>
            <p className="text-[var(--db-muted)]">
              <strong className="text-[var(--db-text)]">고효과 + 저난이도</strong> 아이디어들입니다.
              바이럴 가능성이 높으면서도 구현이 쉬워서 빠르게 성과를 낼 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {quickWins.length === 0 ? (
        <div className="db-card p-12 text-center">
          <AlertCircle className="w-12 h-12 text-[var(--db-muted)] mx-auto mb-4" />
          <p className="text-[var(--db-muted)]">Quick Win 아이디어가 없습니다</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {quickWins.map((idea) => {
            const categoryInfo = CATEGORY_INFO[idea.category];
            const statusInfo = STATUS_INFO[idea.status];
            const viralInfo = VIRAL_INFO[idea.viral.potential];

            return (
              <div
                key={idea.id}
                className="db-card p-5 border-2"
                style={{ borderColor: `${viralInfo.color}50` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{idea.themeIcon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{categoryInfo.icon}</span>
                      <h4 className="font-semibold text-[var(--db-text)]">{idea.title}</h4>
                    </div>
                    <p className="text-xs text-[var(--db-muted)]">{idea.themeName}</p>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded text-xs"
                    style={{ background: `${statusInfo.color}22`, color: statusInfo.color }}
                  >
                    {statusInfo.name}
                  </span>
                </div>
                <p className="text-sm text-[var(--db-muted)] mb-3">{idea.description}</p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {Array.from({ length: viralInfo.stars }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3"
                          style={{ color: viralInfo.color, fill: viralInfo.color }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-[var(--db-muted)]">바이럴</span>
                  </div>
                  <span className="text-xs text-[var(--db-muted)]">·</span>
                  <span className="text-xs text-green-400">쉬운 난이도</span>
                  <span className="text-xs text-[var(--db-muted)]">·</span>
                  <span className="text-xs text-[var(--db-muted)]">{idea.implementation.estimatedTime}</span>
                </div>
                <div className="pt-3 border-t border-white/10">
                  <p className="text-xs font-semibold text-[var(--db-text)] mb-2">바이럴 포인트</p>
                  <ul className="space-y-1">
                    {idea.viral.reasons.slice(0, 2).map((reason, idx) => (
                      <li key={idx} className="text-xs text-[var(--db-muted)] flex items-start gap-1">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-400" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
