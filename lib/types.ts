export interface Character {
  id: number;
  character: string;
  pinyin: string;
  tone: number;
  meaning: string;
  story: string;
  primitives: string[];
}

export interface LessonData {
  lesson: number;
  characters: Character[];
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

export type GameMode =
  | "story-to-character"
  | "character-to-story"
  | "character-to-pinyin";

export interface RoundProgress {
  currentRound: number;
  totalRounds: number;
  mode: GameMode;
  roundScores: number[];
}
