/**
 * DemographicService - 사용자 인구통계 데이터 관리
 *
 * 보너스 질문을 통해 연령대/성별 등을 수집하고,
 * 맞춤 콘텐츠 및 비교 인사이트 제공에 활용
 */

import { getDeviceId } from '@/utils/device';

// ========== 타입 정의 ==========

export type AgeGroup = '10s' | '20s' | '30s' | '40s+';
export type Gender = 'male' | 'female' | 'other';

export interface DemographicData {
  ageGroup?: AgeGroup;
  gender?: Gender;
  collectedAt?: string;
  source?: 'bonus_question' | 'profile' | 'inferred';
}

// 연령대 라벨
export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  '10s': '10대',
  '20s': '20대',
  '30s': '30대',
  '40s+': '40대+',
};

// 성별 라벨
export const GENDER_LABELS: Record<Gender, string> = {
  'male': '남성',
  'female': '여성',
  'other': '응답하지 않음',
};

// ========== 시드 데이터 (초기 통계용) ==========
// 테스트 타입별, 연령대별, 성별별 결과 분포 (%)
// 실제 통계가 쌓이면 이 데이터 대신 서버 데이터 사용

interface SeedDistribution {
  [resultName: string]: number; // 해당 결과가 나올 확률 %
}

interface GenderDistribution {
  male?: SeedDistribution;
  female?: SeedDistribution;
  other?: SeedDistribution;
}

interface AgeDistribution {
  '10s': GenderDistribution;
  '20s': GenderDistribution;
  '30s': GenderDistribution;
  '40s+': GenderDistribution;
}

// 결과명을 슬러그(ID)로 변환 - 표시명 변경에도 안정적
function toResultSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w가-힣-]/g, '') // 특수문자/이모지 제거
    .replace(/-+/g, '-') // 연속 하이픈 제거
    .replace(/^-|-$/g, ''); // 앞뒤 하이픈 제거
}

// 테스트별 시드 데이터 (슬러그 기반 키 사용)
// 키는 toResultSlug()로 변환된 값과 매칭됨
// 실제 resultLabels.name 값 기준으로 작성
const SEED_DATA: Partial<Record<string, Partial<AgeDistribution>>> = {
  human: {
    '10s': {
      male: { '에너자이저': 28, '모험가': 25, '엔터테이너': 22 },
      female: { '힐러': 30, '예술가': 25, '몽상가': 20 },
    },
    '20s': {
      male: { '전략가': 28, '리더': 22, '분석가': 25 },
      female: { '힐러': 26, '예술가': 24, '중재자': 22 },
    },
    '30s': {
      male: { '전략가': 32, '수호자': 25, '실행가': 20 },
      female: { '힐러': 28, '조력자': 26, '중재자': 22 },
    },
    '40s+': {
      male: { '수호자': 30, '현실주의자': 28, '철학자': 18 },
      female: { '조력자': 30, '힐러': 25, '균형잡힌-사람': 22 },
    },
  },
  cat: {
    '10s': {
      male: { '탐험-냥이': 28, '엉뚱-냥이': 25 },
      female: { '애교-냥이': 32, '천사-냥이': 26 },
    },
    '20s': {
      male: { '도도-냥이': 28, '보스-냥이': 24, '철학-냥이': 20 },
      female: { '애교-냥이': 30, '천사-냥이': 25, '인싸-냥이': 22 },
    },
    '30s': {
      male: { '철학-냥이': 30, '도도-냥이': 25 },
      female: { '균형-냥이': 28, '천사-냥이': 25 },
    },
  },
  dog: {
    '10s': {
      male: { '에너자이저-멍멍이': 32, '파티-멍멍이': 28 },
      female: { '집사바라기-멍멍이': 30, '에너자이저-멍멍이': 25 },
    },
    '20s': {
      male: { '에너자이저-멍멍이': 28, '리더-멍멍이': 24, '수호자-멍멍이': 22 },
      female: { '집사바라기-멍멍이': 30, '천재-멍멍이': 22, '균형-멍멍이': 20 },
    },
    '30s': {
      male: { '수호자-멍멍이': 30, '리더-멍멍이': 25 },
      female: { '균형-멍멍이': 28, '집사바라기-멍멍이': 25 },
    },
  },
  coffee: {
    '10s': {
      male: { '달콤한-바닐라-라떼': 35, '부드러운-카페라떼': 30 },
      female: { '달콤한-바닐라-라떼': 38, '부드러운-카페라떼': 28 },
    },
    '20s': {
      male: { '클래식-아메리카노': 35, '진한-에스프레소': 25, '아이스-콜드브루': 22 },
      female: { '부드러운-카페라떼': 30, '달콤한-바닐라-라떼': 25, '클래식-아메리카노': 22 },
    },
    '30s': {
      male: { '클래식-아메리카노': 40, '아이스-콜드브루': 25 },
      female: { '클래식-아메리카노': 30, '부드러운-카페라떼': 28 },
    },
    '40s+': {
      male: { '클래식-아메리카노': 42, '진한-에스프레소': 28 },
      female: { '클래식-아메리카노': 32, '부드러운-카페라떼': 30 },
    },
  },
  idealType: {
    '10s': {
      male: { '열정적인-로맨티스트': 30, '다정다감-연인': 25 },
      female: { '다정다감-연인': 32, '열정적인-로맨티스트': 28 },
    },
    '20s': {
      male: { '열정적인-로맨티스트': 28, '든든한-버팀목': 24 },
      female: { '다정다감-연인': 30, '든든한-버팀목': 26 },
    },
    '30s': {
      male: { '든든한-버팀목': 32, '다정다감-연인': 25 },
      female: { '든든한-버팀목': 35, '다정다감-연인': 28 },
    },
  },
};

// ========== localStorage 키 ==========

const DEMOGRAPHIC_KEY = 'chemi_demographic';

// ========== DemographicService Class ==========

class DemographicServiceClass {
  // 사용자 인구통계 저장
  saveDemographic(data: Partial<DemographicData>): void {
    const existing = this.getDemographic();
    const updated: DemographicData = {
      ...existing,
      ...data,
      collectedAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(DEMOGRAPHIC_KEY, JSON.stringify(updated));
      } catch (e) {
        // Safari 프라이빗 모드 또는 스토리지 Quota 초과 시 무시
        console.warn('Failed to save demographic data:', e);
      }
    }
  }

  // 사용자 인구통계 조회
  getDemographic(): DemographicData | null {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(DEMOGRAPHIC_KEY);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch {
      // localStorage 접근 실패 또는 JSON 파싱 실패
      return null;
    }
  }

  // 연령대 정보 있는지 확인
  hasAgeGroup(): boolean {
    const data = this.getDemographic();
    return !!data?.ageGroup;
  }

  // 성별 정보 있는지 확인
  hasGender(): boolean {
    const data = this.getDemographic();
    return !!data?.gender;
  }

  // 둘 다 있는지 확인
  hasFullDemographic(): boolean {
    return this.hasAgeGroup() && this.hasGender();
  }

  // 비교 인사이트 생성 (연령대 + 성별 기반)
  getInsight(testType: string, resultName: string): string | null {
    const demographic = this.getDemographic();
    if (!demographic?.ageGroup || !demographic?.gender) return null;

    const { ageGroup, gender } = demographic;
    const ageLabel = AGE_GROUP_LABELS[ageGroup];
    const genderLabel = GENDER_LABELS[gender];

    // 시드 데이터에서 분포 확인 (슬러그 기반 매칭)
    const resultSlug = toResultSlug(resultName);
    const testSeed = SEED_DATA[testType];
    const ageSeed = testSeed?.[ageGroup];
    const genderSeed = ageSeed?.[gender];

    let percentile: number;
    let isRare = false;

    if (genderSeed && resultSlug in genderSeed) {
      // 시드 데이터가 있으면 사용 (0% 값도 처리)
      percentile = genderSeed[resultSlug];
    } else {
      // 시드 데이터 없으면 슬러그 해시 기반으로 일관된 값 생성
      percentile = this.getConsistentPercentile(testType, resultSlug, ageGroup, gender);
    }
    // 희귀 판정 기준 통일: 20% 이하면 희귀
    isRare = percentile <= 20;

    // 인사이트 메시지 생성
    // 'other' 선택 시 성별 없이 연령대만 표시
    const groupLabel = gender === 'other' ? ageLabel : `${ageLabel} ${genderLabel}`;

    if (isRare) {
      return `${groupLabel} 중 ${percentile}%만 나오는 희귀 유형! ✨`;
    } else if (percentile <= 25) {
      return `${groupLabel} 상위 ${percentile}%에 속해요!`;
    } else if (percentile <= 40) {
      return `${groupLabel}의 ${percentile}%가 같은 결과예요`;
    } else {
      return `${groupLabel}에서 인기 있는 유형! (${percentile}%)`;
    }
  }

  // 결과 이름 기반으로 일관된 퍼센트 생성 (랜덤 아님)
  private getConsistentPercentile(
    testType: string,
    resultName: string,
    ageGroup: AgeGroup,
    gender: Gender
  ): number {
    // 문자열 해시로 일관된 숫자 생성
    const str = `${testType}-${resultName}-${ageGroup}-${gender}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    // 10-50% 범위로 변환
    return Math.abs(hash % 41) + 10;
  }

  // 사용자 ID 반환
  getUserId(): string {
    return getDeviceId();
  }
}

// 싱글톤 인스턴스
export const demographicService = new DemographicServiceClass();

export default demographicService;
