'use client';

import React, { useState } from 'react';
import {
  POST_DETAIL_TEST_STRATEGY,
  USER_NEEDS,
  DETAIL_TEST_CATEGORIES,
  IMPLEMENTATION_ROADMAP,
  KEY_METRICS,
  USER_JOURNEY_FLOW,
  COMMUNITY_CONNECTIONS,
  type UserNeed,
  type JourneyPhase,
} from '../data/post-detail-test';

// ============================================================================
// 탭 정의
// ============================================================================

type TabId = 'journey' | 'needs' | 'categories' | 'roadmap' | 'metrics' | 'community';

const TABS: { id: TabId; name: string; icon: string }[] = [
  { id: 'journey', name: '사용자 여정', icon: '🗺️' },
  { id: 'needs', name: '사용자 니즈', icon: '💡' },
  { id: 'categories', name: '테스트별 연결', icon: '🔗' },
  { id: 'roadmap', name: '구현 로드맵', icon: '📅' },
  { id: 'metrics', name: '핵심 지표', icon: '📊' },
  { id: 'community', name: '커뮤니티 연결', icon: '👥' },
];

// ============================================================================
// 유틸리티
// ============================================================================

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-600',
};

const phaseColors: Record<JourneyPhase, string> = {
  immediate: 'bg-green-100 text-green-700',
  'short-term': 'bg-blue-100 text-blue-700',
  'long-term': 'bg-purple-100 text-purple-700',
};

const phaseLabels: Record<JourneyPhase, string> = {
  immediate: '즉시',
  'short-term': '단기',
  'long-term': '장기',
};

const statusColors: Record<string, string> = {
  planned: 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
};

// ============================================================================
// 사용자 여정 탭
// ============================================================================

function JourneyTab() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">{USER_JOURNEY_FLOW.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{USER_JOURNEY_FLOW.description}</p>
      </div>

      {/* 여정 플로우 */}
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div className="space-y-6">
          {USER_JOURNEY_FLOW.stages.map((stage, idx) => (
            <div key={stage.id} className="relative flex items-start gap-4">
              {/* 아이콘 */}
              <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-white border-2 border-gray-200 text-2xl">
                {stage.emoji}
              </div>
              {/* 내용 */}
              <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-400">STEP {idx + 1}</span>
                </div>
                <h4 className="font-bold text-gray-800">{stage.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                <p className="text-xs text-gray-400 mt-2 italic">예: {stage.example}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 사용자 니즈 탭
// ============================================================================

function NeedsTab() {
  const [selectedPhase, setSelectedPhase] = useState<JourneyPhase | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredNeeds = selectedPhase === 'all'
    ? USER_NEEDS
    : USER_NEEDS.filter(n => n.phase === selectedPhase);

  return (
    <div className="space-y-4">
      {/* 필터 */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedPhase('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedPhase === 'all'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          전체 ({USER_NEEDS.length})
        </button>
        {(['immediate', 'short-term', 'long-term'] as JourneyPhase[]).map(phase => (
          <button
            key={phase}
            onClick={() => setSelectedPhase(phase)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedPhase === phase
                ? 'bg-gray-800 text-white'
                : `${phaseColors[phase]} hover:opacity-80`
            }`}
          >
            {phaseLabels[phase]} ({USER_NEEDS.filter(n => n.phase === phase).length})
          </button>
        ))}
      </div>

      {/* 니즈 목록 */}
      <div className="space-y-3">
        {filteredNeeds.map(need => (
          <div
            key={need.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            {/* 헤더 */}
            <button
              onClick={() => setExpandedId(expandedId === need.id ? null : need.id)}
              className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-gray-800">{need.title}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[need.priority]}`}>
                      {need.priority === 'high' ? '높음' : need.priority === 'medium' ? '중간' : '낮음'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${phaseColors[need.phase]}`}>
                      {phaseLabels[need.phase]}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[need.status]}`}>
                      {need.status === 'planned' ? '계획' : need.status === 'in-progress' ? '진행중' : '완료'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{need.description}</p>
                  <p className="text-xs text-gray-400 mt-2 italic">{need.userScenario}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>난이도 {need.difficulty}/5</span>
                  <span>|</span>
                  <span>임팩트 {need.impact}/5</span>
                  <span className="text-lg">{expandedId === need.id ? '▲' : '▼'}</span>
                </div>
              </div>
            </button>

            {/* 상세 내용 */}
            {expandedId === need.id && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="mt-3 space-y-3">
                  {/* 세부 항목 */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">세부 항목</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {need.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 데이터 요구사항 */}
                  {need.dataRequirements && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">데이터 요구사항</h5>
                      <div className="bg-gray-50 rounded p-2">
                        <code className="text-xs text-gray-600">
                          {need.dataRequirements.join('\n')}
                        </code>
                      </div>
                    </div>
                  )}

                  {/* 관련 기능 */}
                  {need.relatedFeatures && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">관련 기능</h5>
                      <div className="flex gap-1 flex-wrap">
                        {need.relatedFeatures.map(feature => (
                          <span key={feature} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 테스트별 연결 탭
// ============================================================================

function CategoriesTab() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* 카테고리 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {DETAIL_TEST_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
            className={`p-4 rounded-lg border-2 transition-colors text-left ${
              selectedCategory === cat.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">{cat.icon}</div>
            <h4 className="font-bold text-gray-800">{cat.name}</h4>
            <p className="text-xs text-gray-500 mt-1">{cat.resultTypes.length}개 결과 유형</p>
          </button>
        ))}
      </div>

      {/* 선택된 카테고리 상세 */}
      {selectedCategory && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          {(() => {
            const cat = DETAIL_TEST_CATEGORIES.find(c => c.id === selectedCategory);
            if (!cat) return null;
            return (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{cat.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-800">{cat.name}</h3>
                    <p className="text-sm text-gray-500">상위 테스트: {cat.parentTest}</p>
                  </div>
                </div>

                {/* 결과 유형 */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">결과 유형 ({cat.resultTypes.length}개)</h4>
                  <div className="flex flex-wrap gap-1">
                    {cat.resultTypes.map(type => (
                      <span key={type} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 연결된 니즈 */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">필요한 후속 기능</h4>
                  <div className="space-y-2">
                    {cat.postTestNeeds.map(needId => {
                      const need = USER_NEEDS.find(n => n.id === needId);
                      if (!need) return null;
                      return (
                        <div key={needId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">{need.title}</span>
                          <div className="flex gap-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[need.priority]}`}>
                              {need.priority === 'high' ? '높음' : need.priority === 'medium' ? '중간' : '낮음'}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[need.status]}`}>
                              {need.status === 'planned' ? '계획' : need.status === 'in-progress' ? '진행중' : '완료'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 로드맵 탭
// ============================================================================

function RoadmapTab() {
  return (
    <div className="space-y-6">
      {IMPLEMENTATION_ROADMAP.map((phase, phaseIdx) => (
        <div key={phase.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* 페이즈 헤더 */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                  {phaseIdx + 1}
                </span>
                <h3 className="font-bold text-gray-800">{phase.name}</h3>
              </div>
              <span className="text-sm text-gray-500">{phase.duration}</span>
            </div>
          </div>

          {/* 아이템 목록 */}
          <div className="p-4 space-y-4">
            {phase.items.map(item => {
              const need = USER_NEEDS.find(n => n.id === item.needId);
              return (
                <div key={item.needId} className="border-l-2 border-blue-200 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-800">{need?.title || item.needId}</h4>
                    {need && (
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[need.priority]}`}>
                        {need.priority === 'high' ? '높음' : need.priority === 'medium' ? '중간' : '낮음'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <div>
                    <h5 className="text-xs font-medium text-gray-500 mb-1">산출물</h5>
                    <ul className="text-xs text-gray-600 space-y-0.5">
                      {item.deliverables.map((d, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-gray-400">✓</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// 지표 탭
// ============================================================================

function MetricsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {KEY_METRICS.map(metric => (
        <div key={metric.id} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-bold text-gray-800">{metric.name}</h4>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
              목표: {metric.target}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{metric.description}</p>
          <div className="bg-gray-50 rounded p-2">
            <p className="text-xs text-gray-500">측정 방법</p>
            <code className="text-xs text-gray-700">{metric.measurement}</code>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// 커뮤니티 연결 탭
// ============================================================================

function CommunityTab() {
  return (
    <div className="space-y-4">
      {COMMUNITY_CONNECTIONS.map(conn => (
        <div key={conn.id} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">👥</span>
            <h4 className="font-bold text-gray-800">{conn.name}</h4>
          </div>
          <p className="text-sm text-gray-600 mb-3">{conn.description}</p>

          <div className="text-xs text-gray-500 mb-3">
            <strong>대상:</strong> {conn.targetAudience}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 콘텐츠 아이디어 */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">콘텐츠 아이디어</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {conn.contentIdeas.map((idea, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-500">💬</span>
                    {idea}
                  </li>
                ))}
              </ul>
            </div>

            {/* 모더레이션 노트 */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">운영 주의사항</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {conn.moderationNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-yellow-500">⚠️</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function PostDetailTestStrategy() {
  const [activeTab, setActiveTab] = useState<TabId>('journey');

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800">세부 테스트 후 사용자 여정</h2>
        <p className="text-sm text-gray-500 mt-1">
          PetMatch → 세부 테스트(품종 추천) 완료 후 다음 단계 전략
        </p>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="text-sm font-medium">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* 탭 내용 */}
      <div className="min-h-[400px]">
        {activeTab === 'journey' && <JourneyTab />}
        {activeTab === 'needs' && <NeedsTab />}
        {activeTab === 'categories' && <CategoriesTab />}
        {activeTab === 'roadmap' && <RoadmapTab />}
        {activeTab === 'metrics' && <MetricsTab />}
        {activeTab === 'community' && <CommunityTab />}
      </div>
    </div>
  );
}
