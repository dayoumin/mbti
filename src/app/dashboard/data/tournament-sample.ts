// ============================================================================
// 토너먼트/월드컵 데이터 구조 및 샘플
// ============================================================================

// ============================================================================
// Types
// ============================================================================

export type TournamentType = 'worldcup' | 'bracket';
export type TournamentCategory = 'cat' | 'dog' | 'rabbit' | 'hamster' | 'plant' | 'love' | 'personality' | 'lifestyle' | 'food' | 'general';
export type TournamentStatus = 'draft' | 'active' | 'ended';
export type RoundSize = 4 | 8 | 16 | 32 | 64;

/**
 * 토너먼트 참가자 (대결 대상)
 */
export interface TournamentContestant {
  id: string;
  name: string;              // "페르시안"
  emoji: string;             // 이모지 또는 일러스트 참조
  imageUrl?: string;         // 일러스트/사진 URL (선택)
  description: string;       // 짧은 설명 (1-2줄)
  tags?: string[];           // 검색/필터용 태그
  funFact?: string;          // 재미있는 사실 (결과 화면용)
}

/**
 * 개별 대결 기록
 */
export interface TournamentMatch {
  id: string;
  round: number;             // 1: 결승, 2: 4강, 3: 8강...
  matchIndex: number;        // 해당 라운드에서 몇 번째 대결
  contestant1Id: string;
  contestant2Id: string;
  winnerId?: string;         // 사용자 선택
}

/**
 * 개인 토너먼트 세션 (사용자별)
 */
export interface TournamentSession {
  id: string;
  tournamentId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  matches: TournamentMatch[];
  finalWinnerId?: string;    // 최종 우승자
  rankedContestants?: string[];  // 1위~N위 순서 (선택)
}

/**
 * 토너먼트 전체 통계 (집계)
 */
export interface TournamentStats {
  tournamentId: string;
  totalParticipants: number;
  contestantStats: {
    contestantId: string;
    wins: number;            // 총 승리 횟수
    losses: number;          // 총 패배 횟수
    winRate: number;         // 승률 (%)
    championCount: number;   // 우승 횟수
    avgRank: number;         // 평균 순위
  }[];
  // 세그먼트별 통계 (나이, 성별, 테스트 결과별)
  segmentStats?: {
    segment: string;         // "20대", "여성", "INFP" 등
    topContestants: { contestantId: string; winRate: number }[];
  }[];
  lastUpdatedAt: string;
}

/**
 * 토너먼트 정의
 */
export interface Tournament {
  id: string;
  type: TournamentType;      // 'worldcup': 이상형월드컵, 'bracket': 토너먼트
  category: TournamentCategory;
  title: string;             // "최애 고양이 품종 월드컵"
  subtitle?: string;         // 부제목
  description: string;       // 설명
  emoji: string;             // 대표 이모지
  themeColor: string;        // 테마 컬러

  contestants: TournamentContestant[];
  roundSize: RoundSize;      // 시작 라운드 (16강, 32강 등)

  // 메타데이터
  status: TournamentStatus;
  createdAt: string;
  startAt?: string;          // 공개 시작일
  endAt?: string;            // 종료일

  // 결과 화면 설정
  resultConfig: {
    showRanking: boolean;    // 전체 순위 표시
    showWinRate: boolean;    // 승률 표시
    showSegmentComparison: boolean;  // 세그먼트별 비교
    shareMessage: string;    // 공유 메시지 템플릿
  };
}

// ============================================================================
// 샘플 데이터: 고양이 품종 16강 월드컵
// ============================================================================

export const CAT_BREED_CONTESTANTS: TournamentContestant[] = [
  // === 장모종 (Long Hair) ===
  {
    id: 'persian',
    name: '페르시안',
    emoji: '👑',
    description: '고급스러운 외모의 대명사, 조용하고 우아한 성격',
    tags: ['장모', '조용함', '우아', '실내'],
    funFact: '세계에서 가장 오래된 품종 중 하나로, 17세기부터 사랑받아왔어요',
  },
  {
    id: 'ragdoll',
    name: '랙돌',
    emoji: '🧸',
    description: '안기면 인형처럼 축 늘어지는 대형 스위트하트',
    tags: ['장모', '대형', '순함', '인형'],
    funFact: '이름 그대로 안으면 "랙돌(인형)"처럼 몸이 축 처져요',
  },
  {
    id: 'maine-coon',
    name: '메인쿤',
    emoji: '🦁',
    description: '고양이계의 젠틀 자이언트, 개냥이 성격',
    tags: ['장모', '대형', '친근', '개냥이'],
    funFact: '미국에서 가장 큰 집고양이 품종이에요',
  },
  {
    id: 'norwegian',
    name: '노르웨이숲',
    emoji: '🌲',
    description: '북유럽 숲에서 온 야생미 넘치는 미모',
    tags: ['장모', '대형', '야생미', '북유럽'],
    funFact: '바이킹과 함께 배를 탔다는 전설이 있어요',
  },

  // === 단모종 (Short Hair) ===
  {
    id: 'british-shorthair',
    name: '브리티시 숏헤어',
    emoji: '🧸',
    description: '통통한 볼살과 동그란 눈, 차분한 영국 신사',
    tags: ['단모', '둥글둥글', '차분', '영국'],
    funFact: '체셔 고양이의 모델이 된 품종이에요',
  },
  {
    id: 'russian-blue',
    name: '러시안 블루',
    emoji: '💎',
    description: '은빛 푸른 털과 에메랄드 눈의 고급 미모',
    tags: ['단모', '블루', '우아', '러시아'],
    funFact: '러시아 황실에서 사랑받은 품종이에요',
  },
  {
    id: 'abyssinian',
    name: '아비시니안',
    emoji: '🐆',
    description: '날렵한 몸매와 호기심 가득한 탐험가',
    tags: ['단모', '활동적', '호기심', '날렵'],
    funFact: '이집트 벽화에 등장하는 고양이와 가장 닮았어요',
  },
  {
    id: 'bengal',
    name: '뱅갈',
    emoji: '🐅',
    description: '야생 표범 무늬를 가진 액티브 스포츠맨',
    tags: ['단모', '표범무늬', '활동적', '야생'],
    funFact: '아시아 표범 고양이와 집고양이의 교배종이에요',
  },

  // === 특이 외형 ===
  {
    id: 'scottish-fold',
    name: '스코티시 폴드',
    emoji: '🦉',
    description: '접힌 귀가 매력적인 부엉이 닮은 고양이',
    tags: ['접힌귀', '둥글', '온순', '스코틀랜드'],
    funFact: '1961년 스코틀랜드 농장에서 처음 발견됐어요',
  },
  {
    id: 'munchkin',
    name: '먼치킨',
    emoji: '🐿️',
    description: '짧은 다리로 뒤뚱뒤뚱, 영원한 아기 고양이',
    tags: ['짧은다리', '귀여움', '활발', '작음'],
    funFact: '다리는 짧아도 점프 실력은 훌륭해요',
  },
  {
    id: 'sphynx',
    name: '스핑크스',
    emoji: '👽',
    description: '털 없는 외계인 비주얼, 의외로 다정한 성격',
    tags: ['무모', '특이', '다정', '따뜻'],
    funFact: '털이 없어서 체온이 높고 안으면 따뜻해요',
  },
  {
    id: 'exotic-shorthair',
    name: '엑조틱 숏헤어',
    emoji: '😺',
    description: '페르시안의 귀여움 + 단모의 편리함',
    tags: ['단모', '납작코', '온순', '둥글'],
    funFact: '페르시안을 좋아하지만 빗질이 힘든 분들을 위해!',
  },

  // === 한국/아시아 ===
  {
    id: 'korean-shorthair',
    name: '코리안 숏헤어',
    emoji: '🇰🇷',
    description: '우리나라 토종 고양이, 다양한 무늬와 건강함',
    tags: ['단모', '토종', '건강', '한국'],
    funFact: '가장 건강하고 튼튼한 품종 중 하나예요',
  },
  {
    id: 'siamese',
    name: '샴',
    emoji: '🔷',
    description: '파란 눈과 포인트 컬러, 수다쟁이 고양이',
    tags: ['단모', '포인트', '수다쟁이', '태국'],
    funFact: '가장 말이 많은 품종으로 유명해요',
  },

  // === 인기 품종 ===
  {
    id: 'american-shorthair',
    name: '아메리칸 숏헤어',
    emoji: '🇺🇸',
    description: '튼튼하고 온순한 미국의 대표 고양이',
    tags: ['단모', '줄무늬', '건강', '미국'],
    funFact: '메이플라워호를 타고 미국에 온 고양이 후손이에요',
  },
  {
    id: 'turkish-angora',
    name: '터키시 앙고라',
    emoji: '✨',
    description: '하얀 털과 우아한 자태, 터키의 국보 고양이',
    tags: ['장모', '하얀색', '우아', '터키'],
    funFact: '터키에서는 국보로 지정되어 보호받고 있어요',
  },
];

export const CAT_BREED_TOURNAMENT: Tournament = {
  id: 'cat-breed-worldcup-v1',
  type: 'worldcup',
  category: 'cat',
  title: '최애 고양이 품종 월드컵',
  subtitle: '16강',
  description: '당신의 최애 고양이 품종은? 1:1 대결로 찾아보세요!',
  emoji: '🐱',
  themeColor: 'bg-orange-100',

  contestants: CAT_BREED_CONTESTANTS,
  roundSize: 16,

  status: 'active',
  createdAt: '2024-12-23',

  resultConfig: {
    showRanking: true,
    showWinRate: true,
    showSegmentComparison: true,
    shareMessage: '나의 최애 고양이 품종은 {winner}! 🐱 너도 해봐!',
  },
};

// ============================================================================
// 샘플 데이터: 라면 월드컵 16강
// ============================================================================

export const RAMEN_WORLDCUP_CONTESTANTS: TournamentContestant[] = [
  {
    id: 'shin-ramyun',
    name: '신라면',
    emoji: '🔥',
    description: '매콤하고 깊은 국물 맛의 대한민국 대표 라면',
    tags: ['매운맛', '소고기', '클래식', '국물'],
    funFact: '1986년 출시 이후 한국인이 가장 사랑하는 라면 부동의 1위',
  },
  {
    id: 'jin-ramyun',
    name: '진라면',
    emoji: '🌶️',
    description: '칼칼한 매운맛의 정석, 얼큰한 국물이 일품',
    tags: ['매운맛', '얼큰', '국물', '클래식'],
    funFact: '순한맛과 매운맛 두 가지 버전으로 선택의 폭이 넓어요',
  },
  {
    id: 'neoguri',
    name: '너구리',
    emoji: '🦝',
    description: '두툼한 면발과 해물 맛 우동스타일 라면',
    tags: ['해물맛', '우동면', '두툼', '국물'],
    funFact: '짜파게티와 섞으면 전설의 짜파구리가 완성됩니다',
  },
  {
    id: 'chapagetti',
    name: '짜파게티',
    emoji: '🖤',
    description: '달콤짭짤한 짜장맛 비빔면의 원조',
    tags: ['짜장맛', '비빔면', '달콤', '클래식'],
    funFact: '기생충 영화로 짜파구리가 세계적으로 유명해졌어요',
  },
  {
    id: 'buldak',
    name: '불닭볶음면',
    emoji: '🔥',
    description: '극강의 매운맛, 도전 정신을 자극하는 비빔면',
    tags: ['극매운맛', '비빔면', '도전', '인기'],
    funFact: '유튜브 챌린지로 전 세계에서 큰 인기를 끌었어요',
  },
  {
    id: 'samyang-ramyun',
    name: '삼양라면',
    emoji: '🍜',
    description: '한국 최초의 라면, 고소하고 담백한 맛',
    tags: ['원조', '담백', '국물', '클래식'],
    funFact: '1963년 출시된 대한민국 최초의 라면입니다',
  },
  {
    id: 'ansungtangmyun',
    name: '안성탕면',
    emoji: '🥘',
    description: '얼큰하고 구수한 사골 국물 맛',
    tags: ['사골맛', '얼큰', '국물', '구수'],
    funFact: '큼직한 건더기와 구수한 국물이 매력 포인트',
  },
  {
    id: 'tumsae',
    name: '틈새라면',
    emoji: '🌾',
    description: '고소한 쌀국수면발에 담백한 국물',
    tags: ['쌀국수', '담백', '건강', '국물'],
    funFact: '쌀로 만든 면발로 쫄깃하고 담백해요',
  },
  {
    id: 'paldo-bibimmyun',
    name: '팔도비빔면',
    emoji: '🌶️',
    description: '달콤 매콤한 비빔 소스의 원조',
    tags: ['비빔면', '매콤달콤', '원조', '여름'],
    funFact: '여름철 냉장고에 차갑게 먹으면 최고',
  },
  {
    id: 'cham-kkae',
    name: '참깨라면',
    emoji: '🥜',
    description: '고소한 참깨 향과 담백한 국물',
    tags: ['참깨', '고소', '담백', '국물'],
    funFact: '참깨 특유의 고소함이 중독성 있어요',
  },
  {
    id: 'kimchi-ramyun',
    name: '김치라면',
    emoji: '🥬',
    description: '시원한 김치맛이 일품인 얼큰 라면',
    tags: ['김치맛', '시원', '얼큰', '국물'],
    funFact: '실제 김치 맛이 느껴지는 새콤한 국물',
  },
  {
    id: 'yeul-ramyun',
    name: '열라면',
    emoji: '🌋',
    description: '강렬한 매운맛과 중독성 있는 국물',
    tags: ['매운맛', '중독성', '국물', '강렬'],
    funFact: '매운맛 마니아들이 찾는 숨은 강자',
  },
  {
    id: 'jjawang',
    name: '짜왕',
    emoji: '👑',
    description: '진한 춘장과 고기가 가득한 프리미엄 짜장면',
    tags: ['짜장맛', '프리미엄', '진한', '비빔면'],
    funFact: '큼직한 고기와 채소가 들어있는 고급 짜장라면',
  },
  {
    id: 'jin-jjamppong',
    name: '진짬뽕',
    emoji: '🦐',
    description: '얼큰하고 시원한 해물 짬뽕 맛',
    tags: ['해물맛', '얼큰', '시원', '국물'],
    funFact: '해물의 시원함과 매콤함이 조화로워요',
  },
  {
    id: 'ottogi-jin-ramyun',
    name: '오뚜기진라면',
    emoji: '⚡',
    description: '칼칼한 국물과 쫄깃한 면발의 조화',
    tags: ['매운맛', '칼칼', '국물', '클래식'],
    funFact: '순한맛 버전은 남녀노소 누구나 즐길 수 있어요',
  },
  {
    id: 'sari-gomtang',
    name: '사리곰탕면',
    emoji: '🍖',
    description: '진한 사골 육수의 깊은 맛',
    tags: ['곰탕맛', '사골', '진한', '국물'],
    funFact: '24시간 고아낸 사골 국물 맛을 재현했어요',
  },
];

export const RAMEN_WORLDCUP: Tournament = {
  id: 'ramen-worldcup-v1',
  type: 'worldcup',
  category: 'food',
  title: '최애 라면 월드컵',
  subtitle: '16강',
  description: '당신의 최애 라면은? 한국 인기 라면 대결!',
  emoji: '🍜',
  themeColor: 'bg-red-100',

  contestants: RAMEN_WORLDCUP_CONTESTANTS,
  roundSize: 16,

  status: 'active',
  createdAt: '2024-12-23',

  resultConfig: {
    showRanking: true,
    showWinRate: true,
    showSegmentComparison: true,
    shareMessage: '나의 최애 라면은 {winner}! 🍜 너도 해봐!',
  },
};

// ============================================================================
// 샘플 데이터: 인생 가치관 월드컵 16강
// ============================================================================

export const VALUES_WORLDCUP_CONTESTANTS: TournamentContestant[] = [
  {
    id: 'money',
    name: '돈/경제적 안정',
    emoji: '💰',
    description: '경제적 자유와 안정된 생활',
    tags: ['물질', '안정', '현실'],
    funFact: '돈이 행복을 사진 못하지만, 선택의 자유를 줍니다',
  },
  {
    id: 'love',
    name: '사랑/연애',
    emoji: '❤️',
    description: '설레는 사랑과 낭만적인 관계',
    tags: ['감정', '관계', '로맨스'],
    funFact: '사랑은 인생을 풍요롭게 만드는 가장 강력한 감정입니다',
  },
  {
    id: 'family',
    name: '가족',
    emoji: '👨‍👩‍👧‍👦',
    description: '가족과 함께하는 시간과 유대감',
    tags: ['관계', '안정', '소속감'],
    funFact: '가족은 선택할 수 없지만, 함께 만들어가는 관계입니다',
  },
  {
    id: 'health',
    name: '건강',
    emoji: '💪',
    description: '건강한 몸과 마음',
    tags: ['웰빙', '신체', '정신'],
    funFact: '건강은 모든 것의 기본이자, 가장 큰 자산입니다',
  },
  {
    id: 'freedom',
    name: '자유',
    emoji: '🕊️',
    description: '하고 싶은 것을 할 수 있는 자유',
    tags: ['독립', '선택', '개인'],
    funFact: '자유는 책임과 함께 옵니다',
  },
  {
    id: 'honor',
    name: '명예/인정',
    emoji: '🏆',
    description: '타인의 인정과 사회적 성공',
    tags: ['성취', '사회', '지위'],
    funFact: '인정받는 것도 중요하지만, 자기 인정이 먼저입니다',
  },
  {
    id: 'friendship',
    name: '우정',
    emoji: '👥',
    description: '깊은 우정과 진실한 친구',
    tags: ['관계', '소속감', '신뢰'],
    funFact: '좋은 친구는 인생의 보물입니다',
  },
  {
    id: 'growth',
    name: '자기계발',
    emoji: '📚',
    description: '끊임없이 성장하고 배우기',
    tags: ['성장', '학습', '발전'],
    funFact: '매일 1%씩 성장하면 1년 후 37배 더 나아집니다',
  },
  {
    id: 'travel',
    name: '여행/경험',
    emoji: '✈️',
    description: '새로운 곳을 탐험하고 경험하기',
    tags: ['모험', '경험', '문화'],
    funFact: '여행은 돈으로 살 수 있는 유일한 자산 중 하나입니다',
  },
  {
    id: 'peace',
    name: '안정/평화',
    emoji: '☮️',
    description: '평온하고 안정된 일상',
    tags: ['평온', '안정', '휴식'],
    funFact: '진정한 평화는 마음에서 시작됩니다',
  },
  {
    id: 'challenge',
    name: '도전/모험',
    emoji: '🎯',
    description: '새로운 도전과 스릴',
    tags: ['모험', '성장', '열정'],
    funFact: '안전지대를 벗어날 때 진짜 성장이 시작됩니다',
  },
  {
    id: 'creativity',
    name: '창의성',
    emoji: '🎨',
    description: '창조하고 표현하는 즐거움',
    tags: ['예술', '표현', '독창성'],
    funFact: '모든 사람은 나름의 창의성을 가지고 있습니다',
  },
  {
    id: 'power',
    name: '권력/영향력',
    emoji: '👑',
    description: '영향력을 행사하고 변화 만들기',
    tags: ['리더십', '영향력', '변화'],
    funFact: '큰 권력에는 큰 책임이 따릅니다',
  },
  {
    id: 'hobby',
    name: '여가/취미',
    emoji: '🎮',
    description: '즐기는 취미와 여가 시간',
    tags: ['휴식', '즐거움', '개인'],
    funFact: '취미는 일상의 활력소입니다',
  },
  {
    id: 'contribution',
    name: '사회 공헌',
    emoji: '🤝',
    description: '세상을 더 나은 곳으로 만들기',
    tags: ['봉사', '의미', '나눔'],
    funFact: '작은 선행도 세상을 바꿀 수 있습니다',
  },
  {
    id: 'faith',
    name: '신앙/영성',
    emoji: '🙏',
    description: '영적 성장과 신념',
    tags: ['영성', '신념', '내면'],
    funFact: '믿음은 불확실한 세상에서 방향을 제시합니다',
  },
];

export const VALUES_WORLDCUP: Tournament = {
  id: 'values-worldcup-v1',
  type: 'worldcup',
  category: 'personality',
  title: '인생 가치관 월드컵',
  subtitle: '16강',
  description: '당신이 가장 중요하게 생각하는 인생 가치는? 1:1 대결로 찾아보세요!',
  emoji: '💎',
  themeColor: 'bg-purple-100',

  contestants: VALUES_WORLDCUP_CONTESTANTS,
  roundSize: 16,

  status: 'active',
  createdAt: '2024-12-23',

  resultConfig: {
    showRanking: true,
    showWinRate: true,
    showSegmentComparison: true,
    shareMessage: '나의 최고 가치는 {winner}! 💎 너도 해봐!',
  },
};

// ============================================================================
// 샘플 데이터: 이상형 조건 16강 월드컵
// ============================================================================

export const IDEALTYPE_CONDITIONS_CONTESTANTS: TournamentContestant[] = [
  {
    id: 'tall-height',
    name: '키가 큰 사람',
    emoji: '📏',
    description: '훤칠한 키, 어디서든 눈에 띄는 존재감',
    tags: ['외모', '신체', '키'],
    funFact: '키 큰 사람과 걸으면 든든함이 2배! 높은 곳 물건도 OK',
  },
  {
    id: 'humor',
    name: '유머 감각 있는 사람',
    emoji: '😂',
    description: '재치있는 농담으로 분위기를 밝히는 사람',
    tags: ['성격', '유머', '재미'],
    funFact: '웃음은 최고의 약! 스트레스가 눈 녹듯 사라져요',
  },
  {
    id: 'wealth',
    name: '경제력 있는 사람',
    emoji: '💰',
    description: '안정적인 재정으로 미래를 계획할 수 있는 사람',
    tags: ['경제', '현실', '안정'],
    funFact: '현실은 사랑만으로 배부를 수 없죠. 든든한 미래 설계!',
  },
  {
    id: 'attractive',
    name: '잘생긴/예쁜 사람',
    emoji: '✨',
    description: '매력적인 외모, 볼수록 설레는 비주얼',
    tags: ['외모', '비주얼', '매력'],
    funFact: '보는 것만으로도 기분 좋아지는 마법같은 존재',
  },
  {
    id: 'cooking',
    name: '요리 잘하는 사람',
    emoji: '👨‍🍳',
    description: '맛있는 음식으로 사랑을 표현하는 사람',
    tags: ['능력', '요리', '생활'],
    funFact: '집밥이 맛있으면 집이 천국! 외식비도 절약',
  },
  {
    id: 'kind',
    name: '다정한 사람',
    emoji: '💕',
    description: '따뜻한 말과 행동으로 위로를 주는 사람',
    tags: ['성격', '배려', '따뜻함'],
    funFact: '힘든 날에 옆에 있어주는 따뜻한 존재가 최고',
  },
  {
    id: 'smart',
    name: '똑똑한 사람',
    emoji: '🧠',
    description: '지적인 대화가 가능한 사람',
    tags: ['지성', '교양', '대화'],
    funFact: '깊이 있는 대화는 관계를 더 풍요롭게 만들어요',
  },
  {
    id: 'athletic',
    name: '운동 잘하는 사람',
    emoji: '💪',
    description: '건강한 몸과 활동적인 라이프스타일',
    tags: ['건강', '운동', '활동'],
    funFact: '함께 운동하면 커플 운동 인증샷도 찍고 건강도 챙기고!',
  },
  {
    id: 'voice',
    name: '목소리 좋은 사람',
    emoji: '🎤',
    description: '듣기만 해도 기분 좋아지는 목소리',
    tags: ['매력', '목소리', '감성'],
    funFact: '전화 통화만으로도 심장이 두근두근',
  },
  {
    id: 'fashion',
    name: '패션 센스 있는 사람',
    emoji: '👔',
    description: '옷을 잘 입고 스타일리시한 사람',
    tags: ['외모', '센스', '스타일'],
    funFact: '같이 나가면 자랑스러운 패셔니스타 커플',
  },
  {
    id: 'family',
    name: '집안 좋은 사람',
    emoji: '🏠',
    description: '좋은 가정 환경과 배경',
    tags: ['현실', '배경', '가정'],
    funFact: '결혼은 두 집안의 만남. 좋은 가족은 보너스!',
  },
  {
    id: 'animal-lover',
    name: '동물 좋아하는 사람',
    emoji: '🐶',
    description: '동물을 사랑하고 잘 돌보는 사람',
    tags: ['성격', '동물', '따뜻함'],
    funFact: '반려동물 키우고 싶다면 필수 조건!',
  },
  {
    id: 'shared-hobby',
    name: '같은 취미 가진 사람',
    emoji: '🎮',
    description: '함께 즐길 수 있는 공통 관심사',
    tags: ['취미', '공감', '활동'],
    funFact: '데이트가 곧 취미 활동! 시간 가는 줄 몰라요',
  },
  {
    id: 'responsive',
    name: '연락 잘하는 사람',
    emoji: '📱',
    description: '빠르고 정성스러운 답장',
    tags: ['소통', '연락', '관심'],
    funFact: '읽씹 없는 세상! 기다림의 고통 제로',
  },
  {
    id: 'passionate',
    name: '자기 일에 열정적인 사람',
    emoji: '🔥',
    description: '꿈과 목표를 향해 노력하는 사람',
    tags: ['성격', '열정', '성장'],
    funFact: '일하는 모습이 멋있는 사람! 서로 응원하는 관계',
  },
  {
    id: 'loyal',
    name: '나만 바라보는 사람',
    emoji: '👀',
    description: '오직 나에게만 집중하는 한결같은 사람',
    tags: ['성격', '충성', '집중'],
    funFact: '눈에 나만 보이는 그 사람! 안정감 MAX',
  },
];

export const IDEALTYPE_CONDITIONS_WORLDCUP: Tournament = {
  id: 'idealtype-conditions-worldcup-v1',
  type: 'worldcup',
  category: 'love',
  title: '이상형 조건 월드컵',
  subtitle: '16강',
  description: '연애에서 가장 중요한 조건은? 1:1 대결로 찾아보세요!',
  emoji: '💘',
  themeColor: 'bg-pink-100',

  contestants: IDEALTYPE_CONDITIONS_CONTESTANTS,
  roundSize: 16,

  status: 'active',
  createdAt: '2024-12-23',

  resultConfig: {
    showRanking: true,
    showWinRate: true,
    showSegmentComparison: true,
    shareMessage: '내가 연애에서 가장 중요하게 생각하는 조건은 {winner}! 💘 너는 뭐야?',
  },
};

// ============================================================================
// 샘플 데이터: MBTI 월드컵 16강
// ============================================================================

export const MBTI_WORLDCUP_CONTESTANTS: TournamentContestant[] = [
  // === 분석가 (NT) ===
  {
    id: 'intj',
    name: 'INTJ - 전략가',
    emoji: '🎯',
    description: '혼자서도 잘하는 마스터플랜의 설계자',
    tags: ['내향', '직관', '사고', '판단', '분석가'],
    funFact: '전체 인구의 2%밖에 안 되는 희귀 유형으로, 독립적이고 전략적인 사고를 가졌어요',
  },
  {
    id: 'intp',
    name: 'INTP - 논리술사',
    emoji: '🧪',
    description: '지적 호기심의 끝판왕, 논리의 천재',
    tags: ['내향', '직관', '사고', '인식', '분석가'],
    funFact: '아인슈타인도 INTP! 끊임없이 "왜?"를 질문하는 혁신가예요',
  },
  {
    id: 'entj',
    name: 'ENTJ - 통솔자',
    emoji: '👑',
    description: '타고난 리더, 목표를 향해 돌진하는 지휘관',
    tags: ['외향', '직관', '사고', '판단', '분석가'],
    funFact: 'CEO가 가장 많은 유형! 카리스마와 추진력이 넘쳐요',
  },
  {
    id: 'entp',
    name: 'ENTP - 변론가',
    emoji: '💡',
    description: '창의적 토론의 달인, 혁신의 아이콘',
    tags: ['외향', '직관', '사고', '인식', '분석가'],
    funFact: '논쟁을 즐기고 새로운 아이디어에 열광하는 발명가 기질이에요',
  },

  // === 외교관 (NF) ===
  {
    id: 'infj',
    name: 'INFJ - 옹호자',
    emoji: '🌟',
    description: '이상주의자이자 완벽주의자, 깊은 통찰의 소유자',
    tags: ['내향', '직관', '감정', '판단', '외교관'],
    funFact: '전체 인구의 1%로 가장 희귀한 유형! 높은 공감 능력과 직관력을 가졌어요',
  },
  {
    id: 'infp',
    name: 'INFP - 중재자',
    emoji: '🌈',
    description: '낭만적 몽상가, 내면의 가치를 지키는 수호자',
    tags: ['내향', '직관', '감정', '인식', '외교관'],
    funFact: '시적이고 예술적 기질이 강해요. 셰익스피어도 INFP였어요',
  },
  {
    id: 'enfj',
    name: 'ENFJ - 선도자',
    emoji: '✨',
    description: '카리스마 넘치는 멘토, 사람들에게 영감을 주는 리더',
    tags: ['외향', '직관', '감정', '판단', '외교관'],
    funFact: '오바마도 ENFJ! 타인의 성장을 돕는 데서 기쁨을 느껴요',
  },
  {
    id: 'enfp',
    name: 'ENFP - 활동가',
    emoji: '🎉',
    description: '에너지 넘치는 자유로운 영혼, 열정의 화신',
    tags: ['외향', '직관', '감정', '인식', '외교관'],
    funFact: '궁금한 게 너무 많아서 집중력이... 하지만 그게 매력!',
  },

  // === 관리자 (SJ) ===
  {
    id: 'istj',
    name: 'ISTJ - 현실주의자',
    emoji: '📋',
    description: '책임감의 교과서, 신뢰할 수 있는 실용주의자',
    tags: ['내향', '감각', '사고', '판단', '관리자'],
    funFact: '가장 많은 유형 중 하나! 조직의 기둥 역할을 톡톡히 해요',
  },
  {
    id: 'isfj',
    name: 'ISFJ - 수호자',
    emoji: '🛡️',
    description: '헌신적인 보호자, 따뜻한 마음씨의 소유자',
    tags: ['내향', '감각', '감정', '판단', '관리자'],
    funFact: '전체 인구의 13%! 조용하지만 세심하게 챙겨주는 스타일이에요',
  },
  {
    id: 'estj',
    name: 'ESTJ - 경영자',
    emoji: '📊',
    description: '효율성의 달인, 체계적인 조직 관리자',
    tags: ['외향', '감각', '사고', '판단', '관리자'],
    funFact: '일 잘하는 워커홀릭! 규칙과 질서를 중시해요',
  },
  {
    id: 'esfj',
    name: 'ESFJ - 집정관',
    emoji: '💝',
    description: '인기쟁이 사교왕, 분위기 메이커',
    tags: ['외향', '감각', '감정', '판단', '관리자'],
    funFact: '모임의 필수템! 다른 사람 챙기는 걸 좋아하는 따뜻한 사람이에요',
  },

  // === 탐험가 (SP) ===
  {
    id: 'istp',
    name: 'ISTP - 장인',
    emoji: '🔧',
    description: '만능 해결사, 손재주와 논리의 조화',
    tags: ['내향', '감각', '사고', '인식', '탐험가'],
    funFact: '기계나 도구 다루는 걸 좋아해요. 침착하고 실용적!',
  },
  {
    id: 'isfp',
    name: 'ISFP - 모험가',
    emoji: '🎨',
    description: '감성 풍부한 예술가, 순간을 즐기는 자유인',
    tags: ['내향', '감각', '감정', '인식', '탐험가'],
    funFact: '미적 감각이 뛰어나고 자기만의 스타일이 확실해요',
  },
  {
    id: 'estp',
    name: 'ESTP - 사업가',
    emoji: '⚡',
    description: '행동파 실천가, 위기 상황의 해결사',
    tags: ['외향', '감각', '사고', '인식', '탐험가'],
    funFact: '일단 저질러! 에너지 넘치고 순발력이 뛰어나요',
  },
  {
    id: 'esfp',
    name: 'ESFP - 연예인',
    emoji: '🎭',
    description: '타고난 엔터테이너, 모두의 즐거움 제공자',
    tags: ['외향', '감각', '감정', '인식', '탐험가'],
    funFact: '파티의 중심! 주목받는 걸 좋아하고 분위기를 띄워요',
  },
];

export const MBTI_WORLDCUP: Tournament = {
  id: 'mbti-worldcup-v1',
  type: 'worldcup',
  category: 'personality',
  title: '최애 MBTI 월드컵',
  subtitle: '16강',
  description: '16가지 MBTI 중 당신의 최애는? 성격 유형 대결!',
  emoji: '🧠',
  themeColor: 'bg-indigo-100',

  contestants: MBTI_WORLDCUP_CONTESTANTS,
  roundSize: 16,

  status: 'active',
  createdAt: '2024-12-23',

  resultConfig: {
    showRanking: true,
    showWinRate: true,
    showSegmentComparison: true,
    shareMessage: '나의 최애 MBTI는 {winner}! 🧠 너도 해봐!',
  },
};

// ============================================================================
// 추가 토너먼트 아이디어 (샘플)
// ============================================================================

export const TOURNAMENT_IDEAS: { category: TournamentCategory; ideas: string[] }[] = [
  {
    category: 'dog',
    ideas: [
      '최애 강아지 품종 월드컵',
      '소형견 vs 대형견 이상형 월드컵',
      '치와와 vs 말티즈 vs 포메 (소형견 3파전)',
    ],
  },
  {
    category: 'cat',
    ideas: [
      '장모종 vs 단모종 월드컵',
      '고양이 털색 월드컵 (흰색/검정/치즈/삼색...)',
      '고양이 눈색 월드컵',
    ],
  },
  {
    category: 'plant',
    ideas: [
      '최애 반려식물 월드컵',
      '다육이 품종 월드컵',
      '공기정화 식물 월드컵',
    ],
  },
  {
    category: 'food',
    ideas: [
      '라면 월드컵',
      '치킨 브랜드 월드컵',
      '아이스크림 월드컵',
      '카페 음료 월드컵',
    ],
  },
  {
    category: 'love',
    ideas: [
      '이상형 조건 월드컵 ✅',
      '이상형 MBTI 월드컵',
      '연애 스타일 월드컵 (밀당파 vs 직진파 등)',
      '데이트 코스 월드컵',
    ],
  },
  {
    category: 'personality',
    ideas: [
      '내 성격과 맞는 직업 월드컵',
      '스트레스 해소법 월드컵',
      '취미 월드컵',
    ],
  },
  {
    category: 'lifestyle',
    ideas: [
      '카페 브랜드 월드컵',
      '넷플릭스 장르 월드컵',
      '여행지 월드컵',
      'OTT 서비스 월드컵',
    ],
  },
];

// ============================================================================
// 토너먼트 생성용 빈 템플릿
// ============================================================================

export const TOURNAMENT_TEMPLATE: Omit<Tournament, 'id' | 'contestants'> = {
  type: 'worldcup',
  category: 'general',
  title: '',
  subtitle: '16강',
  description: '',
  emoji: '🏆',
  themeColor: 'bg-gray-100',
  roundSize: 16,
  status: 'draft',
  createdAt: new Date().toISOString().split('T')[0],
  resultConfig: {
    showRanking: true,
    showWinRate: true,
    showSegmentComparison: true,
    shareMessage: '나의 1위는 {winner}! 너도 해봐!',
  },
};

// ============================================================================
// 참가자 생성용 빈 템플릿
// ============================================================================

export const CONTESTANT_TEMPLATE: Omit<TournamentContestant, 'id'> = {
  name: '',
  emoji: '',
  description: '',
  tags: [],
  funFact: '',
};

// ============================================================================
// 유틸리티 함수
// ============================================================================

/**
 * 토너먼트 라운드 이름 반환
 */
export function getRoundName(roundSize: RoundSize): string {
  switch (roundSize) {
    case 64: return '64강';
    case 32: return '32강';
    case 16: return '16강';
    case 8: return '8강';
    case 4: return '4강';
    default: return `${roundSize}강`;
  }
}

/**
 * 다음 라운드 계산
 */
export function getNextRoundSize(currentSize: RoundSize): RoundSize | 'final' {
  switch (currentSize) {
    case 64: return 32;
    case 32: return 16;
    case 16: return 8;
    case 8: return 4;
    case 4: return 'final';
    default: return 'final';
  }
}

/**
 * 라운드별 대결 수 계산
 */
export function getMatchCount(roundSize: RoundSize): number {
  return roundSize / 2;
}

/**
 * 랜덤 매칭 생성 (16강 → 8개 대결)
 */
export function generateRandomMatches(
  contestants: TournamentContestant[],
  roundSize: RoundSize
): TournamentMatch[] {
  if (contestants.length < roundSize) {
    throw new Error(`참가자 ${contestants.length}명으로 ${roundSize}강 진행 불가`);
  }

  // 셔플
  const shuffled = [...contestants].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, roundSize);

  const matches: TournamentMatch[] = [];
  const matchCount = getMatchCount(roundSize);

  for (let i = 0; i < matchCount; i++) {
    matches.push({
      id: `match-${roundSize}-${i + 1}`,
      round: Math.log2(roundSize),  // 16강=4, 8강=3, 4강=2, 결승=1
      matchIndex: i,
      contestant1Id: selected[i * 2].id,
      contestant2Id: selected[i * 2 + 1].id,
    });
  }

  return matches;
}

// ============================================================================
// 데이터 검증
// ============================================================================

export interface TournamentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateTournament(tournament: Tournament): TournamentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 필수 필드 체크
  if (!tournament.title) errors.push('title 필수');
  if (!tournament.description) errors.push('description 필수');
  if (!tournament.emoji) errors.push('emoji 필수');

  // 참가자 수 체크
  const contestantCount = tournament.contestants.length;
  if (contestantCount < tournament.roundSize) {
    errors.push(`참가자 ${contestantCount}명으로 ${tournament.roundSize}강 진행 불가 (최소 ${tournament.roundSize}명 필요)`);
  }

  // 참가자 개별 검증
  tournament.contestants.forEach((c, i) => {
    if (!c.id) errors.push(`contestants[${i}].id 필수`);
    if (!c.name) errors.push(`contestants[${i}].name 필수`);
    if (!c.emoji) errors.push(`contestants[${i}].emoji 필수`);
    if (!c.description) warnings.push(`contestants[${i}].description 권장`);
  });

  // 중복 ID 체크
  const ids = tournament.contestants.map(c => c.id);
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (duplicates.length > 0) {
    errors.push(`중복 ID: ${duplicates.join(', ')}`);
  }

  // 라운드 사이즈 유효성
  const validSizes: RoundSize[] = [4, 8, 16, 32, 64];
  if (!validSizes.includes(tournament.roundSize)) {
    errors.push(`roundSize는 4, 8, 16, 32, 64 중 하나여야 함`);
  }

  // 권장사항
  if (!tournament.subtitle) warnings.push('subtitle 권장');
  if (contestantCount === tournament.roundSize) {
    warnings.push('참가자 수가 정확히 라운드 수와 같음 - 여유 참가자 추가 권장');
  }

  tournament.contestants.forEach((c, i) => {
    if (!c.funFact) warnings.push(`contestants[${i}].funFact 권장 (결과 화면용)`);
    if (!c.tags || c.tags.length === 0) warnings.push(`contestants[${i}].tags 권장 (필터/검색용)`);
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// 샘플 데이터 검증 실행
export const CAT_BREED_VALIDATION = validateTournament(CAT_BREED_TOURNAMENT);

// ============================================================================
// Export
// ============================================================================

// 라면 월드컵 검증 실행
export const RAMEN_WORLDCUP_VALIDATION = validateTournament(RAMEN_WORLDCUP);

// 인생 가치관 월드컵 검증 실행
export const VALUES_WORLDCUP_VALIDATION = validateTournament(VALUES_WORLDCUP);

// 이상형 조건 월드컵 검증 실행
export const IDEALTYPE_CONDITIONS_VALIDATION = validateTournament(IDEALTYPE_CONDITIONS_WORLDCUP);

// MBTI 월드컵 검증 실행
export const MBTI_WORLDCUP_VALIDATION = validateTournament(MBTI_WORLDCUP);

export const TOURNAMENT_SAMPLE = {
  catBreed: CAT_BREED_TOURNAMENT,
  ramenWorldcup: RAMEN_WORLDCUP,
  valuesWorldcup: VALUES_WORLDCUP,
  idealtypeConditions: IDEALTYPE_CONDITIONS_WORLDCUP,
  mbtiWorldcup: MBTI_WORLDCUP,
  contestants: {
    catBreed: CAT_BREED_CONTESTANTS,
    ramen: RAMEN_WORLDCUP_CONTESTANTS,
    values: VALUES_WORLDCUP_CONTESTANTS,
    idealtypeConditions: IDEALTYPE_CONDITIONS_CONTESTANTS,
    mbti: MBTI_WORLDCUP_CONTESTANTS,
  },
  ideas: TOURNAMENT_IDEAS,
  template: TOURNAMENT_TEMPLATE,
  contestantTemplate: CONTESTANT_TEMPLATE,
  validation: {
    catBreed: CAT_BREED_VALIDATION,
    ramen: RAMEN_WORLDCUP_VALIDATION,
    values: VALUES_WORLDCUP_VALIDATION,
    idealtypeConditions: IDEALTYPE_CONDITIONS_VALIDATION,
    mbti: MBTI_WORLDCUP_VALIDATION,
  },
  utils: {
    getRoundName,
    getNextRoundSize,
    getMatchCount,
    generateRandomMatches,
    validateTournament,
  },
};

export default TOURNAMENT_SAMPLE;
