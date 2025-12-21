/**
 * Ranking API Route
 *
 * GET /api/ranking?type=results - 테스트 결과 랭킹 조회
 * GET /api/ranking?type=results&testType=human - 특정 테스트의 결과 랭킹
 * GET /api/ranking?type=results&testType=coffee&ageGroup=20s - 연령대별 랭킹
 * GET /api/ranking?type=by-age&testType=coffee - 연령대별 TOP 3 비교
 *
 * 반환 형식:
 * {
 *   rankings: [{ resultName, resultEmoji, testType, count, percentage }],
 *   total: number,
 *   ageGroup?: string
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/turso';

const VALID_AGE_GROUPS = ['10s', '20s', '30s', '40s+'] as const;

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type') || 'results';
    const testType = request.nextUrl.searchParams.get('testType');
    const ageGroup = request.nextUrl.searchParams.get('ageGroup');
    const limit = Math.min(parseInt(request.nextUrl.searchParams.get('limit') || '10'), 50);

    // 연령대별 TOP 비교 (모든 연령대의 TOP N 반환)
    if (type === 'by-age') {
      if (!testType) {
        return NextResponse.json({ error: 'testType required for by-age' }, { status: 400 });
      }

      const ageStats: Record<string, Array<{ resultName: string; count: number; percentage: number }>> = {};

      for (const age of VALID_AGE_GROUPS) {
        const result = await query(`
          SELECT
            tr.result_name,
            COUNT(*) as count
          FROM test_results tr
          INNER JOIN user_demographics ud ON tr.device_id = ud.device_id
          WHERE tr.test_type = ? AND ud.age_group = ?
          GROUP BY tr.result_name
          ORDER BY count DESC
          LIMIT 5
        `, [testType, age]);

        // 해당 연령대 총 투표수
        const totalResult = await query(`
          SELECT COUNT(*) as total
          FROM test_results tr
          INNER JOIN user_demographics ud ON tr.device_id = ud.device_id
          WHERE tr.test_type = ? AND ud.age_group = ?
        `, [testType, age]);

        const total = (totalResult.rows[0]?.total as number) || 0;

        ageStats[age] = result.rows.map(row => ({
          resultName: row.result_name as string,
          count: row.count as number,
          percentage: total > 0 ? Math.round(((row.count as number) / total) * 100) : 0,
        }));
      }

      return NextResponse.json({
        testType,
        ageStats,
      });
    }

    if (type === 'results') {
      let sql: string;
      let args: unknown[] = [];
      let totalSql: string;
      let totalArgs: unknown[] = [];

      // 연령대 필터가 있는 경우
      if (ageGroup && VALID_AGE_GROUPS.includes(ageGroup as typeof VALID_AGE_GROUPS[number])) {
        if (testType) {
          sql = `
            SELECT
              tr.result_name,
              tr.test_type,
              COUNT(*) as count
            FROM test_results tr
            INNER JOIN user_demographics ud ON tr.device_id = ud.device_id
            WHERE tr.test_type = ? AND ud.age_group = ?
            GROUP BY tr.result_name, tr.test_type
            ORDER BY count DESC
            LIMIT ?
          `;
          args = [testType, ageGroup, limit];
          totalSql = `
            SELECT COUNT(*) as total
            FROM test_results tr
            INNER JOIN user_demographics ud ON tr.device_id = ud.device_id
            WHERE tr.test_type = ? AND ud.age_group = ?
          `;
          totalArgs = [testType, ageGroup];
        } else {
          sql = `
            SELECT
              tr.result_name,
              tr.test_type,
              COUNT(*) as count
            FROM test_results tr
            INNER JOIN user_demographics ud ON tr.device_id = ud.device_id
            WHERE ud.age_group = ?
            GROUP BY tr.result_name, tr.test_type
            ORDER BY count DESC
            LIMIT ?
          `;
          args = [ageGroup, limit];
          totalSql = `
            SELECT COUNT(*) as total
            FROM test_results tr
            INNER JOIN user_demographics ud ON tr.device_id = ud.device_id
            WHERE ud.age_group = ?
          `;
          totalArgs = [ageGroup];
        }
      } else {
        // 기존 로직 (연령대 필터 없음)
        if (testType) {
          sql = `
            SELECT
              result_name,
              test_type,
              COUNT(*) as count
            FROM test_results
            WHERE test_type = ?
            GROUP BY result_name, test_type
            ORDER BY count DESC
            LIMIT ?
          `;
          args = [testType, limit];
          totalSql = `SELECT COUNT(*) as total FROM test_results WHERE test_type = ?`;
          totalArgs = [testType];
        } else {
          sql = `
            SELECT
              result_name,
              test_type,
              COUNT(*) as count
            FROM test_results
            GROUP BY result_name, test_type
            ORDER BY count DESC
            LIMIT ?
          `;
          args = [limit];
          totalSql = `SELECT COUNT(*) as total FROM test_results`;
          totalArgs = [];
        }
      }

      const result = await query(sql, args);
      const countResult = await query(totalSql, totalArgs);
      const total = (countResult.rows[0]?.total as number) || 0;

      const rankings = result.rows.map(row => ({
        resultName: row.result_name as string,
        testType: row.test_type as string,
        count: row.count as number,
        percentage: total > 0 ? Math.round(((row.count as number) / total) * 100) : 0,
        resultEmoji: getResultEmoji(row.test_type as string, row.result_name as string),
      }));

      return NextResponse.json({
        rankings,
        total,
        ageGroup: ageGroup || 'all',
        testType: testType || 'all',
      });
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error) {
    console.error('[Ranking API] Error:', error);
    return NextResponse.json({ error: 'Failed to get rankings' }, { status: 500 });
  }
}

// 결과 이모지 가져오기 (서버 사이드에서 데이터 파일 참조)
function getResultEmoji(testType: string, _resultName: string): string {
  // 서버 컴포넌트에서는 데이터 파일 직접 import가 어려우므로
  // 기본 이모지 반환 (클라이언트에서 보완 가능)
  // TODO: 결과명별 이모지 매핑 추가 가능
  const defaultEmojis: Record<string, string> = {
    human: '🧠',
    cat: '🐱',
    dog: '🐕',
    rabbit: '🐰',
    hamster: '🐹',
    idealType: '💕',
    petMatch: '🐾',
    coffee: '☕',
    plant: '🌱',
    conflictStyle: '💬',
    tea: '🍵',
    bread: '🍞',
    fruit: '🍎',
    alcohol: '🍺',
  };

  return defaultEmojis[testType] || '📊';
}
