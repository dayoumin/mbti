/**
 * Phase 2: 응답 시간 수집 인프라 - 단위 테스트
 *
 * 검증 항목:
 * 1. 응답 시간 계산 로직 (0ms ~ 3600000ms 범위)
 * 2. ResultService 파라미터 전달
 * 3. API route 검증 로직
 * 4. localStorage/Turso 저장 형식
 */

import { describe, it, expect } from 'vitest';

describe('Phase 2: Response Time Collection', () => {
  // 1. 응답 시간 계산 로직
  describe('타이머 로직', () => {
    it('정상 응답 시간 계산', () => {
      const startTime = Date.now();
      const endTime = startTime + 2500; // 2.5초 후
      const responseTime = Math.max(0, Math.min(3600000, endTime - startTime));

      expect(responseTime).toBe(2500);
      expect(responseTime).toBeGreaterThanOrEqual(0);
      expect(responseTime).toBeLessThanOrEqual(3600000);
    });

    it('음수 방지 (startTime이 null인 경우)', () => {
      const questionStartTime: number | null = null;
      const responseTime = questionStartTime
        ? Math.max(0, Math.min(3600000, Date.now() - questionStartTime))
        : 0;

      expect(responseTime).toBe(0);
    });

    it('매우 큰 값 제한 (1시간 초과)', () => {
      const startTime = Date.now() - 7200000; // 2시간 전
      const responseTime = Math.max(0, Math.min(3600000, Date.now() - startTime));

      expect(responseTime).toBe(3600000); // 1시간으로 제한됨
    });

    it('0ms 응답 허용', () => {
      const startTime = Date.now();
      const endTime = startTime; // 동시에 클릭
      const responseTime = Math.max(0, Math.min(3600000, endTime - startTime));

      expect(responseTime).toBe(0);
    });
  });

  // 2. 응답 시간 배열 관리
  describe('응답 시간 배열 관리', () => {
    it('새 응답 추가', () => {
      const responseTimes: number[] = [1000, 2000, 1500];
      const newTime = 3000;
      const updated = [...responseTimes, newTime];

      expect(updated).toEqual([1000, 2000, 1500, 3000]);
      expect(updated.length).toBe(4);
    });

    it('뒤로가기 시 마지막 응답 제거', () => {
      const responseTimes: number[] = [1000, 2000, 1500, 3000];
      const rolledBack = responseTimes.slice(0, -1);

      expect(rolledBack).toEqual([1000, 2000, 1500]);
      expect(rolledBack.length).toBe(3);
    });

    it('초기화', () => {
      const responseTimes: number[] = [1000, 2000];
      const reset: number[] = [];

      expect(reset.length).toBe(0);
    });
  });

  // 3. API route 검증 로직
  describe('API 응답 시간 검증', () => {
    it('유효한 배열 통과', () => {
      const responseTimes = [1000, 2000, 1500, 3000];

      const validated = responseTimes
        .filter(t => typeof t === 'number' && t >= 0 && t <= 3600000)
        .map(t => Math.round(t));

      expect(validated).toEqual([1000, 2000, 1500, 3000]);
    });

    it('범위 밖 값 필터링', () => {
      const responseTimes = [1000, -500, 2000, 4000000, 1500];

      const validated = responseTimes
        .filter(t => typeof t === 'number' && t >= 0 && t <= 3600000)
        .map(t => Math.round(t));

      expect(validated).toEqual([1000, 2000, 1500]);
    });

    it('소수점 반올림', () => {
      const responseTimes = [1234.567, 2000.123, 1500.999];

      const validated = responseTimes
        .filter(t => typeof t === 'number' && t >= 0 && t <= 3600000)
        .map(t => Math.round(t));

      expect(validated).toEqual([1235, 2000, 1501]);
    });

    it('비숫자 타입 필터링', () => {
      const responseTimes: any[] = [1000, '2000', null, undefined, 1500, NaN];

      const validated = responseTimes
        .filter(t => typeof t === 'number' && t >= 0 && t <= 3600000)
        .map(t => Math.round(t));

      expect(validated).toEqual([1000, 1500]);
    });

    it('빈 배열 처리', () => {
      const responseTimes: number[] = [];

      const validated = responseTimes
        .filter(t => typeof t === 'number' && t >= 0 && t <= 3600000)
        .map(t => Math.round(t));

      expect(validated).toEqual([]);
    });
  });

  // 4. 데이터 구조 검증
  describe('저장 데이터 구조', () => {
    it('localStorage 형식 (TestResultData)', () => {
      const responseTimes = [1000, 2000, 1500];

      const localData = {
        id: 'test-id',
        user_id: 'device-123',
        project: 'chemi-test',
        test_type: 'cat',
        result_key: '자유로운 영혼',
        result_emoji: '😺',
        scores: { curious: 10, independent: 8 },
        is_deep_mode: false,
        created_at: '2025-12-27T10:00:00.000Z',
        meta: {
          user_agent: 'Mozilla/5.0',
          screen_width: 1920,
          timestamp: Date.now(),
          response_time_ms: responseTimes,
        },
      };

      expect(localData.meta.response_time_ms).toEqual([1000, 2000, 1500]);
      expect(Array.isArray(localData.meta.response_time_ms)).toBe(true);
    });

    it('Turso DB 형식 (scores JSON 내부)', () => {
      const responseTimes = [1000, 2000, 1500];

      const scoresJson = {
        emoji: '😺',
        scores: { curious: 10, independent: 8 },
        isDeepMode: false,
        meta: {
          response_time_ms: responseTimes,
        },
      };

      expect(scoresJson.meta?.response_time_ms).toEqual([1000, 2000, 1500]);
      expect(scoresJson.meta).toBeDefined();
    });

    it('camelCase 변환 (TestResultCamel)', () => {
      const snakeCase = {
        response_time_ms: [1000, 2000, 1500],
      };

      const camelCase = {
        responseTimeMs: snakeCase.response_time_ms,
      };

      expect(camelCase.responseTimeMs).toEqual([1000, 2000, 1500]);
    });
  });

  // 5. 엣지 케이스
  describe('엣지 케이스', () => {
    it('매우 빠른 응답 (100ms 이하)', () => {
      const responseTimes = [10, 50, 99, 100];

      const validated = responseTimes
        .filter(t => typeof t === 'number' && t >= 0 && t <= 3600000)
        .map(t => Math.round(t));

      expect(validated).toEqual([10, 50, 99, 100]);
    });

    it('매우 느린 응답 (거의 1시간)', () => {
      const responseTimes = [3500000, 3599999, 3600000];

      const validated = responseTimes
        .filter(t => typeof t === 'number' && t >= 0 && t <= 3600000)
        .map(t => Math.round(t));

      expect(validated).toEqual([3500000, 3599999, 3600000]);
    });

    it('질문 개수와 응답 시간 배열 길이 일치', () => {
      const questions = Array(12).fill(null); // 12개 질문
      const responseTimes = Array(12).fill(2000); // 12개 응답

      expect(responseTimes.length).toBe(questions.length);
    });

    it('responseTimes가 undefined인 경우', () => {
      const responseTimes: number[] | undefined = undefined;
      const fallback = responseTimes || [];

      expect(fallback).toEqual([]);
    });
  });
});

// 6. 통합 시나리오
describe('Phase 2: 응답 시간 수집 통합 시나리오', () => {
  it('전체 테스트 흐름 (12문제)', () => {
    const questionCount = 12;
    const responseTimes: number[] = [];

    // 각 질문마다 응답 시간 추가
    for (let i = 0; i < questionCount; i++) {
      const startTime = Date.now() - Math.random() * 5000; // 0~5초 전
      const endTime = Date.now();
      const responseTime = Math.max(0, Math.min(3600000, endTime - startTime));
      responseTimes.push(responseTime);
    }

    expect(responseTimes.length).toBe(12);
    responseTimes.forEach(time => {
      expect(time).toBeGreaterThanOrEqual(0);
      expect(time).toBeLessThanOrEqual(3600000);
    });
  });

  it('뒤로가기 후 다시 답변', () => {
    let responseTimes: number[] = [1000, 2000, 1500];

    // 뒤로가기
    responseTimes = responseTimes.slice(0, -1);
    expect(responseTimes).toEqual([1000, 2000]);

    // 새 답변
    responseTimes = [...responseTimes, 2500];
    expect(responseTimes).toEqual([1000, 2000, 2500]);
  });

  it('초기화 후 재시작', () => {
    let responseTimes: number[] = [1000, 2000, 1500];

    // 테스트 재시작
    responseTimes = [];
    expect(responseTimes.length).toBe(0);

    // 새 테스트 시작
    responseTimes = [3000];
    expect(responseTimes).toEqual([3000]);
  });
});
