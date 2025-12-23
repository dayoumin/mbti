// ramen 테스트 데이터 (나에게 맞는 라면 매칭)
// 생성일: 2025-12-23

import type { SubjectData } from '../types';

export const ramenData: SubjectData = {
  "title": "나의 라면 찾기",
  "subtitle": "어떤 라면이 나와 맞을까?",
  "themeColor": "bg-red-600",
  "icon": "RamenIcon",
  "testType": "matching",
  "dimensions": {
    "spicy": {
      "name": "매운맛",
      "emoji": "🌶️",
      "desc": "매운 걸 얼마나 좋아하나요"
    },
    "soup": {
      "name": "국물",
      "emoji": "🍜",
      "desc": "국물의 진한 정도"
    },
    "mood": {
      "name": "상황",
      "emoji": "⏰",
      "desc": "라면을 먹는 상황"
    },
    "texture": {
      "name": "식감",
      "emoji": "🍝",
      "desc": "면발과 토핑 취향"
    }
  },
  "questions": [
    {
      "q": "매운맛에 대해 어떻게 생각하세요?",
      "dimension": "spicy",
      "a": [
        { "text": "매워야 라면이지!", "score": 5 },
        { "text": "적당히 얼큰한 게 좋아요", "score": 3 },
        { "text": "매운 건 별로예요", "score": 1 }
      ]
    },
    {
      "q": "불닭볶음면을 먹어본 적 있나요?",
      "dimension": "spicy",
      "a": [
        { "text": "맛있게 먹어요!", "score": 5 },
        { "text": "먹긴 하는데 물을 많이 마셔요", "score": 3 },
        { "text": "너무 매워서 못 먹어요", "score": 1 }
      ]
    },
    {
      "q": "라면 국물은 어떻게 드시나요?",
      "dimension": "soup",
      "a": [
        { "text": "국물까지 다 마셔요", "score": 5 },
        { "text": "반 정도 마셔요", "score": 3 },
        { "text": "거의 안 마셔요", "score": 1 }
      ]
    },
    {
      "q": "라면 국물의 진한 정도는?",
      "dimension": "soup",
      "a": [
        { "text": "진하고 얼큰해야 맛있어요", "score": 5 },
        { "text": "적당한 게 좋아요", "score": 3 },
        { "text": "담백한 게 좋아요", "score": 1 }
      ]
    },
    {
      "q": "주로 언제 라면을 먹나요?",
      "dimension": "mood",
      "a": [
        { "text": "밤에 출출할 때!", "score": 5 },
        { "text": "식사 대용으로", "score": 3 },
        { "text": "언제든 생각날 때", "score": 1 }
      ]
    },
    {
      "q": "라면 먹을 때 기분은?",
      "dimension": "mood",
      "a": [
        { "text": "해장하거나 속풀이", "score": 5 },
        { "text": "간편하게 끼니 해결", "score": 3 },
        { "text": "맛있게 즐기기", "score": 1 }
      ]
    },
    {
      "q": "라면에 계란을 넣나요?",
      "dimension": "texture",
      "a": [
        { "text": "꼭 넣어요, 필수예요!", "score": 5 },
        { "text": "있으면 넣어요", "score": 3 },
        { "text": "잘 안 넣어요", "score": 1 }
      ]
    },
    {
      "q": "라면 면발은 어떻게 좋아하세요?",
      "dimension": "texture",
      "a": [
        { "text": "쫄깃하고 탱탱해야죠", "score": 5 },
        { "text": "부드럽게 익힌 게 좋아요", "score": 1 }
      ]
    },
    {
      "q": "짜장라면 vs 일반 라면?",
      "dimension": "soup",
      "a": [
        { "text": "국물 있는 게 좋아요", "score": 5 },
        { "text": "비빔면도 좋아해요", "score": 1 }
      ]
    },
    {
      "q": "라면에 추가 토핑을 넣는다면?",
      "dimension": "texture",
      "a": [
        { "text": "김치, 떡, 치즈 등 다양하게!", "score": 5 },
        { "text": "파나 김 정도만", "score": 3 },
        { "text": "그냥 먹어요", "score": 1 }
      ]
    },
    {
      "q": "신라면 매운맛 정도는?",
      "dimension": "spicy",
      "a": [
        { "text": "별로 안 매워요", "score": 5 },
        { "text": "적당해요", "score": 3 },
        { "text": "충분히 매워요", "score": 1 }
      ]
    }
  ],
  "resultLabels": [
    {
      "name": "신라면",
      "emoji": "🔥",
      "desc": "국민 라면의 정석, 얼큰한 매운맛",
      "condition": { "spicy": "high", "soup": "high" },
      "mood": "excited",
      "color": "bg-red-600",
      "interpretation": "대한민국 국민 라면! 얼큰하고 칼칼한 매운맛과 진한 국물이 특징이에요. 해장이나 속풀이할 때, 밤에 출출할 때 딱 좋은 라면이죠. 김치를 넣으면 더 맛있어요.",
      "guide": "계란을 넣어 반숙으로 먹으면 부드러움이 더해져요. 물은 550ml가 정석이지만, 진하게 드시려면 500ml로 줄여보세요. 김치, 대파, 치즈를 토핑으로 추천!",
      "matchPoints": ["매운맛을 좋아하는 분", "진한 국물을 선호하는 분", "해장이 필요한 분", "밤에 야식으로 먹는 분"]
    },
    {
      "name": "진라면 매운맛",
      "emoji": "🌶️",
      "desc": "쫄깃한 면발과 깔끔한 매운맛",
      "condition": { "spicy": "high", "texture": "high" },
      "mood": "cool",
      "color": "bg-red-500",
      "interpretation": "신라면보다 덜 자극적이면서 깔끔한 매운맛! 쫄깃한 면발이 일품이에요. 매운맛을 좋아하지만 뒷맛이 깔끔한 걸 원하는 분께 추천해요.",
      "guide": "면발을 쫄깃하게 먹으려면 4분 30초만 끓이세요. 참기름 한 방울 떨어뜨리면 고소함이 더해져요. 달걀과 파, 김이 잘 어울려요.",
      "matchPoints": ["쫄깃한 면을 좋아하는 분", "깔끔한 매운맛을 원하는 분", "신라면이 너무 자극적인 분", "고소한 풍미를 좋아하는 분"]
    },
    {
      "name": "안성탕면",
      "emoji": "🥘",
      "desc": "구수하고 진한 사골 육수",
      "condition": { "soup": "high", "spicy": "medium" },
      "mood": "happy",
      "color": "bg-amber-700",
      "interpretation": "사골 육수의 진한 국물이 일품! 매운맛보다는 구수하고 진한 맛을 좋아하는 분께 딱이에요. 든든한 한 끼 식사로 좋아요.",
      "guide": "물을 넉넉하게(600ml) 넣어야 국물 맛이 제대로 나와요. 떡, 만두를 넣으면 더 푸짐해요. 김치나 깍두기를 곁들이면 완벽!",
      "matchPoints": ["구수한 맛을 좋아하는 분", "진한 국물을 원하는 분", "매운 거 부담스러운 분", "든든한 한 끼를 원하는 분"]
    },
    {
      "name": "삼양라면",
      "emoji": "🍲",
      "desc": "원조 라면의 깊은 맛",
      "condition": { "soup": "high", "spicy": "low" },
      "mood": "happy",
      "color": "bg-orange-600",
      "interpretation": "대한민국 최초의 라면! 깊고 진한 국물 맛이 특징이에요. 옛날 감성을 느끼고 싶을 때, 든든하게 한 끼 먹고 싶을 때 좋아요.",
      "guide": "약불로 천천히 끓이면 더 깊은 맛이 나요. 스팸, 만두를 넣으면 옛날 추억의 라면 완성! 대파와 김은 필수 토핑.",
      "matchPoints": ["옛날 감성을 좋아하는 분", "진한 국물을 선호하는 분", "심플한 맛을 원하는 분", "든든한 식사를 원하는 분"]
    },
    {
      "name": "짜파게티",
      "emoji": "🍝",
      "desc": "짜장맛 비빔면의 원조",
      "condition": { "soup": "low", "texture": "high" },
      "mood": "cool",
      "color": "bg-yellow-900",
      "interpretation": "국물 없이 비벼 먹는 짜장맛 라면! 쫄깃한 면발에 진한 짜장 소스가 일품이에요. 국물 없는 라면을 좋아하는 분께 추천!",
      "guide": "물을 최대한 적게 남기고(밥숟가락 8개 정도) 비비세요. 양파와 오이를 채썰어 넣으면 식감이 더 좋아요. 군만두와 찰떡궁합!",
      "matchPoints": ["비빔면을 좋아하는 분", "짜장 맛을 좋아하는 분", "쫄깃한 면을 선호하는 분", "국물 없는 면이 좋은 분"]
    },
    {
      "name": "짜왕",
      "emoji": "🖤",
      "desc": "진하고 고소한 짜장라면",
      "condition": { "soup": "low", "spicy": "low" },
      "mood": "happy",
      "color": "bg-gray-900",
      "interpretation": "짜파게티보다 더 진하고 고소한 짜장맛! 비빔면이지만 소스가 많아서 촉촉하게 먹을 수 있어요. 중화요리 같은 느낌을 원하는 분께 딱!",
      "guide": "물을 완전히 버리지 말고 조금 남겨서 비비면 더 촉촉해요. 계란 후라이를 올리고 오이채를 곁들이면 중화비빔면 완성!",
      "matchPoints": ["진한 짜장맛을 좋아하는 분", "촉촉한 비빔면을 원하는 분", "고소한 맛을 좋아하는 분", "중화요리 스타일을 선호하는 분"]
    },
    {
      "name": "불닭볶음면",
      "emoji": "🔥🐔",
      "desc": "극강의 매운맛 챌린지",
      "condition": { "spicy": "high", "soup": "low" },
      "mood": "excited",
      "color": "bg-red-700",
      "interpretation": "매운맛의 끝판왕! 매운 걸 정말 좋아하는 분만 도전하세요. 달달하면서도 강렬한 매운맛이 중독성 있어요.",
      "guide": "우유나 치즈를 넣으면 매운맛이 조금 완화돼요. 체다치즈를 갈아서 뿌리면 카르보불닭 완성! 물은 충분히 준비하세요.",
      "matchPoints": ["극강의 매운맛을 좋아하는 분", "챌린지를 즐기는 분", "스트레스 해소가 필요한 분", "자극적인 맛을 원하는 분"]
    },
    {
      "name": "너구리",
      "emoji": "🦝",
      "desc": "두툼한 면발과 다시마 국물",
      "condition": { "texture": "high", "spicy": "medium" },
      "mood": "happy",
      "color": "bg-green-700",
      "interpretation": "두툼하고 쫄깃한 면발이 특징! 다시마와 다시다 맛이 나는 시원한 국물이에요. 우동 같은 식감을 좋아하는 분께 추천!",
      "guide": "면을 더 쫄깃하게 먹으려면 5분만 끓이세요. 부추나 숙주를 넣으면 더 시원해요. 신라면과 반반 섞어서 '짜파구리'로 먹어도 맛있어요!",
      "matchPoints": ["두툼한 면발을 좋아하는 분", "우동 식감을 선호하는 분", "다시마 국물을 좋아하는 분", "푸짐한 느낌을 원하는 분"]
    },
    {
      "name": "육개장 사발면",
      "emoji": "🌶️🥣",
      "desc": "칼칼한 육개장 맛",
      "condition": { "spicy": "high", "mood": "high" },
      "mood": "excited",
      "color": "bg-red-800",
      "interpretation": "해장 라면의 정석! 칼칼하고 얼큰한 육개장 맛이 속을 풀어줘요. 밤늦게 속이 안 좋을 때 딱 좋아요.",
      "guide": "뜨거운 물을 부어 3분만 기다리면 돼요. 대파를 송송 썰어 넣으면 더 시원해요. 숙취 해소에 좋아요!",
      "matchPoints": ["해장이 필요한 분", "칼칼한 맛을 좋아하는 분", "간편하게 먹고 싶은 분", "야식으로 먹는 분"]
    },
    {
      "name": "진라면 순한맛",
      "emoji": "🍜",
      "desc": "부드럽고 담백한 국물",
      "condition": { "spicy": "low", "soup": "medium" },
      "mood": "happy",
      "color": "bg-blue-400",
      "interpretation": "매운 게 부담스러운 분을 위한 라면! 담백하고 깔끔한 맛이에요. 아이들이나 매운 걸 못 먹는 분께 딱!",
      "guide": "물을 조금 많게(600ml) 넣어 시원하게 끓이세요. 만두나 떡을 넣으면 더 든든해요. 김가루를 뿌리면 풍미가 더해져요.",
      "matchPoints": ["매운 거 못 먹는 분", "담백한 맛을 좋아하는 분", "아이들과 함께 먹는 분", "가벼운 식사를 원하는 분"]
    }
  ]
};

if (typeof window !== 'undefined') {
  window.CHEMI_SUBJECTS = window.CHEMI_SUBJECTS || {};
  window.CHEMI_SUBJECTS.ramen = ramenData;
}
