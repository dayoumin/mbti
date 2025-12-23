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

export const TOURNAMENT_SAMPLE = {
  catBreed: CAT_BREED_TOURNAMENT,
  contestants: CAT_BREED_CONTESTANTS,
  ideas: TOURNAMENT_IDEAS,
  template: TOURNAMENT_TEMPLATE,
  contestantTemplate: CONTESTANT_TEMPLATE,
  validation: CAT_BREED_VALIDATION,
  utils: {
    getRoundName,
    getNextRoundSize,
    getMatchCount,
    generateRandomMatches,
    validateTournament,
  },
};

export default TOURNAMENT_SAMPLE;
