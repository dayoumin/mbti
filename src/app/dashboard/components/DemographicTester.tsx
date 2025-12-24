'use client';

/**
 * 개발용 연령대/성별 테스터
 * - 다양한 연령대로 콘텐츠 필터링 테스트
 * - Kids 부스트 확인
 * - 성인 콘텐츠 차단 확인
 */

import { useState, useEffect } from 'react';
import { User, Baby, GraduationCap, Briefcase, Home, RefreshCw, AlertTriangle } from 'lucide-react';
import { demographicService, VALID_AGE_GROUPS, VALID_GENDERS, AGE_GROUP_LABELS, GENDER_LABELS, type AgeGroup, type Gender } from '@/services/DemographicService';

const AGE_ICONS: Record<AgeGroup, React.ReactNode> = {
  '~9': <Baby className="w-4 h-4" />,
  '10s': <GraduationCap className="w-4 h-4" />,
  '20s': <User className="w-4 h-4" />,
  '30s': <Briefcase className="w-4 h-4" />,
  '40s+': <Home className="w-4 h-4" />,
};

const AGE_COLORS: Record<AgeGroup, string> = {
  '~9': 'bg-yellow-500 hover:bg-yellow-600',
  '10s': 'bg-pink-500 hover:bg-pink-600',
  '20s': 'bg-violet-500 hover:bg-violet-600',
  '30s': 'bg-blue-500 hover:bg-blue-600',
  '40s+': 'bg-emerald-500 hover:bg-emerald-600',
};

export default function DemographicTester() {
  const [currentAge, setCurrentAge] = useState<AgeGroup | null>(null);
  const [currentGender, setCurrentGender] = useState<Gender | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // 현재 설정 로드
  useEffect(() => {
    const data = demographicService.getDemographic();
    if (data) {
      setCurrentAge(data.ageGroup ?? null);
      setCurrentGender(data.gender ?? null);
    }
  }, []);

  // 연령대 변경
  const handleAgeChange = (age: AgeGroup) => {
    setIsUpdating(true);
    demographicService.saveDemographic({ ageGroup: age, source: 'profile' });
    setCurrentAge(age);

    // UI 피드백
    setTimeout(() => setIsUpdating(false), 300);
  };

  // 성별 변경
  const handleGenderChange = (gender: Gender) => {
    setIsUpdating(true);
    demographicService.saveDemographic({ gender, source: 'profile' });
    setCurrentGender(gender);

    setTimeout(() => setIsUpdating(false), 300);
  };

  // 초기화
  const handleReset = () => {
    setIsUpdating(true);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chemi_demographic');
      window.dispatchEvent(new CustomEvent('chemi:profileUpdated'));
    }
    setCurrentAge(null);
    setCurrentGender(null);
    setTimeout(() => setIsUpdating(false), 300);
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <User className="w-4 h-4 text-violet-400" />
          연령대 테스터 (개발용)
        </h3>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded text-slate-300"
        >
          <RefreshCw className={`w-3 h-3 ${isUpdating ? 'animate-spin' : ''}`} />
          초기화
        </button>
      </div>

      {/* 현재 상태 */}
      <div className="mb-4 p-3 bg-slate-900/50 rounded-lg">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-400">현재:</span>
          <span className={`font-medium ${currentAge ? 'text-white' : 'text-slate-500'}`}>
            {currentAge ? AGE_GROUP_LABELS[currentAge] : '미설정'}
          </span>
          <span className="text-slate-600">|</span>
          <span className={`font-medium ${currentGender ? 'text-white' : 'text-slate-500'}`}>
            {currentGender ? GENDER_LABELS[currentGender] : '미설정'}
          </span>
        </div>
      </div>

      {/* 연령대 선택 */}
      <div className="mb-4">
        <p className="text-xs text-slate-400 mb-2">연령대 선택</p>
        <div className="flex flex-wrap gap-2">
          {VALID_AGE_GROUPS.map((age) => (
            <button
              key={age}
              onClick={() => handleAgeChange(age)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentAge === age
                  ? `${AGE_COLORS[age]} text-white ring-2 ring-offset-2 ring-offset-slate-800`
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {AGE_ICONS[age]}
              {AGE_GROUP_LABELS[age]}
              {age === '~9' && (
                <span className="text-[10px] bg-yellow-400/20 px-1 rounded">Kids</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 성별 선택 */}
      <div className="mb-4">
        <p className="text-xs text-slate-400 mb-2">성별 선택</p>
        <div className="flex gap-2">
          {VALID_GENDERS.map((gender) => (
            <button
              key={gender}
              onClick={() => handleGenderChange(gender)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentGender === gender
                  ? 'bg-violet-500 text-white ring-2 ring-offset-2 ring-offset-slate-800'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {GENDER_LABELS[gender]}
            </button>
          ))}
        </div>
      </div>

      {/* 안내 */}
      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-amber-200/80">
            <p className="font-medium mb-1">테스트 안내</p>
            <ul className="list-disc list-inside space-y-0.5 text-amber-200/60">
              <li><strong>~9세</strong>: Kids 콘텐츠 30% 부스트</li>
              <li><strong>10대</strong>: 성인 콘텐츠 차단 (술/도박)</li>
              <li><strong>20대+</strong>: 모든 콘텐츠 노출</li>
            </ul>
            <p className="mt-2 text-amber-200/50">변경 후 메인 페이지에서 콘텐츠 확인</p>
          </div>
        </div>
      </div>
    </div>
  );
}
