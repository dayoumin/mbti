import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// ============================================================================
// Types
// ============================================================================

interface Fact {
  id: string;
  title: string;
  value: string;
  source: string;
  url?: string;
  verifiedDate: string;
  usedIn: string[];
  note?: string;
}

interface CategoryFacts {
  category: string;
  label: string;
  emoji: string;
  lastUpdated: string;
  facts: Fact[];
}

// ============================================================================
// Category Config
// ============================================================================

const CATEGORY_CONFIG: Record<string, { label: string; emoji: string }> = {
  cat: { label: '고양이', emoji: '🐱' },
  dog: { label: '강아지', emoji: '🐕' },
  rabbit: { label: '토끼', emoji: '🐰' },
  hamster: { label: '햄스터', emoji: '🐹' },
  plant: { label: '식물', emoji: '🌿' },
  coffee: { label: '커피', emoji: '☕' },
  alcohol: { label: '주류', emoji: '🥃' },
};

// ============================================================================
// Markdown Parser
// ============================================================================

function parseFactsMarkdown(content: string, category: string): Fact[] {
  const facts: Fact[] = [];

  // Split by fact sections (## {id}: {title})
  const sections = content.split(/^## /gm).filter(Boolean);

  for (const section of sections) {
    // Skip if not a fact section
    if (!section.includes('-fact-')) continue;

    const lines = section.split('\n');
    const headerMatch = lines[0].match(/^([a-z]+-fact-\d+):\s*(.+)$/);

    if (!headerMatch) continue;

    const [, id, title] = headerMatch;

    const fact: Fact = {
      id,
      title: title.trim(),
      value: '',
      source: '',
      verifiedDate: '',
      usedIn: [],
    };

    // Parse fields
    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith('- **값**:')) {
        fact.value = trimmed.replace('- **값**:', '').trim();
      } else if (trimmed.startsWith('- **출처**:')) {
        fact.source = trimmed.replace('- **출처**:', '').trim();
      } else if (trimmed.startsWith('- **URL**:')) {
        fact.url = trimmed.replace('- **URL**:', '').trim();
      } else if (trimmed.startsWith('- **검증일**:')) {
        fact.verifiedDate = trimmed.replace('- **검증일**:', '').trim();
      } else if (trimmed.startsWith('- **사용된 콘텐츠**:')) {
        const usedInStr = trimmed.replace('- **사용된 콘텐츠**:', '').trim();
        fact.usedIn = usedInStr.split(',').map(s => s.trim()).filter(Boolean);
      } else if (trimmed.startsWith('- **비고**:')) {
        fact.note = trimmed.replace('- **비고**:', '').trim();
      }
    }

    // Only add if essential fields exist
    if (fact.id && fact.value && fact.source) {
      facts.push(fact);
    }
  }

  return facts;
}

function extractLastUpdated(content: string): string {
  const match = content.match(/최종 업데이트:\s*(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : new Date().toISOString().split('T')[0];
}

// ============================================================================
// API Handler
// ============================================================================

export async function GET() {
  try {
    const factsDir = path.join(process.cwd(), 'research', 'facts');

    // Check if directory exists
    try {
      await fs.access(factsDir);
    } catch {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Facts directory not found'
      });
    }

    // Read all .md files (except README.md)
    const files = await fs.readdir(factsDir);
    const mdFiles = files.filter(f => f.endsWith('.md') && f !== 'README.md');

    const allFacts: CategoryFacts[] = [];

    for (const file of mdFiles) {
      const category = file.replace('.md', '');
      const config = CATEGORY_CONFIG[category];

      if (!config) continue;

      const filePath = path.join(factsDir, file);
      const content = await fs.readFile(filePath, 'utf-8');

      const facts = parseFactsMarkdown(content, category);
      const lastUpdated = extractLastUpdated(content);

      if (facts.length > 0) {
        allFacts.push({
          category,
          label: config.label,
          emoji: config.emoji,
          lastUpdated,
          facts,
        });
      }
    }

    // Sort by category name
    allFacts.sort((a, b) => a.category.localeCompare(b.category));

    return NextResponse.json({
      success: true,
      data: allFacts,
      stats: {
        categories: allFacts.length,
        totalFacts: allFacts.reduce((sum, c) => sum + c.facts.length, 0),
      },
    });

  } catch (error) {
    console.error('Failed to parse facts:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to parse facts files',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
