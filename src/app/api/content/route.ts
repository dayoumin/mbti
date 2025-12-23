/**
 * Content API Route
 *
 * GET /api/content?type=quiz&category=cat - 콘텐츠 목록 조회 (total 포함)
 * GET /api/content?type=quiz&id=cat-quiz-001 - 단일 콘텐츠 조회
 * POST /api/content - 콘텐츠 생성 (관리자 전용)
 * PUT /api/content - 콘텐츠 수정 (관리자 전용)
 * DELETE /api/content?type=quiz&id=xxx - 콘텐츠 삭제 (관리자 전용, soft delete)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { contentService, ContentType, ContentCategory } from '@/services/ContentService';

// 관리자 이메일 목록 (환경변수로 관리, 공백/대소문자 정규화)
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map(email => email.trim().toLowerCase())
  .filter(Boolean);

// 개발/테스트 환경에서 인증 우회 (CONTENT_API_SECRET 설정 시)
const API_SECRET = process.env.CONTENT_API_SECRET;

// 관리자 권한 체크
async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  // API Secret으로 인증 (테스트/자동화용)
  const authHeader = request.headers.get('Authorization');
  if (API_SECRET && authHeader === `Bearer ${API_SECRET}`) {
    return null; // 인증 성공
  }

  // 세션 기반 인증
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: '로그인이 필요합니다' },
      { status: 401 }
    );
  }

  if (!ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
    return NextResponse.json(
      { error: '관리자 권한이 필요합니다' },
      { status: 403 }
    );
  }

  return null; // 인증 성공
}

// 콘텐츠 목록/단일 조회
export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type') as ContentType | null;
    const category = request.nextUrl.searchParams.get('category') as ContentCategory | null;
    const id = request.nextUrl.searchParams.get('id');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50');
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0');

    if (!type) {
      return NextResponse.json(
        { error: 'type is required (quiz, scenario, poll, tournament)' },
        { status: 400 }
      );
    }

    // 단일 조회
    if (id) {
      let content = null;

      switch (type) {
        case 'quiz':
          content = await contentService.getQuizById(id);
          break;
        case 'scenario':
          content = await contentService.getScenarioById(id);
          break;
        case 'poll':
          content = await contentService.getPollById(id);
          break;
        case 'tournament':
          content = await contentService.getTournamentById(id);
          break;
      }

      if (!content) {
        return NextResponse.json(
          { error: 'Content not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ content });
    }

    // 목록 조회
    const options = { category: category || undefined, limit, offset };
    let items = [];
    let total = 0;

    switch (type) {
      case 'quiz':
        items = await contentService.getQuizzes(options);
        total = await contentService.getQuizCount(category || undefined);
        break;
      case 'scenario':
        items = await contentService.getScenarios(options);
        total = await contentService.getScenarioCount(category || undefined);
        break;
      case 'poll':
        items = await contentService.getPolls(options);
        total = await contentService.getPollCount(category || undefined);
        break;
      case 'tournament':
        items = await contentService.getTournaments(options);
        total = await contentService.getTournamentCount(category || undefined);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      type,
      category,
      items,
      count: items.length,
      total,
      hasMore: offset + items.length < total,
    });
  } catch (error) {
    console.error('[Content API] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// 콘텐츠 생성 (관리자 전용)
export async function POST(request: NextRequest) {
  try {
    // 관리자 권한 체크
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'type and data are required' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'quiz':
        result = await contentService.createQuiz(data);
        break;
      case 'scenario':
        result = await contentService.createScenario(data);
        break;
      case 'poll':
        result = await contentService.createPoll(data);
        break;
      case 'tournament':
        result = await contentService.createTournament(data);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid type' },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create content' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      id: result.id,
      message: `${type} created successfully`,
    });
  } catch (error) {
    console.error('[Content API] POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}

// 콘텐츠 수정 (관리자 전용)
export async function PUT(request: NextRequest) {
  try {
    // 관리자 권한 체크
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const body = await request.json();
    const { type, id, data } = body;

    if (!type || !id || !data) {
      return NextResponse.json(
        { error: 'type, id, and data are required' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'quiz':
        result = await contentService.updateQuiz(id, data);
        break;
      case 'scenario':
        result = await contentService.updateScenario(id, data);
        break;
      case 'poll':
        result = await contentService.updatePoll(id, data);
        break;
      case 'tournament':
        result = await contentService.updateTournament(id, data);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid type' },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to update content' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      id: result.id,
      message: `${type} updated successfully`,
    });
  } catch (error) {
    console.error('[Content API] PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

// 콘텐츠 삭제 (관리자 전용, soft delete)
export async function DELETE(request: NextRequest) {
  try {
    // 관리자 권한 체크
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const type = request.nextUrl.searchParams.get('type') as ContentType | null;
    const id = request.nextUrl.searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json(
        { error: 'type and id are required' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'quiz':
        result = await contentService.deleteQuiz(id);
        break;
      case 'scenario':
        result = await contentService.deleteScenario(id);
        break;
      case 'poll':
        result = await contentService.deletePoll(id);
        break;
      case 'tournament':
        result = await contentService.deleteTournament(id);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid type' },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to delete content' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      id: result.id,
      message: `${type} deleted successfully`,
    });
  } catch (error) {
    console.error('[Content API] DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}
