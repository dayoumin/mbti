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
import { storage } from '@/utils';
import {
  extractTagsFromTestResult,
  isRelationshipTest,
  getDimensionQuestionCounts,
} from '@/data/insight/test-tag-mappings';
import { CHEMI_DATA } from '@/data';
import { INSIGHT_UNLOCK } from '@/data/gamification/points';
import {
  VALID_INSIGHT_TAGS,
  getInterestTagFromCategory,
  DECISION_TAGS,
  RELATIONSHIP_TAGS,
  getTagCategory as getTagCategoryFromSSOT,
  type InsightTag,
} from '@/data/insight/insight-tags';
import { matchStage2Rules, type Stage2Rule } from '@/data/insight/stage2-rules';
import {
  generateDecisionStyleResult,
  type DecisionStyleResult,
} from '@/data/insight/stage3-decision-style';
import {
  generateInterestMapResult,
  type InterestMapResult,
} from '@/data/insight/stage4-interest-map';
import {
  generateRelationshipPatternResult,
  type RelationshipPatternResult,
} from '@/data/insight/stage5-relationship-pattern';
import {
  generateHiddenPatternResult,
  type HiddenPatternResult,
} from '@/data/insight/stage6-hidden-pattern';
import {
  generateFallbackReport,
  summarizeStage2Rules,
  summarizeStage3Result,
  summarizeStage4Result,
  summarizeStage5Result,
  summarizeStage6Result,
  type AIAnalysisInput,
  type AIAnalysisResult,
} from '@/data/insight/stage7-ai-analysis';
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
// Stage 설정 (팩토리 패턴)
// ============================================================================

interface StageConfig<T> {
  requiredTags?: (tagCounts: Record<string, number>) => boolean;
  generator: (tagCounts: Record<string, number>, stats?: UserActivityStats) => T;
}

/**
 * Stage별 설정
 *
 * Stage 추가 시 수정 포인트:
 * 1. 여기에 설정 추가 (satisfies StageConfig<반환타입>으로 타입 보장)
 * 2. getStageInsight<T> union 타입에 stage 번호 추가
 * 3. getStageNInsight() wrapper 메서드 작성
 */
const STAGE_CONFIGS = {
  2: {
    requiredTags: (tagCounts) => Object.keys(tagCounts).length > 0,
    generator: (tagCounts) => matchStage2Rules(Object.keys(tagCounts), 5),
  } satisfies StageConfig<Stage2Rule[]>,

  3: {
    requiredTags: (tagCounts) => DECISION_TAGS.some(tag => tagCounts[tag] > 0),
    generator: (tagCounts) => generateDecisionStyleResult(tagCounts),
  } satisfies StageConfig<DecisionStyleResult>,

  4: {
    requiredTags: (tagCounts) => Object.keys(tagCounts).some(tag => tag.startsWith('interest-')),
    generator: (tagCounts, stats) => generateInterestMapResult(tagCounts, stats?.totalActivities || 0),
  } satisfies StageConfig<InterestMapResult>,

  5: {
    requiredTags: (tagCounts) => RELATIONSHIP_TAGS.some(tag => tagCounts[tag] > 0),
    generator: (tagCounts) => generateRelationshipPatternResult(tagCounts),
  } satisfies StageConfig<RelationshipPatternResult>,

  6: {
    requiredTags: (tagCounts) => Object.values(tagCounts).reduce((sum, count) => sum + count, 0) >= 10,
    generator: (tagCounts) => generateHiddenPatternResult(tagCounts),
  } satisfies StageConfig<HiddenPatternResult>,
} as const;

// ============================================================================
// 진행률 설정
// ============================================================================

interface ProgressConfig {
  stage: number;
  statKey: keyof UserActivityStats;
  label: string;
  requirement: number;
}

const PROGRESS_CONFIGS: ProgressConfig[] = [
  { stage: 1, statKey: 'testCount', label: '테스트', requirement: INSIGHT_UNLOCK.STAGE_1.tests },
  { stage: 2, statKey: 'testCount', label: '테스트', requirement: INSIGHT_UNLOCK.STAGE_2.tests },
  { stage: 3, statKey: 'pollCount', label: '투표', requirement: INSIGHT_UNLOCK.STAGE_3.polls },
  { stage: 4, statKey: 'totalActivities', label: '활동', requirement: INSIGHT_UNLOCK.STAGE_4.activities },
  { stage: 5, statKey: 'relationshipActivities', label: '관계 활동', requirement: INSIGHT_UNLOCK.STAGE_5.relationshipActivities },
  { stage: 6, statKey: 'totalActivities', label: '활동', requirement: INSIGHT_UNLOCK.STAGE_6.activities },
];

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
   * 서비스 초기화 - EventBus 구독 + unlock 동기화
   */
  private initialize(): void {
    if (this.initialized) return;

    // 테스트 완료 이벤트 구독
    eventBus.subscribeToActivity('test_complete', this.handleTestComplete.bind(this));

    // 퀴즈/투표 이벤트 구독
    eventBus.subscribeToActivity('quiz_solve', this.handleQuizOrPoll.bind(this));
    eventBus.subscribeToActivity('poll_vote', this.handleQuizOrPoll.bind(this));

    this.initialized = true;

    // 앱 로드 시 unlock 상태 동기화
    // (localStorage 복원, 마이그레이션, 멀티 디바이스 등으로 stats와 unlock이 불일치할 수 있음)
    this.syncUnlocksOnLoad();

    console.log('[InsightService] Initialized and subscribed to events');
  }

  /**
   * 앱 로드 시 unlock 상태 동기화
   *
   * 목적: Turso 결과 기반으로 stats 재계산 후 unlock 체크
   * 시나리오:
   * - localStorage 복원 (다른 기기에서 활동)
   * - Supabase 마이그레이션 (서버 → 로컬)
   * - 멀티 디바이스 (기기 A에서 활동 → 기기 B 로드)
   *
   * 프로세스:
   * 1. Turso에서 실제 결과 조회
   * 2. localStorage stats와 비교
   * 3. 불일치 시 stats 재계산
   * 4. unlock 체크
   */
  private async syncUnlocksOnLoad(): Promise<void> {
    try {
      await this.syncStatsFromTurso();
      await this.checkAndUnlockStages();
      console.log('[InsightService] Unlock sync completed');
    } catch (error) {
      console.error('[InsightService] Unlock sync failed:', error);
    }
  }

  /**
   * Turso 결과 기반 stats 동기화
   *
   * localStorage stats가 실제 Turso 데이터와 불일치할 경우 재계산
   */
  private async syncStatsFromTurso(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      // Turso에서 실제 결과 조회
      const results = await resultService.getMyResults();

      // 현재 localStorage stats
      const currentStats = this.getActivityStats();

      // Turso 기반 실제 카운트 계산 (빈 문자열 제외)
      const actualTestCount = results.filter(r => r.testType && r.testType.trim()).length;

      // testCount 불일치 감지
      if (currentStats.testCount !== actualTestCount) {
        console.log(
          `[InsightService] Stats sync: testCount mismatch (local: ${currentStats.testCount}, turso: ${actualTestCount})`
        );

        // stats 재계산 (testCount만 동기화, 나머지는 이벤트 기반 유지)
        currentStats.testCount = actualTestCount;

        // totalActivities도 최소값 보장
        if (currentStats.totalActivities < actualTestCount) {
          currentStats.totalActivities = actualTestCount;
        }

        storage.set(STORAGE_KEYS.ACTIVITY_STATS, currentStats);
        console.log('[InsightService] Stats synchronized from Turso');
      }
    } catch (error) {
      console.error('[InsightService] Turso sync failed:', error);
      // 동기화 실패해도 기존 로직 계속 진행 (degraded mode)
    }
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

    return storage.get<UserActivityStats>(STORAGE_KEYS.ACTIVITY_STATS, this.getDefaultStats());
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

    storage.set(STORAGE_KEYS.ACTIVITY_STATS, stats);
  }

  // ========================================================================
  // 태그 집계
  // ========================================================================

  /**
   * 태그 카운트 조회
   */
  getTagCounts(): Record<string, number> {
    if (typeof window === 'undefined') return {};

    return storage.get<Record<string, number>>(STORAGE_KEYS.TAG_COUNTS, {});
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

    storage.set(STORAGE_KEYS.TAG_COUNTS, counts);
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

    return storage.get<UnlockedStage[]>(STORAGE_KEYS.UNLOCKED_STAGES, []);
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
      storage.set(STORAGE_KEYS.UNLOCKED_STAGES, updated);

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

    // 테스트 결과에서 추출한 태그만 집계 (퀴즈/투표 태그 제외)
    // Stage 1은 "기본 성향"으로 테스트 기반 분석
    const testTagCounts: Record<string, number> = {};
    for (const result of formattedResults) {
      for (const tag of result.tags) {
        testTagCounts[tag] = (testTagCounts[tag] || 0) + 1;
      }
    }

    const total = Object.values(testTagCounts).reduce((sum, c) => sum + c, 0);
    const dominantTags = Object.entries(testTagCounts)
      .map(([tag, count]) => ({
        tag,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

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
   * remaining 메시지 생성 (음수 방지)
   */
  private formatRemaining(label: string, needed: number, current: number): string {
    const diff = needed - current;
    if (diff <= 0) {
      return '완료!';
    }
    return `${label} ${diff}개 더`;
  }

  /**
   * 다음 스테이지까지 진행률
   *
   * 비순차 해금 지원:
   * - 각 Stage는 독립적 조건으로 해금 가능
   * - 진행률은 미해금 Stage 중 가장 낮은 번호 우선 표시
   * - 예: Stage 2 미해금, Stage 3 해금 시 → Stage 2 진행률 표시
   */
  getProgressToNextStage(): {
    currentStage: number;
    nextStage: number;
    progress: number;
    remaining: string;
  } | null {
    const stats = this.getActivityStats();
    const unlockedStages = this.getUnlockedStages();
    const unlockedSet = new Set(unlockedStages.map(s => s.stage));

    // Stage 1-6 중 미해금된 Stage 찾기 (낮은 번호 우선)
    for (let stage = 1; stage <= 6; stage++) {
      if (!unlockedSet.has(stage)) {
        const config = PROGRESS_CONFIGS.find(c => c.stage === stage);
        if (!config) continue;

        const currentValue = stats[config.statKey];
        const needed = config.requirement;

        // 직전 해금된 Stage 찾기 (currentStage용)
        let currentStage = 0;
        for (let prev = stage - 1; prev >= 0; prev--) {
          if (unlockedSet.has(prev)) {
            currentStage = prev;
            break;
          }
        }

        return {
          currentStage,
          nextStage: stage,
          progress: Math.min(100, (currentValue / needed) * 100),
          remaining: this.formatRemaining(config.label, needed, currentValue),
        };
      }
    }

    // 모든 Stage 해금됨 (Stage 7은 유료)
    return null;
  }

  // ========================================================================
  // Stage 2-6: 통합 인사이트 생성 (팩토리 패턴)
  // ========================================================================

  /**
   * Stage별 인사이트 생성 (통합 메서드)
   * @param stage Stage 번호 (2-6)
   */
  private getStageInsight<T>(stage: 2 | 3 | 4 | 5 | 6): T | null {
    if (!this.isStageUnlocked(stage)) {
      return null;
    }

    // STAGE_CONFIGS[stage]는 항상 존재 (stage가 2-6 리터럴이므로)
    const config = STAGE_CONFIGS[stage];

    const tagCounts = this.getTagCounts();

    // 필수 태그 검증
    if (config.requiredTags && !config.requiredTags(tagCounts)) {
      return null;
    }

    // Stage 4는 stats 필요
    const stats = stage === 4 ? this.getActivityStats() : undefined;

    return config.generator(tagCounts, stats) as T;
  }

  /**
   * Stage 2 인사이트 생성 - 성격 조합 룰 매칭
   */
  getStage2Insight(): Stage2Rule[] | null {
    return this.getStageInsight<Stage2Rule[]>(2);
  }

  /**
   * Stage 3 인사이트 생성 - 판단 스타일 분석
   */
  getStage3Insight(): DecisionStyleResult | null {
    return this.getStageInsight<DecisionStyleResult>(3);
  }

  /**
   * Stage 4 인사이트 생성 - 관심사 지도
   */
  getStage4Insight(): InterestMapResult | null {
    return this.getStageInsight<InterestMapResult>(4);
  }

  /**
   * Stage 5 인사이트 생성 - 관계 패턴 분석
   */
  getStage5Insight(): RelationshipPatternResult | null {
    return this.getStageInsight<RelationshipPatternResult>(5);
  }

  /**
   * Stage 6 인사이트 생성 - 숨은 패턴 분석
   */
  getStage6Insight(): HiddenPatternResult | null {
    return this.getStageInsight<HiddenPatternResult>(6);
  }

  // ========================================================================
  // Stage 7: AI 종합 분석
  // ========================================================================

  /**
   * Stage 7 인사이트 생성 - AI 종합 분석
   * Stage 6 해금 필요 (유료 체크는 별도)
   *
   * @param useAI - true: API Route 호출, false: 폴백 리포트 사용 (기본값: true)
   */
  async getStage7Insight(useAI = true): Promise<AIAnalysisResult | null> {
    if (!this.isStageUnlocked(6)) {
      return null;
    }

    // AI 분석용 입력 데이터 수집
    const input = await this.buildAIAnalysisInput();

    // 명시적으로 폴백 요청 시
    if (!useAI) {
      return generateFallbackReport(input);
    }

    // API Route 호출 (서버에서 안전하게 OpenAI API 호출)
    try {
      const response = await fetch('/api/insight/ai-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        console.warn('[InsightService] API Route 실패, 폴백 사용');
        return generateFallbackReport(input);
      }

      const data = await response.json();

      // 응답 구조 검증 (타입 안전성 확보)
      if (!data || typeof data !== 'object' || !data.analysis || !data.nextSteps) {
        console.warn('[InsightService] Invalid response shape, 폴백 사용');
        return generateFallbackReport(input);
      }

      return data;
    } catch (error) {
      console.error('[InsightService] getStage7Insight error:', error);
      // 에러 시 폴백 리포트 반환
      return generateFallbackReport(input);
    }
  }

  /**
   * AI 분석용 입력 데이터 빌드
   */
  private async buildAIAnalysisInput(): Promise<AIAnalysisInput> {
    return {
      activitySummary: this.buildActivitySummary(),
      insights: await this.collectAllStageInsights(),
      tagDistribution: this.buildTagDistribution(),
    };
  }

  /**
   * 활동 통계 요약 생성
   */
  private buildActivitySummary() {
    const stats = this.getActivityStats();
    return {
      totalTests: stats.testCount,
      totalPolls: stats.pollCount,
      totalQuizzes: stats.quizCount,
      totalActivities: stats.totalActivities,
      activeDays: 1, // TODO: 실제 활동 일수 추적
    };
  }

  /**
   * 태그 분포 계산
   */
  private buildTagDistribution() {
    const tagCounts = this.getTagCounts();
    const totalTags = Object.values(tagCounts).reduce((sum, count) => sum + count, 0);

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({
        tag,
        count,
        percentage: totalTags > 0 ? Math.round((count / totalTags) * 100) : 0,
        category: this.getTagCategory(tag),
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Stage 1-6 인사이트 수집 및 요약
   */
  private async collectAllStageInsights() {
    return {
      stage1: await this.buildStage1Summary(),
      stage2: this.summarizeStage(this.getStage2Insight(), summarizeStage2Rules),
      stage3: this.summarizeStage(this.getStage3Insight(), summarizeStage3Result),
      stage4: this.summarizeStage(this.getStage4Insight(), summarizeStage4Result),
      stage5: this.summarizeStage(this.getStage5Insight(), summarizeStage5Result),
      stage6: this.summarizeStage(this.getStage6Insight(), summarizeStage6Result),
    };
  }

  /**
   * Stage 1 요약 생성 (테스트 기반 태그만)
   *
   * Turso 결과 기반으로 생성 (stats는 참고만, 실제 데이터는 Turso)
   */
  private async buildStage1Summary() {
    // Turso에서 실제 결과 조회
    const testResults = await resultService.getMyResults();

    // testType 필터링 (syncStatsFromTurso()와 동일한 기준 적용)
    const validTestResults = testResults.filter(r => r.testType && r.testType.trim());

    // 실제 테스트 결과가 없으면 null
    if (validTestResults.length === 0) {
      return null;
    }

    const testTagCounts: Record<string, number> = {};

    for (const result of validTestResults) {
      if (result.scores && result.testType) {
        const testData = CHEMI_DATA[result.testType as keyof typeof CHEMI_DATA];
        if (testData) {
          const dimCounts = testData.questions
            ? getDimensionQuestionCounts(testData.questions)
            : undefined;
          const extractedTags = extractTagsFromTestResult(
            result.testType,
            result.scores,
            dimCounts
          );
          for (const tag of extractedTags) {
            if (VALID_INSIGHT_TAGS.has(tag)) {
              testTagCounts[tag] = (testTagCounts[tag] || 0) + 1;
            }
          }
        }
      }
    }

    const testDominantTags = Object.entries(testTagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([tag]) => tag);

    return {
      testCount: validTestResults.length, // 필터링된 결과 개수 사용 (syncStatsFromTurso()와 일치)
      dominantTags: testDominantTags.length > 0
        ? testDominantTags
        : this.buildTagDistribution().slice(0, 3).map(t => t.tag),
    };
  }

  /**
   * Stage별 인사이트 요약 (null 처리 통합)
   */
  private summarizeStage<T, R>(
    insight: T | null,
    summarizeFn: (insight: T) => R
  ): R | null {
    return insight ? summarizeFn(insight) : null;
  }

  /**
   * 태그 카테고리 판별 (SSOT: insight-tags.ts 사용)
   */
  private getTagCategory(tag: string): 'personality' | 'decision' | 'relationship' | 'interest' | 'lifestyle' {
    // 유효한 인사이트 태그인 경우 SSOT 함수 사용
    if (VALID_INSIGHT_TAGS.has(tag)) {
      return getTagCategoryFromSSOT(tag as InsightTag);
    }
    // 유효하지 않은 태그는 lifestyle로 폴백
    return 'lifestyle';
  }

  // ========================================================================
  // 리셋 (테스트용)
  // ========================================================================

  /**
   * 모든 인사이트 데이터 초기화
   */
  reset(): void {
    if (typeof window === 'undefined') return;

    storage.remove(STORAGE_KEYS.ACTIVITY_STATS);
    storage.remove(STORAGE_KEYS.TAG_COUNTS);
    storage.remove(STORAGE_KEYS.UNLOCKED_STAGES);
    storage.remove(STORAGE_KEYS.CACHED_INSIGHTS);

    console.log('[InsightService] Reset complete');
  }
}

// ============================================================================
// 싱글톤 인스턴스
// ============================================================================

export const insightService = new InsightServiceClass();
