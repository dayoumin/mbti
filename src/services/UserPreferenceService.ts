/**
 * UserPreferenceService - 사용자 선호도 기반 콘텐츠 추천
 *
 * YouTube/TikTok 스타일 개인화:
 * - 카테고리별 참여 횟수 추적
 * - 태그별 관심도 추적
 * - 정답률 기반 난이도 조절
 * - 연령 제한 필터링 (술 등)
 */

import { STORAGE_KEYS } from '@/lib/storage';
import { demographicService } from './DemographicService';
import type { ContentCategory, KnowledgeQuiz, VSPoll } from '@/data/content/types';
import { isContentAllowedForAge, getKidsBoostFactor } from '@/data/content/types';
import { contentRecommendationService } from './ContentRecommendationService';

// ============================================================================
// 타입 정의
// ============================================================================

export interface CategoryEngagement {
  quizCount: number;
  pollCount: number;
  correctCount: number;
  lastEngagedAt: string;
}

export interface UserPreferenceData {
  // 카테고리별 참여 통계
  categoryEngagement: Record<string, CategoryEngagement>;

  // 태그별 관심도 (참여 횟수)
  tagInterest: Record<string, number>;

  // 선호 난이도 (퀴즈 정답률 기반 자동 조정)
  preferredDifficulty: 1 | 2 | 3;

  // 마지막 업데이트
  updatedAt: string;
}

// ============================================================================
// 추천 점수 계산용 가중치
// ============================================================================

const WEIGHTS = {
  categoryEngagement: 0.4,  // 카테고리 참여도
  tagMatch: 0.3,            // 태그 매칭
  difficultyFit: 0.2,       // 난이도 적합성
  freshness: 0.1,           // 신규 콘텐츠 보너스
};

// ============================================================================
// 서비스 클래스
// ============================================================================

const STORAGE_KEY = STORAGE_KEYS.USER_PREFERENCE || 'chemi_user_preference';

class UserPreferenceServiceClass {
  private data: UserPreferenceData;

  constructor() {
    this.data = this.loadFromStorage();
  }

  // 저장소에서 로드
  private loadFromStorage(): UserPreferenceData {
    if (typeof window === 'undefined') {
      return this.getDefaultData();
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('UserPreferenceService: Failed to load from storage', e);
    }

    return this.getDefaultData();
  }

  // 기본 데이터
  private getDefaultData(): UserPreferenceData {
    return {
      categoryEngagement: {},
      tagInterest: {},
      preferredDifficulty: 2,
      updatedAt: new Date().toISOString(),
    };
  }

  // 저장
  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      this.data.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('UserPreferenceService: Failed to save to storage', e);
    }
  }

  // ========================================================================
  // 참여 기록
  // ========================================================================

  /**
   * 퀴즈 참여 기록
   */
  recordQuizEngagement(
    category: ContentCategory,
    tags: string[] = [],
    isCorrect: boolean,
    difficulty: 1 | 2 | 3
  ): void {
    // 카테고리 참여 기록
    if (!this.data.categoryEngagement[category]) {
      this.data.categoryEngagement[category] = {
        quizCount: 0,
        pollCount: 0,
        correctCount: 0,
        lastEngagedAt: new Date().toISOString(),
      };
    }
    this.data.categoryEngagement[category].quizCount++;
    if (isCorrect) {
      this.data.categoryEngagement[category].correctCount++;
    }
    this.data.categoryEngagement[category].lastEngagedAt = new Date().toISOString();

    // 태그 관심도 증가
    tags.forEach(tag => {
      this.data.tagInterest[tag] = (this.data.tagInterest[tag] || 0) + 1;
    });

    // 난이도 자동 조정 (정답률 기반)
    this.updatePreferredDifficulty();

    this.saveToStorage();
  }

  /**
   * 투표 참여 기록
   */
  recordPollEngagement(category: ContentCategory, tags: string[] = []): void {
    // 카테고리 참여 기록
    if (!this.data.categoryEngagement[category]) {
      this.data.categoryEngagement[category] = {
        quizCount: 0,
        pollCount: 0,
        correctCount: 0,
        lastEngagedAt: new Date().toISOString(),
      };
    }
    this.data.categoryEngagement[category].pollCount++;
    this.data.categoryEngagement[category].lastEngagedAt = new Date().toISOString();

    // 태그 관심도 증가
    tags.forEach(tag => {
      this.data.tagInterest[tag] = (this.data.tagInterest[tag] || 0) + 1;
    });

    this.saveToStorage();
  }

  /**
   * 정답률 기반 선호 난이도 자동 조정
   */
  private updatePreferredDifficulty(): void {
    const totalQuizzes = Object.values(this.data.categoryEngagement)
      .reduce((sum, cat) => sum + cat.quizCount, 0);

    if (totalQuizzes < 5) return; // 최소 5개 이상 풀어야 조정

    const totalCorrect = Object.values(this.data.categoryEngagement)
      .reduce((sum, cat) => sum + cat.correctCount, 0);

    const accuracy = totalCorrect / totalQuizzes;

    // 정답률에 따라 난이도 조정
    if (accuracy >= 0.8) {
      this.data.preferredDifficulty = 3; // 80% 이상 → 어려운 문제
    } else if (accuracy >= 0.5) {
      this.data.preferredDifficulty = 2; // 50-80% → 중간 난이도
    } else {
      this.data.preferredDifficulty = 1; // 50% 미만 → 쉬운 문제
    }
  }

  // ========================================================================
  // 추천 로직
  // ========================================================================

  /**
   * 퀴즈 추천 점수 계산
   */
  getQuizScore(quiz: KnowledgeQuiz): number {
    let score = 0;

    // 1. 카테고리 참여도 (0.4)
    const categoryData = this.data.categoryEngagement[quiz.category];
    if (categoryData) {
      const engagement = categoryData.quizCount + categoryData.pollCount;
      score += Math.min(engagement / 10, 1) * WEIGHTS.categoryEngagement;
    }

    // 2. 태그 매칭 (0.3)
    if (quiz.tags && quiz.tags.length > 0) {
      const matchedTags = quiz.tags.filter(tag => this.data.tagInterest[tag]);
      if (matchedTags.length > 0) {
        const totalTagScore = matchedTags.reduce(
          (sum, tag) => sum + (this.data.tagInterest[tag] || 0),
          0
        );
        score += Math.min(totalTagScore / 10, 1) * WEIGHTS.tagMatch;
      }
    }

    // 3. 난이도 적합성 (0.2)
    const difficultyDiff = Math.abs(quiz.difficulty - this.data.preferredDifficulty);
    score += (1 - difficultyDiff / 2) * WEIGHTS.difficultyFit;

    // 4. 신규 콘텐츠 보너스 (0.1) - 새 콘텐츠에 기회 부여
    if (!categoryData || categoryData.quizCount === 0) {
      score += WEIGHTS.freshness;
    }

    // 5. Kids 콘텐츠 부스트 (10대 사용자)
    const demographic = demographicService.getDemographic();
    const kidsBoost = getKidsBoostFactor(quiz, demographic?.ageGroup);
    score *= kidsBoost;

    return score;
  }

  /**
   * 투표 추천 점수 계산
   */
  getPollScore(poll: VSPoll): number {
    let score = 0;

    // 1. 카테고리 참여도 (0.4)
    const categoryData = this.data.categoryEngagement[poll.category];
    if (categoryData) {
      const engagement = categoryData.quizCount + categoryData.pollCount;
      score += Math.min(engagement / 10, 1) * WEIGHTS.categoryEngagement;
    }

    // 2. 태그 매칭 (0.3)
    if (poll.tags) {
      const matchedTags = poll.tags.filter(tag => this.data.tagInterest[tag]);
      if (matchedTags.length > 0) {
        const totalTagScore = matchedTags.reduce(
          (sum, tag) => sum + (this.data.tagInterest[tag] || 0),
          0
        );
        score += Math.min(totalTagScore / 10, 1) * WEIGHTS.tagMatch;
      }
    }

    // 3. 신규 콘텐츠 보너스 (0.1)
    if (!categoryData || categoryData.pollCount === 0) {
      score += WEIGHTS.freshness;
    }

    // 4. Kids 콘텐츠 부스트 (10대 사용자)
    const demographic = demographicService.getDemographic();
    const kidsBoost = getKidsBoostFactor(poll, demographic?.ageGroup);
    score *= kidsBoost;

    return score;
  }

  /**
   * 퀴즈 목록을 추천 순으로 정렬 (연령 제한 필터링 포함)
   *
   * 추천 로직 (Phase 1):
   * 1. 참여 이력 있으면 → 유사도 기반 추천
   * 2. 없으면 → 기존 태그/카테고리 참여도 기반
   */
  sortQuizzesByRecommendation(quizzes: KnowledgeQuiz[]): KnowledgeQuiz[] {
    const demographic = demographicService.getDemographic();
    const ageGroup = demographic?.ageGroup;

    // 1. 연령 제한 필터링 (카테고리 + 개별 콘텐츠 meta)
    const filtered = quizzes.filter(quiz =>
      demographicService.isCategoryAllowedForAge(quiz.category) &&
      isContentAllowedForAge(quiz, ageGroup)
    );

    // 2. 참여한 퀴즈 ID 목록
    const participatedIds = Object.keys(this.data.categoryEngagement).length > 0
      ? this.getParticipatedQuizIds()
      : [];

    // 3. 유사도 기반 추천 (참여 이력 있을 때)
    if (participatedIds.length > 0) {
      const recommended = contentRecommendationService.getRecommendedQuizzes(
        participatedIds,
        filtered,
        filtered.length
      );

      if (recommended.length > 0) {
        // 유사도 추천 + 나머지
        const recommendedIds = new Set(recommended.map(r => r.content.id));
        const remaining = filtered.filter(q => !recommendedIds.has(q.id));

        // 유사도 순 + 기존 점수 순
        return [
          ...recommended.map(r => r.content),
          ...remaining.sort((a, b) => this.getQuizScore(b) - this.getQuizScore(a))
        ];
      }
    }

    // 4. 기본: 기존 점수로 정렬
    return [...filtered].sort((a, b) => this.getQuizScore(b) - this.getQuizScore(a));
  }

  /**
   * 참여한 퀴즈 ID 목록 반환 (ContentParticipationService에서 가져오기)
   * 참고: 실제 ID는 localStorage에서 직접 로드
   */
  private getParticipatedQuizIds(): string[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONTENT_PARTICIPATION);
      if (stored) {
        const data = JSON.parse(stored);
        return (data.quizzes || []).map((q: { quizId: string }) => q.quizId);
      }
    } catch {
      // ignore
    }
    return [];
  }

  /**
   * 참여한 투표 ID 목록 반환
   */
  private getParticipatedPollIds(): string[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONTENT_PARTICIPATION);
      if (stored) {
        const data = JSON.parse(stored);
        return (data.polls || []).map((p: { pollId: string }) => p.pollId);
      }
    } catch {
      // ignore
    }
    return [];
  }

  /**
   * 투표 목록을 추천 순으로 정렬 (연령 제한 필터링 포함)
   *
   * 추천 로직 (Phase 1):
   * 1. 참여 이력 있으면 → 유사도 기반 추천
   * 2. 없으면 → 기존 태그/카테고리 참여도 기반
   */
  sortPollsByRecommendation(polls: VSPoll[]): VSPoll[] {
    const demographic = demographicService.getDemographic();
    const ageGroup = demographic?.ageGroup;

    // 1. 연령 제한 필터링 (카테고리 + 개별 콘텐츠 meta)
    const filtered = polls.filter(poll =>
      demographicService.isCategoryAllowedForAge(poll.category) &&
      isContentAllowedForAge(poll, ageGroup)
    );

    // 2. 참여한 투표 ID 목록
    const participatedIds = Object.keys(this.data.categoryEngagement).length > 0
      ? this.getParticipatedPollIds()
      : [];

    // 3. 유사도 기반 추천 (참여 이력 있을 때)
    if (participatedIds.length > 0) {
      const recommended = contentRecommendationService.getRecommendedPolls(
        participatedIds,
        filtered,
        filtered.length
      );

      if (recommended.length > 0) {
        // 유사도 추천 + 나머지
        const recommendedIds = new Set(recommended.map(r => r.content.id));
        const remaining = filtered.filter(p => !recommendedIds.has(p.id));

        // 유사도 순 + 기존 점수 순
        return [
          ...recommended.map(r => r.content),
          ...remaining.sort((a, b) => this.getPollScore(b) - this.getPollScore(a))
        ];
      }
    }

    // 4. 기본: 기존 점수로 정렬
    return [...filtered].sort((a, b) => this.getPollScore(b) - this.getPollScore(a));
  }

  /**
   * 상위 N개 관심 카테고리 반환
   */
  getTopCategories(limit: number = 3): ContentCategory[] {
    const entries = Object.entries(this.data.categoryEngagement);
    if (entries.length === 0) return [];

    return entries
      .sort((a, b) => {
        const scoreA = a[1].quizCount + a[1].pollCount;
        const scoreB = b[1].quizCount + b[1].pollCount;
        return scoreB - scoreA;
      })
      .slice(0, limit)
      .map(([category]) => category as ContentCategory);
  }

  /**
   * 상위 N개 관심 태그 반환
   */
  getTopTags(limit: number = 5): string[] {
    const entries = Object.entries(this.data.tagInterest);
    if (entries.length === 0) return [];

    return entries
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag]) => tag);
  }

  /**
   * 전체 선호도 데이터 반환
   */
  getPreferences(): UserPreferenceData {
    return { ...this.data };
  }

  /**
   * 데이터 리로드 (다른 탭에서 변경 시)
   */
  reload(): void {
    this.data = this.loadFromStorage();
  }
}

// 싱글톤 인스턴스
export const userPreferenceService = new UserPreferenceServiceClass();

export default userPreferenceService;
