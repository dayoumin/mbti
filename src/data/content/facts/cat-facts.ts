// ============================================================================
// 고양이 팩트 데이터 (수의학적 근거)
// ============================================================================

export interface CatFact {
  id: string;
  topic: string;
  statement: string;
  source: string;
  verifiedDate: string;
  reliability: 'high' | 'medium' | 'low';
  references?: string[];
}

export const CAT_FACTS: CatFact[] = [
  // 기본 행동
  {
    id: 'cat-fact-001',
    topic: '꼬리 세우기 행동',
    statement: '꼬리를 수직으로 세우는 것은 고양이의 긍정적 감정 표현. 반가움과 친근함의 신호.',
    source: 'Journal of Feline Behavior (2019)',
    verifiedDate: '2025-12-25',
    reliability: 'high',
  },
  {
    id: 'cat-fact-002',
    topic: '고양이 독성 식품',
    statement: '양파, 대파, 쪽파 등 파류는 고양이 적혈구를 파괴(헤모글로빈 산화)하여 빈혈 유발. 소량도 위험.',
    source: 'ASPCA Animal Poison Control Center',
    verifiedDate: '2025-12-25',
    reliability: 'high',
    references: ['https://www.aspca.org/pet-care/animal-poison-control'],
  },
  {
    id: 'cat-fact-003',
    topic: '골골송(Purring) 기능',
    statement: '골골송은 다목적 신호: 기분 좋을 때, 아플 때 자가 치유(25-150Hz 진동), 새끼가 엄마에게 소통. 공격/경고 시에는 하지 않음.',
    source: 'Current Biology (2015)',
    verifiedDate: '2025-12-25',
    reliability: 'high',
  },
  {
    id: 'cat-fact-004',
    topic: '고양이 수분 섭취량',
    statement: '성묘 기준 체중 1kg당 40-60ml 권장. 4kg 고양이는 160-240ml/일. 습식 사료 시 섭취량 감소 정상.',
    source: 'AAFP Feline Hydration Guidelines',
    verifiedDate: '2025-12-25',
    reliability: 'high',
  },
  {
    id: 'cat-fact-005',
    topic: '화장실 N+1 법칙',
    statement: '고양이 수 + 1개 화장실 권장. 영역 스트레스 감소 및 배변 사고 예방에 효과적.',
    source: 'International Cat Care',
    verifiedDate: '2025-12-25',
    reliability: 'high',
  },
  {
    id: 'cat-fact-006',
    topic: '슬로우 블링크',
    statement: '천천히 눈을 깜빡이는 행동은 고양이의 애정 표현. "고양이 키스"라고도 함.',
    source: 'Scientific Reports (2020)',
    verifiedDate: '2025-12-25',
    reliability: 'high',
    references: ['doi:10.1038/s41598-020-73426-0'],
  },
  {
    id: 'cat-fact-007',
    topic: '배 보여주기 행동',
    statement: '배는 고양이의 가장 취약한 부위. 배를 보여주는 것은 신뢰 표현이지만, 만지는 것은 별개 문제.',
    source: 'Journal of Feline Medicine and Surgery (2017)',
    verifiedDate: '2025-12-25',
    reliability: 'high',
  },
  {
    id: 'cat-fact-008',
    topic: '고양이 정상 체온',
    statement: '고양이 정상 체온: 37.5-39.2°C (사람보다 높음). 39.5°C 이상은 발열.',
    source: 'Merck Veterinary Manual',
    verifiedDate: '2025-12-25',
    reliability: 'high',
  },
  {
    id: 'cat-fact-009',
    topic: '캣닢 반응 유전',
    statement: '캣닢(캣닙) 반응은 유전적. 약 50-70% 고양이만 반응. 새끼 고양이(3개월 미만)는 반응 안 함.',
    source: 'BMC Veterinary Research (2017)',
    verifiedDate: '2025-12-25',
    reliability: 'high',
  },
  {
    id: 'cat-fact-010',
    topic: '고양이 3종 백신',
    statement: '3종 백신: 범백혈구감소증(Panleukopenia), 허피스바이러스(Herpesvirus), 칼리시바이러스(Calicivirus). 광견병은 별도 접종.',
    source: 'AAFP Feline Vaccination Guidelines',
    verifiedDate: '2025-12-25',
    reliability: 'high',
  },
  {
    id: 'cat-fact-011',
    topic: '머리 비비기(Bunting)',
    statement: '고양이 얼굴에는 페로몬 분비샘 있음. 머리 비비기는 영역 표시 + 친밀감 표현.',
    source: 'Journal of Chemical Ecology (2018)',
    verifiedDate: '2025-12-25',
    reliability: 'high',
  },
  {
    id: 'cat-fact-012',
    topic: '중성화 적정 시기',
    statement: '생후 4-6개월 권장(AAFP). 첫 발정 전 중성화 시 유선종양 예방 효과 극대화.',
    source: 'AAFP Feline Spay/Neuter Guidelines',
    verifiedDate: '2025-12-25',
    reliability: 'high',
  },

  // 중성화 관련 팩트
  {
    id: 'cat-fact-013',
    topic: '중성화 수술 전 금식 시간',
    statement: '최신 가이드라인(AAFP/AAHA 2023)은 성묘 4-6시간 금식 권장. 과거 12시간 금식은 저혈당 위험. 물은 제한 없음.',
    source: 'AAFP/AAHA Anesthesia Guidelines (2023)',
    verifiedDate: '2025-12-25',
    reliability: 'high',
    references: [
      'https://catvets.com/guidelines/practice-guidelines/anesthesia-guidelines',
      'https://www.aaha.org/anesthesia-guidelines'
    ],
  },
  {
    id: 'cat-fact-014',
    topic: '중성화 수술 후 회복 기간',
    statement: '암컷 10-14일(복부 절개), 수컷 2-3일(음낭 절개). 성별에 따라 침습도 차이.',
    source: 'AAFP Feline Spay/Neuter Guidelines',
    verifiedDate: '2025-12-25',
    reliability: 'high',
  },
  {
    id: 'cat-fact-015',
    topic: '넥카라 착용 기간',
    statement: '10-14일 착용 필수. 핥는 행동이 가장 흔한 수술 후 합병증 원인(감염/봉합 파열).',
    source: 'Veterinary Surgery: Small Animal (Tobias & Johnston)',
    verifiedDate: '2025-12-25',
    reliability: 'high',
  },
  {
    id: 'cat-fact-016',
    topic: '중성화 후 행동 변화',
    statement: '스프레이 90% 감소, 공격성/영역 행동 감소. 유전적 성격(활발함/소심함)은 불변.',
    source: 'Journal of Feline Medicine and Surgery (2018)',
    verifiedDate: '2025-12-25',
    reliability: 'high',
    references: [
      'doi:10.1177/1098612X18774176'
    ],
  },
  {
    id: 'cat-fact-017',
    topic: '중성화 후 체중 관리',
    statement: '대사율 25-30% 감소, 활동량 30% 감소로 비만 위험 증가. 칼로리 조절 필수.',
    source: 'Journal of Veterinary Internal Medicine (2020)',
    verifiedDate: '2025-12-25',
    reliability: 'high',
    references: [
      'doi:10.1111/jvim.15744'
    ],
  },
];

export default CAT_FACTS;
