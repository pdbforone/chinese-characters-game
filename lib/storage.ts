import { LessonStatus, RoundScores } from './types';

export interface LessonProgress {
  lessonId: number;
  introductionCompleted: boolean;
  gamesPlayed: number;
  bestScore: number;
  bestAccuracy: number;
  lastPlayed: string;
  // New fields for Mastery Tier (optional for backward compatibility)
  status?: LessonStatus;
  coreAccuracy?: number; // Best accuracy across core rounds (0-100)
  masteryAccuracy?: number; // Best accuracy across mastery rounds (0-100), null if not attempted
  rounds?: RoundScores; // Individual round high scores
}

const STORAGE_KEY = 'rth_lesson_progress';
const ACCURACY_THRESHOLD = 70; // 70% required to "complete" core rounds

export function getLessonProgress(lessonId: number): LessonProgress {
  if (typeof window === 'undefined') {
    return getDefaultProgress(lessonId);
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return getDefaultProgress(lessonId);
    }

    const allProgress = JSON.parse(data);
    const key = `lesson_${lessonId}`;
    const rawProgress = allProgress[key];

    if (!rawProgress) {
      return getDefaultProgress(lessonId);
    }

    // Migrate old progress format if needed
    return migrateProgress(rawProgress);
  } catch (error) {
    console.error('Error reading lesson progress:', error);
    return getDefaultProgress(lessonId);
  }
}

export function markIntroductionComplete(lessonId: number): void {
  if (typeof window === 'undefined') return;

  try {
    const progress = getLessonProgress(lessonId);
    progress.introductionCompleted = true;
    progress.lastPlayed = new Date().toISOString();
    saveProgress(lessonId, progress);
  } catch (error) {
    console.error('Error marking introduction complete:', error);
  }
}

export function saveGameScore(lessonId: number, score: number, accuracy: number): void {
  if (typeof window === 'undefined') return;

  try {
    const progress = getLessonProgress(lessonId);
    progress.gamesPlayed += 1;
    progress.bestScore = Math.max(progress.bestScore, score);
    progress.bestAccuracy = Math.max(progress.bestAccuracy, accuracy);
    progress.lastPlayed = new Date().toISOString();
    saveProgress(lessonId, progress);
  } catch (error) {
    console.error('Error saving game score:', error);
  }
}

export function resetLessonProgress(lessonId: number): void {
  if (typeof window === 'undefined') return;

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return;

    const allProgress = JSON.parse(data);
    const key = `lesson_${lessonId}`;
    delete allProgress[key];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
  } catch (error) {
    console.error('Error resetting lesson progress:', error);
  }
}

function saveProgress(lessonId: number, progress: LessonProgress): void {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const allProgress = data ? JSON.parse(data) : {};
    const key = `lesson_${lessonId}`;

    allProgress[key] = progress;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

function getDefaultProgress(lessonId: number): LessonProgress {
  return {
    lessonId,
    introductionCompleted: false,
    gamesPlayed: 0,
    bestScore: 0,
    bestAccuracy: 0,
    lastPlayed: new Date().toISOString(),
    // New Mastery Tier fields
    status: 'unlocked',
    coreAccuracy: 0,
    masteryAccuracy: undefined,
    rounds: {},
  };
}

// Migrate old progress format to include new Mastery fields
function migrateProgress(progress: LessonProgress): LessonProgress {
  if (progress.status === undefined) {
    // Determine status based on existing data
    let status: LessonStatus = 'unlocked';
    if (progress.bestAccuracy >= ACCURACY_THRESHOLD / 100) {
      status = 'completed';
    }

    return {
      ...progress,
      status,
      coreAccuracy: Math.round(progress.bestAccuracy * 100),
      masteryAccuracy: undefined,
      rounds: progress.rounds || {},
    };
  }
  return progress;
}

export function getAllLessonProgress(): Record<number, LessonProgress> {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return {};
    }

    const allProgress = JSON.parse(data);
    const result: Record<number, LessonProgress> = {};

    // Convert from lesson_N keys to numeric keys, migrating old format
    Object.keys(allProgress).forEach((key) => {
      const match = key.match(/lesson_(\d+)/);
      if (match) {
        const lessonId = parseInt(match[1], 10);
        result[lessonId] = migrateProgress(allProgress[key]);
      }
    });

    return result;
  } catch (error) {
    console.error('Error reading all lesson progress:', error);
    return {};
  }
}

// ============================================
// Mastery Tier Functions
// ============================================

/**
 * Mark a lesson as completed (Silver status) after passing core rounds
 * Called when user achieves 70%+ accuracy on all 4 core rounds
 */
export function markLessonCompleted(lessonId: number, coreAccuracy: number): void {
  if (typeof window === 'undefined') return;

  try {
    const progress = getLessonProgress(lessonId);

    // Only upgrade status if not already mastered
    if (progress.status !== 'mastered') {
      progress.status = 'completed';
    }

    progress.coreAccuracy = Math.max(progress.coreAccuracy || 0, Math.round(coreAccuracy * 100));
    progress.lastPlayed = new Date().toISOString();

    saveProgress(lessonId, progress);
  } catch (error) {
    console.error('Error marking lesson completed:', error);
  }
}

/**
 * Mark a lesson as mastered (Gold status) after completing mastery tier
 * Called when user completes Story Mason + Story Detective
 */
export function markLessonMastered(lessonId: number, masteryAccuracy: number): void {
  if (typeof window === 'undefined') return;

  try {
    const progress = getLessonProgress(lessonId);

    progress.status = 'mastered';
    progress.masteryAccuracy = Math.max(
      progress.masteryAccuracy || 0,
      Math.round(masteryAccuracy * 100)
    );
    progress.lastPlayed = new Date().toISOString();

    saveProgress(lessonId, progress);
  } catch (error) {
    console.error('Error marking lesson mastered:', error);
  }
}

/**
 * Save individual round score
 */
export function saveRoundScore(
  lessonId: number,
  roundKey: keyof import('./types').RoundScores,
  score: number
): void {
  if (typeof window === 'undefined') return;

  try {
    const progress = getLessonProgress(lessonId);

    if (!progress.rounds) {
      progress.rounds = {};
    }

    // Only save if it's a new high score
    const currentScore = progress.rounds[roundKey] || 0;
    if (score > currentScore) {
      progress.rounds[roundKey] = score;
    }

    progress.lastPlayed = new Date().toISOString();
    saveProgress(lessonId, progress);
  } catch (error) {
    console.error('Error saving round score:', error);
  }
}

/**
 * Check if a lesson has the enhanced narrative data required for Mastery tier
 * Returns true if lesson has narrative_position data on characters
 */
export function lessonSupportsMastery(lessonId: number): boolean {
  // For MVP, only lessons 11-15 have full narrative enhancement
  // This can be expanded as more lessons are enhanced
  return lessonId >= 11 && lessonId <= 15;
}

/**
 * Get the display status for a lesson (for UI badges)
 */
export function getLessonDisplayStatus(progress: LessonProgress): {
  label: string;
  color: 'silver' | 'gold' | 'none';
  icon: string;
} {
  switch (progress.status) {
    case 'mastered':
      return { label: 'Mastered', color: 'gold', icon: '★' };
    case 'completed':
      return { label: 'Completed', color: 'silver', icon: '●' };
    default:
      return { label: '', color: 'none', icon: '' };
  }
}
