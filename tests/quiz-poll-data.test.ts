/**
 * 퀴즈/투표 데이터 유효성 검증 테스트
 * - 데이터 구조 검증
 * - 필수 필드 확인
 * - 카테고리 분포 확인
 */

import { describe, it, expect } from 'vitest';
import { ALL_KNOWLEDGE_QUIZZES, RABBIT_KNOWLEDGE_QUIZZES, PLANT_KNOWLEDGE_QUIZZES } from '../src/data/content/quizzes';
import { VS_POLLS } from '../src/data/content/polls';

describe('퀴즈 데이터 유효성', () => {
  describe('전체 퀴즈 검증', () => {
    it('모든 퀴즈에 필수 필드가 있어야 함', () => {
      ALL_KNOWLEDGE_QUIZZES.forEach(quiz => {
        expect(quiz.id).toBeDefined();
        expect(quiz.category).toBeDefined();
        expect(quiz.question).toBeDefined();
        expect(quiz.options).toBeDefined();
        expect(quiz.options.length).toBeGreaterThanOrEqual(2);
        expect(quiz.explanation).toBeDefined();
      });
    });

    it('모든 퀴즈에 정답이 하나 이상 있어야 함', () => {
      ALL_KNOWLEDGE_QUIZZES.forEach(quiz => {
        const correctOptions = quiz.options.filter(o => o.isCorrect);
        expect(correctOptions.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('퀴즈 ID가 고유해야 함', () => {
      const ids = ALL_KNOWLEDGE_QUIZZES.map(q => q.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });

    it('각 옵션에 고유 ID가 있어야 함', () => {
      ALL_KNOWLEDGE_QUIZZES.forEach(quiz => {
        const optionIds = quiz.options.map(o => o.id);
        const uniqueOptionIds = [...new Set(optionIds)];
        expect(optionIds.length).toBe(uniqueOptionIds.length);
      });
    });
  });

  describe('토끼 퀴즈 검증', () => {
    it('8개 퀴즈가 있어야 함', () => {
      expect(RABBIT_KNOWLEDGE_QUIZZES.length).toBe(8);
    });

    it('모두 rabbit 카테고리여야 함', () => {
      RABBIT_KNOWLEDGE_QUIZZES.forEach(quiz => {
        expect(quiz.category).toBe('rabbit');
      });
    });

    it('ID가 rabbit-k-로 시작해야 함', () => {
      RABBIT_KNOWLEDGE_QUIZZES.forEach(quiz => {
        expect(quiz.id.startsWith('rabbit-k-')).toBe(true);
      });
    });

    it('각 퀴즈에 4개 선택지가 있어야 함', () => {
      RABBIT_KNOWLEDGE_QUIZZES.forEach(quiz => {
        expect(quiz.options.length).toBe(4);
      });
    });
  });

  describe('식물 퀴즈 검증', () => {
    it('8개 퀴즈가 있어야 함', () => {
      expect(PLANT_KNOWLEDGE_QUIZZES.length).toBe(8);
    });

    it('모두 plant 카테고리여야 함', () => {
      PLANT_KNOWLEDGE_QUIZZES.forEach(quiz => {
        expect(quiz.category).toBe('plant');
      });
    });

    it('ID가 plant-k-로 시작해야 함', () => {
      PLANT_KNOWLEDGE_QUIZZES.forEach(quiz => {
        expect(quiz.id.startsWith('plant-k-')).toBe(true);
      });
    });

    it('각 퀴즈에 4개 선택지가 있어야 함', () => {
      PLANT_KNOWLEDGE_QUIZZES.forEach(quiz => {
        expect(quiz.options.length).toBe(4);
      });
    });
  });
});

describe('투표 데이터 유효성', () => {
  describe('전체 투표 검증', () => {
    it('모든 투표에 필수 필드가 있어야 함', () => {
      VS_POLLS.forEach(poll => {
        expect(poll.id).toBeDefined();
        expect(poll.category).toBeDefined();
        expect(poll.question).toBeDefined();
        expect(poll.optionA).toBeDefined();
        expect(poll.optionB).toBeDefined();
      });
    });

    it('각 옵션에 id, text, emoji가 있어야 함', () => {
      VS_POLLS.forEach(poll => {
        expect(poll.optionA.id).toBe('a');
        expect(poll.optionA.text).toBeDefined();
        expect(poll.optionA.emoji).toBeDefined();
        expect(poll.optionB.id).toBe('b');
        expect(poll.optionB.text).toBeDefined();
        expect(poll.optionB.emoji).toBeDefined();
      });
    });

    it('투표 ID가 고유해야 함', () => {
      const ids = VS_POLLS.map(p => p.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });
  });

  describe('카테고리별 투표 개수', () => {
    it('토끼 투표가 4개 있어야 함', () => {
      const rabbitPolls = VS_POLLS.filter(p => p.category === 'rabbit');
      expect(rabbitPolls.length).toBe(4);
    });

    it('식물 투표가 5개 있어야 함', () => {
      const plantPolls = VS_POLLS.filter(p => p.category === 'plant');
      expect(plantPolls.length).toBe(5);
    });

    it('고양이 투표가 있어야 함', () => {
      const catPolls = VS_POLLS.filter(p => p.category === 'cat');
      expect(catPolls.length).toBeGreaterThanOrEqual(1);
    });

    it('강아지 투표가 있어야 함', () => {
      const dogPolls = VS_POLLS.filter(p => p.category === 'dog');
      expect(dogPolls.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('토끼 투표 상세 검증', () => {
    it('ID가 vs-rabbit-으로 시작해야 함', () => {
      const rabbitPolls = VS_POLLS.filter(p => p.category === 'rabbit');
      rabbitPolls.forEach(poll => {
        expect(poll.id.startsWith('vs-rabbit-')).toBe(true);
      });
    });

    it('토끼 관련 태그가 있어야 함', () => {
      const rabbitPolls = VS_POLLS.filter(p => p.category === 'rabbit');
      rabbitPolls.forEach(poll => {
        expect(poll.tags).toBeDefined();
        expect(poll.tags).toContain('토끼');
      });
    });
  });

  describe('식물 투표 상세 검증', () => {
    it('ID가 vs-plant-로 시작해야 함', () => {
      const plantPolls = VS_POLLS.filter(p => p.category === 'plant');
      plantPolls.forEach(poll => {
        expect(poll.id.startsWith('vs-plant-')).toBe(true);
      });
    });

    it('식물 관련 태그가 있어야 함', () => {
      const plantPolls = VS_POLLS.filter(p => p.category === 'plant');
      plantPolls.forEach(poll => {
        expect(poll.tags).toBeDefined();
        expect(poll.tags).toContain('식물');
      });
    });
  });
});

describe('콘텐츠 분포', () => {
  it('퀴즈가 최소 4개 카테고리에 분포되어 있어야 함', () => {
    const categories = [...new Set(ALL_KNOWLEDGE_QUIZZES.map(q => q.category))];
    expect(categories.length).toBeGreaterThanOrEqual(4);
  });

  it('투표가 최소 5개 카테고리에 분포되어 있어야 함', () => {
    const categories = [...new Set(VS_POLLS.map(p => p.category))];
    expect(categories.length).toBeGreaterThanOrEqual(5);
  });

  it('총 퀴즈 수가 20개 이상이어야 함', () => {
    expect(ALL_KNOWLEDGE_QUIZZES.length).toBeGreaterThanOrEqual(20);
  });

  it('총 투표 수가 25개 이상이어야 함', () => {
    expect(VS_POLLS.length).toBeGreaterThanOrEqual(25);
  });
});
