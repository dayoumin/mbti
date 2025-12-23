// drinkingStyle 테스트 데이터
// 생성일: 2025-12-23

export const DRINKING_STYLE_DATA = {
    title: "음주 유형 테스트",
    subtitle: "나의 음주 스타일은?",
    themeColor: "bg-amber-100",
    icon: "DrinkingStyleIcon",
    testType: "personality",
    dimensions: {
        capacity: {
            name: "주량",
            emoji: "🍺",
            desc: "술을 마시는 양과 속도"
        },
        mood: {
            name: "분위기",
            emoji: "🎵",
            desc: "선호하는 술자리 분위기"
        },
        snack: {
            name: "안주 선호",
            emoji: "🍖",
            desc: "안주에 대한 관심도"
        },
        social: {
            name: "사교성",
            emoji: "🎉",
            desc: "술자리에서의 사회성"
        },
        pace: {
            name: "페이스",
            emoji: "⏱️",
            desc: "술자리 지속 시간과 리듬"
        }
    },
    questions: [
        // capacity (주량) 차원 - 3문항
        {
            q: "술자리에서 나의 주량은?",
            dimension: "capacity",
            a: [
                { text: "소주 2병 이상도 거뜬! 난 주당이다", score: 5 },
                { text: "소주 1병 정도면 적당해", score: 3 },
                { text: "맥주 1-2캔이면 충분해", score: 1 }
            ]
        },
        {
            q: "술을 마시는 속도는?",
            dimension: "capacity",
            a: [
                { text: "원샷! 빠르게 비우는 편", score: 5 },
                { text: "대화하면서 천천히 마신다", score: 3 },
                { text: "한 잔을 오래 붙잡고 있는다", score: 1 }
            ]
        },
        {
            q: "다음날 일이 있을 때 술자리는?",
            dimension: "capacity",
            a: [
                { text: "상관없어! 내일은 내일의 내가 해결할 거야", score: 5 },
                { text: "평소보다 조금 덜 마신다", score: 3 },
                { text: "아예 안 마시거나 정말 조금만", score: 1 }
            ]
        },
        // mood (분위기) 차원 - 3문항
        {
            q: "선호하는 술자리 분위기는?",
            dimension: "mood",
            a: [
                { text: "클럽이나 펍처럼 시끌벅적한 곳", score: 5 },
                { text: "적당히 음악 나오는 일반 술집", score: 3 },
                { text: "조용한 바나 와인바", score: 1 }
            ]
        },
        {
            q: "술자리에서 음악이나 게임을 하자고 하면?",
            dimension: "mood",
            a: [
                { text: "좋아! 신나는 거 다 해보자", score: 5 },
                { text: "분위기 따라 적당히 즐긴다", score: 3 },
                { text: "그냥 대화만 하고 싶은데...", score: 1 }
            ]
        },
        {
            q: "친구가 '2차 가자'고 하면?",
            dimension: "mood",
            a: [
                { text: "당연하지! 3차, 4차도 가능!", score: 5 },
                { text: "분위기 좋으면 2차까지는 OK", score: 3 },
                { text: "1차로 끝내고 싶은데...", score: 1 }
            ]
        },
        // snack (안주 선호) 차원 - 3문항
        {
            q: "술자리에서 안주를 주문할 때 나는?",
            dimension: "snack",
            a: [
                { text: "메뉴판 전부 시켜! 배부르게 먹는다", score: 5 },
                { text: "대충 몇 개 시켜서 나눠 먹는다", score: 3 },
                { text: "간단한 안주만 조금", score: 1 }
            ]
        },
        {
            q: "술자리에서 '술이 먼저냐 안주가 먼저냐'?",
            dimension: "snack",
            a: [
                { text: "안주가 메인! 술은 곁들이는 거지", score: 5 },
                { text: "둘 다 중요해, 균형있게", score: 3 },
                { text: "술이 메인! 안주는 적당히만", score: 1 }
            ]
        },
        {
            q: "집에서 혼술할 때 안주는?",
            dimension: "snack",
            a: [
                { text: "치킨이나 제대로 된 안주 주문!", score: 5 },
                { text: "간편식이나 과자 정도", score: 3 },
                { text: "안주 없이 그냥 마신다", score: 1 }
            ]
        },
        // social (사교성) 차원 - 3문항
        {
            q: "술자리에서 처음 보는 사람들과 함께라면?",
            dimension: "social",
            a: [
                { text: "좋아! 새로운 사람 만나는 거 즐거워", score: 5 },
                { text: "어색하지만 적당히 어울린다", score: 3 },
                { text: "불편해... 아는 사람만 있는 게 좋아", score: 1 }
            ]
        },
        {
            q: "술자리에서 나의 역할은?",
            dimension: "social",
            a: [
                { text: "분위기 메이커! 내가 술자리를 살린다", score: 5 },
                { text: "적당히 대화하고 웃어준다", score: 3 },
                { text: "주로 듣는 편, 조용히 있는다", score: 1 }
            ]
        },
        {
            q: "회식 자리에서 상사와 술을 마실 때?",
            dimension: "social",
            a: [
                { text: "적극적으로 대화하고 관계 쌓는다", score: 5 },
                { text: "필요한 만큼만 대화한다", score: 3 },
                { text: "최대한 조용히, 빨리 끝나길 바란다", score: 1 }
            ]
        },
        // pace (페이스) 차원 - 3문항
        {
            q: "술자리는 보통 몇 시간?",
            dimension: "pace",
            a: [
                { text: "4시간 이상! 밤새도록 가능", score: 5 },
                { text: "2-3시간 정도가 적당해", score: 3 },
                { text: "1-2시간이면 충분해", score: 1 }
            ]
        },
        {
            q: "술자리 후 다음날 아침에는?",
            dimension: "pace",
            a: [
                { text: "숙취? 해장하고 다시 출발!", score: 5 },
                { text: "조금 힘들지만 일상 가능", score: 3 },
                { text: "하루 종일 누워있어야 해...", score: 1 }
            ]
        },
        {
            q: "한 주에 술을 마시는 빈도는?",
            dimension: "pace",
            a: [
                { text: "주 3-4회 이상, 거의 매일", score: 5 },
                { text: "주 1-2회 정도", score: 3 },
                { text: "한 달에 1-2회 정도", score: 1 }
            ]
        }
    ],
    resultLabels: [
        {
            name: "분위기 메이커",
            emoji: "🎉",
            desc: "술자리의 해! 당신이 있어야 파티가 시작된다",
            condition: { social: "high", mood: "high" },
            mood: "excited",
            color: "bg-yellow-300",
            interpretation: "당신은 술자리의 중심! 어디를 가든 분위기를 살리는 타고난 엔터테이너입니다. 사람들과 어울리며 에너지를 얻고, 시끌벅적한 분위기를 즐깁니다.",
            guide: "너무 무리하면 다음날이 힘들 수 있어요. 가끔은 조용한 술자리도 즐겨보세요.",
            matchPoints: [
                "항상 술자리가 즐겁고 신나는 분",
                "새로운 사람 만나는 걸 좋아하는 분",
                "에너지 넘치는 파티를 원하는 분"
            ]
        },
        {
            name: "폭탄주 마스터",
            emoji: "💥",
            desc: "원샷의 정석! 주량과 속도를 자랑하는 주당",
            condition: { capacity: "high", pace: "high" },
            mood: "confident",
            color: "bg-red-300",
            interpretation: "당신은 타고난 주당! 빠른 속도로 많은 양을 마시며, 오랜 시간 술자리를 이어갑니다. 술에 대한 자신감이 넘치네요.",
            guide: "건강을 위해 휴간일을 가지세요. 속도 조절도 중요합니다!",
            matchPoints: [
                "술을 진짜 좋아하는 분",
                "밤새 놀 체력이 있는 분",
                "친구들과 오래 즐기고 싶은 분"
            ]
        },
        {
            name: "조용한 음미파",
            emoji: "🍷",
            desc: "천천히, 깊이 있게 술을 즐기는 감성파",
            condition: { mood: "low", social: "low" },
            mood: "calm",
            color: "bg-purple-300",
            interpretation: "당신은 술을 음미하는 진정한 미식가! 조용한 분위기에서 천천히 대화하며 술을 즐기는 것을 선호합니다.",
            guide: "가끔은 새로운 술과 분위기에 도전해보는 것도 좋아요!",
            matchPoints: [
                "조용한 대화를 원하는 분",
                "술의 맛을 제대로 즐기고 싶은 분",
                "여유로운 분위기를 좋아하는 분"
            ]
        },
        {
            name: "안주 먼저파",
            emoji: "🍖",
            desc: "술보다 음식이 먼저! 맛집 탐방러",
            condition: { snack: "high", pace: "low" },
            mood: "happy",
            color: "bg-orange-300",
            interpretation: "당신에게 술자리는 곧 맛집 투어! 술은 음식을 더 맛있게 먹기 위한 수단입니다. 다양한 안주를 시켜 먹는 것이 가장 큰 즐거움이죠.",
            guide: "술자리가 아닌 맛집 투어로 친구들을 모아보는 건 어떨까요?",
            matchPoints: [
                "맛있는 음식을 좋아하는 분",
                "술은 적당히만 하는 분",
                "안주 메뉴 고르는 재미가 있는 분"
            ]
        },
        {
            name: "1차로 끝내는 타입",
            emoji: "🏠",
            desc: "딱 1차만! 적당히 즐기고 집 가는 현명한 타입",
            condition: { pace: "low", capacity: "low" },
            mood: "relaxed",
            color: "bg-blue-300",
            interpretation: "당신은 효율적인 음주가! 1-2시간 정도 적당히 즐기고 깔끔하게 마무리합니다. 다음날을 생각하는 현명한 선택이죠.",
            guide: "가끔은 2차도 괜찮아요! 친구들과 더 깊은 대화를 나눠보세요.",
            matchPoints: [
                "다음날 일정이 중요한 분",
                "술은 가볍게만 즐기는 분",
                "집이 최고인 분"
            ]
        },
        {
            name: "밤새 달리는 타입",
            emoji: "🌙",
            desc: "해 뜰 때까지! 끝을 모르는 야행성 주당",
            condition: { pace: "high", social: "high" },
            mood: "energetic",
            color: "bg-indigo-300",
            interpretation: "당신은 밤의 제왕! 술자리가 길어질수록 더 신나고, 사람들과 어울릴수록 에너지가 충전됩니다. 새벽까지 이어지는 술자리를 즐기죠.",
            guide: "체력 관리와 건강 체크를 잊지 마세요. 가끔은 일찍 자는 것도 필요해요!",
            matchPoints: [
                "체력이 좋은 분",
                "밤 문화를 즐기는 분",
                "친구들과 오래 놀고 싶은 분"
            ]
        },
        {
            name: "소셜 드링커",
            emoji: "🤝",
            desc: "네트워킹의 달인! 관계를 쌓는 전략가",
            condition: { social: "high", capacity: "medium" },
            mood: "friendly",
            color: "bg-green-300",
            interpretation: "당신은 술자리를 인맥 관리의 기회로 활용합니다. 새로운 사람들을 만나고 관계를 쌓는 것을 즐기며, 적당한 주량으로 컨디션을 유지하죠.",
            guide: "진심어린 관계도 중요해요. 가끔은 업무 생각 내려놓고 편하게 즐겨보세요.",
            matchPoints: [
                "인맥 관리가 중요한 분",
                "새로운 사람 만나는 걸 즐기는 분",
                "술자리를 잘 활용하고 싶은 분"
            ]
        },
        {
            name: "혼술 마스터",
            emoji: "🎧",
            desc: "나만의 시간! 혼자 즐기는 여유파",
            condition: { social: "low", snack: "medium" },
            mood: "peaceful",
            color: "bg-teal-300",
            interpretation: "당신은 혼자만의 술자리를 즐깁니다. 간단한 안주와 함께 음악을 듣거나 영화를 보며 마시는 술이 최고죠. 누군가와의 약속보다 나만의 시간이 더 소중합니다.",
            guide: "가끔은 친구들과 함께하는 술자리도 좋아요. 새로운 재미를 발견할 수 있습니다!",
            matchPoints: [
                "혼자만의 시간이 필요한 분",
                "집에서 편하게 쉬고 싶은 분",
                "사람 많은 곳이 부담스러운 분"
            ]
        },
        {
            name: "건전한 음주가",
            emoji: "⭐",
            desc: "적당히가 최고! 균형 잡힌 음주 철학자",
            condition: { capacity: "medium", pace: "medium", social: "medium" },
            mood: "balanced",
            color: "bg-lime-300",
            interpretation: "당신은 모든 면에서 균형 잡힌 음주를 즐깁니다. 너무 많지도 적지도 않게, 적당한 시간 동안, 편안한 사람들과 즐기는 것이 당신의 스타일이죠.",
            guide: "완벽해요! 지금처럼만 계속하세요. 가끔 새로운 시도도 재미있을 거예요.",
            matchPoints: [
                "건강을 생각하는 분",
                "적당히가 좋은 분",
                "술자리를 가볍게 즐기는 분"
            ]
        },
        {
            name: "미식가 음주파",
            emoji: "🍽️",
            desc: "술과 음식의 페어링! 진정한 미식가",
            condition: { snack: "high", social: "low" },
            mood: "sophisticated",
            color: "bg-rose-300",
            interpretation: "당신은 술과 음식의 조화를 중시합니다. 어떤 술에 어떤 안주가 어울리는지, 맛의 밸런스를 생각하며 즐기는 진정한 미식가입니다.",
            guide: "다양한 술집과 안주를 탐방하며 당신만의 베스트 조합을 찾아보세요!",
            matchPoints: [
                "음식 페어링에 관심 있는 분",
                "새로운 맛집을 찾는 분",
                "술과 음식 모두 중요한 분"
            ]
        }
    ]
};
