/**
 * Script to update all lesson JSON files with new stories from character_stories.txt
 *
 * This script:
 * 1. Parses character_stories.txt (tab-separated format)
 * 2. Builds a Map of character → story
 * 3. Updates all 112 lesson JSON files with the new stories
 * 4. Validates that all stories were successfully updated
 *
 * Philosophy: Elegance in transformation. Each story is a mnemonic key
 * that unlocks memory. We're not just updating data—we're upgrading
 * the cognitive architecture of learning.
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

interface LessonData {
  lesson: number;
  characters: Character[];
}

// Parse the character_stories.txt file and build a character → story mapping
function parseStoryFile(filePath: string): Map<string, string> {
  const storyMap = new Map<string, string>();
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Skip header row (line 0)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    const parts = line.split('\t');
    if (parts.length < 5) {
      console.warn(`⚠️  Skipping malformed line ${i + 1}: ${line}`);
      continue;
    }

    const [character, pinyin, tone, meaning, story] = parts;

    if (!character || !story) {
      console.warn(`⚠️  Skipping line ${i + 1} - missing character or story`);
      continue;
    }

    storyMap.set(character, story);
  }

  return storyMap;
}

// Update all lesson JSON files with new stories
function updateLessonFiles(storyMap: Map<string, string>, dataDir: string): void {
  let totalCharacters = 0;
  let updatedCharacters = 0;
  let unchangedCharacters = 0;
  let missingStories = 0;

  // Find all lesson JSON files
  const lessonFiles = fs
    .readdirSync(dataDir)
    .filter((file) => file.startsWith('lesson') && file.endsWith('.json'))
    .sort((a, b) => {
      const numA = parseInt(a.replace('lesson', '').replace('.json', ''));
      const numB = parseInt(b.replace('lesson', '').replace('.json', ''));
      return numA - numB;
    });

  console.log(`\n📚 Found ${lessonFiles.length} lesson files\n`);

  lessonFiles.forEach((file) => {
    const filePath = path.join(dataDir, file);
    const lessonData: LessonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    let lessonUpdated = false;

    lessonData.characters.forEach((char) => {
      totalCharacters++;
      const newStory = storyMap.get(char.character);

      if (newStory) {
        if (char.story !== newStory) {
          char.story = newStory;
          updatedCharacters++;
          lessonUpdated = true;
        } else {
          unchangedCharacters++;
        }
      } else {
        console.warn(`⚠️  No story found for character: ${char.character} (${char.meaning})`);
        missingStories++;
      }
    });

    // Write updated lesson back to file (with pretty formatting)
    if (lessonUpdated) {
      fs.writeFileSync(filePath, JSON.stringify(lessonData, null, 2) + '\n', 'utf-8');
      console.log(`✅ Updated ${file}`);
    }
  });

  // Print summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 SUMMARY');
  console.log(`${'='.repeat(60)}`);
  console.log(`Total characters processed: ${totalCharacters}`);
  console.log(`Stories updated: ${updatedCharacters}`);
  console.log(`Stories unchanged: ${unchangedCharacters}`);
  console.log(`Missing stories: ${missingStories}`);
  console.log(`${'='.repeat(60)}\n`);

  if (missingStories > 0) {
    console.warn('⚠️  WARNING: Some characters are missing stories in the text file!');
  }

  if (updatedCharacters === 0) {
    console.log('✨ All stories were already up to date!');
  } else {
    console.log(`✨ Successfully updated ${updatedCharacters} character stories!`);
  }
}

// Main execution
function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const storyFilePath = path.join(projectRoot, 'character_stories.txt');
  const dataDir = path.join(projectRoot, 'lib', 'data');

  console.log('🎨 Starting story update process...\n');
  console.log(`Story file: ${storyFilePath}`);
  console.log(`Data directory: ${dataDir}\n`);

  // Validate files exist
  if (!fs.existsSync(storyFilePath)) {
    console.error(`❌ Error: character_stories.txt not found at ${storyFilePath}`);
    process.exit(1);
  }

  if (!fs.existsSync(dataDir)) {
    console.error(`❌ Error: Data directory not found at ${dataDir}`);
    process.exit(1);
  }

  // Parse story file
  console.log('📖 Parsing character_stories.txt...');
  const storyMap = parseStoryFile(storyFilePath);
  console.log(`✅ Parsed ${storyMap.size} character stories\n`);

  // Update lesson files
  console.log('🔄 Updating lesson files...');
  updateLessonFiles(storyMap, dataDir);

  console.log('✨ Story update complete!');
}

main();
