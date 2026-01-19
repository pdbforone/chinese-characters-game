/**
 * Story Blanks - Utilities for Story Detective cloze game
 *
 * Creates fill-in-the-blank challenges from character stories,
 * testing recall of tone emotions, sound bridges, and meanings.
 */

import { Character } from './types';

// Tone emotion keywords that appear in stories
const TONE_EMOTIONS = ['SING', 'GASP', 'GROAN', 'COMMAND'];

export type BlankType = 'tone_emotion' | 'sound' | 'meaning';

export interface StoryBlank {
  id: string;
  character: Character;
  originalStory: string;
  blankedStory: string;
  blankType: BlankType;
  correctAnswer: string;
  options: string[];
  hint: string;
}

/**
 * Extract the tone emotion word from a story
 */
function extractToneEmotion(story: string): string | null {
  for (const emotion of TONE_EMOTIONS) {
    if (story.includes(emotion)) {
      return emotion;
    }
  }
  return null;
}

/**
 * Extract the onomatopoeia sound from a story (text in quotes with '...')
 */
function extractSound(story: string): string | null {
  // Match patterns like 'Liii...' or 'HEIII...' or 'MO!'
  const soundMatch = story.match(/'([A-Za-z]+[.!]+)'/);
  if (soundMatch) {
    return soundMatch[1];
  }
  // Also try matching sounds like "Lyennn..." without quotes
  const altMatch = story.match(/\b([A-Z][a-z]*[.!]{2,})/);
  if (altMatch) {
    return altMatch[1];
  }
  return null;
}

/**
 * Create a blank for tone emotion
 */
function createToneEmotionBlank(character: Character): StoryBlank | null {
  const emotion = extractToneEmotion(character.story);
  if (!emotion) return null;

  const blankedStory = character.story.replace(emotion, '_____');

  // Get distractors (other tone emotions)
  const distractors = TONE_EMOTIONS.filter((e) => e !== emotion);

  return {
    id: `tone_${character.id}`,
    character,
    originalStory: character.story,
    blankedStory,
    blankType: 'tone_emotion',
    correctAnswer: emotion,
    options: shuffleArray([emotion, ...distractors]),
    hint: `Tone ${character.tone} emotion`,
  };
}

/**
 * Create a blank for the sound/onomatopoeia
 */
function createSoundBlank(character: Character, allCharacters: Character[]): StoryBlank | null {
  const sound = extractSound(character.story);
  if (!sound) return null;

  const blankedStory = character.story.replace(`'${sound}'`, "'_____'");

  // Get distractors from other characters' sounds
  const otherSounds = allCharacters
    .filter((c) => c.id !== character.id)
    .map((c) => extractSound(c.story))
    .filter((s): s is string => s !== null);

  // Pick up to 3 distractors
  const distractors = shuffleArray(otherSounds).slice(0, 3);

  // Ensure we have at least 3 options total
  while (distractors.length < 3) {
    distractors.push(generateFakeSound(character.pinyin));
  }

  return {
    id: `sound_${character.id}`,
    character,
    originalStory: character.story,
    blankedStory,
    blankType: 'sound',
    correctAnswer: sound,
    options: shuffleArray([sound, ...distractors.slice(0, 3)]),
    hint: `Sound for ${character.pinyin}`,
  };
}

/**
 * Create a blank for the meaning
 */
function createMeaningBlank(character: Character, allCharacters: Character[]): StoryBlank | null {
  const meaning = character.meaning.toUpperCase();

  // Check if meaning appears in story (case insensitive)
  const meaningRegex = new RegExp(`\\b${escapeRegex(meaning)}\\b`, 'i');
  if (!meaningRegex.test(character.story)) {
    // Try with just the first word of meaning
    const firstWord = character.meaning.split(/[\s,]/)[0].toUpperCase();
    const firstWordRegex = new RegExp(`\\b${escapeRegex(firstWord)}\\b`, 'i');
    if (!firstWordRegex.test(character.story)) {
      return null;
    }
  }

  const blankedStory = character.story.replace(meaningRegex, '_____');

  // Get distractors from other characters' meanings
  const otherMeanings = allCharacters
    .filter((c) => c.id !== character.id)
    .map((c) => c.meaning.toUpperCase())
    .slice(0, 5);

  const distractors = shuffleArray(otherMeanings).slice(0, 3);

  return {
    id: `meaning_${character.id}`,
    character,
    originalStory: character.story,
    blankedStory,
    blankType: 'meaning',
    correctAnswer: meaning,
    options: shuffleArray([meaning, ...distractors]),
    hint: `Meaning of ${character.character}`,
  };
}

/**
 * Generate fake sound for padding options
 */
function generateFakeSound(pinyin: string): string {
  const base = pinyin.replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/g, (match) => {
    const map: Record<string, string> = {
      ā: 'a',
      á: 'a',
      ǎ: 'a',
      à: 'a',
      ē: 'e',
      é: 'e',
      ě: 'e',
      è: 'e',
      ī: 'i',
      í: 'i',
      ǐ: 'i',
      ì: 'i',
      ō: 'o',
      ó: 'o',
      ǒ: 'o',
      ò: 'o',
      ū: 'u',
      ú: 'u',
      ǔ: 'u',
      ù: 'u',
      ǖ: 'u',
      ǘ: 'u',
      ǚ: 'u',
      ǜ: 'u',
    };
    return map[match] || match;
  });
  return base.toUpperCase() + '...';
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Shuffle array (Fisher-Yates)
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generate story blanks for a set of characters
 * Returns a mix of tone emotion and sound blanks
 */
export function generateStoryBlanks(characters: Character[], count: number = 5): StoryBlank[] {
  const blanks: StoryBlank[] = [];

  // Try to create tone emotion blanks for each character
  for (const char of characters) {
    const toneBlank = createToneEmotionBlank(char);
    if (toneBlank) {
      blanks.push(toneBlank);
    }
  }

  // Try to create sound blanks for each character
  for (const char of characters) {
    const soundBlank = createSoundBlank(char, characters);
    if (soundBlank) {
      blanks.push(soundBlank);
    }
  }

  // Shuffle and return requested count
  return shuffleArray(blanks).slice(0, count);
}

/**
 * Check if an answer is correct
 */
export function checkAnswer(blank: StoryBlank, answer: string): boolean {
  return answer.toUpperCase() === blank.correctAnswer.toUpperCase();
}

/**
 * Calculate accuracy from results
 */
export function calculateDetectiveAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return correct / total;
}
