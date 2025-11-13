const fs = require('fs');
const path = require('path');

// RTH Lesson boundaries from the actual book structure
const lessonBoundaries = [
  // Book 1 - Lessons 1-55 (Characters 1-1500)
  { lesson: 1, start: 1, end: 15 },
  { lesson: 2, start: 16, end: 31 },
  { lesson: 3, start: 32, end: 49 },
  { lesson: 4, start: 50, end: 67 },
  { lesson: 5, start: 68, end: 90 },
  { lesson: 6, start: 91, end: 102 },
  { lesson: 7, start: 103, end: 122 },
  { lesson: 8, start: 123, end: 168 },
  { lesson: 9, start: 169, end: 190 },
  { lesson: 10, start: 191, end: 222 },
  { lesson: 11, start: 223, end: 240 },
  { lesson: 12, start: 241, end: 267 },
  { lesson: 13, start: 268, end: 287 },
  { lesson: 14, start: 288, end: 310 },
  { lesson: 15, start: 311, end: 332 },
  { lesson: 16, start: 333, end: 352 },
  { lesson: 17, start: 353, end: 374 },
  { lesson: 18, start: 375, end: 446 },
  { lesson: 19, start: 447, end: 475 },
  { lesson: 20, start: 476, end: 513 },
  { lesson: 21, start: 514, end: 547 },
  { lesson: 22, start: 548, end: 633 },
  { lesson: 23, start: 634, end: 650 },
  { lesson: 24, start: 651, end: 709 },
  { lesson: 25, start: 710, end: 735 },
  { lesson: 26, start: 736, end: 792 },
  { lesson: 27, start: 793, end: 810 },
  { lesson: 28, start: 811, end: 833 },
  { lesson: 29, start: 834, end: 855 },
  { lesson: 30, start: 856, end: 896 },
  { lesson: 31, start: 897, end: 926 },
  { lesson: 32, start: 927, end: 950 },
  { lesson: 33, start: 951, end: 980 },
  { lesson: 34, start: 981, end: 1004 },
  { lesson: 35, start: 1005, end: 1041 },
  { lesson: 36, start: 1042, end: 1060 },
  { lesson: 37, start: 1061, end: 1102 },
  { lesson: 38, start: 1103, end: 1148 },
  { lesson: 39, start: 1149, end: 1185 },
  { lesson: 40, start: 1186, end: 1200 },
  { lesson: 41, start: 1201, end: 1224 },
  { lesson: 42, start: 1225, end: 1246 },
  { lesson: 43, start: 1247, end: 1261 },
  { lesson: 44, start: 1262, end: 1284 },
  { lesson: 45, start: 1285, end: 1301 },
  { lesson: 46, start: 1302, end: 1311 },
  { lesson: 47, start: 1312, end: 1327 },
  { lesson: 48, start: 1328, end: 1344 },
  { lesson: 49, start: 1345, end: 1356 },
  { lesson: 50, start: 1357, end: 1373 },
  { lesson: 51, start: 1374, end: 1393 },
  { lesson: 52, start: 1394, end: 1414 },
  { lesson: 53, start: 1415, end: 1433 },
  { lesson: 54, start: 1434, end: 1445 },
  { lesson: 55, start: 1446, end: 1500 },

  // Book 2 - Lessons 56-110 (Characters 1501-2978)
  { lesson: 56, start: 1501, end: 1501 },
  { lesson: 57, start: 1502, end: 1502 },
  { lesson: 58, start: 1503, end: 1505 },
  { lesson: 59, start: 1506, end: 1506 },
  { lesson: 60, start: 1507, end: 1511 },
  { lesson: 61, start: 1512, end: 1516 },
  { lesson: 62, start: 1517, end: 1520 },
  { lesson: 63, start: 1521, end: 1533 },
  { lesson: 64, start: 1534, end: 1541 },
  { lesson: 65, start: 1542, end: 1565 },
  { lesson: 66, start: 1566, end: 1573 },
  { lesson: 67, start: 1574, end: 1591 },
  { lesson: 68, start: 1592, end: 1603 },
  { lesson: 69, start: 1604, end: 1611 },
  { lesson: 70, start: 1612, end: 1628 },
  { lesson: 71, start: 1629, end: 1639 },
  { lesson: 72, start: 1640, end: 1647 },
  { lesson: 73, start: 1648, end: 1689 },
  { lesson: 74, start: 1690, end: 1706 },
  { lesson: 75, start: 1707, end: 1746 },
  { lesson: 76, start: 1747, end: 1789 },
  { lesson: 77, start: 1790, end: 1877 },
  { lesson: 78, start: 1878, end: 1893 },
  { lesson: 79, start: 1894, end: 1940 },
  { lesson: 80, start: 1941, end: 1989 },
  { lesson: 81, start: 1990, end: 2062 },
  { lesson: 82, start: 2063, end: 2073 },
  { lesson: 83, start: 2074, end: 2098 },
  { lesson: 84, start: 2099, end: 2120 },
  { lesson: 85, start: 2121, end: 2170 },
  { lesson: 86, start: 2171, end: 2202 },
  { lesson: 87, start: 2203, end: 2227 },
  { lesson: 88, start: 2228, end: 2276 },
  { lesson: 89, start: 2277, end: 2294 },
  { lesson: 90, start: 2295, end: 2356 },
  { lesson: 91, start: 2357, end: 2392 },
  { lesson: 92, start: 2393, end: 2464 },
  { lesson: 93, start: 2465, end: 2504 },
  { lesson: 94, start: 2505, end: 2536 },
  { lesson: 95, start: 2537, end: 2544 },
  { lesson: 96, start: 2545, end: 2571 },
  { lesson: 97, start: 2572, end: 2593 },
  { lesson: 98, start: 2594, end: 2638 },
  { lesson: 99, start: 2639, end: 2662 },
  { lesson: 100, start: 2663, end: 2687 },
  { lesson: 101, start: 2688, end: 2705 },
  { lesson: 102, start: 2706, end: 2721 },
  { lesson: 103, start: 2722, end: 2747 },
  { lesson: 104, start: 2748, end: 2767 },
  { lesson: 105, start: 2768, end: 2781 },
  { lesson: 106, start: 2782, end: 2807 },
  { lesson: 107, start: 2808, end: 2846 },
  { lesson: 108, start: 2847, end: 2893 },
  { lesson: 109, start: 2894, end: 2911 },
  { lesson: 110, start: 2912, end: 2978 },

  // Additional sections
  { lesson: 111, start: 2979, end: 3000, name: 'Compounds' },
  { lesson: 112, start: 3001, end: 3035, name: 'Postscripts' }
];

// Tone mark mapping
const toneMap = {
  'ā': { letter: 'a', tone: 1 }, 'á': { letter: 'a', tone: 2 }, 'ǎ': { letter: 'a', tone: 3 }, 'à': { letter: 'a', tone: 4 },
  'ē': { letter: 'e', tone: 1 }, 'é': { letter: 'e', tone: 2 }, 'ě': { letter: 'e', tone: 3 }, 'è': { letter: 'e', tone: 4 },
  'ī': { letter: 'i', tone: 1 }, 'í': { letter: 'i', tone: 2 }, 'ǐ': { letter: 'i', tone: 3 }, 'ì': { letter: 'i', tone: 4 },
  'ō': { letter: 'o', tone: 1 }, 'ó': { letter: 'o', tone: 2 }, 'ǒ': { letter: 'o', tone: 3 }, 'ò': { letter: 'o', tone: 4 },
  'ū': { letter: 'u', tone: 1 }, 'ú': { letter: 'u', tone: 2 }, 'ǔ': { letter: 'u', tone: 3 }, 'ù': { letter: 'u', tone: 4 },
  'ǖ': { letter: 'ü', tone: 1 }, 'ǘ': { letter: 'ü', tone: 2 }, 'ǚ': { letter: 'ü', tone: 3 }, 'ǜ': { letter: 'ü', tone: 4 },
};

function extractTone(pinyin) {
  let tone = 5;
  let normalizedPinyin = pinyin;

  for (const char of pinyin) {
    if (toneMap[char]) {
      tone = toneMap[char].tone;
      normalizedPinyin = normalizedPinyin.replace(char, toneMap[char].letter);
      break;
    }
  }

  return { normalizedPinyin, tone };
}

function loadExistingPrimitives() {
  const primitivesMap = new Map();

  try {
    const lesson1Path = path.join(process.cwd(), 'lib', 'data', 'lesson1.json');
    if (fs.existsSync(lesson1Path)) {
      const lesson1Content = fs.readFileSync(lesson1Path, 'utf-8');
      const lesson1Data = JSON.parse(lesson1Content);

      for (const char of lesson1Data.characters) {
        primitivesMap.set(char.character, char.primitives || []);
      }

      console.log(`✅ Loaded primitives for ${primitivesMap.size} characters from lesson1.json`);
    }
  } catch (error) {
    console.warn('⚠️  Could not load primitives from lesson1.json');
  }

  return primitivesMap;
}

async function main() {
  console.log('🚀 Starting RTH lesson import with correct boundaries...\n');

  const ankiFilePath = path.join(process.cwd(), 'anki_enhanced.txt');

  if (!fs.existsSync(ankiFilePath)) {
    console.error('❌ Error: anki_enhanced.txt not found!');
    process.exit(1);
  }

  const ankiData = fs.readFileSync(ankiFilePath, 'utf-8');
  const lines = ankiData.split('\n').filter(line => line.trim());

  const headers = lines[0].split('\t');
  console.log(`📋 Columns: ${headers.join(', ')}\n`);

  const primitivesMap = loadExistingPrimitives();
  console.log('');

  // Parse all characters
  const allCharacters = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split('\t');

    if (values.length < 5) {
      console.warn(`⚠️  Skipping line ${i + 1}: insufficient columns`);
      continue;
    }

    const character = values[0].trim();
    const studyOrder = parseInt(values[1].trim());
    const pinyinWithTones = values[2].trim();
    const meaning = values[3].trim();
    const story = values[4].trim();

    const { normalizedPinyin, tone } = extractTone(pinyinWithTones);
    const primitives = primitivesMap.get(character) || [];

    allCharacters.push({
      id: studyOrder,
      character,
      pinyin: normalizedPinyin,
      tone,
      meaning,
      story,
      primitives
    });
  }

  console.log(`✅ Parsed ${allCharacters.length} characters\n`);

  // Create a map for quick lookup
  const charMap = new Map();
  allCharacters.forEach(char => charMap.set(char.id, char));

  // Generate lessons based on RTH boundaries
  const dataDir = path.join(process.cwd(), 'lib', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  let totalCharactersProcessed = 0;
  let missedCharacters = 0;

  for (const boundary of lessonBoundaries) {
    const lessonCharacters = [];

    for (let charId = boundary.start; charId <= boundary.end; charId++) {
      const char = charMap.get(charId);
      if (char) {
        lessonCharacters.push(char);
      } else {
        console.warn(`⚠️  Character ${charId} not found in anki data`);
        missedCharacters++;
      }
    }

    if (lessonCharacters.length > 0) {
      const lessonData = {
        lesson: boundary.lesson,
        characters: lessonCharacters
      };

      const filename = path.join(dataDir, `lesson${boundary.lesson}.json`);
      fs.writeFileSync(filename, JSON.stringify(lessonData, null, 2), 'utf-8');

      const lessonName = boundary.name ? ` (${boundary.name})` : '';
      console.log(`✅ Lesson ${boundary.lesson}${lessonName}: ${lessonCharacters.length} characters (${boundary.start}-${boundary.end})`);

      totalCharactersProcessed += lessonCharacters.length;
    }
  }

  console.log('\n📊 Import Summary:');
  console.log(`   Total Lessons: ${lessonBoundaries.length}`);
  console.log(`   Total Characters Processed: ${totalCharactersProcessed}`);
  console.log(`   Characters in Source File: ${allCharacters.length}`);
  console.log(`   Missing Characters: ${missedCharacters}\n`);

  // Generate lessonLoader.ts
  console.log('📝 Generating lessonLoader.ts...\n');

  const imports = lessonBoundaries
    .map(b => `import lesson${b.lesson} from './data/lesson${b.lesson}.json';`)
    .join('\n');

  const mapping = lessonBoundaries
    .map(b => `  ${b.lesson}: lesson${b.lesson},`)
    .join('\n');

  const loaderContent = `${imports}

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
${mapping}
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
`;

  fs.writeFileSync(
    path.join(process.cwd(), 'lib', 'lessonLoader.ts'),
    loaderContent,
    'utf-8'
  );

  console.log('✅ Updated lib/lessonLoader.ts\n');

  // Validation
  console.log('🔍 Running validation...\n');

  let hasErrors = false;
  let warningCount = 0;

  lessonBoundaries.forEach(boundary => {
    const filename = path.join(dataDir, `lesson${boundary.lesson}.json`);
    if (fs.existsSync(filename)) {
      const lessonData = JSON.parse(fs.readFileSync(filename, 'utf-8'));

      lessonData.characters.forEach((char, idx) => {
        if (!char.character) {
          console.error(`❌ Lesson ${boundary.lesson}, Index ${idx}: Missing character`);
          hasErrors = true;
        }
        if (!char.story || char.story.length < 10) {
          warningCount++;
        }
        if (char.tone < 1 || char.tone > 5) {
          console.error(`❌ Lesson ${boundary.lesson}, Character ${char.character}: Invalid tone ${char.tone}`);
          hasErrors = true;
        }
      });
    }
  });

  console.log('');
  if (!hasErrors) {
    console.log('✅ All critical validations passed!');
  } else {
    console.log('❌ Some errors found.');
  }

  if (warningCount > 0) {
    console.log(`⚠️  ${warningCount} warnings (short stories)`);
  }

  console.log('\n🎉 RTH lesson import complete!\n');

  // Show sample lessons
  console.log('📋 Sample lessons:');
  [1, 10, 22, 55, 77, 110, 111, 112].forEach(lessonNum => {
    const boundary = lessonBoundaries.find(b => b.lesson === lessonNum);
    if (boundary) {
      const count = boundary.end - boundary.start + 1;
      const name = boundary.name ? ` (${boundary.name})` : '';
      console.log(`   Lesson ${lessonNum}${name}: ${count} chars (${boundary.start}-${boundary.end})`);
    }
  });

  console.log('\n✅ All RTH lessons imported with correct boundaries!\n');
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
