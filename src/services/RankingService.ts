/**
 * RankingService - 랭킹 투표 및 통계 서비스
 *
 * 현재: localStorage + Turso API 사용
 * StorageProvider 패턴으로 확장 가능
 */

import { SubjectKey } from '@/data/types';
import { getDeviceId } from '@/utils/device';
import { STORAGE_KEYS } from '@/lib/storage';
import { storage } from '@/utils';
import { trackRankingVote } from '@/lib/analytics';

// ========== 타입 정의 ==========

export type SeasonType = 'yearly' | 'quarterly' | 'event';

export interface RankingVote {
  id: string;
  userId: string;
  categoryId: string;        // 랭킹 카테고리 (most_active, kid_friendly 등)
  resultKey: string;         // 결과 이름
  resultEmoji: string;       // 결과 이모지
  testType: SubjectKey;      // 테스트 타입
  seasonId: string;          // 시즌 ID (2025-yearly, 2025-Q1 등)
  seasonType: SeasonType;    // 시즌 타입
  createdAt: string;
}

export interface RankingStats {
  categoryId: string;
  seasonId: string;
  votes: Record<string, number>;  // resultKey: 투표수
  totalVotes: number;
  lastUpdated: string;
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  topResults: Array<{
    resultKey: string;
    resultEmoji: string;
    testType: SubjectKey;
    votes: number;
    rank: number;
  }>;
  totalVotes: number;
}

export interface SeasonSummary {
  seasonId: string;
  seasonType: SeasonType;
  seasonName: string;
  totalVotes: number;
  participantCount: number;
  topCategories: Array<{
    categoryId: string;
    categoryName: string;
    totalVotes: number;
  }>;
  startDate?: string;  // event 시즌은 undefined
  endDate?: string;
}

interface SaveResult {
  success: boolean;
  id?: string;
  error?: string;
}

// ========== 시즌 유틸리티 ==========

function getCurrentSeasonId(type: SeasonType): string {
  const now = new Date();
  const year = now.getFullYear();

  switch (type) {
    case 'yearly':
      return `${year}-yearly`;
    case 'quarterly': {
      const quarter = Math.ceil((now.getMonth() + 1) / 3);
      return `${year}-Q${quarter}`;
    }
    case 'event':
      return `${year}-event-current`;
    default:
      return `${year}-yearly`;
  }
}

// 중앙화된 설정에서 시즌명 조회
import { getSeasonDisplayName } from '@/config';

function getSeasonName(seasonId: string): string {
  return getSeasonDisplayName(seasonId);
}

// 카테고리 ID → 한글 이름 매핑
const CATEGORY_NAMES: Record<string, string> = {
  // 성격/특성
  most_active: '가장 활발한',
  most_calm: '가장 차분한',
  most_social: '가장 사교적인',
  most_independent: '가장 독립적인',
  // 실용 정보
  most_expensive: '가장 비용이 드는',
  most_affordable: '가장 저렴한',
  kid_friendly: '아이에게 적합한',
  senior_friendly: '어르신에게 적합한',
  single_friendly: '자취생 추천',
  family_friendly: '가족용 추천',
  beginner_friendly: '초보자 추천',
  time_needed: '시간 여유 필요',
  // 라이프스타일
  air_purifier: '공기정화 최고',
  low_light: '음지에서도 OK',
  neglect_ok: '방치해도 살아남는',
  pet_safe: '반려동물 안전',
};

function getCategoryName(categoryId: string): string {
  return CATEGORY_NAMES[categoryId] || categoryId;
}

// ========== Storage Provider ==========

interface StorageProvider {
  name: string;
  saveVote(vote: RankingVote): Promise<SaveResult>;
  getVotes(seasonId: string, categoryId?: string): Promise<RankingVote[]>;
  getAllVotes(): Promise<RankingVote[]>;  // 전체 투표 조회 (모든 시즌)
  getVotesByUser(userId: string): Promise<RankingVote[]>;
  getStats(seasonId: string, categoryId: string): Promise<RankingStats | null>;
  getAllStats(seasonId: string): Promise<RankingStats[]>;
  getAvailableSeasons(): Promise<string[]>;  // 데이터가 있는 시즌 목록
}

const VOTES_KEY = STORAGE_KEYS.RANKING_VOTES;
const STATS_KEY = STORAGE_KEYS.RANKING_STATS;

// ========== Turso Provider (API 기반) ==========

const tursoProvider: StorageProvider = {
  name: 'turso',

  async saveVote(vote: RankingVote): Promise<SaveResult> {
    try {
      const res = await fetch('/api/ranking-votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: vote.userId,
          categoryId: vote.categoryId,
          resultKey: vote.resultKey,
          resultEmoji: vote.resultEmoji,
          testType: vote.testType,
          seasonId: vote.seasonId,
          seasonType: vote.seasonType,
        }),
      });

      if (!res.ok) throw new Error('Failed to save vote');
      const data = await res.json();
      return { success: true, id: data.id };
    } catch (error) {
      console.error('[RankingService] Turso 저장 실패:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  async getVotes(seasonId: string, categoryId?: string): Promise<RankingVote[]> {
    try {
      let url = `/api/ranking-votes?seasonId=${encodeURIComponent(seasonId)}`;
      if (categoryId) {
        url += `&categoryId=${encodeURIComponent(categoryId)}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch votes');
      const data = await res.json();
      return data.votes || [];
    } catch (error) {
      console.error('[RankingService] 투표 조회 실패:', error);
      return [];
    }
  },

  async getAllVotes(): Promise<RankingVote[]> {
    try {
      const res = await fetch('/api/ranking-votes?type=all&limit=10000');
      if (!res.ok) throw new Error('Failed to fetch all votes');
      const data = await res.json();
      return data.votes || [];
    } catch (error) {
      console.error('[RankingService] 전체 투표 조회 실패:', error);
      return [];
    }
  },

  async getVotesByUser(userId: string): Promise<RankingVote[]> {
    try {
      const res = await fetch(`/api/ranking-votes?deviceId=${encodeURIComponent(userId)}`);
      if (!res.ok) throw new Error('Failed to fetch user votes');
      const data = await res.json();
      return data.votes || [];
    } catch (error) {
      console.error('[RankingService] 사용자 투표 조회 실패:', error);
      return [];
    }
  },

  async getStats(seasonId: string, categoryId: string): Promise<RankingStats | null> {
    try {
      const res = await fetch(`/api/ranking-votes?type=stats&seasonId=${encodeURIComponent(seasonId)}`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();

      const categoryStats = data.stats?.[categoryId];
      if (!categoryStats) return null;

      return {
        categoryId,
        seasonId,
        votes: categoryStats.votes,
        totalVotes: categoryStats.totalVotes,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('[RankingService] 통계 조회 실패:', error);
      return null;
    }
  },

  async getAllStats(seasonId: string): Promise<RankingStats[]> {
    try {
      const res = await fetch(`/api/ranking-votes?type=stats&seasonId=${encodeURIComponent(seasonId)}`);
      if (!res.ok) throw new Error('Failed to fetch all stats');
      const data = await res.json();

      return Object.entries(data.stats || {}).map(([catId, catStats]) => ({
        categoryId: catId,
        seasonId,
        votes: (catStats as { votes: Record<string, number> }).votes,
        totalVotes: (catStats as { totalVotes: number }).totalVotes,
        lastUpdated: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('[RankingService] 전체 통계 조회 실패:', error);
      return [];
    }
  },

  async getAvailableSeasons(): Promise<string[]> {
    try {
      const res = await fetch('/api/ranking-votes?type=seasons');
      if (!res.ok) throw new Error('Failed to fetch seasons');
      const data = await res.json();
      return data.seasons || [];
    } catch (error) {
      console.error('[RankingService] 시즌 목록 조회 실패:', error);
      return [];
    }
  },
};

// ========== localStorage Provider (오프라인/폴백) ==========

const localStorageProvider: StorageProvider = {
  name: 'localStorage',

  async saveVote(vote: RankingVote): Promise<SaveResult> {
    try {
      // 투표 저장
      const votes = storage.get<RankingVote[]>(VOTES_KEY, []);
      votes.push(vote);
      storage.set(VOTES_KEY, votes);

      // 통계 업데이트
      const statsKey = `${vote.seasonId}:${vote.categoryId}`;
      const allStats = storage.get<Record<string, RankingStats>>(STATS_KEY, {});

      if (!allStats[statsKey]) {
        allStats[statsKey] = {
          categoryId: vote.categoryId,
          seasonId: vote.seasonId,
          votes: {},
          totalVotes: 0,
          lastUpdated: new Date().toISOString(),
        };
      }

      const stats = allStats[statsKey];
      stats.votes[vote.resultKey] = (stats.votes[vote.resultKey] || 0) + 1;
      stats.totalVotes += 1;
      stats.lastUpdated = new Date().toISOString();

      storage.set(STATS_KEY, allStats);

      return { success: true, id: vote.id };
    } catch (error) {
      console.error('[RankingService] localStorage 저장 실패:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  async getVotes(seasonId: string, categoryId?: string): Promise<RankingVote[]> {
    const votes = storage.get<RankingVote[]>(VOTES_KEY, []);
    return votes.filter(v => {
      if (v.seasonId !== seasonId) return false;
      if (categoryId && v.categoryId !== categoryId) return false;
      return true;
    });
  },

  async getAllVotes(): Promise<RankingVote[]> {
    return storage.get<RankingVote[]>(VOTES_KEY, []);
  },

  async getVotesByUser(userId: string): Promise<RankingVote[]> {
    const votes = storage.get<RankingVote[]>(VOTES_KEY, []);
    return votes.filter(v => v.userId === userId);
  },

  async getStats(seasonId: string, categoryId: string): Promise<RankingStats | null> {
    const allStats = storage.get<Record<string, RankingStats>>(STATS_KEY, {});
    const statsKey = `${seasonId}:${categoryId}`;
    return allStats[statsKey] || null;
  },

  async getAllStats(seasonId: string): Promise<RankingStats[]> {
    const allStats = storage.get<Record<string, RankingStats>>(STATS_KEY, {});
    return Object.values(allStats).filter(s => s.seasonId === seasonId);
  },

  async getAvailableSeasons(): Promise<string[]> {
    const votes = storage.get<RankingVote[]>(VOTES_KEY, []);
    const seasons = new Set(votes.map(v => v.seasonId));
    // 시즌 정렬: 연도 내림차순 → 분기 내림차순 (2025-Q4 > 2025-Q1 > 2024-yearly)
    return Array.from(seasons).sort((a, b) => {
      const [yearA, typeA] = a.split('-');
      const [yearB, typeB] = b.split('-');
      // 연도 비교 (내림차순)
      if (yearA !== yearB) return parseInt(yearB, 10) - parseInt(yearA, 10);
      // 같은 연도 내 정렬 (내림차순: Q4 > Q3 > Q2 > Q1 > yearly > event)
      // priority가 높을수록 먼저 오도록 내림차순 정렬
      const priority = (t: string) => {
        if (t.startsWith('Q')) return 10 + parseInt(t.replace('Q', ''), 10); // Q4=14, Q1=11
        if (t === 'yearly') return 5;
        return 0; // event
      };
      return priority(typeB) - priority(typeA); // 내림차순
    });
  },
};

// ========== RankingService Class ==========

class RankingServiceClass {
  private provider: StorageProvider;

  constructor() {
    // 기본: Turso 사용 (서버 저장, 기기 간 공유)
    this.provider = tursoProvider;
  }

  // Provider 수동 변경 (테스트/오프라인용)
  setProvider(provider: StorageProvider): void {
    this.provider = provider;
  }

  // localStorage 폴백 모드로 전환
  useLocalStorage(): void {
    if (typeof window !== 'undefined') {
      this.provider = localStorageProvider;
    }
  }

  // Turso 모드로 전환
  useTurso(): void {
    this.provider = tursoProvider;
  }

  getProviderName(): string {
    return this.provider.name;
  }

  // getUserId는 공통 유틸리티 사용
  private getUserId(): string {
    return getDeviceId();
  }

  // ========== 투표 ==========

  async vote(
    categoryId: string,
    resultKey: string,
    resultEmoji: string,
    testType: SubjectKey,
    seasonType: SeasonType = 'quarterly'
  ): Promise<SaveResult> {
    const seasonId = getCurrentSeasonId(seasonType);

    const vote: RankingVote = {
      id: Date.now() + '_' + Math.random().toString(36).substring(2, 11),
      userId: this.getUserId(),
      categoryId,
      resultKey,
      resultEmoji,
      testType,
      seasonId,
      seasonType,
      createdAt: new Date().toISOString(),
    };

    const result = await this.provider.saveVote(vote);

    if (result.success) {
      // GA4 추적: 랭킹 투표
      trackRankingVote(testType, resultKey);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('chemi:rankingVoted', { detail: vote }));
      }
    }

    return result;
  }

  // ========== 조회 ==========

  async getMyVotes(): Promise<RankingVote[]> {
    return await this.provider.getVotesByUser(this.getUserId());
  }

  async hasVoted(categoryId: string, seasonType: SeasonType = 'quarterly'): Promise<boolean> {
    const seasonId = getCurrentSeasonId(seasonType);
    const myVotes = await this.getMyVotes();
    return myVotes.some(v => v.categoryId === categoryId && v.seasonId === seasonId);
  }

  async getCategoryStats(
    categoryId: string,
    seasonType: SeasonType = 'quarterly'
  ): Promise<RankingStats | null> {
    const seasonId = getCurrentSeasonId(seasonType);
    return await this.provider.getStats(seasonId, categoryId);
  }

  async getCategoryRanking(
    categoryId: string,
    seasonType: SeasonType = 'quarterly',
    limit = 10
  ): Promise<Array<{ resultKey: string; votes: number; rank: number }>> {
    const stats = await this.getCategoryStats(categoryId, seasonType);
    if (!stats) return [];

    return Object.entries(stats.votes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([resultKey, votes], index) => ({
        resultKey,
        votes,
        rank: index + 1,
      }));
  }

  // ========== 통계 ==========

  async getSeasonSummary(seasonType: SeasonType = 'quarterly'): Promise<SeasonSummary> {
    const seasonId = getCurrentSeasonId(seasonType);
    const allStats = await this.provider.getAllStats(seasonId);

    // 전체 투표 수 계산
    const totalVotes = allStats.reduce((sum, s) => sum + s.totalVotes, 0);

    // 참여자 수 계산 (유니크 유저)
    const votes = await this.provider.getVotes(seasonId);
    const uniqueUsers = new Set(votes.map(v => v.userId));

    // 카테고리별 투표 수 정렬
    const topCategories = allStats
      .map(s => ({
        categoryId: s.categoryId,
        categoryName: getCategoryName(s.categoryId),
        totalVotes: s.totalVotes,
      }))
      .sort((a, b) => b.totalVotes - a.totalVotes)
      .slice(0, 5);

    return {
      seasonId,
      seasonType,
      seasonName: getSeasonName(seasonId),
      totalVotes,
      participantCount: uniqueUsers.size,
      topCategories,
      startDate: this.getSeasonStartDate(seasonType),
      endDate: this.getSeasonEndDate(seasonType),
    };
  }

  async getAllCategorySummaries(seasonType: SeasonType = 'quarterly'): Promise<CategorySummary[]> {
    const seasonId = getCurrentSeasonId(seasonType);
    const allStats = await this.provider.getAllStats(seasonId);

    // 투표가 없으면 빈 배열 반환 (불필요한 API 호출 방지)
    if (allStats.length === 0) return [];

    const votes = await this.provider.getVotes(seasonId);

    // 카테고리별로 투표 그룹화 (한 번만 순회)
    const votesByCategory = votes.reduce((acc, v) => {
      if (!acc[v.categoryId]) acc[v.categoryId] = [];
      acc[v.categoryId].push(v);
      return acc;
    }, {} as Record<string, RankingVote[]>);

    return allStats.map(stats => {
      const categoryVotes = votesByCategory[stats.categoryId] || [];

      // 결과별 집계
      const resultVotes = categoryVotes.reduce((acc, v) => {
        if (!acc[v.resultKey]) {
          acc[v.resultKey] = {
            resultKey: v.resultKey,
            resultEmoji: v.resultEmoji,
            testType: v.testType,
            votes: 0,
          };
        }
        acc[v.resultKey].votes += 1;
        return acc;
      }, {} as Record<string, { resultKey: string; resultEmoji: string; testType: SubjectKey; votes: number }>);

      const topResults = Object.values(resultVotes)
        .sort((a, b) => b.votes - a.votes)
        .slice(0, 5)
        .map((r, idx) => ({ ...r, rank: idx + 1 }));

      return {
        categoryId: stats.categoryId,
        categoryName: getCategoryName(stats.categoryId),
        topResults,
        totalVotes: stats.totalVotes,
      };
    });
  }

  // ========== 과거 시즌 조회 ==========

  /**
   * 특정 시즌의 요약 정보 조회 (seasonId 직접 지정)
   */
  async getSeasonSummaryById(seasonId: string): Promise<SeasonSummary> {
    const allStats = await this.provider.getAllStats(seasonId);

    // 전체 투표 수 계산
    const totalVotes = allStats.reduce((sum, s) => sum + s.totalVotes, 0);

    // 참여자 수 계산 (유니크 유저)
    const votes = await this.provider.getVotes(seasonId);
    const uniqueUsers = new Set(votes.map(v => v.userId));

    // 카테고리별 투표 수 정렬
    const topCategories = allStats
      .map(s => ({
        categoryId: s.categoryId,
        categoryName: getCategoryName(s.categoryId),
        totalVotes: s.totalVotes,
      }))
      .sort((a, b) => b.totalVotes - a.totalVotes)
      .slice(0, 5);

    // seasonId에서 시즌 타입 추출
    const seasonType = this.parseSeasonType(seasonId);

    return {
      seasonId,
      seasonType,
      seasonName: getSeasonName(seasonId),
      totalVotes,
      participantCount: uniqueUsers.size,
      topCategories,
      startDate: this.getSeasonStartDateFromId(seasonId),
      endDate: this.getSeasonEndDateFromId(seasonId),
    };
  }

  /**
   * 사용 가능한 시즌 목록 조회 (데이터가 있는 시즌만)
   */
  async getAvailableSeasons(): Promise<Array<{ seasonId: string; seasonName: string; seasonType: SeasonType }>> {
    const seasonIds = await this.provider.getAvailableSeasons();
    return seasonIds.map(seasonId => ({
      seasonId,
      seasonName: getSeasonName(seasonId),
      seasonType: this.parseSeasonType(seasonId),
    }));
  }

  /**
   * 연간 변동 데이터 조회 (마케팅용)
   * 지정된 연도의 분기별 투표 수 추이 반환
   */
  async getYearlyTrend(year: number): Promise<Array<{
    seasonId: string;
    seasonName: string;
    totalVotes: number;
    participantCount: number;
  }>> {
    const quarters = [`${year}-Q1`, `${year}-Q2`, `${year}-Q3`, `${year}-Q4`];

    // 병렬 처리로 성능 개선 (원격 provider 사용 시 중요)
    const results = await Promise.all(
      quarters.map(async (seasonId) => {
        const votes = await this.provider.getVotes(seasonId);
        const uniqueUsers = new Set(votes.map(v => v.userId));
        return {
          seasonId,
          seasonName: getSeasonName(seasonId),
          totalVotes: votes.length,
          participantCount: uniqueUsers.size,
        };
      })
    );

    return results;
  }

  // ========== 대시보드용 요약 ==========

  async getDashboardStats(): Promise<{
    currentSeason: SeasonSummary;
    totalAllTimeVotes: number;
    currentSeasonVotes: number;
    mostPopularCategory: string | null;
    mostVotedResult: { name: string; emoji: string; votes: number } | null;
    recentActivity: Array<{ date: string; votes: number }>;
  }> {
    const currentSeason = await this.getSeasonSummary('quarterly');

    // 전체 투표 수 계산 (모든 시즌)
    const allVotes = await this.provider.getAllVotes();
    const totalAllTimeVotes = allVotes.length;

    // 현재 시즌 투표 수
    const currentSeasonVotes = await this.provider.getVotes(getCurrentSeasonId('quarterly'));
    const currentSeasonVotesCount = currentSeasonVotes.length;

    // 가장 인기 있는 카테고리
    const categorySummaries = await this.getAllCategorySummaries('quarterly');
    const mostPopularCategory = categorySummaries.length > 0
      ? categorySummaries.sort((a, b) => b.totalVotes - a.totalVotes)[0].categoryId
      : null;

    // 가장 많이 투표받은 결과
    let mostVotedResult: { name: string; emoji: string; votes: number } | null = null;
    for (const summary of categorySummaries) {
      if (summary.topResults.length > 0) {
        const top = summary.topResults[0];
        if (!mostVotedResult || top.votes > mostVotedResult.votes) {
          mostVotedResult = {
            name: top.resultKey,
            emoji: top.resultEmoji,
            votes: top.votes,
          };
        }
      }
    }

    // 최근 7일 활동
    const recentActivity = this.calculateRecentActivity(currentSeasonVotes, 7);

    return {
      currentSeason,
      totalAllTimeVotes,
      currentSeasonVotes: currentSeasonVotesCount,
      mostPopularCategory,
      mostVotedResult,
      recentActivity,
    };
  }

  // ========== seasonId 파싱 유틸리티 ==========

  private parseSeasonType(seasonId: string): SeasonType {
    if (seasonId.includes('yearly')) return 'yearly';
    if (seasonId.includes('Q')) return 'quarterly';
    if (seasonId.includes('event')) return 'event';
    return 'yearly';
  }

  private getSeasonStartDateFromId(seasonId: string): string | undefined {
    // 예: "2024-Q1" → "2024-01-01", "2024-yearly" → "2024-01-01"
    const parts = seasonId.split('-');
    const year = parseInt(parts[0], 10);

    if (seasonId.includes('yearly')) {
      return `${year}-01-01`;
    }
    if (seasonId.includes('Q')) {
      const quarter = parseInt(parts[1].replace('Q', ''), 10);
      const startMonth = (quarter - 1) * 3 + 1;
      return `${year}-${String(startMonth).padStart(2, '0')}-01`;
    }
    // event의 경우 seasonId에서 날짜를 알 수 없음
    return undefined;
  }

  private getSeasonEndDateFromId(seasonId: string): string | undefined {
    const parts = seasonId.split('-');
    const year = parseInt(parts[0], 10);

    if (seasonId.includes('yearly')) {
      return `${year}-12-31`;
    }
    if (seasonId.includes('Q')) {
      const quarter = parseInt(parts[1].replace('Q', ''), 10);
      const endMonth = quarter * 3;
      const lastDay = new Date(year, endMonth, 0).getDate();
      return `${year}-${String(endMonth).padStart(2, '0')}-${lastDay}`;
    }
    return undefined;
  }

  private calculateRecentActivity(
    votes: RankingVote[],
    days: number
  ): Array<{ date: string; votes: number }> {
    const now = new Date();
    const activity: Record<string, number> = {};

    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      activity[dateStr] = 0;
    }

    votes.forEach(v => {
      const dateStr = v.createdAt.split('T')[0];
      if (activity[dateStr] !== undefined) {
        activity[dateStr] += 1;
      }
    });

    return Object.entries(activity)
      .map(([date, count]) => ({ date, votes: count }))
      .reverse();
  }

  private getSeasonStartDate(seasonType: SeasonType): string {
    const now = new Date();
    const year = now.getFullYear();

    switch (seasonType) {
      case 'yearly':
        return `${year}-01-01`;
      case 'quarterly': {
        const quarter = Math.ceil((now.getMonth() + 1) / 3);
        const startMonth = (quarter - 1) * 3 + 1;
        return `${year}-${String(startMonth).padStart(2, '0')}-01`;
      }
      case 'event':
        return now.toISOString().split('T')[0];
      default:
        return now.toISOString().split('T')[0];
    }
  }

  private getSeasonEndDate(seasonType: SeasonType): string | undefined {
    const now = new Date();
    const year = now.getFullYear();

    switch (seasonType) {
      case 'yearly':
        return `${year}-12-31`;
      case 'quarterly': {
        const quarter = Math.ceil((now.getMonth() + 1) / 3);
        const endMonth = quarter * 3;
        const lastDay = new Date(year, endMonth, 0).getDate();
        return `${year}-${String(endMonth).padStart(2, '0')}-${lastDay}`;
      }
      case 'event':
        return undefined; // 이벤트는 종료일이 없을 수 있음
      default:
        return undefined;
    }
  }
}

// 싱글톤 인스턴스
export const rankingService = new RankingServiceClass();

export default rankingService;
