// ============================================================================
// 리텐션 전략 데이터
// ============================================================================

export interface RetentionTactic {
  id: string;
  name: string;
  category: 'daily' | 'weekly' | 'milestone' | 'social' | 'content';
  description: string;
  mechanism: string;
  implementation: string[];
  metrics: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  effort: 1 | 2 | 3 | 4 | 5;  // 1=쉬움, 5=어려움
  impact: 1 | 2 | 3 | 4 | 5;  // 1=낮음, 5=높음
  status: 'done' | 'in-progress' | 'planned' | 'research';
  risks?: string[];
  references?: string[];
}

export interface RetentionPhase {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  goal: string;
  tactics: RetentionTactic[];
}

// ============================================================================
// 핵심 리텐션 원칙
// ============================================================================

export const RETENTION_PRINCIPLES = [
  {
    id: 'habit-first',
    title: '습관 형성 우선',
    description: '바이럴보다 매일 돌아올 이유를 먼저 만들어야 함',
    icon: '🔄',
    details: [
      'Hooked 모델: 트리거 → 행동 → 보상 → 투자',
      '21일 법칙: 3주간 연속 사용 시 습관화',
      '매일 1분 이내 완료 가능한 액션 필수',
    ],
  },
  {
    id: 'variable-reward',
    title: '가변 보상 설계',
    description: '예측 불가능한 보상이 도파민 분비 극대화',
    icon: '🎰',
    details: [
      '고정 보상: 스트릭 유지 포인트',
      '가변 보상: 랜덤 보너스, 숨겨진 뱃지',
      '사회적 보상: 친구 비교 결과, 랭킹 변동',
    ],
  },
  {
    id: 'loss-aversion',
    title: '손실 회피 활용',
    description: '얻는 것보다 잃는 것에 2배 민감',
    icon: '⚠️',
    details: [
      '스트릭 끊김 경고 (3시간 전 알림)',
      '한정 콘텐츠 (이번 주만 가능)',
      '레벨 하락 시스템 (선택적)',
    ],
  },
  {
    id: 'progress-visible',
    title: '진척 시각화',
    description: '목표까지 얼마나 왔는지 항상 보여주기',
    icon: '📊',
    details: [
      '프로필 완성도 %',
      '다음 레벨까지 N포인트',
      '이번 주 목표 달성률',
    ],
  },
  {
    id: 'social-commitment',
    title: '사회적 약속',
    description: '다른 사람과 연결되면 이탈 비용 증가',
    icon: '🤝',
    details: [
      '친구와 비교 기록',
      '공개 스트릭 (선택)',
      '팀 챌린지 (장기)',
    ],
  },
];

// ============================================================================
// Phase 1: 습관 형성 (0-30일)
// ============================================================================

export const RETENTION_PHASE_1: RetentionPhase = {
  id: 'phase-1',
  title: '습관 형성',
  description: '첫 30일 내 매일 방문 습관 만들기',
  timeframe: '0-30일',
  goal: 'D7 리텐션 30% 이상',
  tactics: [
    {
      id: 'daily-quiz',
      name: '일일 퀴즈/투표',
      category: 'daily',
      description: '매일 새로운 1분 콘텐츠 제공',
      mechanism: '매일 오전 갱신되는 퀴즈 3개 + 투표 1개',
      implementation: [
        '콘텐츠 풀 100개 이상 확보',
        '카테고리별 순환 (성격/동물/연애/일반)',
        '완료 시 포인트 + 스트릭 카운트',
        '정답률 표시로 경쟁심 자극',
      ],
      metrics: ['일일 완료율', '평균 체류 시간'],
      priority: 'critical',
      effort: 2,
      impact: 5,
      status: 'done',
    },
    {
      id: 'streak-system',
      name: '스트릭 시스템',
      category: 'daily',
      description: '연속 방문/참여에 대한 보상',
      mechanism: '데일리 퀴즈 완료 시 스트릭 +1, 미완료 시 리셋',
      implementation: [
        '스트릭 카운터 UI (불꽃 아이콘)',
        '마일스톤 보상 (7/30/100일)',
        '스트릭 복구권 (1회 무료, 이후 포인트로 구매)',
        '스트릭 끊기기 3시간 전 알림 (PWA)',
      ],
      metrics: ['7일 이상 스트릭 비율', '스트릭 복구 사용률'],
      priority: 'critical',
      effort: 2,
      impact: 5,
      status: 'done',
      risks: ['매일 콘텐츠 없으면 피로감만 유발'],
    },
    {
      id: 'onboarding-flow',
      name: '온보딩 최적화',
      category: 'milestone',
      description: '첫 테스트 완료까지 마찰 최소화',
      mechanism: '3분 이내 첫 결과 확인 가능하도록',
      implementation: [
        '테스트 선택 → 바로 시작 (회원가입 지연)',
        '빠른 모드 기본값',
        '첫 결과 후 "프로필 저장하기" 유도',
        '두 번째 테스트 추천으로 재방문 유도',
      ],
      metrics: ['테스트 시작→완료 전환율', '두 번째 테스트 시작률'],
      priority: 'critical',
      effort: 2,
      impact: 5,
      status: 'in-progress',
    },
    {
      id: 'push-notification',
      name: 'PWA 푸시 알림',
      category: 'daily',
      description: '재방문 유도 알림',
      mechanism: '적절한 타이밍에 개인화된 알림 발송',
      implementation: [
        '알림 동의: 첫 테스트 완료 후 요청 (가치 경험 후)',
        '알림 종류:',
        '  - 스트릭 끊김 경고 (3시간 전)',
        '  - 새 퀴즈 도착 (오전 9시)',
        '  - 친구 비교 결과 (실시간)',
        '  - 주간 리포트 (일요일)',
        '빈도 제한: 일 최대 2회',
      ],
      metrics: ['알림 동의율', '알림 클릭률', '알림→방문 전환율'],
      priority: 'high',
      effort: 3,
      impact: 4,
      status: 'planned',
      risks: ['과도한 알림은 앱 삭제 유발', 'iOS Safari 제한'],
    },
  ],
};

// ============================================================================
// Phase 2: 가치 심화 (30-90일)
// ============================================================================

export const RETENTION_PHASE_2: RetentionPhase = {
  id: 'phase-2',
  title: '가치 심화',
  description: '더 깊은 인사이트와 콘텐츠 제공',
  timeframe: '30-90일',
  goal: 'D30 리텐션 15% 이상',
  tactics: [
    {
      id: 'content-unlock',
      name: '콘텐츠 언락 시스템',
      category: 'content',
      description: '테스트 완료로 추가 분석 해금',
      mechanism: '특정 테스트 조합 완료 시 심층 분석 제공',
      implementation: [
        '결과 페이지에 "잠긴 분석" 표시',
        '예: "연애 유형 테스트하면 이상형 분석 해금"',
        '언락 후 공유 가능한 인사이트 카드',
        '점진적 해금 (3개 → 5개 → 10개 테스트)',
      ],
      metrics: ['언락 완료율', '언락 후 공유율'],
      priority: 'critical',
      effort: 3,
      impact: 5,
      status: 'planned',
      references: ['Duolingo 스킬 트리', '게임 업적 시스템'],
    },
    {
      id: 'personalized-insights',
      name: '개인화 인사이트',
      category: 'content',
      description: '결과 기반 맞춤 콘텐츠',
      mechanism: '테스트 결과에 따라 맞춤형 팁/콘텐츠 추천',
      implementation: [
        '"당신의 유형을 위한 오늘의 팁"',
        '"같은 유형이 많이 본 콘텐츠"',
        '"당신의 유형 + 친구 유형 궁합 팁"',
        '결과 기반 다음 테스트 추천',
      ],
      metrics: ['추천 콘텐츠 클릭률', '맞춤 팁 저장률'],
      priority: 'high',
      effort: 3,
      impact: 4,
      status: 'planned',
    },
    {
      id: 'weekly-report',
      name: '주간 리포트',
      category: 'weekly',
      description: '일주일 활동 요약 + 인사이트',
      mechanism: '매주 일요일 개인화된 리포트 제공',
      implementation: [
        '이번 주 활동 요약 (퀴즈/테스트/비교)',
        '"당신과 같은 유형 이번 주 트렌드"',
        '"이번 주 인기 테스트 TOP3"',
        '다음 주 추천 액션',
        '공유 가능한 리포트 카드',
      ],
      metrics: ['리포트 조회율', '리포트 공유율'],
      priority: 'medium',
      effort: 3,
      impact: 3,
      status: 'planned',
    },
    {
      id: 'level-system',
      name: '레벨/랭크 시스템',
      category: 'milestone',
      description: '누적 활동에 따른 등급',
      mechanism: '포인트 누적 → 레벨업 → 특전 해금',
      implementation: [
        '레벨 1-10 (뉴비 → 마스터)',
        '레벨별 타이틀 (탐험가/분석가/마스터)',
        '레벨업 시 보상 (숨겨진 테스트, 특별 뱃지)',
        '프로필에 레벨 표시',
      ],
      metrics: ['평균 레벨', '레벨 5+ 유저 비율'],
      priority: 'medium',
      effort: 2,
      impact: 3,
      status: 'done',
    },
  ],
};

// ============================================================================
// Phase 3: 커뮤니티 연결 (90일+)
// ============================================================================

export const RETENTION_PHASE_3: RetentionPhase = {
  id: 'phase-3',
  title: '커뮤니티 연결',
  description: '사회적 연결로 장기 리텐션 확보',
  timeframe: '90일+',
  goal: 'D90 리텐션 5% 이상, 월 활성 사용자 성장',
  tactics: [
    {
      id: 'friend-compare',
      name: '친구 비교 시스템',
      category: 'social',
      description: '링크로 친구와 결과 비교',
      mechanism: '내 결과 공유 → 친구 테스트 → 자동 비교',
      implementation: [
        '비교 요소:',
        '  - 차원별 점수 비교 (레이더 차트)',
        '  - 결과 유형 궁합 점수 (0-100%)',
        '  - 공통점/차이점 3가지',
        '  - 관계 팁 (커플/친구/동료 선택)',
        '비교 결과 공유 카드 생성',
        '비교 기록 저장 (프로필에서 확인)',
      ],
      metrics: ['비교 시작률', '비교 완료율', '비교 후 재공유율'],
      priority: 'high',
      effort: 4,
      impact: 5,
      status: 'planned',
    },
    {
      id: 'community-participation',
      name: '커뮤니티 참여',
      category: 'social',
      description: 'Q&A, 팁, 토론 참여',
      mechanism: '결과 기반 커뮤니티 기여로 인정받기',
      implementation: [
        '내 유형 기반 팁 작성',
        '질문에 답변하기',
        '토론/밸런스 게임 참여',
        '활동에 따른 뱃지/포인트',
        '베스트 팁 선정 → 하이라이트',
      ],
      metrics: ['콘텐츠 생성율', '답변 채택률', '커뮤니티 DAU'],
      priority: 'medium',
      effort: 4,
      impact: 4,
      status: 'in-progress',
    },
    {
      id: 'challenges',
      name: '챌린지/이벤트',
      category: 'weekly',
      description: '기간 한정 참여형 이벤트',
      mechanism: '주간/월간 목표 달성 시 보상',
      implementation: [
        '주간 챌린지: "이번 주 5개 테스트 완료"',
        '월간 챌린지: "친구 3명과 비교하기"',
        '시즌 이벤트: "발렌타인 궁합 이벤트"',
        '챌린지 완료 시 한정 뱃지',
      ],
      metrics: ['챌린지 참여율', '챌린지 완료율'],
      priority: 'medium',
      effort: 3,
      impact: 4,
      status: 'planned',
    },
  ],
};

// ============================================================================
// 리텐션 지표 정의
// ============================================================================

export const RETENTION_METRICS = [
  {
    id: 'd1',
    name: 'D1 리텐션',
    description: '첫 방문 다음날 재방문율',
    target: '40%',
    benchmark: '업계 평균 25-30%',
    importance: 'critical',
  },
  {
    id: 'd7',
    name: 'D7 리텐션',
    description: '첫 방문 7일 후 재방문율',
    target: '25%',
    benchmark: '업계 평균 10-15%',
    importance: 'critical',
  },
  {
    id: 'd30',
    name: 'D30 리텐션',
    description: '첫 방문 30일 후 재방문율',
    target: '15%',
    benchmark: '업계 평균 5-10%',
    importance: 'high',
  },
  {
    id: 'dau-mau',
    name: 'DAU/MAU 비율',
    description: '월간 사용자 중 일일 활성 비율',
    target: '20%',
    benchmark: '소셜앱 15-25%',
    importance: 'high',
  },
  {
    id: 'streak-7',
    name: '7일 스트릭 달성률',
    description: '스트릭 시작자 중 7일 달성 비율',
    target: '30%',
    benchmark: '-',
    importance: 'medium',
  },
  {
    id: 'churn-rate',
    name: '월간 이탈률',
    description: '전월 활성 사용자 중 이번 달 미방문 비율',
    target: '<50%',
    benchmark: '콘텐츠앱 40-60%',
    importance: 'high',
  },
];

// ============================================================================
// 리텐션 트리거 (알림/넛지)
// ============================================================================

export const RETENTION_TRIGGERS = [
  {
    id: 'streak-warning',
    name: '스트릭 경고',
    timing: '스트릭 끊기기 3시간 전',
    channel: 'push',
    message: '🔥 스트릭이 곧 끊겨요! 오늘의 퀴즈를 완료하세요',
    cta: '퀴즈 풀기',
  },
  {
    id: 'daily-quiz',
    name: '일일 퀴즈 알림',
    timing: '매일 오전 9시',
    channel: 'push',
    message: '📝 오늘의 새 퀴즈가 도착했어요!',
    cta: '확인하기',
  },
  {
    id: 'friend-compared',
    name: '친구 비교 알림',
    timing: '친구가 비교 완료 시',
    channel: 'push',
    message: '💕 {친구이름}님이 당신과 비교했어요! 궁합: {점수}%',
    cta: '결과 보기',
  },
  {
    id: 'weekly-report',
    name: '주간 리포트',
    timing: '매주 일요일 오후 6시',
    channel: 'push',
    message: '📊 이번 주 당신의 활동 리포트가 도착했어요',
    cta: '확인하기',
  },
  {
    id: 're-engagement',
    name: '재참여 유도',
    timing: '7일 미방문 시',
    channel: 'push',
    message: '👋 {이름}님, 보고 싶었어요! 새 테스트가 기다리고 있어요',
    cta: '돌아가기',
  },
  {
    id: 'milestone',
    name: '마일스톤 축하',
    timing: '레벨업/뱃지 획득 시',
    channel: 'in-app',
    message: '🎉 레벨 {레벨}이 되었어요! 새로운 기능이 해금되었습니다',
    cta: '확인하기',
  },
];

// ============================================================================
// 통합 전략 객체
// ============================================================================

export const RETENTION_STRATEGY = {
  principles: RETENTION_PRINCIPLES,
  phases: [RETENTION_PHASE_1, RETENTION_PHASE_2, RETENTION_PHASE_3],
  metrics: RETENTION_METRICS,
  triggers: RETENTION_TRIGGERS,
};

export default RETENTION_STRATEGY;
