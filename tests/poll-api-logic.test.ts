/**
 * Poll API 로직 테스트
 * - optionId 검증 로직
 * - optionCount 파싱 로직
 * - allowMultiple 다중 선택 로직
 */

import { describe, it, expect } from 'vitest';

// API에서 사용하는 검증 로직을 테스트용으로 추출
const validVsOptions = ['a', 'b'];
const validChoiceOptions = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

function validateOptionId(optionId: string, pollType: string): { valid: boolean; error?: string } {
  if (pollType === 'choice') {
    if (!validChoiceOptions.includes(optionId)) {
      return {
        valid: false,
        error: `Invalid optionId. Must be one of: ${validChoiceOptions.join(', ')}`,
      };
    }
  } else {
    // VS poll (기본)
    if (!validVsOptions.includes(optionId)) {
      return {
        valid: false,
        error: `Invalid optionId. Must be one of: ${validVsOptions.join(', ')}`,
      };
    }
  }
  return { valid: true };
}

function parseOptionCount(optionCountParam: string | null): number {
  const parsed = parseInt(optionCountParam || '5');
  return Number.isNaN(parsed)
    ? 5 // NaN이면 기본값 5
    : Math.max(2, Math.min(8, parsed)); // 2~8 범위로 제한
}

describe('Poll API 로직', () => {
  describe('optionId 검증', () => {
    describe('VS Poll', () => {
      it('a, b는 유효함', () => {
        expect(validateOptionId('a', 'vs').valid).toBe(true);
        expect(validateOptionId('b', 'vs').valid).toBe(true);
      });

      it('c 이상은 무효함', () => {
        expect(validateOptionId('c', 'vs').valid).toBe(false);
        expect(validateOptionId('d', 'vs').valid).toBe(false);
      });

      it('잘못된 값은 무효함', () => {
        expect(validateOptionId('x', 'vs').valid).toBe(false);
        expect(validateOptionId('1', 'vs').valid).toBe(false);
        expect(validateOptionId('', 'vs').valid).toBe(false);
      });

      it('pollType 미지정시 VS로 처리', () => {
        expect(validateOptionId('a', '').valid).toBe(true);
        expect(validateOptionId('c', '').valid).toBe(false);
      });
    });

    describe('Choice Poll', () => {
      it('a~h는 유효함', () => {
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].forEach((id) => {
          expect(validateOptionId(id, 'choice').valid).toBe(true);
        });
      });

      it('i 이상은 무효함', () => {
        expect(validateOptionId('i', 'choice').valid).toBe(false);
        expect(validateOptionId('z', 'choice').valid).toBe(false);
      });

      it('잘못된 값은 무효함', () => {
        expect(validateOptionId('1', 'choice').valid).toBe(false);
        expect(validateOptionId('A', 'choice').valid).toBe(false); // 대문자
        expect(validateOptionId('', 'choice').valid).toBe(false);
      });
    });
  });

  describe('optionCount 파싱', () => {
    it('정상 숫자는 그대로 반환', () => {
      expect(parseOptionCount('3')).toBe(3);
      expect(parseOptionCount('5')).toBe(5);
      expect(parseOptionCount('7')).toBe(7);
    });

    it('null이면 기본값 5 반환', () => {
      expect(parseOptionCount(null)).toBe(5);
    });

    it('NaN이면 기본값 5 반환', () => {
      expect(parseOptionCount('abc')).toBe(5);
      expect(parseOptionCount('NaN')).toBe(5);
      expect(parseOptionCount('')).toBe(5);
    });

    it('최소값 2로 제한', () => {
      expect(parseOptionCount('1')).toBe(2);
      expect(parseOptionCount('0')).toBe(2);
      expect(parseOptionCount('-5')).toBe(2);
    });

    it('최대값 8로 제한', () => {
      expect(parseOptionCount('9')).toBe(8);
      expect(parseOptionCount('100')).toBe(8);
    });

    it('경계값 테스트', () => {
      expect(parseOptionCount('2')).toBe(2);
      expect(parseOptionCount('8')).toBe(8);
    });
  });

  describe('Choice Poll 옵션 생성', () => {
    it('optionCount에 따라 올바른 옵션 배열 생성', () => {
      const allOptionIds = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

      expect(allOptionIds.slice(0, parseOptionCount('3'))).toEqual(['a', 'b', 'c']);
      expect(allOptionIds.slice(0, parseOptionCount('5'))).toEqual(['a', 'b', 'c', 'd', 'e']);
      expect(allOptionIds.slice(0, parseOptionCount('8'))).toEqual([
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
      ]);
    });

    it('NaN 입력시 기본 5개 옵션', () => {
      const allOptionIds = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      expect(allOptionIds.slice(0, parseOptionCount('invalid'))).toEqual([
        'a',
        'b',
        'c',
        'd',
        'e',
      ]);
    });
  });

  describe('퍼센트 계산 로직', () => {
    function calculatePercentages(
      optionMap: Map<string, number>,
      optionIds: string[],
      totalVotes: number
    ) {
      let remainingPercent = 100;
      return optionIds.map((optionId, idx) => {
        const count = optionMap.get(optionId) ?? 0;
        let percentage: number;

        if (totalVotes === 0) {
          percentage = 0;
        } else if (idx === optionIds.length - 1) {
          percentage = Math.max(0, remainingPercent);
        } else {
          percentage = Math.round((count / totalVotes) * 100);
          remainingPercent -= percentage;
        }

        return { optionId, count, percentage };
      });
    }

    it('투표가 없으면 모두 0%', () => {
      const optionMap = new Map<string, number>();
      const result = calculatePercentages(optionMap, ['a', 'b', 'c'], 0);

      expect(result.every((r) => r.percentage === 0)).toBe(true);
    });

    it('합계가 100%가 되어야 함', () => {
      const optionMap = new Map([
        ['a', 33],
        ['b', 33],
        ['c', 34],
      ]);
      const result = calculatePercentages(optionMap, ['a', 'b', 'c'], 100);

      const totalPercent = result.reduce((sum, r) => sum + r.percentage, 0);
      expect(totalPercent).toBe(100);
    });

    it('반올림 오차가 마지막 옵션에서 보정됨', () => {
      // 33.33% + 33.33% + 33.33% = 99.99% -> 마지막에서 보정
      const optionMap = new Map([
        ['a', 1],
        ['b', 1],
        ['c', 1],
      ]);
      const result = calculatePercentages(optionMap, ['a', 'b', 'c'], 3);

      const totalPercent = result.reduce((sum, r) => sum + r.percentage, 0);
      expect(totalPercent).toBe(100);
    });

    it('한 옵션에 모든 투표가 있으면 100%', () => {
      const optionMap = new Map([['a', 50]]);
      const result = calculatePercentages(optionMap, ['a', 'b'], 50);

      expect(result[0].percentage).toBe(100);
      expect(result[1].percentage).toBe(0);
    });
  });

  describe('allowMultiple 다중 선택 로직', () => {
    // 다중 선택 옵션 파싱 로직 (API와 동일)
    function parseSelectedOptions(
      optionId: string | undefined,
      optionIds: string | string[] | undefined
    ): string[] {
      return optionIds
        ? Array.isArray(optionIds)
          ? optionIds
          : [optionIds]
        : optionId
          ? [optionId]
          : [];
    }

    // 다중 선택 검증 로직
    function validateMultipleOptions(
      selectedOptions: string[],
      isChoicePoll: boolean,
      allowMultiple: boolean
    ): { valid: boolean; error?: string } {
      // VS Poll은 항상 단일 선택
      if (!isChoicePoll && selectedOptions.length > 1) {
        return { valid: false, error: 'VS poll only allows single option selection' };
      }

      // 빈 선택
      if (selectedOptions.length === 0) {
        return { valid: false, error: 'No options selected' };
      }

      // 단일 선택 모드에서 다중 선택 시도
      if (!allowMultiple && selectedOptions.length > 1) {
        // 실제 API는 첫 번째만 저장하지 않고 에러를 반환하지 않음
        // 하지만 로직상으로는 allowMultiple=false에서 다중 선택은 의미 없음
      }

      return { valid: true };
    }

    describe('옵션 파싱', () => {
      it('optionId만 있으면 단일 배열 반환', () => {
        expect(parseSelectedOptions('a', undefined)).toEqual(['a']);
        expect(parseSelectedOptions('b', undefined)).toEqual(['b']);
      });

      it('optionIds 배열이 있으면 그대로 반환', () => {
        expect(parseSelectedOptions(undefined, ['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
      });

      it('optionIds 문자열이면 배열로 변환', () => {
        expect(parseSelectedOptions(undefined, 'a')).toEqual(['a']);
      });

      it('둘 다 있으면 optionIds 우선', () => {
        expect(parseSelectedOptions('a', ['b', 'c'])).toEqual(['b', 'c']);
      });

      it('둘 다 없으면 빈 배열', () => {
        expect(parseSelectedOptions(undefined, undefined)).toEqual([]);
      });
    });

    describe('다중 선택 검증', () => {
      it('VS Poll에서 다중 선택 불가', () => {
        expect(validateMultipleOptions(['a', 'b'], false, true).valid).toBe(false);
        expect(validateMultipleOptions(['a'], false, true).valid).toBe(true);
      });

      it('Choice Poll에서 allowMultiple=true면 다중 선택 가능', () => {
        expect(validateMultipleOptions(['a', 'b', 'c'], true, true).valid).toBe(true);
      });

      it('빈 선택은 항상 무효', () => {
        expect(validateMultipleOptions([], true, true).valid).toBe(false);
        expect(validateMultipleOptions([], false, false).valid).toBe(false);
      });
    });

    describe('중복 옵션 처리', () => {
      it('같은 옵션 중복 제거 (DB UNIQUE로 처리)', () => {
        // 실제로는 DB에서 UNIQUE(device_id, poll_id, option_id)로 처리
        const options = ['a', 'b', 'a', 'c', 'b'];
        const uniqueOptions = [...new Set(options)];
        expect(uniqueOptions).toEqual(['a', 'b', 'c']);
      });
    });
  });
});
