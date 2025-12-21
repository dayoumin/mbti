'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useProfile } from '@/hooks/useProfile';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { Share2, Check, Heart } from 'lucide-react';
import { profileService, MyProfileData } from '@/services/ProfileService';
import { LoginPromptBanner } from '@/components/auth';
import CareHome from '@/components/care/CareHome';

// ============================================================================
// 커스텀 훅 - ESC 키 핸들링
// ============================================================================

function useEscapeKey(
  onClose: (() => void) | undefined,
  isActive: boolean = true,
  options: { stopPropagation?: boolean } = {}
) {
  useEffect(() => {
    if (!onClose || !isActive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // 중첩 모달에서 ESC가 부모까지 전파되지 않도록 함
        if (options.stopPropagation) {
          e.stopImmediatePropagation();
        }
        onClose();
      }
    };
    // capture: true로 먼저 캡처하여 다른 핸들러보다 우선 처리
    window.addEventListener('keydown', handleKeyDown, options.stopPropagation ? true : false);
    return () => window.removeEventListener('keydown', handleKeyDown, options.stopPropagation ? true : false);
  }, [onClose, isActive, options.stopPropagation]);
}

// ============================================================================
// 커스텀 훅 - 포커스 트랩 (접근성)
// ============================================================================

function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // 모달 열릴 때 이전 포커스 저장 및 첫 번째 요소로 포커스 이동
  useEffect(() => {
    if (!isActive) return;

    // 현재 포커스된 요소 저장
    previousFocusRef.current = document.activeElement as HTMLElement;

    // 첫 번째 포커스 가능한 요소로 이동
    const container = containerRef.current;
    if (container) {
      const focusableElements = container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }

    // 모달 닫힐 때 이전 포커스로 복귀
    return () => {
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, [isActive]);

  // Tab 키로 포커스가 모달 밖으로 나가지 않도록 트랩
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Shift+Tab: 첫 번째 요소에서 마지막으로 이동
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    }
    // Tab: 마지막 요소에서 첫 번째로 이동
    else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }, []);

  return { containerRef, handleKeyDown };
}

// ============================================================================
// 탭 타입 정의
// ============================================================================

type ProfileTab = 'me' | 'pet' | 'life' | 'history' | 'achieve';

const TAB_CONFIG: { key: ProfileTab; label: string; icon: string; color: string }[] = [
  { key: 'me', label: '나', icon: '🧠', color: '#5B8DEF' },
  { key: 'pet', label: '동물', icon: '🐾', color: '#E07B4C' },
  { key: 'life', label: '라이프', icon: '☕', color: '#7B8794' },
  { key: 'history', label: '기록', icon: '📋', color: '#6366F1' },
  { key: 'achieve', label: '도전', icon: '🏆', color: '#D4A84B' },
];

// ============================================================================
// 프로필 컴팩트 카드 (메인 화면용)
// ============================================================================

interface CompactProfileProps {
  onViewFull?: () => void;
}

export function CompactProfile({ onViewFull }: CompactProfileProps) {
  const { profile, loading } = useProfile();
  const { data: session } = useSession();

  if (loading) {
    return (
      <div className="bg-slate-100 rounded-2xl p-5 animate-pulse">
        <div className="h-20 bg-slate-200 rounded-xl" />
      </div>
    );
  }

  if (!profile || profile.completedTests === 0) {
    return (
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
            <span className="text-2xl">✨</span>
          </div>
          <div>
            <p className="font-medium text-gray-800">나의 프로필을 시작해보세요!</p>
            <p className="text-sm text-gray-500">테스트를 하면 프로필이 채워집니다</p>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-xs">성격 알아보기</span>
          <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-xs">반려동물 케미</span>
        </div>
      </div>
    );
  }

  const { level, title } = profileService.getProfileLevel(profile.completionRate);

  return (
    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
      {/* 상단: 레벨 & 완성도 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg bg-slate-600">
            Lv.{level}
          </div>
          <div>
            <p className="font-medium text-gray-800">{title}</p>
            <p className="text-xs text-gray-500">{profile.completedTests}/{profile.totalTests} 테스트 완료</p>
          </div>
        </div>
        {onViewFull && (
          <button
            onClick={onViewFull}
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-medium text-slate-700 transition-all"
          >
            더보기
          </button>
        )}
      </div>

      {/* 완성도 프로그레스 바 */}
      <div className="mb-4">
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 bg-slate-500"
            style={{ width: `${profile.completionRate}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1 text-right">{profile.completionRate}% 완성</p>
      </div>

      {/* 미니 요약 */}
      <div className="flex flex-wrap gap-2">
        {profile.personality && (
          <span className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-full text-xs flex items-center gap-1">
            <span>{profile.personality.resultEmoji}</span>
            <span>{profile.personality.resultName}</span>
          </span>
        )}
        {profile.petChemi.recommendedPet && (
          <span className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-full text-xs flex items-center gap-1">
            <span>🐾</span>
            <span>{profile.petChemi.recommendedPet}</span>
          </span>
        )}
        {profile.lifestyle.coffee && (
          <span className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-full text-xs flex items-center gap-1">
            <span>{profile.lifestyle.coffee.resultEmoji}</span>
            <span>{profile.lifestyle.coffee.resultName}</span>
          </span>
        )}
        {profile.petChemi.scores.length > 0 && (
          <span className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-full text-xs">
            {profile.petChemi.scores.map(s => s.petEmoji).join('')}
          </span>
        )}
      </div>

      {/* 로그인 안내 (비로그인 + 테스트 1개 이상 완료 시) */}
      {!session && profile.completedTests >= 1 && (
        <div className="mt-4 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-orange-600">
            <span>⚠️</span>
            <span>브라우저 초기화 시 데이터가 사라질 수 있어요</span>
          </div>
          <a
            href="/login"
            className="mt-2 block text-center py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-medium text-slate-700 transition-all"
          >
            로그인하고 안전하게 저장하기
          </a>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 풀 프로필 뷰 (탭 기반 - 상세 페이지/모달용)
// ============================================================================

interface FullProfileProps {
  onClose?: () => void;
  onStartTest?: (testKey: string) => void;
}

export function FullProfile({ onClose, onStartTest }: FullProfileProps) {
  const { profile, loading } = useProfile();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<ProfileTab>('me');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  // ESC 키로 모달 닫기
  useEscapeKey(onClose);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 animate-pulse w-full max-w-md">
          <div className="h-8 bg-gray-200 rounded mb-4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const { level, title } = profileService.getProfileLevel(profile.completionRate);

  // 탭별 콘텐츠 존재 여부 확인 (점 표시용)
  const tabHasContent = {
    me: !!(profile.personality || profile.relationship.idealType || profile.relationship.conflictStyle),
    pet: !!(profile.petChemi.scores.length > 0 || profile.petChemi.recommendedPet),
    life: !!(profile.lifestyle.coffee || profile.lifestyle.plant),
    history: profile.completedTests > 0, // 테스트 기록이 있으면 표시
    achieve: true, // 항상 뱃지/조합 표시
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="내 프로필"
    >
      <div className="bg-white rounded-2xl w-full max-w-md h-[85vh] flex flex-col shadow-xl overflow-hidden">
        {/* 컴팩트 헤더 */}
        <div className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow"
              style={{ background: `rgba(255,255,255,0.2)` }}
            >
              Lv.{level}
            </div>
            <div className="text-white">
              <p className="font-bold text-sm">{title}</p>
              <p className="text-white/80 text-xs">{profile.completionRate}% 완성</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* 공유 버튼 */}
            <button
              onClick={() => handleShareProfile(profile, title, setShareStatus)}
              aria-label="프로필 공유"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                shareStatus === 'copied'
                  ? 'bg-green-500 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {shareStatus === 'copied' ? (
                <Check className="w-4 h-4" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                aria-label="닫기"
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 shrink-0" role="tablist">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 flex flex-col items-center gap-1 transition-all relative ${
                activeTab === tab.key
                  ? 'text-gray-800'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
              {activeTab === tab.key && (
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ backgroundColor: tab.color }}
                />
              )}
              {tabHasContent[tab.key] && activeTab !== tab.key && (
                <div
                  className="absolute top-2 right-1/4 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: tab.color }}
                />
              )}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'me' && (
            <TabMe profile={profile} onStartTest={onStartTest} onClose={onClose} />
          )}
          {activeTab === 'pet' && (
            <TabPet profile={profile} onStartTest={onStartTest} onClose={onClose} />
          )}
          {activeTab === 'life' && (
            <TabLife profile={profile} onStartTest={onStartTest} onClose={onClose} />
          )}
          {activeTab === 'history' && (
            <TabHistory onStartTest={onStartTest} onClose={onClose} />
          )}
          {activeTab === 'achieve' && (
            <TabAchieve profile={profile} />
          )}

          {/* 로그인 유도 배너 (비로그인 시) */}
          {!session && profile.completedTests >= 1 && (
            <div className="mt-4">
              <LoginPromptBanner />
            </div>
          )}
        </div>

        {/* 다음 추천 (하단 고정) */}
        {profile.nextRecommendation && onStartTest && (
          <div className="shrink-0 p-3 border-t border-gray-100 bg-gray-50/80">
            <button
              onClick={() => {
                onStartTest(profile.nextRecommendation!.testKey);
                onClose?.();
              }}
              className="w-full bg-gradient-to-r from-slate-600 to-slate-500 rounded-xl px-4 py-3 text-white flex items-center gap-3 hover:from-slate-700 hover:to-slate-600 transition-all active:scale-[0.98]"
            >
              <span className="text-2xl">{profile.nextRecommendation.testEmoji}</span>
              <div className="flex-1 text-left">
                <p className="font-bold text-sm">{profile.nextRecommendation.testLabel} 테스트</p>
                <p className="text-white/70 text-xs">{profile.nextRecommendation.reason}</p>
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">시작 →</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 케어 버튼 + 모달 공통 컴포넌트
// ============================================================================

interface CareButtonProps {
  label?: string;
  className?: string;
}

function CareButtonWithModal({ label = '케어 관리', className = '' }: CareButtonProps) {
  const [showCareHome, setShowCareHome] = useState(false);

  // ESC 키로 모달 닫기 (부모 모달까지 닫히지 않도록 stopPropagation)
  useEscapeKey(() => setShowCareHome(false), showCareHome, { stopPropagation: true });

  // 포커스 트랩 (접근성: 키보드 포커스가 모달 밖으로 나가지 않음)
  const { containerRef, handleKeyDown } = useFocusTrap(showCareHome);

  return (
    <>
      <button
        onClick={() => setShowCareHome(true)}
        className={`w-full flex items-center justify-center gap-2 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-medium transition-colors border border-rose-200 ${className}`}
      >
        <Heart className="w-4 h-4" />
        {label}
      </button>

      {showCareHome && (
        <div
          ref={containerRef}
          onKeyDown={handleKeyDown}
          className="fixed inset-0 z-[60] bg-[#F0F2F5] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="케어 관리"
        >
          <div className="max-w-2xl mx-auto p-4 pb-24">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowCareHome(false)}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium"
              >
                ← 프로필로 돌아가기
              </button>
            </div>
            <CareHome />
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================================
// 탭 컴포넌트들
// ============================================================================

interface TabProps {
  profile: MyProfileData;
  onStartTest?: (testKey: string) => void;
  onClose?: () => void;
}

// 나 탭 - 성격/연애/갈등
function TabMe({ profile, onStartTest, onClose }: TabProps) {
  const hasPersonality = profile.personality && profile.personality.traits.length > 0;
  const hasRelationship = profile.relationship.idealType || profile.relationship.conflictStyle;

  if (!hasPersonality && !hasRelationship) {
    return (
      <EmptyTab
        icon="🧠"
        title="나를 알아보세요"
        description="성격 테스트를 하면 5차원 성격 분석이 표시됩니다"
        testKey="human"
        testLabel="사람 테스트 시작"
        onStartTest={onStartTest}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* 성격 레이더 차트 */}
      {hasPersonality && (
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{profile.personality!.resultEmoji}</span>
              <span className="font-bold text-gray-800">{profile.personality!.resultName}</span>
            </div>
            <span className="text-xs text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">성격</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={profile.personality!.traits}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="label" tick={{ fontSize: 10, fill: '#6b7280' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  dataKey="score"
                  stroke="#5B8DEF"
                  fill="#5B8DEF"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 연애/관계 */}
      {hasRelationship && (
        <div className="grid grid-cols-2 gap-3">
          {profile.relationship.idealType && (
            <div className="bg-stone-100 rounded-xl p-4 text-center">
              <span className="text-xs text-stone-500">이상형</span>
              <p className="text-2xl mt-1">{profile.relationship.idealType.resultEmoji}</p>
              <p className="font-medium text-sm text-gray-800 mt-1">
                {profile.relationship.idealType.resultName}
              </p>
            </div>
          )}
          {profile.relationship.conflictStyle && (
            <div className="bg-stone-100 rounded-xl p-4 text-center">
              <span className="text-xs text-stone-500">갈등 대처</span>
              <p className="text-2xl mt-1">{profile.relationship.conflictStyle.resultEmoji}</p>
              <p className="font-medium text-sm text-gray-800 mt-1">
                {profile.relationship.conflictStyle.resultName}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 부분 완료 시 추천 */}
      {!hasPersonality && (
        <SuggestCard
          icon="🧠"
          label="성격 분석 추가하기"
          testKey="human"
          onStartTest={onStartTest}
          onClose={onClose}
        />
      )}
      {!profile.relationship.idealType && (
        <SuggestCard
          icon="💘"
          label="이상형 테스트 추가하기"
          testKey="idealType"
          onStartTest={onStartTest}
          onClose={onClose}
        />
      )}
    </div>
  );
}

// 동물 탭 - 반려동물 케미
function TabPet({ profile, onStartTest, onClose }: TabProps) {
  const hasPetScores = profile.petChemi.scores.length > 0;
  const hasRecommended = profile.petChemi.recommendedPet;

  if (!hasPetScores && !hasRecommended) {
    return (
      <>
        <EmptyTab
          icon="🐾"
          title="반려동물 케미 알아보기"
          description="고양이, 강아지, 토끼, 햄스터와의 케미를 확인해보세요"
          testKey="cat"
          testLabel="고양이 테스트 시작"
          onStartTest={onStartTest}
          onClose={onClose}
        />
        {/* 케어 관리 버튼 - 테스트 결과 없어도 표시 (동물+식물 통합) */}
        <div className="mt-4">
          <CareButtonWithModal label="반려생물 케어 관리" />
        </div>
      </>
    );
  }

  return (
    <div className="space-y-4">
      {/* 추천 반려동물 */}
      {hasRecommended && (
        <div className="bg-stone-100 rounded-xl p-4 text-center border border-stone-200">
          <span className="text-xs text-stone-500">나에게 맞는 반려동물</span>
          <p className="text-3xl mt-2">🐾</p>
          <p className="font-bold text-lg text-gray-800 mt-1">{profile.petChemi.recommendedPet}</p>
        </div>
      )}

      {/* 케미 바 차트 */}
      {hasPetScores && (
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-3">동물별 케미</p>
          <div className="space-y-3">
            {profile.petChemi.scores.map((score, i) => (
              <div key={score.pet} className="flex items-center gap-3">
                <span className="text-xl w-8">{score.petEmoji}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">{score.petName}</span>
                    <span className="text-xs font-medium text-gray-800">{score.compatibility}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${score.compatibility}%`,
                        backgroundColor: ['#64748b', '#78716c', '#6b7280', '#71717a'][i % 4],
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 더 많은 동물 테스트 제안 */}
      {profile.petChemi.scores.length < 4 && (
        <div className="flex flex-wrap gap-2">
          {!profile.petChemi.scores.find(s => s.pet === 'cat') && (
            <SuggestChip icon="🐱" label="고양이" testKey="cat" onStartTest={onStartTest} onClose={onClose} />
          )}
          {!profile.petChemi.scores.find(s => s.pet === 'dog') && (
            <SuggestChip icon="🐕" label="강아지" testKey="dog" onStartTest={onStartTest} onClose={onClose} />
          )}
          {!profile.petChemi.scores.find(s => s.pet === 'rabbit') && (
            <SuggestChip icon="🐰" label="토끼" testKey="rabbit" onStartTest={onStartTest} onClose={onClose} />
          )}
          {!profile.petChemi.scores.find(s => s.pet === 'hamster') && (
            <SuggestChip icon="🐹" label="햄스터" testKey="hamster" onStartTest={onStartTest} onClose={onClose} />
          )}
        </div>
      )}

      {/* 케어 관리 버튼 (동물+식물 통합) */}
      <CareButtonWithModal label="반려생물 케어 관리" />
    </div>
  );
}

// 라이프 탭 - 라이프스타일
function TabLife({ profile, onStartTest, onClose }: TabProps) {
  const hasCoffee = profile.lifestyle.coffee;
  const hasPlant = profile.lifestyle.plant;

  if (!hasCoffee && !hasPlant) {
    return (
      <EmptyTab
        icon="☕"
        title="라이프스타일 알아보기"
        description="나에게 맞는 커피, 식물을 찾아보세요"
        testKey="coffee"
        testLabel="커피 테스트 시작"
        onStartTest={onStartTest}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* 결과 카드들 */}
      <div className="grid grid-cols-2 gap-3">
        {hasCoffee && (
          <div className="bg-stone-100 rounded-xl p-4 text-center">
            <span className="text-xs text-stone-500">나의 커피</span>
            <p className="text-3xl mt-2">{profile.lifestyle.coffee!.resultEmoji}</p>
            <p className="font-medium text-sm text-gray-800 mt-1">
              {profile.lifestyle.coffee!.resultName}
            </p>
          </div>
        )}
        {hasPlant && (
          <div className="bg-stone-100 rounded-xl p-4 text-center">
            <span className="text-xs text-stone-500">나의 식물</span>
            <p className="text-3xl mt-2">{profile.lifestyle.plant!.resultEmoji}</p>
            <p className="font-medium text-sm text-gray-800 mt-1">
              {profile.lifestyle.plant!.resultName}
            </p>
          </div>
        )}
      </div>

      {/* 추가 테스트 제안 */}
      {!hasCoffee && (
        <SuggestCard
          icon="☕"
          label="커피 테스트 추가하기"
          testKey="coffee"
          onStartTest={onStartTest}
          onClose={onClose}
        />
      )}
      {!hasPlant && (
        <SuggestCard
          icon="🌱"
          label="식물 테스트 추가하기"
          testKey="plant"
          onStartTest={onStartTest}
          onClose={onClose}
        />
      )}

      {/* 케어 관리 버튼 (식물 케어용) */}
      {hasPlant && <CareButtonWithModal label="내 식물 케어 관리" />}
    </div>
  );
}

// 기록 탭 - 테스트 히스토리
function TabHistory({ onStartTest, onClose }: { onStartTest?: (testKey: string) => void; onClose?: () => void }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadHistory = async () => {
      try {
        const { resultService } = await import('@/services/ResultService');
        const results = await resultService.getMyResults();

        if (cancelled) return;

        // 결과를 HistoryItem 형태로 변환
        const items: HistoryItem[] = results.map(r => ({
          id: r.id,
          testType: r.testType,
          testLabel: getTestLabel(r.testType),
          resultName: r.resultKey,
          resultEmoji: r.resultEmoji,
          isDeepMode: r.isDeepMode,
          createdAt: r.createdAt,
          parentTest: r.parentTest,
          parentResult: r.parentResult,
        }));

        setHistory(items);
      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <EmptyTab
        icon="📋"
        title="아직 테스트 기록이 없어요"
        description="테스트를 완료하면 여기에 기록됩니다"
        testKey="human"
        testLabel="첫 테스트 시작하기"
        onStartTest={onStartTest}
        onClose={onClose}
      />
    );
  }

  // 날짜별로 그룹화
  const groupedHistory = groupByDate(history);

  // 카테고리별 테스트 분포 계산
  const categoryStats = calculateCategoryStats(history);
  const uniqueTests = new Set(history.map(h => h.testType)).size;

  return (
    <div className="space-y-4">
      {/* 통계 요약 */}
      <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-indigo-600 font-medium">총 테스트</p>
            <p className="text-2xl font-bold text-indigo-700">{history.length}</p>
          </div>
          <div>
            <p className="text-xs text-indigo-600 font-medium">종류</p>
            <p className="text-2xl font-bold text-indigo-700">{uniqueTests}</p>
          </div>
          <div>
            <p className="text-xs text-indigo-600 font-medium">심화</p>
            <p className="text-2xl font-bold text-indigo-700">{history.filter(h => h.isDeepMode).length}</p>
          </div>
        </div>
      </div>

      {/* 카테고리별 분포 */}
      {categoryStats.length > 0 && (
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-3">테스트 분포</p>
          <div className="space-y-2">
            {categoryStats.map((cat) => (
              <div key={cat.category} className="flex items-center gap-2">
                <span className="text-lg w-6">{cat.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs text-gray-600">{cat.label}</span>
                    <span className="text-xs font-medium text-gray-800">{cat.count}회</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(cat.count / history.length) * 100}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 날짜별 히스토리 */}
      {Object.entries(groupedHistory).map(([dateLabel, items]) => (
        <div key={dateLabel}>
          <p className="text-xs font-medium text-gray-500 mb-2">{dateLabel}</p>
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-3 border border-gray-100 flex items-center gap-3"
              >
                <span className="text-2xl">{item.resultEmoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-800 text-sm truncate">{item.resultName}</p>
                    {item.isDeepMode && (
                      <span className="px-1.5 py-0.5 bg-violet-100 text-violet-600 text-xs font-bold rounded">
                        심화
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>{item.testLabel}</span>
                    {item.parentResult && (
                      <>
                        <span>·</span>
                        <span className="text-amber-600">{item.parentResult}에서 연결</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    onStartTest?.(item.testType);
                    onClose?.();
                  }}
                  className="px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                  다시
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// 히스토리 아이템 타입
interface HistoryItem {
  id: string;
  testType: string;
  testLabel: string;
  resultName: string;
  resultEmoji: string;
  isDeepMode: boolean;
  createdAt: string;
  parentTest?: string;
  parentResult?: string;
}

// 테스트 타입 → 라벨 변환
function getTestLabel(testType: string): string {
  const labels: Record<string, string> = {
    human: '사람 성격',
    cat: '고양이 케미',
    dog: '강아지 케미',
    rabbit: '토끼 케미',
    hamster: '햄스터 케미',
    idealType: '이상형',
    plant: '반려식물',
    petMatch: '반려동물 매칭',
    coffee: '커피',
    conflictStyle: '갈등 대처',
    dogBreed: '강아지 품종',
    catBreed: '고양이 품종',
    smallPet: '소동물',
    fishType: '관상어',
    birdType: '반려조',
    reptileType: '파충류',
  };
  return labels[testType] || testType;
}

// 날짜별 그룹화
function groupByDate(items: HistoryItem[]): Record<string, HistoryItem[]> {
  const groups: Record<string, HistoryItem[]> = {};
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  items.forEach(item => {
    const date = new Date(item.createdAt);
    const itemDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    let label: string;
    if (itemDate.getTime() === today.getTime()) {
      label = '오늘';
    } else if (itemDate.getTime() === yesterday.getTime()) {
      label = '어제';
    } else {
      label = `${date.getMonth() + 1}월 ${date.getDate()}일`;
    }

    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(item);
  });

  return groups;
}

// 카테고리별 테스트 분포 계산
interface CategoryStat {
  category: string;
  label: string;
  emoji: string;
  color: string;
  count: number;
}

const TEST_CATEGORIES: Record<string, { label: string; emoji: string; color: string }> = {
  personality: { label: '성격/관계', emoji: '🧠', color: '#6366F1' },
  pet: { label: '반려동물', emoji: '🐾', color: '#F59E0B' },
  lifestyle: { label: '라이프스타일', emoji: '✨', color: '#10B981' },
  detailed: { label: '심화 테스트', emoji: '🔍', color: '#8B5CF6' },
};

const TEST_TO_CATEGORY: Record<string, string> = {
  human: 'personality',
  idealType: 'personality',
  conflictStyle: 'personality',
  cat: 'pet',
  dog: 'pet',
  rabbit: 'pet',
  hamster: 'pet',
  petMatch: 'pet',
  coffee: 'lifestyle',
  plant: 'lifestyle',
  dogBreed: 'detailed',
  catBreed: 'detailed',
  smallPet: 'detailed',
  fishType: 'detailed',
  birdType: 'detailed',
  reptileType: 'detailed',
};

function calculateCategoryStats(items: HistoryItem[]): CategoryStat[] {
  const counts: Record<string, number> = {};

  items.forEach(item => {
    const category = TEST_TO_CATEGORY[item.testType] || 'other';
    counts[category] = (counts[category] || 0) + 1;
  });

  return Object.entries(counts)
    .filter(([cat]) => TEST_CATEGORIES[cat])
    .map(([cat, count]) => ({
      category: cat,
      label: TEST_CATEGORIES[cat].label,
      emoji: TEST_CATEGORIES[cat].emoji,
      color: TEST_CATEGORIES[cat].color,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

// 도전 탭 - 뱃지/조합/마일스톤
function TabAchieve({ profile }: { profile: MyProfileData }) {
  const unlockedBadges = profile.badges.filter(b => b.unlocked).length;
  const unlockedCombos = profile.hiddenCombos.filter(c => c.unlocked).length;

  return (
    <div className="space-y-4">
      {/* 마일스톤 */}
      {profile.nextMilestone && (
        <div className="bg-slate-100 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-slate-700">다음 목표 {profile.nextMilestone.target}%</span>
            <span className="text-xs text-slate-500">{profile.nextMilestone.testsNeeded}개 남음</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-slate-500 rounded-full"
              style={{ width: `${Math.min(100, (profile.completionRate / profile.nextMilestone.target) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-600">🎁 {profile.nextMilestone.reward}</p>
        </div>
      )}

      {/* 뱃지 */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-gray-800">뱃지</span>
          <span className="text-xs text-gray-500">{unlockedBadges}/{profile.badges.length}</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {profile.badges.map((badge) => (
            <div
              key={badge.id}
              className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                badge.unlocked
                  ? 'bg-slate-100 border border-slate-300'
                  : 'bg-gray-50 opacity-40'
              }`}
              title={badge.unlocked ? badge.description : badge.requirement}
            >
              <span className={`text-xl ${badge.unlocked ? '' : 'grayscale'}`}>{badge.emoji}</span>
              <span className="text-xs text-center text-gray-600 mt-1 leading-tight">{badge.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 숨겨진 조합 */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-gray-800">발견한 조합</span>
          <span className="text-xs text-gray-500">{unlockedCombos}/{profile.hiddenCombos.length}</span>
        </div>
        <div className="space-y-2">
          {profile.hiddenCombos.map((combo) => (
            <div
              key={combo.id}
              className={`p-3 rounded-lg ${
                combo.unlocked
                  ? 'bg-slate-100 border border-slate-300'
                  : 'bg-gray-50 border border-gray-100'
              }`}
            >
              {combo.unlocked ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg">{combo.emoji}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-slate-700">{combo.name}</p>
                    <p className="text-xs text-slate-500">{combo.description}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">???</span>
                  <div className="flex items-center gap-1">
                    {combo.requiredTests.map((t) => (
                      <span
                        key={t}
                        className={`w-2 h-2 rounded-full ${
                          combo.completedTests.includes(t) ? 'bg-slate-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">
                      {combo.completedTests.length}/{combo.requiredTests.length}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 100% 완성 */}
      {profile.completionRate >= 100 && (
        <div className="bg-slate-700 rounded-xl p-4 text-white text-center">
          <span className="text-3xl">🎉</span>
          <p className="font-bold mt-1">프로필 완성!</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 프로필 공유 기능
// ============================================================================

async function handleShareProfile(
  profile: MyProfileData,
  title: string,
  setShareStatus: (status: 'idle' | 'copied') => void
) {
  // 프로필 텍스트 생성
  const lines: string[] = [
    `🎭 나의 프로필 - ${title}`,
    `📊 완성도: ${profile.completionRate}% (${profile.completedTests}/${profile.totalTests})`,
    '',
  ];

  // 성격
  if (profile.personality) {
    lines.push(`🧠 성격: ${profile.personality.resultEmoji} ${profile.personality.resultName}`);
  }

  // 반려동물 케미
  if (profile.petChemi.recommendedPet) {
    lines.push(`🐾 추천 반려동물: ${profile.petChemi.recommendedPet}`);
  }
  if (profile.petChemi.scores.length > 0) {
    const petSummary = profile.petChemi.scores
      .map(s => `${s.petEmoji}${s.compatibility}%`)
      .join(' ');
    lines.push(`   케미: ${petSummary}`);
  }

  // 연애/관계
  if (profile.relationship.idealType || profile.relationship.conflictStyle) {
    const parts: string[] = [];
    if (profile.relationship.idealType) {
      parts.push(`${profile.relationship.idealType.resultEmoji} ${profile.relationship.idealType.resultName}`);
    }
    if (profile.relationship.conflictStyle) {
      parts.push(`${profile.relationship.conflictStyle.resultEmoji} ${profile.relationship.conflictStyle.resultName}`);
    }
    lines.push(`💕 관계: ${parts.join(' / ')}`);
  }

  // 라이프스타일
  if (profile.lifestyle.coffee || profile.lifestyle.plant) {
    const parts: string[] = [];
    if (profile.lifestyle.coffee) {
      parts.push(`${profile.lifestyle.coffee.resultEmoji} ${profile.lifestyle.coffee.resultName}`);
    }
    if (profile.lifestyle.plant) {
      parts.push(`${profile.lifestyle.plant.resultEmoji} ${profile.lifestyle.plant.resultName}`);
    }
    lines.push(`✨ 라이프: ${parts.join(' / ')}`);
  }

  // 뱃지
  const unlockedBadges = profile.badges.filter(b => b.unlocked);
  if (unlockedBadges.length > 0) {
    lines.push(`🏆 뱃지: ${unlockedBadges.map(b => b.emoji).join(' ')}`);
  }

  lines.push('', '👉 나도 테스트하기: [링크]');

  const shareText = lines.join('\n');

  // Web Share API 시도
  if (navigator.share) {
    try {
      await navigator.share({
        title: '나의 프로필',
        text: shareText,
      });
      return;
    } catch {
      // 사용자가 취소하거나 실패한 경우 클립보드 복사로 폴백
    }
  }

  // 클립보드 복사
  try {
    await navigator.clipboard.writeText(shareText);
    setShareStatus('copied');
    setTimeout(() => setShareStatus('idle'), 2000);
  } catch {
    // 클립보드 API 실패 시 구형 방식
    const textarea = document.createElement('textarea');
    textarea.value = shareText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    setShareStatus('copied');
    setTimeout(() => setShareStatus('idle'), 2000);
  }
}

// ============================================================================
// 헬퍼 컴포넌트들
// ============================================================================

interface EmptyTabProps {
  icon: string;
  title: string;
  description: string;
  testKey: string;
  testLabel: string;
  onStartTest?: (testKey: string) => void;
  onClose?: () => void;
}

function EmptyTab({ icon, title, description, testKey, testLabel, onStartTest, onClose }: EmptyTabProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-8">
      <span className="text-5xl mb-4 opacity-30">{icon}</span>
      <p className="font-medium text-gray-700 mb-1">{title}</p>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      {onStartTest && (
        <button
          onClick={() => {
            onStartTest(testKey);
            onClose?.();
          }}
          className="px-4 py-2 bg-slate-600 text-white rounded-full text-sm font-medium hover:bg-slate-700 transition-all"
        >
          {testLabel}
        </button>
      )}
    </div>
  );
}

interface SuggestCardProps {
  icon: string;
  label: string;
  testKey: string;
  onStartTest?: (testKey: string) => void;
  onClose?: () => void;
}

function SuggestCard({ icon, label, testKey, onStartTest, onClose }: SuggestCardProps) {
  if (!onStartTest) return null;
  return (
    <button
      onClick={() => {
        onStartTest(testKey);
        onClose?.();
      }}
      className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center gap-3 transition-all border border-dashed border-gray-200"
    >
      <span className="text-xl opacity-50">{icon}</span>
      <span className="text-sm text-gray-600">{label}</span>
      <span className="ml-auto text-xs text-slate-500">+</span>
    </button>
  );
}

interface SuggestChipProps {
  icon: string;
  label: string;
  testKey: string;
  onStartTest?: (testKey: string) => void;
  onClose?: () => void;
}

function SuggestChip({ icon, label, testKey, onStartTest, onClose }: SuggestChipProps) {
  if (!onStartTest) return null;
  return (
    <button
      onClick={() => {
        onStartTest(testKey);
        onClose?.();
      }}
      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center gap-1.5 text-sm text-gray-600 transition-all"
    >
      <span>{icon}</span>
      <span>{label}</span>
      <span className="text-slate-500">+</span>
    </button>
  );
}

// ============================================================================
// 기본 Export
// ============================================================================

export default CompactProfile;
