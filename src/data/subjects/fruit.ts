// fruit 테스트 데이터

import { SubjectData } from '../types';

export const fruitData: SubjectData = {
    "title": "나의 과일 찾기",
    "subtitle": "어떤 과일이 나와 맞을까?",
    "themeColor": "bg-orange-500",
    "icon": "FruitIcon",
    "testType": "matching",
    "dimensions": {
        "sweet": {
            "name": "단맛",
            "emoji": "🍬",
            "desc": "단맛을 얼마나 좋아하나요"
        },
        "sour": {
            "name": "신맛",
            "emoji": "🍋",
            "desc": "신맛을 얼마나 좋아하나요"
        },
        "texture": {
            "name": "식감",
            "emoji": "🦷",
            "desc": "아삭한 vs 부드러운 식감"
        },
        "convenience": {
            "name": "편의성",
            "emoji": "✂️",
            "desc": "먹기 편한 정도"
        },
        "season": {
            "name": "계절",
            "emoji": "🌸",
            "desc": "선호하는 계절감"
        }
    },
    "questions": [
        {
            "q": "과일의 단맛에 대해 어떻게 생각하세요?",
            "dimension": "sweet",
            "a": [
                { "text": "달아야 맛있어요!", "score": 5 },
                { "text": "적당히 달면 좋아요", "score": 3 },
                { "text": "너무 달면 물려요", "score": 1 }
            ]
        },
        {
            "q": "디저트로 과일을 먹을 때?",
            "dimension": "sweet",
            "a": [
                { "text": "달콤한 과일이 최고!", "score": 5 },
                { "text": "상큼한 과일이 좋아요", "score": 1 }
            ]
        },
        {
            "q": "신맛이 나는 과일에 대해?",
            "dimension": "sour",
            "a": [
                { "text": "새콤한 맛이 좋아요!", "score": 5 },
                { "text": "신맛은 별로예요", "score": 1 }
            ]
        },
        {
            "q": "레몬이나 자몽 같은 과일은?",
            "dimension": "sour",
            "a": [
                { "text": "좋아요, 상쾌해요", "score": 5 },
                { "text": "너무 셔서 못 먹어요", "score": 1 }
            ]
        },
        {
            "q": "과일의 식감은 어떤 게 좋아요?",
            "dimension": "texture",
            "a": [
                { "text": "아삭아삭한 게 좋아요", "score": 5 },
                { "text": "둘 다 좋아요", "score": 3 },
                { "text": "부드러운 게 좋아요", "score": 1 }
            ]
        },
        {
            "q": "사과와 바나나 중 선택한다면?",
            "dimension": "texture",
            "a": [
                { "text": "아삭한 사과!", "score": 5 },
                { "text": "부드러운 바나나!", "score": 1 }
            ]
        },
        {
            "q": "과일 먹을 때 깎거나 손질하는 건?",
            "dimension": "convenience",
            "a": [
                { "text": "귀찮아요, 바로 먹고 싶어요", "score": 1 },
                { "text": "괜찮아요, 맛있으면 돼요", "score": 5 }
            ]
        },
        {
            "q": "껍질째 먹을 수 있는 과일 vs 깎아야 하는 과일?",
            "dimension": "convenience",
            "a": [
                { "text": "껍질째 먹는 게 좋아요", "score": 1 },
                { "text": "깎아 먹는 것도 좋아요", "score": 5 }
            ]
        },
        {
            "q": "어떤 계절의 과일을 좋아하세요?",
            "dimension": "season",
            "a": [
                { "text": "여름 과일이 좋아요 (수박, 참외)", "score": 1 },
                { "text": "봄/가을 과일도 좋아요", "score": 3 },
                { "text": "겨울 과일이 좋아요 (귤, 딸기)", "score": 5 }
            ]
        },
        {
            "q": "제철 과일을 꼭 챙겨 먹는 편인가요?",
            "dimension": "season",
            "a": [
                { "text": "네, 제철이 최고예요", "score": 5 },
                { "text": "상관없이 먹고 싶은 거 먹어요", "score": 1 }
            ]
        },
        {
            "q": "과일을 얼마나 자주 먹나요?",
            "dimension": "sweet",
            "a": [
                { "text": "매일 먹어요, 과일 러버!", "score": 5 },
                { "text": "가끔 먹어요", "score": 1 }
            ]
        },
        {
            "q": "과일 주스와 생과일 중?",
            "dimension": "texture",
            "a": [
                { "text": "생과일로 씹어 먹어야죠", "score": 5 },
                { "text": "주스로 편하게 마셔요", "score": 1 }
            ]
        }
    ],
    "questions_deep": [
        {
            "q": "열대 과일(망고, 파인애플 등)을 좋아하나요?",
            "dimension": "sweet",
            "a": [
                { "text": "네, 달콤해서 좋아요", "score": 5 },
                { "text": "향이 너무 강해요", "score": 1 }
            ]
        },
        {
            "q": "과일에 설탕이나 연유를 뿌려 먹나요?",
            "dimension": "sweet",
            "a": [
                { "text": "가끔 뿌려 먹어요", "score": 5 },
                { "text": "과일 그대로가 좋아요", "score": 1 }
            ]
        },
        {
            "q": "청포도와 거봉 중 선택한다면?",
            "dimension": "sour",
            "a": [
                { "text": "새콤한 청포도!", "score": 5 },
                { "text": "달콤한 거봉!", "score": 1 }
            ]
        },
        {
            "q": "오렌지나 귤의 신맛은?",
            "dimension": "sour",
            "a": [
                { "text": "새콤한 게 맛있어요", "score": 5 },
                { "text": "단 것만 골라 먹어요", "score": 1 }
            ]
        },
        {
            "q": "복숭아는 딱딱한 것 vs 물렁한 것?",
            "dimension": "texture",
            "a": [
                { "text": "딱복(딱딱한 복숭아)!", "score": 5 },
                { "text": "물복(물렁 복숭아)!", "score": 1 }
            ]
        },
        {
            "q": "과일 통조림을 먹나요?",
            "dimension": "texture",
            "a": [
                { "text": "안 먹어요, 식감이...", "score": 5 },
                { "text": "부드럽고 달아서 좋아요", "score": 1 }
            ]
        },
        {
            "q": "수박 한 통을 사서 먹는 건?",
            "dimension": "convenience",
            "a": [
                { "text": "귀찮아요, 컵과일이 좋아요", "score": 1 },
                { "text": "괜찮아요, 맛있으니까!", "score": 5 }
            ]
        },
        {
            "q": "석류나 석류 같은 까다로운 과일은?",
            "dimension": "convenience",
            "a": [
                { "text": "귀찮아서 안 먹어요", "score": 1 },
                { "text": "맛있으면 수고로움도 OK", "score": 5 }
            ]
        },
        {
            "q": "딸기는 언제 먹어야 맛있나요?",
            "dimension": "season",
            "a": [
                { "text": "겨울~봄 제철에!", "score": 5 },
                { "text": "언제든 먹고 싶을 때", "score": 1 }
            ]
        },
        {
            "q": "한여름에 귤을 사 먹나요?",
            "dimension": "season",
            "a": [
                { "text": "아니요, 제철 아닐 때는 안 먹어요", "score": 5 },
                { "text": "먹고 싶으면 사 먹어요", "score": 1 }
            ]
        },
        {
            "q": "과일 빙수나 과일 케이크를 좋아하나요?",
            "dimension": "sweet",
            "a": [
                { "text": "과일 디저트 최고!", "score": 5 },
                { "text": "과일은 그냥 먹는 게 좋아요", "score": 1 }
            ]
        },
        {
            "q": "덜 익은 과일 vs 잘 익은 과일?",
            "dimension": "sour",
            "a": [
                { "text": "덜 익어서 아삭하고 새콤한 게 좋아요", "score": 5 },
                { "text": "잘 익어서 달콤한 게 좋아요", "score": 1 }
            ]
        },
        {
            "q": "키위는 어떻게 먹나요?",
            "dimension": "convenience",
            "a": [
                { "text": "반 잘라서 숟가락으로", "score": 1 },
                { "text": "깎아서 썰어 먹어요", "score": 5 }
            ]
        },
        {
            "q": "과일 향이 나는 제품(향수, 화장품 등)을 좋아하나요?",
            "dimension": "sweet",
            "a": [
                { "text": "네, 달콤한 향 좋아요", "score": 5 },
                { "text": "별로 안 좋아해요", "score": 1 }
            ]
        },
        {
            "q": "과일을 얼려서 먹는 건?",
            "dimension": "texture",
            "a": [
                { "text": "아삭하고 시원해서 좋아요", "score": 5 },
                { "text": "너무 딱딱해요", "score": 1 }
            ]
        },
        {
            "q": "배를 좋아하나요?",
            "dimension": "texture",
            "a": [
                { "text": "아삭하고 시원해서 좋아요", "score": 5 },
                { "text": "별로 안 좋아해요", "score": 1 }
            ]
        },
        {
            "q": "감을 좋아하나요?",
            "dimension": "sweet",
            "a": [
                { "text": "달콤해서 좋아요", "score": 5 },
                { "text": "떫은맛이 싫어요", "score": 1 }
            ]
        },
        {
            "q": "과일 선물 세트를 받으면?",
            "dimension": "convenience",
            "a": [
                { "text": "기뻐요, 맛있게 먹어요", "score": 5 },
                { "text": "처리하기 귀찮아요", "score": 1 }
            ]
        }
    ],
    "resultLabels": [
        {
            "name": "달콤한 딸기",
            "emoji": "🍓",
            "desc": "달콤하고 사랑받는 인기 스타",
            "condition": { "sweet": "high", "sour": "low", "texture": "low" },
            "mood": "excited",
            "color": "bg-red-400",
            "interpretation": "달콤함의 대명사 딸기가 당신의 과일이에요! 부드럽고 달콤한 맛을 좋아하는 당신. 디저트에도 잘 어울리고, 모든 사람에게 사랑받는 과일이죠.",
            "guide": "딸기는 겨울~봄이 제철이에요. 생딸기, 딸기 케이크, 딸기 우유 등 다양하게 즐겨보세요. 씻을 때 꼭지 떼지 말고 씻으면 영양소 보존에 좋아요!",
            "matchPoints": ["달콤한 맛을 좋아하는 분", "부드러운 식감을 선호하는 분", "디저트를 좋아하는 분", "인기 많은 과일을 원하는 분"]
        },
        {
            "name": "상큼한 오렌지",
            "emoji": "🍊",
            "desc": "새콤달콤 비타민 폭탄",
            "condition": { "sour": "high", "sweet": "medium", "convenience": "low" },
            "mood": "happy",
            "color": "bg-orange-400",
            "interpretation": "상큼한 오렌지가 당신의 과일! 새콤달콤한 맛의 균형을 좋아하고, 편하게 먹을 수 있는 과일을 선호하시네요. 비타민C도 풍부해요.",
            "guide": "오렌지는 껍질 까기 귀찮다면 네이블 오렌지나 컵과일을 추천해요. 오렌지 주스도 좋지만 생과일이 섬유질이 더 풍부해요!",
            "matchPoints": ["새콤달콤한 맛을 좋아하는 분", "비타민을 챙기고 싶은 분", "편하게 먹고 싶은 분", "아침에 과일 먹는 분"]
        },
        {
            "name": "아삭한 사과",
            "emoji": "🍎",
            "desc": "아삭아삭 건강한 선택",
            "condition": { "texture": "high", "sweet": "medium", "convenience": "high" },
            "mood": "happy",
            "color": "bg-red-500",
            "interpretation": "아삭한 식감의 사과가 당신의 과일! 씹는 맛을 즐기고, 건강한 과일을 선호하시네요. '하루 한 개 사과'라는 말이 있을 정도로 건강에 좋아요.",
            "guide": "사과는 껍질에 영양이 많으니 깨끗이 씻어서 껍질째 드세요. 아침에 먹으면 금사과, 저녁에 먹으면 독사과라는 말도 있어요!",
            "matchPoints": ["아삭한 식감을 좋아하는 분", "건강을 생각하는 분", "손질이 편한 과일을 원하는 분", "매일 과일 먹는 분"]
        },
        {
            "name": "편한 바나나",
            "emoji": "🍌",
            "desc": "언제 어디서나 간편하게",
            "condition": { "convenience": "low", "texture": "low", "sweet": "high" },
            "mood": "happy",
            "color": "bg-yellow-400",
            "interpretation": "편리함의 끝판왕 바나나! 껍질만 까면 바로 먹을 수 있고, 부드럽고 달콤한 맛. 바쁜 당신에게 딱 맞는 과일이에요.",
            "guide": "바나나는 검은 반점이 생겼을 때 가장 달고 영양가도 높아요. 냉동 바나나로 아이스크림처럼 먹어도 맛있어요!",
            "matchPoints": ["편하게 먹고 싶은 분", "부드러운 식감을 좋아하는 분", "달콤한 맛을 원하는 분", "휴대하기 좋은 과일을 원하는 분"]
        },
        {
            "name": "시원한 수박",
            "emoji": "🍉",
            "desc": "여름의 청량한 친구",
            "condition": { "season": "low", "sweet": "high", "texture": "medium" },
            "mood": "excited",
            "color": "bg-green-500",
            "interpretation": "여름의 대표 과일 수박! 시원하고 달콤한 수박은 더운 날 최고의 간식이죠. 수분도 많아서 갈증 해소에 딱이에요.",
            "guide": "수박은 두드렸을 때 맑은 소리가 나면 잘 익은 거예요. 수박 화채, 수박 주스로 다양하게 즐겨보세요. 씨 없는 수박도 편해요!",
            "matchPoints": ["여름 과일을 좋아하는 분", "시원한 과일을 원하는 분", "달콤한 맛을 좋아하는 분", "수분 보충이 필요한 분"]
        },
        {
            "name": "새콤한 청포도",
            "emoji": "🍇",
            "desc": "새콤달콤 한 알의 행복",
            "condition": { "sour": "high", "texture": "high", "sweet": "low" },
            "mood": "cool",
            "color": "bg-green-400",
            "interpretation": "새콤하고 아삭한 청포도! 한 알씩 톡톡 따 먹는 재미도 있고, 새콤달콤한 맛이 매력적이에요. 피부에도 좋은 과일이죠.",
            "guide": "포도는 씻을 때 밀가루나 베이킹소다를 넣으면 깨끗해져요. 냉동해서 얼려 먹으면 여름 간식으로 최고!",
            "matchPoints": ["새콤한 맛을 좋아하는 분", "한 입 크기 과일을 원하는 분", "아삭한 식감을 좋아하는 분", "피부 건강을 생각하는 분"]
        },
        {
            "name": "달콤한 망고",
            "emoji": "🥭",
            "desc": "열대의 황금빛 보석",
            "condition": { "sweet": "high", "texture": "low", "convenience": "high" },
            "mood": "excited",
            "color": "bg-amber-400",
            "interpretation": "열대 과일의 왕 망고! 진하고 달콤한 맛과 부드러운 과육. 고급스러운 맛을 즐기는 당신에게 딱 맞는 과일이에요.",
            "guide": "망고는 살짝 눌렸을 때 말랑하면 잘 익은 거예요. 냉장고에 넣었다가 차갑게 먹으면 더 맛있어요. 망고빙수도 최고!",
            "matchPoints": ["달콤한 맛을 좋아하는 분", "열대 과일을 좋아하는 분", "부드러운 식감을 선호하는 분", "고급스러운 맛을 원하는 분"]
        },
        {
            "name": "건강한 블루베리",
            "emoji": "🫐",
            "desc": "작지만 강한 슈퍼푸드",
            "condition": { "convenience": "low", "sweet": "medium", "sour": "medium" },
            "mood": "cool",
            "color": "bg-indigo-500",
            "interpretation": "슈퍼푸드 블루베리! 작지만 영양가가 높고, 새콤달콤한 맛이 매력적이에요. 건강을 생각하는 당신에게 딱 맞는 과일!",
            "guide": "블루베리는 씻지 말고 보관하다가 먹기 직전에 씻으세요. 요거트, 시리얼에 넣어 먹으면 더 맛있어요. 냉동 블루베리도 영양은 똑같아요!",
            "matchPoints": ["건강을 생각하는 분", "편하게 먹고 싶은 분", "새콤달콤한 맛을 원하는 분", "아침 식사용 과일을 찾는 분"]
        },
        {
            "name": "시원한 배",
            "emoji": "🍐",
            "desc": "시원하고 아삭한 청량감",
            "condition": { "texture": "high", "sour": "low", "season": "high" },
            "mood": "happy",
            "color": "bg-lime-300",
            "interpretation": "시원하고 아삭한 배! 수분이 풍부하고 달콤하면서도 깔끔한 맛. 감기 걸렸을 때 먹으면 좋다고 알려진 건강 과일이에요.",
            "guide": "배는 냉장 보관하면 더 시원하고 맛있어요. 배숙, 배즙으로 만들어 먹어도 좋고, 고기와 함께 먹으면 소화에 도움이 돼요!",
            "matchPoints": ["아삭한 식감을 좋아하는 분", "시원한 과일을 원하는 분", "가을 과일을 좋아하는 분", "목 건강을 생각하는 분"]
        },
        {
            "name": "달콤한 귤",
            "emoji": "🍊",
            "desc": "겨울의 따뜻한 친구",
            "condition": { "season": "high", "convenience": "low", "sweet": "high" },
            "mood": "happy",
            "color": "bg-orange-500",
            "interpretation": "겨울의 대표 과일 귤! 껍질 까기도 쉽고, 새콤달콤한 맛이 중독성 있어요. 비타민C가 풍부해서 감기 예방에도 좋아요.",
            "guide": "귤은 꼭지가 작고 껍질이 얇은 게 맛있어요. 하얀 속껍질(알베도)에 영양이 많으니 같이 드세요. 하루 2-3개가 적당해요!",
            "matchPoints": ["겨울 과일을 좋아하는 분", "편하게 먹고 싶은 분", "새콤달콤한 맛을 원하는 분", "비타민을 챙기고 싶은 분"]
        },
        {
            "name": "상큼한 키위",
            "emoji": "🥝",
            "desc": "새콤달콤 비타민의 보고",
            "condition": { "sour": "high", "sweet": "low", "texture": "low" },
            "mood": "cool",
            "color": "bg-green-600",
            "interpretation": "새콤한 매력의 키위! 비타민C가 레몬보다 많고, 새콤달콤한 맛이 상쾌해요. 건강과 맛을 동시에 챙기는 스마트한 선택!",
            "guide": "키위는 숟가락으로 파먹으면 편해요. 골드키위는 더 달고, 그린키위는 더 새콤해요. 고기 연육 효과도 있어요!",
            "matchPoints": ["새콤한 맛을 좋아하는 분", "비타민을 챙기고 싶은 분", "편하게 먹고 싶은 분", "부드러운 식감을 선호하는 분"]
        },
        {
            "name": "아삭한 복숭아",
            "emoji": "🍑",
            "desc": "달콤하고 향긋한 여름의 맛",
            "condition": { "sweet": "high", "texture": "high", "season": "low" },
            "mood": "excited",
            "color": "bg-pink-300",
            "interpretation": "향긋하고 달콤한 복숭아! 특히 딱딱한 복숭아(딱복)의 아삭한 식감을 좋아하시네요. 여름의 달콤한 향기를 즐기는 당신!",
            "guide": "백도는 부드럽고 황도는 아삭해요. 털 알러지가 있다면 껍질 벗겨서 드세요. 복숭아 향 좋은 것일수록 맛있어요!",
            "matchPoints": ["달콤한 맛을 좋아하는 분", "아삭한 식감을 선호하는 분", "여름 과일을 좋아하는 분", "향긋한 과일을 원하는 분"]
        }
    ]
};
