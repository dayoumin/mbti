'use client';

import { useState, useEffect, useCallback } from 'react';
import { Heart, Plus, X, Check } from 'lucide-react';
import { careService } from '@/services/CareService';
import { CARE_TARGET_CONFIG } from '@/data/care/types';

interface CareProfilePromptProps {
  testSubject: string;          // 테스트 종류 (dog, cat, plant 등)
  resultKey: string;            // 결과 키
  resultEmoji: string;          // 결과 이모지
  resultName: string;           // 결과 이름 (표시용)
  onProfileCreated?: () => void;
}

/**
 * 테스트 결과 화면에서 케어 프로필 생성을 유도하는 컴포넌트
 */
export default function CareProfilePrompt({
  testSubject,
  resultKey,
  resultEmoji,
  resultName,
  onProfileCreated,
}: CareProfilePromptProps) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [isCreated, setIsCreated] = useState(false);

  // 이 테스트가 케어 연동 가능한지 확인
  const isLinkable = careService.isTestLinkable(testSubject);
  const careType = careService.getCareTypeFromTest(testSubject, resultKey);
  const config = careType ? CARE_TARGET_CONFIG[careType] : null;

  // ESC 키로 모달 닫기
  const closeModal = useCallback(() => setShowModal(false), []);

  useEffect(() => {
    if (!showModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal, closeModal]);

  // 연동 불가능한 테스트면 렌더링하지 않음
  if (!isLinkable || !careType || !config) {
    return null;
  }

  const handleCreate = () => {
    if (!name.trim()) return;

    const profile = careService.createProfileFromTestResult(
      testSubject,
      resultKey,
      resultEmoji,
      name.trim()
    );

    if (profile) {
      setIsCreated(true);
      setShowModal(false);
      onProfileCreated?.();
    }
  };

  if (isCreated) {
    return (
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-green-800">케어 프로필이 생성되었어요!</p>
            <p className="text-sm text-green-600">케어 탭에서 관리할 수 있어요</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 ${config.color} rounded-full flex items-center justify-center text-xl`}>
            {config.emoji}
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-800">
              {config.name} 케어 시작하기
            </p>
            <p className="text-sm text-slate-500">
              테스트 결과를 저장하고 케어 알림을 받아보세요
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-colors"
        >
          <Heart className="w-4 h-4" />
          케어 프로필 만들기
        </button>
      </div>

      {/* 이름 입력 모달 */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="care-profile-modal-title"
        >
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{config.emoji}</span>
                <h3 id="care-profile-modal-title" className="text-lg font-bold text-slate-800">
                  {config.name} 이름
                </h3>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-slate-50 rounded-xl flex items-center gap-3">
              <span className="text-xl">{resultEmoji}</span>
              <div>
                <p className="text-sm text-slate-500">테스트 결과</p>
                <p className="font-medium text-slate-700">{resultName}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                이름을 지어주세요
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={`예: 우리집 ${config.name}, 초코`}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                autoFocus
                onKeyDown={e => {
                  if (e.key === 'Enter' && name.trim()) {
                    handleCreate();
                  }
                }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-3 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50"
              >
                취소
              </button>
              <button
                onClick={handleCreate}
                disabled={!name.trim()}
                className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                생성
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
