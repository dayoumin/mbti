'use client';

import { useProfile } from '@/hooks/useProfile';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { profileService } from '@/services/ProfileService';

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
      <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-2xl p-5 animate-pulse">
        <div className="h-20 bg-white/5 rounded-xl" />
      </div>
    );
  }

  if (!profile || profile.completedTests === 0) {
    return (
      <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-2xl p-5 border border-purple-500/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
            <span className="text-2xl">✨</span>
          </div>
          <div>
            <p className="font-medium text-[#333]">나의 프로필을 시작해보세요!</p>
            <p className="text-sm text-gray-500">테스트를 하면 프로필이 채워집니다</p>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">성격 알아보기</span>
          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">반려동물 케미</span>
        </div>
      </div>
    );
  }

  const { level, title, color } = profileService.getProfileLevel(profile.completionRate);

  return (
    <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-2xl p-5 border border-purple-500/20">
      {/* 상단: 레벨 & 완성도 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }}
          >
            Lv.{level}
          </div>
          <div>
            <p className="font-medium text-[#333]">{title}</p>
            <p className="text-xs text-gray-500">{profile.completedTests}/{profile.totalTests} 테스트 완료</p>
          </div>
        </div>
        {onViewFull && (
          <button
            onClick={onViewFull}
            className="px-3 py-1.5 bg-white/50 hover:bg-white/80 rounded-lg text-xs font-medium text-purple-700 transition-all"
          >
            더보기
          </button>
        )}
      </div>

      {/* 완성도 프로그레스 바 */}
      <div className="mb-4">
        <div className="h-2 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${profile.completionRate}%`,
              background: `linear-gradient(90deg, ${color}, ${color}88)`,
            }}
          />
        </div>
        <p className="text-[10px] text-gray-500 mt-1 text-right">{profile.completionRate}% 완성</p>
      </div>

      {/* 미니 요약 */}
      <div className="flex flex-wrap gap-2">
        {profile.personality && (
          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-1">
            <span>{profile.personality.resultEmoji}</span>
            <span>{profile.personality.resultName}</span>
          </span>
        )}
        {profile.petChemi.recommendedPet && (
          <span className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs flex items-center gap-1">
            <span>🐾</span>
            <span>{profile.petChemi.recommendedPet}</span>
          </span>
        )}
        {profile.lifestyle.coffee && (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs flex items-center gap-1">
            <span>{profile.lifestyle.coffee.resultEmoji}</span>
            <span>{profile.lifestyle.coffee.resultName}</span>
          </span>
        )}
        {profile.petChemi.scores.length > 0 && (
          <span className="px-2.5 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
            {profile.petChemi.scores.map(s => s.petEmoji).join('')}
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 풀 프로필 뷰 (상세 페이지/모달용)
// ============================================================================

interface FullProfileProps {
  onClose?: () => void;
  onStartTest?: (testKey: string) => void;
}

export function FullProfile({ onClose, onStartTest }: FullProfileProps) {
  const { profile, loading } = useProfile();

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-b from-purple-50 to-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        {/* 헤더 */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 p-5 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl backdrop-blur">
                Lv.{level}
              </div>
              <div className="text-white">
                <p className="font-bold text-lg">{title}</p>
                <p className="text-white/80 text-sm">{profile.completionRate}% 완성</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* 성격 레이더 차트 */}
          {profile.personality && profile.personality.traits.length > 0 && (
            <ProfileSection title="나의 성격" icon="🧠" color="#7aa2ff">
              <div className="text-center mb-3">
                <span className="text-2xl mr-2">{profile.personality.resultEmoji}</span>
                <span className="font-medium text-gray-800">{profile.personality.resultName}</span>
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={profile.personality.traits}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fontSize: 9, fill: '#9ca3af' }}
                    />
                    <Radar
                      name="성격"
                      dataKey="score"
                      stroke="#7aa2ff"
                      fill="#7aa2ff"
                      fillOpacity={0.4}
                      strokeWidth={2}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value}점`, '점수']}
                      contentStyle={{
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </ProfileSection>
          )}

          {/* 반려동물 케미 바 차트 */}
          {profile.petChemi.scores.length > 0 && (
            <ProfileSection title="반려동물 케미" icon="🐾" color="#ff9f43">
              {profile.petChemi.recommendedPet && (
                <div className="text-center mb-3 px-3 py-2 bg-orange-50 rounded-lg">
                  <span className="text-sm text-orange-700">추천 반려동물: </span>
                  <span className="font-medium text-orange-800">{profile.petChemi.recommendedPet}</span>
                </div>
              )}
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={profile.petChemi.scores} layout="vertical">
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <YAxis
                      type="category"
                      dataKey="petName"
                      width={60}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, '케미']}
                      contentStyle={{
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="compatibility" radius={[0, 4, 4, 0]}>
                      {profile.petChemi.scores.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={['#ff9f43', '#54a0ff', '#ff6b9d', '#feca57'][index % 4]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ProfileSection>
          )}

          {/* 연애/관계 */}
          {(profile.relationship.idealType || profile.relationship.conflictStyle) && (
            <ProfileSection title="연애/관계" icon="💕" color="#ff6b6b">
              <div className="grid grid-cols-2 gap-3">
                {profile.relationship.idealType && (
                  <div className="bg-pink-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-pink-600 mb-1">이상형</p>
                    <p className="text-lg">{profile.relationship.idealType.resultEmoji}</p>
                    <p className="text-sm font-medium text-gray-800 mt-1">
                      {profile.relationship.idealType.resultName}
                    </p>
                  </div>
                )}
                {profile.relationship.conflictStyle && (
                  <div className="bg-rose-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-rose-600 mb-1">갈등 대처</p>
                    <p className="text-lg">{profile.relationship.conflictStyle.resultEmoji}</p>
                    <p className="text-sm font-medium text-gray-800 mt-1">
                      {profile.relationship.conflictStyle.resultName}
                    </p>
                  </div>
                )}
              </div>
            </ProfileSection>
          )}

          {/* 라이프스타일 */}
          {(profile.lifestyle.coffee || profile.lifestyle.plant) && (
            <ProfileSection title="라이프스타일" icon="☕" color="#a29bfe">
              <div className="flex flex-wrap gap-2">
                {profile.lifestyle.coffee && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-full">
                    <span className="text-lg">{profile.lifestyle.coffee.resultEmoji}</span>
                    <span className="text-sm font-medium text-amber-800">
                      {profile.lifestyle.coffee.resultName}
                    </span>
                  </div>
                )}
                {profile.lifestyle.plant && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-full">
                    <span className="text-lg">{profile.lifestyle.plant.resultEmoji}</span>
                    <span className="text-sm font-medium text-green-800">
                      {profile.lifestyle.plant.resultName}
                    </span>
                  </div>
                )}
              </div>
            </ProfileSection>
          )}

          {/* === 유인 요소 === */}

          {/* 다음 추천 테스트 */}
          {profile.nextRecommendation && (
            <button
              onClick={() => {
                if (onStartTest) {
                  onStartTest(profile.nextRecommendation!.testKey);
                  onClose?.();
                }
              }}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-4 text-white text-left hover:from-indigo-600 hover:to-purple-600 transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🎯</span>
                <span className="text-sm font-bold">다음 추천</span>
                {onStartTest && (
                  <span className="ml-auto text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                    클릭하여 시작 →
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{profile.nextRecommendation.testEmoji}</span>
                    <span className="font-bold">{profile.nextRecommendation.testLabel} 테스트</span>
                  </div>
                  <p className="text-white/80 text-xs mt-1">{profile.nextRecommendation.reason}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-white/20 px-2 py-1 rounded-full">
                    {profile.nextRecommendation.reward}
                  </span>
                </div>
              </div>
            </button>
          )}

          {/* 다음 마일스톤 */}
          {profile.nextMilestone && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏅</span>
                  <span className="text-sm font-bold text-amber-800">다음 목표: {profile.nextMilestone.target}%</span>
                </div>
                <span className="text-xs text-amber-600">
                  {profile.nextMilestone.testsNeeded}개 남음
                </span>
              </div>
              <div className="h-2 bg-amber-100 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all"
                  style={{ width: `${(profile.completionRate / profile.nextMilestone.target) * 100}%` }}
                />
              </div>
              <p className="text-xs text-amber-700">
                🎁 {profile.nextMilestone.reward}
              </p>
            </div>
          )}

          {/* 뱃지 */}
          <ProfileSection title="뱃지" icon="🏆" color="#ffd700">
            <div className="grid grid-cols-5 gap-2">
              {profile.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                    badge.unlocked
                      ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200'
                      : 'bg-gray-100 opacity-50'
                  }`}
                  title={badge.unlocked ? badge.description : badge.requirement}
                >
                  <span className={`text-2xl ${badge.unlocked ? '' : 'grayscale'}`}>
                    {badge.emoji}
                  </span>
                  <span className="text-[9px] text-center text-gray-600 mt-1 leading-tight">
                    {badge.name}
                  </span>
                  {badge.unlocked && (
                    <span className="text-[8px] text-amber-600 mt-0.5">✓</span>
                  )}
                </div>
              ))}
            </div>
          </ProfileSection>

          {/* 숨겨진 조합 */}
          <ProfileSection title="발견한 조합" icon="🔮" color="#a29bfe">
            <div className="space-y-2">
              {profile.hiddenCombos.map((combo) => (
                <div
                  key={combo.id}
                  className={`p-3 rounded-xl transition-all ${
                    combo.unlocked
                      ? 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  {combo.unlocked ? (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{combo.emoji}</span>
                        <span className="font-bold text-purple-800">{combo.name}</span>
                        <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full ml-auto">
                          해금!
                        </span>
                      </div>
                      <p className="text-xs text-purple-600">{combo.description}</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg opacity-30">❓</span>
                        <span className="text-sm text-gray-400">???</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {combo.requiredTests.map((t, i) => (
                          <span
                            key={t}
                            className={`w-2 h-2 rounded-full ${
                              combo.completedTests.includes(t) ? 'bg-purple-400' : 'bg-gray-300'
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
          </ProfileSection>

          {/* 프로필 완성 축하 */}
          {profile.completionRate >= 100 && (
            <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 rounded-xl p-4 text-white text-center">
              <span className="text-3xl">🎉</span>
              <p className="font-bold text-lg mt-2">프로필 완성!</p>
              <p className="text-sm text-white/90">모든 테스트를 완료했습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 섹션 컴포넌트
// ============================================================================

interface ProfileSectionProps {
  title: string;
  icon: string;
  color: string;
  children: React.ReactNode;
}

function ProfileSection({ title, icon, color, children }: ProfileSectionProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{icon}</span>
        <h3 className="font-medium text-gray-800">{title}</h3>
        <div
          className="w-2 h-2 rounded-full ml-auto"
          style={{ backgroundColor: color }}
        />
      </div>
      {children}
    </div>
  );
}

// ============================================================================
// 기본 Export
// ============================================================================

export default CompactProfile;
