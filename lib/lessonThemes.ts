/**
 * Lesson Theme System
 *
 * Each lesson has a unique visual theme that reflects its narrative.
 * Themes define colors, gradients, and styling that immerse learners
 * in the lesson's memory palace.
 */

export interface LessonTheme {
  // Identifiers
  lessonId: number;
  name: string;

  // Background
  bgGradient: string; // Tailwind gradient classes for page background
  cardBg: string; // Card/panel background
  cardBorder: string; // Card border color

  // Text colors
  textPrimary: string; // Main text (character display)
  textSecondary: string; // Secondary text (pinyin, meaning)
  textMuted: string; // Hints, labels

  // Accent colors
  accentPrimary: string; // Primary accent (progress bar, highlights)
  accentSecondary: string; // Secondary accent

  // Header styling
  headerBg: string;
  headerText: string;

  // Streak/bonus styling
  streakBg: string;
  streakText: string;
}

// Default theme for lessons without custom theming
const defaultTheme: LessonTheme = {
  lessonId: 0,
  name: 'Default',
  bgGradient: 'from-slate-900 to-slate-800',
  cardBg: 'bg-slate-800',
  cardBorder: 'border-slate-700',
  textPrimary: 'text-white',
  textSecondary: 'text-slate-300',
  textMuted: 'text-slate-400',
  accentPrimary: 'from-indigo-500 to-purple-500',
  accentSecondary: 'from-indigo-600 to-purple-600',
  headerBg: 'bg-slate-800',
  headerText: 'text-white',
  streakBg: 'bg-amber-500/20 border-amber-500/50',
  streakText: 'text-amber-400',
};

// Lesson-specific themes
const lessonThemes: Record<number, LessonTheme> = {
  // Lesson 1: In the Beginning - Primordial Void / Creation
  1: {
    lessonId: 1,
    name: 'Primordial Void',
    bgGradient: 'from-violet-950 via-slate-900 to-black',
    cardBg: 'bg-violet-950/50',
    cardBorder: 'border-violet-800/50',
    textPrimary: 'text-violet-100',
    textSecondary: 'text-violet-300',
    textMuted: 'text-violet-400',
    accentPrimary: 'from-violet-500 to-fuchsia-500',
    accentSecondary: 'from-violet-600 to-fuchsia-600',
    headerBg: 'bg-violet-950/80',
    headerText: 'text-violet-100',
    streakBg: 'bg-fuchsia-500/20 border-fuchsia-500/50',
    streakText: 'text-fuchsia-400',
  },

  // Lesson 9: The Black Ink Banquet - Underground cave, scholars, candlelight
  9: {
    lessonId: 9,
    name: 'Black Ink Banquet',
    bgGradient: 'from-stone-950 via-amber-950 to-black',
    cardBg: 'bg-stone-900/70',
    cardBorder: 'border-amber-900/50',
    textPrimary: 'text-amber-50',
    textSecondary: 'text-amber-200',
    textMuted: 'text-amber-300/70',
    accentPrimary: 'from-amber-600 to-orange-600',
    accentSecondary: 'from-amber-700 to-orange-700',
    headerBg: 'bg-stone-900/80',
    headerText: 'text-amber-100',
    streakBg: 'bg-orange-500/20 border-orange-500/50',
    streakText: 'text-orange-400',
  },

  // Lesson 10: The Forest of Dim-Witted Trees - Forest, apricots, absurdist
  10: {
    lessonId: 10,
    name: 'Forest of Dim-Witted Trees',
    bgGradient: 'from-emerald-950 via-green-900 to-stone-900',
    cardBg: 'bg-emerald-950/60',
    cardBorder: 'border-emerald-800/50',
    textPrimary: 'text-emerald-50',
    textSecondary: 'text-emerald-200',
    textMuted: 'text-emerald-300/70',
    accentPrimary: 'from-emerald-500 to-teal-500',
    accentSecondary: 'from-emerald-600 to-teal-600',
    headerBg: 'bg-emerald-950/80',
    headerText: 'text-emerald-100',
    streakBg: 'bg-lime-500/20 border-lime-500/50',
    streakText: 'text-lime-400',
  },

  // Lesson 11: The Dog Who Cried Peach - Peach rain, village, warmth
  11: {
    lessonId: 11,
    name: 'Peach Rain Village',
    bgGradient: 'from-rose-950 via-orange-950 to-amber-950',
    cardBg: 'bg-rose-950/50',
    cardBorder: 'border-rose-800/50',
    textPrimary: 'text-rose-50',
    textSecondary: 'text-rose-200',
    textMuted: 'text-rose-300/70',
    accentPrimary: 'from-rose-500 to-pink-500',
    accentSecondary: 'from-rose-600 to-pink-600',
    headerBg: 'bg-rose-950/80',
    headerText: 'text-rose-100',
    streakBg: 'bg-pink-500/20 border-pink-500/50',
    streakText: 'text-pink-400',
  },

  // Lesson 12: The King's Golden Balls - Royal, jade, gold, ornate
  12: {
    lessonId: 12,
    name: 'Royal Pagoda',
    bgGradient: 'from-yellow-950 via-amber-900 to-red-950',
    cardBg: 'bg-yellow-950/50',
    cardBorder: 'border-yellow-700/50',
    textPrimary: 'text-yellow-50',
    textSecondary: 'text-yellow-200',
    textMuted: 'text-yellow-300/70',
    accentPrimary: 'from-yellow-500 to-amber-500',
    accentSecondary: 'from-yellow-600 to-amber-600',
    headerBg: 'bg-yellow-950/80',
    headerText: 'text-yellow-100',
    streakBg: 'bg-yellow-500/20 border-yellow-500/50',
    streakText: 'text-yellow-400',
  },

  // Lesson 13: The Shell Game of Value - Markets, shells, commerce
  13: {
    lessonId: 13,
    name: 'Shell Market',
    bgGradient: 'from-cyan-950 via-teal-900 to-slate-900',
    cardBg: 'bg-cyan-950/50',
    cardBorder: 'border-cyan-800/50',
    textPrimary: 'text-cyan-50',
    textSecondary: 'text-cyan-200',
    textMuted: 'text-cyan-300/70',
    accentPrimary: 'from-cyan-500 to-teal-500',
    accentSecondary: 'from-cyan-600 to-teal-600',
    headerBg: 'bg-cyan-950/80',
    headerText: 'text-cyan-100',
    streakBg: 'bg-teal-500/20 border-teal-500/50',
    streakText: 'text-teal-400',
  },

  // Lesson 14: The Hand's Journey - Hands, craft, journey
  14: {
    lessonId: 14,
    name: "Hand's Journey",
    bgGradient: 'from-orange-950 via-amber-900 to-stone-900',
    cardBg: 'bg-orange-950/50',
    cardBorder: 'border-orange-800/50',
    textPrimary: 'text-orange-50',
    textSecondary: 'text-orange-200',
    textMuted: 'text-orange-300/70',
    accentPrimary: 'from-orange-500 to-red-500',
    accentSecondary: 'from-orange-600 to-red-600',
    headerBg: 'bg-orange-950/80',
    headerText: 'text-orange-100',
    streakBg: 'bg-red-500/20 border-red-500/50',
    streakText: 'text-red-400',
  },

  // Lesson 15: The Heart's Fortress - Heart, emotions, fortress
  15: {
    lessonId: 15,
    name: "Heart's Fortress",
    bgGradient: 'from-red-950 via-rose-900 to-purple-950',
    cardBg: 'bg-red-950/50',
    cardBorder: 'border-red-800/50',
    textPrimary: 'text-red-50',
    textSecondary: 'text-red-200',
    textMuted: 'text-red-300/70',
    accentPrimary: 'from-red-500 to-rose-500',
    accentSecondary: 'from-red-600 to-rose-600',
    headerBg: 'bg-red-950/80',
    headerText: 'text-red-100',
    streakBg: 'bg-rose-500/20 border-rose-500/50',
    streakText: 'text-rose-400',
  },
};

/**
 * Get the theme for a specific lesson
 * Returns the lesson-specific theme or the default theme
 */
export function getLessonTheme(lessonId: number): LessonTheme {
  return lessonThemes[lessonId] || { ...defaultTheme, lessonId };
}

/**
 * Check if a lesson has a custom theme
 */
export function hasCustomTheme(lessonId: number): boolean {
  return lessonId in lessonThemes;
}
