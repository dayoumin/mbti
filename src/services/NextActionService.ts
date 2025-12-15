// ============================================================================
// NextActionService - 다음 액션 추천 서비스
// ============================================================================
// 목적: 콘텐츠 완료 후 다음 액션을 체계적으로 추천

import { SubjectKey } from '@/data/types';

// ============================================================================
// Types
// ============================================================================

export type ContentEndpoint =
  | 'test_result'
  | 'quiz_result'
  | 'poll_result'
  | 'community_view'
  | 'ranking_view'
  | 'profile_view';

export type NextActionType =
  | 'test'
  | 'quiz'
  | 'poll'
  | 'community'
  | 'share'
  | 'compare'
  | 'ranking';

export type ActionPriority = 'primary' | 'secondary' | 'tertiary';

export interface NextAction {
  type: NextActionType;
  targetId?: string;           // 구체적 타겟 (테스트 ID, 퀴즈 카테고리 등)
  targetCategory?: string;     // 타겟 카테고리
  priority: ActionPriority;
  label: string;               // 버튼/카드 라벨
  description: string;         // 설명
  icon: string;                // 이모지 아이콘
  ctaText: string;             // CTA 버튼 텍스트
}

export interface RecommendationContext {
  endpoint: ContentEndpoint;   // 어디서 추천 요청했는지
  contentId?: string;          // 현재 콘텐츠 ID (테스트 타입, 퀴즈 ID 등)
  category?: string;           // 카테고리
  resultKey?: string;          // 결과 키 (테스트 결과 등)
}

// ============================================================================
// 콘텐츠 연결 데이터
// ============================================================================

interface ContentConnection {
  from: string;
  to: string;
  type: NextActionType;
  relevance: number;
  reason: string;
}

// 테스트 → 다른 콘텐츠 연결
const TEST_TO_CONTENT: ContentConnection[] = [
  // petMatch
  { from: 'petMatch', to: 'pet', type: 'quiz', relevance: 5, reason: '반려동물 상식 퀴즈' },
  { from: 'petMatch', to: 'pet', type: 'poll', relevance: 4, reason: '반려동물 투표' },
  { from: 'petMatch', to: 'dogBreed', type: 'test', relevance: 5, reason: '강아지 품종 찾기' },
  { from: 'petMatch', to: 'catBreed', type: 'test', relevance: 5, reason: '고양이 품종 찾기' },

  // plant
  { from: 'plant', to: 'plant', type: 'quiz', relevance: 5, reason: '식물 관리 퀴즈' },
  { from: 'plant', to: 'plant', type: 'poll', relevance: 4, reason: '식집사 투표' },

  // coffee
  { from: 'coffee', to: 'lifestyle', type: 'quiz', relevance: 4, reason: '라이프스타일 퀴즈' },
  { from: 'coffee', to: 'lifestyle', type: 'poll', relevance: 5, reason: '커피 취향 투표' },
  { from: 'coffee', to: 'plant', type: 'test', relevance: 3, reason: '식물 케미도 알아보기' },

  // idealType
  { from: 'idealType', to: 'love', type: 'quiz', relevance: 5, reason: '연애 심리 퀴즈' },
  { from: 'idealType', to: 'love', type: 'poll', relevance: 5, reason: '연애 스타일 투표' },
  { from: 'idealType', to: 'conflictStyle', type: 'test', relevance: 5, reason: '갈등 대처 스타일' },

  // conflictStyle
  { from: 'conflictStyle', to: 'love', type: 'quiz', relevance: 4, reason: '관계 심리 퀴즈' },
  { from: 'conflictStyle', to: 'idealType', type: 'test', relevance: 5, reason: '이상형 테스트' },

  // human
  { from: 'human', to: 'personality', type: 'quiz', relevance: 5, reason: '성격 유형 퀴즈' },
  { from: 'human', to: 'personality', type: 'poll', relevance: 4, reason: '성격별 투표' },
  { from: 'human', to: 'petMatch', type: 'test', relevance: 4, reason: '반려동물 매칭' },
];

// 퀴즈/투표 카테고리 → 테스트 연결
const CATEGORY_TO_TEST: Record<string, SubjectKey[]> = {
  pet: ['petMatch', 'dogBreed', 'catBreed'],
  cat: ['catBreed', 'petMatch'],
  dog: ['dogBreed', 'petMatch'],
  plant: ['plant'],
  love: ['idealType', 'conflictStyle'],
  personality: ['human'],
  lifestyle: ['coffee', 'plant'],
};

// 카테고리별 메타 정보
const CATEGORY_META: Record<string, { label: string; icon: string }> = {
  pet: { label: '반려동물', icon: '🐾' },
  cat: { label: '고양이', icon: '🐱' },
  dog: { label: '강아지', icon: '🐕' },
  plant: { label: '식물', icon: '🌱' },
  love: { label: '연애', icon: '💕' },
  personality: { label: '성격', icon: '🧠' },
  lifestyle: { label: '라이프스타일', icon: '☕' },
};

// ============================================================================
// NextActionService
// ============================================================================

class NextActionService {
  /**
   * 다음 액션 추천 가져오기
   */
  getRecommendations(context: RecommendationContext): NextAction[] {
    const { endpoint, contentId, category } = context;

    switch (endpoint) {
      case 'test_result':
        return this.getTestResultActions(contentId as SubjectKey, category);

      case 'quiz_result':
        return this.getQuizResultActions(category);

      case 'poll_result':
        return this.getPollResultActions(category);

      case 'community_view':
        return this.getCommunityActions(category);

      case 'ranking_view':
        return this.getRankingActions(contentId as SubjectKey);

      case 'profile_view':
        return this.getProfileActions();

      default:
        return this.getDefaultActions();
    }
  }

  /**
   * 테스트 결과 후 다음 액션
   */
  private getTestResultActions(testType?: SubjectKey, category?: string): NextAction[] {
    const actions: NextAction[] = [];

    // 1. 공유 (항상 Primary)
    actions.push({
      type: 'share',
      priority: 'primary',
      label: '결과 공유하기',
      description: '친구들에게 내 결과를 공유해보세요',
      icon: '📤',
      ctaText: '공유하기',
    });

    // 2. 랭킹 보기
    actions.push({
      type: 'ranking',
      targetId: testType,
      priority: 'secondary',
      label: '전체 랭킹 보기',
      description: '다른 사람들은 어떤 결과가 많을까?',
      icon: '🏆',
      ctaText: '랭킹 보기',
    });

    // 3. 관련 콘텐츠 (테스트 기반)
    if (testType) {
      const connections = TEST_TO_CONTENT.filter(c => c.from === testType);

      // 관련 투표
      const pollConn = connections.find(c => c.type === 'poll');
      if (pollConn) {
        actions.push({
          type: 'poll',
          targetCategory: pollConn.to,
          priority: 'secondary',
          label: '관련 투표 참여',
          description: pollConn.reason,
          icon: '📊',
          ctaText: '투표하기',
        });
      }

      // 관련 퀴즈
      const quizConn = connections.find(c => c.type === 'quiz');
      if (quizConn) {
        actions.push({
          type: 'quiz',
          targetCategory: quizConn.to,
          priority: 'tertiary',
          label: '관련 퀴즈 풀기',
          description: quizConn.reason,
          icon: '🧠',
          ctaText: '퀴즈 풀기',
        });
      }

      // 다음 테스트 추천
      const testConn = connections.find(c => c.type === 'test');
      if (testConn) {
        actions.push({
          type: 'test',
          targetId: testConn.to,
          priority: 'tertiary',
          label: '다른 테스트 하기',
          description: testConn.reason,
          icon: '✨',
          ctaText: '테스트하기',
        });
      }
    }

    return actions;
  }

  /**
   * 퀴즈 결과 후 다음 액션
   */
  private getQuizResultActions(category?: string): NextAction[] {
    const actions: NextAction[] = [];

    // 1. 다음 퀴즈 (Primary)
    actions.push({
      type: 'quiz',
      targetCategory: category,
      priority: 'primary',
      label: '다음 퀴즈',
      description: '연속으로 도전해보세요!',
      icon: '🎯',
      ctaText: '다음 문제',
    });

    // 2. 관련 테스트 (Primary)
    if (category) {
      const relatedTests = CATEGORY_TO_TEST[category];
      if (relatedTests && relatedTests.length > 0) {
        const meta = CATEGORY_META[category];
        actions.push({
          type: 'test',
          targetId: relatedTests[0],
          priority: 'primary',
          label: '관련 테스트',
          description: `${meta?.label || category} 테스트로 더 자세히 알아보기`,
          icon: '📋',
          ctaText: '테스트하기',
        });
      }
    }

    // 3. 관련 투표
    actions.push({
      type: 'poll',
      targetCategory: category,
      priority: 'secondary',
      label: '관련 투표',
      description: '다른 사람들의 의견은?',
      icon: '📊',
      ctaText: '투표하기',
    });

    return actions;
  }

  /**
   * 투표 결과 후 다음 액션
   */
  private getPollResultActions(category?: string): NextAction[] {
    const actions: NextAction[] = [];

    // 1. 다른 투표 (Primary)
    actions.push({
      type: 'poll',
      targetCategory: category,
      priority: 'primary',
      label: '다른 투표',
      description: '비슷한 주제 투표',
      icon: '📊',
      ctaText: '더 투표하기',
    });

    // 2. 관련 테스트 (Primary)
    if (category) {
      const relatedTests = CATEGORY_TO_TEST[category];
      if (relatedTests && relatedTests.length > 0) {
        const meta = CATEGORY_META[category];
        actions.push({
          type: 'test',
          targetId: relatedTests[0],
          priority: 'primary',
          label: '관련 테스트',
          description: `이 결과가 궁금하다면? ${meta?.label || ''} 테스트 해보기`,
          icon: '🎯',
          ctaText: '테스트하기',
        });
      }
    }

    // 3. 결과 공유
    actions.push({
      type: 'share',
      priority: 'secondary',
      label: '결과 공유',
      description: '친구들에게 물어보기',
      icon: '📤',
      ctaText: '공유하기',
    });

    return actions;
  }

  /**
   * 커뮤니티 조회 후 다음 액션
   */
  private getCommunityActions(category?: string): NextAction[] {
    const actions: NextAction[] = [];

    // 1. 댓글 달기
    actions.push({
      type: 'community',
      priority: 'primary',
      label: '댓글 달기',
      description: '의견을 남겨보세요',
      icon: '💬',
      ctaText: '댓글 달기',
    });

    // 2. 관련 테스트
    if (category) {
      const relatedTests = CATEGORY_TO_TEST[category];
      if (relatedTests && relatedTests.length > 0) {
        actions.push({
          type: 'test',
          targetId: relatedTests[0],
          priority: 'secondary',
          label: '관련 테스트',
          description: '이 주제의 테스트',
          icon: '📋',
          ctaText: '테스트하기',
        });
      }
    }

    // 3. 관련 투표
    actions.push({
      type: 'poll',
      targetCategory: category,
      priority: 'secondary',
      label: '관련 투표',
      description: '이 주제로 투표',
      icon: '📊',
      ctaText: '투표하기',
    });

    return actions;
  }

  /**
   * 랭킹 화면에서 다음 액션
   */
  private getRankingActions(testType?: SubjectKey): NextAction[] {
    return [
      {
        type: 'test',
        targetId: testType,
        priority: 'primary',
        label: '테스트 시작',
        description: '나도 테스트해보기',
        icon: '🎯',
        ctaText: '테스트하기',
      },
      {
        type: 'share',
        priority: 'secondary',
        label: '랭킹 공유',
        description: '랭킹 공유하기',
        icon: '📤',
        ctaText: '공유하기',
      },
    ];
  }

  /**
   * 프로필 화면에서 다음 액션
   */
  private getProfileActions(): NextAction[] {
    return [
      {
        type: 'share',
        priority: 'primary',
        label: '프로필 공유',
        description: '내 프로필 공유하기',
        icon: '📤',
        ctaText: '공유하기',
      },
      {
        type: 'test',
        priority: 'secondary',
        label: '미완료 테스트',
        description: '아직 안 해본 테스트',
        icon: '✨',
        ctaText: '테스트하기',
      },
      {
        type: 'compare',
        priority: 'secondary',
        label: '친구와 비교',
        description: '친구 결과와 비교하기',
        icon: '👥',
        ctaText: '비교하기',
      },
    ];
  }

  /**
   * 기본 액션
   */
  private getDefaultActions(): NextAction[] {
    return [
      {
        type: 'test',
        priority: 'primary',
        label: '테스트 해보기',
        description: '재미있는 테스트 시작',
        icon: '✨',
        ctaText: '시작하기',
      },
    ];
  }

  /**
   * 우선순위별 필터링
   */
  filterByPriority(actions: NextAction[], priority: ActionPriority): NextAction[] {
    return actions.filter(a => a.priority === priority);
  }

  /**
   * 상위 N개만 가져오기
   */
  getTopActions(actions: NextAction[], count: number): NextAction[] {
    const priorityOrder: ActionPriority[] = ['primary', 'secondary', 'tertiary'];
    const sorted = [...actions].sort((a, b) => {
      return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
    });
    return sorted.slice(0, count);
  }
}

// 싱글톤 인스턴스
export const nextActionService = new NextActionService();
export default nextActionService;
