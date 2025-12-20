// 자동 랭킹 주제 생성 시스템
// petMatch, plant 등의 결과에서 메타데이터 기반으로 랭킹 자동 생성

import { ResultLabel, ResultMeta, SubjectData } from './types';

const DEFAULT_META: ResultMeta = {
  heatTolerance: 3,
  coldTolerance: 3,
  humidityTolerance: 3,
  beginnerFriendly: 3,
  careLevel: 3,
  monthlyCoast: 'medium',
  spaceNeeded: 'medium',
  noiseLevel: 'medium',
};

function applyMetaDefaults(meta?: ResultMeta): ResultMeta {
  return {
    ...DEFAULT_META,
    ...(meta || {}),
  };
}

// 랭킹 템플릿 타입
export interface RankingTemplate {
  id: string;
  title: string;              // 표시 제목 (예: "🌡️ 여름에 조심해야 할")
  description: string;        // 설명
  subject: 'petMatch' | 'plant' | 'all';  // 대상 테스트
  // 필터 조건 (선택)
  filter?: {
    field: keyof ResultMeta;
    operator: 'eq' | 'lte' | 'gte' | 'in' | 'notIn';
    value: number | string | string[];
  };
  // 정렬 기준
  sort: {
    field: keyof ResultMeta;
    order: 'asc' | 'desc';
  };
  // 계절 관련 (선택)
  season?: 'spring' | 'summer' | 'fall' | 'winter';
  // 태그 (분류용)
  tags?: string[];
}

// === petMatch 랭킹 템플릿 ===
export const PET_RANKING_TEMPLATES: RankingTemplate[] = [
  // 계절별
  {
    id: 'pet-summer-danger',
    title: '🌡️ 여름에 특히 조심해야 할 반려동물',
    description: '더위에 약한 반려동물 순위',
    subject: 'petMatch',
    sort: { field: 'heatTolerance', order: 'asc' },
    season: 'summer',
    tags: ['계절', '여름', '건강']
  },
  {
    id: 'pet-winter-danger',
    title: '❄️ 겨울에 특히 조심해야 할 반려동물',
    description: '추위에 약한 반려동물 순위',
    subject: 'petMatch',
    sort: { field: 'coldTolerance', order: 'asc' },
    season: 'winter',
    tags: ['계절', '겨울', '건강']
  },
  // 초보자용
  {
    id: 'pet-beginner-friendly',
    title: '🌟 초보자에게 추천하는 반려동물',
    description: '키우기 쉬운 반려동물 순위',
    subject: 'petMatch',
    sort: { field: 'beginnerFriendly', order: 'desc' },
    tags: ['초보자', '추천']
  },
  {
    id: 'pet-hard-to-raise',
    title: '😰 초보자가 피해야 할 반려동물',
    description: '관리가 어려운 반려동물 순위',
    subject: 'petMatch',
    sort: { field: 'careLevel', order: 'desc' },
    tags: ['초보자', '주의']
  },
  // 환경별
  {
    id: 'pet-small-space',
    title: '🏠 원룸에서 키우기 좋은 반려동물',
    description: '작은 공간에서도 OK인 반려동물',
    subject: 'petMatch',
    filter: { field: 'spaceNeeded', operator: 'eq', value: 'small' },
    sort: { field: 'beginnerFriendly', order: 'desc' },
    tags: ['원룸', '1인가구']
  },
  {
    id: 'pet-quiet',
    title: '🤫 층간소음 걱정 없는 반려동물',
    description: '조용한 반려동물 순위',
    subject: 'petMatch',
    sort: { field: 'noiseLevel', order: 'asc' },
    tags: ['아파트', '소음']
  },
  // 비용별
  {
    id: 'pet-low-cost',
    title: '💰 유지비가 적게 드는 반려동물',
    description: '경제적인 반려동물 순위',
    subject: 'petMatch',
    filter: { field: 'monthlyCoast', operator: 'eq', value: 'low' },
    sort: { field: 'careLevel', order: 'asc' },
    tags: ['비용', '경제적']
  }
];

// === plant 랭킹 템플릿 ===
export const PLANT_RANKING_TEMPLATES: RankingTemplate[] = [
  // 계절별
  {
    id: 'plant-winter-danger',
    title: '❄️ 겨울에 죽기 쉬운 식물',
    description: '추위에 약해 겨울 관리가 필요한 식물',
    subject: 'plant',
    sort: { field: 'coldTolerance', order: 'asc' },
    season: 'winter',
    tags: ['계절', '겨울', '주의']
  },
  {
    id: 'plant-summer-humidity',
    title: '💦 여름 습도 관리가 중요한 식물',
    description: '습도에 민감한 식물 순위',
    subject: 'plant',
    sort: { field: 'humidityTolerance', order: 'desc' },
    season: 'summer',
    tags: ['계절', '여름', '습도']
  },
  // 초보자용
  {
    id: 'plant-beginner',
    title: '🌱 초보 식집사 추천 식물',
    description: '죽이기 어려운 식물 순위',
    subject: 'plant',
    sort: { field: 'beginnerFriendly', order: 'desc' },
    tags: ['초보자', '추천']
  },
  {
    id: 'plant-hard',
    title: '😱 관리 어려운 식물',
    description: '상급자용 식물 순위',
    subject: 'plant',
    sort: { field: 'careLevel', order: 'desc' },
    tags: ['상급자', '주의']
  },
  // 환경별
  {
    id: 'plant-dark-room',
    title: '🌑 어두운 방에서도 잘 자라는 식물',
    description: '저조도 환경 식물 순위',
    subject: 'plant',
    filter: { field: 'suitableFor', operator: 'in', value: ['어두운방', '저조도'] },
    sort: { field: 'beginnerFriendly', order: 'desc' },
    tags: ['저조도', '어두운방']
  },
  {
    id: 'plant-small-space',
    title: '📦 책상 위에 두기 좋은 식물',
    description: '작은 공간 식물 순위',
    subject: 'plant',
    filter: { field: 'spaceNeeded', operator: 'eq', value: 'small' },
    sort: { field: 'beginnerFriendly', order: 'desc' },
    tags: ['소공간', '책상', '원룸']
  },
  {
    id: 'plant-air-purify',
    title: '🌬️ 공기정화 효과 좋은 식물',
    description: 'NASA 인증 공기정화 식물',
    subject: 'plant',
    filter: { field: 'tags', operator: 'in', value: ['공기정화'] },
    sort: { field: 'beginnerFriendly', order: 'desc' },
    tags: ['공기정화', '건강']
  },
  // 특수 목적
  {
    id: 'plant-neglect-ok',
    title: '🏃 바쁜 직장인에게 추천하는 식물',
    description: '방치해도 괜찮은 식물 순위',
    subject: 'plant',
    sort: { field: 'careLevel', order: 'asc' },
    tags: ['직장인', '저관리']
  }
];

// 모든 템플릿 통합
export const ALL_RANKING_TEMPLATES = [
  ...PET_RANKING_TEMPLATES,
  ...PLANT_RANKING_TEMPLATES
];

// === 랭킹 생성 함수 ===

/**
 * 템플릿 기반으로 랭킹 생성
 */
export function generateRanking(
  template: RankingTemplate,
  results: ResultLabel[]
): ResultLabel[] {
  const normalizedResults = results.map(result => ({
    ...result,
    meta: applyMetaDefaults(result.meta),
  }));
  let filtered = normalizedResults;

  // 필터 적용
  if (template.filter) {
    filtered = filtered.filter(r => {
      if (!r.meta) return false;
      const value = r.meta[template.filter!.field];
      const targetValue = template.filter!.value;

      switch (template.filter!.operator) {
        case 'eq':
          return value === targetValue;
        case 'lte':
          return typeof value === 'number' && value <= (targetValue as number);
        case 'gte':
          return typeof value === 'number' && value >= (targetValue as number);
        case 'in':
          if (Array.isArray(value) && Array.isArray(targetValue)) {
            return value.some(v => targetValue.includes(v));
          }
          if (Array.isArray(targetValue)) {
            return targetValue.includes(value as string);
          }
          return false;
        case 'notIn':
          if (Array.isArray(targetValue)) {
            return !targetValue.includes(value as string);
          }
          return true;
        default:
          return true;
      }
    });
  }

  // 정렬 적용
  const sorted = [...filtered].sort((a, b) => {
    const aVal = a.meta?.[template.sort.field];
    const bVal = b.meta?.[template.sort.field];

    // 숫자 정렬
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return template.sort.order === 'asc' ? aVal - bVal : bVal - aVal;
    }

    // 문자열/enum 정렬 (low < medium < high, small < medium < large)
    const orderMap: Record<string, number> = {
      'silent': 0, 'low': 1, 'medium': 2, 'high': 3,
      'small': 1, 'large': 3
    };

    const aOrder = orderMap[aVal as string] ?? 0;
    const bOrder = orderMap[bVal as string] ?? 0;

    return template.sort.order === 'asc' ? aOrder - bOrder : bOrder - aOrder;
  });

  return sorted;
}

/**
 * 현재 계절에 맞는 템플릿 필터링
 */
export function getCurrentSeasonTemplates(): RankingTemplate[] {
  const month = new Date().getMonth() + 1;
  let season: 'spring' | 'summer' | 'fall' | 'winter';

  if (month >= 3 && month <= 5) season = 'spring';
  else if (month >= 6 && month <= 8) season = 'summer';
  else if (month >= 9 && month <= 11) season = 'fall';
  else season = 'winter';

  return ALL_RANKING_TEMPLATES.filter(t => !t.season || t.season === season);
}

/**
 * 오늘의 랜덤 랭킹 추천
 */
export function getTodayRanking(): RankingTemplate {
  const templates = getCurrentSeasonTemplates();
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return templates[dayOfYear % templates.length];
}

/**
 * 계절별 팁 가져오기
 */
export function getSeasonalTips(results: ResultLabel[]): Array<{result: ResultLabel, tip: string}> {
  const month = new Date().getMonth() + 1;
  let season: 'spring' | 'summer' | 'fall' | 'winter';

  if (month >= 3 && month <= 5) season = 'spring';
  else if (month >= 6 && month <= 8) season = 'summer';
  else if (month >= 9 && month <= 11) season = 'fall';
  else season = 'winter';

  return results
    .filter(r => r.meta?.seasonalTips?.[season])
    .map(r => ({
      result: r,
      tip: r.meta!.seasonalTips![season]!
    }));
}
