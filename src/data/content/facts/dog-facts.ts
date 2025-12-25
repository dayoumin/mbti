// ============================================================================
// 강아지 팩트 데이터 (수의학적 근거)
// ============================================================================

export interface DogFact {
  id: string;
  topic: string;
  statement: string;
  source: string;
  verifiedDate: string;
  reliability: 'high' | 'medium' | 'low';
  references?: string[];
}

export const DOG_FACTS: DogFact[] = [
  // 기본 행동/건강
  {
    id: 'dog-fact-001',
    topic: '강아지 포도 독성',
    statement: '포도와 건포도는 강아지에게 급성 신부전을 일으킬 수 있음. 소량도 매우 위험.',
    source: 'ASPCA Animal Poison Control Center',
    verifiedDate: '2025-12-25',
    reliability: 'high',
    references: ['https://www.aspca.org/pet-care/animal-poison-control'],
  },
  {
    id: 'dog-fact-002',
    topic: '꼬리 흔들기 의미',
    statement: '꼬리 흔들기는 감정의 "각성"을 나타냄. 높이, 속도, 방향에 따라 기쁨, 불안, 경계 등 다양한 의미.',
    source: 'Current Biology (2013)',
    verifiedDate: '2025-12-25',
    reliability: 'high',
    references: ['doi:10.1016/j.cub.2013.09.027'],
  },
  {
    id: 'dog-fact-003',
    topic: '성견 산책 권장 시간',
    statement: '소형견 30분-1시간, 대형견/활동적인 견종은 1-2시간 이상 권장. 견종별 특성 고려.',
    source: 'AKC Canine Exercise Guidelines',
    verifiedDate: '2025-12-25',
    reliability: 'high',
  },
  {
    id: 'dog-fact-004',
    topic: '강아지 정상 호흡수',
    statement: '휴식 시 분당 15-30회가 정상. 40회 이상이면 스트레스, 더위, 또는 건강 문제 가능성.',
    source: 'Merck Veterinary Manual',
    verifiedDate: '2025-12-25',
    reliability: 'high',
  },
  {
    id: 'dog-fact-005',
    topic: '강아지 양치질 빈도',
    statement: '매일 또는 최소 주 3회 양치질 권장. 치석은 3일 만에 굳어버림.',
    source: 'AVDC (American Veterinary Dental College)',
    verifiedDate: '2025-12-25',
    reliability: 'high',
  },

  // 중성화 관련 팩트
  {
    id: 'dog-fact-006',
    topic: '중성화 적정 시기',
    statement: '소형견 6-9개월, 대형견 12-18개월 권장. 대형견은 골격 성장 완료 후 수술 시 관절 질환(고관절 이형성증) 예방 효과.',
    source: 'AAHA Canine Life Stage Guidelines (2019)',
    verifiedDate: '2025-12-25',
    reliability: 'high',
    references: [
      'https://www.akc.org/expert-advice/vets-corner/neutering-spaying-right-age-dog/',
      'https://www.frontiersin.org/journals/veterinary-science/articles/10.3389/fvets.2020.00388/full'
    ],
  },
  {
    id: 'dog-fact-007',
    topic: '중성화 수술 전 금식 시간',
    statement: '전통적 가이드라인: 8-12시간 금식. 최신 연구(AAHA 2023)는 4-6시간도 안전하다고 제시. 물은 수술 직전까지 허용.',
    source: 'AAHA Anesthesia Guidelines (2023)',
    verifiedDate: '2025-12-25',
    reliability: 'high',
    references: [
      'https://www.aspca.org/aspca-spay-neuter-alliance/before-surgery-instructions'
    ],
  },
  {
    id: 'dog-fact-008',
    topic: '중성화 수술 후 회복 기간',
    statement: '10-14일이 기본 회복 기간. 수컷은 2-3일로 빠르게 회복(음낭 절개), 암컷은 10-14일 필요(복부 절개).',
    source: 'AKC Veterinary Corner',
    verifiedDate: '2025-12-25',
    reliability: 'high',
    references: [
      'https://www.akc.org/expert-advice/health/post-surgical-care-following-spay-neuter/',
      'https://www.petmd.com/dog/general-health/dog-neuter-recovery'
    ],
  },
  {
    id: 'dog-fact-009',
    topic: '넥카라 착용 기간',
    statement: '10-14일 착용 권장. 상처를 핥거나 긁으면 감염이나 봉합 파열 위험.',
    source: 'Veterinary Surgery: Small Animal (Tobias & Johnston)',
    verifiedDate: '2025-12-25',
    reliability: 'high',
  },
  {
    id: 'dog-fact-010',
    topic: '중성화 후 행동 변화',
    statement: '배회, 마운팅, 마킹 같은 호르몬 관련 행동은 확실히 감소. 공격성은 호르몬+학습 복합 요인으로 개체차 큼.',
    source: 'Frontiers in Veterinary Science (2024)',
    verifiedDate: '2025-12-25',
    reliability: 'high',
    references: [
      'https://pmc.ncbi.nlm.nih.gov/articles/PMC11350830/'
    ],
  },
  {
    id: 'dog-fact-011',
    topic: '중성화 후 체중 관리',
    statement: '중성화 후 대사율 감소로 비만 위험 증가. 칼로리 20-30% 감량 또는 중성화 전용 사료 권장.',
    source: 'Journal of Veterinary Internal Medicine',
    verifiedDate: '2025-12-25',
    reliability: 'high',
  },
  {
    id: 'dog-fact-012',
    topic: '중성화의 암 예방 효과',
    statement: '암컷: 유선종양 예방(첫 발정 전 중성화 시 효과 극대화). 수컷: 고환암/전립선 질환 예방.',
    source: 'AVMA (American Veterinary Medical Association)',
    verifiedDate: '2025-12-25',
    reliability: 'high',
    references: [
      'https://pmc.ncbi.nlm.nih.gov/articles/PMC11987765/'
    ],
  },
];

export default DOG_FACTS;
