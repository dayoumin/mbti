'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* 헤더 */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-slate-100 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="font-bold text-slate-800">개인정보처리방침</h1>
        </div>
      </header>

      {/* 본문 */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="prose prose-slate prose-sm max-w-none">

          <p className="text-slate-500 text-sm mb-8">
            시행일: 2025년 1월 1일
          </p>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4">1. 수집하는 정보</h2>
            <p className="text-slate-600 mb-4">
              케미테스트(이하 &quot;서비스&quot;)는 회원가입 없이 이용 가능한 서비스로,
              최소한의 정보만 수집합니다.
            </p>

            <h3 className="font-bold text-slate-700 mt-4 mb-2">자동 수집 정보</h3>
            <ul className="list-disc pl-5 text-slate-600 space-y-1">
              <li><strong>기기 식별자</strong>: 익명의 랜덤 ID (브라우저별 생성)</li>
              <li><strong>기기 정보</strong>: 브라우저 종류, 화면 크기</li>
              <li><strong>이용 기록</strong>: 테스트 결과, 퀴즈/투표 참여 내역, 클릭 이벤트</li>
            </ul>

            <div className="bg-blue-50 rounded-xl p-4 mt-4">
              <p className="text-sm text-blue-700">
                <strong>참고:</strong> 이름, 이메일, 전화번호 등 개인을 직접 식별할 수 있는
                정보는 수집하지 않습니다.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4">2. 수집 목적</h2>
            <ul className="list-disc pl-5 text-slate-600 space-y-1">
              <li>테스트 결과 저장 및 히스토리 제공</li>
              <li>맞춤형 콘텐츠 추천</li>
              <li>서비스 이용 통계 및 개선</li>
              <li>오류 분석 및 서비스 안정화</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4">3. 보관 기간</h2>
            <ul className="list-disc pl-5 text-slate-600 space-y-1">
              <li><strong>테스트 결과</strong>: 사용자 삭제 요청 시까지</li>
              <li><strong>이용 통계</strong>: 수집 후 1년</li>
              <li><strong>클릭 이벤트</strong>: 수집 후 30일</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4">4. 제3자 제공</h2>
            <p className="text-slate-600 mb-4">
              수집된 정보는 다음의 경우를 제외하고 제3자에게 제공되지 않습니다.
            </p>
            <ul className="list-disc pl-5 text-slate-600 space-y-1">
              <li>법령에 의한 요청이 있는 경우</li>
              <li>서비스 제공을 위한 필수적인 경우 (데이터베이스 호스팅)</li>
            </ul>

            <h3 className="font-bold text-slate-700 mt-4 mb-2">위탁 업체</h3>
            <div className="bg-slate-50 rounded-xl p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 text-slate-600">업체명</th>
                    <th className="text-left py-2 text-slate-600">위탁 업무</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 text-slate-700">Supabase</td>
                    <td className="py-2 text-slate-700">데이터베이스 호스팅</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-700">Vercel</td>
                    <td className="py-2 text-slate-700">웹 호스팅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4">5. 이용자의 권리</h2>
            <p className="text-slate-600 mb-4">
              이용자는 다음의 권리를 행사할 수 있습니다.
            </p>
            <ul className="list-disc pl-5 text-slate-600 space-y-1">
              <li><strong>데이터 삭제</strong>: 브라우저 설정에서 사이트 데이터 삭제</li>
              <li><strong>수집 거부</strong>: 브라우저의 쿠키/저장소 차단 기능 사용</li>
            </ul>

            <div className="bg-amber-50 rounded-xl p-4 mt-4">
              <p className="text-sm text-amber-700">
                <strong>데이터 삭제 방법:</strong> 브라우저 설정 → 개인정보 보호 →
                사이트 데이터 삭제에서 본 사이트의 데이터를 삭제할 수 있습니다.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4">6. 쿠키 및 로컬 저장소</h2>
            <p className="text-slate-600 mb-4">
              본 서비스는 쿠키 대신 브라우저의 로컬 저장소(localStorage)를 사용합니다.
            </p>
            <ul className="list-disc pl-5 text-slate-600 space-y-1">
              <li>테스트 결과 저장</li>
              <li>사용자 설정 저장</li>
              <li>익명 식별자 저장</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4">7. 보안</h2>
            <p className="text-slate-600">
              수집된 정보는 암호화된 통신(HTTPS)을 통해 전송되며,
              접근 권한이 제한된 데이터베이스에 안전하게 저장됩니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4">8. 문의</h2>
            <p className="text-slate-600">
              개인정보 처리에 관한 문의사항은 아래로 연락해 주세요.
            </p>
            <div className="bg-slate-50 rounded-xl p-4 mt-4">
              <p className="text-sm text-slate-600">
                이메일: privacy@chemitest.com
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4">9. 변경 사항</h2>
            <p className="text-slate-600">
              본 방침이 변경될 경우, 서비스 내 공지를 통해 안내드립니다.
              중요한 변경 사항은 시행 7일 전에 공지됩니다.
            </p>
          </section>

        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-slate-100 py-6">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Link href="/" className="text-sm text-indigo-500 hover:underline">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </footer>
    </div>
  );
}
