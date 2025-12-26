// ============================================================================
// 이미지 프롬프트 데이터 테스트
// ============================================================================

import { describe, it, expect } from 'vitest';
import {
  ALL_IMAGE_PROMPTS,
  IMAGE_STYLES,
  IDEALTYPE_IMAGE_PROMPTS,
  ATTACHMENT_IMAGE_PROMPTS,
  PERSONALITY_TIER_IMAGE_PROMPTS,
  generateFullPrompt,
  getImageStats,
} from '../src/app/dashboard/data/image-prompts';

describe('이미지 프롬프트 데이터 검증', () => {
  // ========================================
  // 1. 기본 구조 검증
  // ========================================
  describe('기본 구조', () => {
    it('ALL_IMAGE_PROMPTS가 3개 이상의 테스트 그룹을 가져야 함', () => {
      expect(ALL_IMAGE_PROMPTS.length).toBeGreaterThanOrEqual(3);
    });

    it('각 테스트 그룹은 필수 필드를 가져야 함', () => {
      ALL_IMAGE_PROMPTS.forEach((group) => {
        expect(group.testKey).toBeTruthy();
        expect(group.testName).toBeTruthy();
        expect(group.totalResults).toBeGreaterThan(0);
        expect(Array.isArray(group.items)).toBe(true);
        expect(group.items.length).toBeGreaterThan(0);
      });
    });

    it('모든 프롬프트 아이템은 필수 필드를 가져야 함', () => {
      ALL_IMAGE_PROMPTS.forEach((group) => {
        group.items.forEach((item) => {
          expect(item.id).toBeTruthy();
          expect(item.testKey).toBeTruthy();
          expect(item.resultName).toBeTruthy();
          expect(item.prompt).toBeTruthy();
          expect(item.style).toBeTruthy();
          expect(item.status).toBeTruthy();
        });
      });
    });

    it('프롬프트 ID는 전체에서 유일해야 함', () => {
      const allIds = ALL_IMAGE_PROMPTS.flatMap(g => g.items.map(i => i.id));
      const uniqueIds = new Set(allIds);
      expect(uniqueIds.size).toBe(allIds.length);
    });
  });

  // ========================================
  // 2. 스타일 검증
  // ========================================
  describe('스타일', () => {
    it('IMAGE_STYLES가 정의되어 있어야 함', () => {
      expect(IMAGE_STYLES).toBeDefined();
      expect(Object.keys(IMAGE_STYLES).length).toBeGreaterThan(0);
    });

    it('모든 프롬프트의 style이 IMAGE_STYLES에 정의되어 있어야 함', () => {
      const validStyles = Object.keys(IMAGE_STYLES);
      ALL_IMAGE_PROMPTS.forEach((group) => {
        group.items.forEach((item) => {
          expect(validStyles).toContain(item.style);
        });
      });
    });

    it('teenAnime 스타일이 정의되어 있어야 함 (10대 타겟)', () => {
      expect(IMAGE_STYLES.teenAnime).toBeTruthy();
      expect(IMAGE_STYLES.teenAnime.toLowerCase()).toContain('anime');
    });

    it('teenFresh 스타일이 정의되어 있어야 함 (10대 타겟)', () => {
      expect(IMAGE_STYLES.teenFresh).toBeTruthy();
      expect(IMAGE_STYLES.teenFresh.toLowerCase()).toContain('youthful');
    });
  });

  // ========================================
  // 3. 이상형 테스트 프롬프트 검증
  // ========================================
  describe('이상형 테스트 프롬프트', () => {
    it('10개의 프롬프트가 있어야 함', () => {
      expect(IDEALTYPE_IMAGE_PROMPTS.length).toBe(10);
    });

    it('모든 프롬프트가 teenAnime 스타일이어야 함', () => {
      IDEALTYPE_IMAGE_PROMPTS.forEach((item) => {
        expect(item.style).toBe('teenAnime');
      });
    });

    it('모든 프롬프트에 한글 설명이 있어야 함', () => {
      IDEALTYPE_IMAGE_PROMPTS.forEach((item) => {
        expect(item.promptKo).toBeTruthy();
        expect(item.promptKo!.length).toBeGreaterThan(5);
      });
    });

    it('프롬프트에 고등학생/학교 관련 키워드가 있어야 함 (10대 타겟)', () => {
      IDEALTYPE_IMAGE_PROMPTS.forEach((item) => {
        const promptLower = item.prompt.toLowerCase();
        const hasTeenKeyword =
          promptLower.includes('high school') ||
          promptLower.includes('teenager') ||
          promptLower.includes('student');
        expect(hasTeenKeyword).toBe(true);
      });
    });
  });

  // ========================================
  // 4. 애착유형 테스트 프롬프트 검증
  // ========================================
  describe('애착유형 테스트 프롬프트', () => {
    it('8개의 프롬프트가 있어야 함', () => {
      expect(ATTACHMENT_IMAGE_PROMPTS.length).toBe(8);
    });

    it('모든 프롬프트가 teenAnime 스타일이어야 함', () => {
      ATTACHMENT_IMAGE_PROMPTS.forEach((item) => {
        expect(item.style).toBe('teenAnime');
      });
    });

    it('testKey가 attachment여야 함', () => {
      ATTACHMENT_IMAGE_PROMPTS.forEach((item) => {
        expect(item.testKey).toBe('attachment');
      });
    });
  });

  // ========================================
  // 5. 성격 궁합 티어 프롬프트 검증
  // ========================================
  describe('성격 궁합 티어 프롬프트', () => {
    it('32개의 프롬프트가 있어야 함 (32개 궁합 조합)', () => {
      expect(PERSONALITY_TIER_IMAGE_PROMPTS.length).toBe(32);
    });

    it('모든 프롬프트가 teenAnime 스타일이어야 함', () => {
      PERSONALITY_TIER_IMAGE_PROMPTS.forEach((item) => {
        expect(item.style).toBe('teenAnime');
      });
    });

    it('testKey가 personality-tier여야 함', () => {
      PERSONALITY_TIER_IMAGE_PROMPTS.forEach((item) => {
        expect(item.testKey).toBe('personality-tier');
      });
    });

    it('모든 프롬프트에 이모지가 있어야 함', () => {
      PERSONALITY_TIER_IMAGE_PROMPTS.forEach((item) => {
        expect(item.emoji).toBeTruthy();
      });
    });

    it('MBTI 16유형 코드를 사용하지 않아야 함 (저작권 이슈)', () => {
      const mbtiCodes = [
        'INFP', 'INFJ', 'INTP', 'INTJ',
        'ISFP', 'ISFJ', 'ISTP', 'ISTJ',
        'ENFP', 'ENFJ', 'ENTP', 'ENTJ',
        'ESFP', 'ESFJ', 'ESTP', 'ESTJ',
      ];

      PERSONALITY_TIER_IMAGE_PROMPTS.forEach((item) => {
        mbtiCodes.forEach((code) => {
          expect(item.resultName.toUpperCase()).not.toContain(code);
          expect(item.prompt.toUpperCase()).not.toContain(code);
        });
      });
    });
  });

  // ========================================
  // 6. 유틸리티 함수 테스트
  // ========================================
  describe('유틸리티 함수', () => {
    it('generateFullPrompt: 프롬프트 + 스타일 조합', () => {
      const testItem = IDEALTYPE_IMAGE_PROMPTS[0];
      const fullPrompt = generateFullPrompt(testItem);

      expect(fullPrompt).toContain(testItem.prompt);
      expect(fullPrompt).toContain(IMAGE_STYLES[testItem.style as keyof typeof IMAGE_STYLES]);
    });

    it('getImageStats: 통계 반환', () => {
      const stats = getImageStats();

      expect(stats.total).toBeGreaterThan(0);
      expect(stats.uploaded).toBeGreaterThanOrEqual(0);
      expect(stats.pending).toBeGreaterThanOrEqual(0);
      expect(stats.progress).toBeGreaterThanOrEqual(0);
      expect(stats.progress).toBeLessThanOrEqual(100);
      expect(stats.total).toBe(stats.uploaded + stats.pending);
    });
  });

  // ========================================
  // 7. 프롬프트 품질 검증
  // ========================================
  describe('프롬프트 품질', () => {
    it('모든 프롬프트는 30자 이상이어야 함', () => {
      ALL_IMAGE_PROMPTS.forEach((group) => {
        group.items.forEach((item) => {
          expect(item.prompt.length).toBeGreaterThanOrEqual(30);
        });
      });
    });

    it('프롬프트에 white background 키워드가 포함되어야 함', () => {
      // 대부분의 프롬프트가 일관된 배경을 가져야 함
      let whiteBackgroundCount = 0;
      let totalCount = 0;

      ALL_IMAGE_PROMPTS.forEach((group) => {
        group.items.forEach((item) => {
          totalCount++;
          if (item.prompt.toLowerCase().includes('white background')) {
            whiteBackgroundCount++;
          }
        });
      });

      // 최소 80% 이상이 white background를 가져야 함
      const ratio = whiteBackgroundCount / totalCount;
      expect(ratio).toBeGreaterThanOrEqual(0.8);
    });

    it('프롬프트에 shoujo manga style 키워드가 포함되어야 함 (일관된 스타일)', () => {
      let styleCount = 0;
      let totalCount = 0;

      ALL_IMAGE_PROMPTS.forEach((group) => {
        group.items.forEach((item) => {
          totalCount++;
          if (item.prompt.toLowerCase().includes('shoujo manga style')) {
            styleCount++;
          }
        });
      });

      // 최소 80% 이상이 shoujo manga style을 가져야 함
      const ratio = styleCount / totalCount;
      expect(ratio).toBeGreaterThanOrEqual(0.8);
    });
  });

  // ========================================
  // 8. 상태 검증
  // ========================================
  describe('상태 관리', () => {
    it('status는 pending, generated, uploaded 중 하나여야 함', () => {
      const validStatuses = ['pending', 'generated', 'uploaded'];

      ALL_IMAGE_PROMPTS.forEach((group) => {
        group.items.forEach((item) => {
          expect(validStatuses).toContain(item.status);
        });
      });
    });

    it('uploadedCount가 실제 uploaded 상태 아이템 수와 일치해야 함', () => {
      ALL_IMAGE_PROMPTS.forEach((group) => {
        const actualUploaded = group.items.filter(i => i.status === 'uploaded').length;
        expect(group.uploadedCount).toBe(actualUploaded);
      });
    });

    it('totalResults가 실제 아이템 수와 일치해야 함', () => {
      ALL_IMAGE_PROMPTS.forEach((group) => {
        expect(group.totalResults).toBe(group.items.length);
      });
    });
  });
});
