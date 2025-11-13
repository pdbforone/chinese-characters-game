'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import GameBoard from '@/app/components/GameBoard';
import CharacterIntroduction from '@/app/components/CharacterIntroduction';
import ReturnUserModal from '@/app/components/ReturnUserModal';
import lessonData from '@/lib/data/lesson1.json';
import { getLessonProgress, markIntroductionComplete } from '@/lib/storage';

type Phase = 'loading' | 'modal' | 'introduction' | 'game';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = parseInt(params.id as string);

  const [phase, setPhase] = useState<Phase>('loading');
  const [progress, setProgress] = useState({
    introductionCompleted: false,
    gamesPlayed: 0,
    bestScore: 0,
    bestAccuracy: 0,
  });

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = getLessonProgress(lessonId);
    setProgress(savedProgress);

    // Determine which phase to show
    if (!savedProgress.introductionCompleted) {
      // First time - go straight to introduction
      setPhase('introduction');
    } else {
      // Returning user - show modal
      setPhase('modal');
    }
  }, [lessonId]);

  const handleIntroductionComplete = () => {
    markIntroductionComplete(lessonId);
    setProgress((prev) => ({ ...prev, introductionCompleted: true }));
    setPhase('game');
  };

  const handleReviewCharacters = () => {
    setPhase('introduction');
  };

  const handleStartGame = () => {
    setPhase('game');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  // Lesson not found
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
          <button
            onClick={handleBackToHome}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (phase === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  // Return user modal
  if (phase === 'modal') {
    return (
      <>
        <div className="min-h-screen py-8">
          <div className="max-w-7xl mx-auto px-4 mb-6">
            <button
              onClick={handleBackToHome}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
            >
              ← Back to Lessons
            </button>
          </div>

          {/* Dimmed background showing game board */}
          <div className="opacity-20 pointer-events-none">
            <GameBoard
              characters={lessonData.characters}
              lesson={lessonId}
              round={1}
            />
          </div>
        </div>

        <ReturnUserModal
          lessonNumber={lessonId}
          bestScore={progress.bestScore}
          bestAccuracy={progress.bestAccuracy}
          gamesPlayed={progress.gamesPlayed}
          onReview={handleReviewCharacters}
          onStartGame={handleStartGame}
        />
      </>
    );
  }

  // Introduction phase
  if (phase === 'introduction') {
    return (
      <>
        <div className="max-w-7xl mx-auto px-4 pt-4 absolute top-0 left-0 right-0 z-10">
          <button
            onClick={handleBackToHome}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
          >
            ← Back to Lessons
          </button>
        </div>

        <CharacterIntroduction
          characters={lessonData.characters}
          lessonNumber={lessonId}
          onComplete={handleIntroductionComplete}
        />
      </>
    );
  }

  // Game phase
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 mb-6 flex justify-between items-center">
        <button
          onClick={handleBackToHome}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
        >
          ← Back to Lessons
        </button>
        <button
          onClick={handleReviewCharacters}
          className="text-amber-600 hover:text-amber-800 font-medium flex items-center gap-2"
        >
          📖 Review Characters
        </button>
      </div>

      <GameBoard
        characters={lessonData.characters}
        lesson={lessonId}
        round={1}
      />
    </div>
  );
}
