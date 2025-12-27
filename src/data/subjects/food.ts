import { SubjectData } from '../types';

export const foodData: SubjectData = {
    title: "소울 푸드 찾기",
    subtitle: "나의 성격과 꼭 닮은 음식은 무엇일까요?",
    themeColor: "bg-[#FFEDD5]",
    icon: "ChefHatIcon",
    dimensions: {
        EI: {
            name: "에너지",
            emoji: "⚡",
            desc: "혼밥(low) vs 인싸(high)"
        },
        SN: {
            name: "감각",
            emoji: "👁️",
            desc: "현실(low) vs 분위기(high)"
        },
        TF: {
            name: "판단",
            emoji: "⚖️",
            desc: "논리/맛(low) vs 감정/건강(high)"
        },
        JP: {
            name: "생활",
            emoji: "📋",
            desc: "즉흥(low) vs 계획(high)"
        }
    },
    questions: [
        // EI 차원 (3문항)
        {
            q: "기다리던 주말, 맛집 탐방을 간다면?",
            dimension: "EI",
            a: [
                { text: "친구들과 왁자지껄하게 먹어야 제맛!", score: 5 },
                { text: "한두 명 친한 사람과 함께", score: 3 },
                { text: "분위기 좋은 곳에서 조용히 즐기고 싶어", score: 1 }
            ]
        },
        {
            q: "새로운 맛집을 발견했을 때?",
            dimension: "EI",
            a: [
                { text: "단톡방에 바로 공유한다", score: 5 },
                { text: "가까운 친구 한두 명에게만 알려준다", score: 3 },
                { text: "나만의 비밀 맛집으로 간직한다", score: 1 }
            ]
        },
        {
            q: "회식이나 모임에서 음식 주문할 때?",
            dimension: "EI",
            a: [
                { text: "내가 나서서 메뉴 추천하고 주문한다", score: 5 },
                { text: "같이 메뉴판 보면서 의견 낸다", score: 3 },
                { text: "다른 사람들이 시키는 거 따른다", score: 1 }
            ]
        },
        // SN 차원 (3문항)
        {
            q: "식당을 고를 때 가장 중요하게 생각하는 것은?",
            dimension: "SN",
            a: [
                { text: "검증된 맛과 합리적인 가격!", score: 1 },
                { text: "맛도 중요하고 분위기도 중요!", score: 3 },
                { text: "음식의 비주얼과 매장의 분위기", score: 5 }
            ]
        },
        {
            q: "새로운 메뉴를 도전할 때 나의 태도는?",
            dimension: "SN",
            a: [
                { text: "실패 없는 베스트셀러 메뉴를 고른다", score: 1 },
                { text: "기분에 따라 다르다", score: 3 },
                { text: "안 먹어본 특이한 메뉴를 시도해본다", score: 5 }
            ]
        },
        {
            q: "음식 사진을 찍을 때?",
            dimension: "SN",
            a: [
                { text: "사진은 잘 안 찍고 빨리 먹는다", score: 1 },
                { text: "간단히 한두 장 찍는다", score: 3 },
                { text: "각도 잡고 예쁘게 찍어야 한다", score: 5 }
            ]
        },
        // TF 차원 (3문항)
        {
            q: "친구가 맛없는 식당을 데려갔을 때 나의 반응은?",
            dimension: "TF",
            a: [
                { text: "솔직하게 맛이 좀 아쉽다고 말한다", score: 1 },
                { text: "분위기 봐서 적당히 말한다", score: 3 },
                { text: "데려와 준 정성을 생각해서 괜찮다고 한다", score: 5 }
            ]
        },
        {
            q: "스트레스 받을 때 땡기는 음식은?",
            dimension: "TF",
            a: [
                { text: "매운 떡볶이처럼 자극적이고 화끈한 맛!", score: 1 },
                { text: "그때그때 다르다", score: 3 },
                { text: "달콤한 디저트처럼 기분 좋아지는 맛", score: 5 }
            ]
        },
        {
            q: "음식을 먹을 때 더 중요한 건?",
            dimension: "TF",
            a: [
                { text: "가성비와 실용성", score: 1 },
                { text: "둘 다 적당히", score: 3 },
                { text: "분위기와 감성", score: 5 }
            ]
        },
        // JP 차원 (3문항)
        {
            q: "인기 있는 식당에 갔는데 줄이 너무 길다면?",
            dimension: "JP",
            a: [
                { text: "미리 예약했거나, 다른 계획한 곳으로 간다", score: 5 },
                { text: "상황 봐서 기다리거나 간다", score: 3 },
                { text: "기다리거나 그냥 주변에 보이는 다른 곳에 간다", score: 1 }
            ]
        },
        {
            q: "여행 가서 맛집을 찾을 때?",
            dimension: "JP",
            a: [
                { text: "출발 전에 미리 리스트업 해둔다", score: 5 },
                { text: "몇 개만 체크하고 나머지는 현장에서", score: 3 },
                { text: "현지에서 발품 팔아 찾는다", score: 1 }
            ]
        },
        {
            q: "냉장고에 재료가 있을 때?",
            dimension: "JP",
            a: [
                { text: "유통기한 확인하고 계획적으로 사용한다", score: 5 },
                { text: "대충 뭐가 있나 확인하고 요리한다", score: 3 },
                { text: "그때그때 보이는 대로 해먹는다", score: 1 }
            ]
        }
    ],
    resultLabels: [
        // HIGH/HIGH 조합들
        {
            name: "얼큰한 국밥",
            emoji: "🍲",
            desc: "화끈하고 든든한, 당신은 모두의 소울 푸드!",
            condition: { EI: "high", JP: "high" },
            interpretation: "당신은 실속 있고 정직한 사람입니다. 겉치레보다는 본질을 중요하게 생각하며, 주변 사람들에게 든든한 버팀목이 되어주는 국밥 같은 존재네요.",
            guide: "가끔은 화려한 파인 다이닝 같은 일탈도 즐겨보세요. 당신의 소박함에 우아함이 더해지면 더욱 매력적일 거예요.",
            mood: "happy",
            color: "bg-orange-100",
            matchPoints: ["실속파", "든든함", "정직함"]
        },
        {
            name: "자유로운 비빔밥",
            emoji: "🥗",
            desc: "어디서나 잘 어울리는, 소통의 마법사!",
            condition: { EI: "high", TF: "high" },
            interpretation: "당신은 적응력이 빠르고 조화로운 사람입니다. 다양한 가치를 하나로 묶어내는 능력이 탁월하며, 어떤 상황에서도 최상의 결과를 만들어냅니다.",
            guide: "때로는 본인만의 색깔을 더 강하게 내비쳐도 좋습니다. 개성 있는 고추장처럼 말이죠!",
            mood: "happy",
            color: "bg-green-50",
            matchPoints: ["친화력", "조화", "멀티태스킹"]
        },
        {
            name: "세련된 마카롱",
            emoji: "🍡",
            desc: "달콤하고 화려한, 당신은 분위기의 완성!",
            condition: { SN: "high", TF: "high" },
            interpretation: "당신은 섬세하고 미적 감각이 뛰어난 사람입니다. 작지만 확실한 행복을 찾을 줄 알며, 당신의 등장은 언제나 주변을 밝게 만듭니다.",
            guide: "가끔은 털털한 모습도 보여주세요. 너무 완벽하려 애쓰지 않아도 당신은 충분히 달콤하니까요.",
            mood: "excited",
            color: "bg-pink-100",
            matchPoints: ["섬세함", "트렌디", "미적감각"]
        },
        // LOW/LOW 조합들
        {
            name: "담백한 평양냉면",
            emoji: "🍜",
            desc: "알면 알수록 깊은 맛, 은근한 매력의 소유자!",
            condition: { EI: "low", SN: "low" },
            interpretation: "당신은 주관이 뚜렷하고 내면이 깊은 사람입니다. 처음엔 차가워 보일 수 있지만, 그 담백하고 깊은 진심을 아는 사람들은 당신에게 헤어 나오지 못하죠.",
            guide: "자신의 매력을 조금 더 적극적으로 표현해보세요. 당신의 깊은 맛을 모두가 알 수 있도록 말이죠.",
            mood: "cool",
            color: "bg-blue-50",
            matchPoints: ["독립적", "주관뚜렷", "내면성장"]
        },
        {
            name: "정갈한 한정식",
            emoji: "🍱",
            desc: "차분하고 품격 있는, 진정한 어른의 맛!",
            condition: { EI: "low", JP: "high" },
            interpretation: "당신은 질서와 조화를 중시하는 사람입니다. 급하게 서두르기보다 차근차근 준비하는 성격으로, 주변 사람들에게 신뢰를 줍니다.",
            guide: "때로는 즉흥적인 선택도 즐거울 수 있어요. 예상치 못한 맛의 발견이 기다리고 있을지도!",
            mood: "calm",
            color: "bg-stone-100",
            matchPoints: ["사려 깊음", "품격", "신뢰감"]
        },
        // MEDIUM 포함 조합들
        {
            name: "매콤한 떡볶이",
            emoji: "🌶️",
            desc: "자극적이고 중독성 있는, 기분 전환의 대명사!",
            condition: { TF: "low", EI: "medium" },
            interpretation: "당신은 솔직하고 직설적인 사람입니다. 빙빙 돌려 말하기보다 핵심을 찌르는 스타일로, 시원시원한 성격이 매력이에요.",
            guide: "가끔은 부드러운 표현도 시도해보세요. 매운 맛도 순한 맛과 함께할 때 더 빛나니까요.",
            mood: "energetic",
            color: "bg-red-100",
            matchPoints: ["솔직함", "시원함", "에너지"]
        },
        {
            name: "포근한 된장찌개",
            emoji: "🥘",
            desc: "따뜻하고 정겨운, 마음의 안식처!",
            condition: { TF: "high", JP: "medium" },
            interpretation: "당신은 따뜻한 마음을 가진 사람입니다. 주변 사람들을 챙기고 배려하는 성격으로, 함께 있으면 편안해지는 매력이 있어요.",
            guide: "자신을 위한 시간도 꼭 챙기세요. 다른 사람만 챙기다 보면 정작 본인이 지칠 수 있으니까요.",
            mood: "warm",
            color: "bg-amber-100",
            matchPoints: ["따뜻함", "배려심", "안정감"]
        },
        {
            name: "상큼한 냉파스타",
            emoji: "🍝",
            desc: "트렌디하고 감각적인, 새로운 시도의 선구자!",
            condition: { SN: "high", JP: "low" },
            interpretation: "당신은 새로운 것에 열려있고 창의적인 사람입니다. 남들이 가지 않은 길을 개척하며, 독특한 시각으로 세상을 바라봅니다.",
            guide: "기본에 충실한 것도 때로는 필요해요. 클래식의 가치를 알면 더 멋진 퓨전이 탄생하니까요.",
            mood: "creative",
            color: "bg-cyan-100",
            matchPoints: ["창의성", "트렌드", "도전정신"]
        },
        {
            name: "묵직한 삼겹살",
            emoji: "🥓",
            desc: "푸짐하고 넉넉한, 분위기 메이커!",
            condition: { EI: "high", SN: "low" },
            interpretation: "당신은 사람들과 어울리는 걸 좋아하고 실속을 챙기는 사람입니다. 허세 없이 진심으로 다가가며, 함께 하면 즐거운 사람이에요.",
            guide: "가끔은 특별한 경험에도 투자해보세요. 새로운 맛의 세계가 열릴 수 있어요.",
            mood: "social",
            color: "bg-rose-100",
            matchPoints: ["사교성", "실속", "유쾌함"]
        },
        {
            name: "깔끔한 초밥",
            emoji: "🍣",
            desc: "절제되고 세련된, 미니멀리스트!",
            condition: { EI: "low", TF: "low" },
            interpretation: "당신은 불필요한 것을 덜어내고 본질에 집중하는 사람입니다. 깔끔하고 명료한 것을 좋아하며, 효율적으로 일처리합니다.",
            guide: "때로는 여유를 가지고 과정을 즐겨보세요. 목적지만큼 여정도 중요하니까요.",
            mood: "minimal",
            color: "bg-slate-100",
            matchPoints: ["효율성", "명료함", "절제력"]
        }
    ]
};
