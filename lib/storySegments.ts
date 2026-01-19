import { Character } from './types';

export interface StorySegment {
  id: string;
  text: string;
  position: number;
  characterId: number;
  character: string;
  narrativePosition: string;
}

/**
 * Extract story segments from lesson characters for Story Mason game.
 *
 * Each character has a `narrative_position` that describes its role in the story.
 * We use the character's `story` field as the segment text, which contains
 * the mnemonic story for that character.
 *
 * The segments are returned in correct order (by character array position),
 * which represents the narrative flow.
 */
export function extractStorySegments(characters: Character[]): StorySegment[] {
  return characters
    .filter((char) => char.narrative_position) // Only characters with narrative data
    .map((char, index) => ({
      id: `segment-${char.id}`,
      text: extractKeyPhrase(char),
      position: index,
      characterId: char.id,
      character: char.character,
      narrativePosition: char.narrative_position || '',
    }));
}

/**
 * Extract a key phrase from the character's story.
 * We take the narrative_position as the main identifier,
 * which is concise and describes the story beat.
 */
function extractKeyPhrase(char: Character): string {
  // The narrative_position is already a good summary
  // e.g., "The journey begins — measuring the impossible distance to the cave"
  return char.narrative_position || char.meaning;
}

/**
 * Get a subset of segments for the game (to keep it manageable).
 * We select segments that represent key story beats.
 *
 * @param segments All segments from the lesson
 * @param count Number of segments to select (default: 5)
 * @returns Selected segments maintaining relative order
 */
export function selectGameSegments(segments: StorySegment[], count: number = 5): StorySegment[] {
  if (segments.length <= count) {
    return segments;
  }

  // Select evenly spaced segments to capture the full narrative arc
  const step = (segments.length - 1) / (count - 1);
  const selected: StorySegment[] = [];

  for (let i = 0; i < count; i++) {
    const index = Math.round(i * step);
    selected.push(segments[index]);
  }

  // Re-number positions for the selected subset
  return selected.map((seg, idx) => ({
    ...seg,
    position: idx,
  }));
}

/**
 * Shuffle segments for the game (Fisher-Yates shuffle).
 * Returns a new array with segments in random order.
 */
export function shuffleSegments(segments: StorySegment[]): StorySegment[] {
  const shuffled = [...segments];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Check if segments are in correct order.
 * Compares the current arrangement against the correct positions.
 */
export function checkSegmentOrder(segments: StorySegment[]): {
  isCorrect: boolean;
  correctCount: number;
  totalCount: number;
} {
  let correctCount = 0;

  for (let i = 0; i < segments.length; i++) {
    if (segments[i].position === i) {
      correctCount++;
    }
  }

  return {
    isCorrect: correctCount === segments.length,
    correctCount,
    totalCount: segments.length,
  };
}

/**
 * Get the correct order of segments (sorted by position).
 */
export function getCorrectOrder(segments: StorySegment[]): StorySegment[] {
  return [...segments].sort((a, b) => a.position - b.position);
}
