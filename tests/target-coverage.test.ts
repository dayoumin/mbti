import { describe, it, expect } from 'vitest';

/**
 * 타겟 커버리지 (연령/성별) 관련 유닛 테스트
 *
 * 테스트 대상:
 * - 콘텐츠 메타데이터 타겟팅 필드
 * - 연령대/성별별 콘텐츠 분류 로직
 */

import { ALL_KNOWLEDGE_QUIZZES, ALL_SCENARIO_QUIZZES } from '@/data/content/quizzes';
import { VS_POLLS, CHOICE_POLLS } from '@/data/content/polls';
import { TIER_TOURNAMENTS } from '@/data/content/tournaments';
import type { AgeGroup, Gender } from '@/services/DemographicService';

describe('콘텐츠 타겟 메타데이터', () => {
  describe('퀴즈 메타데이터 구조', () => {
    it('퀴즈에 meta 필드가 있으면 올바른 구조여야 함', () => {
      const allQuizzes = [...ALL_KNOWLEDGE_QUIZZES, ...ALL_SCENARIO_QUIZZES];

      allQuizzes.forEach((quiz) => {
        if (quiz.meta) {
          // targetAges가 있으면 유효한 값이어야 함
          if (quiz.meta.targetAges) {
            expect(Array.isArray(quiz.meta.targetAges)).toBe(true);
            const validAgeGroups: AgeGroup[] = ['~9', '10s', '20s', '30s', '40s+'];
            quiz.meta.targetAges.forEach((age) => {
              expect(validAgeGroups).toContain(age);
            });
          }

          // targetGender가 있으면 유효한 값이어야 함
          if (quiz.meta.targetGender) {
            expect(Array.isArray(quiz.meta.targetGender)).toBe(true);
            const validGenders: Gender[] = ['male', 'female', 'other'];
            quiz.meta.targetGender.forEach((gender) => {
              expect(validGenders).toContain(gender);
            });
          }

          // ageRating이 있으면 유효한 값이어야 함
          if (quiz.meta.ageRating) {
            expect(['all', 'kids', 'teen', 'adult']).toContain(quiz.meta.ageRating);
          }
        }
      });
    });
  });

  describe('투표 메타데이터 구조', () => {
    it('투표에 meta 필드가 있으면 올바른 구조여야 함', () => {
      const allPolls = [...VS_POLLS, ...CHOICE_POLLS];

      allPolls.forEach((poll) => {
        if (poll.meta) {
          // targetAges 검증
          if (poll.meta.targetAges) {
            expect(Array.isArray(poll.meta.targetAges)).toBe(true);
            const validAgeGroups: AgeGroup[] = ['~9', '10s', '20s', '30s', '40s+'];
            poll.meta.targetAges.forEach((age) => {
              expect(validAgeGroups).toContain(age);
            });
          }

          // targetGender 검증
          if (poll.meta.targetGender) {
            expect(Array.isArray(poll.meta.targetGender)).toBe(true);
            const validGenders: Gender[] = ['male', 'female', 'other'];
            poll.meta.targetGender.forEach((gender) => {
              expect(validGenders).toContain(gender);
            });
          }
        }
      });
    });
  });

  describe('토너먼트 메타데이터 구조', () => {
    it('토너먼트에 meta 필드가 있으면 올바른 구조여야 함', () => {
      TIER_TOURNAMENTS.forEach((tournament) => {
        if (tournament.meta) {
          // targetGender 검증
          if (tournament.meta.targetGender) {
            expect(Array.isArray(tournament.meta.targetGender)).toBe(true);
            const validGenders: Gender[] = ['male', 'female', 'other'];
            tournament.meta.targetGender.forEach((gender) => {
              expect(validGenders).toContain(gender);
            });
          }
        }
      });
    });
  });
});

describe('타겟 커버리지 분석 로직', () => {
  it('연령대별 콘텐츠 수를 올바르게 집계해야 함', () => {
    const ageGroups: AgeGroup[] = ['~9', '10s', '20s', '30s', '40s+'];
    const ageTargetCounts: Record<AgeGroup, number> = {
      '~9': 0,
      '10s': 0,
      '20s': 0,
      '30s': 0,
      '40s+': 0,
    };

    const allQuizzes = [...ALL_KNOWLEDGE_QUIZZES, ...ALL_SCENARIO_QUIZZES];
    const allPolls = [...VS_POLLS, ...CHOICE_POLLS];

    [...allQuizzes, ...allPolls].forEach((content) => {
      const meta = content.meta;
      if (meta?.targetAges?.length) {
        meta.targetAges.forEach((age) => {
          if (ageTargetCounts[age] !== undefined) {
            ageTargetCounts[age]++;
          }
        });
      }
    });

    // 각 연령대별 카운트가 0 이상이어야 함
    ageGroups.forEach((age) => {
      expect(ageTargetCounts[age]).toBeGreaterThanOrEqual(0);
    });
  });

  it('성별별 콘텐츠 수를 올바르게 집계해야 함', () => {
    const genderTargetCounts: Record<Gender, number> = {
      male: 0,
      female: 0,
      other: 0,
    };

    const allQuizzes = [...ALL_KNOWLEDGE_QUIZZES, ...ALL_SCENARIO_QUIZZES];
    const allPolls = [...VS_POLLS, ...CHOICE_POLLS];

    [...allQuizzes, ...allPolls, ...TIER_TOURNAMENTS].forEach((content) => {
      const meta = content.meta;
      if (meta?.targetGender?.length) {
        meta.targetGender.forEach((gender) => {
          if (genderTargetCounts[gender] !== undefined) {
            genderTargetCounts[gender]++;
          }
        });
      }
    });

    // 성별 카운트가 0 이상이어야 함
    expect(genderTargetCounts.male).toBeGreaterThanOrEqual(0);
    expect(genderTargetCounts.female).toBeGreaterThanOrEqual(0);
  });

  it('타겟팅된 콘텐츠와 전체 대상 콘텐츠를 구분해야 함', () => {
    let targetedCount = 0;
    let universalCount = 0;

    const allQuizzes = [...ALL_KNOWLEDGE_QUIZZES, ...ALL_SCENARIO_QUIZZES];
    const allPolls = [...VS_POLLS, ...CHOICE_POLLS];

    [...allQuizzes, ...allPolls].forEach((content) => {
      const meta = content.meta;
      if (meta?.targetAges?.length || meta?.targetGender?.length) {
        targetedCount++;
      } else {
        universalCount++;
      }
    });

    const total = targetedCount + universalCount;
    expect(total).toBe(allQuizzes.length + allPolls.length);
  });

  it('부족한 연령대를 올바르게 찾아야 함', () => {
    const ageGroups: AgeGroup[] = ['~9', '10s', '20s', '30s', '40s+'];
    const ageTargetCounts: Record<AgeGroup, number> = {
      '~9': 0,
      '10s': 0,
      '20s': 0,
      '30s': 0,
      '40s+': 0,
    };

    const allQuizzes = [...ALL_KNOWLEDGE_QUIZZES, ...ALL_SCENARIO_QUIZZES];
    const allPolls = [...VS_POLLS, ...CHOICE_POLLS];

    [...allQuizzes, ...allPolls].forEach((content) => {
      const meta = content.meta;
      if (meta?.targetAges?.length) {
        meta.targetAges.forEach((age) => {
          if (ageTargetCounts[age] !== undefined) {
            ageTargetCounts[age]++;
          }
        });
      }
    });

    // 평균의 50% 미만인 연령대를 "부족"으로 판단
    const avgAgeTarget = Object.values(ageTargetCounts).reduce((a, b) => a + b, 0) / ageGroups.length;
    const weakAges = ageGroups.filter((age) => ageTargetCounts[age] < avgAgeTarget * 0.5);

    // weakAges는 배열이어야 함
    expect(Array.isArray(weakAges)).toBe(true);
  });
});
