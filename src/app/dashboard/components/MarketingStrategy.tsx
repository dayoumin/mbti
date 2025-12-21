'use client';

import { useState } from 'react';
import {
  Target,
  Zap,
  TrendingUp,
  Video,
  Instagram,
  Youtube,
  MessageCircle,
  Search,
  Users,
  Star,
  CheckCircle2,
  ChevronRight,
  Calendar,
  BarChart3,
  Megaphone,
  Bot,
  Sparkles,
  Clock,
  DollarSign,
} from 'lucide-react';
import {
  MARKETING_STRATEGY,
  MARKETING_PRINCIPLES,
  CONTENT_PILLARS,
  MarketingChannel,
  ChannelTactic,
  AUTOMATION_PIPELINES,
  AUTOMATION_TOOLS,
  AUTOMATION_ROI,
  AUTOMATION_ROADMAP,
  CONTENT_TEMPLATES,
  AutomationPipeline,
} from '../data/marketing-strategy';

// ============================================================================
// Main Component
// ============================================================================

export default function MarketingStrategy() {
  const [activeTab, setActiveTab] = useState<'principles' | 'channels' | 'content' | 'phases' | 'kpi' | 'automation'>('principles');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'principles', label: '핵심 원칙', icon: <Target className="w-4 h-4" /> },
          { key: 'channels', label: '채널 전략', icon: <Megaphone className="w-4 h-4" /> },
          { key: 'content', label: '콘텐츠 필러', icon: <Video className="w-4 h-4" /> },
          { key: 'phases', label: 'Phase별 계획', icon: <Zap className="w-4 h-4" /> },
          { key: 'automation', label: 'AI 자동화', icon: <Bot className="w-4 h-4" />, badge: 'NEW' },
          { key: 'kpi', label: 'KPI', icon: <TrendingUp className="w-4 h-4" /> },
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
            {'badge' in tab && (
              <span className="px-1.5 py-0.5 bg-rose-500 text-white text-xs font-bold rounded">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'principles' && <PrinciplesTab />}
      {activeTab === 'channels' && <ChannelsTab />}
      {activeTab === 'content' && <ContentTab />}
      {activeTab === 'phases' && <PhasesTab />}
      {activeTab === 'automation' && <AutomationTab />}
      {activeTab === 'kpi' && <KPITab />}
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
          <h3 className="text-lg font-semibold text-[var(--db-text)]">마케팅 핵심 원칙</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {MARKETING_PRINCIPLES.map((principle) => (
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

      {/* Key Message */}
      <div className="db-card p-5">
        <h3 className="font-semibold text-[var(--db-text)] mb-4">핵심 메시지</h3>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-amber-400 font-medium">
            💡 광고보다 제품이 마케팅 도구가 되도록 설계하세요.
          </p>
          <p className="text-sm text-[var(--db-muted)] mt-2">
            예쁜 결과 카드 → 자연스러운 공유 → 친구 유입 → 비교 기능 → 재공유
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Channels Tab
// ============================================================================

function ChannelsTab() {
  const [selectedChannel, setSelectedChannel] = useState<string>('instagram');
  const channels = MARKETING_STRATEGY.channels;
  const currentChannel = channels.find((c) => c.id === selectedChannel) || channels[0];

  const channelIcons: Record<string, React.ReactNode> = {
    instagram: <Instagram className="w-5 h-5" />,
    tiktok: <Video className="w-5 h-5" />,
    youtube: <Youtube className="w-5 h-5" />,
    kakaotalk: <MessageCircle className="w-5 h-5" />,
    'blog-seo': <Search className="w-5 h-5" />,
    community: <Users className="w-5 h-5" />,
    influencer: <Star className="w-5 h-5" />,
  };

  const priorityColors = {
    critical: 'bg-rose-500',
    high: 'bg-amber-500',
    medium: 'bg-blue-500',
    low: 'bg-gray-500',
  };

  return (
    <div className="space-y-6">
      {/* Channel Selector */}
      <div className="flex gap-2 flex-wrap">
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => setSelectedChannel(channel.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedChannel === channel.id
                ? 'bg-purple-500 text-white'
                : 'bg-[var(--db-panel)] text-[var(--db-muted)] hover:text-[var(--db-text)]'
            }`}
          >
            {channelIcons[channel.id]}
            {channel.name}
            <span className={`w-2 h-2 rounded-full ${priorityColors[channel.priority]}`} />
          </button>
        ))}
      </div>

      {/* Channel Detail */}
      <div className="db-card">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              {channelIcons[currentChannel.id]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-[var(--db-text)]">{currentChannel.name}</h3>
                <span className="text-lg">{currentChannel.icon}</span>
              </div>
              <p className="text-sm text-[var(--db-muted)]">{currentChannel.description}</p>
            </div>
            <div className="flex gap-4 text-center">
              <div>
                <p className="text-xs text-[var(--db-muted)]">우선순위</p>
                <p className={`text-sm font-bold ${
                  currentChannel.priority === 'critical' ? 'text-rose-400' :
                  currentChannel.priority === 'high' ? 'text-amber-400' :
                  'text-blue-400'
                }`}>
                  {currentChannel.priority === 'critical' ? '필수' : currentChannel.priority === 'high' ? '높음' : '중간'}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--db-muted)]">노력</p>
                <p className="text-sm font-bold text-[var(--db-text)]">{currentChannel.effort}/5</p>
              </div>
              <div>
                <p className="text-xs text-[var(--db-muted)]">도달</p>
                <p className="text-sm font-bold text-emerald-400">{currentChannel.reach}/5</p>
              </div>
              <div>
                <p className="text-xs text-[var(--db-muted)]">비용</p>
                <p className="text-sm font-bold text-[var(--db-text)]">{currentChannel.cost}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tactics */}
        <div className="p-5 space-y-4">
          <h4 className="font-semibold text-[var(--db-text)]">전술</h4>
          {currentChannel.tactics.map((tactic) => (
            <TacticCard key={tactic.id} tactic={tactic} />
          ))}
        </div>

        {/* Best Practices */}
        <div className="p-5 border-t border-white/10">
          <h4 className="font-semibold text-[var(--db-text)] mb-3">베스트 프랙티스</h4>
          <ul className="space-y-2">
            {currentChannel.bestPractices.map((practice, i) => (
              <li key={i} className="text-sm text-[var(--db-muted)] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                {practice}
              </li>
            ))}
          </ul>
        </div>

        {/* Metrics */}
        <div className="p-5 border-t border-white/10">
          <h4 className="font-semibold text-[var(--db-text)] mb-3">측정 지표</h4>
          <div className="flex flex-wrap gap-2">
            {currentChannel.metrics.map((metric, i) => (
              <span key={i} className="px-3 py-1 bg-[var(--db-brand)]/10 text-[var(--db-brand)] text-sm rounded-lg">
                {metric}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TacticCard({ tactic }: { tactic: ChannelTactic }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div>
          <h5 className="font-medium text-[var(--db-text)]">{tactic.name}</h5>
          <p className="text-sm text-[var(--db-muted)]">{tactic.description}</p>
          <p className="text-xs text-purple-400 mt-1">
            <Calendar className="w-3 h-3 inline mr-1" />
            {tactic.frequency}
          </p>
        </div>
        <ChevronRight className={`w-5 h-5 text-[var(--db-muted)] transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>

      {expanded && tactic.contentIdeas && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-xs text-[var(--db-muted)] mb-2">콘텐츠 아이디어</p>
          <ul className="space-y-1">
            {tactic.contentIdeas.map((idea, i) => (
              <li key={i} className="text-sm text-[var(--db-text)] flex items-start gap-2">
                <span className="text-purple-400">•</span>
                {idea}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Content Tab
// ============================================================================

function ContentTab() {
  return (
    <div className="space-y-6">
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">콘텐츠 필러 (유형별 비율)</h3>
        </div>
        <div className="p-5 space-y-4">
          {CONTENT_PILLARS.map((pillar) => (
            <div key={pillar.id} className="p-4 rounded-xl bg-white/5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-[var(--db-text)]">{pillar.name}</h4>
                  <p className="text-sm text-[var(--db-muted)]">{pillar.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-[var(--db-brand)]">{pillar.ratio}%</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-white/10 rounded-full mb-3">
                <div
                  className="h-full bg-[var(--db-brand)] rounded-full"
                  style={{ width: `${pillar.ratio}%` }}
                />
              </div>

              {/* Examples */}
              <div className="space-y-2">
                <p className="text-xs text-[var(--db-muted)]">예시</p>
                <div className="flex flex-wrap gap-2">
                  {pillar.examples.map((example, i) => (
                    <span key={i} className="px-2 py-1 bg-black/20 text-[var(--db-text)] text-xs rounded">
                      {example}
                    </span>
                  ))}
                </div>
              </div>

              {/* Channels */}
              <div className="mt-3">
                <p className="text-xs text-[var(--db-muted)] mb-1">적합한 채널</p>
                <div className="flex gap-2">
                  {pillar.channels.map((channel, i) => (
                    <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Template */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">주간 콘텐츠 템플릿</h3>
        </div>
        <div className="p-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-3 text-[var(--db-muted)]">요일</th>
                <th className="text-left py-2 px-3 text-[var(--db-muted)]">Instagram</th>
                <th className="text-left py-2 px-3 text-[var(--db-muted)]">TikTok</th>
                <th className="text-left py-2 px-3 text-[var(--db-muted)]">YouTube</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(MARKETING_STRATEGY.weeklyTemplate).map(([day, content]) => (
                <tr key={day} className="border-b border-white/5">
                  <td className="py-2 px-3 font-medium text-[var(--db-text)] capitalize">
                    {day === 'monday' ? '월' : day === 'tuesday' ? '화' : day === 'wednesday' ? '수' :
                     day === 'thursday' ? '목' : day === 'friday' ? '금' : day === 'saturday' ? '토' : '일'}
                  </td>
                  <td className="py-2 px-3 text-[var(--db-muted)]">{content.instagram || '-'}</td>
                  <td className="py-2 px-3 text-[var(--db-muted)]">{content.tiktok || '-'}</td>
                  <td className="py-2 px-3 text-[var(--db-muted)]">{content.youtube || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Phases Tab
// ============================================================================

function PhasesTab() {
  const phases = MARKETING_STRATEGY.phases;

  return (
    <div className="space-y-6">
      {phases.map((phase) => (
        <div key={phase.id} className="db-card">
          <div className="p-5 border-b border-white/10">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-[var(--db-text)]">{phase.title}</h3>
                <p className="text-sm text-[var(--db-muted)]">{phase.description}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--db-muted)]">기간</p>
                <p className="font-bold text-[var(--db-brand)]">{phase.timeframe}</p>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="flex-1 p-3 rounded-xl bg-emerald-500/10">
                <p className="text-xs text-emerald-400">목표</p>
                <p className="font-medium text-[var(--db-text)]">{phase.goal}</p>
              </div>
              <div className="flex-1 p-3 rounded-xl bg-amber-500/10">
                <p className="text-xs text-amber-400">예산</p>
                <p className="font-medium text-[var(--db-text)]">{phase.budget}</p>
              </div>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {phase.activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
              >
                <CheckCircle2
                  className={`w-5 h-5 ${
                    activity.status === 'done' ? 'text-emerald-400' :
                    activity.status === 'in-progress' ? 'text-amber-400' :
                    'text-[var(--db-muted)]'
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium text-[var(--db-text)]">{activity.name}</p>
                  <p className="text-xs text-[var(--db-muted)]">{activity.description}</p>
                </div>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                  {activity.channel}
                </span>
                <span className={`px-2 py-1 text-xs rounded ${
                  activity.priority === 'critical' ? 'bg-rose-500/20 text-rose-400' :
                  activity.priority === 'high' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {activity.priority === 'critical' ? '필수' : activity.priority === 'high' ? '높음' : '중간'}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// KPI Tab
// ============================================================================

function KPITab() {
  return (
    <div className="space-y-6">
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">마케팅 KPI</h3>
        </div>
        <div className="p-5 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--db-muted)]">지표</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-[var(--db-muted)]">Phase 1</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-[var(--db-muted)]">Phase 2</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-[var(--db-muted)]">Phase 3</th>
              </tr>
            </thead>
            <tbody>
              {MARKETING_STRATEGY.kpis.map((kpi) => (
                <tr key={kpi.id} className="border-b border-white/5">
                  <td className="py-3 px-4">
                    <span className="font-medium text-[var(--db-text)]">{kpi.name}</span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-blue-400">{kpi.phase1}</td>
                  <td className="py-3 px-4 text-center font-bold text-amber-400">{kpi.phase2}</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-400">{kpi.phase3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tools */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">추천 도구</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {MARKETING_STRATEGY.tools.map((category) => (
            <div key={category.category} className="p-4 rounded-xl bg-white/5">
              <h4 className="font-medium text-[var(--db-text)] mb-3">{category.category}</h4>
              <ul className="space-y-2">
                {category.tools.map((tool) => (
                  <li key={tool.name} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--db-text)]">{tool.name}</span>
                    <span className="text-xs text-[var(--db-muted)]">{tool.cost}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="db-card p-5 text-center">
          <p className="text-3xl font-black text-blue-400 mb-1">1K</p>
          <p className="text-sm font-medium text-[var(--db-text)]">Phase 1 목표</p>
          <p className="text-xs text-[var(--db-muted)]">월 방문자</p>
        </div>
        <div className="db-card p-5 text-center">
          <p className="text-3xl font-black text-amber-400 mb-1">10K</p>
          <p className="text-sm font-medium text-[var(--db-text)]">Phase 2 목표</p>
          <p className="text-xs text-[var(--db-muted)]">월 방문자</p>
        </div>
        <div className="db-card p-5 text-center">
          <p className="text-3xl font-black text-emerald-400 mb-1">100K</p>
          <p className="text-sm font-medium text-[var(--db-text)]">Phase 3 목표</p>
          <p className="text-xs text-[var(--db-muted)]">월 방문자</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Automation Tab
// ============================================================================

function AutomationTab() {
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* ROI Summary */}
      <div className="db-card p-5">
        <h3 className="font-semibold text-[var(--db-text)] mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          AI 자동화 ROI
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-emerald-500/10 text-center">
            <p className="text-2xl font-black text-emerald-400">{AUTOMATION_ROI.savings.time}</p>
            <p className="text-xs text-[var(--db-muted)]">시간 절감</p>
          </div>
          <div className="p-4 rounded-xl bg-blue-500/10 text-center">
            <p className="text-lg font-bold text-blue-400">{AUTOMATION_ROI.investment.monthlyCost}</p>
            <p className="text-xs text-[var(--db-muted)]">월 API 비용</p>
          </div>
          <div className="p-4 rounded-xl bg-purple-500/10 text-center">
            <p className="text-lg font-bold text-purple-400">{AUTOMATION_ROI.investment.setup}</p>
            <p className="text-xs text-[var(--db-muted)]">초기 셋업</p>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/10 text-center">
            <p className="text-lg font-bold text-amber-400">{AUTOMATION_ROI.investment.maintenance}</p>
            <p className="text-xs text-[var(--db-muted)]">주간 유지보수</p>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-xl bg-white/5 text-sm text-[var(--db-muted)]">
          <strong className="text-[var(--db-text)]">수동 대비:</strong> 월 {AUTOMATION_ROI.manualEffort.monthlyContent} → {AUTOMATION_ROI.automatedEffort.monthlyContent} (검수만)
        </div>
      </div>

      {/* Pipelines */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">자동화 파이프라인</h3>
          <p className="text-xs text-[var(--db-muted)]">앱 데이터 → AI → SNS 콘텐츠</p>
        </div>
        <div className="p-5 space-y-4">
          {AUTOMATION_PIPELINES.map((pipeline) => (
            <PipelineCard
              key={pipeline.id}
              pipeline={pipeline}
              isExpanded={selectedPipeline === pipeline.id}
              onToggle={() => setSelectedPipeline(selectedPipeline === pipeline.id ? null : pipeline.id)}
            />
          ))}
        </div>
      </div>

      {/* Templates */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">AI 프롬프트 템플릿</h3>
        </div>
        <div className="p-5 space-y-4">
          {CONTENT_TEMPLATES.slice(0, 3).map((template) => (
            <div key={template.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  template.type === 'image' ? 'bg-pink-500/20 text-pink-400' :
                  template.type === 'video' ? 'bg-purple-500/20 text-purple-400' :
                  template.type === 'carousel' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {template.type}
                </span>
                <h4 className="font-medium text-[var(--db-text)]">{template.name}</h4>
              </div>
              <div className="p-3 rounded-lg bg-black/30 text-xs text-[var(--db-muted)] font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                {template.prompt.slice(0, 200)}...
              </div>
              {template.example && (
                <div className="mt-2 p-2 rounded-lg bg-emerald-500/10 text-xs text-emerald-400">
                  예시: {template.example}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tools */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">자동화 도구 스택</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AUTOMATION_TOOLS.map((category) => (
            <div key={category.category} className="p-4 rounded-xl bg-white/5">
              <h4 className="font-medium text-[var(--db-text)] mb-3 flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400" />
                {category.category}
              </h4>
              <ul className="space-y-2">
                {category.tools.map((tool) => (
                  <li key={tool.name} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--db-text)]">{tool.name}</span>
                    <span className="text-xs text-[var(--db-muted)]">{tool.cost}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">자동화 구현 로드맵</h3>
        </div>
        <div className="p-5">
          <div className="relative">
            {AUTOMATION_ROADMAP.map((phase, index) => (
              <div key={phase.phase} className="flex gap-4 pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-emerald-500 text-white' :
                    index === 1 ? 'bg-amber-500 text-white' :
                    'bg-purple-500 text-white'
                  }`}>
                    {phase.phase}
                  </div>
                  {index < AUTOMATION_ROADMAP.length - 1 && (
                    <div className="w-0.5 flex-1 bg-white/10 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-[var(--db-text)]">{phase.title}</h4>
                    <span className="px-2 py-0.5 bg-white/10 text-[var(--db-muted)] text-xs rounded">
                      {phase.timeline}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {phase.items.map((item, i) => (
                      <li key={i} className="text-sm text-[var(--db-muted)] flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PipelineCard({
  pipeline,
  isExpanded,
  onToggle,
}: {
  pipeline: AutomationPipeline;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const levelColors = {
    full: 'bg-emerald-500/20 text-emerald-400',
    semi: 'bg-amber-500/20 text-amber-400',
    assisted: 'bg-blue-500/20 text-blue-400',
  };

  const levelLabels = {
    full: '완전 자동화',
    semi: '반자동화',
    assisted: '보조 자동화',
  };

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-start gap-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <Bot className="w-5 h-5 text-purple-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-[var(--db-text)]">{pipeline.name}</h4>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${levelColors[pipeline.automationLevel]}`}>
              {levelLabels[pipeline.automationLevel]}
            </span>
          </div>
          <p className="text-sm text-[var(--db-muted)]">{pipeline.description}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-[var(--db-muted)]">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {pipeline.frequency}
            </span>
            <span>{pipeline.channels.join(', ')}</span>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 text-[var(--db-muted)] transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/10 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[var(--db-muted)] mb-2">데이터 소스</p>
              <p className="text-sm text-[var(--db-text)]">{pipeline.source}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--db-muted)] mb-2">생성 콘텐츠</p>
              <div className="flex flex-wrap gap-1">
                {pipeline.output.map((out, i) => (
                  <span key={i} className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">
                    {out}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs text-[var(--db-muted)] mb-2">구현 단계</p>
            <ul className="space-y-1">
              {pipeline.implementation.map((step, i) => (
                <li key={i} className="text-sm text-[var(--db-muted)] flex items-start gap-2">
                  <span className="text-purple-400 font-bold">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs text-[var(--db-muted)] mb-2">사용 도구</p>
            <div className="flex flex-wrap gap-2">
              {pipeline.tools.map((tool, i) => (
                <span key={i} className="px-2 py-1 bg-white/10 text-[var(--db-text)] text-xs rounded">
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {pipeline.example && (
            <div className="p-3 rounded-lg bg-emerald-500/10">
              <p className="text-xs text-emerald-400 mb-1">예시 결과물</p>
              <p className="text-sm text-[var(--db-text)]">{pipeline.example}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
