'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MultiRoundGame from '@/app/components/MultiRoundGame';
import CharacterIntroduction from '@/app/components/CharacterIntroduction';
import ReturnUserModal from '@/app/components/ReturnUserModal';
import RewardScreen from '@/app/components/RewardScreen';
import MasteryGate from '@/app/components/MasteryGate';
import MasteryGameSelector, { MasteryGameType } from '@/app/components/MasteryGameSelector';
import ToneRecall, { MasteryGameResult } from '@/app/components/ToneRecall';
import SoundRecall from '@/app/components/SoundRecall';
import CharacterRecall from '@/app/components/CharacterRecall';
import MasteryResult from '@/app/components/MasteryResult';
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
  | 'mastery-selector'
  | 'tone-recall'
  | 'sound-recall'
  | 'character-recall'
  | 'mastery-result'
  | 'mastery-review'
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
  const [masteryAccuracies, setMasteryAccuracies] = useState<Record<MasteryGameType, number>>({
    'tone-recall': 0,
    'sound-recall': 0,
    'character-recall': 0,
  });
  const [completedMasteryGames, setCompletedMasteryGames] = useState<MasteryGameType[]>([]);
  const [currentMasteryGame, setCurrentMasteryGame] = useState<MasteryGameType | null>(null);
  const [lastGameResult, setLastGameResult] = useState<MasteryGameResult | null>(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  // Check if this lesson supports mastery tier
  const supportsMastery = lessonSupportsMastery(lessonId);

  // Note: When lessonId changes in the URL, the entire page component remounts
  // due to Next.js dynamic routing, so we don't need useEffect to handle that

  const handleIntroductionComplete = () => {
    markIntroductionComplete(lessonId);
    setProgress((prev) => ({ ...prev, introductionCompleted: true }));
    setSessionStartTime(Date.now());
    setPhase('game');
  };

  const handleReviewCharacters = () => {
    setPhase('introduction');
  };

  const handleStartGame = () => {
    setSessionStartTime(Date.now());
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
    setPhase('mastery-selector');
  };

  const handleExitToLessons = () => {
    router.push('/');
  };

  const handleNextLesson = () => {
    router.push(`/lesson/${lessonId + 1}`);
  };

  const handleSelectMasteryGame = (game: MasteryGameType) => {
    setCurrentMasteryGame(game);
    setReviewMode(false);
    setPhase(game);
  };

  const handleMasteryGameComplete = (game: MasteryGameType, result: MasteryGameResult) => {
    // Save score for this specific game (only if not in review mode)
    if (!reviewMode) {
      const roundKey =
        game === 'tone-recall'
          ? 'toneRecall'
          : game === 'sound-recall'
            ? 'soundRecall'
            : 'characterRecall';
      saveRoundScore(
        lessonId,
        roundKey as 'toneRecall' | 'round1' | 'round2' | 'round3' | 'round4',
        Math.round(result.accuracy * 100)
      );

      // Update accuracies
      setMasteryAccuracies((prev) => ({ ...prev, [game]: result.accuracy }));

      // Add to completed games if not already there
      if (!completedMasteryGames.includes(game)) {
        const newCompleted = [...completedMasteryGames, game];
        setCompletedMasteryGames(newCompleted);

        // If all 3 games completed, mark as fully mastered
        if (newCompleted.length === 3) {
          const avgAccuracy =
            (masteryAccuracies['tone-recall'] +
              masteryAccuracies['sound-recall'] +
              result.accuracy) /
            3;
          markLessonMastered(lessonId, avgAccuracy);
        }
      }
    }

    // Store result and show result screen
    setLastGameResult(result);
    setPhase('mastery-result');
  };

  const handleReviewMissed = () => {
    if (currentMasteryGame && lastGameResult) {
      setReviewMode(true);
      setPhase(currentMasteryGame);
    }
  };

  const handleResultContinue = () => {
    // If all games done, go to complete, otherwise back to selector
    if (completedMasteryGames.length >= 3) {
      const savedProgress = getLessonProgress(lessonId);
      setProgress(savedProgress);
      setPhase('modal');
    } else {
      setPhase('mastery-selector');
    }
  };

  const handleResultBack = () => {
    setPhase('mastery-selector');
  };

  const handleToneRecallComplete = (result: MasteryGameResult) => {
    handleMasteryGameComplete('tone-recall', result);
  };

  const handleSoundRecallComplete = (result: MasteryGameResult) => {
    handleMasteryGameComplete('sound-recall', result);
  };

  const handleCharacterRecallComplete = (result: MasteryGameResult) => {
    handleMasteryGameComplete('character-recall', result);
  };

  const handleMasteryCompleteBack = () => {
    // If not all games completed, go back to selector
    if (completedMasteryGames.length < 3) {
      setPhase('mastery-selector');
    } else {
      const savedProgress = getLessonProgress(lessonId);
      setProgress(savedProgress);
      setPhase('modal');
    }
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
        sessionStartTime={sessionStartTime}
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

  // Mastery Game Selector - choose which mastery game to play
  if (phase === 'mastery-selector') {
    return (
      <MasteryGameSelector
        lessonNumber={lessonId}
        lessonData={lessonData}
        onSelectGame={handleSelectMasteryGame}
        onBack={() => setPhase('mastery-gate')}
        completedGames={completedMasteryGames}
      />
    );
  }

  // Get characters for current game (filtered if in review mode)
  const getGameCharacters = () => {
    if (reviewMode && lastGameResult && lastGameResult.missedCharacterIds.length > 0) {
      return lessonData.characters.filter((c) => lastGameResult.missedCharacterIds.includes(c.id));
    }
    return lessonData.characters;
  };

  // Tone Recall phase - pure tone recall mastery game
  if (phase === 'tone-recall') {
    return (
      <ToneRecall
        characters={getGameCharacters()}
        lessonData={lessonData}
        lessonNumber={lessonId}
        onComplete={handleToneRecallComplete}
        onBack={() => setPhase(reviewMode ? 'mastery-result' : 'mastery-selector')}
      />
    );
  }

  // Sound Recall phase - pinyin recall mastery game
  if (phase === 'sound-recall') {
    return (
      <SoundRecall
        characters={getGameCharacters()}
        lessonData={lessonData}
        lessonNumber={lessonId}
        onComplete={handleSoundRecallComplete}
        onBack={() => setPhase(reviewMode ? 'mastery-result' : 'mastery-selector')}
      />
    );
  }

  // Character Recall phase - character recognition mastery game
  if (phase === 'character-recall') {
    return (
      <CharacterRecall
        characters={getGameCharacters()}
        lessonData={lessonData}
        lessonNumber={lessonId}
        onComplete={handleCharacterRecallComplete}
        onBack={() => setPhase(reviewMode ? 'mastery-result' : 'mastery-selector')}
      />
    );
  }

  // Mastery Result phase - shows results with review option
  if (phase === 'mastery-result' && currentMasteryGame && lastGameResult) {
    const missedCharacters = lessonData.characters.filter((c) =>
      lastGameResult.missedCharacterIds.includes(c.id)
    );
    return (
      <MasteryResult
        lessonNumber={lessonId}
        lessonData={lessonData}
        gameType={currentMasteryGame}
        accuracy={lastGameResult.accuracy}
        missedCharacters={missedCharacters}
        totalCharacters={reviewMode ? missedCharacters.length : lessonData.characters.length}
        onReviewMissed={handleReviewMissed}
        onContinue={handleResultContinue}
        onBack={handleResultBack}
      />
    );
  }

  // Mastery Complete phase - celebration after completing a mastery game
  if (phase === 'mastery-complete') {
    const allGamesCompleted = completedMasteryGames.length === 3;
    const lastCompletedGame = completedMasteryGames[completedMasteryGames.length - 1];
    const lastAccuracy = masteryAccuracies[lastCompletedGame] || 0;

    const gameNames: Record<MasteryGameType, string> = {
      'tone-recall': 'Tone Recall',
      'sound-recall': 'Sound Recall',
      'character-recall': 'Character Recall',
    };

    const gameDescriptions: Record<MasteryGameType, string> = {
      'tone-recall': 'You recalled the tones from memory alone!',
      'sound-recall': 'You recalled the pinyin from the character!',
      'character-recall': 'You recognized the character from its sound!',
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          {/* Header - Gold celebration */}
          <div
            className={`bg-gradient-to-r ${allGamesCompleted ? 'from-amber-400 to-yellow-500' : 'from-blue-400 to-indigo-500'} p-6 text-center`}
          >
            <div className="text-6xl mb-3">{allGamesCompleted ? '★' : '✓'}</div>
            <h2 className="text-2xl font-bold text-white">
              {allGamesCompleted ? 'Lesson Mastered!' : 'Game Complete!'}
            </h2>
            <p className="text-white/80 mt-1">
              {gameNames[lastCompletedGame]}:{' '}
              <span className="font-bold text-white">{Math.round(lastAccuracy * 100)}%</span>
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Score display */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-4 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-xs text-amber-600 font-medium">
                {gameNames[lastCompletedGame]} Accuracy
              </p>
              <p className="text-3xl font-bold text-amber-800">{Math.round(lastAccuracy * 100)}%</p>
              <p className="text-sm text-amber-600 mt-2">{gameDescriptions[lastCompletedGame]}</p>
            </div>

            {/* Progress display */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 text-center mb-3">Mastery Progress</p>
              <div className="grid grid-cols-3 gap-2">
                {(['tone-recall', 'sound-recall', 'character-recall'] as MasteryGameType[]).map(
                  (game) => {
                    const isCompleted = completedMasteryGames.includes(game);
                    const accuracy = masteryAccuracies[game];
                    return (
                      <div
                        key={game}
                        className={`p-3 rounded-xl text-center ${
                          isCompleted
                            ? 'bg-amber-100 border-2 border-amber-300'
                            : 'bg-gray-50 border-2 border-gray-200'
                        }`}
                      >
                        <div className="text-lg mb-1">{isCompleted ? '✓' : '○'}</div>
                        <p className="text-xs font-medium text-gray-700">
                          {gameNames[game].split(' ')[0]}
                        </p>
                        {isCompleted && (
                          <p className="text-xs text-amber-600">{Math.round(accuracy * 100)}%</p>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {allGamesCompleted ? (
              <div className="bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 rounded-xl p-4 mb-6 text-center">
                <p className="text-amber-800 font-medium">
                  You&apos;ve earned <span className="font-bold">Gold status</span> for Lesson{' '}
                  {lessonId}!
                </p>
                <p className="text-sm text-amber-600 mt-2">{lessonData.title}</p>
              </div>
            ) : (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6 text-center">
                <p className="text-blue-800 font-medium">
                  {3 - completedMasteryGames.length} more game
                  {completedMasteryGames.length === 2 ? '' : 's'} to earn{' '}
                  <span className="font-bold text-amber-600">Gold status</span>!
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {!allGamesCompleted && (
                <button
                  onClick={handleMasteryCompleteBack}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Continue to Next Game →
                </button>
              )}
              <button
                onClick={handleNextLesson}
                className={`w-full ${allGamesCompleted ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold py-4' : 'bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3'} px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl`}
              >
                Next Lesson →
              </button>
              <button
                onClick={handleExitToLessons}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors"
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
