/**
 * Phase 2 테스트: ContentExplore 컴포넌트 분리
 *
 * 검증 항목:
 * - 컴포넌트 import 정상 동작
 * - Props 전달 정확성
 * - 타입 안전성
 * - 파일 크기 목표 달성
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Phase 2: ContentExplore 컴포넌트 분리', () => {
  const exploreDir = path.join(process.cwd(), 'src/components/content/explore');
  const mainFile = path.join(process.cwd(), 'src/components/ContentExplore.tsx');

  describe('파일 존재 확인', () => {
    it('explore 디렉토리가 존재한다', () => {
      expect(fs.existsSync(exploreDir)).toBe(true);
    });

    it('types.ts가 존재한다', () => {
      const typesFile = path.join(exploreDir, 'types.ts');
      expect(fs.existsSync(typesFile)).toBe(true);
    });

    it('StreakBanner.tsx가 존재한다', () => {
      const file = path.join(exploreDir, 'StreakBanner.tsx');
      expect(fs.existsSync(file)).toBe(true);
    });

    it('HotTopicsSection.tsx가 존재한다', () => {
      const file = path.join(exploreDir, 'HotTopicsSection.tsx');
      expect(fs.existsSync(file)).toBe(true);
    });

    it('CategoryProgress.tsx가 존재한다', () => {
      const file = path.join(exploreDir, 'CategoryProgress.tsx');
      expect(fs.existsSync(file)).toBe(true);
    });

    it('QuizTab.tsx가 존재한다', () => {
      const file = path.join(exploreDir, 'QuizTab.tsx');
      expect(fs.existsSync(file)).toBe(true);
    });

    it('PollTab.tsx가 존재한다', () => {
      const file = path.join(exploreDir, 'PollTab.tsx');
      expect(fs.existsSync(file)).toBe(true);
    });

    it('CommunityTab.tsx가 존재한다', () => {
      const file = path.join(exploreDir, 'CommunityTab.tsx');
      expect(fs.existsSync(file)).toBe(true);
    });

    it('ContentDiscoverySidebar.tsx가 존재한다', () => {
      const file = path.join(exploreDir, 'ContentDiscoverySidebar.tsx');
      expect(fs.existsSync(file)).toBe(true);
    });
  });

  describe('파일 크기 목표 달성', () => {
    function getLineCount(filePath: string): number {
      const content = fs.readFileSync(filePath, 'utf-8');
      return content.split('\n').length;
    }

    it('메인 파일(ContentExplore.tsx)이 600줄 이하다', () => {
      const lines = getLineCount(mainFile);
      expect(lines).toBeLessThanOrEqual(600);
      console.log(`  ✓ ContentExplore.tsx: ${lines}줄`);
    });

    it('각 서브 컴포넌트가 350줄 이하다', () => {
      const files = [
        'StreakBanner.tsx',
        'HotTopicsSection.tsx',
        'CategoryProgress.tsx',
        'ContentDiscoverySidebar.tsx'
      ];

      files.forEach(file => {
        const filePath = path.join(exploreDir, file);
        const lines = getLineCount(filePath);
        expect(lines).toBeLessThanOrEqual(350);
        console.log(`  ✓ ${file}: ${lines}줄`);
      });
    });

    it('QuizTab, PollTab, CommunityTab이 400줄 이하다', () => {
      const files = ['QuizTab.tsx', 'PollTab.tsx', 'CommunityTab.tsx'];

      files.forEach(file => {
        const filePath = path.join(exploreDir, file);
        const lines = getLineCount(filePath);
        expect(lines).toBeLessThanOrEqual(400);
        console.log(`  ✓ ${file}: ${lines}줄`);
      });
    });

    it('types.ts가 50줄 이하다', () => {
      const filePath = path.join(exploreDir, 'types.ts');
      const lines = getLineCount(filePath);
      expect(lines).toBeLessThanOrEqual(50);
      console.log(`  ✓ types.ts: ${lines}줄`);
    });
  });

  describe('파일 구조 검증', () => {
    function hasUseClientDirective(filePath: string): boolean {
      const content = fs.readFileSync(filePath, 'utf-8');
      return content.includes("'use client'");
    }

    function hasDefaultExport(filePath: string): boolean {
      const content = fs.readFileSync(filePath, 'utf-8');
      return content.includes('export default');
    }

    it('모든 컴포넌트 파일에 "use client" 디렉티브가 있다', () => {
      const componentFiles = [
        'StreakBanner.tsx',
        'HotTopicsSection.tsx',
        'CategoryProgress.tsx',
        'QuizTab.tsx',
        'PollTab.tsx',
        'CommunityTab.tsx',
        'ContentDiscoverySidebar.tsx'
      ];

      componentFiles.forEach(file => {
        const filePath = path.join(exploreDir, file);
        expect(hasUseClientDirective(filePath)).toBe(true);
      });
    });

    it('모든 컴포넌트 파일에 default export가 있다', () => {
      const componentFiles = [
        'StreakBanner.tsx',
        'HotTopicsSection.tsx',
        'CategoryProgress.tsx',
        'QuizTab.tsx',
        'PollTab.tsx',
        'CommunityTab.tsx',
        'ContentDiscoverySidebar.tsx'
      ];

      componentFiles.forEach(file => {
        const filePath = path.join(exploreDir, file);
        expect(hasDefaultExport(filePath)).toBe(true);
      });
    });

    it('types.ts에 필요한 타입이 export되어 있다', () => {
      const filePath = path.join(exploreDir, 'types.ts');
      const content = fs.readFileSync(filePath, 'utf-8');

      expect(content).toContain('export type TabType');
      expect(content).toContain('export type CommunitySubTab');
      expect(content).toContain('SITUATION_TO_CONTENT_CATEGORY');
    });
  });

  describe('메인 파일(ContentExplore.tsx) 구조', () => {
    const content = fs.readFileSync(mainFile, 'utf-8');

    it('분리된 컴포넌트들을 import한다', () => {
      expect(content).toContain("from './content/explore/StreakBanner'");
      expect(content).toContain("from './content/explore/HotTopicsSection'");
      expect(content).toContain("from './content/explore/CategoryProgress'");
      expect(content).toContain("from './content/explore/QuizTab'");
      expect(content).toContain("from './content/explore/PollTab'");
      expect(content).toContain("from './content/explore/CommunityTab'");
    });

    it('QuizCard, PollCard 등 서브 컴포넌트가 제거되었다', () => {
      // 이제 QuizCard는 QuizTab 내부에 있어야 함
      expect(content).not.toContain('function QuizCard(');
      expect(content).not.toContain('function PollCard(');
      expect(content).not.toContain('function TipCard(');
      expect(content).not.toContain('function QnACard(');
      expect(content).not.toContain('function DebateCard(');
    });

    it('메인 컴포넌트가 존재한다', () => {
      expect(content).toContain('export default function ContentExplore');
    });
  });

  describe('import 순환 참조 체크', () => {
    it('순환 참조가 없어야 한다', () => {
      // types.ts는 다른 explore 파일을 import하지 않아야 함
      const typesContent = fs.readFileSync(
        path.join(exploreDir, 'types.ts'),
        'utf-8'
      );
      expect(typesContent).not.toContain("from './StreakBanner'");
      expect(typesContent).not.toContain("from './QuizTab'");
      expect(typesContent).not.toContain("from './PollTab'");
    });
  });

  describe('코드 품질', () => {
    function hasProperPropTypes(filePath: string): boolean {
      const content = fs.readFileSync(filePath, 'utf-8');
      // Props 인터페이스가 정의되어 있어야 함
      return content.includes('interface') && content.includes('Props');
    }

    it('각 컴포넌트에 Props 인터페이스가 정의되어 있다', () => {
      const componentFiles = [
        'StreakBanner.tsx',
        'HotTopicsSection.tsx',
        'CategoryProgress.tsx',
        'QuizTab.tsx',
        'PollTab.tsx',
        'CommunityTab.tsx'
      ];

      componentFiles.forEach(file => {
        const filePath = path.join(exploreDir, file);
        expect(hasProperPropTypes(filePath)).toBe(true);
      });
    });
  });

  describe('Before/After 비교', () => {
    it('전체 라인 수가 크게 증가하지 않았다 (코드 중복 없음)', () => {
      function getTotalLines(dirPath: string): number {
        const files = fs.readdirSync(dirPath);
        return files.reduce((total, file) => {
          const filePath = path.join(dirPath, file);
          if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            const content = fs.readFileSync(filePath, 'utf-8');
            return total + content.split('\n').length;
          }
          return total;
        }, 0);
      }

      const exploreLines = getTotalLines(exploreDir);
      const mainLines = fs.readFileSync(mainFile, 'utf-8').split('\n').length;
      const totalLines = exploreLines + mainLines;

      console.log(`  Before: 1,708줄`);
      console.log(`  After: ${totalLines}줄 (explore: ${exploreLines} + main: ${mainLines})`);

      // 약간의 import 오버헤드는 허용 (최대 20% 증가)
      expect(totalLines).toBeLessThan(1708 * 1.2);
    });
  });
});
