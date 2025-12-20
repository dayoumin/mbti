/**
 * localStorage → DB 마이그레이션 API
 *
 * 로그인 시 클라이언트의 localStorage 데이터를 서버 DB로 업로드
 *
 * 보안:
 * - 세션 검증 (로그인 필수)
 * - deviceId 소유 검증 (device_id_mappings에서 user_id 확인)
 * - 입력값 검증 (test_type 화이트리스트, 크기 제한)
 * - DB UPSERT로 중복 방지
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/turso';

// 허용된 test_type 목록 (화이트리스트)
const ALLOWED_TEST_TYPES = [
  'human', 'cat', 'dog', 'rabbit', 'hamster',
  'idealType', 'plant', 'petMatch', 'coffee', 'conflictStyle',
];

// 입력 크기 제한
const MAX_RESULTS_PER_REQUEST = 100;
const MAX_RESULT_KEY_LENGTH = 100;
const MAX_SCORES_SIZE = 1000; // JSON 문자열 길이

interface TestResultData {
  id: string;
  user_id: string;
  project: string;
  test_type: string;
  result_key: string;
  result_emoji: string;
  scores: Record<string, number>;
  is_deep_mode: boolean;
  created_at: string;
  parent_test?: string;
  parent_result?: string;
  meta: {
    user_agent: string;
    screen_width: number;
    timestamp: number;
  };
}

interface MigrateRequest {
  deviceId: string;
  testResults: TestResultData[];
}

interface MigrateResponse {
  success: boolean;
  migratedCount?: number;
  skippedCount?: number;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<MigrateResponse>> {
  try {
    // 1. 세션 검증
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 2. 요청 파싱
    const body = await request.json() as MigrateRequest;
    const { deviceId, testResults } = body;

    if (!deviceId || typeof deviceId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'deviceId가 필요합니다' },
        { status: 400 }
      );
    }

    if (!Array.isArray(testResults)) {
      return NextResponse.json(
        { success: false, error: '잘못된 요청 형식입니다' },
        { status: 400 }
      );
    }

    // 3. deviceId 형식 검증
    if (!deviceId.startsWith('anon_')) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 deviceId 형식입니다' },
        { status: 400 }
      );
    }

    // 4. deviceId 소유권 검증 - 이 사용자에게 매핑된 device_id인지 확인
    const mapping = await query(
      'SELECT user_id FROM device_id_mappings WHERE device_id = ?',
      [deviceId]
    );

    if (mapping.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: '등록되지 않은 기기입니다. 먼저 병합을 진행해주세요.' },
        { status: 403 }
      );
    }

    const mappedUserId = mapping.rows[0].user_id;
    if (mappedUserId && mappedUserId !== userId) {
      return NextResponse.json(
        { success: false, error: '이 기기에 대한 권한이 없습니다' },
        { status: 403 }
      );
    }

    // 5. 빈 배열이면 성공 반환
    if (testResults.length === 0) {
      return NextResponse.json({
        success: true,
        migratedCount: 0,
        skippedCount: 0,
      });
    }

    // 6. 요청 크기 제한
    if (testResults.length > MAX_RESULTS_PER_REQUEST) {
      return NextResponse.json(
        { success: false, error: `한 번에 ${MAX_RESULTS_PER_REQUEST}개까지만 마이그레이션 가능합니다` },
        { status: 400 }
      );
    }

    let migratedCount = 0;
    let skippedCount = 0;

    // 7. 각 테스트 결과 검증 및 저장
    for (const result of testResults) {
      try {
        // 7-1. test_type 화이트리스트 검증
        if (!result.test_type || !ALLOWED_TEST_TYPES.includes(result.test_type)) {
          skippedCount++;
          continue;
        }

        // 7-2. result_key 길이 검증
        if (!result.result_key || result.result_key.length > MAX_RESULT_KEY_LENGTH) {
          skippedCount++;
          continue;
        }

        // 7-3. scores 크기 검증
        const scoresJson = JSON.stringify(result.scores || {});
        if (scoresJson.length > MAX_SCORES_SIZE) {
          skippedCount++;
          continue;
        }

        // 7-4. created_at 형식 검증 (ISO 8601)
        const createdAt = new Date(result.created_at);
        if (isNaN(createdAt.getTime())) {
          skippedCount++;
          continue;
        }

        // 7-5. 미래 날짜 방지 (1시간 여유)
        if (createdAt.getTime() > Date.now() + 3600000) {
          skippedCount++;
          continue;
        }

        // 7-6. UPSERT (INSERT OR IGNORE) - 중복 시 무시
        const insertResult = await query(
          `INSERT OR IGNORE INTO test_results
           (device_id, user_id, test_type, result_name, scores, parent_info, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            deviceId,
            userId,
            result.test_type,
            result.result_key,
            scoresJson,
            result.parent_test ? JSON.stringify({
              parentTest: result.parent_test,
              parentResult: result.parent_result,
            }) : null,
            result.created_at,
          ]
        );

        // 실제 삽입된 경우만 카운트 (중복 시 rowsAffected = 0)
        if (insertResult.rowsAffected > 0) {
          migratedCount++;
        } else {
          skippedCount++; // 중복으로 스킵됨
        }
      } catch (err) {
        console.warn(`[Migrate API] 레코드 저장 실패:`, err);
        skippedCount++;
      }
    }

    console.log(`[Migrate API] 완료: userId=${userId}, migrated=${migratedCount}, skipped=${skippedCount}`);

    return NextResponse.json({
      success: true,
      migratedCount,
      skippedCount,
    });

  } catch (error) {
    console.error('[Migrate API] 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
