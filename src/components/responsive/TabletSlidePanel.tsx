'use client';

import { useState, useEffect, useRef } from 'react';
import { X, HelpCircle } from 'lucide-react';
import { ContentWidgetContainer } from '../content';

export type TabletContentTab = 'quiz' | 'poll' | null;

interface TabletSlidePanelProps {
  activeTab: TabletContentTab;
  onTabChange: (tab: TabletContentTab) => void;
  onExploreMore?: () => void;
}

export default function TabletSlidePanel({
  activeTab,
  onTabChange,
  onExploreMore,
}: TabletSlidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  // 패널 닫기 (애니메이션 포함)
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onTabChange(null);
    }, 200);
  };

  // Escape 키로 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeTab) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [activeTab]);

  // 패널 열릴 때 포커스
  useEffect(() => {
    if (activeTab && panelRef.current) {
      panelRef.current.focus();
    }
  }, [activeTab]);

  const isOpen = activeTab !== null && !isClosing;

  return (
    <>
      {/* 띠지 탭들 - 태블릿에서만 표시 (md ~ lg) */}
      <div className="hidden md:flex lg:hidden fixed right-0 top-1/2 -translate-y-1/2 z-40 flex-col gap-2">
        {/* 퀴즈 탭 */}
        <button
          onClick={() => onTabChange(activeTab === 'quiz' ? null : 'quiz')}
          aria-expanded={activeTab === 'quiz'}
          aria-controls="tablet-slide-panel"
          className={`
            w-8 h-20 rounded-l-lg shadow-lg transition-all duration-200
            bg-gradient-to-b from-blue-500 to-indigo-600
            hover:w-10 hover:shadow-xl
            flex items-center justify-center
            ${activeTab === 'quiz' ? 'w-10' : ''}
          `}
        >
          <span
            className="text-white text-xs font-bold"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            퀴즈
          </span>
        </button>

        {/* 투표 탭 */}
        <button
          onClick={() => onTabChange(activeTab === 'poll' ? null : 'poll')}
          aria-expanded={activeTab === 'poll'}
          aria-controls="tablet-slide-panel"
          className={`
            w-8 h-20 rounded-l-lg shadow-lg transition-all duration-200
            bg-gradient-to-b from-purple-500 to-pink-600
            hover:w-10 hover:shadow-xl
            flex items-center justify-center
            ${activeTab === 'poll' ? 'w-10' : ''}
          `}
        >
          <span
            className="text-white text-xs font-bold"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            투표
          </span>
        </button>
      </div>

      {/* 오버레이 */}
      {activeTab && (
        <div
          className={`
            hidden md:block lg:hidden fixed inset-0 bg-black/20 z-40
            transition-opacity duration-200
            ${isClosing ? 'opacity-0' : 'opacity-100'}
          `}
          onClick={handleClose}
          role="presentation"
        />
      )}

      {/* 슬라이드 패널 */}
      {activeTab && (
        <div
          ref={panelRef}
          id="tablet-slide-panel"
          role="dialog"
          aria-modal="true"
          aria-label={activeTab === 'quiz' ? '퀴즈 패널' : '투표 패널'}
          tabIndex={-1}
          className={`
            hidden md:flex lg:hidden fixed right-0 top-0 h-full w-80 z-50
            bg-white/95 backdrop-blur-xl shadow-2xl
            flex-col
            ${isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'}
          `}
        >
          {/* 패널 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              {activeTab === 'quiz' ? (
                <>
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-slate-700">오늘의 퀴즈</span>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-black text-white">VS</span>
                  </div>
                  <span className="font-bold text-slate-700">투표</span>
                </>
              )}
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              aria-label="패널 닫기"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* 패널 콘텐츠 - 좁은 패널에서는 1열 유지 */}
          <div className="flex-1 overflow-y-auto p-4">
            <ContentWidgetContainer className="!grid-cols-1" />
          </div>
        </div>
      )}
    </>
  );
}
