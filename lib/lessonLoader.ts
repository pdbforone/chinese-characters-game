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

export interface Character {
  id: number;
  character: string;
  pinyin: string;
  tone: number;
  meaning: string;
  story: string;
  primitives: string[];
}

export interface LessonData {
  lesson: number;
  characters: Character[];
}

const lessons: Record<number, LessonData> = {
  1: lesson1,
  2: lesson2,
  3: lesson3,
  4: lesson4,
  5: lesson5,
  6: lesson6,
  7: lesson7,
  8: lesson8,
  9: lesson9,
  10: lesson10,
  11: lesson11,
  12: lesson12,
  13: lesson13,
  14: lesson14,
  15: lesson15,
  16: lesson16,
  17: lesson17,
  18: lesson18,
  19: lesson19,
  20: lesson20,
  21: lesson21,
  22: lesson22,
  23: lesson23,
  24: lesson24,
  25: lesson25,
  26: lesson26,
  27: lesson27,
  28: lesson28,
  29: lesson29,
  30: lesson30,
  31: lesson31,
  32: lesson32,
  33: lesson33,
  34: lesson34,
  35: lesson35,
  36: lesson36,
  37: lesson37,
  38: lesson38,
  39: lesson39,
  40: lesson40,
  41: lesson41,
  42: lesson42,
  43: lesson43,
  44: lesson44,
  45: lesson45,
  46: lesson46,
  47: lesson47,
  48: lesson48,
  49: lesson49,
  50: lesson50,
  51: lesson51,
  52: lesson52,
  53: lesson53,
  54: lesson54,
  55: lesson55,
  56: lesson56,
  57: lesson57,
  58: lesson58,
  59: lesson59,
  60: lesson60,
  61: lesson61,
  62: lesson62,
  63: lesson63,
  64: lesson64,
  65: lesson65,
  66: lesson66,
  67: lesson67,
  68: lesson68,
  69: lesson69,
  70: lesson70,
  71: lesson71,
  72: lesson72,
  73: lesson73,
  74: lesson74,
  75: lesson75,
  76: lesson76,
  77: lesson77,
  78: lesson78,
  79: lesson79,
  80: lesson80,
  81: lesson81,
  82: lesson82,
  83: lesson83,
  84: lesson84,
  85: lesson85,
  86: lesson86,
  87: lesson87,
  88: lesson88,
  89: lesson89,
  90: lesson90,
  91: lesson91,
  92: lesson92,
  93: lesson93,
  94: lesson94,
  95: lesson95,
  96: lesson96,
  97: lesson97,
  98: lesson98,
  99: lesson99,
  100: lesson100,
  101: lesson101,
  102: lesson102,
  103: lesson103,
  104: lesson104,
  105: lesson105,
  106: lesson106,
  107: lesson107,
  108: lesson108,
  109: lesson109,
  110: lesson110,
  111: lesson111,
  112: lesson112,
};

export function getLessonData(lessonNumber: number): LessonData | null {
  return lessons[lessonNumber] || null;
}

export function getAvailableLessons(): number[] {
  return Object.keys(lessons).map(Number).sort((a, b) => a - b);
}

export function getAllLessonsMetadata() {
  return getAvailableLessons().map(num => ({
    lesson: num,
    characterCount: lessons[num].characters.length,
    characters: lessons[num].characters.map(c => c.character)
  }));
}
