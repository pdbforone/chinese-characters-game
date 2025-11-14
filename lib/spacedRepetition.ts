/**
 * Spaced Repetition System
 *
 * Implements a simplified SM-2 algorithm for tracking character mastery
 * and scheduling reviews based on forgetting curves.
 *
 * Philosophy: The best time to review is just before you forget.
 * - Characters are tracked individually with ease factor and interval
 * - Review intervals increase exponentially with successful recalls
 * - Failed recalls reset the interval but maintain some progress
 */

export interface CharacterMastery {
  characterId: string; // Format: "lessonId-charId" (e.g., "1-5" for lesson 1, character 5)
  character: string; // The actual Chinese character
  easeFactor: number; // How easy is this character? (1.3 to 2.5+)
  interval: number; // Days until next review
  repetitions: number; // Successful recalls in a row
  nextReviewDate: string; // ISO date string
  lastReviewDate: string; // ISO date string
  totalReviews: number; // Lifetime review count
}

const STORAGE_KEY = 'rth_character_mastery';
const MIN_EASE_FACTOR = 1.3;
const DEFAULT_EASE_FACTOR = 2.5;

/**
 * Calculate next review date using simplified SM-2 algorithm
 * @param mastery Current mastery data
 * @param quality Performance rating (0-5): 0=complete fail, 5=perfect recall
 */
export function calculateNextReview(mastery: CharacterMastery, quality: number): CharacterMastery {
  let { easeFactor, interval, repetitions } = mastery;

  // Update ease factor based on performance
  // Formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = Math.max(
    MIN_EASE_FACTOR,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  if (quality >= 3) {
    // Successful recall
    repetitions += 1;

    if (repetitions === 1) {
      interval = 1; // Review tomorrow
    } else if (repetitions === 2) {
      interval = 6; // Review in 6 days
    } else {
      interval = Math.round(interval * easeFactor); // Exponential growth
    }
  } else {
    // Failed recall - reset but keep some progress
    repetitions = 0;
    interval = 1; // Review tomorrow
    // Ease factor already decreased above
  }

  const now = new Date();
  const nextReview = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

  return {
    ...mastery,
    easeFactor,
    interval,
    repetitions,
    nextReviewDate: nextReview.toISOString(),
    lastReviewDate: now.toISOString(),
    totalReviews: mastery.totalReviews + 1,
  };
}

/**
 * Get or create mastery record for a character
 */
export function getCharacterMastery(
  lessonId: number,
  charId: number,
  character: string
): CharacterMastery {
  const characterId = `${lessonId}-${charId}`;

  if (typeof window === 'undefined') {
    return createDefaultMastery(characterId, character);
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return createDefaultMastery(characterId, character);
    }

    const allMastery = JSON.parse(data);
    return allMastery[characterId] || createDefaultMastery(characterId, character);
  } catch (error) {
    console.error('Error reading character mastery:', error);
    return createDefaultMastery(characterId, character);
  }
}

/**
 * Save mastery record for a character
 */
export function saveCharacterMastery(mastery: CharacterMastery): void {
  if (typeof window === 'undefined') return;

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const allMastery = data ? JSON.parse(data) : {};

    allMastery[mastery.characterId] = mastery;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(allMastery));
  } catch (error) {
    console.error('Error saving character mastery:', error);
  }
}

/**
 * Get all characters due for review today
 */
export function getDueCharacters(): CharacterMastery[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const allMastery: Record<string, CharacterMastery> = JSON.parse(data);
    const now = new Date();

    return Object.values(allMastery).filter((mastery) => {
      const dueDate = new Date(mastery.nextReviewDate);
      return dueDate <= now;
    });
  } catch (error) {
    console.error('Error fetching due characters:', error);
    return [];
  }
}

/**
 * Get mastery statistics for the home page
 */
export function getMasteryStats(): {
  totalLearned: number;
  dueToday: number;
  averageEaseFactor: number;
} {
  if (typeof window === 'undefined') {
    return { totalLearned: 0, dueToday: 0, averageEaseFactor: 0 };
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { totalLearned: 0, dueToday: 0, averageEaseFactor: 0 };
    }

    const allMastery: Record<string, CharacterMastery> = JSON.parse(data);
    const characters = Object.values(allMastery);
    const now = new Date();

    const dueToday = characters.filter((m) => new Date(m.nextReviewDate) <= now).length;

    const totalEase = characters.reduce((sum, m) => sum + m.easeFactor, 0);
    const averageEaseFactor =
      characters.length > 0 ? totalEase / characters.length : DEFAULT_EASE_FACTOR;

    return {
      totalLearned: characters.length,
      dueToday,
      averageEaseFactor: Math.round(averageEaseFactor * 10) / 10,
    };
  } catch (error) {
    console.error('Error fetching mastery stats:', error);
    return { totalLearned: 0, dueToday: 0, averageEaseFactor: 0 };
  }
}

/**
 * Record a review attempt (called after each game round)
 */
export function recordReview(
  lessonId: number,
  charId: number,
  character: string,
  accuracy: number
): void {
  // Convert accuracy percentage (0-100) to quality score (0-5)
  const quality = Math.round((accuracy / 100) * 5);

  const mastery = getCharacterMastery(lessonId, charId, character);
  const updated = calculateNextReview(mastery, quality);
  saveCharacterMastery(updated);
}

// Helper functions

function createDefaultMastery(characterId: string, character: string): CharacterMastery {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return {
    characterId,
    character,
    easeFactor: DEFAULT_EASE_FACTOR,
    interval: 1,
    repetitions: 0,
    nextReviewDate: tomorrow.toISOString(),
    lastReviewDate: now.toISOString(),
    totalReviews: 0,
  };
}
