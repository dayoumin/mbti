'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { profileService, MyProfileData } from '@/services/ProfileService';

// ============================================================================
// 탭 타입 정의
// ============================================================================

type ProfileTab = 'me' | 'pet' | 'life' | 'achieve';

const TAB_CONFIG: { key: ProfileTab; label: string; icon: string; color: string }[] = [
  { key: 'me', label: '나', icon: '🧠', color: '#5B8DEF' },
  { key: 'pet', label: '동물', icon: '🐾', color: '#E07B4C' },
  { key: 'life', label: '라이프', icon: '☕', color: '#7B8794' },
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
        <p className="text-[10px] text-gray-500 mt-1 text-right">{profile.completionRate}% 완성</p>
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
  const [activeTab, setActiveTab] = useState<ProfileTab>('me');

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
    achieve: true, // 항상 뱃지/조합 표시
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
          {activeTab === 'achieve' && (
            <TabAchieve profile={profile} />
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
      <EmptyTab
        icon="🐾"
        title="반려동물 케미 알아보기"
        description="고양이, 강아지, 토끼, 햄스터와의 케미를 확인해보세요"
        testKey="cat"
        testLabel="고양이 테스트 시작"
        onStartTest={onStartTest}
        onClose={onClose}
      />
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
    </div>
  );
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
              <span className="text-[8px] text-center text-gray-600 mt-1 leading-tight">{badge.name}</span>
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
                    <span className="text-[10px] text-gray-400 ml-1">
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
