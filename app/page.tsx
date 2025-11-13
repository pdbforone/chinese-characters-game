import Link from 'next/link';
import { getAllLessonsMetadata } from '@/lib/lessonLoader';

export default function Home() {
  const lessons = getAllLessonsMetadata();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl p-8">
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

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Available Lessons: {lessons.length}
          </h2>
          <p className="text-gray-600 text-sm">
            {lessons.reduce((sum, l) => sum + l.characterCount, 0)} total characters to learn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
          {lessons.map((lesson) => (
            <Link key={lesson.lessonNumber} href={`/lesson/${lesson.lessonNumber}`}>
              <div className="block p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all cursor-pointer shadow-md hover:shadow-lg">
                <h3 className="text-lg font-bold text-white mb-2">
                  Lesson {lesson.lessonNumber}
                </h3>
                <p className="text-blue-100 text-sm mb-2">
                  {lesson.characterCount} characters
                </p>
                <p className="text-white text-xl">
                  {lesson.characters.split(', ').slice(0, 6).join(' ')}
                  {lesson.characters.split(', ').length > 6 ? ' ...' : ''}
                </p>
              </div>
            </Link>
          ))}
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
