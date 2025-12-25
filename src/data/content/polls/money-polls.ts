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

  // ============================================================================
  // 바이럴 논쟁 투표 - 연애/데이트 돈 논쟁 (Viral Debates - Dating)
  // ============================================================================
  {
    id: 'money-viral-date-001',
    category: 'money',
    question: '첫 데이트 계산 - 누가 내야 돼?',
    options: [
      { id: 'a', text: '남자가 내야 함', emoji: '👨' },
      { id: 'b', text: '무조건 더치페이', emoji: '⚖️' },
      { id: 'c', text: '먼저 제안한 사람', emoji: '🙋' },
      { id: 'd', text: '번갈아가며', emoji: '🔄' },
      { id: 'e', text: '상황/분위기 봐서', emoji: '🤷' },
    ],
    tags: ['데이트', '연애', '더치페이', '논쟁'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-viral-date-002',
    category: 'money',
    question: '연인 선물 가격 - 맞춰야 돼?',
    options: [
      { id: 'a', text: '무조건 비슷하게', emoji: '⚖️' },
      { id: 'b', text: '마음만 있으면 됨', emoji: '💝' },
      { id: 'c', text: '능력껏 최선을', emoji: '💪' },
      { id: 'd', text: '상황에 따라 다름', emoji: '🤔' },
      { id: 'e', text: '안 맞아도 괜찮음', emoji: '😊' },
    ],
    tags: ['선물', '연애', '돈', '논쟁'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-viral-date-003',
    category: 'money',
    question: '데이트 통장 - 만들어야 돼?',
    options: [
      { id: 'a', text: '필수! 투명한 관리', emoji: '💳' },
      { id: 'b', text: '각자 쓰다 정산', emoji: '📱' },
      { id: 'c', text: '한 명이 관리', emoji: '👤' },
      { id: 'd', text: '불필요, 자유롭게', emoji: '🙅' },
      { id: 'e', text: '결혼 전제면 필요', emoji: '💍' },
    ],
    tags: ['데이트', '연애', '통장', '돈관리'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-viral-date-004',
    category: 'money',
    question: '연봉 차이 큰 커플 - 데이트비 어떻게?',
    options: [
      { id: 'a', text: '무조건 반반', emoji: '⚖️' },
      { id: 'b', text: '연봉 비율대로', emoji: '📊' },
      { id: 'c', text: '많이 버는 쪽이 더', emoji: '💰' },
      { id: 'd', text: '번갈아가며', emoji: '🔄' },
      { id: 'e', text: '둘이 협의', emoji: '💬' },
    ],
    tags: ['데이트', '연애', '연봉', '논쟁'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-viral-date-005',
    category: 'money',
    question: '연인 생일 선물 예산 - 얼마가 적당해?',
    options: [
      { id: 'a', text: '5만원 이하', emoji: '💵' },
      { id: 'b', text: '10만원', emoji: '💴' },
      { id: 'c', text: '20-30만원', emoji: '💰' },
      { id: 'd', text: '50만원 이상', emoji: '💎' },
      { id: 'e', text: '금액보다 마음', emoji: '💝' },
    ],
    tags: ['선물', '연애', '생일', '돈'],
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
    id: 'money-viral-date-006',
    category: 'money',
    question: '기념일마다 선물 - 어디까지 해야 돼?',
    options: [
      { id: 'a', text: '100일, 200일 다', emoji: '📅' },
      { id: 'b', text: '생일+발렌타인+크리스마스', emoji: '🎂' },
      { id: 'c', text: '생일만', emoji: '🎉' },
      { id: 'd', text: '특별한 날만', emoji: '💝' },
      { id: 'e', text: '매일이 기념일', emoji: '😍' },
    ],
    tags: ['선물', '연애', '기념일', '논쟁'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },

  // ============================================================================
  // 바이럴 논쟁 투표 - 결혼/신혼 돈 논쟁 (Viral Debates - Marriage)
  // ============================================================================
  {
    id: 'money-viral-marriage-001',
    category: 'money',
    question: '결혼자금 비율 - 어떻게 해야 돼?',
    options: [
      { id: 'a', text: '무조건 5:5', emoji: '⚖️' },
      { id: 'b', text: '6:4 정도', emoji: '📊' },
      { id: 'c', text: '7:3도 괜찮음', emoji: '🤝' },
      { id: 'd', text: '능력껏 최선을', emoji: '💪' },
      { id: 'e', text: '남자가 더 내야', emoji: '👨' },
    ],
    tags: ['결혼', '결혼자금', '돈', '논쟁'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-viral-marriage-002',
    category: 'money',
    question: '예물/예단 - 누가 더 부담해야 돼?',
    options: [
      { id: 'a', text: '반반', emoji: '⚖️' },
      { id: 'b', text: '남자가 예물', emoji: '💍' },
      { id: 'c', text: '서로 선물', emoji: '🎁' },
      { id: 'd', text: '안 해도 됨', emoji: '🙅' },
      { id: 'e', text: '집안 규칙 따름', emoji: '🏠' },
    ],
    tags: ['결혼', '예물', '예단', '논쟁'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-viral-marriage-003',
    category: 'money',
    question: '신혼집 비용 - 어떻게 나눠야 돼?',
    options: [
      { id: 'a', text: '반반', emoji: '⚖️' },
      { id: 'b', text: '남자가 전세, 여자가 집기', emoji: '🏠' },
      { id: 'c', text: '능력 비율대로', emoji: '📊' },
      { id: 'd', text: '양가 도움 받음', emoji: '👪' },
      { id: 'e', text: '둘이 협의', emoji: '💬' },
    ],
    tags: ['결혼', '신혼집', '전세', '논쟁'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-viral-marriage-004',
    category: 'money',
    question: '맞벌이 생활비 - 월급 차이나도 반반?',
    options: [
      { id: 'a', text: '무조건 반반', emoji: '⚖️' },
      { id: 'b', text: '월급 비율대로', emoji: '📊' },
      { id: 'c', text: '통장 합쳐서 써', emoji: '💳' },
      { id: 'd', text: '항목별로 나눔', emoji: '📝' },
      { id: 'e', text: '많이 버는 쪽이 더', emoji: '💰' },
    ],
    tags: ['결혼', '맞벌이', '생활비', '논쟁'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-viral-marriage-005',
    category: 'money',
    question: '맞벌이 - 생활비 반반이면 가사분담도 반반?',
    options: [
      { id: 'a', text: '당연히 반반', emoji: '⚖️' },
      { id: 'b', text: '시간 여유 있는 쪽이', emoji: '⏰' },
      { id: 'c', text: '잘하는 쪽이', emoji: '👍' },
      { id: 'd', text: '외주 써', emoji: '🧹' },
      { id: 'e', text: '여자가 해야', emoji: '👩' },
    ],
    tags: ['결혼', '맞벌이', '가사', '논쟁'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-viral-marriage-006',
    category: 'money',
    question: '결혼 후 통장 - 합쳐야 돼?',
    options: [
      { id: 'a', text: '무조건 합침', emoji: '💳' },
      { id: 'b', text: '각자 관리', emoji: '👤' },
      { id: 'c', text: '생활비만 합침', emoji: '🏠' },
      { id: 'd', text: '투명하게 공개', emoji: '👀' },
      { id: 'e', text: '한 명이 관리', emoji: '📊' },
    ],
    tags: ['결혼', '통장', '돈관리', '논쟁'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },

  // ============================================================================
  // 바이럴 논쟁 투표 - 가족/부모님 돈 논쟁 (Viral Debates - Family)
  // ============================================================================
  {
    id: 'money-viral-family-001',
    category: 'money',
    question: '시댁/친정 용돈 - 차등 줘도 돼?',
    options: [
      { id: 'a', text: '무조건 똑같이', emoji: '⚖️' },
      { id: 'b', text: '형편에 따라 다름', emoji: '💰' },
      { id: 'c', text: '가까운 쪽에 더', emoji: '❤️' },
      { id: 'd', text: '각자 부모님만', emoji: '👤' },
      { id: 'e', text: '안 줘도 됨', emoji: '🙅' },
    ],
    tags: ['가족', '부모님', '용돈', '논쟁'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-viral-family-002',
    category: 'money',
    question: '형제끼리 부모님 용돈 - 똑같이 내야 돼?',
    options: [
      { id: 'a', text: '무조건 똑같이', emoji: '⚖️' },
      { id: 'b', text: '능력대로', emoji: '💪' },
      { id: 'c', text: '결혼한 쪽이 더', emoji: '💍' },
      { id: 'd', text: '많이 버는 쪽이 더', emoji: '💰' },
      { id: 'e', text: '각자 알아서', emoji: '🤷' },
    ],
    tags: ['가족', '부모님', '용돈', '형제'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-viral-family-003',
    category: 'money',
    question: '명절 세뱃돈 - 조카 나이별로 차등?',
    options: [
      { id: 'a', text: '나이별로 차등', emoji: '📅' },
      { id: 'b', text: '모두 똑같이', emoji: '⚖️' },
      { id: 'c', text: '중학생부터만', emoji: '🎓' },
      { id: 'd', text: '안 줘도 됨', emoji: '🙅' },
      { id: 'e', text: '받은 만큼만', emoji: '🔄' },
    ],
    tags: ['명절', '세뱃돈', '조카', '가족'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-viral-family-004',
    category: 'money',
    question: '부모님 카드 - 취업해도 써도 돼?',
    options: [
      { id: 'a', text: '절대 안 됨', emoji: '🙅' },
      { id: 'b', text: '급할 때만', emoji: '🆘' },
      { id: 'c', text: '부모님이 OK하면', emoji: '👌' },
      { id: 'd', text: '월급 적으면 괜찮음', emoji: '💵' },
      { id: 'e', text: '독립할 때까지', emoji: '🏠' },
    ],
    tags: ['가족', '부모님', '독립', '돈'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-viral-family-005',
    category: 'money',
    question: '부모님 생신 선물 - 얼마까지?',
    options: [
      { id: 'a', text: '10만원 이하', emoji: '💵' },
      { id: 'b', text: '20-30만원', emoji: '💴' },
      { id: 'c', text: '50만원', emoji: '💰' },
      { id: 'd', text: '100만원 이상', emoji: '💎' },
      { id: 'e', text: '능력껏 최선을', emoji: '💪' },
    ],
    tags: ['가족', '부모님', '선물', '생신'],
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
  // 바이럴 논쟁 투표 - 친구/사회 돈 논쟁 (Viral Debates - Social)
  // ============================================================================
  {
    id: 'money-viral-social-001',
    category: 'money',
    question: '친구끼리 연봉 공개 - OK?',
    options: [
      { id: 'a', text: '투명하게 공개', emoji: '👀' },
      { id: 'b', text: '물어보면 말함', emoji: '🗣️' },
      { id: 'c', text: '대략만 말함', emoji: '🤐' },
      { id: 'd', text: '절대 안 함', emoji: '🙅' },
      { id: 'e', text: '절친만 공유', emoji: '👥' },
    ],
    tags: ['친구', '연봉', '공개', '논쟁'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-viral-social-002',
    category: 'money',
    question: '친구가 나보다 훨씬 잘 벌어 - 솔직한 기분은?',
    options: [
      { id: 'a', text: '축하해줌', emoji: '🎉' },
      { id: 'b', text: '부럽다', emoji: '😢' },
      { id: 'c', text: '나도 자극받음', emoji: '🔥' },
      { id: 'd', text: '거리감 느낌', emoji: '😔' },
      { id: 'e', text: '별 생각 없음', emoji: '😐' },
    ],
    tags: ['친구', '연봉', '질투', '감정'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-viral-social-003',
    category: 'money',
    question: '월급 모아 명품백 샀어 - 이거 플렉스? 허세?',
    options: [
      { id: 'a', text: '내 돈 내 맘', emoji: '💪' },
      { id: 'b', text: '플렉스 맞음', emoji: '💎' },
      { id: 'c', text: '허세같음', emoji: '😑' },
      { id: 'd', text: '투자 낫지 않나', emoji: '📈' },
      { id: 'e', text: '가끔은 필요', emoji: '😊' },
    ],
    tags: ['소비', '명품', '플렉스', '논쟁'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-viral-social-004',
    category: 'money',
    question: '다음 직장 없이 퇴사 - 이해돼?',
    options: [
      { id: 'a', text: '완전 이해됨', emoji: '👍' },
      { id: 'b', text: '상황에 따라', emoji: '🤔' },
      { id: 'c', text: '무모함', emoji: '😨' },
      { id: 'd', text: '부럽다', emoji: '😢' },
      { id: 'e', text: '나도 하고 싶음', emoji: '🔥' },
    ],
    tags: ['퇴사', '직장', '결정', '논쟁'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-viral-social-005',
    category: 'money',
    question: '20대 보험 가입 - 필수? 낭비?',
    options: [
      { id: 'a', text: '필수! 빨리 가입', emoji: '✅' },
      { id: 'b', text: '최소한만', emoji: '📝' },
      { id: 'c', text: '30대부터', emoji: '⏰' },
      { id: 'd', text: '낭비임', emoji: '🙅' },
      { id: 'e', text: '투자가 먼저', emoji: '📈' },
    ],
    tags: ['보험', '재테크', '20대', '논쟁'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-viral-social-006',
    category: 'money',
    question: '생일인데 친구들이 내 돈으로 케이크 사줌',
    options: [
      { id: 'a', text: '괜찮아, 고마워', emoji: '😊' },
      { id: 'b', text: '좀 이상함', emoji: '🤨' },
      { id: 'c', text: '황당함', emoji: '😑' },
      { id: 'd', text: '다음엔 말함', emoji: '💬' },
      { id: 'e', text: '나도 그랬음', emoji: '😅' },
    ],
    tags: ['생일', '친구', 'N빵', '고민'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },

  // ============================================================================
  // 바이럴 논쟁 투표 - 재테크 논쟁 (Viral Debates - Finance)
  // ============================================================================
  {
    id: 'money-viral-invest-001',
    category: 'money',
    question: '청년 - 청약 vs 투자, 뭐가 나아?',
    options: [
      { id: 'a', text: '무조건 청약', emoji: '🏠' },
      { id: 'b', text: '투자로 늘려', emoji: '📈' },
      { id: 'c', text: '둘 다', emoji: '💪' },
      { id: 'd', text: '저축이 먼저', emoji: '💰' },
      { id: 'e', text: '경험이 먼저', emoji: '✈️' },
    ],
    tags: ['재테크', '청약', '투자', '논쟁'],
    meta: {
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-viral-invest-002',
    category: 'money',
    question: '전세 vs 월세 - 뭐가 나아?',
    options: [
      { id: 'a', text: '무조건 전세', emoji: '🏠' },
      { id: 'b', text: '월세+투자', emoji: '📊' },
      { id: 'c', text: '금리 보고 결정', emoji: '💹' },
      { id: 'd', text: '자금 여유 보고', emoji: '💰' },
      { id: 'e', text: '매매가 답', emoji: '🏡' },
    ],
    tags: ['부동산', '전세', '월세', '논쟁'],
    meta: {
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-viral-invest-003',
    category: 'money',
    question: '본업 있는데 N잡 - 욕심? 생존?',
    options: [
      { id: 'a', text: '생존 전략', emoji: '💪' },
      { id: 'b', text: '욕심', emoji: '😑' },
      { id: 'c', text: '자기계발', emoji: '📚' },
      { id: 'd', text: '부럽다', emoji: '😢' },
      { id: 'e', text: '나도 하고 싶음', emoji: '🔥' },
    ],
    tags: ['N잡', '부업', '재테크', '논쟁'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-viral-invest-004',
    category: 'money',
    question: '20대 - 저축 vs 경험, 뭐가 먼저?',
    options: [
      { id: 'a', text: '무조건 저축', emoji: '💰' },
      { id: 'b', text: '경험이 자산', emoji: '✈️' },
      { id: 'c', text: '둘 다 균형', emoji: '⚖️' },
      { id: 'd', text: '투자가 먼저', emoji: '📈' },
      { id: 'e', text: '상황마다 다름', emoji: '🤷' },
    ],
    tags: ['저축', '경험', '20대', '논쟁'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },

  // ============================================================================
  // 바이럴 논쟁 투표 - 소비 습관 논쟁 (Viral Debates - Spending)
  // ============================================================================
  {
    id: 'money-viral-spend-001',
    category: 'money',
    question: '커피 - 하루 한 잔 vs 텀블러, 1년이면?',
    options: [
      { id: 'a', text: '커피는 필수 지출', emoji: '☕' },
      { id: 'b', text: '텀블러로 절약', emoji: '🥤' },
      { id: 'c', text: '가끔만 사먹음', emoji: '😊' },
      { id: 'd', text: '100만원 넘게 쓸 듯', emoji: '💸' },
      { id: 'e', text: '계산 안 해봄', emoji: '🙈' },
    ],
    tags: ['커피', '소비', '절약', '습관'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-viral-spend-002',
    category: 'money',
    question: '배달비 - 언제까지 낼 거야?',
    options: [
      { id: 'a', text: '편하면 냄', emoji: '🛵' },
      { id: 'b', text: '아까움, 직접 감', emoji: '🚶' },
      { id: 'c', text: '최소주문 넘으면', emoji: '💰' },
      { id: 'd', text: '귀찮으면 냄', emoji: '😴' },
      { id: 'e', text: '무료배달만', emoji: '🎁' },
    ],
    tags: ['배달', '소비', '배달비', '습관'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
  {
    id: 'money-viral-spend-003',
    category: 'money',
    question: 'OTT - 몇 개까지 구독해?',
    options: [
      { id: 'a', text: '1개만', emoji: '📺' },
      { id: 'b', text: '2-3개', emoji: '🎬' },
      { id: 'c', text: '4개 이상', emoji: '💸' },
      { id: 'd', text: '공유 계정', emoji: '👥' },
      { id: 'e', text: '안 봄', emoji: '🙅' },
    ],
    tags: ['OTT', '구독', '소비', 'Netflix'],
    meta: {
      minAge: '20s',
      timeSensitivity: { sensitivity: 'low', sourceYear: 2025 },
    },
  },
];

export default MONEY_POLLS;
