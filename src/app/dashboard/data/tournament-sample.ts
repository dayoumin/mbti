// ============================================================================
// 토너먼트/월드컵 데이터 구조 및 샘플
// ============================================================================

// ============================================================================
// Types
// ============================================================================

export type TournamentType = 'worldcup' | 'bracket';
// 샘플용 - 다양한 카테고리 허용
export type TournamentCategory = string;
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
  meta?: { isAdultOnly?: boolean };  // 연령 제한 (선택)
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

  // 연령 제한 (선택)
  meta?: {
    minAge?: string;
    isAdultOnly?: boolean;
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
// 샘플 데이터: 커피 음료 월드컵 16강
// ============================================================================

export const COFFEE_WORLDCUP_CONTESTANTS: TournamentContestant[] = [
  {
    id: 'americano',
    name: '아메리카노',
    emoji: '☕',
    description: '진한 에스프레소에 물을 더한 클래식',
    tags: ['블랙커피', '에스프레소', '기본', '저칼로리'],
    funFact: '이름의 유래는 미군들이 진한 에스프레소에 물을 타 마신 것!',
  },
  {
    id: 'latte',
    name: '카페라떼',
    emoji: '🥛',
    description: '부드러운 우유와 에스프레소의 조화',
    tags: ['우유', '부드러움', '인기', '카페인중간'],
    funFact: '이탈리아어로 "카페 라떼"는 그냥 "우유 커피"라는 뜻이에요',
  },
  {
    id: 'cappuccino',
    name: '카푸치노',
    emoji: '☁️',
    description: '풍성한 우유 거품이 올라간 이탈리안 스타일',
    tags: ['우유거품', '진한맛', '이탈리아', '클래식'],
    funFact: '카푸친 수도사의 갈색 옷에서 이름이 유래했어요',
  },
  {
    id: 'espresso',
    name: '에스프레소',
    emoji: '⚡',
    description: '고압으로 추출한 진한 커피의 원조',
    tags: ['진함', '소량', '카페인', '이탈리아'],
    funFact: '30ml의 작은 양에 강렬한 맛과 향이 응축되어 있어요',
  },
  {
    id: 'coldbrew',
    name: '콜드브루',
    emoji: '🧊',
    description: '찬물에 오래 우려낸 부드러운 아이스커피',
    tags: ['차가움', '부드러움', '여름', '저산미'],
    funFact: '12-24시간 동안 찬물에 우려내서 산미가 낮고 부드러워요',
  },
  {
    id: 'vanilla-latte',
    name: '바닐라 라떼',
    emoji: '🍦',
    description: '달콤한 바닐라 시럽이 들어간 라떼',
    tags: ['달콤', '바닐라', '여성인기', '디저트'],
    funFact: '커피 초보자도 부담 없이 즐길 수 있는 입문용 메뉴!',
  },
  {
    id: 'caramel-macchiato',
    name: '카라멜 마끼아또',
    emoji: '🍮',
    description: '바닐라 시럽, 우유, 에스프레소에 카라멜 소스',
    tags: ['달콤', '카라멜', '인기', '스타벅스'],
    funFact: '스타벅스가 만든 창작 메뉴로 전 세계적으로 유명해졌어요',
  },
  {
    id: 'mocha',
    name: '카페모카',
    emoji: '🍫',
    description: '초콜릿과 커피의 달콤쌉싸름한 만남',
    tags: ['초콜릿', '달콤', '디저트', '겨울'],
    funFact: '커피와 핫초코의 중간 맛! 디저트 같은 커피예요',
  },
  {
    id: 'flat-white',
    name: '플랫 화이트',
    emoji: '🤍',
    description: '진한 에스프레소와 벨벳 같은 우유 거품',
    tags: ['호주', '뉴질랜드', '진함', '우유거품'],
    funFact: '호주와 뉴질랜드에서 유래한 메뉴로, 라떼보다 우유가 적어요',
  },
  {
    id: 'einspanner',
    name: '아인슈페너',
    emoji: '🎂',
    description: '진한 커피 위에 달콤한 휘핑크림',
    tags: ['비엔나', '휘핑', '달콤', '독특'],
    funFact: '독일어로 "마차를 모는 사람"이라는 뜻. 빈 커피의 일종이에요',
  },
  {
    id: 'affogato',
    name: '아포가토',
    emoji: '🍨',
    description: '바닐라 아이스크림에 뜨거운 에스프레소를 부어',
    tags: ['디저트', '아이스크림', '이탈리아', '달콤'],
    funFact: '이탈리아어로 "빠뜨리다"라는 뜻. 커피인지 디저트인지 애매해요',
  },
  {
    id: 'irish-coffee',
    name: '아이리시 커피',
    emoji: '🍀',
    description: '위스키와 커피, 설탕, 크림의 조합',
    tags: ['위스키', '술', '성인', '겨울'],
    funFact: '아일랜드의 국민 음료로, 추운 날 몸을 녹이는 최고의 선택!',
    meta: { isAdultOnly: true },
  },
  {
    id: 'cafe-con-leche',
    name: '카페 콘 레체',
    emoji: '🇪🇸',
    description: '스페인식 밀크커피, 커피와 우유 1:1',
    tags: ['스페인', '우유', '아침', '간단'],
    funFact: '스페인에서 아침에 주로 마시는 전통 커피예요',
  },
  {
    id: 'turkish-coffee',
    name: '터키시 커피',
    emoji: '🇹🇷',
    description: '아주 곱게 간 커피를 끓여낸 중동식',
    tags: ['터키', '전통', '진함', '독특'],
    funFact: 'UNESCO 무형문화유산! 찌꺼기로 점을 치는 전통도 있어요',
  },
  {
    id: 'dalgona-coffee',
    name: '달고나 커피',
    emoji: '☁️',
    description: '휘핑한 커피 거품을 우유 위에 올린 한국식',
    tags: ['한국', '거품', '인스타', '트렌드'],
    funFact: '코로나19 때 전 세계적으로 유행했던 한국 발 트렌드!',
  },
  {
    id: 'nitro-coldbrew',
    name: '니트로 콜드브루',
    emoji: '🍺',
    description: '질소를 주입한 부드럽고 크리미한 콜드브루',
    tags: ['질소', '부드러움', '프리미엄', '트렌드'],
    funFact: '맥주처럼 질소를 넣어 크리미한 거품이 생겨요. 시각적으로도 멋져요!',
  },
];

export const COFFEE_WORLDCUP: Tournament = {
  id: 'coffee-worldcup-v1',
  type: 'worldcup',
  category: 'coffee',
  title: '최애 커피 음료 월드컵',
  subtitle: '16강',
  description: '당신의 최애 커피는? 전 세계 인기 커피 대결!',
  emoji: '☕',
  themeColor: 'bg-amber-100',

  contestants: COFFEE_WORLDCUP_CONTESTANTS,
  roundSize: 16,

  status: 'active',
  createdAt: '2024-12-25',

  resultConfig: {
    showRanking: true,
    showWinRate: true,
    showSegmentComparison: true,
    shareMessage: '나의 최애 커피는 {winner}! ☕ 너도 해봐!',
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
// 샘플 데이터: 금요일 저녁 활동 월드컵 16강
// ============================================================================

export const FRIDAY_NIGHT_CONTESTANTS: TournamentContestant[] = [
  {
    id: 'netflix',
    name: '집에서 넷플릭스',
    emoji: '📺',
    description: '아무 생각 없이 소파에 누워 드라마/영화 정주행',
    tags: ['집순이', '힐링', '실내', '혼자'],
    funFact: '한 편만 보려 했는데 어느새 시즌 전체를 다 봤어요',
  },
  {
    id: 'drinks-with-friends',
    name: '친구들과 술 한잔',
    emoji: '🍻',
    description: '단골 포차에서 소주 한잔하며 수다 떨기',
    tags: ['친구', '외출', '술', '수다'],
    funFact: '한잔만 하려 했는데 2차까지 가는 건 기본',
  },
  {
    id: 'solo-drink-youtube',
    name: '혼술하며 유튜브',
    emoji: '🍺',
    description: '편한 옷 입고 집에서 맥주 한캔, 유튜브 정주행',
    tags: ['혼자', '술', '힐링', '실내'],
    funFact: '알고리즘이 추천하는 대로 새벽 3시까지 시청',
  },
  {
    id: 'restaurant-tour',
    name: '맛집 탐방',
    emoji: '🍴',
    description: '인스타에서 찾아둔 핫플 맛집 방문',
    tags: ['외식', '외출', '그루메', 'SNS'],
    funFact: '음식 사진 찍느라 식기 전에 먹은 적이 없어요',
  },
  {
    id: 'gym',
    name: '헬스장 운동',
    emoji: '💪',
    description: '한 주 스트레스를 땀으로 날려버리기',
    tags: ['운동', '건강', '외출', '자기관리'],
    funFact: '금요일 저녁 헬스장은 사람이 없어서 쾌적해요',
  },
  {
    id: 'cafe-reading',
    name: '카페에서 책 읽기',
    emoji: '☕',
    description: '조용한 카페 찾아서 아메리카노와 책 한 권',
    tags: ['힐링', '독서', '카페', '혼자'],
    funFact: '책보다 카페 분위기를 더 즐기는 중일지도',
  },
  {
    id: 'gaming',
    name: '게임하기',
    emoji: '🎮',
    description: 'PC방이나 집에서 밤새 게임 삼매경',
    tags: ['게임', '취미', '실내', '몰입'],
    funFact: '한 판만 하려 했는데 해가 떠있어요',
  },
  {
    id: 'shopping',
    name: '쇼핑몰 구경',
    emoji: '🛍️',
    description: '백화점/아울렛 돌아다니며 쇼핑&구경',
    tags: ['쇼핑', '외출', '힐링', '소비'],
    funFact: '구경만 하려 했는데 카드가 움직였어요',
  },
  {
    id: 'movie-theater',
    name: '영화관 가기',
    emoji: '🎬',
    description: '큰 스크린으로 보는 신작 영화',
    tags: ['외출', '영화', '문화', '힐링'],
    funFact: '팝콘 콤보가 영화 티켓보다 비싼 건 비밀',
  },
  {
    id: 'cooking',
    name: '집에서 요리하기',
    emoji: '🍳',
    description: '좋아하는 음악 틀고 여유롭게 요리 타임',
    tags: ['요리', '실내', '취미', '힐링'],
    funFact: '인스타 보고 도전했다가 주방이 난장판',
  },
  {
    id: 'online-shopping',
    name: '온라인 쇼핑',
    emoji: '📱',
    description: '침대에 누워서 쿠팡/무신사 장바구니 채우기',
    tags: ['쇼핑', '실내', '혼자', '소비'],
    funFact: '새벽 배송으로 내일 아침이 크리스마스',
  },
  {
    id: 'early-sleep',
    name: '목욕하고 일찍 자기',
    emoji: '🛀',
    description: '향기로운 입욕제 넣고 반신욕, 9시 취침',
    tags: ['휴식', '힐링', '실내', '자기관리'],
    funFact: '한 주 동안 쌓인 피로를 완벽하게 리셋',
  },
  {
    id: 'drive',
    name: '드라이브하기',
    emoji: '🚗',
    description: '좋아하는 음악 틀고 야경 보러 드라이브',
    tags: ['외출', '자유', '힐링', '감성'],
    funFact: '목적지는 없어도 괜찮아요. 과정이 중요',
  },
  {
    id: 'karaoke',
    name: '노래방 가기',
    emoji: '🎤',
    description: '친구들이나 혼자 가서 스트레스 해소 노래방',
    tags: ['외출', '스트레스해소', '취미', '노래'],
    funFact: '1시간만 하려 했는데 연장이 기본',
  },
  {
    id: 'delivery',
    name: '배달음식 시켜 먹기',
    emoji: '🍕',
    description: '피자/치킨/족발 시켜서 집에서 편하게',
    tags: ['식사', '실내', '편안', '혼자'],
    funFact: '요리 안 해도 되고 설거지도 없는 완벽한 금요일',
  },
  {
    id: 'walk',
    name: '산책하기',
    emoji: '🚶',
    description: '한강이나 공원 산책하며 한 주 정리',
    tags: ['외출', '힐링', '운동', '여유'],
    funFact: '생각 정리하기 좋고, 운동도 되고 일석이조',
  },
];

export const FRIDAY_NIGHT_WORLDCUP: Tournament = {
  id: 'friday-night-worldcup-v1',
  type: 'worldcup',
  category: 'lifestyle',
  title: '금요일 저녁 활동 월드컵',
  subtitle: '16강',
  description: '불금에 뭐하고 싶어? 나의 최애 금요일 활동 찾기!',
  emoji: '🌃',
  themeColor: 'bg-indigo-100',

  contestants: FRIDAY_NIGHT_CONTESTANTS,
  roundSize: 16,

  status: 'active',
  createdAt: '2024-12-23',

  resultConfig: {
    showRanking: true,
    showWinRate: true,
    showSegmentComparison: true,
    shareMessage: '나의 최애 금요일 활동은 {winner}! 🌃 너는 뭐야?',
  },
};

// ============================================================================
// 샘플 데이터: 스트레스 해소법 월드컵 16강
// ============================================================================

export const STRESS_RELIEF_CONTESTANTS: TournamentContestant[] = [
  {
    id: 'sleep',
    name: '잠자기',
    emoji: '😴',
    description: '눈 감으면 세상 걱정도 끝! 최고의 리셋 버튼',
    tags: ['휴식', '회복', '실내', '혼자'],
    funFact: '수면은 뇌가 스트레스 호르몬을 정리하는 자연 치유 시간이에요',
  },
  {
    id: 'eating',
    name: '먹기 (폭식)',
    emoji: '🍔',
    description: '스트레스는 달달짭짤로 해결! 치팅데이는 자유',
    tags: ['음식', '즉각', '쾌락', '실내'],
    funFact: '먹을 때만큼은 다 잊어버려요. 단, 내일의 나는 후회할지도...',
  },
  {
    id: 'exercise',
    name: '운동하기',
    emoji: '🏃',
    description: '땀으로 스트레스를 배출! 건강도 챙기는 일석이조',
    tags: ['건강', '활동', '외출', '장기효과'],
    funFact: '운동하면 엔도르핀이 분비되어 자연스럽게 기분이 좋아져요',
  },
  {
    id: 'gaming',
    name: '게임하기',
    emoji: '🎮',
    description: '가상세계로 도피! 몰입하면 현실 걱정은 잠시 bye',
    tags: ['몰입', '취미', '실내', '혼자'],
    funFact: '한 판만 하려다 새벽 되는 건 기본. 중독 주의!',
  },
  {
    id: 'singing',
    name: '노래 부르기',
    emoji: '🎤',
    description: '목청 터지게 질러보자! 속 시원한 카타르시스',
    tags: ['표현', '외출', '스트레스해소', '감정'],
    funFact: '노래방에서 고음 지르면 억눌린 감정이 싹 날아가요',
  },
  {
    id: 'drinking',
    name: '술 마시기',
    emoji: '🍺',
    description: '오늘 하루 수고했어, 한잔하자! 취기로 잊어버리기',
    tags: ['사교', '외출', '즉각', '회피'],
    funFact: '술은 일시적 기분 전환은 되지만, 숙취와 함께 스트레스도 돌아와요',
  },
  {
    id: 'shopping',
    name: '쇼핑하기',
    emoji: '🛍️',
    description: '지갑은 가벼워지고 마음은 부유해져요!',
    tags: ['소비', '즉각', '외출', '쾌락'],
    funFact: '뇌는 물건을 살 때 도파민을 분비해서 기분이 좋아져요. 단, 통장 주의',
  },
  {
    id: 'watching',
    name: '영화/드라마 보기',
    emoji: '📺',
    description: '소파에 누워 몰아보기! 타인의 삶으로 현실 도피',
    tags: ['몰입', '실내', '혼자', '휴식'],
    funFact: '시즌 전체를 정주행하면 시간 가는 줄 몰라요',
  },
  {
    id: 'chatting',
    name: '친구와 수다',
    emoji: '💬',
    description: '하소연하고 공감받기! 들어주는 친구가 최고의 명약',
    tags: ['사교', '공감', '외출', '감정'],
    funFact: '고민을 말로 표현하면 뇌가 정리하면서 스트레스가 줄어들어요',
  },
  {
    id: 'cleaning',
    name: '청소하기',
    emoji: '🧹',
    description: '더러운 집 = 복잡한 마음. 정리하면 속도 시원!',
    tags: ['활동', '실내', '생산적', '혼자'],
    funFact: '청소하면 세로토닌이 분비되고, 깨끗한 공간은 마음까지 정돈해줘요',
  },
  {
    id: 'walking',
    name: '산책하기',
    emoji: '🚶',
    description: '한강, 공원, 동네 한 바퀴. 걷다보면 머리가 맑아져요',
    tags: ['외출', '운동', '여유', '자연'],
    funFact: '걷기는 뇌에 산소를 공급하고 생각을 정리하는 데 최고예요',
  },
  {
    id: 'bathing',
    name: '목욕/반신욕',
    emoji: '🛁',
    description: '따뜻한 물에 몸 담그고 힐링 타임! 향기로운 입욕제 필수',
    tags: ['휴식', '힐링', '실내', '혼자'],
    funFact: '따뜻한 물은 근육 긴장을 풀고 부교감신경을 활성화해요',
  },
  {
    id: 'meditation',
    name: '명상/요가',
    emoji: '🧘',
    description: '호흡에 집중하며 마음 다스리기. 내면의 평화 찾기',
    tags: ['정신', '건강', '실내', '장기효과'],
    funFact: '규칙적인 명상은 스트레스 호르몬(코르티솔)을 실제로 줄여줘요',
  },
  {
    id: 'crying',
    name: '울기',
    emoji: '😭',
    description: '억지로 참지 말고 펑펑 울어버리자! 눈물은 해독제',
    tags: ['감정', '표현', '해소', '혼자'],
    funFact: '눈물에는 스트레스 호르몬이 포함되어 있어서 우는 게 실제로 도움돼요',
  },
  {
    id: 'sns',
    name: 'SNS 하기',
    emoji: '📱',
    description: '무한 스크롤로 시간 보내기. 뇌는 쉬고 손은 바쁘게',
    tags: ['소비', '실내', '혼자', '회피'],
    funFact: 'SNS는 일시적 기분 전환은 되지만, 비교 심리로 오히려 스트레스가 될 수도...',
  },
  {
    id: 'nothing',
    name: '아무것도 안하기',
    emoji: '🪫',
    description: '그냥 멍 때리기. 생각도 행동도 멈추고 배터리 충전',
    tags: ['휴식', '실내', '혼자', '회복'],
    funFact: '멍 때리기는 뇌의 디폴트 모드 네트워크를 활성화해서 창의성을 높여줘요',
  },
];

export const STRESS_RELIEF_WORLDCUP: Tournament = {
  id: 'stress-relief-worldcup-v1',
  type: 'worldcup',
  category: 'lifestyle',
  title: '스트레스 해소법 월드컵',
  subtitle: '16강',
  description: '힘들 때 당신이 제일 먼저 하는 건? 나만의 힐링 방법 찾기!',
  emoji: '😤',
  themeColor: 'bg-teal-100',

  contestants: STRESS_RELIEF_CONTESTANTS,
  roundSize: 16,

  status: 'active',
  createdAt: '2024-12-23',

  resultConfig: {
    showRanking: true,
    showWinRate: true,
    showSegmentComparison: true,
    shareMessage: '나의 최고 스트레스 해소법은 {winner}! 😤 너는 뭐야?',
  },
};

// ============================================================================
// 샘플 데이터: 주말 활동 월드컵 16강
// ============================================================================

export const WEEKEND_ACTIVITY_CONTESTANTS: TournamentContestant[] = [
  {
    id: 'sleep-in',
    name: '집에서 푹 자기',
    emoji: '😴',
    description: '알람 없이 늦잠 자고 이불 속에서 뒹굴뒹굴',
    tags: ['휴식', '실내', '혼자', '충전'],
    funFact: '주말 늦잠은 평일 부족한 수면을 보충하는 최고의 선물!',
  },
  {
    id: 'cafe-chill',
    name: '카페에서 여유',
    emoji: '☕',
    description: '분위기 좋은 카페에서 커피 한잔과 여유로운 시간',
    tags: ['외출', '카페', '힐링', '혼자'],
    funFact: '카페 음악과 커피 향기는 스트레스를 줄여주는 치유제',
  },
  {
    id: 'hiking',
    name: '등산/하이킹',
    emoji: '⛰️',
    description: '상쾌한 공기 마시며 산 오르기, 정상 인증샷 필수',
    tags: ['외출', '운동', '자연', '건강'],
    funFact: '등산은 유산소 운동과 힐링을 동시에! 정상에서 먹는 컵라면은 별미',
  },
  {
    id: 'food-tour',
    name: '맛집 탐방',
    emoji: '🍴',
    description: '인스타에 저장해둔 맛집 리스트 정복하기',
    tags: ['외출', '음식', 'SNS', '탐험'],
    funFact: '음식 사진 찍는 시간이 먹는 시간보다 길어요',
  },
  {
    id: 'movie-theater',
    name: '영화관 가기',
    emoji: '🎬',
    description: '큰 스크린으로 보는 신작 영화, 팝콘 콤보 필수',
    tags: ['외출', '문화', '힐링', '실내'],
    funFact: '주말 조조 할인 시간대는 가성비 최고!',
  },
  {
    id: 'shopping',
    name: '쇼핑하기',
    emoji: '🛍️',
    description: '백화점/아울렛 돌아다니며 쇼핑 & 구경',
    tags: ['외출', '쇼핑', '소비', '힐링'],
    funFact: '구경만 하려 했는데 카드가 움직이는 건 기본',
  },
  {
    id: 'friends-meetup',
    name: '친구 만나기',
    emoji: '👥',
    description: '오랜만에 친구들과 수다 떨고 밥 먹기',
    tags: ['외출', '사교', '관계', '수다'],
    funFact: '한 시간만 만나려 했는데 4시간은 기본',
  },
  {
    id: 'family-time',
    name: '가족과 시간',
    emoji: '👨‍👩‍👧',
    description: '부모님 뵙거나 가족과 함께 시간 보내기',
    tags: ['가족', '관계', '외출', '따뜻함'],
    funFact: '부모님 집에 가면 밥 먹이고 반찬 싸주는 건 덤',
  },
  {
    id: 'exercise',
    name: '운동하기',
    emoji: '💪',
    description: '헬스장, 수영장, 요가 등 땀 흘리며 건강 챙기기',
    tags: ['운동', '건강', '외출', '자기관리'],
    funFact: '주말에 미리 운동하면 다음 주 죄책감 제로!',
  },
  {
    id: 'drive',
    name: '드라이브',
    emoji: '🚗',
    description: '좋아하는 음악 틀고 바다/산으로 드라이브',
    tags: ['외출', '자유', '감성', '힐링'],
    funFact: '목적지는 중요하지 않아요. 과정이 힐링!',
  },
  {
    id: 'exhibition',
    name: '전시회/박물관',
    emoji: '🎨',
    description: '미술관, 박물관, 전시회 관람하며 문화생활',
    tags: ['문화', '외출', '교양', '감성'],
    funFact: '전시 관람 후 굿즈 사는 건 필수 코스',
  },
  {
    id: 'reading',
    name: '독서하기',
    emoji: '📚',
    description: '밀린 책 읽거나 서점 구경하며 책 고르기',
    tags: ['실내', '독서', '혼자', '교양'],
    funFact: '책 읽다가 잠드는 건 독서의 최고 경지',
  },
  {
    id: 'gaming',
    name: '게임하기',
    emoji: '🎮',
    description: 'PC방이나 집에서 밤새 게임 삼매경',
    tags: ['게임', '실내', '몰입', '혼자'],
    funFact: '한 판만 하려 했는데 해가 떠있는 마법',
  },
  {
    id: 'cooking-baking',
    name: '요리/베이킹',
    emoji: '👨‍🍳',
    description: '새로운 레시피 도전하거나 홈베이킹',
    tags: ['요리', '실내', '취미', '생산적'],
    funFact: '인스타 레시피 따라 했다가 주방이 난장판',
  },
  {
    id: 'cleaning',
    name: '청소/정리',
    emoji: '🧹',
    description: '집 대청소하고 정리정돈으로 기분 전환',
    tags: ['실내', '생산적', '혼자', '힐링'],
    funFact: '깨끗한 집에서 맞이하는 월요일은 기분 좋아요',
  },
  {
    id: 'hobby',
    name: '취미활동',
    emoji: '🎸',
    description: '악기, 그림, 운동 등 나만의 취미에 몰입',
    tags: ['취미', '실내', '외출', '자기계발'],
    funFact: '좋아하는 걸 할 때 시간이 가장 빨리 가요',
  },
];

export const WEEKEND_ACTIVITY_WORLDCUP: Tournament = {
  id: 'weekend-activity-worldcup-v1',
  type: 'worldcup',
  category: 'lifestyle',
  title: '주말 활동 월드컵',
  subtitle: '16강',
  description: '이번 주말에 뭐하지? 나의 최애 주말 활동 찾기!',
  emoji: '🌞',
  themeColor: 'bg-yellow-100',

  contestants: WEEKEND_ACTIVITY_CONTESTANTS,
  roundSize: 16,

  status: 'active',
  createdAt: '2024-12-23',

  resultConfig: {
    showRanking: true,
    showWinRate: true,
    showSegmentComparison: true,
    shareMessage: '나의 최애 주말 활동은 {winner}! 🌞 너는 뭐야?',
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
      '스트레스 해소법 월드컵 ✅',
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
      '금요일 저녁 활동 월드컵 ✅',
      '주말 활동 월드컵 ✅',
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

// 커피 월드컵 검증 실행
export const COFFEE_WORLDCUP_VALIDATION = validateTournament(COFFEE_WORLDCUP);

// 라면 월드컵 검증 실행
export const RAMEN_WORLDCUP_VALIDATION = validateTournament(RAMEN_WORLDCUP);

// 인생 가치관 월드컵 검증 실행
export const VALUES_WORLDCUP_VALIDATION = validateTournament(VALUES_WORLDCUP);

// 이상형 조건 월드컵 검증 실행
export const IDEALTYPE_CONDITIONS_VALIDATION = validateTournament(IDEALTYPE_CONDITIONS_WORLDCUP);

// MBTI 월드컵 검증 실행
export const MBTI_WORLDCUP_VALIDATION = validateTournament(MBTI_WORLDCUP);

// 금요일 저녁 활동 월드컵 검증 실행
export const FRIDAY_NIGHT_WORLDCUP_VALIDATION = validateTournament(FRIDAY_NIGHT_WORLDCUP);

// 스트레스 해소법 월드컵 검증 실행
export const STRESS_RELIEF_WORLDCUP_VALIDATION = validateTournament(STRESS_RELIEF_WORLDCUP);

// 주말 활동 월드컵 검증 실행
export const WEEKEND_ACTIVITY_WORLDCUP_VALIDATION = validateTournament(WEEKEND_ACTIVITY_WORLDCUP);

// ============================================================================
// 샘플 데이터: 여행지 월드컵 16강
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
    emoji: '🗼',
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
  {
    id: 'auckland',
    name: '오클랜드',
    emoji: '🌋',
    description: '화산과 항구의 도시, 깨끗한 자연',
    tags: ['뉴질랜드', '도시', '자연', '화산', '해양'],
    funFact: '세계에서 요트 보유율이 가장 높은 도시예요',
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

// 여행지 월드컵 검증 실행
export const TRAVEL_DESTINATION_WORLDCUP_VALIDATION = validateTournament(TRAVEL_DESTINATION_WORLDCUP);

// ============================================================================
// 샘플 데이터: 와인 품종 월드컵 16강
// ============================================================================

export const WINE_WORLDCUP_CONTESTANTS: TournamentContestant[] = [
  // === 레드 와인 - 풀 바디 ===
  {
    id: 'cabernet-sauvignon',
    name: '카베르네 소비뇽',
    emoji: '🍷',
    description: '풀 바디의 대명사, 높은 타닌과 블랙커런트 향',
    tags: ['레드', '풀바디', '타닌', '보르도'],
    funFact: '보르도 5대 샤토의 주요 품종으로, 장기 숙성 능력이 뛰어나요',
  },
  {
    id: 'syrah-shiraz',
    name: '시라/쉬라즈',
    emoji: '🔥',
    description: '스파이시한 후추 향과 진한 과일 맛',
    tags: ['레드', '풀바디', '스파이시', '론'],
    funFact: '프랑스에서는 시라, 호주에서는 쉬라즈로 불려요',
  },
  {
    id: 'malbec',
    name: '말벡',
    emoji: '🇦🇷',
    description: '아르헨티나의 대표 품종, 블랙베리와 자두 향',
    tags: ['레드', '풀바디', '과일향', '아르헨티나'],
    funFact: '프랑스에서 왔지만 아르헨티나에서 세계적인 명성을 얻었어요',
  },
  {
    id: 'zinfandel',
    name: '진판델',
    emoji: '🍇',
    description: '캘리포니아의 보물, 잼 같은 과일 풍미',
    tags: ['레드', '풀바디', '과일풍미', '미국'],
    funFact: '캘리포니아에서 가장 오래된 품종 중 하나예요',
  },

  // === 레드 와인 - 미디엄/라이트 바디 ===
  {
    id: 'merlot',
    name: '메를로',
    emoji: '🍒',
    description: '부드러운 타닌, 체리와 자두의 달콤함',
    tags: ['레드', '미디엄바디', '부드러움', '보르도'],
    funFact: '카베르네 소비뇽의 완벽한 블렌딩 파트너예요',
  },
  {
    id: 'pinot-noir',
    name: '피노 누아',
    emoji: '🍓',
    description: '섬세하고 우아한 라이트 바디, 체리와 딸기 향',
    tags: ['레드', '라이트바디', '섬세함', '부르고뉴'],
    funFact: '재배가 까다로워 "와인의 여왕"으로 불려요',
  },
  {
    id: 'sangiovese',
    name: '산지오베제',
    emoji: '🇮🇹',
    description: '이탈리아의 자존심, 체리와 허브 향',
    tags: ['레드', '미디엄바디', '산도', '토스카나'],
    funFact: '키안티 와인의 주요 품종이에요',
  },
  {
    id: 'tempranillo',
    name: '템프라니요',
    emoji: '🇪🇸',
    description: '스페인의 대표 품종, 가죽과 담배 뉘앙스',
    tags: ['레드', '미디엄바디', '복합미', '리오하'],
    funFact: '"이른 성숙"이라는 뜻으로, 다른 품종보다 빨리 익어요',
  },

  // === 화이트 와인 - 풀 바디 ===
  {
    id: 'chardonnay',
    name: '샤도네이',
    emoji: '🧈',
    description: '오크 숙성의 버터와 바닐라 향',
    tags: ['화이트', '풀바디', '버터향', '부르고뉴'],
    funFact: '가장 다양한 스타일로 만들 수 있는 만능 품종이에요',
  },
  {
    id: 'viognier',
    name: '비오니에',
    emoji: '🌼',
    description: '풍부한 꽃향과 복숭아 아로마',
    tags: ['화이트', '풀바디', '꽃향', '론'],
    funFact: '한때 멸종 위기였지만 지금은 인기 품종으로 부활했어요',
  },

  // === 화이트 와인 - 라이트/미디엄 바디 ===
  {
    id: 'sauvignon-blanc',
    name: '소비뇽 블랑',
    emoji: '🌿',
    description: '높은 산도, 풀과 허브의 상큼함',
    tags: ['화이트', '라이트바디', '산뜻함', '뉴질랜드'],
    funFact: '뉴질랜드 말보로 지역에서 세계적인 명성을 얻었어요',
  },
  {
    id: 'riesling',
    name: '리슬링',
    emoji: '🍑',
    description: '높은 산도, 꽃과 복숭아 향, 드라이~스위트 다양',
    tags: ['화이트', '라이트바디', '산도', '독일'],
    funFact: '당도와 산도를 모두 높게 유지할 수 있는 유일한 품종이에요',
  },
  {
    id: 'pinot-grigio',
    name: '피노 그리지오',
    emoji: '🍋',
    description: '가볍고 산뜻한 이탈리아 스타일',
    tags: ['화이트', '라이트바디', '가벼움', '이탈리아'],
    funFact: '프랑스에서는 피노 그리, 이탈리아에서는 피노 그리지오로 불려요',
  },
  {
    id: 'gewurztraminer',
    name: '게뷔르츠트라미너',
    emoji: '🌹',
    description: '향긋한 라이치와 장미 향',
    tags: ['화이트', '미디엄바디', '향긋함', '알자스'],
    funFact: '"게뷔르츠"는 독일어로 "향신료"라는 뜻이에요',
  },

  // === 스파클링 ===
  {
    id: 'champagne',
    name: '샴페인',
    emoji: '🥂',
    description: '프랑스 샴파뉴 지역의 최고급 스파클링',
    tags: ['스파클링', '고급', '축하', '프랑스'],
    funFact: '샴파뉴 지역에서만 만들어진 것만 샴페인이라 부를 수 있어요',
  },
  {
    id: 'prosecco',
    name: '프로세코',
    emoji: '✨',
    description: '이탈리아의 경쾌한 스파클링, 과일향 가득',
    tags: ['스파클링', '과일향', '가벼움', '이탈리아'],
    funFact: '샴페인보다 가벼운 탄산과 과일향으로 일상에 즐기기 좋아요',
  },
];

export const WINE_WORLDCUP: Tournament = {
  id: 'wine-worldcup-v1',
  type: 'worldcup',
  category: 'wine',
  title: '최애 와인 품종 월드컵',
  subtitle: '16강',
  description: '당신이 가장 좋아하는 와인 품종은? 레드부터 화이트, 스파클링까지!',
  emoji: '🍷',
  themeColor: 'bg-purple-100',

  contestants: WINE_WORLDCUP_CONTESTANTS,
  roundSize: 16,

  status: 'active',
  createdAt: '2025-12-25',

  resultConfig: {
    showRanking: true,
    showWinRate: true,
    showSegmentComparison: true,
    shareMessage: '나의 최애 와인 품종은 {winner}! 🍷 너도 해봐!',
  },
};

// 와인 월드컵 검증 실행
export const WINE_WORLDCUP_VALIDATION = validateTournament(WINE_WORLDCUP);

export const TOURNAMENT_SAMPLE = {
  catBreed: CAT_BREED_TOURNAMENT,
  coffeeWorldcup: COFFEE_WORLDCUP,
  ramenWorldcup: RAMEN_WORLDCUP,
  valuesWorldcup: VALUES_WORLDCUP,
  idealtypeConditions: IDEALTYPE_CONDITIONS_WORLDCUP,
  mbtiWorldcup: MBTI_WORLDCUP,
  fridayNightWorldcup: FRIDAY_NIGHT_WORLDCUP,
  stressReliefWorldcup: STRESS_RELIEF_WORLDCUP,
  weekendActivityWorldcup: WEEKEND_ACTIVITY_WORLDCUP,
  travelDestinationWorldcup: TRAVEL_DESTINATION_WORLDCUP,
  wineWorldcup: WINE_WORLDCUP,
  contestants: {
    catBreed: CAT_BREED_CONTESTANTS,
    coffee: COFFEE_WORLDCUP_CONTESTANTS,
    ramen: RAMEN_WORLDCUP_CONTESTANTS,
    values: VALUES_WORLDCUP_CONTESTANTS,
    idealtypeConditions: IDEALTYPE_CONDITIONS_CONTESTANTS,
    mbti: MBTI_WORLDCUP_CONTESTANTS,
    fridayNight: FRIDAY_NIGHT_CONTESTANTS,
    stressRelief: STRESS_RELIEF_CONTESTANTS,
    weekendActivity: WEEKEND_ACTIVITY_CONTESTANTS,
    travelDestination: TRAVEL_DESTINATION_CONTESTANTS,
    wine: WINE_WORLDCUP_CONTESTANTS,
  },
  ideas: TOURNAMENT_IDEAS,
  template: TOURNAMENT_TEMPLATE,
  contestantTemplate: CONTESTANT_TEMPLATE,
  validation: {
    catBreed: CAT_BREED_VALIDATION,
    coffee: COFFEE_WORLDCUP_VALIDATION,
    ramen: RAMEN_WORLDCUP_VALIDATION,
    values: VALUES_WORLDCUP_VALIDATION,
    idealtypeConditions: IDEALTYPE_CONDITIONS_VALIDATION,
    mbti: MBTI_WORLDCUP_VALIDATION,
    fridayNight: FRIDAY_NIGHT_WORLDCUP_VALIDATION,
    stressRelief: STRESS_RELIEF_WORLDCUP_VALIDATION,
    weekendActivity: WEEKEND_ACTIVITY_WORLDCUP_VALIDATION,
    travelDestination: TRAVEL_DESTINATION_WORLDCUP_VALIDATION,
    wine: WINE_WORLDCUP_VALIDATION,
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
