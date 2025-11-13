export interface LessonProgress {
  lessonId: number;
  introductionCompleted: boolean;
  gamesPlayed: number;
  bestScore: number;
  bestAccuracy: number;
  lastPlayed: string;
}

const STORAGE_KEY = 'rth_lesson_progress';

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

    return allProgress[key] || getDefaultProgress(lessonId);
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
  };
}
