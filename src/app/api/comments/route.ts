/**
 * Comments API Route
 *
 * POST /api/comments - 댓글 작성
 * GET /api/comments?targetType=poll&targetId=xxx - 댓글 조회
 * DELETE /api/comments - 댓글 삭제 (본인만 가능)
 *
 * targetType 종류:
 * - poll: 투표
 * - quiz: 퀴즈
 * - test_result: 테스트 결과 (testType_resultName 형태)
 * - ranking: 랭킹
 *
 * 보안:
 * - deviceId는 응답에서 해시화하여 노출 (타인이 수집해도 악용 불가)
 * - 본인 확인용으로만 사용 (isOwner 플래그)
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/turso';

/**
 * deviceId를 익명 표시용 해시로 변환
 * - 원본 deviceId 노출 방지
 * - 같은 deviceId는 같은 해시 (일관된 표시)
 */
function hashDeviceId(deviceId: string): string {
  // 간단한 해시 (보안용이 아닌 익명화용)
  let hash = 0;
  for (let i = 0; i < deviceId.length; i++) {
    const char = deviceId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit 정수로 변환
  }
  // 양수로 변환 후 16진수 6자리
  return Math.abs(hash).toString(16).slice(0, 6).padStart(6, '0');
}

// 댓글 작성
export async function POST(request: NextRequest) {
  try {
    const { deviceId, targetType, targetId, content, parentId } = await request.json();

    if (!deviceId || !targetType || !targetId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: deviceId, targetType, targetId, content' },
        { status: 400 }
      );
    }

    // 공백만 있는 댓글 방지
    const trimmedContent = content.trim();
    if (trimmedContent.length === 0) {
      return NextResponse.json(
        { error: 'Comment cannot be empty' },
        { status: 400 }
      );
    }

    // 댓글 길이 제한
    if (trimmedContent.length > 500) {
      return NextResponse.json(
        { error: 'Comment too long (max 500 characters)' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO comments (device_id, target_type, target_id, content, parent_id)
       VALUES (?, ?, ?, ?, ?)`,
      [deviceId, targetType, targetId, trimmedContent, parentId || null]
    );

    return NextResponse.json({
      success: true,
      id: Number(result.lastInsertRowid)
    });
  } catch (error) {
    console.error('[Comments API] Save error:', error);
    return NextResponse.json(
      { error: 'Failed to save comment' },
      { status: 500 }
    );
  }
}

// 댓글 조회
export async function GET(request: NextRequest) {
  try {
    const targetType = request.nextUrl.searchParams.get('targetType');
    const targetId = request.nextUrl.searchParams.get('targetId');
    const currentDeviceId = request.nextUrl.searchParams.get('deviceId'); // 본인 확인용
    // limit 상한 100, 기본 20
    const rawLimit = parseInt(request.nextUrl.searchParams.get('limit') || '20');
    const limit = Math.min(Math.max(rawLimit, 1), 100);
    const offset = Math.max(parseInt(request.nextUrl.searchParams.get('offset') || '0'), 0);

    if (!targetType || !targetId) {
      return NextResponse.json(
        { error: 'targetType and targetId are required' },
        { status: 400 }
      );
    }

    // 댓글 조회 (최신순)
    const result = await query(
      `SELECT id, device_id, content, likes, parent_id, created_at
       FROM comments
       WHERE target_type = ? AND target_id = ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [targetType, targetId, limit, offset]
    );

    // 총 댓글 수
    const countResult = await query(
      `SELECT COUNT(*) as total FROM comments WHERE target_type = ? AND target_id = ?`,
      [targetType, targetId]
    );

    const total = (countResult.rows[0]?.total as number) || 0;
    const comments = result.rows.map(row => {
      const rawDeviceId = row.device_id as string;
      return {
        id: row.id,
        // deviceId 대신 해시화된 authorId 반환 (익명 표시용)
        authorId: hashDeviceId(rawDeviceId),
        content: row.content,
        likes: row.likes || 0,
        parentId: row.parent_id,
        createdAt: row.created_at,
        // 본인 댓글인지 여부 (삭제 버튼 표시용)
        isOwner: currentDeviceId ? rawDeviceId === currentDeviceId : false,
      };
    });

    // hasMore: 현재 위치 + 가져온 개수 < 전체 개수
    return NextResponse.json({
      comments,
      total,
      hasMore: offset + comments.length < total,
    });
  } catch (error) {
    console.error('[Comments API] Get error:', error);
    return NextResponse.json(
      { error: 'Failed to get comments' },
      { status: 500 }
    );
  }
}

// 댓글 삭제 (본인만 가능)
export async function DELETE(request: NextRequest) {
  try {
    const { deviceId, commentId } = await request.json();

    if (!deviceId || !commentId) {
      return NextResponse.json(
        { error: 'Missing required fields: deviceId, commentId' },
        { status: 400 }
      );
    }

    // 본인 댓글인지 확인 후 삭제 (1 쿼리로 처리)
    const result = await query(
      `DELETE FROM comments WHERE id = ? AND device_id = ?`,
      [commentId, deviceId]
    );

    if (result.rowsAffected === 0) {
      // 삭제된 행이 없음 = 본인 댓글이 아니거나 존재하지 않음
      return NextResponse.json(
        { error: 'Comment not found or not authorized' },
        { status: 404 }
      );
    }

    // 대댓글도 삭제 (부모 댓글 삭제 시)
    await query(
      `DELETE FROM comments WHERE parent_id = ?`,
      [commentId]
    );

    // 해당 댓글의 좋아요도 삭제
    await query(
      `DELETE FROM likes WHERE target_type = 'comment' AND target_id = ?`,
      [commentId.toString()]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Comments API] Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
