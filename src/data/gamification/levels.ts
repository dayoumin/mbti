// ============================================================================
// 레벨 시스템
// ============================================================================

import type { Level, DailyMission } from './types';

export const LEVELS: Level[] = [
  { level: 1, name: '새싹', emoji: '🌱', minPoints: 0, maxPoints: 99 },
  { level: 2, name: '풀잎', emoji: '🌿', minPoints: 100, maxPoints: 299 },
  { level: 3, name: '나무', emoji: '🌳', minPoints: 300, maxPoints: 599 },
  { level: 4, name: '숲', emoji: '🌲', minPoints: 600, maxPoints: 999 },
  { level: 5, name: '별', emoji: '⭐', minPoints: 1000, maxPoints: 1999 },
  { level: 6, name: '달', emoji: '🌙', minPoints: 2000, maxPoints: 3999 },
  { level: 7, name: '태양', emoji: '☀️', minPoints: 4000, maxPoints: 7999 },
  { level: 8, name: '은하', emoji: '🌌', minPoints: 8000, maxPoints: 14999 },
  { level: 9, name: '우주', emoji: '🚀', minPoints: 15000, maxPoints: 29999 },
  { level: 10, name: '전설', emoji: '👑', minPoints: 30000, maxPoints: Infinity },
];

// 포인트로 레벨 조회
export function getLevelByPoints(points: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

// 다음 레벨까지 필요한 포인트
export function getPointsToNextLevel(points: number): { current: number; needed: number; progress: number } {
  const currentLevel = getLevelByPoints(points);
  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);

  if (!nextLevel) {
    return { current: points, needed: 0, progress: 100 };
  }

  const pointsInCurrentLevel = points - currentLevel.minPoints;
  const pointsNeededForLevel = nextLevel.minPoints - currentLevel.minPoints;
  const progress = Math.floor((pointsInCurrentLevel / pointsNeededForLevel) * 100);

  return {
    current: pointsInCurrentLevel,
    needed: pointsNeededForLevel,
    progress,
  };
}

// ============================================================================
// 일일 미션
// ============================================================================

export const DAILY_MISSIONS: DailyMission[] = [
  {
    id: 'daily-visit',
    title: '오늘도 방문',
    description: '오늘 첫 방문',
    emoji: '👋',
    target: 1,
    points: 5,
    type: 'visit',
  },
  {
    id: 'daily-quiz',
    title: '오늘의 퀴즈',
    description: '퀴즈 1개 풀기',
    emoji: '🧠',
    target: 1,
    points: 10,
    type: 'quiz',
  },
  {
    id: 'daily-poll',
    title: '오늘의 투표',
    description: '투표 1개 참여',
    emoji: '🗳️',
    target: 1,
    points: 10,
    type: 'poll',
  },
  {
    id: 'daily-test',
    title: '테스트 도전',
    description: '테스트 1개 완료',
    emoji: '📝',
    target: 1,
    points: 20,
    type: 'test',
  },
];

// 일일 미션 완료 포인트 계산
export function calculateDailyMissionPoints(completedMissions: string[]): number {
  return DAILY_MISSIONS
    .filter(m => completedMissions.includes(m.id))
    .reduce((sum, m) => sum + m.points, 0);
}
