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
};

export default CONTENT_SYSTEM;
