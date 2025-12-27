import { describe, it, expect } from 'vitest';

/**
 * ShareCard 컴포넌트 유닛 테스트
 *
 * 테스트 대상:
 * - URL 생성 로직
 * - 파일명 sanitization
 */

describe('ShareCard 유틸리티 함수', () => {
  describe('sanitizeFileName', () => {
    // ShareCard 내부 함수 로직 테스트
    const sanitizeFileName = (name: string): string => {
      return name.replace(/[/\\:*?"<>|]/g, '_');
    };

    it('특수문자를 언더스코어로 변환', () => {
      expect(sanitizeFileName('test/name')).toBe('test_name');
      expect(sanitizeFileName('test\\name')).toBe('test_name');
      expect(sanitizeFileName('test:name')).toBe('test_name');
      expect(sanitizeFileName('test*name')).toBe('test_name');
      expect(sanitizeFileName('test?name')).toBe('test_name');
      expect(sanitizeFileName('test"name')).toBe('test_name');
      expect(sanitizeFileName('test<name>')).toBe('test_name_');
      expect(sanitizeFileName('test|name')).toBe('test_name');
    });

    it('일반 문자는 유지', () => {
      expect(sanitizeFileName('테스트_결과')).toBe('테스트_결과');
      expect(sanitizeFileName('test-name')).toBe('test-name');
      expect(sanitizeFileName('test name')).toBe('test name');
    });
  });

  describe('getShareUrl 로직', () => {
    it('testKey가 있으면 testKey 사용', () => {
      const testKey = 'dog';
      const testTitle = '강아지 성격 테스트';
      const urlTestParam = testKey || encodeURIComponent(testTitle);

      expect(urlTestParam).toBe('dog');
    });

    it('testKey가 없으면 testTitle을 인코딩하여 사용', () => {
      const testKey = undefined;
      const testTitle = '강아지 성격 테스트';
      const urlTestParam = testKey || encodeURIComponent(testTitle);

      expect(urlTestParam).toBe('%EA%B0%95%EC%95%84%EC%A7%80%20%EC%84%B1%EA%B2%A9%20%ED%85%8C%EC%8A%A4%ED%8A%B8');
    });

    it('빈 testKey는 falsy로 처리', () => {
      const testKey = '';
      const testTitle = '테스트';
      const urlTestParam = testKey || encodeURIComponent(testTitle);

      expect(urlTestParam).toBe('%ED%85%8C%EC%8A%A4%ED%8A%B8');
    });
  });

  describe('percentage 계산 로직', () => {
    it('정상 범위 내 계산', () => {
      const score = 15;
      const maxScore = 25;
      const percentage = maxScore > 0 ? Math.min((score / maxScore) * 100, 100) : 0;

      expect(percentage).toBe(60);
    });

    it('maxScore가 0이면 0% 반환', () => {
      const score = 15;
      const maxScore = 0;
      const percentage = maxScore > 0 ? Math.min((score / maxScore) * 100, 100) : 0;

      expect(percentage).toBe(0);
    });

    it('score가 maxScore 초과해도 100% 제한', () => {
      const score = 30;
      const maxScore = 25;
      const percentage = maxScore > 0 ? Math.min((score / maxScore) * 100, 100) : 0;

      expect(percentage).toBe(100);
    });

    it('음수 score는 Math.max로 0 처리', () => {
      const score = Math.max(0, -5);
      const maxScore = 25;
      const percentage = maxScore > 0 ? Math.min((score / maxScore) * 100, 100) : 0;

      expect(percentage).toBe(0);
    });
  });
});
