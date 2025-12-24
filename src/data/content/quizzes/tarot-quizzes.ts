// ============================================================================
// 타로 퀴즈 콘텐츠 (메이저 아르카나 기반)
// ============================================================================
//
// 출처: research/tarot/01-major-arcana-mz.md (Gemini Deep Research)
// 카테고리: general (타로)
//
// 구성:
//   - 지식 퀴즈 (knowledge): 12개
//   - 상황 퀴즈 (situational): 5개
//   - 성격 기반 퀴즈 (personality-based): 5개
//
// ============================================================================

export interface TarotQuiz {
  id: string;
  type: 'knowledge' | 'situational' | 'personality-based';
  category: 'general';
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect?: boolean;  // knowledge 타입용
  }[];
  explanation?: string;
  difficulty: 1 | 2 | 3;
  points?: number;
  tags?: string[];
}

// ============================================================================
// 지식 퀴즈 (knowledge) - 12개
// ============================================================================

export const TAROT_KNOWLEDGE_QUIZZES: TarotQuiz[] = [
  // 쉬움 난이도 5개
  {
    id: 'tarot-quiz-001',
    type: 'knowledge',
    category: 'general',
    question: 'The Fool 카드의 번호는?',
    options: [
      { id: 'a', text: '0번', isCorrect: true },
      { id: 'b', text: '1번', isCorrect: false },
      { id: 'c', text: '마지막 번호', isCorrect: false },
    ],
    explanation: 'The Fool은 0번 카드로, 시작과 무한 가능성을 상징해요!',
    difficulty: 1,
    points: 10,
    tags: ['메이저아르카나', '카드번호', 'The Fool'],
  },
  {
    id: 'tarot-quiz-002',
    type: 'knowledge',
    category: 'general',
    question: '타로 메이저 아르카나는 총 몇 장?',
    options: [
      { id: 'a', text: '21장', isCorrect: false },
      { id: 'b', text: '22장', isCorrect: true },
      { id: 'c', text: '23장', isCorrect: false },
    ],
    explanation: '메이저 아르카나는 0번(The Fool)부터 21번(The World)까지 총 22장이에요!',
    difficulty: 1,
    points: 10,
    tags: ['메이저아르카나', '카드수'],
  },
  {
    id: 'tarot-quiz-003',
    type: 'knowledge',
    category: 'general',
    question: 'The Sun 카드가 상징하는 것은?',
    options: [
      { id: 'a', text: '긍정 에너지와 성공', isCorrect: true },
      { id: 'b', text: '어둠과 불안', isCorrect: false },
      { id: 'c', text: '정체와 멈춤', isCorrect: false },
    ],
    explanation: 'The Sun은 햇살처럼 밝은 에너지, 성공, 행복을 의미해요. 꽃길만 걷자!',
    difficulty: 1,
    points: 10,
    tags: ['The Sun', '긍정', '성공'],
  },
  {
    id: 'tarot-quiz-004',
    type: 'knowledge',
    category: 'general',
    question: 'Death 카드의 MZ 해석은?',
    options: [
      { id: 'a', text: '진짜 죽음 예고', isCorrect: false },
      { id: 'b', text: '디톡스와 새로운 시작', isCorrect: true },
      { id: 'c', text: '영원한 이별', isCorrect: false },
    ],
    explanation: 'Death는 종말이 아니라 환골탈태! 낡은 것을 버리고 새롭게 시작하는 카드예요.',
    difficulty: 1,
    points: 10,
    tags: ['Death', '변화', '새출발'],
  },
  {
    id: 'tarot-quiz-005',
    type: 'knowledge',
    category: 'general',
    question: 'The Lovers 카드가 나타내는 것은?',
    options: [
      { id: 'a', text: '사랑과 선택', isCorrect: true },
      { id: 'b', text: '이별과 상실', isCorrect: false },
      { id: 'c', text: '외로움', isCorrect: false },
    ],
    explanation: 'The Lovers는 사랑뿐 아니라 인생의 중요한 선택 앞에 선 당신을 의미해요. 썸 타는 중이라면 오늘이 기회!',
    difficulty: 1,
    points: 10,
    tags: ['The Lovers', '연애', '선택'],
  },

  // 보통 난이도 3개
  {
    id: 'tarot-quiz-006',
    type: 'knowledge',
    category: 'general',
    question: 'The High Priestess의 상징 키워드는?',
    options: [
      { id: 'a', text: '외향성과 사교', isCorrect: false },
      { id: 'b', text: '직관과 내면의 지혜', isCorrect: true },
      { id: 'c', text: '물질적 풍요', isCorrect: false },
    ],
    explanation: 'The High Priestess는 I형 인간, 방구석 철학자! 직관력과 내면의 목소리를 듣는 카드예요.',
    difficulty: 2,
    points: 15,
    tags: ['The High Priestess', '직관', '내향'],
  },
  {
    id: 'tarot-quiz-007',
    type: 'knowledge',
    category: 'general',
    question: 'The Chariot 카드와 어울리는 MZ 키워드는?',
    options: [
      { id: 'a', text: '힐링과 휴식', isCorrect: false },
      { id: 'b', text: '돌격 앞으로, 목표 달성', isCorrect: true },
      { id: 'c', text: '느긋함과 여유', isCorrect: false },
    ],
    explanation: 'The Chariot은 불도저처럼 질주! 목표를 향한 저돌적인 추진력을 의미해요. 존버는 승리한다!',
    difficulty: 2,
    points: 15,
    tags: ['The Chariot', '추진력', '목표'],
  },
  {
    id: 'tarot-quiz-008',
    type: 'knowledge',
    category: 'general',
    question: 'The Hermit의 현대적 해석은?',
    options: [
      { id: 'a', text: '파티 가서 신나게 놀기', isCorrect: false },
      { id: 'b', text: '디지털 디톡스와 혼자만의 시간', isCorrect: true },
      { id: 'c', text: '새로운 사람들과 네트워킹', isCorrect: false },
    ],
    explanation: 'The Hermit은 자발적 아싸! SNS 잠수 타고 나 자신과 대화하는 시간이에요.',
    difficulty: 2,
    points: 15,
    tags: ['The Hermit', '고독', '디톡스'],
  },

  // 어려움 난이도 2개
  {
    id: 'tarot-quiz-009',
    type: 'knowledge',
    category: 'general',
    question: 'The Hanged Man이 상징하는 것은?',
    options: [
      { id: 'a', text: '빠른 실행과 결과', isCorrect: false },
      { id: 'b', text: '존버와 관점의 전환', isCorrect: true },
      { id: 'c', text: '적극적인 공격', isCorrect: false },
    ],
    explanation: 'The Hanged Man은 자발적인 정체기. 거꾸로 매달려 세상을 다르게 보는 지혜예요. 이 시간은 숙성 중!',
    difficulty: 3,
    points: 20,
    tags: ['The Hanged Man', '존버', '전환'],
  },
  {
    id: 'tarot-quiz-010',
    type: 'knowledge',
    category: 'general',
    question: 'Temperance 카드의 핵심 의미는?',
    options: [
      { id: 'a', text: '극단적인 선택', isCorrect: false },
      { id: 'b', text: '워라밸과 중용', isCorrect: true },
      { id: 'c', text: '무조건적인 헌신', isCorrect: false },
    ],
    explanation: 'Temperance는 양극단 사이의 밸런스! 뜨거운 물과 찬 물을 섞어 미지근하게, 적당히가 미덕이에요.',
    difficulty: 3,
    points: 20,
    tags: ['Temperance', '균형', '워라밸'],
  },
  {
    id: 'tarot-quiz-021',
    type: 'knowledge',
    category: 'general',
    question: 'The Hierophant 카드와 어울리는 현대적 해석은?',
    options: [
      { id: 'a', text: '멘토를 찾고 정석 루트 따르기', isCorrect: true },
      { id: 'b', text: '혼자 독학으로 길 찾기', isCorrect: false },
      { id: 'c', text: '즉흥적으로 결정하기', isCorrect: false },
    ],
    explanation: '튜닝의 끝은 순정이라더니, The Hierophant는 검증된 길과 멘토링을 뜻해요. 혼자 끙끙대지 말고 전문가에게 배우는 게 빠르죠!',
    difficulty: 2,
    points: 15,
    tags: ['The Hierophant', '멘토링', '정석'],
  },
  {
    id: 'tarot-quiz-022',
    type: 'knowledge',
    category: 'general',
    question: 'The World 카드의 상징은?',
    options: [
      { id: 'a', text: '시작과 도전', isCorrect: false },
      { id: 'b', text: '혼란과 불안', isCorrect: false },
      { id: 'c', text: '완성과 성취', isCorrect: true },
    ],
    explanation: '축하합니다! 미션 클리어. The World는 메이저 아르카나 마지막 카드(21번)로 챕터 완성을 의미해요. 더 넓은 세상이 기다려요!',
    difficulty: 2,
    points: 15,
    tags: ['The World', '완성', '성취'],
  },
];

// ============================================================================
// 상황 퀴즈 (situational) - 5개
// ============================================================================

export const TAROT_SITUATIONAL_QUIZZES: TarotQuiz[] = [
  {
    id: 'tarot-quiz-011',
    type: 'situational',
    category: 'general',
    question: '갑자기 퇴사 충동이 드는 당신. 어떤 카드가 어울릴까요?',
    options: [
      { id: 'a', text: 'The Fool - 새로운 도전', isCorrect: true },
      { id: 'b', text: 'The Emperor - 계획적인 삶', isCorrect: false },
      { id: 'c', text: 'The Hermit - 혼자 조용히', isCorrect: false },
    ],
    explanation: 'The Fool은 YOLO 정신! 준비 안 돼도 일단 저지르는 용기를 의미해요. 퇴사 모먼트!',
    difficulty: 1,
    points: 10,
    tags: ['The Fool', '퇴사', '도전'],
  },
  {
    id: 'tarot-quiz-012',
    type: 'situational',
    category: 'general',
    question: '갑자기 멘탈이 와장창 무너졌다. 이 상황에 어울리는 카드는?',
    options: [
      { id: 'a', text: 'The Tower - 충격과 새로고침', isCorrect: true },
      { id: 'b', text: 'The Sun - 긍정 에너지', isCorrect: false },
      { id: 'c', text: 'The World - 완성과 성취', isCorrect: false },
    ],
    explanation: 'The Tower는 번개 맞은 것 같은 충격! 하지만 부실공사 무너뜨리고 새로 시작하는 기회예요.',
    difficulty: 2,
    points: 15,
    tags: ['The Tower', '멘붕', '위기'],
  },
  {
    id: 'tarot-quiz-013',
    type: 'situational',
    category: 'general',
    question: '친구들과 약속 있지만 집에만 있고 싶다. 어떤 카드?',
    options: [
      { id: 'a', text: 'The Hermit - 혼자만의 시간', isCorrect: true },
      { id: 'b', text: 'The Magician - 능력 발휘', isCorrect: false },
      { id: 'c', text: 'The Chariot - 돌격 앞으로', isCorrect: false },
    ],
    explanation: 'The Hermit은 자발적 아싸! 읽씹해도 용서되는 날, 나만의 동굴로 들어가세요.',
    difficulty: 1,
    points: 10,
    tags: ['The Hermit', '혼자', '인트로버트'],
  },
  {
    id: 'tarot-quiz-014',
    type: 'situational',
    category: 'general',
    question: '전 애인을 다 잊고 미련 정리하려고 한다. 어떤 카드?',
    options: [
      { id: 'a', text: 'Death - 끝과 새 시작', isCorrect: true },
      { id: 'b', text: 'The Lovers - 사랑', isCorrect: false },
      { id: 'c', text: 'The Devil - 유혹', isCorrect: false },
    ],
    explanation: 'Death는 청소하러 온 카드! 썩은 관계 도려내고 새 살 돋게 하는 디톡스예요.',
    difficulty: 2,
    points: 15,
    tags: ['Death', '이별', '정리'],
  },
  {
    id: 'tarot-quiz-015',
    type: 'situational',
    category: 'general',
    question: '넷플릭스 보다가 시험 기간 날렸다. 어떤 카드가 어울릴까?',
    options: [
      { id: 'a', text: 'The Devil - 길티 플레저', isCorrect: true },
      { id: 'b', text: 'Justice - 공정한 판단', isCorrect: false },
      { id: 'c', text: 'Strength - 인내심', isCorrect: false },
    ],
    explanation: 'The Devil은 거부할 수 없는 유혹! 나쁜 게 더 재밌는 거 알죠? 쇠사슬은 헐렁해요, 언제든 벗어날 수 있어요.',
    difficulty: 2,
    points: 15,
    tags: ['The Devil', '중독', '유혹'],
  },
];

// ============================================================================
// 성격 기반 퀴즈 (personality-based) - 5개
// ============================================================================

export const TAROT_PERSONALITY_QUIZZES: TarotQuiz[] = [
  {
    id: 'tarot-quiz-016',
    type: 'personality-based',
    category: 'general',
    question: 'The Magician 유형의 사람은 어떻게 할까요?',
    options: [
      { id: 'a', text: '못 하는 게 뭐야? 일단 도전!', isCorrect: true },
      { id: 'b', text: '천천히 생각하고 결정할게', isCorrect: false },
      { id: 'c', text: '다른 사람 의견 먼저 들어볼래', isCorrect: false },
    ],
    explanation: 'The Magician은 육각형 인재! 자신의 능력을 믿고 바로 실행하는 올라운더예요.',
    difficulty: 2,
    points: 15,
    tags: ['The Magician', '능력', '실행력'],
  },
  {
    id: 'tarot-quiz-017',
    type: 'personality-based',
    category: 'general',
    question: 'The High Priestess 유형이 스트레스 받으면?',
    options: [
      { id: 'a', text: '친구들 만나서 수다', isCorrect: false },
      { id: 'b', text: '혼자 조용히 명상하거나 멍때리기', isCorrect: true },
      { id: 'c', text: '운동으로 땀 빼기', isCorrect: false },
    ],
    explanation: 'The High Priestess는 I형 인간! 혼자만의 시간으로 에너지를 충전해요.',
    difficulty: 2,
    points: 15,
    tags: ['The High Priestess', '내향', '힐링'],
  },
  {
    id: 'tarot-quiz-018',
    type: 'personality-based',
    category: 'general',
    question: 'The Emperor 유형은 계획 세울 때?',
    options: [
      { id: 'a', text: '즉흥적으로 그때그때', isCorrect: false },
      { id: 'b', text: '구글 캘린더 빼곡하게 채움', isCorrect: true },
      { id: 'c', text: '큰 틀만 정하고 유연하게', isCorrect: false },
    ],
    explanation: 'The Emperor는 CEO 마인드! 체계와 규율을 사랑하는 계획왕이에요.',
    difficulty: 2,
    points: 15,
    tags: ['The Emperor', '계획', '리더십'],
  },
  {
    id: 'tarot-quiz-019',
    type: 'personality-based',
    category: 'general',
    question: 'The Star 유형은 힘들 때 어떻게 할까요?',
    options: [
      { id: 'a', text: '희망 회로 돌리며 긍정적으로!', isCorrect: true },
      { id: 'b', text: '현실 직시하고 냉정하게 대처', isCorrect: false },
      { id: 'c', text: '일단 포기하고 쉬자', isCorrect: false },
    ],
    explanation: 'The Star는 반짝반짝 희망 에너지! 덕질 대상 보며 힐링하고 미래를 꿈꿔요.',
    difficulty: 2,
    points: 15,
    tags: ['The Star', '희망', '긍정'],
  },
  {
    id: 'tarot-quiz-020',
    type: 'personality-based',
    category: 'general',
    question: 'The Moon 유형이 밤에 잠 못 이루는 이유는?',
    options: [
      { id: 'a', text: '새벽 감성에 우울해짐', isCorrect: true },
      { id: 'b', text: '내일 할 일 계획 세우느라', isCorrect: false },
      { id: 'c', text: '신나는 일 생각하느라', isCorrect: false },
    ],
    explanation: 'The Moon은 새벽 2시의 감성! 밤에 찾아오는 불안과 예민한 감수성을 가진 유형이에요.',
    difficulty: 2,
    points: 15,
    tags: ['The Moon', '불안', '감성'],
  },
];

// ============================================================================
// Export
// ============================================================================

export const TAROT_QUIZZES = [
  ...TAROT_KNOWLEDGE_QUIZZES,
  ...TAROT_SITUATIONAL_QUIZZES,
  ...TAROT_PERSONALITY_QUIZZES,
];

export default TAROT_QUIZZES;
