/**
 * Ranking API Route
 *
 * GET /api/ranking?type=results - 테스트 결과 랭킹 조회
 * GET /api/ranking?type=results&testType=human - 특정 테스트의 결과 랭킹
 * GET /api/ranking?type=results&testType=coffee&ageGroup=20s - 연령대별 랭킹
 * GET /api/ranking?type=by-age&testType=coffee - 연령대별 TOP 5 비교
 * GET /api/ranking?type=popular-tests - 테스트별 참여 수 인기순
 * GET /api/ranking?type=popular-tests&ageGroup=20s&gender=female - 연령/성별별 인기 테스트
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
const VALID_GENDERS = ['male', 'female', 'other'] as const;

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type') || 'results';
    const testType = request.nextUrl.searchParams.get('testType');
    const ageGroup = request.nextUrl.searchParams.get('ageGroup');
    const gender = request.nextUrl.searchParams.get('gender');
    const limitParam = request.nextUrl.searchParams.get('limit');
    const parsedLimit = limitParam ? parseInt(limitParam) : 10;
    const limit = Number.isNaN(parsedLimit) ? 10 : Math.min(Math.max(parsedLimit, 1), 50);

    // 테스트별 인기순 (참여 수 기반)
    // - 필터 없음: 전체 사용자 대상 인기순
    // - 필터 있음: 해당 연령/성별 그룹 대상 인기순 (demographics 없는 사용자 제외)
    if (type === 'popular-tests') {
      let sql: string;
      let args: unknown[] = [];

      const hasAgeFilter = ageGroup && VALID_AGE_GROUPS.includes(ageGroup as typeof VALID_AGE_GROUPS[number]);
      const hasGenderFilter = gender && VALID_GENDERS.includes(gender as typeof VALID_GENDERS[number]);

      if (hasAgeFilter || hasGenderFilter) {
        // 연령대/성별 필터가 있는 경우 - 해당 그룹만 집계
        // INNER JOIN 사용 (필터 조건에 맞는 사용자만 대상)
        const conditions: string[] = [];
        if (hasAgeFilter) conditions.push('ud.age_group = ?');
        if (hasGenderFilter) conditions.push('ud.gender = ?');

        sql = `
          SELECT
            tr.test_type,
            COUNT(*) as count
          FROM test_results tr
          INNER JOIN user_demographics ud ON tr.device_id = ud.device_id
          WHERE ${conditions.join(' AND ')}
          GROUP BY tr.test_type
          ORDER BY count DESC
          LIMIT ?
        `;
        args = [];
        if (hasAgeFilter) args.push(ageGroup);
        if (hasGenderFilter) args.push(gender);
        args.push(limit);
      } else {
        // 전체 인기순 - demographics 여부와 무관하게 모든 사용자 포함
        sql = `
          SELECT
            test_type,
            COUNT(*) as count
          FROM test_results
          GROUP BY test_type
          ORDER BY count DESC
          LIMIT ?
        `;
        args = [limit];
      }

      const result = await query(sql, args);

      const popularTests = result.rows.map(row => ({
        testType: row.test_type as string,
        count: row.count as number,
        emoji: getTestEmoji(row.test_type as string),
      }));

      return NextResponse.json({
        popularTests,
        ageGroup: hasAgeFilter ? ageGroup : 'all',
        gender: hasGenderFilter ? gender : 'all',
      });
    }

    // 연령대별 TOP 비교 (모든 연령대의 TOP N 반환)
    // 단일 쿼리로 모든 연령대 데이터 조회 (N+1 문제 해결)
    if (type === 'by-age') {
      if (!testType) {
        return NextResponse.json({ error: 'testType required for by-age' }, { status: 400 });
      }

      // 1. 연령대별 결과 집계 (단일 쿼리)
      const allResults = await query(`
        SELECT
          ud.age_group,
          tr.result_name,
          COUNT(*) as count
        FROM test_results tr
        INNER JOIN user_demographics ud ON tr.device_id = ud.device_id
        WHERE tr.test_type = ?
        GROUP BY ud.age_group, tr.result_name
        ORDER BY ud.age_group, count DESC
      `, [testType]);

      // 2. 연령대별 총 수 집계 (단일 쿼리)
      const totalsResult = await query(`
        SELECT
          ud.age_group,
          COUNT(*) as total
        FROM test_results tr
        INNER JOIN user_demographics ud ON tr.device_id = ud.device_id
        WHERE tr.test_type = ?
        GROUP BY ud.age_group
      `, [testType]);

      // 총 수 맵 생성
      const totalsByAge = new Map<string, number>();
      for (const row of totalsResult.rows) {
        totalsByAge.set(row.age_group as string, row.total as number);
      }

      // 3. 연령대별로 그룹핑하고 TOP 5 추출
      const ageStats: Record<string, Array<{ resultName: string; count: number; percentage: number }>> = {};

      // 빈 연령대 초기화
      for (const age of VALID_AGE_GROUPS) {
        ageStats[age] = [];
      }

      // 결과 그룹핑
      for (const row of allResults.rows) {
        const age = row.age_group as string;
        if (!VALID_AGE_GROUPS.includes(age as typeof VALID_AGE_GROUPS[number])) continue;

        // TOP 5까지만 추가
        if (ageStats[age].length >= 5) continue;

        const total = totalsByAge.get(age) || 0;
        ageStats[age].push({
          resultName: row.result_name as string,
          count: row.count as number,
          percentage: total > 0 ? Math.round(((row.count as number) / total) * 100) : 0,
        });
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

      const hasAgeFilter = ageGroup && VALID_AGE_GROUPS.includes(ageGroup as typeof VALID_AGE_GROUPS[number]);
      return NextResponse.json({
        rankings,
        total,
        ageGroup: hasAgeFilter ? ageGroup : 'all',
        testType: testType || 'all',
      });
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error) {
    console.error('[Ranking API] Error:', error);
    return NextResponse.json({ error: 'Failed to get rankings' }, { status: 500 });
  }
}

// 테스트 타입별 이모지
const TEST_EMOJIS: Record<string, string> = {
  human: '👤',
  cat: '🐱',
  dog: '🐶',
  rabbit: '🐰',
  hamster: '🐹',
  idealType: '💘',
  petMatch: '🐾',
  coffee: '☕',
  plant: '🌱',
  conflictStyle: '💬',
  tea: '🍵',
  bread: '🍞',
  fruit: '🍎',
  alcohol: '🍺',
  perfume: '🌸',
  aroma: '🕯️',
};

// 테스트 타입 이모지 가져오기
function getTestEmoji(testType: string): string {
  return TEST_EMOJIS[testType] || '📊';
}

// 결과 이모지 가져오기 (서버 사이드에서 데이터 파일 참조)
function getResultEmoji(testType: string, _resultName: string): string {
  return TEST_EMOJIS[testType] || '📊';
}
