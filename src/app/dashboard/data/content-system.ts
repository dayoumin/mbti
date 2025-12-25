// ============================================================================
// 콘텐츠 시스템 데이터
// ============================================================================

// ============================================================================
// 전체 콘텐츠 분류 체계 (5종)
// ============================================================================

/**
 * 앱 전체 콘텐츠 타입 (5종)
 *
 * | 타입      | 분류   | 설명                          | 위치                              |
 * |-----------|--------|-------------------------------|-----------------------------------|
 * | Test      | 메인   | 성향 테스트 (다차원, 5-15분)   | subjects/*.ts                     |
 * | Matching  | 메인   | 궁합 테스트 (2인 호환성)       | subjects/*.ts (type: matching)    |
 * | Quiz      | 참여형 | 지식 퀴즈 (정답 있음, 점수)    | content/quizzes/*.ts              |
 * | Poll      | 참여형 | 투표 (VS, 선택, 정답 없음)     | content/polls/*.ts                |
 * | Reaction  | 스낵   | 상황별 반응 ("이럴 때 나는?")  | content/situation-reactions/*.ts  |
 */
export type AppContentType = 'test' | 'matching' | 'quiz' | 'poll' | 'reaction';

export interface AppContentTypeInfo {
  id: AppContentType;
  name: string;
  category: '메인' | '참여형' | '스낵';
  description: string;
  duration: string;
  location: string;
  icon: string;
}

export const APP_CONTENT_TYPES: AppContentTypeInfo[] = [
  {
    id: 'test',
    name: '테스트',
    category: '메인',
    description: '성향 테스트 (다차원 분석)',
    duration: '5-15분',
    location: 'subjects/*.ts',
    icon: '🧪',
  },
  {
    id: 'matching',
    name: '매칭',
    category: '메인',
    description: '궁합 테스트 (2인 호환성)',
    duration: '3-5분',
    location: 'subjects/*.ts (type: matching)',
    icon: '💕',
  },
  {
    id: 'quiz',
    name: '퀴즈',
    category: '참여형',
    description: '지식 퀴즈 (정답 있음, 점수)',
    duration: '30초-2분',
    location: 'content/quizzes/*.ts',
    icon: '🧠',
  },
  {
    id: 'poll',
    name: '투표',
    category: '참여형',
    description: '투표 (VS, 선택, 정답 없음)',
    duration: '10-30초',
    location: 'content/polls/*.ts',
    icon: '📊',
  },
  {
    id: 'reaction',
    name: '상황반응',
    category: '스낵',
    description: '상황별 반응 ("이럴 때 나는?")',
    duration: '10-30초',
    location: 'content/situation-reactions/*.ts',
    icon: '💬',
  },
];

// ============================================================================
// 참여형 콘텐츠 상세 타입 (Quiz, Poll, Reaction 세부 정의)
// ============================================================================

export type ContentType = 'quiz' | 'poll' | 'qna' | 'system';
export type ContentCategory = 'cat' | 'dog' | 'rabbit' | 'hamster' | 'plant' | 'coffee' | 'wine' | 'love' | 'personality' | 'lifestyle' | 'food' | 'work' | 'money' | 'travel' | 'general';
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
      {
        id: 'situation-reaction',
        name: '상황별 반응 투표',
        description: '상황 제시 → 여러 반응 중 투표 → 성격별 통계',
        frequency: 'daily',
        difficulty: 2,
        impact: 5,
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
      // 상황별 반응 투표
      { category: 'love', title: '3년 사귄 연인이 "거리 두자"고 하면?', description: '상황 반응 투표 + MBTI별 통계', type: 'situation-reaction' },
      { category: 'love', title: '전 애인이 새벽에 "잘 지내?" 하면?', description: '상황 반응 투표 + 성격별 분석', type: 'situation-reaction' },
      { category: 'personality', title: '상사가 내 아이디어를 무시하면?', description: '직장 상황 반응 투표', type: 'situation-reaction' },
      { category: 'personality', title: '동료가 내 공로를 가로채면?', description: '직장 상황 반응 투표', type: 'situation-reaction' },
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
}

// 상황별 반응 투표 전용
interface SituationReaction {
  id: string;
  type: 'situation-reaction';
  category: 'relationship' | 'work' | 'social' | 'awkward';
  situation: string;           // 상황 설명
  question: string;            // "이럴 때 나는?"
  options: {
    id: string;
    text: string;
    emoji: string;
    tag: ReactionTag;          // 반응 유형 분류
  }[];
  personalityMapping?: {       // 성격별 예상 반응 (MBTI/테스트 결과 연동)
    [personalityType: string]: string;  // optionId
  };
  totalVotes?: number;
  tags: string[];
}

type ReactionTag = 'cool' | 'emotional' | 'rational' | 'avoidant' | 'confrontational' | 'humorous' | 'caring' | 'passive';`,
    features: [
      '실시간 참여자 수 표시',
      '결과 공개 타이밍 제어 (즉시/시간 후/인원 달성)',
      '성격 유형별 결과 세그먼트',
      '시간별 트렌드 변화',
      '상황별 반응: MBTI/성격별 통계 비교',
      '상황별 반응: "ENFP는 60%가 A 선택" 인사이트',
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
    id: 'money',
    name: '돈',
    icon: '💰',
    color: '#feca57',
    relatedTests: [],
    pollTopics: ['소비', '저축', '투자', '금융', '가치관'],
    quizTopics: ['금융 상식', '재테크', '소비 심리'],
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
  {
    id: 'phase-4',
    name: '장기 (3-6개월)',
    duration: '3-6개월',
    items: [
      { type: 'system', subType: 'trending', priority: 'high', description: '시대 화두/트렌드 콘텐츠 시스템 (시즌, 이슈, 밈)' },
      { type: 'system', subType: 'recommendation', priority: 'high', description: '추천 알고리즘 고도화 (협업 필터링, 유사도)' },
      { type: 'system', subType: 'viral-stats', priority: 'medium', description: '바이럴 콘텐츠 통계 (참여율, 공유율, 재참여)' },
      { type: 'system', subType: 'revival', priority: 'medium', description: '인기 콘텐츠 주기적 재노출 시스템' },
      { type: 'system', subType: 'age-verification', priority: 'low', description: '연령 변경 시 실명인증 (성인 콘텐츠 접근 악용 방지)' },
    ],
  },
  {
    id: 'phase-deploy',
    name: '배포/프로덕션',
    duration: '프로덕션 전환 시',
    items: [
      { type: 'system', subType: 'dashboard-auth', priority: 'high', description: '대시보드 관리자 인증 (로그인 필요)' },
      { type: 'system', subType: 'dev-tools-hide', priority: 'high', description: '개발 도구 프로덕션 숨김 (연령 테스터 등)' },
      { type: 'system', subType: 'env-config', priority: 'medium', description: '환경변수 기반 기능 토글 (NODE_ENV 활용)' },
      { type: 'system', subType: 'error-monitoring', priority: 'medium', description: '에러 모니터링 설정 (Sentry 등)' },
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
    tips: [
      '새해 다짐 콘텐츠 (건강검진, 다이어트 등)',
      '불꽃놀이 스트레스 대처법 콘텐츠',
      '연말연시 반려동물 케어 체크리스트',
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

  // ========== 4월 ==========
  {
    id: 'cherry-blossom',
    name: '벚꽃/식목일',
    period: { start: '04-01', end: '04-15' },
    icon: '🌳',
    theme: 'pink-green',
    quizIdeas: [
      '반려동물과 벚꽃놀이 시 주의사항은?',
      '벚꽃이 반려동물에게 안전한가요?',
      '식목일에 심기 좋은 반려식물은?',
      '봄꽃 중 반려동물에게 독성이 있는 것은?',
      '봄철 야외활동 후 진드기 체크 방법은?',
    ],
    pollIdeas: [
      '🌸 반려동물과 벚꽃 사진 찍어보셨나요?',
      '🌳 식목일 기념 새 화분 들일 예정인가요?',
      '🐶 봄꽃 명소 반려동물 동반 가능한 곳 추천해주세요!',
      '📸 반려동물 봄 사진 어디서 찍으시나요?',
    ],
    tips: [
      '벚꽃 피는 시기에 맞춘 콘텐츠 발행',
      '식목일(4/5) 전후 식물 콘텐츠 강조',
      '봄꽃 독성 정보 중요 (진달래, 철쭉 등)',
    ],
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

  // ========== 6월 ==========
  {
    id: 'environment-day',
    name: '환경의 날',
    period: { start: '06-01', end: '06-10' },
    icon: '🌍',
    theme: 'green-blue',
    quizIdeas: [
      '친환경 반려동물 용품이란?',
      '반려동물 배변봉투 친환경 대안은?',
      '공기정화 효과가 좋은 반려식물은?',
      '반려동물 사료 포장재 재활용 방법은?',
    ],
    pollIdeas: [
      '🌍 친환경 펫용품 사용하시나요?',
      '♻️ 반려동물 용품 재활용 어떻게 하세요?',
      '🌱 공기정화 식물 키우시나요?',
      '🐕 산책 시 배변봉투 어떤 거 쓰세요?',
      '🌿 친환경 사료/간식 관심 있으신가요?',
    ],
    tips: [
      '환경의 날(6/5) 맞춤 콘텐츠',
      '친환경 펫 브랜드 소개 기회',
      '공기정화 식물 추천 콘텐츠',
    ],
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

// ============================================================================
// 후속 참여 전략 (퀴즈/투표 완료 후 이탈 방지)
// ============================================================================

export type FollowUpTiming = 'immediate' | 'delayed' | 'conditional';
export type FollowUpGoal = 'engagement' | 'viral' | 'retention' | 'ugc';

export interface FollowUpElement {
  id: string;
  name: string;
  description: string;
  timing: FollowUpTiming;
  goal: FollowUpGoal[];
  implementation: string;
  examples: string[];
  viralEffect: 1 | 2 | 3 | 4 | 5;  // 바이럴 효과
  effort: 1 | 2 | 3;  // 구현 난이도
}

export interface FollowUpCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  elements: FollowUpElement[];
}

// 즉시 반응 유도 (결과 화면에서)
export const IMMEDIATE_REACTIONS: FollowUpElement[] = [
  {
    id: 'agree-button',
    name: '"나도!" 공감 버튼',
    description: '결과에 공감 표시 → 공감 수 실시간 표시',
    timing: 'immediate',
    goal: ['engagement', 'viral'],
    implementation: '결과 화면에 "나도 이렇게 생각해" 버튼 + 실시간 카운터',
    examples: [
      '"나도!" 1,234명이 공감했어요',
      '같은 선택 한 사람 N명과 함께해요',
    ],
    viralEffect: 3,
    effort: 1,
  },
  {
    id: 'one-line-comment',
    name: '한줄 코멘트',
    description: '짧은 의견 남기기 → 베스트 댓글 선정',
    timing: 'immediate',
    goal: ['engagement', 'ugc'],
    implementation: '50자 이내 한줄 코멘트 입력창 + 좋아요 기능',
    examples: [
      '"한 마디 남기기" → 베스트 댓글 3개 노출',
      '인기 댓글 작성자에게 포인트 보상',
    ],
    viralEffect: 4,
    effort: 2,
  },
  {
    id: 'related-content',
    name: '관련 콘텐츠 바로가기',
    description: '연관 투표/퀴즈로 자연스러운 이동',
    timing: 'immediate',
    goal: ['retention', 'engagement'],
    implementation: '결과 하단에 "이것도 투표해보세요" 2-3개 추천',
    examples: [
      '습식 vs 건식 투표 후 → "고양이 사료 브랜드 투표"',
      '연애 퀴즈 후 → "연애 스타일 투표"',
    ],
    viralEffect: 2,
    effort: 1,
  },
  {
    id: 'counter-proposal',
    name: '반박 투표 제안',
    description: '"반대 의견 있으면 새 투표 제안하기"',
    timing: 'immediate',
    goal: ['ugc', 'engagement'],
    implementation: '결과 화면에 "다른 의견 제안하기" 버튼',
    examples: [
      '"이 주제로 새 투표 만들기"',
      '"내 의견은 달라요" → 제안 폼으로 이동',
    ],
    viralEffect: 3,
    effort: 2,
  },
];

// 결과 기반 후속 콘텐츠
export const RESULT_BASED_FOLLOWUPS: FollowUpElement[] = [
  {
    id: 'predict-majority',
    name: '다수 의견 예측',
    description: '"다른 사람들은 뭘 선택했을까?" 맞추기',
    timing: 'immediate',
    goal: ['engagement', 'retention'],
    implementation: '투표 전 또는 결과 확인 전 예측 입력 → 맞추면 보너스',
    examples: [
      '"다수 의견 맞추기" → 정답 시 +50P',
      '예측 정확도 누적 → "예언가" 뱃지',
    ],
    viralEffect: 4,
    effort: 2,
  },
  {
    id: 'why-vote',
    name: 'Why 투표',
    description: '선택 이유 묻는 2차 투표',
    timing: 'immediate',
    goal: ['engagement', 'ugc'],
    implementation: '선택 후 "왜 이걸 선택하셨나요?" 이유 선택지 제공',
    examples: [
      'A 선택 이유: 경험상/추천받아서/직감으로...',
      '이유별 분포 그래프 제공',
    ],
    viralEffect: 3,
    effort: 2,
  },
  {
    id: 'reversal-quiz',
    name: '반전 퀴즈',
    description: '"근데 실제로는..." 정보 제공 후 재투표',
    timing: 'immediate',
    goal: ['engagement', 'viral'],
    implementation: '투표 결과 후 관련 팩트 제공 → "알고도 같은 선택?" 재투표',
    examples: [
      '"실제로 수의사 추천은 B입니다" → 의견 바뀌셨나요?',
      '재투표 결과 vs 원래 결과 비교',
    ],
    viralEffect: 5,
    effort: 2,
  },
  {
    id: 'segment-result',
    name: '유형별 결과 비교',
    description: '성격/테스트 결과별 투표 결과 세그먼트',
    timing: 'immediate',
    goal: ['engagement', 'viral'],
    implementation: '투표 결과를 테스트 유형별로 분류 → "ENFP는 70%가 A 선택"',
    examples: [
      '"당신과 같은 유형은 A를 더 선호해요"',
      '"I 유형 vs E 유형 투표 결과가 이렇게 달라요"',
    ],
    viralEffect: 5,
    effort: 3,
  },
  {
    id: 'minority-highlight',
    name: '소수 의견 하이라이트',
    description: '소수 선택자에게 특별 메시지',
    timing: 'immediate',
    goal: ['engagement', 'viral'],
    implementation: '10% 이하 선택지 선택 시 "당신은 특별해요" 메시지',
    examples: [
      '"단 8%만 이걸 선택했어요. 당신의 이유는?"',
      '소수 의견 공유 시 특별 카드 제공',
    ],
    viralEffect: 4,
    effort: 1,
  },
];

// 소셜 연결 요소
export const SOCIAL_CONNECTIONS: FollowUpElement[] = [
  {
    id: 'friend-tag',
    name: '친구 태그',
    description: '"이 결과 보여주고 싶은 사람?" 태그 유도',
    timing: 'immediate',
    goal: ['viral'],
    implementation: '결과 화면에 "누구에게 보여줄까?" 공유 버튼',
    examples: [
      '"이 결과, 누구 생각나요?"',
      '카카오톡/인스타 스토리 멘션 유도',
    ],
    viralEffect: 5,
    effort: 1,
  },
  {
    id: 'opinion-battle',
    name: '의견 대결',
    description: '친구 초대해서 의견 대결',
    timing: 'immediate',
    goal: ['viral', 'engagement'],
    implementation: '링크 공유 → 친구 참여 → 둘의 선택 비교 결과',
    examples: [
      '"친구와 의견 대결!" → 링크 공유',
      '둘의 선택이 같으면 "찰떡궁합!", 다르면 "토론해보세요!"',
    ],
    viralEffect: 5,
    effort: 3,
  },
  {
    id: 'same-choice-community',
    name: '같은 선택 커뮤니티',
    description: '같은 선택을 한 사람들 연결',
    timing: 'immediate',
    goal: ['retention', 'engagement'],
    implementation: '"A 선택한 N명" 클릭 → 그들의 댓글/프로필 보기',
    examples: [
      '"같은 선택 한 1,234명의 이유 보기"',
      '같은 선택자들만의 미니 토론방',
    ],
    viralEffect: 3,
    effort: 3,
  },
  {
    id: 'challenge-invite',
    name: '챌린지 초대',
    description: '"나보다 잘 맞출 수 있어?" 도전 유도',
    timing: 'immediate',
    goal: ['viral'],
    implementation: '퀴즈 점수 기반 친구 도전장 보내기',
    examples: [
      '"나는 8/10 맞았어. 도전해볼래?"',
      '친구 점수 vs 내 점수 비교 결과',
    ],
    viralEffect: 5,
    effort: 2,
  },
];

// 시간차 참여 유도
export const DELAYED_ENGAGEMENTS: FollowUpElement[] = [
  {
    id: 'result-change-alert',
    name: '결과 변화 알림',
    description: '투표 결과가 뒤집히면 알림',
    timing: 'delayed',
    goal: ['retention', 'engagement'],
    implementation: '결과 역전 시 참여자에게 푸시/알림',
    examples: [
      '"투표 결과가 뒤집혔어요! 확인해보세요"',
      '"당신의 선택이 이제 다수 의견이 됐어요!"',
    ],
    viralEffect: 4,
    effort: 2,
  },
  {
    id: 'followup-poll-alert',
    name: '후속 투표 알림',
    description: '관련 새 투표 등록 시 알림',
    timing: 'delayed',
    goal: ['retention'],
    implementation: '참여한 투표와 관련된 새 투표 → 알림 발송',
    examples: [
      '"습식 vs 건식" 참여자 → "사료 브랜드 투표" 알림',
      '"이 주제 관심 있으셨죠? 새 투표 왔어요"',
    ],
    viralEffect: 3,
    effort: 2,
  },
  {
    id: 'best-comment-alert',
    name: '베스트 댓글 알림',
    description: '내 댓글이 인기 댓글 되면 알림',
    timing: 'conditional',
    goal: ['retention', 'engagement'],
    implementation: '좋아요 N개 이상 시 알림 + 포인트 지급',
    examples: [
      '"당신의 댓글이 인기 댓글! +100P"',
      '"50명이 당신의 의견에 공감했어요"',
    ],
    viralEffect: 4,
    effort: 2,
  },
  {
    id: 'weekly-recap',
    name: '주간 참여 리캡',
    description: '이번 주 참여 요약 + 다음 주 추천',
    timing: 'delayed',
    goal: ['retention'],
    implementation: '주 1회 참여 통계 + 놓친 인기 투표 + 다음 주 예고',
    examples: [
      '"이번 주 5개 투표 참여! 상위 10%입니다"',
      '"놓친 인기 투표 3개, 지금 참여해보세요"',
    ],
    viralEffect: 2,
    effort: 2,
  },
  {
    id: 'streak-reminder',
    name: '스트릭 유지 알림',
    description: '연속 참여 끊기기 전 리마인드',
    timing: 'conditional',
    goal: ['retention'],
    implementation: '오늘 참여 없으면 저녁에 리마인드 알림',
    examples: [
      '"7일 연속 참여 중! 오늘도 1분 투표해요"',
      '"스트릭 끊기기 3시간 전! 지금 참여하기"',
    ],
    viralEffect: 1,
    effort: 1,
  },
];

// 후속 참여 전략 카테고리
export const FOLLOWUP_CATEGORIES: FollowUpCategory[] = [
  {
    id: 'immediate-reaction',
    name: '즉시 반응 유도',
    description: '결과 화면에서 바로 다음 행동 유도',
    icon: '⚡',
    color: '#7aa2ff',
    elements: IMMEDIATE_REACTIONS,
  },
  {
    id: 'result-based',
    name: '결과 기반 후속',
    description: '투표/퀴즈 결과를 활용한 추가 참여',
    icon: '🎯',
    color: '#55e6c1',
    elements: RESULT_BASED_FOLLOWUPS,
  },
  {
    id: 'social-connection',
    name: '소셜 연결',
    description: '친구/커뮤니티와 연결하여 바이럴 유도',
    icon: '🔗',
    color: '#ff6b9d',
    elements: SOCIAL_CONNECTIONS,
  },
  {
    id: 'delayed-engagement',
    name: '시간차 참여',
    description: '재방문 유도를 위한 알림/리마인드',
    icon: '⏰',
    color: '#ffd166',
    elements: DELAYED_ENGAGEMENTS,
  },
];

// 후속 참여 구현 우선순위
export interface FollowUpRoadmapItem {
  phase: string;
  duration: string;
  items: {
    elementId: string;
    name: string;
    priority: 'high' | 'medium' | 'low';
    reason: string;
  }[];
}

export const FOLLOWUP_ROADMAP: FollowUpRoadmapItem[] = [
  {
    phase: 'Phase 1: 즉시 도입',
    duration: '2주',
    items: [
      { elementId: 'agree-button', name: '"나도!" 공감 버튼', priority: 'high', reason: '구현 쉬움 + 즉시 효과' },
      { elementId: 'related-content', name: '관련 콘텐츠 바로가기', priority: 'high', reason: '체류시간 증가' },
      { elementId: 'friend-tag', name: '친구 태그', priority: 'high', reason: '바이럴 핵심' },
      { elementId: 'minority-highlight', name: '소수 의견 하이라이트', priority: 'medium', reason: '공유 유도' },
    ],
  },
  {
    phase: 'Phase 2: 단기 도입',
    duration: '1개월',
    items: [
      { elementId: 'one-line-comment', name: '한줄 코멘트', priority: 'high', reason: 'UGC 핵심' },
      { elementId: 'segment-result', name: '유형별 결과 비교', priority: 'high', reason: '테스트 연동 시너지' },
      { elementId: 'reversal-quiz', name: '반전 퀴즈', priority: 'medium', reason: '놀람 요소 → 공유' },
      { elementId: 'challenge-invite', name: '챌린지 초대', priority: 'medium', reason: '바이럴 효과 높음' },
    ],
  },
  {
    phase: 'Phase 3: 중기 도입',
    duration: '2-3개월',
    items: [
      { elementId: 'opinion-battle', name: '의견 대결', priority: 'high', reason: '친구 간 바이럴 핵심' },
      { elementId: 'predict-majority', name: '다수 의견 예측', priority: 'medium', reason: '게임성 강화' },
      { elementId: 'result-change-alert', name: '결과 변화 알림', priority: 'medium', reason: '재방문 유도' },
      { elementId: 'best-comment-alert', name: '베스트 댓글 알림', priority: 'medium', reason: 'UGC 보상' },
    ],
  },
  {
    phase: 'Phase 4: 장기 도입',
    duration: '3개월+',
    items: [
      { elementId: 'same-choice-community', name: '같은 선택 커뮤니티', priority: 'low', reason: '커뮤니티 기능 필요' },
      { elementId: 'why-vote', name: 'Why 투표', priority: 'low', reason: '심층 데이터 수집' },
      { elementId: 'counter-proposal', name: '반박 투표 제안', priority: 'low', reason: 'UGC 고도화' },
      { elementId: 'weekly-recap', name: '주간 참여 리캡', priority: 'low', reason: '알림 시스템 필요' },
    ],
  },
];

// 후속 참여 전략 통합
export const FOLLOWUP_STRATEGY = {
  categories: FOLLOWUP_CATEGORIES,
  roadmap: FOLLOWUP_ROADMAP,
  // 모든 요소 flat 리스트
  allElements: [
    ...IMMEDIATE_REACTIONS,
    ...RESULT_BASED_FOLLOWUPS,
    ...SOCIAL_CONNECTIONS,
    ...DELAYED_ENGAGEMENTS,
  ],
  // 바이럴 효과 높은 순
  getHighViralElements: () => [
    ...IMMEDIATE_REACTIONS,
    ...RESULT_BASED_FOLLOWUPS,
    ...SOCIAL_CONNECTIONS,
    ...DELAYED_ENGAGEMENTS,
  ].filter(e => e.viralEffect >= 4).sort((a, b) => b.viralEffect - a.viralEffect),
  // 구현 쉬운 순
  getEasyToImplement: () => [
    ...IMMEDIATE_REACTIONS,
    ...RESULT_BASED_FOLLOWUPS,
    ...SOCIAL_CONNECTIONS,
    ...DELAYED_ENGAGEMENTS,
  ].filter(e => e.effort === 1).sort((a, b) => b.viralEffect - a.viralEffect),
};

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
// DB 마이그레이션 현황 (2024-12-23)
// ============================================================================

export interface DbTable {
  name: string;
  description: string;
  pkType: 'TEXT' | 'INTEGER';
  jsonFields: string[];
  indexes: string[];
  status: 'active' | 'planned';
}

export interface DbMigration {
  version: string;
  date: string;
  tables: DbTable[];
  views: string[];
  testCount: { service: number; api: number };
  features: string[];
}

export const CONTENT_DB_MIGRATION: DbMigration = {
  version: '001',
  date: '2024-12-23',
  tables: [
    {
      name: 'quizzes',
      description: '지식/상황/성격 기반 퀴즈',
      pkType: 'TEXT',
      jsonFields: ['options', 'tags'],
      indexes: ['category', 'type', 'status'],
      status: 'active',
    },
    {
      name: 'scenario_quizzes',
      description: '여러 문제 → 종합 등급 (집사력 테스트 등)',
      pkType: 'TEXT',
      jsonFields: ['questions', 'results'],
      indexes: ['category', 'status'],
      status: 'active',
    },
    {
      name: 'polls',
      description: 'VS/선택/랭킹/스케일 투표',
      pkType: 'TEXT',
      jsonFields: ['options', 'tags'],
      indexes: ['category', 'type', 'status'],
      status: 'active',
    },
    {
      name: 'tournaments',
      description: '월드컵/브래킷 토너먼트',
      pkType: 'TEXT',
      jsonFields: ['contestants', 'result_config'],
      indexes: ['category', 'status'],
      status: 'active',
    },
  ],
  views: ['v_quiz_stats', 'v_poll_stats'],
  testCount: { service: 45, api: 58 },
  features: [
    'DB 우선 조회, 코드 폴백',
    'Soft delete (status = hidden)',
    'API 인증 (세션 + Bearer 토큰)',
    '페이지네이션 (limit/offset)',
  ],
};

export const CONTENT_API_ENDPOINTS = [
  { method: 'GET', path: '/api/content?type=quiz', description: '목록 조회', auth: false },
  { method: 'GET', path: '/api/content?type=quiz&id=xxx', description: '단일 조회', auth: false },
  { method: 'POST', path: '/api/content', description: '생성 (관리자)', auth: true },
  { method: 'PUT', path: '/api/content', description: '수정 (관리자)', auth: true },
  { method: 'DELETE', path: '/api/content?type=quiz&id=xxx', description: '삭제 (관리자)', auth: true },
];

// ============================================================================
// 개인화 추천 시스템 (2024-12-23 구현)
// ============================================================================

export interface RecommendationWeight {
  factor: string;
  weight: number;
  description: string;
}

export interface DifficultyRule {
  accuracyRange: string;
  difficulty: 1 | 2 | 3;
  label: string;
}

export interface AgeRestriction {
  category: string;
  minAge: string;
  reason: string;
}

export interface RecommendationRoadmapItem {
  phase: number;
  status: 'done' | 'planned';
  feature: string;
}

export const RECOMMENDATION_SYSTEM = {
  // 추천 점수 계산 가중치
  weights: [
    { factor: 'categoryEngagement', weight: 0.4, description: '카테고리 참여도 - 많이 참여한 카테고리 우선' },
    { factor: 'tagMatch', weight: 0.3, description: '태그 매칭 - 관심 태그가 포함된 콘텐츠 우선' },
    { factor: 'difficultyFit', weight: 0.2, description: '난이도 적합성 - 사용자 정답률에 맞는 난이도' },
    { factor: 'freshness', weight: 0.1, description: '신규 콘텐츠 보너스 - 새 카테고리에 기회 부여' },
  ] as RecommendationWeight[],

  // 난이도 자동 조정 규칙
  difficultyRules: [
    { accuracyRange: '80% 이상', difficulty: 3, label: '어려운 문제' },
    { accuracyRange: '50-80%', difficulty: 2, label: '중간 난이도' },
    { accuracyRange: '50% 미만', difficulty: 1, label: '쉬운 문제' },
  ] as DifficultyRule[],

  // 연령 제한 콘텐츠
  ageRestrictions: [
    { category: 'alcohol', minAge: '20대', reason: '주류 관련 콘텐츠는 성인만' },
  ] as AgeRestriction[],

  // 사용자 선호도 데이터 구조
  userPreferenceSchema: {
    categoryEngagement: 'Record<카테고리, { quizCount, pollCount, correctCount, lastEngagedAt }>',
    tagInterest: 'Record<태그, 참여횟수>',
    preferredDifficulty: '1 | 2 | 3 (자동 조정)',
  },

  // 추천 로직 흐름
  recommendationFlow: [
    '1. 연령 제한 필터링 (DemographicService)',
    '2. 추천 점수 계산 (가중치 적용)',
    '3. 점수순 정렬',
    '4. 상위 N*2개 선택',
    '5. 랜덤 셔플 (다양성 확보)',
    '6. 최종 N개 반환',
  ],

  // 저장소
  storage: {
    key: 'chemi_user_preference',
    location: 'localStorage',
    serverSync: false, // 추후 로그인 사용자 동기화 예정
  },

  // 구현 파일
  implementedFiles: [
    'src/services/UserPreferenceService.ts',
    'src/components/TodayQuizPoll.tsx',
    'src/services/DemographicService.ts (연령 제한)',
  ],

  // 콘텐츠 유사도 기반 추천 (Phase 1)
  similarityRecommendation: {
    algorithm: 'Jaccard 유사도',
    formula: '|A ∩ B| / |A ∪ B|',
    weights: {
      tagSimilarity: 0.7,    // 태그 교집합/합집합
      categoryMatch: 0.3,    // 같은 카테고리면 1, 아니면 0
    },
    flow: [
      '1. 사용자 참여 콘텐츠 목록 확인',
      '2. 각 미참여 콘텐츠와 참여 콘텐츠 간 유사도 계산',
      '3. 최대 유사도 * 0.7 + 평균 유사도 * 0.3 = 최종 점수',
      '4. 점수 0.1 이상만 추천',
      '5. 점수순 정렬 후 상위 N개 반환',
    ],
    implementedFiles: [
      'src/services/ContentRecommendationService.ts',
    ],
    testFile: 'scripts/test-recommendation.mjs',
    serverCost: '$0 (클라이언트 계산)',
  },

  // tags 필수 규칙
  tagsRequirement: {
    minCount: 3,
    language: '한글',
    purpose: '추천 시스템 유사도 계산',
    validation: 'scripts/validate-content-structure.mjs',
    examples: {
      good: ['고양이', '품종', '성격', '입양'],
      bad: ['cat', '퀴즈', '동물'],
    },
  },

  // 향후 개선 계획
  roadmap: [
    { phase: 1, status: 'done', feature: '카테고리/태그 기반 추천' },
    { phase: 1, status: 'done', feature: '난이도 자동 조정' },
    { phase: 1, status: 'done', feature: '연령 제한 필터링' },
    { phase: 1, status: 'done', feature: '태그 기반 Jaccard 유사도 추천' },
    { phase: 1, status: 'done', feature: 'tags 필수화 (검증 스크립트)' },
    { phase: 2, status: 'planned', feature: '서버 사이드 선호도 저장' },
    { phase: 2, status: 'planned', feature: '협업 필터링 ("이 퀴즈를 푼 사람들이...")' },
    { phase: 3, status: 'planned', feature: '시간대별 추천 (아침/저녁 콘텐츠)' },
    { phase: 3, status: 'planned', feature: 'A/B 테스트 기반 가중치 튜닝' },
  ] as RecommendationRoadmapItem[],
};

// ============================================================================
// ============================================================================
// 콘텐츠 연령 등급 가이드라인
// ============================================================================

export interface AgeRatingGuide {
  rating: 'all' | 'kids' | 'adult';
  description: string;
  examples: string[];
  metaExample: string;
}

export const AGE_RATING_GUIDE: AgeRatingGuide[] = [
  {
    rating: 'all',
    description: '전체 이용가 (기본값). 모든 연령대에 적합한 콘텐츠.',
    examples: [
      '일반 동물 퀴즈',
      '성격 테스트',
      '취향 투표 (음식, 취미 등)',
    ],
    metaExample: `meta: { ageRating: 'all' }  // 생략 가능 (기본값)`,
  },
  {
    rating: 'kids',
    description: '어린이 특화. 10대 사용자에게 우선 노출 (30% 부스트).',
    examples: [
      '귀여운 동물 캐릭터 퀴즈',
      '간단한 OX 퀴즈',
      '캐릭터 이름 맞추기',
      '동물 소리 퀴즈',
    ],
    metaExample: `meta: { ageRating: 'kids' }`,
  },
  {
    rating: 'adult',
    description: '성인 전용. 10대 및 연령 미확인 사용자에게 노출되지 않음.',
    examples: [
      '술 관련 콘텐츠 (와인 매칭, 맥주 투표 등)',
      '도박 관련 콘텐츠',
    ],
    metaExample: `meta: { ageRating: 'adult', ageRestrictionReason: 'alcohol' }`,
  },
];

/**
 * 콘텐츠 생성 시 연령 등급 결정 가이드
 */
export const AGE_RATING_DECISION_GUIDE = {
  title: '연령 등급 결정 가이드',
  description: '콘텐츠 생성 시 아래 기준으로 연령 등급을 결정합니다.',
  rules: [
    {
      condition: '술/주류 관련 콘텐츠',
      rating: 'adult' as const,
      reason: 'alcohol',
    },
    {
      condition: '도박/베팅 관련 콘텐츠',
      rating: 'adult' as const,
      reason: 'gambling',
    },
    {
      condition: '귀여운 캐릭터/동물 중심 콘텐츠',
      rating: 'kids' as const,
      reason: null,
    },
    {
      condition: '단순한 OX 퀴즈, 동물 소리/이름 맞추기',
      rating: 'kids' as const,
      reason: null,
    },
    {
      condition: '그 외 일반 콘텐츠',
      rating: 'all' as const,
      reason: null,
    },
  ],
  notes: [
    '연애 관련 콘텐츠는 all 등급 (10대도 관심 있는 주제)',
    '직장/업무 콘텐츠도 all 등급 (10대에게는 추천 우선순위만 낮춤)',
    'kids 등급은 10대에게 30% 추천 점수 부스트',
  ],
};

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
  // 후속 참여 전략
  followUpStrategy: FOLLOWUP_STRATEGY,
  followUpCategories: FOLLOWUP_CATEGORIES,
  followUpRoadmap: FOLLOWUP_ROADMAP,
  // DB 마이그레이션
  dbMigration: CONTENT_DB_MIGRATION,
  apiEndpoints: CONTENT_API_ENDPOINTS,
  // 개인화 추천 시스템
  recommendation: RECOMMENDATION_SYSTEM,
  // 연령 등급 가이드
  ageRatingGuide: AGE_RATING_GUIDE,
  ageRatingDecisionGuide: AGE_RATING_DECISION_GUIDE,
};

export default CONTENT_SYSTEM;
