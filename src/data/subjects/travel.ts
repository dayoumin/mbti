// travel 테스트 데이터 (여행 스타일 매칭)
// 생성일: 2025-12-25
// 리서치: research/travel.md
//
// 학술 근거:
// - Plog's Psychographic Model (1974) - Allocentric/Psychocentric
// - Cohen's Tourist Typology (1972) - Drifter/Explorer/Mass Tourist
// - Pearce & Lee Travel Career Pattern - Novelty/Escape/Relationship/Self-development
// - Iso-Ahola Push-Pull Motivation Theory

import type { SubjectData } from '../types';

export const travelData: SubjectData = {
  title: '나의 여행 스타일 찾기',
  subtitle: '나에게 맞는 여행 유형은?',
  themeColor: 'bg-sky-300',
  icon: 'TravelIcon',
  dimensions: {
    novelty: {
      name: '새로움 추구',
      emoji: '🎒',
      desc: '익숙한 것 vs 새로운 경험',
    },
    escape: {
      name: '탈출/휴식',
      emoji: '🌴',
      desc: '일상 탈출과 재충전 욕구',
    },
    culture: {
      name: '문화 탐구',
      emoji: '🏛️',
      desc: '역사/문화/현지생활 관심',
    },
    social: {
      name: '사교성',
      emoji: '🗣️',
      desc: '타인과의 교류 선호도',
    },
    structure: {
      name: '계획성',
      emoji: '📋',
      desc: '여행 일정의 구조화 정도',
    },
  },
  questions: [
    // novelty 차원 (3문항)
    {
      q: '여행지에 도착하면 가장 먼저 하고 싶은 건?',
      dimension: 'novelty',
      a: [
        { text: '가이드북에 없는 숨은 명소 탐험!', score: 5 },
        { text: '일단 유명한 곳 먼저, 그다음 탐험', score: 3 },
        { text: '검증된 인기 관광지부터 가야죠', score: 1 },
      ],
    },
    {
      q: '여행 중 예상 밖의 상황이 생기면?',
      dimension: 'novelty',
      a: [
        { text: '오히려 재밌을 것 같아! 새로운 경험이네', score: 5 },
        { text: '당황하지만 일단 해결해보려고 해요', score: 3 },
        { text: '불안하고 스트레스 받아요', score: 1 },
      ],
    },
    {
      q: '처음 가본 나라에서 길을 잃었다면?',
      dimension: 'novelty',
      a: [
        { text: '이것도 모험! 새로운 곳 발견하겠지', score: 5 },
        { text: 'GPS 보면서 천천히 찾아가요', score: 3 },
        { text: '빨리 안전한 곳으로 돌아가고 싶어요', score: 1 },
      ],
    },
    // escape 차원 (3문항)
    {
      q: '이상적인 여행 일정은?',
      dimension: 'escape',
      a: [
        { text: '느긋하게 2-3곳만 천천히', score: 5 },
        { text: '적당히 여유 있게, 너무 빡빡하지 않게', score: 3 },
        { text: '하루에 여러 곳! 많이 봐야죠', score: 1 },
      ],
    },
    {
      q: '여행 중 오후 시간이 비었다면?',
      dimension: 'escape',
      a: [
        { text: '숙소에서 낮잠이나 스파 즐기기', score: 5 },
        { text: '근처 카페에서 여유롭게 쉬기', score: 3 },
        { text: '급하게라도 관광지 하나 더!', score: 1 },
      ],
    },
    {
      q: '휴가 후 돌아왔을 때 어떤 기분이길 원해?',
      dimension: 'escape',
      a: [
        { text: '완전히 충전되고 힐링된 기분', score: 5 },
        { text: '새로운 경험으로 만족한 기분', score: 3 },
        { text: '알차게 보냈다는 보람찬 기분 (피곤해도 OK)', score: 1 },
      ],
    },
    // culture 차원 (3문항)
    {
      q: '여행지에서 박물관이나 유적지를 보면?',
      dimension: 'culture',
      a: [
        { text: '꼭 들어가서 자세히 봐야죠!', score: 5 },
        { text: '시간 있으면 들어가볼게요', score: 3 },
        { text: '밖에서 사진만 찍고 패스해요', score: 1 },
      ],
    },
    {
      q: '현지 음식을 먹을 때 선호하는 건?',
      dimension: 'culture',
      a: [
        { text: '전통 시장, 로컬 맛집에서 현지인처럼', score: 5 },
        { text: '유명한 관광지 식당도 괜찮아요', score: 3 },
        { text: '익숙한 음식, 프랜차이즈가 편해요', score: 1 },
      ],
    },
    {
      q: '여행 준비할 때 가장 많이 찾아보는 건?',
      dimension: 'culture',
      a: [
        { text: '그 나라 역사, 전통, 문화 정보', score: 5 },
        { text: '맛집과 핫플레이스', score: 3 },
        { text: '액티비티랑 놀거리', score: 1 },
      ],
    },
    // social 차원 (3문항)
    {
      q: '여행 중 다른 여행자나 현지인을 만나면?',
      dimension: 'social',
      a: [
        { text: '먼저 말 걸고 친해지려고 해요', score: 5 },
        { text: '말 걸면 즐겁게 대화는 하죠', score: 3 },
        { text: '최대한 나만의 시간을 보내고 싶어요', score: 1 },
      ],
    },
    {
      q: '단체 투어 vs 자유여행?',
      dimension: 'social',
      a: [
        { text: '단체 투어! 사람들 만나는 재미가 있죠', score: 5 },
        { text: '상황에 따라 골라서 해요', score: 3 },
        { text: '무조건 자유여행이요', score: 1 },
      ],
    },
    {
      q: '여행 사진을 SNS에 올리는 편?',
      dimension: 'social',
      a: [
        { text: '실시간으로 자주 공유해요!', score: 5 },
        { text: '가끔 괜찮은 사진만 올려요', score: 3 },
        { text: '거의 안 올리거나 여행 끝나고 나중에', score: 1 },
      ],
    },
    // structure 차원 (3문항)
    {
      q: '여행 계획은 어떻게 세우나요?',
      dimension: 'structure',
      a: [
        { text: '일정표 만들고 예약 미리미리!', score: 5 },
        { text: '대략적인 계획만, 나머지는 그때그때', score: 3 },
        { text: '비행기표만 끊고 무계획으로!', score: 1 },
      ],
    },
    {
      q: '여행 중 일정이 틀어지면?',
      dimension: 'structure',
      a: [
        { text: '스트레스받아요, 계획대로 가야 안심', score: 5 },
        { text: '좀 아쉽지만 유연하게 조정해요', score: 3 },
        { text: '오히려 좋아요, 새로운 기회!', score: 1 },
      ],
    },
    {
      q: '숙소 예약 스타일은?',
      dimension: 'structure',
      a: [
        { text: '모든 숙소 미리 예약 완료!', score: 5 },
        { text: '첫날만 예약하고 나머지는 현지에서', score: 3 },
        { text: '예약 없이 가서 찾아봐요', score: 1 },
      ],
    },
  ],
  resultLabels: [
    // 1. 백패커형 탐험가: novelty↑ structure↓
    {
      name: '백패커형 탐험가',
      emoji: '🎒',
      desc: '배낭 하나로 세계를 누비는 자유로운 영혼',
      condition: { novelty: 'high', structure: 'low' },
      mood: 'excited',
      color: 'bg-orange-200',
      interpretation:
        '계획보다 즉흥을 선호하고, 관광지보다 숨은 명소를 찾아다니는 진정한 탐험가예요. 현지인처럼 여행하며 예상치 못한 경험에서 기쁨을 느끼죠.',
      guide:
        '동남아 배낭여행, 유럽 인터레일, 남미 종단 여행을 추천해요. 호스텔에서 다른 여행자들과 정보를 나누며 루트를 만들어가세요.',
      matchPoints: [
        '즉흥적인 일정을 즐기는 분',
        '예산 여행 선호',
        '새로운 도전을 두려워하지 않는 분',
        '유연한 여행 스타일',
      ],
    },
    // 2. 힐링 휴양형: escape↑ novelty↓
    {
      name: '힐링 휴양형',
      emoji: '🌅',
      desc: '조용한 리조트에서 완벽하게 재충전하는 휴식 전문가',
      condition: { escape: 'high', novelty: 'low' },
      mood: 'calm',
      color: 'bg-blue-200',
      interpretation:
        '일상에서 완전히 벗어나 오롯이 쉬는 것이 진짜 여행이라고 생각해요. 빡빡한 일정보다 여유로운 시간, 스파와 좋은 음식으로 몸과 마음을 충전하죠.',
      guide:
        '몰디브, 발리, 제주도 같은 리조트형 여행지가 잘 맞아요. 올인클루시브 리조트나 풀빌라에서 느긋하게 쉬어보세요.',
      matchPoints: [
        '완전한 휴식이 필요한 분',
        '조용한 환경 선호',
        '스파와 웰니스 좋아하는 분',
        '일상 스트레스 해소 목적',
      ],
    },
    // 3. 문화 탐방가: culture↑ structure(medium)
    {
      name: '문화 탐방가',
      emoji: '🏛️',
      desc: '역사와 예술, 현지 문화를 깊이 경험하는 여행자',
      condition: { culture: 'high', structure: 'medium' },
      mood: 'happy',
      color: 'bg-purple-200',
      interpretation:
        '박물관, 유적지, 전통 시장을 빠짐없이 둘러보며 그 나라의 역사와 문화를 이해하려 노력해요. 단순 관광이 아닌 배움의 여행을 추구하죠.',
      guide:
        '로마, 파리, 교토, 이스탄불 같은 역사 깊은 도시가 완벽해요. 가이드 투어나 오디오 가이드로 깊이 있는 설명을 들으면 더 좋아요.',
      matchPoints: [
        '역사와 예술에 관심 많은 분',
        '박물관 관람 좋아하는 분',
        '여행 전 공부하는 분',
        '사진보다 경험 중심',
      ],
    },
    // 4. 액티비티 모험가: novelty↑ escape↓
    {
      name: '액티비티 모험가',
      emoji: '🏄',
      desc: '스카이다이빙, 다이빙, 트레킹! 아드레날린을 즐기는 모험가',
      condition: { novelty: 'high', escape: 'low' },
      mood: 'excited',
      color: 'bg-red-200',
      interpretation:
        '여행은 쉬는 게 아니라 도전하는 것! 번지점프, 래프팅, 산악 트레킹 등 스릴 넘치는 활동으로 가득 채우는 게 당신의 스타일이에요.',
      guide:
        '뉴질랜드, 스위스, 코스타리카, 네팔이 잘 맞아요. 모험 여행 전문 업체를 이용하면 안전하게 다양한 경험을 할 수 있어요.',
      matchPoints: [
        '체력에 자신 있는 분',
        '극한 스포츠 좋아하는 분',
        '도전 정신이 강한 분',
        '활동적인 휴가 선호',
      ],
    },
    // 5. 패키지 안심형: structure↑ novelty↓
    {
      name: '패키지 안심형',
      emoji: '🚌',
      desc: '전문가가 짜준 완벽한 일정으로 편하게 즐기는 여행',
      condition: { structure: 'high', novelty: 'low' },
      mood: 'happy',
      color: 'bg-green-200',
      interpretation:
        '여행 준비의 스트레스 없이 편하게 즐기고 싶은 당신! 검증된 코스, 가이드의 설명, 안전한 이동으로 걱정 없는 여행을 선호해요.',
      guide:
        '유럽 패키지 투어, 크루즈 여행, 리조트 투어가 잘 맞아요. 첫 해외여행이나 언어가 걱정되는 지역 여행에 특히 좋아요.',
      matchPoints: [
        '편안한 여행 선호',
        '여행 준비 시간이 부족한 분',
        '안전한 여행 중시',
        '가이드 설명 듣기 좋아하는 분',
      ],
    },
    // 6. 로컬라이프 체험형: culture↑ social↑
    {
      name: '로컬라이프 체험형',
      emoji: '🏘️',
      desc: '현지인처럼 살아보는 깊이 있는 일상 체험 여행',
      condition: { culture: 'high', social: 'high', structure: 'low' },
      mood: 'happy',
      color: 'bg-teal-200',
      interpretation:
        '관광지보다 현지 시장, 동네 맛집, 일상적인 풍경을 더 좋아해요. 에어비앤비에서 묵으며 현지인 친구를 사귀고 진짜 그 나라 생활을 경험하고 싶어하죠.',
      guide:
        '한 도시에 오래 머물며 동네를 깊이 탐험해보세요. 쿠킹 클래스, 언어 교환, 로컬 투어로 현지 문화를 직접 체험하면 좋아요.',
      matchPoints: [
        '현지 문화에 관심 많은 분',
        '새로운 사람 만나는 거 좋아하는 분',
        '느린 여행 선호',
        '장기 체류 계획 중인 분',
      ],
    },
    // 7. 럭셔리 프리미엄형: escape↑ structure↑
    {
      name: '럭셔리 프리미엄형',
      emoji: '✨',
      desc: '5성급 호텔과 미슐랭 레스토랑, 프리미엄 경험 추구',
      condition: { escape: 'high', structure: 'high' },
      mood: 'happy',
      color: 'bg-amber-200',
      interpretation:
        '여행에서 타협은 없어요! 최고급 호텔, 파인다이닝, 프라이빗 투어로 편안하면서도 특별한 경험을 추구해요. 기념일이나 특별한 순간을 위한 완벽한 여행이죠.',
      guide:
        '파리, 두바이, 몰디브, 도쿄의 럭셔리 호텔을 경험해보세요. 컨시어지 서비스와 프라이빗 가이드로 VIP 대우를 받아보세요.',
      matchPoints: [
        '프리미엄 서비스 원하는 분',
        '편안함을 중시하는 분',
        '특별한 경험에 투자하는 분',
        '기념일/특별 여행',
      ],
    },
    // 8. 소셜 네트워커형: social↑ escape↓
    {
      name: '소셜 네트워커형',
      emoji: '🎉',
      desc: '새로운 친구를 만들고 함께 즐기는 사교형 여행자',
      condition: { social: 'high', escape: 'low' },
      mood: 'excited',
      color: 'bg-pink-200',
      interpretation:
        '여행의 진정한 재미는 사람! 호스텔에서 만난 친구와 함께 여행하고, 현지인과 어울리며, SNS로 경험을 공유하는 게 즐거워요.',
      guide:
        '게스트하우스, 호스텔에서 묵으며 다른 여행자와 교류해보세요. 그룹 투어나 펍 크롤링 같은 소셜 액티비티에 참여하면 좋아요.',
      matchPoints: [
        '새로운 사람 만나는 거 좋아하는 분',
        '혼자 여행해도 외롭지 않은 분',
        'SNS 활동 활발한 분',
        '파티/이벤트 즐기는 분',
      ],
    },
    // 9. 자연 치유형: escape↑ social↓
    {
      name: '자연 치유형',
      emoji: '🏕️',
      desc: '캠핑과 트레킹으로 자연 속에서 힐링하는 여행자',
      condition: { escape: 'high', social: 'low' },
      mood: 'calm',
      color: 'bg-emerald-200',
      interpretation:
        '복잡한 도시를 떠나 자연 속에서 조용히 쉬고 싶은 당신. 캠핑, 글램핑, 숲속 펜션에서 자연의 소리를 들으며 진정한 힐링을 경험해요.',
      guide:
        '스위스 알프스, 노르웨이 피요르드, 제주 오름, 강원도 숲속이 좋아요. 텐트나 캠핑카 여행도 추천드려요.',
      matchPoints: [
        '자연 속 힐링 원하는 분',
        '캠핑/글램핑 좋아하는 분',
        '혼자만의 시간 필요한 분',
        '별 보는 거 좋아하는 분',
      ],
    },
    // 10. 균형 잡힌 올라운더: novelty(medium) escape(medium) - 폴백
    {
      name: '균형 잡힌 올라운더',
      emoji: '⚖️',
      desc: '상황에 따라 유연하게 여행을 즐기는 만능형',
      condition: { novelty: 'medium', escape: 'medium' },
      mood: 'happy',
      color: 'bg-indigo-200',
      interpretation:
        '극단적인 모험도, 완전한 휴식도 아닌 적절한 균형을 찾는 당신! 관광도 하고, 맛집도 가고, 쉬기도 하면서 다양하게 즐겨요.',
      guide:
        '어떤 여행지든 잘 적응해요! 도시와 자연이 함께 있는 바르셀로나, 시드니, 밴쿠버 같은 곳에서 원하는 대로 골라 즐겨보세요.',
      matchPoints: [
        '처음 해외여행 준비 중인 분',
        '동행자와 타협 필요한 분',
        '아직 여행 스타일 찾는 중인 분',
        '다양한 경험 원하는 분',
      ],
    },
  ],
};

if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).CHEMI_SUBJECTS =
    (window as unknown as Record<string, Record<string, unknown>>)
      .CHEMI_SUBJECTS || {};
  (
    window as unknown as Record<string, Record<string, unknown>>
  ).CHEMI_SUBJECTS.travel = travelData;
}
