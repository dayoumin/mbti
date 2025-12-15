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

interface SaveResult {
  success: boolean;
  id?: string;
  error?: string;
}

// ========== Supabase 클라이언트 ==========

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabaseClient: any = null;

async function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  try {
    const moduleName = '@supabase/supabase-js';
    const { createClient } = await import(/* webpackIgnore: true */ moduleName);
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    return supabaseClient;
  } catch {
    return null;
  }
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

// ========== 유틸리티 ==========

function getDeviceId(): string {
  if (typeof window === 'undefined') return 'server';

  const USER_KEY = 'chemi_user';
  let user = localStorage.getItem(USER_KEY);
  if (!user) {
    user = 'anon_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem(USER_KEY, user);
  }
  return user;
}

// ========== FeedbackService Class ==========

class FeedbackServiceClass {
  // ========== 피드백 ==========

  async saveFeedback(data: FeedbackData): Promise<SaveResult> {
    const supabase = await getSupabaseClient();

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
    const supabase = await getSupabaseClient();

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
    const supabase = await getSupabaseClient();

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
    const supabase = await getSupabaseClient();

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
    const supabase = await getSupabaseClient();

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
    const supabase = await getSupabaseClient();

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
    const supabase = await getSupabaseClient();

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
    const supabase = await getSupabaseClient();

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
}

// 싱글톤 인스턴스
export const feedbackService = new FeedbackServiceClass();

export default feedbackService;
