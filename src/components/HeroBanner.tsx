'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Flame, Users } from 'lucide-react';
import * as Icons from './Icons';
import { SUBJECT_CONFIG, MAIN_TEST_KEYS } from '../data/config';
import { CHEMI_DATA } from '../data/index';
import type { SubjectKey } from '../data/types';

interface HeroBannerProps {
  onStartTest: (testKey: SubjectKey) => void;
  className?: string;
}

// 인기 테스트 (고정)
const POPULAR_TESTS: SubjectKey[] = ['dog', 'human', 'cat', 'coffee', 'idealType'];

export default function HeroBanner({ onStartTest, className = '' }: HeroBannerProps) {
  const [featuredTest, setFeaturedTest] = useState<SubjectKey | null>(null);
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    // 인기 테스트 중 랜덤 선택
    const randomIndex = Math.floor(Math.random() * POPULAR_TESTS.length);
    setFeaturedTest(POPULAR_TESTS[randomIndex]);

    // 참여 인원 (랜덤 생성 - 실제로는 API에서 가져와야 함)
    const baseCount = 10000 + Math.floor(Math.random() * 5000);
    setParticipantCount(baseCount);
  }, []);

  if (!featuredTest) return null;

  const testConfig = SUBJECT_CONFIG[featuredTest];
  const testData = CHEMI_DATA[featuredTest];

  if (!testConfig || !testData) return null;

  const IconComponent = (Icons[testConfig.icon as keyof typeof Icons] || Icons.HumanIcon) as React.ComponentType<{ mood?: string; className?: string }>;
  const formattedCount = participantCount.toLocaleString();

  return (
    <div className={`w-full ${className}`}>
      <button
        onClick={() => onStartTest(featuredTest)}
        className="w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5 active:scale-[0.99] relative overflow-hidden group"
      >
        {/* 배경 장식 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative flex items-center gap-4">
          {/* 아이콘 */}
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <IconComponent mood="happy" className="w-12 h-12" />
          </div>

          {/* 콘텐츠 */}
          <div className="flex-1 text-left">
            {/* 배지 */}
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-[10px] font-bold">
                <Flame className="w-3 h-3" />
                인기
              </span>
              <span className="inline-flex items-center gap-1 text-white/80 text-[10px]">
                <Users className="w-3 h-3" />
                {formattedCount}명 참여
              </span>
            </div>

            {/* 제목 */}
            <h2 className="text-white font-black text-lg leading-tight mb-0.5">
              {testData.title}
            </h2>
            <p className="text-white/70 text-xs">
              ⏱️ 약 3분 · {testData.resultLabels?.length || 0}가지 결과
            </p>
          </div>

          {/* 화살표 */}
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors flex-shrink-0">
            <ArrowRight className="w-5 h-5 text-white" />
          </div>
        </div>
      </button>
    </div>
  );
}
