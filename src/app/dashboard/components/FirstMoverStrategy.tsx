'use client';

import { useState } from 'react';
import {
  Zap,
  TrendingUp,
  Users,
  Database,
  RefreshCw,
  Target,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Star,
  Shield,
  Sparkles,
} from 'lucide-react';
import {
  SUCCESS_CASE_STUDIES,
  COMPETITIVE_ADVANTAGES,
  VIRAL_TRENDS_2025,
  RETENTION_STRATEGIES,
  IMPLEMENTATION_ROADMAP,
  KEY_METRICS,
  CORE_PRINCIPLES,
} from '../data/first-mover-strategy';

type TabKey = 'overview' | 'cases' | 'advantages' | 'trends' | 'roadmap';

export default function FirstMoverStrategy() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [expandedCase, setExpandedCase] = useState<string | null>(null);
  const [expandedAdvantage, setExpandedAdvantage] = useState<string | null>('data-moat');

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: '핵심 원칙', icon: <Target className="w-4 h-4" /> },
    { key: 'cases', label: '성공 사례', icon: <Star className="w-4 h-4" /> },
    { key: 'advantages', label: '경쟁 우위', icon: <Shield className="w-4 h-4" /> },
    { key: 'trends', label: '2025 트렌드', icon: <Sparkles className="w-4 h-4" /> },
    { key: 'roadmap', label: '구현 로드맵', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
      case 'partial':
        return 'bg-blue-100 text-blue-800';
      case 'planned':
      case 'not-started':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'done':
      case 'complete':
        return '완료';
      case 'in-progress':
        return '진행중';
      case 'partial':
        return '부분 완료';
      case 'planned':
      case 'not-started':
        return '예정';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-amber-500 rounded-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">선점 효과 전략</h1>
            <p className="text-gray-600">First-Mover Advantage Strategy</p>
          </div>
        </div>
        <p className="text-gray-700">
          AI 시대, 누구나 앱을 만들 수 있는 환경에서 <strong>네트워크 효과</strong>와{' '}
          <strong>전환 비용</strong>으로 지속 가능한 경쟁 우위를 확보합니다.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-500" />
              핵심 원칙
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {CORE_PRINCIPLES.map((principle) => (
                <div
                  key={principle.id}
                  className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:border-amber-300 transition-colors"
                >
                  <h3 className="font-bold text-gray-900 mb-2">{principle.principle}</h3>
                  <p className="text-sm text-gray-600 mb-3">{principle.description}</p>
                  <div className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{principle.action}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Key Metrics Summary */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">핵심 지표 (KPIs)</h3>
              <div className="grid md:grid-cols-4 gap-4">
                {Object.entries(KEY_METRICS).map(([key, category]) => (
                  <div key={key} className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-medium text-gray-900 mb-3">{category.name}</h4>
                    <ul className="space-y-2">
                      {category.metrics.map((metric) => (
                        <li key={metric.id} className="text-sm">
                          <span className="text-gray-600">{metric.name}</span>
                          <span className="block font-medium text-amber-600">{metric.target}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Retention Targets */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">리텐션 목표</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {RETENTION_STRATEGIES.map((strategy) => (
                  <div key={strategy.id} className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900">{strategy.name}</h4>
                      <span className="text-xl font-bold text-blue-600">{strategy.targetRetention}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
                    <ul className="space-y-1">
                      {strategy.features.map((feature, idx) => (
                        <li key={idx} className="text-xs text-gray-500 flex items-start gap-1">
                          <span className="text-blue-400">-</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-gray-400 mt-2">벤치마크: {strategy.benchmark}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              성공 사례 연구
            </h2>
            <p className="text-gray-600">
              선점 효과와 네트워크 효과로 시장을 장악한 사례들입니다.
            </p>
            {SUCCESS_CASE_STUDIES.map((caseStudy) => (
              <div
                key={caseStudy.id}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedCase(expandedCase === caseStudy.id ? null : caseStudy.id)
                  }
                  className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {caseStudy.id === 'kakao' && '💬'}
                      {caseStudy.id === 'duolingo' && '🦉'}
                      {caseStudy.id === 'tiktok' && '🎵'}
                      {caseStudy.id === 'strava' && '🏃'}
                    </span>
                    <div className="text-left">
                      <h3 className="font-bold text-gray-900">{caseStudy.name}</h3>
                      <p className="text-sm text-gray-500">
                        {caseStudy.country} | {caseStudy.category} | {caseStudy.launchYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                      {caseStudy.networkEffectType} 네트워크
                    </span>
                    {expandedCase === caseStudy.id ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>
                {expandedCase === caseStudy.id && (
                  <div className="p-4 bg-white border-t border-gray-100">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">핵심 전략</h4>
                        <ul className="space-y-1">
                          {caseStudy.keyStrategy.map((strategy, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {strategy}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">전환 비용 요소</h4>
                        <ul className="space-y-1">
                          {caseStudy.switchingCostFactors.map((factor, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                              <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-1">현재 상태</h4>
                      <p className="text-sm text-green-700">{caseStudy.currentStatus}</p>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">배울 점</h4>
                      <div className="flex flex-wrap gap-2">
                        {caseStudy.lessonsLearned.map((lesson, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1 bg-amber-50 text-amber-700 rounded-full"
                          >
                            {lesson}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'advantages' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-500" />
              경쟁 우위 요소
            </h2>
            <p className="text-gray-600">
              현재 프로젝트에서 구축 중인 경쟁 우위 요소들입니다.
            </p>
            {COMPETITIVE_ADVANTAGES.map((advantage) => (
              <div
                key={advantage.id}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedAdvantage(
                      expandedAdvantage === advantage.id ? null : advantage.id
                    )
                  }
                  className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        advantage.currentStatus === 'complete'
                          ? 'bg-green-100'
                          : advantage.currentStatus === 'partial'
                          ? 'bg-blue-100'
                          : 'bg-gray-100'
                      }`}
                    >
                      {advantage.id === 'data-moat' && <Database className="w-5 h-5 text-amber-600" />}
                      {advantage.id === 'switching-cost' && <Shield className="w-5 h-5 text-blue-600" />}
                      {advantage.id === 'network-effect' && <Users className="w-5 h-5 text-purple-600" />}
                      {advantage.id === 'habit-loop' && <RefreshCw className="w-5 h-5 text-green-600" />}
                      {advantage.id === 'personalization' && <Target className="w-5 h-5 text-pink-600" />}
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-gray-900">{advantage.name}</h3>
                      <p className="text-sm text-gray-500">{advantage.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(advantage.currentStatus)}`}>
                      {getStatusLabel(advantage.currentStatus)}
                    </span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < advantage.importance ? 'bg-amber-400' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    {expandedAdvantage === advantage.id ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>
                {expandedAdvantage === advantage.id && (
                  <div className="p-4 bg-white border-t border-gray-100">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">기능 목록</h4>
                        <div className="space-y-2">
                          {advantage.features.map((feature, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg"
                            >
                              <span
                                className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                                  feature.status === 'done'
                                    ? 'bg-green-500'
                                    : feature.status === 'in-progress'
                                    ? 'bg-blue-500'
                                    : 'bg-gray-300'
                                }`}
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{feature.name}</p>
                                <p className="text-xs text-gray-500">{feature.description}</p>
                                {feature.linkedService && (
                                  <span className="text-xs text-blue-500 font-mono">
                                    {feature.linkedService}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {advantage.metrics && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">측정 지표</h4>
                          <ul className="space-y-2">
                            {advantage.metrics.map((metric, idx) => (
                              <li
                                key={idx}
                                className="text-sm text-gray-600 flex items-center gap-2"
                              >
                                <TrendingUp className="w-4 h-4 text-amber-500" />
                                {metric}
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                            <p className="text-xs text-amber-700">
                              <strong>가치 실현:</strong> {advantage.timeToValue === 'short' ? '단기' : advantage.timeToValue === 'medium' ? '중기' : '장기'}
                              <br />
                              <strong>구현 난이도:</strong> {advantage.difficulty}/5
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              2024-2025 바이럴 트렌드
            </h2>
            <p className="text-gray-600">
              최신 앱 성장 전략과 우리 프로젝트 적용 방안입니다.
            </p>
            <div className="grid gap-4">
              {VIRAL_TRENDS_2025.map((trend) => (
                <div
                  key={trend.id}
                  className="p-4 border border-gray-200 rounded-xl hover:border-amber-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{trend.trend}</h3>
                      <p className="text-sm text-gray-600">{trend.description}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        trend.applicability === 'high'
                          ? 'bg-green-100 text-green-800'
                          : trend.applicability === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      적용성: {trend.applicability === 'high' ? '높음' : trend.applicability === 'medium' ? '중간' : '낮음'}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 mb-2">성공 사례</h4>
                      <div className="flex flex-wrap gap-1">
                        {trend.examples.map((example, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 mb-2">적용 방안</h4>
                      <ul className="space-y-1">
                        {trend.implementation.map((impl, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                            <CheckCircle2 className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                            {impl}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {trend.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        {trend.sources.map((source, idx) => (
                          <a
                            key={idx}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {source.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              구현 로드맵
            </h2>
            <p className="text-gray-600">
              선점 효과 강화를 위한 단계별 구현 계획입니다.
            </p>
            <div className="space-y-4">
              {IMPLEMENTATION_ROADMAP.map((phase, idx) => (
                <div
                  key={phase.phase}
                  className={`p-4 rounded-xl border ${
                    phase.duration === '완료'
                      ? 'bg-green-50 border-green-200'
                      : phase.duration === '진행중'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        phase.duration === '완료'
                          ? 'bg-green-500'
                          : phase.duration === '진행중'
                          ? 'bg-blue-500'
                          : 'bg-gray-400'
                      }`}
                    >
                      {phase.phase}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{phase.name}</h3>
                      <p className="text-sm text-gray-500">{phase.focus}</p>
                    </div>
                    <span
                      className={`ml-auto text-xs px-2 py-1 rounded-full ${
                        phase.duration === '완료'
                          ? 'bg-green-100 text-green-800'
                          : phase.duration === '진행중'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {phase.duration}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 mb-2">작업 목록</h4>
                      <ul className="space-y-1">
                        {phase.tasks.map((task, tidx) => (
                          <li
                            key={tidx}
                            className="text-sm flex items-center gap-2"
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                task.priority === 'critical'
                                  ? 'bg-red-500'
                                  : task.priority === 'high'
                                  ? 'bg-orange-400'
                                  : 'bg-gray-300'
                              }`}
                            />
                            <span className="text-gray-700">{task.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center">
                      <div className="p-3 bg-white rounded-lg border border-gray-200 w-full">
                        <p className="text-xs text-gray-500 mb-1">기대 효과</p>
                        <p className="text-sm font-medium text-gray-900">{phase.expectedOutcome}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
