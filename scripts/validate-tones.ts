/**
 * Validate that tone marks match tone numbers across all lessons
 * This ensures data integrity for educational accuracy
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

// Tone mark detection for each tone
const TONE_PATTERNS = {
  1: /[āēīōūǖ]/,
  2: /[áéíóúǘ]/,
  3: /[ǎěǐǒǔǚ]/,
  4: /[àèìòùǜ]/,
};

function detectToneFromPinyin(pinyin: string): number | null {
  const lower = pinyin.toLowerCase();

  // Check for marked tones first
  if (TONE_PATTERNS[1].test(lower)) return 1;
  if (TONE_PATTERNS[2].test(lower)) return 2;
  if (TONE_PATTERNS[3].test(lower)) return 3;
  if (TONE_PATTERNS[4].test(lower)) return 4;

  // If no marks found and contains vowels, it's neutral tone (tone 5)
  if (/[aeiouüv]/.test(lower)) return 5;

  return null;
}

// Process all lesson files
const dataDir = path.join(process.cwd(), 'lib', 'data');
const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.json'));

let totalChecked = 0;
let errors = 0;
const errorLog: string[] = [];
const sampleCorrect: string[] = [];

files.forEach((file) => {
  const filePath = path.join(dataDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lesson: Lesson = JSON.parse(content);

  lesson.characters.forEach((char) => {
    totalChecked++;
    const detectedTone = detectToneFromPinyin(char.pinyin);

    if (detectedTone !== char.tone) {
      errors++;
      errorLog.push(
        `❌ ${file}: ${char.character} (${char.pinyin}) - Expected tone ${char.tone}, detected ${detectedTone}`
      );
    } else if (sampleCorrect.length < 50 && Math.random() < 0.02) {
      // Randomly sample ~2% for verification report
      sampleCorrect.push(
        `✓ ${char.character} ${char.pinyin} (tone ${char.tone}) - "${char.meaning}"`
      );
    }
  });
});

console.log('\n=== PINYIN TONE VALIDATION REPORT ===\n');
console.log(`Total Characters Checked: ${totalChecked}`);
console.log(`Errors Found: ${errors}`);
console.log(`Accuracy: ${(((totalChecked - errors) / totalChecked) * 100).toFixed(2)}%\n`);

if (errors > 0) {
  console.log('ERRORS:\n');
  errorLog.forEach((err) => console.log(err));
} else {
  console.log('✅ All tone marks match their declared tone numbers!\n');
  console.log('Sample Verified Entries:\n');
  sampleCorrect.forEach((sample) => console.log(sample));
}

console.log(
  `\n✓ Validation complete! Checked ${totalChecked} characters across ${files.length} lessons.`
);
