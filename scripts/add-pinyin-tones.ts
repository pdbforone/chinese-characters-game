/**
 * Script to add tone marks to pinyin in all lesson JSON files
 * Converts pinyin + tone number to pinyin with diacritical marks
 */

import * as fs from 'fs';
import * as path from 'path';

// Tone mark mappings for each vowel
const TONE_MARKS: Record<string, string[]> = {
  a: ['a', 'ā', 'á', 'ǎ', 'à', 'a'],
  e: ['e', 'ē', 'é', 'ě', 'è', 'e'],
  i: ['i', 'ī', 'í', 'ǐ', 'ì', 'i'],
  o: ['o', 'ō', 'ó', 'ǒ', 'ò', 'o'],
  u: ['u', 'ū', 'ú', 'ǔ', 'ù', 'u'],
  ü: ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'],
  v: ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'], // v is sometimes used for ü
};

/**
 * Apply tone mark to pinyin based on tone number
 * Rules for which vowel gets the mark:
 * 1. If 'a' or 'e' present, it gets the mark
 * 2. Otherwise, if 'ou' present, 'o' gets the mark
 * 3. Otherwise, the last vowel gets the mark
 */
function addToneToPinyin(pinyin: string, tone: number): string {
  if (tone === 5 || tone === 0) {
    // Neutral tone or no tone - return as is
    return pinyin;
  }

  const lower = pinyin.toLowerCase();

  // Find which vowel gets the tone mark
  let vowelIndex = -1;

  // Rule 1: a or e gets priority
  if (lower.includes('a')) {
    vowelIndex = lower.indexOf('a');
  } else if (lower.includes('e')) {
    vowelIndex = lower.indexOf('e');
  }
  // Rule 2: ou combination
  else if (lower.includes('ou')) {
    vowelIndex = lower.indexOf('o');
  }
  // Rule 3: last vowel
  else {
    const vowels = ['i', 'o', 'u', 'ü', 'v'];
    for (let i = lower.length - 1; i >= 0; i--) {
      if (vowels.includes(lower[i])) {
        vowelIndex = i;
        break;
      }
    }
  }

  if (vowelIndex === -1) {
    console.warn(`Could not find vowel in pinyin: ${pinyin}`);
    return pinyin;
  }

  const vowel = lower[vowelIndex];
  const toneMarks = TONE_MARKS[vowel];

  if (!toneMarks) {
    console.warn(`No tone marks found for vowel: ${vowel}`);
    return pinyin;
  }

  const markedVowel = toneMarks[tone];

  // Replace the vowel with its marked version
  return pinyin.substring(0, vowelIndex) + markedVowel + pinyin.substring(vowelIndex + 1);
}

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

// Process all lesson files
const dataDir = path.join(process.cwd(), 'lib', 'data');
const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.json'));

let totalUpdated = 0;
let totalCharacters = 0;

files.forEach((file) => {
  const filePath = path.join(dataDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lesson: Lesson = JSON.parse(content);

  let updated = 0;

  lesson.characters.forEach((char) => {
    totalCharacters++;
    const originalPinyin = char.pinyin;
    const newPinyin = addToneToPinyin(originalPinyin, char.tone);

    if (originalPinyin !== newPinyin) {
      char.pinyin = newPinyin;
      updated++;
      totalUpdated++;
    }
  });

  if (updated > 0) {
    fs.writeFileSync(filePath, JSON.stringify(lesson, null, 2) + '\n', 'utf-8');
    console.log(`✓ Updated ${file}: ${updated} characters`);
  }
});

console.log(
  `\n✓ Complete! Updated ${totalUpdated} out of ${totalCharacters} characters across ${files.length} lessons.`
);
