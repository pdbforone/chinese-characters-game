import { LessonData } from './types';

// Import all lesson JSON files
import lesson1 from './data/lesson1.json';
import lesson2 from './data/lesson2.json';
import lesson3 from './data/lesson3.json';

// Map of lesson number to lesson data
const lessons: Record<number, LessonData> = {
  1: lesson1,
  2: lesson2,
  3: lesson3,
};

/**
 * Get lesson data by lesson number
 * @param lessonNumber - The lesson number to load
 * @returns The lesson data or null if not found
 */
export function getLessonData(lessonNumber: number): LessonData | null {
  return lessons[lessonNumber] || null;
}

/**
 * Get all available lesson numbers
 * @returns Array of available lesson numbers
 */
export function getAvailableLessons(): number[] {
  return Object.keys(lessons)
    .map(Number)
    .sort((a, b) => a - b);
}

/**
 * Check if a lesson exists
 * @param lessonNumber - The lesson number to check
 * @returns True if the lesson exists
 */
export function lessonExists(lessonNumber: number): boolean {
  return lessonNumber in lessons;
}

/**
 * Get metadata for all available lessons
 * @returns Array of lesson metadata
 */
export function getAllLessonsMetadata() {
  return getAvailableLessons().map((lessonNum) => {
    const lesson = lessons[lessonNum];
    return {
      lessonNumber: lessonNum,
      characterCount: lesson.characters.length,
      characters: lesson.characters.map((c) => c.character).join(', '),
    };
  });
}
