'use client';

import { useState, useMemo } from 'react';
import { CHEMI_DATA } from '@/data';
import { SubjectKey, ResultLabel, SubjectData } from '@/data/types';
import {
  Trophy,
  Sparkles,
  Filter,
  Clock,
  BarChart3,
  ListOrdered,
} from 'lucide-react';
import RankingStats from './RankingStats';

// ============================================================================
// 타입 정의
// ============================================================================

interface RankingCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  group: 'personality' | 'practical' | 'lifestyle'; // 카테고리 그룹
  tests: SubjectKey[];
  getScore: (result: ResultLabel) => number;
  funFacts?: string[]; // 재미있는 사실
}

type SeasonType = 'yearly' | 'quarterly' | 'event';

interface Season {
  type: SeasonType;
  name: string;
  emoji: string;
  description: string;
  startDate?: string;
  endDate?: string;
}

// ============================================================================
// 시즌 설정
// ============================================================================

const SEASONS: Season[] = [
  {
    type: 'yearly',
    name: '2025 연간 랭킹',
    emoji: '🏆',
    description: '올해의 인기 결과 명예의 전당'
  },
  {
    type: 'quarterly',
    name: '2025 Q1 시즌',
    emoji: '🌸',
    description: '1월~3월 시즌 랭킹 (봄맞이)'
  },
  {
    type: 'event',
    name: '발렌타인 특별 랭킹',
    emoji: '💝',
    description: '연인/친구와 함께하기 좋은 결과'
  }
];

// ============================================================================
// 랭킹 카테고리 - 성격/특성 기반
// ============================================================================

const PERSONALITY_RANKINGS: RankingCategory[] = [
  {
    id: 'most_active',
    name: '가장 활발한',
    emoji: '🏃',
    description: '에너지 넘치고 활동적인 결과들',
    group: 'personality',
    tests: ['petMatch', 'human', 'dog', 'cat', 'rabbit', 'hamster'],
    getScore: (result) => {
      const c = result.condition;
      let score = 0;
      if (c.activity === 'high') score += 3;
      if (c.energy === 'high') score += 3;
      if (c.active === 'high') score += 3;
      if (c.inssa === 'high') score += 2;
      if (c.adventure === 'high') score += 2;
      return score;
    },
    funFacts: [
      '활동적인 반려동물은 매일 30분 이상 운동이 필요해요',
      '함께 뛰어놀면 주인도 건강해져요!'
    ]
  },
  {
    id: 'most_calm',
    name: '가장 차분한',
    emoji: '🧘',
    description: '조용하고 평화로운 결과들',
    group: 'personality',
    tests: ['petMatch', 'human', 'dog', 'cat', 'rabbit', 'hamster', 'plant'],
    getScore: (result) => {
      const c = result.condition;
      let score = 0;
      if (c.activity === 'low') score += 3;
      if (c.energy === 'low') score += 3;
      if (c.noise === 'low') score += 3;
      if (c.chill === 'high') score += 2;
      if (c.plan === 'high') score += 2;
      return score;
    },
    funFacts: [
      '차분한 반려동물은 아파트에서 키우기 좋아요',
      '층간소음 걱정이 적어요'
    ]
  },
  {
    id: 'most_social',
    name: '가장 사교적인',
    emoji: '💬',
    description: '친화력 넘치고 교감을 좋아하는 결과들',
    group: 'personality',
    tests: ['petMatch', 'human', 'dog', 'cat', 'rabbit', 'idealType'],
    getScore: (result) => {
      const c = result.condition;
      let score = 0;
      if (c.touch === 'high') score += 3;
      if (c.social === 'high') score += 3;
      if (c.inssa === 'high') score += 3;
      if (c.humanLove === 'high') score += 3;
      if (c.express === 'high') score += 2;
      if (c.cute === 'high') score += 2;
      return score;
    },
    funFacts: [
      '사교적인 반려동물은 분리불안에 주의하세요',
      '외출이 잦다면 조금 독립적인 친구가 좋아요'
    ]
  },
  {
    id: 'most_independent',
    name: '가장 독립적인',
    emoji: '🦅',
    description: '자기만의 공간을 좋아하는 결과들',
    group: 'personality',
    tests: ['petMatch', 'human', 'cat', 'rabbit', 'plant'],
    getScore: (result) => {
      const c = result.condition;
      let score = 0;
      if (c.touch === 'low') score += 3;
      if (c.social === 'low') score += 3;
      if (c.inssa === 'low') score += 2;
      if (c.boss === 'high') score += 2;
      if (c.time === 'low') score += 2;
      return score;
    },
    funFacts: [
      '독립적인 성격은 바쁜 직장인에게 잘 맞아요',
      '혼자 있는 시간을 잘 견뎌요'
    ]
  },
];

// ============================================================================
// 랭킹 카테고리 - 실용적 기준
// ============================================================================

const PRACTICAL_RANKINGS: RankingCategory[] = [
  {
    id: 'most_expensive',
    name: '가장 비용이 드는',
    emoji: '💰',
    description: '초기비용 + 월관리비가 높은 순',
    group: 'practical',
    tests: ['petMatch', 'plant'],
    getScore: (result) => {
      const c = result.condition;
      let score = 0;
      // 활동량 높음 = 비용 높음 (사료, 산책용품 등)
      if (c.activity === 'high') score += 2;
      // 관리 필요 = 비용 높음
      if (c.care === 'high') score += 3;
      // 공간 필요 = 비용 높음
      if (c.space === 'high') score += 2;
      // 시간 필요 = 간접비용
      if (c.time === 'high') score += 1;
      // 특별 관리 (물, 빛 등)
      if (c.water === 'high') score += 1;
      if (c.light === 'high') score += 1;
      return score;
    },
    funFacts: [
      '대형견은 월 30~50만원 정도 들어요',
      '희귀 품종일수록 의료비가 높아요'
    ]
  },
  {
    id: 'most_affordable',
    name: '가장 저렴한',
    emoji: '💵',
    description: '최소 비용으로 키울 수 있는 순',
    group: 'practical',
    tests: ['petMatch', 'plant'],
    getScore: (result) => {
      const c = result.condition;
      let score = 6; // 기본 점수에서 감점
      if (c.activity === 'high') score -= 2;
      if (c.care === 'high') score -= 2;
      if (c.space === 'high') score -= 1;
      if (c.time === 'high') score -= 1;
      return Math.max(0, score);
    },
    funFacts: [
      '햄스터, 베타 물고기가 초기비용이 가장 낮아요',
      '스투키는 거의 비용이 안 들어요'
    ]
  },
  {
    id: 'kid_friendly',
    name: '아이에게 적합한',
    emoji: '👶',
    description: '아이와 함께하기 좋은, 안전한 결과',
    group: 'practical',
    tests: ['petMatch', 'dog', 'cat', 'rabbit'],
    getScore: (result) => {
      const c = result.condition;
      let score = 0;
      // 사교적이고 순한 성격
      if (c.touch === 'high') score += 2;
      if (c.humanLove === 'high') score += 3;
      if (c.social === 'high') score += 2;
      // 너무 활동적이지 않음 (안전)
      if (c.activity === 'medium') score += 2;
      // 공격성 낮음
      if (c.boss === 'low') score += 2;
      if (c.alert === 'low') score += 1;
      return score;
    },
    funFacts: [
      '골든리트리버, 래브라도가 아이들과 잘 어울려요',
      '작은 동물은 아이가 다치게 할 수 있어 주의!'
    ]
  },
  {
    id: 'senior_friendly',
    name: '어르신에게 적합한',
    emoji: '👴',
    description: '낮은 활동량, 쉬운 관리가 필요한 결과',
    group: 'practical',
    tests: ['petMatch', 'plant', 'cat'],
    getScore: (result) => {
      const c = result.condition;
      let score = 0;
      // 낮은 활동량
      if (c.activity === 'low') score += 3;
      if (c.energy === 'low') score += 2;
      // 쉬운 관리
      if (c.care === 'low') score += 2;
      if (c.time === 'low') score += 2;
      // 조용함
      if (c.noise === 'low') score += 1;
      return score;
    },
    funFacts: [
      '고양이는 산책이 필요없어 어르신께 인기예요',
      '관상어 바라보기는 혈압을 낮춰준대요'
    ]
  },
  {
    id: 'single_friendly',
    name: '자취생 추천',
    emoji: '🏢',
    description: '작은 공간, 적은 시간으로 가능한 결과',
    group: 'practical',
    tests: ['petMatch', 'plant'],
    getScore: (result) => {
      const c = result.condition;
      let score = 0;
      // 작은 공간 OK
      if (c.space === 'low') score += 3;
      // 적은 시간 OK
      if (c.time === 'low') score += 3;
      // 조용함 (원룸)
      if (c.noise === 'low') score += 2;
      // 쉬운 관리
      if (c.care === 'low') score += 1;
      return score;
    },
    funFacts: [
      '고양이, 햄스터, 베타가 원룸에서 인기예요',
      '스투키, 산세베리아는 방치해도 잘 살아요'
    ]
  },
  {
    id: 'family_friendly',
    name: '가족용 추천',
    emoji: '👨‍👩‍👧‍👦',
    description: '넓은 공간, 사교적인 성격의 결과',
    group: 'practical',
    tests: ['petMatch', 'dog'],
    getScore: (result) => {
      const c = result.condition;
      let score = 0;
      // 사교적
      if (c.touch === 'high') score += 2;
      if (c.humanLove === 'high') score += 3;
      if (c.dogFriend === 'high') score += 1;
      // 활동적 (함께 놀 수 있음)
      if (c.activity === 'high') score += 2;
      if (c.energy === 'high') score += 1;
      return score;
    },
    funFacts: [
      '가족 모두가 돌봄에 참여하면 유대감이 높아져요',
      '아이들에게 책임감을 가르칠 수 있어요'
    ]
  },
  {
    id: 'beginner_friendly',
    name: '초보자 추천',
    emoji: '🎓',
    description: '처음 키우기에 쉬운 결과',
    group: 'practical',
    tests: ['petMatch', 'plant'],
    getScore: (result) => {
      const c = result.condition;
      let score = 6;
      if (c.activity === 'high') score -= 1;
      if (c.time === 'high') score -= 1;
      if (c.care === 'high') score -= 2;
      if (c.space === 'high') score -= 1;
      if (c.water === 'high') score -= 1;
      if (c.light === 'high') score -= 1;
      return Math.max(0, score);
    },
    funFacts: [
      '첫 반려동물로 햄스터, 베타를 추천해요',
      '식물은 스투키, 포토스로 시작하세요'
    ]
  },
  {
    id: 'time_needed',
    name: '시간 여유 필요',
    emoji: '⏰',
    description: '돌봄에 시간이 많이 필요한 순',
    group: 'practical',
    tests: ['petMatch', 'dog', 'plant'],
    getScore: (result) => {
      const c = result.condition;
      let score = 0;
      if (c.time === 'high') score += 3;
      if (c.activity === 'high') score += 2;
      if (c.care === 'high') score += 2;
      if (c.touch === 'high') score += 1;
      return score;
    },
    funFacts: [
      '강아지는 하루 2시간 이상 케어가 필요해요',
      '퇴근 후 지쳐있다면 독립적인 친구가 좋아요'
    ]
  },
];

// ============================================================================
// 랭킹 카테고리 - 라이프스타일
// ============================================================================

const LIFESTYLE_RANKINGS: RankingCategory[] = [
  {
    id: 'air_purifier',
    name: '공기정화 최고',
    emoji: '🌬️',
    description: '공기정화 능력이 뛰어난 식물',
    group: 'lifestyle',
    tests: ['plant'],
    getScore: (result) => {
      // 특정 식물 이름으로 점수 부여
      const airPurifiers = ['아레카야자', '스투키', '산세베리아', '스킨답서스', '포토스', '몬스테라'];
      return airPurifiers.some(name => result.name.includes(name)) ? 5 : 0;
    },
    funFacts: [
      '아레카야자가 NASA 선정 공기정화 식물 1위!',
      '산세베리아는 밤에도 산소를 내뿜어요'
    ]
  },
  {
    id: 'low_light',
    name: '음지에서도 OK',
    emoji: '🌙',
    description: '햇빛이 적어도 잘 자라는 식물',
    group: 'lifestyle',
    tests: ['plant'],
    getScore: (result) => {
      const c = result.condition;
      let score = 0;
      if (c.light === 'low') score += 3;
      if (c.care === 'low') score += 1;
      return score;
    },
    funFacts: [
      '북향 집이라면 스투키, 산세베리아 추천!',
      '간접광만으로도 충분해요'
    ]
  },
  {
    id: 'neglect_ok',
    name: '방치해도 살아남는',
    emoji: '💀',
    description: '물을 안 줘도 잘 버티는 결과',
    group: 'lifestyle',
    tests: ['plant'],
    getScore: (result) => {
      const c = result.condition;
      let score = 0;
      if (c.water === 'low') score += 3;
      if (c.care === 'low') score += 2;
      if (c.light === 'low') score += 1;
      return score;
    },
    funFacts: [
      '스투키는 한 달에 한 번만 물 줘도 OK',
      '다육이는 오히려 물을 많이 주면 죽어요'
    ]
  },
  {
    id: 'pet_safe',
    name: '반려동물 안전',
    emoji: '🐱',
    description: '독성이 없어 반려동물과 함께해도 안전한 식물',
    group: 'lifestyle',
    tests: ['plant'],
    getScore: (result) => {
      // 안전한 식물들
      const petSafe = ['아레카야자', '보스턴고사리', '거베라', '허브'];
      const toxic = ['몬스테라', '스킨답서스', '포토스', '알로카시아'];
      if (toxic.some(name => result.name.includes(name))) return 0;
      if (petSafe.some(name => result.name.includes(name))) return 5;
      return 3; // 기본
    },
    funFacts: [
      '몬스테라, 포토스는 고양이에게 독성이 있어요!',
      '안전한 식물인지 꼭 확인하세요'
    ]
  },
];

// 전체 카테고리 합치기
const ALL_RANKINGS = [...PERSONALITY_RANKINGS, ...PRACTICAL_RANKINGS, ...LIFESTYLE_RANKINGS];

// ============================================================================
// 컴포넌트
// ============================================================================

type ViewMode = 'ranking' | 'stats';

export default function PopularRanking() {
  const [viewMode, setViewMode] = useState<ViewMode>('ranking');
  const [selectedSeason, setSelectedSeason] = useState<SeasonType>('quarterly');
  const [selectedGroup, setSelectedGroup] = useState<'all' | 'personality' | 'practical' | 'lifestyle'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('most_active');
  const [selectedTest, setSelectedTest] = useState<SubjectKey | 'all'>('all');

  // 그룹별 필터링된 카테고리
  const filteredCategories = useMemo(() => {
    if (selectedGroup === 'all') return ALL_RANKINGS;
    return ALL_RANKINGS.filter(c => c.group === selectedGroup);
  }, [selectedGroup]);

  // 선택된 카테고리
  const category = ALL_RANKINGS.find(c => c.id === selectedCategory) || ALL_RANKINGS[0];

  // 랭킹 계산
  const rankings = useMemo(() => {
    const allResults: { result: ResultLabel; testKey: SubjectKey; testTitle: string; score: number }[] = [];

    const testsToCheck = selectedTest === 'all'
      ? category.tests
      : [selectedTest];

    testsToCheck.forEach(testKey => {
      const data = CHEMI_DATA[testKey] as SubjectData | undefined;
      if (!data) return;

      data.resultLabels.forEach(result => {
        const score = category.getScore(result);
        if (score > 0) {
          allResults.push({
            result,
            testKey,
            testTitle: data.title,
            score
          });
        }
      });
    });

    return allResults
      .sort((a, b) => b.score - a.score)
      .slice(0, 15)
      .map((item, index) => ({ ...item, rank: index + 1 }));
  }, [category, selectedTest]);

  // 테스트 필터 옵션
  const testOptions = useMemo(() => {
    return category.tests
      .filter(testKey => CHEMI_DATA[testKey])
      .map(testKey => ({
        key: testKey,
        title: (CHEMI_DATA[testKey] as SubjectData).title
      }));
  }, [category]);

  // 현재 시즌
  const currentSeason = SEASONS.find(s => s.type === selectedSeason)!;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            인기 랭킹
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            테스트 결과들을 다양한 기준으로 비교해보세요
          </p>
        </div>
      </div>

      {/* 뷰 모드 전환 */}
      <div className="flex gap-2 p-1 bg-gray-800 rounded-xl">
        <button
          onClick={() => setViewMode('ranking')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            viewMode === 'ranking'
              ? 'bg-amber-500 text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
          랭킹 보기
        </button>
        <button
          onClick={() => setViewMode('stats')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            viewMode === 'stats'
              ? 'bg-blue-500 text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          투표 통계
        </button>
      </div>

      {/* 통계 뷰 */}
      {viewMode === 'stats' && <RankingStats />}

      {/* 랭킹 뷰 */}
      {viewMode === 'ranking' && (
        <>
      {/* 시즌 선택 */}
      <div className="flex gap-2 p-1 bg-gray-800 rounded-xl">
        {SEASONS.map((season) => (
          <button
            key={season.type}
            onClick={() => setSelectedSeason(season.type)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              selectedSeason === season.type
                ? 'bg-indigo-500 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <span>{season.emoji}</span>
            <span className="hidden sm:inline">{season.name}</span>
          </button>
        ))}
      </div>

      {/* 시즌 정보 */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-4 border border-indigo-500/30">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{currentSeason.emoji}</span>
          <div>
            <h3 className="font-bold text-indigo-400">{currentSeason.name}</h3>
            <p className="text-sm text-gray-400">{currentSeason.description}</p>
          </div>
          <div className="ml-auto text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            진행중
          </div>
        </div>
      </div>

      {/* 그룹 필터 */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: '전체', emoji: '🎯' },
          { key: 'personality', label: '성격/특성', emoji: '💫' },
          { key: 'practical', label: '실용 정보', emoji: '💡' },
          { key: 'lifestyle', label: '라이프스타일', emoji: '🌿' },
        ].map((group) => (
          <button
            key={group.key}
            onClick={() => {
              setSelectedGroup(group.key as typeof selectedGroup);
              // 그룹 변경 시 해당 그룹의 첫 카테고리 선택
              const firstInGroup = group.key === 'all'
                ? ALL_RANKINGS[0]
                : ALL_RANKINGS.find(c => c.group === group.key);
              if (firstInGroup) setSelectedCategory(firstInGroup.id);
            }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
              selectedGroup === group.key
                ? 'bg-purple-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <span>{group.emoji}</span>
            <span>{group.label}</span>
          </button>
        ))}
      </div>

      {/* 카테고리 선택 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {filteredCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setSelectedTest('all');
            }}
            className={`p-3 rounded-xl border-2 transition-all text-left ${
              selectedCategory === cat.id
                ? 'border-amber-500 bg-amber-500/10'
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
            }`}
          >
            <span className="text-xl block mb-1">{cat.emoji}</span>
            <p className={`font-bold text-xs ${
              selectedCategory === cat.id ? 'text-amber-400' : 'text-gray-300'
            }`}>
              {cat.name}
            </p>
          </button>
        ))}
      </div>

      {/* 선택된 카테고리 설명 */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-500/30">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{category.emoji}</span>
          <div>
            <h3 className="font-bold text-amber-400">{category.name} 랭킹</h3>
            <p className="text-sm text-gray-400">{category.description}</p>
          </div>
        </div>
      </div>

      {/* 테스트 필터 */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-400 flex items-center gap-1">
          <Filter className="w-4 h-4" /> 테스트:
        </span>
        <button
          onClick={() => setSelectedTest('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            selectedTest === 'all'
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          전체
        </button>
        {testOptions.map(({ key, title }) => (
          <button
            key={key}
            onClick={() => setSelectedTest(key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedTest === key
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {title}
          </button>
        ))}
      </div>

      {/* 랭킹 리스트 */}
      <div className="space-y-2">
        {rankings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            해당 조건에 맞는 결과가 없습니다
          </div>
        ) : (
          rankings.map(({ result, testKey, testTitle, rank, score }) => (
            <div
              key={`${testKey}-${result.name}`}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                rank === 1
                  ? 'bg-amber-500/10 border-amber-500/50'
                  : rank === 2
                  ? 'bg-gray-500/10 border-gray-500/50'
                  : rank === 3
                  ? 'bg-orange-500/10 border-orange-500/50'
                  : 'bg-gray-800/50 border-gray-700'
              }`}
            >
              {/* 순위 */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                rank === 1
                  ? 'bg-amber-500 text-white'
                  : rank === 2
                  ? 'bg-gray-500 text-white'
                  : rank === 3
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-700 text-gray-400'
              }`}>
                {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : rank}
              </div>

              {/* 이모지 */}
              <span className="text-3xl shrink-0">{result.emoji}</span>

              {/* 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-100">{result.name}</p>
                  <span className="px-2 py-0.5 bg-gray-700 rounded-full text-xs text-gray-400">
                    {testTitle}
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-1">{result.desc}</p>
              </div>

              {/* 점수 바 */}
              <div className="w-24 shrink-0">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>점수</span>
                  <span>{score}pt</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      rank === 1
                        ? 'bg-amber-500'
                        : rank === 2
                        ? 'bg-gray-400'
                        : rank === 3
                        ? 'bg-orange-500'
                        : 'bg-indigo-500'
                    }`}
                    style={{ width: `${Math.min(100, (score / 10) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 재미있는 사실 */}
      {category.funFacts && category.funFacts.length > 0 && (
        <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
          <h4 className="font-bold text-gray-300 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            알아두면 좋은 정보
          </h4>
          <ul className="space-y-1 text-sm text-gray-400">
            {category.funFacts.map((fact, idx) => (
              <li key={idx}>• {fact}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 통계 요약 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-700">
        <div className="bg-gray-800/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-indigo-400">{rankings.length}</p>
          <p className="text-xs text-gray-500">분석된 결과</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">
            {rankings[0]?.result.emoji || '-'}
          </p>
          <p className="text-xs text-gray-500">1위</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gray-400">
            {testOptions.length}
          </p>
          <p className="text-xs text-gray-500">포함된 테스트</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-400">
            {rankings[0]?.score || 0}pt
          </p>
          <p className="text-xs text-gray-500">최고 점수</p>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
