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

export interface RoundProgress {
  currentRound: number;
  totalRounds: number;
  mode: GameMode;
  roundScores: number[];
}
