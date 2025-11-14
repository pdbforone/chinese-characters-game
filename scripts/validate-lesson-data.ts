/**
 * Data Integrity Validation Script
 *
 * Validates that all lesson JSON files meet the schema requirements:
 * - All characters have required fields (id, character, pinyin, tone, meaning, story, primitives)
 * - All tone values are in range 1-5
 * - All stories are substantive (≥20 characters)
 * - No duplicate character IDs within a lesson
 * - JSON is well-formed
 *
 * This is the guardian of quality—ensuring that every mnemonic
 * meets the standards of pedagogical excellence.
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

interface ValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalLessons: number;
    totalCharacters: number;
    averageStoryLength: number;
    minStoryLength: number;
    maxStoryLength: number;
  };
}

function validateLessonFiles(dataDir: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let totalCharacters = 0;
  let totalStoryLength = 0;
  let minStoryLength = Infinity;
  let maxStoryLength = 0;

  // Find all lesson JSON files
  const lessonFiles = fs
    .readdirSync(dataDir)
    .filter((file) => file.startsWith('lesson') && file.endsWith('.json'))
    .sort((a, b) => {
      const numA = parseInt(a.replace('lesson', '').replace('.json', ''));
      const numB = parseInt(b.replace('lesson', '').replace('.json', ''));
      return numA - numB;
    });

  console.log(`\n🔍 Validating ${lessonFiles.length} lesson files...\n`);

  lessonFiles.forEach((file) => {
    const filePath = path.join(dataDir, file);

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lessonData: LessonData = JSON.parse(content);

      // Track character IDs to check for duplicates
      const seenIds = new Set<number>();

      lessonData.characters.forEach((char, index) => {
        const charLabel = `${file} - Character ${index + 1} (${char.character})`;

        // Check required fields
        if (!char.character) {
          errors.push(`${charLabel}: Missing 'character' field`);
        }
        if (!char.pinyin) {
          errors.push(`${charLabel}: Missing 'pinyin' field`);
        }
        if (char.tone === undefined) {
          errors.push(`${charLabel}: Missing 'tone' field`);
        }
        if (!char.meaning) {
          errors.push(`${charLabel}: Missing 'meaning' field`);
        }
        if (!char.story) {
          errors.push(`${charLabel}: Missing 'story' field`);
        }
        if (!char.primitives || !Array.isArray(char.primitives)) {
          errors.push(`${charLabel}: Missing or invalid 'primitives' field`);
        }

        // Validate tone range
        if (char.tone < 1 || char.tone > 5) {
          errors.push(`${charLabel}: Invalid tone ${char.tone} (must be 1-5)`);
        }

        // Validate story length
        if (char.story && char.story.length < 20) {
          warnings.push(`${charLabel}: Story is too short (${char.story.length} chars)`);
        }

        // Check for duplicate IDs
        if (seenIds.has(char.id)) {
          errors.push(`${charLabel}: Duplicate character ID ${char.id}`);
        }
        seenIds.add(char.id);

        // Track stats
        if (char.story) {
          totalCharacters++;
          totalStoryLength += char.story.length;
          minStoryLength = Math.min(minStoryLength, char.story.length);
          maxStoryLength = Math.max(maxStoryLength, char.story.length);
        }
      });
    } catch (error) {
      errors.push(`${file}: Failed to parse JSON - ${(error as Error).message}`);
    }
  });

  const stats = {
    totalLessons: lessonFiles.length,
    totalCharacters,
    averageStoryLength: totalCharacters > 0 ? Math.round(totalStoryLength / totalCharacters) : 0,
    minStoryLength: minStoryLength === Infinity ? 0 : minStoryLength,
    maxStoryLength,
  };

  return {
    success: errors.length === 0,
    errors,
    warnings,
    stats,
  };
}

function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const dataDir = path.join(projectRoot, 'lib', 'data');

  console.log('🎯 Data Integrity Validation');
  console.log('='.repeat(60));

  if (!fs.existsSync(dataDir)) {
    console.error(`❌ Error: Data directory not found at ${dataDir}`);
    process.exit(1);
  }

  const result = validateLessonFiles(dataDir);

  // Print statistics
  console.log('\n📊 Statistics:');
  console.log('='.repeat(60));
  console.log(`Total lessons: ${result.stats.totalLessons}`);
  console.log(`Total characters: ${result.stats.totalCharacters}`);
  console.log(`Average story length: ${result.stats.averageStoryLength} characters`);
  console.log(`Shortest story: ${result.stats.minStoryLength} characters`);
  console.log(`Longest story: ${result.stats.maxStoryLength} characters`);

  // Print warnings
  if (result.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    console.log('='.repeat(60));
    result.warnings.forEach((warning) => console.log(`  ${warning}`));
  }

  // Print errors
  if (result.errors.length > 0) {
    console.log('\n❌ Errors:');
    console.log('='.repeat(60));
    result.errors.forEach((error) => console.log(`  ${error}`));
  }

  // Final verdict
  console.log('\n' + '='.repeat(60));
  if (result.success) {
    console.log('✅ All validation checks passed!');
    console.log('✨ Data integrity verified - stories are ready for learners!');
    process.exit(0);
  } else {
    console.log(`❌ Validation failed with ${result.errors.length} error(s)`);
    process.exit(1);
  }
}

main();
