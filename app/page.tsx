import Link from 'next/link';
import { getAllLessonsMetadata } from '@/lib/lessonLoader';

const lessonTitles: Record<number, string> = {
  1: 'Numbers & Basics',
  2: 'Sun & Moon Radicals',
  3: 'Direction & Position',
};

export default function Home() {
  const availableLessons = getAllLessonsMetadata();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">
          汉字 Learning Game
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Master Traditional Chinese Characters through Story Matching
        </p>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            How to Play:
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Study characters one-by-one with mnemonic stories</li>
            <li>Complete 4 progressive difficulty rounds:</li>
            <ul className="list-disc list-inside ml-6 space-y-1 text-gray-600">
              <li><strong>Round 1:</strong> Match stories to characters (with hints)</li>
              <li><strong>Round 2:</strong> Match characters to stories (pinyin only)</li>
              <li><strong>Round 3:</strong> Match meanings to characters (no hints)</li>
              <li><strong>Round 4:</strong> Match characters to pinyin (no hints)</li>
            </ul>
            <li>Each round covers all characters in pages of 4</li>
            <li>Achieve 70%+ accuracy to advance to the next round!</li>
          </ol>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Available Lessons: ({availableLessons.length})
          </h2>

          {availableLessons.map((lesson) => (
            <Link key={lesson.lessonNumber} href={`/lesson/${lesson.lessonNumber}`}>
              <div className="block p-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all cursor-pointer shadow-md hover:shadow-lg">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Lesson {lesson.lessonNumber}: {lessonTitles[lesson.lessonNumber] || 'Traditional Hanzi'}
                </h3>
                <p className="text-blue-100 mb-2">
                  {lesson.characterCount} characters: {lesson.characters.slice(0, 10)}{lesson.characters.length > 10 ? '...' : ''}
                </p>
                <div className="mt-4 text-sm text-blue-200">
                  Click to start →
                </div>
              </div>
            </Link>
          ))}

          <div className="p-6 bg-gray-200 rounded-lg opacity-60">
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              More Lessons Coming Soon
            </h3>
            <p className="text-gray-500">
              📖 Additional RTH lessons will be added progressively
            </p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700">
            <strong>Tip:</strong> Each story uses vivid imagery and sound patterns to help you remember the character's meaning and pronunciation. Read carefully and visualize the scene!
          </p>
        </div>
      </div>
    </div>
  );
}
