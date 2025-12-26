// ============================================================================
// 혈액형 시나리오 퀴즈 - 혈액형별 상황 반응 테스트
// ============================================================================

import type { ScenarioQuiz } from '../types';

export const BLOODTYPE_SCENARIO_QUIZZES: ScenarioQuiz[] = [
  {
    id: 'bloodtype-scenario-001',
    category: 'bloodtype',
    title: '혈액형별 상황 반응 테스트',
    description: '다양한 상황에서 혈액형별 반응을 얼마나 잘 아시나요?',
    emoji: '🩸',
    tags: ['혈액형', '성격', '시나리오', '재미', 'MBTI'],
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    },
    questions: [
      {
        id: 'q1',
        situation: '약속 시간에 늦게 될 것 같아요.',
        question: 'A형의 반응은?',
        options: [
          { id: 'a', text: '30분 전부터 미리 연락하고 사과한다', points: 10, feedback: '정답! A형은 계획적이고 책임감이 강해요!' },
          { id: 'b', text: '"거의 다 갔어~" 하고 여유부린다', points: 3, feedback: 'A형은 이렇게 여유롭지 않아요...' },
          { id: 'c', text: '늦어도 뭐 어때? 연락도 안 한다', points: 2, feedback: 'A형은 무책임하지 않아요!' },
          { id: 'd', text: '아예 약속을 취소해버린다', points: 1, feedback: '극단적이에요! A형은 성실해요' },
        ],
      },
      {
        id: 'q2',
        situation: '친구가 갑자기 집에 놀러 온다고 해요.',
        question: 'B형의 반응은?',
        options: [
          { id: 'a', text: '완벽하게 청소하고 음식 준비한다', points: 3, feedback: 'B형한테 이건 오바예요...' },
          { id: 'b', text: '"와~ 좋아! 뭐 먹을래?" 바로 환영', points: 10, feedback: '정답! B형은 즉흥적이고 환영해요!' },
          { id: 'c', text: '집이 더러워서 거절한다', points: 5, feedback: 'B형은 그런 거 별로 안 신경 써요' },
          { id: 'd', text: '스트레스받아서 짜증낸다', points: 2, feedback: 'B형은 오히려 좋아해요!' },
        ],
      },
      {
        id: 'q3',
        situation: '여행 계획을 세우고 있어요.',
        question: 'O형의 스타일은?',
        options: [
          { id: 'a', text: '엑셀로 시간표 짜고 예산 관리', points: 4, feedback: 'O형은 이렇게까지는...' },
          { id: 'b', text: '대충 큰 틀만 정하고 현지에서 즐흥', points: 10, feedback: '정답! O형은 대범하고 유연해요!' },
          { id: 'c', text: '계획 자체를 안 세운다', points: 7, feedback: '어느 정도는 생각해요!' },
          { id: 'd', text: '친구들한테 다 맡긴다', points: 3, feedback: 'O형은 리더십이 있어요!' },
        ],
      },
      {
        id: 'q4',
        situation: '친구가 요즘 고민이 있다며 연락했어요.',
        question: 'A형의 반응은?',
        options: [
          { id: 'a', text: '"힘내~" 하고 짧게 위로', points: 3, feedback: 'A형은 더 세심해요' },
          { id: 'b', text: '해결책을 자세히 정리해서 알려준다', points: 10, feedback: '정답! A형은 분석적이고 도움을 주려고 해요!' },
          { id: 'c', text: '듣는 척만 하고 딴생각', points: 1, feedback: 'A형은 진지하게 들어요!' },
          { id: 'd', text: '"나도 그래" 하고 공감만', points: 6, feedback: '공감도 하지만 해결책도 제시해요' },
        ],
      },
      {
        id: 'q5',
        situation: '프로젝트 마감이 내일인데 팀원이 연락이 안 돼요.',
        question: 'AB형의 반응은?',
        options: [
          { id: 'a', text: '일단 혼자 다 끝내고 나중에 따진다', points: 10, feedback: '정답! AB형은 냉철하고 효율적이에요!' },
          { id: 'b', text: '계속 연락 시도하며 기다린다', points: 4, feedback: 'AB형은 기다리기보다 행동해요' },
          { id: 'c', text: '포기하고 그냥 자러 간다', points: 2, feedback: '책임감은 있어요!' },
          { id: 'd', text: '화내며 욕한다', points: 3, feedback: '감정보다 이성적이에요' },
        ],
      },
      {
        id: 'q6',
        situation: '맛집에 갔는데 웨이팅이 2시간이에요.',
        question: 'B형의 반응은?',
        options: [
          { id: 'a', text: '참고 기다린다', points: 3, feedback: 'B형은 인내심이 짧아요...' },
          { id: 'b', text: '"에이, 딴 데 가자~" 즉시 포기', points: 10, feedback: '정답! B형은 집착 안 하고 유연해요!' },
          { id: 'c', text: '웨이팅 걸고 근처 카페 가기', points: 7, feedback: '이것도 가능하지만 대체 장소 찾는 게 더 B형스러워요' },
          { id: 'd', text: '직원한테 빨리 안 되냐고 물어본다', points: 2, feedback: 'B형은 귀찮게 안 해요' },
        ],
      },
      {
        id: 'q7',
        situation: '친구가 갑자기 계획 변경을 제안해요.',
        question: 'O형의 반응은?',
        options: [
          { id: 'a', text: '"왜? 원래 계획대로 하자"', points: 4, feedback: 'O형은 더 유연해요' },
          { id: 'b', text: '"오케이~ 그게 더 좋겠다" 쿨하게 수용', points: 10, feedback: '정답! O형은 적응력이 뛰어나요!' },
          { id: 'c', text: '짜증내며 거부한다', points: 2, feedback: 'O형은 대범해요!' },
          { id: 'd', text: '마지못해 따라간다', points: 5, feedback: '오히려 긍정적으로 받아들여요' },
        ],
      },
      {
        id: 'q8',
        situation: '단체 채팅방에서 의견이 분분해요.',
        question: 'AB형의 반응은?',
        options: [
          { id: 'a', text: '조용히 지켜만 본다', points: 10, feedback: '정답! AB형은 관찰자 스타일이에요!' },
          { id: 'b', text: '적극적으로 의견 제시', points: 5, feedback: '필요할 때만 나서요' },
          { id: 'c', text: '채팅방을 나간다', points: 4, feedback: '나가지 않아요, 조용히 있어요' },
          { id: 'd', text: '중재하려고 노력한다', points: 7, feedback: '중재보다는 관망해요' },
        ],
      },
      {
        id: 'q9',
        situation: '새로 산 가전제품 설명서를 읽고 있어요.',
        question: 'A형의 스타일은?',
        options: [
          { id: 'a', text: '처음부터 끝까지 정독한다', points: 10, feedback: '정답! A형은 꼼꼼하고 완벽주의예요!' },
          { id: 'b', text: '필요한 부분만 찾아서 본다', points: 6, feedback: '보긴 하는데 다 봐요' },
          { id: 'c', text: '설명서? 그게 뭐예요?', points: 2, feedback: 'A형은 설명서 잘 봐요!' },
          { id: 'd', text: '일단 써보고 안 되면 본다', points: 3, feedback: 'A형은 미리 확인해요' },
        ],
      },
      {
        id: 'q10',
        situation: '스트레스를 받는 날이에요.',
        question: 'B형이 푸는 방법은?',
        options: [
          { id: 'a', text: '혼자 조용히 있다', points: 4, feedback: 'B형은 혼자 있는 걸 안 좋아해요' },
          { id: 'b', text: '친구들 불러서 신나게 논다', points: 10, feedback: '정답! B형은 사람들과 함께 놀아요!' },
          { id: 'c', text: '계획을 세워서 해결한다', points: 3, feedback: '계획보다는 행동파예요' },
          { id: 'd', text: '잠자면서 잊어버린다', points: 6, feedback: '놀면서 푸는 게 더 B형스러워요' },
        ],
      },
    ],
    results: [
      {
        minScore: 90,
        maxScore: 100,
        grade: 'S',
        title: '혈액형 마스터',
        emoji: '🧠',
        description: '혈액형별 특성을 완벽하게 이해하고 있어요! 주변 사람들 성격 파악도 금방 하시겠는걸요?',
        tips: ['혈액형 성격론은 재미로만 즐기세요!', '사람은 혈액형보다 훨씬 다양해요'],
      },
      {
        minScore: 70,
        maxScore: 89,
        grade: 'A',
        title: '혈액형 전문가',
        emoji: '🎓',
        description: '혈액형별 특징을 잘 알고 있어요! 몇 가지만 더 알면 완벽!',
        tips: ['A형=꼼꼼, B형=자유, O형=대범, AB형=독특', '스테레오타입은 참고만 하세요'],
      },
      {
        minScore: 50,
        maxScore: 69,
        grade: 'B',
        title: '혈액형 관심러',
        emoji: '🔍',
        description: '기본적인 혈액형 성격은 알고 있어요! 조금만 더 공부하면 전문가!',
        tips: ['친구들 혈액형 물어보며 비교해보세요', '재미로 즐기는 게 포인트예요'],
      },
      {
        minScore: 30,
        maxScore: 49,
        grade: 'C',
        title: '혈액형 초보',
        emoji: '🐣',
        description: '아직 혈액형별 특징이 낯설어요. 하지만 배우면 재미있어요!',
        tips: ['주변 사람들의 혈액형과 성격을 관찰해보세요', '인터넷에 혈액형 성격 검색해보세요'],
      },
      {
        minScore: 0,
        maxScore: 29,
        grade: 'D',
        title: '혈액형 무관심',
        emoji: '😅',
        description: '혈액형 성격론에 관심이 없거나 잘 모르시는군요! 그래도 괜찮아요!',
        tips: ['혈액형은 과학적 근거가 부족해요', '재미로만 즐기고 사람은 다양하다는 걸 기억하세요', '성격은 혈액형보다 환경과 경험이 더 중요해요'],
      },
    ],
  },
];

export default BLOODTYPE_SCENARIO_QUIZZES;
