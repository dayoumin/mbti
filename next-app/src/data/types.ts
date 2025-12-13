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

export type SubjectKey = 'human' | 'cat' | 'dog' | 'rabbit' | 'hamster' | 'idealType' | 'plant' | 'petMatch' | 'coffee' | 'conflictStyle';

export interface ChemiData {
  [key: string]: SubjectData;
}
