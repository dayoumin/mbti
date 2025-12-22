/**
 * 시즌/분기 관련 상수
 *
 * 사용처:
 * - RankingService 시즌명 표시
 * - 랭킹 통계 분기별 집계
 */

// 분기명 매핑
export const QUARTER_NAMES: Record<string, string> = {
  'Q1': '1분기 (봄맞이)',
  'Q2': '2분기 (여름)',
  'Q3': '3분기 (가을)',
  'Q4': '4분기 (연말)',
} as const;

// 분기별 이모지
export const QUARTER_EMOJIS: Record<string, string> = {
  'Q1': '🌸',
  'Q2': '☀️',
  'Q3': '🍂',
  'Q4': '❄️',
} as const;

// 시즌 타입
export const SEASON_TYPES = {
  YEARLY: 'yearly',
  QUARTERLY: 'quarterly',
  EVENT: 'event',
} as const;

// 시즌 타입 설명
export const SEASON_TYPE_LABELS: Record<string, { label: string; duration: string }> = {
  yearly: { label: '연간 랭킹', duration: '1년' },
  quarterly: { label: '분기 랭킹', duration: '3개월' },
  event: { label: '이벤트 랭킹', duration: '기간별' },
} as const;

// 분기명 조회 헬퍼
export function getQuarterName(quarter: string): string {
  return QUARTER_NAMES[quarter] || quarter;
}

// 시즌 ID로부터 표시용 이름 생성
export function getSeasonDisplayName(seasonId: string): string {
  if (seasonId.includes('yearly')) {
    const year = seasonId.split('-')[0];
    return `${year} 연간 랭킹`;
  }
  if (seasonId.includes('Q')) {
    const [year, quarter] = seasonId.split('-');
    return `${year} ${QUARTER_NAMES[quarter] || quarter}`;
  }
  if (seasonId.includes('event')) {
    return '특별 이벤트 랭킹';
  }
  return seasonId;
}
