'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Flame, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import * as Icons from './Icons';
import { SUBJECT_CONFIG, MAIN_TEST_KEYS } from '../data/config';
import { CHEMI_DATA } from '../data/index';
import type { SubjectKey } from '../data/types';

interface HeroBannerProps {
  onStartTest: (testKey: SubjectKey) => void;
  className?: string;
}

// 더 많은 테스트 데이터 확보 (로테이션용)
const FEATURED_POOL: SubjectKey[] = [...MAIN_TEST_KEYS].sort(() => 0.5 - Math.random());

interface HeroCardProps {
  testKey: SubjectKey;
  onStart: (key: SubjectKey) => void;
  index: number;
}

const HeroCard = ({ testKey, onStart, index }: HeroCardProps) => {
  const config = SUBJECT_CONFIG[testKey];
  const data = CHEMI_DATA[testKey];
  if (!config || !data) return null;

  const IconComponent = (Icons[config.icon as keyof typeof Icons] || Icons.HumanIcon) as React.ComponentType<{ mood?: string; className?: string }>;

  const styles = [
    { bg: 'bg-[#EEF2FF]', border: 'border-indigo-100', iconBg: 'bg-white', iconColor: 'text-indigo-500', accent: 'bg-indigo-500', badge: 'bg-indigo-100/50 text-indigo-600' },
    { bg: 'bg-[#FDF2F8]', border: 'border-pink-100', iconBg: 'bg-white', iconColor: 'text-pink-500', accent: 'bg-pink-500', badge: 'bg-pink-100/50 text-pink-600' },
    { bg: 'bg-[#F0FDF4]', border: 'border-emerald-100', iconBg: 'bg-white', iconColor: 'text-emerald-500', accent: 'bg-emerald-500', badge: 'bg-emerald-100/50 text-emerald-600' },
    { bg: 'bg-[#FFFBEB]', border: 'border-amber-100', iconBg: 'bg-white', iconColor: 'text-amber-500', accent: 'bg-amber-500', badge: 'bg-amber-100/50 text-amber-600' }
  ];

  const s = styles[index % styles.length];

  // 타이틀 정제: '나의 ', '내 ', ' 테스트' 제거 및 특정 단어 공백 제거
  const cleanTitle = data.title
    .replace(/^나의\s+/, '')
    .replace(/^내\s+/, '')
    .replace(/\s+테스트$/, '')
    .replace('아로마 오일', '아로마오일')
    .trim();

  const isMatching = config.testType === 'matching';

  return (
    <button
      onClick={() => onStart(testKey)}
      className={`relative w-full h-[100px] md:h-32 ${s.bg} rounded-[1.25rem] md:rounded-[1.5rem] p-3 md:p-5 border ${s.border} transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:border-white hover:-translate-y-1 active:scale-[0.98] overflow-hidden group text-left`}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 ${s.accent} opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000`} />

      <div className="relative h-full flex flex-col justify-center">
        {/* 상단: 아이콘 + 제목 (같은 Row) */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative flex-shrink-0">
            <div className={`w-8 h-8 md:w-11 md:h-11 ${s.iconBg} rounded-[0.6rem] md:rounded-[0.75rem] flex items-center justify-center shadow-sm border border-white group-hover:rotate-3 transition-transform`}>
              <IconComponent mood="happy" className={`w-5 h-5 md:w-8 md:h-8 ${s.iconColor}`} />
            </div>
            {/* 기호 배지: 아이콘 박스 좌측 상단 */}
            <div className={`absolute -top-1 -left-1 w-4 h-4 md:w-5 md:h-5 rounded-full ${s.iconBg} border border-slate-100 flex items-center justify-center text-[8px] md:text-[10px] shadow-sm z-10`}>
              {isMatching ? '💫' : '🧠'}
            </div>
          </div>

          <h2 className="flex-1 text-slate-800 font-extrabold text-[14px] md:text-[17px] leading-tight truncate">
            {cleanTitle}
          </h2>
        </div>

        {/* 하단: 설명 (전체 너비 활용, PC에서만 노출 또는 매우 작게) */}
        <div className="min-w-0 mt-1.5 md:mt-2">
          <p className="text-slate-700 text-[10px] md:text-[12.5px] font-bold opacity-75 leading-snug line-clamp-1 md:line-clamp-2">
            {data.subtitle || `${data.resultLabels?.length || 0}가지 결과`}
          </p>
        </div>
      </div>
    </button>
  );
};

export default function HeroBanner({ onStartTest, className = '' }: HeroBannerProps) {
  const [featuredPool, setFeaturedPool] = useState<SubjectKey[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  useEffect(() => {
    // 하이드레이션 이후 클라이언트에서만 랜덤 셔플링 수행
    const shuffled = [...MAIN_TEST_KEYS].sort(() => 0.5 - Math.random());
    setFeaturedPool(shuffled);

    // 화면 크기에 따른 아이템 수 조절
    const handleResize = () => {
      setItemsPerPage(window.innerWidth >= 1024 ? 8 : 4);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // itemsPerPage가 변경될 때 페이지 번호 초기화 (범위 밖 방지)
  useEffect(() => {
    setCurrentPage(0);
  }, [itemsPerPage]);

  const totalPages = Math.ceil(featuredPool.length / itemsPerPage);
  const displayedTests = featuredPool.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const prevPage = () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);

  if (featuredPool.length === 0) return null;

  return (
    <div className={`w-full relative ${className}`}>
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2">
            요즘 인기
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
          </h2>
          <p className="text-slate-400 text-xs md:text-sm font-bold mt-1">
            {itemsPerPage === 8 ? '실시간으로 가장 핫한 테스트 8선' : '오늘의 추천 테스트'}
          </p>
        </div>

        {/* 내비게이션 컨트롤 */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={prevPage}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-200 transition-all active:scale-95 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <div className="flex gap-1 px-2.5 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-400">
              <span className="text-indigo-600">{currentPage + 1}</span>
              <span>/</span>
              <span>{totalPages}</span>
            </div>
            <button
              onClick={nextPage}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-200 transition-all active:scale-95 shadow-sm"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {displayedTests.map((testKey, idx) => (
          <HeroCard
            key={`${testKey}-${currentPage}-${itemsPerPage}`}
            testKey={testKey}
            onStart={onStartTest}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
}
