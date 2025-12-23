/**
 * ContentService - 콘텐츠(퀴즈/투표/토너먼트) 관리 서비스
 *
 * DB 우선 조회, 코드 폴백 지원
 * - 서버: API 라우트에서 직접 사용
 * - 클라이언트: /api/content 엔드포인트를 통해 사용
 */

import { query } from '@/lib/turso';
import {
  Quiz,
  ScenarioQuiz,
  Poll,
  CAT_KNOWLEDGE_QUIZZES,
  CAT_BUTLER_SCENARIO,
  CAT_VS_POLLS,
  CAT_CHOICE_POLLS,
} from '@/app/dashboard/data/content-samples';
import {
  Tournament,
  CAT_BREED_TOURNAMENT,
} from '@/app/dashboard/data/tournament-sample';

// ============================================================================
// Types
// ============================================================================

export type ContentType = 'quiz' | 'scenario' | 'poll' | 'tournament';
export type ContentCategory = 'cat' | 'dog' | 'plant' | 'love' | 'personality' | 'lifestyle' | 'food' | 'general';

export interface ContentQuery {
  type?: ContentType;
  category?: ContentCategory;
  status?: 'draft' | 'active' | 'hidden';
  limit?: number;
  offset?: number;
}

export interface ContentListResult<T> {
  items: T[];
  total: number;
  hasMore: boolean;
}

export interface ContentMutationResult {
  success: boolean;
  id?: string;
  error?: string;
}

// ============================================================================
// 코드 폴백 데이터 (DB에 없을 때 사용)
// ============================================================================

const CODE_QUIZZES: Quiz[] = [...CAT_KNOWLEDGE_QUIZZES];
const CODE_SCENARIOS: ScenarioQuiz[] = [CAT_BUTLER_SCENARIO];
const CODE_POLLS: Poll[] = [...CAT_VS_POLLS, ...CAT_CHOICE_POLLS];
const CODE_TOURNAMENTS: Tournament[] = [CAT_BREED_TOURNAMENT];

// ============================================================================
// ContentService Class
// ============================================================================

class ContentServiceClass {
  // ========== 퀴즈 ==========

  async getQuizzes(options: ContentQuery = {}): Promise<Quiz[]> {
    const { category, limit = 50, offset = 0 } = options;

    try {
      let sql = `SELECT * FROM quizzes WHERE status = 'active'`;
      const args: unknown[] = [];

      if (category) {
        sql += ` AND category = ?`;
        args.push(category);
      }

      sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      args.push(limit, offset);

      const result = await query(sql, args);

      if (result.rows.length === 0) {
        // DB에 데이터 없으면 코드 폴백
        return this.filterByCategory(CODE_QUIZZES, category).slice(offset, offset + limit);
      }

      return result.rows.map(row => this.rowToQuiz(row));
    } catch (error) {
      console.error('[ContentService] getQuizzes error:', error);
      // 에러 시 코드 폴백
      return this.filterByCategory(CODE_QUIZZES, category).slice(offset, offset + limit);
    }
  }

  async getQuizById(id: string): Promise<Quiz | null> {
    try {
      const result = await query(
        `SELECT * FROM quizzes WHERE id = ? AND status = 'active'`,
        [id]
      );

      if (result.rows.length === 0) {
        // DB에 없으면 코드에서 찾기
        return CODE_QUIZZES.find(q => q.id === id) || null;
      }

      return this.rowToQuiz(result.rows[0]);
    } catch (error) {
      console.error('[ContentService] getQuizById error:', error);
      return CODE_QUIZZES.find(q => q.id === id) || null;
    }
  }

  // ========== 시나리오 퀴즈 ==========

  async getScenarios(options: ContentQuery = {}): Promise<ScenarioQuiz[]> {
    const { category, limit = 50, offset = 0 } = options;

    try {
      let sql = `SELECT * FROM scenario_quizzes WHERE status = 'active'`;
      const args: unknown[] = [];

      if (category) {
        sql += ` AND category = ?`;
        args.push(category);
      }

      sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      args.push(limit, offset);

      const result = await query(sql, args);

      if (result.rows.length === 0) {
        return this.filterByCategory(CODE_SCENARIOS, category).slice(offset, offset + limit);
      }

      return result.rows.map(row => this.rowToScenario(row));
    } catch (error) {
      console.error('[ContentService] getScenarios error:', error);
      return this.filterByCategory(CODE_SCENARIOS, category).slice(offset, offset + limit);
    }
  }

  async getScenarioById(id: string): Promise<ScenarioQuiz | null> {
    try {
      const result = await query(
        `SELECT * FROM scenario_quizzes WHERE id = ? AND status = 'active'`,
        [id]
      );

      if (result.rows.length === 0) {
        return CODE_SCENARIOS.find(s => s.id === id) || null;
      }

      return this.rowToScenario(result.rows[0]);
    } catch (error) {
      console.error('[ContentService] getScenarioById error:', error);
      return CODE_SCENARIOS.find(s => s.id === id) || null;
    }
  }

  // ========== 투표 ==========

  async getPolls(options: ContentQuery = {}): Promise<Poll[]> {
    const { category, limit = 50, offset = 0 } = options;

    try {
      let sql = `SELECT * FROM polls WHERE status = 'active'`;
      const args: unknown[] = [];

      if (category) {
        sql += ` AND category = ?`;
        args.push(category);
      }

      sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      args.push(limit, offset);

      const result = await query(sql, args);

      if (result.rows.length === 0) {
        return this.filterByCategory(CODE_POLLS, category).slice(offset, offset + limit);
      }

      return result.rows.map(row => this.rowToPoll(row));
    } catch (error) {
      console.error('[ContentService] getPolls error:', error);
      return this.filterByCategory(CODE_POLLS, category).slice(offset, offset + limit);
    }
  }

  async getPollById(id: string): Promise<Poll | null> {
    try {
      const result = await query(
        `SELECT * FROM polls WHERE id = ? AND status = 'active'`,
        [id]
      );

      if (result.rows.length === 0) {
        return CODE_POLLS.find(p => p.id === id) || null;
      }

      return this.rowToPoll(result.rows[0]);
    } catch (error) {
      console.error('[ContentService] getPollById error:', error);
      return CODE_POLLS.find(p => p.id === id) || null;
    }
  }

  // ========== 토너먼트 ==========

  async getTournaments(options: ContentQuery = {}): Promise<Tournament[]> {
    const { category, limit = 50, offset = 0 } = options;

    try {
      let sql = `SELECT * FROM tournaments WHERE status = 'active'`;
      const args: unknown[] = [];

      if (category) {
        sql += ` AND category = ?`;
        args.push(category);
      }

      sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      args.push(limit, offset);

      const result = await query(sql, args);

      if (result.rows.length === 0) {
        return this.filterByCategory(CODE_TOURNAMENTS, category).slice(offset, offset + limit);
      }

      return result.rows.map(row => this.rowToTournament(row));
    } catch (error) {
      console.error('[ContentService] getTournaments error:', error);
      return this.filterByCategory(CODE_TOURNAMENTS, category).slice(offset, offset + limit);
    }
  }

  async getTournamentById(id: string): Promise<Tournament | null> {
    try {
      const result = await query(
        `SELECT * FROM tournaments WHERE id = ? AND status = 'active'`,
        [id]
      );

      if (result.rows.length === 0) {
        return CODE_TOURNAMENTS.find(t => t.id === id) || null;
      }

      return this.rowToTournament(result.rows[0]);
    } catch (error) {
      console.error('[ContentService] getTournamentById error:', error);
      return CODE_TOURNAMENTS.find(t => t.id === id) || null;
    }
  }

  // ========== CRUD (관리용) ==========

  async createQuiz(quiz: Quiz): Promise<ContentMutationResult> {
    try {
      await query(
        `INSERT INTO quizzes (id, type, category, question, options, explanation, related_result, difficulty, points, tags, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
        [
          quiz.id,
          quiz.type,
          quiz.category,
          quiz.question,
          JSON.stringify(quiz.options),
          quiz.explanation || null,
          quiz.relatedResult || null,
          quiz.difficulty,
          quiz.points || 10,
          quiz.tags ? JSON.stringify(quiz.tags) : null,
        ]
      );
      return { success: true, id: quiz.id };
    } catch (error) {
      console.error('[ContentService] createQuiz error:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async updateQuiz(id: string, updates: Partial<Quiz>): Promise<ContentMutationResult> {
    try {
      const fields: string[] = [];
      const args: unknown[] = [];

      if (updates.question !== undefined) { fields.push('question = ?'); args.push(updates.question); }
      if (updates.options !== undefined) { fields.push('options = ?'); args.push(JSON.stringify(updates.options)); }
      if (updates.explanation !== undefined) { fields.push('explanation = ?'); args.push(updates.explanation); }
      if (updates.difficulty !== undefined) { fields.push('difficulty = ?'); args.push(updates.difficulty); }
      if (updates.points !== undefined) { fields.push('points = ?'); args.push(updates.points); }
      if (updates.tags !== undefined) { fields.push('tags = ?'); args.push(JSON.stringify(updates.tags)); }

      if (fields.length === 0) {
        return { success: false, error: 'No fields to update' };
      }

      fields.push("updated_at = datetime('now')");
      args.push(id);

      await query(`UPDATE quizzes SET ${fields.join(', ')} WHERE id = ?`, args);
      return { success: true, id };
    } catch (error) {
      console.error('[ContentService] updateQuiz error:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async deleteQuiz(id: string): Promise<ContentMutationResult> {
    try {
      // Soft delete - status를 hidden으로 변경
      await query(`UPDATE quizzes SET status = 'hidden', updated_at = datetime('now') WHERE id = ?`, [id]);
      return { success: true, id };
    } catch (error) {
      console.error('[ContentService] deleteQuiz error:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async createPoll(poll: Poll): Promise<ContentMutationResult> {
    try {
      await query(
        `INSERT INTO polls (id, type, category, question, options, tags, status)
         VALUES (?, ?, ?, ?, ?, ?, 'active')`,
        [
          poll.id,
          poll.type,
          poll.category,
          poll.question,
          JSON.stringify(poll.options),
          poll.tags ? JSON.stringify(poll.tags) : null,
        ]
      );
      return { success: true, id: poll.id };
    } catch (error) {
      console.error('[ContentService] createPoll error:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async updatePoll(id: string, updates: Partial<Poll>): Promise<ContentMutationResult> {
    try {
      const fields: string[] = [];
      const args: unknown[] = [];

      if (updates.question !== undefined) { fields.push('question = ?'); args.push(updates.question); }
      if (updates.options !== undefined) { fields.push('options = ?'); args.push(JSON.stringify(updates.options)); }
      if (updates.tags !== undefined) { fields.push('tags = ?'); args.push(JSON.stringify(updates.tags)); }

      if (fields.length === 0) {
        return { success: false, error: 'No fields to update' };
      }

      fields.push("updated_at = datetime('now')");
      args.push(id);

      await query(`UPDATE polls SET ${fields.join(', ')} WHERE id = ?`, args);
      return { success: true, id };
    } catch (error) {
      console.error('[ContentService] updatePoll error:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async deletePoll(id: string): Promise<ContentMutationResult> {
    try {
      await query(`UPDATE polls SET status = 'hidden', updated_at = datetime('now') WHERE id = ?`, [id]);
      return { success: true, id };
    } catch (error) {
      console.error('[ContentService] deletePoll error:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async createScenario(scenario: ScenarioQuiz): Promise<ContentMutationResult> {
    try {
      await query(
        `INSERT INTO scenario_quizzes (id, category, title, subtitle, emoji, theme_color, questions, results, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
        [
          scenario.id,
          scenario.category,
          scenario.title,
          scenario.subtitle || null,
          scenario.emoji,
          scenario.themeColor,
          JSON.stringify(scenario.questions),
          JSON.stringify(scenario.results),
        ]
      );
      return { success: true, id: scenario.id };
    } catch (error) {
      console.error('[ContentService] createScenario error:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async updateScenario(id: string, updates: Partial<ScenarioQuiz>): Promise<ContentMutationResult> {
    try {
      const fields: string[] = [];
      const args: unknown[] = [];

      if (updates.title !== undefined) { fields.push('title = ?'); args.push(updates.title); }
      if (updates.subtitle !== undefined) { fields.push('subtitle = ?'); args.push(updates.subtitle); }
      if (updates.emoji !== undefined) { fields.push('emoji = ?'); args.push(updates.emoji); }
      if (updates.themeColor !== undefined) { fields.push('theme_color = ?'); args.push(updates.themeColor); }
      if (updates.questions !== undefined) { fields.push('questions = ?'); args.push(JSON.stringify(updates.questions)); }
      if (updates.results !== undefined) { fields.push('results = ?'); args.push(JSON.stringify(updates.results)); }

      if (fields.length === 0) {
        return { success: false, error: 'No fields to update' };
      }

      fields.push("updated_at = datetime('now')");
      args.push(id);

      await query(`UPDATE scenario_quizzes SET ${fields.join(', ')} WHERE id = ?`, args);
      return { success: true, id };
    } catch (error) {
      console.error('[ContentService] updateScenario error:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async deleteScenario(id: string): Promise<ContentMutationResult> {
    try {
      await query(`UPDATE scenario_quizzes SET status = 'hidden', updated_at = datetime('now') WHERE id = ?`, [id]);
      return { success: true, id };
    } catch (error) {
      console.error('[ContentService] deleteScenario error:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async createTournament(tournament: Tournament): Promise<ContentMutationResult> {
    try {
      await query(
        `INSERT INTO tournaments (id, type, category, title, subtitle, description, emoji, theme_color, round_size, contestants, result_config, status, start_at, end_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tournament.id,
          tournament.type,
          tournament.category,
          tournament.title,
          tournament.subtitle || null,
          tournament.description,
          tournament.emoji,
          tournament.themeColor,
          tournament.roundSize,
          JSON.stringify(tournament.contestants),
          JSON.stringify(tournament.resultConfig),
          tournament.status,
          tournament.startAt || null,
          tournament.endAt || null,
        ]
      );
      return { success: true, id: tournament.id };
    } catch (error) {
      console.error('[ContentService] createTournament error:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async updateTournament(id: string, updates: Partial<Tournament>): Promise<ContentMutationResult> {
    try {
      const fields: string[] = [];
      const args: unknown[] = [];

      if (updates.title !== undefined) { fields.push('title = ?'); args.push(updates.title); }
      if (updates.subtitle !== undefined) { fields.push('subtitle = ?'); args.push(updates.subtitle); }
      if (updates.description !== undefined) { fields.push('description = ?'); args.push(updates.description); }
      if (updates.emoji !== undefined) { fields.push('emoji = ?'); args.push(updates.emoji); }
      if (updates.themeColor !== undefined) { fields.push('theme_color = ?'); args.push(updates.themeColor); }
      if (updates.contestants !== undefined) { fields.push('contestants = ?'); args.push(JSON.stringify(updates.contestants)); }
      if (updates.resultConfig !== undefined) { fields.push('result_config = ?'); args.push(JSON.stringify(updates.resultConfig)); }
      if (updates.status !== undefined) { fields.push('status = ?'); args.push(updates.status); }
      if (updates.startAt !== undefined) { fields.push('start_at = ?'); args.push(updates.startAt); }
      if (updates.endAt !== undefined) { fields.push('end_at = ?'); args.push(updates.endAt); }

      if (fields.length === 0) {
        return { success: false, error: 'No fields to update' };
      }

      fields.push("updated_at = datetime('now')");
      args.push(id);

      await query(`UPDATE tournaments SET ${fields.join(', ')} WHERE id = ?`, args);
      return { success: true, id };
    } catch (error) {
      console.error('[ContentService] updateTournament error:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async deleteTournament(id: string): Promise<ContentMutationResult> {
    try {
      await query(`UPDATE tournaments SET status = 'hidden', updated_at = datetime('now') WHERE id = ?`, [id]);
      return { success: true, id };
    } catch (error) {
      console.error('[ContentService] deleteTournament error:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // ========== 총 개수 조회 ==========

  async getQuizCount(category?: ContentCategory): Promise<number> {
    try {
      let sql = `SELECT COUNT(*) as count FROM quizzes WHERE status = 'active'`;
      const args: unknown[] = [];
      if (category) {
        sql += ` AND category = ?`;
        args.push(category);
      }
      const result = await query(sql, args);
      return (result.rows[0]?.count as number) || 0;
    } catch {
      return this.filterByCategory(CODE_QUIZZES, category).length;
    }
  }

  async getPollCount(category?: ContentCategory): Promise<number> {
    try {
      let sql = `SELECT COUNT(*) as count FROM polls WHERE status = 'active'`;
      const args: unknown[] = [];
      if (category) {
        sql += ` AND category = ?`;
        args.push(category);
      }
      const result = await query(sql, args);
      return (result.rows[0]?.count as number) || 0;
    } catch {
      return this.filterByCategory(CODE_POLLS, category).length;
    }
  }

  async getScenarioCount(category?: ContentCategory): Promise<number> {
    try {
      let sql = `SELECT COUNT(*) as count FROM scenario_quizzes WHERE status = 'active'`;
      const args: unknown[] = [];
      if (category) {
        sql += ` AND category = ?`;
        args.push(category);
      }
      const result = await query(sql, args);
      return (result.rows[0]?.count as number) || 0;
    } catch {
      return this.filterByCategory(CODE_SCENARIOS, category).length;
    }
  }

  async getTournamentCount(category?: ContentCategory): Promise<number> {
    try {
      let sql = `SELECT COUNT(*) as count FROM tournaments WHERE status = 'active'`;
      const args: unknown[] = [];
      if (category) {
        sql += ` AND category = ?`;
        args.push(category);
      }
      const result = await query(sql, args);
      return (result.rows[0]?.count as number) || 0;
    } catch {
      return this.filterByCategory(CODE_TOURNAMENTS, category).length;
    }
  }

  // ========== 헬퍼 함수 ==========

  private filterByCategory<T extends { category: string }>(items: T[], category?: string): T[] {
    if (!category) return items;
    return items.filter(item => item.category === category);
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      // 중복 ID 에러
      if (error.message.includes('UNIQUE') || error.message.includes('constraint')) {
        return 'ID가 이미 존재합니다';
      }
      return error.message;
    }
    return '알 수 없는 오류가 발생했습니다';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private rowToQuiz(row: any): Quiz {
    return {
      id: row.id,
      type: row.type,
      category: row.category,
      question: row.question,
      options: JSON.parse(row.options),
      explanation: row.explanation,
      relatedResult: row.related_result,
      difficulty: row.difficulty,
      points: row.points,
      tags: row.tags ? JSON.parse(row.tags) : undefined,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private rowToScenario(row: any): ScenarioQuiz {
    return {
      id: row.id,
      category: row.category,
      title: row.title,
      subtitle: row.subtitle,
      emoji: row.emoji,
      themeColor: row.theme_color,
      questions: JSON.parse(row.questions),
      results: JSON.parse(row.results),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private rowToPoll(row: any): Poll {
    return {
      id: row.id,
      type: row.type,
      category: row.category,
      question: row.question,
      options: JSON.parse(row.options),
      tags: row.tags ? JSON.parse(row.tags) : undefined,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private rowToTournament(row: any): Tournament {
    return {
      id: row.id,
      type: row.type,
      category: row.category,
      title: row.title,
      subtitle: row.subtitle,
      description: row.description,
      emoji: row.emoji,
      themeColor: row.theme_color,
      roundSize: row.round_size,
      contestants: JSON.parse(row.contestants),
      resultConfig: JSON.parse(row.result_config),
      status: row.status,
      createdAt: row.created_at,
      startAt: row.start_at,
      endAt: row.end_at,
    };
  }
}

// 싱글톤 인스턴스
export const contentService = new ContentServiceClass();
export default contentService;
