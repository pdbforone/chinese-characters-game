import * as fs from "fs";
import * as path from "path";

// Tone mark to tone number mapping
const toneMap: Record<string, { letter: string; tone: number }> = {
  ā: { letter: "a", tone: 1 },
  á: { letter: "a", tone: 2 },
  ǎ: { letter: "a", tone: 3 },
  à: { letter: "a", tone: 4 },
  ē: { letter: "e", tone: 1 },
  é: { letter: "e", tone: 2 },
  ě: { letter: "e", tone: 3 },
  è: { letter: "e", tone: 4 },
  ī: { letter: "i", tone: 1 },
  í: { letter: "i", tone: 2 },
  ǐ: { letter: "i", tone: 3 },
  ì: { letter: "i", tone: 4 },
  ō: { letter: "o", tone: 1 },
  ó: { letter: "o", tone: 2 },
  ǒ: { letter: "o", tone: 3 },
  ò: { letter: "o", tone: 4 },
  ū: { letter: "u", tone: 1 },
  ú: { letter: "u", tone: 2 },
  ǔ: { letter: "u", tone: 3 },
  ù: { letter: "u", tone: 4 },
  ǖ: { letter: "ü", tone: 1 },
  ǘ: { letter: "ü", tone: 2 },
  ǚ: { letter: "ü", tone: 3 },
  ǜ: { letter: "ü", tone: 4 },
  Ā: { letter: "A", tone: 1 },
  Á: { letter: "A", tone: 2 },
  Ǎ: { letter: "A", tone: 3 },
  À: { letter: "A", tone: 4 },
  Ē: { letter: "E", tone: 1 },
  É: { letter: "E", tone: 2 },
  Ě: { letter: "E", tone: 3 },
  È: { letter: "E", tone: 4 },
  Ī: { letter: "I", tone: 1 },
  Í: { letter: "I", tone: 2 },
  Ǐ: { letter: "I", tone: 3 },
  Ì: { letter: "I", tone: 4 },
  Ō: { letter: "O", tone: 1 },
  Ó: { letter: "O", tone: 2 },
  Ǒ: { letter: "O", tone: 3 },
  Ò: { letter: "O", tone: 4 },
  Ū: { letter: "U", tone: 1 },
  Ú: { letter: "U", tone: 2 },
  Ǔ: { letter: "U", tone: 3 },
  Ù: { letter: "U", tone: 4 },
  Ǖ: { letter: "Ü", tone: 1 },
  Ǘ: { letter: "Ü", tone: 2 },
  Ǚ: { letter: "Ü", tone: 3 },
  Ǜ: { letter: "Ü", tone: 4 },
};

interface Character {
  id: number;
  character: string;
  pinyin: string;
  tone: number;
  meaning: string;
  story: string;
  primitives: string[];
}

interface LessonData {
  lesson: number;
  characters: Character[];
}

// Extract tone from pinyin and return normalized pinyin + tone number
function extractTone(pinyin: string): {
  normalizedPinyin: string;
  tone: number;
} {
  let tone = 5; // default neutral tone
  let normalizedPinyin = pinyin;

  // Check each character for tone marks
  for (const char of pinyin) {
    if (toneMap[char]) {
      tone = toneMap[char].tone;
      normalizedPinyin = normalizedPinyin.replace(char, toneMap[char].letter);
      break;
    }
  }

  return { normalizedPinyin, tone };
}

// Load primitives from existing lesson1.json if available
function loadExistingPrimitives(): Map<string, string[]> {
  const primitivesMap = new Map<string, string[]>();

  try {
    const lesson1Path = path.join(process.cwd(), "lib", "data", "lesson1.json");
    if (fs.existsSync(lesson1Path)) {
      const lesson1Content = fs.readFileSync(lesson1Path, "utf-8");
      const lesson1Data = JSON.parse(lesson1Content);

      for (const char of lesson1Data.characters) {
        primitivesMap.set(char.character, char.primitives || []);
      }

      console.log(
        `✅ Loaded primitives for ${primitivesMap.size} characters from lesson1.json`,
      );
    }
  } catch (error) {
    console.warn("⚠️  Could not load primitives from lesson1.json");
  }

  return primitivesMap;
}

async function main() {
  console.log("🚀 Starting lesson import process...\n");

  // Read the anki_enhanced.txt file
  const ankiFilePath = path.join(process.cwd(), "anki_enhanced.txt");

  if (!fs.existsSync(ankiFilePath)) {
    console.error("❌ Error: anki_enhanced.txt not found!");
    process.exit(1);
  }

  const ankiData = fs.readFileSync(ankiFilePath, "utf-8");
  const lines = ankiData.split("\n").filter((line) => line.trim());

  // Parse the header
  const headers = lines[0].split("\t");
  console.log(`📋 Found columns: ${headers.join(", ")}\n`);

  // Load existing primitives
  const primitivesMap = loadExistingPrimitives();
  console.log("");

  // Parse all rows
  const allCharacters: Character[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split("\t");

    if (values.length < 5) {
      console.warn(`⚠️  Skipping line ${i + 1}: insufficient columns`);
      continue;
    }

    const character = values[0].trim();
    const studyOrder = values[1].trim();
    const pinyinWithTones = values[2].trim();
    const meaning = values[3].trim();
    const story = values[4].trim();

    // Extract tone from pinyin
    const { normalizedPinyin, tone } = extractTone(pinyinWithTones);

    // Get primitives from existing data or use empty array
    const primitives = primitivesMap.get(character) || [];

    allCharacters.push({
      id: parseInt(studyOrder) || i,
      character,
      pinyin: normalizedPinyin,
      tone,
      meaning,
      story,
      primitives,
    });
  }

  console.log(`✅ Parsed ${allCharacters.length} characters\n`);

  // Group characters into lessons (18 per lesson to match existing structure)
  const CHARACTERS_PER_LESSON = 18;
  const lessonGroups: Record<number, Character[]> = {};

  allCharacters.forEach((char, index) => {
    const lessonNum = Math.floor(index / CHARACTERS_PER_LESSON) + 1;

    if (!lessonGroups[lessonNum]) {
      lessonGroups[lessonNum] = [];
    }

    lessonGroups[lessonNum].push(char);
  });

  console.log(`📚 Grouped into ${Object.keys(lessonGroups).length} lessons\n`);

  // Create lib/data directory if it doesn't exist
  const dataDir = path.join(process.cwd(), "lib", "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log("✅ Created lib/data directory\n");
  }

  // Write each lesson to a JSON file
  const lessonNumbers = Object.keys(lessonGroups)
    .map(Number)
    .sort((a, b) => a - b);

  for (const lessonNum of lessonNumbers) {
    const characters = lessonGroups[lessonNum];

    const lessonData: LessonData = {
      lesson: lessonNum,
      characters: characters,
    };

    const filename = path.join(dataDir, `lesson${lessonNum}.json`);
    fs.writeFileSync(filename, JSON.stringify(lessonData, null, 2), "utf-8");

    console.log(
      `✅ Created lesson${lessonNum}.json with ${characters.length} characters`,
    );
  }

  console.log("\n📊 Import Summary:");
  console.log(`   Total Lessons: ${lessonNumbers.length}`);
  console.log(`   Total Characters: ${allCharacters.length}`);
  console.log(`   Characters per lesson: ${CHARACTERS_PER_LESSON}\n`);

  // Generate lessonLoader.ts
  console.log("📝 Generating lessonLoader.ts...\n");

  const imports = lessonNumbers
    .map((num) => `import lesson${num} from './data/lesson${num}.json';`)
    .join("\n");

  const mapping = lessonNumbers
    .map((num) => `  ${num}: lesson${num},`)
    .join("\n");

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
    path.join(process.cwd(), "lib", "lessonLoader.ts"),
    loaderContent,
    "utf-8",
  );

  console.log("✅ Created lib/lessonLoader.ts\n");

  // Validation
  console.log("🔍 Running validation checks...\n");

  let hasErrors = false;
  let warningCount = 0;

  lessonNumbers.forEach((num) => {
    const lesson = lessonGroups[num];
    lesson.forEach((char: Character, idx: number) => {
      if (!char.character) {
        console.error(`❌ Lesson ${num}, Index ${idx}: Missing character`);
        hasErrors = true;
      }
      if (!char.story || char.story.length < 10) {
        console.warn(
          `⚠️  Lesson ${num}, Character ${char.character}: Story too short or missing`,
        );
        warningCount++;
      }
      if (char.tone < 1 || char.tone > 5) {
        console.error(
          `❌ Lesson ${num}, Character ${char.character}: Invalid tone ${char.tone}`,
        );
        hasErrors = true;
      }
      if (char.primitives.length === 0 && num > 1) {
        // Only warn for lessons after lesson 1
        // (we expect lesson 1 to have primitives, others might not)
      }
    });
  });

  console.log("");
  if (!hasErrors) {
    console.log("✅ All critical validations passed!");
  } else {
    console.log("❌ Some errors found. Please review.");
  }

  if (warningCount > 0) {
    console.log(`⚠️  ${warningCount} warnings (non-critical)`);
  }

  console.log("\n🎉 Import complete! All lesson files have been generated.\n");

  // Show first few and last few lessons as spot check
  console.log("📋 Lesson breakdown (first 5 and last 5):");
  const spotCheckLessons = [
    ...lessonNumbers.slice(0, 5),
    ...(lessonNumbers.length > 10 ? ["..."] : []),
    ...lessonNumbers.slice(-5),
  ];

  spotCheckLessons.forEach((num) => {
    if (num === "...") {
      console.log("   ...");
    } else {
      const count = lessonGroups[num as number].length;
      const chars = lessonGroups[num as number]
        .map((c) => c.character)
        .join("");
      console.log(`   Lesson ${num}: ${count} chars - ${chars}`);
    }
  });

  console.log(
    "\n✅ Ready to test! Run your game and check the lesson selection page.\n",
  );
}

main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
