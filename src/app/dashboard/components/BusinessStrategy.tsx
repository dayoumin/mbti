'use client';

import { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  BarChart3,
  Youtube,
  Instagram,
  Twitter,
  FileText,
  Calendar,
  Target,
  Zap,
  ArrowRight,
  CheckCircle2,
  Clock,
  Lightbulb,
  Handshake,
  PieChart,
  Video,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import {
  BUSINESS_STRATEGY,
  BUSINESS_PHASES,
  RANKING_CONTENT_STRATEGY,
  PLATFORM_STRATEGY,
  CONTENT_CALENDAR,
  REVENUE_MODELS,
  PARTNERSHIP_OPPORTUNITIES,
  DATA_ASSETS,
  TREND_REPORTS,
  PREMIUM_PLANS,
  VALUE_CHAIN,
  CARE_APP_ECOSYSTEM,
  TEST_TO_CARE_FLOW,
  CARE_APP_REVENUE,
  type ContentPlatform,
  type BusinessPhase,
  type RankingContent,
  type CareAppStrategy,
} from '../data/business-strategy';

// ============================================================================
// Sub-components
// ============================================================================

// 가치 사슬 시각화
function ValueChainSection() {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-indigo-600" />
        핵심 가치 사슬
      </h3>
      <p className="text-sm text-slate-600 mb-6 italic">
        &quot;{VALUE_CHAIN.coreInsight}&quot;
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {VALUE_CHAIN.flow.map((step, idx) => (
          <div key={step.step} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-slate-50 shadow-md flex items-center justify-center text-2xl">
                {step.icon}
              </div>
              <span className="text-xs font-medium text-slate-700 mt-1">{step.name}</span>
              <span className="text-[10px] text-slate-500 max-w-[80px] text-center">{step.description}</span>
            </div>
            {idx < VALUE_CHAIN.flow.length - 1 && (
              <ArrowRight className="w-5 h-5 text-indigo-400" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 비즈니스 로드맵
function RoadmapSection() {
  const [expandedPhase, setExpandedPhase] = useState<string | null>('phase-1');

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-blue-600" />
        비즈니스 로드맵
      </h3>
      <div className="space-y-3">
        {BUSINESS_PHASES.map((phase) => (
          <div
            key={phase.id}
            className="border border-slate-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{phase.icon}</span>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{phase.phase}</span>
                    <span className="text-slate-600">- {phase.name}</span>
                  </div>
                  <span className="text-xs text-slate-500">{phase.duration}</span>
                </div>
              </div>
              {expandedPhase === phase.id ? (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-400" />
              )}
            </button>
            {expandedPhase === phase.id && (
              <div className="px-4 pb-4 border-t border-slate-100">
                {/* Goals */}
                <div className="mt-3">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">목표</h4>
                  <ul className="space-y-1">
                    {phase.goals.map((goal, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Items */}
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">세부 항목</h4>
                  <div className="grid gap-2">
                    {phase.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg"
                      >
                        <span className={`text-xs px-2 py-0.5 rounded ${item.priority === 'high' ? 'bg-red-100 text-red-700' :
                          item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                          {item.priority === 'high' ? '높음' : item.priority === 'medium' ? '중간' : '낮음'}
                        </span>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-slate-800">{item.title}</span>
                          <p className="text-xs text-slate-500">{item.description}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded ${item.status === 'done' ? 'bg-green-100 text-green-700' :
                          item.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                          {item.status === 'done' ? '완료' : item.status === 'in-progress' ? '진행중' : '예정'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* KPIs */}
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">핵심 지표 (KPI)</h4>
                  <div className="flex flex-wrap gap-2">
                    {phase.kpis.map((kpi, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded">
                        {kpi}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 수익 모델
function RevenueModelsSection() {
  const groupedModels = {
    b2c: REVENUE_MODELS.filter(m => m.type === 'b2c'),
    b2b: REVENUE_MODELS.filter(m => m.type === 'b2b'),
    partnership: REVENUE_MODELS.filter(m => m.type === 'partnership'),
    creator: REVENUE_MODELS.filter(m => m.type === 'creator'),
  };

  const typeLabels = {
    b2c: { label: 'B2C (개인)', icon: <Users className="w-4 h-4" />, color: 'bg-blue-50 text-blue-700' },
    b2b: { label: 'B2B (기업)', icon: <BarChart3 className="w-4 h-4" />, color: 'bg-green-50 text-green-700' },
    partnership: { label: '제휴', icon: <Handshake className="w-4 h-4" />, color: 'bg-purple-50 text-purple-700' },
    creator: { label: '크리에이터', icon: <Video className="w-4 h-4" />, color: 'bg-orange-50 text-orange-700' },
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-green-600" />
        수익 모델
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {(Object.keys(groupedModels) as Array<keyof typeof groupedModels>).map((type) => (
          <div key={type} className="border border-slate-200 rounded-lg p-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-3 ${typeLabels[type].color}`}>
              {typeLabels[type].icon}
              {typeLabels[type].label}
            </div>
            <div className="space-y-3">
              {groupedModels[type].map((model) => (
                <div key={model.id} className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-medium text-slate-800">{model.name}</span>
                    <span className="text-xs text-slate-500">{model.timeline}</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">{model.description}</p>
                  <div className="text-sm font-semibold text-green-600">{model.estimatedRevenue}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 제휴 마케팅
function PartnershipsSection() {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Handshake className="w-5 h-5 text-purple-600" />
        제휴 마케팅 매칭
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 px-3 font-medium text-slate-600">테스트</th>
              <th className="text-left py-2 px-3 font-medium text-slate-600">카테고리</th>
              <th className="text-left py-2 px-3 font-medium text-slate-600">제휴 예시</th>
              <th className="text-left py-2 px-3 font-medium text-slate-600">수익 모델</th>
            </tr>
          </thead>
          <tbody>
            {PARTNERSHIP_OPPORTUNITIES.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-2 px-3 font-medium text-slate-800">{p.testType}</td>
                <td className="py-2 px-3 text-slate-600">{p.category}</td>
                <td className="py-2 px-3">
                  <div className="flex flex-wrap gap-1">
                    {p.examples.slice(0, 3).map((ex, idx) => (
                      <span key={idx} className="text-xs bg-slate-100 px-2 py-0.5 rounded">{ex}</span>
                    ))}
                    {p.examples.length > 3 && (
                      <span className="text-xs text-slate-400">+{p.examples.length - 3}</span>
                    )}
                  </div>
                </td>
                <td className="py-2 px-3 text-xs text-green-600">{p.revenueModel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 랭킹 콘텐츠화 전략
function RankingContentSection() {
  const [selectedPlatform, setSelectedPlatform] = useState<ContentPlatform | 'all'>('all');

  const platformIcons: Record<ContentPlatform, React.ReactNode> = {
    youtube: <Youtube className="w-4 h-4 text-red-500" />,
    instagram: <Instagram className="w-4 h-4 text-pink-500" />,
    tiktok: <Video className="w-4 h-4 text-gray-800" />,
    twitter: <Twitter className="w-4 h-4 text-blue-400" />,
    blog: <FileText className="w-4 h-4 text-gray-600" />,
  };

  const filteredContent = selectedPlatform === 'all'
    ? RANKING_CONTENT_STRATEGY
    : RANKING_CONTENT_STRATEGY.filter(c => c.platforms.includes(selectedPlatform));

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-red-500" />
        랭킹 콘텐츠화 전략 (SNS 바이럴)
      </h3>

      {/* Platform Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setSelectedPlatform('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedPlatform === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
        >
          전체
        </button>
        {(Object.keys(PLATFORM_STRATEGY) as ContentPlatform[]).map((platform) => (
          <button
            key={platform}
            onClick={() => setSelectedPlatform(platform)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedPlatform === platform ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
          >
            {platformIcons[platform]}
            {PLATFORM_STRATEGY[platform].name}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContent.map((content) => (
          <div key={content.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <span className={`text-xs px-2 py-0.5 rounded ${content.type === 'ranking' ? 'bg-blue-100 text-blue-700' :
                content.type === 'battle' ? 'bg-red-100 text-red-700' :
                  content.type === 'trend' ? 'bg-green-100 text-green-700' :
                    'bg-purple-100 text-purple-700'
                }`}>
                {content.type === 'ranking' ? '랭킹' :
                  content.type === 'battle' ? '대결' :
                    content.type === 'trend' ? '트렌드' : '비교'}
              </span>
              <div className="flex gap-1">
                {content.platforms.map((p) => (
                  <span key={p}>{platformIcons[p]}</span>
                ))}
              </div>
            </div>
            <h4 className="font-semibold text-slate-800 mb-1">{content.title}</h4>
            <p className="text-xs text-slate-600 mb-3">{content.description}</p>

            {/* Examples */}
            <div className="space-y-1 mb-3">
              {content.examples.slice(0, 2).map((ex, idx) => (
                <p key={idx} className="text-xs text-gray-500 italic">&quot;{ex}&quot;</p>
              ))}
            </div>

            {/* Hooks */}
            <div className="flex flex-wrap gap-1 mb-3">
              {content.hooks.slice(0, 2).map((hook, idx) => (
                <span key={idx} className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded">
                  {hook}
                </span>
              ))}
            </div>

            {/* Meta */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {content.frequency}
              </span>
              <div className="flex items-center gap-2">
                <span title="바이럴 잠재력">
                  {'🔥'.repeat(content.viralPotential)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 플랫폼별 전략
function PlatformStrategySection() {
  const platformIcons: Record<ContentPlatform, React.ReactNode> = {
    youtube: <Youtube className="w-5 h-5 text-red-500" />,
    instagram: <Instagram className="w-5 h-5 text-pink-500" />,
    tiktok: <Video className="w-5 h-5 text-gray-800" />,
    twitter: <Twitter className="w-5 h-5 text-blue-400" />,
    blog: <FileText className="w-5 h-5 text-gray-600" />,
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Video className="w-5 h-5 text-pink-500" />
        플랫폼별 전략
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.keys(PLATFORM_STRATEGY) as ContentPlatform[]).map((platform) => {
          const strategy = PLATFORM_STRATEGY[platform];
          return (
            <div key={platform} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                {platformIcons[platform]}
                <span className="font-semibold text-slate-800">{strategy.name}</span>
              </div>
              <div className="text-xs text-slate-600 mb-3">
                <span className="font-medium">포맷:</span> {strategy.format}
              </div>
              <div className="mb-3">
                <span className="text-xs font-medium text-slate-500">베스트 콘텐츠:</span>
                <ul className="mt-1 space-y-1">
                  {strategy.bestContent.map((c, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-xs text-slate-500 mb-3">
                <span className="font-medium">빈도:</span> {strategy.frequency}
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">팁:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {strategy.tips.map((tip, idx) => (
                    <span key={idx} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                      {tip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 콘텐츠 캘린더
function ContentCalendarSection() {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-500" />
        콘텐츠 제작 캘린더
      </h3>
      <div className="grid md:grid-cols-3 gap-4">
        {/* Daily */}
        <div className="border border-slate-200 rounded-lg p-4">
          <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            일간
          </h4>
          <div className="space-y-2">
            {CONTENT_CALENDAR.daily.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-xs font-medium text-slate-500 w-16 shrink-0">{item.time}</span>
                <span className="text-sm text-slate-700">{item.content}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly */}
        <div className="border border-slate-200 rounded-lg p-4">
          <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            주간
          </h4>
          <div className="space-y-2">
            {CONTENT_CALENDAR.weekly.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-xs font-medium text-slate-500 w-16 shrink-0">{item.day}</span>
                <span className="text-sm text-slate-700">{item.content}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly */}
        <div className="border border-slate-200 rounded-lg p-4">
          <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            월간
          </h4>
          <div className="space-y-2">
            {CONTENT_CALENDAR.monthly.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-xs font-medium text-slate-500 w-16 shrink-0">{item.timing}</span>
                <span className="text-sm text-slate-700">{item.content}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 데이터 자산
function DataAssetsSection() {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <PieChart className="w-5 h-5 text-indigo-500" />
        데이터 자산
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 px-3 font-medium text-slate-600">데이터</th>
              <th className="text-left py-2 px-3 font-medium text-slate-600">수집 시점</th>
              <th className="text-left py-2 px-3 font-medium text-slate-600">비즈니스 활용</th>
              <th className="text-left py-2 px-3 font-medium text-slate-600">분석 주기</th>
            </tr>
          </thead>
          <tbody>
            {DATA_ASSETS.map((asset) => (
              <tr key={asset.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-2 px-3">
                  <div className="font-medium text-slate-800">{asset.name}</div>
                  <div className="text-xs text-slate-500">{asset.description}</div>
                </td>
                <td className="py-2 px-3 text-slate-600">{asset.collectAt}</td>
                <td className="py-2 px-3">
                  <div className="flex flex-wrap gap-1">
                    {asset.businessUse.map((use, idx) => (
                      <span key={idx} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">
                        {use}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-2 px-3">
                  <div className="flex flex-wrap gap-1">
                    {asset.period.map((p, idx) => (
                      <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                        {p === 'daily' ? '일간' :
                          p === 'weekly' ? '주간' :
                            p === 'monthly' ? '월간' :
                              p === 'quarterly' ? '분기' : '연간'}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 트렌드 리포트 상품
function TrendReportsSection() {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-green-500" />
        트렌드 리포트 상품
      </h3>
      <div className="grid md:grid-cols-3 gap-4">
        {TREND_REPORTS.map((report) => (
          <div key={report.id} className={`border rounded-lg p-4 ${report.pricing ? 'border-green-200 bg-green-50' : 'border-slate-200'
            }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs px-2 py-0.5 rounded ${report.period === 'monthly' ? 'bg-blue-100 text-blue-700' :
                report.period === 'quarterly' ? 'bg-purple-100 text-purple-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                {report.period === 'monthly' ? '월간' :
                  report.period === 'quarterly' ? '분기' : '연간'}
              </span>
              {report.pricing && (
                <span className="text-xs font-semibold text-green-600">B2B</span>
              )}
            </div>
            <h4 className="font-semibold text-slate-800 mb-2">{report.name}</h4>
            <p className="text-xs text-slate-600 mb-3">{report.description}</p>
            <ul className="space-y-1 mb-3">
              {report.contents.map((c, idx) => (
                <li key={idx} className="text-xs text-slate-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  {c}
                </li>
              ))}
            </ul>
            <div className="pt-2 border-t border-slate-200">
              <div className="text-xs text-slate-500">{report.targetAudience}</div>
              {report.pricing && (
                <div className="text-sm font-bold text-green-600 mt-1">{report.pricing}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 프리미엄 구독
function PremiumPlansSection() {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        프리미엄 구독 상품
      </h3>
      <div className="grid md:grid-cols-2 gap-6">
        {(Object.keys(PREMIUM_PLANS) as Array<keyof typeof PREMIUM_PLANS>).map((key) => {
          const plan = PREMIUM_PLANS[key];
          return (
            <div key={key} className={`border rounded-xl p-6 ${key === 'pro' ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200'
              }`}>
              {key === 'pro' && (
                <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full mb-2 inline-block">
                  추천
                </span>
              )}
              <h4 className="text-xl font-bold text-slate-800">{plan.name}</h4>
              <div className="text-2xl font-bold text-slate-900 mt-2 mb-4">{plan.price}</div>
              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 케어앱 생태계
function CareAppEcosystemSection() {
  const [selectedApp, setSelectedApp] = useState<string>('pet-dog');

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="text-xl">🏠</span>
        관리앱 생태계
      </h3>

      {/* 테스트 → 케어 연결 플로우 */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 mb-6">
        <h4 className="font-semibold text-slate-800 mb-3">{TEST_TO_CARE_FLOW.description}</h4>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {TEST_TO_CARE_FLOW.flow.map((step, idx) => (
            <div key={step.step} className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-slate-50 shadow flex items-center justify-center text-sm font-bold text-green-600">
                  {step.step}
                </div>
                <span className="text-xs font-medium text-slate-700 mt-1">{step.action}</span>
                <span className="text-[10px] text-slate-500">{step.detail}</span>
              </div>
              {idx < TEST_TO_CARE_FLOW.flow.length - 1 && (
                <ArrowRight className="w-4 h-4 text-green-400" />
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {TEST_TO_CARE_FLOW.conversionTips.map((tip, idx) => (
            <span key={idx} className="text-xs bg-slate-50 text-green-700 px-2 py-1 rounded-full">
              💡 {tip}
            </span>
          ))}
        </div>
      </div>

      {/* 앱별 선택 탭 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CARE_APP_ECOSYSTEM.map((app) => (
          <button
            key={app.id}
            onClick={() => setSelectedApp(app.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedApp === app.id
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            <span>{app.emoji}</span>
            {app.name}
          </button>
        ))}
      </div>

      {/* 선택된 앱 상세 */}
      {CARE_APP_ECOSYSTEM.filter(app => app.id === selectedApp).map((app) => (
        <div key={app.id} className="border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{app.emoji}</span>
            <div>
              <h4 className="text-lg font-bold text-slate-800">{app.name}</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {app.linkedTests.map((test) => (
                  <span key={test} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                    {test}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {/* 핵심 기능 */}
            <div>
              <h5 className="text-sm font-semibold text-slate-700 mb-2">핵심 기능 (무료)</h5>
              <ul className="space-y-1">
                {app.coreFeatures.map((f, idx) => (
                  <li key={idx} className="text-sm text-slate-600 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            {/* 프리미엄 기능 */}
            <div>
              <h5 className="text-sm font-semibold text-slate-700 mb-2">프리미엄 기능</h5>
              <ul className="space-y-1">
                {app.premiumFeatures.map((f, idx) => (
                  <li key={idx} className="text-sm text-slate-600 flex items-center gap-2">
                    <span className="text-yellow-500">⭐</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 제휴 파트너 */}
          <div className="mb-4">
            <h5 className="text-sm font-semibold text-slate-700 mb-2">제휴 파트너십</h5>
            <div className="flex flex-wrap gap-2">
              {app.partnerships.map((p, idx) => (
                <span key={idx} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* 사용자 여정 */}
          <div>
            <h5 className="text-sm font-semibold text-gray-700 mb-2">사용자 여정</h5>
            <div className="flex flex-wrap gap-2">
              {app.userJourney.map((step, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                    {idx + 1}. {step}
                  </span>
                  {idx < app.userJourney.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* 케어앱 수익 모델 */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="border border-slate-200 rounded-lg p-4">
          <h5 className="font-semibold text-slate-800 mb-2">💰 프리미엄 구독</h5>
          <div className="text-lg font-bold text-green-600 mb-2">{CARE_APP_REVENUE.freemium.premium.price}</div>
          <ul className="space-y-1">
            {CARE_APP_REVENUE.freemium.premium.features.map((f, idx) => (
              <li key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-slate-200 rounded-lg p-4">
          <h5 className="font-semibold text-slate-800 mb-2">🛒 제휴 마케팅</h5>
          <p className="text-xs text-slate-600 mb-2">{CARE_APP_REVENUE.affiliate.description}</p>
          <div className="text-sm font-bold text-purple-600 mb-2">{CARE_APP_REVENUE.affiliate.commission}</div>
          <ul className="space-y-1">
            {CARE_APP_REVENUE.affiliate.examples.map((ex, idx) => (
              <li key={idx} className="text-xs text-gray-500">• {ex}</li>
            ))}
          </ul>
        </div>
        <div className="border border-slate-200 rounded-lg p-4">
          <h5 className="font-semibold text-slate-800 mb-2">👨‍⚕️ 전문가 연결</h5>
          <p className="text-xs text-slate-600 mb-2">{CARE_APP_REVENUE.expertConnection.description}</p>
          <div className="text-sm font-bold text-blue-600 mb-2">{CARE_APP_REVENUE.expertConnection.commission}</div>
          <div className="flex flex-wrap gap-1">
            {CARE_APP_REVENUE.expertConnection.types.map((t, idx) => (
              <span key={idx} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

type TabKey = 'roadmap' | 'revenue' | 'ranking' | 'data' | 'careApp';

export default function BusinessStrategy() {
  const [activeTab, setActiveTab] = useState<TabKey>('roadmap');

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'roadmap', label: '로드맵', icon: <Target className="w-4 h-4" /> },
    { key: 'revenue', label: '수익 모델', icon: <DollarSign className="w-4 h-4" /> },
    { key: 'ranking', label: '랭킹 콘텐츠', icon: <TrendingUp className="w-4 h-4" /> },
    { key: 'data', label: '데이터 자산', icon: <PieChart className="w-4 h-4" /> },
    { key: 'careApp', label: '관리앱', icon: <span>🏠</span> },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">비즈니스 전략</h2>
        <p className="text-slate-600">
          테스트 → 데이터 축적 → 랭킹/트렌드 → 수익화 가치 사슬
        </p>
      </div>

      {/* Value Chain */}
      <ValueChainSection />

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.key
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'roadmap' && (
        <>
          <RoadmapSection />
        </>
      )}

      {activeTab === 'revenue' && (
        <>
          <RevenueModelsSection />
          <PartnershipsSection />
          <PremiumPlansSection />
        </>
      )}

      {activeTab === 'ranking' && (
        <>
          <RankingContentSection />
          <PlatformStrategySection />
          <ContentCalendarSection />
        </>
      )}

      {activeTab === 'data' && (
        <>
          <DataAssetsSection />
          <TrendReportsSection />
        </>
      )}

      {activeTab === 'careApp' && (
        <>
          <CareAppEcosystemSection />
        </>
      )}
    </div>
  );
}