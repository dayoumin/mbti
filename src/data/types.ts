// 케미 테스트 타입 정의

// Level은 constants.ts에서 정의됨
import type { Level } from './constants';
export type { Level };

export interface Answer {
  text: string;
  score: number;
}

export interface Question {
  q: string;
  dimension: string;
  a: Answer[];
}

export interface Dimension {
  name: string;
  emoji: string;
  desc: string;
}

// 자동 랭킹 생성용 메타데이터
export interface ResultMeta {
  // === 환경 적응 (1-5, 높을수록 잘 견딤) ===
  heatTolerance?: number;      // 더위 내성
  coldTolerance?: number;      // 추위 내성
  humidityTolerance?: number;  // 습도 내성 (식물용)

  // === 양육/관리 (1-5) ===
  beginnerFriendly?: number;   // 초보 친화도 (높을수록 쉬움)
  careLevel?: number;          // 관리 난이도 (높을수록 손이 많이 감)
  monthlyCoast?: 'low' | 'medium' | 'high';  // 월 유지비

  // === 공간/환경 ===
  spaceNeeded?: 'small' | 'medium' | 'large';  // 필요 공간
  noiseLevel?: 'silent' | 'low' | 'medium' | 'high';  // 소음 정도

  // === 라이프스타일 태그 ===
  suitableFor?: string[];      // ["1인가구", "가족", "노인", "아이", "직장인"]
  notSuitableFor?: string[];   // ["알레르기", "좁은공간"]

  // === 계절별 주의사항 ===
  seasonalTips?: {
    spring?: string;
    summer?: string;
    fall?: string;
    winter?: string;
  };

  // === 특수 태그 (자유롭게 확장 가능) ===
  tags?: string[];  // ["공기정화", "야행성", "저소음", "저관리"]

  // === 바이럴 콘텐츠용 ===
  funFacts?: FunFacts;
}

// 바이럴 콘텐츠용 재미있는 사실들
export interface FunFacts {
  // 알고 계셨나요? (놀라운 사실)
  didYouKnow?: string[];
  // 흔한 오해 (틀린 상식 바로잡기)
  commonMistakes?: string[];
  // 프로 팁 (양육 꿀팁)
  proTips?: string[];
  // SNS용 한 줄 (짧고 임팩트 있는)
  viralOneLiner?: string;
}

// 품종/결과 상세 정보 (세부 테스트용)
export interface BreedDetailInfo {
  // 기본 정보
  origin?: string;           // 원산지
  lifespan?: string;         // 평균 수명
  size?: string;             // 크기 (소형/중형/대형)
  weight?: string;           // 체중 범위

  // 성격/특성
  personality?: string[];    // 성격 특성 3-5개
  goodWith?: string[];       // 잘 맞는 대상 (아이, 노인, 다른 동물 등)
  notGoodWith?: string[];    // 주의 대상

  // 관리 정보
  exerciseNeeds?: 'low' | 'medium' | 'high';  // 운동 필요량
  groomingNeeds?: 'low' | 'medium' | 'high';  // 털/미용 관리
  sheddingLevel?: 'low' | 'medium' | 'high';  // 털빠짐 정도
  trainingDifficulty?: 'easy' | 'medium' | 'hard';  // 훈련 난이도

  // 건강
  healthIssues?: string[];   // 주의할 건강 문제

  // 비용 (선택)
  monthlyCost?: {
    min: number;
    max: number;
    note?: string;
  };
  initialCost?: {
    min: number;
    max: number;
    note?: string;
  };

  // 꿀팁
  tips?: string[];           // 양육 꿀팁 3-5개
}

export interface ResultLabel {
  name: string;
  emoji: string;
  desc: string;
  condition: Record<string, Level>;
  interpretation: string;
  guide: string;
  mood: string;
  color: string;
  matchPoints?: string[];
  nextTest?: string;  // 세부 테스트 연결 (예: petMatch → dogBreed)
  detailInfo?: BreedDetailInfo;  // 품종 상세 정보 (세부 테스트용)
  meta?: ResultMeta;  // 자동 랭킹 생성용 메타데이터
}

export interface SubjectData {
  title: string;
  subtitle: string;
  themeColor: string;
  icon: string;
  testType?: string;
  dimensions: Record<string, Dimension>;
  questions: Question[];
  questions_deep?: Question[];
  resultLabels: ResultLabel[];
}

export interface TestType {
  key: string;
  label: string;
  emoji: string;
  description: string;
}

export interface SubjectConfig {
  testType: string;
  icon: string;
  emoji: string;
  label: string;
  intro: string[];
  resultFormat: 'simple' | 'tabs' | 'matching';
  deepButtonText: string;
  matchPointsTitle?: string;
  tabLabels?: { interpretation: string; guide: string };
  tabActiveColor?: string;
  checkColor?: string;
  analysisButtonText?: string;
}

export type SubjectKey =
  | 'human' | 'cat' | 'dog' | 'rabbit' | 'hamster'
  | 'idealType' | 'plant' | 'petMatch' | 'coffee' | 'tea' | 'conflictStyle'
  | 'fruit' | 'alcohol' | 'bread' | 'perfume' | 'aroma'
  // petMatch 세부 테스트
  | 'dogBreed' | 'catBreed' | 'smallPet' | 'fishType' | 'birdType' | 'reptileType';

export interface ChemiData {
  [key: string]: SubjectData;
}
