// movieGenre 테스트 데이터 (영화/드라마 장르 매칭 테스트)
// 생성일: 2025-12-25

import type { SubjectData } from '../types';

export const movieGenreData: SubjectData = {
  "title": "영화/드라마 장르 테스트",
  "subtitle": "당신에게 맞는 장르는?",
  "themeColor": "bg-violet-600",
  "icon": "MovieGenreIcon",
  "testType": "matching",
  "dimensions": {
    "thrill": {
      "name": "스릴",
      "emoji": "😱",
      "desc": "긴장감과 스릴을 즐기는 정도"
    },
    "emotion": {
      "name": "감성",
      "emoji": "😢",
      "desc": "감동과 눈물 선호도"
    },
    "think": {
      "name": "사고력",
      "emoji": "🧠",
      "desc": "생각하게 하는 콘텐츠 선호도"
    },
    "laugh": {
      "name": "웃음",
      "emoji": "😂",
      "desc": "코믹/유머 선호도"
    },
    "fantasy": {
      "name": "상상력",
      "emoji": "✨",
      "desc": "판타지/SF 선호도"
    }
  },
  "questions": [
    {
      "q": "무서운 장면이 나오면?",
      "dimension": "thrill",
      "a": [
        { "text": "오히려 좋아! 더 무서워도 OK", "score": 5 },
        { "text": "가끔은 괜찮아요", "score": 3 },
        { "text": "눈 가리고 봐요...", "score": 1 }
      ]
    },
    {
      "q": "예상 못한 반전에 대해?",
      "dimension": "thrill",
      "a": [
        { "text": "반전 없으면 재미없어요!", "score": 5 },
        { "text": "있으면 좋죠", "score": 3 },
        { "text": "예상 가능한 게 편해요", "score": 1 }
      ]
    },
    {
      "q": "영화 보고 울어본 적 있나요?",
      "dimension": "emotion",
      "a": [
        { "text": "자주 울어요... 눈물샘 약함", "score": 5 },
        { "text": "가끔 울어요", "score": 3 },
        { "text": "잘 안 울어요", "score": 1 }
      ]
    },
    {
      "q": "슬픈 엔딩 vs 해피 엔딩?",
      "dimension": "emotion",
      "a": [
        { "text": "슬픈 엔딩도 좋아요, 여운이 남아서", "score": 5 },
        { "text": "상관없어요", "score": 3 },
        { "text": "해피엔딩이 좋아요", "score": 1 }
      ]
    },
    {
      "q": "영화 보고 깊이 생각하는 편?",
      "dimension": "think",
      "a": [
        { "text": "계속 곱씹어요, 해석 영상도 찾아봐요", "score": 5 },
        { "text": "좀 생각하다 끝나요", "score": 3 },
        { "text": "그냥 재미있으면 돼요", "score": 1 }
      ]
    },
    {
      "q": "열린 결말/떡밥에 대해?",
      "dimension": "think",
      "a": [
        { "text": "좋아요! 해석의 여지가 있어서", "score": 5 },
        { "text": "적당히요", "score": 3 },
        { "text": "싫어요, 답답해요", "score": 1 }
      ]
    },
    {
      "q": "코미디 영화/드라마는?",
      "dimension": "laugh",
      "a": [
        { "text": "웃긴 거 최고! 자주 봐요", "score": 5 },
        { "text": "가끔 봐요", "score": 3 },
        { "text": "잘 안 봐요", "score": 1 }
      ]
    },
    {
      "q": "영화 볼 때 웃음 포인트?",
      "dimension": "laugh",
      "a": [
        { "text": "빵빵 터지는 편이에요", "score": 5 },
        { "text": "피식 웃는 정도", "score": 3 },
        { "text": "잘 안 웃게 돼요", "score": 1 }
      ]
    },
    {
      "q": "SF/판타지 세계관에 대해?",
      "dimension": "fantasy",
      "a": [
        { "text": "완전 좋아해요! 상상력 자극", "score": 5 },
        { "text": "가끔은 재밌어요", "score": 3 },
        { "text": "현실적인 게 좋아요", "score": 1 }
      ]
    },
    {
      "q": "마블/DC 같은 히어로물은?",
      "dimension": "fantasy",
      "a": [
        { "text": "완전 좋아해요!", "score": 5 },
        { "text": "가끔 봐요", "score": 3 },
        { "text": "잘 안 봐요", "score": 1 }
      ]
    },
    {
      "q": "액션 씬은?",
      "dimension": "thrill",
      "a": [
        { "text": "화끈한 액션 좋아요!", "score": 5 },
        { "text": "적당히요", "score": 3 },
        { "text": "대화 장면이 더 좋아요", "score": 1 }
      ]
    },
    {
      "q": "로맨스 요소는?",
      "dimension": "emotion",
      "a": [
        { "text": "로맨스 없으면 아쉬워요", "score": 5 },
        { "text": "있으면 좋고 없어도 OK", "score": 3 },
        { "text": "로맨스 빼고요", "score": 1 }
      ]
    }
  ],
  "resultLabels": [
    {
      "name": "스릴러/공포",
      "emoji": "😱",
      "desc": "심장이 쫄깃해야 제맛!",
      "condition": { "thrill": "high", "emotion": "low" },
      "mood": "cool",
      "color": "bg-gray-800",
      "interpretation": "긴장감 넘치는 스릴러와 공포물이 당신의 취향! 반전에 소름 돋고, 무서운 장면에 심장이 쫄깃해지는 그 느낌을 즐기는 타입이에요. 범죄 스릴러, 호러, 서스펜스 모두 OK!",
      "guide": "추천 작품: 올드보이, 기생충, 곡성, 샤이닝, 양들의 침묵. 넷플릭스 '지금 우리 학교는', '스위트홈' 같은 K-공포도 좋아요!",
      "matchPoints": ["긴장감 좋아하는 분", "반전에 소름 돋는 분", "무서운 거 즐기는 분", "심리 스릴러 좋아하는 분"]
    },
    {
      "name": "로맨스/멜로",
      "emoji": "💕",
      "desc": "사랑 이야기에 눈물과 설렘!",
      "condition": { "emotion": "high", "laugh": "low", "thrill": "low" },
      "mood": "happy",
      "color": "bg-pink-400",
      "interpretation": "달달하고 애틋한 사랑 이야기가 당신의 취향! 설렘에 심쿵하고, 슬픈 장면엔 눈물 흘리며 공감하는 타입이에요. 로맨스 없는 콘텐츠는 뭔가 허전하죠?",
      "guide": "추천 작품: 노트북, 어바웃 타임, 라라랜드. K-드라마 '도깨비', '눈물의 여왕', '사랑의 불시착' 같은 로맨스 드라마 추천!",
      "matchPoints": ["설렘 좋아하는 분", "감성적인 분", "로맨스 필수인 분", "사랑 이야기에 빠지는 분"]
    },
    {
      "name": "코미디",
      "emoji": "😂",
      "desc": "웃음이 최고의 힐링!",
      "condition": { "laugh": "high", "thrill": "low" },
      "mood": "excited",
      "color": "bg-yellow-400",
      "interpretation": "빵빵 터지는 코미디가 당신의 취향! 머리 비우고 웃으면서 스트레스 푸는 것만큼 좋은 게 없죠. 시트콤, 로맨틱 코미디, 개그 영화 모두 좋아해요.",
      "guide": "추천 작품: 극한직업, 럭키, 과속스캔들. 미드 '프렌즈', '오피스', '브루클린 나인-나인' 시트콤도 추천!",
      "matchPoints": ["웃는 게 좋은 분", "가볍게 즐기고 싶은 분", "스트레스 해소용으로 보는 분", "유쾌한 콘텐츠 선호하는 분"]
    },
    {
      "name": "SF/판타지",
      "emoji": "🚀",
      "desc": "상상의 세계로 떠나자!",
      "condition": { "fantasy": "high", "think": "high" },
      "mood": "excited",
      "color": "bg-indigo-600",
      "interpretation": "상상력 자극하는 SF와 판타지가 당신의 취향! 새로운 세계관, 미래 기술, 마법의 세계에 빠져드는 타입이에요. 세계관 파헤치고 설정 분석하는 것도 좋아하죠.",
      "guide": "추천 작품: 인터스텔라, 듄, 반지의 제왕, 해리포터. 드라마 '기묘한 이야기', '블랙미러' 같은 SF도 좋아요!",
      "matchPoints": ["상상력 풍부한 분", "세계관 파는 분", "미래/판타지 좋아하는 분", "설정덕후인 분"]
    },
    {
      "name": "히어로/액션",
      "emoji": "🦸",
      "desc": "시원한 액션과 영웅 서사!",
      "condition": { "fantasy": "high", "thrill": "high" },
      "mood": "excited",
      "color": "bg-red-600",
      "interpretation": "화끈한 액션과 히어로물이 당신의 취향! 마블, DC 다 좋고, 시원하게 악당 물리치는 장면에 카타르시스를 느끼는 타입이에요.",
      "guide": "추천 작품: 어벤져스 시리즈, 다크나이트, 미션 임파서블. K-액션 '범죄도시' 시리즈, '사냥의 시간'도 추천!",
      "matchPoints": ["액션 좋아하는 분", "히어로물 팬인 분", "통쾌함을 원하는 분", "마블/DC 좋아하는 분"]
    },
    {
      "name": "드라마/휴먼",
      "emoji": "🎭",
      "desc": "인간의 이야기에 공감과 감동",
      "condition": { "emotion": "high", "think": "high" },
      "mood": "happy",
      "color": "bg-amber-600",
      "interpretation": "인간의 삶과 감정을 깊이 다룬 드라마가 당신의 취향! 캐릭터에 깊이 공감하고, 여운이 오래 남는 작품을 좋아해요. 실화 기반 영화도 좋아하죠.",
      "guide": "추천 작품: 쇼생크 탈출, 포레스트 검프, 인생은 아름다워. K-영화 '미나리', '나의 소녀시대' 같은 감동작 추천!",
      "matchPoints": ["깊은 감동 원하는 분", "캐릭터에 공감하는 분", "여운 남는 작품 좋아하는 분", "실화 기반 좋아하는 분"]
    },
    {
      "name": "미스터리/추리",
      "emoji": "🔍",
      "desc": "추리하는 재미! 범인은 누구?",
      "condition": { "think": "high", "thrill": "high" },
      "mood": "cool",
      "color": "bg-slate-700",
      "interpretation": "미스터리와 추리물이 당신의 취향! 범인 추리하고, 복선 찾고, 반전에 감탄하는 것이 즐거운 타입이에요. 탐정물, 범죄 수사물 모두 좋아해요.",
      "guide": "추천 작품: 나이브즈 아웃, 셜록 홈즈, 세븐. K-드라마 '비밀의 숲', '시그널', '모범택시' 같은 추리/수사물 추천!",
      "matchPoints": ["추리하는 게 재밌는 분", "복선 찾기 좋아하는 분", "반전에 감탄하는 분", "탐정/수사물 좋아하는 분"]
    },
    {
      "name": "로맨틱 코미디",
      "emoji": "💘",
      "desc": "웃기고 설레는 달달한 조합!",
      "condition": { "emotion": "high", "laugh": "high" },
      "mood": "happy",
      "color": "bg-rose-400",
      "interpretation": "웃음과 설렘 둘 다 챙기는 로맨틱 코미디가 당신의 취향! 가볍게 보면서 웃고, 커플 케미에 심쿵하고, 해피엔딩에 기분 좋아지는 타입이에요.",
      "guide": "추천 작품: 노팅힐, 러브 액츄얼리, 10가지 싫어하는 것들. K-드라마 '김비서가 왜 그럴까', '여신강림', '사이코지만 괜찮아' 추천!",
      "matchPoints": ["웃기고 달달한 거 좋아하는 분", "가볍게 즐기고 싶은 분", "해피엔딩 좋아하는 분", "커플 케미 보는 재미!"]
    },
    {
      "name": "다큐/실화",
      "emoji": "📹",
      "desc": "현실에서 찾는 감동과 지식",
      "condition": { "think": "high", "fantasy": "low" },
      "mood": "cool",
      "color": "bg-blue-700",
      "interpretation": "실제 이야기와 다큐멘터리가 당신의 취향! 현실에서 영감을 얻고, 새로운 것을 배우는 것이 즐거운 타입이에요. 실화 기반 영화도 좋아하죠.",
      "guide": "추천 작품: 넷플릭스 '우리의 지구', '메이킹 어 머더러'. 실화 영화 '서치', '더 포스트' 같은 작품도 좋아요!",
      "matchPoints": ["배움을 즐기는 분", "현실적인 이야기 좋아하는 분", "다큐멘터리 즐겨 보는 분", "실화에 감동받는 분"]
    },
    {
      "name": "올라운더",
      "emoji": "🎬",
      "desc": "장르 안 가리고 다 즐겨요!",
      "condition": { "thrill": "medium", "emotion": "medium", "laugh": "medium" },
      "mood": "happy",
      "color": "bg-violet-500",
      "interpretation": "장르 불문 다 즐기는 만능 관객! 그때그때 기분에 따라 다양한 장르를 섭렵하는 타입이에요. 열린 마음으로 새로운 장르도 도전해보세요!",
      "guide": "기분에 따라 골라보세요! OTT '오늘 뭐 볼까' 랜덤 추천 활용도 좋아요. 평점 높은 작품 위주로 다양하게 도전!",
      "matchPoints": ["장르 안 가리는 분", "새 장르 도전 좋아하는 분", "기분에 따라 고르는 분", "다양한 작품 섭렵하는 분"]
    }
  ]
};

if (typeof window !== 'undefined') {
  window.CHEMI_SUBJECTS = window.CHEMI_SUBJECTS || {};
  window.CHEMI_SUBJECTS.movieGenre = movieGenreData;
}
