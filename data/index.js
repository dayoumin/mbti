// 케미 테스트 데이터 통합 모듈
// 생성일: 2025-12-11
//
// 이 파일은 모든 subject 데이터를 CHEMI_DATA로 통합합니다.
// 개별 파일들이 먼저 로드된 후 이 파일이 로드되어야 합니다.

(function() {
    // CHEMI_SUBJECTS에서 CHEMI_DATA로 통합
    const CHEMI_DATA = {};

    if (window.CHEMI_SUBJECTS) {
        Object.keys(window.CHEMI_SUBJECTS).forEach(key => {
            CHEMI_DATA[key] = window.CHEMI_SUBJECTS[key];
        });
    }

    // 전역 노출
    window.CHEMI_DATA = CHEMI_DATA;

    console.log('CHEMI_DATA loaded:', Object.keys(CHEMI_DATA));
})();
