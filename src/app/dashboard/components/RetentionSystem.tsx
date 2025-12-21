'use client';

import { useState, useEffect } from 'react';
import {
  RETENTION_SYSTEM,
  RETENTION_ROADMAP,
  CURRENT_STATE_ANALYSIS,
  RETENTION_METRICS,
} from '../data/retention-system';
import { gamificationService } from '@/services/GamificationService';
import { contentParticipationService } from '@/services/ContentParticipationService';
import { resultService } from '@/services/ResultService';

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
  const totalConnections = testContentConnections.length + contentTestConnections.length;

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-800 flex items-center gap-2">
        <span className="text-lg">🔗</span> 콘텐츠 연결 매트릭스
      </h3>

      <div className="space-y-4">
        <div className="bg-slate-50 rounded-xl p-4 overflow-x-auto">
          <p className="text-xs font-bold text-slate-600 mb-2">테스트 → 퀴즈/투표</p>
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
              {testContentConnections.map((conn, idx) => (
                <tr key={idx} className="border-b border-slate-100">
                  <td className="py-2 px-3 font-medium text-slate-800">{conn.from}</td>
                  <td className="py-2 px-3 text-slate-600">{conn.to}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        conn.type === 'quiz'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
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
        </div>

        <div className="bg-slate-50 rounded-xl p-4 overflow-x-auto">
          <p className="text-xs font-bold text-slate-600 mb-2">퀴즈/투표 → 테스트</p>
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
              {contentTestConnections.map((conn, idx) => (
                <tr key={idx} className="border-b border-slate-100">
                  <td className="py-2 px-3 font-medium text-slate-800">{conn.from}</td>
                  <td className="py-2 px-3 text-slate-600">{conn.to}</td>
                  <td className="py-2 px-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
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
        </div>

        <p className="text-xs text-slate-400 text-center">총 {totalConnections}개 연결 정의</p>
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
// 실시간 통계 모니터링 섹션
// ============================================================================

interface LiveStats {
  // 게이미피케이션
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  levelName: string;
  levelEmoji: string;
  levelNumber: number;
  // 콘텐츠 참여
  quizzesAnswered: number;
  quizzesCorrect: number;
  pollsVoted: number;
  // 테스트
  testsCompleted: number;
  completedTestList: string[];
  incompleteTestList: string[];
}

const LiveMonitoringSection = () => {
  const [stats, setStats] = useState<LiveStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // 게이미피케이션 통계 (null 체크)
        const gameStats = gamificationService?.getStats() ?? { totalPoints: 0, streak: null };
        const level = gamificationService?.getLevel() ?? null;

        // 콘텐츠 참여 통계
        const participation = contentParticipationService.getParticipation();

        // 테스트 완료 통계
        const completedTests = await resultService.getCompletedTests();
        const incompleteTests = await resultService.getIncompleteTests();

        setStats({
          totalPoints: gameStats.totalPoints,
          currentStreak: gameStats.streak?.currentStreak || 0,
          longestStreak: gameStats.streak?.longestStreak || 0,
          levelName: level?.name || '뉴비',
          levelEmoji: level?.emoji || '🌱',
          levelNumber: level?.level || 1,
          quizzesAnswered: participation.quizzes.length,
          quizzesCorrect: participation.quizzes.filter(q => q.isCorrect).length,
          pollsVoted: participation.polls.length,
          testsCompleted: completedTests.length,
          completedTestList: completedTests,
          incompleteTestList: incompleteTests,
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <span className="text-lg">📡</span> 실시간 통계
        </h3>
        <div className="animate-pulse space-y-3">
          <div className="h-24 bg-slate-100 rounded-xl" />
          <div className="h-24 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <span className="text-lg">📡</span> 실시간 통계
        </h3>
        <p className="text-slate-500 text-sm">데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const quizAccuracy = stats.quizzesAnswered > 0
    ? Math.round((stats.quizzesCorrect / stats.quizzesAnswered) * 100)
    : 0;

  const testCompletionRate = (stats.testsCompleted + stats.incompleteTestList.length) > 0
    ? Math.round((stats.testsCompleted / (stats.testsCompleted + stats.incompleteTestList.length)) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-800 flex items-center gap-2">
        <span className="text-lg">📡</span> 실시간 통계 (현재 사용자)
      </h3>

      {/* 게이미피케이션 카드 */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-2xl shadow-md">
            {stats.levelEmoji}
          </div>
          <div>
            <p className="font-bold text-slate-800">{stats.levelName}</p>
            <p className="text-xs text-slate-500">Lv.{stats.levelNumber}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="font-black text-amber-600 text-lg">{stats.totalPoints}P</p>
            <p className="text-xs text-amber-500">총 포인트</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/60 rounded-lg p-2 text-center">
            <p className="text-xl font-black text-amber-600">🔥 {stats.currentStreak}</p>
            <p className="text-xs text-slate-500">현재 스트릭</p>
          </div>
          <div className="bg-white/60 rounded-lg p-2 text-center">
            <p className="text-xl font-black text-amber-600">🏆 {stats.longestStreak}</p>
            <p className="text-xs text-slate-500">최장 스트릭</p>
          </div>
        </div>
      </div>

      {/* 콘텐츠 참여 카드 */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
        <p className="font-bold text-slate-800 mb-3">📊 콘텐츠 참여</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/60 rounded-lg p-2 text-center">
            <p className="text-lg font-black text-blue-600">{stats.quizzesAnswered}</p>
            <p className="text-xs text-slate-500">퀴즈 응답</p>
          </div>
          <div className="bg-white/60 rounded-lg p-2 text-center">
            <p className="text-lg font-black text-emerald-600">{quizAccuracy}%</p>
            <p className="text-xs text-slate-500">정답률</p>
          </div>
          <div className="bg-white/60 rounded-lg p-2 text-center">
            <p className="text-lg font-black text-purple-600">{stats.pollsVoted}</p>
            <p className="text-xs text-slate-500">투표 참여</p>
          </div>
        </div>
      </div>

      {/* 테스트 완료 카드 */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-slate-800">🧪 테스트 완료</p>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
            {testCompletionRate}% 완료
          </span>
        </div>

        {/* 진행률 바 */}
        <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
          <div
            className="bg-gradient-to-r from-emerald-400 to-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${testCompletionRate}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-white/60 rounded-lg p-2 text-center">
            <p className="text-lg font-black text-emerald-600">{stats.testsCompleted}</p>
            <p className="text-xs text-slate-500">완료</p>
          </div>
          <div className="bg-white/60 rounded-lg p-2 text-center">
            <p className="text-lg font-black text-slate-400">{stats.incompleteTestList.length}</p>
            <p className="text-xs text-slate-500">미완료</p>
          </div>
        </div>

        {/* 완료 테스트 목록 */}
        {stats.completedTestList.length > 0 && (
          <div className="pt-2 border-t border-emerald-200">
            <p className="text-xs text-slate-500 mb-1">완료한 테스트:</p>
            <div className="flex flex-wrap gap-1">
              {stats.completedTestList.map(test => (
                <span key={test} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                  {test}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 미완료 테스트 목록 */}
        {stats.incompleteTestList.length > 0 && (
          <div className="pt-2 border-t border-emerald-200 mt-2">
            <p className="text-xs text-slate-500 mb-1">남은 테스트:</p>
            <div className="flex flex-wrap gap-1">
              {stats.incompleteTestList.slice(0, 6).map(test => (
                <span key={test} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs">
                  {test}
                </span>
              ))}
              {stats.incompleteTestList.length > 6 && (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-full text-xs">
                  +{stats.incompleteTestList.length - 6}개
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 체류 지표 요약 */}
      <div className="bg-slate-100 rounded-xl p-4">
        <p className="font-bold text-slate-800 mb-2">📐 체류 유도 지표</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">콘텐츠 다양성</span>
            <span className="font-bold text-slate-800">
              {(stats.testsCompleted > 0 ? 1 : 0) + (stats.quizzesAnswered > 0 ? 1 : 0) + (stats.pollsVoted > 0 ? 1 : 0)}/3 유형
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">스트릭 유지</span>
            <span className={`font-bold ${stats.currentStreak >= 3 ? 'text-emerald-600' : 'text-slate-400'}`}>
              {stats.currentStreak >= 3 ? '✅ 활성' : '❌ 비활성'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">레벨 진행</span>
            <span className="font-bold text-slate-800">
              {stats.levelEmoji} {stats.levelName} (Lv.{stats.levelNumber})
            </span>
          </div>
        </div>
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

Phase 3 완료 상태:
  ✅ 테스트 결과 → 퀴즈/투표/공유/다음테스트
  ✅ 퀴즈 결과 → 테스트/투표 연결
  ✅ 투표 결과 → 테스트/퀴즈 연결
  ✅ 커뮤니티 → 관련 테스트 추천
  ✅ 개인화 추천 (완료/미완료 기반)
  ✅ 스트릭 보너스 (3/7/14일)
  ✅ 시간대별 추천 (아침/낮/저녁/밤)
`}</pre>
      </div>
    </div>
  );
};

// ============================================================================
// 메인 컴포넌트
// ============================================================================

type TabKey = 'overview' | 'connections' | 'roadmap' | 'metrics' | 'live';

export default function RetentionSystem() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'overview', label: '현황', icon: '📊' },
    { key: 'live', label: '실시간', icon: '📡' },
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
        {activeTab === 'live' && <LiveMonitoringSection />}
        {activeTab === 'connections' && <ConnectionMatrix />}
        {activeTab === 'roadmap' && <RoadmapSection />}
        {activeTab === 'metrics' && <MetricsSection />}
      </div>
    </div>
  );
}
