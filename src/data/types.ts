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
  | 'fruit' | 'alcohol' | 'bread'
  // petMatch 세부 테스트
  | 'dogBreed' | 'catBreed' | 'smallPet' | 'fishType' | 'birdType' | 'reptileType';

export interface ChemiData {
  [key: string]: SubjectData;
}
