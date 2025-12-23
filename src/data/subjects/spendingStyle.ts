// spendingStyle 테스트 데이터
// 생성일: 2025-12-23

export const spendingStyleData = {
  title: "소비 성향 테스트",
  subtitle: "나의 지갑 사용법은?",
  themeColor: "bg-emerald-100",
  icon: "SpendingStyleIcon",
  testType: "personality",
  dimensions: {
    planning: {
      name: "계획성",
      emoji: "📋",
      desc: "소비 계획과 예산 관리"
    },
    impulse: {
      name: "충동성",
      emoji: "⚡",
      desc: "즉흥적 구매 성향"
    },
    valueSeek: {
      name: "가성비",
      emoji: "🎯",
      desc: "가격 대비 가치 추구"
    },
    showOff: {
      name: "과시성",
      emoji: "💎",
      desc: "브랜드와 남에게 보이는 소비"
    },
    saving: {
      name: "저축성",
      emoji: "🐷",
      desc: "미래를 위한 저축 성향"
    }
  },
  questions: [
    {
      q: "월급날! 통장에 돈이 들어왔을 때 나는?",
      dimension: "planning",
      a: [
        { text: "고정비, 저축, 생활비로 바로 쪼개 놓는다.", score: 5 },
        { text: "대충 얼마 쓸지 머릿속으로 생각만 한다.", score: 3 },
        { text: "그냥 두고 필요할 때마다 쓴다.", score: 1 }
      ]
    },
    {
      q: "쇼핑 전, 나의 준비 과정은?",
      dimension: "planning",
      a: [
        { text: "살 것 리스트를 작성하고 예산을 정한다.", score: 5 },
        { text: "대략적인 계획만 세운다.", score: 3 },
        { text: "가서 필요한 걸 산다.", score: 1 }
      ]
    },
    {
      q: "이번 달 예산을 다 썼는데 갖고 싶은 게 생겼다면?",
      dimension: "planning",
      a: [
        { text: "다음 달까지 참는다. 예산은 지켜야지.", score: 5 },
        { text: "고민하다가 정말 필요하면 산다.", score: 3 },
        { text: "지금 사야 할 것 같으면 일단 산다.", score: 1 }
      ]
    },
    {
      q: "온라인 쇼핑몰 추천 상품을 봤을 때?",
      dimension: "impulse",
      a: [
        { text: "클릭도 안 한다. 계획에 없는 건 관심 없음.", score: 1 },
        { text: "한번 구경은 해보는데, 바로 사지는 않는다.", score: 3 },
        { text: "좋아 보이면 바로 장바구니 담기!", score: 5 }
      ]
    },
    {
      q: "친구가 '이거 대박이야! 같이 사자'라고 할 때?",
      dimension: "impulse",
      a: [
        { text: "정말 필요한지 며칠 고민 후 결정한다.", score: 1 },
        { text: "괜찮아 보이면 고민 좀 하다가 산다.", score: 3 },
        { text: "친구 말에 혹해서 바로 구매 클릭!", score: 5 }
      ]
    },
    {
      q: "백화점에서 '오늘만 50% 할인!' 행사를 만났을 때?",
      dimension: "impulse",
      a: [
        { text: "할인이어도 필요 없으면 안 산다.", score: 1 },
        { text: "진짜 필요한 건지 빠르게 판단 후 결정.", score: 3 },
        { text: "이런 기회를 놓칠 수 없지! 일단 산다.", score: 5 }
      ]
    },
    {
      q: "같은 제품인데 가격이 다른 곳에서 팔고 있다면?",
      dimension: "valueSeek",
      a: [
        { text: "당연히 최저가를 찾아서 산다.", score: 5 },
        { text: "적당히 저렴한 곳에서 산다.", score: 3 },
        { text: "가까운 곳이나 편한 곳에서 산다.", score: 1 }
      ]
    },
    {
      q: "제품 구매 전 리뷰를 얼마나 보는가?",
      dimension: "valueSeek",
      a: [
        { text: "꼼꼼하게 여러 개 읽고 비교한다.", score: 5 },
        { text: "상위 몇 개만 대충 본다.", score: 3 },
        { text: "별로 안 본다. 감으로 산다.", score: 1 }
      ]
    },
    {
      q: "싼 무명 브랜드 vs 비싼 유명 브랜드, 품질이 비슷하다면?",
      dimension: "valueSeek",
      a: [
        { text: "무조건 싼 거! 똑같은데 왜 비싸게 사?", score: 5 },
        { text: "가격 차이에 따라 고민해본다.", score: 3 },
        { text: "브랜드 가치가 있으니 비싼 걸 산다.", score: 1 }
      ]
    },
    {
      q: "친구들과 카페 갈 때 나의 선택은?",
      dimension: "showOff",
      a: [
        { text: "제일 싼 아메리카노!", score: 1 },
        { text: "먹고 싶은 걸 적당히 골라 먹는다.", score: 3 },
        { text: "예쁘거나 특별한 시그니처 메뉴!", score: 5 }
      ]
    },
    {
      q: "명품 가방/시계를 사는 이유는?",
      dimension: "showOff",
      a: [
        { text: "내가 좋아서. 남이 뭐라든 상관없다.", score: 1 },
        { text: "품질이 좋고, 오래 쓸 수 있어서.", score: 3 },
        { text: "사람들에게 보이는 것도 중요해서.", score: 5 }
      ]
    },
    {
      q: "SNS에 내 소비(구매 인증샷) 올리는 빈도는?",
      dimension: "showOff",
      a: [
        { text: "거의 안 올린다. 굳이?", score: 1 },
        { text: "가끔 특별한 것만 올린다.", score: 3 },
        { text: "자주 올린다. 자랑하고 싶어!", score: 5 }
      ]
    },
    {
      q: "한 달에 저축하는 금액은?",
      dimension: "saving",
      a: [
        { text: "수입의 30% 이상 꼬박꼬박 저축한다.", score: 5 },
        { text: "남는 돈이 있으면 저축한다.", score: 3 },
        { text: "저축? 그게 뭐죠? 거의 안 한다.", score: 1 }
      ]
    },
    {
      q: "목돈이 생겼을 때 나는?",
      dimension: "saving",
      a: [
        { text: "바로 저축하거나 투자한다.", score: 5 },
        { text: "일부는 저축, 일부는 쓴다.", score: 3 },
        { text: "평소 갖고 싶던 걸 산다!", score: 1 }
      ]
    },
    {
      q: "미래를 위한 재테크에 대한 생각은?",
      dimension: "saving",
      a: [
        { text: "적극적으로 공부하고 실천한다.", score: 5 },
        { text: "관심은 있지만 실천은 잘 안 한다.", score: 3 },
        { text: "어렵고 귀찮다. 지금이 중요해!", score: 1 }
      ]
    }
  ],
  resultLabels: [
    {
      name: "쇼핑 홀릭",
      emoji: "🛍️",
      desc: "보면 사고, 또 사고, 끝없이 사는 쇼핑 중독자",
      condition: {
        impulse: "high",
        saving: "low"
      },
      interpretation: "당신은 즉흥적인 소비를 즐기고 쇼핑 자체에서 행복을 느끼는 타입입니다. 새로운 것을 사는 순간의 기쁨이 크지만, 나중에 후회할 때도 있습니다.",
      guide: "소비 전 24시간 룰을 적용해보세요. 갖고 싶은 게 생기면 하루 기다렸다가 정말 필요한지 다시 생각해보는 습관이 도움이 됩니다.",
      mood: "excited",
      color: "bg-pink-200"
    },
    {
      name: "알뜰 저축러",
      emoji: "💰",
      desc: "1원이라도 아끼는 절약과 저축의 달인",
      condition: {
        valueSeek: "high",
        saving: "high",
        showOff: "low"
      },
      interpretation: "당신은 가성비를 최우선으로 하고, 미래를 위해 꾸준히 저축하는 현명한 소비자입니다. 불필요한 지출을 최소화하고 알뜰하게 살아갑니다.",
      guide: "가끔은 자신을 위한 작은 사치도 괜찮습니다. 너무 아끼기만 하면 삶의 여유가 사라질 수 있어요. 월 예산의 5%는 '나를 위한 선물'로 써보세요.",
      mood: "happy",
      color: "bg-green-200"
    },
    {
      name: "가성비 헌터",
      emoji: "🎯",
      desc: "최저가를 찾아 삼만리! 가격 비교의 달인",
      condition: {
        valueSeek: "high",
        planning: "high"
      },
      interpretation: "당신은 똑똑한 소비자입니다. 구매 전 철저히 비교하고, 가격 대비 최고의 가치를 찾아냅니다. 충동구매는 거의 하지 않습니다.",
      guide: "너무 비교에만 시간을 쓰다 보면 정작 중요한 것을 놓칠 수 있어요. 가끔은 시간도 비용이라는 것을 기억하세요.",
      mood: "cool",
      color: "bg-blue-200"
    },
    {
      name: "플렉스 마스터",
      emoji: "💎",
      desc: "명품과 브랜드로 나를 표현하는 과시형 소비자",
      condition: {
        showOff: "high",
        impulse: "high"
      },
      interpretation: "당신은 브랜드 가치를 중요하게 여기고, 남에게 보이는 것도 신경 쓰는 타입입니다. 고급스러운 것을 선호하고 자신의 소비를 자랑스러워합니다.",
      guide: "진짜 자신을 위한 소비인지, 남에게 보이기 위한 소비인지 구분해보세요. 과시보다 자신의 만족이 우선입니다.",
      mood: "excited",
      color: "bg-purple-200"
    },
    {
      name: "계획적 소비자",
      emoji: "📊",
      desc: "예산 관리의 달인, 모든 소비는 계획 안에",
      condition: {
        planning: "high",
        saving: "high",
        impulse: "low"
      },
      interpretation: "당신은 체계적으로 예산을 관리하고, 계획에 따라 소비하는 모범적인 소비자입니다. 충동구매는 거의 하지 않고, 저축도 꾸준히 합니다.",
      guide: "완벽한 계획도 좋지만, 가끔은 예상치 못한 즐거움도 필요합니다. 월 예산의 일부는 '자유 지출'로 남겨두세요.",
      mood: "cool",
      color: "bg-indigo-200"
    },
    {
      name: "감성 구매러",
      emoji: "💝",
      desc: "기분이 좋으면 사고, 우울하면 또 사는 감정형 소비자",
      condition: {
        impulse: "high",
        planning: "low"
      },
      interpretation: "당신은 그날의 기분과 감정에 따라 소비하는 타입입니다. 계획보다는 감정이 지갑을 열게 만듭니다. 쇼핑이 스트레스 해소 수단이기도 합니다.",
      guide: "감정 소비를 완전히 막을 필요는 없지만, 한도를 정해두세요. '기분 전환 예산'을 미리 책정해 두면 후회를 줄일 수 있습니다.",
      mood: "happy",
      color: "bg-pink-100"
    },
    {
      name: "미니멀리스트",
      emoji: "🌿",
      desc: "필요한 것만 산다! 심플하고 깔끔한 소비",
      condition: {
        impulse: "low",
        showOff: "low",
        valueSeek: "high"
      },
      interpretation: "당신은 정말 필요한 것만 사는 미니멀한 소비자입니다. 불필요한 소유를 싫어하고, 단순하고 실용적인 것을 선호합니다.",
      guide: "때로는 '필요'보다 '행복'도 중요합니다. 꼭 필요하지 않아도 기쁨을 주는 것에 가끔 투자해보세요.",
      mood: "calm",
      color: "bg-green-100"
    },
    {
      name: "리워드 헌터",
      emoji: "🎁",
      desc: "할인, 적립, 혜택! 모든 프로모션을 섭렵하는 똑똑이",
      condition: {
        valueSeek: "high",
        planning: "high",
        showOff: "low"
      },
      interpretation: "당신은 할인과 혜택을 놓치지 않는 똑똑한 소비자입니다. 카드 할인, 적립, 쿠폰 등을 최대한 활용하며, 같은 돈으로 더 많은 가치를 얻습니다.",
      guide: "혜택을 받으려다 오히려 불필요한 소비를 할 수 있어요. '할인 중'이 아니라 '정말 필요한가'를 먼저 물어보세요.",
      mood: "happy",
      color: "bg-yellow-200"
    },
    {
      name: "YOLO 소비자",
      emoji: "🎉",
      desc: "인생은 한 번! 지금 이 순간을 즐기는 소비",
      condition: {
        impulse: "high",
        saving: "low",
        planning: "low"
      },
      interpretation: "당신은 현재의 행복을 우선시하는 타입입니다. 저축보다는 지금의 경험과 즐거움에 투자하며, '나중에'보다 '지금'을 중요하게 생각합니다.",
      guide: "현재도 중요하지만 미래도 준비해야 합니다. 수입의 10%만이라도 '미래의 나'를 위해 저축해보세요.",
      mood: "excited",
      color: "bg-orange-200"
    },
    {
      name: "균형잡힌 소비자",
      emoji: "⚖️",
      desc: "쓸 땐 쓰고, 아낄 땐 아끼는 중도형 소비자",
      condition: {
        planning: "medium",
        impulse: "medium",
        saving: "medium",
        valueSeek: "medium"
      },
      interpretation: "당신은 극단적이지 않은 균형 잡힌 소비 습관을 가졌습니다. 때로는 계획적으로, 때로는 즉흥적으로 소비하며, 저축과 소비의 밸런스를 잘 맞춥니다.",
      guide: "균형도 좋지만, 자신만의 뚜렷한 재정 목표를 세워보세요. 명확한 목표가 있으면 더 만족스러운 소비를 할 수 있습니다.",
      mood: "happy",
      color: "bg-gray-200"
    },
    {
      name: "브랜드 충성러",
      emoji: "👑",
      desc: "믿고 쓰는 브랜드만 고집하는 충성 고객",
      condition: {
        showOff: "high",
        valueSeek: "low"
      },
      interpretation: "당신은 좋아하는 브랜드에 충성도가 높은 소비자입니다. 가격보다는 브랜드 가치와 품질을 중요시하며, 한번 믿은 브랜드는 계속 찾습니다.",
      guide: "브랜드 충성도도 좋지만, 가끔은 새로운 브랜드도 시도해보세요. 더 좋은 가성비의 제품을 발견할 수 있습니다.",
      mood: "cool",
      color: "bg-purple-100"
    },
    {
      name: "투자형 소비자",
      emoji: "📈",
      desc: "소비도 투자! 미래 가치를 생각하는 전략가",
      condition: {
        saving: "high",
        planning: "high",
        valueSeek: "medium"
      },
      interpretation: "당신은 단순히 아끼는 것이 아니라, 미래 가치를 생각하며 소비합니다. 저축과 투자를 적극적으로 하며, 장기적 관점에서 지출을 결정합니다.",
      guide: "너무 미래만 보다 보면 현재의 행복을 놓칠 수 있어요. 지금의 나에게도 가끔은 투자하세요.",
      mood: "cool",
      color: "bg-blue-100"
    }
  ]
};

if (typeof window !== 'undefined') {
  window.CHEMI_SUBJECTS = window.CHEMI_SUBJECTS || {};
  window.CHEMI_SUBJECTS.spendingStyle = spendingStyleData;
}
