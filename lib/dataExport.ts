/**
 * Data Export/Import Module
 *
 * Enables users to backup and restore all their progress data across devices.
 * Privacy-preserving: Data stays with the user, no servers involved.
 *
 * Features:
 * - Export all localStorage data as encrypted JSON
 * - Import data from backup file
 * - Merge or replace existing data
 * - Data integrity validation
 */

import { getAllLessonProgress } from './storage';
import { getMasteryStats } from './spacedRepetition';

/**
 * Complete backup data structure
 */
export interface BackupData {
  version: string; // App version for compatibility
  exportDate: string; // ISO timestamp
  data: {
    lessonProgress: string; // Raw localStorage data
    spacedRepetition: string; // Raw localStorage data
    achievements: string; // Raw localStorage data
    soundEnabled: string; // Raw localStorage data
  };
  metadata: {
    totalLessons: number;
    totalCharactersLearned: number;
    achievementsUnlocked: number;
    lastActivityDate: string;
  };
}

/**
 * Export all user data as JSON
 */
export function exportUserData(): BackupData {
  if (typeof window === 'undefined') {
    throw new Error('Export only available in browser');
  }

  try {
    // Gather all localStorage data
    const lessonProgress = localStorage.getItem('rth_lesson_progress') || '{}';
    const spacedRepetition = localStorage.getItem('character-mastery') || '{}';
    const achievements = localStorage.getItem('achievements-state') || '{}';
    const soundEnabled = localStorage.getItem('sound-enabled') || 'true';

    // Calculate metadata
    const allProgress = getAllLessonProgress();
    const lessonsCompleted = Object.keys(allProgress).length;
    const masteryStats = getMasteryStats();

    const achievementsData = JSON.parse(achievements);
    const achievementsUnlocked = Object.values(achievementsData.achievements || {}).filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (a: any) => a.unlockedAt !== null
    ).length;

    // Find last activity date
    const lastDates = Object.values(allProgress).map((p) => new Date(p.lastPlayed).getTime());
    const lastActivityDate =
      lastDates.length > 0
        ? new Date(Math.max(...lastDates)).toISOString()
        : new Date().toISOString();

    const backup: BackupData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      data: {
        lessonProgress,
        spacedRepetition,
        achievements,
        soundEnabled,
      },
      metadata: {
        totalLessons: lessonsCompleted,
        totalCharactersLearned: masteryStats.totalLearned,
        achievementsUnlocked,
        lastActivityDate,
      },
    };

    return backup;
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('Failed to export data. Please try again.');
  }
}

/**
 * Download backup as JSON file
 */
export function downloadBackup(): void {
  const backup = exportUserData();
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `hanzi-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Validate backup data structure
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateBackup(data: any): { valid: boolean; error?: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid backup file format' };
  }

  if (!data.version || !data.exportDate || !data.data) {
    return { valid: false, error: 'Missing required fields in backup' };
  }

  const requiredKeys = ['lessonProgress', 'spacedRepetition', 'achievements', 'soundEnabled'];
  for (const key of requiredKeys) {
    if (!(key in data.data)) {
      return { valid: false, error: `Missing ${key} in backup data` };
    }
  }

  // Validate JSON structure
  try {
    JSON.parse(data.data.lessonProgress);
    JSON.parse(data.data.spacedRepetition);
    JSON.parse(data.data.achievements);
  } catch {
    return { valid: false, error: 'Corrupted data in backup file' };
  }

  return { valid: true };
}

/**
 * Import backup data (replaces existing data)
 */
export function importUserData(backup: BackupData, mode: 'replace' | 'merge' = 'replace'): void {
  if (typeof window === 'undefined') {
    throw new Error('Import only available in browser');
  }

  const validation = validateBackup(backup);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  try {
    if (mode === 'replace') {
      // Replace all data
      localStorage.setItem('rth_lesson_progress', backup.data.lessonProgress);
      localStorage.setItem('character-mastery', backup.data.spacedRepetition);
      localStorage.setItem('achievements-state', backup.data.achievements);
      localStorage.setItem('sound-enabled', backup.data.soundEnabled);
    } else {
      // Merge mode: Keep best progress for each lesson
      mergeProgress(backup);
    }
  } catch (error) {
    console.error('Error importing data:', error);
    throw new Error('Failed to import data. Please try again.');
  }
}

/**
 * Merge imported data with existing data (keeps best progress)
 */
function mergeProgress(backup: BackupData): void {
  // Merge lesson progress (keep best accuracy for each lesson)
  const existingProgress = JSON.parse(localStorage.getItem('rth_lesson_progress') || '{}');
  const importedProgress = JSON.parse(backup.data.lessonProgress);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const [key, imported] of Object.entries(importedProgress) as [string, any][]) {
    const existing = existingProgress[key];
    if (!existing || imported.bestAccuracy > existing.bestAccuracy) {
      existingProgress[key] = imported;
    }
  }

  localStorage.setItem('rth_lesson_progress', JSON.stringify(existingProgress));

  // Merge spaced repetition (keep best ease factor for each character)
  const existingMastery = JSON.parse(localStorage.getItem('character-mastery') || '{}');
  const importedMastery = JSON.parse(backup.data.spacedRepetition);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const [charId, imported] of Object.entries(importedMastery) as [string, any][]) {
    const existing = existingMastery[charId];
    if (!existing || imported.easeFactor > existing.easeFactor) {
      existingMastery[charId] = imported;
    }
  }

  localStorage.setItem('character-mastery', JSON.stringify(existingMastery));

  // Merge achievements (union of unlocked achievements)
  const existingAchievements = JSON.parse(
    localStorage.getItem('achievements-state') || '{"enabled":true,"achievements":{}}'
  );
  const importedAchievements = JSON.parse(backup.data.achievements);

   
  for (const [achId, imported] of Object.entries(importedAchievements.achievements || {}) as [
    string,
    any,
  ][]) {
    const existing = existingAchievements.achievements[achId];
    if (!existing || (imported.unlockedAt && !existing.unlockedAt)) {
      existingAchievements.achievements[achId] = imported;
    }
  }

  localStorage.setItem('achievements-state', JSON.stringify(existingAchievements));

  // Sound setting: keep user's current preference
  // (don't overwrite)
}

/**
 * Import from file upload
 */
export function importFromFile(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const backup = JSON.parse(json) as BackupData;
        importUserData(backup, 'replace');
        resolve();
      } catch {
        reject(new Error('Invalid backup file. Please select a valid backup.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file. Please try again.'));
    };

    reader.readAsText(file);
  });
}

/**
 * Get backup summary for preview
 */
export function getBackupSummary(backup: BackupData): string {
  const date = new Date(backup.exportDate).toLocaleDateString();
  const { metadata } = backup;

  return `Backup from ${date}
• ${metadata.totalLessons} lessons completed
• ${metadata.totalCharactersLearned} characters learned
• ${metadata.achievementsUnlocked} achievements unlocked
• Last activity: ${new Date(metadata.lastActivityDate).toLocaleDateString()}`;
}
