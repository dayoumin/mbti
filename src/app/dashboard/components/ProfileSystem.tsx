'use client';

import { useState } from 'react';
import {
  User,
  Sparkles,
  Heart,
  Palette,
  TrendingUp,
  Share2,
  Eye,
  Layers,
  Calendar,
  Star,
  Target,
  Zap,
  Award,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle2,
  ChevronRight,
  Coffee,
  Leaf,
} from 'lucide-react';
import {
  PROFILE_CONCEPT,
  PROFILE_SECTIONS,
  ProfileSection,
  VISUALIZATION_LIBRARIES,
  PROFILE_CARDS,
  PROFILE_ROADMAP,
  PROFILE_COMPONENTS,
  MyProfile,
} from '../data/my-profile';

// ============================================================================
// Icons
// ============================================================================

const SECTION_ICONS: Record<string, React.ReactNode> = {
  personality: <User className="w-5 h-5" />,
  petChemi: <Heart className="w-5 h-5" />,
  careScores: <Star className="w-5 h-5" />,
  relationship: <Sparkles className="w-5 h-5" />,
  lifestyle: <Coffee className="w-5 h-5" />,
};

const VISUAL_TYPE_ICONS: Record<string, React.ReactNode> = {
  radar: <PieChart className="w-4 h-4" />,
  bar: <BarChart3 className="w-4 h-4" />,
  gauge: <Activity className="w-4 h-4" />,
  card: <Layers className="w-4 h-4" />,
  badge: <Award className="w-4 h-4" />,
};

// ============================================================================
// Main Component
// ============================================================================

export default function ProfileSystem() {
  const [activeTab, setActiveTab] = useState<'concept' | 'sections' | 'visualization' | 'components' | 'roadmap'>('concept');

  return (
    <div className="space-y-6">
      {/* Header - 컨셉 강조 */}
      <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-2xl p-6 border border-purple-500/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--db-text)]">{PROFILE_CONCEPT.title}</h2>
            <p className="text-[var(--db-muted)] text-sm">{PROFILE_CONCEPT.subtitle}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {PROFILE_CONCEPT.userValue.map((value, i) => (
            <span key={i} className="px-3 py-1.5 bg-white/10 rounded-full text-xs text-[var(--db-text)]">
              {value}
            </span>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'concept', label: '핵심 컨셉', icon: <Eye className="w-4 h-4" /> },
          { key: 'sections', label: '프로필 섹션', icon: <Layers className="w-4 h-4" /> },
          { key: 'visualization', label: '시각화', icon: <BarChart3 className="w-4 h-4" /> },
          { key: 'components', label: 'UI 컴포넌트', icon: <Palette className="w-4 h-4" /> },
          { key: 'roadmap', label: '구현 로드맵', icon: <Calendar className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-[var(--db-panel)] text-[var(--db-muted)] hover:text-[var(--db-text)]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'concept' && <ConceptTab />}
      {activeTab === 'sections' && <SectionsTab />}
      {activeTab === 'visualization' && <VisualizationTab />}
      {activeTab === 'components' && <ComponentsTab />}
      {activeTab === 'roadmap' && <RoadmapTab />}
    </div>
  );
}

// ============================================================================
// Concept Tab - 핵심 아이디어
// ============================================================================

function ConceptTab() {
  return (
    <div className="space-y-6">
      {/* Before/After 비교 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[var(--db-panel)] rounded-xl p-5 border border-red-500/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <span className="text-red-400">AS-IS</span>
            </div>
            <h3 className="font-medium text-red-400">현재 문제점</h3>
          </div>
          <div className="space-y-2 text-sm text-[var(--db-muted)]">
            <p>테스트 완료 → 결과 나열 → 끝</p>
            <p className="text-xs opacity-70">결과가 쌓이지만 의미없는 리스트</p>
          </div>
        </div>

        <div className="bg-[var(--db-panel)] rounded-xl p-5 border border-green-500/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
              <span className="text-green-400">TO-BE</span>
            </div>
            <h3 className="font-medium text-green-400">개선 방향</h3>
          </div>
          <div className="space-y-2 text-sm text-[var(--db-muted)]">
            <p>테스트 완료 → 프로필에 반영 → &quot;나&quot;가 점점 그려짐</p>
            <p className="text-xs opacity-70">귀엽고 세련된 나만의 프로필 성장</p>
          </div>
        </div>
      </div>

      {/* 성장 스토리 */}
      <div className="bg-[var(--db-panel)] rounded-xl p-5">
        <h3 className="font-medium text-[var(--db-text)] mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          테스트할수록 성장하는 프로필
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: '🧠', title: '성격 프로필', desc: '5가지 성향이 풍부해짐' },
            { icon: '🐾', title: '반려동물 케미', desc: '케미 점수가 쌓임' },
            { icon: '☕', title: '라이프스타일', desc: '취향이 드러남' },
            { icon: '⭐', title: '케어 능력', desc: '시나리오 점수로 등급' },
          ].map((item, i) => (
            <div key={i} className="bg-[var(--db-bg)] rounded-lg p-4 text-center">
              <span className="text-2xl mb-2 block">{item.icon}</span>
              <p className="text-sm font-medium text-[var(--db-text)]">{item.title}</p>
              <p className="text-xs text-[var(--db-muted)] mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SNS 공유 프리뷰 */}
      <div className="bg-[var(--db-panel)] rounded-xl p-5">
        <h3 className="font-medium text-[var(--db-text)] mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-pink-400" />
          SNS 공유 카드 (html2canvas)
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {PROFILE_CARDS.map((card) => (
            <div
              key={card.type}
              className="flex-shrink-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30"
              style={{ width: card.style.width / 2, height: card.style.height / 3 }}
            >
              <p className="text-xs font-medium text-[var(--db-text)]">{card.title}</p>
              <p className="text-[10px] text-[var(--db-muted)] mt-1">
                {card.style.width}x{card.style.height}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {card.sections.slice(0, 3).map((s) => (
                  <span key={s} className="px-1.5 py-0.5 bg-white/10 rounded text-[8px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Sections Tab - 프로필 구성 섹션
// ============================================================================

function SectionsTab() {
  return (
    <div className="space-y-4">
      {PROFILE_SECTIONS.map((section) => (
        <div
          key={section.id}
          className="bg-[var(--db-panel)] rounded-xl p-5 border-l-4"
          style={{ borderLeftColor: section.color }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ backgroundColor: `${section.color}20` }}
              >
                {section.icon}
              </div>
              <div>
                <h3 className="font-medium text-[var(--db-text)]">{section.name}</h3>
                <p className="text-sm text-[var(--db-muted)]">{section.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {VISUAL_TYPE_ICONS[section.visualType]}
              <span className="text-xs text-[var(--db-muted)] capitalize">{section.visualType}</span>
            </div>
          </div>

          {/* 데이터 소스 */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-[var(--db-muted)]">데이터 소스:</span>
            {section.sourceTests.length > 0 ? (
              section.sourceTests.map((test) => (
                <span key={test} className="px-2 py-0.5 bg-[var(--db-bg)] rounded text-xs text-[var(--db-text)]">
                  {test}
                </span>
              ))
            ) : (
              <span className="px-2 py-0.5 bg-[var(--db-bg)] rounded text-xs text-[var(--db-muted)]">
                시나리오 퀴즈
              </span>
            )}
          </div>

          {/* Priority Badge */}
          <div className="mt-3 flex items-center gap-2">
            <span
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${section.color}20`,
                color: section.color,
              }}
            >
              우선순위 {section.priority}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Visualization Tab - 차트 라이브러리
// ============================================================================

function VisualizationTab() {
  const recommended = VISUALIZATION_LIBRARIES.recommended;
  const alternatives = VISUALIZATION_LIBRARIES.alternatives;

  return (
    <div className="space-y-6">
      {/* 추천 라이브러리 */}
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-5 border border-green-500/30">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <h3 className="font-medium text-green-400">추천: {recommended.name}</h3>
        </div>
        <p className="text-sm text-[var(--db-muted)] mb-3">{recommended.reason}</p>
        <code className="block bg-black/30 rounded-lg p-3 text-xs text-green-300 font-mono">
          {recommended.install}
        </code>
        <div className="flex flex-wrap gap-2 mt-3">
          {recommended.features.map((feature) => (
            <span key={feature} className="px-2 py-1 bg-green-500/20 rounded text-xs text-green-300">
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* 대안들 */}
      <div className="bg-[var(--db-panel)] rounded-xl p-5">
        <h3 className="font-medium text-[var(--db-text)] mb-4">대안 라이브러리</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {alternatives.map((lib) => (
            <div key={lib.name} className="bg-[var(--db-bg)] rounded-lg p-4">
              <p className="font-medium text-[var(--db-text)] text-sm">{lib.name}</p>
              <p className="text-xs text-[var(--db-muted)] mt-1">{lib.reason}</p>
              <code className="block mt-2 text-[10px] text-[var(--db-muted)] font-mono truncate">
                {lib.install}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* 차트 타입별 용도 */}
      <div className="bg-[var(--db-panel)] rounded-xl p-5">
        <h3 className="font-medium text-[var(--db-text)] mb-4">차트 타입별 용도</h3>
        <div className="space-y-3">
          {[
            { type: 'Radar', use: '성격 5가지 차원', color: '#7aa2ff' },
            { type: 'Bar', use: '반려동물 케미 점수', color: '#ff9f43' },
            { type: 'Gauge', use: '시나리오 퀴즈 점수', color: '#55e6c1' },
            { type: 'Card', use: '연애/관계 스타일', color: '#ff6b6b' },
            { type: 'Badge', use: '라이프스타일 취향', color: '#a29bfe' },
          ].map((item) => (
            <div key={item.type} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium text-[var(--db-text)] w-20">{item.type}</span>
              <span className="text-sm text-[var(--db-muted)]">{item.use}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Components Tab - UI 컴포넌트 설계
// ============================================================================

function ComponentsTab() {
  const components = PROFILE_COMPONENTS;

  return (
    <div className="space-y-6">
      {/* Compact Profile */}
      <div className="bg-[var(--db-panel)] rounded-xl p-5">
        <h3 className="font-medium text-[var(--db-text)] mb-2 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-400" />
          CompactProfile
        </h3>
        <p className="text-sm text-[var(--db-muted)] mb-3">{components.CompactProfile.description}</p>
        <div className="flex flex-wrap gap-2">
          {components.CompactProfile.elements.map((el, i) => (
            <span key={i} className="px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-300">
              {el}
            </span>
          ))}
        </div>
      </div>

      {/* Full Profile View */}
      <div className="bg-[var(--db-panel)] rounded-xl p-5">
        <h3 className="font-medium text-[var(--db-text)] mb-2 flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-400" />
          FullProfileView
        </h3>
        <p className="text-sm text-[var(--db-muted)] mb-3">{components.FullProfileView.description}</p>
        <div className="flex flex-wrap gap-2">
          {components.FullProfileView.elements.map((el, i) => (
            <span key={i} className="px-2 py-1 bg-purple-500/20 rounded text-xs text-purple-300">
              {el}
            </span>
          ))}
        </div>
      </div>

      {/* Personality Radar */}
      <div className="bg-[var(--db-panel)] rounded-xl p-5">
        <h3 className="font-medium text-[var(--db-text)] mb-2 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-indigo-400" />
          PersonalityRadar
        </h3>
        <p className="text-sm text-[var(--db-muted)] mb-3">{components.PersonalityRadar.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {components.PersonalityRadar.dimensions.map((dim, i) => (
            <span key={i} className="px-3 py-1 bg-indigo-500/20 rounded-full text-xs text-indigo-300">
              {dim}
            </span>
          ))}
        </div>
        <div className="flex gap-4 text-xs text-[var(--db-muted)]">
          <span>Fill: {components.PersonalityRadar.colors.fill}</span>
          <span>Stroke: {components.PersonalityRadar.colors.stroke}</span>
        </div>
      </div>

      {/* Pet Chemi Bar */}
      <div className="bg-[var(--db-panel)] rounded-xl p-5">
        <h3 className="font-medium text-[var(--db-text)] mb-2 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-orange-400" />
          PetChemiBar
        </h3>
        <p className="text-sm text-[var(--db-muted)] mb-3">{components.PetChemiBar.description}</p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(components.PetChemiBar.colors).map(([pet, color]) => (
            <div key={pet} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-[var(--db-muted)]">{pet}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Score Gauge */}
      <div className="bg-[var(--db-panel)] rounded-xl p-5">
        <h3 className="font-medium text-[var(--db-text)] mb-2 flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-400" />
          ScoreGauge
        </h3>
        <p className="text-sm text-[var(--db-muted)] mb-3">{components.ScoreGauge.description}</p>
        <div className="flex flex-wrap gap-2">
          {components.ScoreGauge.grades.map((g) => (
            <span
              key={g.grade}
              className="px-3 py-1 rounded text-xs font-medium"
              style={{ backgroundColor: `${g.color}30`, color: g.color }}
            >
              {g.grade} ({g.min}+)
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Roadmap Tab - 구현 로드맵
// ============================================================================

function RoadmapTab() {
  return (
    <div className="space-y-4">
      {PROFILE_ROADMAP.map((phase, index) => (
        <div key={phase.phase} className="bg-[var(--db-panel)] rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
              {index + 1}
            </div>
            <div>
              <h3 className="font-medium text-[var(--db-text)]">{phase.title}</h3>
              <p className="text-xs text-[var(--db-muted)]">{phase.phase}</p>
            </div>
          </div>

          <div className="space-y-2 ml-11">
            {phase.tasks.map((task, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <ChevronRight className="w-4 h-4 text-[var(--db-muted)]" />
                <span className="text-[var(--db-muted)]">{task}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 구현 시작 버튼 */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-5 border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-[var(--db-text)]">구현 준비 완료</h3>
            <p className="text-sm text-[var(--db-muted)]">Recharts 설치 후 Phase 1 시작</p>
          </div>
          <div className="flex items-center gap-2 text-purple-400">
            <Zap className="w-5 h-5" />
            <span className="text-sm font-medium">npm install recharts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
