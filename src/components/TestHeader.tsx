'use client';

import { useState } from 'react';
import { BackIcon } from './Icons';

interface ProgressDotsProps {
  current: number;
  total: number;
  themeColor: string;
}

const ProgressDots = ({ current, total, themeColor }: ProgressDotsProps) => {
  if (total <= 0) return null;

  const maxDots = 10;
  const dotsToShow = Math.min(total, maxDots);
  const filledDots = Math.round((current / total) * dotsToShow);

  return (
    <div className="flex gap-1 items-center">
      <span className="text-xs text-slate-500 mr-1">{current}/{total}</span>
      {Array.from({ length: dotsToShow }, (_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-colors ${i < filledDots ? themeColor : 'bg-slate-300'
            }`}
        />
      ))}
    </div>
  );
};

interface ExitModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  testName: string;
}

const ExitModal = ({ isOpen, onConfirm, onCancel, testName }: ExitModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-50 rounded-2xl p-6 w-full max-w-xs border-4 border-slate-800 shadow-xl animate-pop">
        <h3 className="text-lg font-bold text-primary mb-2 text-center">
          테스트를 중단할까요?
        </h3>
        <p className="text-sm text-muted mb-6 text-center">
          진행한 내용은 저장되지 않아요
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            계속하기
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-red-500 rounded-xl font-bold text-white hover:bg-red-600 transition-colors"
          >
            나가기
          </button>
        </div>
      </div>
    </div>
  );
};

interface TestHeaderProps {
  testName: string;
  currentQuestion: number; // 0-indexed
  totalQuestions: number;
  themeColor?: string;
  onBack?: () => void;
  onExit?: () => void;
  canGoBack?: boolean;
}

export const TestHeader = ({
  testName,
  currentQuestion,
  totalQuestions,
  themeColor = 'bg-yellow-400',
  onBack,
  onExit,
  canGoBack = true,
}: TestHeaderProps) => {
  const [showExitModal, setShowExitModal] = useState(false);

  const handleBackClick = () => {
    if (currentQuestion === 0) {
      setShowExitModal(true);
    } else if (canGoBack && onBack) {
      onBack();
    }
  };

  const handleExitConfirm = () => {
    setShowExitModal(false);
    if (onExit) onExit();
  };

  return (
    <>
      <div className="flex items-center justify-between h-12 mb-4 -mx-2 px-2">
        <button
          onClick={handleBackClick}
          disabled={currentQuestion > 0 && !canGoBack}
          className={`w-11 h-11 flex items-center justify-center rounded-full transition-colors ${currentQuestion > 0 && !canGoBack
              ? 'text-slate-300 cursor-not-allowed'
              : 'hover:bg-slate-100 active:bg-slate-200 text-slate-600'
            }`}
          aria-label={currentQuestion === 0 ? '테스트 나가기' : '이전 질문'}
        >
          <BackIcon />
        </button>

        <span className="text-sm font-bold text-secondary truncate px-2">
          {testName}
        </span>

        <ProgressDots
          current={currentQuestion + 1}
          total={totalQuestions}
          themeColor={themeColor}
        />
      </div>

      <ExitModal
        isOpen={showExitModal}
        onConfirm={handleExitConfirm}
        onCancel={() => setShowExitModal(false)}
        testName={testName}
      />
    </>
  );
};

export default TestHeader;
