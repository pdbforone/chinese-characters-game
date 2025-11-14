/**
 * Achievements System
 *
 * Tracks mastery-based achievements (not participation trophies).
 * All achievements require demonstrated learning, not just showing up.
 *
 * Design Philosophy (from research):
 * - NO streaks (create unhealthy pressure)
 * - NO leaderboards (cause anxiety)
 * - NO XP points (extrinsic motivation without learning)
 * - YES mastery milestones (g = 1.251 for vocabulary retention)
 * - YES optional (serious learners can disable)
 * - YES localStorage (privacy-first, offline)
 */

const STORAGE_KEY = 'achievements-state';
const ENABLED_KEY = 'achievements-enabled';

/**
 * Achievement Definition
 */
export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'mastery' | 'progression' | 'spaced-repetition';
  /** How to track progress (0-100) */
  maxProgress?: number;
}

/**
 * Achievement State (unlocked status + progress)
 */
export interface AchievementState {
  id: string;
  unlockedAt: string | null; // ISO timestamp or null if locked
  progress: number; // 0-100
}

/**
 * Full state stored in localStorage
 */
interface StoredState {
  enabled: boolean;
  achievements: Record<string, AchievementState>;
}

/**
 * All Achievement Definitions
 *
 * Research-backed categories:
 * 1. Mastery: Require demonstrable skill (accuracy thresholds)
 * 2. Progression: Long-term learning milestones
 * 3. Spaced Repetition: Reinforce evidence-based review habits
 */
export const ACHIEVEMENT_DEFINITIONS: AchievementDef[] = [
  // === MASTERY ACHIEVEMENTS ===
  {
    id: 'first-success',
    name: 'First Success',
    description: 'Complete your first lesson with ≥70% accuracy',
    emoji: '🎯',
    category: 'mastery',
  },
  {
    id: 'memory-master',
    name: 'Memory Master',
    description: 'Achieve 90%+ accuracy in Round 3 (meaning → character)',
    emoji: '🧠',
    category: 'mastery',
  },
  {
    id: 'tone-perfect',
    name: 'Tone Perfect',
    description: '100% accuracy in Round 4 (character → pinyin)',
    emoji: '🔥',
    category: 'mastery',
  },
  {
    id: 'story-scholar',
    name: 'Story Scholar',
    description: 'Recall 50 stories correctly in Round 2',
    emoji: '📖',
    category: 'mastery',
    maxProgress: 50,
  },

  // === PROGRESSION ACHIEVEMENTS ===
  {
    id: 'century-club',
    name: 'Century Club',
    description: 'Complete 100 characters total',
    emoji: '💯',
    category: 'progression',
    maxProgress: 100,
  },
  {
    id: 'polyglot-path',
    name: 'Polyglot Path',
    description: 'Complete 500 characters total',
    emoji: '📚',
    category: 'progression',
    maxProgress: 500,
  },
  {
    id: 'hanzi-hero',
    name: 'Hanzi Hero',
    description: 'Complete 1,000 characters total',
    emoji: '🏆',
    category: 'progression',
    maxProgress: 1000,
  },
  {
    id: 'master-scholar',
    name: 'Master Scholar',
    description: 'Complete all 3,035 traditional characters',
    emoji: '👑',
    category: 'progression',
    maxProgress: 3035,
  },

  // === SPACED REPETITION ACHIEVEMENTS ===
  {
    id: 'review-champion',
    name: 'Review Champion',
    description: 'Complete all due reviews 5 days in a row',
    emoji: '🌟',
    category: 'spaced-repetition',
    maxProgress: 5,
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Review before due date 10 times',
    emoji: '⏰',
    category: 'spaced-repetition',
    maxProgress: 10,
  },
  {
    id: 'retention-expert',
    name: 'Retention Expert',
    description: 'Maintain average ease factor ≥2.5 for 50+ characters',
    emoji: '✨',
    category: 'spaced-repetition',
  },
];

/**
 * Get default achievement state
 */
function createDefaultState(): StoredState {
  const achievements: Record<string, AchievementState> = {};

  ACHIEVEMENT_DEFINITIONS.forEach((def) => {
    achievements[def.id] = {
      id: def.id,
      unlockedAt: null,
      progress: 0,
    };
  });

  return {
    enabled: true, // Default: enabled
    achievements,
  };
}

/**
 * Load state from localStorage
 */
function loadState(): StoredState {
  if (typeof window === 'undefined') {
    return createDefaultState();
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return createDefaultState();
    }

    const stored = JSON.parse(data) as StoredState;

    // Merge with defaults (in case new achievements were added)
    const defaultState = createDefaultState();
    const merged: StoredState = {
      enabled: stored.enabled ?? true,
      achievements: { ...defaultState.achievements, ...stored.achievements },
    };

    return merged;
  } catch (error) {
    console.error('Error loading achievements:', error);
    return createDefaultState();
  }
}

/**
 * Save state to localStorage
 */
function saveState(state: StoredState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving achievements:', error);
  }
}

/**
 * Check if achievements are enabled
 */
export function areAchievementsEnabled(): boolean {
  const state = loadState();
  return state.enabled;
}

/**
 * Toggle achievements on/off
 */
export function toggleAchievements(): boolean {
  const state = loadState();
  state.enabled = !state.enabled;
  saveState(state);
  return state.enabled;
}

/**
 * Get all achievements with their current state
 */
export function getAllAchievements(): Array<AchievementDef & AchievementState> {
  const state = loadState();

  return ACHIEVEMENT_DEFINITIONS.map((def) => ({
    ...def,
    ...(state.achievements[def.id] || { id: def.id, unlockedAt: null, progress: 0 }),
  }));
}

/**
 * Get achievement state by ID
 */
export function getAchievement(id: string): (AchievementDef & AchievementState) | null {
  const achievements = getAllAchievements();
  return achievements.find((a) => a.id === id) || null;
}

/**
 * Unlock an achievement
 * @returns true if newly unlocked, false if already unlocked
 */
export function unlockAchievement(id: string): boolean {
  if (!areAchievementsEnabled()) return false;

  const state = loadState();
  const achievement = state.achievements[id];

  if (!achievement) {
    console.warn(`Unknown achievement: ${id}`);
    return false;
  }

  if (achievement.unlockedAt !== null) {
    return false; // Already unlocked
  }

  achievement.unlockedAt = new Date().toISOString();
  achievement.progress = 100; // Unlocked = 100% progress
  saveState(state);

  return true;
}

/**
 * Update achievement progress
 * @returns achievement data if unlocked, null otherwise
 */
export function updateProgress(
  id: string,
  progress: number
): (AchievementDef & AchievementState) | null {
  if (!areAchievementsEnabled()) return null;

  const state = loadState();
  const achievement = state.achievements[id];

  if (!achievement) {
    console.warn(`Unknown achievement: ${id}`);
    return null;
  }

  if (achievement.unlockedAt !== null) {
    return null; // Already unlocked
  }

  achievement.progress = Math.min(100, Math.max(0, progress));

  // Auto-unlock if progress reaches 100
  if (achievement.progress >= 100) {
    achievement.unlockedAt = new Date().toISOString();
  }

  saveState(state);

  // Return achievement data if just unlocked
  if (achievement.unlockedAt !== null) {
    return getAchievement(id);
  }

  return null;
}

/**
 * Check achievements after game completion
 *
 * Called from MultiRoundGame after all rounds complete.
 * Returns array of newly unlocked achievements.
 */
export function checkGameAchievements(
  accuracies: number[], // [round1, round2, round3, round4]
  totalCharactersCompleted: number
): Array<AchievementDef & AchievementState> {
  const newlyUnlocked: Array<AchievementDef & AchievementState> = [];

  // First Success: ≥70% overall accuracy
  const avgAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
  if (avgAccuracy >= 70) {
    if (unlockAchievement('first-success')) {
      const ach = getAchievement('first-success');
      if (ach) newlyUnlocked.push(ach);
    }
  }

  // Memory Master: Round 3 (meaning → character) ≥90%
  if (accuracies[2] >= 90) {
    if (unlockAchievement('memory-master')) {
      const ach = getAchievement('memory-master');
      if (ach) newlyUnlocked.push(ach);
    }
  }

  // Tone Perfect: Round 4 (character → pinyin) = 100%
  if (accuracies[3] >= 100) {
    if (unlockAchievement('tone-perfect')) {
      const ach = getAchievement('tone-perfect');
      if (ach) newlyUnlocked.push(ach);
    }
  }

  // Progression achievements (character count milestones)
  const milestones = [
    { count: 100, id: 'century-club' },
    { count: 500, id: 'polyglot-path' },
    { count: 1000, id: 'hanzi-hero' },
    { count: 3035, id: 'master-scholar' },
  ];

  for (const { count, id } of milestones) {
    const progress = Math.min(100, (totalCharactersCompleted / count) * 100);
    const unlocked = updateProgress(id, progress);
    if (unlocked) newlyUnlocked.push(unlocked);
  }

  return newlyUnlocked;
}

/**
 * Get achievement statistics
 */
export function getAchievementStats(): {
  total: number;
  unlocked: number;
  percentComplete: number;
} {
  const all = getAllAchievements();
  const unlocked = all.filter((a) => a.unlockedAt !== null).length;

  return {
    total: all.length,
    unlocked,
    percentComplete: Math.round((unlocked / all.length) * 100),
  };
}

/**
 * Reset all achievements (for testing or user request)
 */
export function resetAchievements(): void {
  if (typeof window === 'undefined') return;

  const defaultState = createDefaultState();
  saveState(defaultState);
}
