/**
 * Phase 1 테스트: localStorage 래퍼 유틸리티
 *
 * 검증 항목:
 * - storage.get/set/remove/clear 동작
 * - 에러 처리 (JSON parse 실패)
 * - SSR 환경 대응
 * - 타입 안전성
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

global.localStorage = localStorageMock as any;

// storage import는 테스트 내에서
import { storage } from '@/utils/storage';

describe('Phase 1: storage 래퍼 유틸리티', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('storage.get()', () => {
    it('존재하는 데이터를 올바르게 읽어온다', () => {
      localStorage.setItem('test_key', JSON.stringify({ name: 'John' }));

      const result = storage.get('test_key', { name: 'Default' });

      expect(result).toEqual({ name: 'John' });
    });

    it('존재하지 않는 키는 기본값을 반환한다', () => {
      const result = storage.get('nonexistent', { name: 'Default' });

      expect(result).toEqual({ name: 'Default' });
    });

    it('배열 데이터를 올바르게 읽어온다', () => {
      localStorage.setItem('array_key', JSON.stringify([1, 2, 3]));

      const result = storage.get<number[]>('array_key', []);

      expect(result).toEqual([1, 2, 3]);
    });

    it('JSON parse 실패 시 기본값을 반환한다', () => {
      localStorage.setItem('invalid_json', 'not a json');

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const result = storage.get('invalid_json', { fallback: true });

      expect(result).toEqual({ fallback: true });
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Storage] Failed to get invalid_json'),
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it('null 값은 기본값을 반환한다', () => {
      localStorage.setItem('null_key', 'null');

      const result = storage.get('null_key', { default: 'value' });

      expect(result).toEqual({ default: 'value' });
    });
  });

  describe('storage.set()', () => {
    it('데이터를 올바르게 저장한다', () => {
      storage.set('test_key', { name: 'Jane' });

      const stored = JSON.parse(localStorage.getItem('test_key')!);
      expect(stored).toEqual({ name: 'Jane' });
    });

    it('배열을 올바르게 저장한다', () => {
      storage.set('array_key', [4, 5, 6]);

      const stored = JSON.parse(localStorage.getItem('array_key')!);
      expect(stored).toEqual([4, 5, 6]);
    });

    it('문자열을 올바르게 저장한다', () => {
      storage.set('string_key', 'hello');

      const stored = JSON.parse(localStorage.getItem('string_key')!);
      expect(stored).toBe('hello');
    });

    it('숫자를 올바르게 저장한다', () => {
      storage.set('number_key', 42);

      const stored = JSON.parse(localStorage.getItem('number_key')!);
      expect(stored).toBe(42);
    });

    it('복잡한 객체를 올바르게 저장한다', () => {
      const complexData = {
        user: { id: 1, name: 'John' },
        items: [{ id: 1 }, { id: 2 }],
        timestamp: Date.now()
      };

      storage.set('complex_key', complexData);

      const stored = JSON.parse(localStorage.getItem('complex_key')!);
      expect(stored).toEqual(complexData);
    });
  });

  describe('storage.remove()', () => {
    it('데이터를 올바르게 제거한다', () => {
      localStorage.setItem('remove_key', JSON.stringify({ data: 'test' }));

      storage.remove('remove_key');

      expect(localStorage.getItem('remove_key')).toBeNull();
    });

    it('존재하지 않는 키를 제거해도 에러가 발생하지 않는다', () => {
      expect(() => storage.remove('nonexistent')).not.toThrow();
    });
  });

  describe('storage.clear()', () => {
    it('모든 데이터를 제거한다', () => {
      storage.set('key1', 'value1');
      storage.set('key2', 'value2');

      storage.clear();

      expect(localStorage.getItem('key1')).toBeNull();
      expect(localStorage.getItem('key2')).toBeNull();
    });
  });

  describe('storage.has()', () => {
    it('존재하는 키는 true를 반환한다', () => {
      localStorage.setItem('exists', JSON.stringify('value'));

      expect(storage.has('exists')).toBe(true);
    });

    it('존재하지 않는 키는 false를 반환한다', () => {
      expect(storage.has('nonexistent')).toBe(false);
    });
  });

  describe('타입 안전성', () => {
    interface User {
      id: number;
      name: string;
    }

    it('제네릭 타입이 올바르게 동작한다', () => {
      const user: User = { id: 1, name: 'John' };
      storage.set('user', user);

      const result = storage.get<User>('user', { id: 0, name: '' });

      expect(result.id).toBe(1);
      expect(result.name).toBe('John');
    });

    it('배열 타입이 올바르게 동작한다', () => {
      const users: User[] = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
      ];

      storage.set('users', users);
      const result = storage.get<User[]>('users', []);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('John');
    });
  });

  describe('실제 사용 시나리오', () => {
    it('ResultService 패턴: 기존 배열에 추가', () => {
      // 초기 상태
      const initial = storage.get<any[]>('results', []);
      expect(initial).toEqual([]);

      // 첫 번째 결과 추가
      const existing1 = storage.get<any[]>('results', []);
      existing1.push({ id: 1, result: 'A' });
      storage.set('results', existing1);

      // 두 번째 결과 추가
      const existing2 = storage.get<any[]>('results', []);
      existing2.push({ id: 2, result: 'B' });
      storage.set('results', existing2);

      // 최종 확인
      const final = storage.get<any[]>('results', []);
      expect(final).toHaveLength(2);
      expect(final[0].result).toBe('A');
      expect(final[1].result).toBe('B');
    });

    it('GamificationService 패턴: 객체 병합', () => {
      // 초기 통계
      const defaultStats = {
        points: 0,
        badges: [],
        streak: { current: 0, longest: 0 }
      };

      // 첫 저장
      storage.set('game_stats', { ...defaultStats, points: 10 });

      // 포인트 업데이트
      const current = storage.get('game_stats', defaultStats);
      storage.set('game_stats', { ...current, points: current.points + 5 });

      // 확인
      const final = storage.get('game_stats', defaultStats);
      expect(final.points).toBe(15);
    });

    it('RankingService 패턴: 투표 데이터 관리', () => {
      interface Vote {
        testType: string;
        resultKey: string;
        count: number;
      }

      const votes = storage.get<Vote[]>('votes', []);
      votes.push({ testType: 'dog', resultKey: 'retriever', count: 1 });
      storage.set('votes', votes);

      const retrieved = storage.get<Vote[]>('votes', []);
      expect(retrieved[0].testType).toBe('dog');
    });
  });

  describe('에러 처리', () => {
    it('localStorage 접근 실패 시 에러를 catch한다', () => {
      // setItem이 에러를 던지도록 mock
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('Quota exceeded');
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => storage.set('test', 'value')).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Storage] Failed to set test'),
        expect.any(Error)
      );

      localStorage.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });
  });
});

describe('Phase 1: 서비스 통합 테스트', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('ResultService + GamificationService 동시 사용', () => {
    // ResultService: 테스트 결과 저장
    const results = storage.get<any[]>('test_results', []);
    results.push({
      testType: 'dog',
      result: 'retriever',
      timestamp: new Date().toISOString()
    });
    storage.set('test_results', results);

    // GamificationService: 포인트 업데이트
    const stats = storage.get('game_stats', { points: 0, badges: [] });
    stats.points += 10; // 테스트 완료 포인트
    storage.set('game_stats', stats);

    // 검증
    expect(storage.get<any[]>('test_results', [])).toHaveLength(1);
    expect(storage.get('game_stats', { points: 0 }).points).toBe(10);
  });

  it('여러 서비스가 각자의 키를 독립적으로 관리', () => {
    // 5개 서비스가 동시에 데이터 저장
    storage.set('results', [1, 2, 3]);
    storage.set('ranking', { votes: 10 });
    storage.set('insights', { unlocked: ['tag1'] });
    storage.set('friends', [{ id: 'user1' }]);
    storage.set('preferences', { theme: 'dark' });

    // 각 데이터가 독립적으로 유지됨
    expect(storage.get<number[]>('results', [])).toEqual([1, 2, 3]);
    expect(storage.get('ranking', {}).votes).toBe(10);
    expect(storage.get('insights', {}).unlocked).toEqual(['tag1']);
    expect(storage.get<any[]>('friends', [])).toHaveLength(1);
    expect(storage.get('preferences', {}).theme).toBe('dark');
  });
});
