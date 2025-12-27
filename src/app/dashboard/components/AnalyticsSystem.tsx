'use client';

import { useState } from 'react';
import {
  BarChart3,
  Target,
  TrendingUp,
  Zap,
  CheckCircle2,
  Clock,
  AlertCircle,
  Activity,
  Eye,
  MousePointer,
  Share2,
  Users,
  RefreshCw,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import {
  TRACKING_EVENTS,
  KPIS,
  ANALYTICS_ROADMAP,
  GA_COMPARISON,
  RECOMMENDATIONS,
  type TrackingEvent,
  type KPI,
  type GAComparison,
  type Recommendation,
} from '../data/analytics-system';

type Tab = 'overview' | 'events' | 'kpis' | 'ga' | 'roadmap';

// 상태별 스타일
const STATUS_STYLES = {
  done: { bg: 'bg-green-100', text: 'text-green-700', label: '완료' },
  in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', label: '진행중' },
  planned: { bg: 'bg-gray-100', text: 'text-gray-600', label: '예정' },
  blocked: { bg: 'bg-red-100', text: 'text-red-700', label: '차단됨' },
};

// 우선순위 스타일
const PRIORITY_STYLES = {
  high: { bg: 'bg-red-100', text: 'text-red-700' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  low: { bg: 'bg-gray-100', text: 'text-gray-600' },
};

// 카테고리 아이콘
const CATEGORY_ICONS = {
  acquisition: <Users className="w-4 h-4" />,
  engagement: <Activity className="w-4 h-4" />,
  retention: <RefreshCw className="w-4 h-4" />,
  viral: <Sparkles className="w-4 h-4" />,
};

// 이벤트 타입 아이콘
const EVENT_ICONS: Record<string, React.ReactNode> = {
  test: <Target className="w-4 h-4" />,
  next_action: <MousePointer className="w-4 h-4" />,
  content: <Eye className="w-4 h-4" />,
  share: <Share2 className="w-4 h-4" />,
  acquisition: <Users className="w-4 h-4" />,
};

export default function AnalyticsSystem() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // 통계 계산
  const implementedEvents = TRACKING_EVENTS.filter(e => e.implemented).length;
  const totalEvents = TRACKING_EVENTS.length;
  const implementedKPIs = KPIS.filter(k => k.implemented).length;
  const totalKPIs = KPIS.length;

  const donePhases = ANALYTICS_ROADMAP.filter(p => p.status === 'done').length;
  const totalPhases = ANALYTICS_ROADMAP.length;

  const tabs = [
    { key: 'overview' as Tab, label: '개요', icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'events' as Tab, label: '추적 이벤트', icon: <Activity className="w-4 h-4" /> },
    { key: 'kpis' as Tab, label: 'KPIs', icon: <Target className="w-4 h-4" /> },
    { key: 'ga' as Tab, label: 'GA4 비교', icon: <TrendingUp className="w-4 h-4" /> },
    { key: 'roadmap' as Tab, label: '로드맵', icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          분석/추적 시스템
        </h2>
        <p className="text-gray-600 mt-1">
          사용자 행동 추적, 핵심 지표, Google Analytics 연동 계획
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-t-lg flex items-center gap-2 transition-colors ${activeTab === tab.key
                ? 'bg-indigo-100 text-indigo-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* 개요 탭 */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 현황 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Activity className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900">추적 이벤트</h3>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-indigo-600">{implementedEvents}</span>
                <span className="text-gray-500 mb-1">/ {totalEvents} 구현</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${(implementedEvents / totalEvents) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-50 border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">KPI 측정</h3>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-green-600">{implementedKPIs}</span>
                <span className="text-gray-500 mb-1">/ {totalKPIs} 가능</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(implementedKPIs / totalKPIs) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-50 border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">로드맵 진행</h3>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-purple-600">{donePhases}</span>
                <span className="text-gray-500 mb-1">/ {totalPhases} Phase</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${(donePhases / totalPhases) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* 현재 상태 */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
            <h3 className="font-semibold text-indigo-900 mb-3">현재 구현 상태</h3>
            <div className="space-y-2 text-sm text-indigo-800">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                <span><strong>AnalyticsService</strong> 구현 완료 - Supabase + localStorage 폴백</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                <span>기본 이벤트 추적: test_start, test_complete, recommendation_view/click, share_click</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Rate limiting (100/분), 배치 처리 (1초, 10개씩) 구현</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <span>UTM 추적, 세션 관리, 퍼널 분석은 아직 미구현</span>
              </div>
            </div>
          </div>

          {/* 권장 사항 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">다음 단계 권장</h3>
            <div className="space-y-3">
              {RECOMMENDATIONS.slice(0, 3).map(rec => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 추적 이벤트 탭 */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            현재 추적 중인 이벤트와 측정 가능한 지표
          </div>

          {/* 이벤트 타입별 그룹 */}
          {['test', 'next_action', 'content', 'share', 'acquisition'].map(type => {
            const events = TRACKING_EVENTS.filter(e => e.type === type);
            if (events.length === 0) return null;

            return (
              <div key={type} className="bg-slate-50 border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                  {EVENT_ICONS[type]}
                  <span className="font-medium text-gray-900 capitalize">{type.replace('_', ' ')}</span>
                  <span className="text-sm text-gray-500">
                    ({events.filter(e => e.implemented).length}/{events.length})
                  </span>
                </div>
                <div className="divide-y divide-gray-100">
                  {events.map(event => (
                    <EventRow key={event.id} event={event} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* KPIs 탭 */}
      {activeTab === 'kpis' && (
        <div className="space-y-6">
          {(['acquisition', 'engagement', 'retention', 'viral'] as const).map(category => {
            const kpis = KPIS.filter(k => k.category === category);

            return (
              <div key={category}>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  {CATEGORY_ICONS[category]}
                  {category === 'acquisition' && '획득 (Acquisition)'}
                  {category === 'engagement' && '참여 (Engagement)'}
                  {category === 'retention' && '유지 (Retention)'}
                  {category === 'viral' && '바이럴 (Viral)'}
                </h3>
                <div className="grid gap-3">
                  {kpis.map(kpi => (
                    <KPICard key={kpi.id} kpi={kpi} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* GA4 비교 탭 */}
      {activeTab === 'ga' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h3 className="font-semibold text-blue-900 mb-2">Google Analytics 4 연동 권장</h3>
            <p className="text-sm text-blue-800">
              GA4는 트래픽, 유입 경로 분석에 탁월합니다. 자체 시스템과 병행 사용을 권장합니다.
            </p>
            <a
              href="https://analytics.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-sm text-blue-700 hover:text-blue-800"
            >
              GA4 설정하기 <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="bg-slate-50 border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">기능</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">GA4</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">자체 시스템</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">권장</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {GA_COMPARISON.map(item => (
                  <GAComparisonRow key={item.feature} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 로드맵 탭 */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          {ANALYTICS_ROADMAP.map(phase => (
            <div key={phase.id} className="bg-slate-50 border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[phase.status].bg
                    } ${STATUS_STYLES[phase.status].text}`}>
                    {STATUS_STYLES[phase.status].label}
                  </span>
                  <span className="font-semibold text-gray-900">{phase.name}</span>
                </div>
                <span className="text-sm text-gray-500">{phase.description}</span>
              </div>
              <div className="divide-y divide-gray-100">
                {phase.tasks.map(task => (
                  <div key={task.id} className="px-4 py-3 flex items-start gap-3">
                    <span className={`mt-0.5 px-2 py-0.5 rounded text-xs ${STATUS_STYLES[task.status].bg
                      } ${STATUS_STYLES[task.status].text}`}>
                      {STATUS_STYLES[task.status].label}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{task.task}</span>
                        <span className={`px-1.5 py-0.5 rounded text-xs ${PRIORITY_STYLES[task.priority].bg
                          } ${PRIORITY_STYLES[task.priority].text}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{task.description}</p>
                      {task.dependencies.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          의존: {task.dependencies.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 이벤트 행 컴포넌트
function EventRow({ event }: { event: TrackingEvent }) {
  return (
    <div className="px-4 py-3 flex items-start gap-3">
      <span className={`mt-1 w-2 h-2 rounded-full ${event.implemented ? 'bg-green-500' : 'bg-gray-300'
        }`} />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{event.name}</span>
          <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
            {event.id}
          </code>
          {!event.implemented && (
            <span className={`px-1.5 py-0.5 rounded text-xs ${PRIORITY_STYLES[event.priority].bg
              } ${PRIORITY_STYLES[event.priority].text}`}>
              {event.priority}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-0.5">{event.description}</p>
        <div className="flex gap-2 mt-1.5">
          {event.metrics.map(metric => (
            <span key={metric} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
              {metric}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// KPI 카드 컴포넌트
function KPICard({ kpi }: { kpi: KPI }) {
  return (
    <div className="bg-slate-50 border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${kpi.implemented ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            <h4 className="font-medium text-gray-900">{kpi.name}</h4>
          </div>
          <p className="text-sm text-gray-600 mt-1">{kpi.description}</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-indigo-600">{kpi.target}</div>
          <div className="text-xs text-gray-500">목표</div>
        </div>
      </div>
      <div className="mt-3 p-2 bg-gray-50 rounded text-xs font-mono text-gray-600">
        {kpi.formula}
      </div>
    </div>
  );
}

// GA 비교 행 컴포넌트
function GAComparisonRow({ item }: { item: GAComparison }) {
  return (
    <tr>
      <td className="px-4 py-3 font-medium text-gray-900">{item.feature}</td>
      <td className="px-4 py-3 text-gray-600">{item.googleAnalytics}</td>
      <td className="px-4 py-3 text-gray-600">{item.ourSystem}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${item.recommendation === 'ga' ? 'bg-blue-100 text-blue-700' :
              item.recommendation === 'our' ? 'bg-green-100 text-green-700' :
                'bg-purple-100 text-purple-700'
            }`}>
            {item.recommendation === 'ga' ? 'GA4' :
              item.recommendation === 'our' ? '자체' : '둘 다'}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">{item.reason}</p>
      </td>
    </tr>
  );
}

// 권장 사항 카드
function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  return (
    <div className="bg-slate-50 border border-gray-200 rounded-lg p-4 flex items-start gap-3">
      <div className={`p-2 rounded-lg ${recommendation.priority === 'high' ? 'bg-red-100' :
          recommendation.priority === 'medium' ? 'bg-yellow-100' : 'bg-gray-100'
        }`}>
        <Zap className={`w-4 h-4 ${recommendation.priority === 'high' ? 'text-red-600' :
            recommendation.priority === 'medium' ? 'text-yellow-600' : 'text-gray-600'
          }`} />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{recommendation.title}</h4>
        <p className="text-sm text-gray-600 mt-0.5">{recommendation.description}</p>
        <div className="flex gap-3 mt-2 text-xs text-gray-500">
          <span>난이도: {recommendation.effort}</span>
          <span>효과: {recommendation.impact}</span>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </div>
  );
}
