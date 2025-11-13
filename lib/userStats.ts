// User statistics and gamification system

export interface UserStats {
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  charactersLearned: number;
  lessonsCompleted: number;
  perfectGames: number;
  totalGamesPlayed: number;
  achievements: string[];
}

const USER_STATS_KEY = 'rth_user_stats';

export function getUserStats(): UserStats {
  if (typeof window === 'undefined') {
    return getDefaultStats();
  }

  try {
    const data = localStorage.getItem(USER_STATS_KEY);
    if (!data) {
      return getDefaultStats();
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading user stats:', error);
    return getDefaultStats();
  }
}

export function updateUserStats(updates: Partial<UserStats>): UserStats {
  const current = getUserStats();
  const updated = { ...current, ...updates };

  try {
    localStorage.setItem(USER_STATS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving user stats:', error);
  }

  return updated;
}

export function addXP(amount: number): void {
  const stats = getUserStats();
  updateUserStats({ totalXP: stats.totalXP + amount });
}

export function updateStreak(): void {
  const stats = getUserStats();
  const today = new Date().toDateString();
  const lastStudy = new Date(stats.lastStudyDate).toDateString();

  if (today === lastStudy) {
    // Already studied today
    return;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  let newStreak = stats.currentStreak;

  if (lastStudy === yesterdayStr) {
    // Continuing streak
    newStreak = stats.currentStreak + 1;
  } else if (lastStudy < yesterdayStr) {
    // Streak broken, start over
    newStreak = 1;
  }

  updateUserStats({
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, stats.longestStreak),
    lastStudyDate: new Date().toISOString(),
  });
}

export function markGameCompleted(accuracy: number, characterCount: number): void {
  const stats = getUserStats();

  // Award XP based on performance
  const baseXP = characterCount * 10;
  const accuracyBonus = Math.floor(baseXP * accuracy);
  const perfectBonus = accuracy >= 0.95 ? 50 : 0;
  const totalXP = baseXP + accuracyBonus + perfectBonus;

  addXP(totalXP);

  const newStats: Partial<UserStats> = {
    totalGamesPlayed: stats.totalGamesPlayed + 1,
  };

  if (accuracy >= 0.95) {
    newStats.perfectGames = stats.perfectGames + 1;
  }

  updateUserStats(newStats);
  updateStreak();
  checkAchievements();
}

export function markLessonCompleted(lessonNumber: number, characterCount: number): void {
  const stats = getUserStats();

  updateUserStats({
    lessonsCompleted: stats.lessonsCompleted + 1,
    charactersLearned: stats.charactersLearned + characterCount,
  });

  checkAchievements();
}

export function getUserLevel(): { level: number; xpInLevel: number; xpForNextLevel: number } {
  const stats = getUserStats();
  const xp = stats.totalXP;

  // Level formula: level = floor(sqrt(xp / 100))
  // XP for level N = N^2 * 100
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  const xpForCurrentLevel = Math.pow(level - 1, 2) * 100;
  const xpForNextLevel = Math.pow(level, 2) * 100;
  const xpInLevel = xp - xpForCurrentLevel;

  return {
    level,
    xpInLevel,
    xpForNextLevel: xpForNextLevel - xpForCurrentLevel,
  };
}

function checkAchievements(): void {
  const stats = getUserStats();
  const newAchievements: string[] = [];

  // First steps
  if (stats.totalGamesPlayed >= 1 && !stats.achievements.includes('first_game')) {
    newAchievements.push('first_game');
  }

  // Streak achievements
  if (stats.currentStreak >= 7 && !stats.achievements.includes('week_streak')) {
    newAchievements.push('week_streak');
  }
  if (stats.currentStreak >= 30 && !stats.achievements.includes('month_streak')) {
    newAchievements.push('month_streak');
  }
  if (stats.currentStreak >= 100 && !stats.achievements.includes('century_streak')) {
    newAchievements.push('century_streak');
  }

  // Perfect game achievements
  if (stats.perfectGames >= 10 && !stats.achievements.includes('perfect_10')) {
    newAchievements.push('perfect_10');
  }
  if (stats.perfectGames >= 50 && !stats.achievements.includes('perfect_50')) {
    newAchievements.push('perfect_50');
  }

  // Character learning achievements
  if (stats.charactersLearned >= 100 && !stats.achievements.includes('hundred_chars')) {
    newAchievements.push('hundred_chars');
  }
  if (stats.charactersLearned >= 500 && !stats.achievements.includes('five_hundred_chars')) {
    newAchievements.push('five_hundred_chars');
  }
  if (stats.charactersLearned >= 1000 && !stats.achievements.includes('thousand_chars')) {
    newAchievements.push('thousand_chars');
  }
  if (stats.charactersLearned >= 3035 && !stats.achievements.includes('master')) {
    newAchievements.push('master');
  }

  if (newAchievements.length > 0) {
    updateUserStats({
      achievements: [...stats.achievements, ...newAchievements],
    });
  }
}

function getDefaultStats(): UserStats {
  return {
    totalXP: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: new Date().toISOString(),
    charactersLearned: 0,
    lessonsCompleted: 0,
    perfectGames: 0,
    totalGamesPlayed: 0,
    achievements: [],
  };
}

export const ACHIEVEMENT_DATA: Record<
  string,
  { title: string; description: string; icon: string }
> = {
  first_game: {
    title: 'First Steps',
    description: 'Completed your first game',
    icon: '👣',
  },
  week_streak: {
    title: 'Dedicated Learner',
    description: '7-day streak',
    icon: '🔥',
  },
  month_streak: {
    title: 'Unstoppable',
    description: '30-day streak',
    icon: '💪',
  },
  century_streak: {
    title: 'Legend',
    description: '100-day streak',
    icon: '👑',
  },
  perfect_10: {
    title: 'Perfectionist',
    description: '10 perfect games',
    icon: '⭐',
  },
  perfect_50: {
    title: 'Master',
    description: '50 perfect games',
    icon: '🌟',
  },
  hundred_chars: {
    title: 'Scholar',
    description: 'Learned 100 characters',
    icon: '📚',
  },
  five_hundred_chars: {
    title: 'Expert',
    description: 'Learned 500 characters',
    icon: '🎓',
  },
  thousand_chars: {
    title: 'Sage',
    description: 'Learned 1,000 characters',
    icon: '🧙',
  },
  master: {
    title: 'Grandmaster',
    description: 'Mastered all 3,035 characters!',
    icon: '🏆',
  },
};
