'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Users, TrendingUp, Crown } from 'lucide-react';
import { resultService } from '@/services/ResultService';
import { demographicService } from '@/services/DemographicService';
import type { ResultDistribution as DistributionData } from '@/services/TursoService';

interface ResultDistributionProps {
  testType: string;
  myResultName: string;
  className?: string;
}

const AGE_GROUPS = [
  { value: 'all', label: '전체' },
  { value: '10s', label: '10대' },
  { value: '20s', label: '20대' },
  { value: '30s', label: '30대' },
  { value: '40s+', label: '40대+' },
];

const GENDER_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'male', label: '남성' },
  { value: 'female', label: '여성' },
];

export default function ResultDistribution({
  testType,
  myResultName,
  className = '',
}: ResultDistributionProps) {
  const [distribution, setDistribution] = useState<DistributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [activeAgeGroup, setActiveAgeGroup] = useState('all');
  const [activeGender, setActiveGender] = useState('all');

  // 내 인구통계 정보 가져오기
  useEffect(() => {
    const demo = demographicService.getDemographic();
    if (demo?.ageGroup) {
      setActiveAgeGroup(demo.ageGroup);
    }
    if (demo?.gender && demo.gender !== 'other') {
      setActiveGender(demo.gender);
    }
  }, []);

  // 분포 데이터 로드
  useEffect(() => {
    const loadDistribution = async () => {
      setLoading(true);
      try {
        const data = await resultService.getResultDistribution(testType, {
          ageGroup: activeAgeGroup !== 'all' ? activeAgeGroup : undefined,
          gender: activeGender !== 'all' ? activeGender : undefined,
        });
        setDistribution(data);
      } catch (error) {
        console.error('분포 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDistribution();
  }, [testType, activeAgeGroup, activeGender]);

  // 내 결과 찾기
  const myResult = distribution?.distribution.find(d => d.resultName === myResultName);
  const myRank = myResult?.rank || 0;
  const totalTypes = distribution?.distribution.length || 0;

  // 필터 라벨 생성
  const getFilterLabel = () => {
    const parts = [];
    if (activeAgeGroup !== 'all') {
      parts.push(AGE_GROUPS.find(a => a.value === activeAgeGroup)?.label);
    }
    if (activeGender !== 'all') {
      parts.push(GENDER_OPTIONS.find(g => g.value === activeGender)?.label);
    }
    return parts.length > 0 ? parts.join(' ') : '전체';
  };

  if (loading) {
    return (
      <div className={`bg-slate-50/60 rounded-xl p-4 border border-slate-50/50 animate-pulse ${className}`}>
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
        <div className="h-8 bg-slate-200 rounded mb-2"></div>
        <div className="h-6 bg-slate-200 rounded w-2/3"></div>
      </div>
    );
  }

  // 분포 데이터가 전혀 없으면 숨김 (첫 사용자)
  // 필터 적용 후 결과가 없으면 빈 상태 표시
  const isFiltered = activeAgeGroup !== 'all' || activeGender !== 'all';
  const hasNoData = !distribution || distribution.total === 0;

  if (hasNoData && !isFiltered) {
    return null; // 전체 데이터도 없으면 숨김
  }

  return (
    <div className={`bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 overflow-hidden ${className}`}>
      {/* 헤더 - 클릭하면 펼침/접힘 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-bold text-slate-700">다른 사람들은?</span>
          <span className="text-xs text-slate-500">({getFilterLabel()} {distribution?.total || 0}명)</span>
        </div>
        <div className="flex items-center gap-2">
          {myRank > 0 && (
            <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
              {myRank === 1 ? '👑 1위' : `${myRank}위/${totalTypes}개`}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* 펼쳐진 내용 */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* 필터 */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {/* 연령대 필터 */}
            <div className="flex gap-1 flex-shrink-0">
              {AGE_GROUPS.map(age => (
                <button
                  key={age.value}
                  onClick={() => setActiveAgeGroup(age.value)}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${activeAgeGroup === age.value
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-50/70 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  {age.label}
                </button>
              ))}
            </div>
            <div className="w-px bg-slate-200 flex-shrink-0" />
            {/* 성별 필터 */}
            <div className="flex gap-1 flex-shrink-0">
              {GENDER_OPTIONS.map(gender => (
                <button
                  key={gender.value}
                  onClick={() => setActiveGender(gender.value)}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${activeGender === gender.value
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-50/70 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  {gender.label}
                </button>
              ))}
            </div>
          </div>

          {/* 분포 바 차트 */}
          {hasNoData ? (
            // 필터 결과가 없을 때 빈 상태
            <div className="py-6 text-center">
              <p className="text-sm text-slate-500">
                {getFilterLabel()} 데이터가 아직 없습니다
              </p>
              <button
                onClick={() => {
                  setActiveAgeGroup('all');
                  setActiveGender('all');
                }}
                className="mt-2 text-xs text-indigo-500 hover:text-indigo-700"
              >
                전체 보기로 전환
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {distribution.distribution.slice(0, 5).map((item, idx) => {
                const isMe = item.resultName === myResultName;
                const barColor = isMe
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                  : idx === 0
                    ? 'bg-amber-400'
                    : 'bg-slate-300';

                return (
                  <div key={item.resultName} className="relative">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-5 text-center">
                        {idx === 0 ? <Crown className="w-4 h-4 text-amber-500" /> : <span className="text-xs text-slate-400">{item.rank}</span>}
                      </span>
                      <span className={`text-xs font-medium flex-1 truncate ${isMe ? 'text-indigo-700 font-bold' : 'text-slate-700'}`}>
                        {item.resultName}
                        {isMe && <span className="ml-1 text-indigo-500">(나)</span>}
                      </span>
                      <span className={`text-xs font-bold ${isMe ? 'text-indigo-600' : 'text-slate-500'}`}>
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-50/50 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${Math.max(item.percentage, 2)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 더 보기 (6개 이상일 때) */}
          {distribution && distribution.distribution.length > 5 && (
            <p className="text-xs text-center text-slate-400">
              +{distribution.distribution.length - 5}개 더 있음
            </p>
          )}

          {/* 내 결과 하이라이트 */}
          {myResult && myRank <= 3 && (
            <div className="mt-2 p-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-700">
                  {getFilterLabel()} 중 상위 {myResult.percentage}%!
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
