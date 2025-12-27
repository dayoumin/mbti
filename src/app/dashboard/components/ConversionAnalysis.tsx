'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Target,
  Share2,
  BarChart3,
  RefreshCw,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import {
  analyticsService,
  type FunnelAnalysis,
  type TestConversionAnalysis,
  type ViralMetrics,
} from '@/services/AnalyticsService';

// 퍼널 단계 색상
const FUNNEL_COLORS = [
  'bg-blue-500',
  'bg-indigo-500',
  'bg-purple-500',
  'bg-pink-500',
];

export default function ConversionAnalysis() {
  const [funnel, setFunnel] = useState<FunnelAnalysis | null>(null);
  const [testConversion, setTestConversion] = useState<TestConversionAnalysis[]>([]);
  const [viral, setViral] = useState<ViralMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    try {
      setFunnel(analyticsService.getFunnelAnalysis());
      setTestConversion(analyticsService.getTestConversionAnalysis());
      setViral(analyticsService.getViralCoefficient());
    } catch (error) {
      console.error('전환 분석 로드 실패:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const hasData = funnel && funnel.period.eventCount > 0;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">전환 분석</h2>
          <p className="text-sm text-gray-500">
            공유 → 유입 → 테스트 완료 퍼널 추적
          </p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          새로고침
        </button>
      </div>

      {!hasData ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
          <h3 className="font-semibold text-amber-800 mb-2">아직 데이터가 없습니다</h3>
          <p className="text-sm text-amber-700">
            사용자 활동이 기록되면 여기에 전환 분석이 표시됩니다.
          </p>
        </div>
      ) : (
        <>
          {/* 전체 퍼널 요약 */}
          <div className="bg-slate-50 border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              전체 퍼널
            </h3>

            {/* 퍼널 시각화 */}
            <div className="flex items-center justify-between mb-6">
              {[
                { label: '세션', value: funnel.total.sessions, icon: Users },
                { label: '테스트 시작', value: funnel.total.testStarts, icon: Target },
                { label: '테스트 완료', value: funnel.total.testCompletes, icon: TrendingUp },
                { label: '공유', value: funnel.total.shares, icon: Share2 },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center">
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 ${FUNNEL_COLORS[i]} rounded-full flex items-center justify-center mx-auto mb-2`}
                    >
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{step.value}</div>
                    <div className="text-xs text-gray-500">{step.label}</div>
                  </div>
                  {i < 3 && (
                    <div className="mx-4 flex flex-col items-center">
                      <ArrowRight className="w-5 h-5 text-gray-300" />
                      <span className="text-xs text-gray-400 mt-1">
                        {i === 0 && `${funnel.total.startRate.toFixed(1)}%`}
                        {i === 1 && `${funnel.total.completeRate.toFixed(1)}%`}
                        {i === 2 && `${funnel.total.shareRate.toFixed(1)}%`}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 전체 전환율 */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">전체 전환율 (세션 → 완료)</span>
                <span className="text-2xl font-bold text-indigo-600">
                  {funnel.total.overallConversion.toFixed(1)}%
                </span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  style={{ width: `${Math.min(funnel.total.overallConversion, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* 소스별 분석 */}
          {funnel.bySource.length > 0 && (
            <div className="bg-slate-50 border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                유입 소스별 전환율
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-medium text-gray-600">소스</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-600">세션</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-600">시작</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-600">완료</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-600">공유</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-600">전환율</th>
                    </tr>
                  </thead>
                  <tbody>
                    {funnel.bySource.map((source) => (
                      <tr key={source.source} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-3">
                          <span className="inline-flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${source.source === 'kakao' ? 'bg-yellow-400' :
                                source.source === 'instagram' ? 'bg-pink-400' :
                                  source.source === 'link_copy' ? 'bg-blue-400' :
                                    'bg-gray-400'
                              }`} />
                            {source.source}
                          </span>
                        </td>
                        <td className="text-right py-2 px-3 text-gray-900">{source.sessions}</td>
                        <td className="text-right py-2 px-3 text-gray-600">{source.testStarts}</td>
                        <td className="text-right py-2 px-3 text-gray-600">{source.testCompletes}</td>
                        <td className="text-right py-2 px-3 text-gray-600">{source.shares}</td>
                        <td className="text-right py-2 px-3">
                          <span className={`font-medium ${source.overallConversion >= 50 ? 'text-green-600' :
                              source.overallConversion >= 30 ? 'text-amber-600' :
                                'text-gray-600'
                            }`}>
                            {source.overallConversion.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 테스트별 전환율 */}
          {testConversion.length > 0 && (
            <div className="bg-slate-50 border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-500" />
                테스트별 전환율
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testConversion.map((test) => (
                  <div
                    key={test.testType}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                  >
                    <div className="font-medium text-gray-900 mb-3">{test.testType}</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">시작 → 완료</span>
                        <span className="font-medium">{test.completionRate.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-400 rounded-full"
                          style={{ width: `${Math.min(test.completionRate, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-gray-500">완료 → 공유</span>
                        <span className="font-medium">{test.shareRate.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-pink-400 rounded-full"
                          style={{ width: `${Math.min(test.shareRate, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>{test.starts} 시작</span>
                        <span>{test.completes} 완료</span>
                        <span>{test.shares} 공유</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 바이럴 계수 */}
          {viral && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                바이럴 계수 (K-Factor)
              </h3>

              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600">
                    {viral.coefficient.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">K-Factor</div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">공유한 사용자</span>
                    <span className="font-medium">{viral.sharers}명</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">공유로 유입된 사용자</span>
                    <span className="font-medium">{viral.viralUsers}명</span>
                  </div>
                  <div className="mt-3 px-3 py-2 bg-slate-50 rounded-lg text-sm">
                    <span className={`font-medium ${viral.coefficient >= 1 ? 'text-green-600' :
                        viral.coefficient >= 0.5 ? 'text-amber-600' :
                          'text-gray-600'
                      }`}>
                      {viral.interpretation}
                    </span>
                    <span className="text-gray-500 ml-2">
                      {viral.coefficient >= 1
                        ? '(각 사용자가 1명 이상 데려옴)'
                        : viral.coefficient >= 0.5
                          ? '(2명이 1명 데려옴)'
                          : '(바이럴 확산 낮음)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 기간 정보 */}
          <div className="text-center text-xs text-gray-400">
            데이터 기간: {new Date(funnel.period.start).toLocaleDateString()} ~{' '}
            {new Date(funnel.period.end).toLocaleDateString()} ({funnel.period.eventCount}개 이벤트)
          </div>
        </>
      )}
    </div>
  );
}
