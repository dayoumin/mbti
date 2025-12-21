'use client';

import { useState, useEffect } from 'react';
import { Gift, Sparkles, Check, ChevronRight } from 'lucide-react';
import {
  demographicService,
  AGE_GROUP_LABELS,
  GENDER_LABELS,
  type AgeGroup,
  type Gender,
} from '@/services/DemographicService';

interface BonusInsightCardProps {
  testType: string;
  resultName: string;
  resultEmoji: string;
}

type Step = 'age' | 'gender' | 'done';
type CardState = 'ask' | 'answered' | 'already_known';

export default function BonusInsightCard({
  testType,
  resultName,
  resultEmoji,
}: BonusInsightCardProps) {
  const [state, setState] = useState<CardState>('ask');
  const [step, setStep] = useState<Step>('age');
  const [insight, setInsight] = useState<string | null>(null);
  const [selectedAge, setSelectedAge] = useState<AgeGroup | null>(null);
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // 이미 정보가 있는지 확인
  useEffect(() => {
    if (demographicService.hasFullDemographic()) {
      setState('already_known');
      const existingInsight = demographicService.getInsight(testType, resultName);
      setInsight(existingInsight);
    } else if (demographicService.hasAgeGroup()) {
      // 연령대만 있으면 성별부터 질문
      setStep('gender');
      const demo = demographicService.getDemographic();
      setSelectedAge(demo?.ageGroup || null);
    }
  }, [testType, resultName]);

  const handleSelectAge = (ageGroup: AgeGroup) => {
    setSelectedAge(ageGroup);
    demographicService.saveDemographic({
      ageGroup,
      source: 'bonus_question',
    });
    // 성별 단계로
    setTimeout(() => setStep('gender'), 300);
  };

  const handleSelectGender = (gender: Gender) => {
    setSelectedGender(gender);
    setIsAnimating(true);

    demographicService.saveDemographic({
      gender,
      source: 'bonus_question',
    });

    // 인사이트 생성
    setTimeout(() => {
      const newInsight = demographicService.getInsight(testType, resultName);
      setInsight(newInsight);
      setStep('done');
      setState('answered');
      setIsAnimating(false);
    }, 800);
  };

  // 이미 알고 있으면 인사이트만 표시
  if (state === 'already_known' && insight) {
    return (
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-bold text-indigo-600">또래 비교</span>
        </div>
        <p className="text-sm font-medium text-slate-700">{insight}</p>
      </div>
    );
  }

  // already_known인데 insight가 null이면 질문 UI로 fall through (데이터 손상 복구)

  // 응답 완료 상태
  if (state === 'answered' && insight) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 animate-fade-in">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold text-green-700">인사이트 해금!</span>
        </div>
        <div className="bg-white/80 rounded-lg p-3 border border-green-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{resultEmoji}</span>
            <span className="font-bold text-slate-800">{resultName}</span>
          </div>
          <p className="text-sm font-medium text-slate-600">{insight}</p>
        </div>
        <p className="text-xs text-green-600 mt-2 text-center">
          앞으로 모든 테스트에서 또래 비교를 볼 수 있어요!
        </p>
      </div>
    );
  }

  // 질문 상태
  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-xl p-4 border border-amber-200 shadow-sm">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-sm">
          <Gift className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-800 text-sm">보너스 인사이트</h3>
          <p className="text-xs text-slate-500">
            {step === 'age' ? '같은 또래와 비교해볼까요?' : '거의 다 왔어요!'}
          </p>
        </div>
        {/* 진행률 */}
        <div className="flex gap-1">
          <div className={`w-2 h-2 rounded-full ${step === 'age' ? 'bg-amber-500' : 'bg-amber-300'}`} />
          <div className={`w-2 h-2 rounded-full ${step === 'gender' ? 'bg-amber-500' : step === 'done' ? 'bg-amber-300' : 'bg-amber-200'}`} />
        </div>
      </div>

      {/* 로딩 상태 */}
      {isAnimating ? (
        <div className="flex flex-col items-center py-4">
          <div className="w-10 h-10 border-3 border-amber-200 border-t-amber-500 rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-slate-600 animate-pulse">분석 중...</p>
        </div>
      ) : (
        <>
          {/* 연령대 선택 */}
          {step === 'age' && (
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2">
                {(Object.entries(AGE_GROUP_LABELS) as [AgeGroup, string][]).map(
                  ([key, label]) => (
                    <button
                      key={key}
                      onClick={() => handleSelectAge(key)}
                      className={`
                        py-2.5 px-2 rounded-lg text-sm font-bold transition-all
                        ${
                          selectedAge === key
                            ? 'bg-amber-500 text-white shadow-md scale-105'
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-300 hover:bg-amber-50'
                        }
                      `}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-white/60 rounded-lg px-3 py-2">
                <ChevronRight className="w-3 h-3 text-amber-500" />
                <span>응답하면 <strong className="text-amber-600">&quot;20대 남성 중 상위 15%!&quot;</strong> 같은 비교를 볼 수 있어요</span>
              </div>
            </div>
          )}

          {/* 성별 선택 */}
          {step === 'gender' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 text-center mb-2">
                <span className="font-bold text-amber-600">{AGE_GROUP_LABELS[selectedAge!]}</span> 선택됨 ✓
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(GENDER_LABELS) as [Gender, string][]).map(
                  ([key, label]) => (
                    <button
                      key={key}
                      onClick={() => handleSelectGender(key)}
                      className={`
                        py-3 px-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1
                        ${
                          selectedGender === key
                            ? 'bg-amber-500 text-white shadow-md scale-105'
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-300 hover:bg-amber-50'
                        }
                      `}
                    >
                      <span className="text-lg">{key === 'male' ? '👨' : key === 'female' ? '👩' : '🙂'}</span>
                      <span className={key === 'other' ? 'text-xs' : ''}>{label}</span>
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
