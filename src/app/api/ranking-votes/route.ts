/**
 * Ranking Votes API Route
 *
 * POST /api/ranking-votes - 랭킹 투표 저장
 * GET /api/ranking-votes?seasonId=xxx - 시즌별 투표 조회
 * GET /api/ranking-votes?seasonId=xxx&categoryId=yyy - 카테고리별 투표 조회
 * GET /api/ranking-votes?type=seasons - 사용 가능한 시즌 목록
 * GET /api/ranking-votes?type=stats&seasonId=xxx - 시즌별 통계
 * GET /api/ranking-votes?type=all - 전체 투표 (대시보드용)
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/turso';

// ========== 타입 정의 ==========

interface RankingVoteInput {
  deviceId: string;
  categoryId: string;
  resultKey: string;
  resultEmoji?: string;
  testType: string;
  seasonId: string;
  seasonType: string;
}

// ========== POST: 투표 저장 ==========

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RankingVoteInput;

    // 입력 검증
    if (!body.deviceId || !body.categoryId || !body.resultKey || !body.testType || !body.seasonId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // ID 생성 (timestamp + random)
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // 투표 저장
    await query(
      `INSERT INTO ranking_votes (id, device_id, category_id, result_key, result_emoji, test_type, season_id, season_type, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [
        id,
        body.deviceId,
        body.categoryId,
        body.resultKey,
        body.resultEmoji || '',
        body.testType,
        body.seasonId,
        body.seasonType || 'quarterly',
      ]
    );

    // 통계 캐시 업데이트 (upsert)
    await query(
      `INSERT INTO ranking_stats_cache (season_id, category_id, result_key, vote_count, last_updated)
       VALUES (?, ?, ?, 1, datetime('now'))
       ON CONFLICT(season_id, category_id, result_key)
       DO UPDATE SET vote_count = vote_count + 1, last_updated = datetime('now')`,
      [body.seasonId, body.categoryId, body.resultKey]
    );

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('[ranking-votes] POST error:', error);
    return NextResponse.json(
      { error: 'Failed to save vote' },
      { status: 500 }
    );
  }
}

// ========== GET: 투표 조회 ==========

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type');
    const seasonId = request.nextUrl.searchParams.get('seasonId');
    const categoryId = request.nextUrl.searchParams.get('categoryId');
    const deviceId = request.nextUrl.searchParams.get('deviceId');
    const limitParam = request.nextUrl.searchParams.get('limit');
    const limit = limitParam ? Math.min(parseInt(limitParam) || 100, 1000) : 100;

    // 사용 가능한 시즌 목록
    if (type === 'seasons') {
      const result = await query(
        `SELECT DISTINCT season_id FROM ranking_votes ORDER BY season_id DESC`
      );

      const seasons = result.rows.map(row => row.season_id as string);

      // 시즌 정렬: 연도 내림차순 → 분기 내림차순
      seasons.sort((a, b) => {
        const [yearA, typeA] = a.split('-');
        const [yearB, typeB] = b.split('-');

        if (yearA !== yearB) return parseInt(yearB, 10) - parseInt(yearA, 10);

        const priority = (t: string) => {
          if (t.startsWith('Q')) return 10 + parseInt(t.replace('Q', ''), 10);
          if (t === 'yearly') return 5;
          return 0;
        };
        return priority(typeB) - priority(typeA);
      });

      return NextResponse.json({ seasons });
    }

    // 시즌별 통계 (캐시 테이블 사용)
    if (type === 'stats' && seasonId) {
      const result = await query(
        `SELECT category_id, result_key, vote_count
         FROM ranking_stats_cache
         WHERE season_id = ?
         ORDER BY vote_count DESC`,
        [seasonId]
      );

      // 카테고리별로 그룹핑
      const statsByCategory: Record<string, { votes: Record<string, number>; totalVotes: number }> = {};

      for (const row of result.rows) {
        const catId = row.category_id as string;
        const resultKey = row.result_key as string;
        const count = row.vote_count as number;

        if (!statsByCategory[catId]) {
          statsByCategory[catId] = { votes: {}, totalVotes: 0 };
        }
        statsByCategory[catId].votes[resultKey] = count;
        statsByCategory[catId].totalVotes += count;
      }

      return NextResponse.json({ seasonId, stats: statsByCategory });
    }

    // 전체 투표 (대시보드용)
    if (type === 'all') {
      const result = await query(
        `SELECT * FROM ranking_votes ORDER BY created_at DESC LIMIT ?`,
        [limit]
      );

      const votes = result.rows.map(row => ({
        id: row.id,
        userId: row.device_id,
        categoryId: row.category_id,
        resultKey: row.result_key,
        resultEmoji: row.result_emoji,
        testType: row.test_type,
        seasonId: row.season_id,
        seasonType: row.season_type,
        createdAt: row.created_at,
      }));

      // 총 투표 수
      const countResult = await query('SELECT COUNT(*) as count FROM ranking_votes');
      const totalCount = countResult.rows[0].count as number;

      return NextResponse.json({ votes, totalCount });
    }

    // 사용자별 투표
    if (deviceId) {
      const result = await query(
        `SELECT * FROM ranking_votes WHERE device_id = ? ORDER BY created_at DESC LIMIT ?`,
        [deviceId, limit]
      );

      const votes = result.rows.map(row => ({
        id: row.id,
        userId: row.device_id,
        categoryId: row.category_id,
        resultKey: row.result_key,
        resultEmoji: row.result_emoji,
        testType: row.test_type,
        seasonId: row.season_id,
        seasonType: row.season_type,
        createdAt: row.created_at,
      }));

      return NextResponse.json({ votes });
    }

    // 시즌별/카테고리별 투표
    if (seasonId) {
      let sql = 'SELECT * FROM ranking_votes WHERE season_id = ?';
      const args: unknown[] = [seasonId];

      if (categoryId) {
        sql += ' AND category_id = ?';
        args.push(categoryId);
      }

      sql += ' ORDER BY created_at DESC LIMIT ?';
      args.push(limit);

      const result = await query(sql, args);

      const votes = result.rows.map(row => ({
        id: row.id,
        userId: row.device_id,
        categoryId: row.category_id,
        resultKey: row.result_key,
        resultEmoji: row.result_emoji,
        testType: row.test_type,
        seasonId: row.season_id,
        seasonType: row.season_type,
        createdAt: row.created_at,
      }));

      return NextResponse.json({ votes });
    }

    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  } catch (error) {
    console.error('[ranking-votes] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch votes' },
      { status: 500 }
    );
  }
}
