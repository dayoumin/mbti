// ============================================================================
// 커뮤니티 전략 데이터
// ============================================================================

export interface PhaseItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  difficulty: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  status: 'planned' | 'in-progress' | 'done';
  details?: string[];
  risks?: string[];
  metrics?: string[];
}

export interface Phase {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  duration: string;
  items: PhaseItem[];
  keyPrinciples?: string[];
}

export interface CommunityStrategy {
  phases: Phase[];
  coreMetrics: Metric[];
  risks: Risk[];
  moderationRules: ModerationRule[];
  legalNotes: string[];
}

export interface Metric {
  id: string;
  name: string;
  description: string;
  target?: string;
  category: 'viral' | 'retention' | 'engagement' | 'safety';
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  mitigation: string[];
}

export interface ModerationRule {
  id: string;
  title: string;
  description: string;
  action: string;
}

// ============================================================================
// 참여 보상 시스템 타입
// ============================================================================

export interface RewardActivity {
  id: string;
  name: string;
  points: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  description: string;
  category: 'basic' | 'contribution' | 'achievement';
}

export interface RewardBadge {
  id: string;
  name: string;
  emoji: string;
  requirement: string;
  points: number;
  perks: string[];
}

export interface RewardTier {
  id: string;
  name: string;
  minPoints: number;
  emoji: string;
  perks: string[];
  color: string;
}

export interface RewardSystem {
  activities: RewardActivity[];
  badges: RewardBadge[];
  tiers: RewardTier[];
  principles: string[];
  futureMonetization: string[];
}

// ============================================================================
// 기여자 크레딧 & 수익 공유 시스템 타입
// ============================================================================

export interface ContributionRecord {
  id: string;
  type: 'topic-adopted' | 'interpretation-adopted' | 'popular-comment' | 'quiz-created';
  title: string;
  description: string;
  displayExample: string;
  profileRecord: string[];
}

export interface RevenueShareTier {
  id: string;
  name: string;
  requirement: string;
  sharePercent: number;
  description: string;
  color: string;
}

export interface CreatorEcosystem {
  vision: string;
  corePrinciple: string;
  contributionTypes: ContributionRecord[];
  revenueShareTiers: RevenueShareTier[];
  revenueShareExamples: string[];
  differentiators: string[];
  roadmap: { phase: string; items: string[] }[];
  expertSystem: ExpertSystem;
}

// ============================================================================
// 전문가 협업 시스템 타입
// ============================================================================

export interface ExpertType {
  id: string;
  title: string;
  emoji: string;
  qualifications: string[];
  role: string;
  contentTypes: string[];
}

export interface ExpertService {
  id: string;
  name: string;
  description: string;
  revenueModel: string;
  phase: string;
}

export interface ExpertSystem {
  vision: string;
  principles: string[];
  expertTypes: ExpertType[];
  services: ExpertService[];
  roadmap: { phase: string; items: string[] }[];
  benefits: { forUsers: string[]; forExperts: string[]; forPlatform: string[] };
}

// ============================================================================
// 핵심 원칙
// ============================================================================

export const CORE_PRINCIPLES = [
  {
    id: 'viral-first',
    title: '바이럴 루프 우선',
    description: '공유 → 유입 → 테스트 → 비교 → 재공유의 완전한 루프 설계',
    icon: '🔄',
  },
  {
    id: 'frictionless',
    title: '마찰 최소화',
    description: '로그인 없이 비교까지 완료, 나중에 계정 연결',
    icon: '⚡',
  },
  {
    id: 'daily-reason',
    title: '매일 올 이유',
    description: '스트릭/퀴즈 도입 전에 먼저 "매일 할 액션" 정의',
    icon: '📅',
  },
  {
    id: 'community-last',
    title: '커뮤니티는 마지막',
    description: '가장 비싸고 위험한 기능, 필요해지는 순간에 최소 형태로',
    icon: '🏠',
  },
];

// ============================================================================
// Phase 1: 결과 카드 공유
// ============================================================================

export const PHASE_1: Phase = {
  id: 'phase-1',
  title: 'Phase 1: 결과 카드 공유',
  subtitle: '바이럴 루프 닫기',
  icon: '🎨',
  color: '#7aa2ff',
  duration: '1-2개월',
  keyPrinciples: [
    '"예쁜 이미지"만으로는 한계 → 전파용 훅 필수',
    '카드에 다음 행동 유도 (비교하러 가기 링크/QR)',
    '채널별 최적화 (카카오/인스타/틱톡)',
    '리퍼럴 추적 필수 (캠페인 파라미터)',
  ],
  items: [
    {
      id: 'share-card',
      title: 'SNS 공유용 결과 카드',
      description: '예쁜 결과 이미지 자동 생성',
      priority: 'high',
      difficulty: 2,
      impact: 5,
      status: 'planned',
      details: [
        '결과 한 줄 요약 + 친구랑 비교하러 가기 링크',
        '카카오톡: 세로 비율, 짧은 문구',
        '인스타 스토리: 1080x1920',
        '틱톡: 짧은 모션/영상 템플릿',
      ],
      metrics: ['공유율', '공유→유입 전환율'],
    },
    {
      id: 'referral-tracking',
      title: '리퍼럴 추적 시스템',
      description: '공유 링크에 캠페인 파라미터 + 전환 추적',
      priority: 'high',
      difficulty: 2,
      impact: 4,
      status: 'planned',
      details: [
        'UTM 파라미터 자동 추가',
        '유입 → 테스트 완료 전환 추적',
        '초대한 친구 수 표시',
      ],
      metrics: ['유입→테스트완료 전환율'],
    },
    {
      id: 'kakao-share',
      title: '카카오톡 공유',
      description: '원클릭 카카오톡 공유 기능',
      priority: 'high',
      difficulty: 1,
      impact: 5,
      status: 'planned',
      details: [
        '카카오 SDK 연동',
        '커스텀 템플릿 메시지',
        '친구 초대 버튼',
      ],
    },
  ],
};

// ============================================================================
// Phase 2: 친구 비교/궁합
// ============================================================================

export const PHASE_2: Phase = {
  id: 'phase-2',
  title: 'Phase 2: 친구 비교/궁합',
  subtitle: '관계 기반 재방문',
  icon: '💕',
  color: '#ff6b9d',
  duration: '2-3개월',
  keyPrinciples: [
    '"정확도"보다 "납득감"이 중요',
    '점수 옆에 3개 근거 카드 (대화/갈등/일)',
    '로그인 없이 비교 완료 가능하게',
    '관계 타입별 해석 톤 차별화',
  ],
  items: [
    {
      id: 'link-compare',
      title: '링크 기반 비교',
      description: '링크 열기 → 1분 테스트 → 자동 비교',
      priority: 'high',
      difficulty: 3,
      impact: 5,
      status: 'planned',
      details: [
        '익명 세션으로 테스트 완료',
        '나중에 계정 연결 옵션',
        '마찰 최소화 (로그인 없이)',
      ],
      metrics: ['비교완료율', '계정연결 전환율'],
    },
    {
      id: 'compatibility-score',
      title: '궁합 점수 시스템',
      description: '0-100% 궁합 점수 + 근거 카드',
      priority: 'high',
      difficulty: 3,
      impact: 5,
      status: 'planned',
      details: [
        '점수 산출 로직 설계',
        '3개 근거 카드 (대화 스타일/갈등 해결/일상)',
        '관계 타입별 해석 (커플/친구/동료)',
      ],
      risks: ['근거 빈약하면 신뢰도 하락'],
    },
    {
      id: 'relation-types',
      title: '관계 타입 선택',
      description: '커플/친구/동료에 따라 해석 톤 변경',
      priority: 'medium',
      difficulty: 2,
      impact: 4,
      status: 'planned',
      details: [
        '관계 타입 선택 UI',
        '타입별 결과 문구 차별화',
        '재공유 유도 문구',
      ],
    },
  ],
};

// ============================================================================
// Phase 3: 게이미피케이션
// ============================================================================

export const PHASE_3: Phase = {
  id: 'phase-3',
  title: 'Phase 3: 게이미피케이션',
  subtitle: '일일 리텐션 강화',
  icon: '🎮',
  color: '#55e6c1',
  duration: '2-3개월',
  keyPrinciples: [
    '스트릭 전에 "매일 할 이유" 먼저 정의',
    '데일리 1분 콘텐츠 (퀴즈/짧은 질문)',
    '초반엔 유형 내 리그 (세그먼트 리더보드)',
    '뱃지는 "행동" 기준, 레벨은 "누적 기여"',
  ],
  items: [
    {
      id: 'daily-content',
      title: '데일리 콘텐츠',
      description: '매일 1분 퀴즈/질문',
      priority: 'high',
      difficulty: 2,
      impact: 5,
      status: 'planned',
      details: [
        '"오늘의 성격 상식" 3문제',
        '짧은 상황 질문',
        '완료 시 스트릭 카운트',
      ],
      metrics: ['일일 퀴즈 완료율', 'D1/D7 리텐션'],
    },
    {
      id: 'streak',
      title: '스트릭 시스템',
      description: '연속 방문/참여 보상',
      priority: 'high',
      difficulty: 2,
      impact: 5,
      status: 'planned',
      details: [
        '연속 일수 표시',
        '마일스톤 보상 (7일/30일/100일)',
        '스트릭 복구 옵션 (1회 무료)',
      ],
      risks: ['매일 할 이유 없으면 피로감만'],
    },
    {
      id: 'badges',
      title: '뱃지 시스템',
      description: '행동 기반 업적 달성',
      priority: 'medium',
      difficulty: 2,
      impact: 4,
      status: 'planned',
      details: [
        '첫 테스트 완료',
        '첫 비교 완료',
        '첫 공유',
        '7일 연속 방문',
        '10개 테스트 완료',
      ],
    },
    {
      id: 'leaderboard',
      title: '리더보드',
      description: '유형 내 주간 랭킹',
      priority: 'low',
      difficulty: 3,
      impact: 3,
      status: 'planned',
      details: [
        '초반: 유형 내 리그 (ENFP끼리)',
        '활동 기반 포인트',
        '주간 리셋',
      ],
      risks: ['소수 헤비유저에게만 의미'],
    },
  ],
};

// ============================================================================
// Phase 4: 커뮤니티
// ============================================================================

export const PHASE_4: Phase = {
  id: 'phase-4',
  title: 'Phase 4: 커뮤니티',
  subtitle: '최소 형태로 시작',
  icon: '💬',
  color: '#ffd166',
  duration: '3-4개월',
  keyPrinciples: [
    '16개 유형 게시판 한번에 열면 "텅 빈 게시판"',
    '시작은 전체 라운지 + 유형 필터',
    '강한 모더레이션 도구 필수',
    '콘텐츠 씨딩 30-100개 준비',
  ],
  items: [
    {
      id: 'single-lounge',
      title: '전체 라운지 + 유형 필터',
      description: '하나의 라운지에서 유형별 필터링',
      priority: 'high',
      difficulty: 3,
      impact: 4,
      status: 'planned',
      details: [
        '전체 게시판 1개',
        '유형별 필터 (I/E, NT/NF 등)',
        '콘텐츠 분산 방지',
      ],
    },
    {
      id: 'moderation-tools',
      title: '모더레이션 도구',
      description: '신고/차단/제재 시스템',
      priority: 'high',
      difficulty: 4,
      impact: 5,
      status: 'planned',
      details: [
        '신고/차단/뮤트',
        '제재 (기간/누적)',
        '금칙어/스팸 필터',
        '새 계정 레이트 리밋',
      ],
      risks: ['운영 리소스 필요'],
    },
    {
      id: 'anonymous-trust',
      title: '익명 등급 시스템',
      description: '활동/시간 기반 신뢰도',
      priority: 'medium',
      difficulty: 3,
      impact: 4,
      status: 'planned',
      details: [
        '활동량 기반 등급',
        '가입 기간 반영',
        '익명 시 등급 표시',
      ],
    },
    {
      id: 'content-seeding',
      title: '콘텐츠 씨딩',
      description: '초기 분위기 형성용 템플릿 글',
      priority: 'high',
      difficulty: 2,
      impact: 4,
      status: 'planned',
      details: [
        '유형별 템플릿 글 30-100개',
        '주제 예시 준비',
        '운영진 초기 활동',
      ],
    },
  ],
};

// ============================================================================
// 핵심 지표
// ============================================================================

export const CORE_METRICS: Metric[] = [
  // 바이럴
  { id: 'share-rate', name: '공유율', description: '테스트 완료 후 공유한 비율', category: 'viral' },
  { id: 'share-to-visit', name: '공유→유입 전환', description: '공유 링크 클릭 후 방문한 비율', category: 'viral' },
  { id: 'visit-to-complete', name: '유입→완료 전환', description: '방문 후 테스트 완료한 비율', category: 'viral' },
  // 리텐션
  { id: 'd1', name: 'D1 리텐션', description: '다음날 재방문율', category: 'retention' },
  { id: 'd7', name: 'D7 리텐션', description: '7일 후 재방문율', category: 'retention' },
  { id: 'streak-retention', name: '스트릭 유지율', description: '7일 이상 스트릭 유지 비율', category: 'retention' },
  // 인게이지먼트
  { id: 'compare-rate', name: '비교 완료율', description: '비교 시작 후 완료한 비율', category: 'engagement' },
  { id: 'daily-quiz', name: '일일 퀴즈 완료율', description: '데일리 퀴즈 참여율', category: 'engagement' },
  // 안전
  { id: 'report-rate', name: '신고율', description: '콘텐츠 대비 신고 비율', category: 'safety' },
  { id: 'action-rate', name: '제재율', description: '신고 대비 제재 비율', category: 'safety' },
];

// ============================================================================
// 리스크
// ============================================================================

export const RISKS: Risk[] = [
  {
    id: 'mbti-conflict',
    title: 'MBTI 유형 갈등',
    description: '유형 혐오, 조롱, 성별/정치/연애 논쟁',
    severity: 'high',
    mitigation: [
      '명확한 커뮤니티 가이드라인',
      '3스트라이크 룰 (경고→정지→영구차단)',
      '금칙어 자동 필터링',
      '특정 유형 비하 콘텐츠 즉시 삭제',
    ],
  },
  {
    id: 'empty-board',
    title: '텅 빈 게시판',
    description: '16개 유형별 게시판 시 콘텐츠 분산',
    severity: 'medium',
    mitigation: [
      '전체 라운지 + 필터로 시작',
      '콘텐츠 씨딩 30-100개',
      '운영진 초기 활동',
    ],
  },
  {
    id: 'streak-fatigue',
    title: '스트릭 피로감',
    description: '매일 할 이유 없이 스트릭만 도입 시',
    severity: 'medium',
    mitigation: [
      '데일리 콘텐츠 먼저 준비',
      '1분 이내 완료 가능한 액션',
      '스트릭 복구 옵션 제공',
    ],
  },
  {
    id: 'score-distrust',
    title: '궁합 점수 불신',
    description: '근거 없는 점수 → 신뢰도 하락',
    severity: 'high',
    mitigation: [
      '3개 이상 근거 카드 제공',
      '"오락/참고용" 고지',
      '점수 산출 로직 투명화',
    ],
  },
];

// ============================================================================
// 모더레이션 규칙
// ============================================================================

export const MODERATION_RULES: ModerationRule[] = [
  {
    id: 'hate',
    title: '유형 혐오/비하',
    description: '특정 MBTI 유형을 비하하거나 조롱하는 콘텐츠',
    action: '즉시 삭제 + 경고',
  },
  {
    id: 'spam',
    title: '스팸/광고',
    description: '무관한 광고, 반복 게시물',
    action: '즉시 삭제',
  },
  {
    id: 'personal',
    title: '개인정보 노출',
    description: '타인의 개인정보를 동의 없이 게시',
    action: '즉시 삭제 + 경고',
  },
  {
    id: 'political',
    title: '정치/종교 논쟁',
    description: '성격 테스트와 무관한 정치/종교 갈등 유발',
    action: '삭제 또는 이동',
  },
];

// ============================================================================
// 법/정책 고지
// ============================================================================

export const LEGAL_NOTES = [
  '궁합/성격 분석은 오락 및 참고용이며 과학적 진단이 아닙니다.',
  '결과를 근거로 한 중요한 결정(채용, 관계 등)은 권장하지 않습니다.',
  '혐오/차별적 콘텐츠는 즉시 삭제되며 계정이 제재될 수 있습니다.',
  '신고된 콘텐츠는 24시간 내 검토됩니다.',
];

// ============================================================================
// 참여 보상 시스템
// ============================================================================

export const REWARD_ACTIVITIES: RewardActivity[] = [
  // 기본 참여
  { id: 'vote', name: '투표 참여', points: 10, difficulty: 1, description: '투표에 참여', category: 'basic' },
  { id: 'comment', name: '댓글 작성', points: 20, difficulty: 2, description: '의견 표현', category: 'basic' },
  { id: 'streak-bonus', name: '연속 투표 보너스', points: 5, difficulty: 1, description: '연속 투표 시 추가', category: 'basic' },

  // 기여 활동 (핵심!)
  { id: 'suggest-topic', name: '주제 제안', points: 50, difficulty: 3, description: '투표 주제 아이디어 제출', category: 'contribution' },
  { id: 'topic-adopted', name: '제안 채택', points: 200, difficulty: 4, description: '제안한 주제가 실제 투표로 등록', category: 'contribution' },
  { id: 'write-interpretation', name: '결과 해석 작성', points: 80, difficulty: 4, description: '투표 결과에 대한 해석글 작성', category: 'contribution' },
  { id: 'interpretation-adopted', name: '해석 채택', points: 150, difficulty: 5, description: '작성한 해석이 베스트로 선정', category: 'contribution' },

  // 커뮤니티 인정
  { id: 'popular-comment', name: '인기 댓글', points: 100, difficulty: 3, description: '좋아요 10개 이상 받은 댓글', category: 'achievement' },
  { id: 'helpful-answer', name: '도움된 답변', points: 80, difficulty: 3, description: '질문에 도움됨 표시 받음', category: 'achievement' },
];

export const REWARD_BADGES: RewardBadge[] = [
  // 투표 배지
  { id: 'first-vote', name: '첫 투표', emoji: '🗳️', requirement: '첫 투표 참여', points: 0, perks: [] },
  { id: 'voter', name: '투표러', emoji: '🎯', requirement: '투표 10회', points: 100, perks: ['프로필 테두리'] },
  { id: 'passionate-voter', name: '열정 투표러', emoji: '⭐', requirement: '투표 50회', points: 500, perks: ['닉네임 색상 변경'] },
  { id: 'vote-master', name: '투표 마스터', emoji: '👑', requirement: '투표 100회', points: 1000, perks: ['특별 이모지 사용권', '투표 미리보기'] },
  { id: 'vote-legend', name: '투표 레전드', emoji: '🏆', requirement: '투표 500회', points: 5000, perks: ['신규 투표 미리보기', '레전드 배지'] },

  // 기여 배지
  { id: 'idea-maker', name: '아이디어 메이커', emoji: '💡', requirement: '주제 제안 5회', points: 250, perks: ['제안 우선 검토'] },
  { id: 'trend-setter', name: '트렌드세터', emoji: '🚀', requirement: '제안 채택 3회', points: 600, perks: ['채택 시 크레딧 표시', '전용 배지'] },
  { id: 'analyst', name: '분석가', emoji: '📊', requirement: '해석 채택 3회', points: 450, perks: ['해석 우선 노출'] },

  // 커뮤니티 배지
  { id: 'influencer', name: '인플루언서', emoji: '✨', requirement: '인기 댓글 5개', points: 500, perks: ['댓글 상단 고정 가능'] },
  { id: 'helper', name: '도우미', emoji: '🤝', requirement: '도움된 답변 10개', points: 800, perks: ['도우미 배지 표시'] },
];

export const REWARD_TIERS: RewardTier[] = [
  {
    id: 'newcomer',
    name: '새내기',
    minPoints: 0,
    emoji: '🌱',
    perks: ['투표 참여 가능'],
    color: '#94a3b8'
  },
  {
    id: 'regular',
    name: '단골',
    minPoints: 300,
    emoji: '🌿',
    perks: ['댓글 작성 가능', '좋아요/싫어요 가능'],
    color: '#22c55e'
  },
  {
    id: 'contributor',
    name: '기여자',
    minPoints: 1000,
    emoji: '🌳',
    perks: ['주제 제안 가능', '결과 해석 작성 가능'],
    color: '#3b82f6'
  },
  {
    id: 'vip',
    name: 'VIP',
    minPoints: 3000,
    emoji: '💎',
    perks: ['제안 우선 검토', '전용 VIP 배지', '신규 기능 베타 테스트'],
    color: '#8b5cf6'
  },
  {
    id: 'champion',
    name: '챔피언',
    minPoints: 10000,
    emoji: '👑',
    perks: ['운영진 추천 자격', '커뮤니티 이벤트 기획 참여', '명예의 전당 등재'],
    color: '#f59e0b'
  },
];

export const REWARD_SYSTEM: RewardSystem = {
  activities: REWARD_ACTIVITIES,
  badges: REWARD_BADGES,
  tiers: REWARD_TIERS,
  principles: [
    '단순 클릭보다 기여에 더 많은 보상',
    '채택/인정 받으면 큰 보상 → 양질의 기여 유도',
    '커뮤니티 검증(좋아요)으로 자연 필터링',
    '기여자 크레딧 표시 → "이 투표는 @홍길동님 제안"',
    '등급별 특권으로 참여 동기 부여',
    '매몰비용 효과: 쌓인 포인트/배지/히스토리',
  ],
  futureMonetization: [
    '프리미엄 배지/테마 (1년 후 검토)',
    '광고 제거 구독',
    '독점 콘텐츠 접근',
    '커스텀 프로필 꾸미기',
  ],
};

// ============================================================================
// 기여자 크레딧 & 수익 공유 생태계
// ============================================================================

export const CONTRIBUTION_TYPES: ContributionRecord[] = [
  {
    id: 'topic-adopted',
    type: 'topic-adopted',
    title: '투표 주제 채택',
    description: '제안한 투표 주제가 실제 투표로 등록됨',
    displayExample: '💡 제안: @별빛토끼 (트렌드세터 🚀)',
    profileRecord: [
      '채택된 투표 목록',
      '총 참여자 수 누적',
      '평균 참여율 통계',
    ],
  },
  {
    id: 'interpretation-adopted',
    type: 'interpretation-adopted',
    title: '결과 해석 채택',
    description: '작성한 해석이 베스트로 선정됨',
    displayExample: '📊 해석: @분석왕 (분석가 📊)',
    profileRecord: [
      '베스트 해석 목록',
      '받은 도움됨 수',
      '해석 조회수',
    ],
  },
  {
    id: 'popular-comment',
    type: 'popular-comment',
    title: '인기 댓글',
    description: '좋아요 10개 이상 받은 댓글',
    displayExample: '🔥 인기 댓글 by @재치왕',
    profileRecord: [
      '인기 댓글 목록',
      '총 좋아요 수',
    ],
  },
  {
    id: 'quiz-created',
    type: 'quiz-created',
    title: '퀴즈 제작',
    description: '커뮤니티 퀴즈를 제작하여 채택됨',
    displayExample: '🎯 퀴즈 제작: @퀴즈마스터',
    profileRecord: [
      '제작한 퀴즈 목록',
      '총 풀이 수',
      '평균 정답률',
    ],
  },
];

export const REVENUE_SHARE_TIERS: RevenueShareTier[] = [
  {
    id: 'starter',
    name: '스타터 크리에이터',
    requirement: '채택 콘텐츠 5개+',
    sharePercent: 5,
    description: '수익 공유 자격 획득, 기본 비율 적용',
    color: '#94a3b8',
  },
  {
    id: 'rising',
    name: '라이징 크리에이터',
    requirement: '채택 20개+ & 팔로워 100+',
    sharePercent: 10,
    description: '높은 수익 비율, 전용 크리에이터 배지',
    color: '#22c55e',
  },
  {
    id: 'pro',
    name: '프로 크리에이터',
    requirement: '채택 50개+ & 팔로워 500+',
    sharePercent: 15,
    description: '프리미엄 비율, 크리에이터 대시보드 접근',
    color: '#3b82f6',
  },
  {
    id: 'partner',
    name: '파트너 크리에이터',
    requirement: '초대제 (상위 1%)',
    sharePercent: 20,
    description: '최고 비율, 운영 참여, 독점 기능',
    color: '#f59e0b',
  },
];

// ============================================================================
// 전문가 협업 시스템 데이터
// ============================================================================

export const EXPERT_TYPES: ExpertType[] = [
  {
    id: 'psychologist',
    title: '심리 전문가',
    emoji: '🧠',
    qualifications: ['임상심리사', '상담심리사', '심리학 박사'],
    role: '심층 해석 및 콘텐츠 감수',
    contentTypes: ['결과 심층 해석', '유형별 심리 칼럼', 'Q&A 답변'],
  },
  {
    id: 'mbti-certified',
    title: 'MBTI 공인 전문가',
    emoji: '🎓',
    qualifications: ['MBTI 공인 강사', 'MBTI 마스터 자격'],
    role: 'MBTI 관련 콘텐츠 전문 제작',
    contentTypes: ['유형 해설', '궁합 분석', '직업/관계 가이드'],
  },
  {
    id: 'counselor',
    title: '상담 전문가',
    emoji: '💬',
    qualifications: ['전문상담사', '가족상담사', '커플상담사'],
    role: '관계/갈등 관련 깊이 있는 케어',
    contentTypes: ['관계 조언', '갈등 해결 가이드', '유료 상담 연결'],
  },
  {
    id: 'advisor',
    title: '자문단',
    emoji: '📋',
    qualifications: ['학계 전문가', '업계 경력자'],
    role: '콘텐츠 품질 관리 및 검수',
    contentTypes: ['콘텐츠 감수', '분기별 자문', '트렌드 분석'],
  },
];

export const EXPERT_SERVICES: ExpertService[] = [
  {
    id: 'verified-content',
    name: '전문가 검증 콘텐츠',
    description: '전문가가 작성/검수한 해석에 "전문가 검증" 마크 표시',
    revenueModel: '콘텐츠 조회당 수익 공유',
    phase: 'Phase 2',
  },
  {
    id: 'expert-column',
    name: '전문가 코너/칼럼',
    description: '주간 투표 결과 심층 해석, 유형별 심리 칼럼 기고',
    revenueModel: '고정 기고료 + 조회 보너스',
    phase: 'Phase 2',
  },
  {
    id: 'expert-qna',
    name: '전문가 Q&A',
    description: '유저 질문에 전문가가 답변, 도움됨 표시로 평가',
    revenueModel: '답변당 포인트 + 채택 보너스',
    phase: 'Phase 2',
  },
  {
    id: 'consultation-connect',
    name: '유료 상담 연결',
    description: '깊은 상담이 필요한 유저를 검증된 전문가에게 연결',
    revenueModel: '중개 수수료 (10~20%)',
    phase: 'Phase 3',
  },
  {
    id: 'advisory-board',
    name: '자문단 운영',
    description: '분기별 콘텐츠 품질 검토, 비과학적 내용 필터링',
    revenueModel: '자문료 (분기별)',
    phase: 'Phase 2',
  },
];

export const EXPERT_SYSTEM: ExpertSystem = {
  vision: '전문가와 함께하는 깊이 있는 플랫폼',
  principles: [
    '오락 + 전문성의 균형 (재미있되 신뢰할 수 있는)',
    '전문가도 수익을 얻는 구조 (지속가능한 협업)',
    '유저는 필요할 때 깊이 있는 케어를 받을 수 있음',
    '콘텐츠 품질 = 플랫폼 신뢰도',
  ],
  expertTypes: EXPERT_TYPES,
  services: EXPERT_SERVICES,
  roadmap: [
    {
      phase: 'Phase 1: 자문 체계 (6개월 후)',
      items: [
        '자문단 구성 (2~3명)',
        '콘텐츠 가이드라인 수립',
        '비과학적 주장 필터링 체계',
      ],
    },
    {
      phase: 'Phase 2: 전문가 콘텐츠 (1년 후)',
      items: [
        '전문가 인증 배지 시스템',
        '전문가 코너/칼럼 오픈',
        '전문가 Q&A 서비스',
        '검증 콘텐츠 마크 도입',
      ],
    },
    {
      phase: 'Phase 3: 상담 연결 (1.5년+ 후)',
      items: [
        '유료 상담 연결 서비스',
        '전문가 프로필/리뷰 시스템',
        '상담 예약/결제 시스템',
      ],
    },
  ],
  benefits: {
    forUsers: [
      '신뢰할 수 있는 전문 콘텐츠',
      '필요시 깊이 있는 상담 가능',
      '비과학적/유해 콘텐츠 필터링',
    ],
    forExperts: [
      '고객 유입 채널 확보',
      '콘텐츠 수익 공유',
      '전문성 홍보 기회',
    ],
    forPlatform: [
      '콘텐츠 품질/신뢰도 향상',
      '상담 중개 수수료 수익',
      '차별화된 프리미엄 서비스',
    ],
  },
};

export const CREATOR_ECOSYSTEM: CreatorEcosystem = {
  vision: '기여자가 수익을 가져가는 자생 생태계',
  corePrinciple: '좋은 콘텐츠를 만든 사람이 보상받는 구조 → 플랫폼이 저절로 돌아감',

  contributionTypes: CONTRIBUTION_TYPES,
  revenueShareTiers: REVENUE_SHARE_TIERS,

  revenueShareExamples: [
    '내가 제안한 투표에 광고가 붙으면 → 수익의 X% 지급',
    '내 해석이 조회될 때마다 → 조회당 포인트 적립',
    '내 퀴즈가 풀릴 때마다 → 풀이당 포인트 적립',
    '포인트 → 현금 전환 (최소 금액 이상 시)',
  ],

  differentiators: [
    '단순 참여 보상이 아닌 "창작 수익 공유"',
    '플랫폼 성장 = 기여자 수익 증가 (동반 성장)',
    '기여 히스토리가 곧 포트폴리오',
    '떠나면 잃는 것: 수익 파이프라인 + 팔로워 + 크레딧',
  ],

  roadmap: [
    {
      phase: 'Phase 1: 기록 시스템 (현재~)',
      items: [
        '기여 크레딧 표시 (투표/해석에 기여자 이름)',
        '프로필에 기여 히스토리 기록',
        '포인트 누적 시스템',
      ],
    },
    {
      phase: 'Phase 2: 크리에이터 등급 (6개월 후)',
      items: [
        '크리에이터 등급 시스템 도입',
        '크리에이터 전용 대시보드',
        '기여 통계 및 분석',
      ],
    },
    {
      phase: 'Phase 3: 수익 공유 (1년+ 후)',
      items: [
        '광고 수익 공유 시작',
        '포인트 → 현금 전환',
        '파트너 크리에이터 프로그램',
      ],
    },
  ],

  expertSystem: EXPERT_SYSTEM,
};

// ============================================================================
// 통합 전략 객체
// ============================================================================

export const COMMUNITY_STRATEGY: CommunityStrategy = {
  phases: [PHASE_1, PHASE_2, PHASE_3, PHASE_4],
  coreMetrics: CORE_METRICS,
  risks: RISKS,
  moderationRules: MODERATION_RULES,
  legalNotes: LEGAL_NOTES,
};

export default COMMUNITY_STRATEGY;
