'use client';

import { useState } from 'react';
import { Star, Trophy, Users, Swords, Percent, Award, ChevronRight } from 'lucide-react';
import {
  DESIGN_PRINCIPLES,
  EXPERT_BADGE_NAMES,
  CAT_EXPERT_TRACK,
  COMMUNITY_CONTRIBUTION_TRACK,
  PERCENTILE_BADGES,
  DUEL_BADGES,
  SPECIAL_ACHIEVEMENT_BADGES,
  BADGE_SUMMARY,
  IMPLEMENTATION_PRIORITY,
  type ExpertTrackSubject,
} from '../data/badge-system';

type TabKey = 'overview' | 'expert' | 'community' | 'percentile' | 'duel' | 'special' | 'roadmap';

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'overview', label: '개요', icon: <Star className="w-4 h-4" /> },
  { key: 'expert', label: '전문가 트랙', icon: <Trophy className="w-4 h-4" /> },
  { key: 'community', label: '커뮤니티', icon: <Users className="w-4 h-4" /> },
  { key: 'percentile', label: '비율 배지', icon: <Percent className="w-4 h-4" /> },
  { key: 'duel', label: '퀴즈 대결', icon: <Swords className="w-4 h-4" /> },
  { key: 'special', label: '특별 달성', icon: <Award className="w-4 h-4" /> },
  { key: 'roadmap', label: '구현 로드맵', icon: <ChevronRight className="w-4 h-4" /> },
];

export default function BadgeSystem() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [selectedSubject, setSelectedSubject] = useState<ExpertTrackSubject>('cat');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="db-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--db-text)]">배지 시스템 v2</h2>
            <p className="text-[var(--db-muted)]">전문가 성장 + 커뮤니티 기여 + 대결 시스템</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-5 gap-4 mt-6">
          <div className="db-callout text-center">
            <p className="text-2xl font-bold text-[var(--db-brand)]">{BADGE_SUMMARY.grandTotal}</p>
            <p className="text-xs text-[var(--db-muted)]">총 배지</p>
          </div>
          <div className="db-callout text-center">
            <p className="text-2xl font-bold text-amber-500">{BADGE_SUMMARY.expertTracks.total}</p>
            <p className="text-xs text-[var(--db-muted)]">전문가 트랙</p>
          </div>
          <div className="db-callout text-center">
            <p className="text-2xl font-bold text-emerald-500">{BADGE_SUMMARY.communityContribution}</p>
            <p className="text-xs text-[var(--db-muted)]">커뮤니티</p>
          </div>
          <div className="db-callout text-center">
            <p className="text-2xl font-bold text-purple-500">{BADGE_SUMMARY.duelBadges}</p>
            <p className="text-xs text-[var(--db-muted)]">대결 배지</p>
          </div>
          <div className="db-callout text-center">
            <p className="text-2xl font-bold text-pink-500">{BADGE_SUMMARY.percentileBadges}</p>
            <p className="text-xs text-[var(--db-muted)]">비율 배지</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`db-tab flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key ? 'active' : ''
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="db-card p-6">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'expert' && (
          <ExpertTrackTab
            selectedSubject={selectedSubject}
            onSelectSubject={setSelectedSubject}
          />
        )}
        {activeTab === 'community' && <CommunityTab />}
        {activeTab === 'percentile' && <PercentileTab />}
        {activeTab === 'duel' && <DuelTab />}
        {activeTab === 'special' && <SpecialTab />}
        {activeTab === 'roadmap' && <RoadmapTab />}
      </div>
    </div>
  );
}

// ============================================================================
// 개요 탭
// ============================================================================

function OverviewTab() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[var(--db-text)]">설계 원칙</h3>

      {/* 5단계 성장 */}
      <div className="db-callout">
        <h4 className="font-medium text-[var(--db-text)] mb-3">5단계 성장 시스템</h4>
        <div className="flex gap-2">
          {DESIGN_PRINCIPLES.growthLevels.levels.map((level, i) => (
            <div
              key={level}
              className="flex-1 text-center py-3 rounded-lg"
              style={{
                background: Object.values(DESIGN_PRINCIPLES.growthLevels.colors)[i] + '20',
                borderLeft: `3px solid ${Object.values(DESIGN_PRINCIPLES.growthLevels.colors)[i]}`,
              }}
            >
              <p className="font-bold" style={{ color: Object.values(DESIGN_PRINCIPLES.growthLevels.colors)[i] }}>
                {level}
              </p>
              <p className="text-xs text-[var(--db-muted)] mt-1">
                {Object.values(DESIGN_PRINCIPLES.timeToAchieve)[i]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 행동 가중치 */}
      <div className="db-callout">
        <h4 className="font-medium text-[var(--db-text)] mb-3">행동 가중치 (받는 것 {'>'} 주는 것)</h4>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(DESIGN_PRINCIPLES.actionWeights).map(([action, points]) => (
            <div key={action} className="flex items-center justify-between text-sm">
              <span className="text-[var(--db-muted)]">{action}</span>
              <span
                className={`font-bold ${
                  points >= 50 ? 'text-amber-500' : points >= 10 ? 'text-emerald-500' : 'text-[var(--db-muted)]'
                }`}
              >
                +{points}점
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 전문가 트랙 탭
// ============================================================================

function ExpertTrackTab({
  selectedSubject,
  onSelectSubject,
}: {
  selectedSubject: ExpertTrackSubject;
  onSelectSubject: (s: ExpertTrackSubject) => void;
}) {
  const subjects = Object.keys(EXPERT_BADGE_NAMES) as ExpertTrackSubject[];
  const badges = EXPERT_BADGE_NAMES[selectedSubject];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[var(--db-text)]">대상별 전문가 트랙 (5단계)</h3>

      {/* Subject Selector */}
      <div className="flex gap-2 flex-wrap">
        {subjects.map((subject) => {
          const badge = EXPERT_BADGE_NAMES[subject];
          return (
            <button
              key={subject}
              onClick={() => onSelectSubject(subject)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedSubject === subject
                  ? 'bg-[var(--db-brand)] text-white'
                  : 'bg-[rgba(255,255,255,0.05)] text-[var(--db-muted)] hover:text-[var(--db-text)]'
              }`}
            >
              {badge.bronze.emoji} {subject}
            </button>
          );
        })}
      </div>

      {/* 5단계 배지 표시 */}
      <div className="grid grid-cols-5 gap-4">
        {(['bronze', 'silver', 'gold', 'platinum', 'diamond'] as const).map((tier, i) => {
          const badge = badges[tier];
          const track = CAT_EXPERT_TRACK[i]; // 고양이 기준 (다른 대상도 동일 구조)
          const color = DESIGN_PRINCIPLES.growthLevels.colors[tier];

          return (
            <div
              key={tier}
              className="p-4 rounded-xl text-center"
              style={{ background: color + '15', border: `1px solid ${color}40` }}
            >
              <div className="text-3xl mb-2">{badge.emoji}</div>
              <p className="font-bold text-sm" style={{ color }}>
                {badge.name}
              </p>
              <p className="text-xs text-[var(--db-muted)] mt-2">{track.estimatedTime}</p>
              <p className="text-xs text-[var(--db-muted)]">획득률: {track.acquisitionRate}</p>
            </div>
          );
        })}
      </div>

      {/* 조건 상세 */}
      <div className="db-callout">
        <h4 className="font-medium text-[var(--db-text)] mb-3">단계별 요구 조건 (고양이 예시)</h4>
        <div className="space-y-3">
          {CAT_EXPERT_TRACK.map((track, i) => (
            <div key={i} className="flex items-start gap-4 text-sm">
              <span
                className="px-2 py-1 rounded text-xs font-bold"
                style={{
                  background: Object.values(DESIGN_PRINCIPLES.growthLevels.colors)[i] + '30',
                  color: Object.values(DESIGN_PRINCIPLES.growthLevels.colors)[i],
                }}
              >
                Lv.{track.level}
              </span>
              <div className="flex-1 text-[var(--db-muted)]">
                {track.requirements.test && '기본 테스트'}
                {track.requirements.detailTest && ' + 품종 테스트'}
                {track.requirements.quizCorrect && ` + 퀴즈 ${track.requirements.quizCorrect}개 정답`}
                {track.requirements.quizAccuracy && ` (정답률 ${track.requirements.quizAccuracy}%+)`}
                {track.requirements.pollVotes && ` + 투표 ${track.requirements.pollVotes}회`}
                {track.requirements.streakDays && ` + ${track.requirements.streakDays}일 스트릭`}
                {track.requirements.communityLikes && ` + 좋아요 ${track.requirements.communityLikes}개 받음`}
                {track.requirements.answersAdopted && ` + 채택 ${track.requirements.answersAdopted}회`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 커뮤니티 탭
// ============================================================================

function CommunityTab() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[var(--db-text)]">커뮤니티 기여 배지 (5단계)</h3>

      <div className="grid grid-cols-5 gap-4">
        {COMMUNITY_CONTRIBUTION_TRACK.map((badge, i) => {
          const color = Object.values(DESIGN_PRINCIPLES.growthLevels.colors)[i];

          return (
            <div
              key={badge.level}
              className="p-4 rounded-xl text-center"
              style={{ background: color + '15', border: `1px solid ${color}40` }}
            >
              <div className="text-3xl mb-2">{badge.emoji}</div>
              <p className="font-bold text-sm" style={{ color }}>
                {badge.name}
              </p>
              <p className="text-xs text-[var(--db-muted)] mt-2">{badge.description}</p>
              <p className="text-xs text-[var(--db-muted)] mt-1">{badge.estimatedTime}</p>
            </div>
          );
        })}
      </div>

      <div className="db-callout">
        <h4 className="font-medium text-[var(--db-text)] mb-3">핵심 원칙</h4>
        <ul className="space-y-2 text-sm text-[var(--db-muted)]">
          <li>• <strong>받는 행동</strong>이 더 높은 가치: 좋아요 받음 {'>'} 좋아요 클릭</li>
          <li>• <strong>답변 채택</strong>이 가장 큰 보상 (+50점)</li>
          <li>• 최고 등급(전설의 조언자)까지 <strong>1년+ 소요</strong></li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// 비율 배지 탭
// ============================================================================

function PercentileTab() {
  const rarityColors = {
    rare: '#60A5FA',
    epic: '#A78BFA',
    legendary: '#FBBF24',
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[var(--db-text)]">비율 배지 (Spotify Wrapped 스타일)</h3>

      <div className="grid grid-cols-2 gap-4">
        {PERCENTILE_BADGES.map((badge) => (
          <div
            key={badge.id}
            className="p-4 rounded-xl flex items-center gap-4"
            style={{
              background: rarityColors[badge.rarity] + '15',
              border: `1px solid ${rarityColors[badge.rarity]}40`,
            }}
          >
            <div className="text-3xl">{badge.emoji}</div>
            <div className="flex-1">
              <p className="font-bold text-sm" style={{ color: rarityColors[badge.rarity] }}>
                {badge.name}
              </p>
              <p className="text-xs text-[var(--db-muted)]">{badge.description}</p>
              <p className="text-xs text-[var(--db-muted)] mt-1">
                {badge.recalculatePeriod === 'monthly' ? '월간' : badge.recalculatePeriod === 'weekly' ? '주간' : '연간'} 갱신
              </p>
            </div>
            <span
              className="px-2 py-1 rounded text-xs font-bold"
              style={{ background: rarityColors[badge.rarity] + '30', color: rarityColors[badge.rarity] }}
            >
              Top {badge.percentile}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 퀴즈 대결 탭
// ============================================================================

function DuelTab() {
  const rarityColors = {
    common: '#9CA3AF',
    rare: '#60A5FA',
    epic: '#A78BFA',
    legendary: '#FBBF24',
  };

  const groupedBadges = {
    참여: DUEL_BADGES.filter((b) => b.id.startsWith('duel-')),
    승리: DUEL_BADGES.filter((b) => b.id.startsWith('win-')),
    연승: DUEL_BADGES.filter((b) => b.id.startsWith('streak-')),
    승률: DUEL_BADGES.filter((b) => b.id.startsWith('winrate-')),
    특수: DUEL_BADGES.filter((b) => ['comeback-king', 'perfect-win', 'speed-demon'].includes(b.id)),
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[var(--db-text)]">퀴즈 대결 배지 ({DUEL_BADGES.length}개)</h3>

      {Object.entries(groupedBadges).map(([group, badges]) => (
        <div key={group}>
          <h4 className="text-sm font-medium text-[var(--db-muted)] mb-3">{group}</h4>
          <div className="grid grid-cols-4 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="p-3 rounded-lg text-center"
                style={{
                  background: rarityColors[badge.rarity] + '10',
                  border: `1px solid ${rarityColors[badge.rarity]}30`,
                }}
              >
                <div className="text-2xl mb-1">{badge.emoji}</div>
                <p className="font-medium text-xs" style={{ color: rarityColors[badge.rarity] }}>
                  {badge.name}
                </p>
                <p className="text-xs text-[var(--db-muted)] mt-1">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// 특별 달성 탭
// ============================================================================

function SpecialTab() {
  const rarityColors = {
    common: '#9CA3AF',
    rare: '#60A5FA',
    epic: '#A78BFA',
    legendary: '#FBBF24',
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[var(--db-text)]">특별 달성 배지</h3>

      <div className="grid grid-cols-3 gap-4">
        {SPECIAL_ACHIEVEMENT_BADGES.map((badge) => (
          <div
            key={badge.id}
            className="p-4 rounded-xl text-center"
            style={{
              background: rarityColors[badge.rarity as keyof typeof rarityColors] + '15',
              border: `1px solid ${rarityColors[badge.rarity as keyof typeof rarityColors]}40`,
            }}
          >
            <div className="text-3xl mb-2">{badge.emoji}</div>
            <p
              className="font-bold text-sm"
              style={{ color: rarityColors[badge.rarity as keyof typeof rarityColors] }}
            >
              {badge.name}
            </p>
            <p className="text-xs text-[var(--db-muted)] mt-1">{badge.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 구현 로드맵 탭
// ============================================================================

function RoadmapTab() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[var(--db-text)]">구현 우선순위</h3>

      <div className="space-y-4">
        {IMPLEMENTATION_PRIORITY.map((phase) => (
          <div key={phase.phase} className="db-callout">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[var(--db-brand)] text-white flex items-center justify-center font-bold text-sm">
                  {phase.phase}
                </span>
                <h4 className="font-medium text-[var(--db-text)]">{phase.name}</h4>
              </div>
              <span className="text-xs text-[var(--db-muted)]">{phase.effort}</span>
            </div>
            <ul className="space-y-1">
              {phase.items.map((item, i) => (
                <li key={i} className="text-sm text-[var(--db-muted)] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--db-brand)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
