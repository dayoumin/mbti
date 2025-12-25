// ============================================================================
// 토끼 시나리오 퀴즈 - 나의 토끼 집사 점수는?
// ============================================================================

import type { ScenarioQuiz } from '../types';

export const RABBIT_SCENARIO_QUIZZES: ScenarioQuiz[] = [
  {
    id: 'rabbit-scenario-001',
    category: 'rabbit',
    title: '나의 토끼 집사 점수는?',
    description: '토끼 집사로서의 돌봄 능력을 테스트해보세요',
    emoji: '🐰',
    tags: ['토끼', '집사', '시나리오', '양육', '점수테스트'],
    questions: [
      {
        id: 'q1',
        situation: '토끼에게 먹이를 주려고 해요.',
        question: '가장 중요한 주식은 무엇일까요?',
        options: [
          { id: 'a', text: '펠렛 사료를 많이 준다', points: 6, feedback: '사료도 필요하지만 건초가 더 중요해요!' },
          { id: 'b', text: '티모시 건초를 무제한으로 준다', points: 10, feedback: '완벽해요! 건초는 이빨 관리와 소화에 필수예요' },
          { id: 'c', text: '당근을 주식으로 준다', points: 3, feedback: '당근은 간식이에요! 너무 많으면 비만 위험이 있어요' },
          { id: 'd', text: '빵과 곡물을 섞어 준다', points: 0, feedback: '절대 안 돼요! 토끼는 탄수화물을 소화 못해 가스가 차서 사망할 수 있어요' },
        ],
      },
      {
        id: 'q2',
        situation: '친구가 토끼한테 간식으로 뭘 줄까 물어봐요.',
        question: '어떻게 대답하시나요?',
        options: [
          { id: 'a', text: '과자나 빵도 괜찮아', points: 0, feedback: '위험해요! 탄수화물은 토끼에게 치명적이에요' },
          { id: 'b', text: '당근은 주 1-2회 소량만', points: 10, feedback: '정확해요! 당근은 당분이 많아서 조금씩만 줘야 해요' },
          { id: 'c', text: '사과나 바나나 매일 줘도 돼', points: 4, feedback: '과일도 당분이 많아서 소량만 가끔 줘야 해요' },
          { id: 'd', text: '아무거나 다 먹을 수 있어', points: 1, feedback: '토끼는 먹이에 매우 민감해요. 잘못된 먹이는 생명을 위협해요' },
        ],
      },
      {
        id: 'q3',
        situation: '토끼가 갑자기 설사를 했어요.',
        question: '어떻게 대응하시나요?',
        options: [
          { id: 'a', text: '하루 정도 지켜본다', points: 2, feedback: '위험해요! 토끼 설사는 이미 심각한 감염 상태예요' },
          { id: 'b', text: '바로 동물병원에 데려간다', points: 10, feedback: '완벽! 토끼는 증상을 숨기는 동물이라 보이면 이미 심각해요' },
          { id: 'c', text: '물만 주고 먹이를 끊는다', points: 3, feedback: '건초는 계속 줘야 해요. 바로 병원 가는 게 우선이에요' },
          { id: 'd', text: '인터넷에서 민간요법을 찾아본다', points: 1, feedback: '시간을 지체하면 위험해요. 즉시 병원 가세요!' },
        ],
      },
      {
        id: 'q4',
        situation: '토끼를 들어올리려고 해요.',
        question: '올바른 방법은?',
        options: [
          { id: 'a', text: '귀를 잡아서 들어올린다', points: 0, feedback: '절대 안 돼요! 토끼가 극심한 고통을 느껴요' },
          { id: 'b', text: '목덜미를 잡고 엉덩이를 받친다', points: 10, feedback: '정확해요! 귀는 체온조절 기관이라 절대 잡으면 안 돼요' },
          { id: 'c', text: '배를 감싸서 들어올린다', points: 7, feedback: '괜찮지만 목덜미를 잡는 게 더 안전해요' },
          { id: 'd', text: '다리를 잡아서 들어올린다', points: 2, feedback: '토끼가 발버둥 치다가 다칠 수 있어요' },
        ],
      },
      {
        id: 'q5',
        situation: '토끼가 갑자기 뒷다리로 바닥을 세게 쿵쿵 쳐요.',
        question: '이 행동의 의미는?',
        options: [
          { id: 'a', text: '기분 좋아서 춤추는 중', points: 2, feedback: '기분 좋을 땐 뛰어다니거나 빙글빙글 돌아요' },
          { id: 'b', text: '불안하거나 화가 난 상태 (스텀핑)', points: 10, feedback: '정확해요! 스텀핑은 경고 신호예요. 무엇이 불안한지 확인해야 해요' },
          { id: 'c', text: '배가 고프다는 표현', points: 3, feedback: '배고플 땐 집사 주위를 빙글빙글 돌아요' },
          { id: 'd', text: '발바닥이 가려워서', points: 1, feedback: '이건 불안감이나 경고 신호예요!' },
        ],
      },
      {
        id: 'q6',
        situation: '토끼가 코로 내 얼굴을 콕콕 쳐요.',
        question: '이 행동의 의미는?',
        options: [
          { id: 'a', text: '화났다는 신호', points: 2, feedback: '화나면 스텀핑을 해요' },
          { id: 'b', text: '놀아달라는 애정표현', points: 10, feedback: '정답! 토끼가 당신을 신뢰하고 좋아해요' },
          { id: 'c', text: '배가 고파서', points: 4, feedback: '배고플 땐 발밑을 빙빙 돌아요' },
          { id: 'd', text: '아파서 도와달라는 신호', points: 3, feedback: '아플 땐 숨거나 움직이지 않아요' },
        ],
      },
      {
        id: 'q7',
        situation: '토끼가 다리를 몸 안에 넣고 둥글게 웅크려 있어요.',
        question: '어떻게 대응하시나요?',
        options: [
          { id: 'a', text: '편안하게 쉬는 거니까 그냥 둔다', points: 4, feedback: '편안할 땐 다리를 쭉 뻗고 누워요. 계속 웅크리면 아픈 거예요' },
          { id: 'b', text: '장시간 지속되면 건강 체크한다', points: 10, feedback: '정확해요! 이 자세가 오래 지속되면 통증이나 불편함의 신호예요' },
          { id: 'c', text: '억지로 펴서 확인한다', points: 3, feedback: '스트레스를 줄 수 있어요. 관찰 후 병원 가는 게 좋아요' },
          { id: 'd', text: '간식으로 유인해본다', points: 5, feedback: '반응 확인엔 좋지만 건강 체크가 우선이에요' },
        ],
      },
      {
        id: 'q8',
        situation: '토끼 우리 바닥이 철망이에요.',
        question: '이대로 괜찮을까요?',
        options: [
          { id: 'a', text: '괜찮아, 청소하기 편하잖아', points: 2, feedback: '토끼 발에 큰 문제가 생겨요!' },
          { id: 'b', text: '푹신한 매트를 깔아야 한다', points: 10, feedback: '완벽해요! 토끼는 육구가 없어서 딱딱한 바닥에서 비절병이 생겨요' },
          { id: 'c', text: '종이만 깔면 충분하다', points: 5, feedback: '더 푹신한 게 좋아요. 비절병은 치료가 어려워요' },
          { id: 'd', text: '가끔 풀어주면 된다', points: 3, feedback: '우리 안 바닥도 푹신해야 해요!' },
        ],
      },
      {
        id: 'q9',
        situation: '비 오는 날 토끼가 젖었어요.',
        question: '어떻게 하시나요?',
        options: [
          { id: 'a', text: '자연 건조시킨다', points: 2, feedback: '위험해요! 습기는 토끼에게 치명적이에요' },
          { id: 'b', text: '바로 수건으로 닦고 말린다', points: 10, feedback: '정답! 토끼는 습기에 약해서 바로 말려야 해요' },
          { id: 'c', text: '드라이기로 바로 말린다', points: 6, feedback: '좋지만 드라이기 소리와 열이 스트레스가 될 수 있어요. 낮은 온도로 조심히!' },
          { id: 'd', text: '하루 정도는 괜찮다', points: 0, feedback: '절대 안 돼요! 호흡기 질환으로 사망할 수 있어요' },
        ],
      },
      {
        id: 'q10',
        situation: '집에 강아지가 있는데 토끼를 입양하려고 해요.',
        question: '어떻게 하시나요?',
        options: [
          { id: 'a', text: '천천히 친해지게 하면 돼', points: 4, feedback: '친해 보여도 토끼는 본능적 공포를 느껴요' },
          { id: 'b', text: '완전히 분리된 공간에서 키운다', points: 8, feedback: '최선의 선택이지만 냄새와 소리만으로도 스트레스를 받을 수 있어요' },
          { id: 'c', text: '토끼 입양을 재고한다', points: 10, feedback: '가장 책임감 있는 결정이에요. 토끼에게 천적과의 동거는 극심한 스트레스예요' },
          { id: 'd', text: '강아지가 순하면 괜찮다', points: 2, feedback: '강아지 성격과 무관하게 토끼는 본능적으로 두려워해요' },
        ],
      },
    ],
    results: [
      {
        minScore: 90,
        maxScore: 100,
        grade: 'S',
        title: '프로 토끼 집사',
        emoji: '👑',
        description: '토끼의 모든 것을 이해하는 완벽한 집사! 토끼가 당신과 함께여서 행복할 거예요.',
        tips: ['후배 집사들에게 지식을 나눠주세요!', '토끼 커뮤니티에서 멘토 역할을 해보세요'],
      },
      {
        minScore: 75,
        maxScore: 89,
        grade: 'A',
        title: '베테랑 토끼 집사',
        emoji: '🌟',
        description: '토끼 돌봄에 능숙해요! 조금만 더 배우면 프로 집사!',
        tips: ['토끼 행동학 자료를 더 읽어보세요', '토끼 전문 수의사와 상담해보세요'],
      },
      {
        minScore: 60,
        maxScore: 74,
        grade: 'B',
        title: '성장하는 토끼 집사',
        emoji: '📚',
        description: '기본은 알고 있어요! 경험을 쌓으면 더 좋은 집사가 될 거예요.',
        tips: ['토끼 커뮤니티에 가입해서 정보를 공유하세요', '토끼 전문 서적을 읽어보세요'],
      },
      {
        minScore: 40,
        maxScore: 59,
        grade: 'C',
        title: '초보 토끼 집사',
        emoji: '🐣',
        description: '아직 배울 게 많지만 괜찮아요! 토끼와 함께 성장하면 돼요.',
        tips: ['토끼 기본 습성을 공부하세요', '응급 상황 대처법을 미리 익혀두세요', '토끼 전문 병원을 찾아두세요'],
      },
      {
        minScore: 0,
        maxScore: 39,
        grade: 'D',
        title: '예비 토끼 집사',
        emoji: '🔰',
        description: '토끼에 대해 더 공부가 필요해요. 입양 전 충분한 준비가 중요해요!',
        tips: [
          '토끼는 강아지, 고양이보다 섬세한 동물이에요',
          '토끼 입양 전 최소 1개월은 공부하세요',
          '토끼 카페에서 먼저 교감해보세요',
          '24시간 토끼 전문 동물병원을 미리 찾아두세요',
        ],
      },
    ],
  },
];

export default RABBIT_SCENARIO_QUIZZES;
