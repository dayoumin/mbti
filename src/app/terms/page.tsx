'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* 헤더 */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-slate-100 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="font-bold text-slate-800">이용약관</h1>
        </div>
      </header>

      {/* 본문 */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="prose prose-slate prose-sm max-w-none">

          <p className="text-slate-500 text-sm mb-8">
            시행일: 2025년 1월 1일
          </p>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4">1. 서비스 소개</h2>
            <p className="text-slate-600">
              케미테스트(이하 &quot;서비스&quot;)는 재미와 자기 이해를 위한 성격/궁합 테스트를 제공합니다.
              회원가입 없이 누구나 무료로 이용할 수 있습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4">2. 서비스 이용</h2>

            <h3 className="font-bold text-slate-700 mt-4 mb-2">이용 가능 범위</h3>
            <ul className="list-disc pl-5 text-slate-600 space-y-1">
              <li>성격/궁합 테스트 참여</li>
              <li>퀴즈 및 투표 참여</li>
              <li>테스트 결과 저장 및 공유</li>
              <li>커뮤니티 콘텐츠 열람</li>
            </ul>

            <h3 className="font-bold text-slate-700 mt-4 mb-2">금지 행위</h3>
            <ul className="list-disc pl-5 text-slate-600 space-y-1">
              <li>서비스의 정상적인 운영을 방해하는 행위</li>
              <li>자동화된 수단을 이용한 대량 접근</li>
              <li>타인에게 피해를 주는 콘텐츠 공유</li>
              <li>서비스 콘텐츠의 무단 복제/배포</li>
            </ul>
          </section>

          {/* 면책 조항 - 중요! */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4">3. 면책 조항</h2>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <p className="text-amber-800 font-bold mb-2">중요 안내</p>
              <p className="text-amber-700 text-sm">
                본 서비스의 모든 테스트는 <strong>재미와 자기 이해</strong>를 위한 것으로,
                <strong>전문적인 심리 검사나 의학적 진단을 대체하지 않습니다.</strong>
              </p>
            </div>

            <ul className="list-disc pl-5 text-slate-600 space-y-2">
              <li>
                테스트 결과는 과학적으로 검증된 심리 검사가 아닙니다.
                결과를 중요한 의사결정에 사용하지 마세요.
              </li>
              <li>
                심리적 어려움이 있다면 전문 상담사나 의료 전문가와 상담하시기 바랍니다.
              </li>
              <li>
                테스트 결과의 정확성이나 적합성에 대해 보증하지 않습니다.
              </li>
              <li>
                서비스 이용으로 인한 직/간접적 손해에 대해 책임지지 않습니다.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4">4. 지적재산권</h2>
            <p className="text-slate-600 mb-4">
              서비스 내 콘텐츠(테스트 문항, 결과 설명, 이미지 등)에 대한
              지적재산권은 서비스 운영자에게 있습니다.
            </p>
            <ul className="list-disc pl-5 text-slate-600 space-y-1">
              <li>개인적인 용도로 결과를 공유하는 것은 허용됩니다.</li>
              <li>상업적 목적의 콘텐츠 사용은 사전 허가가 필요합니다.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4">5. 서비스 변경 및 중단</h2>
            <p className="text-slate-600">
              서비스는 사전 공지 없이 변경되거나 중단될 수 있습니다.
              중요한 변경 사항은 서비스 내 공지를 통해 안내드립니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4">6. 분쟁 해결</h2>
            <p className="text-slate-600">
              서비스 이용과 관련한 분쟁은 대한민국 법률에 따르며,
              관할 법원은 서울중앙지방법원으로 합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4">7. 문의</h2>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-600">
                이메일: support@chemitest.com
              </p>
            </div>
          </section>

        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-slate-100 py-6">
        <div className="max-w-2xl mx-auto px-4 flex justify-center gap-4">
          <Link href="/privacy" className="text-sm text-slate-500 hover:text-slate-700">
            개인정보처리방침
          </Link>
          <span className="text-slate-300">|</span>
          <Link href="/" className="text-sm text-indigo-500 hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </footer>
    </div>
  );
}
