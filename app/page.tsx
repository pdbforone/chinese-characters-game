import Link from 'next/link';

export default function Home() {
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
            <li>Read the mnemonic story on the left</li>
            <li>Click the story to select it</li>
            <li>Click the matching character on the right</li>
            <li>Get instant feedback - green for correct, red for incorrect</li>
            <li>Match all 6 characters to complete the round!</li>
          </ol>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Available Lessons:
          </h2>

          <Link href="/lesson/1">
            <div className="block p-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all cursor-pointer shadow-md hover:shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-2">
                Lesson 1: Numbers & Basics
              </h3>
              <p className="text-blue-100">
                Learn your first 6 characters: 一, 二, 三, 四, 五, 六
              </p>
              <div className="mt-4 text-sm text-blue-200">
                Click to start →
              </div>
            </div>
          </Link>

          <div className="p-6 bg-gray-200 rounded-lg opacity-60 cursor-not-allowed">
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              Lesson 2: Coming Soon
            </h3>
            <p className="text-gray-500">
              🔒 Complete Lesson 1 to unlock
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
