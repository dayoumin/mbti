// ============================================================================
// 강아지 시나리오 퀴즈 - 나의 견주력 테스트
// ============================================================================

import type { ScenarioQuiz } from '../types';

export const DOG_SCENARIO_QUIZZES: ScenarioQuiz[] = [
  {
    id: 'dog-scenario-001',
    category: 'dog',
    title: '나의 견주력 테스트',
    description: '강아지와 얼마나 잘 통하는지 알아보세요',
    emoji: '🐕',
    tags: ['강아지', '견주', '시나리오', '양육', '점수테스트'],
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    },
    questions: [
      {
        id: 'q1',
        situation: '산책 중 강아지가 갑자기 앉아서 움직이지 않아요.',
        question: '어떻게 하시나요?',
        options: [
          { id: 'a', text: '리드줄을 당겨서 억지로 이동시킨다', points: 2, feedback: '강압적인 방법은 시게...' },
          { id: 'b', text: '왜 그런지 주변을 살피고 잠시 기다린다', points: 10, feedback: '훌륭해요! 무언가 불안하거나 피곤할 수 있어요' },
          { id: 'c', text: '간식으로 유인한다', points: 8, feedback: '좋은 방법이지만 매번 이러면 습관이 될 수 있어요' },
          { id: 'd', text: '시간이 해결해주길 기다린다', points: 5, feedback: '결국 적응하겠지만 도와주면 더 빨라요' },
        ],
      },
      {
        id: 'q2',
        situation: '강아지가 다른 개를 보면 짖고 흥분해요.',
        question: '어떻게 적응시키나요?',
        options: [
          { id: 'a', text: '강제로 가구 위에 올려본다', points: 2, feedback: '오히려 트라우마가 될 수 있어요' },
          { id: 'b', text: '고양이 냄새가 묻은 담요를 가구에 놓는다', points: 10, feedback: '완벽해요! 냄새로 안정감을 줘요' },
          { id: 'c', text: '간식으로 가구 근처로 유인한다', points: 8, feedback: '좋은 방법이에요! 긍정적인 연관을 만들어요' },
          { id: 'd', text: '시간이 해결해주길 기다린다', points: 5, feedback: '결국 적응하겠지만 도와주면 더 빨라요' },
        ],
      },
      {
        id: 'q3',
        situation: '강아지가 소파를 물어뜯었어요.',
        question: '어떻게 하시나요?',
        options: [
          { id: 'a', text: '하루 정도 지켜본다', points: 6, feedback: '관찰은 좋지만 너무 오래 기다리면 위험해요' },
          { id: 'b', text: '바로 동물병원에 간다', points: 10, feedback: '훌륭해요! 갑작스런 행동 변화는 즉시 체크!' },
          { id: 'c', text: '더 맛있는 간식으로 유인한다', points: 4, feedback: '원인 파악이 먼저예요' },
          { id: 'd', text: '억지로 끌어내서 확인한다', points: 2, feedback: '스트레스를 줄 수 있어요' },
        ],
      },
      {
        id: 'q4',
        situation: '새 가구를 들였는데 강아지가 계속 그 주변을 경계해요.',
        question: '어떻게 적응시키나요?',
        options: [
          { id: 'a', text: '강제로 가구 위에 올려본다', points: 2, feedback: '오히려 트라우마가 될 수 있어요' },
          { id: 'b', text: '고양이 냄새가 묻은 담요를 가구에 놓는다', points: 10, feedback: '완벽해요! 냄새로 안정감을 줘요' },
          { id: 'c', text: '간식으로 가구 근처로 유인한다', points: 8, feedback: '좋은 방법이에요! 긍정적인 연관을 만들어요' },
          { id: 'd', text: '시간이 해결해주길 기다린다', points: 5, feedback: '결국 적응하겠지만 도와주면 더 빨라요' },
        ],
      },
      {
        id: 'q5',
        situation: '강아지가 화장실에서 모래를 엄청 파헤치고 나와요.',
        question: '이 행동의 의미와 대처법은?',
        options: [
          { id: 'a', text: '놀이라서 가만 둔다', points: 4, feedback: '청결 본능이에요. 모래가 충분한지 체크해보세요' },
          { id: 'b', text: '모래양/종류를 점검한다', points: 10, feedback: '훌륭해요! 모래가 부족하거나 맘에 안 들 수 있어요' },
          { id: 'c', text: '화장실을 더 작은 걸로 바꾼다', points: 3, feedback: '오히려 답변할 수 있어요' },
          { id: 'd', text: '혼내서 습관을 고친다', points: 1, feedback: '절대 안 돼요! 화장실 기피로 이어질 수 있어요' },
        ],
      },
      {
        id: 'q6',
        situation: '손님이 왔는데 강아지가 숨어버렸어요.',
        question: '손님에게 뭐라고 하시나요?',
        options: [
          { id: 'a', text: '끌어내서 인사시킨다', points: 2, feedback: '강아지에게 큰 스트레스예요!' },
          { id: 'b', text: '"곧 나올 거예요, 기다려주세요"', points: 5, feedback: '기대하게 하면 안 나올 때 실망할 수 있어요' },
          { id: 'c', text: '"못 나올 수 있어요"라고 미리 말한다', points: 10, feedback: '완벽! 강아지의 성격을 존중하는 대응이에요' },
          { id: 'd', text: '간식으로 유인한다', points: 4, feedback: '강아지가 원하면 나오는 거예요' },
        ],
      },
      {
        id: 'q7',
        situation: '강아지가 키우던 화분 흙을 파헤쳐어요.',
        question: '어떻게 대처하시나요?',
        options: [
          { id: 'a', text: '화내고 혼낸다', points: 2, feedback: '강아지는 혼나는 이유를 이해 못해요' },
          { id: 'b', text: '화분에 접근 못하게 막는다', points: 8, feedback: '좋은 방법! 환경을 바꾸는 게 효과적이에요' },
          { id: 'c', text: '캣그라스를 제공한다', points: 10, feedback: '최고예요! 대체재를 주는 현명한 방법!' },
          { id: 'd', text: '그냥 둔다', points: 3, feedback: '독성 식물이면 위험할 수 있어요' },
        ],
      },
      {
        id: 'q8',
        situation: '강아지가 무릎 위에서 꾹꾹이를 해요.',
        question: '이 행동의 의미는?',
        options: [
          { id: 'a', text: '아프다는 신호', points: 2, feedback: '꾹꾹이는 행복의 표현이에요!' },
          { id: 'b', text: '어린 시절 엄마젖 먹던 기억', points: 10, feedback: '정답! 편안하고 행복하다는 뜻이에요' },
          { id: 'c', text: '일어나라는 신호', points: 3, feedback: '오히려 여기 있고 싶다는 표현이에요' },
          { id: 'd', text: '발톱 갈이', points: 4, feedback: '발톱 갈이는 다른 행동이에요' },
        ],
      },
      {
        id: 'q9',
        situation: '이사를 앞두고 있어요.',
        question: '강아지를 위해 준비할 것은?',
        options: [
          { id: 'a', text: '새 집에 새 용품을 다 새로 산다', points: 3, feedback: '냄새로 안정감이 중요해요!' },
          { id: 'b', text: '기존 용품을 가져가고 페로몬 제품 준비', points: 10, feedback: '완벽! 냄새로 안정감에 도움돼요' },
          { id: 'c', text: '이사 당일 캐리어에 넣어두기만 하면 됨', points: 4, feedback: '미리 캐리어 적응 훈련이 필요해요' },
          { id: 'd', text: '새 집에 먼저 풀어놓는다', points: 5, feedback: '작은 방부터 시작해서 점점 넓히는 게 좋아요' },
        ],
      },
    ],
    results: [
      {
        minScore: 90,
        maxScore: 100,
        grade: 'S',
        title: '프로 견주',
        emoji: '👑',
        description: '강아지의 모든 것을 이해하는 완벽한 견주! 강아지도 당신을 "최고의 견주"로 인정할 거예요.',
        tips: ['후배 견주들에게 조언을 나눠주세요!'],
      },
      {
        minScore: 70,
        maxScore: 89,
        grade: 'A',
        title: '베테랑 견주',
        emoji: '🌟',
        description: '강아지와의 소통이 능숙해요! 조금만 더 배우면 프로 견주!',
        tips: ['강아지 행동학 관련 책을 읽어보세요', '수의사 상담으로 더 배울 수 있어요'],
      },
      {
        minScore: 50,
        maxScore: 69,
        grade: 'B',
        title: '성장하는 견주',
        emoji: '📚',
        description: '기본기가 있어요! 경험을 쌓으면 더 좋은 견주가 될 수 있어요.',
        tips: ['강아지의 바디랭귀지를 공부해보세요', '다른 견주들의 경험담을 들어보세요'],
      },
      {
        minScore: 30,
        maxScore: 49,
        grade: 'C',
        title: '초보 견주',
        emoji: '🐣',
        description: '아직 배울 게 많지만 괜찮아요! 강아지와 함께 성장하면 돼요.',
        tips: ['강아지 입양 전 충분히 공부하세요', '강아지 관련 커뮤니티에 가입해보세요', '기본적인 강아지 습성을 공부해보세요'],
      },
      {
        minScore: 0,
        maxScore: 29,
        grade: 'D',
        title: '예비 견주',
        emoji: '🔰',
        description: '아직 강아지에 대해 많이 모르지만, 배우려는 마음이 중요해요!',
        tips: ['강아지 입양 전 충분히 공부하세요', '강아지 카페에서 먼저 교감해보세요', '유튜브 강아지 교육 채널을 참고하세요'],
      },
    ],
  },
];

export default DOG_SCENARIO_QUIZZES;
