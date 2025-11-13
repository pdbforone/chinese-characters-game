'use client';

import { useState, useEffect } from 'react';
import { Character, GameMode } from '@/lib/types';
import { saveGameScore } from '@/lib/storage';
import { playRoundCompleteSound, playLevelUnlockSound } from '@/lib/sounds';
import GameBoard from './GameBoard';
import SoundToggle from './SoundToggle';

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
  const CHARACTERS_PER_ROUND = 6;
  const totalRounds = Math.ceil(characters.length / CHARACTERS_PER_ROUND);

  const [currentRound, setCurrentRound] = useState(0);
  const [gameMode, setGameMode] = useState<GameMode>('story-to-character');
  const [roundScores, setRoundScores] = useState<{ accuracy: number; score: number }[]>([]);
  const [showRoundTransition, setShowRoundTransition] = useState(false);

  const getRoundCharacters = () => {
    const start = currentRound * CHARACTERS_PER_ROUND;
    const end = start + CHARACTERS_PER_ROUND;
    return characters.slice(start, end);
  };

  const handleRoundComplete = (accuracy: number, score: number) => {
    const newScores = [...roundScores, { accuracy, score }];
    setRoundScores(newScores);

    // Play round complete sound
    playRoundCompleteSound();

    // Check if all rounds are complete
    if (currentRound + 1 >= totalRounds) {
      // All rounds done for this mode
      handleModeComplete(newScores);
    } else {
      // More rounds in this mode
      setShowRoundTransition(true);
    }
  };

  const handleModeComplete = (scores: { accuracy: number; score: number }[]) => {
    // Calculate overall stats for this mode
    const avgAccuracy = scores.reduce((sum, s) => sum + s.accuracy, 0) / scores.length;
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);

    // Save progress
    saveGameScore(lessonNumber, totalScore, avgAccuracy);

    // Check if we should advance to next difficulty
    if (gameMode === 'story-to-character' && avgAccuracy >= 70) {
      // Advance to character-to-story mode
      playLevelUnlockSound();
      setGameMode('character-to-story');
      setCurrentRound(0);
      setRoundScores([]);
      setShowRoundTransition(true);
    } else if (gameMode === 'character-to-story' && avgAccuracy >= 70) {
      // Advance to character-to-pinyin mode
      playLevelUnlockSound();
      setGameMode('character-to-pinyin');
      setCurrentRound(0);
      setRoundScores([]);
      setShowRoundTransition(true);
    } else {
      // All modes complete or failed to advance
      onComplete();
    }
  };

  const handleContinue = () => {
    setShowRoundTransition(false);
    setCurrentRound(currentRound + 1);
  };

  const getModeName = (mode: GameMode): string => {
    switch (mode) {
      case 'story-to-character':
        return 'Story → Character';
      case 'character-to-story':
        return 'Character → Story';
      case 'character-to-pinyin':
        return 'Character → Pinyin';
    }
  };

  const getModeDescription = (mode: GameMode): string => {
    switch (mode) {
      case 'story-to-character':
        return 'Match stories to characters';
      case 'character-to-story':
        return 'Match characters to their stories';
      case 'character-to-pinyin':
        return 'Match characters to their pronunciation';
    }
  };

  if (showRoundTransition) {
    const isNewMode = currentRound === 0;
    const lastScore = roundScores[roundScores.length - 1];

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          {isNewMode ? (
            <>
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  New Challenge Unlocked!
                </h2>
                <p className="text-gray-600">
                  You're ready for the next difficulty level
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-1">
                  {getModeName(gameMode)}
                </h3>
                <p className="text-sm text-gray-600">
                  {getModeDescription(gameMode)}
                </p>
              </div>

              <button
                onClick={handleContinue}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Start Challenge →
              </button>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">✓</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Round Complete!
                </h2>
                <div className="text-lg text-gray-600">
                  Accuracy: <span className="font-bold text-blue-600">
                    {lastScore.accuracy.toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>Round {currentRound + 1} of {totalRounds}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${((currentRound + 1) / totalRounds) * 100}%` }}
                  />
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Next Round →
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      {/* Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 mb-6 flex justify-between items-center">
        <button
          onClick={onBackToLessons}
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
        characters={getRoundCharacters()}
        lesson={lessonNumber}
        round={currentRound + 1}
        totalRounds={totalRounds}
        gameMode={gameMode}
        onRoundComplete={handleRoundComplete}
        onBackToLessons={onBackToLessons}
      />
    </div>
  );
}
