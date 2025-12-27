#!/usr/bin/env node
/**
 * Export all character data to portable formats for the new lesson narratives project.
 *
 * Outputs:
 * - exports/all-characters.json  - Complete consolidated data
 * - exports/lessons-summary.md   - Markdown summaries for AI prompting
 * - exports/characters.csv       - CSV for spreadsheet work
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../lib/data');
const EXPORT_DIR = path.join(__dirname, '../exports');

// Ensure export directory exists
if (!fs.existsSync(EXPORT_DIR)) {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
}

console.log('📚 Consolidating lesson data...\n');

// Load all lessons
const lessons = [];
let totalCharacters = 0;

for (let i = 1; i <= 112; i++) {
  const filePath = path.join(DATA_DIR, `lesson${i}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    lessons.push(data);
    totalCharacters += data.characters.length;
    console.log(`  ✓ Lesson ${i}: ${data.characters.length} characters`);
  }
}

console.log(`\n📊 Total: ${lessons.length} lessons, ${totalCharacters} characters\n`);

// === Export 1: Consolidated JSON ===
console.log('💾 Writing all-characters.json...');
const consolidatedJson = {
  meta: {
    exportedAt: new Date().toISOString(),
    totalLessons: lessons.length,
    totalCharacters: totalCharacters,
    source: 'chinese-characters-game',
    format: 'RTH Traditional Hanzi mnemonics',
  },
  lessons: lessons,
};
fs.writeFileSync(
  path.join(EXPORT_DIR, 'all-characters.json'),
  JSON.stringify(consolidatedJson, null, 2)
);

// === Export 2: Markdown Summary (for AI prompting) ===
console.log('📝 Writing lessons-summary.md...');
let markdown = `# RTH Character Data - All ${totalCharacters} Characters

> Exported: ${new Date().toISOString()}
> Total Lessons: ${lessons.length}
> Total Characters: ${totalCharacters}

---

`;

for (const lesson of lessons) {
  const chars = lesson.characters.map((c) => c.character).join('');
  const meanings = lesson.characters.map((c) => c.meaning).join(', ');

  markdown += `## Lesson ${lesson.lesson} (${lesson.characters.length} characters)

**Characters:** ${chars}

**Meanings:** ${meanings}

| # | Char | Pinyin | Tone | Meaning | Story |
|---|------|--------|------|---------|-------|
`;

  for (const char of lesson.characters) {
    // Escape pipe characters in story
    const story = char.story.replace(/\|/g, '\\|').replace(/\n/g, ' ');
    markdown += `| ${char.id} | ${char.character} | ${char.pinyin} | ${char.tone} | ${char.meaning} | ${story} |\n`;
  }

  markdown += '\n---\n\n';
}

fs.writeFileSync(path.join(EXPORT_DIR, 'lessons-summary.md'), markdown);

// === Export 3: CSV for spreadsheet work ===
console.log('📊 Writing characters.csv...');
let csv = 'lesson,id,character,pinyin,tone,meaning,story,primitives\n';

for (const lesson of lessons) {
  for (const char of lesson.characters) {
    const escapeCsv = (str) => `"${String(str).replace(/"/g, '""')}"`;
    csv +=
      [
        lesson.lesson,
        char.id,
        escapeCsv(char.character),
        escapeCsv(char.pinyin),
        char.tone,
        escapeCsv(char.meaning),
        escapeCsv(char.story),
        escapeCsv(char.primitives.join('; ')),
      ].join(',') + '\n';
  }
}

fs.writeFileSync(path.join(EXPORT_DIR, 'characters.csv'), csv);

// === Export 4: Per-lesson JSON files with richer metadata ===
console.log('📁 Writing individual lesson files...');
const lessonsDir = path.join(EXPORT_DIR, 'lessons');
if (!fs.existsSync(lessonsDir)) {
  fs.mkdirSync(lessonsDir, { recursive: true });
}

for (const lesson of lessons) {
  const enrichedLesson = {
    lesson: lesson.lesson,
    characterCount: lesson.characters.length,
    characterList: lesson.characters.map((c) => c.character).join(''),
    themes: extractThemes(lesson.characters),
    characters: lesson.characters,
  };
  fs.writeFileSync(
    path.join(lessonsDir, `lesson-${lesson.lesson}.json`),
    JSON.stringify(enrichedLesson, null, 2)
  );
}

// === Export 5: Prompt-ready lesson blocks ===
console.log('🤖 Writing ai-prompts.md...');
let prompts = `# AI-Ready Lesson Prompts

Use these blocks to prompt Claude or Gemini for lesson narrative generation.

---

`;

for (const lesson of lessons) {
  prompts += `## Lesson ${lesson.lesson} Prompt Block

\`\`\`
LESSON ${lesson.lesson} - ${lesson.characters.length} CHARACTERS

Characters to weave into narrative:
${lesson.characters.map((c) => `- ${c.character} (${c.pinyin}, tone ${c.tone}): "${c.meaning}" — ${c.story}`).join('\n')}

Task: Create a cohesive lesson narrative that weaves all ${lesson.characters.length} characters
into an epic story. Each character should appear naturally in the narrative, with its
meaning reinforced through context. Include pinyin sound cues where possible.
\`\`\`

---

`;
}

fs.writeFileSync(path.join(EXPORT_DIR, 'ai-prompts.md'), prompts);

// Helper function to extract themes from characters
function extractThemes(characters) {
  const themes = new Set();
  const themeKeywords = {
    water: ['water', 'river', 'stream', 'lake', 'swim', 'flow', 'tide', 'spring'],
    fire: ['fire', 'flame', 'burn', 'ash', 'heat', 'fever'],
    nature: ['tree', 'forest', 'mountain', 'earth', 'soil', 'field'],
    body: ['mouth', 'eye', 'hand', 'heart', 'flesh', 'bone'],
    time: ['day', 'month', 'year', 'time', 'dawn', 'morning'],
    numbers: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
    family: ['father', 'mother', 'child', 'son', 'daughter', 'family'],
    action: ['walk', 'run', 'go', 'come', 'stand', 'sit'],
  };

  for (const char of characters) {
    const meaningLower = char.meaning.toLowerCase();
    for (const [theme, keywords] of Object.entries(themeKeywords)) {
      if (keywords.some((kw) => meaningLower.includes(kw))) {
        themes.add(theme);
      }
    }
  }

  return Array.from(themes);
}

console.log(`
✅ Export complete!

Files created in ./exports/:
  📄 all-characters.json    - Complete consolidated data (${(fs.statSync(path.join(EXPORT_DIR, 'all-characters.json')).size / 1024).toFixed(1)} KB)
  📄 lessons-summary.md     - Markdown tables for reference
  📄 characters.csv         - Spreadsheet-compatible format
  📄 ai-prompts.md          - Ready-to-use AI prompt blocks
  📁 lessons/               - Individual lesson JSON files

Total: ${totalCharacters} characters across ${lessons.length} lessons
`);
