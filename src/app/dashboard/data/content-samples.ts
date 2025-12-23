// ============================================================================
// 콘텐츠 샘플 데이터 (퀴즈/투표/토너먼트)
// Agent 생성 전 수동 테스트용
// ============================================================================

import { ContentCategory } from './content-system';

// ============================================================================
// 퀴즈 타입 정의
// ============================================================================

export type QuizType = 'knowledge' | 'personality-based' | 'situational' | 'scenario';
export type QuizDifficulty = 1 | 2 | 3;

/**
 * 일반 퀴즈 (지식/상황/성격 기반)
 */
export interface Quiz {
  id: string;
  type: QuizType;
  category: ContentCategory;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect?: boolean;   // knowledge 타입용
    points?: number;       // scenario 타입용
  }[];
  explanation?: string;    // 정답 해설
  relatedResult?: string;  // 연관 테스트 결과 (성격 기반 퀴즈용)
  difficulty: QuizDifficulty;
  points?: number;         // 획득 포인트
  tags?: string[];
}

/**
 * 시나리오 퀴즈 (여러 문제 → 종합 등급)
 */
export interface ScenarioQuiz {
  id: string;
  category: ContentCategory;
  title: string;
  subtitle?: string;
  emoji: string;
  themeColor: string;
  questions: {
    id: string;
    situation?: string;    // 상황 설명
    question: string;
    options: {
      id: string;
      text: string;
      points: number;      // 0~10점
      feedback?: string;   // 선택 후 피드백
    }[];
  }[];
  results: {
    minScore: number;
    maxScore: number;
    grade: string;         // "S", "A", "B", "C", "D" 또는 커스텀
    title: string;         // "프로 집사"
    emoji: string;
    description: string;
    tips?: string[];       // 개선 팁
  }[];
}

// ============================================================================
// 투표 타입 정의
// ============================================================================

export type PollType = 'vs' | 'choice' | 'ranking' | 'scale';

export interface Poll {
  id: string;
  type: PollType;
  category: ContentCategory;
  question: string;
  options: {
    id: string;
    text: string;
    emoji?: string;
  }[];
  // 결과 관련 (실제 사용 시)
  totalVotes?: number;
  tags?: string[];
}

// ============================================================================
// 샘플: 고양이 지식 퀴즈 10개
// ============================================================================

export const CAT_KNOWLEDGE_QUIZZES: Quiz[] = [
  {
    id: 'cat-quiz-001',
    type: 'knowledge',
    category: 'cat',
    question: '고양이가 꼬리를 세우고 다가오면?',
    options: [
      { id: 'a', text: '기분이 좋다', isCorrect: true },
      { id: 'b', text: '화가 났다', isCorrect: false },
      { id: 'c', text: '겁을 먹었다', isCorrect: false },
    ],
    explanation: '꼬리를 세우고 끝만 살짝 구부리면 반가움과 호감의 표시예요!',
    difficulty: 1,
    points: 10,
    tags: ['행동', '바디랭귀지'],
  },
  {
    id: 'cat-quiz-002',
    type: 'knowledge',
    category: 'cat',
    question: '고양이에게 가장 위험한 식물은?',
    options: [
      { id: 'a', text: '백합', isCorrect: true },
      { id: 'b', text: '로즈마리', isCorrect: false },
      { id: 'c', text: '바질', isCorrect: false },
    ],
    explanation: '백합은 고양이에게 치명적! 꽃가루만 핥아도 급성 신부전을 일으킬 수 있어요.',
    difficulty: 2,
    points: 20,
    tags: ['건강', '독성식물', '응급'],
  },
  {
    id: 'cat-quiz-003',
    type: 'knowledge',
    category: 'cat',
    question: '고양이가 그루밍을 하루에 몇 시간 할까요?',
    options: [
      { id: 'a', text: '약 1시간', isCorrect: false },
      { id: 'b', text: '약 3-4시간', isCorrect: true },
      { id: 'c', text: '약 6시간 이상', isCorrect: false },
    ],
    explanation: '고양이는 하루 일과의 약 30-50%를 그루밍에 사용해요. 청결뿐 아니라 체온조절과 스트레스 해소 역할도 해요.',
    difficulty: 2,
    points: 15,
    tags: ['습성', '그루밍'],
  },
  {
    id: 'cat-quiz-004',
    type: 'knowledge',
    category: 'cat',
    question: '고양이가 "야옹"하고 우는 대상은?',
    options: [
      { id: 'a', text: '다른 고양이에게만', isCorrect: false },
      { id: 'b', text: '주로 인간에게', isCorrect: true },
      { id: 'c', text: '모든 동물에게', isCorrect: false },
    ],
    explanation: '성묘끼리는 거의 야옹하지 않아요! 인간과 소통하기 위해 발달시킨 특별한 언어예요.',
    difficulty: 2,
    points: 20,
    tags: ['소통', '습성'],
  },
  {
    id: 'cat-quiz-005',
    type: 'knowledge',
    category: 'cat',
    question: '고양이 화장실 개수 공식은?',
    options: [
      { id: 'a', text: '고양이 수 = 화장실 수', isCorrect: false },
      { id: 'b', text: '고양이 수 + 1 = 화장실 수', isCorrect: true },
      { id: 'c', text: '층 수 = 화장실 수', isCorrect: false },
    ],
    explanation: 'N+1 법칙! 고양이 2마리면 화장실 3개가 이상적이에요. 영역 스트레스를 줄여줘요.',
    difficulty: 1,
    points: 10,
    tags: ['돌봄', '화장실'],
  },
  {
    id: 'cat-quiz-006',
    type: 'knowledge',
    category: 'cat',
    question: '고양이가 "골골" 소리를 내는 이유는?',
    options: [
      { id: 'a', text: '기분이 좋을 때만', isCorrect: false },
      { id: 'b', text: '기분 좋을 때 + 불안/아플 때도', isCorrect: true },
      { id: 'c', text: '배고플 때만', isCorrect: false },
    ],
    explanation: '골골송은 행복뿐 아니라 자기 치유 효과도 있어요! 아프거나 불안할 때도 스스로 진정시키려고 해요.',
    difficulty: 2,
    points: 15,
    tags: ['소리', '골골', '습성'],
  },
  {
    id: 'cat-quiz-007',
    type: 'knowledge',
    category: 'cat',
    question: '고양이의 정상 체온은?',
    options: [
      { id: 'a', text: '36-37°C', isCorrect: false },
      { id: 'b', text: '38-39°C', isCorrect: true },
      { id: 'c', text: '40-41°C', isCorrect: false },
    ],
    explanation: '고양이 정상 체온은 38~39.2°C로 사람보다 높아요. 39.5°C 이상이면 발열 의심!',
    difficulty: 2,
    points: 15,
    tags: ['건강', '체온'],
  },
  {
    id: 'cat-quiz-008',
    type: 'knowledge',
    category: 'cat',
    question: '고양이가 "느린 눈 깜빡임"을 하면?',
    options: [
      { id: 'a', text: '졸린 것이다', isCorrect: false },
      { id: 'b', text: '사랑한다는 표현', isCorrect: true },
      { id: 'c', text: '눈이 아프다', isCorrect: false },
    ],
    explanation: '느린 깜빡임은 "고양이 키스"라고 불려요! 신뢰와 애정의 표시예요. 같이 해보세요!',
    difficulty: 1,
    points: 10,
    tags: ['소통', '바디랭귀지', '애정'],
  },
  {
    id: 'cat-quiz-009',
    type: 'knowledge',
    category: 'cat',
    question: '고양이가 먹으면 안 되는 음식은?',
    options: [
      { id: 'a', text: '삶은 닭가슴살', isCorrect: false },
      { id: 'b', text: '포도와 건포도', isCorrect: true },
      { id: 'c', text: '호박', isCorrect: false },
    ],
    explanation: '포도는 고양이에게도 독성! 소량으로도 신장 손상을 일으킬 수 있어요.',
    difficulty: 2,
    points: 20,
    tags: ['건강', '음식', '독성'],
  },
  {
    id: 'cat-quiz-010',
    type: 'knowledge',
    category: 'cat',
    question: '고양이 수염의 역할이 아닌 것은?',
    options: [
      { id: 'a', text: '공간 감지', isCorrect: false },
      { id: 'b', text: '기분 표현', isCorrect: false },
      { id: 'c', text: '냄새 맡기', isCorrect: true },
    ],
    explanation: '수염은 레이더 역할! 공간 통과 가능 여부 판단, 기분 표현(뒤로 = 불안) 등 다양한 역할을 해요.',
    difficulty: 2,
    points: 15,
    tags: ['신체', '수염', '습성'],
  },
];

// ============================================================================
// 샘플: 고양이 시나리오 퀴즈 - "나의 집사 점수"
// ============================================================================

export const CAT_BUTLER_SCENARIO: ScenarioQuiz = {
  id: 'cat-scenario-butler',
  category: 'cat',
  title: '나의 집사 점수는?',
  subtitle: '고양이 돌봄 상식 테스트',
  emoji: '🐱',
  themeColor: 'bg-orange-100',
  questions: [
    {
      id: 'q1',
      situation: '고양이가 새로운 화장실에 볼일을 안 봐요.',
      question: '어떻게 하시겠어요?',
      options: [
        { id: 'a', text: '기존 화장실 모래를 조금 섞어준다', points: 10, feedback: '정답! 익숙한 냄새로 안심시켜요' },
        { id: 'b', text: '강제로 화장실에 넣어 교육한다', points: 2, feedback: '스트레스를 줄 수 있어요' },
        { id: 'c', text: '그냥 기다린다', points: 5, feedback: '시간이 오래 걸릴 수 있어요' },
      ],
    },
    {
      id: 'q2',
      situation: '고양이가 밥을 갑자기 안 먹어요.',
      question: '가장 먼저 확인할 것은?',
      options: [
        { id: 'a', text: '사료가 상했는지 확인', points: 7, feedback: '좋은 생각이지만 더 중요한 게 있어요' },
        { id: 'b', text: '물을 마시는지, 활력은 있는지 확인', points: 10, feedback: '정답! 건강 상태 먼저 체크해요' },
        { id: 'c', text: '더 맛있는 간식 준다', points: 3, feedback: '근본 원인을 놓칠 수 있어요' },
      ],
    },
    {
      id: 'q3',
      situation: '새 가구를 샀는데 고양이가 소파 밑에 숨어있어요.',
      question: '어떻게 하시겠어요?',
      options: [
        { id: 'a', text: '억지로 끌어내서 익숙해지게 한다', points: 0, feedback: '절대 금물! 트라우마가 될 수 있어요' },
        { id: 'b', text: '간식으로 유인해 천천히 나오게 한다', points: 8, feedback: '좋은 방법이에요' },
        { id: 'c', text: '스스로 나올 때까지 그냥 둔다', points: 10, feedback: '정답! 고양이 페이스를 존중해요' },
      ],
    },
    {
      id: 'q4',
      question: '고양이 화장실 청소 주기는?',
      options: [
        { id: 'a', text: '하루에 1-2번 덩어리 제거', points: 10, feedback: '완벽해요! 깨끗한 화장실 = 행복한 고양이' },
        { id: 'b', text: '일주일에 한 번 전체 교체', points: 5, feedback: '조금 부족해요. 매일 덩어리는 치워주세요' },
        { id: 'c', text: '냄새 날 때만', points: 2, feedback: '고양이는 사람보다 후각이 예민해요!' },
      ],
    },
    {
      id: 'q5',
      situation: '고양이가 자꾸 전선을 물어뜯어요.',
      question: '어떻게 대처하시겠어요?',
      options: [
        { id: 'a', text: '혼내서 교육한다', points: 2, feedback: '고양이는 혼내면 이유를 몰라요' },
        { id: 'b', text: '전선 커버로 보호하고 대체 장난감 제공', points: 10, feedback: '정답! 환경 개선 + 대안 제공' },
        { id: 'c', text: '쓴 스프레이를 뿌린다', points: 6, feedback: '도움이 되지만 근본적이진 않아요' },
      ],
    },
    {
      id: 'q6',
      question: '고양이를 동물병원에 데려갈 때 가장 좋은 방법은?',
      options: [
        { id: 'a', text: '캐리어에 익숙해지도록 평소 열어두기', points: 10, feedback: '완벽! 캐리어 = 안전한 곳이라는 인식' },
        { id: 'b', text: '병원 갈 때만 캐리어 꺼내기', points: 3, feedback: '캐리어 = 무서운 곳이 돼버려요' },
        { id: 'c', text: '캐리어 없이 안고 가기', points: 1, feedback: '위험해요! 놀라서 도망칠 수 있어요' },
      ],
    },
    {
      id: 'q7',
      situation: '여러 마리 고양이를 키우는데 자주 싸워요.',
      question: '가장 효과적인 해결책은?',
      options: [
        { id: 'a', text: '각자 영역을 분리해주고 자원(밥그릇, 화장실) 추가', points: 10, feedback: '정답! 영역 스트레스 해소가 핵심' },
        { id: 'b', text: '싸우면 물 뿌려서 훈육', points: 2, feedback: '관계가 더 나빠질 수 있어요' },
        { id: 'c', text: '시간이 지나면 친해지겠지 기다린다', points: 4, feedback: '상황이 악화될 수 있어요' },
      ],
    },
    {
      id: 'q8',
      question: '고양이에게 줘도 되는 인간 음식은?',
      options: [
        { id: 'a', text: '삶은 닭가슴살 (양념 없이)', points: 10, feedback: '정답! 단백질 간식으로 좋아요' },
        { id: 'b', text: '우유', points: 2, feedback: '대부분의 성묘는 유당불내증이에요' },
        { id: 'c', text: '참치캔 (인간용)', points: 5, feedback: '가끔은 괜찮지만, 염분이 높아 자주는 안돼요' },
      ],
    },
  ],
  results: [
    { minScore: 0, maxScore: 25, grade: 'D', title: '초보 집사', emoji: '🐣', description: '아직 배울 게 많아요! 고양이의 마음을 이해하는 연습 중', tips: ['고양이 행동학 책 읽어보기', '유튜브 고양이 전문가 채널 구독'] },
    { minScore: 26, maxScore: 45, grade: 'C', title: '성장 중인 집사', emoji: '📚', description: '기본은 알지만 아직 더 배워야 해요', tips: ['고양이 바디랭귀지 공부하기', '환경 개선에 투자해보기'] },
    { minScore: 46, maxScore: 60, grade: 'B', title: '중수 집사', emoji: '⭐', description: '꽤 잘 하고 있어요! 조금만 더!', tips: ['스트레스 요인 체크해보기', '정기검진 루틴 만들기'] },
    { minScore: 61, maxScore: 75, grade: 'A', title: '능력 있는 집사', emoji: '🌟', description: '고양이 복지를 잘 챙기고 있어요!', tips: ['다른 집사들에게 팁 공유해보세요!'] },
    { minScore: 76, maxScore: 80, grade: 'S', title: '프로 집사', emoji: '👑', description: '고양이의 마음을 완벽히 이해하는 달인!', tips: ['당신의 노하우를 공유해주세요!'] },
  ],
};

// ============================================================================
// 샘플: VS 투표 10개
// ============================================================================

export const CAT_VS_POLLS: Poll[] = [
  {
    id: 'cat-poll-001',
    type: 'vs',
    category: 'cat',
    question: '고양이 사료, 뭐가 더 좋아요?',
    options: [
      { id: 'a', text: '습식 (캔/파우치)', emoji: '🥫' },
      { id: 'b', text: '건식 (사료)', emoji: '🍚' },
    ],
    tags: ['사료', '먹이'],
  },
  {
    id: 'cat-poll-002',
    type: 'vs',
    category: 'cat',
    question: '고양이 털 스타일 취향은?',
    options: [
      { id: 'a', text: '장모종', emoji: '🦁' },
      { id: 'b', text: '단모종', emoji: '🐱' },
    ],
    tags: ['품종', '취향'],
  },
  {
    id: 'cat-poll-003',
    type: 'vs',
    category: 'cat',
    question: '고양이 장난감으로 더 좋은 건?',
    options: [
      { id: 'a', text: '낚싯대', emoji: '🎣' },
      { id: 'b', text: '레이저 포인터', emoji: '🔴' },
    ],
    tags: ['장난감', '놀이'],
  },
  {
    id: 'cat-poll-004',
    type: 'vs',
    category: 'cat',
    question: '캣타워 vs 캣폴, 어떤 게 더 좋아요?',
    options: [
      { id: 'a', text: '캣타워', emoji: '🏰' },
      { id: 'b', text: '캣폴', emoji: '🌳' },
    ],
    tags: ['가구', '인테리어'],
  },
  {
    id: 'cat-poll-005',
    type: 'vs',
    category: 'cat',
    question: '고양이 잠자리는?',
    options: [
      { id: 'a', text: '같은 침대에서 함께', emoji: '🛏️' },
      { id: 'b', text: '고양이 전용 공간', emoji: '🏠' },
    ],
    tags: ['생활', '습관'],
  },
  {
    id: 'cat-poll-006',
    type: 'vs',
    category: 'cat',
    question: '고양이 모래 타입 취향은?',
    options: [
      { id: 'a', text: '벤토나이트 (응고형)', emoji: '🪨' },
      { id: 'b', text: '두부/목재 (천연)', emoji: '🌿' },
    ],
    tags: ['화장실', '모래'],
  },
  {
    id: 'cat-poll-007',
    type: 'vs',
    category: 'cat',
    question: '고양이 밥 시간 스타일은?',
    options: [
      { id: 'a', text: '정해진 시간에 주기', emoji: '⏰' },
      { id: 'b', text: '자율배식', emoji: '🍽️' },
    ],
    tags: ['사료', '급여'],
  },
  {
    id: 'cat-poll-008',
    type: 'vs',
    category: 'cat',
    question: '고양이 목욕은?',
    options: [
      { id: 'a', text: '가끔 시킨다', emoji: '🛁' },
      { id: 'b', text: '절대 안 시킨다', emoji: '🚫' },
    ],
    tags: ['케어', '목욕'],
  },
  {
    id: 'cat-poll-009',
    type: 'vs',
    category: 'cat',
    question: '고양이 이름 스타일은?',
    options: [
      { id: 'a', text: '귀여운 한글 이름', emoji: '🇰🇷' },
      { id: 'b', text: '세련된 영어 이름', emoji: '🌍' },
    ],
    tags: ['이름', '재미'],
  },
  {
    id: 'cat-poll-010',
    type: 'vs',
    category: 'cat',
    question: '첫 고양이로 뭐가 좋을까요?',
    options: [
      { id: 'a', text: '입양 (유기묘)', emoji: '💕' },
      { id: 'b', text: '분양 (품종묘)', emoji: '🏷️' },
    ],
    tags: ['입양', '분양'],
  },
];

// ============================================================================
// 샘플: 선택 투표 5개
// ============================================================================

export const CAT_CHOICE_POLLS: Poll[] = [
  {
    id: 'cat-choice-001',
    type: 'choice',
    category: 'cat',
    question: '고양이 간식 브랜드 어디 쓰세요?',
    options: [
      { id: 'a', text: '츄르', emoji: '🍡' },
      { id: 'b', text: '템테이션', emoji: '🍪' },
      { id: 'c', text: '고로고로', emoji: '🐟' },
      { id: 'd', text: '기타/직접 만듦', emoji: '👨‍🍳' },
    ],
    tags: ['간식', '브랜드'],
  },
  {
    id: 'cat-choice-002',
    type: 'choice',
    category: 'cat',
    question: '동물병원 방문 주기는?',
    options: [
      { id: 'a', text: '연 1회 (예방접종 때만)', emoji: '💉' },
      { id: 'b', text: '연 2회 (정기검진)', emoji: '📋' },
      { id: 'c', text: '분기별 (3-4개월마다)', emoji: '🏥' },
      { id: 'd', text: '아플 때만', emoji: '🤒' },
    ],
    tags: ['건강', '병원'],
  },
  {
    id: 'cat-choice-003',
    type: 'choice',
    category: 'cat',
    question: '고양이 몇 마리 키우세요?',
    options: [
      { id: 'a', text: '1마리', emoji: '🐱' },
      { id: 'b', text: '2마리', emoji: '🐱🐱' },
      { id: 'c', text: '3마리 이상', emoji: '🐱🐱🐱' },
      { id: 'd', text: '아직 안 키움 (키우고 싶음)', emoji: '💭' },
    ],
    tags: ['다묘', '숫자'],
  },
  {
    id: 'cat-choice-004',
    type: 'choice',
    category: 'cat',
    question: '고양이가 가장 좋아하는 장소는?',
    options: [
      { id: 'a', text: '창가', emoji: '🪟' },
      { id: 'b', text: '캣타워', emoji: '🏰' },
      { id: 'c', text: '박스', emoji: '📦' },
      { id: 'd', text: '집사 무릎', emoji: '🧎' },
    ],
    tags: ['습성', '장소'],
  },
  {
    id: 'cat-choice-005',
    type: 'choice',
    category: 'cat',
    question: '가장 어려운 고양이 돌봄은?',
    options: [
      { id: 'a', text: '빗질', emoji: '🪮' },
      { id: 'b', text: '발톱 깎기', emoji: '✂️' },
      { id: 'c', text: '양치', emoji: '🦷' },
      { id: 'd', text: '병원 데려가기', emoji: '🏥' },
    ],
    tags: ['케어', '어려움'],
  },
];

// ============================================================================
// 데이터 검증
// ============================================================================

export interface ContentValidationResult {
  type: 'quiz' | 'scenario' | 'poll';
  id: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateQuiz(quiz: Quiz): ContentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!quiz.id) errors.push('id 필수');
  if (!quiz.question) errors.push('question 필수');
  if (!quiz.options || quiz.options.length < 2) errors.push('options 최소 2개 필요');

  if (quiz.type === 'knowledge') {
    const hasCorrect = quiz.options.some(o => o.isCorrect);
    if (!hasCorrect) errors.push('knowledge 퀴즈는 정답(isCorrect: true) 필수');
    if (!quiz.explanation) warnings.push('explanation 권장');
  }

  if (!quiz.tags || quiz.tags.length === 0) warnings.push('tags 권장');

  return {
    type: 'quiz',
    id: quiz.id,
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateScenario(scenario: ScenarioQuiz): ContentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!scenario.id) errors.push('id 필수');
  if (!scenario.title) errors.push('title 필수');
  if (!scenario.questions || scenario.questions.length < 3) errors.push('questions 최소 3개 필요');
  if (!scenario.results || scenario.results.length < 2) errors.push('results 최소 2개 필요');

  // 점수 범위 연속성 체크
  const sortedResults = [...scenario.results].sort((a, b) => a.minScore - b.minScore);
  let prevMax = -1;
  for (const result of sortedResults) {
    if (result.minScore !== prevMax + 1 && prevMax !== -1) {
      warnings.push(`점수 범위 갭: ${prevMax} ~ ${result.minScore}`);
    }
    prevMax = result.maxScore;
  }

  // 최대 점수 계산 & 체크
  const maxPossibleScore = scenario.questions.reduce((sum, q) => {
    const maxPoints = Math.max(...q.options.map(o => o.points));
    return sum + maxPoints;
  }, 0);

  if (sortedResults[sortedResults.length - 1].maxScore !== maxPossibleScore) {
    warnings.push(`최대 가능 점수(${maxPossibleScore})와 최고 등급 maxScore 불일치`);
  }

  return {
    type: 'scenario',
    id: scenario.id,
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validatePoll(poll: Poll): ContentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!poll.id) errors.push('id 필수');
  if (!poll.question) errors.push('question 필수');
  if (!poll.options || poll.options.length < 2) errors.push('options 최소 2개 필요');

  if (poll.type === 'vs' && poll.options.length !== 2) {
    errors.push('vs 타입은 정확히 2개 옵션 필요');
  }

  if (!poll.tags || poll.tags.length === 0) warnings.push('tags 권장');

  return {
    type: 'poll',
    id: poll.id,
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// 전체 검증 실행
// ============================================================================

export function validateAllSamples() {
  const results: ContentValidationResult[] = [];

  // 퀴즈 검증
  CAT_KNOWLEDGE_QUIZZES.forEach(q => results.push(validateQuiz(q)));

  // 시나리오 검증
  results.push(validateScenario(CAT_BUTLER_SCENARIO));

  // 투표 검증
  CAT_VS_POLLS.forEach(p => results.push(validatePoll(p)));
  CAT_CHOICE_POLLS.forEach(p => results.push(validatePoll(p)));

  const summary = {
    total: results.length,
    valid: results.filter(r => r.isValid).length,
    invalid: results.filter(r => !r.isValid).length,
    withWarnings: results.filter(r => r.warnings.length > 0).length,
    details: results,
  };

  return summary;
}

// ============================================================================
// Export
// ============================================================================

export const CONTENT_SAMPLES = {
  quizzes: CAT_KNOWLEDGE_QUIZZES,
  scenario: CAT_BUTLER_SCENARIO,
  vsPolls: CAT_VS_POLLS,
  choicePolls: CAT_CHOICE_POLLS,
  validation: validateAllSamples(),
  utils: {
    validateQuiz,
    validateScenario,
    validatePoll,
    validateAllSamples,
  },
};

export default CONTENT_SAMPLES;
