/**
 * FeedbackService - 피드백/투표/퀴즈 응답 저장 서비스
 *
 * 테이블:
 * - mbti_feedback: 테스트 결과 피드백 (정확도 + 의견)
 * - mbti_poll_responses: 투표 응답
 * - mbti_quiz_responses: 퀴즈 문제별 응답
 *
 * 패턴: ResultService와 동일 (익명 → 회원 전환 지원)
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getDeviceId } from '@/utils/device';

// ========== 타입 정의 ==========

export interface FeedbackData {
  testType: string;
  resultName: string;
  isAccurate: boolean;  // 👍👎
  comment?: string;
}

export interface FeedbackComment {
  id: string;
  resultName: string;
  isAccurate: boolean;
  comment: string;
  createdAt: string;
}

export interface PollResponseData {
  pollId: string;
  optionId: string;
}

export interface QuizResponseData {
  quizId: string;
  questionIndex: number;
  selectedOption: string;
  isCorrect: boolean;
  points?: number;
}

export interface PollStats {
  pollId: string;
  totalVotes: number;
  options: { optionId: string; count: number; percentage: number }[];
}

export interface QuizStats {
  quizId: string;
  totalAttempts: number;
  correctRate: number;
  byQuestion: { questionIndex: number; correctRate: number }[];
}

// ========== 참여 분석 타입 ==========

export interface PollParticipationAnalysis {
  totalPolls: number;
  minorityVotes: number;        // 소수 의견 선택 횟수
  minorityRatio: number;        // 소수 의견 비율 (0-100)
  categoryBreakdown: Record<string, number>;  // 카테고리별 참여 수
  recentPollIds: string[];      // 최근 참여 투표 ID
}

export interface QuizPerformanceAnalysis {
  totalAnswered: number;
  correctCount: number;
  correctRate: number;          // 정답률 (0-100)
  categoryBreakdown: Record<string, { answered: number; correct: number }>;
  bestCategory: string | null;  // 가장 잘하는 카테고리
}

interface SaveResult {
  success: boolean;
  id?: string;
  error?: string;
}

// ========== Supabase 클라이언트 ==========

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('[FeedbackService] 환경변수 체크:', {
    hasUrl: !!url,
    hasKey: !!key,
    urlPrefix: url ? url.substring(0, 30) : 'empty'
  });

  if (!url || !key) {
    console.log('[FeedbackService] Supabase 환경변수 없음 - localStorage 모드');
    return null;
  }

  console.log('[FeedbackService] Supabase 클라이언트 생성');
  supabaseClient = createClient(url, key);
  return supabaseClient;
}

async function getAuthedUserId(supabase: unknown): Promise<string | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any).auth.getUser();
    return data?.user?.id ?? null;
  } catch {
    return null;
  }
}

// getDeviceId는 @/utils/device에서 import

// ========== FeedbackService Class ==========

class FeedbackServiceClass {
  // ========== 피드백 ==========

  async saveFeedback(data: FeedbackData): Promise<SaveResult> {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return this.saveToLocalStorage('mbti_feedback', data);
    }

    try {
      const userId = await getAuthedUserId(supabase);
      const deviceId = getDeviceId();

      const { error } = await supabase
        .from('mbti_feedback')
        .insert({
          device_id: deviceId,
          user_id: userId,
          test_type: data.testType,
          result_name: data.resultName,
          is_accurate: data.isAccurate,
          comment: data.comment || null,
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('[FeedbackService] 피드백 저장 실패:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async getFeedbackStats(testType: string): Promise<{ accurate: number; inaccurate: number; total: number }> {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return { accurate: 0, inaccurate: 0, total: 0 };
    }

    try {
      const { data, error } = await supabase
        .from('mbti_feedback')
        .select('is_accurate')
        .eq('test_type', testType);

      if (error) throw error;

      const accurate = data?.filter((r: { is_accurate: boolean | null }) => r.is_accurate === true).length || 0;
      const inaccurate = data?.filter((r: { is_accurate: boolean | null }) => r.is_accurate === false).length || 0;

      return { accurate, inaccurate, total: data?.length || 0 };
    } catch (error) {
      console.error('[FeedbackService] 피드백 통계 조회 실패:', error);
      return { accurate: 0, inaccurate: 0, total: 0 };
    }
  }

  async getComments(testType: string, resultName?: string, limit: number = 10): Promise<FeedbackComment[]> {
    const supabase = getSupabaseClient();

    if (!supabase) {
      // localStorage 폴백
      const stored = this.getFromLocalStorage('mbti_feedback') as Array<{
        testType?: string;
        resultName?: string;
        isAccurate?: boolean;
        comment?: string;
        created_at?: string;
      }>;
      return stored
        .filter(r => r.testType === testType && r.comment && (!resultName || r.resultName === resultName))
        .slice(-limit)
        .reverse()
        .map((r, i) => ({
          id: `local_${i}`,
          resultName: r.resultName || '',
          isAccurate: r.isAccurate ?? true,
          comment: r.comment || '',
          createdAt: r.created_at || new Date().toISOString(),
        }));
    }

    try {
      let query = supabase
        .from('mbti_feedback')
        .select('id, result_name, is_accurate, comment, created_at')
        .eq('test_type', testType)
        .not('comment', 'is', null)
        .neq('comment', '')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (resultName) {
        query = query.eq('result_name', resultName);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map((r: {
        id: string;
        result_name: string;
        is_accurate: boolean;
        comment: string;
        created_at: string
      }) => ({
        id: r.id,
        resultName: r.result_name,
        isAccurate: r.is_accurate,
        comment: r.comment,
        createdAt: r.created_at,
      }));
    } catch (error) {
      console.error('[FeedbackService] 댓글 조회 실패:', error);
      return [];
    }
  }

  // ========== 투표 ==========

  async savePollResponse(data: PollResponseData): Promise<SaveResult> {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return this.savePollToLocalStorage(data);
    }

    try {
      const userId = await getAuthedUserId(supabase);
      const { data: result, error } = await supabase
        .from('mbti_poll_responses')
        .upsert({
          device_id: getDeviceId(),
          user_id: userId,
          poll_id: data.pollId,
          option_id: data.optionId,
        }, {
          onConflict: 'device_id,poll_id',
          ignoreDuplicates: true,
        })
        .select('id')
        .maybeSingle();

      if (error) throw error;
      return { success: true, id: result?.id };
    } catch (error) {
      console.error('[FeedbackService] 투표 저장 실패:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async getPollStats(pollId: string): Promise<PollStats> {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return { pollId, totalVotes: 0, options: [] };
    }

    try {
      const { data, error } = await supabase
        .from('mbti_poll_responses')
        .select('option_id')
        .eq('poll_id', pollId);

      if (error) throw error;

      const total = data?.length || 0;
      const counts: Record<string, number> = {};

      data?.forEach((r: { option_id: string }) => {
        counts[r.option_id] = (counts[r.option_id] || 0) + 1;
      });

      const options = Object.entries(counts).map(([optionId, count]) => ({
        optionId,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }));

      return { pollId, totalVotes: total, options };
    } catch (error) {
      console.error('[FeedbackService] 투표 통계 조회 실패:', error);
      return { pollId, totalVotes: 0, options: [] };
    }
  }

  async hasVoted(pollId: string): Promise<boolean> {
    const supabase = getSupabaseClient();

    if (!supabase) {
      const stored = this.getFromLocalStorage('mbti_poll_responses') as { pollId?: string }[];
      return stored.some((r) => r.pollId === pollId);
    }

    try {
      const { data, error } = await supabase
        .from('mbti_poll_responses')
        .select('id')
        .eq('device_id', getDeviceId())
        .eq('poll_id', pollId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
      return !!data;
    } catch {
      return false;
    }
  }

  // ========== 퀴즈 ==========

  async saveQuizResponse(data: QuizResponseData): Promise<SaveResult> {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return this.saveToLocalStorage('mbti_quiz_responses', data);
    }

    try {
      const userId = await getAuthedUserId(supabase);
      const { data: result, error } = await supabase
        .from('mbti_quiz_responses')
        .insert({
          device_id: getDeviceId(),
          user_id: userId,
          quiz_id: data.quizId,
          question_index: data.questionIndex,
          selected_option: data.selectedOption,
          is_correct: data.isCorrect,
          points: data.points || 0,
        })
        .select('id')
        .single();

      if (error) throw error;
      return { success: true, id: result?.id };
    } catch (error) {
      console.error('[FeedbackService] 퀴즈 응답 저장 실패:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async getQuizStats(quizId: string): Promise<QuizStats> {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return { quizId, totalAttempts: 0, correctRate: 0, byQuestion: [] };
    }

    try {
      const { data, error } = await supabase
        .from('mbti_quiz_responses')
        .select('question_index, is_correct')
        .eq('quiz_id', quizId);

      if (error) throw error;

      const total = data?.length || 0;
      const correct = data?.filter((r: { is_correct: boolean }) => r.is_correct).length || 0;

      // 문제별 통계
      const byQuestionMap: Record<number, { total: number; correct: number }> = {};
      data?.forEach((r: { question_index: number; is_correct: boolean }) => {
        if (!byQuestionMap[r.question_index]) {
          byQuestionMap[r.question_index] = { total: 0, correct: 0 };
        }
        byQuestionMap[r.question_index].total++;
        if (r.is_correct) byQuestionMap[r.question_index].correct++;
      });

      const byQuestion = Object.entries(byQuestionMap).map(([idx, stats]) => ({
        questionIndex: parseInt(idx),
        correctRate: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      }));

      return {
        quizId,
        totalAttempts: total,
        correctRate: total > 0 ? Math.round((correct / total) * 100) : 0,
        byQuestion,
      };
    } catch (error) {
      console.error('[FeedbackService] 퀴즈 통계 조회 실패:', error);
      return { quizId, totalAttempts: 0, correctRate: 0, byQuestion: [] };
    }
  }

  // ========== localStorage 폴백 ==========

  private saveToLocalStorage(key: string, data: unknown): SaveResult {
    try {
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push({ ...data as object, device_id: getDeviceId(), created_at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing));
      return { success: true, id: 'local_' + Date.now() };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  private savePollToLocalStorage(data: PollResponseData): SaveResult {
    try {
      const key = 'mbti_poll_responses';
      const existing = JSON.parse(localStorage.getItem(key) || '[]') as Array<PollResponseData & { created_at?: string }>;
      const next = existing.filter((r) => r.pollId !== data.pollId);
      next.push({ ...data, created_at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(next));
      return { success: true, id: 'local_' + Date.now() };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  private getFromLocalStorage(key: string): unknown[] {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  }

  // ========== 참여 분석 메서드 ==========

  /**
   * 사용자의 투표 참여 분석
   * - 소수 의견 선택 비율 계산 (소수 의견 뱃지용)
   * - 카테고리별 참여 현황
   */
  async getUserPollAnalysis(): Promise<PollParticipationAnalysis> {
    const deviceId = getDeviceId();
    const defaultResult: PollParticipationAnalysis = {
      totalPolls: 0,
      minorityVotes: 0,
      minorityRatio: 0,
      categoryBreakdown: {},
      recentPollIds: [],
    };

    // localStorage 기반 분석
    const stored = this.getFromLocalStorage('mbti_poll_responses') as Array<{
      pollId: string;
      optionId: string;
      category?: string;
      isMinority?: boolean;
      created_at?: string;
    }>;

    if (stored.length === 0) return defaultResult;

    const userResponses = stored.filter(r => r.pollId);
    const totalPolls = userResponses.length;
    const minorityVotes = userResponses.filter(r => r.isMinority).length;

    // 카테고리별 집계
    const categoryBreakdown: Record<string, number> = {};
    userResponses.forEach(r => {
      if (r.category) {
        categoryBreakdown[r.category] = (categoryBreakdown[r.category] || 0) + 1;
      }
    });

    // 최근 투표 ID (최근 10개)
    const recentPollIds = userResponses
      .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
      .slice(0, 10)
      .map(r => r.pollId);

    return {
      totalPolls,
      minorityVotes,
      minorityRatio: totalPolls > 0 ? Math.round((minorityVotes / totalPolls) * 100) : 0,
      categoryBreakdown,
      recentPollIds,
    };
  }

  /**
   * 사용자의 퀴즈 성과 분석
   * - 전체 정답률
   * - 카테고리별 성과
   * - 가장 잘하는 카테고리
   */
  async getUserQuizAnalysis(): Promise<QuizPerformanceAnalysis> {
    const defaultResult: QuizPerformanceAnalysis = {
      totalAnswered: 0,
      correctCount: 0,
      correctRate: 0,
      categoryBreakdown: {},
      bestCategory: null,
    };

    // localStorage 기반 분석
    const stored = this.getFromLocalStorage('mbti_quiz_responses') as Array<{
      quizId: string;
      isCorrect: boolean;
      category?: string;
    }>;

    if (stored.length === 0) return defaultResult;

    const totalAnswered = stored.length;
    const correctCount = stored.filter(r => r.isCorrect).length;

    // 카테고리별 집계
    const categoryBreakdown: Record<string, { answered: number; correct: number }> = {};
    stored.forEach(r => {
      const cat = r.category || 'general';
      if (!categoryBreakdown[cat]) {
        categoryBreakdown[cat] = { answered: 0, correct: 0 };
      }
      categoryBreakdown[cat].answered++;
      if (r.isCorrect) categoryBreakdown[cat].correct++;
    });

    // 가장 잘하는 카테고리 찾기 (최소 3문제 이상 풀어본 카테고리 중)
    let bestCategory: string | null = null;
    let bestRate = 0;
    Object.entries(categoryBreakdown).forEach(([cat, stats]) => {
      if (stats.answered >= 3) {
        const rate = stats.correct / stats.answered;
        if (rate > bestRate) {
          bestRate = rate;
          bestCategory = cat;
        }
      }
    });

    return {
      totalAnswered,
      correctCount,
      correctRate: totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0,
      categoryBreakdown,
      bestCategory,
    };
  }

  /**
   * 투표 저장 시 소수 의견 여부 함께 저장 (확장된 버전)
   * 주의: localStorage에만 저장 (Supabase 연동 시 별도 처리 필요)
   */
  async savePollResponseWithAnalysis(
    data: PollResponseData & { category?: string },
    pollStats?: PollStats
  ): Promise<SaveResult & { isMinority: boolean }> {
    // 소수 의견 여부 판단 (전체 투표의 30% 미만이면 소수)
    let isMinority = false;
    if (pollStats && pollStats.totalVotes > 0) {
      const selectedOption = pollStats.options.find(o => o.optionId === data.optionId);
      if (selectedOption) {
        isMinority = selectedOption.percentage < 30;
      }
    }

    // localStorage에 확장 데이터 저장
    try {
      const key = 'mbti_poll_responses';
      const existing = JSON.parse(localStorage.getItem(key) || '[]') as Array<
        PollResponseData & { category?: string; isMinority?: boolean; created_at?: string }
      >;
      // 동일 투표 중복 방지
      const next = existing.filter((r) => r.pollId !== data.pollId);
      next.push({
        ...data,
        isMinority,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem(key, JSON.stringify(next));

      // TODO: Supabase 연동 시 여기에 서버 저장 추가
      // await this.savePollResponse(data);

      return { success: true, isMinority };
    } catch (error) {
      return { success: false, error: (error as Error).message, isMinority: false };
    }
  }

  /**
   * 퀴즈 저장 시 카테고리 정보 함께 저장 (확장된 버전)
   * 주의: localStorage에만 저장 (Supabase 연동 시 별도 처리 필요)
   */
  async saveQuizResponseWithCategory(
    data: QuizResponseData & { category?: string }
  ): Promise<SaveResult> {
    // localStorage에 카테고리 포함 저장
    try {
      const key = 'mbti_quiz_responses';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      // 동일 퀴즈 중복 방지
      const filtered = existing.filter(
        (r: { quizId?: string }) => r.quizId !== data.quizId
      );
      filtered.push({
        ...data,
        device_id: getDeviceId(),
        created_at: new Date().toISOString(),
      });
      localStorage.setItem(key, JSON.stringify(filtered));

      // TODO: Supabase 연동 시 여기에 서버 저장 추가
      // return await this.saveQuizResponse(data);

      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * 사용자가 특정 카테고리에 관심 있는지 판단
   * (참여 횟수 기준 상위 카테고리 반환)
   */
  async getTopInterestCategories(limit: number = 3): Promise<string[]> {
    const pollAnalysis = await this.getUserPollAnalysis();
    const quizAnalysis = await this.getUserQuizAnalysis();

    // 투표 + 퀴즈 카테고리 합산
    const combined: Record<string, number> = { ...pollAnalysis.categoryBreakdown };
    Object.entries(quizAnalysis.categoryBreakdown).forEach(([cat, stats]) => {
      combined[cat] = (combined[cat] || 0) + stats.answered;
    });

    // 참여 횟수 순으로 정렬
    return Object.entries(combined)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([cat]) => cat);
  }
}

// 싱글톤 인스턴스
export const feedbackService = new FeedbackServiceClass();

export default feedbackService;
