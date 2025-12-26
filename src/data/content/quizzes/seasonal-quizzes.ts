// ============================================================================
// 시즌 퀴즈 (크리스마스 & 새해)
// ============================================================================

import type { KnowledgeQuiz } from '../types';
import { getNewYearInfo, getZodiacAnimal, ZODIAC_ANIMALS } from '@/utils/zodiac';

// ============================================================================
// 크리스마스 퀴즈 (12월 특집) - 연도 무관, 정적 데이터
// ============================================================================

export const CHRISTMAS_QUIZZES: KnowledgeQuiz[] = [
  {
    id: 'xmas-001',
    category: 'seasonal',
    question: '산타클로스의 빨간 옷은 어느 회사 광고에서 유명해졌을까?',
    options: [
      { id: 'a', text: '코카콜라', isCorrect: true },
      { id: 'b', text: '펩시', isCorrect: false },
      { id: 'c', text: '맥도날드', isCorrect: false },
      { id: 'd', text: '스타벅스', isCorrect: false },
    ],
    explanation: '1931년 코카콜라 광고에서 빨간 옷을 입은 산타 이미지가 대중화되었어요. 그 전에는 녹색, 갈색 등 다양한 색 옷을 입었답니다!',
    difficulty: 1,
    tags: ['크리스마스', '산타', '역사', '광고'],
    meta: {
      seasonal: ['christmas'],
      priority: 10,
      timeSensitivity: {
        sensitivity: 'low',
        sourceYear: 2025
      }
    },
  },
  {
    id: 'xmas-002',
    category: 'seasonal',
    question: '루돌프 사슴의 코가 빨간 이유로 알려진 것은?',
    options: [
      { id: 'a', text: '추위에 동상 걸려서', isCorrect: false },
      { id: 'b', text: '길을 밝히려고', isCorrect: true },
      { id: 'c', text: '부끄러워서', isCorrect: false },
      { id: 'd', text: '당근을 많이 먹어서', isCorrect: false },
    ],
    explanation: '1939년 동화에서 루돌프의 빛나는 빨간 코는 안개 낀 밤에 산타 썰매의 길을 밝히는 역할이에요!',
    difficulty: 1,
    tags: ['크리스마스', '루돌프', '동화'],
    meta: { seasonal: ['christmas'], priority: 10 },
  },
  {
    id: 'xmas-003',
    category: 'seasonal',
    question: '크리스마스 트리로 가장 많이 쓰이는 나무는?',
    options: [
      { id: 'a', text: '소나무', isCorrect: false },
      { id: 'b', text: '전나무(Fir)', isCorrect: true },
      { id: 'c', text: '잣나무', isCorrect: false },
      { id: 'd', text: '편백나무', isCorrect: false },
    ],
    explanation: '전나무(Fir)가 가장 인기 있어요. 잎이 잘 안 떨어지고 향이 좋아서 실내 트리로 최적이랍니다!',
    difficulty: 2,
    tags: ['크리스마스', '트리', '나무'],
    meta: { seasonal: ['christmas'], priority: 8 },
  },
  {
    id: 'xmas-004',
    category: 'seasonal',
    question: '"징글벨"은 원래 어떤 날을 위한 노래였을까?',
    options: [
      { id: 'a', text: '크리스마스', isCorrect: false },
      { id: 'b', text: '추수감사절', isCorrect: true },
      { id: 'c', text: '발렌타인데이', isCorrect: false },
      { id: 'd', text: '할로윈', isCorrect: false },
    ],
    explanation: '1857년 제임스 피어폰트가 추수감사절용으로 작곡했는데, 나중에 크리스마스 캐롤로 더 유명해졌어요!',
    difficulty: 2,
    tags: ['크리스마스', '캐롤', '역사'],
    meta: { seasonal: ['christmas'], priority: 9 },
  },
  {
    id: 'xmas-005',
    category: 'seasonal',
    question: '한국에서 크리스마스가 공휴일이 된 것은 언제부터?',
    options: [
      { id: 'a', text: '1945년', isCorrect: false },
      { id: 'b', text: '1949년', isCorrect: true },
      { id: 'c', text: '1960년', isCorrect: false },
      { id: 'd', text: '1975년', isCorrect: false },
    ],
    explanation: '1949년부터 공휴일로 지정되었어요. 당시 기독교 인구가 많아 이승만 정부에서 결정했답니다!',
    difficulty: 3,
    tags: ['크리스마스', '한국', '역사', '공휴일'],
    meta: { seasonal: ['christmas'], priority: 7 },
  },
  {
    id: 'xmas-006',
    category: 'seasonal',
    question: '크리스마스 장식 "미슬토(겨우살이)" 아래서 하는 전통은?',
    options: [
      { id: 'a', text: '춤추기', isCorrect: false },
      { id: 'b', text: '키스하기', isCorrect: true },
      { id: 'c', text: '선물 교환', isCorrect: false },
      { id: 'd', text: '소원 빌기', isCorrect: false },
    ],
    explanation: '북유럽 신화에서 유래된 전통! 미슬토 아래 만난 사람과 키스하면 사랑이 이루어진대요.',
    difficulty: 1,
    tags: ['크리스마스', '미슬토', '전통', '로맨스'],
    meta: { seasonal: ['christmas'], priority: 9 },
  },
  {
    id: 'xmas-007',
    category: 'seasonal',
    question: '호주에서는 12월 크리스마스가 어떤 계절일까?',
    options: [
      { id: 'a', text: '겨울', isCorrect: false },
      { id: 'b', text: '여름', isCorrect: true },
      { id: 'c', text: '봄', isCorrect: false },
      { id: 'd', text: '가을', isCorrect: false },
    ],
    explanation: '남반구는 계절이 반대! 호주에서는 해변에서 크리스마스를 즐기고, 산타도 서핑보드를 타기도 해요!',
    difficulty: 1,
    tags: ['크리스마스', '호주', '계절'],
    meta: { seasonal: ['christmas'], priority: 8 },
  },
  {
    id: 'xmas-008',
    category: 'seasonal',
    question: '크리스마스 캐롤 "고요한 밤"이 처음 불린 나라는?',
    options: [
      { id: 'a', text: '독일', isCorrect: false },
      { id: 'b', text: '영국', isCorrect: false },
      { id: 'c', text: '오스트리아', isCorrect: true },
      { id: 'd', text: '미국', isCorrect: false },
    ],
    explanation: '1818년 오스트리아 오베른도르프 마을에서 처음 불렸어요. 오르간이 고장나서 기타 반주로 불렀대요!',
    difficulty: 2,
    tags: ['크리스마스', '캐롤', '역사'],
    meta: { seasonal: ['christmas'], priority: 7 },
  },
  {
    id: 'xmas-009',
    category: 'seasonal',
    question: '일본에서 크리스마스에 먹는 전통 음식은?',
    options: [
      { id: 'a', text: '라멘', isCorrect: false },
      { id: 'b', text: 'KFC 치킨', isCorrect: true },
      { id: 'c', text: '스시', isCorrect: false },
      { id: 'd', text: '카레', isCorrect: false },
    ],
    explanation: '1974년 KFC 마케팅이 대성공! "크리스마스엔 켄터키"라는 문화가 자리잡아 한 달 전부터 예약해야 할 정도예요!',
    difficulty: 1,
    tags: ['크리스마스', '일본', '음식', 'KFC'],
    meta: { seasonal: ['christmas'], priority: 10 },
  },
  {
    id: 'xmas-010',
    category: 'seasonal',
    question: '산타의 순록은 몇 마리일까? (루돌프 포함)',
    options: [
      { id: 'a', text: '6마리', isCorrect: false },
      { id: 'b', text: '8마리', isCorrect: false },
      { id: 'c', text: '9마리', isCorrect: true },
      { id: 'd', text: '12마리', isCorrect: false },
    ],
    explanation: '대셔, 댄서, 프랜서, 빅슨, 코멧, 큐피드, 도너, 블릿첸 + 루돌프 = 9마리! 루돌프는 1939년에 추가되었어요.',
    difficulty: 2,
    tags: ['크리스마스', '산타', '루돌프', '순록'],
    meta: { seasonal: ['christmas'], priority: 9 },
  },
];

// ============================================================================
// 새해 퀴즈 (1월 특집) - 동적 연도/띠 생성
// ============================================================================

/**
 * 새해 퀴즈 동적 생성 (팩토리 함수)
 *
 * 12월에 호출하면 다음해 정보로 생성됨.
 * 런타임에 최신 데이터가 필요하면 이 함수를 직접 호출.
 *
 * @example
 * // 모듈 로드 시점 데이터 (캐시됨)
 * import { NEWYEAR_QUIZZES } from './seasonal-quizzes';
 *
 * // 런타임 최신 데이터 (항상 현재 시간 기준)
 * import { createNewYearQuizzes } from './seasonal-quizzes';
 * const freshQuizzes = createNewYearQuizzes();
 */
export function createNewYearQuizzes(): KnowledgeQuiz[] {
  const info = getNewYearInfo();
  const { year, ganjiName, zodiacName, coloredName, animal } = info;

  // 다음해(+1) 띠 정보 (오답 보기용)
  const nextAnimal = getZodiacAnimal(year + 1);
  // 전해(-1) 띠 정보 (오답 보기용)
  const prevAnimal = getZodiacAnimal(year - 1);

  // 오답 보기용: 정답/전년/다음년 제외한 동물 중 하나 선택
  const excludedKeys = new Set([animal.key, prevAnimal.key, nextAnimal.key]);
  const otherAnimals = ZODIAC_ANIMALS.filter(a => !excludedKeys.has(a.key));
  const randomDistractor = otherAnimals[year % otherAnimals.length]; // 연도 기반 결정적 선택

  return [
    {
      id: `newyear-${year}-001`,  // 연도 포함 (연도별 분석용)
      category: 'seasonal',
      question: `${year}년 ${ganjiName}의 띠 동물은?`,
      options: [
        { id: 'a', text: prevAnimal.name, isCorrect: false },
        { id: 'b', text: animal.name, isCorrect: true },
        { id: 'c', text: nextAnimal.name, isCorrect: false },
        { id: 'd', text: randomDistractor.name, isCorrect: false },
      ],
      explanation: `${year}년은 ${ganjiName.replace('년', '')}, ${zodiacName} 해예요! "${coloredName}의 해"라고도 불러요.`,
      difficulty: 1,
      tags: ['새해', `${year}`, ganjiName.replace('년', '').replace(/\(.*\)/, ''), zodiacName],
      meta: { seasonal: ['newyear'], priority: 10 },
    },
    {
      id: 'newyear-002',
      category: 'seasonal',
      question: '한국에서 새해 첫날 먹는 전통 음식은?',
      options: [
        { id: 'a', text: '비빔밥', isCorrect: false },
        { id: 'b', text: '떡국', isCorrect: true },
        { id: 'c', text: '삼계탕', isCorrect: false },
        { id: 'd', text: '냉면', isCorrect: false },
      ],
      explanation: '떡국을 먹어야 나이 한 살을 먹는다는 전통이 있어요. 흰 가래떡은 새해 시작의 순수함을 상징해요!',
      difficulty: 1,
      tags: ['새해', '설날', '떡국', '전통'],
      meta: { seasonal: ['newyear'], priority: 10 },
    },
    {
      id: 'newyear-003',
      category: 'seasonal',
      question: '세계에서 가장 먼저 새해를 맞이하는 나라는?',
      options: [
        { id: 'a', text: '호주', isCorrect: false },
        { id: 'b', text: '뉴질랜드', isCorrect: false },
        { id: 'c', text: '키리바시', isCorrect: true },
        { id: 'd', text: '일본', isCorrect: false },
      ],
      explanation: '태평양의 작은 섬나라 키리바시가 UTC+14로 가장 먼저 새해를 맞이해요! 한국보다 5시간 빨라요.',
      difficulty: 3,
      tags: ['새해', '세계', '시간대'],
      meta: { seasonal: ['newyear'], priority: 8 },
    },
    {
      id: 'newyear-004',
      category: 'seasonal',
      question: '스페인에서 새해 자정에 먹는 전통 음식은?',
      options: [
        { id: 'a', text: '파에야', isCorrect: false },
        { id: 'b', text: '포도 12알', isCorrect: true },
        { id: 'c', text: '츄러스', isCorrect: false },
        { id: 'd', text: '하몽', isCorrect: false },
      ],
      explanation: '자정 종소리 12번에 맞춰 포도 12알을 먹으면 12달 내내 행운이 온대요! 꽤 어려운 챌린지예요.',
      difficulty: 2,
      tags: ['새해', '스페인', '전통', '포도'],
      meta: { seasonal: ['newyear'], priority: 9 },
    },
    {
      id: 'newyear-005',
      category: 'seasonal',
      question: '덴마크에서 새해에 문 앞에 던지는 것은?',
      options: [
        { id: 'a', text: '신발', isCorrect: false },
        { id: 'b', text: '접시', isCorrect: true },
        { id: 'c', text: '꽃', isCorrect: false },
        { id: 'd', text: '동전', isCorrect: false },
      ],
      explanation: '친구 집 문 앞에 접시를 던져 깨뜨리는 전통이 있어요. 깨진 접시가 많을수록 친구가 많다는 뜻!',
      difficulty: 2,
      tags: ['새해', '덴마크', '전통'],
      meta: { seasonal: ['newyear'], priority: 7 },
    },
    {
      id: 'newyear-006',
      category: 'seasonal',
      question: '일본에서 새해에 치는 종의 횟수는?',
      options: [
        { id: 'a', text: '12번', isCorrect: false },
        { id: 'b', text: '33번', isCorrect: false },
        { id: 'c', text: '108번', isCorrect: true },
        { id: 'd', text: '365번', isCorrect: false },
      ],
      explanation: '불교의 108가지 번뇌를 씻어내는 의미로 제야의 종을 108번 쳐요. 마지막 종은 자정에 맞춰요!',
      difficulty: 2,
      tags: ['새해', '일본', '전통', '불교'],
      meta: { seasonal: ['newyear'], priority: 8 },
    },
    {
      id: 'newyear-007',
      category: 'seasonal',
      question: '새해 결심을 영어로 뭐라고 할까?',
      options: [
        { id: 'a', text: 'New Year Plan', isCorrect: false },
        { id: 'b', text: 'New Year Resolution', isCorrect: true },
        { id: 'c', text: 'New Year Promise', isCorrect: false },
        { id: 'd', text: 'New Year Goal', isCorrect: false },
      ],
      explanation: 'Resolution은 "결심, 결의"라는 뜻! 통계에 따르면 새해 결심의 88%가 실패한대요...',
      difficulty: 1,
      tags: ['새해', '영어', '결심'],
      meta: { seasonal: ['newyear'], priority: 8 },
    },
    {
      id: 'newyear-008',
      category: 'seasonal',
      question: '한국에서 새해 첫 해돋이 명소로 유명한 곳은?',
      options: [
        { id: 'a', text: '독도', isCorrect: false },
        { id: 'b', text: '정동진', isCorrect: true },
        { id: 'c', text: '부산 해운대', isCorrect: false },
        { id: 'd', text: '제주도', isCorrect: false },
      ],
      explanation: '강원도 정동진은 서울에서 가장 가까운 동해 일출 명소! 드라마 "모래시계" 이후 유명해졌어요.',
      difficulty: 1,
      tags: ['새해', '한국', '일출', '정동진'],
      meta: { seasonal: ['newyear'], priority: 9 },
    },
    {
      id: 'newyear-009',
      category: 'seasonal',
      question: '미국 뉴욕 타임스퀘어에서 새해 카운트다운 때 떨어지는 것은?',
      options: [
        { id: 'a', text: '거대한 별', isCorrect: false },
        { id: 'b', text: '크리스탈 볼', isCorrect: true },
        { id: 'c', text: '거대한 시계', isCorrect: false },
        { id: 'd', text: '폭죽', isCorrect: false },
      ],
      explanation: '1907년부터 시작된 "볼 드롭(Ball Drop)"! 무게 5톤, 지름 3.7m의 크리스탈 볼이 60초간 내려와요.',
      difficulty: 2,
      tags: ['새해', '미국', '뉴욕', '타임스퀘어'],
      meta: { seasonal: ['newyear'], priority: 9 },
    },
    {
      id: 'newyear-010',
      category: 'seasonal',
      question: '브라질에서 새해에 행운을 빌며 입는 속옷 색깔은?',
      options: [
        { id: 'a', text: '빨간색', isCorrect: false },
        { id: 'b', text: '흰색', isCorrect: true },
        { id: 'c', text: '노란색', isCorrect: false },
        { id: 'd', text: '파란색', isCorrect: false },
      ],
      explanation: '흰색은 평화와 행운을 상징해요! 사랑을 원하면 빨간색, 돈을 원하면 노란색을 입는다고도 해요.',
      difficulty: 2,
      tags: ['새해', '브라질', '전통'],
      meta: { seasonal: ['newyear'], priority: 7 },
    },
  ];
}

// ============================================================================
// 모듈 로드 시점 캐시 데이터
// ============================================================================
// ⚠️ 주의: 모듈 로드 시점에 연도가 고정됨
// - 장기 실행 프로세스: 연말/연초에 재시작 필요
// - Vercel 서버리스: 콜드 스타트 시 자동 갱신 (대부분 OK)
// - 런타임 최신 필요 시: createNewYearQuizzes() 직접 호출
export const NEWYEAR_QUIZZES: KnowledgeQuiz[] = createNewYearQuizzes();

// ============================================================================
// 통합 Export
// ============================================================================

export const SEASONAL_QUIZZES: KnowledgeQuiz[] = [
  ...CHRISTMAS_QUIZZES,
  ...NEWYEAR_QUIZZES,
];
