// ============================================================================
// InsightService - 인사이트 분석 서비스
// ============================================================================
// 역할:
// 1. 사용자 활동 데이터 집계
// 2. 태그 기반 성향 분석
// 3. 단계별 인사이트 해금 체크
// 4. 인사이트 생성 (Stage 1-6)

import { resultService } from './ResultService';
import { eventBus } from './EventBus';
import {
  extractTagsFromTestResult,
  isRelationshipTest,
  getDimensionQuestionCounts,
} from '@/data/insight/test-tag-mappings';
import { CHEMI_DATA } from '@/data';
import { INSIGHT_UNLOCK } from '@/data/gamification/points';
import { VALID_INSIGHT_TAGS, getInterestTagFromCategory } from '@/data/insight/insight-tags';
import { matchStage2Rules, type Stage2Rule } from '@/data/insight/stage2-rules';
import {
  generateDecisionStyleResult,
  type DecisionStyleResult,
} from '@/data/insight/stage3-decision-style';
import {
  generateInterestMapResult,
  type InterestMapResult,
} from '@/data/insight/stage4-interest-map';
import type { UserActivityEvent } from '@/types/events';

// ============================================================================
// 타입 정의
// ============================================================================

/** 사용자 활동 통계 */
export interface UserActivityStats {
  testCount: number;
  quizCount: number;
  pollCount: number;
  totalActivities: number;
  relationshipActivities: number;
}

/** 태그 집계 결과 */
export interface TagAggregation {
  tag: string;
  count: number;
  percentage: number;
}

/** 해금된 스테이지 정보 */
export interface UnlockedStage {
  stage: number;
  unlockedAt: string;
}

/** Stage 1 인사이트: 기본 성향 */
export interface Stage1Insight {
  stage: 1;
  title: string;
  testResults: Array<{
    testId: string;
    resultName: string;
    dimensions: Record<string, { score: number; level: 'high' | 'medium' | 'low' }>;
    tags: string[];
  }>;
  dominantTags: TagAggregation[];
  generatedAt: string;
}

/** 전체 인사이트 타입 */
export type Insight = Stage1Insight; // Stage 2-6 추가 예정

// ============================================================================
// 로컬 스토리지 키
// ============================================================================

const STORAGE_KEYS = {
  ACTIVITY_STATS: 'chemi_insight_activity_stats',
  TAG_COUNTS: 'chemi_insight_tag_counts',
  UNLOCKED_STAGES: 'chemi_insight_unlocked_stages',
  CACHED_INSIGHTS: 'chemi_insight_cache',
};

// ============================================================================
// InsightService 클래스
// ============================================================================

class InsightServiceClass {
  private initialized = false;

  constructor() {
    // 브라우저 환경에서만 초기화
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  /**
   * 서비스 초기화 - EventBus 구독
   */
  private initialize(): void {
    if (this.initialized) return;

    // 테스트 완료 이벤트 구독
    eventBus.subscribeToActivity('test_complete', this.handleTestComplete.bind(this));

    // 퀴즈/투표 이벤트 구독
    eventBus.subscribeToActivity('quiz_solve', this.handleQuizOrPoll.bind(this));
    eventBus.subscribeToActivity('poll_vote', this.handleQuizOrPoll.bind(this));

    this.initialized = true;
    console.log('[InsightService] Initialized and subscribed to events');
  }

  // ========================================================================
  // 이벤트 핸들러
  // ========================================================================

  /**
   * 테스트 완료 이벤트 처리
   */
  private async handleTestComplete(event: UserActivityEvent): Promise<void> {
    const { contentId: testId, testResult, dimensions, tags } = event.payload;

    // 활동 통계 업데이트
    this.incrementActivityStat('testCount');

    // 관계 테스트인 경우 관계 활동 카운트
    if (isRelationshipTest(testId)) {
      this.incrementActivityStat('relationshipActivities');
    }

    // 태그 집계
    if (tags && tags.length > 0) {
      this.addTags(tags);
    }

    // 테스트 결과에서 추가 태그 추출
    if (dimensions) {
      // CHEMI_DATA에서 실제 질문 수를 기반으로 dimCounts 계산
      const testData = CHEMI_DATA[testId as keyof typeof CHEMI_DATA];
      const dimCounts = testData?.questions
        ? getDimensionQuestionCounts(testData.questions)
        : undefined;
      const extractedTags = extractTagsFromTestResult(testId, dimensions, dimCounts);
      if (extractedTags.length > 0) {
        this.addTags(extractedTags);
      }
    }

    // 해금 체크
    await this.checkAndUnlockStages();

    console.log(`[InsightService] Test completed: ${testId}, result: ${testResult}`);
  }

  /**
   * 퀴즈/투표 이벤트 처리
   */
  private async handleQuizOrPoll(event: UserActivityEvent): Promise<void> {
    const { tags, category } = event.payload;
    const isQuiz = event.activityType === 'quiz_solve';

    // 활동 통계 업데이트
    this.incrementActivityStat(isQuiz ? 'quizCount' : 'pollCount');

    // 태그 집계 (Set으로 중복 제거)
    const tagSet = new Set<string>();

    // 1. 명시적 태그 추가
    if (tags && tags.length > 0) {
      tags.forEach(tag => tagSet.add(tag));
    }

    // 2. 카테고리 기반 관심사 태그 자동 추가 (Stage 4 관심사 지도용)
    //    예: category='cat' → 'interest-cat' 자동 추가
    if (category) {
      const interestTag = getInterestTagFromCategory(category);
      if (interestTag) {
        tagSet.add(interestTag);
      }
    }

    // 모든 태그 저장 (중복 제거됨)
    if (tagSet.size > 0) {
      this.addTags(Array.from(tagSet));
    }

    // 해금 체크
    await this.checkAndUnlockStages();
  }

  // ========================================================================
  // 활동 통계 관리
  // ========================================================================

  /**
   * 활동 통계 조회
   */
  getActivityStats(): UserActivityStats {
    if (typeof window === 'undefined') {
      return this.getDefaultStats();
    }

    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITY_STATS);
    if (!stored) {
      return this.getDefaultStats();
    }

    try {
      return JSON.parse(stored);
    } catch {
      return this.getDefaultStats();
    }
  }

  /**
   * 기본 통계 값
   */
  private getDefaultStats(): UserActivityStats {
    return {
      testCount: 0,
      quizCount: 0,
      pollCount: 0,
      totalActivities: 0,
      relationshipActivities: 0,
    };
  }

  /**
   * 활동 통계 증가
   * @param key 증가할 통계 키
   * @param countAsActivity totalActivities도 함께 증가할지 (기본: true)
   */
  private incrementActivityStat(
    key: keyof UserActivityStats,
    countAsActivity: boolean = true
  ): void {
    if (typeof window === 'undefined') return;

    const stats = this.getActivityStats();
    stats[key]++;

    // totalActivities는 실제 활동 1회당 1번만 증가
    // relationshipActivities는 추가 분류이므로 totalActivities 증가하지 않음
    if (countAsActivity && key !== 'relationshipActivities') {
      stats.totalActivities++;
    }

    localStorage.setItem(STORAGE_KEYS.ACTIVITY_STATS, JSON.stringify(stats));
  }

  // ========================================================================
  // 태그 집계
  // ========================================================================

  /**
   * 태그 카운트 조회
   */
  getTagCounts(): Record<string, number> {
    if (typeof window === 'undefined') return {};

    const stored = localStorage.getItem(STORAGE_KEYS.TAG_COUNTS);
    if (!stored) return {};

    try {
      return JSON.parse(stored);
    } catch {
      return {};
    }
  }

  /**
   * 태그 추가 (유효한 인사이트 태그만 저장)
   */
  private addTags(tags: string[]): void {
    if (typeof window === 'undefined') return;

    const counts = this.getTagCounts();

    for (const tag of tags) {
      // 유효한 인사이트 태그만 저장 (category, testId 등 제외)
      if (VALID_INSIGHT_TAGS.has(tag)) {
        counts[tag] = (counts[tag] || 0) + 1;
      }
    }

    localStorage.setItem(STORAGE_KEYS.TAG_COUNTS, JSON.stringify(counts));
  }

  /**
   * 상위 태그 조회
   */
  getTopTags(limit: number = 10): TagAggregation[] {
    const counts = this.getTagCounts();
    const total = Object.values(counts).reduce((sum, c) => sum + c, 0);

    if (total === 0) return [];

    return Object.entries(counts)
      .map(([tag, count]) => ({
        tag,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  // ========================================================================
  // 스테이지 해금
  // ========================================================================

  /**
   * 해금된 스테이지 조회
   */
  getUnlockedStages(): UnlockedStage[] {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(STORAGE_KEYS.UNLOCKED_STAGES);
    if (!stored) return [];

    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  /**
   * 특정 스테이지 해금 여부
   */
  isStageUnlocked(stage: number): boolean {
    const unlocked = this.getUnlockedStages();
    return unlocked.some(s => s.stage === stage);
  }

  /**
   * 스테이지 해금 체크 및 업데이트
   */
  private async checkAndUnlockStages(): Promise<void> {
    const stats = this.getActivityStats();
    const unlocked = this.getUnlockedStages();
    const now = new Date().toISOString();

    const newUnlocks: UnlockedStage[] = [];

    // Stage 1: 테스트 1개
    if (!this.isStageUnlocked(1) && stats.testCount >= INSIGHT_UNLOCK.STAGE_1.tests) {
      newUnlocks.push({ stage: 1, unlockedAt: now });
    }

    // Stage 2: 테스트 3개
    if (!this.isStageUnlocked(2) && stats.testCount >= INSIGHT_UNLOCK.STAGE_2.tests) {
      newUnlocks.push({ stage: 2, unlockedAt: now });
    }

    // Stage 3: 투표 10개
    if (!this.isStageUnlocked(3) && stats.pollCount >= INSIGHT_UNLOCK.STAGE_3.polls) {
      newUnlocks.push({ stage: 3, unlockedAt: now });
    }

    // Stage 4: 총 활동 15개
    if (!this.isStageUnlocked(4) && stats.totalActivities >= INSIGHT_UNLOCK.STAGE_4.activities) {
      newUnlocks.push({ stage: 4, unlockedAt: now });
    }

    // Stage 5: 관계 활동 10개
    if (!this.isStageUnlocked(5) && stats.relationshipActivities >= INSIGHT_UNLOCK.STAGE_5.relationshipActivities) {
      newUnlocks.push({ stage: 5, unlockedAt: now });
    }

    // Stage 6: 총 활동 30개
    if (!this.isStageUnlocked(6) && stats.totalActivities >= INSIGHT_UNLOCK.STAGE_6.activities) {
      newUnlocks.push({ stage: 6, unlockedAt: now });
    }

    // 새 해금이 있으면 저장
    if (newUnlocks.length > 0) {
      const updated = [...unlocked, ...newUnlocks];
      localStorage.setItem(STORAGE_KEYS.UNLOCKED_STAGES, JSON.stringify(updated));

      for (const unlock of newUnlocks) {
        console.log(`[InsightService] Stage ${unlock.stage} unlocked!`);
      }
    }
  }

  // ========================================================================
  // Stage 1: 기본 성향 인사이트
  // ========================================================================

  /**
   * Stage 1 인사이트 생성
   */
  async getStage1Insight(): Promise<Stage1Insight | null> {
    if (!this.isStageUnlocked(1)) {
      return null;
    }

    // ResultService에서 테스트 결과 조회
    const testResults = await resultService.getMyResults();

    if (testResults.length === 0) {
      return null;
    }

    // 결과 변환
    const formattedResults = testResults.map(result => {
      const dimensions: Record<string, { score: number; level: 'high' | 'medium' | 'low' }> = {};

      // 테스트 데이터에서 차원별 질문 수 계산
      const testData = CHEMI_DATA[result.testType as keyof typeof CHEMI_DATA];
      const dimCounts = testData?.questions
        ? getDimensionQuestionCounts(testData.questions)
        : undefined;

      if (result.scores) {
        for (const [key, score] of Object.entries(result.scores)) {
          // 차원별 질문 수 기반 동적 계산
          const dimQuestionCount = dimCounts?.[key] ?? 3; // 폴백: 기본 3문항
          const dimMaxScore = dimQuestionCount * 5;
          const scorePercent = (score / dimMaxScore) * 100;

          let level: 'high' | 'medium' | 'low' = 'medium';
          if (scorePercent >= 60) level = 'high';
          else if (scorePercent < 40) level = 'low';

          dimensions[key] = { score, level };
        }
      }

      const tags = result.scores
        ? extractTagsFromTestResult(result.testType, result.scores, dimCounts)
        : [];

      return {
        testId: result.testType,
        resultName: result.resultKey,
        dimensions,
        tags,
      };
    });

    // 상위 태그 추출
    const dominantTags = this.getTopTags(5);

    return {
      stage: 1,
      title: '기본 성향',
      testResults: formattedResults,
      dominantTags,
      generatedAt: new Date().toISOString(),
    };
  }

  // ========================================================================
  // 진행률 계산
  // ========================================================================

  /**
   * 다음 스테이지까지 진행률
   */
  getProgressToNextStage(): {
    currentStage: number;
    nextStage: number;
    progress: number;
    remaining: string;
  } | null {
    const stats = this.getActivityStats();
    const unlockedStages = this.getUnlockedStages();
    const maxUnlocked = Math.max(0, ...unlockedStages.map(s => s.stage));

    // Stage 1 미해금
    if (maxUnlocked === 0) {
      return {
        currentStage: 0,
        nextStage: 1,
        progress: Math.min(100, (stats.testCount / INSIGHT_UNLOCK.STAGE_1.tests) * 100),
        remaining: `테스트 ${INSIGHT_UNLOCK.STAGE_1.tests - stats.testCount}개 더`,
      };
    }

    // Stage 2
    if (maxUnlocked === 1) {
      const needed = INSIGHT_UNLOCK.STAGE_2.tests;
      return {
        currentStage: 1,
        nextStage: 2,
        progress: Math.min(100, (stats.testCount / needed) * 100),
        remaining: `테스트 ${needed - stats.testCount}개 더`,
      };
    }

    // Stage 3
    if (maxUnlocked === 2) {
      const needed = INSIGHT_UNLOCK.STAGE_3.polls;
      return {
        currentStage: 2,
        nextStage: 3,
        progress: Math.min(100, (stats.pollCount / needed) * 100),
        remaining: `투표 ${needed - stats.pollCount}개 더`,
      };
    }

    // Stage 4
    if (maxUnlocked === 3) {
      const needed = INSIGHT_UNLOCK.STAGE_4.activities;
      return {
        currentStage: 3,
        nextStage: 4,
        progress: Math.min(100, (stats.totalActivities / needed) * 100),
        remaining: `활동 ${needed - stats.totalActivities}개 더`,
      };
    }

    // Stage 5
    if (maxUnlocked === 4) {
      const needed = INSIGHT_UNLOCK.STAGE_5.relationshipActivities;
      return {
        currentStage: 4,
        nextStage: 5,
        progress: Math.min(100, (stats.relationshipActivities / needed) * 100),
        remaining: `관계 활동 ${needed - stats.relationshipActivities}개 더`,
      };
    }

    // Stage 6
    if (maxUnlocked === 5) {
      const needed = INSIGHT_UNLOCK.STAGE_6.activities;
      return {
        currentStage: 5,
        nextStage: 6,
        progress: Math.min(100, (stats.totalActivities / needed) * 100),
        remaining: `활동 ${needed - stats.totalActivities}개 더`,
      };
    }

    // Stage 6 해금됨 (Stage 7은 유료)
    return null;
  }

  // ========================================================================
  // Stage 2: 성격 조합 인사이트
  // ========================================================================

  /**
   * Stage 2 인사이트 생성 - 성격 조합 룰 매칭
   * @param limit 반환할 최대 룰 수 (기본 5)
   */
  getStage2Insight(limit: number = 5): Stage2Rule[] | null {
    if (!this.isStageUnlocked(2)) {
      return null;
    }

    const tagCounts = this.getTagCounts();
    const userTags = Object.keys(tagCounts);

    if (userTags.length === 0) {
      return null;
    }

    return matchStage2Rules(userTags, limit);
  }

  // ========================================================================
  // Stage 3: 판단 스타일 인사이트
  // ========================================================================

  /**
   * Stage 3 인사이트 생성 - 판단 스타일 분석
   */
  getStage3Insight(): DecisionStyleResult | null {
    if (!this.isStageUnlocked(3)) {
      return null;
    }

    const tagCounts = this.getTagCounts();

    // 의사결정 관련 태그가 있는지 확인
    const decisionTags = [
      'practical', 'sentimental', 'adventurous', 'safe', 'cautious',
      'solo', 'together', 'direct', 'indirect',
    ];
    const hasDecisionTags = decisionTags.some(tag => tagCounts[tag] > 0);

    if (!hasDecisionTags) {
      return null;
    }

    return generateDecisionStyleResult(tagCounts);
  }

  // ========================================================================
  // Stage 4: 관심사 지도 인사이트
  // ========================================================================

  /**
   * Stage 4 인사이트 생성 - 관심사 지도
   */
  getStage4Insight(): InterestMapResult | null {
    if (!this.isStageUnlocked(4)) {
      return null;
    }

    const tagCounts = this.getTagCounts();
    const stats = this.getActivityStats();

    // interest- 태그가 있는지 확인
    const hasInterestTags = Object.keys(tagCounts).some(tag => tag.startsWith('interest-'));

    if (!hasInterestTags) {
      return null;
    }

    return generateInterestMapResult(tagCounts, stats.totalActivities);
  }

  // ========================================================================
  // 리셋 (테스트용)
  // ========================================================================

  /**
   * 모든 인사이트 데이터 초기화
   */
  reset(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(STORAGE_KEYS.ACTIVITY_STATS);
    localStorage.removeItem(STORAGE_KEYS.TAG_COUNTS);
    localStorage.removeItem(STORAGE_KEYS.UNLOCKED_STAGES);
    localStorage.removeItem(STORAGE_KEYS.CACHED_INSIGHTS);

    console.log('[InsightService] Reset complete');
  }
}

// ============================================================================
// 싱글톤 인스턴스
// ============================================================================

export const insightService = new InsightServiceClass();
