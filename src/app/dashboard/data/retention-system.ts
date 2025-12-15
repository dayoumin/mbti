// ============================================================================
// 체류 유도 시스템 (Retention & Next Action System)
// ============================================================================
// 목적: 사용자가 콘텐츠를 완료한 후 다음 액션으로 자연스럽게 유도
// 핵심: 모든 "종료 지점"에서 체계적인 다음 액션 추천

// ============================================================================
// Types
// ============================================================================

export type ContentEndpoint =
  | 'test_result'      // 테스트 결과 화면
  | 'quiz_result'      // 퀴즈 정답 확인 후
  | 'poll_result'      // 투표 결과 확인 후
  | 'community_view'   // 커뮤니티 게시글 조회 후
  | 'ranking_view'     // 랭킹 조회 후
  | 'profile_view';    // 프로필 조회 후

export type NextActionType =
  | 'test'             // 테스트 시작
  | 'quiz'             // 퀴즈 참여
  | 'poll'             // 투표 참여
  | 'community'        // 커뮤니티 글쓰기/조회
  | 'share'            // 결과 공유
  | 'compare'          // 친구와 비교
  | 'ranking';         // 랭킹 보기

export type ActionPriority = 'primary' | 'secondary' | 'tertiary';

// ============================================================================
// 콘텐츠 연결 매트릭스
// ============================================================================

export interface ContentConnection {
  from: string;           // 출발 콘텐츠 ID 또는 카테고리
  to: string;             // 도착 콘텐츠 ID 또는 카테고리
  type: NextActionType;
  relevance: 1 | 2 | 3 | 4 | 5;  // 연관성 점수 (5가 가장 높음)
  reason: string;         // 추천 이유 (사용자에게 표시)
}

// 테스트 ↔ 콘텐츠 연결
export const TEST_CONTENT_CONNECTIONS: ContentConnection[] = [
  // petMatch 연결
  { from: 'petMatch', to: 'pet-quiz', type: 'quiz', relevance: 5, reason: '반려동물 상식 테스트' },
  { from: 'petMatch', to: 'pet-poll', type: 'poll', relevance: 4, reason: '다른 사람들은 어떤 동물을 선택했을까?' },

  // plant 연결
  { from: 'plant', to: 'plant-quiz', type: 'quiz', relevance: 5, reason: '식물 관리 퀴즈' },
  { from: 'plant', to: 'plant-poll', type: 'poll', relevance: 4, reason: '식집사들의 선택은?' },
  { from: 'plant', to: 'lifestyle-poll', type: 'poll', relevance: 3, reason: '라이프스타일 투표' },

  // coffee 연결
  { from: 'coffee', to: 'lifestyle-quiz', type: 'quiz', relevance: 4, reason: '라이프스타일 퀴즈' },
  { from: 'coffee', to: 'coffee-poll', type: 'poll', relevance: 5, reason: '커피 취향 투표' },

  // idealType 연결
  { from: 'idealType', to: 'love-quiz', type: 'quiz', relevance: 5, reason: '연애 심리 퀴즈' },
  { from: 'idealType', to: 'love-poll', type: 'poll', relevance: 5, reason: '연애 스타일 투표' },

  // conflictStyle 연결
  { from: 'conflictStyle', to: 'love-quiz', type: 'quiz', relevance: 4, reason: '관계 심리 퀴즈' },
  { from: 'conflictStyle', to: 'love-poll', type: 'poll', relevance: 4, reason: '갈등 상황에서 다른 사람들의 선택은?' },

  // human 연결
  { from: 'human', to: 'personality-quiz', type: 'quiz', relevance: 5, reason: '성격 유형 퀴즈' },
  { from: 'human', to: 'personality-poll', type: 'poll', relevance: 4, reason: '성격별 투표' },
];

// 퀴즈/투표 → 테스트 연결
export const CONTENT_TEST_CONNECTIONS: ContentConnection[] = [
  // 반려동물 퀴즈/투표 → 테스트
  { from: 'pet-quiz', to: 'petMatch', type: 'test', relevance: 5, reason: '나와 맞는 반려동물 찾기' },
  { from: 'pet-poll', to: 'petMatch', type: 'test', relevance: 5, reason: '반려동물 매칭 테스트' },
  { from: 'cat-quiz', to: 'catBreed', type: 'test', relevance: 5, reason: '고양이 품종 매칭' },
  { from: 'dog-quiz', to: 'dogBreed', type: 'test', relevance: 5, reason: '강아지 품종 매칭' },

  // 식물 퀴즈/투표 → 테스트
  { from: 'plant-quiz', to: 'plant', type: 'test', relevance: 5, reason: '나와 맞는 식물 찾기' },
  { from: 'plant-poll', to: 'plant', type: 'test', relevance: 5, reason: '반려식물 매칭 테스트' },

  // 연애 퀴즈/투표 → 테스트
  { from: 'love-quiz', to: 'idealType', type: 'test', relevance: 5, reason: '이상형 테스트' },
  { from: 'love-poll', to: 'idealType', type: 'test', relevance: 5, reason: '연애 성향 테스트' },
  { from: 'love-poll', to: 'conflictStyle', type: 'test', relevance: 4, reason: '갈등 대처 스타일' },

  // 성격 퀴즈/투표 → 테스트
  { from: 'personality-quiz', to: 'human', type: 'test', relevance: 5, reason: '성격 유형 테스트' },
  { from: 'personality-poll', to: 'human', type: 'test', relevance: 5, reason: '성격 분석 테스트' },

  // 라이프스타일 → 테스트
  { from: 'lifestyle-quiz', to: 'coffee', type: 'test', relevance: 4, reason: '커피 성향 테스트' },
  { from: 'coffee-poll', to: 'coffee', type: 'test', relevance: 5, reason: '커피 매칭 테스트' },
];

// ============================================================================
// 다음 액션 추천 규칙
// ============================================================================

export interface NextActionRule {
  endpoint: ContentEndpoint;
  contentId?: string;        // 특정 콘텐츠 ID (선택)
  category?: string;         // 카테고리 (선택)
  actions: RecommendedAction[];
}

export interface RecommendedAction {
  type: NextActionType;
  targetId?: string;         // 구체적 타겟 ID
  targetCategory?: string;   // 타겟 카테고리
  priority: ActionPriority;
  label: string;             // 버튼/카드 라벨
  description: string;       // 설명
  icon: string;              // 아이콘 이모지
  ctaText: string;           // CTA 버튼 텍스트
  condition?: string;        // 조건 (optional)
}

// 종료 지점별 기본 다음 액션
export const DEFAULT_NEXT_ACTIONS: NextActionRule[] = [
  // 테스트 결과 후
  {
    endpoint: 'test_result',
    actions: [
      {
        type: 'share',
        priority: 'primary',
        label: '결과 공유하기',
        description: '친구들에게 내 결과를 공유해보세요',
        icon: '📤',
        ctaText: '공유하기',
      },
      {
        type: 'compare',
        priority: 'primary',
        label: '친구와 비교하기',
        description: '친구는 어떤 결과가 나왔을까?',
        icon: '👥',
        ctaText: '비교하기',
      },
      {
        type: 'ranking',
        priority: 'secondary',
        label: '전체 랭킹 보기',
        description: '다른 사람들은 어떤 결과가 많을까?',
        icon: '🏆',
        ctaText: '랭킹 보기',
      },
      {
        type: 'poll',
        priority: 'secondary',
        label: '관련 투표 참여',
        description: '이 주제로 투표해보세요',
        icon: '📊',
        ctaText: '투표하기',
      },
      {
        type: 'quiz',
        priority: 'tertiary',
        label: '관련 퀴즈 풀기',
        description: '더 알아보고 싶다면?',
        icon: '🧠',
        ctaText: '퀴즈 풀기',
      },
      {
        type: 'test',
        priority: 'tertiary',
        label: '다른 테스트 하기',
        description: '추천 테스트',
        icon: '✨',
        ctaText: '테스트하기',
      },
    ],
  },

  // 퀴즈 결과 후
  {
    endpoint: 'quiz_result',
    actions: [
      {
        type: 'quiz',
        priority: 'primary',
        label: '다음 퀴즈',
        description: '연속으로 도전해보세요!',
        icon: '🎯',
        ctaText: '다음 문제',
      },
      {
        type: 'test',
        priority: 'primary',
        label: '관련 테스트',
        description: '더 자세히 알아보기',
        icon: '📋',
        ctaText: '테스트하기',
      },
      {
        type: 'poll',
        priority: 'secondary',
        label: '관련 투표',
        description: '다른 사람들의 의견은?',
        icon: '📊',
        ctaText: '투표하기',
      },
      {
        type: 'community',
        priority: 'tertiary',
        label: '토론 참여',
        description: '이 주제로 이야기해요',
        icon: '💬',
        ctaText: '토론하기',
      },
    ],
  },

  // 투표 결과 후
  {
    endpoint: 'poll_result',
    actions: [
      {
        type: 'poll',
        priority: 'primary',
        label: '다른 투표',
        description: '비슷한 주제 투표',
        icon: '📊',
        ctaText: '더 투표하기',
      },
      {
        type: 'test',
        priority: 'primary',
        label: '관련 테스트',
        description: '이 결과가 궁금하다면?',
        icon: '🎯',
        ctaText: '테스트하기',
      },
      {
        type: 'share',
        priority: 'secondary',
        label: '결과 공유',
        description: '친구들에게 물어보기',
        icon: '📤',
        ctaText: '공유하기',
      },
      {
        type: 'community',
        priority: 'tertiary',
        label: '의견 남기기',
        description: '왜 이 선택을 했나요?',
        icon: '💬',
        ctaText: '댓글 달기',
      },
    ],
  },

  // 커뮤니티 조회 후
  {
    endpoint: 'community_view',
    actions: [
      {
        type: 'community',
        priority: 'primary',
        label: '댓글 달기',
        description: '의견을 남겨보세요',
        icon: '💬',
        ctaText: '댓글 달기',
      },
      {
        type: 'test',
        priority: 'secondary',
        label: '관련 테스트',
        description: '이 주제의 테스트',
        icon: '📋',
        ctaText: '테스트하기',
      },
      {
        type: 'poll',
        priority: 'secondary',
        label: '관련 투표',
        description: '이 주제로 투표',
        icon: '📊',
        ctaText: '투표하기',
      },
      {
        type: 'community',
        priority: 'tertiary',
        label: '글 쓰기',
        description: '나도 공유하고 싶어요',
        icon: '✏️',
        ctaText: '글 쓰기',
      },
    ],
  },
];

// ============================================================================
// 카테고리별 연결 매핑
// ============================================================================

export interface CategoryMapping {
  category: string;
  label: string;
  icon: string;
  tests: string[];
  quizCategories: string[];
  pollCategories: string[];
  communityTags: string[];
}

export const CATEGORY_MAPPINGS: CategoryMapping[] = [
  {
    category: 'pet',
    label: '반려동물',
    icon: '🐾',
    tests: ['petMatch', 'dogBreed', 'catBreed', 'smallPet', 'fishType', 'birdType', 'reptileType'],
    quizCategories: ['cat', 'dog', 'rabbit', 'hamster'],
    pollCategories: ['cat', 'dog', 'rabbit', 'hamster'],
    communityTags: ['반려동물', '강아지', '고양이', '토끼', '햄스터'],
  },
  {
    category: 'plant',
    label: '식물',
    icon: '🌱',
    tests: ['plant'],
    quizCategories: ['plant'],
    pollCategories: ['plant'],
    communityTags: ['식물', '반려식물', '다육이', '관엽'],
  },
  {
    category: 'love',
    label: '연애/관계',
    icon: '💕',
    tests: ['idealType', 'conflictStyle'],
    quizCategories: ['love'],
    pollCategories: ['love'],
    communityTags: ['연애', '관계', '썸', '데이트'],
  },
  {
    category: 'personality',
    label: '성격',
    icon: '🧠',
    tests: ['human'],
    quizCategories: ['personality'],
    pollCategories: ['personality'],
    communityTags: ['성격', 'MBTI', '심리'],
  },
  {
    category: 'lifestyle',
    label: '라이프스타일',
    icon: '☕',
    tests: ['coffee'],
    quizCategories: ['lifestyle'],
    pollCategories: ['lifestyle'],
    communityTags: ['라이프스타일', '커피', '일상'],
  },
];

// ============================================================================
// 추천 로직 우선순위
// ============================================================================

export interface RecommendationPriority {
  factor: string;
  weight: number;
  description: string;
}

export const RECOMMENDATION_PRIORITIES: RecommendationPriority[] = [
  { factor: 'category_match', weight: 5, description: '같은 카테고리 콘텐츠 우선' },
  { factor: 'not_completed', weight: 4, description: '아직 안 해본 콘텐츠 우선' },
  { factor: 'popularity', weight: 3, description: '인기 콘텐츠 우선' },
  { factor: 'recency', weight: 2, description: '최신 콘텐츠 우선' },
  { factor: 'user_preference', weight: 4, description: '사용자 선호 카테고리 우선' },
  { factor: 'streak_bonus', weight: 3, description: '연속 참여 시 보너스 콘텐츠' },
];

// ============================================================================
// UI 컴포넌트 스펙
// ============================================================================

export interface NextActionCardSpec {
  variant: 'inline' | 'card' | 'banner' | 'modal';
  maxActions: number;
  showDescription: boolean;
  showIcon: boolean;
  animation: 'fade' | 'slide' | 'bounce' | 'none';
}

export const NEXT_ACTION_CARD_SPECS: Record<ContentEndpoint, NextActionCardSpec> = {
  test_result: {
    variant: 'card',
    maxActions: 4,
    showDescription: true,
    showIcon: true,
    animation: 'slide',
  },
  quiz_result: {
    variant: 'inline',
    maxActions: 2,
    showDescription: false,
    showIcon: true,
    animation: 'fade',
  },
  poll_result: {
    variant: 'inline',
    maxActions: 2,
    showDescription: false,
    showIcon: true,
    animation: 'fade',
  },
  community_view: {
    variant: 'banner',
    maxActions: 3,
    showDescription: true,
    showIcon: true,
    animation: 'slide',
  },
  ranking_view: {
    variant: 'card',
    maxActions: 2,
    showDescription: true,
    showIcon: true,
    animation: 'fade',
  },
  profile_view: {
    variant: 'card',
    maxActions: 3,
    showDescription: true,
    showIcon: true,
    animation: 'fade',
  },
};

// ============================================================================
// 구현 로드맵
// ============================================================================

export interface RetentionRoadmapPhase {
  id: string;
  name: string;
  status: 'done' | 'in_progress' | 'planned';
  items: {
    task: string;
    endpoint: ContentEndpoint;
    priority: 'high' | 'medium' | 'low';
    description: string;
  }[];
}

export const RETENTION_ROADMAP: RetentionRoadmapPhase[] = [
  {
    id: 'phase-1',
    name: 'Phase 1: 기반 구축',
    status: 'done',
    items: [
      {
        task: 'NextActionService 생성',
        endpoint: 'test_result',
        priority: 'high',
        description: '추천 로직 중앙화 서비스'
      },
      {
        task: 'NextActionCard 컴포넌트',
        endpoint: 'test_result',
        priority: 'high',
        description: '공통 다음 액션 UI 컴포넌트'
      },
      {
        task: '퀴즈 결과 → 테스트 연결',
        endpoint: 'quiz_result',
        priority: 'high',
        description: '퀴즈 완료 후 관련 테스트 추천'
      },
      {
        task: '투표 결과 → 테스트 연결',
        endpoint: 'poll_result',
        priority: 'high',
        description: '투표 완료 후 관련 테스트 추천'
      },
    ],
  },
  {
    id: 'phase-2',
    name: 'Phase 2: 횡단 연결',
    status: 'done',
    items: [
      {
        task: '테스트 결과 → 투표 연결',
        endpoint: 'test_result',
        priority: 'medium',
        description: '테스트 결과 후 관련 투표 추천 (ContentActions 컴포넌트)'
      },
      {
        task: '테스트 결과 → 퀴즈 연결',
        endpoint: 'test_result',
        priority: 'medium',
        description: '테스트 결과 후 관련 퀴즈 추천 (ContentActions 컴포넌트)'
      },
      {
        task: '커뮤니티 → 테스트 연결',
        endpoint: 'community_view',
        priority: 'medium',
        description: '게시글 조회 후 관련 테스트 추천 (TipCard, QnACard에 구현)'
      },
    ],
  },
  {
    id: 'phase-3',
    name: 'Phase 3: 개인화 & 확장',
    status: 'done',
    items: [
      {
        task: '사용자 선호도 기반 추천',
        endpoint: 'test_result',
        priority: 'medium',
        description: 'getPersonalizedTestRecommendation() 구현'
      },
      {
        task: '스트릭 연동 추천',
        endpoint: 'quiz_result',
        priority: 'low',
        description: 'getStreakBonusAction() - 3/7/14일 연속 보너스'
      },
      {
        task: '시간대별 추천',
        endpoint: 'test_result',
        priority: 'low',
        description: 'getTimeBasedAction() - 아침/낮/저녁/밤 맞춤'
      },
    ],
  },
];

// ============================================================================
// 현재 상태 분석
// ============================================================================

export interface EndpointAnalysis {
  endpoint: ContentEndpoint;
  currentStatus: 'good' | 'needs_improvement' | 'missing';
  currentActions: string[];
  missingActions: string[];
  priority: 'high' | 'medium' | 'low';
}

export const CURRENT_STATE_ANALYSIS: EndpointAnalysis[] = [
  {
    endpoint: 'test_result',
    currentStatus: 'good',
    currentActions: ['공유', '랭킹', '다음 테스트', '관련 투표', '관련 퀴즈'],
    missingActions: ['친구 비교'],
    priority: 'low',
  },
  {
    endpoint: 'quiz_result',
    currentStatus: 'good',
    currentActions: ['다음 퀴즈', '관련 테스트', '관련 투표'],
    missingActions: ['공유'],
    priority: 'low',
  },
  {
    endpoint: 'poll_result',
    currentStatus: 'good',
    currentActions: ['다른 투표', '관련 테스트', '공유'],
    missingActions: ['관련 퀴즈'],
    priority: 'low',
  },
  {
    endpoint: 'community_view',
    currentStatus: 'good',
    currentActions: ['관련 테스트', '관련 퀴즈', '관련 투표'],
    missingActions: ['댓글 달기 UI 개선'],
    priority: 'low',
  },
  {
    endpoint: 'ranking_view',
    currentStatus: 'good',
    currentActions: ['테스트 시작', '공유'],
    missingActions: [],
    priority: 'low',
  },
  {
    endpoint: 'profile_view',
    currentStatus: 'needs_improvement',
    currentActions: ['공유', '테스트 재시작'],
    missingActions: ['추천 테스트', '미완료 테스트'],
    priority: 'medium',
  },
];

// ============================================================================
// 메트릭스 정의
// ============================================================================

export interface RetentionMetric {
  id: string;
  name: string;
  description: string;
  formula: string;
  target: string;
}

export const RETENTION_METRICS: RetentionMetric[] = [
  {
    id: 'next_action_rate',
    name: '다음 액션 전환율',
    description: '결과 화면에서 다음 액션을 클릭한 비율',
    formula: '(다음 액션 클릭 수 / 결과 화면 조회 수) × 100',
    target: '30% 이상',
  },
  {
    id: 'session_depth',
    name: '세션 깊이',
    description: '한 세션에서 완료한 콘텐츠 수',
    formula: '세션당 완료 콘텐츠 평균',
    target: '3개 이상',
  },
  {
    id: 'cross_content_rate',
    name: '교차 콘텐츠 참여율',
    description: '다른 유형의 콘텐츠로 이동한 비율',
    formula: '(교차 이동 수 / 전체 이동 수) × 100',
    target: '20% 이상',
  },
  {
    id: 'return_rate',
    name: '재방문율',
    description: '다음 날 다시 방문한 사용자 비율',
    formula: '(D+1 재방문 사용자 / D 방문자) × 100',
    target: '25% 이상',
  },
];

// ============================================================================
// 통합 Export
// ============================================================================

export const RETENTION_SYSTEM = {
  // 연결 데이터
  testContentConnections: TEST_CONTENT_CONNECTIONS,
  contentTestConnections: CONTENT_TEST_CONNECTIONS,
  categoryMappings: CATEGORY_MAPPINGS,

  // 추천 규칙
  defaultNextActions: DEFAULT_NEXT_ACTIONS,
  recommendationPriorities: RECOMMENDATION_PRIORITIES,

  // UI 스펙
  nextActionCardSpecs: NEXT_ACTION_CARD_SPECS,

  // 분석 & 로드맵
  currentStateAnalysis: CURRENT_STATE_ANALYSIS,
  roadmap: RETENTION_ROADMAP,
  metrics: RETENTION_METRICS,
};

export default RETENTION_SYSTEM;
