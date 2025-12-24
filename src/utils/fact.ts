/**
 * 팩트 ID 생성 및 관리 유틸리티
 */

import type { FactRequiredCategory, FactId } from '@/data/content/types';

/**
 * 팩트 필요 카테고리 목록
 */
export const FACT_REQUIRED_CATEGORIES: FactRequiredCategory[] = [
  'cat', 'dog', 'rabbit', 'hamster',  // 반려동물
  'plant',                             // 식물
  'coffee', 'alcohol',                 // 식품/음료
];

/**
 * 카테고리가 팩트 필요 카테고리인지 확인
 */
export function isFactRequiredCategory(category: string): category is FactRequiredCategory {
  return FACT_REQUIRED_CATEGORIES.includes(category as FactRequiredCategory);
}

/**
 * 팩트 ID 생성
 * @param category 카테고리 (cat, dog, plant 등)
 * @param number 팩트 번호 (1, 2, 3...)
 * @returns 팩트 ID (예: cat-fact-001)
 */
export function generateFactId(category: FactRequiredCategory, number: number): FactId {
  const paddedNumber = number.toString().padStart(3, '0');
  return `${category}-fact-${paddedNumber}` as FactId;
}

/**
 * 팩트 ID 파싱
 * @param factId 팩트 ID
 * @returns { category, number } 또는 null
 */
export function parseFactId(factId: string): { category: FactRequiredCategory; number: number } | null {
  const match = factId.match(/^([a-z]+)-fact-(\d+)$/);
  if (!match) return null;

  const [, category, numStr] = match;
  if (!isFactRequiredCategory(category)) return null;

  return {
    category: category as FactRequiredCategory,
    number: parseInt(numStr, 10),
  };
}

/**
 * 팩트 ID 유효성 검사
 */
export function isValidFactId(factId: string): factId is FactId {
  return parseFactId(factId) !== null;
}

/**
 * 기존 팩트 목록에서 다음 ID 번호 계산
 * @param existingIds 기존 팩트 ID 목록
 * @param category 카테고리
 * @returns 다음 번호
 */
export function getNextFactNumber(existingIds: string[], category: FactRequiredCategory): number {
  const categoryIds = existingIds.filter(id => id.startsWith(`${category}-fact-`));

  if (categoryIds.length === 0) return 1;

  const numbers = categoryIds
    .map(id => {
      const parsed = parseFactId(id);
      return parsed?.number ?? 0;
    })
    .filter(n => n > 0);

  return Math.max(...numbers) + 1;
}

/**
 * 팩트 ID로 검증일이 얼마나 지났는지 계산 (일 단위)
 */
export function getDaysSinceVerification(verifiedDate: string): number {
  if (!verifiedDate) return 999;

  const date = new Date(verifiedDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 검증 상태 계산
 * - fresh: 90일 이내
 * - aging: 90~180일
 * - stale: 180일 초과
 */
export type VerificationStatus = 'fresh' | 'aging' | 'stale';

export function getVerificationStatus(verifiedDate: string): VerificationStatus {
  const days = getDaysSinceVerification(verifiedDate);
  if (days <= 90) return 'fresh';
  if (days <= 180) return 'aging';
  return 'stale';
}

/**
 * 팩트 마크다운 템플릿 생성
 */
export function generateFactMarkdown(
  factId: FactId,
  data: {
    title: string;
    value: string;
    source: string;
    url?: string;
    verifiedDate: string;
    usedIn?: string[];
    note?: string;
  }
): string {
  const lines = [
    `## ${factId}: ${data.title}`,
    `- **값**: ${data.value}`,
    `- **출처**: ${data.source}`,
  ];

  if (data.url) {
    lines.push(`- **URL**: ${data.url}`);
  }

  lines.push(`- **검증일**: ${data.verifiedDate}`);
  lines.push(`- **사용된 콘텐츠**: ${data.usedIn?.join(', ') || ''}`);

  if (data.note) {
    lines.push(`- **비고**: ${data.note}`);
  }

  return lines.join('\n');
}
