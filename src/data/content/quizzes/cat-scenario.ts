// ============================================================================
// 고양이 시나리오 퀴즈 - 나의 집사 점수는?
// ============================================================================

import type { ScenarioQuiz } from '../types';

export const CAT_SCENARIO_QUIZZES: ScenarioQuiz[] = [
  {
    id: 'cat-scenario-001',
    category: 'cat',
    title: '나의 집사 점수는?',
    description: '고양이 집사로서의 능력을 테스트해보세요',
    emoji: '🐱',
    tags: ['고양이', '집사', '시나리오', '양육', '점수테스트'],
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    },
    questions: [
      {
        id: 'q1',
        situation: '퇴근 후 집에 들어왔더니 고양이가 현관에서 기다리고 있어요.',
        question: '가장 먼저 할 행동은?',
        options: [
          { id: 'a', text: '바로 안아서 뽀뽀해요', points: 5, feedback: '애정 표현이지만 고양이가 준비될 때까지 기다려주면 더 좋아요!' },
          { id: 'b', text: '눈 맞추며 천천히 인사해요', points: 10, feedback: '완벽해요! 고양이의 페이스를 존중하는 센스!' },
          { id: 'c', text: '무시하고 짐 먼저 정리해요', points: 3, feedback: '고양이가 섭섭해질 수 있어요...' },
          { id: 'd', text: '간식부터 꺼내요', points: 7, feedback: '간식 사랑은 좋지만 매번 이러면 습관이 될 수 있어요!' },
        ],
      },
      {
        id: 'q2',
        situation: '고양이가 새벽 4시에 얼굴을 톡톡 쳐서 깨웁니다.',
        question: '어떻게 대응하시나요?',
        options: [
          { id: 'a', text: '일어나서 밥을 준다', points: 3, feedback: '이러면 매일 새벽에 깨울 수 있어요...' },
          { id: 'b', text: '화내며 밀어낸다', points: 2, feedback: '고양이가 혼란스러워하고 관계가 나빠질 수 있어요' },
          { id: 'c', text: '반응하지 않고 자는 척한다', points: 10, feedback: '정답! 반응하면 행동이 강화돼요' },
          { id: 'd', text: '다른 방에서 자기로 결심한다', points: 5, feedback: '해결책이 될 수 있지만 근본적 해결은 아니에요' },
        ],
      },
      {
        id: 'q3',
        situation: '고양이가 갑자기 밥을 안 먹고 구석에 숨어있어요.',
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
        situation: '새 가구를 들였는데 고양이가 계속 그 주변을 경계해요.',
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
        situation: '고양이가 창밖 새를 보며 "깨깨깨" 소리를 내요.',
        question: '이 행동의 의미는?',
        options: [
          { id: 'a', text: '새에게 인사하는 거예요', points: 3, feedback: '귀여운 해석이지만...' },
          { id: 'b', text: '사냥 본능 + 못 잡는 좌절감', points: 10, feedback: '정확해요! 캐터링은 사냥 본능이에요' },
          { id: 'c', text: '아프다는 신호예요', points: 2, feedback: '이건 정상적인 행동이에요!' },
          { id: 'd', text: '배가 고프다는 표현이에요', points: 3, feedback: '새를 볼 때만 하는 건 배고픔과 무관해요' },
        ],
      },
      {
        id: 'q6',
        situation: '고양이 화장실에서 모래를 엄청 파헤치고 나와요.',
        question: '이 행동의 의미와 대처법은?',
        options: [
          { id: 'a', text: '놀이라서 가만 둔다', points: 4, feedback: '청결 본능이에요. 모래가 충분한지 체크해보세요' },
          { id: 'b', text: '모래양/종류를 점검한다', points: 10, feedback: '훌륭해요! 모래가 부족하거나 맘에 안 들 수 있어요' },
          { id: 'c', text: '화장실을 더 작은 걸로 바꾼다', points: 3, feedback: '오히려 답변할 수 있어요' },
          { id: 'd', text: '혼내서 습관을 고친다', points: 1, feedback: '절대 안 돼요! 화장실 기피로 이어질 수 있어요' },
        ],
      },
      {
        id: 'q7',
        situation: '손님이 왔는데 고양이가 숨어버렸어요.',
        question: '손님에게 뭐라고 하시나요?',
        options: [
          { id: 'a', text: '끌어내서 인사시킨다', points: 2, feedback: '고양이에게 큰 스트레스예요!' },
          { id: 'b', text: '"곧 나올 거예요, 기다려주세요"', points: 5, feedback: '기대하게 하면 안 나올 때 실망할 수 있어요' },
          { id: 'c', text: '"못 나올 수 있어요"라고 미리 말한다', points: 10, feedback: '완벽! 고양이의 성격을 존중하는 대응이에요' },
          { id: 'd', text: '간식으로 유인한다', points: 4, feedback: '고양이가 원하면 나오는 거예요' },
        ],
      },
      {
        id: 'q8',
        situation: '고양이가 키우던 화분 흙을 파헤쳐어요.',
        question: '어떻게 대처하시나요?',
        options: [
          { id: 'a', text: '화내고 혼낸다', points: 2, feedback: '고양이는 혼나는 이유를 이해 못해요' },
          { id: 'b', text: '화분에 접근 못하게 막는다', points: 8, feedback: '좋은 방법! 환경을 바꾸는 게 효과적이에요' },
          { id: 'c', text: '캣그라스를 제공한다', points: 10, feedback: '최고예요! 대체재를 주는 현명한 방법!' },
          { id: 'd', text: '그냥 둔다', points: 3, feedback: '독성 식물이면 위험할 수 있어요' },
        ],
      },
      {
        id: 'q9',
        situation: '고양이가 무릎 위에서 꾹꾹이를 해요.',
        question: '이 행동의 의미는?',
        options: [
          { id: 'a', text: '아프다는 신호', points: 2, feedback: '꾹꾹이는 행복의 표현이에요!' },
          { id: 'b', text: '어린 시절 엄마젖 먹던 기억', points: 10, feedback: '정답! 편안하고 행복하다는 뜻이에요' },
          { id: 'c', text: '일어나라는 신호', points: 3, feedback: '오히려 여기 있고 싶다는 표현이에요' },
          { id: 'd', text: '발톱 갈이', points: 4, feedback: '발톱 갈이는 다른 행동이에요' },
        ],
      },
      {
        id: 'q10',
        situation: '이사를 앞두고 있어요.',
        question: '고양이를 위해 준비할 것은?',
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
        title: '프로 집사',
        emoji: '👑',
        description: '고양이의 모든 것을 이해하는 완벽한 집사! 고양이도 당신을 "최고의 집사"로 인정할 거예요.',
        tips: ['후배 집사들에게 조언을 나눠주세요!'],
      },
      {
        minScore: 70,
        maxScore: 89,
        grade: 'A',
        title: '베테랑 집사',
        emoji: '🌟',
        description: '고양이와의 소통이 능숙해요! 조금만 더 배우면 프로 집사!',
        tips: ['고양이 행동학 관련 책을 읽어보세요', '수의사 상담으로 더 배울 수 있어요'],
      },
      {
        minScore: 50,
        maxScore: 69,
        grade: 'B',
        title: '성장하는 집사',
        emoji: '📚',
        description: '기본기가 있어요! 경험을 쌓으면 더 좋은 집사가 될 수 있어요.',
        tips: ['고양이의 바디랭귀지를 공부해보세요', '다른 집사들의 경험담을 들어보세요'],
      },
      {
        minScore: 30,
        maxScore: 49,
        grade: 'C',
        title: '초보 집사',
        emoji: '🐣',
        description: '아직 배울 게 많지만 괜찮아요! 고양이와 함께 성장하면 돼요.',
        tips: ['주변 사람들의 고양이와 성격을 관찰해보세요', '인터넷에 고양이 성격 검색해보세요'],
      },
      {
        minScore: 0,
        maxScore: 29,
        grade: 'D',
        title: '예비 집사',
        emoji: '🔰',
        description: '아직 고양이에 대해 많이 모르지만, 배우려는 마음이 중요해요!',
        tips: ['고양이 입양 전 충분히 공부하세요', '고양이 카페에서 먼저 교감해보세요', '유튜브 고양이 교육 채널을 참고하세요'],
      },
    ],
  },
];

export default CAT_SCENARIO_QUIZZES;
