// Subject 설정 - 새 테스트 추가시 여기에만 추가하면 됨

import { TestType, SubjectConfig, SubjectKey } from './types';

// 메인 테스트 목록 (세부 테스트 제외, 게이미피케이션 all-rounder 배지 등에 사용)
export const MAIN_TEST_KEYS: SubjectKey[] = [
  'human', 'cat', 'dog', 'rabbit', 'hamster',
  'idealType', 'plant', 'petMatch', 'coffee', 'tea',
  'conflictStyle', 'fruit', 'alcohol', 'bread', 'perfume', 'aroma'
];

// 랭킹 지원 테스트 목록
export const RANKABLE_TESTS: { key: SubjectKey; emoji: string; name: string }[] = [
  { key: 'petMatch', emoji: '🐾', name: '반려동물' },
  { key: 'plant', emoji: '🌱', name: '식물' },
  { key: 'coffee', emoji: '☕', name: '커피' },
  { key: 'idealType', emoji: '💕', name: '이상형' },
];

// 랭킹 지원 테스트 키만 (SubjectKey 배열)
export const RANKABLE_TEST_KEYS: SubjectKey[] = RANKABLE_TESTS.map(t => t.key);

// 테스트 타입 정의
export const TEST_TYPES: Record<string, TestType> = {
  personality: {
    key: 'personality',
    label: '성격 테스트',
    emoji: '🧠',
    description: '나/반려동물의 성격을 알아보는 테스트'
  },
  matching: {
    key: 'matching',
    label: '매칭 테스트',
    emoji: '💫',
    description: '나에게 맞는 것을 찾아주는 테스트'
  }
};

export const SUBJECT_CONFIG: Record<SubjectKey, SubjectConfig> = {
  human: {
    testType: "personality",
    icon: "HumanIcon",
    label: "사람",
    intro: ["나는 어떤 사람일까?", "나의 숨겨진 성격은?", "친구들이 보는 나는?"],
    resultFormat: "simple",
    deepButtonText: "내 성격"
  },
  cat: {
    testType: "personality",
    icon: "CatFace",
    label: "고양이",
    intro: ["철학 냥이?", "보스 냥이?", "인싸 냥이?"],
    resultFormat: "tabs",
    deepButtonText: "우리 냥이"
  },
  dog: {
    testType: "personality",
    icon: "DogFace",
    label: "강아지",
    intro: ["규율 멍멍이?", "파티 멍멍이?", "CEO 멍멍이?"],
    resultFormat: "tabs",
    deepButtonText: "우리 멍이"
  },
  rabbit: {
    testType: "personality",
    icon: "RabbitFace",
    label: "토끼",
    intro: ["탐험가 토끼?", "애교쟁이 토끼?", "독립적인 토끼?"],
    resultFormat: "tabs",
    deepButtonText: "우리 토끼"
  },
  hamster: {
    testType: "personality",
    icon: "HamsterFace",
    label: "햄스터",
    intro: ["쳇바퀴 마스터?", "수집왕 햄찌?", "인싸 햄찌?"],
    resultFormat: "tabs",
    deepButtonText: "우리 햄찌"
  },
  idealType: {
    testType: "matching",
    icon: "HeartIcon",
    label: "이상형",
    intro: ["나의 이상형은?", "어떤 사람이 맞을까?", "운명의 상대는?"],
    resultFormat: "matching",
    deepButtonText: "이상형",
    matchPointsTitle: "💘 이런 사람이 맞아요",
    tabLabels: { interpretation: "💡 해석", guide: "🔮 연애 팁" },
    tabActiveColor: "bg-pink-100 border-pink-400",
    checkColor: "text-pink-500",
    analysisButtonText: "💘 상세 성향 분석 보기"
  },
  plant: {
    testType: "matching",
    icon: "PlantIcon",
    label: "식물",
    intro: ["나에게 맞는 식물은?", "초보도 키울 수 있을까?", "어떤 식물과 잘 맞을까?"],
    resultFormat: "matching",
    deepButtonText: "반려식물",
    matchPointsTitle: "🌱 이런 분에게 추천해요",
    tabLabels: { interpretation: "🌿 특징", guide: "💧 관리 팁" },
    tabActiveColor: "bg-green-100 border-green-400",
    checkColor: "text-green-500",
    analysisButtonText: "🌱 상세 성향 분석 보기"
  },
  petMatch: {
    testType: "matching",
    icon: "PetMatchIcon",
    label: "반려동물",
    intro: ["어떤 동물과 잘 맞을까?", "첫 반려동물 고민 중?", "나의 라이프스타일에 맞는 친구는?"],
    resultFormat: "matching",
    deepButtonText: "반려동물",
    matchPointsTitle: "🐾 이런 분에게 추천해요",
    tabLabels: { interpretation: "📖 소개", guide: "🏠 키우기 팁" },
    tabActiveColor: "bg-amber-100 border-amber-400",
    checkColor: "text-amber-600",
    analysisButtonText: "🐾 상세 성향 분석 보기"
  },
  coffee: {
    testType: "matching",
    icon: "CoffeeIcon",
    label: "커피",
    intro: ["나에게 맞는 커피는?", "오늘 뭐 마시지?", "내 취향의 커피 찾기"],
    resultFormat: "matching",
    deepButtonText: "커피 취향",
    matchPointsTitle: "☕ 이런 분에게 추천해요",
    tabLabels: { interpretation: "📖 소개", guide: "💡 즐기는 팁" },
    tabActiveColor: "bg-amber-200 border-amber-600",
    checkColor: "text-amber-700",
    analysisButtonText: "☕ 상세 취향 분석 보기"
  },
  tea: {
    testType: "matching",
    icon: "TeaIcon",
    label: "차",
    intro: ["나에게 맞는 차는?", "녹차? 홍차? 허브티?", "내 취향의 차 찾기"],
    resultFormat: "matching",
    deepButtonText: "차 취향",
    matchPointsTitle: "🍵 이런 분에게 추천해요",
    tabLabels: { interpretation: "📖 소개", guide: "💡 즐기는 팁" },
    tabActiveColor: "bg-green-100 border-green-500",
    checkColor: "text-green-600",
    analysisButtonText: "🍵 상세 취향 분석 보기"
  },
  conflictStyle: {
    testType: "personality",
    icon: "HeartHandshake",
    label: "갈등 대처",
    intro: ["갈등 상황에서 나는?", "연인과 싸울 때 어떻게?", "나의 대처 유형은?"],
    resultFormat: "simple",
    deepButtonText: "갈등 대처"
  },
  fruit: {
    testType: "matching",
    icon: "FruitIcon",
    label: "과일",
    intro: ["나에게 맞는 과일은?", "달달한 과일? 상큼한 과일?", "내 취향의 과일 찾기"],
    resultFormat: "matching",
    deepButtonText: "과일 취향",
    matchPointsTitle: "🍎 이런 분에게 추천해요",
    tabLabels: { interpretation: "📖 소개", guide: "💡 맛있게 먹는 팁" },
    tabActiveColor: "bg-red-100 border-red-400",
    checkColor: "text-red-500",
    analysisButtonText: "🍎 상세 취향 분석 보기"
  },
  alcohol: {
    testType: "matching",
    icon: "AlcoholIcon",
    label: "술",
    intro: ["나에게 맞는 술은?", "소주? 맥주? 와인?", "내 취향의 술 찾기"],
    resultFormat: "matching",
    deepButtonText: "술 취향",
    matchPointsTitle: "🍺 이런 분에게 추천해요",
    tabLabels: { interpretation: "📖 소개", guide: "💡 즐기는 팁" },
    tabActiveColor: "bg-amber-100 border-amber-500",
    checkColor: "text-amber-600",
    analysisButtonText: "🍺 상세 취향 분석 보기"
  },
  bread: {
    testType: "matching",
    icon: "BreadIcon",
    label: "빵",
    intro: ["나에게 맞는 빵은?", "달달한 빵? 담백한 빵?", "내 취향의 빵 찾기"],
    resultFormat: "matching",
    deepButtonText: "빵 취향",
    matchPointsTitle: "🍞 이런 분에게 추천해요",
    tabLabels: { interpretation: "📖 소개", guide: "💡 맛있게 먹는 팁" },
    tabActiveColor: "bg-amber-100 border-amber-400",
    checkColor: "text-amber-600",
    analysisButtonText: "🍞 상세 취향 분석 보기"
  },
  perfume: {
    testType: "matching",
    icon: "PerfumeIcon",
    label: "향수",
    intro: ["나에게 맞는 향수는?", "어떤 향이 어울릴까?", "나만의 시그니처 향 찾기"],
    resultFormat: "matching",
    deepButtonText: "향수 취향",
    matchPointsTitle: "✨ 이런 분에게 추천해요",
    tabLabels: { interpretation: "📖 소개", guide: "💡 사용 팁" },
    tabActiveColor: "bg-purple-100 border-purple-400",
    checkColor: "text-purple-500",
    analysisButtonText: "✨ 상세 취향 분석 보기"
  },
  aroma: {
    testType: "matching",
    icon: "AromaIcon",
    label: "아로마",
    intro: ["나에게 맞는 아로마는?", "어떤 향이 힐링될까?", "나만의 테라피 오일 찾기"],
    resultFormat: "matching",
    deepButtonText: "아로마 취향",
    matchPointsTitle: "🌿 이런 분에게 추천해요",
    tabLabels: { interpretation: "📖 소개", guide: "💧 사용 팁" },
    tabActiveColor: "bg-green-100 border-green-500",
    checkColor: "text-green-600",
    analysisButtonText: "🌿 상세 취향 분석 보기"
  },
  // === petMatch 세부 테스트 ===
  dogBreed: {
    testType: "matching",
    icon: "DogFace",
    label: "강아지 품종",
    intro: ["어떤 강아지가 맞을까?", "나의 라이프스타일에 맞는 품종은?", "첫 강아지 고민 중?"],
    resultFormat: "matching",
    deepButtonText: "강아지 품종",
    matchPointsTitle: "🐕 이런 분에게 추천해요",
    tabLabels: { interpretation: "📖 소개", guide: "🏠 키우기 팁" },
    tabActiveColor: "bg-amber-100 border-amber-400",
    checkColor: "text-amber-600",
    analysisButtonText: "🐕 상세 성향 분석 보기"
  },
  catBreed: {
    testType: "matching",
    icon: "CatFace",
    label: "고양이 품종",
    intro: ["어떤 고양이가 맞을까?", "나의 라이프스타일에 맞는 품종은?", "첫 고양이 고민 중?"],
    resultFormat: "matching",
    deepButtonText: "고양이 품종",
    matchPointsTitle: "🐱 이런 분에게 추천해요",
    tabLabels: { interpretation: "📖 소개", guide: "🏠 키우기 팁" },
    tabActiveColor: "bg-slate-100 border-slate-400",
    checkColor: "text-slate-600",
    analysisButtonText: "🐱 상세 성향 분석 보기"
  },
  smallPet: {
    testType: "matching",
    icon: "HamsterFace",
    label: "소동물",
    intro: ["어떤 소동물이 맞을까?", "첫 소동물 고민 중?", "나에게 맞는 소동물은?"],
    resultFormat: "matching",
    deepButtonText: "소동물",
    matchPointsTitle: "🐹 이런 분에게 추천해요",
    tabLabels: { interpretation: "📖 소개", guide: "🏠 키우기 팁" },
    tabActiveColor: "bg-pink-100 border-pink-300",
    checkColor: "text-pink-500",
    analysisButtonText: "🐹 상세 성향 분석 보기"
  },
  fishType: {
    testType: "matching",
    icon: "FishIcon",
    label: "관상어",
    intro: ["어떤 물고기가 맞을까?", "첫 어항 고민 중?", "나에게 맞는 관상어는?"],
    resultFormat: "matching",
    deepButtonText: "관상어",
    matchPointsTitle: "🐟 이런 분에게 추천해요",
    tabLabels: { interpretation: "📖 소개", guide: "🌊 키우기 팁" },
    tabActiveColor: "bg-blue-100 border-blue-400",
    checkColor: "text-blue-500",
    analysisButtonText: "🐟 상세 성향 분석 보기"
  },
  birdType: {
    testType: "matching",
    icon: "BirdIcon",
    label: "반려조",
    intro: ["어떤 새가 맞을까?", "첫 반려조 고민 중?", "나에게 맞는 새는?"],
    resultFormat: "matching",
    deepButtonText: "반려조",
    matchPointsTitle: "🐦 이런 분에게 추천해요",
    tabLabels: { interpretation: "📖 소개", guide: "🪶 키우기 팁" },
    tabActiveColor: "bg-sky-100 border-sky-400",
    checkColor: "text-sky-500",
    analysisButtonText: "🐦 상세 성향 분석 보기"
  },
  reptileType: {
    testType: "matching",
    icon: "ReptileIcon",
    label: "파충류",
    intro: ["어떤 파충류가 맞을까?", "첫 파충류 고민 중?", "나에게 맞는 파충류는?"],
    resultFormat: "matching",
    deepButtonText: "파충류",
    matchPointsTitle: "🦎 이런 분에게 추천해요",
    tabLabels: { interpretation: "📖 소개", guide: "🌡️ 키우기 팁" },
    tabActiveColor: "bg-emerald-100 border-emerald-400",
    checkColor: "text-emerald-600",
    analysisButtonText: "🦎 상세 성향 분석 보기"
  }
};
