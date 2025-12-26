// ============================================================================
// 여자 연예인 이상형 월드컵 - 집단지성 티어표
// ============================================================================
// 바이럴 포인트:
// 1. 세대 대결 - 20대 vs 30대 vs 40대 아이돌/배우 팬덤 충돌
// 2. 직업 대결 - 아이돌 vs 배우 선호도 논쟁
// 3. 매력 포인트 - 비주얼 vs 연기력 vs 성격 vs 분위기
// 4. 실시간 순위 변동 - 팬덤 동원력으로 재방문 유도
// ============================================================================

import type { TierTournament } from '../types';

export const CELEBRITY_FEMALE_IDEAL_TYPE: TierTournament = {
  id: 'celebrity-female-ideal-type-v1',
  type: 'tier-tournament',
  category: 'celebrity',

  title: '여자 연예인 이상형 월드컵',
  subtitle: '2025년 남심 저격 셀럽 티어표 💘',
  emoji: '⭐',

  // 32명 연예인 (20대 12명, 30대 12명, 40대 8명)
  items: [
    // === 20대 (12명) ===
    {
      id: 'jang-wonyoung',
      name: '장원영',
      emoji: '✨',
      description: '21세 | IVE | 모태 센터 럭키비키',
      tags: ['아이돌', '비주얼', '20대', '센터'],
    },
    {
      id: 'karina',
      name: '카리나',
      emoji: '🤖',
      description: '25세 | aespa | AI보다 더 AI 같은 얼굴',
      tags: ['아이돌', '비주얼', '20대', 'AI미모'],
    },
    {
      id: 'ahn-yujin',
      name: '안유진',
      emoji: '😎',
      description: '22세 | IVE | 예쁜데 잘생긴 맑은 눈의 광인',
      tags: ['아이돌', '성격', '20대', '예잘'],
    },
    {
      id: 'winter',
      name: '윈터',
      emoji: '❄️',
      description: '24세 | aespa | 음색 요정 몽환 냉미녀',
      tags: ['아이돌', '분위기', '20대', '냉미녀'],
    },
    {
      id: 'go-younjung',
      name: '고윤정',
      emoji: '🎭',
      description: '29세 | 배우 | 고전미+세련미 얼굴천재',
      tags: ['배우', '비주얼', '20대', '얼굴천재'],
    },
    {
      id: 'kim-hyeyoon',
      name: '김혜윤',
      emoji: '💕',
      description: '29세 | 배우 | 사랑스러움 그 자체 케미요정',
      tags: ['배우', '성격', '20대', '케미요정'],
    },
    {
      id: 'shin-yeeun',
      name: '신예은',
      emoji: '🌟',
      description: '27세 | 배우 | 털털한 반전매력 청춘아이콘',
      tags: ['배우', '성격', '20대', '청춘'],
    },
    {
      id: 'noh-yoonseo',
      name: '노윤서',
      emoji: '🌙',
      description: '25세 | 배우 | 신비롭고 유니크한 마스크',
      tags: ['배우', '분위기', '20대', '신비'],
    },
    {
      id: 'kim-yoojung',
      name: '김유정',
      emoji: '👸',
      description: '26세 | 배우 | 정변의 아이콘 사극여신',
      tags: ['배우', '비주얼', '20대', '사극'],
    },
    {
      id: 'jennie',
      name: '제니',
      emoji: '💎',
      description: '29세 | BLACKPINK | 인간샤넬 힙+고급',
      tags: ['아이돌', '분위기', '20대', '샤넬'],
    },
    {
      id: 'rose',
      name: '로제',
      emoji: '🌹',
      description: '28세 | BLACKPINK | 독보적 음색 금발슬렌더',
      tags: ['아이돌', '분위기', '20대', 'APT'],
    },
    {
      id: 'hanni',
      name: '하니',
      emoji: '🐰',
      description: '21세 | NewJeans | 청량 무해 팜하니',
      tags: ['아이돌', '분위기', '20대', '청량'],
    },

    // === 30대 (12명) ===
    {
      id: 'kim-jiwon',
      name: '김지원',
      emoji: '👑',
      description: '33세 | 배우 | 딕션요정 우아+귀여움',
      tags: ['배우', '분위기', '30대', '눈물의여왕'],
    },
    {
      id: 'iu',
      name: '아이유',
      emoji: '🎤',
      description: '32세 | 가수/배우 | 올라운더 국민여동생',
      tags: ['아이돌', '배우', '성격', '30대', '올라운더'],
    },
    {
      id: 'han-sohee',
      name: '한소희',
      emoji: '🖤',
      description: '31세 | 배우 | 치명적 고혹 퇴폐미',
      tags: ['배우', '분위기', '30대', '퇴폐미'],
    },
    {
      id: 'suzy',
      name: '수지',
      emoji: '💙',
      description: '31세 | miss A | 국민첫사랑에서 믿보배우로',
      tags: ['아이돌', '배우', '비주얼', '30대', '첫사랑'],
    },
    {
      id: 'yoona',
      name: '윤아',
      emoji: '🦌',
      description: '35세 | 소녀시대 | 사슴눈망울 변치않는센터',
      tags: ['아이돌', '배우', '비주얼', '30대', '센터'],
    },
    {
      id: 'park-eunbin',
      name: '박은빈',
      emoji: '🌸',
      description: '33세 | 배우 | 단단한 내면 맑은눈빛',
      tags: ['배우', '성격', '30대', '신뢰감'],
    },
    {
      id: 'kim-taeri',
      name: '김태리',
      emoji: '🎬',
      description: '35세 | 배우 | 대체불가 아우라 천재연기',
      tags: ['배우', '분위기', '30대', '아우라'],
    },
    {
      id: 'ahn-eunjin',
      name: '안은진',
      emoji: '💗',
      description: '34세 | 배우 | 사랑스러움+애절함 연기폭',
      tags: ['배우', '성격', '30대', '연기폭'],
    },
    {
      id: 'shin-hyesun',
      name: '신혜선',
      emoji: '😄',
      description: '36세 | 배우 | 딕션깡패 코믹+정극',
      tags: ['배우', '성격', '30대', '끼'],
    },
    {
      id: 'cheon-woohee',
      name: '천우희',
      emoji: '🎭',
      description: '38세 | 배우 | 스크린장악 천의얼굴',
      tags: ['배우', '분위기', '30대', '몰입감'],
    },
    {
      id: 'lim-jiyeon',
      name: '임지연',
      emoji: '😈',
      description: '35세 | 배우 | 악역도 사랑받는 매력연기',
      tags: ['배우', '성격', '30대', '악역'],
    },
    {
      id: 'park-shinhye',
      name: '박신혜',
      emoji: '👁️',
      description: '35세 | 배우 | 큰눈망울 멜로의정석',
      tags: ['배우', '비주얼', '30대', '멜로'],
    },

    // === 40대 이상 (8명) ===
    {
      id: 'song-hyekyo',
      name: '송혜교',
      emoji: '✨',
      description: '44세 | 배우 | 세월역행 우아함의대명사',
      tags: ['배우', '비주얼', '40대', '우아함'],
    },
    {
      id: 'son-yejin',
      name: '손예진',
      emoji: '💐',
      description: '43세 | 배우 | 멜로여왕 청순함의교과서',
      tags: ['배우', '분위기', '40대', '멜로'],
    },
    {
      id: 'jun-jihyun',
      name: '전지현',
      emoji: '💫',
      description: '44세 | 배우 | 독보적아우라 스타일아이콘',
      tags: ['배우', '피지컬', '40대', '아우라'],
    },
    {
      id: 'han-jimin',
      name: '한지민',
      emoji: '😇',
      description: '43세 | 배우 | 천사마음씨 요정동안',
      tags: ['배우', '성격', '40대', '동안'],
    },
    {
      id: 'seo-hyunjin',
      name: '서현진',
      emoji: '🎤',
      description: '40세 | 배우 | 딕션장인 공감생활연기',
      tags: ['배우', '성격', '40대', '딕션'],
    },
    {
      id: 'kim-heesun',
      name: '김희선',
      emoji: '👸',
      description: '48세 | 배우 | 원조미녀 솔직한매력',
      tags: ['배우', '비주얼', '40대', '원조'],
    },
    {
      id: 'gong-hyojin',
      name: '공효진',
      emoji: '👗',
      description: '45세 | 배우 | 공블리 스타일리시로코퀸',
      tags: ['배우', '분위기', '40대', '공블리'],
    },
    {
      id: 'jung-yumi',
      name: '정유미',
      emoji: '🥰',
      description: '42세 | 배우 | 윰블리 맑고투명한러블리',
      tags: ['배우', '성격', '40대', '윰블리'],
    },
  ],

  // 커스텀 티어 라벨 (이상형 월드컵 맞춤)
  tierLabels: {
    'S': '결혼각 이상형 💍',
    'A': '설렘 보장 💘',
    'B': '호감 있음 😊',
    'C': '배우로만 볼게 🎬',
    'D': '별로 안 꽂힘 😐',
    'F': '이상형 아님 🚫',
  },

  // 바이럴 훅
  viralHooks: {
    debateTopics: [
      '아이돌 vs 배우, 진짜 이상형은?',
      '20대 vs 30대 vs 40대 세대 대결',
      '비주얼 vs 연기력 vs 성격 우선순위',
      '카리나 vs 장원영, 4세대 비주얼 끝판왕은?',
      '한소희 퇴폐미 vs 김지원 우아함',
      '로제 APT vs 제니 샤넬',
      '송혜교 우아함 vs 전지현 아우라',
      '아이유 올라운더 vs 윤아 센터미모',
      '고윤정이 S티어?',
      '공효진 공블리 vs 정유미 윰블리',
    ],
    fandoms: [
      '장원영팬', '카리나팬', 'IVE팬', 'aespa팬',
      '고윤정팬', '김혜윤팬', 'BLACKPINK팬', '아이유팬',
      '한소희팬', '김지원팬', '송혜교팬', '전지현팬',
    ],
  },

  tags: ['연예인', '이상형', '여자', '티어', '월드컵', '셀럽', '배우', '아이돌'],

  meta: {
    ageRating: 'all',
    targetGender: ['male'],  // 남성 타겟
    createdBy: 'ai',
    createdAt: '2025-12-26',
    priority: 90,  // 높은 우선순위
    timeSensitivity: {
      sensitivity: 'medium',  // 트렌드 기반 (인기 변동)
      sourceYear: 2025,
      validUntil: '2028-12',  // 3년 유효
    },
  },
};

// 추가 토너먼트 (세대별, 직업별)
export const CELEBRITY_FEMALE_20S: TierTournament = {
  id: 'celebrity-female-20s-tier',
  type: 'tier-tournament',
  category: 'celebrity',

  title: '20대 여자 연예인 티어표',
  subtitle: '지금 뜨는 핫한 신예들 🔥',
  emoji: '🌟',

  items: [
    { id: 'jang-wonyoung', name: '장원영', emoji: '✨', tags: ['아이돌'] },
    { id: 'karina', name: '카리나', emoji: '🤖', tags: ['아이돌'] },
    { id: 'ahn-yujin', name: '안유진', emoji: '😎', tags: ['아이돌'] },
    { id: 'winter', name: '윈터', emoji: '❄️', tags: ['아이돌'] },
    { id: 'go-younjung', name: '고윤정', emoji: '🎭', tags: ['배우'] },
    { id: 'kim-hyeyoon', name: '김혜윤', emoji: '💕', tags: ['배우'] },
    { id: 'shin-yeeun', name: '신예은', emoji: '🌟', tags: ['배우'] },
    { id: 'noh-yoonseo', name: '노윤서', emoji: '🌙', tags: ['배우'] },
    { id: 'kim-yoojung', name: '김유정', emoji: '👸', tags: ['배우'] },
    { id: 'jennie', name: '제니', emoji: '💎', tags: ['아이돌'] },
    { id: 'rose', name: '로제', emoji: '🌹', tags: ['아이돌'] },
    { id: 'hanni', name: '하니', emoji: '🐰', tags: ['아이돌'] },
  ],

  tierLabels: {
    'S': '20대 끝판왕',
    'A': '미래 보장',
    'B': '주목해볼 만',
    'C': '성장 필요',
    'D': '연기 더 배워',
    'F': '아직 멀었',
  },

  viralHooks: {
    debateTopics: [
      '카리나 vs 장원영, 20대 비주얼 1위',
      '고윤정 얼굴천재 vs 김혜윤 케미요정',
      '로제 APT vs 제니 샤넬',
    ],
  },

  tags: ['20대', '신예', '배우', '아이돌'],

  meta: {
    ageRating: 'all',
    targetGender: ['male'],
    targetAges: ['10s', '20s'],
    createdBy: 'ai',
    createdAt: '2025-12-26',
  },
};

export const CELEBRITY_FEMALE_ACTOR_VS_IDOL: TierTournament = {
  id: 'celebrity-female-actor-vs-idol',
  type: 'tier-tournament',
  category: 'celebrity',

  title: '배우 vs 아이돌 이상형 대결',
  subtitle: '연기력 vs 비주얼, 당신의 선택은? 🎭🎤',
  emoji: '⚡',

  items: [
    // 배우 (16명)
    { id: 'go-younjung', name: '고윤정', emoji: '🎭', tags: ['배우'] },
    { id: 'kim-hyeyoon', name: '김혜윤', emoji: '💕', tags: ['배우'] },
    { id: 'shin-yeeun', name: '신예은', emoji: '🌟', tags: ['배우'] },
    { id: 'noh-yoonseo', name: '노윤서', emoji: '🌙', tags: ['배우'] },
    { id: 'kim-yoojung', name: '김유정', emoji: '👸', tags: ['배우'] },
    { id: 'kim-jiwon', name: '김지원', emoji: '👑', tags: ['배우'] },
    { id: 'han-sohee', name: '한소희', emoji: '🖤', tags: ['배우'] },
    { id: 'park-eunbin', name: '박은빈', emoji: '🌸', tags: ['배우'] },
    { id: 'kim-taeri', name: '김태리', emoji: '🎬', tags: ['배우'] },
    { id: 'song-hyekyo', name: '송혜교', emoji: '✨', tags: ['배우'] },
    { id: 'son-yejin', name: '손예진', emoji: '💐', tags: ['배우'] },
    { id: 'jun-jihyun', name: '전지현', emoji: '💫', tags: ['배우'] },
    { id: 'han-jimin', name: '한지민', emoji: '😇', tags: ['배우'] },
    { id: 'gong-hyojin', name: '공효진', emoji: '👗', tags: ['배우'] },
    { id: 'shin-hyesun', name: '신혜선', emoji: '😄', tags: ['배우'] },
    { id: 'park-shinhye', name: '박신혜', emoji: '👁️', tags: ['배우'] },

    // 아이돌 (4명)
    { id: 'jang-wonyoung', name: '장원영', emoji: '✨', tags: ['아이돌'] },
    { id: 'karina', name: '카리나', emoji: '🤖', tags: ['아이돌'] },
    { id: 'jennie', name: '제니', emoji: '💎', tags: ['아이돌'] },
    { id: 'rose', name: '로제', emoji: '🌹', tags: ['아이돌'] },
  ],

  tierLabels: {
    'S': '직업 무관 완벽',
    'A': '이상형 맞음',
    'B': '매력 있음',
    'C': '그냥 그래',
    'D': '별로',
    'F': '취향 아님',
  },

  viralHooks: {
    debateTopics: [
      '배우 vs 아이돌, 진짜 이상형은?',
      '연기력 vs 비주얼 우선순위',
      '아이돌 출신 배우는 어디에?',
    ],
  },

  tags: ['배우', '아이돌', 'VS', '이상형'],

  meta: {
    ageRating: 'all',
    targetGender: ['male'],
    createdBy: 'ai',
    createdAt: '2025-12-26',
  },
};

// 전체 export
export const CELEBRITY_FEMALE_TIER_TOURNAMENTS: TierTournament[] = [
  CELEBRITY_FEMALE_IDEAL_TYPE,
  CELEBRITY_FEMALE_20S,
  CELEBRITY_FEMALE_ACTOR_VS_IDOL,
];
