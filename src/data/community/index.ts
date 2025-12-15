// ============================================================================
// 커뮤니티 데이터 모듈
// ============================================================================

// 타입 정의
export * from './types';

// 샘플 데이터
export {
  SAMPLE_TIPS,
  SAMPLE_QUESTIONS,
  SAMPLE_ANSWERS,
  SAMPLE_POLLS,
  SAMPLE_QUIZZES,
  SAMPLE_DEBATES,
} from './sample-data';

// ============================================================================
// 유틸리티 함수
// ============================================================================

import { CommunityCategory } from './types';

// 카테고리 라벨 매핑
export const CATEGORY_LABELS: Record<CommunityCategory, { name: string; emoji: string }> = {
  cat: { name: '고양이', emoji: '🐱' },
  dog: { name: '강아지', emoji: '🐕' },
  rabbit: { name: '토끼', emoji: '🐰' },
  hamster: { name: '햄스터', emoji: '🐹' },
  fish: { name: '관상어', emoji: '🐟' },
  bird: { name: '새', emoji: '🐦' },
  reptile: { name: '파충류', emoji: '🦎' },
  smallPet: { name: '소동물', emoji: '🐾' },
  plant: { name: '식물', emoji: '🌿' },
  coffee: { name: '커피', emoji: '☕' },
  personality: { name: '성격', emoji: '🧠' },
  relationship: { name: '연애', emoji: '💕' },
  general: { name: '일반', emoji: '💬' },
};

// 테스트 타입 → 커뮤니티 카테고리 매핑
export function testTypeToCategory(testType: string): CommunityCategory {
  const mapping: Record<string, CommunityCategory> = {
    cat: 'cat',
    catBreed: 'cat',
    dog: 'dog',
    dogBreed: 'dog',
    rabbit: 'rabbit',
    hamster: 'hamster',
    smallPet: 'smallPet',
    fishType: 'fish',
    birdType: 'bird',
    reptileType: 'reptile',
    plant: 'plant',
    coffee: 'coffee',
    human: 'personality',
    idealType: 'relationship',
    conflictStyle: 'relationship',
    petMatch: 'general',
  };
  return mapping[testType] || 'general';
}

// 날짜 포맷팅 (상대 시간)
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}주 전`;
  if (diffDay < 365) return `${Math.floor(diffDay / 30)}개월 전`;
  return `${Math.floor(diffDay / 365)}년 전`;
}

// 숫자 포맷팅 (1000 → 1K)
export function formatNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 10000) return `${(num / 1000).toFixed(1)}K`;
  if (num < 1000000) return `${Math.floor(num / 1000)}K`;
  return `${(num / 1000000).toFixed(1)}M`;
}
