'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MultiRoundGame from '@/app/components/MultiRoundGame';
import CharacterIntroduction from '@/app/components/CharacterIntroduction';
import ReturnUserModal from '@/app/components/ReturnUserModal';
import RewardScreen from '@/app/components/RewardScreen';
import { getLessonData } from '@/lib/lessonLoader';
import { getLessonProgress, markIntroductionComplete } from '@/lib/storage';

type Phase = 'loading' | 'modal' | 'introduction' | 'game' | 'reward';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = parseInt(params.id as string);

  const lessonData = getLessonData(lessonId);

  // Load progress using useState with lazy initializer (no useEffect needed)
  const [progress, setProgress] = useState(() => getLessonProgress(lessonId));
  const [phase, setPhase] = useState<Phase>(() =>
    progress.introductionCompleted ? 'modal' : 'introduction'
  );
  const [gameAccuracies, setGameAccuracies] = useState<number[]>([]);

  // Note: When lessonId changes in the URL, the entire page component remounts
  // due to Next.js dynamic routing, so we don't need useEffect to handle that

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

  const handleGameComplete = (accuracies: number[]) => {
    // Save accuracies and show reward screen
    setGameAccuracies(accuracies);
    setPhase('reward');
  };

  const handleRewardContinue = () => {
    // Reload progress and show modal
    const savedProgress = getLessonProgress(lessonId);
    setProgress(savedProgress);
    setPhase('modal');
  };

  const handleReplayLesson = () => {
    // Restart from introduction
    setPhase('introduction');
  };

  // Lesson not found
  if (!lessonData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Lesson Not Found</h1>
          <p className="text-gray-600 mb-6">Lesson {lessonId} is not available yet.</p>
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="absolute top-4 left-4">
          <button
            onClick={handleBackToHome}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
          >
            ← Back to Lessons
          </button>
        </div>

        <ReturnUserModal
          lessonNumber={lessonId}
          bestScore={progress.bestScore}
          bestAccuracy={progress.bestAccuracy}
          gamesPlayed={progress.gamesPlayed}
          onReview={handleReviewCharacters}
          onStartGame={handleStartGame}
        />
      </div>
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
          lessonData={lessonData}
        />
      </>
    );
  }

  // Reward phase - shown after game completion
  if (phase === 'reward') {
    return (
      <RewardScreen
        characters={lessonData.characters}
        lessonNumber={lessonId}
        lessonData={lessonData}
        accuracies={gameAccuracies}
        onContinue={handleRewardContinue}
        onReplayLesson={handleReplayLesson}
      />
    );
  }

  // Game phase
  return (
    <MultiRoundGame
      characters={lessonData.characters}
      lessonNumber={lessonId}
      onComplete={handleGameComplete}
      onBackToLessons={handleBackToHome}
      onReview={handleReviewCharacters}
    />
  );
}
