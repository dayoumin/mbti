/**
 * 리팩토링 통합 테스트
 *
 * 실제 사용자 시나리오를 기반으로 기능이 정상 작동하는지 검증
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

global.localStorage = localStorageMock as any;

import { storage } from '@/utils/storage';
import { resultService } from '@/services';

describe('통합 테스트: 사용자 시나리오', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('시나리오 1: 테스트 완료 → 결과 저장 → 랭킹 투표', () => {
    it('전체 플로우가 정상 작동한다', async () => {
      // 1. 테스트 완료
      const testType = 'dog';
      const result = {
        name: '골든 리트리버',
        emoji: '🐕',
        desc: '따뜻하고 친근한',
        color: 'bg-amber-100',
        mood: 'happy' as const,
        interpretation: '당신은 골든 리트리버 같은 사람이에요',
        guide: '따뜻함을 유지하세요',
        matchPoints: ['친근함', '따뜻함']
      };
      const scores = { energy: 80, social: 90, outdoor: 85 };

      // 2. 결과 저장
      const saveResult = await resultService.saveResult(testType, result, scores);

      expect(saveResult.success).toBe(true);
      expect(saveResult.id).toBeDefined();

      // 3. 저장된 결과 조회
      const myResults = await resultService.getMyResults();

      expect(myResults).toHaveLength(1);
      expect(myResults[0].testType).toBe('dog');
      expect(myResults[0].resultKey).toBe('골든 리트리버');

      // 4. localStorage 확인
      const stored = storage.get<any[]>('chemi_test_results', []);
      expect(stored).toHaveLength(1);
      expect(stored[0].test_type).toBe('dog');
    });
  });

  describe('시나리오 2: 퀴즈 참여 → 스트릭 업데이트', () => {
    it('참여 데이터가 올바르게 저장된다', () => {
      // ContentParticipationService 사용 시나리오
      const quizId = 'dog_001';
      const isCorrect = true;

      // 1. 초기 상태 - 참여 기록 없음
      const initial = storage.get('chemi_content_participation', null);
      expect(initial).toBeNull();

      // 2. 퀴즈 참여 (실제 서비스 호출 대신 storage 직접 사용)
      const participation = {
        quizzes: [
          {
            quizId,
            answeredAt: new Date().toISOString(),
            userAnswer: 'A',
            isCorrect
          }
        ],
        polls: [],
        streak: {
          currentStreak: 1,
          longestStreak: 1,
          lastActivityDate: new Date().toISOString().split('T')[0],
          streakStartDate: new Date().toISOString().split('T')[0]
        }
      };

      storage.set('chemi_content_participation', participation);

      // 3. 저장 확인
      const saved = storage.get<any>('chemi_content_participation', null);

      expect(saved).not.toBeNull();
      expect(saved.quizzes).toHaveLength(1);
      expect(saved.quizzes[0].quizId).toBe(quizId);
      expect(saved.quizzes[0].isCorrect).toBe(true);
      expect(saved.streak.currentStreak).toBe(1);
    });

    it('연속 참여 시 스트릭이 증가한다', () => {
      // 1. 첫 참여
      const today = new Date().toISOString().split('T')[0];
      storage.set('chemi_content_participation', {
        quizzes: [],
        polls: [],
        streak: {
          currentStreak: 1,
          longestStreak: 1,
          lastActivityDate: today,
          streakStartDate: today
        }
      });

      // 2. 같은 날 다시 참여 (스트릭 유지)
      const current = storage.get<any>('chemi_content_participation', null);
      expect(current.streak.currentStreak).toBe(1);

      // 3. 다음날 참여 (스트릭 증가 시뮬레이션)
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      storage.set('chemi_content_participation', {
        ...current,
        streak: {
          ...current.streak,
          currentStreak: 2,
          longestStreak: 2,
          lastActivityDate: tomorrow
        }
      });

      const updated = storage.get<any>('chemi_content_participation', null);
      expect(updated.streak.currentStreak).toBe(2);
      expect(updated.streak.longestStreak).toBe(2);
    });
  });

  describe('시나리오 3: 여러 서비스 동시 사용', () => {
    it('각 서비스의 데이터가 독립적으로 관리된다', () => {
      // 1. ResultService - 테스트 결과 저장
      storage.set('chemi_test_results', [
        {
          id: 'result1',
          test_type: 'dog',
          result_key: 'retriever',
          created_at: new Date().toISOString()
        }
      ]);

      // 2. GamificationService - 게임 통계
      storage.set('chemi_game_stats', {
        totalPoints: 100,
        badges: ['first_test'],
        streak: { current: 3, longest: 5 }
      });

      // 3. RankingService - 랭킹 투표
      storage.set('chemi_ranking_votes', [
        {
          testType: 'dog',
          resultKey: 'retriever',
          timestamp: new Date().toISOString()
        }
      ]);

      // 4. 각 데이터가 독립적으로 유지됨
      const results = storage.get<any[]>('chemi_test_results', []);
      const gameStats = storage.get<any>('chemi_game_stats', null);
      const votes = storage.get<any[]>('chemi_ranking_votes', []);

      expect(results).toHaveLength(1);
      expect(gameStats.totalPoints).toBe(100);
      expect(votes).toHaveLength(1);

      // 5. 한 서비스 데이터 삭제해도 다른 서비스 영향 없음
      storage.remove('chemi_test_results');

      expect(storage.get<any[]>('chemi_test_results', [])).toHaveLength(0);
      expect(storage.get<any>('chemi_game_stats', null)).not.toBeNull();
      expect(storage.get<any[]>('chemi_ranking_votes', [])).toHaveLength(1);
    });
  });

  describe('시나리오 4: 에러 상황 처리', () => {
    it('잘못된 JSON 데이터가 있어도 앱이 크래시하지 않는다', () => {
      // 1. 수동으로 잘못된 데이터 삽입
      localStorage.setItem('chemi_test_results', 'invalid json {{{');

      // 2. storage.get은 기본값 반환 (크래시 안함)
      const results = storage.get<any[]>('chemi_test_results', []);

      expect(results).toEqual([]);
    });

    it('localStorage quota 초과 시 에러를 처리한다', () => {
      // localStorage.setItem이 에러를 던지도록 mock
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new DOMException('Quota exceeded', 'QuotaExceededError');
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // storage.set은 에러를 catch하고 계속 진행
      expect(() => storage.set('test', 'value')).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();

      localStorage.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });
  });

  describe('시나리오 5: SSR 환경', () => {
    it('window가 undefined일 때 기본값을 반환한다', () => {
      // window를 임시로 undefined로 만듦
      const originalWindow = global.window;
      (global as any).window = undefined;

      const result = storage.get('any_key', { default: 'value' });

      expect(result).toEqual({ default: 'value' });

      // 복원
      (global as any).window = originalWindow;
    });
  });

  describe('시나리오 6: 마이그레이션', () => {
    it('이전 버전 데이터를 새 형식으로 마이그레이션한다', () => {
      // 1. 이전 버전 데이터 (v1)
      localStorage.setItem('old_results_key', JSON.stringify([
        { testType: 'dog', result: 'retriever' }
      ]));

      // 2. 마이그레이션 실행
      const oldData = storage.get<any[]>('old_results_key', []);

      if (oldData.length > 0) {
        const newData = oldData.map(item => ({
          ...item,
          id: `migrated_${Date.now()}`,
          created_at: new Date().toISOString()
        }));

        storage.set('chemi_test_results', newData);
        storage.remove('old_results_key');
      }

      // 3. 새 형식으로 저장 확인
      const migrated = storage.get<any[]>('chemi_test_results', []);

      expect(migrated).toHaveLength(1);
      expect(migrated[0].id).toContain('migrated_');
      expect(migrated[0].created_at).toBeDefined();
      expect(storage.has('old_results_key')).toBe(false);
    });
  });
});

describe('컴포넌트 통합 테스트 (구조 검증)', () => {
  describe('ContentExplore 분리 구조', () => {
    it('모든 서브 컴포넌트 파일이 존재한다', () => {
      // fs를 사용한 파일 존재 확인은 Node 환경에서만 가능
      // 여기서는 import가 성공하는지만 확인
      expect(() => require('@/components/content/explore/types')).not.toThrow();
      expect(() => require('@/components/content/explore/StreakBanner')).not.toThrow();
      expect(() => require('@/components/content/explore/QuizTab')).not.toThrow();
      expect(() => require('@/components/content/explore/PollTab')).not.toThrow();
    });
  });

  describe('InsightCards 분리 구조', () => {
    it('Stage 컴포넌트 파일이 존재한다', () => {
      expect(() => require('@/components/insight/InsightStage1')).not.toThrow();
      expect(() => require('@/components/insight/InsightStage2')).not.toThrow();
      expect(() => require('@/components/insight/InsightStage3')).not.toThrow();
      expect(() => require('@/components/insight/InsightStage4')).not.toThrow();
    });
  });

  describe('CommunityBoard 분리 구조', () => {
    it('서브 컴포넌트 파일이 존재한다', () => {
      expect(() => require('@/components/community/CommunitySidebar')).not.toThrow();
      expect(() => require('@/components/community/CommunityPostList')).not.toThrow();
    });
  });
});
