'use client';

import { useState, useEffect } from 'react';
import { SUBJECT_CONFIG } from '@/data/config';

// ============================================================================
// 타입 정의
// ============================================================================

interface DistributionItem {
  rank: number;
  resultName: string;
  count: number;
  percentage: number;
  rawPercentage: number;  // 알림 판단용 (반올림 없음)
}

interface Alert {
  type: 'high' | 'low' | 'zero';
  resultName: string;
  percentage: number;
}

interface TestDistribution {
  testType: string;
  total: number;
  resultCount: number;
  expectedCount?: number;  // 정의된 결과 수 (미출현 감지용)
  distribution: DistributionItem[];
  alerts: Alert[];
  hasAlerts: boolean;
}

interface Thresholds {
  HIGH: number;
  LOW: number;
}

interface AllDistributionsResponse {
  totalTests: number;
  totalAlerts: number;
  distributions: TestDistribution[];
  thresholds?: Thresholds;  // 서버에서 전달한 임계값
}

// ============================================================================
// 컴포넌트
// ============================================================================

export default function ResultDistributionMonitor() {
  const [data, setData] = useState<AllDistributionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTest, setExpandedTest] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'alerts'>('all');

  useEffect(() => {
    fetchDistributions();
  }, []);

  const fetchDistributions = async () => {
    try {
      setLoading(true);
      setError(null);  // 재시도 시 에러 초기화
      const res = await fetch('/api/test-results?type=all-distributions');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // 서버 임계값 또는 기본값
  const thresholds = data?.thresholds ?? { HIGH: 40, LOW: 1 };

  const getTestName = (testType: string) => {
    const config = SUBJECT_CONFIG[testType as keyof typeof SUBJECT_CONFIG];
    return config?.label || testType;
  };

  const getTestType = (testType: string): 'personality' | 'matching' | 'unknown' => {
    const config = SUBJECT_CONFIG[testType as keyof typeof SUBJECT_CONFIG];
    const type = config?.testType;
    if (type === 'personality' || type === 'matching') return type;
    return 'unknown';
  };

  const getTestTypeBadge = (testType: string) => {
    const type = getTestType(testType);
    switch (type) {
      case 'personality':
        return { label: '성격', className: 'bg-purple-100 text-purple-600' };
      case 'matching':
        return { label: '매칭', className: 'bg-blue-100 text-blue-600' };
      default:
        return { label: '기타', className: 'bg-gray-100 text-gray-600' };
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'high': return '🔴';
      case 'low': return '🟡';
      case 'zero': return '⚫';
    }
  };

  // 경계 근처(±0.1%)에서는 소수점 2자리까지 표시하여 혼란 방지
  // 예: raw 39.96% → "39.96%" (40.0%로 보이지만 HIGH 아님을 명확히)
  const formatPercentage = (rawPct: number, displayPct: number): string => {
    // HIGH 경계 근처 (39.9 ~ 40.1)
    const nearHighBoundary = Math.abs(rawPct - thresholds.HIGH) < 0.1;
    // LOW 경계 근처 (0.9 ~ 1.1) 또는 매우 작은 값 (0 < raw < 0.1)
    const nearLowBoundary = Math.abs(rawPct - thresholds.LOW) < 0.1;
    const verySmall = rawPct > 0 && rawPct < 0.1;

    if (nearHighBoundary || nearLowBoundary || verySmall) {
      // 소수점 2자리까지 표시
      return rawPct.toFixed(2);
    }
    // 일반: 반올림된 값 사용
    return displayPct.toString();
  };

  const getAlertMessage = (alert: Alert) => {
    switch (alert.type) {
      case 'high': return `"${alert.resultName}" 쏠림 (${alert.percentage}%)`;
      case 'low': return `"${alert.resultName}" 거의 안 나옴 (${alert.percentage}%)`;
      case 'zero': return `"${alert.resultName}" 전혀 안 나옴`;
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-50 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-50 rounded-lg shadow p-6">
        <div className="text-red-500 flex items-center gap-2">
          <span>⚠️</span>
          <span>데이터 로드 실패: {error}</span>
          <button
            onClick={fetchDistributions}
            className="ml-auto text-blue-500 hover:underline"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!data || data.distributions.length === 0) {
    return (
      <div className="bg-slate-50 rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">📊 결과 분포 모니터링</h2>
        <p className="text-gray-500">아직 수집된 테스트 결과가 없습니다.</p>
      </div>
    );
  }

  const filteredDistributions = filter === 'alerts'
    ? data.distributions.filter(d => d.hasAlerts)
    : data.distributions;

  return (
    <div className="bg-slate-50 rounded-lg shadow">
      {/* 헤더 */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            📊 결과 분포 모니터링
            {data.totalAlerts > 0 && (
              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                {data.totalAlerts}개 이상 감지
              </span>
            )}
          </h2>
          <button
            onClick={fetchDistributions}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            🔄 새로고침
          </button>
        </div>

        {/* 필터 */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded ${filter === 'all'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            전체 ({data.totalTests})
          </button>
          <button
            onClick={() => setFilter('alerts')}
            className={`px-3 py-1 text-sm rounded ${filter === 'alerts'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            이상 감지 ({data.distributions.filter(d => d.hasAlerts).length})
          </button>
        </div>
      </div>

      {/* 알림 요약 */}
      {data.totalAlerts > 0 && (
        <div className="p-4 bg-red-50 border-b">
          <h3 className="font-medium text-red-800 mb-2">⚠️ 주의 필요</h3>
          <div className="space-y-1 text-sm">
            {data.distributions
              .filter(d => d.hasAlerts)
              .flatMap(d => d.alerts.map(a => ({ testType: d.testType, alert: a })))
              .slice(0, 5)
              .map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-red-700">
                  <span>{getAlertIcon(item.alert.type)}</span>
                  <span className="font-medium">{getTestName(item.testType)}:</span>
                  <span>{getAlertMessage(item.alert)}</span>
                </div>
              ))}
            {data.totalAlerts > 5 && (
              <p className="text-red-600">... 외 {data.totalAlerts - 5}개</p>
            )}
          </div>
        </div>
      )}

      {/* 테스트 목록 */}
      <div className="divide-y max-h-[600px] overflow-y-auto">
        {filteredDistributions.map(dist => (
          <div key={dist.testType} className="p-4">
            {/* 테스트 헤더 */}
            <button
              onClick={() => setExpandedTest(
                expandedTest === dist.testType ? null : dist.testType
              )}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">{getTestName(dist.testType)}</span>
                {(() => {
                  const badge = getTestTypeBadge(dist.testType);
                  return (
                    <span className={`text-xs px-1.5 py-0.5 rounded ${badge.className}`}>
                      {badge.label}
                    </span>
                  );
                })()}
                {dist.hasAlerts && (
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded">
                    {dist.alerts.length}개 이상
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{dist.total.toLocaleString()}명</span>
                <span>{dist.resultCount}개 결과</span>
                <span>{expandedTest === dist.testType ? '▲' : '▼'}</span>
              </div>
            </button>

            {/* 확장된 분포 상세 */}
            {expandedTest === dist.testType && (
              <div className="mt-4 space-y-2">
                {dist.distribution.map(item => {
                  // rawPercentage로 판단하여 API 알림과 일치시킴
                  const isHigh = item.rawPercentage >= thresholds.HIGH;
                  const isLow = item.count > 0 && item.rawPercentage < thresholds.LOW;
                  const isZero = item.count === 0;

                  return (
                    <div key={item.resultName} className="flex items-center gap-3">
                      {/* 순위 */}
                      <span className="w-6 text-center text-sm text-gray-400">
                        {item.rank}
                      </span>

                      {/* 막대 그래프 */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm ${isHigh ? 'text-red-600 font-medium' :
                              isZero ? 'text-gray-400 italic' :
                                isLow ? 'text-yellow-600' : ''
                            }`}>
                            {item.resultName}
                          </span>
                          {isHigh && <span className="text-xs text-red-500">⚠️ 쏠림</span>}
                          {isLow && <span className="text-xs text-yellow-500">⚠️ 희귀</span>}
                          {isZero && <span className="text-xs text-gray-500">⚫ 미출현</span>}
                        </div>
                        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${isHigh ? 'bg-red-400' :
                                isZero ? 'bg-gray-300' :
                                  isLow ? 'bg-yellow-400' : 'bg-blue-400'
                              }`}
                            style={{ width: `${Math.max(item.percentage, isZero ? 0 : 1)}%` }}
                          />
                        </div>
                      </div>

                      {/* 수치 */}
                      <div className="w-24 text-right text-sm">
                        <span className={
                          isHigh ? 'text-red-600 font-medium' :
                            isZero ? 'text-gray-400' : 'text-gray-600'
                        }>
                          {formatPercentage(item.rawPercentage, item.percentage)}%
                        </span>
                        <span className="text-gray-400 ml-1">({item.count})</span>
                      </div>
                    </div>
                  );
                })}

                {/* 알림 상세 */}
                {dist.alerts.length > 0 && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg">
                    <h4 className="text-sm font-medium text-red-800 mb-2">개선 권장사항</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {dist.alerts.map((alert, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span>{getAlertIcon(alert.type)}</span>
                          <span>
                            {alert.type === 'high' && (
                              <>"{alert.resultName}" 결과가 {alert.percentage}%로 너무 많음 → condition 조건 조정 필요</>
                            )}
                            {alert.type === 'low' && (
                              <>"{alert.resultName}" 결과가 {alert.percentage}%로 너무 적음 → 도달 가능성 확인 필요</>
                            )}
                            {alert.type === 'zero' && (
                              <>"{alert.resultName}" 결과가 한 번도 안 나옴 → condition 조건 불가능 여부 확인</>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 푸터 */}
      <div className="p-4 border-t bg-gray-50 text-xs text-gray-500">
        <p className="font-medium text-gray-600 mb-1">분포 이상 감지 기준:</p>
        <p>• 🔴 쏠림: 한 결과가 {thresholds.HIGH}% 이상 → condition 조건 완화 필요</p>
        <p>• 🟡 희귀: 한 결과가 {thresholds.LOW}% 미만 → 도달 조건 확인 필요</p>
        <p>• ⚫ 미출현: 0% (한 번도 안 나옴) → 조건 불가능 확인</p>
      </div>
    </div>
  );
}
