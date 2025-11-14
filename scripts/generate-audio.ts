/**
 * Audio Generation Script
 *
 * Generates pronunciation audio files for all 3,035 characters using Azure TTS free tier.
 * This is a ONE-TIME operation - files are bundled with the app for offline use.
 *
 * Setup:
 * 1. Create free Azure account: https://azure.microsoft.com/free/
 * 2. Create Speech resource in portal
 * 3. Set environment variables:
 *    export AZURE_SPEECH_KEY="your-key"
 *    export AZURE_SPEECH_REGION="your-region"
 * 4. npm install @azure/cognitiveservices-speech-sdk --save-dev
 * 5. Run: npx tsx scripts/generate-audio.ts
 *
 * Output: /public/audio/lesson{N}.mp3 (audio sprites, one per lesson)
 */

import * as sdk from '@azure/cognitiveservices-speech-sdk';
import * as fs from 'fs';
import * as path from 'path';
import { getAllLessonsMetadata, getLessonData } from '../lib/lessonLoader';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'audio');
const SPRITE_METADATA_DIR = path.join(process.cwd(), 'lib', 'data', 'audio-sprites');

// Azure TTS configuration
const SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
const SPEECH_REGION = process.env.AZURE_SPEECH_REGION;

// Voice selection: zh-CN-YunxiNeural (male) or zh-CN-XiaoxiaoNeural (female)
// Research shows natural prosody for Mandarin tones
const VOICE_NAME = 'zh-CN-XiaoxiaoNeural';

interface SpriteMetadata {
  lessonNumber: number;
  characters: {
    character: string;
    pinyin: string;
    startTime: number; // milliseconds
    duration: number; // milliseconds
  }[];
  totalDuration: number;
}

/**
 * Generate SSML for a single character with proper tone emphasis
 */
function generateSSML(character: string, pinyin: string): string {
  // SSML helps Azure pronounce tones correctly
  return `
    <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-CN">
      <voice name="${VOICE_NAME}">
        <phoneme alphabet="sapi" ph="${pinyin}">
          ${character}
        </phoneme>
      </voice>
    </speak>
  `.trim();
}

/**
 * Generate audio for a single lesson (creates an audio sprite)
 */
async function generateLessonAudio(lessonNumber: number): Promise<void> {
  if (!SPEECH_KEY || !SPEECH_REGION) {
    throw new Error('Missing AZURE_SPEECH_KEY or AZURE_SPEECH_REGION environment variables');
  }

  console.log(`\n📝 Processing Lesson ${lessonNumber}...`);

  const lessonData = getLessonData(lessonNumber);
  const outputFile = path.join(OUTPUT_DIR, `lesson${lessonNumber}.mp3`);
  const metadataFile = path.join(SPRITE_METADATA_DIR, `lesson${lessonNumber}.json`);

  // Azure Speech SDK setup
  const speechConfig = sdk.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
  speechConfig.speechSynthesisVoiceName = VOICE_NAME;

  // Output to file
  const audioConfig = sdk.AudioConfig.fromAudioFileOutput(outputFile);

  const spriteMetadata: SpriteMetadata = {
    lessonNumber,
    characters: [],
    totalDuration: 0,
  };

  let currentTime = 0;

  // Generate each character's pronunciation
  for (let i = 0; i < lessonData.length; i++) {
    const char = lessonData[i];
    console.log(
      `  🔊 Generating: ${char.character} (${char.pinyin}) [${i + 1}/${lessonData.length}]`
    );

    const ssml = generateSSML(char.character, char.pinyin);

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    // Synthesize and wait for completion
    await new Promise<void>((resolve, reject) => {
      synthesizer.speakSsmlAsync(
        ssml,
        (result) => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            // Estimate duration (Azure provides this in result.audioDuration)
            const duration = result.audioDuration / 10000; // Convert to milliseconds

            spriteMetadata.characters.push({
              character: char.character,
              pinyin: char.pinyin,
              startTime: currentTime,
              duration,
            });

            currentTime += duration + 500; // 500ms pause between characters

            synthesizer.close();
            resolve();
          } else {
            const error = `Synthesis failed for ${char.character}: ${result.errorDetails}`;
            synthesizer.close();
            reject(new Error(error));
          }
        },
        (error) => {
          synthesizer.close();
          reject(error);
        }
      );
    });

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  spriteMetadata.totalDuration = currentTime;

  // Save sprite metadata for runtime sprite positioning
  fs.writeFileSync(metadataFile, JSON.stringify(spriteMetadata, null, 2));

  console.log(`  ✅ Lesson ${lessonNumber} complete: ${lessonData.length} characters`);
  console.log(`     Output: ${outputFile}`);
  console.log(`     Duration: ${(spriteMetadata.totalDuration / 1000).toFixed(1)}s`);
}

/**
 * Main execution
 */
async function main() {
  console.log('🎵 Chinese Character Audio Generator');
  console.log('=====================================\n');

  // Create output directories
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(SPRITE_METADATA_DIR)) {
    fs.mkdirSync(SPRITE_METADATA_DIR, { recursive: true });
  }

  const lessons = getAllLessonsMetadata();
  console.log(`📚 Found ${lessons.length} lessons (3,035 total characters)\n`);

  // Estimate usage
  const totalChars = lessons.reduce((sum, l) => sum + l.characterCount, 0);
  console.log(`💰 Estimated Azure usage: ${totalChars} characters (well within 5M free tier)\n`);

  // Generate audio for each lesson
  let completed = 0;
  let failed: number[] = [];

  for (const lesson of lessons) {
    try {
      await generateLessonAudio(lesson.lessonNumber);
      completed++;
    } catch (error) {
      console.error(`❌ Failed on lesson ${lesson.lessonNumber}:`, error);
      failed.push(lesson.lessonNumber);
    }
  }

  // Summary
  console.log('\n=====================================');
  console.log('📊 Generation Summary');
  console.log('=====================================');
  console.log(`✅ Completed: ${completed}/${lessons.length} lessons`);
  if (failed.length > 0) {
    console.log(`❌ Failed: ${failed.join(', ')}`);
  }
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`📄 Metadata directory: ${SPRITE_METADATA_DIR}`);
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
