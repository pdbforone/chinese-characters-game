#!/usr/bin/env tsx
/**
 * Update all lesson JSON files with improved stories from character_stories.txt
 */

import * as fs from 'fs';
import * as path from 'path';

interface StoryData {
  character: string;
  pinyin: string;
  tone: number;
  meaning: string;
  story: string;
}

// Parse character_stories.txt
const storiesPath = path.join(process.cwd(), 'character_stories.txt');
const content = fs.readFileSync(storiesPath, 'utf-8');
const lines = content.trim().split('\n');

// Skip header line
const dataLines = lines.slice(1);

// Build a map: character -> story data
const storyMap = new Map<string, StoryData>();

for (const line of dataLines) {
  const parts = line.split('\t');
  if (parts.length >= 5) {
    const [character, pinyin, toneStr, meaning, story] = parts;
    storyMap.set(character, {
      character,
      pinyin: pinyin.trim(),
      tone: parseInt(toneStr.trim()),
      meaning: meaning.trim(),
      story: story.trim(),
    });
  }
}

console.log(`📚 Loaded ${storyMap.size} improved stories from character_stories.txt\n`);

// Process all lesson files
const dataDir = path.join(process.cwd(), 'lib', 'data');
const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.json'));

let totalUpdated = 0;
let totalUnchanged = 0;
let totalMissing = 0;

for (const file of files) {
  const filePath = path.join(dataDir, file);
  const lesson = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  let updated = 0;
  let unchanged = 0;
  let missing = 0;

  for (const char of lesson.characters) {
    const newData = storyMap.get(char.character);

    if (newData) {
      // Check if story actually changed
      if (char.story !== newData.story) {
        char.story = newData.story;
        updated++;
      } else {
        unchanged++;
      }
    } else {
      console.warn(
        `⚠️  Character "${char.character}" in ${file} not found in character_stories.txt`
      );
      missing++;
    }
  }

  // Write back to file with proper formatting
  fs.writeFileSync(filePath, JSON.stringify(lesson, null, 2) + '\n', 'utf-8');

  if (updated > 0) {
    console.log(
      `✅ ${file}: Updated ${updated} stories, ${unchanged} unchanged, ${missing} missing`
    );
  }

  totalUpdated += updated;
  totalUnchanged += unchanged;
  totalMissing += missing;
}

console.log(`\n📊 Summary:`);
console.log(`   ✅ ${totalUpdated} stories updated`);
console.log(`   ⏭️  ${totalUnchanged} stories unchanged (already correct)`);
if (totalMissing > 0) {
  console.log(`   ⚠️  ${totalMissing} characters not found in character_stories.txt`);
}
console.log(`\n🎉 All lesson files updated successfully!`);
