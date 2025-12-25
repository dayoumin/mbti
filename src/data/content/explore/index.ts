// ============================================================================
// 콘텐츠 탐색 데이터 모듈 (팁, Q&A, 투표, 퀴즈, 토론)
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
} from './community-data';

// ============================================================================
// 유틸리티 함수
// ============================================================================

import type { CommunityCategory } from '../types';

// 공통 유틸리티 re-export
export { formatRelativeTime, formatNumber } from '@/utils/format';

// 카테고리 라벨 re-export
export { CATEGORY_LABELS } from '../categories';

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
