import lesson1 from './data/lesson1.json';
import lesson2 from './data/lesson2.json';
import lesson3 from './data/lesson3.json';
import lesson4 from './data/lesson4.json';
import lesson5 from './data/lesson5.json';
import lesson6 from './data/lesson6.json';
import lesson7 from './data/lesson7.json';
import lesson8 from './data/lesson8.json';
import lesson9 from './data/lesson9.json';
import lesson10 from './data/lesson10.json';
import lesson11 from './data/lesson11.json';
import lesson12 from './data/lesson12.json';
import lesson13 from './data/lesson13.json';
import lesson14 from './data/lesson14.json';
import lesson15 from './data/lesson15.json';
import lesson16 from './data/lesson16.json';
import lesson17 from './data/lesson17.json';
import lesson18 from './data/lesson18.json';
import lesson19 from './data/lesson19.json';
import lesson20 from './data/lesson20.json';
import lesson21 from './data/lesson21.json';
import lesson22 from './data/lesson22.json';
import lesson23 from './data/lesson23.json';
import lesson24 from './data/lesson24.json';
import lesson25 from './data/lesson25.json';
import lesson26 from './data/lesson26.json';
import lesson27 from './data/lesson27.json';
import lesson28 from './data/lesson28.json';
import lesson29 from './data/lesson29.json';
import lesson30 from './data/lesson30.json';
import lesson31 from './data/lesson31.json';
import lesson32 from './data/lesson32.json';
import lesson33 from './data/lesson33.json';
import lesson34 from './data/lesson34.json';
import lesson35 from './data/lesson35.json';
import lesson36 from './data/lesson36.json';
import lesson37 from './data/lesson37.json';
import lesson38 from './data/lesson38.json';
import lesson39 from './data/lesson39.json';
import lesson40 from './data/lesson40.json';
import lesson41 from './data/lesson41.json';
import lesson42 from './data/lesson42.json';
import lesson43 from './data/lesson43.json';
import lesson44 from './data/lesson44.json';
import lesson45 from './data/lesson45.json';
import lesson46 from './data/lesson46.json';
import lesson47 from './data/lesson47.json';
import lesson48 from './data/lesson48.json';
import lesson49 from './data/lesson49.json';
import lesson50 from './data/lesson50.json';
import lesson51 from './data/lesson51.json';
import lesson52 from './data/lesson52.json';
import lesson53 from './data/lesson53.json';
import lesson54 from './data/lesson54.json';
import lesson55 from './data/lesson55.json';
import lesson56 from './data/lesson56.json';
import lesson57 from './data/lesson57.json';
import lesson58 from './data/lesson58.json';
import lesson59 from './data/lesson59.json';
import lesson60 from './data/lesson60.json';
import lesson61 from './data/lesson61.json';
import lesson62 from './data/lesson62.json';
import lesson63 from './data/lesson63.json';
import lesson64 from './data/lesson64.json';
import lesson65 from './data/lesson65.json';
import lesson66 from './data/lesson66.json';
import lesson67 from './data/lesson67.json';
import lesson68 from './data/lesson68.json';
import lesson69 from './data/lesson69.json';
import lesson70 from './data/lesson70.json';
import lesson71 from './data/lesson71.json';
import lesson72 from './data/lesson72.json';
import lesson73 from './data/lesson73.json';
import lesson74 from './data/lesson74.json';
import lesson75 from './data/lesson75.json';
import lesson76 from './data/lesson76.json';
import lesson77 from './data/lesson77.json';
import lesson78 from './data/lesson78.json';
import lesson79 from './data/lesson79.json';
import lesson80 from './data/lesson80.json';
import lesson81 from './data/lesson81.json';
import lesson82 from './data/lesson82.json';
import lesson83 from './data/lesson83.json';
import lesson84 from './data/lesson84.json';
import lesson85 from './data/lesson85.json';
import lesson86 from './data/lesson86.json';
import lesson87 from './data/lesson87.json';
import lesson88 from './data/lesson88.json';
import lesson89 from './data/lesson89.json';
import lesson90 from './data/lesson90.json';
import lesson91 from './data/lesson91.json';
import lesson92 from './data/lesson92.json';
import lesson93 from './data/lesson93.json';
import lesson94 from './data/lesson94.json';
import lesson95 from './data/lesson95.json';
import lesson96 from './data/lesson96.json';
import lesson97 from './data/lesson97.json';
import lesson98 from './data/lesson98.json';
import lesson99 from './data/lesson99.json';
import lesson100 from './data/lesson100.json';
import lesson101 from './data/lesson101.json';
import lesson102 from './data/lesson102.json';
import lesson103 from './data/lesson103.json';
import lesson104 from './data/lesson104.json';
import lesson105 from './data/lesson105.json';
import lesson106 from './data/lesson106.json';
import lesson107 from './data/lesson107.json';
import lesson108 from './data/lesson108.json';
import lesson109 from './data/lesson109.json';
import lesson110 from './data/lesson110.json';
import lesson111 from './data/lesson111.json';
import lesson112 from './data/lesson112.json';

import { Character, LessonData } from './types';

// Re-export for backwards compatibility
export type { Character, LessonData };

/**
 * All lesson data, indexed by lesson number.
 * Imports are required for Next.js static bundling.
 * Map is built programmatically to eliminate repetition.
 */
const lessonImports = [
  lesson1,
  lesson2,
  lesson3,
  lesson4,
  lesson5,
  lesson6,
  lesson7,
  lesson8,
  lesson9,
  lesson10,
  lesson11,
  lesson12,
  lesson13,
  lesson14,
  lesson15,
  lesson16,
  lesson17,
  lesson18,
  lesson19,
  lesson20,
  lesson21,
  lesson22,
  lesson23,
  lesson24,
  lesson25,
  lesson26,
  lesson27,
  lesson28,
  lesson29,
  lesson30,
  lesson31,
  lesson32,
  lesson33,
  lesson34,
  lesson35,
  lesson36,
  lesson37,
  lesson38,
  lesson39,
  lesson40,
  lesson41,
  lesson42,
  lesson43,
  lesson44,
  lesson45,
  lesson46,
  lesson47,
  lesson48,
  lesson49,
  lesson50,
  lesson51,
  lesson52,
  lesson53,
  lesson54,
  lesson55,
  lesson56,
  lesson57,
  lesson58,
  lesson59,
  lesson60,
  lesson61,
  lesson62,
  lesson63,
  lesson64,
  lesson65,
  lesson66,
  lesson67,
  lesson68,
  lesson69,
  lesson70,
  lesson71,
  lesson72,
  lesson73,
  lesson74,
  lesson75,
  lesson76,
  lesson77,
  lesson78,
  lesson79,
  lesson80,
  lesson81,
  lesson82,
  lesson83,
  lesson84,
  lesson85,
  lesson86,
  lesson87,
  lesson88,
  lesson89,
  lesson90,
  lesson91,
  lesson92,
  lesson93,
  lesson94,
  lesson95,
  lesson96,
  lesson97,
  lesson98,
  lesson99,
  lesson100,
  lesson101,
  lesson102,
  lesson103,
  lesson104,
  lesson105,
  lesson106,
  lesson107,
  lesson108,
  lesson109,
  lesson110,
  lesson111,
  lesson112,
] as const;

const lessons: Record<number, LessonData> = Object.fromEntries(
  lessonImports.map((lesson, index) => [index + 1, lesson])
);

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
