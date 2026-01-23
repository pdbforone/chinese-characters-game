export interface Character {
  id: number;
  character: string;
  pinyin: string;
  tone: number;
  meaning: string;
  story: string;
  primitives: string[];
  // Enhanced fields from gold-standard (optional for backward compatibility)
  mnemonic_image?: string;
  sound_bridge?: string;
  tone_emotion?: string;
  narrative_position?: string;
}

export interface LessonData {
  lesson: number;
  characters: Character[];
  // Enhanced lesson metadata (optional for backward compatibility)
  title?: string;
  theme?: string;
  memory_palace?: string;
  narrative_arc?: string;
  narrative_story?: string;
}

export interface MatchState {
  selectedStory: number | null;
  selectedCharacter: number | null;
  matched: Set<number>;
  incorrect: number | null;
}

export interface GameStats {
  totalAttempts: number;
  correctMatches: number;
  accuracy: number;
}

export type GameMode = 'story-to-character' | 'character-to-story' | 'character-to-pinyin';

// Mastery Tier game modes (Sprint 2-3)
export type MasteryGameMode = 'story-mason' | 'story-detective';

export interface RoundProgress {
  currentRound: number;
  totalRounds: number;
  mode: GameMode;
  roundScores: number[];
}

// Lesson completion status for the tiered progression system
// - locked: Not yet available (future: unlock based on previous lesson)
// - unlocked: Available to play
// - completed: Core rounds (1-4) finished with 70%+ accuracy (Silver)
// - mastered: Mastery tier (Story Mason + Detective) finished (Gold)
export type LessonStatus = 'locked' | 'unlocked' | 'completed' | 'mastered';

// Round tracking for both Core and Mastery tiers
export interface RoundScores {
  // Core rounds (1-4)
  round1?: number;
  round2?: number;
  round3?: number;
  round4?: number;
  // Mastery rounds
  storyMason?: number;
  storyDetective?: number;
  toneRecall?: number;
}
