/**
 * Ranking API Route
 *
 * GET /api/ranking?type=results - 테스트 결과 랭킹 조회
 * GET /api/ranking?type=results&testType=human - 특정 테스트의 결과 랭킹
 *
 * 반환 형식:
 * {
 *   rankings: [{ resultName, resultEmoji, testType, count }],
 *   total: number
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/turso';

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type') || 'results';
    const testType = request.nextUrl.searchParams.get('testType');
    const limit = Math.min(parseInt(request.nextUrl.searchParams.get('limit') || '10'), 50);

    if (type === 'results') {
      // 테스트 결과별 집계
      let sql: string;
      let args: unknown[] = [];

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
      }

      const result = await query(sql, args);

      // 총 결과 수
      const countSql = testType
        ? `SELECT COUNT(DISTINCT result_name) as total FROM test_results WHERE test_type = ?`
        : `SELECT COUNT(DISTINCT result_name || '_' || test_type) as total FROM test_results`;
      const countResult = await query(countSql, testType ? [testType] : []);

      const rankings = result.rows.map(row => ({
        resultName: row.result_name as string,
        testType: row.test_type as string,
        count: row.count as number,
        // 이모지는 별도로 가져와야 함 (데이터 파일에서)
        resultEmoji: getResultEmoji(row.test_type as string, row.result_name as string),
      }));

      return NextResponse.json({
        rankings,
        total: (countResult.rows[0]?.total as number) || 0,
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
