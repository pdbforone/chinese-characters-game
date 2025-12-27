'use client';

import { useState, useEffect } from 'react';
import { Character, GameMode } from '@/lib/types';
import { saveGameScore, getAllLessonProgress } from '@/lib/storage';
import { playRoundCompleteSound, playLevelUnlockSound } from '@/lib/sounds';
import { recordReview } from '@/lib/spacedRepetition';
import {
  checkGameAchievements,
  type AchievementDef,
  type AchievementState,
} from '@/lib/achievements';
import GameBoard from './GameBoard';
import SoundToggle from './SoundToggle';
import ConfirmDialog from './ConfirmDialog';
import AchievementToast from './AchievementToast';

interface MultiRoundGameProps {
  characters: Character[];
  lessonNumber: number;
  onComplete: () => void;
  onBackToLessons: () => void;
  onReview?: () => void;
}

export default function MultiRoundGame({
  characters,
  lessonNumber,
  onComplete,
  onBackToLessons,
  onReview,
}: MultiRoundGameProps) {
  const CHARACTERS_PER_PAGE = 4;
  const totalPages = Math.ceil(characters.length / CHARACTERS_PER_PAGE);

  // Round = difficulty level (1, 2, or 3)
  // Page = which set of 4 characters (0, 1, 2, etc.)
  const [currentRound, setCurrentRound] = useState(1); // 1, 2, or 3
  const [currentPage, setCurrentPage] = useState(0);
  const [roundScores, setRoundScores] = useState<{ accuracy: number; score: number }[]>([]);
  const [allRoundAccuracies, setAllRoundAccuracies] = useState<number[]>([]);
  const [showTransition, setShowTransition] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<
    (AchievementDef & AchievementState) | null
  >(null);
  const [achievementQueue, setAchievementQueue] = useState<
    Array<AchievementDef & AchievementState>
  >([]);

  const getPageCharacters = () => {
    const start = currentPage * CHARACTERS_PER_PAGE;
    const end = start + CHARACTERS_PER_PAGE;
    return characters.slice(start, end);
  };

  const getGameMode = (): GameMode => {
    if (currentRound === 1) return 'story-to-character';
    if (currentRound === 2) return 'character-to-story';
    return 'character-to-pinyin';
  };

  const handlePageComplete = (accuracy: number, score: number) => {
    const newScores = [...roundScores, { accuracy, score }];
    setRoundScores(newScores);

    playRoundCompleteSound();

    // Check if all pages are complete for this round
    if (currentPage + 1 >= totalPages) {
      // All pages done for this difficulty round
      handleRoundComplete(newScores);
    } else {
      // More pages in this round
      setShowTransition(true);
    }
  };

  const handleRoundComplete = (scores: { accuracy: number; score: number }[]) => {
    // Calculate overall stats for this round
    const avgAccuracy = scores.reduce((sum, s) => sum + s.accuracy, 0) / scores.length;
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);

    // Save progress
    saveGameScore(lessonNumber, totalScore, avgAccuracy);

    // Track accuracy for this round (for achievements)
    const updatedAccuracies = [...allRoundAccuracies, avgAccuracy];
    setAllRoundAccuracies(updatedAccuracies);

    // Record spaced repetition data for each character
    // Only record after Round 3 (final assessment) for accurate mastery tracking
    if (currentRound === 3) {
      characters.forEach((char) => {
        recordReview(lessonNumber, char.id, char.character, avgAccuracy);
      });
    }

    // Check if we should advance to next round (difficulty level)
    if (currentRound < 3 && avgAccuracy >= 70) {
      // Advance to next difficulty
      playLevelUnlockSound();
      setCurrentRound(currentRound + 1);
      setCurrentPage(0);
      setRoundScores([]);
      setShowTransition(true);
    } else if (currentRound === 3) {
      // All 3 rounds complete! Check achievements before completing
      checkAchievementsAfterGame(updatedAccuracies);
      onComplete();
    } else {
      // Failed to advance - restart current round
      setCurrentPage(0);
      setRoundScores([]);
      setShowTransition(true);
    }
  };

  // Check and display achievements after game completion
  const checkAchievementsAfterGame = (accuracies: number[]) => {
    // Calculate total characters completed across all lessons
    const allProgress = getAllLessonProgress();
    const totalCharacters = Object.values(allProgress).reduce(
      (sum, p) => sum + (p.bestAccuracy >= 70 ? 15 : 0), // Assume 15 chars per lesson
      0
    );

    // Pass accuracies directly - achievement system now expects 3 rounds:
    // Round 1: Story → Character
    // Round 2: Character → Story
    // Round 3: Character → Pinyin
    const newAchievements = checkGameAchievements(accuracies, totalCharacters);

    if (newAchievements.length > 0) {
      // Show first achievement immediately
      setCurrentAchievement(newAchievements[0]);
      // Queue remaining achievements
      if (newAchievements.length > 1) {
        setAchievementQueue(newAchievements.slice(1));
      }
    }
  };

  // Handle achievement toast dismissal - show next in queue
  const handleAchievementClose = () => {
    if (achievementQueue.length > 0) {
      setCurrentAchievement(achievementQueue[0]);
      setAchievementQueue(achievementQueue.slice(1));
    } else {
      setCurrentAchievement(null);
    }
  };

  const handleContinue = () => {
    setShowTransition(false);
    setCurrentPage(currentPage + 1);
  };

  const handleBackClick = () => {
    setShowExitConfirm(true);
  };

  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    onBackToLessons();
  };

  const handleCancelExit = () => {
    setShowExitConfirm(false);
  };

  // Handle browser back button - show confirmation instead of immediate exit
  useEffect(() => {
    // Push a dummy state when component mounts
    window.history.pushState({ preventBack: true }, '');

    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.preventBack) {
        // User pressed back button - show confirmation
        setShowExitConfirm(true);
        // Re-push the state to keep them on the page
        window.history.pushState({ preventBack: true }, '');
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const getRoundName = (): string => {
    if (currentRound === 1) return 'Round 1: Story → Character';
    if (currentRound === 2) return 'Round 2: Character → Story';
    return 'Round 3: Character → Pinyin';
  };

  const getRoundDescription = (): string => {
    if (currentRound === 1) return 'Match stories to characters (pinyin & meaning shown)';
    if (currentRound === 2) return 'Match characters to stories (only pinyin shown)';
    return 'Match characters to pinyin (no hints!)';
  };

  if (showTransition) {
    const isNewRound = currentPage === 0;
    const lastScore = roundScores[roundScores.length - 1];

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          {isNewRound ? (
            <>
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">
                  {currentRound === 1 ? '📚' : currentRound === 2 ? '🎯' : '🏆'}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {currentRound > 1 ? 'New Challenge Unlocked!' : 'Ready to Begin!'}
                </h2>
                <p className="text-gray-600">
                  {currentRound > 1
                    ? "You're ready for increased difficulty"
                    : "Let's start learning!"}
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-1">{getRoundName()}</h3>
                <p className="text-sm text-gray-600">{getRoundDescription()}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {totalPages} pages • {characters.length} characters total
                </p>
              </div>

              <button
                onClick={handleContinue}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Start Round {currentRound} →
              </button>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">✓</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Complete!</h2>
                <div className="text-lg text-gray-600">
                  Accuracy:{' '}
                  <span className="font-bold text-blue-600">{lastScore.accuracy.toFixed(0)}%</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{getRoundName()}</span>
                  <span>
                    Page {currentPage + 1} of {totalPages}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${((currentPage + 1) / totalPages) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Next Page →
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showExitConfirm}
        title="Leave Lesson?"
        message="Your progress has been saved, but you'll exit the current game. Are you sure you want to return to the lesson list?"
        confirmText="Yes, Exit"
        cancelText="Stay Here"
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
        variant="warning"
      />

      {/* Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 mb-6 flex justify-between items-center">
        <button
          onClick={handleBackClick}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
        >
          ← Back to Lessons
        </button>
        <div className="flex items-center gap-4">
          <SoundToggle />
          {onReview && (
            <button
              onClick={onReview}
              className="text-amber-600 hover:text-amber-800 font-medium flex items-center gap-2"
            >
              📖 Review Characters
            </button>
          )}
        </div>
      </div>

      <GameBoard
        characters={getPageCharacters()}
        lesson={lessonNumber}
        round={currentRound}
        page={currentPage + 1}
        totalPages={totalPages}
        gameMode={getGameMode()}
        onRoundComplete={handlePageComplete}
        onBackToLessons={onBackToLessons}
      />

      {/* Achievement Toast */}
      <AchievementToast achievement={currentAchievement} onClose={handleAchievementClose} />
    </div>
  );
}
