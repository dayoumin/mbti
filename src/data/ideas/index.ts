// ============================================================================
// 아이디어 뱅크 - 통합 로더
// ============================================================================
// JSON 파일에서 테마별 아이디어를 로드하고 통합 관리

import type { Theme, ThemeJson, ContentIdea, ThemeMeta, IdeaStatus, ViralPotential, Priority } from './_types';

// JSON 파일들 import
import japaneseAnimeData from './japanese-anime.json';
import musicData from './music.json';
import foodData from './food.json';
import gamesData from './games.json';
import dramaMovieData from './drama-movie.json';
import sportsData from './sports.json';
import travelData from './travel.json';
import carsData from './cars.json';
import beautyFashionData from './beauty-fashion.json';
import petsData from './pets.json';
import brandsData from './brands.json';
import webtoonData from './webtoon.json';
import youtubersData from './youtubers.json';
import jobsCareerData from './jobs-career.json';
import psychologyTestsData from './psychology-tests.json';

// ============================================================================
// JSON → Theme 변환
// ============================================================================

function toTheme(json: ThemeJson): Theme {
  return {
    ...json.meta,
    ideas: json.ideas as ContentIdea[],
  };
}

// ============================================================================
// 모든 테마 통합
// ============================================================================

export const THEMES: Theme[] = [
  toTheme(japaneseAnimeData as ThemeJson),
  toTheme(musicData as ThemeJson),
  toTheme(foodData as ThemeJson),
  toTheme(gamesData as ThemeJson),
  toTheme(dramaMovieData as ThemeJson),
  toTheme(sportsData as ThemeJson),
  toTheme(travelData as ThemeJson),
  toTheme(carsData as ThemeJson),
  toTheme(beautyFashionData as ThemeJson),
  toTheme(petsData as ThemeJson),
  toTheme(brandsData as ThemeJson),
  toTheme(webtoonData as ThemeJson),
  toTheme(youtubersData as ThemeJson),
  toTheme(jobsCareerData as ThemeJson),
  toTheme(psychologyTestsData as ThemeJson),
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * 테마별 아이디어 개수 집계
 */
export function getIdeaStats() {
  return THEMES.map(theme => ({
    themeId: theme.id,
    themeName: theme.name,
    totalIdeas: theme.ideas.length,
    byStatus: {
      idea: theme.ideas.filter(i => i.status === 'idea').length,
      planning: theme.ideas.filter(i => i.status === 'planning').length,
      ready: theme.ideas.filter(i => i.status === 'ready').length,
      inProgress: theme.ideas.filter(i => i.status === 'in-progress').length,
      completed: theme.ideas.filter(i => i.status === 'completed').length,
      paused: theme.ideas.filter(i => i.status === 'paused').length,
    },
    byCategory: {
      worldcup: theme.ideas.filter(i => i.category === 'worldcup').length,
      tierVote: theme.ideas.filter(i => i.category === 'tier-vote').length,
      balanceGame: theme.ideas.filter(i => i.category === 'balance-game').length,
      mbtiTest: theme.ideas.filter(i => i.category === 'mbti-test').length,
      quiz: theme.ideas.filter(i => i.category === 'quiz').length,
      checklist: theme.ideas.filter(i => i.category === 'checklist').length,
      recommend: theme.ideas.filter(i => i.category === 'recommend').length,
      other: theme.ideas.filter(i => i.category === 'other').length,
    },
    byViral: {
      veryHigh: theme.ideas.filter(i => i.viral.potential === 'very-high').length,
      high: theme.ideas.filter(i => i.viral.potential === 'high').length,
      medium: theme.ideas.filter(i => i.viral.potential === 'medium').length,
      low: theme.ideas.filter(i => i.viral.potential === 'low').length,
    },
  }));
}

/**
 * 전체 아이디어 통계
 */
export function getTotalStats() {
  const allIdeas = THEMES.flatMap(t => t.ideas);
  return {
    totalThemes: THEMES.length,
    totalIdeas: allIdeas.length,
    highPriorityIdeas: allIdeas.filter(i => i.strategy?.priority === 'high').length,
    veryHighViralIdeas: allIdeas.filter(i => i.viral.potential === 'very-high').length,
    readyToImplement: allIdeas.filter(i => i.status === 'ready').length,
    inProgress: allIdeas.filter(i => i.status === 'in-progress').length,
    completed: allIdeas.filter(i => i.status === 'completed').length,
  };
}

/**
 * 우선순위가 높은 아이디어 추출
 */
export function getHighPriorityIdeas() {
  return THEMES.flatMap(theme =>
    theme.ideas
      .filter(idea => idea.strategy?.priority === 'high')
      .map(idea => ({ ...idea, themeName: theme.name, themeIcon: theme.icon }))
  ).sort((a, b) => {
    const statusOrder: Record<IdeaStatus, number> = { ready: 0, review: 1, planning: 2, 'in-progress': 3, idea: 4, paused: 5, completed: 6 };
    return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
  });
}

/**
 * Quick Wins 아이디어 (고효과 + 저난이도)
 */
export function getQuickWins() {
  return THEMES.flatMap(theme =>
    theme.ideas
      .filter(idea =>
        (idea.viral.potential === 'very-high' || idea.viral.potential === 'high') &&
        idea.implementation.difficulty === 1
      )
      .map(idea => ({ ...idea, themeName: theme.name, themeIcon: theme.icon }))
  );
}

/**
 * 테마 ID로 테마 찾기
 */
export function getThemeById(id: string): Theme | undefined {
  return THEMES.find(t => t.id === id);
}

/**
 * 아이디어 ID로 아이디어 찾기
 */
export function getIdeaById(ideaId: string): (ContentIdea & { themeName: string; themeIcon: string }) | undefined {
  for (const theme of THEMES) {
    const idea = theme.ideas.find(i => i.id === ideaId);
    if (idea) {
      return { ...idea, themeName: theme.name, themeIcon: theme.icon };
    }
  }
  return undefined;
}

/**
 * 상태별 아이디어 필터링
 */
export function getIdeasByStatus(status: IdeaStatus) {
  return THEMES.flatMap(theme =>
    theme.ideas
      .filter(idea => idea.status === status)
      .map(idea => ({ ...idea, themeName: theme.name, themeIcon: theme.icon }))
  );
}

/**
 * 바이럴 잠재력별 아이디어 필터링
 */
export function getIdeasByViralPotential(potential: ViralPotential) {
  return THEMES.flatMap(theme =>
    theme.ideas
      .filter(idea => idea.viral.potential === potential)
      .map(idea => ({ ...idea, themeName: theme.name, themeIcon: theme.icon }))
  );
}

// Re-export types
export type { Theme, ThemeJson, ContentIdea, ThemeMeta, IdeaStatus, ViralPotential, Priority };
export * from './_types';
