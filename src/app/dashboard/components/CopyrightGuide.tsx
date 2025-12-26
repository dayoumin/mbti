'use client';

import { useState } from 'react';
import {
  RELATED_LAWS,
  LEGAL_CASES,
  CONTENT_TYPE_GUIDES,
  IMAGE_STRATEGIES,
  CHECKLIST,
  SAFE_PROMPT_TIPS
} from '../data/copyright-guide';

type TabKey = 'overview' | 'contentTypes' | 'strategies' | 'cases' | 'checklist';

export default function CopyrightGuide() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'overview', label: '개요', icon: '📋' },
    { key: 'contentTypes', label: '콘텐츠 유형별', icon: '🎨' },
    { key: 'strategies', label: '이미지 전략', icon: '💡' },
    { key: 'cases', label: '판례', icon: '⚖️' },
    { key: 'checklist', label: '체크리스트', icon: '✅' },
  ];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
        <div className="flex items-start gap-4">
          <div className="text-4xl">⚠️</div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">저작권/초상권 가이드</h2>
            <p className="text-gray-600 mt-1">
              콘텐츠 제작 시 법적 주의사항 및 안전한 이미지 사용 전략
            </p>
            <p className="text-sm text-red-600 mt-2 font-medium">
              핵심: &quot;초상인을 알아볼 수 있는 정도&quot;면 수채화/일러스트여도 침해!
            </p>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'contentTypes' && <ContentTypesTab />}
      {activeTab === 'strategies' && <StrategiesTab />}
      {activeTab === 'cases' && <CasesTab />}
      {activeTab === 'checklist' && <ChecklistTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* 핵심 결론 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">핵심 결론</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="text-2xl mb-2">❌</div>
            <h4 className="font-bold text-red-800">사용 불가</h4>
            <ul className="text-sm text-red-700 mt-2 space-y-1">
              <li>• 실제 연예인 사진</li>
              <li>• 연예인 얼굴 AI 변환 (수채화/일러스트)</li>
              <li>• 누구인지 알아볼 수 있는 모든 이미지</li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-2xl mb-2">✅</div>
            <h4 className="font-bold text-green-800">사용 가능</h4>
            <ul className="text-sm text-green-700 mt-2 space-y-1">
              <li>• 가상 인물 AI 생성</li>
              <li>• 상황/분위기 일러스트</li>
              <li>• 연예인 이름만 (이미지 없이)</li>
              <li>• 추상적 아이콘/이모지</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 관련 법률 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">관련 법률</h3>
        <div className="space-y-3">
          {RELATED_LAWS.map((law, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{law.icon}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{law.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{law.description}</p>
                  <p className="text-sm text-red-600 mt-2 font-medium">
                    처벌: {law.penalty}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 안전한 프롬프트 팁 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">AI 이미지 생성 시 안전 팁</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {SAFE_PROMPT_TIPS.map((tip, index) => (
            <div key={index} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">{tip.tip}</h4>
              <code className="text-xs bg-blue-100 px-2 py-1 rounded text-blue-700 block">
                {tip.example}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContentTypesTab() {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'safe': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'high': return '위험';
      case 'medium': return '주의';
      case 'low': return '낮음';
      case 'safe': return '안전';
      default: return risk;
    }
  };

  return (
    <div className="space-y-4">
      {CONTENT_TYPE_GUIDES.map((guide, index) => (
        <div
          key={index}
          className={`bg-white rounded-xl border p-6 ${
            guide.canUse ? 'border-green-200' : 'border-red-200'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="text-3xl">{guide.icon}</div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-gray-800">{guide.type}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRiskColor(guide.risk)}`}>
                    {getRiskLabel(guide.risk)}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{guide.description}</p>
                <p className={`text-sm mt-2 font-medium ${guide.canUse ? 'text-green-600' : 'text-red-600'}`}>
                  → {guide.recommendation}
                </p>
              </div>
            </div>
            <div className="text-3xl">
              {guide.canUse ? '✅' : '❌'}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">예시:</p>
            <div className="flex flex-wrap gap-2">
              {guide.examples.map((example, i) => (
                <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {example}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StrategiesTab() {
  return (
    <div className="space-y-6">
      {IMAGE_STRATEGIES.map((strategy, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{strategy.icon}</span>
              <div>
                <h3 className="font-bold text-gray-800">{strategy.contentType}</h3>
                <p className="text-sm text-purple-600 font-medium">{strategy.strategy}</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <h4 className="text-sm font-medium text-gray-500 mb-3">적용 예시</h4>
            <div className="grid md:grid-cols-2 gap-3">
              {strategy.examples.map((example, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">{example}</span>
                </div>
              ))}
            </div>
            {strategy.prompts && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-2">프롬프트 예시</h4>
                {strategy.prompts.map((prompt, i) => (
                  <code key={i} className="block text-xs bg-gray-50 px-3 py-2 rounded mb-2 text-gray-600">
                    {prompt}
                  </code>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function CasesTab() {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
        <p className="text-sm text-amber-800">
          <strong>참고:</strong> 아래 판례들은 초상권/퍼블리시티권 침해에 대한 실제 법원 판결입니다.
          상업적 목적의 무단 사용은 높은 배상금으로 이어질 수 있습니다.
        </p>
      </div>

      {LEGAL_CASES.map((legalCase, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-gray-800">{legalCase.title}</h3>
                <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                  {legalCase.year}
                </span>
              </div>
              <p className="text-gray-600 mt-2">{legalCase.result}</p>
              {legalCase.amount && (
                <p className="text-red-600 font-bold mt-2 text-lg">
                  배상금: {legalCase.amount}
                </p>
              )}
            </div>
            <span className="text-3xl">⚖️</span>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <a
              href={legalCase.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              📰 {legalCase.source}에서 보기 →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChecklistTab() {
  return (
    <div className="space-y-6">
      {/* 체크리스트 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">이미지 사용 전 체크리스트</h3>
        <div className="space-y-4">
          {CHECKLIST.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-800 mb-3">
                Q{index + 1}. {item.question}
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <span className="text-sm font-medium text-green-800">
                    아니오 → {item.no}
                  </span>
                </div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <span className="text-sm font-medium text-red-800">
                    예 → {item.yes}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 빠른 결정 가이드 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">빠른 결정 가이드</h3>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-4">
              <span className="font-mono bg-gray-200 px-3 py-1 rounded">이상형 테스트</span>
              <span>→</span>
              <span className="text-green-600 font-medium">가상 인물 + 상황 일러스트</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono bg-gray-200 px-3 py-1 rounded">연예인 월드컵</span>
              <span>→</span>
              <span className="text-green-600 font-medium">이름 + 이모지만 (이미지 없음)</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono bg-gray-200 px-3 py-1 rounded">성격 테스트</span>
              <span>→</span>
              <span className="text-green-600 font-medium">추상적 심리 일러스트</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono bg-gray-200 px-3 py-1 rounded">궁합 테스트</span>
              <span>→</span>
              <span className="text-green-600 font-medium">두 요소 조화 추상 이미지</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
