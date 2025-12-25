// ============================================================================
// 돈과 관계 관련 투표 (Money & Relationship Polls)
// ============================================================================

import type { ChoicePoll } from '../types';

export const MONEY_POLLS: ChoicePoll[] = [
  // ============================================================================
  // 축의금 (결혼식) - 금액 투표
  // ============================================================================
  {
    id: 'money-wedding-001',
    category: 'money',
    question: '친구 결혼식 축의금, 얼마가 적당해?',
    options: [
      { id: 'a', text: '3만원', emoji: '💵' },
      { id: 'b', text: '5만원', emoji: '💴' },
      { id: 'c', text: '10만원', emoji: '💰' },
      { id: 'd', text: '15만원', emoji: '💸' },
      { id: 'e', text: '20만원 이상', emoji: '💎' },
    ],
    tags: ['축의금', '결혼', '경조사', '돈'],
    meta: {
      minAge: '20s',
      timeSensitivity: {
        sensitivity: 'high',
        sourceYear: 2025,
        validUntil: '2027-12',
      },
    },
  },
  {
    id: 'money-wedding-002',
    category: 'money',
    question: '절친 결혼식 축의금, 얼마 할 거야?',
    options: [
      { id: 'a', text: '10만원', emoji: '💵' },
      { id: 'b', text: '15만원', emoji: '💴' },
      { id: 'c', text: '20만원', emoji: '💰' },
      { id: 'd', text: '30만원', emoji: '💸' },
      { id: 'e', text: '50만원 이상', emoji: '💎' },
    ],
    tags: ['축의금', '결혼', '친구', '돈'],
    meta: {
      minAge: '20s',
      timeSensitivity: {
        sensitivity: 'high',
        sourceYear: 2025,
        validUntil: '2027-12',
      },
    },
  },
  {
    id: 'money-wedding-003',
    category: 'money',
    question: '직장동료 결혼식 축의금은?',
    options: [
      { id: 'a', text: '3만원 (형식적 관계)', emoji: '💵' },
      { id: 'b', text: '5만원 (보통 동료)', emoji: '💴' },
      { id: 'c', text: '7만원 (가까운 동료)', emoji: '💰' },
      { id: 'd', text: '10만원 (친한 동료)', emoji: '💸' },
      { id: 'e', text: '안 감', emoji: '🙅' },
    ],
    tags: ['축의금', '결혼', '직장', '동료'],
    meta: {
      minAge: '20s',
      timeSensitivity: {
        sensitivity: 'high',
        sourceYear: 2025,
        validUntil: '2027-12',
      },
    },
  },
  {
    id: 'money-wedding-004',
    category: 'money',
    question: '안 친한 동창 결혼식 초대받음 - 축의금은?',
    options: [
      { id: 'a', text: '3만원 (최소한)', emoji: '💵' },
      { id: 'b', text: '5만원 (예의상)', emoji: '💴' },
      { id: 'c', text: '10만원 (동창이니까)', emoji: '💰' },
      { id: 'd', text: '안 가고 축의금만 보냄', emoji: '✉️' },
      { id: 'e', text: '안 감', emoji: '🙅' },
    ],
    tags: ['축의금', '결혼', '동창', '고민'],
    meta: {
      minAge: '20s',
      timeSensitivity: {
        sensitivity: 'high',
        sourceYear: 2025,
        validUntil: '2027-12',
      },
    },
  },
  {
    id: 'money-wedding-005',
    category: 'money',
    question: '상사/팀장님 결혼식 축의금은?',
    options: [
      { id: 'a', text: '5만원', emoji: '💵' },
      { id: 'b', text: '10만원', emoji: '💴' },
      { id: 'c', text: '15만원', emoji: '💰' },
      { id: 'd', text: '20만원', emoji: '💸' },
      { id: 'e', text: '팀원들이랑 모아서', emoji: '👥' },
    ],
    tags: ['축의금', '결혼', '직장', '상사'],
    meta: {
      minAge: '20s',
      timeSensitivity: {
        sensitivity: 'high',
        sourceYear: 2025,
        validUntil: '2027-12',
      },
    },
  },

  // ============================================================================
  // 조의금 (장례식) - 금액 투표
  // ============================================================================
  {
    id: 'money-funeral-001',
    category: 'money',
    question: '친구 부모님 조의금, 얼마가 적당해?',
    options: [
      { id: 'a', text: '3만원', emoji: '🕯️' },
      { id: 'b', text: '5만원', emoji: '🙏' },
      { id: 'c', text: '10만원', emoji: '💐' },
      { id: 'd', text: '15만원', emoji: '💝' },
      { id: 'e', text: '20만원 이상', emoji: '🤍' },
    ],
    tags: ['조의금', '장례', '경조사', '돈'],
    meta: {
      minAge: '20s',
      timeSensitivity: {
        sensitivity: 'high',
        sourceYear: 2025,
        validUntil: '2027-12',
      },
    },
  },
  {
    id: 'money-funeral-002',
    category: 'money',
    question: '직장동료 부모님 조의금은?',
    options: [
      { id: 'a', text: '3만원', emoji: '🕯️' },
      { id: 'b', text: '5만원', emoji: '🙏' },
      { id: 'c', text: '10만원', emoji: '💐' },
      { id: 'd', text: '팀원들이랑 모아서', emoji: '👥' },
      { id: 'e', text: '안 감 (친하지 않으면)', emoji: '🤷' },
    ],
    tags: ['조의금', '장례', '직장', '동료'],
    meta: {
      minAge: '20s',
      timeSensitivity: {
        sensitivity: 'high',
        sourceYear: 2025,
        validUntil: '2027-12',
      },
    },
  },
  {
    id: 'money-funeral-003',
    category: 'money',
    question: '상사 부모님 부고 - 조의금은?',
    options: [
      { id: 'a', text: '5만원', emoji: '🕯️' },
      { id: 'b', text: '10만원', emoji: '🙏' },
      { id: 'c', text: '15만원', emoji: '💐' },
      { id: 'd', text: '팀에서 모금해서', emoji: '👥' },
      { id: 'e', text: '회사 규정 따름', emoji: '📋' },
    ],
    tags: ['조의금', '장례', '직장', '상사'],
    meta: {
      minAge: '20s',
      timeSensitivity: {
        sensitivity: 'high',
        sourceYear: 2025,
        validUntil: '2027-12',
      },
    },
  },

  // ============================================================================
  // 축의금/조의금 애매한 상황 투표
  // ============================================================================
  {
    id: 'money-situation-001',
    category: 'money',
    question: '안 친한데 나만 초대받은 결혼식 - 어떻게 해?',
    options: [
      { id: 'a', text: '가서 최소 금액 축의금', emoji: '🚶' },
      { id: 'b', text: '축의금만 보내고 불참', emoji: '✉️' },
      { id: 'c', text: '솔직히 바빠서 못 간다고', emoji: '😅' },
      { id: 'd', text: '축의금도 안 하고 축하만', emoji: '🙅' },
      { id: 'e', text: '연락 안 받음', emoji: '📵' },
    ],
    tags: ['축의금', '결혼', '고민', '관계'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-situation-002',
    category: 'money',
    question: '예전엔 친했는데 연락 끊긴 친구 결혼식 초대장 왔다...',
    options: [
      { id: 'a', text: '가서 옛정 생각하고 축의금', emoji: '🥹' },
      { id: 'b', text: '축의금만 보내고 불참', emoji: '✉️' },
      { id: 'c', text: '축하 메시지만 보냄', emoji: '💬' },
      { id: 'd', text: '바빠서 못 간다고 거절', emoji: '🙅' },
      { id: 'e', text: '씹', emoji: '😑' },
    ],
    tags: ['축의금', '결혼', '친구', '고민'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-situation-003',
    category: 'money',
    question: '내 결혼식 안 온 친구가 나한테 청첩장 보냄',
    options: [
      { id: 'a', text: '그래도 축의금 함', emoji: '😇' },
      { id: 'b', text: '받은 만큼만 똑같이', emoji: '⚖️' },
      { id: 'c', text: '축하 메시지만', emoji: '💬' },
      { id: 'd', text: '안 감 (앙갚음)', emoji: '😠' },
      { id: 'e', text: '연락해서 왜 안 왔냐고 물어봄', emoji: '🤨' },
    ],
    tags: ['축의금', '결혼', '관계', '고민'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-situation-004',
    category: 'money',
    question: '재혼하는 친구 축의금도 또 내야 돼?',
    options: [
      { id: 'a', text: '당연히 또 냄', emoji: '😊' },
      { id: 'b', text: '첫 결혼보다 적게', emoji: '💵' },
      { id: 'c', text: '축하 선물로 대체', emoji: '🎁' },
      { id: 'd', text: '축하 메시지만', emoji: '💬' },
      { id: 'e', text: '안 냄', emoji: '🙅' },
    ],
    tags: ['축의금', '결혼', '재혼', '고민'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-situation-005',
    category: 'money',
    question: '내 축의금 받고 연락 끊은 친구가 다시 연락함',
    options: [
      { id: 'a', text: '그래도 받아줌', emoji: '😌' },
      { id: 'b', text: '차갑게 대응', emoji: '😑' },
      { id: 'c', text: '축의금 언급함', emoji: '💸' },
      { id: 'd', text: '무시', emoji: '🙅' },
      { id: 'e', text: '연락 차단', emoji: '🚫' },
    ],
    tags: ['축의금', '관계', '친구', '돈'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-situation-006',
    category: 'money',
    question: '단톡방으로만 아는 동창 결혼식 초대장',
    options: [
      { id: 'a', text: '가서 축의금 냄', emoji: '🚶' },
      { id: 'b', text: '축의금만 보냄', emoji: '✉️' },
      { id: 'c', text: '단톡방에 축하 메시지', emoji: '💬' },
      { id: 'd', text: '조용히 무시', emoji: '🤫' },
      { id: 'e', text: '단톡방 나감', emoji: '🏃' },
    ],
    tags: ['축의금', '결혼', '동창', '고민'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-situation-007',
    category: 'money',
    question: '입사 1년차, 모르는 부서 부장님 부모님 부고',
    options: [
      { id: 'a', text: '가서 조의금 낸다', emoji: '🙏' },
      { id: 'b', text: '팀원들한테 물어봄', emoji: '🤔' },
      { id: 'c', text: '선배들 따라감', emoji: '👥' },
      { id: 'd', text: '안 감 (모르는 사이)', emoji: '🤷' },
      { id: 'e', text: '회사 규정 확인', emoji: '📋' },
    ],
    tags: ['조의금', '장례', '직장', '신입'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-situation-008',
    category: 'money',
    question: '퇴사한 전 직장 동료 부모님 부고 연락 왔다',
    options: [
      { id: 'a', text: '가서 조의금 낸다', emoji: '🙏' },
      { id: 'b', text: '조의금만 보냄', emoji: '✉️' },
      { id: 'c', text: '위로 메시지만', emoji: '💬' },
      { id: 'd', text: '전화로 위로', emoji: '📞' },
      { id: 'e', text: '안 감 (이미 퇴사함)', emoji: '🙅' },
    ],
    tags: ['조의금', '장례', '직장', '퇴사'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },

  // ============================================================================
  // 더치페이/N빵 상황 투표
  // ============================================================================
  {
    id: 'money-dutch-001',
    category: 'money',
    question: '연봉 차이 큰 친구랑 식사 - N빵 해야 돼?',
    options: [
      { id: 'a', text: '무조건 N빵', emoji: '⚖️' },
      { id: 'b', text: '내가 더 벌면 내가 냄', emoji: '😎' },
      { id: 'c', text: '번갈아가며', emoji: '🔄' },
      { id: 'd', text: '비율로 나눔', emoji: '📊' },
      { id: 'e', text: '각자 먹은 만큼', emoji: '🍽️' },
    ],
    tags: ['더치페이', '식사', '친구', '돈'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-dutch-002',
    category: 'money',
    question: '안 먹은 메뉴(술)도 N빵 해야 돼?',
    options: [
      { id: 'a', text: '당연히 N빵', emoji: '👥' },
      { id: 'b', text: '술값만 따로 정산', emoji: '🍺' },
      { id: 'c', text: '각자 먹은 만큼', emoji: '🍽️' },
      { id: 'd', text: '분위기 보고 결정', emoji: '🤔' },
      { id: 'e', text: '술 먹은 사람들끼리', emoji: '🍻' },
    ],
    tags: ['더치페이', '술', 'N빵', '돈'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-dutch-003',
    category: 'money',
    question: '한 명이 혼자 비싼 메뉴 시킴 - N빵?',
    options: [
      { id: 'a', text: '그래도 N빵', emoji: '😑' },
      { id: 'b', text: '각자 먹은 만큼', emoji: '🍽️' },
      { id: 'c', text: '슬쩍 눈치줌', emoji: '👀' },
      { id: 'd', text: '다음엔 안 만남', emoji: '🚫' },
      { id: 'e', text: '직접 얘기함', emoji: '💬' },
    ],
    tags: ['더치페이', 'N빵', '고민', '돈'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-dutch-004',
    category: 'money',
    question: '연인이랑 데이트 비용 - 어떻게 해?',
    options: [
      { id: 'a', text: '무조건 더치', emoji: '⚖️' },
      { id: 'b', text: '번갈아가며', emoji: '🔄' },
      { id: 'c', text: '내가 더 많이 냄', emoji: '😎' },
      { id: 'd', text: '상대가 더 많이 냄', emoji: '😌' },
      { id: 'e', text: '상황마다 다름', emoji: '🤷' },
    ],
    tags: ['데이트', '연애', '더치페이', '돈'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },

  // ============================================================================
  // 돈 빌려주기 상황 투표
  // ============================================================================
  {
    id: 'money-lend-001',
    category: 'money',
    question: '친구가 1-2만원 빌려가고 안 갚음 - 말해?',
    options: [
      { id: 'a', text: '그냥 넘어감', emoji: '😌' },
      { id: 'b', text: '슬쩍 언급', emoji: '👀' },
      { id: 'c', text: '직접 말함', emoji: '💬' },
      { id: 'd', text: '다음에 빌려달래도 거절', emoji: '🙅' },
      { id: 'e', text: '관계 정리', emoji: '✂️' },
    ],
    tags: ['돈', '친구', '빌려주기', '관계'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-lend-002',
    category: 'money',
    question: '친구가 급하게 50만원 빌려달래',
    options: [
      { id: 'a', text: '바로 빌려줌', emoji: '😇' },
      { id: 'b', text: '이유 듣고 판단', emoji: '🤔' },
      { id: 'c', text: '일부만 빌려줌', emoji: '💵' },
      { id: 'd', text: '못 빌려준다고 함', emoji: '🙅' },
      { id: 'e', text: '갚을 능력 있는지 확인', emoji: '📊' },
    ],
    tags: ['돈', '친구', '빌려주기', '고민'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-lend-003',
    category: 'money',
    question: '돈 빌려달라는 연락만 하는 친구',
    options: [
      { id: 'a', text: '그래도 도와줌', emoji: '😢' },
      { id: 'b', text: '이번엔 거절', emoji: '🙅' },
      { id: 'c', text: '직접 얘기함', emoji: '💬' },
      { id: 'd', text: '연락 안 받음', emoji: '📵' },
      { id: 'e', text: '관계 정리', emoji: '✂️' },
    ],
    tags: ['돈', '친구', '관계', '고민'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },

  // ============================================================================
  // 선물/회식 상황 투표
  // ============================================================================
  {
    id: 'money-gift-001',
    category: 'money',
    question: '받은 것보다 비싼 선물 줬는데 상대는 또 싼 거 줌',
    options: [
      { id: 'a', text: '계속 좋은 거 줌', emoji: '😇' },
      { id: 'b', text: '이번엔 나도 싸게', emoji: '😏' },
      { id: 'c', text: '선물 안 주고 만남', emoji: '🙅' },
      { id: 'd', text: '직접 얘기함', emoji: '💬' },
      { id: 'e', text: '관계 정리', emoji: '✂️' },
    ],
    tags: ['선물', '관계', '돈', '고민'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-gift-002',
    category: 'money',
    question: '술 안 마시는데 회식 술값도 N빵?',
    options: [
      { id: 'a', text: '당연히 N빵', emoji: '👥' },
      { id: 'b', text: '술값만 빼달라고 함', emoji: '🙅' },
      { id: 'c', text: '분위기상 N빵', emoji: '😅' },
      { id: 'd', text: '회식 안 감', emoji: '🏃' },
      { id: 'e', text: '먹은 만큼만 정산', emoji: '🍽️' },
    ],
    tags: ['회식', '술', 'N빵', '직장'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-gift-003',
    category: 'money',
    question: '경조사비 단톡방 - 강제 참여 분위기',
    options: [
      { id: 'a', text: '조용히 참여', emoji: '😑' },
      { id: 'b', text: '적게 넣음', emoji: '💵' },
      { id: 'c', text: '바빠서 못 간다고', emoji: '🏃' },
      { id: 'd', text: '거절함', emoji: '🙅' },
      { id: 'e', text: '단톡방 나감', emoji: '✂️' },
    ],
    tags: ['경조사', '단톡방', '직장', '고민'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },

  // ============================================================================
  // 축의금 금액 고민 상황 투표 (2025 트렌드 기반)
  // ============================================================================
  {
    id: 'money-wedding-006',
    category: 'money',
    question: '친구 결혼식 - 식대가 10만원 넘는다는데?',
    options: [
      { id: 'a', text: '15만원 (식대+α)', emoji: '💰' },
      { id: 'b', text: '10만원 (평균대로)', emoji: '💵' },
      { id: 'c', text: '20만원 (넉넉하게)', emoji: '💎' },
      { id: 'd', text: '5만원 (최소한)', emoji: '😅' },
      { id: 'e', text: '안 감 (부담됨)', emoji: '🙅' },
    ],
    tags: ['축의금', '결혼', '물가', '고민'],
    meta: {
      minAge: '20s',
      timeSensitivity: {
        sensitivity: 'high',
        sourceYear: 2025,
        validUntil: '2027-12',
      },
    },
  },
  {
    id: 'money-wedding-007',
    category: 'money',
    question: '10년 전 내 결혼식에 10만원 준 친구 - 지금은?',
    options: [
      { id: 'a', text: '10만원 (받은 만큼)', emoji: '⚖️' },
      { id: 'b', text: '15만원 (물가 반영)', emoji: '💵' },
      { id: 'c', text: '20만원 (넉넉하게)', emoji: '💰' },
      { id: 'd', text: '5만원 (연락 끊긴 사이)', emoji: '😑' },
      { id: 'e', text: '안 감', emoji: '🙅' },
    ],
    tags: ['축의금', '결혼', '물가', '관계'],
    meta: {
      minAge: '20s',
      timeSensitivity: {
        sensitivity: 'high',
        sourceYear: 2025,
        validUntil: '2027-12',
      },
    },
  },
];

export default MONEY_POLLS;
