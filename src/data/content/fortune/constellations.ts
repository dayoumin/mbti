// ============================================================================
// 황도 12궁 별자리 데이터 (MZ 버전)
// ============================================================================

import type { ContentMeta } from '../types';

export type ElementType = 'fire' | 'earth' | 'air' | 'water';
export type ModalityType = 'cardinal' | 'fixed' | 'mutable';

export interface ConstellationData {
  id: string;
  nameKo: string;
  nameEn: string;
  emoji: string;
  dateRange: string;
  period: { start: string; end: string };
  element: ElementType;
  modality: ModalityType;
  rulingPlanet: string;
  keywords: string[];

  personality: {
    summary: string;
    growthPoint: string;
    yearKeywords: string[];  // 올해의 키워드 (연도 무관)
  };

  compatibility: {
    best: string[];
    good: string[];
    challenge: string[];
  };

  memes: {
    traits: string[];
    situations: string[];
  };

  meta?: ContentMeta;
}

/**
 * 12별자리 데이터
 * 리서치 기반: research-zodiac-constellation-request-2024-12-24.md
 */
export const CONSTELLATIONS: ConstellationData[] = [
  {
    id: 'aries',
    nameKo: '양자리',
    nameEn: 'Aries',
    emoji: '♈',
    dateRange: '3.21~4.19',
    period: { start: '03-21', end: '04-19' },
    element: 'fire',
    modality: 'cardinal',
    rulingPlanet: '화성',
    keywords: ['#직진본능', '#에너자이저', '#뒷끝없음', '#대장부'],
    personality: {
      summary: '생각보다 몸이 먼저 나가는 행동대장. 화낼 땐 불같지만 5분 뒤에 까먹는 쿨내 진동 캐릭터.',
      growthPoint: "브레이크 없는 질주는 위험해요. 가끔은 '일시정지' 버튼을 눌러보는 여유가 필요해요.",
      yearKeywords: ['#새로운도전', '#리더십폭발', '#속도조절'],
    },
    compatibility: {
      best: ['leo', 'sagittarius'],
      good: ['gemini', 'aquarius'],
      challenge: ['cancer', 'capricorn'],
    },
    memes: {
      traits: [
        '"일단 저지르고 본다" (충동력 MAX)',
        '화났다가 5분 뒤 언제 그랬냐는 듯 (분노 리셋 빠름)',
        '"내가 해볼게" 먼저 말하는 타입',
        '기다리는 거 진짜 못 참음 (배달 5분 지연에 전화함)',
        '좋아하면 티 숨기기 불가능 (얼굴에 다 씀)',
      ],
      situations: [
        '좀비 사태 때 "다 덤벼!" 하고 선봉에 섰다가 제일 먼저 희생',
        '공포 영화에서 하지 말라는 거 제일 먼저 하다가 퇴장하는 캐릭터',
      ],
    },
    meta: { minAge: '20s' },
  },
  {
    id: 'taurus',
    nameKo: '황소자리',
    nameEn: 'Taurus',
    emoji: '♉',
    dateRange: '4.20~5.20',
    period: { start: '04-20', end: '05-20' },
    element: 'earth',
    modality: 'fixed',
    rulingPlanet: '금성',
    keywords: ['#미식가', '#평화주의자', '#집순이', '#고집황소'],
    personality: {
      summary: '맛있는 거 먹고 누워있을 때가 제일 행복함. 순해 보이지만 고집 부리기 시작하면 아무도 못 말림.',
      growthPoint: '변화는 무서운 게 아니에요. 익숙한 이불 밖으로 조금만 더 나오면 새로운 행운이 기다려요.',
      yearKeywords: ['#재물안정', '#미적감각', '#유연함'],
    },
    compatibility: {
      best: ['virgo', 'capricorn'],
      good: ['cancer', 'pisces'],
      challenge: ['leo', 'aquarius'],
    },
    memes: {
      traits: [
        '주말 계획? "집" (그게 계획임)',
        '맛집 리스트가 인생 재산',
        '안 바꿈. 절대 안 바꿈. (고집 세계관 최강)',
        '느리지만 확실하게 (거북이 전략)',
        '화나면 진짜 무서움 (한계 넘으면 폭발)',
      ],
      situations: [
        '대박나면 조용히 맛집 탐방 다니면서 혼자 다 씀',
        '무인도에서 제일 먼저 먹을 거 찾아다님',
      ],
    },
    meta: { minAge: '20s' },
  },
  {
    id: 'gemini',
    nameKo: '쌍둥이자리',
    nameEn: 'Gemini',
    emoji: '♊',
    dateRange: '5.21~6.21',
    period: { start: '05-21', end: '06-21' },
    element: 'air',
    modality: 'mutable',
    rulingPlanet: '수성',
    keywords: ['#인싸력', '#투머치토커', '#호기심천국', '#이중매력'],
    personality: {
      summary: '세상 모든 가십은 내 귀로 통한다. 뇌가 2개인 것처럼 멀티태스킹 만렙이지만 금방 질려함.',
      growthPoint: '한 우물만 파는 끈기가 부족할 수 있어요. 얕고 넓은 지식도 좋지만, 하나만 깊게 파보면 어떨까요?',
      yearKeywords: ['#네트워킹', '#커뮤니케이션', '#깊이더하기'],
    },
    compatibility: {
      best: ['libra', 'aquarius'],
      good: ['aries', 'leo'],
      challenge: ['virgo', 'pisces'],
    },
    memes: {
      traits: [
        '대화하다가 갑자기 주제 5개 바뀜',
        'TMI 폭격기 (물어본 적 없는데 다 알려줌)',
        '호기심 때문에 이것저것 다 해봄 (결국 다 중도 포기)',
        '연락 읽씹하다가 갑자기 새벽에 답장',
        '분위기 메이커 (어딜 가든 말 많음)',
      ],
      situations: [
        '전 애인 SNS 염탐하다가 실수로 좋아요 누름 (호기심 때문에)',
        '조별과제 PPT 디자인만 예쁘게 하고 내용은 복붙',
      ],
    },
    meta: { minAge: '20s' },
  },
  {
    id: 'cancer',
    nameKo: '게자리',
    nameEn: 'Cancer',
    emoji: '♋',
    dateRange: '6.22~7.22',
    period: { start: '06-22', end: '07-22' },
    element: 'water',
    modality: 'cardinal',
    rulingPlanet: '달',
    keywords: ['#감성충만', '#방어기제', '#내사람챙기기', '#집이최고'],
    personality: {
      summary: '겉은 딱딱해 보여도 속은 순두부. 내 사람 건드리면 집게발 세우지만, 집에 가면 이불 킥 장인.',
      growthPoint: "타인의 감정을 내 것처럼 떠안지 마세요. 감정 쓰레기통이 되지 않도록 '마음의 벽'을 세워도 괜찮아요.",
      yearKeywords: ['#내면치유', '#공간꾸미기', '#감정독립'],
    },
    compatibility: {
      best: ['scorpio', 'pisces'],
      good: ['taurus', 'virgo'],
      challenge: ['aries', 'libra'],
    },
    memes: {
      traits: [
        '새벽 감성에 약함 (새벽 2시에 눈물 샘 폭발)',
        '내 사람 = 목숨 걸고 지킴',
        '집이 최고 (밖에 나가면 배터리 소모 2배)',
        '"괜찮아" = 전혀 안 괜찮음',
        '과거 얘기하면 눈물 흘림 (추억 저장소)',
      ],
      situations: [
        '전 애인 SNS 염탐하다가 새벽 2시에 감성 터져서 좋아요 누름',
        '친구 힘들다고 하면 같이 울어줌',
      ],
    },
    meta: { minAge: '20s' },
  },
  {
    id: 'leo',
    nameKo: '사자자리',
    nameEn: 'Leo',
    emoji: '♌',
    dateRange: '7.23~8.22',
    period: { start: '07-23', end: '08-22' },
    element: 'fire',
    modality: 'fixed',
    rulingPlanet: '태양',
    keywords: ['#주인공병', '#관종끼', '#의리파', '#자기애뿜뿜'],
    personality: {
      summary: '내가 가는 길이 곧 런웨이. 칭찬해주면 춤추지만 무시하면 지구 멸망급 분노를 표출함.',
      growthPoint: "무대에서 내려와 관객이 되어보는 연습. 남의 박수를 받기보다 남에게 박수 쳐줄 때 더 빛나요.",
      yearKeywords: ['#자존감회복', '#창의력발휘', '#겸손한왕'],
    },
    compatibility: {
      best: ['aries', 'sagittarius'],
      good: ['gemini', 'libra'],
      challenge: ['taurus', 'scorpio'],
    },
    memes: {
      traits: [
        '어딜 가든 주인공 (본인 생각)',
        '칭찬에 약함 (칭찬하면 뭐든 해줌)',
        '무시하면? 삐짐 + 분노 콤보',
        '셀카 찍으면 100장 중 1장 건짐',
        '의리 하나는 확실함',
      ],
      situations: [
        '조별 과제에서 "내가 리더니까 내가 돋보여야 함"',
        '무인도에서 가장 먼저 리더 자처함',
      ],
    },
    meta: { minAge: '20s' },
  },
  {
    id: 'virgo',
    nameKo: '처녀자리',
    nameEn: 'Virgo',
    emoji: '♍',
    dateRange: '8.23~9.22',
    period: { start: '08-23', end: '09-22' },
    element: 'earth',
    modality: 'mutable',
    rulingPlanet: '수성',
    keywords: ['#분석왕', '#잔소리꾼', '#완벽주의', '#츤데레'],
    personality: {
      summary: '남의 티끌은 기가 막히게 찾음. 잔소리는 애정의 다른 표현. 계획 틀어지면 스트레스 받지만 결국 해냄.',
      growthPoint: "완벽하지 않아도 충분히 아름다워요. 스스로에게도 남에게도 '그럴 수 있지' 주문을 외워보세요.",
      yearKeywords: ['#디테일완성', '#건강관리', '#자기허용'],
    },
    compatibility: {
      best: ['taurus', 'capricorn'],
      good: ['cancer', 'scorpio'],
      challenge: ['gemini', 'sagittarius'],
    },
    memes: {
      traits: [
        '계획표 없으면 불안함',
        '남의 오타/맞춤법 틀린 거 다 보임',
        '잔소리 = 애정 표현 (오해하지 마세요)',
        '결국 다 본인이 함 (남이 한 거 마음에 안 듦)',
        '속으로 다 분석하고 있음',
      ],
      situations: [
        '조별 과제에서 남이 한 거 마음에 안 들어서 결국 자기가 다 다시 함',
        '좀비 사태 때 분석력과 계획성으로 최적의 생존 전략 수립',
      ],
    },
    meta: { minAge: '20s' },
  },
  {
    id: 'libra',
    nameKo: '천칭자리',
    nameEn: 'Libra',
    emoji: '♎',
    dateRange: '9.23~10.22',
    period: { start: '09-23', end: '10-22' },
    element: 'air',
    modality: 'cardinal',
    rulingPlanet: '금성',
    keywords: ['#우아함', '#결정장애', '#팔랑귀', '#평화지킴이'],
    personality: {
      summary: "싸움 구경은 좋지만 내가 싸우는 건 싫어. 메뉴 고르는 데 1시간 걸리지만 센스는 타고남.",
      growthPoint: "모든 사람을 만족시킬 순 없어요. 가끔은 미움받을 용기로 'NO'라고 말하는 연습이 필요해요.",
      yearKeywords: ['#관계재정립', '#균형찾기', '#단호박'],
    },
    compatibility: {
      best: ['gemini', 'aquarius'],
      good: ['leo', 'sagittarius'],
      challenge: ['cancer', 'capricorn'],
    },
    memes: {
      traits: [
        '메뉴 고르는 데 30분 (진짜 못 고름)',
        '"뭐 먹을래?" "아무거나~" (진심 아님)',
        '싸움 중재하다가 양쪽 다한테 욕먹음',
        '예쁜 거 보면 지갑 열림',
        '결정 내리면 또 후회함',
      ],
      situations: [
        '월급날 예쁜 것, 좋은 것에 약해서 텅장됨',
        '약속 시간에 뭘 입을지 고르다가 지각',
      ],
    },
    meta: { minAge: '20s' },
  },
  {
    id: 'scorpio',
    nameKo: '전갈자리',
    nameEn: 'Scorpio',
    emoji: '♏',
    dateRange: '10.23~11.22',
    period: { start: '10-23', end: '11-22' },
    element: 'water',
    modality: 'fixed',
    rulingPlanet: '명왕성',
    keywords: ['#신비주의', '#집요함', '#복수노트', '#치명적매력'],
    personality: {
      summary: '한번 찍으면 지구 끝까지 쫓아감. 속을 알 수 없어서 더 끌리는 나쁜 남자/여자 스타일.',
      growthPoint: '의심의 안경을 벗고 믿음을 가져보세요. 마음을 열면 독침 대신 꿀이 흐르는 관계가 될 거예요.',
      yearKeywords: ['#변화와재생', '#깊은통찰', '#신뢰회복'],
    },
    compatibility: {
      best: ['cancer', 'pisces'],
      good: ['virgo', 'capricorn'],
      challenge: ['leo', 'aquarius'],
    },
    memes: {
      traits: [
        '한 번 찍으면 끝까지 간다 (복수 안 잊음)',
        '비밀 금고 (무덤까지 가져감)',
        '눈빛만으로 압도함',
        '속마음? 절대 안 보여줌',
        '집요함 끝판왕',
      ],
      situations: [
        '대박나면 이미 여권이랑 현금 가방 챙겨서 공항임',
        '좀비 아포칼립스에서 극한 상황에서 빛나는 생존 본능과 냉철한 판단력',
      ],
    },
    meta: { minAge: '20s' },
  },
  {
    id: 'sagittarius',
    nameKo: '사수자리',
    nameEn: 'Sagittarius',
    emoji: '♐',
    dateRange: '11.23~12.21',
    period: { start: '11-23', end: '12-21' },
    element: 'fire',
    modality: 'mutable',
    rulingPlanet: '목성',
    keywords: ['#자유영혼', '#욜로족', '#팩폭장인', '#역마살'],
    personality: {
      summary: '인생은 한 번뿐, 내일은 없다. 너무 솔직해서 가끔 남에게 상처 주지만 악의는 1도 없음.',
      growthPoint: '자유도 좋지만 책임감이라는 닻이 필요해요. 디테일을 챙기면 당신의 모험이 더 안전해질 거예요.',
      yearKeywords: ['#지적탐구', '#해외운', '#책임감장착'],
    },
    compatibility: {
      best: ['aries', 'leo'],
      good: ['libra', 'aquarius'],
      challenge: ['virgo', 'pisces'],
    },
    memes: {
      traits: [
        'YOLO 정신 (내일 걱정은 내일의 나에게)',
        '팩트 폭격기 (거짓말 못함, 대신 상처줌)',
        '가만히 있으면 아픔 (역마살)',
        '약속? 기분 따라 바뀜',
        '자유 없으면 못 살아',
      ],
      situations: [
        '월급날 YOLO! 경험을 위한 과감한 소비로 텅장',
        '약속 시간에 오는 길에 다른 재미 발견해서 지각',
      ],
    },
    meta: { minAge: '20s' },
  },
  {
    id: 'capricorn',
    nameKo: '염소자리',
    nameEn: 'Capricorn',
    emoji: '♑',
    dateRange: '12.22~1.19',
    period: { start: '12-22', end: '01-19' },
    element: 'earth',
    modality: 'cardinal',
    rulingPlanet: '토성',
    keywords: ['#현실주의', '#야망가', '#워커홀릭', '#노잼아님'],
    personality: {
      summary: '성공하고 싶어? 나처럼 해. 감정 표현은 서툴지만 내 사람은 물질(?)로 제대로 챙김.',
      growthPoint: '인생은 성과 그래프가 아니에요. 가끔은 목적 없는 산책이나 멍 때리기가 최고의 전략이 될 수 있어요.',
      yearKeywords: ['#커리어하이', '#기반다지기', '#워라밸'],
    },
    compatibility: {
      best: ['taurus', 'virgo'],
      good: ['scorpio', 'pisces'],
      challenge: ['aries', 'libra'],
    },
    memes: {
      traits: [
        '일 = 인생 (워커홀릭)',
        '감정 표현? 어색함',
        '성공하면 다 용서됨 (본인 생각)',
        '계획 없으면 불안함',
        '실속 챙기기 달인',
      ],
      situations: [
        '좀비 아포칼립스에서 철저한 준비성과 끈기로 어떤 상황도 견뎌냄',
        '무인도에서 냉철한 판단과 책임감으로 리더 후보',
      ],
    },
    meta: { minAge: '20s' },
  },
  {
    id: 'aquarius',
    nameKo: '물병자리',
    nameEn: 'Aquarius',
    emoji: '♒',
    dateRange: '1.20~2.18',
    period: { start: '01-20', end: '02-18' },
    element: 'air',
    modality: 'fixed',
    rulingPlanet: '천왕성',
    keywords: ['#4차원', '#괴짜천재', '#마이웨이', '#인류애'],
    personality: {
      summary: "남들이 '예' 할 때 '아니오' 외치는 뚝심. 쿨해 보이지만 은근히 외로움 탐.",
      growthPoint: '논리적으로 설명되지 않는 감정도 소중해요. 머리보다 가슴이 시키는 대로 움직여보는 건 어떨까요?',
      yearKeywords: ['#혁신적사고', '#네트워크확장', '#감정표현'],
    },
    compatibility: {
      best: ['gemini', 'libra'],
      good: ['aries', 'sagittarius'],
      challenge: ['taurus', 'scorpio'],
    },
    memes: {
      traits: [
        '4차원 세계관 (이해 못 해도 됨)',
        '남들 따라가기 싫음 (반대로 감)',
        '겉은 쿨, 속은 외로움',
        '인류애는 있는데 개인 친밀감은 어려움',
        '논리로 모든 걸 설명하려 함',
      ],
      situations: [
        '조별과제에서 아무도 생각 못한 아이디어 냄 (채택은 안 됨)',
        '트렌드 따라가기 싫어서 일부러 반대로 함',
      ],
    },
    meta: { minAge: '20s' },
  },
  {
    id: 'pisces',
    nameKo: '물고기자리',
    nameEn: 'Pisces',
    emoji: '♓',
    dateRange: '2.19~3.20',
    period: { start: '02-19', end: '03-20' },
    element: 'water',
    modality: 'mutable',
    rulingPlanet: '해왕성',
    keywords: ['#몽상가', '#유리멘탈', '#공감능력', '#예술가'],
    personality: {
      summary: '현실 도피 만렙, 상상 속에선 이미 우주 정복. 분위기에 약하고 거절을 못 해서 호구 잡히기 쉬움.',
      growthPoint: '현실 감각이라는 닻을 내리세요. 꿈꾸는 것도 좋지만, 두 발은 땅에 딛고 있어야 멀리 갈 수 있어요.',
      yearKeywords: ['#직관력상승', '#예술혼폭발', '#현실직시'],
    },
    compatibility: {
      best: ['cancer', 'scorpio'],
      good: ['taurus', 'capricorn'],
      challenge: ['gemini', 'sagittarius'],
    },
    memes: {
      traits: [
        '시간 개념이 독특함 (몽환적)',
        '거절 못함 (호구력 MAX)',
        '눈물샘 폭발 (감동받으면 울음)',
        '상상력 무한대',
        '분위기에 취함',
      ],
      situations: [
        '좀비 사태 때 상황 파악 못하고 좀비한테 "너 왜 그래?" 말 걸다가 물림',
        '약속 시간에 시간보다 분위기에 집중하다가 지각',
      ],
    },
    meta: { minAge: '20s' },
  },
];

/**
 * 별자리 궁합 매트릭스
 * ◎ 찰떡궁합 / ○ 좋음 / △ 보통 / × 도전적
 */
export const COMPATIBILITY_MATRIX: Record<string, Record<string, '◎' | '○' | '△' | '×'>> = {
  // 불 - 불: 찰떡, 불 - 공기: 좋음, 불 - 흙: 노력, 불 - 물: 도전
  aries: {
    aries: '○', taurus: '△', gemini: '○', cancer: '×',
    leo: '◎', virgo: '△', libra: '○', scorpio: '△',
    sagittarius: '◎', capricorn: '×', aquarius: '○', pisces: '△',
  },
  taurus: {
    aries: '△', taurus: '○', gemini: '△', cancer: '○',
    leo: '×', virgo: '◎', libra: '△', scorpio: '○',
    sagittarius: '△', capricorn: '◎', aquarius: '×', pisces: '○',
  },
  gemini: {
    aries: '○', taurus: '△', gemini: '○', cancer: '△',
    leo: '○', virgo: '×', libra: '◎', scorpio: '△',
    sagittarius: '○', capricorn: '△', aquarius: '◎', pisces: '×',
  },
  cancer: {
    aries: '×', taurus: '○', gemini: '△', cancer: '○',
    leo: '△', virgo: '○', libra: '×', scorpio: '◎',
    sagittarius: '△', capricorn: '○', aquarius: '△', pisces: '◎',
  },
  leo: {
    aries: '◎', taurus: '×', gemini: '○', cancer: '△',
    leo: '○', virgo: '△', libra: '○', scorpio: '×',
    sagittarius: '◎', capricorn: '△', aquarius: '△', pisces: '△',
  },
  virgo: {
    aries: '△', taurus: '◎', gemini: '×', cancer: '○',
    leo: '△', virgo: '○', libra: '△', scorpio: '○',
    sagittarius: '×', capricorn: '◎', aquarius: '△', pisces: '○',
  },
  libra: {
    aries: '○', taurus: '△', gemini: '◎', cancer: '×',
    leo: '○', virgo: '△', libra: '○', scorpio: '△',
    sagittarius: '○', capricorn: '×', aquarius: '◎', pisces: '△',
  },
  scorpio: {
    aries: '△', taurus: '○', gemini: '△', cancer: '◎',
    leo: '×', virgo: '○', libra: '△', scorpio: '○',
    sagittarius: '△', capricorn: '○', aquarius: '×', pisces: '◎',
  },
  sagittarius: {
    aries: '◎', taurus: '△', gemini: '○', cancer: '△',
    leo: '◎', virgo: '×', libra: '○', scorpio: '△',
    sagittarius: '○', capricorn: '△', aquarius: '○', pisces: '×',
  },
  capricorn: {
    aries: '×', taurus: '◎', gemini: '△', cancer: '○',
    leo: '△', virgo: '◎', libra: '×', scorpio: '○',
    sagittarius: '△', capricorn: '○', aquarius: '△', pisces: '○',
  },
  aquarius: {
    aries: '○', taurus: '×', gemini: '◎', cancer: '△',
    leo: '△', virgo: '△', libra: '◎', scorpio: '×',
    sagittarius: '○', capricorn: '△', aquarius: '○', pisces: '△',
  },
  pisces: {
    aries: '△', taurus: '○', gemini: '×', cancer: '◎',
    leo: '△', virgo: '○', libra: '△', scorpio: '◎',
    sagittarius: '×', capricorn: '○', aquarius: '△', pisces: '○',
  },
};

// ============================================================================
// 유틸리티 함수
// ============================================================================

/**
 * 별자리 ID로 데이터 조회
 */
export function getConstellationById(id: string): ConstellationData | undefined {
  return CONSTELLATIONS.find(c => c.id === id);
}

/**
 * 날짜로 별자리 찾기
 */
export function getConstellationByDate(month: number, day: number): ConstellationData | undefined {
  const dateStr = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

  for (const constellation of CONSTELLATIONS) {
    const { start, end } = constellation.period;

    // 염소자리 같이 연도를 넘어가는 경우 처리
    if (start > end) {
      if (dateStr >= start || dateStr <= end) {
        return constellation;
      }
    } else {
      if (dateStr >= start && dateStr <= end) {
        return constellation;
      }
    }
  }

  return undefined;
}

/**
 * 두 별자리 궁합 조회
 */
export function getCompatibility(sign1: string, sign2: string): '◎' | '○' | '△' | '×' | undefined {
  return COMPATIBILITY_MATRIX[sign1]?.[sign2];
}

/**
 * 궁합 설명 텍스트
 */
export function getCompatibilityDescription(level: '◎' | '○' | '△' | '×'): string {
  const descriptions = {
    '◎': '찰떡궁합! 천생연분이에요 💕',
    '○': '좋은 시너지! 함께하면 더 좋아요 ✨',
    '△': '보통이에요. 서로 이해하면 괜찮아요',
    '×': '도전적인 관계. 노력이 필요해요 💪',
  };
  return descriptions[level];
}

export default CONSTELLATIONS;
