// ============================================================================
// 커뮤니티 UI/UX 개선 전략 (2025 트렌드 반영)
// ============================================================================

// ============================================================================
// 타입 정의
// ============================================================================

export interface InterestCategory {
  id: string;
  name: string;
  emoji: string;
  relatedTests: string[];
  subCategories: SubCategory[];
  tags: string[];
}

export interface SubCategory {
  id: string;
  name: string;
  emoji?: string;
  tags: string[];
}

export interface UITrend {
  id: string;
  name: string;
  description: string;
  impact: 1 | 2 | 3 | 4 | 5;
  difficulty: 1 | 2 | 3 | 4 | 5;
  examples: string[];
  sources: { title: string; url: string }[];
}

export interface PersonalizationStrategy {
  id: string;
  name: string;
  description: string;
  factors: string[];
  implementation: string[];
}

export interface ImplementationPhase {
  id: string;
  name: string;
  duration: string;
  tasks: {
    name: string;
    difficulty: 1 | 2 | 3 | 4 | 5;
    impact: 1 | 2 | 3 | 4 | 5;
    description: string;
  }[];
}

export interface KPI {
  id: string;
  name: string;
  description: string;
  current: string;
  target6m: string;
  target1y: string;
  category: 'engagement' | 'growth' | 'retention';
}

export interface ExpansionPhase {
  phase: string;
  categories: string[];
  description: string;
}

export interface StreakType {
  id: string;
  name: string;
  icon: string;
  action: string;
  rewards: { days: number; badge: string; points: number }[];
}

export interface StreakRecoveryConfig {
  freeRestore: number;
  paidRestore: number;
  freezeOption: boolean;
  gracePeriod: number;
}

export interface InterestBadge {
  id: string;
  name: string;
  emoji: string;
  requirement: string;
}

export type BadgeRarity = 'legendary' | 'epic' | 'rare' | 'common';

export interface RareBadge {
  id: string;
  name: string;
  emoji: string;
  requirement: string;
  rarity: BadgeRarity;
}

// ============================================================================
// 관심사 기반 카테고리
// ============================================================================

export const INTEREST_CATEGORIES: InterestCategory[] = [
  {
    id: 'dog',
    name: '댕댕이',
    emoji: '🐶',
    relatedTests: ['dog', 'dogBreed', 'petMatch'],
    subCategories: [
      { id: 'dog-large', name: '대형견', emoji: '🦮', tags: ['골든리트리버', '래브라도', '저먼셰퍼드', '허스키'] },
      { id: 'dog-medium', name: '중형견', emoji: '🐕', tags: ['코카스파니엘', '비글', '웰시코기', '보더콜리'] },
      { id: 'dog-small', name: '소형견', emoji: '🐩', tags: ['말티즈', '포메라니안', '치와와', '시츄', '요크셔테리어'] },
    ],
    tags: ['강아지', '반려견', '댕댕이', '개', '퍼피'],
  },
  {
    id: 'cat',
    name: '냐옹이',
    emoji: '🐱',
    relatedTests: ['cat', 'catBreed', 'petMatch'],
    subCategories: [
      { id: 'cat-short', name: '단모종', emoji: '🐈', tags: ['코숏', '러시안블루', '아비시니안', '샴'] },
      { id: 'cat-long', name: '장모종', emoji: '🐈‍⬛', tags: ['페르시안', '메인쿤', '노르웨이숲', '랙돌'] },
      { id: 'cat-special', name: '특수종', emoji: '✨', tags: ['스핑크스', '스코티쉬폴드', '먼치킨', '벵갈'] },
    ],
    tags: ['고양이', '반려묘', '냐옹이', '냥이', '캣'],
  },
  {
    id: 'rabbit',
    name: '토끼',
    emoji: '🐰',
    relatedTests: ['rabbit', 'smallPet', 'petMatch'],
    subCategories: [
      { id: 'rabbit-lop', name: '롭이어', tags: ['홀랜드롭', '미니롭', '잉글리쉬롭'] },
      { id: 'rabbit-dwarf', name: '드워프', tags: ['네덜란드드워프', '폴리쉬'] },
      { id: 'rabbit-angora', name: '앙고라', tags: ['잉글리쉬앙고라', '프렌치앙고라'] },
    ],
    tags: ['토끼', '래빗', '버니'],
  },
  {
    id: 'hamster',
    name: '햄스터',
    emoji: '🐹',
    relatedTests: ['hamster', 'smallPet', 'petMatch'],
    subCategories: [
      { id: 'hamster-syrian', name: '골든햄스터', tags: ['시리안', '골든'] },
      { id: 'hamster-dwarf', name: '드워프햄스터', tags: ['정글리안', '캠벨', '로보로브스키'] },
    ],
    tags: ['햄스터', '햄찌', '쳇바퀴'],
  },
  {
    id: 'fish',
    name: '관상어',
    emoji: '🐟',
    relatedTests: ['fishType', 'petMatch'],
    subCategories: [
      { id: 'fish-tropical', name: '열대어', tags: ['구피', '네온테트라', '베타', '엔젤피쉬'] },
      { id: 'fish-goldfish', name: '금붕어', tags: ['금붕어', '란츄', '오란다'] },
      { id: 'fish-shrimp', name: '새우/수초', tags: ['체리새우', '암마노새우', '수초어항'] },
    ],
    tags: ['물고기', '어항', '아쿠아리움', '수족관'],
  },
  {
    id: 'plant',
    name: '반려식물',
    emoji: '🌱',
    relatedTests: ['plant'],
    subCategories: [
      { id: 'plant-indoor', name: '실내식물', tags: ['몬스테라', '고무나무', '스투키', '아이비'] },
      { id: 'plant-succulent', name: '다육/선인장', tags: ['다육이', '선인장', '에케베리아'] },
      { id: 'plant-herb', name: '허브/채소', tags: ['바질', '로즈마리', '민트', '상추'] },
    ],
    tags: ['식물', '플랜테리어', '가드닝', '화분'],
  },
  {
    id: 'lifestyle',
    name: '라이프스타일',
    emoji: '☕',
    relatedTests: ['coffee', 'tea', 'idealType', 'conflictStyle', 'human'],
    subCategories: [
      { id: 'life-mbti', name: 'MBTI/성격', emoji: '🧠', tags: ['MBTI', '성격', '심리테스트'] },
      { id: 'life-love', name: '연애/관계', emoji: '💕', tags: ['연애', '이상형', '궁합', '소개팅'] },
      { id: 'life-food', name: '음식/음료', emoji: '🍽️', tags: ['커피', '차', '맛집', '요리'] },
    ],
    tags: ['일상', '취미', '라이프'],
  },
];

// ============================================================================
// 2025 UI/UX 트렌드
// ============================================================================

export const UI_TRENDS: UITrend[] = [
  {
    id: 'ai-personalization',
    name: 'AI 개인화',
    description: '사용자 행동 기반 콘텐츠 추천, 예측 인터페이스',
    impact: 5,
    difficulty: 4,
    examples: [
      '테스트 결과 기반 관심사 자동 매칭',
      '조회/좋아요 패턴 분석 추천',
      '"왜 이 글이 추천됐나요?" 투명성 UI',
    ],
    sources: [
      { title: 'Shaped AI - Recommendation Engines', url: 'https://www.shaped.ai/blog/ai-powered-recommendation-engines' },
      { title: 'Bevy - AI Personalization', url: 'https://bevy.com/b/blog/how-to-use-ai-to-personalize-member-experiences-in-communities' },
    ],
  },
  {
    id: 'bento-grid',
    name: 'Bento Grid 레이아웃',
    description: '다양한 크기의 카드를 조합한 모듈러 그리드',
    impact: 4,
    difficulty: 2,
    examples: [
      '2열 기본 그리드 + 1열 특집 카드',
      'Apple iOS 17 위젯 스타일',
      'Microsoft Fluent UI 참고',
    ],
    sources: [
      { title: 'UserGuiding - UX/UI Trends 2025', url: 'https://userguiding.com/blog/ux-ui-trends' },
    ],
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    description: '반투명 블러 효과의 "Liquid Glass" UI',
    impact: 3,
    difficulty: 2,
    examples: [
      'iOS 26 Liquid Glass 디자인',
      '카드/헤더에 backdrop-blur 적용',
      '부드러운 그림자와 미묘한 테두리',
    ],
    sources: [
      { title: 'Pixelmatters - UI Design Trends 2025', url: 'https://www.pixelmatters.com/insights/8-ui-design-trends-2025' },
    ],
  },
  {
    id: 'gesture-navigation',
    name: '제스처 네비게이션',
    description: '스와이프 중심의 직관적 탐색',
    impact: 4,
    difficulty: 3,
    examples: [
      '좌우 스와이프로 관심사 탭 이동',
      '카드 스와이프로 좋아요/저장',
      '더블탭 좋아요 (Instagram 스타일)',
    ],
    sources: [
      { title: 'Chop Dawg - Mobile App Trends 2025', url: 'https://www.chopdawg.com/ui-ux-design-trends-in-mobile-apps-for-2025/' },
    ],
  },
  {
    id: 'vertical-feed',
    name: '버티컬 피드',
    description: 'TikTok/Reels 스타일 무한 스크롤',
    impact: 4,
    difficulty: 3,
    examples: [
      '풀스크린 버티컬 카드',
      '짧은 콘텐츠 중심 (1분 읽기)',
      '자동 다음 콘텐츠 로딩',
    ],
    sources: [
      { title: 'StackInfluence - Algorithm Changes 2025', url: 'https://stackinfluence.com/2025-social-media-algorithm-changes-engagement/' },
    ],
  },
  {
    id: 'niche-community',
    name: '니치 커뮤니티',
    description: '소규모 관심사 기반 친밀한 그룹',
    impact: 5,
    difficulty: 4,
    examples: [
      'Discord 스타일 소그룹 (5-20명)',
      '품종별/지역별 세분화 커뮤니티',
      '"바이럴보다 깊은 연결" 전략',
    ],
    sources: [
      { title: 'ContentGrip - Niche Communities Rising', url: 'https://www.contentgrip.com/future-of-media-niche-communities/' },
      { title: 'ChitChatX - Niche Chat Rooms 2025', url: 'https://chitchatx.com/blog/post/niche-chat-rooms-2025-authentic-connections' },
    ],
  },
  {
    id: 'gamification-streak',
    name: '스트릭 게이미피케이션',
    description: '연속 참여 보상으로 습관 형성',
    impact: 5,
    difficulty: 2,
    examples: [
      'Duolingo 스타일 일일 스트릭',
      '7일+ 스트릭 시 2.3배 높은 참여율',
      '스트릭 복구/동결 옵션',
    ],
    sources: [
      { title: 'Trophy - Streaks Gamification', url: 'https://trophy.so/blog/streaks-gamification-case-study' },
      { title: 'Plotline - Streaks for Mobile Apps', url: 'https://www.plotline.so/blog/streaks-for-gamification-in-mobile-apps' },
    ],
  },
];

// ============================================================================
// AI 개인화 전략
// ============================================================================

export const PERSONALIZATION_STRATEGIES: PersonalizationStrategy[] = [
  {
    id: 'explicit-signals',
    name: '명시적 신호 (60%)',
    description: '사용자가 직접 선택한 관심사',
    factors: [
      '온보딩 시 선택한 관심사',
      '팔로우한 태그/카테고리',
      '테스트 결과 (고양이 성격 = 고양이 콘텐츠)',
    ],
    implementation: [
      '첫 방문 시 관심사 선택 UI',
      '프로필에 관심사 저장',
      '테스트 결과와 카테고리 자동 매핑',
    ],
  },
  {
    id: 'implicit-signals',
    name: '암묵적 신호 (40%)',
    description: '행동 데이터 기반 추론',
    factors: [
      '조회 기록 (어떤 글을 읽었나)',
      '좋아요/댓글 패턴',
      '체류 시간 (오래 본 콘텐츠)',
      '스크롤 깊이',
    ],
    implementation: [
      'ContentParticipationService 확장',
      '조회/체류시간 로깅',
      '주기적 관심사 점수 재계산',
    ],
  },
  {
    id: 'cold-start',
    name: '콜드 스타트 해결',
    description: '신규 사용자 대응 전략',
    factors: [
      '데이터 없음: 인기/최신순',
      '테스트만 함: 결과 기반 매칭',
      '활동 시작: 점진적 개인화',
    ],
    implementation: [
      '인기 콘텐츠 폴백',
      '테스트 결과 → 관심사 자동 추천',
      '10개 이상 조회 시 개인화 전환',
    ],
  },
];

// ============================================================================
// 구현 로드맵
// ============================================================================

export const IMPLEMENTATION_PHASES: ImplementationPhase[] = [
  {
    id: 'phase-1',
    name: 'Phase 1: 기반 구축',
    duration: '1-2개월',
    tasks: [
      { name: '관심사 선택 온보딩', difficulty: 2, impact: 5, description: '첫 방문 시 관심사 선택 UI' },
      { name: '관심사 탭 네비게이션', difficulty: 2, impact: 4, description: '수평 스크롤 관심사 필터' },
      { name: 'Glassmorphism 스타일', difficulty: 1, impact: 3, description: '카드/헤더 backdrop-blur' },
      { name: '사용자 관심사 저장', difficulty: 2, impact: 4, description: 'localStorage → Supabase' },
    ],
  },
  {
    id: 'phase-2',
    name: 'Phase 2: 피드 개선',
    duration: '2-3개월',
    tasks: [
      { name: 'Bento Grid 레이아웃', difficulty: 3, impact: 4, description: '2열 그리드 + 특집 카드' },
      { name: '기본 추천 알고리즘', difficulty: 3, impact: 5, description: '관심사 + 최신성 기반' },
      { name: '제스처 네비게이션', difficulty: 2, impact: 3, description: '스와이프 액션' },
      { name: '스트릭 시스템', difficulty: 2, impact: 4, description: '일일 방문/활동 기록' },
    ],
  },
  {
    id: 'phase-3',
    name: 'Phase 3: 개인화',
    duration: '3-4개월',
    tasks: [
      { name: '행동 기반 추천', difficulty: 4, impact: 5, description: '조회/좋아요/체류시간 분석' },
      { name: '관심사별 배지', difficulty: 2, impact: 3, description: '각 카테고리 전용 배지' },
      { name: '동적 카테고리', difficulty: 3, impact: 4, description: '트렌딩 태그 → 카테고리 승격' },
      { name: '추천 투명성 UI', difficulty: 2, impact: 3, description: '"왜 이 글이 추천됐나요?"' },
    ],
  },
  {
    id: 'phase-4',
    name: 'Phase 4: 고급 기능',
    duration: '4개월+',
    tasks: [
      { name: '소그룹 (클럽) 기능', difficulty: 4, impact: 4, description: 'Discord 스타일 니치 그룹' },
      { name: 'AI 콘텐츠 태깅', difficulty: 4, impact: 4, description: '자동 태그 추천' },
      { name: '크리에이터 대시보드', difficulty: 3, impact: 3, description: '기여 통계/수익' },
      { name: '실시간 알림', difficulty: 3, impact: 3, description: '관심사 새 글 알림' },
    ],
  },
];

// ============================================================================
// 성공 지표 (KPIs)
// ============================================================================

export const KPIS: KPI[] = [
  // 참여도
  { id: 'dau-mau', name: 'DAU/MAU', description: '일간/월간 활성 사용자 비율', current: '-', target6m: '15%', target1y: '25%', category: 'engagement' },
  { id: 'session-time', name: '세션당 체류시간', description: '평균 체류 시간', current: '-', target6m: '5분', target1y: '10분', category: 'engagement' },
  { id: 'post-read-rate', name: '게시글 읽기 비율', description: '피드 노출 대비 클릭', current: '-', target6m: '30%', target1y: '50%', category: 'engagement' },
  { id: 'comment-rate', name: '댓글 작성 비율', description: '읽은 글 대비 댓글', current: '-', target6m: '5%', target1y: '10%', category: 'engagement' },
  // 성장
  { id: 'onboarding-complete', name: '온보딩 완료율', description: '관심사 선택 완료', current: '-', target6m: '80%', target1y: '90%', category: 'growth' },
  { id: 'recommendation-ctr', name: '추천 클릭률', description: '추천 콘텐츠 클릭', current: '-', target6m: '15%', target1y: '25%', category: 'growth' },
  { id: 'category-switch', name: '카테고리 전환율', description: '다른 관심사 탐색', current: '-', target6m: '30%', target1y: '50%', category: 'growth' },
  // 리텐션
  { id: 'd1', name: 'D1 리텐션', description: '다음날 재방문', current: '-', target6m: '40%', target1y: '50%', category: 'retention' },
  { id: 'd7', name: 'D7 리텐션', description: '7일 후 재방문', current: '-', target6m: '20%', target1y: '30%', category: 'retention' },
  { id: 'streak-7', name: '7일+ 스트릭 유지', description: '7일 이상 연속 방문', current: '-', target6m: '10%', target1y: '20%', category: 'retention' },
];

// ============================================================================
// 확장 로드맵
// ============================================================================

export const EXPANSION_ROADMAP: Record<string, ExpansionPhase> = {
  current: {
    phase: 'Phase 1',
    categories: ['human', 'cat', 'dog', 'rabbit', 'hamster', 'idealType', 'plant', 'coffee'],
    description: '현재 8개 메인 테스트',
  },
  phase2: {
    phase: 'Phase 2 (6개월 후)',
    categories: ['fish', 'bird', 'reptile', 'lifestyle'],
    description: '관상어, 새, 파충류, 라이프스타일 통합',
  },
  phase3: {
    phase: 'Phase 3 (1년 후)',
    categories: ['breed-specific', 'regional', 'events'],
    description: '품종별 세분화, 지역 커뮤니티, 이벤트/모임',
  },
};

// ============================================================================
// 스트릭 시스템 설계
// ============================================================================

export const STREAK_TYPES: StreakType[] = [
  {
    id: 'daily-visit',
    name: '일일 방문',
    icon: '🔥',
    action: '앱 방문',
    rewards: [
      { days: 7, badge: '🥉 브론즈 불꽃', points: 50 },
      { days: 30, badge: '🥈 실버 불꽃', points: 200 },
      { days: 100, badge: '🥇 골드 불꽃', points: 500 },
    ],
  },
  {
    id: 'quiz-master',
    name: '퀴즈 마스터',
    icon: '🧠',
    action: '일일 퀴즈 완료',
    rewards: [
      { days: 7, badge: '🎯 퀴즈 루키', points: 70 },
      { days: 30, badge: '📚 퀴즈 마스터', points: 300 },
    ],
  },
  {
    id: 'social-butterfly',
    name: '소셜 버터플라이',
    icon: '🦋',
    action: '댓글 또는 좋아요',
    rewards: [
      { days: 7, badge: '💬 활발한 참여자', points: 80 },
      { days: 30, badge: '🦋 소셜 버터플라이', points: 350 },
    ],
  },
  {
    id: 'creator',
    name: '크리에이터',
    icon: '✨',
    action: '게시글 작성',
    rewards: [
      { days: 7, badge: '✏️ 글쓰기 시작', points: 100 },
      { days: 30, badge: '✨ 크리에이터', points: 500 },
    ],
  },
];

export const STREAK_RECOVERY: StreakRecoveryConfig = {
  freeRestore: 1,        // 월 1회 무료 복구
  paidRestore: 3,        // 포인트로 추가 복구 (100pt)
  freezeOption: true,    // 스트릭 동결 (여행 등, 최대 3일)
  gracePeriod: 1,        // 하루 유예 (23:59까지 미완료 시 다음날 오전까지)
};

// ============================================================================
// 관심사별 배지
// ============================================================================

export const INTEREST_BADGES: Record<string, InterestBadge[]> = {
  dog: [
    { id: 'dog-lover', name: '댕댕이 러버', emoji: '🐶', requirement: '강아지 게시글 10개 읽기' },
    { id: 'dog-expert', name: '댕댕이 박사', emoji: '🎓', requirement: '강아지 관련 답변 5개 채택' },
    { id: 'dog-parent', name: '댕댕이 집사', emoji: '🏆', requirement: '강아지 테스트 완료 + 활동 50회' },
  ],
  cat: [
    { id: 'cat-lover', name: '냥집사', emoji: '🐱', requirement: '고양이 게시글 10개 읽기' },
    { id: 'cat-whisperer', name: '냥언어 통역사', emoji: '💬', requirement: '고양이 관련 답변 5개 채택' },
    { id: 'cat-master', name: '냥 마스터', emoji: '👑', requirement: '고양이 테스트 완료 + 활동 50회' },
  ],
  rabbit: [
    { id: 'rabbit-lover', name: '토끼 러버', emoji: '🐰', requirement: '토끼 게시글 10개 읽기' },
    { id: 'rabbit-expert', name: '토끼 전문가', emoji: '🥕', requirement: '토끼 관련 답변 3개 채택' },
  ],
  plant: [
    { id: 'plant-lover', name: '식물 집사', emoji: '🌱', requirement: '식물 게시글 10개 읽기' },
    { id: 'green-thumb', name: '그린 썸', emoji: '🌿', requirement: '식물 관련 팁 5개 공유' },
  ],
  lifestyle: [
    { id: 'mbti-enthusiast', name: 'MBTI 마니아', emoji: '🧠', requirement: 'MBTI 관련 활동 30회' },
    { id: 'coffee-lover', name: '커피 러버', emoji: '☕', requirement: '커피 테스트 완료 + 관련 글 5개' },
  ],
};

// ============================================================================
// 희귀 배지
// ============================================================================

export const RARE_BADGES: RareBadge[] = [
  { id: 'early-adopter', name: '얼리어답터', emoji: '🌟', requirement: '서비스 초기 가입', rarity: 'legendary' },
  { id: 'all-test-master', name: '테스트 마스터', emoji: '👑', requirement: '모든 테스트 완료', rarity: 'epic' },
  { id: 'community-pillar', name: '커뮤니티 기둥', emoji: '🏛️', requirement: '게시글 100개 + 댓글 500개', rarity: 'epic' },
  { id: 'trend-setter', name: '트렌드세터', emoji: '🚀', requirement: '인기글 10개 작성', rarity: 'rare' },
  { id: 'helper', name: '도우미', emoji: '🤝', requirement: '채택된 답변 20개', rarity: 'rare' },
];

// ============================================================================
// 통합 데이터 Export
// ============================================================================

export const COMMUNITY_IMPROVEMENT = {
  interestCategories: INTEREST_CATEGORIES,
  uiTrends: UI_TRENDS,
  personalizationStrategies: PERSONALIZATION_STRATEGIES,
  implementationPhases: IMPLEMENTATION_PHASES,
  kpis: KPIS,
  expansionRoadmap: EXPANSION_ROADMAP,
  streakTypes: STREAK_TYPES,
  streakRecovery: STREAK_RECOVERY,
  interestBadges: INTEREST_BADGES,
  rareBadges: RARE_BADGES,
};

export default COMMUNITY_IMPROVEMENT;
