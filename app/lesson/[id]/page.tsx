import GameBoard from '@/app/components/GameBoard';
import lessonData from '@/lib/data/lesson1.json';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { id } = await params;
  const lessonId = parseInt(id);

  // For now, we only have lesson 1
  if (lessonId !== 1) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Lesson Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            Lesson {lessonId} is not available yet.
          </p>
          <Link href="/">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <Link href="/">
          <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
            ← Back to Lessons
          </button>
        </Link>
      </div>

      <GameBoard
        characters={lessonData.characters}
        lesson={lessonId}
        round={1}
      />
    </div>
  );
}
