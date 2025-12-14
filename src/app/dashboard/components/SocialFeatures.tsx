'use client';

import React, { useState } from 'react';
import {
  SOCIAL_PHASES,
  SOCIAL_FEATURES,
  OBSERVE_OTHERS_FEATURES,
  SOCIAL_IMPLEMENTATION_PRIORITY,
  SOCIAL_METRICS,
  type SocialFeaturePhase,
  type SocialFeature,
} from '../data/social-features';

// ============================================================================
// Types
// ============================================================================

type TabId = 'overview' | 'phases' | 'observe' | 'roadmap' | 'metrics';

const TABS: { id: TabId; name: string; icon: string }[] = [
  { id: 'overview', name: '개요', icon: '🗺️' },
  { id: 'phases', name: '단계별 기능', icon: '📊' },
  { id: 'observe', name: '다른 사람 살피기', icon: '👀' },
  { id: 'roadmap', name: '구현 우선순위', icon: '📅' },
  { id: 'metrics', name: '핵심 지표', icon: '📈' },
];

// ============================================================================
// 유틸리티
// ============================================================================

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-600',
};

const statusColors: Record<string, string> = {
  planned: 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
};

// ============================================================================
// 개요 탭
// ============================================================================

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* 단계 흐름 */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">소셜 기능 단계</h3>
        <p className="text-sm text-gray-500 mt-1">공유 → 비교 → 발견 → 연결 → 커뮤니티</p>
      </div>

      {/* 단계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {SOCIAL_PHASES.map((phase, idx) => (
          <div
            key={phase.id}
            className="bg-white rounded-lg border-2 p-4 text-center"
            style={{ borderColor: phase.color }}
          >
            <div className="text-3xl mb-2">{phase.emoji}</div>
            <h4 className="font-bold text-gray-800">{phase.name}</h4>
            <p className="text-xs text-gray-500 mt-1">{phase.description}</p>
            <div className="mt-2 text-xs text-gray-400">
              {phase.features.length}개 기능
            </div>
          </div>
        ))}
      </div>

      {/* 핵심 질문 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-3">각 단계의 핵심 질문</h4>
        <div className="space-y-2">
          {SOCIAL_PHASES.map(phase => (
            <div key={phase.id} className="flex items-start gap-3">
              <span className="text-xl">{phase.emoji}</span>
              <div>
                <span className="font-medium text-gray-700">{phase.name}:</span>
                <span className="text-sm text-gray-600 ml-2">{phase.keyQuestion}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 요약 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{SOCIAL_FEATURES.length}</div>
          <div className="text-sm text-gray-500">총 기능 수</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {SOCIAL_FEATURES.filter(f => f.priority === 'high').length}
          </div>
          <div className="text-sm text-gray-500">높은 우선순위</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {SOCIAL_FEATURES.filter(f => f.status === 'done').length}
          </div>
          <div className="text-sm text-gray-500">완료된 기능</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {SOCIAL_IMPLEMENTATION_PRIORITY.length}
          </div>
          <div className="text-sm text-gray-500">구현 단계</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 단계별 기능 탭
// ============================================================================

function PhasesTab() {
  const [selectedPhase, setSelectedPhase] = useState<SocialFeaturePhase | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFeatures = selectedPhase === 'all'
    ? SOCIAL_FEATURES
    : SOCIAL_FEATURES.filter(f => f.phase === selectedPhase);

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
          전체 ({SOCIAL_FEATURES.length})
        </button>
        {SOCIAL_PHASES.map(phase => (
          <button
            key={phase.id}
            onClick={() => setSelectedPhase(phase.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
              selectedPhase === phase.id
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{phase.emoji}</span>
            <span>{phase.name}</span>
            <span className="opacity-60">({SOCIAL_FEATURES.filter(f => f.phase === phase.id).length})</span>
          </button>
        ))}
      </div>

      {/* 기능 목록 */}
      <div className="space-y-3">
        {filteredFeatures.map(feature => (
          <div
            key={feature.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            {/* 헤더 */}
            <button
              onClick={() => setExpandedId(expandedId === feature.id ? null : feature.id)}
              className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg">
                      {SOCIAL_PHASES.find(p => p.id === feature.phase)?.emoji}
                    </span>
                    <h4 className="font-bold text-gray-800">{feature.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[feature.priority]}`}>
                      {feature.priority === 'high' ? '높음' : feature.priority === 'medium' ? '중간' : '낮음'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[feature.status]}`}>
                      {feature.status === 'planned' ? '계획' : feature.status === 'in-progress' ? '진행중' : '완료'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                  <p className="text-xs text-gray-400 mt-2 italic">{feature.userScenario}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>난이도 {feature.difficulty}/5</span>
                  <span>|</span>
                  <span>임팩트 {feature.impact}/5</span>
                  <span className="text-lg">{expandedId === feature.id ? '▲' : '▼'}</span>
                </div>
              </div>
            </button>

            {/* 상세 */}
            {expandedId === feature.id && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 요구사항 */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">요구사항</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {feature.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 지표 */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">측정 지표</h5>
                    <div className="flex flex-wrap gap-1">
                      {feature.metrics.map(metric => (
                        <span key={metric} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                          {metric}
                        </span>
                      ))}
                    </div>
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

// ============================================================================
// 다른 사람 살피기 탭
// ============================================================================

function ObserveTab() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">{OBSERVE_OTHERS_FEATURES.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{OBSERVE_OTHERS_FEATURES.description}</p>
      </div>

      {/* 시나리오별 카드 */}
      <div className="space-y-4">
        {OBSERVE_OTHERS_FEATURES.scenarios.map(scenario => (
          <div key={scenario.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">👀</span>
              <div>
                <h4 className="font-bold text-gray-800">{scenario.name}</h4>
                <p className="text-sm text-gray-600 italic">{scenario.question}</p>
              </div>
            </div>
            <div className="pl-10">
              <h5 className="text-xs font-medium text-gray-500 mb-2">제공할 기능</h5>
              <div className="flex flex-wrap gap-2">
                {scenario.features.map(feature => (
                  <span key={feature} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 구현 우선순위 탭
// ============================================================================

function RoadmapTab() {
  return (
    <div className="space-y-6">
      {SOCIAL_IMPLEMENTATION_PRIORITY.map((phase, idx) => (
        <div key={phase.phase} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  {phase.phase}
                </span>
                <h3 className="font-bold">{phase.name}</h3>
              </div>
              <span className="text-sm opacity-80">{phase.duration}</span>
            </div>
          </div>

          {/* 내용 */}
          <div className="p-4 space-y-4">
            {/* 포커스 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">핵심 포커스</h4>
              <p className="text-sm text-gray-600">{phase.focus}</p>
            </div>

            {/* 기능 목록 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">포함 기능</h4>
              <div className="flex flex-wrap gap-2">
                {phase.features.map(featureId => {
                  const feature = SOCIAL_FEATURES.find(f => f.id === featureId);
                  return (
                    <span
                      key={featureId}
                      className={`px-3 py-1 rounded-full text-sm ${
                        feature?.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : feature?.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {feature?.name || featureId}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* KPI */}
            <div className="bg-green-50 rounded p-3">
              <h4 className="text-sm font-medium text-green-800 mb-1">목표 KPI</h4>
              <p className="text-sm text-green-700">{phase.kpi}</p>
            </div>
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
    <div className="space-y-6">
      {SOCIAL_METRICS.map(category => (
        <div key={category.category} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h3 className="font-bold text-gray-800">{category.category}</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.metrics.map(metric => (
                <div key={metric.id} className="bg-gray-50 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{metric.name}</h4>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                      {metric.target}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{metric.formula}</p>
                </div>
              ))}
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

export default function SocialFeatures() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800">소셜 기능 전략</h2>
        <p className="text-sm text-gray-500 mt-1">
          공유 → 비교 → 발견 → 연결 → 커뮤니티 단계별 기능
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
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'phases' && <PhasesTab />}
        {activeTab === 'observe' && <ObserveTab />}
        {activeTab === 'roadmap' && <RoadmapTab />}
        {activeTab === 'metrics' && <MetricsTab />}
      </div>
    </div>
  );
}
