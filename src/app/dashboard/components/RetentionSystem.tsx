'use client';

import { useState } from 'react';
import {
  RETENTION_SYSTEM,
  RETENTION_ROADMAP,
  CURRENT_STATE_ANALYSIS,
  RETENTION_METRICS,
  type EndpointAnalysis,
  type RetentionRoadmapPhase,
} from '../data/retention-system';

// ============================================================================
// 상태 뱃지 컴포넌트
// ============================================================================

const StatusBadge = ({ status }: { status: 'done' | 'in_progress' | 'planned' | 'good' | 'needs_improvement' | 'missing' }) => {
  const styles: Record<string, string> = {
    done: 'bg-green-100 text-green-700',
    in_progress: 'bg-amber-100 text-amber-700',
    planned: 'bg-slate-100 text-slate-600',
    good: 'bg-green-100 text-green-700',
    needs_improvement: 'bg-amber-100 text-amber-700',
    missing: 'bg-red-100 text-red-700',
  };

  const labels: Record<string, string> = {
    done: '완료',
    in_progress: '진행 중',
    planned: '계획됨',
    good: '양호',
    needs_improvement: '개선 필요',
    missing: '미구현',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

// ============================================================================
// 우선순위 뱃지 컴포넌트
// ============================================================================

const PriorityBadge = ({ priority }: { priority: 'high' | 'medium' | 'low' }) => {
  const styles: Record<string, string> = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-slate-100 text-slate-600',
  };

  const labels: Record<string, string> = {
    high: '높음',
    medium: '보통',
    low: '낮음',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${styles[priority]}`}>
      {labels[priority]}
    </span>
  );
};

// ============================================================================
// 현재 상태 분석 섹션
// ============================================================================

const CurrentStateSection = () => {
  const analysis = CURRENT_STATE_ANALYSIS;

  const getEndpointLabel = (endpoint: string) => {
    const labels: Record<string, string> = {
      test_result: '테스트 결과',
      quiz_result: '퀴즈 결과',
      poll_result: '투표 결과',
      community_view: '커뮤니티',
      ranking_view: '랭킹',
      profile_view: '프로필',
    };
    return labels[endpoint] || endpoint;
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-800 flex items-center gap-2">
        <span className="text-lg">📊</span> 현재 상태 분석
      </h3>

      <div className="grid gap-3">
        {analysis.map((item) => (
          <div
            key={item.endpoint}
            className={`p-4 rounded-xl border ${
              item.currentStatus === 'missing'
                ? 'bg-red-50 border-red-200'
                : item.currentStatus === 'needs_improvement'
                ? 'bg-amber-50 border-amber-200'
                : 'bg-green-50 border-green-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800">{getEndpointLabel(item.endpoint)}</span>
              <div className="flex items-center gap-2">
                <StatusBadge status={item.currentStatus} />
                <PriorityBadge priority={item.priority} />
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <span className="text-slate-500">현재 액션:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.currentActions.map((action, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-white rounded-full text-xs text-slate-600 border">
                      {action}
                    </span>
                  ))}
                </div>
              </div>

              {item.missingActions.length > 0 && (
                <div>
                  <span className="text-red-500 font-medium">누락된 액션:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.missingActions.map((action, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-red-100 rounded-full text-xs text-red-700">
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 연결 매트릭스 시각화
// ============================================================================

const ConnectionMatrix = () => {
  const { testContentConnections, contentTestConnections } = RETENTION_SYSTEM;

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-800 flex items-center gap-2">
        <span className="text-lg">🔗</span> 콘텐츠 연결 매트릭스
      </h3>

      <div className="bg-slate-50 rounded-xl p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 px-3 text-slate-600">From</th>
              <th className="text-left py-2 px-3 text-slate-600">To</th>
              <th className="text-left py-2 px-3 text-slate-600">Type</th>
              <th className="text-center py-2 px-3 text-slate-600">연관성</th>
              <th className="text-left py-2 px-3 text-slate-600">추천 문구</th>
            </tr>
          </thead>
          <tbody>
            {testContentConnections.slice(0, 8).map((conn, idx) => (
              <tr key={idx} className="border-b border-slate-100">
                <td className="py-2 px-3 font-medium text-slate-800">{conn.from}</td>
                <td className="py-2 px-3 text-slate-600">{conn.to}</td>
                <td className="py-2 px-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    conn.type === 'test' ? 'bg-indigo-100 text-indigo-700' :
                    conn.type === 'quiz' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {conn.type}
                  </span>
                </td>
                <td className="py-2 px-3 text-center">
                  <div className="flex justify-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className={`w-2 h-2 rounded-full ${
                          n <= conn.relevance ? 'bg-indigo-500' : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </td>
                <td className="py-2 px-3 text-slate-500 text-xs">{conn.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-slate-400 mt-2 text-center">
          총 {testContentConnections.length + contentTestConnections.length}개 연결 정의
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// 로드맵 섹션
// ============================================================================

const RoadmapSection = () => {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-800 flex items-center gap-2">
        <span className="text-lg">🗺️</span> 구현 로드맵
      </h3>

      <div className="space-y-4">
        {RETENTION_ROADMAP.map((phase) => (
          <div key={phase.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-800">{phase.name}</span>
              <StatusBadge status={phase.status} />
            </div>
            <div className="p-4 space-y-3">
              {phase.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    phase.status === 'done' ? 'bg-green-100 text-green-700' :
                    phase.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">{item.task}</span>
                      <PriorityBadge priority={item.priority} />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 메트릭스 섹션
// ============================================================================

const MetricsSection = () => {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-800 flex items-center gap-2">
        <span className="text-lg">📈</span> 성공 지표
      </h3>

      <div className="grid gap-3 sm:grid-cols-2">
        {RETENTION_METRICS.map((metric) => (
          <div key={metric.id} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
            <h4 className="font-bold text-slate-800 mb-1">{metric.name}</h4>
            <p className="text-xs text-slate-500 mb-2">{metric.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{metric.formula}</span>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                목표: {metric.target}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 흐름 시각화
// ============================================================================

const FlowVisualization = () => {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-800 flex items-center gap-2">
        <span className="text-lg">🌐</span> 체류 유도 흐름
      </h3>

      <div className="bg-slate-900 rounded-xl p-6 text-white font-mono text-xs overflow-x-auto">
        <pre className="whitespace-pre">{`
┌─────────────────────────────────────────────────────────────────────┐
│                         🏠 대시보드                                  │
│                              │                                       │
│     ┌────────────────────────┼────────────────────────┐             │
│     │                        │                        │             │
│     ▼                        ▼                        ▼             │
│ ┌────────┐              ┌────────┐              ┌────────┐          │
│ │테스트  │◄────────────►│퀴즈    │◄────────────►│투표    │          │
│ │ 결과   │              │ 결과   │              │ 결과   │          │
│ └───┬────┘              └───┬────┘              └───┬────┘          │
│     │                       │                       │               │
│     │  ┌────────────────────┼───────────────────────┤               │
│     │  │                    │                       │               │
│     ▼  ▼                    ▼                       ▼               │
│ ┌────────┐              ┌────────┐              ┌────────┐          │
│ │ 공유   │              │커뮤니티│◄────────────►│ 랭킹   │          │
│ │ 비교   │              │ 댓글   │              │  뷰    │          │
│ └────────┘              └────────┘              └────────┘          │
│                              │                                       │
│                              ▼                                       │
│                        ┌────────┐                                    │
│                        │프로필  │                                    │
│                        │  뷰    │                                    │
│                        └────────┘                                    │
└─────────────────────────────────────────────────────────────────────┘

현재 상태:
  ✅ 테스트 결과 → 랭킹/공유/다음테스트
  ❌ 퀴즈 결과 → 테스트 연결 없음
  ❌ 투표 결과 → 테스트 연결 없음
  ❌ 커뮤니티 → 다음 액션 없음
`}</pre>
      </div>
    </div>
  );
};

// ============================================================================
// 메인 컴포넌트
// ============================================================================

type TabKey = 'overview' | 'connections' | 'roadmap' | 'metrics';

export default function RetentionSystem() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'overview', label: '현황', icon: '📊' },
    { key: 'connections', label: '연결', icon: '🔗' },
    { key: 'roadmap', label: '로드맵', icon: '🗺️' },
    { key: 'metrics', label: '지표', icon: '📈' },
  ];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold mb-2">🔄 체류 유도 시스템</h2>
        <p className="text-white/80 text-sm">
          사용자가 콘텐츠 완료 후 다음 액션으로 자연스럽게 유도하는 시스템
        </p>
        <div className="mt-4 flex gap-4 text-sm">
          <div className="bg-white/20 rounded-lg px-3 py-2">
            <span className="text-white/60">종료 지점</span>
            <p className="font-bold">6개</p>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-2">
            <span className="text-white/60">연결 정의</span>
            <p className="font-bold">{RETENTION_SYSTEM.testContentConnections.length + RETENTION_SYSTEM.contentTestConnections.length}개</p>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-2">
            <span className="text-white/60">우선 개선</span>
            <p className="font-bold">{CURRENT_STATE_ANALYSIS.filter(a => a.currentStatus === 'missing').length}개</p>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <FlowVisualization />
            <CurrentStateSection />
          </div>
        )}
        {activeTab === 'connections' && <ConnectionMatrix />}
        {activeTab === 'roadmap' && <RoadmapSection />}
        {activeTab === 'metrics' && <MetricsSection />}
      </div>
    </div>
  );
}
