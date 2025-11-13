/**
 * Fix incorrectly capitalized pinyin in lesson files
 * Pinyin should always be lowercase
 */

import * as fs from 'fs';
import * as path from 'path';

interface Character {
  id: number;
  character: string;
  pinyin: string;
  tone: number;
  meaning: string;
  story: string;
  primitives: string[];
}

interface Lesson {
  lesson: number;
  characters: Character[];
}

// Process lesson files that have capitalization issues
const dataDir = path.join(process.cwd(), 'lib', 'data');
const problematicLessons = [31, 32, 33, 34];

let totalFixed = 0;

problematicLessons.forEach((lessonNum) => {
  const filePath = path.join(dataDir, `lesson${lessonNum}.json`);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠ Lesson ${lessonNum} not found, skipping`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lesson: Lesson = JSON.parse(content);

  let fixed = 0;

  lesson.characters.forEach((char) => {
    const originalPinyin = char.pinyin;
    // Lowercase the first character
    const fixedPinyin = originalPinyin.charAt(0).toLowerCase() + originalPinyin.slice(1);

    if (originalPinyin !== fixedPinyin) {
      char.pinyin = fixedPinyin;
      fixed++;
      totalFixed++;
    }
  });

  if (fixed > 0) {
    fs.writeFileSync(filePath, JSON.stringify(lesson, null, 2) + '\n', 'utf-8');
    console.log(`✓ Fixed lesson${lessonNum}.json: ${fixed} characters`);
  }
});

console.log(`\n✓ Complete! Fixed ${totalFixed} capitalization errors.`);
