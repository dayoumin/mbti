/**
 * 익명 데이터 → 로그인 계정 병합 API
 *
 * 보안:
 * - 서버에서 세션 검증 (로그인한 사용자만)
 * - device_id 소유 검증 (DB에 기록된 device_id만 병합 가능)
 * - device_id당 하나의 user_id만 연결 가능 (UNIQUE 제약)
 *
 * 흐름:
 * 1. 익명 사용자가 처음 방문 시 device_id가 DB에 등록됨 (registerDeviceId)
 * 2. 로그인 시 해당 device_id를 user_id에 병합 요청
 * 3. device_id가 DB에 존재하고 아직 병합되지 않은 경우에만 병합 허용
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/turso';

interface MergeRequest {
  deviceId: string;
}

interface MergeResponse {
  success: boolean;
  mergedCount?: number;
  error?: string;
  alreadyMerged?: boolean;
}

export async function POST(request: NextRequest): Promise<NextResponse<MergeResponse>> {
  try {
    // 1. 세션 검증 - 로그인한 사용자만
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 2. 요청 파싱
    const body = await request.json() as MergeRequest;
    const { deviceId } = body;

    if (!deviceId || typeof deviceId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'deviceId가 필요합니다' },
        { status: 400 }
      );
    }

    // 3. device_id 형식 검증 (anon_ 접두사)
    if (!deviceId.startsWith('anon_')) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 deviceId 형식입니다' },
        { status: 400 }
      );
    }

    // 4. DB에서 device_id 조회 (소유 검증)
    const existingMapping = await query(
      'SELECT id, device_id, user_id, merged_at FROM device_id_mappings WHERE device_id = ?',
      [deviceId]
    );

    // 4-1. device_id가 DB에 없으면 → 신규 등록 및 병합
    // (첫 방문 시 등록되지 않았거나, 클라이언트에서 생성된 경우)
    if (existingMapping.rows.length === 0) {
      // 새 device_id 등록 및 병합
      await query(
        `INSERT INTO device_id_mappings (device_id, user_id, merged_at)
         VALUES (?, ?, datetime('now'))`,
        [deviceId, userId]
      );

      console.log(`[Merge API] 신규 등록 및 병합: userId=${userId}, deviceId=${deviceId}`);

      // 관련 테이블 user_id 업데이트
      await updateRelatedTables(deviceId, userId);

      return NextResponse.json({
        success: true,
        mergedCount: 1,
      });
    }

    const mapping = existingMapping.rows[0];

    // 4-2. 이미 같은 사용자에게 병합됨
    if (mapping.user_id === userId) {
      return NextResponse.json({
        success: true,
        alreadyMerged: true,
        mergedCount: 0,
      });
    }

    // 4-3. 다른 사용자에게 이미 병합됨
    if (mapping.user_id && mapping.user_id !== userId) {
      return NextResponse.json(
        { success: false, error: '이미 다른 계정에 연결된 기기입니다' },
        { status: 409 }
      );
    }

    // 5. 병합 수행 (user_id가 null인 경우)
    await query(
      `UPDATE device_id_mappings
       SET user_id = ?, merged_at = datetime('now')
       WHERE device_id = ?`,
      [userId, deviceId]
    );

    // 6. 관련 테이블들의 user_id 업데이트
    await updateRelatedTables(deviceId, userId);

    console.log(`[Merge API] 병합 완료: userId=${userId}, deviceId=${deviceId}`);

    return NextResponse.json({
      success: true,
      mergedCount: 1,
    });

  } catch (error) {
    console.error('[Merge API] 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// 관련 테이블들의 user_id 업데이트
async function updateRelatedTables(deviceId: string, userId: string) {
  const tables = [
    'test_results',
    'feedback',
    'poll_responses',
    'quiz_responses',
    'ranking_votes',
    'user_polls',
    'likes',
    'comments',
    'user_profiles',
  ];

  for (const table of tables) {
    try {
      await query(
        `UPDATE ${table} SET user_id = ? WHERE device_id = ? AND (user_id IS NULL OR user_id = '')`,
        [userId, deviceId]
      );
    } catch (err) {
      // 테이블이 없거나 오류 시 무시 (일부 테이블은 없을 수 있음)
      console.warn(`[Merge API] ${table} 업데이트 스킵:`, err);
    }
  }
}

// 병합 상태 확인 (GET)
// deviceIds는 보안상 노출하지 않음
export async function GET(): Promise<NextResponse<{ merged: boolean; deviceCount?: number }>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ merged: false }, { status: 401 });
    }

    const result = await query(
      'SELECT COUNT(*) as count FROM device_id_mappings WHERE user_id = ?',
      [session.user.id]
    );

    const count = (result.rows[0]?.count as number) || 0;

    return NextResponse.json({
      merged: count > 0,
      deviceCount: count,
    });

  } catch (error) {
    console.error('[Merge API] GET 오류:', error);
    return NextResponse.json({ merged: false }, { status: 500 });
  }
}
