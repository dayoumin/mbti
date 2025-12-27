'use client';

import { useState } from 'react';
import { getFriendService, type InviteCode } from '@/services/FriendService';
import { useToast } from '@/components/Toast';

interface FriendInviteProps {
  testType: string;
  testName: string;
  onInviteCreated?: (code: InviteCode) => void;
  className?: string;
}

export default function FriendInvite({
  testType,
  testName,
  onInviteCreated,
  className = '',
}: FriendInviteProps) {
  const [inviteCode, setInviteCode] = useState<InviteCode | null>(null);
  const [copied, setCopied] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');

  const friendService = getFriendService();
  const { showToast } = useToast();

  const handleCreateInvite = () => {
    if (!friendService) return;

    const code = friendService.createInviteCode(testType);
    setInviteCode(code);
    onInviteCreated?.(code);
  };

  const handleCopyCode = async () => {
    if (!inviteCode || !friendService) return;

    const url = friendService.getInviteUrl(inviteCode.code);

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 복사 실패
    }
  };

  const handleJoinWithCode = () => {
    if (!friendService || !inputCode.trim()) return;

    setError('');
    const connection = friendService.acceptInvite(inputCode.trim());

    if (connection) {
      setShowInput(false);
      setInputCode('');
      showToast('친구와 연결되었어요!', 'success');
    } else {
      setError('유효하지 않은 코드예요. 다시 확인해주세요.');
    }
  };

  return (
    <div className={`bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-5 ${className}`}>
      <h3 className="text-lg font-bold text-primary mb-2">
        👥 친구와 함께 테스트해요!
      </h3>
      <p className="text-sm text-secondary mb-4">
        친구를 초대하고 {testName} 결과를 비교해보세요
      </p>

      {/* 초대 코드 생성 */}
      {!inviteCode ? (
        <button
          onClick={handleCreateInvite}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:from-pink-600 hover:to-purple-600 transition-all"
        >
          <span>✉️</span>
          <span>친구 초대 코드 만들기</span>
        </button>
      ) : (
        <div className="space-y-3">
          {/* 생성된 코드 표시 */}
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <div className="text-xs text-muted mb-1">초대 코드</div>
            <div className="text-2xl font-mono font-bold text-purple-600 tracking-wider">
              {inviteCode.code}
            </div>
            <div className="text-xs text-subtle mt-1">
              7일 후 만료
            </div>
          </div>

          {/* 복사 버튼 */}
          <button
            onClick={handleCopyCode}
            className="w-full bg-slate-50 border border-purple-200 text-purple-700 font-medium py-2 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-purple-50 transition-colors"
          >
            {copied ? (
              <>
                <span className="text-green-500">✓</span>
                <span>링크 복사 완료!</span>
              </>
            ) : (
              <>
                <span>🔗</span>
                <span>초대 링크 복사</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* 구분선 */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">또는</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* 초대 코드 입력 */}
      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className="w-full bg-slate-50 border border-gray-200 text-secondary font-medium py-2 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <span>🎟️</span>
          <span>초대 코드 입력하기</span>
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="코드 입력"
              maxLength={6}
              className="flex-1 bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-center font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleJoinWithCode}
              disabled={inputCode.length < 6}
              className="bg-purple-500 text-white px-4 py-2 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              확인
            </button>
          </div>
          {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}
          <button
            onClick={() => {
              setShowInput(false);
              setInputCode('');
              setError('');
            }}
            className="w-full text-xs text-subtle hover:text-secondary"
          >
            취소
          </button>
        </div>
      )}
    </div>
  );
}
