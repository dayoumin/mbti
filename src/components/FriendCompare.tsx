'use client';

import { useState } from 'react';
import { X, Users, Copy, Check, ArrowRight } from 'lucide-react';
import { getFriendService, type TestComparison } from '@/services/FriendService';

interface FriendCompareProps {
  testType: string;
  testName: string;
  myResult: string;
  myResultEmoji: string;
  myScores: Record<string, number>;
  dimensions: Record<string, { name: string; emoji: string }>;
  onClose: () => void;
}

type Step = 'invite' | 'input' | 'result';

export default function FriendCompare({
  testType,
  testName,
  myResult,
  myResultEmoji,
  myScores,
  dimensions,
  onClose,
}: FriendCompareProps) {
  const [step, setStep] = useState<Step>('invite');
  const [inviteCode, setInviteCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [comparison, setComparison] = useState<TestComparison | null>(null);

  const friendService = getFriendService();

  // 초대 코드 생성
  const handleCreateInvite = () => {
    if (!friendService) return;
    const code = friendService.createInviteCode(testType);
    setInviteCode(code.code);
  };

  // 링크 복사
  const handleCopyLink = async () => {
    if (!friendService || !inviteCode) return;
    const url = friendService.getInviteUrl(inviteCode);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 복사 실패
    }
  };

  // 친구 코드로 비교 (데모용 - 실제로는 친구 결과를 서버에서 가져와야 함)
  const handleCompare = () => {
    if (!friendService || !inputCode.trim()) return;
    setError('');

    // 코드 형식 검증 (6자리 영숫자)
    const codePattern = /^[A-Z0-9]{6}$/;
    if (!codePattern.test(inputCode.trim().toUpperCase())) {
      setError('6자리 코드를 입력해주세요.');
      return;
    }

    // 데모 모드: 아무 코드나 입력하면 데모 비교 결과 표시
    // 실제 구현에서는 서버에서 친구 결과를 가져와야 함
    // validateInviteCode는 localStorage 기반이라 다른 기기 코드 조회 불가
    const demoFriendResult = getDemoFriendResult(testType);
    const demoFriendScores = getDemoFriendScores(myScores);

    const result = friendService.compareResultsWithScores(
      testType,
      myResult,
      demoFriendResult.name,
      myScores,
      demoFriendScores
    );

    setComparison({
      ...result,
      friendResult: demoFriendResult.name,
    });
    setStep('result');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-50 rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl">
        {/* 헤더 */}
        <div className="sticky top-0 bg-slate-50 border-b border-subtle px-4 py-3 flex items-center justify-between">
          <h2 className="font-bold text-primary flex items-center gap-2">
            <Users className="w-5 h-5 text-pink-500" />
            친구와 비교하기
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>

        <div className="p-5">
          {/* 내 결과 표시 */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-5">
            <div className="text-xs text-gray-500 mb-1">나의 {testName} 결과</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{myResultEmoji}</span>
              <span className="font-bold text-gray-900">{myResult}</span>
            </div>
          </div>

          {/* Step: 초대 */}
          {step === 'invite' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                친구에게 초대 코드를 보내고<br />
                결과를 비교해보세요!
              </p>

              {!inviteCode ? (
                <button
                  onClick={handleCreateInvite}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  초대 코드 만들기
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-xs text-gray-500 mb-1">초대 코드</div>
                    <div className="text-2xl font-mono font-bold text-purple-600 tracking-wider">
                      {inviteCode}
                    </div>
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="w-full py-3 bg-slate-50 border border-purple-200 text-purple-700 font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        복사 완료!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        초대 링크 복사
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">또는</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <button
                onClick={() => setStep('input')}
                className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl"
              >
                친구 코드 입력하기
              </button>
            </div>
          )}

          {/* Step: 코드 입력 */}
          {step === 'input' && (
            <div className="space-y-4">
              {/* 데모 모드 안내 */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-center">
                <span className="text-xs text-amber-700">
                  🧪 데모 모드 - 아무 6자리 코드로 체험해보세요
                </span>
              </div>

              <p className="text-sm text-gray-600 text-center">
                친구에게 받은 코드를 입력하세요
              </p>

              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="코드 입력"
                maxLength={6}
                className="w-full px-4 py-3 text-center font-mono text-xl uppercase tracking-wider border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <button
                onClick={handleCompare}
                disabled={inputCode.length < 6}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                비교하기 <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setStep('invite');
                  setInputCode('');
                  setError('');
                }}
                className="w-full py-2 text-sm text-gray-400"
              >
                뒤로가기
              </button>
            </div>
          )}

          {/* Step: 비교 결과 */}
          {step === 'result' && comparison && (
            <div className="space-y-4">
              {/* 매칭 점수 */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 mb-3">
                  <span className="text-3xl font-black text-purple-600">
                    {comparison.matchScore}%
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">
                  {comparison.matchScore >= 80 ? '찰떡궁합!' :
                    comparison.matchScore >= 60 ? '잘 맞는 편!' :
                      comparison.matchScore >= 40 ? '적당히 다름' : '정반대?!'}
                </h3>
              </div>

              {/* VS 비교 */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <div className="text-center flex-1">
                  <div className="text-2xl mb-1">{myResultEmoji}</div>
                  <div className="text-xs text-gray-500">나</div>
                  <div className="font-bold text-sm text-gray-900">{myResult}</div>
                </div>
                <div className="text-xl font-black text-gray-300">VS</div>
                <div className="text-center flex-1">
                  <div className="text-2xl mb-1">👤</div>
                  <div className="text-xs text-gray-500">친구</div>
                  <div className="font-bold text-sm text-gray-900">{comparison.friendResult}</div>
                </div>
              </div>

              {/* 차원별 비교 */}
              {comparison.dimensionMatches.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-gray-500">차원별 유사도</div>
                  {comparison.dimensionMatches.slice(0, 5).map(({ dimension, similarity }) => {
                    const dimInfo = dimensions[dimension];
                    return (
                      <div key={dimension} className="flex items-center gap-2">
                        <span className="text-sm">{dimInfo?.emoji || '📊'}</span>
                        <span className="text-xs text-gray-600 w-16 truncate">
                          {dimInfo?.name || dimension}
                        </span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${similarity >= 70 ? 'bg-green-400' :
                              similarity >= 40 ? 'bg-yellow-400' : 'bg-red-400'
                              }`}
                            style={{ width: `${similarity}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-600 w-10 text-right">
                          {similarity}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 인사이트 */}
              <div className="space-y-2">
                {comparison.insights.map((insight, idx) => (
                  <div key={idx} className="bg-purple-50 text-purple-700 text-sm px-3 py-2 rounded-lg">
                    {insight}
                  </div>
                ))}
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl"
              >
                닫기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 데모용 친구 결과 생성 (실제로는 서버에서 가져와야 함)
function getDemoFriendResult(testType: string): { name: string; emoji: string } {
  const demoResults: Record<string, Array<{ name: string; emoji: string }>> = {
    human: [
      { name: '열정적인 모험가', emoji: '🔥' },
      { name: '차분한 전략가', emoji: '🧠' },
      { name: '따뜻한 조력자', emoji: '💕' },
    ],
    cat: [
      { name: '도도한 귀족냥', emoji: '👑' },
      { name: '호기심 탐험냥', emoji: '🔍' },
      { name: '애교 만렙냥', emoji: '😻' },
    ],
    dog: [
      { name: '충성스런 수호견', emoji: '🛡️' },
      { name: '활발한 장난꾸러기', emoji: '🎾' },
      { name: '온순한 힐링독', emoji: '🌿' },
    ],
  };

  const results = demoResults[testType] || demoResults.human;
  return results[Math.floor(Math.random() * results.length)];
}

// 데모용 친구 점수 생성
function getDemoFriendScores(myScores: Record<string, number>): Record<string, number> {
  const friendScores: Record<string, number> = {};
  for (const [dim, score] of Object.entries(myScores)) {
    // ±30% 범위 내에서 랜덤 변동
    const variation = (Math.random() - 0.5) * 0.6;
    friendScores[dim] = Math.max(0, Math.min(100, Math.round(score * (1 + variation))));
  }
  return friendScores;
}
