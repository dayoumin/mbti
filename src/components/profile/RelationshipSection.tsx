'use client';

import { useState, useEffect } from 'react';
import { Heart, Users, MessageCircle, Share2 } from 'lucide-react';
import { insightService } from '@/services/InsightService';
import type { MyProfileData } from '@/services/ProfileService';
import type { RelationshipPatternResult } from '@/data/insight/stage5-relationship-pattern';

// ============================================================================
// 타입
// ============================================================================

interface RelationshipSectionProps {
  profile: MyProfileData;
  onStartTest?: (testKey: string) => void;
}

// ============================================================================
// 관계 테스트 목록
// ============================================================================

const RELATIONSHIP_TESTS = [
  { key: 'idealType', label: '이상형', emoji: '💕', description: '나의 연애 이상형' },
  { key: 'conflictStyle', label: '갈등 대처', emoji: '💬', description: '갈등 시 나의 스타일' },
  { key: 'attachment', label: '애착 유형', emoji: '🤗', description: '관계에서의 애착 방식' },
];

// ============================================================================
// RelationshipSection 컴포넌트
// ============================================================================

export default function RelationshipSection({ profile, onStartTest }: RelationshipSectionProps) {
  const [stage5Result, setStage5Result] = useState<RelationshipPatternResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Stage 5 결과 로드
  useEffect(() => {
    try {
      // getStage5Insight는 동기 메서드
      const result = insightService.getStage5Insight();
      setStage5Result(result);
    } catch (error) {
      console.error('Failed to load stage 5 result:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 궁합 테스트 결과
  const relationshipResults = {
    idealType: profile.relationship?.idealType,
    conflictStyle: profile.relationship?.conflictStyle,
  };

  const hasAnyResult = relationshipResults.idealType || relationshipResults.conflictStyle || stage5Result;

  if (loading) {
    return (
      <section className="bg-white rounded-2xl p-4 md:p-6">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-32 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-gray-200 rounded-xl" />
            <div className="h-32 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl p-4 md:p-6">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-pink-500" />
        <h2 className="font-bold text-gray-900">관계 속 나</h2>
      </div>

      {!hasAnyResult ? (
        // 결과 없음 - 테스트 추천
        <div className="text-center py-6">
          <div className="w-16 h-16 mx-auto mb-3 bg-pink-50 rounded-full flex items-center justify-center">
            <span className="text-3xl">💕</span>
          </div>
          <p className="text-gray-500 mb-4">
            관계 테스트를 완료하면<br />나의 관계 스타일을 알 수 있어요
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {RELATIONSHIP_TESTS.map(test => (
              <button
                key={test.key}
                onClick={() => onStartTest?.(test.key)}
                className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-full text-sm font-medium transition-colors"
              >
                {test.emoji} {test.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 관계 스타일 (Stage 5) */}
          {stage5Result && (
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-pink-800 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                나의 관계 스타일
              </h3>

              <div className="space-y-3">
                {/* 갈등 스타일 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">갈등 대처</span>
                  <span className="text-sm font-medium text-gray-800">
                    {stage5Result.conflictStyle.primary.emoji} {stage5Result.conflictStyle.primary.nameKr}
                  </span>
                </div>

                {/* 친밀도 선호 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">친밀도</span>
                  <span className="text-sm font-medium text-gray-800">
                    {stage5Result.intimacyPreference.type === 'close' ? '밀착형' :
                     stage5Result.intimacyPreference.type === 'distant' ? '거리형' : '균형형'}
                  </span>
                </div>

                {/* 소통 스타일 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">소통 방식</span>
                  <span className="text-sm font-medium text-gray-800">
                    {stage5Result.communicationStyle.type === 'assertive' ? '주장적' :
                     stage5Result.communicationStyle.type === 'diplomatic' ? '외교적' : '균형적'}
                  </span>
                </div>
              </div>

              {/* 종합 프로필 */}
              <div className="mt-4 pt-3 border-t border-pink-200">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{stage5Result.profile.emoji}</span>
                  <div>
                    <p className="font-medium text-gray-800">{stage5Result.profile.nameKr}</p>
                    <p className="text-xs text-gray-500">{stage5Result.profile.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 궁합 테스트 결과 */}
          <div className="space-y-3">
            {relationshipResults.idealType && (
              <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                <span className="text-2xl">{relationshipResults.idealType.resultEmoji}</span>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">이상형</p>
                  <p className="font-medium text-gray-800">{relationshipResults.idealType.resultName}</p>
                </div>
                <button
                  onClick={() => {/* TODO: 공유 */}}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <Share2 className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            )}

            {relationshipResults.conflictStyle && (
              <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                <span className="text-2xl">{relationshipResults.conflictStyle.resultEmoji}</span>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">갈등 대처</p>
                  <p className="font-medium text-gray-800">{relationshipResults.conflictStyle.resultName}</p>
                </div>
                <button
                  onClick={() => {/* TODO: 공유 */}}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <Share2 className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            )}

            {/* 미완료 테스트 추천 */}
            {!relationshipResults.idealType && (
              <button
                onClick={() => onStartTest?.('idealType')}
                className="w-full bg-pink-50 hover:bg-pink-100 border border-dashed border-pink-200 rounded-xl p-4 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl opacity-50">💕</span>
                  <div>
                    <p className="text-sm font-medium text-pink-800">이상형 테스트</p>
                    <p className="text-xs text-pink-600">나의 연애 이상형 알아보기</p>
                  </div>
                </div>
              </button>
            )}

            {!relationshipResults.conflictStyle && (
              <button
                onClick={() => onStartTest?.('conflictStyle')}
                className="w-full bg-pink-50 hover:bg-pink-100 border border-dashed border-pink-200 rounded-xl p-4 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl opacity-50">💬</span>
                  <div>
                    <p className="text-sm font-medium text-pink-800">갈등 대처 테스트</p>
                    <p className="text-xs text-pink-600">갈등 상황에서 나의 스타일</p>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
