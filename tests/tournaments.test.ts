// ============================================================================
// 토너먼트 데이터 테스트
// ============================================================================

import { describe, it, expect } from 'vitest';
import {
  TIER_TOURNAMENTS,
  getTournamentById,
  getTournamentsByCategory,
  getTournamentsByTag,
  TOURNAMENT_STATS,
} from '../src/data/content/tournaments';
import type { TierTournament, TournamentItem } from '../src/data/content/types';

describe('토너먼트 데이터 검증', () => {
  // ========================================
  // 1. 기본 구조 검증
  // ========================================
  describe('기본 구조', () => {
    it('토너먼트가 1개 이상 존재해야 함', () => {
      expect(TIER_TOURNAMENTS.length).toBeGreaterThan(0);
    });

    it('모든 토너먼트는 필수 필드를 가져야 함', () => {
      TIER_TOURNAMENTS.forEach((t) => {
        expect(t.id).toBeTruthy();
        expect(t.type).toBe('tier-tournament');
        expect(t.category).toBeTruthy();
        expect(t.title).toBeTruthy();
        expect(t.emoji).toBeTruthy();
        expect(Array.isArray(t.items)).toBe(true);
        expect(t.items.length).toBeGreaterThan(0);
      });
    });

    it('모든 아이템은 id와 name을 가져야 함', () => {
      TIER_TOURNAMENTS.forEach((t) => {
        t.items.forEach((item) => {
          expect(item.id).toBeTruthy();
          expect(item.name).toBeTruthy();
        });
      });
    });

    it('아이템 ID는 토너먼트 내에서 유일해야 함', () => {
      TIER_TOURNAMENTS.forEach((t) => {
        const ids = t.items.map((i) => i.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
      });
    });
  });

  // ========================================
  // 2. 성격별 궁합 티어표 검증
  // ========================================
  describe('성격별 궁합 티어표', () => {
    const personalityTier = getTournamentById('personality-compatibility-tier');

    it('성격별 궁합 토너먼트가 존재해야 함', () => {
      expect(personalityTier).toBeDefined();
    });

    it('카테고리가 love여야 함', () => {
      expect(personalityTier?.category).toBe('love');
    });

    it('32개 궁합 조합이 있어야 함', () => {
      expect(personalityTier?.items.length).toBe(32);
    });

    it('MBTI 16유형 코드를 사용하지 않아야 함 (저작권 이슈)', () => {
      const mbtiCodes = [
        'INFP', 'INFJ', 'INTP', 'INTJ',
        'ISFP', 'ISFJ', 'ISTP', 'ISTJ',
        'ENFP', 'ENFJ', 'ENTP', 'ENTJ',
        'ESFP', 'ESFJ', 'ESTP', 'ESTJ',
      ];

      personalityTier?.items.forEach((item) => {
        mbtiCodes.forEach((code) => {
          expect(item.id.toUpperCase()).not.toContain(code);
          expect(item.name.toUpperCase()).not.toContain(code);
          expect(item.description?.toUpperCase() || '').not.toContain(code);
        });
      });
    });

    it('모든 아이템에 description이 있어야 함', () => {
      personalityTier?.items.forEach((item) => {
        expect(item.description).toBeTruthy();
        expect(item.description!.length).toBeGreaterThan(5);
      });
    });

    it('모든 아이템에 emoji가 있어야 함', () => {
      personalityTier?.items.forEach((item) => {
        expect(item.emoji).toBeTruthy();
      });
    });

    it('tierLabels가 6단계(S~F)로 정의되어야 함', () => {
      expect(personalityTier?.tierLabels).toBeDefined();
      expect(personalityTier?.tierLabels?.S).toBeTruthy();
      expect(personalityTier?.tierLabels?.A).toBeTruthy();
      expect(personalityTier?.tierLabels?.B).toBeTruthy();
      expect(personalityTier?.tierLabels?.C).toBeTruthy();
      expect(personalityTier?.tierLabels?.D).toBeTruthy();
      expect(personalityTier?.tierLabels?.F).toBeTruthy();
    });

    it('viralHooks가 정의되어야 함', () => {
      expect(personalityTier?.viralHooks).toBeDefined();
      expect(personalityTier?.viralHooks?.debateTopics?.length).toBeGreaterThan(0);
      expect(personalityTier?.viralHooks?.fandoms?.length).toBeGreaterThan(0);
    });

    it('meta.ageRating이 all이어야 함 (전체 이용가)', () => {
      expect(personalityTier?.meta?.ageRating).toBe('all');
    });

    it('meta.timeSensitivity가 none이어야 함 (반영구 콘텐츠)', () => {
      expect(personalityTier?.meta?.timeSensitivity?.sensitivity).toBe('none');
    });
  });

  // ========================================
  // 3. 조회 함수 테스트
  // ========================================
  describe('조회 함수', () => {
    it('getTournamentById: 존재하는 ID로 조회', () => {
      const result = getTournamentById('personality-compatibility-tier');
      expect(result).toBeDefined();
      expect(result?.title).toBe('성격별 궁합 티어표');
    });

    it('getTournamentById: 존재하지 않는 ID', () => {
      const result = getTournamentById('non-existent-id');
      expect(result).toBeUndefined();
    });

    it('getTournamentsByCategory: 카테고리별 조회', () => {
      const loveResults = getTournamentsByCategory('love');
      expect(loveResults.length).toBeGreaterThan(0);
      loveResults.forEach((t) => {
        expect(t.category).toBe('love');
      });
    });

    it('getTournamentsByTag: 태그별 조회', () => {
      const results = getTournamentsByTag('연애');
      results.forEach((t) => {
        expect(t.tags).toContain('연애');
      });
    });
  });

  // ========================================
  // 4. 통계 테스트
  // ========================================
  describe('통계', () => {
    it('total은 전체 토너먼트 수와 같아야 함', () => {
      expect(TOURNAMENT_STATS.total).toBe(TIER_TOURNAMENTS.length);
    });

    it('byCategory는 카테고리별 개수를 반환해야 함', () => {
      const byCategory = TOURNAMENT_STATS.byCategory();
      const totalFromCategories = Object.values(byCategory).reduce((a, b) => a + b, 0);
      expect(totalFromCategories).toBe(TIER_TOURNAMENTS.length);
    });

    it('totalItems는 전체 아이템 수를 반환해야 함', () => {
      const expectedTotal = TIER_TOURNAMENTS.reduce((sum, t) => sum + t.items.length, 0);
      expect(TOURNAMENT_STATS.totalItems()).toBe(expectedTotal);
    });
  });

  // ========================================
  // 5. 연령 등급 검증
  // ========================================
  describe('연령 등급', () => {
    it('모든 토너먼트는 ageRating이 정의되어야 함', () => {
      TIER_TOURNAMENTS.forEach((t) => {
        // meta가 있으면 ageRating 확인
        if (t.meta) {
          expect(['all', 'kids', 'adult']).toContain(t.meta.ageRating);
        }
      });
    });

    it('adult 콘텐츠는 ageRestrictionReason이 있어야 함', () => {
      TIER_TOURNAMENTS.forEach((t) => {
        if (t.meta?.ageRating === 'adult') {
          expect(t.meta.ageRestrictionReason).toBeTruthy();
        }
      });
    });
  });
});
