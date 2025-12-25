// travel 테스트 데이터 (여행지 매칭)
// 생성일: 2025-12-25

import type { SubjectData } from '../types';

export const travelData: SubjectData = {
  title: '나의 여행 스타일 찾기',
  subtitle: '나에게 맞는 여행지는?',
  themeColor: 'bg-sky-300',
  icon: 'TravelIcon',
  dimensions: {
    adventure: { name: '모험', emoji: '🎒', desc: '새로운 경험과 도전적인 활동 선호' },
    relax: { name: '휴식', emoji: '☀️', desc: '느긋한 일정과 여유로운 시간' },
    culture: { name: '문화', emoji: '🏛️', desc: '역사와 전통, 현지 문화 탐방' },
    nature: { name: '자연', emoji: '🌲', desc: '자연 경관과 야외 활동' },
    social: { name: '사교', emoji: '🗣️', desc: '사람들과의 교류와 소통' },
  },
  questions: [
    {
      q: '여행지에 도착하면 가장 먼저 하고 싶은 건?',
      dimension: 'adventure',
      a: [
        { text: '특별한 액티비티나 투어 신청!', score: 5 },
        { text: '숙소에서 쉬면서 계획 세우기', score: 3 },
        { text: '편안하게 주변 산책만...', score: 1 },
      ],
    },
    {
      q: '여행 중 예상 밖의 상황이 생기면?',
      dimension: 'adventure',
      a: [
        { text: '오히려 재밌을 것 같아!', score: 5 },
        { text: '당황하지만 일단 해결해봐', score: 3 },
        { text: '불안하고 스트레스 받아', score: 1 },
      ],
    },
    {
      q: '처음 가본 나라에서 길을 잃었다면?',
      dimension: 'adventure',
      a: [
        { text: '이것도 경험! 새로운 곳 발견하겠지', score: 5 },
        { text: 'GPS 보면서 천천히 찾아가', score: 3 },
        { text: '빨리 숙소로 돌아가고 싶어', score: 1 },
      ],
    },
    {
      q: '이상적인 여행 일정은?',
      dimension: 'relax',
      a: [
        { text: '느긋하게 2-3곳만 천천히', score: 5 },
        { text: '적당히 여유롭게', score: 3 },
        { text: '빡빡하게 많은 곳 방문!', score: 1 },
      ],
    },
    {
      q: '여행 중 오후 시간이 비었다면?',
      dimension: 'relax',
      a: [
        { text: '카페에서 책 읽거나 낮잠', score: 5 },
        { text: '근처 공원이나 해변 산책', score: 3 },
        { text: '급하게 관광지 하나 더!', score: 1 },
      ],
    },
    {
      q: '휴가 후 돌아왔을 때 어떤 기분이길 원해?',
      dimension: 'relax',
      a: [
        { text: '완전히 충전되고 힐링됨', score: 5 },
        { text: '새로운 경험으로 만족', score: 3 },
        { text: '보람차지만 피곤함', score: 1 },
      ],
    },
    {
      q: '여행지에서 박물관이나 유적지를 보면?',
      dimension: 'culture',
      a: [
        { text: '꼭 들어가서 자세히 봐야지!', score: 5 },
        { text: '시간 있으면 들어가볼게', score: 3 },
        { text: '밖에서 사진만 찍고 패스', score: 1 },
      ],
    },
    {
      q: '현지 음식을 먹을 때 선호하는 건?',
      dimension: 'culture',
      a: [
        { text: '전통 시장이나 로컬 맛집', score: 5 },
        { text: '유명한 관광지 식당', score: 3 },
        { text: '익숙한 프랜차이즈', score: 1 },
      ],
    },
    {
      q: '여행 준비할 때 뭘 가장 많이 찾아봐?',
      dimension: 'culture',
      a: [
        { text: '역사, 전통, 문화 정보', score: 5 },
        { text: '맛집과 핫플레이스', score: 3 },
        { text: '액티비티랑 놀거리', score: 1 },
      ],
    },
    {
      q: '이상적인 여행지 풍경은?',
      dimension: 'nature',
      a: [
        { text: '산, 바다, 숲 등 자연', score: 5 },
        { text: '자연과 도시 적절히 섞인 곳', score: 3 },
        { text: '현대적인 도시와 건물', score: 1 },
      ],
    },
    {
      q: '하이킹이나 트레킹 코스가 있다면?',
      dimension: 'nature',
      a: [
        { text: '당연히 도전! 너무 좋아', score: 5 },
        { text: '짧은 코스면 해볼게', score: 3 },
        { text: '힘들어서 패스...', score: 1 },
      ],
    },
    {
      q: '숙소 선택 시 중요한 기준은?',
      dimension: 'nature',
      a: [
        { text: '자연 경관이 보이는 전망', score: 5 },
        { text: '교통 편리한 위치', score: 3 },
        { text: '번화가 접근성', score: 1 },
      ],
    },
    {
      q: '여행 중 다른 여행자나 현지인을 만나면?',
      dimension: 'social',
      a: [
        { text: '먼저 말 걸고 친해지려고 해', score: 5 },
        { text: '말 걸면 대화는 해', score: 3 },
        { text: '최대한 나만의 시간 보내고 싶어', score: 1 },
      ],
    },
    {
      q: '단체 투어 vs 자유여행?',
      dimension: 'social',
      a: [
        { text: '단체 투어! 사람들 만나는 게 좋아', score: 5 },
        { text: '상황에 따라 골라서', score: 3 },
        { text: '무조건 자유여행', score: 1 },
      ],
    },
    {
      q: '여행 사진을 SNS에?',
      dimension: 'social',
      a: [
        { text: '실시간으로 자주 올려!', score: 5 },
        { text: '가끔 괜찮은 사진만', score: 3 },
        { text: '거의 안 올리거나 나중에', score: 1 },
      ],
    },
  ],
  resultLabels: [
    {
      name: '백패커형 여행자',
      emoji: '🎒',
      desc: '배낭 하나로 세계를 누비는 자유로운 영혼',
      condition: { adventure: 'high', relax: 'low', social: 'high' },
      mood: 'excited',
      color: 'bg-orange-100',
      interpretation: '당신은 계획보다 즉흥을 선호하고, 새로운 사람들을 만나며 여행하는 걸 즐기는 백패커형이에요. 게스트하우스에서 다른 여행자들과 정보를 나누고, 현지인 추천 맛집을 찾아다니는 게 재미있죠.',
      guide: '동남아시아 배낭여행, 유럽 인터레일, 남미 종단 등 장기 여행이 잘 맞아요. 호스텔이나 게스트하우스에서 묵으면서 현지 문화를 깊이 경험해보세요.',
      matchPoints: ['새로운 사람 만나는 걸 좋아하는 분', '예산 여행을 선호하는 분', '장기 여행 계획 중인 분', '즉흥적인 일정을 즐기는 분'],
    },
    {
      name: '힐링 여행자',
      emoji: '🌅',
      desc: '조용한 리조트에서 재충전하는 휴식 중심 여행',
      condition: { relax: 'high', nature: 'high', social: 'low' },
      mood: 'happy',
      color: 'bg-blue-100',
      interpretation: '빡빡한 일정보다 느긋한 휴식이 필요한 당신! 조용한 리조트나 한적한 해변에서 책을 읽고, 스파를 받으며 완전히 쉬는 여행이 최고예요.',
      guide: '몰디브, 발리, 제주도 같은 리조트 여행지가 잘 맞아요. 올인클루시브 리조트나 프라이빗 풀빌라에서 완벽한 휴식을 즐겨보세요.',
      matchPoints: ['완전한 휴식이 필요한 분', '조용한 곳을 선호하는 분', '스파와 웰니스를 좋아하는 분', '혼자 또는 연인과 여행하는 분'],
    },
    {
      name: '문화 탐방가',
      emoji: '🏛️',
      desc: '역사와 예술, 문화를 깊이 경험하는 여행',
      condition: { culture: 'high', adventure: 'low' },
      mood: 'happy',
      color: 'bg-purple-100',
      interpretation: '박물관, 미술관, 역사 유적지를 빠짐없이 둘러보는 당신은 진정한 문화 애호가예요. 단순 관광이 아닌 그 나라의 역사와 문화를 이해하고 배우려는 열정이 있죠.',
      guide: '로마, 파리, 교토, 이스탄불 같은 역사 깊은 도시가 완벽해요. 미리 역사를 공부하고, 가이드 투어로 깊이 있는 해설을 들으면 더 좋아요.',
      matchPoints: ['역사와 예술에 관심 많은 분', '박물관 관람을 좋아하는 분', '현지 문화 체험을 원하는 분', '사진보다 경험 중심인 분'],
    },
    {
      name: '액티비티 마니아',
      emoji: '🏄',
      desc: '트레킹, 다이빙, 번지점프! 활동적인 모험 여행',
      condition: { adventure: 'high', nature: 'high', relax: 'low' },
      mood: 'excited',
      color: 'bg-red-100',
      interpretation: '여행은 쉬는 게 아니라 도전하는 것! 스카이다이빙, 스쿠버다이빙, 산악 트레킹 등 아드레날린 넘치는 활동을 즐기는 당신.',
      guide: '뉴질랜드, 스위스, 코스타리카, 네팔 같은 액티비티 천국이 좋아요. 모험 여행 전문 여행사를 이용하면 더 안전하고 다양한 경험을 할 수 있어요.',
      matchPoints: ['체력에 자신 있는 분', '극한 스포츠를 좋아하는 분', '자연 속 활동을 즐기는 분', '새로운 도전을 원하는 분'],
    },
    {
      name: '도시 탐험가',
      emoji: '🌆',
      desc: '카페, 맛집, 쇼핑! 도시의 모든 것을 누비는 여행',
      condition: { culture: 'medium', social: 'high', nature: 'low' },
      mood: 'excited',
      color: 'bg-pink-100',
      interpretation: '트렌디한 카페, 인스타그램 핫플레이스, 로컬 맛집을 찾아다니는 당신은 도시의 생생한 에너지를 즐겨요.',
      guide: '도쿄, 방콕, 뉴욕, 홍콩 같은 대도시가 잘 맞아요. 현지 SNS나 블로그에서 최신 핫플을 찾고, 대중교통으로 구석구석 탐험해보세요.',
      matchPoints: ['트렌디한 곳을 좋아하는 분', '쇼핑과 맛집 탐방을 즐기는 분', '도시 문화를 즐기는 분', '사진 찍는 걸 좋아하는 분'],
    },
    {
      name: '럭셔리 여행자',
      emoji: '✨',
      desc: '5성급 호텔과 파인다이닝, 프리미엄 여행',
      condition: { relax: 'high', adventure: 'low', social: 'medium' },
      mood: 'happy',
      color: 'bg-amber-100',
      interpretation: '여행에서 타협은 없어요! 최고급 호텔, 미슐랭 레스토랑, 프라이빗 투어로 편안하고 우아한 여행을 즐기는 당신.',
      guide: '파리, 두바이, 뉴욕, 런던의 럭셔리 호텔을 경험해보세요. 컨시어지 서비스를 활용하고, 프라이빗 가이드 투어로 편안하면서도 깊이 있는 여행을 즐겨보세요.',
      matchPoints: ['프리미엄 서비스를 원하는 분', '편안한 여행을 선호하는 분', '특별한 경험에 투자하는 분', '기념일이나 특별한 여행 계획인 분'],
    },
    {
      name: '사진작가형 여행자',
      emoji: '📸',
      desc: '일출, 일몰, 포토존을 찾아다니는 인스타그래머',
      condition: { nature: 'high', adventure: 'medium', social: 'medium' },
      mood: 'excited',
      color: 'bg-green-100',
      interpretation: '완벽한 사진 한 장을 위해 새벽에도 일어나는 당신! 일출 명소, 숨은 포토존, 인스타그램 감성 카페를 찾아다니며 여행을 기록하는 걸 즐겨요.',
      guide: '아이슬란드, 산토리니, 페루 마추픽추, 캐나다 밴프 같은 절경 명소가 좋아요. 골든아워를 노려 출사하고, 현지 사진작가들의 루트를 참고해보세요.',
      matchPoints: ['사진 찍는 걸 좋아하는 분', '자연 풍경을 좋아하는 분', '인스타그램 감성을 추구하는 분', '추억을 기록으로 남기고 싶은 분'],
    },
    {
      name: '로컬라이프 체험형',
      emoji: '🏘️',
      desc: '현지인처럼 살아보는 일상 체험 여행',
      condition: { culture: 'high', social: 'high', adventure: 'medium' },
      mood: 'happy',
      color: 'bg-teal-100',
      interpretation: '관광지보다 현지 시장, 동네 맛집, 일상적인 풍경을 더 좋아하는 당신. 에어비앤비에서 묵으며 현지인처럼 생활하고, 로컬 친구를 사귀며 진짜 여행을 경험하죠.',
      guide: '한 도시에 오래 머물며 동네를 깊이 탐험해보세요. 쿠킹 클래스, 언어 교환, 로컬 투어 등으로 현지 문화를 직접 체험하면 좋아요.',
      matchPoints: ['현지 문화에 관심 많은 분', '사람들과 교류를 즐기는 분', '느린 여행을 선호하는 분', '장기 체류를 계획하는 분'],
    },
    {
      name: '가성비 여행자',
      emoji: '💰',
      desc: '적은 비용으로 최대한 즐기는 알뜰 여행',
      condition: { relax: 'medium', social: 'medium', adventure: 'medium' },
      mood: 'happy',
      color: 'bg-yellow-100',
      interpretation: '여행은 즐겁게, 지출은 똑똑하게! 항공권 할인, 무료 관광지, 가성비 숙소를 찾는 데 능숙한 당신.',
      guide: '동남아시아, 동유럽, 중남미 등 물가가 저렴한 나라가 좋아요. 저가 항공과 호스텔을 활용하고, 무료 워킹투어나 시티패스를 적극 이용해보세요.',
      matchPoints: ['예산 여행을 선호하는 분', '알뜰한 분', '학생이나 초보 여행자', '여행을 자주 다니고 싶은 분'],
    },
    {
      name: '균형 잡힌 여행자',
      emoji: '⚖️',
      desc: '휴식과 활동, 계획과 즉흥의 조화로운 여행',
      condition: {},
      mood: 'happy',
      color: 'bg-indigo-100',
      interpretation: '모험도 좋지만 휴식도 필요한 당신! 빡빡하지도, 너무 여유롭지도 않은 적절한 균형을 찾는 여행자예요.',
      guide: '어떤 여행지든 잘 적응해요! 대도시와 자연이 함께 있는 곳 (바르셀로나, 시드니, 밴쿠버 등)에서 원하는 대로 골라 즐겨보세요.',
      matchPoints: ['첫 해외여행을 준비하는 분', '동행자와 타협이 필요한 분', '아직 여행 스타일을 찾는 중인 분', '다양한 경험을 원하는 분'],
    },
  ],
};

if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).CHEMI_SUBJECTS = (window as unknown as Record<string, Record<string, unknown>>).CHEMI_SUBJECTS || {};
  (window as unknown as Record<string, Record<string, unknown>>).CHEMI_SUBJECTS.travel = travelData;
}
