// bloodType 테스트 데이터 (혈액형 성향 매칭)
// 생성일: 2025-12-25
// 리서치: research/bloodType.md
// 참고: 과학적 근거 없음 (엔터테인먼트 목적)

import type { SubjectData } from '../types';

export const bloodTypeData: SubjectData = {
  title: '나의 혈액형 찾기',
  subtitle: '혈액형별 성향 테스트',
  themeColor: 'bg-red-600',
  icon: 'BloodTypeIcon',
  dimensions: {
    // 기존 4개 차원
    organized: { name: '계획성', emoji: '📋', desc: '꼼꼼함 vs 즉흥적' },
    social: { name: '사교성', emoji: '🎉', desc: '내향 vs 외향' },
    flexible: { name: '유연성', emoji: '🌊', desc: '원칙적 vs 융통성' },
    express: { name: '표현력', emoji: '💬', desc: '속마음 vs 직설적' },
    // 추가 2개 차원 (리서치 기반)
    logical: { name: '논리성', emoji: '🧠', desc: '감정적 vs 이성적' }, // AB형 특성
    stable: { name: '안정성', emoji: '🛡️', desc: '예민함 vs 안정' }, // A형 특성
  },
  questions: [
    // === organized (계획성) - 3문항 ===
    {
      q: '약속 시간 30분 전, 나는?',
      dimension: 'organized',
      a: [
        { text: '이미 준비 완료! 여유롭게 출발', score: 5 },
        { text: '슬슬 준비 시작', score: 3 },
        { text: '아직 뭐 하지? 급하게 준비', score: 1 },
      ],
    },
    {
      q: '여행 계획을 짤 때 나는?',
      dimension: 'organized',
      a: [
        { text: '일정표 작성! 동선까지 완벽하게', score: 5 },
        { text: '대략적인 루트만 잡아두기', score: 3 },
        { text: '그냥 가서 보자! 즉흥이 재미', score: 1 },
      ],
    },
    {
      q: '책상이나 방 정리는 어떤 스타일?',
      dimension: 'organized',
      a: [
        { text: '항상 깔끔! 정리 정돈 필수', score: 5 },
        { text: '주기적으로 정리하는 편', score: 3 },
        { text: '필요한 거 어디 있는지만 알면 됨', score: 1 },
      ],
    },
    // === social (사교성) - 3문항 ===
    {
      q: '처음 보는 사람들과 모임이 있다면?',
      dimension: 'social',
      a: [
        { text: '적극적으로 먼저 인사! 친해지기', score: 5 },
        { text: '먼저 말 걸진 않지만 적응은 잘함', score: 3 },
        { text: '불편해... 조용히 있을래', score: 1 },
      ],
    },
    {
      q: '단체 톡방에서 나는?',
      dimension: 'social',
      a: [
        { text: '리액션 장인! 분위기 메이커', score: 5 },
        { text: '가끔 이모티콘으로 반응', score: 3 },
        { text: '읽씹... 말 없이 지켜보기', score: 1 },
      ],
    },
    {
      q: '팀 프로젝트에서 나의 역할은?',
      dimension: 'social',
      a: [
        { text: '리더! 분위기 띄우고 의견 조율', score: 5 },
        { text: '성실히 맡은 역할 수행', score: 3 },
        { text: '조용히 뒤에서 서포트', score: 1 },
      ],
    },
    // === flexible (유연성) - 3문항 ===
    {
      q: '정해진 규칙이 불합리하다고 느낄 때?',
      dimension: 'flexible',
      a: [
        { text: '내 방식대로! 규칙보다 효율', score: 5 },
        { text: '상황 봐가며 유연하게 대처', score: 3 },
        { text: '규칙은 규칙! 따르는 게 맞아', score: 1 },
      ],
    },
    {
      q: '갑자기 일정이 변경됐을 때 나는?',
      dimension: 'flexible',
      a: [
        { text: '괜찮아~ 바로 Plan B로 전환', score: 5 },
        { text: '당황하지만 곧 적응', score: 3 },
        { text: '짜증남... 계획 망쳤잖아', score: 1 },
      ],
    },
    {
      q: '예상 밖의 문제가 생겼을 때?',
      dimension: 'flexible',
      a: [
        { text: '오히려 재밌어! 바로 대응', score: 5 },
        { text: '잠깐 당황하지만 침착하게 해결', score: 3 },
        { text: '당황스럽고 스트레스 받음', score: 1 },
      ],
    },
    // === express (표현력) - 3문항 ===
    {
      q: '친구가 고민 상담을 할 때 나는?',
      dimension: 'express',
      a: [
        { text: '바로 해결책 제시! 이렇게 해봐', score: 5 },
        { text: '공감하면서 조심스레 의견 줌', score: 3 },
        { text: '그냥 들어주기만... 내 생각은 숨김', score: 1 },
      ],
    },
    {
      q: '누가 나에게 실수했을 때?',
      dimension: 'express',
      a: [
        { text: '참지 못하고 바로 표현', score: 5 },
        { text: '한 번은 참지만 계속되면 말함', score: 3 },
        { text: '속으로 삭이고... 표현 안 함', score: 1 },
      ],
    },
    {
      q: '내 솔직한 감정을 표현하는 것은?',
      dimension: 'express',
      a: [
        { text: '감정 표현 잘함! 숨기는 거 힘들어', score: 5 },
        { text: '친한 사람에겐 표현함', score: 3 },
        { text: '어려워... 속마음 잘 안 드러냄', score: 1 },
      ],
    },
    // === logical (논리성) - 2문항 (신규) ===
    {
      q: '중요한 결정을 내릴 때 나는?',
      dimension: 'logical',
      a: [
        { text: '장단점 분석! 논리적으로 판단', score: 5 },
        { text: '논리와 감정 둘 다 고려', score: 3 },
        { text: '직감을 믿어! 마음 가는 대로', score: 1 },
      ],
    },
    {
      q: '친구랑 다툰 후 화해할 때?',
      dimension: 'logical',
      a: [
        { text: '누가 잘못했는지 객관적으로 분석', score: 5 },
        { text: '상황 봐가며 적당히 풀기', score: 3 },
        { text: '그냥 감정적으로 풀자, 분석은 피곤해', score: 1 },
      ],
    },
    // === stable (안정성) - 2문항 (신규) ===
    {
      q: '작은 실수를 했을 때 나는?',
      dimension: 'stable',
      a: [
        { text: '그럴 수 있지! 금방 잊어버림', score: 5 },
        { text: '조금 신경 쓰이지만 괜찮아', score: 3 },
        { text: '계속 생각나고 후회돼...', score: 1 },
      ],
    },
    {
      q: '남들이 나를 어떻게 생각할지?',
      dimension: 'stable',
      a: [
        { text: '별로 신경 안 써, 나는 나니까', score: 5 },
        { text: '가끔 신경 쓰이기도 해', score: 3 },
        { text: '많이 신경 쓰여... 눈치 보게 됨', score: 1 },
      ],
    },
  ],
  resultLabels: [
    // === 기본 4유형 (주요 혈액형) ===
    {
      name: 'A형 스타일',
      emoji: '📋',
      desc: '완벽주의 계획형 인간',
      condition: { organized: 'high', flexible: 'low' },
      mood: 'cool',
      color: 'bg-blue-200',
      interpretation:
        '당신은 전형적인 A형 스타일! 꼼꼼하고 계획적이며 원칙을 중시하는 성향이에요. 무엇이든 미리 준비하고, 규칙과 질서를 중요하게 생각합니다. 다만 작은 일에도 신경 쓰는 경향이 있어요.',
      guide:
        '가끔은 계획 없이 즉흥적으로 행동해보세요. 완벽하지 않아도 괜찮다는 걸 기억하세요. 작은 실수에 너무 자책하지 마세요!',
      matchPoints: ['계획적인 분', '꼼꼼한 분', '원칙을 중시하는 분', '완벽주의 성향인 분'],
    },
    {
      name: 'B형 스타일',
      emoji: '🎨',
      desc: '자유로운 영혼의 즉흥파',
      condition: { flexible: 'high', express: 'high', organized: 'low' },
      mood: 'excited',
      color: 'bg-yellow-200',
      interpretation:
        '당신은 전형적인 B형 스타일! 자유분방하고 융통성 있으며 솔직한 성향이에요. 규칙보다는 효율을, 계획보다는 즉흥을 선호합니다. 스트레스도 금방 털어내는 긍정적인 타입!',
      guide:
        '중요한 약속은 메모해두세요. 너무 즉흥적이면 주변 사람들이 힘들어할 수 있어요. 가끔은 계획을 세워보면 더 효율적일 수 있답니다.',
      matchPoints: ['자유로운 분', '융통성 있는 분', '솔직한 분', '즉흥적인 분'],
    },
    {
      name: 'O형 스타일',
      emoji: '🎉',
      desc: '사교적인 분위기 메이커',
      condition: { social: 'high', stable: 'high', organized: 'low' },
      mood: 'happy',
      color: 'bg-red-200',
      interpretation:
        '당신은 전형적인 O형 스타일! 사교적이고 활발하며 표현이 풍부한 성향이에요. 리더십이 있고 대범해서 주변에 친구가 많습니다. 작은 일에 연연하지 않는 대범한 성격!',
      guide:
        '때로는 혼자만의 시간도 중요해요. 모든 사람을 만족시키려 하지 말고, 가끔은 나 자신을 돌아보는 시간을 가져보세요.',
      matchPoints: ['사교적인 분', '활발한 분', '리더십 있는 분', '대범한 분'],
    },
    {
      name: 'AB형 스타일',
      emoji: '🎭',
      desc: '냉철하고 논리적인 분석가',
      condition: { logical: 'high', social: 'low', organized: 'high' },
      mood: 'cool',
      color: 'bg-purple-200',
      interpretation:
        '당신은 전형적인 AB형 스타일! 논리적이고 냉철하며 자신만의 세계가 있는 독특한 성향이에요. 감정보다 이성으로 판단하고, 효율적으로 문제를 해결합니다.',
      guide:
        '사람들에게 마음을 조금 더 열어보세요. 감정도 소중한 판단 기준이에요. 너무 혼자 고민하지 말고 주변에 도움을 요청해보세요.',
      matchPoints: ['논리적인 분', '냉철한 분', '독특한 분', '분석적인 분'],
    },
    // === 혼합 유형 ===
    {
      name: 'A형에 가까운 O형',
      emoji: '📝',
      desc: '계획적인 리더',
      condition: { organized: 'high', social: 'high' },
      mood: 'happy',
      color: 'bg-pink-200',
      interpretation:
        'A형의 계획성과 O형의 사교성을 모두 가진 당신! 체계적으로 일을 처리하면서도 사람들과 잘 어울려요. 리더로서 좋은 자질을 갖추고 있습니다.',
      guide:
        '완벽함과 인간관계 사이에서 균형을 잡으세요. 때로는 규칙을 지키지 않는 사람들을 이해하는 여유가 필요해요.',
      matchPoints: ['계획적인 분', '사교적인 분', '리더십 있는 분', '체계적인 분'],
    },
    {
      name: 'B형에 가까운 O형',
      emoji: '🌈',
      desc: '자유롭고 활발한 에너자이저',
      condition: { flexible: 'high', social: 'high' },
      mood: 'excited',
      color: 'bg-orange-200',
      interpretation:
        'B형의 자유로움과 O형의 활발함을 모두 가진 당신! 어디서든 적응 잘하고, 새로운 환경도 거침없이 즐기는 타입이에요.',
      guide: '중요한 일은 메모하고, 약속은 꼭 지키세요. 너무 자유분방하면 신뢰를 잃을 수 있어요.',
      matchPoints: ['자유로운 분', '활발한 분', '긍정적인 분', '적응력 좋은 분'],
    },
    {
      name: '논리적 A형',
      emoji: '🔍',
      desc: '완벽주의 분석가',
      condition: { organized: 'high', logical: 'high' },
      mood: 'cool',
      color: 'bg-indigo-200',
      interpretation:
        'A형의 계획성과 AB형의 논리성을 모두 가진 당신! 체계적이면서도 이성적으로 판단하는 능력이 뛰어나요. 혼자 문제를 분석하고 해결하는 걸 잘합니다.',
      guide: '가끔은 감정도 중요한 판단 기준이에요. 직감을 무시하지 마세요.',
      matchPoints: ['꼼꼼한 분', '논리적인 분', '신중한 분', '분석적인 분'],
    },
    {
      name: '균형잡힌 만능형',
      emoji: '⚖️',
      desc: '상황에 따라 유연하게',
      condition: { organized: 'medium', social: 'medium', flexible: 'medium' },
      mood: 'happy',
      color: 'bg-green-200',
      interpretation:
        '특정 혈액형으로 딱 떨어지지 않는 균형 잡힌 당신! 상황에 따라 계획적일 수도, 즉흥적일 수도 있어요. 융통성 있게 대처하는 능력이 뛰어납니다.',
      guide:
        '당신의 균형감은 큰 장점이에요. 다만 때로는 명확한 자기 주장도 필요하니, 확실한 입장을 취하는 연습도 해보세요.',
      matchPoints: ['유연한 분', '균형 잡힌 분', '상황 파악 빠른 분', '적응력 좋은 분'],
    },
    {
      name: '예민한 완벽주의자',
      emoji: '💎',
      desc: '섬세하고 꼼꼼한',
      condition: { organized: 'high', stable: 'low' },
      mood: 'calm',
      color: 'bg-sky-200',
      interpretation:
        '완벽을 추구하면서도 섬세하고 예민한 당신! 작은 디테일도 놓치지 않지만, 때로는 너무 많은 것에 신경 쓰느라 지칠 수 있어요.',
      guide:
        '완벽하지 않아도 괜찮아요. 스스로에게 너무 엄격하지 마세요. 작은 성취도 축하하는 습관을 들여보세요.',
      matchPoints: ['섬세한 분', '꼼꼼한 분', '책임감 있는 분', '신경 많이 쓰는 분'],
    },
    {
      name: '쿨한 개인주의자',
      emoji: '🌟',
      desc: '독립적이고 냉철한',
      condition: { stable: 'high', social: 'low' },
      mood: 'cool',
      color: 'bg-slate-200',
      interpretation:
        '논리적이면서도 멘탈이 강한 당신! 남의 시선에 연연하지 않고 자기만의 길을 갑니다. 감정에 휘둘리지 않고 이성적으로 판단해요.',
      guide:
        '가끔은 감정도 표현해보세요. 너무 쿨하면 차갑게 보일 수 있어요. 주변 사람들에게 마음을 열어보세요.',
      matchPoints: ['독립적인 분', '논리적인 분', '멘탈 강한 분', '쿨한 분'],
    },
    {
      name: '솔직한 행동파',
      emoji: '⚡',
      desc: '직설적이고 빠른',
      condition: { express: 'high', flexible: 'high' },
      mood: 'excited',
      color: 'bg-amber-200',
      interpretation:
        '생각을 바로 말하고 행동도 빠른 당신! 솔직하고 유연해서 상황 대처 능력이 뛰어나요. 눈치 보지 않고 자기 할 말 하는 스타일!',
      guide:
        '솔직함은 좋지만, 때로는 한 번 더 생각하고 말해보세요. 상대방 감정도 고려하면 더 좋은 관계를 만들 수 있어요.',
      matchPoints: ['솔직한 분', '행동력 있는 분', '유연한 분', '빠른 분'],
    },
    {
      name: '내향적 자유인',
      emoji: '🎨',
      desc: '조용하지만 자유로운',
      condition: { flexible: 'high', social: 'low' },
      mood: 'calm',
      color: 'bg-lime-200',
      interpretation:
        '자유로움을 추구하지만 혼자 있는 걸 선호하는 당신! 규칙에 얽매이지 않고 자기만의 세계에서 창의적으로 살아가는 독립적인 성향이에요.',
      guide: '가끔은 다른 사람들의 의견도 들어보세요. 혼자서만 결정하면 시야가 좁아질 수 있어요.',
      matchPoints: ['자유로운 분', '독립적인 분', '창의적인 분', '조용한 분'],
    },
    {
      name: '폭넓은 적응형',
      emoji: '🌍',
      desc: '어디서든 잘 어울리는',
      condition: {},
      mood: 'happy',
      color: 'bg-gray-200',
      interpretation:
        '특정 패턴으로 분류하기 어려운 당신! 다양한 성향을 골고루 가지고 있어서, 상황과 사람에 따라 유연하게 변화하는 카멜레온 같은 타입이에요.',
      guide:
        '다양한 경험을 쌓으면서 자신만의 스타일을 찾아가세요. 모든 상황에 맞추려 하기보다, 때로는 나다움을 지키는 것도 중요해요.',
      matchPoints: ['유연한 분', '적응력 좋은 분', '다재다능한 분', '포용력 있는 분'],
    },
  ],
};

if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).CHEMI_SUBJECTS =
    (window as unknown as Record<string, Record<string, unknown>>).CHEMI_SUBJECTS || {};
  (window as unknown as Record<string, Record<string, unknown>>).CHEMI_SUBJECTS.bloodType =
    bloodTypeData;
}
