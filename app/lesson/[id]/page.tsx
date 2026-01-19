'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MultiRoundGame from '@/app/components/MultiRoundGame';
import CharacterIntroduction from '@/app/components/CharacterIntroduction';
import ReturnUserModal from '@/app/components/ReturnUserModal';
import RewardScreen from '@/app/components/RewardScreen';
import MasteryGate from '@/app/components/MasteryGate';
import StoryMason from '@/app/components/StoryMason';
import { getLessonData } from '@/lib/lessonLoader';
import {
  getLessonProgress,
  markIntroductionComplete,
  markLessonCompleted,
  markLessonMastered,
  lessonSupportsMastery,
  saveRoundScore,
} from '@/lib/storage';

type Phase =
  | 'loading'
  | 'modal'
  | 'introduction'
  | 'game'
  | 'reward'
  | 'mastery-gate'
  | 'story-mason'
  | 'mastery-complete';

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
  const [coreAccuracy, setCoreAccuracy] = useState<number>(0);
  const [masteryAccuracy, setMasteryAccuracy] = useState<number>(0);

  // Check if this lesson supports mastery tier
  const supportsMastery = lessonSupportsMastery(lessonId);

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
    // Calculate average accuracy across all rounds
    const avgAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
    setCoreAccuracy(avgAccuracy);
    setGameAccuracies(accuracies);

    // Mark lesson as completed (Silver status)
    markLessonCompleted(lessonId, avgAccuracy);

    // Show reward screen first, then mastery gate for supported lessons
    setPhase('reward');
  };

  const handleRewardContinue = () => {
    // After reward, show mastery gate if supported, otherwise return to modal
    if (supportsMastery) {
      setPhase('mastery-gate');
    } else {
      const savedProgress = getLessonProgress(lessonId);
      setProgress(savedProgress);
      setPhase('modal');
    }
  };

  const handleReplayLesson = () => {
    // Restart from introduction
    setPhase('introduction');
  };

  // Mastery Tier handlers
  const handleContinueToMastery = () => {
    setPhase('story-mason');
  };

  const handleExitToLessons = () => {
    router.push('/');
  };

  const handleNextLesson = () => {
    router.push(`/lesson/${lessonId + 1}`);
  };

  const handleStoryMasonComplete = (accuracy: number) => {
    // Save Story Mason score
    saveRoundScore(lessonId, 'storyMason', Math.round(accuracy * 100));
    setMasteryAccuracy(accuracy);

    // Mark lesson as mastered (Gold status)
    // In full implementation, this would wait for Story Detective too
    markLessonMastered(lessonId, accuracy);

    setPhase('mastery-complete');
  };

  const handleMasteryCompleteBack = () => {
    const savedProgress = getLessonProgress(lessonId);
    setProgress(savedProgress);
    setPhase('modal');
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
          supportsMastery={supportsMastery}
          isMastered={progress.status === 'mastered'}
          onStartMastery={handleContinueToMastery}
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

  // Mastery Gate phase - shown after core completion for supported lessons
  if (phase === 'mastery-gate') {
    return (
      <MasteryGate
        lessonNumber={lessonId}
        coreAccuracy={coreAccuracy}
        onContinueToMastery={handleContinueToMastery}
        onExitToLessons={handleExitToLessons}
        onNextLesson={handleNextLesson}
      />
    );
  }

  // Story Mason phase - narrative sequencing game
  if (phase === 'story-mason') {
    return (
      <StoryMason
        characters={lessonData.characters}
        lessonData={lessonData}
        lessonNumber={lessonId}
        onComplete={handleStoryMasonComplete}
        onBack={() => setPhase('mastery-gate')}
      />
    );
  }

  // Mastery Complete phase - celebration after completing mastery tier
  if (phase === 'mastery-complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          {/* Header - Gold celebration */}
          <div className="bg-gradient-to-r from-amber-400 to-yellow-500 p-6 text-center">
            <div className="text-6xl mb-3">★</div>
            <h2 className="text-2xl font-bold text-white">Lesson Mastered!</h2>
            <p className="text-amber-100 mt-1">
              Story Mason:{' '}
              <span className="font-bold text-white">{Math.round(masteryAccuracy * 100)}%</span>
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6 text-center">
              <p className="text-amber-800 font-medium">
                You&apos;ve earned <span className="font-bold">Gold status</span> for Lesson{' '}
                {lessonId}!
              </p>
              <p className="text-sm text-amber-600 mt-2">{lessonData.title}</p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleNextLesson}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Next Lesson →
              </button>
              <button
                onClick={handleMasteryCompleteBack}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Back to Lesson
              </button>
              <button
                onClick={handleExitToLessons}
                className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors"
              >
                Return to All Lessons
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game phase (core rounds)
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
