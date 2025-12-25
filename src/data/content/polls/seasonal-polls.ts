// ============================================================================
// 시즌 투표 (크리스마스 & 새해)
// ============================================================================

import type { VSPoll, ChoicePoll } from '../types';
import { getNewYearInfo } from '@/utils/zodiac';

// ============================================================================
// 크리스마스 VS 투표 - 연도 무관, 정적 데이터
// ============================================================================

export const CHRISTMAS_VS_POLLS: VSPoll[] = [
  {
    id: 'xmas-vs-001',
    category: 'seasonal',
    question: '크리스마스에 더 좋은 건?',
    optionA: { id: 'a', text: '눈 오는 화이트 크리스마스', emoji: '❄️' },
    optionB: { id: 'b', text: '따뜻한 실내에서 영화 보기', emoji: '🎬' },
    tags: ['크리스마스', '날씨', '취향'],
    meta: { seasonal: ['christmas'], priority: 10 },
  },
  {
    id: 'xmas-vs-002',
    category: 'seasonal',
    question: '크리스마스 선물로 더 좋은 건?',
    optionA: { id: 'a', text: '깜짝 서프라이즈 선물', emoji: '🎁' },
    optionB: { id: 'b', text: '원하는 거 미리 말하기', emoji: '📝' },
    tags: ['크리스마스', '선물', '취향'],
    meta: { seasonal: ['christmas'], priority: 10 },
  },
  {
    id: 'xmas-vs-003',
    category: 'seasonal',
    question: '크리스마스 음식으로 더 끌리는 건?',
    optionA: { id: 'a', text: '따끈한 크리스마스 케이크', emoji: '🎂' },
    optionB: { id: 'b', text: '바삭한 치킨', emoji: '🍗' },
    tags: ['크리스마스', '음식', '취향'],
    meta: { seasonal: ['christmas'], priority: 9 },
  },
  {
    id: 'xmas-vs-004',
    category: 'seasonal',
    question: '크리스마스 데이트 장소는?',
    optionA: { id: 'a', text: '화려한 조명의 거리', emoji: '✨' },
    optionB: { id: 'b', text: '아늑한 카페', emoji: '☕' },
    tags: ['크리스마스', '데이트', '연애'],
    meta: { seasonal: ['christmas'], priority: 9 },
  },
  {
    id: 'xmas-vs-005',
    category: 'seasonal',
    question: '크리스마스 영화로 더 끌리는 건?',
    optionA: { id: 'a', text: '로맨틱 코미디', emoji: '💕' },
    optionB: { id: 'b', text: '나홀로 집에 같은 코미디', emoji: '😂' },
    tags: ['크리스마스', '영화', '취향'],
    meta: { seasonal: ['christmas'], priority: 8 },
  },
];

// ============================================================================
// 크리스마스 선택 투표 - 연도 무관, 정적 데이터
// ============================================================================

export const CHRISTMAS_CHOICE_POLLS: ChoicePoll[] = [
  {
    id: 'xmas-choice-001',
    category: 'seasonal',
    question: '가장 설레는 크리스마스 캐롤은?',
    options: [
      { id: 'a', text: 'All I Want for Christmas Is You', emoji: '🎤' },
      { id: 'b', text: 'Last Christmas', emoji: '💔' },
      { id: 'c', text: 'Jingle Bell Rock', emoji: '🔔' },
      { id: 'd', text: '고요한 밤 거룩한 밤', emoji: '🌙' },
    ],
    tags: ['크리스마스', '캐롤', '음악'],
    meta: { seasonal: ['christmas'], priority: 9 },
  },
  {
    id: 'xmas-choice-002',
    category: 'seasonal',
    question: '크리스마스에 가장 받고 싶은 선물은?',
    options: [
      { id: 'a', text: '전자기기 (폰, 에어팟 등)', emoji: '📱' },
      { id: 'b', text: '패션 아이템 (옷, 가방 등)', emoji: '👗' },
      { id: 'c', text: '맛있는 음식/디저트', emoji: '🍰' },
      { id: 'd', text: '현금이 최고', emoji: '💰' },
    ],
    tags: ['크리스마스', '선물', '취향'],
    meta: { seasonal: ['christmas'], priority: 10 },
  },
];

// ============================================================================
// 새해 투표 - 동적 연도/띠 생성
// ============================================================================

/**
 * 새해 VS 투표 동적 생성 (팩토리 함수)
 *
 * 런타임에 최신 데이터가 필요하면 이 함수를 직접 호출.
 *
 * @example
 * import { createNewYearVSPolls } from './seasonal-polls';
 * const freshPolls = createNewYearVSPolls();
 */
export function createNewYearVSPolls(): VSPoll[] {
  const { year } = getNewYearInfo();

  return [
    {
      id: 'newyear-vs-001',
      category: 'seasonal',
      question: '새해 첫날 아침에 더 좋은 건?',
      optionA: { id: 'a', text: '해돋이 보러 가기', emoji: '🌅' },
      optionB: { id: 'b', text: '따뜻한 이불 속에서 늦잠', emoji: '😴' },
      tags: ['새해', '아침', '취향'],
      meta: { seasonal: ['newyear'], priority: 10 },
    },
    {
      id: 'newyear-vs-002',
      category: 'seasonal',
      question: '새해 결심 스타일은?',
      optionA: { id: 'a', text: '큰 목표 하나 정해서 올인', emoji: '🎯' },
      optionB: { id: 'b', text: '작은 목표 여러 개로 분산', emoji: '📋' },
      tags: ['새해', '결심', '성향'],
      meta: { seasonal: ['newyear'], priority: 10 },
    },
    {
      id: 'newyear-vs-003',
      category: 'seasonal',
      question: '새해 카운트다운은 어디서?',
      optionA: { id: 'a', text: '사람 많은 광장에서', emoji: '🎉' },
      optionB: { id: 'b', text: '집에서 가족/친구와', emoji: '🏠' },
      tags: ['새해', '카운트다운', '취향'],
      meta: { seasonal: ['newyear'], priority: 9 },
    },
    {
      id: `newyear-vs-${year}-004`,  // 연도 포함 (연도별 분석용)
      category: 'seasonal',
      question: `${year}년에 더 중요한 건?`,
      optionA: { id: 'a', text: '새로운 도전과 경험', emoji: '🚀' },
      optionB: { id: 'b', text: '안정과 평화로운 일상', emoji: '🌿' },
      tags: ['새해', `${year}`, '가치관'],
      meta: { seasonal: ['newyear'], priority: 10 },
    },
    {
      id: 'newyear-vs-005',
      category: 'seasonal',
      question: '새해 선물로 더 좋은 건?',
      optionA: { id: 'a', text: '다이어리/플래너', emoji: '📔' },
      optionB: { id: 'b', text: '현금/상품권', emoji: '💵' },
      tags: ['새해', '선물', '취향'],
      meta: { seasonal: ['newyear'], priority: 8 },
    },
  ];
}

/**
 * 새해 선택 투표 동적 생성 (팩토리 함수)
 *
 * 런타임에 최신 데이터가 필요하면 이 함수를 직접 호출.
 */
export function createNewYearChoicePolls(): ChoicePoll[] {
  const info = getNewYearInfo();
  const { year, ganjiName, zodiacName, animal } = info;

  return [
    {
      id: `newyear-choice-${year}-001`,  // 연도 포함 (연도별 분석용)
      category: 'seasonal',
      question: `${year}년 가장 이루고 싶은 목표는?`,
      options: [
        { id: 'a', text: '건강/다이어트', emoji: '💪' },
        { id: 'b', text: '돈 모으기/재테크', emoji: '💰' },
        { id: 'c', text: '자기계발/공부', emoji: '📚' },
        { id: 'd', text: '여행/새로운 경험', emoji: '✈️' },
      ],
      tags: ['새해', `${year}`, '목표', '결심'],
      meta: { seasonal: ['newyear'], priority: 10 },
    },
    {
      id: `newyear-choice-${year}-002`,  // 연도 포함 (연도별 분석용)
      category: 'seasonal',
      question: `${year}년 ${ganjiName} ${animal.name}띠의 기운을 받는다면?`,
      options: [
        { id: 'a', text: `${animal.name}처럼 유연한 적응력`, emoji: animal.emoji },
        { id: 'b', text: `${animal.name}처럼 집요한 목표 달성`, emoji: '🎯' },
        { id: 'c', text: `${animal.name}처럼 탈피하는 변화`, emoji: '🔄' },
        { id: 'd', text: `${animal.name}처럼 차분한 판단력`, emoji: '🧠' },
      ],
      tags: ['새해', `${year}`, ganjiName.replace(/년\(.*\)/, ''), zodiacName],
      meta: { seasonal: ['newyear'], priority: 9 },
    },
    {
      id: 'newyear-choice-003',
      category: 'seasonal',
      question: '새해 첫날 가장 하고 싶은 건?',
      options: [
        { id: 'a', text: '가족과 떡국 먹기', emoji: '🍲' },
        { id: 'b', text: '친구들과 새해 파티', emoji: '🎉' },
        { id: 'c', text: '조용히 혼자 계획 세우기', emoji: '📝' },
        { id: 'd', text: '그냥 푹 쉬기', emoji: '😴' },
      ],
      tags: ['새해', '첫날', '계획'],
      meta: { seasonal: ['newyear'], priority: 8 },
    },
  ];
}

// ============================================================================
// 모듈 로드 시점 캐시 데이터
// ============================================================================
// ⚠️ 주의: 모듈 로드 시점에 연도가 고정됨
// - 장기 실행 프로세스: 연말/연초에 재시작 필요
// - Vercel 서버리스: 콜드 스타트 시 자동 갱신 (대부분 OK)
// - 런타임 최신 필요 시: createNewYearVSPolls(), createNewYearChoicePolls() 직접 호출
export const NEWYEAR_VS_POLLS: VSPoll[] = createNewYearVSPolls();
export const NEWYEAR_CHOICE_POLLS: ChoicePoll[] = createNewYearChoicePolls();

// ============================================================================
// 통합 Export
// ============================================================================

export const SEASONAL_VS_POLLS: VSPoll[] = [
  ...CHRISTMAS_VS_POLLS,
  ...NEWYEAR_VS_POLLS,
];

export const SEASONAL_CHOICE_POLLS: ChoicePoll[] = [
  ...CHRISTMAS_CHOICE_POLLS,
  ...NEWYEAR_CHOICE_POLLS,
];
