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
    questions: [
      {
        id: 'q1',
        situation: '산책 중 강아지가 갑자기 앉아서 움직이지 않아요.',
        question: '어떻게 하시나요?',
        options: [
          { id: 'a', text: '리드줄을 당겨서 억지로 이동시킨다', points: 2, feedback: '강압적인 방법은 신뢰를 잃게 해요' },
          { id: 'b', text: '왜 그런지 주변을 살피고 잠시 기다린다', points: 10, feedback: '완벽해요! 무언가 불안하거나 피곤할 수 있어요' },
          { id: 'c', text: '간식으로 유인한다', points: 7, feedback: '좋은 방법이지만 매번 이러면 습관이 될 수 있어요' },
          { id: 'd', text: '안고 이동한다', points: 5, feedback: '해결책이 될 수 있지만 원인 파악이 먼저예요' },
        ],
      },
      {
        id: 'q2',
        situation: '강아지가 다른 개를 보면 짖고 흥분해요.',
        question: '어떻게 대처하시나요?',
        options: [
          { id: 'a', text: '큰 소리로 "안 돼!"라고 외친다', points: 3, feedback: '오히려 흥분을 더 자극할 수 있어요' },
          { id: 'b', text: '거리를 유지하며 차분히 "앉아" 명령', points: 10, feedback: '훌륭해요! 적절한 거리와 명령으로 진정시켜요' },
          { id: 'c', text: '그냥 빨리 지나간다', points: 5, feedback: '회피는 임시방편이에요' },
          { id: 'd', text: '강제로 다른 개에게 다가가게 한다', points: 1, feedback: '위험해요! 공격성이 더 커질 수 있어요' },
        ],
      },
      {
        id: 'q3',
        situation: '강아지가 소파를 물어뜯었어요.',
        question: '어떻게 하시나요?',
        options: [
          { id: 'a', text: '현행범이 아니면 나중에 혼낸다', points: 2, feedback: '강아지는 나중에 혼나면 왜인지 몰라요' },
          { id: 'b', text: '씹을 수 있는 장난감을 제공하고 운동량 체크', points: 10, feedback: '정확해요! 에너지 해소와 대체재 제공이 핵심!' },
          { id: 'c', text: '소파에 쓴맛 스프레이를 뿌린다', points: 7, feedback: '도움이 되지만 근본 원인 해결이 필요해요' },
          { id: 'd', text: '소파가 있는 방 출입을 금지한다', points: 5, feedback: '일시적 해결이지만 원인은 해결 안 돼요' },
        ],
      },
      {
        id: 'q4',
        situation: '강아지가 밥을 먹다가 으르렁거려요.',
        question: '이 행동의 원인과 대처법은?',
        options: [
          { id: 'a', text: '밥그릇을 바로 치워버린다', points: 2, feedback: '오히려 자원 보호 본능을 강화해요' },
          { id: 'b', text: '밥 먹을 때 가까이 가면서 간식을 던져준다', points: 10, feedback: '훌륭해요! 긍정적 연관을 만들어 보호 본능을 줄여요' },
          { id: 'c', text: '무시하고 알아서 먹게 둔다', points: 5, feedback: '악화되지 않게 관리는 필요해요' },
          { id: 'd', text: '혼내서 버릇을 고친다', points: 1, feedback: '공격성이 더 커질 수 있어 위험해요' },
        ],
      },
      {
        id: 'q5',
        situation: '산책 후 강아지 발을 닦으려는데 싫어해요.',
        question: '어떻게 적응시키나요?',
        options: [
          { id: 'a', text: '억지로 잡고 빨리 닦는다', points: 3, feedback: '발 터치에 대한 거부감이 더 커질 수 있어요' },
          { id: 'b', text: '발 터치 → 간식 연습을 꾸준히 한다', points: 10, feedback: '완벽해요! 점진적 탈감작이 최고예요' },
          { id: 'c', text: '발 닦기를 포기한다', points: 2, feedback: '위생상 발 관리는 필요해요' },
          { id: 'd', text: '다른 사람이 잡고 있으면 닦는다', points: 4, feedback: '근본적 해결이 아니에요' },
        ],
      },
      {
        id: 'q6',
        situation: '강아지가 "앉아"를 알아듣는데 밖에서는 안 해요.',
        question: '왜 그럴까요?',
        options: [
          { id: 'a', text: '일부러 말 안 듣는 거예요', points: 2, feedback: '강아지는 의도적으로 무시하지 않아요' },
          { id: 'b', text: '환경이 바뀌면 일반화 훈련이 필요해요', points: 10, feedback: '정확해요! 다양한 장소에서 연습이 필요해요' },
          { id: 'c', text: '밖이 더 시끄러워서 못 들어요', points: 5, feedback: '부분적으로 맞지만 핵심은 일반화예요' },
          { id: 'd', text: '밖에서는 간식을 더 줘야 해요', points: 6, feedback: '보상 강화도 도움 되지만 근본은 일반화!' },
        ],
      },
      {
        id: 'q7',
        situation: '강아지가 손님의 다리에 올라타요 (마운팅).',
        question: '이 행동의 의미와 대처는?',
        options: [
          { id: 'a', text: '성적 행동이라 방치한다', points: 3, feedback: '성적 의미만 있는 게 아니에요' },
          { id: 'b', text: '흥분/스트레스/서열 표현, "안 돼" 후 분리', points: 10, feedback: '맞아요! 다양한 원인이 있고 즉시 중단시켜야 해요' },
          { id: 'c', text: '손님이 싫다는 신호', points: 2, feedback: '오히려 관심/흥분의 표현일 수 있어요' },
          { id: 'd', text: '귀엽다고 웃으며 둔다', points: 1, feedback: '행동이 강화되고 손님이 불쾌할 수 있어요' },
        ],
      },
      {
        id: 'q8',
        situation: '강아지가 산책 중 풀을 뜯어먹어요.',
        question: '이 행동에 대해 어떻게 생각하시나요?',
        options: [
          { id: 'a', text: '즉시 막는다 - 위험하니까', points: 5, feedback: '농약 묻은 풀은 위험하지만 본능적 행동이기도 해요' },
          { id: 'b', text: '소화 불편이나 영양 부족 신호일 수 있어 관찰', points: 10, feedback: '훌륭해요! 원인을 파악하고 안전한 곳에서만 허용해요' },
          { id: 'c', text: '배가 고픈 거라 밥을 더 준다', points: 4, feedback: '양이 문제가 아닐 수 있어요' },
          { id: 'd', text: '자연스러운 행동이니 항상 허용', points: 3, feedback: '농약/제초제 묻은 풀은 위험해요' },
        ],
      },
      {
        id: 'q9',
        situation: '혼자 두면 강아지가 계속 짖어요.',
        question: '분리불안 대처법으로 가장 좋은 것은?',
        options: [
          { id: 'a', text: '외출 전 오래 안아주고 인사한다', points: 3, feedback: '오히려 분리 상황을 크게 만들어요' },
          { id: 'b', text: '떠남/돌아옴을 대수롭지 않게 + 점진적 훈련', points: 10, feedback: '정답! 담담하게 외출하고 짧은 분리부터 연습해요' },
          { id: 'c', text: '짖으면 돌아가서 달래준다', points: 2, feedback: '짖으면 온다고 학습해요' },
          { id: 'd', text: '외출 시 TV를 켜둔다', points: 6, feedback: '도움은 되지만 근본 해결은 아니에요' },
        ],
      },
      {
        id: 'q10',
        situation: '강아지가 앞발로 당신을 툭툭 쳐요.',
        question: '이 행동의 의미는?',
        options: [
          { id: 'a', text: '공격하려는 거예요', points: 1, feedback: '이건 공격 신호가 아니에요!' },
          { id: 'b', text: '관심/놀이/애정 요청이에요', points: 10, feedback: '맞아요! "나 봐줘" "놀아줘"의 표현이에요' },
          { id: 'c', text: '아프다는 신호예요', points: 2, feedback: '발로 치는 건 소통 시도예요' },
          { id: 'd', text: '훈련이 안 된 거예요', points: 4, feedback: '자연스러운 의사표현이에요' },
        ],
      },
    ],
    results: [
      {
        minScore: 90,
        maxScore: 100,
        grade: 'S',
        title: '베스트 프렌드',
        emoji: '🏆',
        description: '강아지의 마음을 완벽히 읽는 최고의 친구! 당신의 강아지는 정말 행복해요.',
        tips: ['후배 견주들에게 조언을 나눠주세요!'],
      },
      {
        minScore: 70,
        maxScore: 89,
        grade: 'A',
        title: '훌륭한 견주',
        emoji: '🌟',
        description: '강아지와 좋은 케미! 조금만 더 배우면 완벽한 파트너!',
        tips: ['반려견 행동학 책을 읽어보세요', '트레이너 상담도 고려해보세요'],
      },
      {
        minScore: 50,
        maxScore: 69,
        grade: 'B',
        title: '성장하는 견주',
        emoji: '📖',
        description: '기본기가 좋아요! 경험이 쌓이면 더 좋은 견주가 될 거예요.',
        tips: ['강아지 바디랭귀지를 공부해보세요', '긍정 강화 훈련을 배워보세요'],
      },
      {
        minScore: 30,
        maxScore: 49,
        grade: 'C',
        title: '초보 견주',
        emoji: '🐣',
        description: '아직 배울 게 많지만 괜찮아요! 강아지와 함께 성장하세요.',
        tips: ['강아지 관련 커뮤니티에 가입해보세요', '기초 훈련 클래스를 들어보세요'],
      },
      {
        minScore: 0,
        maxScore: 29,
        grade: 'D',
        title: '예비 견주',
        emoji: '🔰',
        description: '아직 강아지에 대해 많이 모르지만, 배우려는 마음이 중요해요!',
        tips: ['강아지 입양 전 충분히 공부하세요', '강아지 카페에서 먼저 교감해보세요', '유튜브 훈련 채널을 참고하세요'],
      },
    ],
  },
];

export default DOG_SCENARIO_QUIZZES;
