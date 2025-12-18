'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Download, Share2, Copy, Check, X, Users, MessageCircle } from 'lucide-react';
import { kakaoShareService } from '@/services/KakaoShareService';
import { generateShareUrl, type SharePlatform } from '@/utils';

interface ShareCardProps {
  testTitle: string;
  testKey?: string; // UTM 추적용 테스트 키 (예: 'dog', 'cat')
  resultName: string;
  resultEmoji: string;
  resultDesc: string;
  dimensions?: Record<string, { name: string; emoji: string }>;
  scores?: Record<string, number>;
  maxScores?: Record<string, number>; // 차원별 최대 점수 (없으면 25 기본값)
  onClose: () => void;
  onCompare?: () => void;
}

export default function ShareCard({
  testTitle,
  testKey,
  resultName,
  resultEmoji,
  resultDesc,
  dimensions,
  scores,
  maxScores,
  onClose,
  onCompare,
}: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(true);
  const [kakaoReady, setKakaoReady] = useState(false);

  // 카카오 SDK 초기화
  useEffect(() => {
    const initKakao = async () => {
      // 환경변수에서 앱키 가져오기 (없으면 비활성화 상태로 유지)
      const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;
      if (kakaoAppKey) {
        const ready = await kakaoShareService.init(kakaoAppKey);
        setKakaoReady(ready);
      }
    };
    initKakao();
  }, []);

  // 캔버스에 결과 카드 그리기
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 크기 설정 (인스타 스토리 비율 9:16 기준, 축소)
    const width = 540;
    const height = 720;
    canvas.width = width;
    canvas.height = height;

    // 배경 그라디언트
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(0.5, '#764ba2');
    gradient.addColorStop(1, '#f093fb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 배경 장식 원
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.arc(width * 0.8, height * 0.2, 150, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width * 0.2, height * 0.8, 100, 0, Math.PI * 2);
    ctx.fill();

    // 카드 배경
    const cardX = 30;
    const cardY = 80;
    const cardW = width - 60;
    const cardH = height - 160;
    const cardRadius = 24;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, cardRadius);
    ctx.fill();

    // 그림자 효과
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 10;

    // 상단 라벨
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(testTitle + ' 결과', width / 2, cardY + 40);

    // 이모지
    ctx.font = '72px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(resultEmoji, width / 2, cardY + 140);

    // 결과 이름
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(resultName, width / 2, cardY + 200);

    // 설명
    ctx.fillStyle = '#64748b';
    ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';

    // 텍스트 줄바꿈 처리
    const maxWidth = cardW - 60;
    const words = resultDesc.split(' ');
    let line = '';
    let y = cardY + 250;
    const lineHeight = 24;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line.trim(), width / 2, y);
        line = words[i] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), width / 2, y);

    // 차원별 점수 (있는 경우)
    if (dimensions && scores) {
      const dimEntries = Object.entries(dimensions).slice(0, 5);
      const barY = cardY + 340;
      const barHeight = 8;
      const barWidth = cardW - 80;
      const barX = cardX + 40;

      dimEntries.forEach(([key, dim], idx) => {
        const score = Math.max(0, scores[key] || 0); // 음수 방지
        const maxScore = maxScores?.[key] ?? 25; // 동적 maxScore, 기본값 25
        const percentage = maxScore > 0 ? Math.min((score / maxScore) * 100, 100) : 0;
        const currentY = barY + idx * 50;

        // 라벨
        ctx.fillStyle = '#475569';
        ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`${dim.emoji} ${dim.name}`, barX, currentY);

        // 퍼센트
        ctx.textAlign = 'right';
        ctx.fillStyle = '#6366f1';
        ctx.fillText(`${Math.round(percentage)}%`, barX + barWidth, currentY);

        // 바 배경
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.roundRect(barX, currentY + 8, barWidth, barHeight, 4);
        ctx.fill();

        // 바 값
        const colors = ['#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
        ctx.fillStyle = colors[idx % colors.length];
        ctx.beginPath();
        ctx.roundRect(barX, currentY + 8, (barWidth * percentage) / 100, barHeight, 4);
        ctx.fill();
      });
    }

    // 하단 CTA
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👆 나도 테스트하기', width / 2, cardY + cardH - 40);

    // 로고/브랜드
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('chemi.app', width / 2, height - 30);

    // 이미지 URL 생성
    const url = canvas.toDataURL('image/png');
    setImageUrl(url);
    setGenerating(false);
  }, [testTitle, resultName, resultEmoji, resultDesc, dimensions, scores, maxScores]);

  // 파일명에서 특수문자 제거
  const sanitizeFileName = (name: string): string => {
    return name.replace(/[/\\:*?"<>|]/g, '_');
  };

  // 이미지 다운로드
  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.download = `${sanitizeFileName(testTitle)}_결과_${sanitizeFileName(resultName)}.png`;
    link.href = imageUrl;
    link.click();
  };

  // UTM이 적용된 공유 URL 생성
  const getShareUrl = (platform: SharePlatform): string => {
    const baseUrl = `${window.location.origin}?test=${encodeURIComponent(testTitle)}`;
    return generateShareUrl(baseUrl, platform, 'test-result', testKey || testTitle);
  };

  // 링크 복사
  const handleCopyLink = async () => {
    const shareUrl = getShareUrl('link_copy');
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // 네이티브 공유
  const handleShare = async () => {
    if (!imageUrl) return;

    const shareUrl = getShareUrl('native_share');
    const shareData = {
      title: `${testTitle} 결과: ${resultName}`,
      text: `${resultEmoji} ${resultName}\n"${resultDesc}"\n\n나도 테스트하러 가기 👇`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  // 카카오톡 공유
  const handleKakaoShare = async () => {
    if (!kakaoReady) {
      // 카카오 미설정 시 일반 공유로 폴백
      handleShare();
      return;
    }

    const shareUrl = getShareUrl('kakao');
    await kakaoShareService.shareTestResult({
      testTitle,
      resultEmoji,
      resultName,
      resultDesc,
      linkUrl: shareUrl,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">결과 공유하기</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 카드 미리보기 */}
        <div className="p-4 bg-slate-50 flex justify-center">
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="rounded-xl shadow-lg"
              style={{ width: 270, height: 360 }}
            />
            {generating && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
              </div>
            )}
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="p-4 space-y-3">
          {/* 메인 버튼: 친구와 비교하기 */}
          {onCompare && (
            <button
              onClick={onCompare}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Users className="w-5 h-5" />
              친구와 비교하기
            </button>
          )}

          {/* 공유 버튼들 */}
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={handleDownload}
              disabled={!imageUrl}
              className="py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex flex-col items-center gap-1 text-xs disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              저장
            </button>
            <button
              onClick={handleCopyLink}
              className="py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex flex-col items-center gap-1 text-xs"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              {copied ? '복사됨!' : '링크'}
            </button>
            <button
              onClick={handleKakaoShare}
              className="py-3 rounded-xl bg-[#FEE500] hover:bg-[#FDD835] text-[#3C1E1E] font-medium flex flex-col items-center gap-1 text-xs"
            >
              <MessageCircle className="w-5 h-5" />
              카톡
            </button>
            <button
              onClick={handleShare}
              disabled={!imageUrl}
              className="py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium flex flex-col items-center gap-1 text-xs disabled:opacity-50"
            >
              <Share2 className="w-5 h-5" />
              더보기
            </button>
          </div>

          {/* 안내 문구 */}
          {!kakaoReady && (
            <p className="text-center text-xs text-slate-400 mt-2">
              카카오톡 공유는 앱 설정 후 사용 가능합니다
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
