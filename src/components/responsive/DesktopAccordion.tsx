'use client';

import { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface DesktopAccordionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  autoExpand?: boolean;
  className?: string;
}

export default function DesktopAccordion({
  title,
  isExpanded,
  onToggle,
  children,
  autoExpand = true,
  className = '',
}: DesktopAccordionProps) {
  const onToggleRef = useRef(onToggle);
  onToggleRef.current = onToggle;

  // 자동 펼침 로직 (초기 마운트 시 한 번만)
  useEffect(() => {
    if (!autoExpand) return;

    // 화면 높이가 800px 이상이고 아직 펼쳐지지 않았으면 자동 펼침
    if (window.innerHeight > 800 && !isExpanded) {
      onToggleRef.current();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoExpand]); // isExpanded 의도적 제외 - 초기 마운트 시에만 체크

  const buttonId = `accordion-btn-${title.replace(/\s+/g, '-').toLowerCase()}`;
  const contentId = `accordion-content-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className={className}>
      {/* 토글 버튼 */}
      <button
        id={buttonId}
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors group"
      >
        <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-700">
          {title}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* 콘텐츠 영역 */}
      <div
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        className={`
          overflow-hidden transition-all duration-300 ease-out
          ${isExpanded ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="px-1">
          {children}
        </div>
      </div>
    </div>
  );
}
