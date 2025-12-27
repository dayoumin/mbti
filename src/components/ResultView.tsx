'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * 개선된 결과 화면 컴포넌트
 * - 타입명 최우선 표시
 * - 핵심 특성 3줄 요약
 * - 상세 분석 접기/펼치기
 */
export default function ResultView({
  result,
  testTitle,
  IconComponent,
  dimensions,
  scores,
  children,
}: {
  result: {
    name: string;
    emoji: string;
    desc: string;
    mood?: string;
    interpretation?: string;
    guide?: string;
  };
  testTitle: string;
  IconComponent: React.ComponentType<{ mood?: string; className?: string }>;
  dimensions?: Record<string, { name: string; emoji: string; desc: string }>;
  scores?: Record<string, number>;
  children?: React.ReactNode;
}) {
  const [showDetails, setShowDetails] = useState(false);

  // 핵심 특성 3줄 추출 (interpretation이나 guide에서)
  const coreTraits = extractCoreTraits(result);

  return (
    <div className="w-full">
      {/* 타입명 + 이모지 최상단 강조 */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-3">{result.emoji}</div>
        <h1 className="text-3xl font-black text-slate-800 leading-tight mb-2">
          {result.name}
        </h1>
        <p className="text-sm text-slate-500">{testTitle}</p>
      </div>

      {/* 한 줄 요약 */}
      <div className="w-full bg-gradient-to-br from-white to-slate-50 rounded-2xl p-5 border-2 border-indigo-100 shadow-lg mb-4">
        <p className="text-slate-700 font-semibold text-sm leading-relaxed break-keep text-center">
          &quot;{result.desc}&quot;
        </p>
      </div>

      {/* 핵심 특성 3줄 */}
      {coreTraits.length > 0 && (
        <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-200 mb-4">
          <h3 className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-1">
            ✨ 핵심 특성
          </h3>
          <ul className="space-y-2">
            {coreTraits.map((trait, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-indigo-500 mt-0.5">•</span>
                <span>{trait}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 상세 분석 접기/펼치기 */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors mb-4"
      >
        {showDetails ? (
          <>
            <ChevronUp className="w-4 h-4" />
            상세 분석 숨기기
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            상세 분석 보기
          </>
        )}
      </button>

      {/* 상세 분석 (접혀진 상태) */}
      {showDetails && (
        <div className="space-y-3 animate-fade-in">
          {/* 아이콘 */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200/50 to-pink-200/50 blur-2xl rounded-full scale-150"></div>
              <IconComponent mood={result.mood || 'happy'} className="w-24 h-24 relative z-10 drop-shadow-xl" />
            </div>
          </div>

          {/* 차원별 점수 (있으면) */}
          {dimensions && scores && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h3 className="text-xs font-bold text-slate-500 mb-3">📊 차원별 분석</h3>
              <div className="space-y-3">
                {Object.entries(dimensions).map(([key, dim]) => {
                  const score = scores[key] || 0;
                  const percentage = Math.round((score / 5) * 100);
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-600">
                          {dim.emoji} {dim.name}
                        </span>
                        <span className="text-xs font-bold text-indigo-600">{percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 나머지 콘텐츠 (children으로 전달) */}
          {children}
        </div>
      )}
    </div>
  );
}

// 핵심 특성 추출 헬퍼 함수
function extractCoreTraits(result: { interpretation?: string; guide?: string }): string[] {
  const text = result.interpretation || result.guide || '';

  // 간단한 휴리스틱: 문장을 나누고 3개 선택
  const sentences = text
    .split(/[.!?]\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 10 && s.length <= 100); // 10자 이상, 100자 이하

  return sentences.slice(0, 3);
}
