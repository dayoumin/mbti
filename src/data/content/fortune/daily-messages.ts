// ============================================================================
// 오늘의 운세 메시지 템플릿
// 랜덤하게 제공되며 Barnum Effect를 활용한 범용적 메시지
// ============================================================================

import type { DailyFortuneMessage } from '../types';

/**
 * 연애운 메시지
 */
export const LOVE_MESSAGES: DailyFortuneMessage[] = [
  {
    id: 'love-001',
    category: 'love',
    tone: 'positive',
    message: '묘한 기류가 감지돼요! 평소 관심 없던 사람이 오늘따라 달라 보일 수도? 👀',
  },
  {
    id: 'love-002',
    category: 'love',
    tone: 'encouraging',
    message: '자존심 세우다가 타이밍 놓쳐요. 먼저 톡 하나 보내는 용기가 필요한 날!',
  },
  {
    id: 'love-003',
    category: 'love',
    tone: 'cautious',
    message: '과거의 인연이 연락 올 수도 있어요. 흔들릴지 차단할지는 당신의 선택 🙅‍♀️🙆‍♀️',
  },
  {
    id: 'love-004',
    category: 'love',
    tone: 'positive',
    message: "솔로라면 오늘 드레스코드는 '꾸안꾸'. 우연한 만남이 기다리고 있을지도 몰라요.",
  },
  {
    id: 'love-005',
    category: 'love',
    tone: 'cautious',
    message: "연인과 사소한 말실수 조심! 오늘은 '팩트'보다 '공감'이 필요한 날입니다.",
  },
  {
    id: 'love-006',
    category: 'love',
    tone: 'positive',
    message: '설렘 지수 상승 중! 오늘 만나는 사람에게서 예상치 못한 매력을 발견할 수도 💕',
  },
  {
    id: 'love-007',
    category: 'love',
    tone: 'encouraging',
    message: '혼자여도 괜찮아요. 나를 사랑하는 시간이 최고의 연애 준비랍니다 ✨',
  },
  {
    id: 'love-008',
    category: 'love',
    tone: 'positive',
    message: '커플이라면 오늘은 데이트 찬스! 평소 안 가던 곳에서 새로운 추억을 만들어보세요.',
  },
];

/**
 * 재물운 메시지
 */
export const MONEY_MESSAGES: DailyFortuneMessage[] = [
  {
    id: 'money-001',
    category: 'money',
    tone: 'cautious',
    message: '지름신 강림 주의보! 🛒 장바구니 결제 버튼 누르기 전에 세 번만 심호흡하세요.',
  },
  {
    id: 'money-002',
    category: 'money',
    tone: 'positive',
    message: '소소한 횡재수가 보여요. 잊고 있던 포인트나 주머니 속 만 원을 발견할지도?',
  },
  {
    id: 'money-003',
    category: 'money',
    tone: 'cautious',
    message: "누가 돈 빌려달라고 하면 '읽씹'이 답. 오늘은 내 지갑을 꽉 닫아야 할 때!",
  },
  {
    id: 'money-004',
    category: 'money',
    tone: 'cautious',
    message: '큰 지출은 신중하게! 남들 따라가다간 가랑이 찢어져요. 내 감을 믿으세요.',
  },
  {
    id: 'money-005',
    category: 'money',
    tone: 'encouraging',
    message: '나를 위한 소비는 OK. 맛있는 점심이나 예쁜 쓰레기(?) 하나쯤은 괜찮아요.',
  },
  {
    id: 'money-006',
    category: 'money',
    tone: 'positive',
    message: '예상치 못한 작은 보너스가 올 수 있어요. 커피값 정도? ☕',
  },
  {
    id: 'money-007',
    category: 'money',
    tone: 'encouraging',
    message: '돈은 돌고 돌아요. 오늘 쓴 돈이 내일 더 큰 기회로 돌아올 수도 있어요!',
  },
  {
    id: 'money-008',
    category: 'money',
    tone: 'positive',
    message: '가성비 운 상승! 오늘 산 물건이 생각보다 만족스러울 수 있어요 👍',
  },
];

/**
 * 건강/에너지 메시지
 */
export const HEALTH_MESSAGES: DailyFortuneMessage[] = [
  {
    id: 'health-001',
    category: 'health',
    tone: 'cautious',
    message: '배터리 잔량 10%. 🪫 오늘은 칼퇴하고 집 가서 전기장판과 합체하세요.',
  },
  {
    id: 'health-002',
    category: 'health',
    tone: 'positive',
    message: '에너지 과다 방출! 이 기세라면 미뤄둔 운동이나 대청소도 가능하겠는데요?',
  },
  {
    id: 'health-003',
    category: 'health',
    tone: 'encouraging',
    message: '생각이 너무 많으면 위장이 고생해요. 매운 거 먹고 스트레스 날려버려요! 🔥',
  },
  {
    id: 'health-004',
    category: 'health',
    tone: 'cautious',
    message: '목과 어깨가 돌덩이네요. 1시간에 한 번씩 스트레칭 안 하면 내일 후회함!',
  },
  {
    id: 'health-005',
    category: 'health',
    tone: 'positive',
    message: '오늘은 꿀잠 예약. 따뜻한 차 한 잔 마시고 일찍 눕는 게 최고의 보약입니다.',
  },
  {
    id: 'health-006',
    category: 'health',
    tone: 'encouraging',
    message: '에너지 과부하 조심! 적당한 휴식이 내일의 폭발력을 만들어요.',
  },
  {
    id: 'health-007',
    category: 'health',
    tone: 'positive',
    message: '머리보다 몸이 먼저 반응하는 날. 가벼운 운동 추천!',
  },
  {
    id: 'health-008',
    category: 'health',
    tone: 'encouraging',
    message: '수분 섭취 잊지 마세요! 물 한 잔이 오후 컨디션을 살릴 수 있어요 💧',
  },
];

/**
 * 일반 운세 메시지
 */
export const GENERAL_MESSAGES: DailyFortuneMessage[] = [
  {
    id: 'general-001',
    category: 'general',
    tone: 'positive',
    message: '오늘은 뭔가 좋은 일이 일어날 것 같은 예감! 긍정 에너지 충전 완료 ✨',
  },
  {
    id: 'general-002',
    category: 'general',
    tone: 'encouraging',
    message: '작은 도전이 큰 변화를 만들어요. 오늘 하나만 새롭게 시도해보세요!',
  },
  {
    id: 'general-003',
    category: 'general',
    tone: 'cautious',
    message: '급한 결정은 금물. 오늘은 심사숙고가 필요한 날이에요.',
  },
  {
    id: 'general-004',
    category: 'general',
    tone: 'positive',
    message: '인복이 따르는 날! 오늘 만나는 사람에게서 좋은 소식을 들을 수도 있어요.',
  },
  {
    id: 'general-005',
    category: 'general',
    tone: 'encouraging',
    message: '완벽하지 않아도 괜찮아요. 오늘의 나를 칭찬해주세요 👏',
  },
  {
    id: 'general-006',
    category: 'general',
    tone: 'positive',
    message: '미뤄둔 일을 처리하기 좋은 날! 하나씩 해치우면 뿌듯함 폭발 💪',
  },
  {
    id: 'general-007',
    category: 'general',
    tone: 'cautious',
    message: '오해가 생기기 쉬운 날. 대화할 때 한 번 더 확인하는 게 좋아요.',
  },
  {
    id: 'general-008',
    category: 'general',
    tone: 'positive',
    message: '운이 따르는 하루! 평소보다 조금 더 과감해져도 괜찮아요.',
  },
];

/**
 * 행운의 팁
 */
export interface LuckyTip {
  id: string;
  color: { name: string; emoji: string };
  number: number;
  item: string;
  time?: string;
  place?: string;
  action?: string;
}

export const LUCKY_TIPS: LuckyTip[] = [
  {
    id: 'tip-001',
    color: { name: '딥 블루', emoji: '🔵' },
    number: 7,
    item: '무선 이어폰 🎧',
    time: '오후 2시',
    action: '좋아하는 노래 듣기',
  },
  {
    id: 'tip-002',
    color: { name: '빨강', emoji: '🔴' },
    number: 3,
    item: '빨간 양말',
    time: '오전 11시',
    action: '거울 보고 윙크하기 😉',
  },
  {
    id: 'tip-003',
    color: { name: '민트', emoji: '🟢' },
    number: 5,
    item: '민트초코 아이스크림',
    place: '편의점',
    action: '1+1 행사 확인하기',
  },
  {
    id: 'tip-004',
    color: { name: '노랑', emoji: '🟡' },
    number: 8,
    item: '바나나 우유',
    time: '오후 4시',
    action: '간식 타임 갖기',
  },
  {
    id: 'tip-005',
    color: { name: '보라', emoji: '🟣' },
    number: 9,
    item: '라벤더 향초',
    time: '밤 9시',
    action: '명상 5분 하기',
  },
  {
    id: 'tip-006',
    color: { name: '주황', emoji: '🟠' },
    number: 1,
    item: '오렌지 주스',
    time: '아침',
    action: '스트레칭하기',
  },
  {
    id: 'tip-007',
    color: { name: '하늘색', emoji: '💠' },
    number: 4,
    item: '구름 모양 쿠션',
    place: '카페',
    action: '창가 자리 앉기',
  },
  {
    id: 'tip-008',
    color: { name: '핑크', emoji: '💗' },
    number: 2,
    item: '딸기 케이크',
    time: '점심 후',
    action: '달달한 간식 먹기',
  },
];

// ============================================================================
// 유틸리티 함수
// ============================================================================

/**
 * 카테고리별 랜덤 메시지 조회
 */
export function getRandomDailyMessage(category: DailyFortuneMessage['category']): DailyFortuneMessage {
  let messages: DailyFortuneMessage[];

  switch (category) {
    case 'love':
      messages = LOVE_MESSAGES;
      break;
    case 'money':
      messages = MONEY_MESSAGES;
      break;
    case 'health':
      messages = HEALTH_MESSAGES;
      break;
    default:
      messages = GENERAL_MESSAGES;
  }

  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * 랜덤 럭키 팁 조회
 */
export function getRandomLuckyTip(): LuckyTip {
  return LUCKY_TIPS[Math.floor(Math.random() * LUCKY_TIPS.length)];
}

/**
 * 모든 카테고리 운세 조회 (오늘의 운세 세트)
 */
export function getDailyFortuneSet(): {
  general: DailyFortuneMessage;
  love: DailyFortuneMessage;
  money: DailyFortuneMessage;
  health: DailyFortuneMessage;
  luckyTip: LuckyTip;
} {
  return {
    general: getRandomDailyMessage('general'),
    love: getRandomDailyMessage('love'),
    money: getRandomDailyMessage('money'),
    health: getRandomDailyMessage('health'),
    luckyTip: getRandomLuckyTip(),
  };
}

// 전체 메시지 배열
export const ALL_DAILY_MESSAGES: DailyFortuneMessage[] = [
  ...GENERAL_MESSAGES,
  ...LOVE_MESSAGES,
  ...MONEY_MESSAGES,
  ...HEALTH_MESSAGES,
];

export default ALL_DAILY_MESSAGES;
