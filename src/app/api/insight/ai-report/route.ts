import { NextRequest, NextResponse } from 'next/server';
import {
  generateAIReport,
  generateFallbackReport,
  type AIAnalysisInput,
} from '@/data/insight/stage7-ai-analysis';

/**
 * POST /api/insight/ai-report
 *
 * Stage 7 AI 종합 분석 API
 * - OpenAI API 키를 서버에서만 사용 (클라이언트 노출 방지)
 * - CORS 문제 해결 (서버 프록시)
 * - API 키 없으면 자동으로 폴백 리포트 사용
 */
export async function POST(req: NextRequest) {
  let input: AIAnalysisInput | undefined;

  try {
    // 요청 본문 파싱
    input = await req.json();

    // 입력 검증
    if (!input || !input.activitySummary || !input.insights) {
      return NextResponse.json(
        { error: 'Invalid input: activitySummary and insights required' },
        { status: 400 }
      );
    }

    // AI 리포트 생성 (서버에서만 API 키 접근)
    // process.env.OPENAI_API_KEY 사용 (NEXT_PUBLIC_ 제거)
    const result = await generateAIReport(input);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] /api/insight/ai-report error:', error);

    // 에러 발생 시 폴백 리포트 반환 (입력이 유효한 경우에만)
    if (input?.activitySummary && input?.insights) {
      const fallbackResult = generateFallbackReport(input);
      return NextResponse.json(fallbackResult);
    }

    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
