'use client';

import { useState } from 'react';
import {
  Globe,
  Languages,
  MapPin,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Target,
  TrendingUp,
  Zap,
  Flag,
  Rocket,
  Heart,
  Music,
  Tv,
  Sparkles,
} from 'lucide-react';
import {
  TARGET_LANGUAGES,
  GLOBAL_PHASES,
  MARKET_STRATEGIES,
  TRANSLATION_STRATEGY,
  TRANSLATION_WORKFLOW,
  HALLYU_MARKETING,
  FUTURE_CONSIDERATIONS,
} from '../data/global-expansion';

// ============================================================================
// Sub-components
// ============================================================================

// 언어 우선순위 카드
function LanguagePrioritySection() {
  const priorityColors = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  const priorityLabels = {
    high: '우선',
    medium: '중간',
    low: '낮음',
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Languages className="w-5 h-5 text-blue-600" />
        타겟 언어 우선순위
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TARGET_LANGUAGES.map((lang) => (
          <div
            key={lang.code}
            className="bg-slate-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-bold text-gray-800">{lang.nativeName}</h4>
                <span className="text-sm text-gray-500">{lang.name}</span>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${priorityColors[lang.priority]}`}>
                {priorityLabels[lang.priority]}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">시장:</span> {lang.market}</p>
              <p><span className="font-medium">인구:</span> {lang.population}</p>
              <p><span className="font-medium">인터넷 사용자:</span> {lang.internetUsers}</p>
            </div>
            <p className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded-lg">
              {lang.reason}
            </p>
            {lang.challenges.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {lang.challenges.map((challenge, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    {challenge}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 글로벌 확장 로드맵
function GlobalRoadmapSection() {
  const [expandedPhase, setExpandedPhase] = useState<string | null>('phase-1');

  const statusIcons = {
    planned: <Clock className="w-4 h-4 text-gray-400" />,
    'in-progress': <AlertCircle className="w-4 h-4 text-blue-500" />,
    done: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  };

  const priorityColors = {
    high: 'text-red-600',
    medium: 'text-yellow-600',
    low: 'text-gray-500',
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Rocket className="w-5 h-5 text-purple-600" />
        글로벌 확장 로드맵
      </h3>
      <div className="space-y-3">
        {GLOBAL_PHASES.map((phase, idx) => (
          <div
            key={phase.id}
            className="border border-gray-200 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-green-500' : idx === 2 ? 'bg-purple-500' : 'bg-orange-500'
                  }`}>
                  {idx + 1}
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-gray-800">{phase.title}</h4>
                  <p className="text-sm text-gray-500">{phase.description}</p>
                </div>
              </div>
              {expandedPhase === phase.id ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedPhase === phase.id && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                {/* 목표 */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <Target className="w-4 h-4" /> 목표
                  </h5>
                  <ul className="space-y-1">
                    {phase.goals.map((goal, goalIdx) => (
                      <li key={goalIdx} className="text-sm text-gray-600 flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 태스크 */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <Zap className="w-4 h-4" /> 태스크
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {phase.tasks.map((task) => (
                      <div key={task.id} className="bg-slate-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {statusIcons[task.status]}
                            <span className="font-medium text-sm text-gray-800">{task.name}</span>
                          </div>
                          <span className={`text-xs ${priorityColors[task.priority]}`}>
                            {task.priority === 'high' ? '높음' : task.priority === 'medium' ? '중간' : '낮음'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 성공 지표 */}
                <div>
                  <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> 성공 지표
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {phase.successMetrics.map((metric, metricIdx) => (
                      <span key={metricIdx} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {metric}
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

// 시장별 전략
function MarketStrategySection() {
  const [selectedMarket, setSelectedMarket] = useState<string>(MARKET_STRATEGIES[0].region);
  const currentStrategy = MARKET_STRATEGIES.find(m => m.region === selectedMarket);

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-green-600" />
        시장별 전략
      </h3>

      {/* 시장 선택 탭 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {MARKET_STRATEGIES.map((strategy) => (
          <button
            key={strategy.region}
            onClick={() => setSelectedMarket(strategy.region)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedMarket === strategy.region
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {strategy.region}
          </button>
        ))}
      </div>

      {/* 선택된 시장 상세 */}
      {currentStrategy && (
        <div className="bg-slate-50 border border-gray-200 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">지원 언어</h4>
              <div className="flex flex-wrap gap-2">
                {currentStrategy.languages.map((lang) => (
                  <span key={lang} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {lang}
                  </span>
                ))}
              </div>

              <h4 className="font-medium text-gray-700 mb-2 mt-4">주요 플랫폼</h4>
              <div className="flex flex-wrap gap-2">
                {currentStrategy.platforms.map((platform) => (
                  <span key={platform} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                    {platform}
                  </span>
                ))}
              </div>

              <h4 className="font-medium text-gray-700 mb-2 mt-4">콘텐츠 전략</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {currentStrategy.contentStrategy}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-red-500" /> 도전 과제
              </h4>
              <ul className="space-y-1 mb-4">
                {currentStrategy.challenges.map((challenge, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    {challenge}
                  </li>
                ))}
              </ul>

              <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Zap className="w-4 h-4 text-green-500" /> 기회 요소
              </h4>
              <ul className="space-y-1">
                {currentStrategy.opportunities.map((opp, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    {opp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 번역 전략 섹션
function TranslationStrategySection() {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Flag className="w-5 h-5 text-orange-600" />
        번역 전략
      </h3>

      {/* 번역 접근법 */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 mb-4">
        <p className="text-sm font-medium text-orange-800">
          접근 방식: <span className="font-bold">{TRANSLATION_STRATEGY.approach}</span>
        </p>
      </div>

      {/* 품질 티어 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {TRANSLATION_STRATEGY.qualityTiers.map((tier) => (
          <div key={tier.tier} className={`rounded-xl p-4 border ${tier.tier === 'Premium' ? 'bg-yellow-50 border-yellow-200' :
            tier.tier === 'Standard' ? 'bg-blue-50 border-blue-200' :
              'bg-gray-50 border-gray-200'
            }`}>
            <h4 className="font-bold text-gray-800 mb-2">{tier.tier}</h4>
            <div className="flex flex-wrap gap-1 mb-2">
              {tier.languages.map((lang) => (
                <span key={lang} className="text-xs bg-slate-50 px-2 py-0.5 rounded">
                  {lang}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-600">{tier.method}</p>
            <p className="text-xs text-gray-500 mt-1 italic">{tier.reason}</p>
          </div>
        ))}
      </div>

      {/* 콘텐츠 타입별 */}
      <div className="bg-slate-50 border border-gray-200 rounded-xl p-4">
        <h4 className="font-medium text-gray-700 mb-3">콘텐츠 타입별 번역 계획</h4>
        <div className="space-y-2">
          {TRANSLATION_STRATEGY.contentTypes.map((content) => (
            <div key={content.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <span className="font-medium text-gray-800">{content.type}</span>
                <span className="text-xs text-gray-500 ml-2">{content.description}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500">{content.volume}</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{content.method}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${content.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                  {content.priority === 'high' ? '높음' : '중간'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 워크플로우 섹션
function WorkflowSection() {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-indigo-600" />
        번역 워크플로우
      </h3>

      {/* 프로세스 */}
      <div className="bg-indigo-50 rounded-xl p-4 mb-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {TRANSLATION_WORKFLOW.process.map((step, idx) => (
            <div key={step.step} className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-slate-50 shadow-md flex items-center justify-center font-bold text-indigo-600">
                  {step.step}
                </div>
                <span className="text-xs font-medium text-gray-700 mt-1 text-center max-w-[100px]">
                  {step.action}
                </span>
                <span className="text-[10px] text-gray-500">{step.tool}</span>
              </div>
              {idx < TRANSLATION_WORKFLOW.process.length - 1 && (
                <ChevronRight className="w-4 h-4 text-indigo-400" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 도구 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TRANSLATION_WORKFLOW.tools.map((tool) => (
          <div key={tool.name} className="bg-slate-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-1">{tool.name}</h4>
            <p className="text-sm text-gray-600 mb-2">{tool.use}</p>
            <div className="flex gap-4">
              <div>
                <span className="text-xs text-green-600 font-medium">장점</span>
                <ul className="text-xs text-gray-500">
                  {tool.pros.map((pro, idx) => (
                    <li key={idx}>+ {pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-xs text-red-600 font-medium">단점</span>
                <ul className="text-xs text-gray-500">
                  {tool.cons.map((con, idx) => (
                    <li key={idx}>- {con}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 한류 마케팅 전략
function HallyuMarketingSection() {
  const fandomIcons: Record<string, React.ReactNode> = {
    'K-pop': <Music className="w-5 h-5 text-pink-500" />,
    'K-drama': <Tv className="w-5 h-5 text-purple-500" />,
    'K-beauty/Fashion': <Sparkles className="w-5 h-5 text-rose-500" />,
  };

  const impactColors: Record<string, string> = {
    'very high': 'bg-red-100 text-red-700',
    high: 'bg-orange-100 text-orange-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Heart className="w-5 h-5 text-pink-600" />
        한류 마케팅 전략
      </h3>

      {/* 개요 */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 mb-4">
        <p className="text-sm font-medium text-pink-800">
          {HALLYU_MARKETING.overview}
        </p>
      </div>

      {/* 타겟 팬덤 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {HALLYU_MARKETING.targetFandoms.map((fandom) => (
          <div key={fandom.type} className="bg-slate-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              {fandomIcons[fandom.type]}
              <h4 className="font-bold text-gray-800">{fandom.type}</h4>
            </div>
            <p className="text-xs text-gray-500 mb-2">{fandom.reach}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {fandom.regions.map((region) => (
                <span key={region} className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded">
                  {region}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-600 mb-2">{fandom.strategy}</p>
            <div className="border-t pt-2 mt-2">
              <span className="text-xs font-medium text-gray-500">예시:</span>
              <ul className="text-xs text-gray-600">
                {fandom.examples.map((ex, idx) => (
                  <li key={idx}>• {ex}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* 전술 */}
      <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 mb-4">
        <h4 className="font-medium text-gray-700 mb-3">마케팅 전술</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {HALLYU_MARKETING.tactics.map((tactic) => (
            <div key={tactic.name} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <span className="font-medium text-gray-800">{tactic.name}</span>
                <p className="text-xs text-gray-500 mt-1">{tactic.description}</p>
              </div>
              <div className="flex flex-col items-end gap-1 ml-2">
                <span className={`text-xs px-2 py-0.5 rounded ${impactColors[tactic.impact]}`}>
                  임팩트: {tactic.impact}
                </span>
                <span className="text-xs text-gray-400">
                  노력: {tactic.effort}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 플랫폼 & 리스크 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-medium text-blue-700 mb-2">K-pop 활성 플랫폼</h4>
          <div className="space-y-2">
            {HALLYU_MARKETING.platforms.map((platform) => (
              <div key={platform.name} className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-800">{platform.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{platform.regions.join(', ')}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${platform.kpopActivity === 'very high' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                    {platform.kpopActivity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h4 className="font-medium text-yellow-700 mb-2">리스크 & 주의사항</h4>
          <ul className="space-y-2">
            {HALLYU_MARKETING.risks.map((risk, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                {risk}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// 추가 고려사항
function FutureConsiderationsSection() {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-gray-600" />
        추가 고려사항
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 제외 시장 */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h4 className="font-medium text-red-700 mb-2">제외 시장</h4>
          {FUTURE_CONSIDERATIONS.excludedMarkets.map((market) => (
            <div key={market.region} className="text-sm">
              <span className="font-medium text-gray-800">{market.region}</span>
              <p className="text-gray-600 text-xs">{market.reason}</p>
            </div>
          ))}
        </div>

        {/* 현지 메신저 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-medium text-blue-700 mb-2">현지 메신저 공유</h4>
          <div className="space-y-1">
            {FUTURE_CONSIDERATIONS.localMessengers.map((msg) => (
              <div key={msg.region} className="flex items-center justify-between text-sm">
                <span className="text-gray-800">{msg.region}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{msg.app}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${msg.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                    {msg.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 수익화 */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <h4 className="font-medium text-green-700 mb-2">수익화 (광고 단가)</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-green-800">High CPM ($5-15):</span>
              <span className="text-gray-600 ml-2">{FUTURE_CONSIDERATIONS.monetization.highCPM.join(', ')}</span>
            </div>
            <div>
              <span className="font-medium text-yellow-800">Medium CPM ($2-5):</span>
              <span className="text-gray-600 ml-2">{FUTURE_CONSIDERATIONS.monetization.mediumCPM.join(', ')}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Low CPM ($0.5-2):</span>
              <span className="text-gray-600 ml-2">{FUTURE_CONSIDERATIONS.monetization.lowCPM.join(', ')}</span>
            </div>
            <div>
              <span className="font-medium text-gray-500">Very Low CPM ($0.1-0.5):</span>
              <span className="text-gray-600 ml-2">{FUTURE_CONSIDERATIONS.monetization.veryLowCPM.join(', ')}</span>
            </div>
            <p className="text-xs text-gray-500 italic mt-2">{FUTURE_CONSIDERATIONS.monetization.note}</p>
          </div>
        </div>

        {/* 법적 이슈 */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <h4 className="font-medium text-purple-700 mb-2">법적/규제 이슈</h4>
          <div className="space-y-2">
            {FUTURE_CONSIDERATIONS.legal.map((item) => (
              <div key={item.issue} className="text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">{item.region}</span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">{item.issue}</span>
                </div>
                <p className="text-xs text-gray-600">{item.action}</p>
              </div>
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

export default function GlobalExpansion() {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Globe className="w-8 h-8" />
          <h1 className="text-2xl font-bold">글로벌 확장 전략</h1>
        </div>
        <p className="text-blue-100">
          다국어 지원 및 해외 시장 진출 로드맵
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="bg-slate-50/20 rounded-lg px-3 py-2">
            <span className="font-medium">{TARGET_LANGUAGES.length}</span>
            <span className="ml-1 text-blue-100">개 타겟 언어</span>
          </div>
          <div className="bg-slate-50/20 rounded-lg px-3 py-2">
            <span className="font-medium">{GLOBAL_PHASES.length}</span>
            <span className="ml-1 text-blue-100">단계 로드맵</span>
          </div>
          <div className="bg-slate-50/20 rounded-lg px-3 py-2">
            <span className="font-medium">{MARKET_STRATEGIES.length}</span>
            <span className="ml-1 text-blue-100">개 타겟 시장</span>
          </div>
        </div>
      </div>

      {/* 언어 우선순위 */}
      <LanguagePrioritySection />

      {/* 글로벌 로드맵 */}
      <GlobalRoadmapSection />

      {/* 시장별 전략 */}
      <MarketStrategySection />

      {/* 번역 전략 */}
      <TranslationStrategySection />

      {/* 워크플로우 */}
      <WorkflowSection />

      {/* 한류 마케팅 전략 */}
      <HallyuMarketingSection />

      {/* 추가 고려사항 */}
      <FutureConsiderationsSection />
    </div>
  );
}
