// ============================================================================
// 콘텐츠 샘플 데이터 - 대시보드 전용 (퀴즈/투표/토너먼트)
// ============================================================================
//
// ⚠️ 중요: 이 파일은 대시보드 문서화/검증용입니다!
//
// 실제 서비스 데이터 위치:
//   - 퀴즈: src/data/content/quizzes/
//   - 투표: src/data/content/polls/
//   - 상황별 반응: (미구현) src/data/content/situation-reactions/
//
// 이 파일의 목적:
//   1. AI가 새 콘텐츠 생성 시 참고할 구조 예시
//   2. 검증 함수(validate*) 테스트용 샘플
//   3. 대시보드 UI에서 데이터 구조 설명용
//
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

export type PollType = 'vs' | 'choice' | 'ranking' | 'scale' | 'situation-reaction';

// ============================================================================
// 상황별 반응 투표 타입 정의
// ============================================================================

export type SituationCategory = 'relationship' | 'work' | 'social' | 'awkward';
export type ReactionTag = 'cool' | 'emotional' | 'rational' | 'avoidant' | 'confrontational' | 'humorous' | 'caring' | 'passive';

export interface SituationReaction {
  id: string;
  type: 'situation-reaction';
  category: SituationCategory;
  situation: string;           // 상황 설명
  question: string;            // 예: "이럴 때 나는?"
  options: {
    id: string;
    text: string;
    emoji: string;
    tag: ReactionTag;          // 반응 유형 태그
  }[];
  personalityMapping?: {        // 성격 유형별 예상 반응 (통계용, MBTI 또는 테스트 결과 기반)
    [personalityType: string]: string;  // personalityType -> optionId
  };
  totalVotes?: number;
  tags: string[];
}

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
// 샘플: 강아지 품종 투표
// ============================================================================

export const DOG_BREED_POLLS: Poll[] = [
  {
    id: 'dog-poll-breed-001',
    type: 'choice',
    category: 'dog',
    question: '반려견으로 가장 적절한 품종은?',
    options: [
      { id: 'a', text: '골든 리트리버', emoji: '🦮' },
      { id: 'b', text: '비글', emoji: '🐕' },
      { id: 'c', text: '푸들', emoji: '🐩' },
      { id: 'd', text: '웰시코기', emoji: '🐶' },
      { id: 'e', text: '시바견', emoji: '🐕' },
      { id: 'f', text: '말티즈', emoji: '🐕' },
      { id: 'g', text: '포메라니안', emoji: '🦊' },
      { id: 'h', text: '치와와', emoji: '🐕' },
    ],
    tags: ['품종', '선호도', '반려견'],
  },
  {
    id: 'dog-poll-breed-002',
    type: 'choice',
    category: 'dog',
    question: '초보 보호자에게 가장 추천하는 품종은?',
    options: [
      { id: 'a', text: '골든 리트리버 (온순하고 훈련 잘됨)', emoji: '🦮' },
      { id: 'b', text: '비숑 프리제 (순하고 털 안 빠짐)', emoji: '☁️' },
      { id: 'c', text: '푸들 (똑똑하고 털 안 빠짐)', emoji: '🐩' },
      { id: 'd', text: '웰시코기 (활발하지만 사교적)', emoji: '🐶' },
    ],
    tags: ['초보', '추천', '품종'],
  },
  {
    id: 'dog-poll-breed-003',
    type: 'choice',
    category: 'dog',
    question: '아파트에서 키우기 가장 적절한 품종은?',
    options: [
      { id: 'a', text: '말티즈 (작고 순함)', emoji: '🐕' },
      { id: 'b', text: '푸들 (털 안 빠지고 똑똑)', emoji: '🐩' },
      { id: 'c', text: '비숑 프리제 (작고 성격 좋음)', emoji: '☁️' },
      { id: 'd', text: '포메라니안 (소형, 활발)', emoji: '🦊' },
    ],
    tags: ['아파트', '소형견', '품종'],
  },
  {
    id: 'dog-poll-breed-004',
    type: 'choice',
    category: 'dog',
    question: '활동적인 라이프스타일에 맞는 품종은?',
    options: [
      { id: 'a', text: '골든 리트리버 (산책 러버)', emoji: '🦮' },
      { id: 'b', text: '보더콜리 (에너지 무한대)', emoji: '🐕' },
      { id: 'c', text: '비글 (호기심 많고 활발)', emoji: '🐕' },
      { id: 'd', text: '웰시코기 (짧은 다리, 긴 체력)', emoji: '🐶' },
    ],
    tags: ['활동적', '운동', '산책'],
  },
  {
    id: 'dog-poll-breed-005',
    type: 'choice',
    category: 'dog',
    question: '애교 많은 품종은?',
    options: [
      { id: 'a', text: '골든 리트리버 (사람을 좋아함)', emoji: '🦮' },
      { id: 'b', text: '말티즈 (집사 사랑)', emoji: '🐕' },
      { id: 'c', text: '포메라니안 (관심 받고 싶어)', emoji: '🦊' },
      { id: 'd', text: '요크셔테리어 (애교쟁이)', emoji: '🐕' },
    ],
    tags: ['애교', '성격', '친화력'],
  },
  {
    id: 'dog-poll-breed-006',
    type: 'choice',
    category: 'dog',
    question: '털 빠짐이 적은 품종은?',
    options: [
      { id: 'a', text: '푸들 (곱슬털, 거의 안 빠짐)', emoji: '🐩' },
      { id: 'b', text: '비숑 프리제 (저자극, 안 빠짐)', emoji: '☁️' },
      { id: 'c', text: '슈나우저 (이중모지만 빠짐 적음)', emoji: '🐕' },
      { id: 'd', text: '요크셔테리어 (단일모, 빠짐 적음)', emoji: '🎀' },
    ],
    tags: ['털', '알레르기', '저자극'],
  },
  {
    id: 'dog-poll-breed-007',
    type: 'choice',
    category: 'dog',
    question: '지능이 높은 품종은?',
    options: [
      { id: 'a', text: '보더콜리 (IQ 1위)', emoji: '🐕' },
      { id: 'b', text: '푸들 (훈련 천재)', emoji: '🐩' },
      { id: 'c', text: '골든 리트리버 (똑똑하고 온순)', emoji: '🦮' },
      { id: 'd', text: '저먼 셰퍼드 (충성+지능)', emoji: '🐕‍🦺' },
    ],
    tags: ['지능', '훈련', '똑똑함'],
  },
  {
    id: 'dog-poll-breed-008',
    type: 'choice',
    category: 'dog',
    question: '경비견으로 좋은 품종은?',
    options: [
      { id: 'a', text: '저먼 셰퍼드 (용감하고 충성)', emoji: '🐕‍🦺' },
      { id: 'b', text: '로트와일러 (강하고 보호본능)', emoji: '🐕' },
      { id: 'c', text: '도베르만 (날렵하고 용감)', emoji: '🐕' },
      { id: 'd', text: '진돗개 (주인 사랑 최고)', emoji: '🐕' },
    ],
    tags: ['경비', '보호', '대형견'],
  },
  {
    id: 'dog-poll-breed-009',
    type: 'vs',
    category: 'dog',
    question: '소형견 vs 대형견, 어느 쪽 선호?',
    options: [
      { id: 'a', text: '소형견 (귀엽고 관리 편함)', emoji: '🐕' },
      { id: 'b', text: '대형견 (든든하고 멋짐)', emoji: '🦮' },
    ],
    tags: ['크기', '선호도'],
  },
  {
    id: 'dog-poll-breed-010',
    type: 'vs',
    category: 'dog',
    question: '장모종 vs 단모종, 어느 쪽 선호?',
    options: [
      { id: 'a', text: '장모종 (풍성하고 예뻐)', emoji: '🦁' },
      { id: 'b', text: '단모종 (관리 쉽고 시원해)', emoji: '🐕' },
    ],
    tags: ['털', '관리', '선호도'],
  },
];

// ============================================================================
// 샘플: 상황별 반응 투표 (연애/이별 5개 + 직장/인간관계 5개)
// ============================================================================

export const SITUATION_REACTION_POLLS: SituationReaction[] = [
  // ===== 연애/이별 상황 5개 =====
  {
    id: 'situation-reaction-relationship-001',
    type: 'situation-reaction',
    category: 'relationship',
    situation: '3년 사귄 연인이 갑자기 "우리 잠깐 거리를 두자"고 말했다.',
    question: '이럴 때 나는?',
    options: [
      { id: 'a', text: '왜? 뭐가 문제야? 바로 따져 물음', emoji: '😠', tag: 'confrontational' },
      { id: 'b', text: '알겠어... 시간 줄게 (속으로 울면서)', emoji: '😢', tag: 'emotional' },
      { id: 'c', text: '그래, 나도 생각할 시간 필요했어', emoji: '😌', tag: 'rational' },
      { id: 'd', text: '연락 먼저 오면 받을게 (읽씹 시작)', emoji: '😎', tag: 'cool' },
    ],
    personalityMapping: {
      'ENFP': 'a',
      'INFP': 'b',
      'INTJ': 'c',
      'ISTP': 'd',
      'ESFJ': 'a',
      'ISFJ': 'b',
    },
    tags: ['이별', '연애', '거리두기'],
  },
  {
    id: 'situation-reaction-relationship-002',
    type: 'situation-reaction',
    category: 'relationship',
    situation: '헤어진 전 애인에게서 새벽 2시에 "잘 지내?"라는 카톡이 왔다.',
    question: '이럴 때 나는?',
    options: [
      { id: 'a', text: '읽씹하고 다음날 "어 잘 지내" 단답', emoji: '😏', tag: 'cool' },
      { id: 'b', text: '설마... 다시? 심장 쿵쾅거리며 답장', emoji: '💓', tag: 'emotional' },
      { id: 'c', text: '새벽에 왜 연락해? 할 말 있으면 낮에 해', emoji: '😤', tag: 'confrontational' },
      { id: 'd', text: '차단은 이럴 때 쓰라고 있는 거지', emoji: '🚫', tag: 'avoidant' },
    ],
    personalityMapping: {
      'ENTJ': 'c',
      'INFP': 'b',
      'ISTP': 'a',
      'INTP': 'd',
      'ENFJ': 'b',
    },
    tags: ['이별', '연애', '전애인', '새벽연락'],
  },
  {
    id: 'situation-reaction-relationship-003',
    type: 'situation-reaction',
    category: 'relationship',
    situation: '친구의 소개팅 상대가 첫 만남에서 "저 솔직한 편이에요"라며 외모 지적을 했다.',
    question: '이럴 때 나는?',
    options: [
      { id: 'a', text: '저도 솔직하게 말할게요. 다신 안 볼게요.', emoji: '💅', tag: 'confrontational' },
      { id: 'b', text: '네... 하하... (속으로 멘탈 박살)', emoji: '🥲', tag: 'emotional' },
      { id: 'c', text: '아 그래요? 근데 그건 예의는 아닌 것 같은데', emoji: '🤔', tag: 'rational' },
      { id: 'd', text: '화장실 다녀올게요 (도주 준비)', emoji: '🏃', tag: 'avoidant' },
    ],
    personalityMapping: {
      'ESTJ': 'a',
      'INFP': 'b',
      'INTP': 'c',
      'ISFP': 'd',
    },
    tags: ['소개팅', '연애', '무례함'],
  },
  {
    id: 'situation-reaction-relationship-004',
    type: 'situation-reaction',
    category: 'relationship',
    situation: '썸 타던 사람이 "우리 그냥 친구로 지내자"고 했다.',
    question: '이럴 때 나는?',
    options: [
      { id: 'a', text: '응 알겠어! 우리 좋은 친구하자 (마음 접음)', emoji: '🙂', tag: 'rational' },
      { id: 'b', text: '왜...? 내가 뭘 잘못한 거야...', emoji: '😭', tag: 'emotional' },
      { id: 'c', text: '아 그래? ㅋㅋ 연락할 일 있나 모르겠네', emoji: '🙄', tag: 'cool' },
      { id: 'd', text: '혹시 다른 사람 생긴 거야?', emoji: '🕵️', tag: 'confrontational' },
    ],
    personalityMapping: {
      'ISTJ': 'a',
      'ENFP': 'b',
      'ESTP': 'c',
      'ENFJ': 'd',
    },
    tags: ['썸', '연애', '거절'],
  },
  {
    id: 'situation-reaction-relationship-005',
    type: 'situation-reaction',
    category: 'relationship',
    situation: '연인이 "네 친구 ○○ 좀 별로인 것 같아"라고 내 베프를 험담했다.',
    question: '이럴 때 나는?',
    options: [
      { id: 'a', text: '왜? 뭐가 별로인데? (방어 태세)', emoji: '🛡️', tag: 'confrontational' },
      { id: 'b', text: '아... 그래? 뭐 그럴 수도... (어색)', emoji: '😅', tag: 'passive' },
      { id: 'c', text: '내 친구인데 그렇게 말하면 기분 나빠', emoji: '😤', tag: 'emotional' },
      { id: 'd', text: '음... 왜 그렇게 생각해? 이유가 뭔데?', emoji: '🤔', tag: 'rational' },
    ],
    personalityMapping: {
      'ESFP': 'a',
      'ISFJ': 'b',
      'ENFP': 'c',
      'INTP': 'd',
    },
    tags: ['연애', '친구', '갈등'],
  },

  // ===== 직장/인간관계 상황 5개 =====
  {
    id: 'situation-reaction-work-001',
    type: 'situation-reaction',
    category: 'work',
    situation: '팀장이 회의 중 내 아이디어를 대놓고 무시하고 다른 사람 의견만 칭찬했다.',
    question: '이럴 때 나는?',
    options: [
      { id: 'a', text: '회의 끝나고 팀장 찾아가서 따로 얘기함', emoji: '💬', tag: 'confrontational' },
      { id: 'b', text: '속으로 삭이고 퇴근 후 친구한테 푸념', emoji: '😮‍💨', tag: 'emotional' },
      { id: 'c', text: '그냥 결과로 보여주면 되지 뭐', emoji: '💪', tag: 'cool' },
      { id: 'd', text: '다음부턴 굳이 의견 안 내야지', emoji: '🤐', tag: 'avoidant' },
    ],
    personalityMapping: {
      'ENTJ': 'a',
      'INFP': 'b',
      'ISTP': 'c',
      'ISFJ': 'd',
    },
    tags: ['직장', '상사', '무시', '회의'],
  },
  {
    id: 'situation-reaction-work-002',
    type: 'situation-reaction',
    category: 'work',
    situation: '동료가 내가 한 일을 자기가 한 것처럼 상사에게 보고했다.',
    question: '이럴 때 나는?',
    options: [
      { id: 'a', text: '바로 그 자리에서 "그건 제가 한 건데요"', emoji: '✋', tag: 'confrontational' },
      { id: 'b', text: '증거 모아두고 나중에 상사에게 따로 말함', emoji: '📋', tag: 'rational' },
      { id: 'c', text: '분하지만... 일단 참고 지켜봄', emoji: '😤', tag: 'emotional' },
      { id: 'd', text: 'ㅋㅋ 그래 가져가라 관심없다', emoji: '🙄', tag: 'cool' },
    ],
    personalityMapping: {
      'ESTJ': 'a',
      'INTJ': 'b',
      'ISFJ': 'c',
      'INTP': 'd',
    },
    tags: ['직장', '동료', '공로가로채기'],
  },
  {
    id: 'situation-reaction-work-003',
    type: 'situation-reaction',
    category: 'work',
    situation: '회식 자리에서 상사가 "너 요즘 일 많이 힘들지?"라며 술을 계속 권한다.',
    question: '이럴 때 나는?',
    options: [
      { id: 'a', text: '네~ 감사합니다~ (받으면서 몰래 버림)', emoji: '🍺', tag: 'avoidant' },
      { id: 'b', text: '죄송한데 저 오늘 컨디션이... (거절)', emoji: '🙏', tag: 'rational' },
      { id: 'c', text: '아 감동... 팀장님도 한 잔! (케미 모드)', emoji: '🥹', tag: 'emotional' },
      { id: 'd', text: '네 힘들어요. 일이 너무 많아서요 (직구)', emoji: '💥', tag: 'confrontational' },
    ],
    personalityMapping: {
      'ISFP': 'a',
      'ISTJ': 'b',
      'ESFJ': 'c',
      'ENTP': 'd',
    },
    tags: ['직장', '회식', '술자리'],
  },
  {
    id: 'situation-reaction-social-001',
    type: 'situation-reaction',
    category: 'social',
    situation: '친구 모임에서 한 친구가 계속 나만 빼고 농담을 한다.',
    question: '이럴 때 나는?',
    options: [
      { id: 'a', text: '야 나도 껴줘~ (웃으면서 참여 시도)', emoji: '😊', tag: 'caring' },
      { id: 'b', text: '뭔가 기분 나쁜데... 일단 조용히 있음', emoji: '😶', tag: 'passive' },
      { id: 'c', text: '아 나 화장실 (잠깐 피함)', emoji: '🚶', tag: 'avoidant' },
      { id: 'd', text: '왜 나만 빼? 솔직히 좀 그런데', emoji: '😠', tag: 'confrontational' },
    ],
    personalityMapping: {
      'ENFP': 'a',
      'INFP': 'b',
      'INTP': 'c',
      'ESTP': 'd',
    },
    tags: ['친구', '모임', '소외감'],
  },
  {
    id: 'situation-reaction-awkward-001',
    type: 'situation-reaction',
    category: 'awkward',
    situation: '엘리베이터에서 방금 뒷담화한 그 사람과 딱 마주쳤다.',
    question: '이럴 때 나는?',
    options: [
      { id: 'a', text: '아 안녕하세요~ (아무렇지 않은 척)', emoji: '😀', tag: 'cool' },
      { id: 'b', text: '(핸드폰 꺼내며 바닥만 봄)', emoji: '📱', tag: 'avoidant' },
      { id: 'c', text: '앗... (얼굴 빨개지면서 식은땀)', emoji: '😰', tag: 'emotional' },
      { id: 'd', text: '뭐 어때 한 말은 사실인데 뭐', emoji: '🤷', tag: 'confrontational' },
    ],
    personalityMapping: {
      'ESTP': 'a',
      'INFP': 'b',
      'ISFJ': 'c',
      'ENTP': 'd',
    },
    tags: ['어색함', '뒷담화', '마주침'],
  },
];

// ============================================================================
// 데이터 검증
// ============================================================================

export interface ContentValidationResult {
  type: 'quiz' | 'scenario' | 'poll' | 'situation-reaction';
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
    const hasCorrect = quiz.options?.some(o => o.isCorrect);
    if (!hasCorrect) errors.push('knowledge 퀴즈는 정답(isCorrect: true) 필수');

    const correctCount = quiz.options?.filter(o => o.isCorrect).length || 0;
    if (correctCount > 1) errors.push('정답은 1개만 가능');

    if (!quiz.explanation) warnings.push('explanation 권장');
  }

  // difficulty 체크 (CLI와 동기화)
  if (!quiz.difficulty || ![1, 2, 3].includes(quiz.difficulty)) {
    warnings.push('difficulty는 1, 2, 3 중 하나 권장');
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

  // questions/results가 있을 때만 추가 검증
  if (scenario.questions && scenario.questions.length > 0 && scenario.results && scenario.results.length > 0) {
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
      const maxPoints = Math.max(...(q.options?.map(o => o.points) || [0]));
      return sum + maxPoints;
    }, 0);

    const lastResult = sortedResults[sortedResults.length - 1];
    if (lastResult && lastResult.maxScore !== maxPossibleScore) {
      warnings.push(`최대 가능 점수(${maxPossibleScore})와 최고 등급 maxScore 불일치`);
    }
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

  if (poll.type === 'vs' && poll.options?.length !== 2) {
    errors.push('vs 타입은 정확히 2개 옵션 필요');
  }

  // choice 타입 옵션 수 체크 (CLI와 동기화)
  if (poll.type === 'choice') {
    if (poll.options && poll.options.length < 3) warnings.push('choice 타입은 3개 이상 옵션 권장');
    if (poll.options && poll.options.length > 5) warnings.push('choice 타입은 5개 이하 옵션 권장');
  }

  // 이모지 일관성 체크 (CLI와 동기화)
  const hasEmoji = poll.options?.some(o => o.emoji);
  const allEmoji = poll.options?.every(o => o.emoji);
  if (hasEmoji && !allEmoji) warnings.push('일부 옵션에만 emoji 있음');

  if (!poll.tags || poll.tags.length === 0) warnings.push('tags 권장');

  return {
    type: 'poll',
    id: poll.id,
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateSituationReaction(sr: SituationReaction): ContentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!sr.id) errors.push('id 필수');
  if (!sr.situation) errors.push('situation 필수');
  if (!sr.question) errors.push('question 필수');
  if (!sr.options || sr.options.length < 2) errors.push('options 최소 2개 필요');
  if (!sr.category) errors.push('category 필수');

  // ID와 category 일치 확인 (CLI와 동기화)
  if (sr.id && sr.category) {
    const idParts = sr.id.split('-');
    const idCategory = idParts[2]; // situation-reaction-{category}-xxx
    if (idCategory !== sr.category) {
      errors.push(`ID(${sr.id})와 category(${sr.category}) 불일치`);
    }
  }

  // 유효한 category 확인 (CLI와 동기화)
  const validCategories = ['relationship', 'work', 'social', 'awkward'];
  if (sr.category && !validCategories.includes(sr.category)) {
    errors.push(`잘못된 category: ${sr.category}`);
  }

  // 각 옵션에 tag가 있는지 확인
  const missingTags = sr.options?.filter(o => !o.tag);
  if (missingTags && missingTags.length > 0) {
    errors.push(`옵션 ${missingTags.map(o => o.id).join(', ')}에 tag 필수`);
  }

  // tag 유효성 확인 (CLI와 동기화)
  const validTags = ['cool', 'emotional', 'rational', 'avoidant', 'confrontational', 'humorous', 'caring', 'passive'];
  sr.options?.forEach(o => {
    if (o.tag && !validTags.includes(o.tag)) {
      warnings.push(`옵션 ${o.id}의 tag '${o.tag}'가 표준 태그 아님`);
    }
  });

  // personalityMapping 권장
  if (!sr.personalityMapping || Object.keys(sr.personalityMapping).length === 0) {
    warnings.push('personalityMapping 권장 (성격별 통계용)');
  }

  if (!sr.tags || sr.tags.length === 0) warnings.push('tags 권장');

  return {
    type: 'situation-reaction',
    id: sr.id,
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

  // 상황별 반응 투표 검증
  SITUATION_REACTION_POLLS.forEach(sr => results.push(validateSituationReaction(sr)));

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
  dogBreedPolls: DOG_BREED_POLLS,
  situationReactionPolls: SITUATION_REACTION_POLLS,
  validation: validateAllSamples(),
  utils: {
    validateQuiz,
    validateScenario,
    validatePoll,
    validateSituationReaction,
    validateAllSamples,
  },
};

export default CONTENT_SAMPLES;
