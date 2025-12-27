/**
 * contentValidity.ts 유닛 테스트
 *
 * 검증 항목:
 * 1. validUntil 자동 계산 로직
 * 2. 유효성 상태 판별 (valid, review-needed, expired, unknown)
 * 3. 배열 필터링 및 통계
 * 4. 만료 임박 정렬
 */

import { describe, it, expect } from 'vitest';
import {
  calculateValidUntil,
  checkContentValidity,
  filterValidContents,
  getContentValidityStats,
  sortByExpiryDate,
} from '../src/utils/contentValidity';
import type { TimeSensitivityMeta } from '../src/data/content/types';

describe('contentValidity 유틸리티', () => {
  // ============================================================================
  // 1. validUntil 자동 계산
  // ============================================================================
  describe('calculateValidUntil', () => {
    it('high sensitivity: sourceYear + 2년', () => {
      expect(calculateValidUntil(2025, 'high')).toBe('2027-12');
      expect(calculateValidUntil(2023, 'high')).toBe('2025-12');
    });

    it('medium sensitivity: sourceYear + 3년', () => {
      expect(calculateValidUntil(2025, 'medium')).toBe('2028-12');
      expect(calculateValidUntil(2020, 'medium')).toBe('2023-12');
    });

    it('low sensitivity: sourceYear + 4년', () => {
      expect(calculateValidUntil(2025, 'low')).toBe('2029-12');
    });

    it('none sensitivity: undefined 반환', () => {
      expect(calculateValidUntil(2025, 'none')).toBeUndefined();
    });
  });

  // ============================================================================
  // 2. 유효성 상태 판별
  // ============================================================================
  describe('checkContentValidity', () => {
    const testDate = new Date('2025-06-15'); // 2025년 6월 15일 기준

    it('timeSensitivity 없으면 unknown', () => {
      const result = checkContentValidity(undefined, testDate);
      expect(result.status).toBe('unknown');
      expect(result.message).toContain('메타데이터 없음');
    });

    it('sensitivity: none → valid (무제한)', () => {
      const meta: TimeSensitivityMeta = {
        sensitivity: 'none',
        sourceYear: 2025,
      };
      const result = checkContentValidity(meta, testDate);
      expect(result.status).toBe('valid');
      expect(result.message).toBe('시간 제한 없음');
    });

    it('만료됨: validUntil이 과거', () => {
      const meta: TimeSensitivityMeta = {
        sensitivity: 'high',
        sourceYear: 2020, // 2020 + 2년 = 2022-12 만료
      };
      const result = checkContentValidity(meta, testDate);
      expect(result.status).toBe('expired');
      expect(result.validUntil).toBe('2022-12');
      expect(result.daysRemaining).toBeLessThan(0);
    });

    it('검토 필요: 6개월 이내 만료', () => {
      const meta: TimeSensitivityMeta = {
        sensitivity: 'high',
        sourceYear: 2023, // 2023 + 2년 = 2025-12 (6개월 후)
      };
      const result = checkContentValidity(meta, testDate);
      expect(result.status).toBe('review-needed');
      expect(result.validUntil).toBe('2025-12');
      expect(result.daysRemaining).toBeLessThanOrEqual(180);
      expect(result.message).toContain('검토 필요');
    });

    it('유효함: 6개월 이상 남음', () => {
      const meta: TimeSensitivityMeta = {
        sensitivity: 'high',
        sourceYear: 2025, // 2025 + 2년 = 2027-12 (2.5년 후)
      };
      const result = checkContentValidity(meta, testDate);
      expect(result.status).toBe('valid');
      expect(result.validUntil).toBe('2027-12');
      expect(result.daysRemaining).toBeGreaterThan(180);
    });

    it('명시적 validUntil 우선 사용', () => {
      const meta: TimeSensitivityMeta = {
        sensitivity: 'high',
        sourceYear: 2025,
        validUntil: '2026-06', // 명시적 지정
      };
      const result = checkContentValidity(meta, testDate);
      expect(result.validUntil).toBe('2026-06');
    });
  });

  // ============================================================================
  // 3. 배열 필터링
  // ============================================================================
  describe('filterValidContents', () => {
    const testDate = new Date('2025-06-15');

    const contents = [
      {
        id: '1',
        meta: {
          timeSensitivity: { sensitivity: 'none' as const, sourceYear: 2025 },
        },
      },
      {
        id: '2',
        meta: {
          timeSensitivity: { sensitivity: 'high' as const, sourceYear: 2020 }, // 만료
        },
      },
      {
        id: '3',
        meta: {
          timeSensitivity: { sensitivity: 'high' as const, sourceYear: 2023 }, // 검토 필요
        },
      },
      {
        id: '4',
        meta: {
          timeSensitivity: { sensitivity: 'medium' as const, sourceYear: 2025 }, // 유효
        },
      },
      {
        id: '5',
        meta: undefined, // unknown
      },
    ];

    it('만료된 콘텐츠 제외 (기본)', () => {
      const valid = filterValidContents(contents);
      expect(valid).toHaveLength(4); // 만료(id:2) 제외
      expect(valid.map((c) => c.id)).toEqual(['1', '3', '4', '5']);
    });

    it('검토 필요 콘텐츠도 제외 가능', () => {
      const valid = filterValidContents(contents, false);
      expect(valid).toHaveLength(3); // 만료(id:2) + 검토필요(id:3) 제외
      expect(valid.map((c) => c.id)).toEqual(['1', '4', '5']);
    });
  });

  // ============================================================================
  // 4. 통계 계산
  // ============================================================================
  describe('getContentValidityStats', () => {
    const testDate = new Date('2025-06-15');

    const contents = [
      { meta: { timeSensitivity: { sensitivity: 'none' as const, sourceYear: 2025 } } },
      { meta: { timeSensitivity: { sensitivity: 'none' as const, sourceYear: 2025 } } },
      { meta: { timeSensitivity: { sensitivity: 'high' as const, sourceYear: 2020 } } }, // 만료
      { meta: { timeSensitivity: { sensitivity: 'high' as const, sourceYear: 2023 } } }, // 검토
      { meta: { timeSensitivity: { sensitivity: 'medium' as const, sourceYear: 2025 } } }, // 유효
      { meta: undefined }, // unknown
    ];

    it('정확한 통계 계산', () => {
      const stats = getContentValidityStats(contents);

      expect(stats.total).toBe(6);
      expect(stats.valid).toBe(3); // none(2) + medium(1)
      expect(stats.reviewNeeded).toBe(1);
      expect(stats.expired).toBe(1);
      expect(stats.unknown).toBe(1);
    });
  });

  // ============================================================================
  // 5. 만료 임박 순 정렬
  // ============================================================================
  describe('sortByExpiryDate', () => {
    const testDate = new Date('2025-06-15');

    const contents = [
      {
        id: 'a',
        meta: {
          timeSensitivity: { sensitivity: 'medium' as const, sourceYear: 2025 }, // 2028-12
        },
      },
      {
        id: 'b',
        meta: {
          timeSensitivity: { sensitivity: 'high' as const, sourceYear: 2023 }, // 2025-12 (제일 임박)
        },
      },
      {
        id: 'c',
        meta: {
          timeSensitivity: { sensitivity: 'high' as const, sourceYear: 2025 }, // 2027-12
        },
      },
      {
        id: 'd',
        meta: {
          timeSensitivity: { sensitivity: 'none' as const, sourceYear: 2025 }, // 무제한
        },
      },
    ];

    it('남은 일수 적은 순으로 정렬', () => {
      const sorted = sortByExpiryDate(contents);

      expect(sorted.map((c) => c.id)).toEqual(['b', 'c', 'a', 'd']);
      // b: 2025-12 (가장 임박)
      // c: 2027-12
      // a: 2028-12
      // d: 무제한 (마지막)
    });
  });

  // ============================================================================
  // 6. 엣지 케이스
  // ============================================================================
  describe('엣지 케이스', () => {
    it('validUntil이 현재 월과 같으면 만료됨', () => {
      const meta: TimeSensitivityMeta = {
        sensitivity: 'high',
        sourceYear: 2023,
        validUntil: '2025-06', // 현재: 2025-06-15
      };
      const result = checkContentValidity(meta, new Date('2025-06-15'));

      // 2025-06-01 < 2025-06-15 이므로 만료됨
      expect(result.status).toBe('expired');
    });

    it('validUntil이 다음 월이면 review-needed', () => {
      const meta: TimeSensitivityMeta = {
        sensitivity: 'high',
        sourceYear: 2023,
        validUntil: '2025-07', // 현재: 2025-06-15
      };
      const result = checkContentValidity(meta, new Date('2025-06-15'));

      // 2025-07-01 = 16일 후 (6개월 이내)
      expect(result.status).toBe('review-needed');
      expect(result.daysRemaining).toBe(16);
    });

    it('빈 배열 처리', () => {
      const stats = getContentValidityStats([]);
      expect(stats.total).toBe(0);
      expect(stats.valid).toBe(0);
    });

    it('meta 없는 콘텐츠만 있는 배열', () => {
      const contents = [{ id: '1' }, { id: '2', meta: {} }];
      const stats = getContentValidityStats(contents);

      expect(stats.total).toBe(2);
      expect(stats.unknown).toBe(2);
    });
  });

  // ============================================================================
  // 7. 실제 콘텐츠 데이터 시뮬레이션
  // ============================================================================
  describe('실제 데이터 시뮬레이션', () => {
    const testDate = new Date('2025-12-27'); // 오늘

    it('동물 지식 퀴즈 (sensitivity: none)', () => {
      const quiz = {
        id: 'cat-k-001',
        meta: {
          timeSensitivity: { sensitivity: 'none' as const, sourceYear: 2025 },
        },
      };

      const result = checkContentValidity(quiz.meta.timeSensitivity, testDate);
      expect(result.status).toBe('valid');
      expect(result.message).toBe('시간 제한 없음');
    });

    it('금액 투표 (sensitivity: high, 2025년 데이터)', () => {
      const poll = {
        id: 'money-001',
        meta: {
          timeSensitivity: { sensitivity: 'high' as const, sourceYear: 2025 },
        },
      };

      const result = checkContentValidity(poll.meta.timeSensitivity, testDate);
      // 2025 + 2년 = 2027-12 → 약 2년 후
      expect(result.status).toBe('valid');
      expect(result.validUntil).toBe('2027-12');
      expect(result.daysRemaining).toBeGreaterThan(700); // ~730일
    });

    it('트렌드 투표 (sensitivity: medium, 2023년 데이터)', () => {
      const poll = {
        id: 'trend-001',
        meta: {
          timeSensitivity: { sensitivity: 'medium' as const, sourceYear: 2023 },
        },
      };

      const result = checkContentValidity(poll.meta.timeSensitivity, testDate);
      // 2023 + 3년 = 2026-12 → 약 1년 후
      expect(result.status).toBe('valid');
      expect(result.validUntil).toBe('2026-12');
    });
  });
});
