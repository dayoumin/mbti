// snsStyle 테스트 데이터 (SNS 성격 유형 테스트)
// 생성일: 2025-12-25

import type { SubjectData } from '../types';

export const snsStyleData: SubjectData = {
  "title": "SNS 페르소나 테스트",
  "subtitle": "당신의 SNS 스타일은?",
  "themeColor": "bg-pink-500",
  "icon": "SnsStyleIcon",
  "testType": "personality",
  "dimensions": {
    "share": {
      "name": "공유력",
      "emoji": "📤",
      "desc": "일상을 공유하는 정도"
    },
    "interact": {
      "name": "소통력",
      "emoji": "💬",
      "desc": "다른 사람들과 소통하는 정도"
    },
    "curate": {
      "name": "큐레이션",
      "emoji": "✨",
      "desc": "피드를 꾸미는 정성"
    },
    "consume": {
      "name": "소비력",
      "emoji": "👀",
      "desc": "콘텐츠를 보는 시간"
    },
    "fomo": {
      "name": "트렌드 감도",
      "emoji": "🔥",
      "desc": "최신 트렌드 민감도"
    }
  },
  "questions": [
    {
      "q": "맛집 가면 사진 찍나요?",
      "dimension": "share",
      "a": [
        { "text": "먹기 전에 필수 촬영!", "score": 5 },
        { "text": "특별할 때만 찍어요", "score": 3 },
        { "text": "잘 안 찍어요", "score": 1 }
      ]
    },
    {
      "q": "일상 사진을 SNS에?",
      "dimension": "share",
      "a": [
        { "text": "자주 올려요", "score": 5 },
        { "text": "가끔 특별한 것만", "score": 3 },
        { "text": "거의 안 올려요", "score": 1 }
      ]
    },
    {
      "q": "스토리 기능은?",
      "dimension": "share",
      "a": [
        { "text": "하루에도 여러 번!", "score": 5 },
        { "text": "가끔 올려요", "score": 3 },
        { "text": "잘 안 써요", "score": 1 }
      ]
    },
    {
      "q": "친구 게시물에 댓글은?",
      "dimension": "interact",
      "a": [
        { "text": "자주 달아요!", "score": 5 },
        { "text": "친한 친구 것만", "score": 3 },
        { "text": "좋아요만 눌러요", "score": 1 }
      ]
    },
    {
      "q": "DM(다이렉트 메시지)은?",
      "dimension": "interact",
      "a": [
        { "text": "SNS로 주로 연락해요", "score": 5 },
        { "text": "필요할 때만", "score": 3 },
        { "text": "거의 안 써요", "score": 1 }
      ]
    },
    {
      "q": "모르는 사람 피드에 좋아요/댓글?",
      "dimension": "interact",
      "a": [
        { "text": "좋으면 눌러요!", "score": 5 },
        { "text": "가끔요", "score": 3 },
        { "text": "아는 사람만", "score": 1 }
      ]
    },
    {
      "q": "사진 올리기 전 편집은?",
      "dimension": "curate",
      "a": [
        { "text": "필터+보정 필수!", "score": 5 },
        { "text": "간단한 보정만", "score": 3 },
        { "text": "그냥 올려요", "score": 1 }
      ]
    },
    {
      "q": "피드 전체 분위기는?",
      "dimension": "curate",
      "a": [
        { "text": "통일감 있게 관리해요", "score": 5 },
        { "text": "어느 정도 신경 써요", "score": 3 },
        { "text": "그냥 올리고 싶은 거 올려요", "score": 1 }
      ]
    },
    {
      "q": "SNS 하루 사용 시간은?",
      "dimension": "consume",
      "a": [
        { "text": "3시간 이상", "score": 5 },
        { "text": "1-2시간", "score": 3 },
        { "text": "30분 이하", "score": 1 }
      ]
    },
    {
      "q": "릴스/숏츠 보다 보면?",
      "dimension": "consume",
      "a": [
        { "text": "시간 가는 줄 몰라요", "score": 5 },
        { "text": "좀 보다 멈춰요", "score": 3 },
        { "text": "잘 안 봐요", "score": 1 }
      ]
    },
    {
      "q": "새로운 밈이나 챌린지가 뜨면?",
      "dimension": "fomo",
      "a": [
        { "text": "바로 따라해요!", "score": 5 },
        { "text": "재밌으면 참여해요", "score": 3 },
        { "text": "구경만 해요", "score": 1 }
      ]
    },
    {
      "q": "핫플/맛집 정보는?",
      "dimension": "fomo",
      "a": [
        { "text": "SNS로 빠르게 파악!", "score": 5 },
        { "text": "친구 추천 받아요", "score": 3 },
        { "text": "잘 모르고 살아요", "score": 1 }
      ]
    }
  ],
  "resultLabels": [
    {
      "name": "인플루언서형",
      "emoji": "⭐",
      "desc": "SNS가 일상! 콘텐츠 크리에이터",
      "condition": { "share": "high", "curate": "high", "fomo": "high" },
      "mood": "excited",
      "color": "bg-pink-500",
      "interpretation": "당신은 타고난 콘텐츠 크리에이터! 일상의 모든 순간이 콘텐츠가 되고, 피드 관리에 진심이에요. 트렌드를 빠르게 캐치하고, 팔로워들과 소통하는 게 즐거운 타입이죠.",
      "guide": "이미 SNS 잘 활용하고 계시네요! 번아웃 조심하세요. 가끔은 폰 내려놓고 순간을 온전히 즐기는 것도 좋아요. 디지털 디톡스 하루 정도 가져보세요.",
      "matchPoints": ["콘텐츠 만들기 좋아하는 분", "피드 꾸미기에 진심인 분", "트렌드에 민감한 분", "SNS가 취미이자 일상인 분"]
    },
    {
      "name": "친목러형",
      "emoji": "💬",
      "desc": "소통이 핵심! 관계 중심 SNS러",
      "condition": { "interact": "high", "share": "high" },
      "mood": "happy",
      "color": "bg-blue-500",
      "interpretation": "당신에게 SNS는 친구들과 소통하는 공간! 댓글 달고, DM 주고받고, 친구들 일상 챙기는 게 즐거워요. 온라인에서도 따뜻한 관계를 유지하는 사교의 달인이에요.",
      "guide": "소통 능력 최고! 하지만 온라인 관계에 너무 에너지 쏟지 않도록 균형을 잡아보세요. 오프라인 만남도 소중히!",
      "matchPoints": ["친구 소식 챙기기 좋아하는 분", "댓글 대화 즐기는 분", "DM으로 수다 떠는 분", "온라인 친목을 즐기는 분"]
    },
    {
      "name": "트렌드세터형",
      "emoji": "🔥",
      "desc": "유행은 내가 시작한다!",
      "condition": { "fomo": "high", "curate": "high", "interact": "medium" },
      "mood": "excited",
      "color": "bg-orange-500",
      "interpretation": "새로운 게 뜨면 가장 먼저 시도하는 얼리어답터! 챌린지, 밈, 핫플... 뭐든 빠르게 캐치해요. 친구들이 '그거 어디서 알았어?'라고 물으면 뿌듯하죠!",
      "guide": "트렌드 감각 최고! 하지만 모든 유행을 따라갈 필요는 없어요. 나만의 색깔도 중요하답니다. 가끔은 클래식한 것도 좋아요!",
      "matchPoints": ["새로운 거 빨리 찾는 분", "챌린지 참여 좋아하는 분", "핫플 정보통인 분", "트렌드 리더인 분"]
    },
    {
      "name": "갤러리형",
      "emoji": "🎨",
      "desc": "내 피드는 나의 작품!",
      "condition": { "curate": "high", "share": "medium", "interact": "low" },
      "mood": "cool",
      "color": "bg-purple-500",
      "interpretation": "피드 미학에 진심인 당신! 하나하나 신중하게 올리고, 전체 분위기를 통일감 있게 유지해요. 질 vs 양이라면 무조건 질! 사진 하나에도 예술적 감각이 느껴져요.",
      "guide": "심미안이 뛰어나세요! 완벽주의 때문에 피곤할 수 있어요. 가끔은 가볍게 스토리로 올려보는 것도 좋아요. 피드 압박에서 자유로워지세요!",
      "matchPoints": ["피드 미학에 진심인 분", "사진 보정을 즐기는 분", "무드 있는 콘텐츠 좋아하는 분", "질 > 양인 분"]
    },
    {
      "name": "잠수함형",
      "emoji": "🐋",
      "desc": "올리진 않지만 다 보고 있어요",
      "condition": { "consume": "high", "share": "low", "interact": "low" },
      "mood": "cool",
      "color": "bg-slate-600",
      "interpretation": "게시물은 거의 안 올리지만, 피드는 열심히 보는 당신! 조용히 잠수하며 모든 정보를 흡수해요. 친구들 소식도 다 알고, 트렌드도 파악하지만 티 안 내는 스타일이죠.",
      "guide": "관찰자 모드 ON! 편하게 즐기는 것도 좋지만, 가끔은 소식 공유해보세요. 친구들이 당신 안부도 궁금해할 거예요!",
      "matchPoints": ["보는 건 좋아하는 분", "올리기는 귀찮은 분", "조용히 구경하는 분", "정보 수집 위주인 분"]
    },
    {
      "name": "미니멀리스트형",
      "emoji": "🌿",
      "desc": "필요할 때만 딱!",
      "condition": { "share": "low", "consume": "low", "curate": "low" },
      "mood": "happy",
      "color": "bg-green-500",
      "interpretation": "SNS에 크게 얽매이지 않는 자유로운 영혼! 필요할 때만 접속하고, 현실에 충실해요. 디지털 미니멀리즘을 실천하는 건강한 SNS 라이프를 살고 있어요.",
      "guide": "건강한 SNS 생활! 그대로 유지하세요. 가끔 중요한 연락이나 정보를 놓칠 수 있으니, 알림 설정만 잘 해두세요!",
      "matchPoints": ["현실이 더 중요한 분", "SNS에 시간 안 쓰는 분", "디지털 디톡스 실천 중인 분", "필요할 때만 쓰는 분"]
    },
    {
      "name": "선택적 공유러형",
      "emoji": "💎",
      "desc": "특별한 순간만 공유해요",
      "condition": { "share": "medium", "curate": "medium", "fomo": "medium" },
      "mood": "happy",
      "color": "bg-indigo-500",
      "interpretation": "모든 걸 공유하진 않지만, 특별한 순간은 남겨두는 스타일! 여행, 기념일, 특별한 음식... 의미 있는 것만 골라서 올려요. 균형 잡힌 SNS 라이프를 즐기고 있어요.",
      "guide": "밸런스 좋은 SNS 생활! 지금처럼 즐기세요. 가끔은 일상의 소소한 것도 공유해보면 친구들이 좋아할 거예요!",
      "matchPoints": ["특별한 순간만 남기는 분", "균형 잡힌 SNS러", "프라이버시 중시하는 분", "선택적으로 공유하는 분"]
    },
    {
      "name": "정보탐색형",
      "emoji": "🔍",
      "desc": "SNS는 정보의 바다!",
      "condition": { "consume": "high", "fomo": "high", "share": "low" },
      "mood": "cool",
      "color": "bg-cyan-500",
      "interpretation": "당신에게 SNS는 최고의 정보 플랫폼! 맛집, 핫플, 뉴스, 꿀팁... 필요한 정보를 빠르게 수집해요. 검색보다 SNS가 더 유용한 걸 아는 정보통이죠.",
      "guide": "정보 수집 능력 최고! 하지만 정보 과잉으로 피곤할 수 있어요. 필요한 것만 골라보는 것도 중요해요. 팔로잉 정리도 해보세요!",
      "matchPoints": ["정보 수집용 SNS인 분", "리뷰/후기 꼼꼼히 보는 분", "검색보다 SNS 선호하는 분", "실용적 콘텐츠 좋아하는 분"]
    }
  ]
};

if (typeof window !== 'undefined') {
  window.CHEMI_SUBJECTS = window.CHEMI_SUBJECTS || {};
  window.CHEMI_SUBJECTS.snsStyle = snsStyleData;
}
