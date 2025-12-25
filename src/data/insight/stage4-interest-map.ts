// ============================================================================
// Stage 4: 관심사 지도
// ============================================================================
// 총 활동 15개 이상 완료 시 해금
// 카테고리별 참여 비율 시각화 + 관심사 태그 분석

import { CATEGORY_TO_INTEREST, type InterestTag } from './insight-tags';

// ============================================================================
// 타입 정의
// ============================================================================

export interface InterestCategory {
  id: string;
  name: string;
  nameKr: string;
  emoji: string;
  color: string; // Tailwind color class
  tags: InterestTag[];
}

export interface InterestMapEntry {
  category: InterestCategory;
  count: number;
  percentage: number;
  rank: number;
}

export interface InterestMapResult {
  entries: InterestMapEntry[];
  totalActivities: number;
  topCategory: InterestCategory | null;
  interestProfile: InterestProfile;
  insights: string[];
  generatedAt: string;
}

export interface InterestProfile {
  id: string;
  name: string;
  nameKr: string;
  emoji: string;
  description: string;
  characteristics: string[];
}

// ============================================================================
// 관심사 카테고리 정의
// ============================================================================

export const INTEREST_CATEGORIES: InterestCategory[] = [
  {
    id: 'pets',
    name: 'Pets',
    nameKr: '반려동물',
    emoji: '🐾',
    color: 'bg-amber-100',
    tags: [
      'interest-cat',
      'interest-dog',
      'interest-rabbit',
      'interest-hamster',
      'interest-bird',
      'interest-fish',
      'interest-reptile',
      'interest-pet',
    ],
  },
  {
    id: 'nature',
    name: 'Nature',
    nameKr: '자연/식물',
    emoji: '🌿',
    color: 'bg-green-100',
    tags: ['interest-plant', 'interest-nature'],
  },
  {
    id: 'food-drink',
    name: 'Food & Drink',
    nameKr: '음식/음료',
    emoji: '☕',
    color: 'bg-orange-100',
    tags: ['interest-coffee', 'interest-food', 'interest-alcohol'],
  },
  {
    id: 'relationships',
    name: 'Relationships',
    nameKr: '관계/연애',
    emoji: '💕',
    color: 'bg-pink-100',
    tags: ['interest-love'],
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    nameKr: '라이프스타일',
    emoji: '✨',
    color: 'bg-purple-100',
    tags: ['interest-lifestyle', 'interest-money'],
  },
  {
    id: 'fortune',
    name: 'Fortune',
    nameKr: '운세/심리',
    emoji: '🔮',
    color: 'bg-indigo-100',
    tags: ['interest-tarot', 'interest-zodiac', 'interest-psychology'],
  },
];

// ============================================================================
// 관심사 프로필 정의
// ============================================================================

export const INTEREST_PROFILES: InterestProfile[] = [
  {
    id: 'pet-lover',
    name: 'Pet Lover',
    nameKr: '동물 친구',
    emoji: '🐾',
    description: '반려동물에 깊은 관심과 애정을 가지고 있어요.',
    characteristics: [
      '동물 관련 콘텐츠에 적극적으로 참여해요',
      '반려동물 케어에 관심이 많아요',
      '동물의 성격과 행동을 이해하려 해요',
    ],
  },
  {
    id: 'nature-seeker',
    name: 'Nature Seeker',
    nameKr: '자연 탐구자',
    emoji: '🌿',
    description: '식물과 자연에서 힐링을 찾는 타입이에요.',
    characteristics: [
      '식물 키우기에 관심이 있어요',
      '자연 속에서 에너지를 얻어요',
      '느리고 조용한 것을 좋아해요',
    ],
  },
  {
    id: 'foodie',
    name: 'Foodie',
    nameKr: '미식가',
    emoji: '☕',
    description: '음식과 음료에 대한 취향이 확실해요.',
    characteristics: [
      '새로운 맛을 시도하는 걸 좋아해요',
      '음식/음료 관련 콘텐츠에 적극적이에요',
      '취향을 공유하는 것을 즐겨요',
    ],
  },
  {
    id: 'relationship-explorer',
    name: 'Relationship Explorer',
    nameKr: '관계 탐험가',
    emoji: '💕',
    description: '인간관계와 연애에 대한 호기심이 많아요.',
    characteristics: [
      '관계 역학에 관심이 많아요',
      '사람의 심리를 이해하려 해요',
      '소통과 연결을 중요하게 여겨요',
    ],
  },
  {
    id: 'lifestyle-curator',
    name: 'Lifestyle Curator',
    nameKr: '라이프스타일 큐레이터',
    emoji: '✨',
    description: '일상을 가꾸는 것에 관심이 많아요.',
    characteristics: [
      '삶의 질을 높이는 것에 관심이 있어요',
      '자기계발과 성장을 추구해요',
      '현명한 선택을 중요하게 여겨요',
    ],
  },
  {
    id: 'fortune-seeker',
    name: 'Fortune Seeker',
    nameKr: '운명 탐구자',
    emoji: '🔮',
    description: '운세와 심리에 깊은 관심을 가지고 있어요.',
    characteristics: [
      '타로, 별자리 등에 관심이 많아요',
      '자기 이해를 추구해요',
      '우연과 운명에 대해 생각해요',
    ],
  },
  {
    id: 'all-rounder',
    name: 'All-Rounder',
    nameKr: '다방면 탐구자',
    emoji: '🌈',
    description: '다양한 분야에 고르게 관심을 가지고 있어요.',
    characteristics: [
      '호기심이 넓어요',
      '새로운 분야에 열린 마음이에요',
      '다양한 경험을 추구해요',
    ],
  },
];

// ============================================================================
// 관심사 지도 분석 함수
// ============================================================================

/**
 * 태그 카운트에서 관심사 카테고리별 집계
 * @param tagCounts 태그별 카운트
 */
export function aggregateByCategory(
  tagCounts: Record<string, number>
): Map<string, number> {
  const categoryMap = new Map<string, number>();

  // 각 카테고리 초기화
  for (const category of INTEREST_CATEGORIES) {
    categoryMap.set(category.id, 0);
  }

  // 태그 → 카테고리 집계
  for (const [tag, count] of Object.entries(tagCounts)) {
    // interest- 태그만 처리
    if (!tag.startsWith('interest-')) continue;

    // 해당 카테고리 찾기
    for (const category of INTEREST_CATEGORIES) {
      if (category.tags.includes(tag as InterestTag)) {
        const current = categoryMap.get(category.id) || 0;
        categoryMap.set(category.id, current + count);
        break;
      }
    }
  }

  return categoryMap;
}

/**
 * 콘텐츠 카테고리를 관심사 태그로 변환
 * @param category 콘텐츠 카테고리 (예: 'cat', 'dog')
 */
export function categoryToInterestTag(category: string): InterestTag | null {
  return CATEGORY_TO_INTEREST[category] || null;
}

/**
 * 관심사 지도 결과 생성
 * @param tagCounts 태그별 카운트
 * @param totalActivities 총 활동 수
 */
export function generateInterestMapResult(
  tagCounts: Record<string, number>,
  totalActivities: number
): InterestMapResult {
  const categoryMap = aggregateByCategory(tagCounts);

  // 카테고리별 엔트리 생성
  const entries: InterestMapEntry[] = [];
  let totalInterestCount = 0;

  for (const category of INTEREST_CATEGORIES) {
    const count = categoryMap.get(category.id) || 0;
    totalInterestCount += count;
    entries.push({
      category,
      count,
      percentage: 0, // 나중에 계산
      rank: 0,
    });
  }

  // 퍼센티지 계산 및 정렬
  entries.forEach(entry => {
    entry.percentage = totalInterestCount > 0
      ? Math.round((entry.count / totalInterestCount) * 100)
      : 0;
  });

  // 카운트 기준 정렬
  entries.sort((a, b) => b.count - a.count);

  // 순위 부여
  entries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  // 상위 카테고리
  const topCategory = entries[0]?.count > 0 ? entries[0].category : null;

  // 관심사 프로필 결정
  const interestProfile = determineInterestProfile(entries);

  // 인사이트 생성
  const insights = generateInterestInsights(entries, totalActivities);

  return {
    entries,
    totalActivities,
    topCategory,
    interestProfile,
    insights,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * 관심사 프로필 결정
 */
function determineInterestProfile(entries: InterestMapEntry[]): InterestProfile {
  // 상위 카테고리가 50% 이상이면 해당 프로필
  const top = entries[0];
  if (top && top.percentage >= 50) {
    switch (top.category.id) {
      case 'pets':
        return INTEREST_PROFILES.find(p => p.id === 'pet-lover')!;
      case 'nature':
        return INTEREST_PROFILES.find(p => p.id === 'nature-seeker')!;
      case 'food-drink':
        return INTEREST_PROFILES.find(p => p.id === 'foodie')!;
      case 'relationships':
        return INTEREST_PROFILES.find(p => p.id === 'relationship-explorer')!;
      case 'lifestyle':
        return INTEREST_PROFILES.find(p => p.id === 'lifestyle-curator')!;
      case 'fortune':
        return INTEREST_PROFILES.find(p => p.id === 'fortune-seeker')!;
    }
  }

  // 상위 2개 카테고리가 비슷하면 all-rounder
  const second = entries[1];
  if (top && second && top.percentage - second.percentage < 15) {
    return INTEREST_PROFILES.find(p => p.id === 'all-rounder')!;
  }

  // 기본값: 상위 카테고리 기반
  if (top?.count > 0) {
    switch (top.category.id) {
      case 'pets':
        return INTEREST_PROFILES.find(p => p.id === 'pet-lover')!;
      case 'nature':
        return INTEREST_PROFILES.find(p => p.id === 'nature-seeker')!;
      case 'food-drink':
        return INTEREST_PROFILES.find(p => p.id === 'foodie')!;
      case 'relationships':
        return INTEREST_PROFILES.find(p => p.id === 'relationship-explorer')!;
      case 'lifestyle':
        return INTEREST_PROFILES.find(p => p.id === 'lifestyle-curator')!;
      case 'fortune':
        return INTEREST_PROFILES.find(p => p.id === 'fortune-seeker')!;
    }
  }

  return INTEREST_PROFILES.find(p => p.id === 'all-rounder')!;
}

/**
 * 관심사 인사이트 생성
 */
function generateInterestInsights(
  entries: InterestMapEntry[],
  totalActivities: number
): string[] {
  const insights: string[] = [];

  const top = entries[0];
  const second = entries[1];

  // 1. 상위 카테고리 인사이트
  if (top && top.percentage >= 40) {
    insights.push(
      `${top.category.emoji} ${top.category.nameKr} 콘텐츠에 특히 관심이 많으시네요! (${top.percentage}%)`
    );
  }

  // 2. 상위 2개 비교
  if (top && second && top.count > 0 && second.count > 0) {
    if (top.percentage - second.percentage < 10) {
      insights.push(
        `${top.category.emoji}${second.category.emoji} ${top.category.nameKr}와 ${second.category.nameKr}에 비슷하게 관심이 있어요.`
      );
    }
  }

  // 3. 참여도 기반 인사이트
  const activeCategories = entries.filter(e => e.count > 0).length;
  if (activeCategories >= 4) {
    insights.push('🌈 다양한 분야에 호기심이 많으시네요!');
  } else if (activeCategories <= 2 && top?.percentage >= 60) {
    insights.push('🎯 특정 분야에 집중하는 성향이에요.');
  }

  // 4. 활동량 기반 인사이트
  if (totalActivities >= 30) {
    insights.push('📊 충분한 데이터가 쌓여서 정확한 분석이 가능해요!');
  } else if (totalActivities >= 15) {
    insights.push('📈 더 많이 참여할수록 정확한 관심사 지도가 완성돼요.');
  }

  // 5. 특정 조합 인사이트
  const petEntry = entries.find(e => e.category.id === 'pets');
  const natureEntry = entries.find(e => e.category.id === 'nature');
  if (petEntry && natureEntry && petEntry.count > 0 && natureEntry.count > 0) {
    insights.push('🐾🌿 반려동물과 자연 모두 좋아하시는군요! 힐링을 추구하시네요.');
  }

  return insights.slice(0, 4); // 최대 4개
}

// ============================================================================
// 시각화 헬퍼
// ============================================================================

/**
 * 관심사 지도를 텍스트 바 차트로 표현
 */
export function interestMapToBarChart(entries: InterestMapEntry[]): string[] {
  const maxCount = Math.max(...entries.map(e => e.count), 1);

  return entries
    .filter(e => e.count > 0)
    .slice(0, 6)
    .map(entry => {
      const barLength = Math.round((entry.count / maxCount) * 10);
      const bar = '█'.repeat(barLength) + '░'.repeat(10 - barLength);
      return `${entry.category.emoji} ${entry.category.nameKr.padEnd(8)} ${bar} ${entry.percentage}%`;
    });
}

/**
 * 간단한 관심사 요약
 */
export function getInterestSummary(result: InterestMapResult): string {
  if (!result.topCategory) {
    return '아직 관심사 데이터가 부족해요. 더 많이 참여해보세요!';
  }

  const { interestProfile, topCategory } = result;
  return `${interestProfile.emoji} ${interestProfile.nameKr}: ${topCategory.nameKr}에 관심이 많아요!`;
}