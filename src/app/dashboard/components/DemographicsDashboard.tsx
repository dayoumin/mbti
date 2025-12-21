'use client';

import { useState, useEffect } from 'react';
import { Users, TrendingUp, BarChart3, RefreshCw, AlertCircle } from 'lucide-react';
import { AGE_GROUP_LABELS, GENDER_LABELS, type AgeGroup, type Gender } from '@/services/DemographicService';

interface DemographicStats {
  total: number;
  byAge: { age_group: AgeGroup; count: number }[];
  byGender: { gender: Gender; count: number }[];
  byCross: { age_group: AgeGroup; gender: Gender; count: number }[];
}

export default function DemographicsDashboard() {
  const [stats, setStats] = useState<DemographicStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/demographic');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setStats(data);
    } catch (e) {
      setError('통계를 불러올 수 없습니다.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // 퍼센트 계산
  const getPercent = (count: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  // 바 색상
  const ageColors: Record<AgeGroup, string> = {
    '10s': 'bg-pink-500',
    '20s': 'bg-violet-500',
    '30s': 'bg-blue-500',
    '40s+': 'bg-emerald-500',
  };

  const genderColors: Record<Gender, string> = {
    male: 'bg-blue-500',
    female: 'bg-pink-500',
    other: 'bg-slate-400',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-slate-400">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>통계 로딩 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="flex items-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const total = stats?.total || 0;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-violet-400" />
            인구통계 현황
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            보너스 질문을 통해 수집된 사용자 인구통계 데이터
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          새로고침
        </button>
      </div>

      {/* 총 수집 수 */}
      <div className="bg-gradient-to-r from-violet-500/20 to-blue-500/20 border border-violet-500/30 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-violet-500/30 flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-violet-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">총 수집된 인구통계</p>
            <p className="text-3xl font-bold text-white">{total.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {total === 0 ? (
        <div className="bg-slate-800/50 rounded-xl p-8 text-center">
          <BarChart3 className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">아직 데이터가 없습니다</h3>
          <p className="text-sm text-slate-400">
            사용자가 테스트 결과 화면에서 보너스 질문에 응답하면
            <br />
            여기에 인구통계 현황이 표시됩니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 연령대별 분포 */}
          <div className="bg-slate-800/50 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-violet-400" />
              연령대별 분포
            </h3>
            <div className="space-y-3">
              {(['10s', '20s', '30s', '40s+'] as AgeGroup[]).map((age) => {
                const item = stats?.byAge.find((a) => a.age_group === age);
                const count = item?.count || 0;
                const percent = getPercent(count, total);
                return (
                  <div key={age}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">{AGE_GROUP_LABELS[age]}</span>
                      <span className="text-slate-400">
                        {count}명 ({percent}%)
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${ageColors[age]} transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 성별 분포 */}
          <div className="bg-slate-800/50 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-pink-400" />
              성별 분포
            </h3>
            <div className="space-y-3">
              {(['male', 'female', 'other'] as Gender[]).map((gender) => {
                const item = stats?.byGender.find((g) => g.gender === gender);
                const count = item?.count || 0;
                const percent = getPercent(count, total);
                return (
                  <div key={gender}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">{GENDER_LABELS[gender]}</span>
                      <span className="text-slate-400">
                        {count}명 ({percent}%)
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${genderColors[gender]} transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 교차 분석 (연령대 x 성별) */}
          <div className="bg-slate-800/50 rounded-xl p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              연령대 × 성별 교차 분석
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2 px-3 text-slate-400 font-medium">연령대</th>
                    <th className="text-center py-2 px-3 text-blue-400 font-medium">남성</th>
                    <th className="text-center py-2 px-3 text-pink-400 font-medium">여성</th>
                    <th className="text-center py-2 px-3 text-slate-400 font-medium">미응답</th>
                    <th className="text-right py-2 px-3 text-slate-400 font-medium">합계</th>
                  </tr>
                </thead>
                <tbody>
                  {(['10s', '20s', '30s', '40s+'] as AgeGroup[]).map((age) => {
                    const getCount = (g: Gender) =>
                      stats?.byCross.find((c) => c.age_group === age && c.gender === g)?.count || 0;
                    const male = getCount('male');
                    const female = getCount('female');
                    const other = getCount('other');
                    const rowTotal = male + female + other;

                    return (
                      <tr key={age} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="py-2 px-3 text-slate-300">{AGE_GROUP_LABELS[age]}</td>
                        <td className="py-2 px-3 text-center text-slate-300">{male}</td>
                        <td className="py-2 px-3 text-center text-slate-300">{female}</td>
                        <td className="py-2 px-3 text-center text-slate-400">{other}</td>
                        <td className="py-2 px-3 text-right font-medium text-white">{rowTotal}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-700/30">
                    <td className="py-2 px-3 font-medium text-slate-300">합계</td>
                    <td className="py-2 px-3 text-center font-medium text-blue-400">
                      {stats?.byGender.find((g) => g.gender === 'male')?.count || 0}
                    </td>
                    <td className="py-2 px-3 text-center font-medium text-pink-400">
                      {stats?.byGender.find((g) => g.gender === 'female')?.count || 0}
                    </td>
                    <td className="py-2 px-3 text-center font-medium text-slate-400">
                      {stats?.byGender.find((g) => g.gender === 'other')?.count || 0}
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-violet-400">{total}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 활용 안내 */}
      <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/50">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">인구통계 활용</h3>
        <ul className="space-y-2 text-sm text-slate-400">
          <li className="flex items-start gap-2">
            <span className="text-violet-400">•</span>
            <span>
              <strong className="text-slate-300">또래 비교 인사이트</strong> - &quot;20대 남성 중 15%만 나오는 희귀 유형!&quot;
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-violet-400">•</span>
            <span>
              <strong className="text-slate-300">맞춤 콘텐츠 추천</strong> - 연령/성별에 맞는 퀴즈, 투표 우선 노출
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-violet-400">•</span>
            <span>
              <strong className="text-slate-300">광고 타겟팅</strong> - 인구통계 기반 맞춤 광고 전략
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
