/**
 * Test Results API Route
 *
 * POST /api/test-results - 테스트 결과 저장
 * GET /api/test-results?deviceId=xxx - 내 결과 조회
 * GET /api/test-results?type=distribution&testType=ramen - 결과 분포 조회
 * GET /api/test-results?type=distribution&testType=ramen&ageGroup=20s - 연령대별 분포
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/turso';

const VALID_AGE_GROUPS = ['10s', '20s', '30s', '40s+'] as const;
const VALID_GENDERS = ['male', 'female', 'other'] as const;

// POST: 테스트 결과 저장
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      deviceId,
      testType,
      resultName,
      resultEmoji,
      scores,
      isDeepMode,
      parentInfo, // { testType: string, resultName: string }
      timestamp: clientTimestamp, // 클라이언트에서 전달한 타임스탬프 (일관성 보장)
    } = body;

    if (!deviceId || !testType || !resultName) {
      return NextResponse.json(
        { error: 'deviceId, testType, resultName are required' },
        { status: 400 }
      );
    }

    // 클라이언트 타임스탬프 검증 및 사용
    // ISO 8601 형식만 허용 (localStorage와 동기화)
    let timestamp: string;
    if (clientTimestamp && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(clientTimestamp)) {
      timestamp = clientTimestamp;
    } else {
      timestamp = new Date().toISOString();
    }

    // 저장 시도
    try {
      const result = await query(
        `INSERT INTO test_results (device_id, test_type, result_name, scores, parent_info, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          deviceId,
          testType,
          resultName,
          JSON.stringify({ emoji: resultEmoji, scores, isDeepMode }),
          parentInfo ? JSON.stringify(parentInfo) : null,
          timestamp,
        ]
      );

      return NextResponse.json({
        success: true,
        id: result.lastInsertRowid?.toString(),
      });
    } catch (insertError: unknown) {
      // UNIQUE 충돌 시 중복으로 처리 (정상 응답)
      const errorMessage = insertError instanceof Error ? insertError.message : String(insertError);
      if (errorMessage.includes('UNIQUE constraint')) {
        return NextResponse.json({
          success: true,
          duplicate: true,
        });
      }
      throw insertError; // 다른 에러는 상위로 전파
    }
  } catch (error) {
    console.error('[Test Results API] POST error:', error);
    return NextResponse.json({ error: 'Failed to save result' }, { status: 500 });
  }
}

// GET: 결과 조회
export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type') || 'my-results';
    const deviceId = request.nextUrl.searchParams.get('deviceId');
    const testType = request.nextUrl.searchParams.get('testType');
    const ageGroup = request.nextUrl.searchParams.get('ageGroup');
    const gender = request.nextUrl.searchParams.get('gender');

    // 내 결과 조회
    if (type === 'my-results') {
      if (!deviceId) {
        return NextResponse.json({ error: 'deviceId required' }, { status: 400 });
      }

      const results = await query(
        `SELECT id, device_id, test_type, result_name, scores, parent_info, created_at
         FROM test_results
         WHERE device_id = ?
         ORDER BY created_at DESC`,
        [deviceId]
      );

      const parsed = results.rows.map(row => {
        let scoresData = { emoji: '', scores: {}, isDeepMode: false };
        let parentData = null;

        try {
          if (row.scores) scoresData = JSON.parse(row.scores as string);
          if (row.parent_info) parentData = JSON.parse(row.parent_info as string);
        } catch {
          // 파싱 실패 시 기본값 사용
        }

        return {
          id: row.id,
          testType: row.test_type,
          resultKey: row.result_name,
          resultEmoji: scoresData.emoji || '',
          scores: scoresData.scores || {},
          isDeepMode: scoresData.isDeepMode || false,
          parentTest: parentData?.testType,
          parentResult: parentData?.resultName,
          createdAt: row.created_at,
        };
      });

      return NextResponse.json({ results: parsed });
    }

    // 결과 분포 조회
    if (type === 'distribution') {
      if (!testType) {
        return NextResponse.json({ error: 'testType required' }, { status: 400 });
      }

      const hasAgeFilter = ageGroup && VALID_AGE_GROUPS.includes(ageGroup as typeof VALID_AGE_GROUPS[number]);
      const hasGenderFilter = gender && VALID_GENDERS.includes(gender as typeof VALID_GENDERS[number]);

      let sql: string;
      let args: unknown[] = [testType];

      if (hasAgeFilter || hasGenderFilter) {
        // 연령/성별 필터 적용
        const conditions: string[] = ['tr.test_type = ?'];
        if (hasAgeFilter) {
          conditions.push('ud.age_group = ?');
          args.push(ageGroup);
        }
        if (hasGenderFilter) {
          conditions.push('ud.gender = ?');
          args.push(gender);
        }

        sql = `
          SELECT
            tr.result_name,
            COUNT(*) as count
          FROM test_results tr
          INNER JOIN user_demographics ud ON tr.device_id = ud.device_id
          WHERE ${conditions.join(' AND ')}
          GROUP BY tr.result_name
          ORDER BY count DESC
        `;
      } else {
        // 전체 분포
        sql = `
          SELECT
            result_name,
            COUNT(*) as count
          FROM test_results
          WHERE test_type = ?
          GROUP BY result_name
          ORDER BY count DESC
        `;
      }

      let results;
      let appliedFilter = { ageGroup: 'all', gender: 'all' };

      try {
        results = await query(sql, args);
        appliedFilter = {
          ageGroup: hasAgeFilter ? (ageGroup as string) : 'all',
          gender: hasGenderFilter ? (gender as string) : 'all',
        };
      } catch (queryError) {
        // 필터 JOIN 실패 시 무필터 쿼리로 폴백
        console.warn('[Test Results API] Filtered query failed, falling back to unfiltered:', queryError);

        try {
          const fallbackSql = `
            SELECT result_name, COUNT(*) as count
            FROM test_results
            WHERE test_type = ?
            GROUP BY result_name
            ORDER BY count DESC
          `;
          results = await query(fallbackSql, [testType]);
          appliedFilter = { ageGroup: 'all', gender: 'all' };
        } catch (fallbackError) {
          // 폴백도 실패 시 빈 결과 반환
          console.error('[Test Results API] Fallback query also failed:', fallbackError);
          return NextResponse.json({
            testType,
            total: 0,
            distribution: [],
            filter: { ageGroup: 'all', gender: 'all' },
            error: 'query_failed',
          });
        }
      }

      // 총 수 계산
      const total = results.rows.reduce((sum, row) => sum + (row.count as number), 0);

      const distribution = results.rows.map((row, index) => ({
        rank: index + 1,
        resultName: row.result_name as string,
        count: row.count as number,
        percentage: total > 0 ? Math.round(((row.count as number) / total) * 100) : 0,
      }));

      return NextResponse.json({
        testType,
        total,
        distribution,
        filter: appliedFilter,
      });
    }

    // 내 결과 순위 조회 (특정 테스트에서 내 결과가 몇 위인지)
    if (type === 'my-rank') {
      if (!deviceId || !testType) {
        return NextResponse.json({ error: 'deviceId and testType required' }, { status: 400 });
      }

      // 내 최신 결과 가져오기
      const myResult = await query(
        `SELECT result_name FROM test_results
         WHERE device_id = ? AND test_type = ?
         ORDER BY created_at DESC
         LIMIT 1`,
        [deviceId, testType]
      );

      if (myResult.rows.length === 0) {
        return NextResponse.json({ hasResult: false });
      }

      const myResultName = myResult.rows[0].result_name as string;

      // 전체 분포에서 내 순위 계산
      const distribution = await query(
        `SELECT result_name, COUNT(*) as count
         FROM test_results
         WHERE test_type = ?
         GROUP BY result_name
         ORDER BY count DESC`,
        [testType]
      );

      const total = distribution.rows.reduce((sum, row) => sum + (row.count as number), 0);
      let rank = 0;
      let myCount = 0;
      let myPercentage = 0;

      distribution.rows.forEach((row, idx) => {
        if (row.result_name === myResultName) {
          rank = idx + 1;
          myCount = row.count as number;
          myPercentage = total > 0 ? Math.round((myCount / total) * 100) : 0;
        }
      });

      return NextResponse.json({
        hasResult: true,
        testType,
        resultName: myResultName,
        rank,
        totalResults: distribution.rows.length,
        count: myCount,
        percentage: myPercentage,
        total,
      });
    }

    // 전체 테스트 분포 현황 (대시보드용)
    // 대상: test_results 테이블의 모든 테스트 (personality + matching)
    // 제외: 찬반 투표 (ranking_votes 테이블에 별도 저장)
    if (type === 'all-distributions') {
      const results = await query(
        `SELECT
           test_type,
           result_name,
           COUNT(*) as count
         FROM test_results
         GROUP BY test_type, result_name
         ORDER BY test_type, count DESC`
      );

      // 테스트별로 그룹화
      const byTest: Record<string, { resultName: string; count: number }[]> = {};
      results.rows.forEach(row => {
        const testType = row.test_type as string;
        if (!byTest[testType]) byTest[testType] = [];
        byTest[testType].push({
          resultName: row.result_name as string,
          count: row.count as number,
        });
      });

      // 이상 감지 (skew detection)
      const SKEW_HIGH_THRESHOLD = 40; // 40% 이상이면 쏠림
      const SKEW_LOW_THRESHOLD = 1;   // 1% 미만이면 도달 안됨

      const distributions = Object.entries(byTest).map(([testType, items]) => {
        const total = items.reduce((sum, item) => sum + item.count, 0);

        const distribution = items.map((item, idx) => {
          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return {
            rank: idx + 1,
            resultName: item.resultName,
            count: item.count,
            percentage,
          };
        });

        // 이상 감지
        const alerts: { type: 'high' | 'low' | 'zero'; resultName: string; percentage: number }[] = [];
        distribution.forEach(d => {
          if (d.percentage >= SKEW_HIGH_THRESHOLD) {
            alerts.push({ type: 'high', resultName: d.resultName, percentage: d.percentage });
          }
          if (d.percentage > 0 && d.percentage < SKEW_LOW_THRESHOLD) {
            alerts.push({ type: 'low', resultName: d.resultName, percentage: d.percentage });
          }
        });

        return {
          testType,
          total,
          resultCount: distribution.length,
          distribution,
          alerts,
          hasAlerts: alerts.length > 0,
        };
      });

      // 알림 있는 테스트 먼저
      distributions.sort((a, b) => {
        if (a.hasAlerts && !b.hasAlerts) return -1;
        if (!a.hasAlerts && b.hasAlerts) return 1;
        return b.total - a.total;
      });

      const totalAlerts = distributions.reduce((sum, d) => sum + d.alerts.length, 0);

      return NextResponse.json({
        totalTests: distributions.length,
        totalAlerts,
        distributions,
      });
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error) {
    console.error('[Test Results API] GET error:', error);
    return NextResponse.json({ error: 'Failed to get results' }, { status: 500 });
  }
}
