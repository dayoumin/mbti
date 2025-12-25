// ============================================================================
// 여행지 월드컵 - 16강 토너먼트
// ============================================================================

import { Tournament, TournamentContestant } from './dashboard-tournaments';

// ============================================================================
// 여행지 16강 참가자
// ============================================================================

export const TRAVEL_DESTINATION_CONTESTANTS: TournamentContestant[] = [
  // === 아시아 ===
  {
    id: 'tokyo',
    name: '도쿄',
    emoji: '🗼',
    description: '최신 트렌드와 전통의 조화, 쇼핑과 먹거리 천국',
    tags: ['일본', '도시', '쇼핑', '음식', '문화'],
    funFact: '세계에서 미슐랭 3스타 레스토랑이 가장 많은 도시예요',
  },
  {
    id: 'seoul',
    name: '서울',
    emoji: '🏙️',
    description: 'K-문화의 중심, 24시간 활기찬 대도시',
    tags: ['한국', '도시', '쇼핑', 'K-pop', '야경'],
    funFact: '전 세계에서 인터넷 속도가 가장 빠른 도시 중 하나예요',
  },
  {
    id: 'bangkok',
    name: '방콕',
    emoji: '🛕',
    description: '황금빛 사원과 활기찬 야시장, 저렴한 물가',
    tags: ['태국', '도시', '사원', '야시장', '음식'],
    funFact: '세계에서 가장 많이 방문하는 도시 1위! (2023년 기준)',
  },
  {
    id: 'singapore',
    name: '싱가포르',
    emoji: '🦁',
    description: '깔끔하고 세련된 도시국가, 다양한 문화 체험',
    tags: ['싱가포르', '도시', '깔끔', '다문화', '쇼핑'],
    funFact: '껌을 씹으면 안 되는 나라로 유명해요 (실제론 섭취는 가능, 판매 금지)',
  },

  // === 유럽 ===
  {
    id: 'paris',
    name: '파리',
    emoji: '🥐',
    description: '예술과 낭만의 도시, 에펠탑과 루브르 박물관',
    tags: ['프랑스', '도시', '예술', '낭만', '유적'],
    funFact: '루브르 박물관을 다 보려면 약 100일이 걸린다고 해요',
  },
  {
    id: 'london',
    name: '런던',
    emoji: '🎡',
    description: '역사와 현대가 공존하는 영국의 수도',
    tags: ['영국', '도시', '역사', '박물관', '궁전'],
    funFact: '세계에서 가장 많은 무료 박물관이 있는 도시예요',
  },
  {
    id: 'rome',
    name: '로마',
    emoji: '🏛️',
    description: '2천년 역사의 야외 박물관, 고대 유적의 보고',
    tags: ['이탈리아', '도시', '역사', '유적', '음식'],
    funFact: '콜로세움은 한때 5만 명의 관중을 수용했어요',
  },
  {
    id: 'barcelona',
    name: '바르셀로나',
    emoji: '🏖️',
    description: '가우디 건축과 해변의 완벽한 조합',
    tags: ['스페인', '도시', '건축', '해변', '축구'],
    funFact: '사그라다 파밀리아는 1882년부터 건설 중이에요 (완공 예정 2026년)',
  },

  // === 미주 ===
  {
    id: 'new-york',
    name: '뉴욕',
    emoji: '🗽',
    description: '잠들지 않는 도시, 세계의 문화 중심지',
    tags: ['미국', '도시', '문화', '쇼핑', '뮤지컬'],
    funFact: '맨해튼에만 800개 이상의 언어가 사용돼요',
  },
  {
    id: 'hawaii',
    name: '하와이',
    emoji: '🏝️',
    description: '에메랄드빛 바다와 화이트 샌드 비치의 낙원',
    tags: ['미국', '해변', '자연', '휴양', '서핑'],
    funFact: '세계에서 가장 활동적인 화산 중 하나가 있어요',
  },
  {
    id: 'cancun',
    name: '칸쿤',
    emoji: '🏖️',
    description: '카리브해의 청록빛 바다와 마야 문명',
    tags: ['멕시코', '해변', '리조트', '유적', '휴양'],
    funFact: '세계에서 두 번째로 큰 산호초 지대가 있어요',
  },
  {
    id: 'rio',
    name: '리우데자네이루',
    emoji: '🎉',
    description: '삼바와 열정의 카니발, 그리스도상',
    tags: ['브라질', '도시', '해변', '축제', '문화'],
    funFact: '세계 최대 규모의 카니발이 열려요 (연간 200만 명 참가)',
  },

  // === 오세아니아 ===
  {
    id: 'sydney',
    name: '시드니',
    emoji: '🦘',
    description: '오페라하우스와 하버 브리지의 절경',
    tags: ['호주', '도시', '해변', '자연', '현대적'],
    funFact: '시드니 오페라하우스는 1억 개 이상의 타일로 덮여 있어요',
  },
  {
    id: 'bali',
    name: '발리',
    emoji: '🏝️',
    description: '신들의 섬, 저렴하고 여유로운 휴양',
    tags: ['인도네시아', '해변', '휴양', '사원', '요가'],
    funFact: '발리에는 2만 개 이상의 사원이 있어요',
  },
  // === 중동/아프리카 ===
  {
    id: 'dubai',
    name: '두바이',
    emoji: '🏜️',
    description: '사막 위의 미래 도시, 세계 최고층 빌딩',
    tags: ['UAE', '도시', '쇼핑', '럭셔리', '현대적'],
    funFact: '부르즈 할리파는 828m로 세계에서 가장 높은 건물이에요',
  },
  {
    id: 'cape-town',
    name: '케이프타운',
    emoji: '🦁',
    description: '테이블 마운틴과 아프리카의 자연',
    tags: ['남아공', '도시', '자연', '와인', '사파리'],
    funFact: '세계에서 가장 아름다운 도시 중 하나로 꼽혀요',
  },
];

// ============================================================================
// 여행지 월드컵 토너먼트 정의
// ============================================================================

export const TRAVEL_DESTINATION_WORLDCUP: Tournament = {
  id: 'travel-worldcup-v1',
  type: 'worldcup',
  category: 'travel',
  title: '최애 여행지 월드컵',
  subtitle: '16강',
  description: '당신의 버킷리스트 1순위 여행지는? 1:1 대결로 찾아보세요!',
  emoji: '✈️',
  themeColor: 'bg-blue-100',

  contestants: TRAVEL_DESTINATION_CONTESTANTS,
  roundSize: 16,

  status: 'active',
  createdAt: '2025-12-25',

  resultConfig: {
    showRanking: true,
    showWinRate: true,
    showSegmentComparison: true,
    shareMessage: '나의 최애 여행지는 {winner}! ✈️ 너도 해봐!',
  },
};

export default TRAVEL_DESTINATION_WORLDCUP;
