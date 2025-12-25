// exercise 테스트 데이터 (운동 매칭)
// 생성일: 2025-12-25

import type { SubjectData } from '../types';

export const exerciseData: SubjectData = {
  title: '나에게 맞는 운동 찾기',
  subtitle: '나의 운동 메이트는?',
  themeColor: 'bg-orange-300',
  icon: 'ExerciseIcon',
  dimensions: {
    intensity: { name: '강도', emoji: '💪', desc: '운동 강도와 체력 소모 정도' },
    social: { name: '사교', emoji: '👥', desc: '혼자 vs 함께하는 운동' },
    outdoor: { name: '야외', emoji: '🌳', desc: '실내 vs 야외 운동 선호' },
    compete: { name: '경쟁', emoji: '🏆', desc: '경쟁심과 승부욕' },
    routine: { name: '규칙성', emoji: '📅', desc: '규칙적 vs 자유로운 운동' },
  },
  questions: [
    {
      q: '운동할 때 얼마나 땀 흘리고 싶어요?',
      dimension: 'intensity',
      a: [
        { text: '땀 뻘뻘 흘릴 정도로!', score: 5 },
        { text: '가볍게 몸만 풀 정도로', score: 3 },
        { text: '땀 안 나는 게 좋아요', score: 1 },
      ],
    },
    {
      q: '운동 후 어떤 느낌이 좋아요?',
      dimension: 'intensity',
      a: [
        { text: '근육이 터질 것 같은 느낌', score: 5 },
        { text: '적당히 몸이 가벼운 느낌', score: 3 },
        { text: '몸이 이완되는 느낌', score: 1 },
      ],
    },
    {
      q: '운동 시간은 얼마나?',
      dimension: 'intensity',
      a: [
        { text: '1시간 이상 집중!', score: 5 },
        { text: '30분~1시간 정도', score: 3 },
        { text: '30분 이내로 짧게', score: 1 },
      ],
    },
    {
      q: '운동할 때 함께하는 사람은?',
      dimension: 'social',
      a: [
        { text: '친구들이랑 왁자지껄!', score: 5 },
        { text: '한두 명 정도면 좋아요', score: 3 },
        { text: '혼자 조용히 하고 싶어요', score: 1 },
      ],
    },
    {
      q: '운동 동기는 어디서 얻어요?',
      dimension: 'social',
      a: [
        { text: '다른 사람들 보면 자극돼요', score: 5 },
        { text: '같이하면 더 재밌어요', score: 3 },
        { text: '혼자서도 잘해요', score: 1 },
      ],
    },
    {
      q: '운동 후 친목은?',
      dimension: 'social',
      a: [
        { text: '운동 후 함께 밥먹기 좋아요', score: 5 },
        { text: '가끔은 괜찮아요', score: 3 },
        { text: '운동만 하고 바로 집 가고 싶어요', score: 1 },
      ],
    },
    {
      q: '선호하는 운동 장소는?',
      dimension: 'outdoor',
      a: [
        { text: '야외에서 상쾌하게!', score: 5 },
        { text: '날씨 보고 결정해요', score: 3 },
        { text: '실내가 편해요', score: 1 },
      ],
    },
    {
      q: '날씨가 나쁘면?',
      dimension: 'outdoor',
      a: [
        { text: '비 맞으면서도 해요', score: 5 },
        { text: '실내로 바꿔요', score: 3 },
        { text: '그냥 쉬어요', score: 1 },
      ],
    },
    {
      q: '자연 속에서 운동하는 게?',
      dimension: 'outdoor',
      a: [
        { text: '정말 좋아요! 기분 최고', score: 5 },
        { text: '가끔은 괜찮아요', score: 3 },
        { text: '별로 중요하지 않아요', score: 1 },
      ],
    },
    {
      q: '다른 사람과 비교하면?',
      dimension: 'compete',
      a: [
        { text: '이기고 싶어요! 승부욕 생겨요', score: 5 },
        { text: '가볍게 경쟁은 재밌어요', score: 3 },
        { text: '비교 안 해요, 내 페이스대로', score: 1 },
      ],
    },
    {
      q: '목표 달성이 중요해요?',
      dimension: 'compete',
      a: [
        { text: '꼭 목표 달성해야 해요!', score: 5 },
        { text: '목표는 있지만 여유롭게', score: 3 },
        { text: '즐기는 게 우선이에요', score: 1 },
      ],
    },
    {
      q: '점수나 기록을?',
      dimension: 'compete',
      a: [
        { text: '꼼꼼히 체크하고 경신해요', score: 5 },
        { text: '가끔 확인해요', score: 3 },
        { text: '별로 신경 안 써요', score: 1 },
      ],
    },
    {
      q: '운동 스케줄은?',
      dimension: 'routine',
      a: [
        { text: '정해진 요일, 시간에 꼭 해요', score: 5 },
        { text: '주 2-3회 정도 정해두고', score: 3 },
        { text: '생각날 때마다 자유롭게', score: 1 },
      ],
    },
    {
      q: '운동 계획을 못 지키면?',
      dimension: 'routine',
      a: [
        { text: '불편하고 찝찝해요', score: 5 },
        { text: '다음에 하면 돼요', score: 3 },
        { text: '원래 계획 없어요', score: 1 },
      ],
    },
    {
      q: '운동 프로그램은?',
      dimension: 'routine',
      a: [
        { text: '체계적인 루틴 따라가요', score: 5 },
        { text: '느슨한 가이드 참고해요', score: 3 },
        { text: '그때그때 즉흥적으로', score: 1 },
      ],
    },
  ],
  resultLabels: [
    {
      name: '크로스핏',
      emoji: '💥',
      desc: '고강도 그룹 운동의 끝판왕',
      condition: { intensity: 'high', social: 'high', compete: 'high' },
      mood: 'excited',
      color: 'bg-red-200',
      interpretation: '고강도 운동을 즐기고 다른 사람들과 함께 땀 흘리는 걸 좋아하는 당신! 크로스핏은 매번 다른 WOD(Workout of the Day)로 지루할 틈이 없고, 박스(체육관) 멤버들과 함께 성취감을 느낄 수 있어요.',
      guide: '초보자는 스케일링(강도 조절)부터 시작하세요. 코치의 폼 교정을 잘 따르고, 부상 예방이 중요해요. 주 3-4회가 적당합니다.',
      matchPoints: ['고강도 운동을 원하는 분', '팀워크를 즐기는 분', '매번 새로운 도전을 원하는 분', '경쟁을 즐기는 분'],
    },
    {
      name: '요가',
      emoji: '🧘',
      desc: '몸과 마음의 균형을 찾는 시간',
      condition: { intensity: 'low', social: 'low', routine: 'high' },
      mood: 'happy',
      color: 'bg-purple-100',
      interpretation: '조용히 자신의 몸과 대화하며 유연성과 정신적 평화를 찾는 당신. 요가는 규칙적으로 할 때 효과가 크고, 부상 위험도 적어 오래 할 수 있는 운동이에요.',
      guide: '초보자는 하타요가나 빈야사요가부터 시작하세요. 아침 공복이나 저녁에 하면 좋아요. 매트와 편한 옷만 있으면 집에서도 가능해요.',
      matchPoints: ['유연성을 키우고 싶은 분', '명상과 스트레칭을 즐기는 분', '조용한 환경을 선호하는 분', '규칙적인 운동을 원하는 분'],
    },
    {
      name: '러닝',
      emoji: '🏃',
      desc: '혼자만의 자유로운 달리기',
      condition: { intensity: 'high', social: 'low', outdoor: 'high' },
      mood: 'happy',
      color: 'bg-blue-100',
      interpretation: '혼자서 생각을 정리하며 자유롭게 달리는 시간을 즐기는 당신! 러닝은 별도의 장비나 장소 없이 언제든 시작할 수 있고, 야외에서 상쾌함을 느낄 수 있어요.',
      guide: '처음엔 천천히, 걷기와 뛰기를 번갈아가며 시작하세요. 좋은 러닝화는 필수! 부상 예방을 위해 스트레칭 꼭 하세요.',
      matchPoints: ['혼자 운동하길 원하는 분', '야외 활동을 즐기는 분', '자유로운 시간에 운동하고 싶은 분', '마라톤에 도전하고 싶은 분'],
    },
    {
      name: '등산',
      emoji: '⛰️',
      desc: '자연과 함께하는 힐링 운동',
      condition: { outdoor: 'high', intensity: 'medium', social: 'medium' },
      mood: 'happy',
      color: 'bg-green-100',
      interpretation: '자연 속에서 상쾌한 공기를 마시며 운동하는 걸 좋아하는 당신. 등산은 유산소와 근력을 동시에 키우고, 정상에 도착했을 때의 성취감이 커요.',
      guide: '처음엔 낮은 산부터 시작하세요. 등산화와 등산스틱, 충분한 물 준비 필수. 주말에 친구나 가족과 함께하면 더 즐거워요.',
      matchPoints: ['자연을 즐기는 분', '주말 운동을 원하는 분', '적당한 강도를 원하는 분', '경치 구경을 좋아하는 분'],
    },
    {
      name: '수영',
      emoji: '🏊',
      desc: '전신 운동의 정석',
      condition: { intensity: 'high', social: 'low', compete: 'medium' },
      mood: 'happy',
      color: 'bg-cyan-100',
      interpretation: '관절에 무리 없이 전신을 골고루 단련하고 싶은 당신! 수영은 물의 저항으로 근력과 유산소를 동시에 키우고, 부상 위험이 적어요.',
      guide: '자유형부터 배우고 점차 다른 영법도 익혀보세요. 수영모와 수경, 수영복만 있으면 OK. 처음엔 주 2-3회, 30분씩 시작하세요.',
      matchPoints: ['전신 운동을 원하는 분', '관절이 약한 분', '혼자 집중하고 싶은 분', '다이어트 효과를 원하는 분'],
    },
    {
      name: '배드민턴',
      emoji: '🏸',
      desc: '가볍게 즐기는 라켓 스포츠',
      condition: { social: 'high', compete: 'medium', intensity: 'medium' },
      mood: 'happy',
      color: 'bg-yellow-100',
      interpretation: '친구나 동료와 함께 가볍게 즐길 수 있는 운동을 찾는 당신! 배드민턴은 배우기 쉽고, 실내 체육관에서 계절 상관없이 즐길 수 있어요.',
      guide: '라켓과 셔틀콕, 운동화만 있으면 시작 가능. 처음엔 복식으로 가볍게, 실력이 늘면 단식도 도전해보세요. 손목 부상 주의!',
      matchPoints: ['함께 운동하고 싶은 분', '가볍게 즐기고 싶은 분', '실내 운동을 선호하는 분', '친목도 중요한 분'],
    },
    {
      name: '헬스(웨이트)',
      emoji: '🏋️',
      desc: '체계적으로 몸 만들기',
      condition: { intensity: 'high', routine: 'high', compete: 'low' },
      mood: 'cool',
      color: 'bg-gray-200',
      interpretation: '체계적으로 근육을 키우고 몸을 만들고 싶은 당신! 웨이트 트레이닝은 규칙적으로 할 때 효과가 크고, 성장하는 몸을 보는 재미가 있어요.',
      guide: '초보자는 PT 몇 회 받는 걸 추천. 스쿼트, 벤치프레스, 데드리프트 등 기본 운동부터 시작하세요. 휴식일도 중요해요!',
      matchPoints: ['근육을 키우고 싶은 분', '체계적인 운동을 원하는 분', '혼자서도 집중 잘하는 분', '몸의 변화를 기록하고 싶은 분'],
    },
    {
      name: '필라테스',
      emoji: '🤸',
      desc: '코어 강화와 바른 자세 만들기',
      condition: { intensity: 'medium', routine: 'high', social: 'low' },
      mood: 'happy',
      color: 'bg-pink-100',
      interpretation: '코어를 강화하고 바른 자세를 만들고 싶은 당신! 필라테스는 근력과 유연성을 동시에 키우고, 체형 교정에도 효과적이에요.',
      guide: '매트 필라테스부터 시작해서 리포머로 넘어가세요. 주 2-3회 규칙적으로 하는 게 중요해요. 호흡법을 잘 배우세요.',
      matchPoints: ['코어를 강화하고 싶은 분', '자세 교정이 필요한 분', '적당한 강도를 원하는 분', '규칙적인 운동을 선호하는 분'],
    },
    {
      name: '사이클',
      emoji: '🚴',
      desc: '바람 가르며 달리는 자유',
      condition: { outdoor: 'high', intensity: 'high', social: 'medium' },
      mood: 'excited',
      color: 'bg-green-200',
      interpretation: '야외에서 바람을 맞으며 달리는 걸 즐기는 당신! 사이클은 관절에 무리가 적으면서도 강력한 유산소 운동이고, 라이딩 코스를 탐험하는 재미가 있어요.',
      guide: '처음엔 평지 코스부터 시작하세요. 안전 장비(헬멧 필수!)와 적절한 자전거 선택이 중요해요. 그룹 라이딩도 재밌어요.',
      matchPoints: ['야외 활동을 즐기는 분', '관절 부담 적은 운동을 원하는 분', '장거리 라이딩에 관심 있는 분', '자전거 타는 걸 좋아하는 분'],
    },
    {
      name: '클라이밍',
      emoji: '🧗',
      desc: '머리와 몸을 함께 쓰는 퍼즐 운동',
      condition: { intensity: 'high', compete: 'high', social: 'medium' },
      mood: 'excited',
      color: 'bg-orange-100',
      interpretation: '단순한 근력 운동보다 전략과 문제 해결을 즐기는 당신! 클라이밍은 루트를 찾는 두뇌 플레이와 전신 근력을 동시에 사용하는 운동이에요.',
      guide: '볼더링(낮은 벽)부터 시작하세요. 클라이밍화와 초크백만 있으면 OK. 처음엔 쉬운 난이도부터 차근차근 도전하세요.',
      matchPoints: ['전략적 사고를 즐기는 분', '전신 근력을 키우고 싶은 분', '실내 운동을 선호하는 분', '새로운 도전을 즐기는 분'],
    },
  ],
};

if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).CHEMI_SUBJECTS = (window as unknown as Record<string, Record<string, unknown>>).CHEMI_SUBJECTS || {};
  (window as unknown as Record<string, Record<string, unknown>>).CHEMI_SUBJECTS.exercise = exerciseData;
}
