/**
 * ContentRecommendationService - 콘텐츠 유사도 기반 추천
 *
 * Phase 1: 클라이언트 사이드 태그 기반 유사도 (서버 비용 $0)
 * - 태그 교집합으로 유사도 계산
 * - 같은 카테고리 가중치 부여
 * - "이 퀴즈와 비슷한 퀴즈" 추천
 *
 * 추후 Phase 2: 서버 기반 협업 필터링 (Turso DB 활용)
 * - "이 퀴즈를 푼 사람들이 좋아한 다른 퀴즈"
 */

import type { KnowledgeQuiz, VSPoll, ContentCategory, SituationReaction, SituationCategory } from '@/data/content/types';

// ============================================================================
// 타입 정의
// ============================================================================

interface ContentSimilarity {
  contentId: string;
  score: number;
  matchedTags: string[];
  sameCategory: boolean;
}

interface RecommendationResult<T> {
  content: T;
  similarityScore: number;
  reason: string; // "태그 일치: 고양이, 육식" 등
}

// ============================================================================
// 유사도 계산 유틸
// ============================================================================

/**
 * Jaccard 유사도 계산 (태그 교집합 / 합집합)
 */
function calculateJaccardSimilarity(tagsA: string[], tagsB: string[]): number {
  if (tagsA.length === 0 && tagsB.length === 0) return 0;

  const setA = new Set(tagsA);
  const setB = new Set(tagsB);

  const intersection = new Set([...setA].filter(tag => setB.has(tag)));
  const union = new Set([...setA, ...setB]);

  return intersection.size / union.size;
}

/**
 * 매칭된 태그 반환
 */
function getMatchedTags(tagsA: string[], tagsB: string[]): string[] {
  const setB = new Set(tagsB);
  return tagsA.filter(tag => setB.has(tag));
}

// ============================================================================
// 서비스 클래스
// ============================================================================

class ContentRecommendationServiceClass {
  // 가중치 설정
  private readonly WEIGHTS = {
    tagSimilarity: 0.7,     // 태그 유사도 (Jaccard)
    categoryMatch: 0.3,     // 같은 카테고리
  };

  /**
   * 두 퀴즈 간 유사도 계산
   */
  calculateQuizSimilarity(quizA: KnowledgeQuiz, quizB: KnowledgeQuiz): ContentSimilarity {
    // 태그 유사도
    const tagsA = quizA.tags || [];
    const tagsB = quizB.tags || [];
    const tagScore = calculateJaccardSimilarity(tagsA, tagsB);

    // 카테고리 일치
    const sameCategory = quizA.category === quizB.category;
    const categoryScore = sameCategory ? 1 : 0;

    // 가중 합산
    const score =
      tagScore * this.WEIGHTS.tagSimilarity +
      categoryScore * this.WEIGHTS.categoryMatch;

    return {
      contentId: quizB.id,
      score,
      matchedTags: getMatchedTags(tagsA, tagsB),
      sameCategory,
    };
  }

  /**
   * 두 투표 간 유사도 계산
   */
  calculatePollSimilarity(pollA: VSPoll, pollB: VSPoll): ContentSimilarity {
    // 태그 유사도
    const tagsA = pollA.tags || [];
    const tagsB = pollB.tags || [];
    const tagScore = calculateJaccardSimilarity(tagsA, tagsB);

    // 카테고리 일치
    const sameCategory = pollA.category === pollB.category;
    const categoryScore = sameCategory ? 1 : 0;

    // 가중 합산
    const score =
      tagScore * this.WEIGHTS.tagSimilarity +
      categoryScore * this.WEIGHTS.categoryMatch;

    return {
      contentId: pollB.id,
      score,
      matchedTags: getMatchedTags(tagsA, tagsB),
      sameCategory,
    };
  }

  /**
   * 특정 퀴즈와 비슷한 퀴즈 추천
   *
   * @param targetQuiz 기준 퀴즈
   * @param allQuizzes 전체 퀴즈 목록
   * @param limit 추천 개수 (기본 5)
   * @returns 유사도 순 정렬된 추천 퀴즈
   */
  getSimilarQuizzes(
    targetQuiz: KnowledgeQuiz,
    allQuizzes: KnowledgeQuiz[],
    limit: number = 5
  ): RecommendationResult<KnowledgeQuiz>[] {
    // 자기 자신 제외
    const others = allQuizzes.filter(q => q.id !== targetQuiz.id);

    // 유사도 계산 및 정렬
    const scored = others
      .map(quiz => {
        const similarity = this.calculateQuizSimilarity(targetQuiz, quiz);
        return {
          content: quiz,
          similarityScore: similarity.score,
          reason: this.buildReason(similarity),
        };
      })
      .filter(item => item.similarityScore > 0) // 유사도 0인 것 제외
      .sort((a, b) => b.similarityScore - a.similarityScore);

    return scored.slice(0, limit);
  }

  /**
   * 두 상황별 반응 간 유사도 계산
   */
  calculateSituationSimilarity(
    situationA: SituationReaction,
    situationB: SituationReaction
  ): ContentSimilarity {
    // 태그 유사도
    const tagsA = situationA.tags || [];
    const tagsB = situationB.tags || [];
    const tagScore = calculateJaccardSimilarity(tagsA, tagsB);

    // 카테고리 일치 (SituationCategory)
    const sameCategory = situationA.category === situationB.category;
    const categoryScore = sameCategory ? 1 : 0;

    // 가중 합산
    const score =
      tagScore * this.WEIGHTS.tagSimilarity +
      categoryScore * this.WEIGHTS.categoryMatch;

    return {
      contentId: situationB.id,
      score,
      matchedTags: getMatchedTags(tagsA, tagsB),
      sameCategory,
    };
  }

  /**
   * 특정 투표와 비슷한 투표 추천
   */
  getSimilarPolls(
    targetPoll: VSPoll,
    allPolls: VSPoll[],
    limit: number = 5
  ): RecommendationResult<VSPoll>[] {
    const others = allPolls.filter(p => p.id !== targetPoll.id);

    const scored = others
      .map(poll => {
        const similarity = this.calculatePollSimilarity(targetPoll, poll);
        return {
          content: poll,
          similarityScore: similarity.score,
          reason: this.buildReason(similarity),
        };
      })
      .filter(item => item.similarityScore > 0)
      .sort((a, b) => b.similarityScore - a.similarityScore);

    return scored.slice(0, limit);
  }

  /**
   * 특정 상황별 반응과 비슷한 상황 추천
   */
  getSimilarSituationReactions(
    targetSituation: SituationReaction,
    allSituations: SituationReaction[],
    limit: number = 5
  ): RecommendationResult<SituationReaction>[] {
    const others = allSituations.filter(s => s.id !== targetSituation.id);

    const scored = others
      .map(situation => {
        const similarity = this.calculateSituationSimilarity(targetSituation, situation);
        return {
          content: situation,
          similarityScore: similarity.score,
          reason: this.buildReason(similarity),
        };
      })
      .filter(item => item.similarityScore > 0)
      .sort((a, b) => b.similarityScore - a.similarityScore);

    return scored.slice(0, limit);
  }

  /**
   * 사용자가 참여한 콘텐츠 기반 추천
   *
   * @param participatedQuizIds 참여한 퀴즈 ID 목록
   * @param allQuizzes 전체 퀴즈 목록
   * @param limit 추천 개수
   * @returns 유사도 높은 미참여 퀴즈
   */
  getRecommendedQuizzes(
    participatedQuizIds: string[],
    allQuizzes: KnowledgeQuiz[],
    limit: number = 10
  ): RecommendationResult<KnowledgeQuiz>[] {
    // 참여한 퀴즈
    const participated = allQuizzes.filter(q => participatedQuizIds.includes(q.id));
    // 미참여 퀴즈
    const unparticipated = allQuizzes.filter(q => !participatedQuizIds.includes(q.id));

    if (participated.length === 0) {
      // 참여 이력 없으면 빈 배열 (기본 추천에 위임)
      return [];
    }

    // 미참여 퀴즈 각각에 대해 참여한 퀴즈들과의 평균 유사도 계산
    const scored = unparticipated.map(quiz => {
      const similarities = participated.map(p =>
        this.calculateQuizSimilarity(p, quiz)
      );

      // 가장 높은 유사도와 평균 유사도 조합
      const maxSimilarity = Math.max(...similarities.map(s => s.score));
      const avgSimilarity = similarities.reduce((sum, s) => sum + s.score, 0) / similarities.length;
      // 최대값에 더 가중치 (0.7 최대 + 0.3 평균)
      const combinedScore = maxSimilarity * 0.7 + avgSimilarity * 0.3;

      // 가장 유사한 것의 이유
      const bestMatch = similarities.reduce((a, b) => a.score > b.score ? a : b);

      return {
        content: quiz,
        similarityScore: combinedScore,
        reason: this.buildReason(bestMatch),
      };
    });

    return scored
      .filter(item => item.similarityScore > 0.1) // 최소 유사도 임계값
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);
  }

  /**
   * 사용자가 참여한 투표 기반 추천
   */
  getRecommendedPolls(
    participatedPollIds: string[],
    allPolls: VSPoll[],
    limit: number = 10
  ): RecommendationResult<VSPoll>[] {
    const participated = allPolls.filter(p => participatedPollIds.includes(p.id));
    const unparticipated = allPolls.filter(p => !participatedPollIds.includes(p.id));

    if (participated.length === 0) {
      return [];
    }

    const scored = unparticipated.map(poll => {
      const similarities = participated.map(p =>
        this.calculatePollSimilarity(p, poll)
      );

      const maxSimilarity = Math.max(...similarities.map(s => s.score));
      const avgSimilarity = similarities.reduce((sum, s) => sum + s.score, 0) / similarities.length;
      const combinedScore = maxSimilarity * 0.7 + avgSimilarity * 0.3;

      const bestMatch = similarities.reduce((a, b) => a.score > b.score ? a : b);

      return {
        content: poll,
        similarityScore: combinedScore,
        reason: this.buildReason(bestMatch),
      };
    });

    return scored
      .filter(item => item.similarityScore > 0.1)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);
  }

  /**
   * 추천 이유 문자열 생성
   */
  private buildReason(similarity: ContentSimilarity): string {
    const reasons: string[] = [];

    if (similarity.matchedTags.length > 0) {
      reasons.push(`태그 일치: ${similarity.matchedTags.slice(0, 3).join(', ')}`);
    }

    if (similarity.sameCategory) {
      reasons.push('같은 카테고리');
    }

    return reasons.length > 0 ? reasons.join(' / ') : '관련 콘텐츠';
  }

  /**
   * 카테고리별 콘텐츠 그룹화
   */
  groupByCategory<T extends { category: ContentCategory }>(
    contents: T[]
  ): Map<ContentCategory, T[]> {
    const groups = new Map<ContentCategory, T[]>();

    for (const content of contents) {
      if (!groups.has(content.category)) {
        groups.set(content.category, []);
      }
      groups.get(content.category)!.push(content);
    }

    return groups;
  }
}

// 싱글톤 인스턴스
export const contentRecommendationService = new ContentRecommendationServiceClass();
export default contentRecommendationService;
