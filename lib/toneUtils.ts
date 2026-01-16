/**
 * Tone Emotion System
 *
 * Research-validated system for encoding Chinese tones through emotional verbs.
 * Used consistently across CharacterIntroduction and game components.
 *
 * Tone 1 (flat): SING - sustained high note, opera singer
 * Tone 2 (rising): GASP - surprised, startled, rising energy
 * Tone 3 (dipping): GROAN - low zombie moan, creaky undead voice
 * Tone 4 (falling): COMMAND - sharp bark, decisive order
 * Tone 5 (neutral): whisper - quiet, neutral
 */

export interface ToneInfo {
  verb: string;
  description: string;
  color: string;
  textColor: string;
  bgLight: string;
  border: string;
  borderMuted: string;
}

export const TONE_EMOTIONS: Record<number, ToneInfo> = {
  1: {
    verb: 'SING',
    description: 'sustained high note',
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgLight: 'bg-blue-50',
    border: 'border-blue-400',
    borderMuted: 'border-blue-200',
  },
  2: {
    verb: 'GASP',
    description: 'surprised, rising',
    color: 'bg-emerald-500',
    textColor: 'text-emerald-700',
    bgLight: 'bg-emerald-50',
    border: 'border-emerald-400',
    borderMuted: 'border-emerald-200',
  },
  3: {
    verb: 'GROAN',
    description: 'low zombie moan',
    color: 'bg-amber-500',
    textColor: 'text-amber-700',
    bgLight: 'bg-amber-50',
    border: 'border-amber-400',
    borderMuted: 'border-amber-200',
  },
  4: {
    verb: 'COMMAND',
    description: 'sharp bark',
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgLight: 'bg-red-50',
    border: 'border-red-400',
    borderMuted: 'border-red-200',
  },
  5: {
    verb: 'whisper',
    description: 'neutral',
    color: 'bg-gray-400',
    textColor: 'text-gray-600',
    bgLight: 'bg-gray-50',
    border: 'border-gray-400',
    borderMuted: 'border-gray-200',
  },
};

/**
 * Get tone information for a given tone number
 */
export function getToneInfo(tone: number): ToneInfo {
  return TONE_EMOTIONS[tone] || TONE_EMOTIONS[5];
}

/**
 * Convert pinyin with tone marks to plain ASCII for file paths
 * e.g., "yī" → "yi", "wǔ" → "wu"
 */
export function pinyinToAscii(pinyin: string): string {
  const toneMap: Record<string, string> = {
    ā: 'a',
    á: 'a',
    ǎ: 'a',
    à: 'a',
    ē: 'e',
    é: 'e',
    ě: 'e',
    è: 'e',
    ī: 'i',
    í: 'i',
    ǐ: 'i',
    ì: 'i',
    ō: 'o',
    ó: 'o',
    ǒ: 'o',
    ò: 'o',
    ū: 'u',
    ú: 'u',
    ǔ: 'u',
    ù: 'u',
    ǖ: 'v',
    ǘ: 'v',
    ǚ: 'v',
    ǜ: 'v',
  };

  return pinyin.replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/g, (match) => toneMap[match] || match);
}

/**
 * Get image path for a character's mnemonic artwork
 */
export function getCharacterImagePath(
  lessonNumber: number,
  characterId: number,
  pinyin: string
): string {
  return `/images/lesson${lessonNumber}/${characterId}_${pinyinToAscii(pinyin)}.png`;
}
