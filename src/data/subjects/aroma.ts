// aroma 테스트 데이터 - 나에게 맞는 아로마 오일 찾기

import { SubjectData } from '../types';

export const aromaData: SubjectData = {
    "title": "나의 아로마 오일 찾기",
    "subtitle": "어떤 향이 나를 힐링해줄까?",
    "themeColor": "bg-green-600",
    "icon": "AromaIcon",
    "testType": "matching",
    "dimensions": {
        "purpose": {
            "name": "목적",
            "emoji": "🎯",
            "desc": "아로마로 어떤 효과를 원하나요"
        },
        "energy": {
            "name": "에너지",
            "emoji": "⚡",
            "desc": "활력이 필요한지 휴식이 필요한지"
        },
        "scent": {
            "name": "향 선호",
            "emoji": "👃",
            "desc": "어떤 계열의 향을 좋아하나요"
        },
        "sensitivity": {
            "name": "민감도",
            "emoji": "🌡️",
            "desc": "향에 얼마나 민감한지"
        },
        "usage": {
            "name": "사용법",
            "emoji": "💧",
            "desc": "어떻게 사용할 건가요"
        }
    },
    "questions": [
        {
            "q": "아로마 오일을 사용하려는 주된 이유는?",
            "dimension": "purpose",
            "a": [
                { "text": "스트레스 해소와 릴렉스", "score": 1 },
                { "text": "집중력 향상과 에너지", "score": 5 }
            ]
        },
        {
            "q": "요즘 가장 필요한 것은?",
            "dimension": "purpose",
            "a": [
                { "text": "마음의 안정과 평화", "score": 1 },
                { "text": "활력과 자신감", "score": 5 }
            ]
        },
        {
            "q": "아로마 테라피에서 기대하는 효과는?",
            "dimension": "purpose",
            "a": [
                { "text": "숙면과 휴식", "score": 1 },
                { "text": "기분 전환과 리프레시", "score": 5 }
            ]
        },
        {
            "q": "평소 에너지 레벨은 어떤 편인가요?",
            "dimension": "energy",
            "a": [
                { "text": "쉽게 피곤해지는 편", "score": 5 },
                { "text": "에너지가 넘치는 편", "score": 1 }
            ]
        },
        {
            "q": "주말에 주로 뭘 하나요?",
            "dimension": "energy",
            "a": [
                { "text": "집에서 휴식", "score": 1 },
                { "text": "활동적으로 외출", "score": 5 }
            ]
        },
        {
            "q": "아침에 일어나면 기분이?",
            "dimension": "energy",
            "a": [
                { "text": "피곤하고 힘들어요", "score": 5 },
                { "text": "개운하고 상쾌해요", "score": 1 }
            ]
        },
        {
            "q": "숲속을 걸을 때 어떤 느낌이 좋아요?",
            "dimension": "scent",
            "a": [
                { "text": "나무와 흙냄새가 좋아요", "score": 5 },
                { "text": "꽃향기가 좋아요", "score": 1 }
            ]
        },
        {
            "q": "허브차 중에 뭘 좋아하나요?",
            "dimension": "scent",
            "a": [
                { "text": "페퍼민트, 로즈마리 (상쾌한)", "score": 5 },
                { "text": "캐모마일, 라벤더 (부드러운)", "score": 1 }
            ]
        },
        {
            "q": "레몬이나 오렌지 같은 시트러스 향은?",
            "dimension": "scent",
            "a": [
                { "text": "상쾌하고 좋아요", "score": 5 },
                { "text": "조금 자극적이에요", "score": 1 }
            ]
        },
        {
            "q": "강한 향을 맡으면 어떤가요?",
            "dimension": "sensitivity",
            "a": [
                { "text": "머리가 아프거나 어지러워요", "score": 1 },
                { "text": "괜찮아요, 좋아해요", "score": 5 }
            ]
        },
        {
            "q": "향수나 방향제에 민감한 편인가요?",
            "dimension": "sensitivity",
            "a": [
                { "text": "네, 조금만 강해도 불편해요", "score": 1 },
                { "text": "아니요, 크게 신경 안 써요", "score": 5 }
            ]
        },
        {
            "q": "처음 맡는 향에 대한 반응은?",
            "dimension": "sensitivity",
            "a": [
                { "text": "조심스럽게 적응해요", "score": 1 },
                { "text": "바로 익숙해져요", "score": 5 }
            ]
        },
        {
            "q": "아로마 오일을 어떻게 사용하고 싶나요?",
            "dimension": "usage",
            "a": [
                { "text": "디퓨저로 공간에 퍼뜨리기", "score": 1 },
                { "text": "마사지 오일로 피부에 바르기", "score": 5 }
            ]
        },
        {
            "q": "목욕할 때 아로마 오일을 쓴다면?",
            "dimension": "usage",
            "a": [
                { "text": "물에 몇 방울 떨어뜨리기", "score": 3 },
                { "text": "향초와 함께 분위기 내기", "score": 3 }
            ]
        }
    ],
    "questions_deep": [
        {
            "q": "불면증이나 수면 문제가 있나요?",
            "dimension": "purpose",
            "a": [
                { "text": "네, 잠들기 어려워요", "score": 1 },
                { "text": "아니요, 잘 자요", "score": 5 }
            ]
        },
        {
            "q": "불안하거나 초조할 때가 많나요?",
            "dimension": "purpose",
            "a": [
                { "text": "네, 자주 그래요", "score": 1 },
                { "text": "아니요, 차분한 편이에요", "score": 5 }
            ]
        },
        {
            "q": "집중이 잘 안 될 때가 많나요?",
            "dimension": "purpose",
            "a": [
                { "text": "네, 산만한 편이에요", "score": 5 },
                { "text": "아니요, 집중 잘해요", "score": 1 }
            ]
        },
        {
            "q": "오후에 졸음이 오나요?",
            "dimension": "energy",
            "a": [
                { "text": "항상 졸려요", "score": 5 },
                { "text": "별로 안 졸려요", "score": 1 }
            ]
        },
        {
            "q": "카페인 없이 하루를 버틸 수 있나요?",
            "dimension": "energy",
            "a": [
                { "text": "절대 불가능해요", "score": 5 },
                { "text": "괜찮아요", "score": 1 }
            ]
        },
        {
            "q": "유칼립투스 향은 어떤가요?",
            "dimension": "scent",
            "a": [
                { "text": "시원하고 좋아요", "score": 5 },
                { "text": "너무 강해요", "score": 1 }
            ]
        },
        {
            "q": "바닐라나 달콤한 향은?",
            "dimension": "scent",
            "a": [
                { "text": "포근하고 좋아요", "score": 1 },
                { "text": "너무 달아요", "score": 5 }
            ]
        },
        {
            "q": "소나무나 삼나무 같은 침엽수 향은?",
            "dimension": "scent",
            "a": [
                { "text": "산림욕 느낌이라 좋아요", "score": 5 },
                { "text": "목재상 냄새 같아요", "score": 1 }
            ]
        },
        {
            "q": "에센셜 오일을 피부에 바른 적 있나요?",
            "dimension": "sensitivity",
            "a": [
                { "text": "네, 문제없었어요", "score": 5 },
                { "text": "따끔거리거나 빨개졌어요", "score": 1 }
            ]
        },
        {
            "q": "알레르기가 있는 편인가요?",
            "dimension": "sensitivity",
            "a": [
                { "text": "네, 여러 가지에 민감해요", "score": 1 },
                { "text": "특별히 없어요", "score": 5 }
            ]
        },
        {
            "q": "롤온 타입 오일을 사용해본 적 있나요?",
            "dimension": "usage",
            "a": [
                { "text": "네, 간편해서 좋아요", "score": 5 },
                { "text": "아니요, 사용해본 적 없어요", "score": 1 }
            ]
        },
        {
            "q": "아로마 디퓨저가 있나요?",
            "dimension": "usage",
            "a": [
                { "text": "네, 자주 사용해요", "score": 1 },
                { "text": "없어요", "score": 5 }
            ]
        },
        {
            "q": "명상이나 요가를 하나요?",
            "dimension": "purpose",
            "a": [
                { "text": "네, 정기적으로 해요", "score": 1 },
                { "text": "관심은 있지만 안 해요", "score": 3 }
            ]
        },
        {
            "q": "자연에서 시간 보내는 걸 좋아하나요?",
            "dimension": "scent",
            "a": [
                { "text": "네, 자연이 좋아요", "score": 5 },
                { "text": "도시가 더 편해요", "score": 1 }
            ]
        },
        {
            "q": "향기 있는 입욕제를 좋아하나요?",
            "dimension": "usage",
            "a": [
                { "text": "네, 목욕 시간이 행복해져요", "score": 3 },
                { "text": "샤워로 충분해요", "score": 3 }
            ]
        },
        {
            "q": "두통이 자주 있나요?",
            "dimension": "sensitivity",
            "a": [
                { "text": "네, 자주 있어요", "score": 1 },
                { "text": "거의 없어요", "score": 5 }
            ]
        },
        {
            "q": "생리통이나 근육통이 있나요?",
            "dimension": "purpose",
            "a": [
                { "text": "네, 종종 있어요", "score": 3 },
                { "text": "별로 없어요", "score": 3 }
            ]
        },
        {
            "q": "컴퓨터/스마트폰 사용 시간이 긴가요?",
            "dimension": "energy",
            "a": [
                { "text": "네, 눈이 자주 피로해요", "score": 5 },
                { "text": "적당히 사용해요", "score": 1 }
            ]
        },
        {
            "q": "재택근무/자택 시간이 긴가요?",
            "dimension": "usage",
            "a": [
                { "text": "네, 집에서 많이 지내요", "score": 1 },
                { "text": "외출이 잦아요", "score": 5 }
            ]
        },
        {
            "q": "감기에 자주 걸리나요?",
            "dimension": "sensitivity",
            "a": [
                { "text": "면역력이 약한 편이에요", "score": 1 },
                { "text": "건강한 편이에요", "score": 5 }
            ]
        }
    ],
    "resultLabels": [
        {
            "name": "라벤더",
            "emoji": "💜",
            "desc": "편안한 휴식과 숙면을 위한 힐링",
            "condition": { "purpose": "low", "energy": "low", "sensitivity": "low" },
            "mood": "happy",
            "color": "bg-purple-300",
            "interpretation": "가장 대표적인 릴렉스 오일! 스트레스 해소와 숙면에 최고예요. 은은하고 부드러운 플로럴 향이 긴장을 풀어주고 마음을 안정시켜줘요. 향에 민감한 분도 부담 없이 사용할 수 있어요.",
            "guide": "잠들기 30분 전 디퓨저에 3-4방울, 또는 베개에 1방울 떨어뜨려보세요. 입욕제에 섞어 사용하면 릴렉스 효과가 배가돼요.",
            "matchPoints": ["스트레스가 많은 분", "잠들기 어려운 분", "처음 아로마를 시작하는 분", "부드러운 향을 좋아하는 분"]
        },
        {
            "name": "페퍼민트",
            "emoji": "🌿",
            "desc": "상쾌한 각성과 집중력 향상",
            "condition": { "purpose": "high", "energy": "high", "scent": "high" },
            "mood": "cool",
            "color": "bg-green-400",
            "interpretation": "피로하고 졸릴 때 확 깨어나게 해주는 상쾌한 민트향! 공부나 업무 중 집중력을 높여주고, 두통 완화에도 효과가 있어요. 여름철 더위에도 시원한 느낌을 줘요.",
            "guide": "관자놀이에 희석해서 바르거나, 디퓨저로 사용하세요. 롤온 타입으로 휴대하며 필요할 때 사용하기 좋아요. 눈 주위는 피해주세요!",
            "matchPoints": ["집중력이 필요한 분", "오후에 졸린 분", "두통이 있는 분", "시원한 향을 좋아하는 분"]
        },
        {
            "name": "유칼립투스",
            "emoji": "🌲",
            "desc": "호흡기 케어와 청량한 리프레시",
            "condition": { "scent": "high", "sensitivity": "high", "purpose": "high" },
            "mood": "cool",
            "color": "bg-teal-400",
            "interpretation": "코가 막히거나 호흡기가 불편할 때 시원하게 뚫어주는 청량한 향! 감기 시즌에 특히 좋고, 공기 정화 효과도 있어요. 집중력 향상에도 도움이 돼요.",
            "guide": "스팀 흡입으로 사용하거나 디퓨저에 뿌려주세요. 페퍼민트와 블렌딩하면 효과가 더 좋아요. 어린이나 임산부는 주의하세요.",
            "matchPoints": ["호흡기가 약한 분", "환절기에 자주 아픈 분", "청량한 향을 좋아하는 분", "공기 정화가 필요한 분"]
        },
        {
            "name": "티트리",
            "emoji": "🍃",
            "desc": "피부 트러블과 항균 케어",
            "condition": { "usage": "high", "sensitivity": "high", "purpose": "medium" },
            "mood": "cool",
            "color": "bg-green-600",
            "interpretation": "피부 트러블이나 상처에 효과적인 천연 항균 오일! 여드름, 무좀, 비듬 등 다양한 피부 문제에 사용할 수 있어요. 살균 효과가 뛰어나 청소에도 활용 가능해요.",
            "guide": "트러블 부위에 면봉으로 소량 바르거나, 샴푸에 1-2방울 섞어 사용하세요. 희석 없이 사용 가능하지만 넓은 부위는 캐리어 오일에 희석하세요.",
            "matchPoints": ["피부 트러블이 있는 분", "천연 항균제를 원하는 분", "청소에 활용하고 싶은 분", "지성 피부인 분"]
        },
        {
            "name": "로즈마리",
            "emoji": "🌿",
            "desc": "기억력 향상과 정신 맑음",
            "condition": { "purpose": "high", "energy": "high", "scent": "medium" },
            "mood": "happy",
            "color": "bg-green-500",
            "interpretation": "허브 중에서도 두뇌 활성화에 최고! 공부하거나 중요한 일을 앞두고 있을 때 기억력과 집중력을 높여줘요. 상쾌하면서도 따뜻한 허브향이 머리를 맑게 해줘요.",
            "guide": "공부방이나 사무실에서 디퓨저로 사용하세요. 페퍼민트와 블렌딩하면 각성 효과가 더 강해져요. 시험 전날 추천!",
            "matchPoints": ["수험생, 학생", "기억력 향상이 필요한 분", "허브향을 좋아하는 분", "두뇌 활동이 많은 분"]
        },
        {
            "name": "캐모마일",
            "emoji": "🌼",
            "desc": "진정과 피부 케어의 만능 오일",
            "condition": { "purpose": "low", "sensitivity": "low", "scent": "low" },
            "mood": "happy",
            "color": "bg-yellow-200",
            "interpretation": "마음을 진정시키고 피부도 케어하는 부드러운 오일! 예민하고 민감한 피부에도 안심하고 사용할 수 있어요. 스트레스로 인한 소화불량에도 도움이 돼요.",
            "guide": "불안할 때 향을 맡거나, 캐리어 오일에 희석해 마사지하세요. 라벤더와 블렌딩하면 릴렉스 효과가 극대화돼요.",
            "matchPoints": ["민감한 피부를 가진 분", "불안감이 있는 분", "소화가 잘 안 되는 분", "아이가 있는 가정"]
        },
        {
            "name": "레몬",
            "emoji": "🍋",
            "desc": "기분 전환과 공기 정화",
            "condition": { "scent": "high", "energy": "medium", "usage": "low" },
            "mood": "happy",
            "color": "bg-yellow-300",
            "interpretation": "우울할 때 기분을 밝게 해주는 상큼한 시트러스 향! 공기 정화와 탈취에도 효과적이에요. 아침에 사용하면 하루를 상쾌하게 시작할 수 있어요.",
            "guide": "디퓨저나 스프레이로 공간에 뿌려주세요. 청소할 때 물에 섞어 사용하면 항균 효과도 있어요. 피부에 바른 후 햇빛은 피하세요!",
            "matchPoints": ["기분 전환이 필요한 분", "집 냄새가 신경 쓰이는 분", "상쾌한 향을 좋아하는 분", "아침에 활력이 필요한 분"]
        },
        {
            "name": "오렌지 스위트",
            "emoji": "🍊",
            "desc": "따뜻한 행복감과 긴장 완화",
            "condition": { "energy": "low", "scent": "medium", "sensitivity": "medium" },
            "mood": "excited",
            "color": "bg-orange-300",
            "interpretation": "달콤하고 따뜻한 오렌지향이 행복한 기분을 줘요! 긴장을 풀어주면서도 우울함을 덜어줘요. 아이들도 좋아하는 친근한 향이에요.",
            "guide": "디퓨저에 사용하거나 마사지 오일에 블렌딩하세요. 라벤더와 섞으면 릴렉스, 시나몬과 섞으면 따뜻한 느낌이 나요. 겨울에 특히 좋아요.",
            "matchPoints": ["행복한 기분을 원하는 분", "긴장을 많이 하는 분", "달콤한 향을 좋아하는 분", "아이가 있는 가정"]
        },
        {
            "name": "일랑일랑",
            "emoji": "🌺",
            "desc": "로맨틱한 분위기와 호르몬 밸런스",
            "condition": { "purpose": "low", "scent": "low", "sensitivity": "medium" },
            "mood": "excited",
            "color": "bg-pink-300",
            "interpretation": "달콤하고 이국적인 플로럴 향이 로맨틱한 분위기를 만들어요. 스트레스와 긴장 완화, 호르몬 밸런스 조절에 도움이 돼요. 특별한 날에 사용하면 좋아요.",
            "guide": "디퓨저에 소량 사용하거나 마사지 오일에 블렌딩하세요. 향이 강하니 1-2방울만 사용하세요. 저혈압인 분은 주의하세요.",
            "matchPoints": ["로맨틱한 분위기를 원하는 분", "PMS 증상이 있는 분", "이국적인 향을 좋아하는 분", "스트레스가 많은 분"]
        },
        {
            "name": "프랑킨센스",
            "emoji": "🕯️",
            "desc": "명상과 피부 재생을 위한 고급 오일",
            "condition": { "purpose": "low", "usage": "medium", "scent": "high" },
            "mood": "cool",
            "color": "bg-amber-600",
            "interpretation": "명상과 영적 힐링에 사용되어온 신성한 향! 피부 재생과 안티에이징에도 효과적이에요. 깊고 차분한 향이 마음을 정화시켜줘요.",
            "guide": "명상 시 디퓨저에 사용하거나, 스킨케어 오일에 섞어 사용하세요. 페이셜 오일에 1-2방울 추가하면 피부 탄력에 좋아요.",
            "matchPoints": ["명상이나 요가를 하는 분", "안티에이징에 관심 있는 분", "깊고 우디한 향을 좋아하는 분", "프리미엄 오일을 원하는 분"]
        },
        {
            "name": "제라늄",
            "emoji": "🌸",
            "desc": "피부 밸런스와 호르몬 조절",
            "condition": { "usage": "high", "sensitivity": "medium", "purpose": "low" },
            "mood": "happy",
            "color": "bg-pink-400",
            "interpretation": "로즈와 비슷하지만 더 가벼운 플로럴 향! 피지 밸런스를 잡아주고 호르몬 조절에 도움이 돼요. 여성 건강에 특히 좋은 오일이에요.",
            "guide": "페이스 오일이나 바디 로션에 섞어 사용하세요. 생리 전 증후군(PMS)에 복부 마사지로 활용해보세요.",
            "matchPoints": ["지성/복합성 피부인 분", "PMS 증상이 있는 분", "장미향을 좋아하는 분", "스킨케어에 활용하고 싶은 분"]
        },
        {
            "name": "시더우드",
            "emoji": "🪵",
            "desc": "안정감과 두피 케어",
            "condition": { "scent": "high", "energy": "low", "purpose": "medium" },
            "mood": "cool",
            "color": "bg-amber-800",
            "interpretation": "삼나무의 따뜻하고 우디한 향이 마음을 안정시켜줘요. 두피 건강과 탈모 예방에도 효과가 있어요. 남성들도 부담 없이 사용할 수 있는 향이에요.",
            "guide": "샴푸에 2-3방울 섞어 두피 마사지를 해주세요. 디퓨저에 라벤더와 블렌딩하면 숙면에 좋아요.",
            "matchPoints": ["두피 고민이 있는 분", "우디한 향을 좋아하는 분", "안정감이 필요한 분", "남성분"]
        }
    ]
};
