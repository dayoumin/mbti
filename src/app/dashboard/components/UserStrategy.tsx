'use client';

import { useState } from 'react';
import {
  Users,
  Target,
  Heart,
  Brain,
  Repeat,
  Monitor,
  ChevronRight,
  Smartphone,
  Calendar,
  Activity,
  FileText,
  Camera,
  DollarSign,
  Bell,
  PawPrint,
} from 'lucide-react';
import {
  USER_SEGMENTS_BY_INTEREST,
  USER_SEGMENTS_BY_PURPOSE,
  USER_SEGMENTS_BY_FREQUENCY,
  PET_OWNER_PERSONAS,
  PRE_OWNER_PERSONAS,
  PSYCHOLOGY_PERSONAS,
  CONTENT_CONSUMPTION_TYPES,
  PARTICIPATION_TYPES,
  MANAGEMENT_FEATURES,
  MANAGEMENT_BY_PET_TYPE,
  USER_JOURNEY_STAGES,
  SCREEN_MODES,
  SEGMENTATION_AXES,
} from '../data/user-strategy';

// ============================================================================
// UserStrategy Component
// ============================================================================

export default function UserStrategy() {
  const [activeTab, setActiveTab] = useState<
    'segmentation' | 'personas' | 'retention' | 'management' | 'journey' | 'screens'
  >('segmentation');

  const tabs = [
    { key: 'segmentation' as const, label: '세분화', icon: <Users className="w-4 h-4" /> },
    { key: 'personas' as const, label: '페르소나', icon: <Target className="w-4 h-4" /> },
    { key: 'retention' as const, label: '재방문 전략', icon: <Repeat className="w-4 h-4" /> },
    { key: 'management' as const, label: '관리 프로그램', icon: <Smartphone className="w-4 h-4" /> },
    { key: 'journey' as const, label: '사용자 여정', icon: <Activity className="w-4 h-4" /> },
    { key: 'screens' as const, label: '화면 구성', icon: <Monitor className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="db-card p-2">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-[var(--db-brand)] text-[#081023]'
                  : 'text-[var(--db-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-hover)]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'segmentation' && <SegmentationView />}
      {activeTab === 'personas' && <PersonasView />}
      {activeTab === 'retention' && <RetentionView />}
      {activeTab === 'management' && <ManagementView />}
      {activeTab === 'journey' && <JourneyView />}
      {activeTab === 'screens' && <ScreensView />}
    </div>
  );
}

// ============================================================================
// Sub-Components
// ============================================================================

function SegmentationView() {
  return (
    <div className="space-y-6">
      {/* 개요 */}
      <div className="db-card p-6">
        <h2 className="text-xl font-bold text-[var(--db-text)] mb-2">사용자 세분화 프레임워크</h2>
        <p className="text-[var(--db-muted)]">
          사용자를 다양한 축으로 분류하여 맞춤 경험을 제공합니다.
        </p>
      </div>

      {/* 핵심 축 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">핵심 분류 축</h3>
        </div>
        <div className="p-5 grid grid-cols-5 gap-4">
          {SEGMENTATION_AXES.map((axis) => (
            <div key={axis.axis} className="text-center p-4 rounded-xl" style={{ background: 'rgba(122,162,255,0.08)' }}>
              <p className="font-semibold text-[var(--db-text)] mb-2">{axis.label}</p>
              <div className="flex flex-wrap justify-center gap-1 mb-3">
                {axis.options.map((opt) => (
                  <span key={opt} className="db-chip text-xs">{opt}</span>
                ))}
              </div>
              <p className="text-xs text-[var(--db-muted)]">{axis.impact}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 관심사 기반 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">관심사 기반 분류</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {USER_SEGMENTS_BY_INTEREST.map((segment) => (
            <SegmentCard key={segment.key} segment={segment} />
          ))}
        </div>
      </div>

      {/* 목적 기반 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">목적 기반 분류</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {USER_SEGMENTS_BY_PURPOSE.map((segment) => (
            <SegmentCard key={segment.key} segment={segment} />
          ))}
        </div>
      </div>

      {/* 빈도 기반 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">방문 빈도 기반 분류</h3>
        </div>
        <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {USER_SEGMENTS_BY_FREQUENCY.map((segment) => (
            <SegmentCard key={segment.key} segment={segment} compact />
          ))}
        </div>
      </div>
    </div>
  );
}

function SegmentCard({ segment, compact }: { segment: typeof USER_SEGMENTS_BY_INTEREST[0]; compact?: boolean }) {
  return (
    <div className="db-callout">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{segment.emoji}</span>
        <span className="font-semibold text-[var(--db-text)]">{segment.label}</span>
      </div>
      <p className="text-sm text-[var(--db-muted)] mb-3">{segment.description}</p>
      {!compact && (
        <div className="flex flex-wrap gap-1">
          {segment.needs.map((need) => (
            <span key={need} className="db-chip text-xs">{need}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function PersonasView() {
  const [activeCategory, setActiveCategory] = useState<'petOwner' | 'prePetOwner' | 'psychology'>('petOwner');

  return (
    <div className="space-y-6">
      {/* 카테고리 선택 */}
      <div className="db-card p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveCategory('petOwner')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === 'petOwner'
                ? 'bg-[var(--db-brand)] text-[#081023]'
                : 'text-[var(--db-muted)] hover:text-[var(--db-text)]'
            }`}
          >
            <PawPrint className="w-4 h-4" /> 반려인
          </button>
          <button
            onClick={() => setActiveCategory('prePetOwner')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === 'prePetOwner'
                ? 'bg-[var(--db-brand)] text-[#081023]'
                : 'text-[var(--db-muted)] hover:text-[var(--db-text)]'
            }`}
          >
            <Heart className="w-4 h-4" /> 예비 반려인
          </button>
          <button
            onClick={() => setActiveCategory('psychology')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === 'psychology'
                ? 'bg-[var(--db-brand)] text-[#081023]'
                : 'text-[var(--db-muted)] hover:text-[var(--db-text)]'
            }`}
          >
            <Brain className="w-4 h-4" /> 심리/관계
          </button>
        </div>
      </div>

      {/* 페르소나 목록 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            {activeCategory === 'petOwner' && '반려인 페르소나'}
            {activeCategory === 'prePetOwner' && '예비 반려인 페르소나'}
            {activeCategory === 'psychology' && '심리/관계 관심자 페르소나'}
          </h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeCategory === 'petOwner' &&
            PET_OWNER_PERSONAS.map((persona) => <PersonaCard key={persona.key} persona={persona} />)}
          {activeCategory === 'prePetOwner' &&
            PRE_OWNER_PERSONAS.map((persona) => <PersonaCard key={persona.key} persona={persona} />)}
          {activeCategory === 'psychology' &&
            PSYCHOLOGY_PERSONAS.map((persona) => <PersonaCard key={persona.key} persona={persona} />)}
        </div>
      </div>
    </div>
  );
}

function PersonaCard({ persona }: { persona: typeof PET_OWNER_PERSONAS[0] }) {
  return (
    <div className="db-callout">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{persona.emoji}</span>
        <div>
          <h4 className="font-semibold text-[var(--db-text)]">{persona.name}</h4>
          <p className="text-xs text-[var(--db-muted)]">{persona.situation}</p>
        </div>
      </div>
      <div className="mb-3">
        <p className="text-xs text-[var(--db-muted)] mb-1">니즈</p>
        <div className="flex flex-wrap gap-1">
          {persona.needs.map((need) => (
            <span key={need} className="db-chip text-xs">{need}</span>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs text-[var(--db-muted)] mb-1">제공 기능</p>
        <div className="flex flex-wrap gap-1">
          {persona.features.map((feature) => (
            <span key={feature} className="px-2 py-0.5 rounded text-xs" style={{ background: 'rgba(124,255,138,0.15)', color: 'var(--db-ok)' }}>
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function RetentionView() {
  return (
    <div className="space-y-6">
      {/* 콘텐츠 소비형 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">콘텐츠 소비형</h3>
          <p className="text-sm text-[var(--db-muted)]">정보/뉴스/가이드로 재방문 유도</p>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONTENT_CONSUMPTION_TYPES.map((type) => (
            <div key={type.key} className="db-callout">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{type.emoji}</span>
                <span className="font-semibold text-[var(--db-text)]">{type.label}</span>
              </div>
              <div className="flex items-center gap-2 mb-2 text-xs">
                <span className="db-chip">{type.target}</span>
                <span className="text-[var(--db-muted)]">{type.frequency}</span>
              </div>
              <div className="space-y-1">
                {type.examples.map((ex) => (
                  <p key={ex} className="text-xs text-[var(--db-muted)]">• {ex}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 참여형 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">참여/커뮤니티형</h3>
          <p className="text-sm text-[var(--db-muted)]">활동/소통으로 재방문 유도</p>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PARTICIPATION_TYPES.map((type) => (
            <div key={type.key} className="db-callout">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{type.emoji}</span>
                <span className="font-semibold text-[var(--db-text)]">{type.label}</span>
              </div>
              <div className="flex items-center gap-2 mb-2 text-xs">
                <span className="db-chip">{type.target}</span>
                <span className="text-[var(--db-muted)]">{type.frequency}</span>
              </div>
              <div className="space-y-1">
                {type.examples.map((ex) => (
                  <p key={ex} className="text-xs text-[var(--db-muted)]">• {ex}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ManagementView() {
  const featureIcons: Record<string, React.ReactNode> = {
    healthRecord: <Activity className="w-5 h-5 text-[var(--db-danger)]" />,
    dailyLog: <FileText className="w-5 h-5 text-[var(--db-brand)]" />,
    growthAlbum: <Camera className="w-5 h-5 text-[var(--db-ok)]" />,
    costManagement: <DollarSign className="w-5 h-5 text-[var(--db-warning)]" />,
    scheduleAlert: <Bell className="w-5 h-5 text-[var(--db-brand2)]" />,
    multiPet: <PawPrint className="w-5 h-5 text-[var(--db-brand)]" />,
  };

  return (
    <div className="space-y-6">
      {/* 개요 */}
      <div className="db-card p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(122,162,255,0.15)' }}>
            <Smartphone className="w-6 h-6 text-[var(--db-brand)]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--db-text)] mb-2">반려생물 관리 프로그램</h2>
            <p className="text-[var(--db-muted)]">
              오래 키우는 사용자를 위한 기록/관리 기능. 특정 반려동물을 선택하면 맞춤 관리 도구를 제공합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 공통 기능 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">공통 관리 기능</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MANAGEMENT_FEATURES.map((feature) => (
            <div key={feature.key} className="db-callout">
              <div className="flex items-center gap-3 mb-3">
                {featureIcons[feature.key]}
                <div>
                  <span className="text-lg mr-2">{feature.emoji}</span>
                  <span className="font-semibold text-[var(--db-text)]">{feature.label}</span>
                </div>
              </div>
              <p className="text-sm text-[var(--db-muted)] mb-3">{feature.description}</p>
              <div className="space-y-1">
                {feature.examples.map((ex) => (
                  <p key={ex} className="text-xs text-[var(--db-brand)]">• {ex}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 반려동물별 특화 기능 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">반려동물별 특화 기능</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MANAGEMENT_BY_PET_TYPE.map((pet) => (
            <div key={pet.petType} className="db-callout">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{pet.emoji}</span>
                <span className="font-semibold text-[var(--db-text)]">{pet.label}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {pet.specificFeatures.map((feature) => (
                  <span key={feature} className="db-chip text-xs">{feature}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 로드맵 */}
      <div className="db-callout" style={{ borderColor: 'rgba(122,162,255,0.35)' }}>
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-[var(--db-brand)] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-[var(--db-text)]">
              <strong>구현 우선순위:</strong> 사용자 요청이 늘어나면 우선 개발 검토
            </p>
            <p className="text-xs text-[var(--db-muted)] mt-1">
              Phase 1: 간단한 기록 기능 → Phase 2: 알림/통계 → Phase 3: AI 분석/추천
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function JourneyView() {
  return (
    <div className="space-y-6">
      {/* 여정 맵 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">사용자 여정 맵</h3>
          <p className="text-sm text-[var(--db-muted)]">첫 방문 → 충성 사용자까지의 전환 과정</p>
        </div>
        <div className="p-5">
          {/* 흐름 다이어그램 */}
          <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4">
            {USER_JOURNEY_STAGES.map((stage, idx) => (
              <div key={stage.stage} className="flex items-center">
                <div className="text-center min-w-[120px]">
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-bold"
                    style={{ background: 'var(--db-brand)', color: '#081023' }}
                  >
                    {idx + 1}
                  </div>
                  <p className="font-semibold text-[var(--db-text)]">{stage.label}</p>
                </div>
                {idx < USER_JOURNEY_STAGES.length - 1 && (
                  <ChevronRight className="w-6 h-6 text-[var(--db-muted)] mx-2" />
                )}
              </div>
            ))}
          </div>

          {/* 상세 테이블 */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--db-line)]">
                  <th className="text-left py-3 px-4 text-[var(--db-muted)] font-medium">단계</th>
                  <th className="text-left py-3 px-4 text-[var(--db-muted)] font-medium">행동</th>
                  <th className="text-left py-3 px-4 text-[var(--db-muted)] font-medium">전환 트리거</th>
                  <th className="text-left py-3 px-4 text-[var(--db-muted)] font-medium">이탈 위험</th>
                </tr>
              </thead>
              <tbody>
                {USER_JOURNEY_STAGES.map((stage) => (
                  <tr key={stage.stage} className="border-b border-[var(--db-line)] hover:bg-[var(--db-hover)]">
                    <td className="py-3 px-4 font-medium text-[var(--db-text)]">{stage.label}</td>
                    <td className="py-3 px-4 text-[var(--db-muted)]">{stage.action}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded text-xs" style={{ background: 'rgba(124,255,138,0.15)', color: 'var(--db-ok)' }}>
                        {stage.trigger}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded text-xs" style={{ background: 'rgba(255,107,107,0.15)', color: 'var(--db-danger)' }}>
                        {stage.churnRisk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreensView() {
  const [selectedMode, setSelectedMode] = useState(SCREEN_MODES[0].key);
  const currentMode = SCREEN_MODES.find((m) => m.key === selectedMode) || SCREEN_MODES[0];

  return (
    <div className="space-y-6">
      {/* 모드 선택 */}
      <div className="db-card p-2">
        <div className="flex flex-wrap gap-2">
          {SCREEN_MODES.map((mode) => (
            <button
              key={mode.key}
              onClick={() => setSelectedMode(mode.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMode === mode.key
                  ? 'bg-[var(--db-brand)] text-[#081023]'
                  : 'text-[var(--db-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-hover)]'
              }`}
            >
              <span>{mode.emoji}</span>
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* 선택된 모드 상세 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentMode.emoji}</span>
            <div>
              <h3 className="text-lg font-semibold text-[var(--db-text)]">{currentMode.label}</h3>
              <p className="text-sm text-[var(--db-muted)]">타겟: {currentMode.target}</p>
            </div>
          </div>
        </div>
        <div className="p-5">
          {/* 화면 프리뷰 */}
          <div className="max-w-sm mx-auto">
            <div className="rounded-2xl overflow-hidden" style={{ background: '#1a1a2e', border: '8px solid #333' }}>
              <div className="p-4 space-y-3">
                {currentMode.sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl"
                    style={{ background: idx === 0 ? 'rgba(122,162,255,0.15)' : 'rgba(255,255,255,0.05)' }}
                  >
                    <p className="text-sm font-medium text-[var(--db-text)] mb-1">{section.label}</p>
                    <p className="text-xs text-[var(--db-muted)]">{section.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모든 모드 비교 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">모드별 화면 구성 비교</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {SCREEN_MODES.map((mode) => (
            <div key={mode.key} className="db-callout">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{mode.emoji}</span>
                <span className="font-semibold text-[var(--db-text)]">{mode.label}</span>
              </div>
              <p className="text-xs text-[var(--db-muted)] mb-2">{mode.target}</p>
              <div className="space-y-1">
                {mode.sections.map((section, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <span className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'rgba(122,162,255,0.2)' }}>
                      {idx + 1}
                    </span>
                    <span className="text-[var(--db-text)]">{section.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
