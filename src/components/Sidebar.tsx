'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sparkles, Clock, TrendingUp, PenSquare, Heart, MessageCircle, ChevronRight, ChevronDown, PawPrint, Zap, User } from 'lucide-react';
import { NavTab, SIDEBAR_NAV_ITEMS } from './nav/types';
import { resultService } from '../services/ResultService';
import { profileService, type MyProfileData } from '../services/ProfileService';
import { insightService } from '../services/InsightService';
import { CHEMI_DATA } from '../data/index';
import { getIconComponent } from '@/utils';
import { SUBJECT_CONFIG, MAIN_TEST_KEYS, DETAIL_TEST_KEYS } from '../data/config';
import { RESULT_TO_DETAIL_TEST } from '../data/contentGraph';
import { POPULAR_TESTS, filterTestsByAge } from '../data/recommendationPolicy';
import { demographicService } from '../services/DemographicService';
import type { SubjectKey, SubjectConfig, SubjectData } from '../data/types';
import { getPostCategoryLabel, getPostCategoryStyle } from '../data/content/community';
import MyRankingMini from './MyRankingMini';

// 타입 재export (기존 import 호환성 유지 - SidebarTab은 NavTab과 동일)
export type SidebarTab = NavTab;

interface RecentTest {
  testType: string;
  resultKey: string;
  resultEmoji: string;
  createdAt: string;
}

interface MyPost {
  id: string;
  category: 'tip' | 'qna' | 'boast' | 'general';
  title: string;
  likes: number;
  comments: number;
  date: string;
}

interface SidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  onStartTest?: (testKey: string) => void;
  onOpenRanking?: () => void;
  className?: string;
}

// 작은 테스트 카드 (사이드바용)
function SidebarTestCard({ testKey, onStart }: { testKey: SubjectKey; onStart: (key: string) => void }) {
  const config = SUBJECT_CONFIG[testKey];
  const data = CHEMI_DATA[testKey as keyof typeof CHEMI_DATA];

  if (!config || !data) return null;

  const IconComponent = getIconComponent(config.icon);

  return (
    <button
      onClick={() => onStart(testKey)}
      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50/80 transition-all group text-left"
    >
      <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
        <IconComponent mood="happy" className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-700 truncate group-hover:text-indigo-600 transition-colors">
          {data.title || config.label}
        </p>
      </div>
    </button>
  );
}

// ============================================================================
// 프로필 미니 카드 (상단 배치 - 완성도 + 새 인사이트 알림)
// ============================================================================

interface ProfileMiniCardProps {
  onOpenProfile: () => void;
}

function ProfileMiniCard({ onOpenProfile }: ProfileMiniCardProps) {
  const [profile, setProfile] = useState<MyProfileData | null>(null);
  const [newInsightCount, setNewInsightCount] = useState(0);
  const [nextStageHint, setNextStageHint] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const profileData = await profileService.getMyProfile();
        setProfile(profileData);

        // 새 인사이트 수 계산 (해금된 스테이지 중 아직 안 본 것)
        const unlockedStages = insightService.getUnlockedStages();
        let viewedStages: number[] = [];
        try {
          viewedStages = JSON.parse(localStorage.getItem('chemi_viewed_insights') || '[]');
        } catch (parseError) {
          console.warn('Failed to parse chemi_viewed_insights:', parseError);
        }
        const newCount = unlockedStages.filter(s => !viewedStages.includes(s.stage)).length;
        setNewInsightCount(newCount);

        // 다음 스테이지 해금 힌트 (활동 통계 기반)
        const nextStageProgress = insightService.getProgressToNextStage();
        if (nextStageProgress && nextStageProgress.nextStage <= 6) {
          setNextStageHint(nextStageProgress.remaining);
        } else {
          setNextStageHint(null);
        }
      } catch (e) {
        console.error('Failed to load profile:', e);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();

    // 테스트 결과 저장 시 갱신
    window.addEventListener('chemi:resultSaved', loadProfileData);
    return () => window.removeEventListener('chemi:resultSaved', loadProfileData);
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-3 animate-pulse">
        <div className="h-12 bg-white/50 rounded-lg"></div>
      </div>
    );
  }

  const completionRate = profile?.completionRate || 0;

  return (
    <button
      onClick={onOpenProfile}
      className="w-full bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-3 text-left hover:from-indigo-100 hover:to-purple-100 transition-all group"
    >
      <div className="flex items-center gap-3">
        {/* 아바타 + 레벨 */}
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
            <User className="w-5 h-5 text-white" />
          </div>
          {newInsightCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {newInsightCount}
            </span>
          )}
        </div>

        {/* 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs font-bold text-indigo-700">내 프로필</span>
            {newInsightCount > 0 && (
              <span className="text-xs font-bold text-rose-500 flex items-center gap-0.5">
                <Zap className="w-3 h-3" /> 새 인사이트!
              </span>
            )}
          </div>

          {/* 진행률 바 */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-white/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full transition-all"
                style={{ width: `${Math.min(completionRate, 100)}%` }}
              />
            </div>
            <span className="text-xs font-bold text-indigo-600">{completionRate}%</span>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-indigo-300 group-hover:text-indigo-500 transition-colors" />
      </div>

      {/* 하단 힌트: 다음 스테이지 해금 안내 (활동 통계 기반) */}
      {nextStageHint && (
        <p className="text-xs text-indigo-400 mt-2 ml-[52px]">
          {nextStageHint} 하면 인사이트 해금!
        </p>
      )}
    </button>
  );
}

// ============================================================================
// 세부 반려동물 테스트 섹션 (나의 petMatch 결과 기반 추천)
// ============================================================================

function DetailTestsSection({ onStartTest }: { onStartTest: (key: string) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasPetMatchResult, setHasPetMatchResult] = useState(false);
  const [recommendedTestKeys, setRecommendedTestKeys] = useState<SubjectKey[]>([]);

  useEffect(() => {
    const checkPetMatch = async () => {
      try {
        const results = await resultService.getMyResults();
        const petMatchResult = results.find(r => r.testType === 'petMatch');
        if (petMatchResult) {
          setHasPetMatchResult(true);
          const recommended = RESULT_TO_DETAIL_TEST[petMatchResult.resultKey] || [];
          setRecommendedTestKeys(recommended);
        }
      } catch (e) {
        console.error('Failed to check petMatch result:', e);
      }
    };
    checkPetMatch();
  }, []);

  const detailTests = DETAIL_TEST_KEYS.map(key => {
    const config = SUBJECT_CONFIG[key];
    const data = CHEMI_DATA[key];
    if (!config || !data) return null;
    return { key, config, data };
  }).filter(Boolean) as Array<{ key: SubjectKey; config: SubjectConfig; data: SubjectData }>;

  // petMatch 결과가 없으면 표시하지 않음
  if (!hasPetMatchResult) return null;

  return (
    <div className="bg-amber-50/80 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center justify-between text-left hover:bg-amber-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
            <PawPrint className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-700">맞춤 품종 추천</p>
            <p className="text-xs text-amber-500">petMatch 결과 기반</p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 space-y-1.5 animate-fade-in">
          {detailTests.map(({ key, config, data }) => {
            const IconComponent = getIconComponent(config.icon);
            const isRecommended = recommendedTestKeys.includes(key);

            return (
              <button
                key={key}
                onClick={() => onStartTest(key)}
                className={`w-full p-2 rounded-lg text-left transition-all hover:shadow-sm group flex items-center gap-2 ${isRecommended
                    ? 'bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300'
                    : 'bg-slate-50/70 hover:bg-slate-50'
                  }`}
              >
                {isRecommended && (
                  <span className="text-xs font-bold text-amber-600 bg-amber-200 px-1.5 py-0.5 rounded-full">
                    추천
                  </span>
                )}
                <div className="w-6 h-6 bg-slate-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <IconComponent mood="happy" className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 truncate flex-1">
                  {data.title?.replace(' 추천', '') || config.label}
                </span>
                <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-amber-500 transition-colors" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({
  activeTab,
  onTabChange,
  onStartTest,
  onOpenRanking,
  className = ''
}: SidebarProps) {
  const [recentTests, setRecentTests] = useState<RecentTest[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [myPosts, setMyPosts] = useState<MyPost[]>([]);
  const [recommendedTests, setRecommendedTests] = useState<SubjectKey[]>([]);
  const [rotationOffset, setRotationOffset] = useState(0);
  const [recommendLabel, setRecommendLabel] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const results = await resultService.getMyResults();
      const completedKeys = [...new Set(results.map(r => r.testType))] as SubjectKey[];

      // 최근 2개만 (사이드바 표시용)
      setRecentTests(results.slice(0, 2).map(r => ({
        testType: r.testType,
        resultKey: r.resultKey,
        resultEmoji: r.resultEmoji,
        createdAt: r.createdAt,
      })));

      // 완료 카운트: 유니크 메인 테스트 기준 (프로필 완성도와 통일)
      const uniqueMainTests = completedKeys.filter(key => !(DETAIL_TEST_KEYS as readonly string[]).includes(key));
      setCompletedCount(uniqueMainTests.length);

      // 추천 테스트: 실제 참여 데이터 기반 인기순
      const demographic = demographicService.getDemographic();
      const ageGroup = demographic?.ageGroup;
      const gender = demographic?.gender;

      // 1. 연령 제한 필터링 (예: alcohol은 20대 이상만)
      const ageFilteredTests = filterTestsByAge(MAIN_TEST_KEYS, ageGroup);

      // 2. 완료하지 않은 테스트만
      const notCompleted = ageFilteredTests.filter(key => !completedKeys.includes(key));

      // 3. 실제 참여 데이터 기반 인기순 가져오기 (세션 캐싱)
      let popularTestOrder: string[] = [];
      let label = '인기순';

      try {
        // 실제 API 요청에 사용할 gender 값 결정 (other는 필터에서 제외)
        const effectiveGender = gender && gender !== 'other' ? gender : null;

        // 캐시 키 생성 (실제 API 요청과 동일한 파라미터 기준)
        const cacheKey = `popular_tests_${ageGroup || 'all'}_${effectiveGender || 'all'}`;
        const now = Date.now();

        // SSR 안전성: 브라우저에서만 sessionStorage 접근
        let cached: string | null = null;
        let cacheExpiry: string | null = null;
        if (typeof window !== 'undefined') {
          cached = sessionStorage.getItem(cacheKey);
          cacheExpiry = sessionStorage.getItem(`${cacheKey}_expiry`);
        }

        // 캐시가 있고 5분 이내면 사용
        if (cached && cacheExpiry && now < parseInt(cacheExpiry, 10)) {
          try {
            popularTestOrder = JSON.parse(cached);
          } catch (parseError) {
            // 손상된 캐시 제거
            console.warn('Corrupted popular tests cache, clearing:', parseError);
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem(cacheKey);
              sessionStorage.removeItem(`${cacheKey}_expiry`);
            }
          }
        }

        // 캐시가 없거나 파싱 실패 시 API 호출
        if (popularTestOrder.length === 0) {
          // 연령/성별 정보가 있으면 해당 그룹의 인기순, 없으면 전체 인기순
          const params = new URLSearchParams({ type: 'popular-tests', limit: '20' });
          if (ageGroup) params.set('ageGroup', ageGroup);
          if (effectiveGender) params.set('gender', effectiveGender);

          const res = await fetch(`/api/ranking?${params.toString()}`);
          if (res.ok) {
            const data = await res.json();
            popularTestOrder = (data.popularTests || []).map((t: { testType: string }) => t.testType);

            // 5분간 캐싱 (브라우저에서만)
            if (typeof window !== 'undefined') {
              sessionStorage.setItem(cacheKey, JSON.stringify(popularTestOrder));
              sessionStorage.setItem(`${cacheKey}_expiry`, String(now + 5 * 60 * 1000));
            }
          } else {
            console.warn(`Popular tests API returned ${res.status}: ${res.statusText}`);
          }
        }

        // 맞춤 라벨 설정: 실제 개인화 데이터가 있을 때만 맞춤 라벨 사용
        if (popularTestOrder.length > 0 && (ageGroup || gender)) {
          label = demographicService.getRecommendationLabel() || '인기순';
        }
      } catch (e) {
        console.warn('Failed to fetch popular tests:', e);
        // API 실패 시 라벨도 기본값으로 초기화
        label = '인기순';
      }

      // 4. 인기순으로 정렬 (API 데이터 우선, 없으면 POPULAR_TESTS 폴백)
      const popularityOrder = popularTestOrder.length > 0 ? popularTestOrder : POPULAR_TESTS;
      // Map으로 인덱스 캐시 (O(n²) → O(n) 개선)
      const priorityMap = new Map(popularityOrder.map((key, idx) => [key, idx]));
      // [...notCompleted]로 복사하여 원본 배열 변형 방지
      const sortedRecommended = [...notCompleted].sort((a, b) => {
        const aPriority = priorityMap.get(a) ?? 1000;
        const bPriority = priorityMap.get(b) ?? 1000;
        return aPriority - bPriority;
      });

      setRecommendedTests(sortedRecommended);
      setRecommendLabel(label);
      // 추천 목록이 변경되면 rotationOffset 리셋
      setRotationOffset(0);

      // TODO: 실제 API 연동 시 교체
      // 현재는 localStorage에서 내가 쓴 글 가져오기 (Mock)
      if (typeof window !== 'undefined') {
        try {
          const savedPosts = localStorage.getItem('chemi_my_posts');
          if (savedPosts) {
            setMyPosts(JSON.parse(savedPosts).slice(0, 3));
          }
        } catch {
          // 손상된 데이터 무시
        }
      }
    } catch (e) {
      console.error('Failed to load data:', e);
    }
  }, []);

  // 초기 로드 + 이벤트 리스너
  useEffect(() => {
    loadData();

    // 테스트 결과 저장 시 갱신
    window.addEventListener('chemi:resultSaved', loadData);
    // 프로필(demographic) 변경 시 캐시 무효화 후 갱신
    const handleProfileUpdated = () => {
      // 인기순 캐시 무효화
      if (typeof window !== 'undefined') {
        const keys = Object.keys(sessionStorage);
        keys.forEach(key => {
          if (key.startsWith('popular_tests_')) {
            sessionStorage.removeItem(key);
          }
        });
      }
      loadData();
    };
    window.addEventListener('chemi:profileUpdated', handleProfileUpdated);

    return () => {
      window.removeEventListener('chemi:resultSaved', loadData);
      window.removeEventListener('chemi:profileUpdated', handleProfileUpdated);
    };
  }, [loadData]);

  // 10초마다 추천 테스트 로테이션
  useEffect(() => {
    if (recommendedTests.length <= 3) return;
    const timer = setInterval(() => {
      setRotationOffset(prev => (prev + 3) % recommendedTests.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [recommendedTests.length]);

  // 현재 표시할 3개 테스트
  const displayedTests = recommendedTests.length > 0
    ? recommendedTests.slice(rotationOffset, rotationOffset + 3).concat(
      rotationOffset + 3 > recommendedTests.length
        ? recommendedTests.slice(0, (rotationOffset + 3) % recommendedTests.length)
        : []
    ).slice(0, 3)
    : [];

  return (
    <aside
      className={`hidden lg:flex flex-col w-60 h-screen fixed left-0 top-0 bg-slate-50/80 backdrop-blur-xl border-r border-slate-200/50 z-40 ${className}`}
      role="navigation"
      aria-label="사이드 네비게이션"
    >
      {/* 로고 영역 - 클릭 시 홈으로 */}
      <button
        onClick={() => onTabChange('home')}
        className="p-6 border-b border-slate-100 text-left hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-black text-lg text-slate-800">
              Chemi <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">Test</span>
            </h1>
            <p className="text-xs text-slate-400">오늘은 뭘 알아볼까?</p>
          </div>
        </div>
      </button>

      {/* 네비게이션 */}
      <nav className="p-4 pb-2">
        <ul className="space-y-1">
          {SIDEBAR_NAV_ITEMS.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;

            return (
              <li key={key}>
                <button
                  onClick={() => onTabChange(key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${isActive
                    ? 'bg-indigo-50 text-indigo-600 font-bold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'
                      }`}
                  />
                  <span className="text-sm">{label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 프로필 미니 카드 (상단 고정) */}
      <div className="px-4 pb-2">
        <ProfileMiniCard onOpenProfile={() => onTabChange('profile')} />
      </div>

      {/* 하단 위젯 영역 - 스크롤 가능 */}
      <div className="flex-1 overflow-y-auto p-4 pt-2 space-y-3 no-scrollbar">
        {/* 추천 테스트 (인기순 + 로테이션) */}
        {displayedTests.length > 0 && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-xs font-bold text-indigo-700">추천 테스트</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-indigo-400">{recommendLabel || '인기순'}</span>
                {recommendedTests.length > 3 && (
                  <div className="flex gap-0.5 ml-1">
                    {Array.from({ length: Math.ceil(recommendedTests.length / 3) }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-1 h-1 rounded-full transition-colors ${Math.floor(rotationOffset / 3) === idx ? 'bg-indigo-500' : 'bg-indigo-200'
                          }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1">
              {displayedTests.map((key, index) => {
                const config = SUBJECT_CONFIG[key];
                const data = CHEMI_DATA[key];
                if (!config || !data) return null;
                const IconComponent = getIconComponent(config.icon);

                return (
                  <button
                    key={key}
                    onClick={() => onStartTest?.(key)}
                    className="w-full flex items-center gap-2 p-2 bg-slate-50/70 rounded-lg hover:bg-slate-50 transition-colors group text-left"
                  >
                    <span className="w-5 h-5 bg-indigo-100 text-indigo-600 text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                      <IconComponent mood="happy" className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-700 truncate group-hover:text-indigo-600 transition-colors">
                        {data.title || config.label}
                      </p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 최근 본 테스트 */}
        {recentTests.length > 0 && (
          <div className="bg-slate-50/80 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-600">최근 본 테스트</span>
            </div>
            <div className="space-y-0.5">
              {recentTests.map((test) => (
                <SidebarTestCard
                  key={`${test.testType}-${test.createdAt}`}
                  testKey={test.testType as SubjectKey}
                  onStart={onStartTest || (() => { })}
                />
              ))}
            </div>
          </div>
        )}

        {/* 내 결과 순위 */}
        <MyRankingMini onOpenRanking={onOpenRanking} />

        {/* 맞춤 품종 추천 (petMatch 결과 기반) */}
        <DetailTestsSection onStartTest={onStartTest || (() => { })} />

        {/* 내가 쓴 글 */}
        {myPosts.length > 0 && (
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <PenSquare className="w-3.5 h-3.5 text-pink-500" />
              <span className="text-xs font-semibold text-pink-700">내가 쓴 글</span>
            </div>
            <div className="space-y-1.5">
              {myPosts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => onTabChange('talk')}
                  className="w-full p-2 bg-slate-50/60 rounded-lg hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${getPostCategoryStyle(post.category)}`}>
                      {getPostCategoryLabel(post.category)}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-700 truncate group-hover:text-pink-600 transition-colors">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-0.5 text-xs text-slate-400">
                      <Heart className="w-2.5 h-2.5" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-0.5 text-xs text-slate-400">
                      <MessageCircle className="w-2.5 h-2.5" /> {post.comments}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 통계 */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-xs font-semibold text-slate-600">내 활동</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-indigo-600">{completedCount}</span>
            <span className="text-xs text-slate-500">개 테스트 완료</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

