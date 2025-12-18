// ============================================================================
// 콘텐츠 시스템 데이터 (퀴즈/투표/Q&A)
// ============================================================================

// ============================================================================
// Types
// ============================================================================

export type ContentType = 'quiz' | 'poll' | 'qna';
export type ContentCategory = 'cat' | 'dog' | 'rabbit' | 'hamster' | 'plant' | 'love' | 'personality' | 'lifestyle' | 'general';
export type Frequency = 'once' | 'daily' | 'weekly' | 'seasonal' | 'event';

export interface ContentTypeDefinition {
  id: ContentType;
  name: string;
  description: string;
  icon: string;
  color: string;
  subTypes: SubType[];
  examples: ContentExample[];
  dataStructure: string;
  features: string[];
  retention: RetentionStrategy;
}

export interface SubType {
  id: string;
  name: string;
  description: string;
  frequency: Frequency;
  difficulty: 1 | 2 | 3;  // 구현 난이도
  impact: 1 | 2 | 3 | 4 | 5;  // 재방문 효과
}

export interface ContentExample {
  category: ContentCategory;
  title: string;
  description: string;
  type?: string;
}

export interface RetentionStrategy {
  daily: string[];
  weekly: string[];
  social: string[];
}

// ============================================================================
// 콘텐츠 타입 정의
// ============================================================================

export const CONTENT_TYPES: ContentTypeDefinition[] = [
  // ==========================================================================
  // 퀴즈 (Quiz)
  // ==========================================================================
  {
    id: 'quiz',
    name: '퀴즈',
    description: '정답이 있는 문제. 지식 확인, 재미, 경쟁 요소',
    icon: '🧠',
    color: '#7aa2ff',
    subTypes: [
      {
        id: 'knowledge',
        name: '지식 퀴즈',
        description: '반려동물/심리학 관련 상식 문제',
        frequency: 'daily',
        difficulty: 1,
        impact: 3,
      },
      {
        id: 'personality-based',
        name: '성격 기반 퀴즈',
        description: '특정 성격 유형이 선택할 행동 맞추기',
        frequency: 'daily',
        difficulty: 2,
        impact: 4,
      },
      {
        id: 'chemi',
        name: '케미 퀴즈',
        description: '친구의 테스트 결과를 맞추기 (친구가 정답)',
        frequency: 'once',
        difficulty: 2,
        impact: 5,
      },
      {
        id: 'situational',
        name: '상황 퀴즈',
        description: '"이 상황에서 고양이는 어떻게 할까?" 같은 상황 판단',
        frequency: 'daily',
        difficulty: 1,
        impact: 3,
      },
      {
        id: 'daily',
        name: '오늘의 퀴즈',
        description: '매일 3문제, 스트릭 연동',
        frequency: 'daily',
        difficulty: 1,
        impact: 5,
      },
      {
        id: 'scenario',
        name: '시나리오 퀴즈',
        description: '스토리가 있는 퀴즈 (집사점수, 견주력 등) → 등급/칭호 결과',
        frequency: 'once',
        difficulty: 2,
        impact: 5,
      },
    ],
    examples: [
      // 지식 퀴즈
      { category: 'cat', title: '고양이가 꼬리를 세우면?', description: '기분 좋음/경계/화남 중 선택', type: 'knowledge' },
      { category: 'dog', title: '강아지 간식으로 위험한 것은?', description: '포도/당근/사과 중 선택', type: 'knowledge' },
      { category: 'plant', title: '다육이 물 주기는?', description: '매일/주1회/월1회 중 선택', type: 'knowledge' },
      // 성격 기반
      { category: 'personality', title: '"활기찬 시티보이"는 주말에 뭘 할까?', description: '테스트 결과 기반 행동 예측', type: 'personality-based' },
      { category: 'cat', title: '"도도한 집사님" 고양이의 반응은?', description: '새 장난감 줬을 때 반응 맞추기', type: 'personality-based' },
      // 케미 퀴즈
      { category: 'love', title: '친구 A는 이 상황에서 뭘 선택할까?', description: '친구의 테스트 결과가 정답', type: 'chemi' },
      { category: 'general', title: '우리 케미 얼마나 알아?', description: '친구 초대 → 서로 맞추기', type: 'chemi' },
      // 시나리오 퀴즈 (스토리 + 등급 결과)
      { category: 'cat', title: '🐱 나의 집사 점수는?', description: '초보집사 ~ 프로집사 등급 획득', type: 'scenario' },
      { category: 'cat', title: '🐱 우리 냥이 마음 읽기', description: '고양이 심리 이해도 측정', type: 'scenario' },
      { category: 'cat', title: '🐱 고양이 응급상황 대처력', description: '위기 대응 능력 테스트', type: 'scenario' },
      { category: 'dog', title: '🐕 나의 견주력 테스트', description: '산책왕/훈련사/간식요정 등 칭호', type: 'scenario' },
      { category: 'dog', title: '🐕 댕댕이 언어 해석력', description: '강아지 신호 이해도 점수', type: 'scenario' },
      { category: 'dog', title: '🐕 산책 매너 점수', description: '이상적인 산책 파트너 등급', type: 'scenario' },
      { category: 'rabbit', title: '🐰 토끼 집사 자격시험', description: '초보/중수/고수 등급', type: 'scenario' },
      { category: 'hamster', title: '🐹 햄찌 돌봄 마스터', description: '햄스터 케어 점수', type: 'scenario' },
      { category: 'plant', title: '🌱 식물 킬러 vs 그린썸', description: '식물 관리 능력 진단', type: 'scenario' },
      { category: 'plant', title: '🌱 우리집 식물 생존율은?', description: '식물 돌봄 습관 점수', type: 'scenario' },
      { category: 'love', title: '💕 연애 센스 점수', description: '연애 감각 등급 측정', type: 'scenario' },
      { category: 'love', title: '💕 썸 타기 능력고사', description: '밀당력/센스 점수', type: 'scenario' },
      { category: 'love', title: '💕 장거리 연애 생존력', description: '장거리 적응 점수', type: 'scenario' },
      { category: 'personality', title: '🧠 스트레스 대처 점수', description: '멘탈 관리 능력 측정', type: 'scenario' },
      { category: 'lifestyle', title: '☕ 카페 감별사 등급', description: '커피 지식 + 취향 점수', type: 'scenario' },
    ],
    dataStructure: `interface Quiz {
  id: string;
  type: 'knowledge' | 'personality-based' | 'chemi' | 'daily' | 'situational' | 'scenario';
  category: ContentCategory;
  question: string;
  options: { id: string; text: string; isCorrect?: boolean; points?: number }[];
  explanation?: string;  // 정답 해설
  relatedResult?: string;  // 연관 테스트 결과 (성격 기반 퀴즈용)
  points?: number;  // 획득 포인트
  difficulty: 1 | 2 | 3;
}

// 시나리오 퀴즈 전용
interface ScenarioQuiz {
  id: string;
  category: ContentCategory;
  title: string;           // "나의 집사 점수는?"
  description: string;     // 부제
  emoji: string;           // 대표 이모지
  questions: ScenarioQuestion[];
  results: ScenarioResult[];  // 점수별 등급/칭호
}

interface ScenarioQuestion {
  id: string;
  situation: string;       // 상황 설명
  question: string;        // 질문
  options: {
    id: string;
    text: string;
    points: number;        // 0~10점
    feedback?: string;     // 선택 후 피드백
  }[];
}

interface ScenarioResult {
  minScore: number;        // 최소 점수
  maxScore: number;        // 최대 점수
  grade: string;           // "S", "A", "B", "C", "D" 또는 커스텀
  title: string;           // "프로 집사"
  emoji: string;           // "👑"
  description: string;     // 등급 설명
  tips?: string[];         // 개선 팁
}`,
    features: [
      '정답 즉시 확인 + 해설',
      '점수/랭킹 시스템 연동',
      '오답 시 관련 테스트 추천',
      '스트릭 카운트 연동',
      '시나리오 퀴즈: 점수별 등급/칭호 결과',
      '시나리오 퀴즈: 결과 카드 SNS 공유',
    ],
    retention: {
      daily: ['오늘의 퀴즈 3문제', '연속 정답 보너스'],
      weekly: ['주간 랭킹', '카테고리별 도전', '새 시나리오 퀴즈 출시'],
      social: ['친구와 점수 비교', '케미 퀴즈 초대', '시나리오 등급 자랑하기'],
    },
  },

  // ==========================================================================
  // 투표 (Poll)
  // ==========================================================================
  {
    id: 'poll',
    name: '투표',
    description: '의견을 묻고 결과를 공유. 참여와 궁금증 유발',
    icon: '📊',
    color: '#55e6c1',
    subTypes: [
      {
        id: 'choice',
        name: '선택 투표',
        description: '여러 옵션 중 하나 선택',
        frequency: 'weekly',
        difficulty: 1,
        impact: 3,
      },
      {
        id: 'vs',
        name: 'VS 투표',
        description: '둘 중 하나 선택 (A vs B)',
        frequency: 'daily',
        difficulty: 1,
        impact: 4,
      },
      {
        id: 'ranking',
        name: '랭킹 투표',
        description: '순위 매기기',
        frequency: 'weekly',
        difficulty: 2,
        impact: 3,
      },
      {
        id: 'scale',
        name: '척도 투표',
        description: '1-10 점수로 평가',
        frequency: 'weekly',
        difficulty: 1,
        impact: 2,
      },
    ],
    examples: [
      // 반려동물
      { category: 'cat', title: '습식 vs 건식 어떤 걸 더 좋아해요?', description: 'VS 투표', type: 'vs' },
      { category: 'cat', title: '고양이 장모 vs 단모 취향은?', description: 'VS 투표', type: 'vs' },
      { category: 'dog', title: '산책 하루 몇 번?', description: '1회/2회/3회 이상 선택', type: 'choice' },
      { category: 'dog', title: '강아지 간식 브랜드 뭐 써요?', description: '브랜드 선택', type: 'choice' },
      { category: 'hamster', title: '햄스터 쳇바퀴 필수인가요?', description: 'VS 투표', type: 'vs' },
      // 연애/관계
      { category: 'love', title: '첫 데이트 어디?', description: '카페/맛집/영화/산책 선택', type: 'choice' },
      { category: 'love', title: '연락 빈도 어느 정도가 적당?', description: '선택 투표', type: 'choice' },
      { category: 'love', title: '싸우면 먼저 연락하는 편?', description: 'VS 투표', type: 'vs' },
      // 라이프스타일
      { category: 'plant', title: '물주기 앱 쓰시나요?', description: 'VS 투표', type: 'vs' },
      { category: 'lifestyle', title: '아침형 vs 저녁형?', description: 'VS 투표', type: 'vs' },
      { category: 'lifestyle', title: '재택 vs 출근?', description: 'VS 투표', type: 'vs' },
    ],
    dataStructure: `interface Poll {
  id: string;
  type: 'choice' | 'vs' | 'ranking' | 'scale';
  category: ContentCategory;
  question: string;
  options: { id: string; text: string; emoji?: string }[];
  // 결과 관련
  totalVotes: number;
  results: { optionId: string; count: number; percentage: number }[];
  // 시간 제어
  startAt: Date;
  endAt?: Date;  // 종료 시간 (없으면 영구)
  revealAt?: Date;  // 결과 공개 시간
  // 세그먼트 분석
  segmentResults?: {
    [resultType: string]: { optionId: string; count: number }[];
  };
}`,
    features: [
      '실시간 참여자 수 표시',
      '결과 공개 타이밍 제어 (즉시/시간 후/인원 달성)',
      '성격 유형별 결과 세그먼트',
      '시간별 트렌드 변화',
    ],
    retention: {
      daily: ['"오늘의 투표" 1개', '투표 결과 알림'],
      weekly: ['주간 인기 투표 TOP 5', '시간별 트렌드 리포트'],
      social: ['친구들은 어떻게 투표했을까?', '성격별 투표 결과 비교'],
    },
  },

  // ==========================================================================
  // Q&A (질문/답변)
  // ==========================================================================
  {
    id: 'qna',
    name: 'Q&A',
    description: '질문하고 답변 받기. 선배→후배 연결, 커뮤니티 형성',
    icon: '💬',
    color: '#ffd166',
    subTypes: [
      {
        id: 'ask',
        name: '질문하기',
        description: '궁금한 것 질문',
        frequency: 'once',
        difficulty: 2,
        impact: 4,
      },
      {
        id: 'answer',
        name: '답변하기',
        description: '다른 사람 질문에 답변',
        frequency: 'once',
        difficulty: 2,
        impact: 4,
      },
      {
        id: 'tip',
        name: '팁 공유',
        description: '경험/노하우 공유',
        frequency: 'once',
        difficulty: 2,
        impact: 3,
      },
    ],
    examples: [
      { category: 'cat', title: '첫 고양이로 어떤 품종이 좋을까요?', description: '입양 전 질문' },
      { category: 'cat', title: '고양이가 새벽에 자꾸 깨워요', description: '행동 문제 질문' },
      { category: 'dog', title: '강아지 분리불안 어떻게 해결하셨어요?', description: '경험 공유 요청' },
      { category: 'plant', title: '몬스테라 잎이 노래져요', description: '식물 관리 질문' },
      { category: 'love', title: '썸 타는 중인데 연락 빈도가...', description: '연애 상담' },
    ],
    dataStructure: `interface QnA {
  id: string;
  type: 'question' | 'tip';
  category: ContentCategory;
  title: string;
  content: string;
  authorId: string;
  authorResult?: string;  // 작성자 테스트 결과 (선택 공개)
  // 답변
  answers: Answer[];
  acceptedAnswerId?: string;
  // 메타
  viewCount: number;
  likeCount: number;
  tags: string[];
  createdAt: Date;
}

interface Answer {
  id: string;
  content: string;
  authorId: string;
  authorResult?: string;
  likeCount: number;
  isAccepted: boolean;
  createdAt: Date;
}`,
    features: [
      '카테고리/태그 필터링',
      '답변자 테스트 결과 표시 (신뢰도)',
      '베스트 답변 채택',
      '유사 질문 추천',
    ],
    retention: {
      daily: ['새 질문 알림', '내 질문에 답변 알림'],
      weekly: ['베스트 Q&A TOP 10', '답변왕 뱃지'],
      social: ['같은 결과 유형 사람들의 질문', '선배→후배 멘토링'],
    },
  },
];

// ============================================================================
// 카테고리 정의
// ============================================================================

export interface CategoryDefinition {
  id: ContentCategory;
  name: string;
  icon: string;
  color: string;
  relatedTests: string[];
  pollTopics: string[];
  quizTopics: string[];
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: 'cat',
    name: '고양이',
    icon: '🐱',
    color: '#ff9f43',
    relatedTests: ['cat', 'catBreed'],
    pollTopics: ['사료', '간식', '장난감', '건강', '행동', '품종'],
    quizTopics: ['고양이 상식', '품종 특징', '행동 의미', '건강 관리'],
  },
  {
    id: 'dog',
    name: '강아지',
    icon: '🐕',
    color: '#54a0ff',
    relatedTests: ['dog', 'dogBreed'],
    pollTopics: ['사료', '간식', '산책', '훈련', '건강', '품종'],
    quizTopics: ['강아지 상식', '품종 특징', '훈련법', '건강 관리'],
  },
  {
    id: 'rabbit',
    name: '토끼',
    icon: '🐰',
    color: '#ff6b9d',
    relatedTests: ['rabbit'],
    pollTopics: ['먹이', '케이지', '건초', '건강'],
    quizTopics: ['토끼 상식', '품종', '먹이'],
  },
  {
    id: 'hamster',
    name: '햄스터',
    icon: '🐹',
    color: '#feca57',
    relatedTests: ['hamster'],
    pollTopics: ['먹이', '케이지', '쳇바퀴', '건강'],
    quizTopics: ['햄스터 상식', '품종', '돌봄'],
  },
  {
    id: 'plant',
    name: '식물',
    icon: '🌱',
    color: '#1dd1a1',
    relatedTests: ['plant'],
    pollTopics: ['물주기', '햇빛', '화분', '비료', '품종'],
    quizTopics: ['식물 상식', '관리법', '품종 특징'],
  },
  {
    id: 'love',
    name: '연애',
    icon: '💕',
    color: '#ff6b6b',
    relatedTests: ['idealType', 'conflictStyle'],
    pollTopics: ['데이트', '연락', '선물', '갈등', '이상형'],
    quizTopics: ['연애 심리', '커뮤니케이션', '케미'],
  },
  {
    id: 'personality',
    name: '성격',
    icon: '🧠',
    color: '#7aa2ff',
    relatedTests: ['human'],
    pollTopics: ['성향', '습관', '취향', '가치관'],
    quizTopics: ['심리학 상식', '성격 유형', '행동 패턴'],
  },
  {
    id: 'lifestyle',
    name: '라이프스타일',
    icon: '✨',
    color: '#a29bfe',
    relatedTests: ['coffee', 'petMatch'],
    pollTopics: ['일상', '취미', '음식', '여행'],
    quizTopics: ['트렌드', '라이프해킹'],
  },
  {
    id: 'general',
    name: '일반',
    icon: '💬',
    color: '#636e72',
    relatedTests: [],
    pollTopics: ['기타', '자유'],
    quizTopics: ['일반 상식', '재미'],
  },
];

// ============================================================================
// 결과 공개 전략
// ============================================================================

export interface ResultRevealStrategy {
  id: string;
  name: string;
  description: string;
  trigger: string;
  examples: string[];
}

export const RESULT_REVEAL_STRATEGIES: ResultRevealStrategy[] = [
  {
    id: 'immediate',
    name: '즉시 공개',
    description: '투표 직후 바로 결과 확인',
    trigger: 'onVote',
    examples: ['VS 투표', '간단한 선호도 조사'],
  },
  {
    id: 'time-based',
    name: '시간 기반',
    description: '특정 시간 후 결과 공개',
    trigger: 'scheduledTime',
    examples: ['"내일 오전 10시 공개!"', '"24시간 후 결과 확인"'],
  },
  {
    id: 'participant-based',
    name: '참여자 기반',
    description: '일정 인원 달성 시 공개',
    trigger: 'participantCount',
    examples: ['"50명 더 참여하면 공개!"', '"100명 달성 시 오픈"'],
  },
  {
    id: 'period-based',
    name: '기간 기반',
    description: '투표 기간 종료 후 공개',
    trigger: 'endDate',
    examples: ['주간 투표', '월간 투표'],
  },
];

// ============================================================================
// 트렌드 리포트 설계
// ============================================================================

export interface TrendReport {
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  metrics: TrendMetric[];
}

export interface TrendMetric {
  id: string;
  name: string;
  description: string;
  visualization: 'chart' | 'percentage' | 'ranking' | 'comparison';
}

export const TREND_REPORTS: TrendReport[] = [
  {
    period: 'daily',
    metrics: [
      { id: 'today-hot', name: '오늘의 인기 투표', description: '가장 많이 참여한 투표', visualization: 'ranking' },
      { id: 'today-quiz', name: '오늘의 퀴즈 정답률', description: '전체 정답률', visualization: 'percentage' },
    ],
  },
  {
    period: 'weekly',
    metrics: [
      { id: 'weekly-top', name: '주간 핫 토픽 TOP 5', description: '가장 뜨거웠던 주제', visualization: 'ranking' },
      { id: 'segment-compare', name: '성격별 투표 결과', description: '유형별 응답 차이', visualization: 'comparison' },
      { id: 'trend-change', name: '지난주 vs 이번주', description: '의견 변화 추이', visualization: 'chart' },
    ],
  },
  {
    period: 'monthly',
    metrics: [
      { id: 'monthly-summary', name: '월간 요약', description: '이번 달 주요 트렌드', visualization: 'chart' },
      { id: 'most-discussed', name: '가장 많이 논의된 주제', description: '카테고리별 활동량', visualization: 'ranking' },
    ],
  },
  {
    period: 'quarterly',
    metrics: [
      { id: 'quarterly-trend', name: '분기 트렌드 변화', description: '3개월간 의견 변화', visualization: 'chart' },
      { id: 'seasonal-pattern', name: '시즌별 패턴', description: '계절/시즌 영향', visualization: 'comparison' },
    ],
  },
];

// ============================================================================
// 구현 우선순위 로드맵
// ============================================================================

export interface ContentRoadmapPhase {
  id: string;
  name: string;
  duration: string;
  items: {
    type: ContentType;
    subType: string;
    priority: 'high' | 'medium' | 'low';
    description: string;
  }[];
}

export const CONTENT_ROADMAP: ContentRoadmapPhase[] = [
  {
    id: 'phase-1',
    name: '즉시 (2주)',
    duration: '2주',
    items: [
      { type: 'poll', subType: 'vs', priority: 'high', description: '간단한 VS 투표 5-10개 추가' },
      { type: 'poll', subType: 'choice', priority: 'high', description: '카테고리별 선택 투표' },
      { type: 'quiz', subType: 'knowledge', priority: 'medium', description: '지식 퀴즈 10-20개 작성' },
    ],
  },
  {
    id: 'phase-2',
    name: '단기 (1개월)',
    duration: '1개월',
    items: [
      { type: 'quiz', subType: 'daily', priority: 'high', description: '오늘의 퀴즈 시스템' },
      { type: 'poll', subType: 'ranking', priority: 'medium', description: '랭킹 투표 기능' },
      { type: 'quiz', subType: 'personality-based', priority: 'medium', description: '성격 기반 퀴즈' },
    ],
  },
  {
    id: 'phase-3',
    name: '중기 (2-3개월)',
    duration: '2-3개월',
    items: [
      { type: 'quiz', subType: 'chemi', priority: 'high', description: '케미 퀴즈 (친구 초대)' },
      { type: 'qna', subType: 'ask', priority: 'medium', description: 'Q&A 시스템 기본' },
      { type: 'poll', subType: 'scale', priority: 'low', description: '척도 투표' },
    ],
  },
];

// ============================================================================
// 콘텐츠 수량 예측
// ============================================================================

export interface ContentEstimate {
  category: ContentCategory;
  name: string;
  icon: string;
  scenarioQuiz: { min: number; max: number };
  knowledgeQuiz: { min: number; max: number };
  vsPolls: { min: number; max: number };
  choicePolls: { min: number; max: number };
  ideas: {
    scenarioQuiz: string[];
    vsPolls: string[];
  };
}

export const CONTENT_ESTIMATES: ContentEstimate[] = [
  {
    category: 'cat',
    name: '고양이',
    icon: '🐱',
    scenarioQuiz: { min: 5, max: 8 },
    knowledgeQuiz: { min: 20, max: 30 },
    vsPolls: { min: 10, max: 15 },
    choicePolls: { min: 8, max: 12 },
    ideas: {
      scenarioQuiz: [
        '나의 집사 점수는?',
        '우리 냥이 마음 읽기',
        '고양이 응급상황 대처력',
        '사료 전문가 등급',
        '냥이와의 유대감 점수',
      ],
      vsPolls: [
        '습식 vs 건식',
        '장모 vs 단모',
        '실내 vs 캣휠',
        '캣타워 vs 캣폴',
        '스크래쳐 종류',
      ],
    },
  },
  {
    category: 'dog',
    name: '강아지',
    icon: '🐕',
    scenarioQuiz: { min: 5, max: 8 },
    knowledgeQuiz: { min: 20, max: 30 },
    vsPolls: { min: 10, max: 15 },
    choicePolls: { min: 8, max: 12 },
    ideas: {
      scenarioQuiz: [
        '나의 견주력 테스트',
        '댕댕이 언어 해석력',
        '산책 매너 점수',
        '강아지 훈련 마스터',
        '멍뭉이 건강 지킴이',
      ],
      vsPolls: [
        '아침산책 vs 저녁산책',
        '간식 vs 장난감',
        '목줄 vs 하네스',
        '미용실 vs 셀프',
        '노즈워크 vs 터그놀이',
      ],
    },
  },
  {
    category: 'rabbit',
    name: '토끼',
    icon: '🐰',
    scenarioQuiz: { min: 2, max: 3 },
    knowledgeQuiz: { min: 10, max: 15 },
    vsPolls: { min: 5, max: 8 },
    choicePolls: { min: 4, max: 6 },
    ideas: {
      scenarioQuiz: [
        '토끼 집사 자격시험',
        '토끼 건강 체크 능력',
      ],
      vsPolls: [
        '건초 종류',
        '케이지 vs 울타리',
        '토끼풀 vs 티모시',
      ],
    },
  },
  {
    category: 'hamster',
    name: '햄스터',
    icon: '🐹',
    scenarioQuiz: { min: 2, max: 3 },
    knowledgeQuiz: { min: 10, max: 15 },
    vsPolls: { min: 5, max: 8 },
    choicePolls: { min: 4, max: 6 },
    ideas: {
      scenarioQuiz: [
        '햄찌 돌봄 마스터',
        '햄스터 행동 해석가',
      ],
      vsPolls: [
        '쳇바퀴 종류',
        '모래목욕 vs 물목욕',
        '베딩 종류',
      ],
    },
  },
  {
    category: 'plant',
    name: '식물',
    icon: '🌱',
    scenarioQuiz: { min: 3, max: 5 },
    knowledgeQuiz: { min: 15, max: 20 },
    vsPolls: { min: 8, max: 10 },
    choicePolls: { min: 6, max: 8 },
    ideas: {
      scenarioQuiz: [
        '식물 킬러 vs 그린썸',
        '우리집 식물 생존율은?',
        '식물 응급처치 능력',
      ],
      vsPolls: [
        '물주기 앱 사용',
        '다육이 vs 관엽',
        '흙화분 vs 수경재배',
        '창가 vs 거실',
      ],
    },
  },
  {
    category: 'love',
    name: '연애',
    icon: '💕',
    scenarioQuiz: { min: 5, max: 8 },
    knowledgeQuiz: { min: 15, max: 20 },
    vsPolls: { min: 10, max: 15 },
    choicePolls: { min: 8, max: 12 },
    ideas: {
      scenarioQuiz: [
        '연애 센스 점수',
        '썸 타기 능력고사',
        '장거리 연애 생존력',
        '갈등 해결 능력',
        '데이트 플래너 등급',
      ],
      vsPolls: [
        '밀당 vs 직진',
        '영상통화 vs 문자',
        '먼저 연락 vs 기다림',
        '깜짝 이벤트 vs 계획된 데이트',
        '집데이트 vs 외출',
      ],
    },
  },
  {
    category: 'personality',
    name: '성격',
    icon: '🧠',
    scenarioQuiz: { min: 3, max: 5 },
    knowledgeQuiz: { min: 10, max: 15 },
    vsPolls: { min: 8, max: 10 },
    choicePolls: { min: 5, max: 8 },
    ideas: {
      scenarioQuiz: [
        '스트레스 대처 점수',
        '사회성 테스트',
        '직장 내 케미 점수',
      ],
      vsPolls: [
        '혼자 vs 함께',
        '계획형 vs 즉흥형',
        '아침형 vs 저녁형',
        'T vs F 상황판단',
      ],
    },
  },
  {
    category: 'lifestyle',
    name: '라이프스타일',
    icon: '☕',
    scenarioQuiz: { min: 3, max: 5 },
    knowledgeQuiz: { min: 10, max: 15 },
    vsPolls: { min: 8, max: 10 },
    choicePolls: { min: 5, max: 8 },
    ideas: {
      scenarioQuiz: [
        '카페 감별사 등급',
        '집순이/집돌이 레벨',
        '자취력 테스트',
      ],
      vsPolls: [
        '아메리카노 vs 라떼',
        '재택 vs 출근',
        '배달 vs 직접요리',
        '넷플릭스 vs 유튜브',
      ],
    },
  },
];

// 수량 합계 계산 함수
export function calculateContentTotals() {
  const totals = CONTENT_ESTIMATES.reduce(
    (acc, cat) => ({
      scenarioQuiz: {
        min: acc.scenarioQuiz.min + cat.scenarioQuiz.min,
        max: acc.scenarioQuiz.max + cat.scenarioQuiz.max,
      },
      knowledgeQuiz: {
        min: acc.knowledgeQuiz.min + cat.knowledgeQuiz.min,
        max: acc.knowledgeQuiz.max + cat.knowledgeQuiz.max,
      },
      vsPolls: {
        min: acc.vsPolls.min + cat.vsPolls.min,
        max: acc.vsPolls.max + cat.vsPolls.max,
      },
      choicePolls: {
        min: acc.choicePolls.min + cat.choicePolls.min,
        max: acc.choicePolls.max + cat.choicePolls.max,
      },
    }),
    {
      scenarioQuiz: { min: 0, max: 0 },
      knowledgeQuiz: { min: 0, max: 0 },
      vsPolls: { min: 0, max: 0 },
      choicePolls: { min: 0, max: 0 },
    }
  );

  return {
    ...totals,
    totalContent: {
      min: totals.scenarioQuiz.min + totals.knowledgeQuiz.min + totals.vsPolls.min + totals.choicePolls.min,
      max: totals.scenarioQuiz.max + totals.knowledgeQuiz.max + totals.vsPolls.max + totals.choicePolls.max,
    },
  };
}

// ============================================================================
// 시즌/이벤트 콘텐츠
// ============================================================================

export interface SeasonalContent {
  id: string;
  name: string;
  period: { start: string; end: string };  // "MM-DD" 형식
  icon: string;
  theme: string;  // 테마 컬러 또는 분위기
  quizIdeas: string[];
  pollIdeas: string[];
  tips?: string[];  // 운영 팁
}

export const SEASONAL_CONTENT: SeasonalContent[] = [
  // ========== 연말/겨울 ==========
  {
    id: 'christmas',
    name: '크리스마스',
    period: { start: '12-15', end: '12-26' },
    icon: '🎄',
    theme: 'red-green',
    quizIdeas: [
      '크리스마스 트리 장식 중 반려동물에게 위험한 것은?',
      '포인세티아가 고양이에게 위험한 이유는?',
      '겨울철 강아지 산책 시 주의할 점은?',
      '크리스마스 음식 중 강아지가 먹으면 안 되는 것은?',
    ],
    pollIdeas: [
      '🎄 크리스마스에 받고 싶은 화분은?',
      '🎁 반려동물에게 주고 싶은 선물은?',
      '🎅 산타 코스튬 vs 루돌프 코스튬 (반려동물용)',
      '❄️ 겨울에 우리 집 반려동물이 좋아하는 장소는?',
    ],
    tips: ['포인세티아, 미슬토 등 독성 식물 주의 콘텐츠 강조'],
  },
  {
    id: 'new-year',
    name: '새해',
    period: { start: '12-28', end: '01-07' },
    icon: '🎊',
    theme: 'gold',
    quizIdeas: [
      '새해 불꽃놀이, 반려동물에게 미치는 영향은?',
      '겨울철 고양이 적정 실내 온도는?',
    ],
    pollIdeas: [
      '🎯 새해 반려동물과 함께 하고 싶은 것은?',
      '📅 올해 반려동물에게 해주고 싶은 것 1위는?',
      '🐾 새해 목표: 산책 늘리기 vs 간식 줄이기',
    ],
  },
  {
    id: 'lunar-new-year',
    name: '설날',
    period: { start: '01-20', end: '02-05' },  // 음력 1월 1일 전후, 매년 다름
    icon: '🧧',
    theme: 'red-gold',
    quizIdeas: [
      '설날 음식 중 반려동물에게 위험한 것은?',
      '떡국 재료 중 강아지가 먹으면 안 되는 것은?',
      '명절 폭죽/불꽃놀이가 반려동물에게 미치는 영향은?',
      '긴 연휴 동안 반려동물 스트레스 관리법은?',
    ],
    pollIdeas: [
      '🧧 설 연휴 반려동물과 함께 보내시나요?',
      '🏠 귀성길 반려동물 동반 vs 집에서 대기',
      '🐕 설날 세뱃돈으로 반려동물 뭐 사줄까요?',
      '🧳 연휴 펫시터/펫호텔 이용해보셨나요?',
    ],
    tips: ['추석과 비슷한 주의사항', '명절 음식 주의 강조'],
  },

  // ========== 봄 ==========
  {
    id: 'spring',
    name: '봄맞이',
    period: { start: '03-01', end: '03-31' },
    icon: '🌸',
    theme: 'pink',
    quizIdeas: [
      '봄철 강아지 털갈이 관리법은?',
      '봄에 심기 좋은 반려식물은?',
      '봄나들이 시 반려동물 주의사항은?',
      '진드기가 활발해지는 계절, 예방법은?',
    ],
    pollIdeas: [
      '🌸 봄에 키우기 시작하면 좋은 식물은?',
      '🐶 봄 산책 코스 추천: 공원 vs 산 vs 호수',
      '🌷 봄맞이 화분 구매 계획 있으신가요?',
      '🐱 봄철 털갈이, 어떻게 관리하세요?',
    ],
  },

  // ========== 발렌타인/화이트데이 ==========
  {
    id: 'valentine',
    name: '발렌타인데이',
    period: { start: '02-07', end: '02-15' },
    icon: '💝',
    theme: 'pink-red',
    quizIdeas: [
      '초콜릿이 강아지에게 위험한 이유는?',
      '고양이가 사랑을 표현하는 방법이 아닌 것은?',
      '반려동물과 유대감을 높이는 방법은?',
    ],
    pollIdeas: [
      '💕 반려동물과 발렌타인 데이트 어떻게?',
      '🍫 초콜릿 대신 반려동물에게 줄 간식은?',
      '💘 반려동물이 애정표현하는 방식은?',
      '❤️ 연인에게 반려동물 굿즈 선물한다면?',
    ],
    tips: ['초콜릿 위험성 강조 콘텐츠 필수'],
  },
  {
    id: 'white-day',
    name: '화이트데이',
    period: { start: '03-07', end: '03-15' },
    icon: '🤍',
    theme: 'white',
    quizIdeas: [
      '사탕/캔디류가 반려동물에게 위험한 이유는?',
      '자일리톨이 강아지에게 치명적인 이유는?',
      '반려동물에게 안전한 달콤한 간식은?',
      '고양이가 단맛을 못 느끼는 이유는?',
    ],
    pollIdeas: [
      '🤍 화이트데이 반려동물 선물 뭘로?',
      '🎀 커플 반려동물 매칭템 관심 있으신가요?',
      '🍭 반려동물용 "사탕" 간식 사줄 의향 있으신가요?',
      '💑 연인과 반려동물 함께하는 데이트 코스는?',
      '🐕 커플 반려동물 합사 경험 있으신가요?',
    ],
    tips: ['자일리톨 위험성 강조', '반려동물 동반 데이트 장소 추천'],
  },

  // ========== 여름 ==========
  {
    id: 'summer',
    name: '여름',
    period: { start: '06-15', end: '08-31' },
    icon: '☀️',
    theme: 'blue-yellow',
    quizIdeas: [
      '여름철 강아지 열사병 증상은?',
      '더위에 강한 반려식물은?',
      '고양이 여름철 식욕 저하 대처법은?',
      '반려동물 물놀이 시 주의사항은?',
      '여름철 사료 보관법은?',
    ],
    pollIdeas: [
      '☀️ 더위에 강한 식물 추천은?',
      '🧊 반려동물 더위 식히는 방법은?',
      '🏖️ 여름휴가 때 반려동물은?',
      '💨 에어컨 vs 선풍기, 반려동물 선호는?',
      '🍉 여름 간식으로 수박 주시나요?',
    ],
    tips: ['열사병, 탈수 주의 콘텐츠 강조', '물 섭취량 체크 팁'],
  },
  {
    id: 'vacation',
    name: '휴가 시즌',
    period: { start: '07-15', end: '08-20' },
    icon: '🏖️',
    theme: 'ocean',
    quizIdeas: [
      '반려동물 동반 여행 시 필수 준비물은?',
      '반려동물 맡길 때 체크리스트는?',
      '장거리 이동 시 급여 시간은?',
    ],
    pollIdeas: [
      '🏖️ 휴가 때 반려동물 어떻게 하시나요?',
      '🚗 반려동물 동반 여행 vs 펫시터',
      '✈️ 반려동물 데리고 해외여행 해보셨나요?',
    ],
  },

  // ========== 가을 ==========
  {
    id: 'autumn',
    name: '가을',
    period: { start: '09-15', end: '11-15' },
    icon: '🍂',
    theme: 'orange-brown',
    quizIdeas: [
      '가을철 반려동물 환절기 관리법은?',
      '낙엽 속에 숨은 위험요소는?',
      '가을에 심기 좋은 식물은?',
    ],
    pollIdeas: [
      '🍂 가을 산책 코스 추천은?',
      '🎃 할로윈 코스튬 입히시나요?',
      '🍁 단풍놀이 반려동물 데려가시나요?',
    ],
  },
  {
    id: 'chuseok',
    name: '추석',
    period: { start: '09-01', end: '09-20' },  // 매년 날짜 다름, 대략적 범위
    icon: '🥮',
    theme: 'traditional',
    quizIdeas: [
      '명절 음식 중 반려동물에게 위험한 것은?',
      '송편이 강아지에게 위험한 이유는?',
      '명절 스트레스, 반려동물 증상은?',
    ],
    pollIdeas: [
      '🥮 명절에 반려동물과 함께하시나요?',
      '🚗 귀성길 반려동물 동반 vs 집에서 대기',
      '🏠 명절 손님 많을 때 반려동물 반응은?',
    ],
    tips: ['명절 음식 주의 (양념, 기름기, 뼈 등)', '낯선 사람 스트레스 관리'],
  },

  // ========== 5월 기념일 ==========
  {
    id: 'may-family-month',
    name: '5월 가정의 달',
    period: { start: '05-01', end: '05-15' },
    icon: '👨‍👩‍👧‍👦',
    theme: 'green-pink',
    quizIdeas: [
      '어린이와 반려동물이 함께할 때 주의사항은?',
      '아이에게 반려동물 교감 교육하는 방법은?',
      '반려동물이 아이에게 주는 긍정적 영향은?',
      '노령견/노령묘 건강 체크 포인트는?',
      '부모님 댁 반려동물 선물로 좋은 것은?',
    ],
    pollIdeas: [
      '👶 아이와 반려동물 같이 키우시나요?',
      '🐕 어린이날 아이에게 반려동물 선물 어떻게 생각하세요?',
      '💐 어버이날 부모님 반려동물에게 뭐 사드릴까요?',
      '👴 부모님과 반려동물의 케미는?',
      '🎁 어린이날 아이+반려동물 함께 할 수 있는 활동은?',
    ],
    tips: [
      '어린이와 동물 안전 교육 콘텐츠',
      '노령 동물 건강관리 팁',
      '세대 간 반려동물 케어 차이',
    ],
  },

  // ========== 기념일/이벤트 ==========
  {
    id: 'pet-day',
    name: '동물의 날',
    period: { start: '10-01', end: '10-04' },
    icon: '🐾',
    theme: 'rainbow',
    quizIdeas: [
      '동물의 날은 언제부터 시작됐을까?',
      '반려동물 복지를 위해 할 수 있는 일은?',
    ],
    pollIdeas: [
      '🐾 반려동물에게 가장 해주고 싶은 것은?',
      '💝 동물의 날 기념 특별 간식 주실 건가요?',
      '🏥 정기검진 얼마나 자주 가시나요?',
    ],
  },
  {
    id: 'halloween',
    name: '할로윈',
    period: { start: '10-25', end: '11-01' },
    icon: '🎃',
    theme: 'orange-black',
    quizIdeas: [
      '할로윈 캔디가 반려동물에게 위험한 이유는?',
      '호박이 반려동물에게 안전한가요?',
    ],
    pollIdeas: [
      '🎃 반려동물 할로윈 코스튬 입히시나요?',
      '👻 가장 귀여운 할로윈 코스튬은?',
      '🍬 트릭오어트릿! 반려동물용 간식은?',
    ],
  },
  {
    id: 'pepero-day',
    name: '빼빼로데이',
    period: { start: '11-09', end: '11-12' },
    icon: '🍫',
    theme: 'chocolate',
    quizIdeas: [
      '초콜릿 과자가 반려동물에게 위험한 양은?',
      '카카오 함량에 따른 위험도 차이는?',
      '초콜릿 중독 증상과 응급처치는?',
      '반려동물이 초콜릿 먹었을 때 골든타임은?',
    ],
    pollIdeas: [
      '🍫 빼빼로 대신 반려동물 간식 사주실 건가요?',
      '🐶 막대기 모양 간식 vs 뼈 모양 간식',
      '🦴 덴탈껌 vs 육포 스틱 뭐가 좋아요?',
      '🐱 고양이도 막대기 간식 좋아하나요?',
      '🥢 길쭉한 간식 브랜드 추천해주세요!',
    ],
    tips: [
      '초콜릿 위험성 재강조 (반복 노출 효과)',
      '막대기 모양 반려동물 간식 추천 콘텐츠',
      '덴탈케어 간식 정보',
    ],
  },

  // ========== 특별 시즌 ==========
  {
    id: 'rainy-season',
    name: '장마철',
    period: { start: '06-20', end: '07-20' },
    icon: '🌧️',
    theme: 'gray-blue',
    quizIdeas: [
      '장마철 반려동물 피부 관리법은?',
      '습한 날씨에 사료 보관법은?',
      '비 오는 날 강아지 산책 팁은?',
    ],
    pollIdeas: [
      '🌧️ 비 오는 날 산책 가시나요?',
      '☔ 강아지 우비 사용하시나요?',
      '💧 장마철 실내 놀이 뭐 하시나요?',
    ],
  },
  {
    id: 'cold-wave',
    name: '한파',
    period: { start: '12-01', end: '02-28' },
    icon: '❄️',
    theme: 'ice-blue',
    quizIdeas: [
      '겨울철 강아지 동상 주의 부위는?',
      '실내 적정 온도는?',
      '겨울철 식물 관리 팁은?',
    ],
    pollIdeas: [
      '❄️ 한파에 반려동물 옷 입히시나요?',
      '🧥 반려동물 겨울 패딩 있으신가요?',
      '🔥 난방기구 근처 반려동물 관리는?',
    ],
  },
];

// ============================================================================
// 트렌드/이슈 기반 콘텐츠 (향후 구현)
// ============================================================================

export type TrendSource = 'news' | 'sns' | 'community' | 'search' | 'manual';
export type TrendStatus = 'idea' | 'ready' | 'published' | 'expired';

export interface TrendContent {
  id: string;
  source: TrendSource;
  keyword: string;           // "강아지 수제간식", "고양이 탈출"
  detectedAt: string;        // 발견 일자 (YYYY-MM-DD)
  relevance: ContentCategory[];  // 관련 카테고리
  status: TrendStatus;
  quizIdea?: string;
  pollIdea?: string;
  expiresAt?: string;        // 유효기간 (트렌드는 빨리 식음)
  notes?: string;
  priority?: 'high' | 'medium' | 'low';
}

// 트렌드 소스 정보
export interface TrendSourceInfo {
  id: TrendSource;
  name: string;
  icon: string;
  description: string;
  checkUrl?: string;
  checkFrequency: string;
  keywords: string[];  // 모니터링할 키워드
}

export const TREND_SOURCES: TrendSourceInfo[] = [
  {
    id: 'search',
    name: '검색 트렌드',
    icon: '🔍',
    description: '네이버/구글 실시간 검색어, 연관 검색어',
    checkUrl: 'https://datalab.naver.com/keyword/trendSearch.naver',
    checkFrequency: '주 1-2회',
    keywords: ['반려동물', '고양이', '강아지', '반려식물', '펫', '집사'],
  },
  {
    id: 'sns',
    name: 'SNS 트렌드',
    icon: '📱',
    description: '인스타그램 해시태그, 틱톡 트렌드',
    checkUrl: 'https://www.instagram.com/explore/tags/',
    checkFrequency: '주 1회',
    keywords: ['#고양이스타그램', '#강아지스타그램', '#반려식물', '#펫스타그램', '#집사'],
  },
  {
    id: 'community',
    name: '커뮤니티',
    icon: '💬',
    description: '펫 관련 커뮤니티 인기글, 논쟁 주제',
    checkFrequency: '주 1회',
    keywords: ['사료 추천', '병원 추천', '행동 문제', '신제품'],
  },
  {
    id: 'news',
    name: '뉴스/이슈',
    icon: '📰',
    description: '반려동물 관련 뉴스, 법률/정책 변화',
    checkFrequency: '수시',
    keywords: ['동물보호법', '펫보험', '반려동물 등록', '유기동물'],
  },
  {
    id: 'manual',
    name: '직접 발굴',
    icon: '✨',
    description: '자체 기획, 사용자 제안 등',
    checkFrequency: '상시',
    keywords: [],
  },
];

// 예시 트렌드 콘텐츠 (템플릿)
export const TREND_CONTENT_EXAMPLES: TrendContent[] = [
  {
    id: 'trend-001',
    source: 'news',
    keyword: '반려동물 등록제 의무화',
    detectedAt: '2024-01-15',
    relevance: ['dog', 'cat'],
    status: 'idea',
    quizIdea: '반려동물 등록제, 얼마나 알고 계신가요?',
    pollIdea: '반려동물 등록, 하셨나요?',
    notes: '법률 변경 시 업데이트 필요',
    priority: 'high',
  },
  {
    id: 'trend-002',
    source: 'sns',
    keyword: '고양이 츄르 챌린지',
    detectedAt: '2024-02-01',
    relevance: ['cat'],
    status: 'idea',
    pollIdea: '츄르 챌린지, 해보셨나요?',
    expiresAt: '2024-03-01',
    priority: 'medium',
  },
  {
    id: 'trend-003',
    source: 'community',
    keyword: '수제간식 vs 시판간식',
    detectedAt: '2024-01-20',
    relevance: ['dog', 'cat'],
    status: 'idea',
    pollIdea: '수제간식 vs 시판간식, 어떤 걸 더 선호하세요?',
    quizIdea: '수제간식 만들 때 주의할 점은?',
    priority: 'medium',
  },
];

// 트렌드 운영 가이드
export interface TrendOperationGuide {
  step: number;
  title: string;
  description: string;
  tools?: string[];
  frequency: string;
}

export const TREND_OPERATION_GUIDE: TrendOperationGuide[] = [
  {
    step: 1,
    title: '트렌드 모니터링',
    description: '검색 트렌드, SNS 해시태그, 커뮤니티 인기글 체크',
    tools: ['네이버 데이터랩', '인스타그램 탐색', '펫 커뮤니티'],
    frequency: '주 1-2회',
  },
  {
    step: 2,
    title: '관련성 판단',
    description: '우리 서비스 카테고리와 연결 가능한지 검토',
    frequency: '트렌드 발견 시',
  },
  {
    step: 3,
    title: '콘텐츠 아이디어 기록',
    description: 'TrendContent 형식으로 아이디어 저장',
    frequency: '즉시',
  },
  {
    step: 4,
    title: '콘텐츠 제작',
    description: '퀴즈/투표 형식으로 구체화',
    frequency: '우선순위에 따라',
  },
  {
    step: 5,
    title: '발행 & 만료 관리',
    description: '트렌드 소멸 시 콘텐츠 비활성화',
    frequency: '주 1회 점검',
  },
];

// 현재 날짜 기준 활성화된 시즌 콘텐츠 가져오기
export function getActiveSeasonalContent(date: Date = new Date()): SeasonalContent[] {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const currentDate = `${month}-${day}`;

  return SEASONAL_CONTENT.filter(season => {
    const { start, end } = season.period;

    // 연도를 넘어가는 경우 (예: 12-28 ~ 01-07)
    if (start > end) {
      return currentDate >= start || currentDate <= end;
    }

    return currentDate >= start && currentDate <= end;
  });
}

// 다가오는 시즌 콘텐츠 가져오기 (N일 이내)
export function getUpcomingSeasonalContent(days: number = 14, date: Date = new Date()): SeasonalContent[] {
  const futureDate = new Date(date);
  futureDate.setDate(futureDate.getDate() + days);

  const currentMonth = String(date.getMonth() + 1).padStart(2, '0');
  const currentDay = String(date.getDate()).padStart(2, '0');
  const currentDateStr = `${currentMonth}-${currentDay}`;

  const futureMonth = String(futureDate.getMonth() + 1).padStart(2, '0');
  const futureDay = String(futureDate.getDate()).padStart(2, '0');
  const futureDateStr = `${futureMonth}-${futureDay}`;

  return SEASONAL_CONTENT.filter(season => {
    const { start } = season.period;

    // 현재 이후 ~ N일 이내에 시작하는 시즌
    if (currentDateStr < futureDateStr) {
      return start > currentDateStr && start <= futureDateStr;
    } else {
      // 연도를 넘어가는 경우
      return start > currentDateStr || start <= futureDateStr;
    }
  });
}

// ============================================================================
// 통합 Export
// ============================================================================

export const CONTENT_SYSTEM = {
  types: CONTENT_TYPES,
  categories: CATEGORIES,
  revealStrategies: RESULT_REVEAL_STRATEGIES,
  trendReports: TREND_REPORTS,
  roadmap: CONTENT_ROADMAP,
  estimates: CONTENT_ESTIMATES,
  calculateTotals: calculateContentTotals,
  // 시즌 콘텐츠
  seasonalContent: SEASONAL_CONTENT,
  getActiveSeasonalContent,
  getUpcomingSeasonalContent,
  // 트렌드 콘텐츠
  trendSources: TREND_SOURCES,
  trendExamples: TREND_CONTENT_EXAMPLES,
  trendOperationGuide: TREND_OPERATION_GUIDE,
};

export default CONTENT_SYSTEM;
