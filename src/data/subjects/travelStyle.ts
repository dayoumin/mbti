// travelStyle 테스트 데이터
// 생성일: 2025-12-23

export const travelStyleData = {
  title: "여행 스타일 테스트",
  subtitle: "나의 여행 스타일은?",
  themeColor: "bg-blue-100",
  icon: "TravelStyleIcon",
  testType: "personality",
  dimensions: {
    planning: {
      name: "계획성",
      emoji: "📋",
      desc: "여행 계획 세우기"
    },
    activity: {
      name: "활동성",
      emoji: "🏃",
      desc: "여행지에서의 활동량"
    },
    adventure: {
      name: "모험심",
      emoji: "🗺️",
      desc: "새로운 곳 탐험하기"
    },
    relaxation: {
      name: "휴식선호",
      emoji: "🌴",
      desc: "여행에서 휴식 추구"
    },
    social: {
      name: "사교성",
      emoji: "👥",
      desc: "여행지에서 만남"
    }
  },
  questions: [
    // 계획성 차원 (3문항)
    {
      q: "여행 일정을 짤 때 나는?",
      dimension: "planning",
      a: [
        { text: "시간표처럼 세세하게 계획한다", score: 5 },
        { text: "대략적인 루트만 정해둔다", score: 3 },
        { text: "그날그날 기분대로 움직인다", score: 1 }
      ]
    },
    {
      q: "여행 전 예약은 어떻게?",
      dimension: "planning",
      a: [
        { text: "숙소, 교통편, 식당까지 모두 미리 예약", score: 5 },
        { text: "숙소와 교통편만 예약", score: 3 },
        { text: "숙소도 현지에서 찾는다", score: 1 }
      ]
    },
    {
      q: "여행 가방을 쌀 때?",
      dimension: "planning",
      a: [
        { text: "체크리스트 만들어서 빠짐없이 챙긴다", score: 5 },
        { text: "필요할 것 같은 건 대충 넣는다", score: 1 }
      ]
    },
    // 활동성 차원 (3문항)
    {
      q: "여행지에서 하루를 어떻게 보내고 싶어?",
      dimension: "activity",
      a: [
        { text: "아침부터 저녁까지 알차게 돌아다닌다", score: 5 },
        { text: "적당히 돌아다니고 카페에서 쉬기도 한다", score: 3 },
        { text: "호텔에서 푹 쉬며 느긋하게 보낸다", score: 1 }
      ]
    },
    {
      q: "여행지에서 선호하는 활동은?",
      dimension: "activity",
      a: [
        { text: "등산, 트레킹, 수상스포츠 등 액티비티", score: 5 },
        { text: "걷기, 자전거 타기 등 가벼운 활동", score: 3 },
        { text: "스파, 마사지 등 휴식 활동", score: 1 }
      ]
    },
    {
      q: "도시 여행에서 이동 방식은?",
      dimension: "activity",
      a: [
        { text: "걸어다니면서 구석구석 탐방", score: 5 },
        { text: "대중교통 이용해서 효율적으로", score: 1 }
      ]
    },
    // 모험심 차원 (3문항)
    {
      q: "여행지 선택 시 중요한 것은?",
      dimension: "adventure",
      a: [
        { text: "아무도 안 가본 숨겨진 여행지", score: 5 },
        { text: "유명하지만 특별한 경험 가능한 곳", score: 3 },
        { text: "검증된 인기 관광지", score: 1 }
      ]
    },
    {
      q: "현지 음식을 마주했을 때?",
      dimension: "adventure",
      a: [
        { text: "낯선 음식도 일단 도전해본다", score: 5 },
        { text: "평이 좋은 것만 먹어본다", score: 3 },
        { text: "익숙한 음식 위주로 먹는다", score: 1 }
      ]
    },
    {
      q: "예상치 못한 상황이 생긴다면?",
      dimension: "adventure",
      a: [
        { text: "오히려 재밌다! 새로운 경험으로 받아들인다", score: 5 },
        { text: "당황스럽지만 어떻게든 해결한다", score: 1 }
      ]
    },
    // 휴식선호 차원 (3문항)
    {
      q: "여행의 목적은?",
      dimension: "relaxation",
      a: [
        { text: "일상에서 벗어나 완전히 쉬기", score: 5 },
        { text: "새로운 경험하며 추억 쌓기", score: 1 }
      ]
    },
    {
      q: "여행지에서 오후 시간에?",
      dimension: "relaxation",
      a: [
        { text: "호텔 수영장이나 객실에서 낮잠", score: 5 },
        { text: "카페에서 여유롭게 책 읽기", score: 3 },
        { text: "다음 관광지로 이동", score: 1 }
      ]
    },
    {
      q: "비전이 있는 여행지 숙소는?",
      dimension: "relaxation",
      a: [
        { text: "오션뷰 리조트, 수영장 있는 풀빌라", score: 5 },
        { text: "시내 중심 호텔, 접근성 좋은 곳", score: 1 }
      ]
    },
    // 사교성 차원 (3문항)
    {
      q: "여행 스타일은?",
      dimension: "social",
      a: [
        { text: "친구들과 북적북적 떠나는 게 좋다", score: 5 },
        { text: "가까운 사람과 소수로 다니는 게 좋다", score: 3 },
        { text: "혼자만의 여행이 최고", score: 1 }
      ]
    },
    {
      q: "현지에서 사람을 만난다면?",
      dimension: "social",
      a: [
        { text: "적극적으로 대화하며 친구 사귄다", score: 5 },
        { text: "필요한 대화만 한다", score: 3 },
        { text: "최소한의 소통만 한다", score: 1 }
      ]
    },
    {
      q: "여행 중 식사는?",
      dimension: "social",
      a: [
        { text: "현지인들 많은 북적이는 맛집", score: 5 },
        { text: "조용하고 분위기 좋은 레스토랑", score: 1 }
      ]
    }
  ],
  resultLabels: [
    {
      name: "철저한 플래너",
      emoji: "📝",
      desc: "완벽한 계획으로 여행을 설계하는 전략가",
      condition: {
        planning: "high",
        activity: "high",
        adventure: "low"
      },
      interpretation: "당신은 모든 일정을 꼼꼼하게 계획하고 효율적으로 실행하는 여행 전략가입니다. 동선을 최적화하고 시간을 아껴 최대한 많은 것을 보고 경험하려 합니다.",
      guide: "가끔은 계획에 없던 우연한 발견도 여행의 재미입니다. 여유 시간을 두고 즉흥적인 선택도 해보세요.",
      mood: "cool",
      color: "bg-blue-200"
    },
    {
      name: "즉흥 여행자",
      emoji: "🎒",
      desc: "계획 없이 자유롭게 떠나는 진정한 백패커",
      condition: {
        planning: "low",
        adventure: "high",
        relaxation: "low"
      },
      interpretation: "당신은 계획보다 직감을 따라 움직이는 자유로운 영혼입니다. 예상치 못한 상황도 즐기며, 그 순간의 감정에 따라 여행 루트를 바꾸는 것도 주저하지 않습니다.",
      guide: "최소한의 계획(숙소, 항공권)은 미리 해두세요. 너무 무계획하면 시간과 비용이 낭비될 수 있습니다.",
      mood: "excited",
      color: "bg-orange-100"
    },
    {
      name: "액티비티 헌터",
      emoji: "🏄",
      desc: "모험과 활동을 찾아 떠나는 에너지 충만 여행가",
      condition: {
        activity: "high",
        adventure: "high",
        relaxation: "low"
      },
      interpretation: "당신은 여행지에서 스릴 넘치는 활동을 즐기는 액션파입니다. 번지점프, 다이빙, 패러글라이딩 등 도전적인 액티비티를 찾아다니며, 여행은 곧 모험입니다.",
      guide: "안전이 최우선입니다. 전문 가이드와 함께하고, 보험 가입도 꼭 확인하세요.",
      mood: "excited",
      color: "bg-red-100"
    },
    {
      name: "힐링 추구형",
      emoji: "🧘",
      desc: "완전한 휴식과 재충전을 위한 여행",
      condition: {
        relaxation: "high",
        activity: "low",
        planning: "medium"
      },
      interpretation: "당신에게 여행은 일상의 피로를 풀고 심신을 재충전하는 시간입니다. 리조트에서 느긋하게 쉬며, 스파와 마사지로 몸과 마음을 힐링합니다.",
      guide: "휴식도 좋지만, 가벼운 산책이나 현지 문화 체험도 여행의 추억이 됩니다.",
      mood: "calm",
      color: "bg-green-100"
    },
    {
      name: "맛집 탐험가",
      emoji: "🍽️",
      desc: "먹방이 곧 여행의 하이라이트",
      condition: {
        adventure: "high",
        social: "high",
        planning: "high"
      },
      interpretation: "당신은 여행의 핵심을 '음식'에서 찾습니다. 미슐랭 레스토랑부터 숨은 로컬 맛집까지, 맛집 리스트를 미리 작성하고 하나씩 정복해 나갑니다.",
      guide: "맛집만 쫓다 보면 다른 볼거리를 놓칠 수 있어요. 식사 사이에 관광 명소도 넣어보세요.",
      mood: "happy",
      color: "bg-yellow-100"
    },
    {
      name: "문화 탐방러",
      emoji: "🏛️",
      desc: "역사와 문화를 깊이 있게 탐구하는 지식 여행자",
      condition: {
        planning: "high",
        adventure: "medium",
        social: "low"
      },
      interpretation: "당신은 박물관, 미술관, 역사 유적지를 찾아다니며 그 나라의 문화와 역사를 깊이 있게 이해하려 합니다. 여행은 곧 배움의 과정입니다.",
      guide: "가이드 투어나 오디오 가이드를 활용하면 더 풍부한 경험을 할 수 있습니다.",
      mood: "cool",
      color: "bg-purple-100"
    },
    {
      name: "인생샷 수집가",
      emoji: "📸",
      desc: "SNS에 올릴 완벽한 사진을 찾아 떠나는 포토그래퍼",
      condition: {
        planning: "high",
        social: "high",
        activity: "medium"
      },
      interpretation: "당신은 인스타그램에 올릴 멋진 사진을 찍기 위해 여행합니다. 유명 포토존을 미리 리서치하고, 일출/일몰 시간대를 맞춰 최고의 샷을 건집니다.",
      guide: "사진 찍기에만 집중하다 보면 정작 그 순간을 즐기지 못할 수 있어요. 눈으로도 담아보세요.",
      mood: "excited",
      color: "bg-pink-100"
    },
    {
      name: "소셜 여행러",
      emoji: "🎉",
      desc: "새로운 사람들과의 만남을 즐기는 사교형 여행자",
      condition: {
        social: "high",
        adventure: "high",
        planning: "low"
      },
      interpretation: "당신은 여행지에서 새로운 사람들을 만나고 친구를 사귀는 것을 즐깁니다. 호스텔에 머물며 현지인이나 다른 여행자들과 교류하고, 함께 파티를 즐깁니다.",
      guide: "안전에 주의하세요. 너무 낯선 사람을 쉽게 믿지 말고, 귀중품 관리를 철저히 하세요.",
      mood: "happy",
      color: "bg-orange-100"
    },
    {
      name: "자연 탐험가",
      emoji: "⛰️",
      desc: "대자연 속에서 자유를 만끽하는 아웃도어 러버",
      condition: {
        activity: "high",
        relaxation: "high",
        social: "low"
      },
      interpretation: "당신은 도심보다 자연 속에서 진정한 휴식을 찾습니다. 국립공원, 산, 바다 등 자연 경관이 아름다운 곳을 찾아 트레킹하고 캠핑하며 힐링합니다.",
      guide: "날씨와 지형을 미리 확인하고, 필요한 장비를 철저히 준비하세요.",
      mood: "calm",
      color: "bg-green-200"
    },
    {
      name: "균형잡힌 여행자",
      emoji: "⚖️",
      desc: "계획과 즉흥, 활동과 휴식의 조화를 아는 올라운더",
      condition: {
        planning: "medium",
        activity: "medium",
        adventure: "medium"
      },
      interpretation: "당신은 여행의 모든 요소를 적절히 배합할 줄 아는 균형잡힌 여행자입니다. 대략적인 계획은 세우되 융통성 있게 움직이고, 활동과 휴식을 적절히 섞어 즐깁니다.",
      guide: "당신의 스타일을 유지하면서도, 가끔은 평소와 다른 여행 방식에 도전해보세요.",
      mood: "happy",
      color: "bg-blue-100"
    }
  ]
};

if (typeof window !== 'undefined') {
  window.CHEMI_SUBJECTS = window.CHEMI_SUBJECTS || {};
  window.CHEMI_SUBJECTS.travelStyle = travelStyleData;
}
