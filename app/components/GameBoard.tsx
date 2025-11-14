'use client';

import { useState, useMemo, useEffect } from 'react';
import { Character, GameStats, GameMode } from '@/lib/types';
import { saveGameScore } from '@/lib/storage';
import { playCorrectSound, playIncorrectSound } from '@/lib/sounds';
import StoryCard from './StoryCard';
import CharacterCard from './CharacterCard';
import PinyinCard from './PinyinCard';
import ProgressBar from './ProgressBar';
import HintToast from './HintToast';

interface GameBoardProps {
  characters: Character[];
  lesson: number;
  round: number;
  page?: number;
  totalPages?: number;
  gameMode?: GameMode;
  onRoundComplete?: (accuracy: number, score: number) => void;
  onBackToLessons?: () => void;
}

export default function GameBoard({
  characters,
  lesson,
  round,
  page = 1,
  totalPages = 1,
  gameMode = 'story-to-character',
  onRoundComplete,
  onBackToLessons: _onBackToLessons,
}: GameBoardProps) {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [incorrect, setIncorrect] = useState<number | null>(null);
  const [gameStats, setGameStats] = useState<GameStats>({
    totalAttempts: 0,
    correctMatches: 0,
    accuracy: 0,
  });
  const [showCompletion, setShowCompletion] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [hintMessage, setHintMessage] = useState<string>('');
  const [showHint, setShowHint] = useState(false);

  // Shuffle right column for display (but keep left in order)
  // Use useMemo to avoid setState in effect
  // shuffleKey is intentionally included to trigger re-shuffle on resetGame
  const shuffledRight = useMemo(
    () => {
      // Shuffling is intentionally impure - we want randomness each time characters change
      return [...characters].sort(() => Math.random() - 0.5);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [characters, shuffleKey]
  );

  const handleLeftClick = (id: number) => {
    if (matched.has(id)) return;
    setSelectedLeft(id);
    setIncorrect(null);

    // If right already selected, check match
    if (selectedRight !== null) {
      checkMatch(id, selectedRight);
    }
  };

  const handleRightClick = (id: number) => {
    if (matched.has(id)) return;
    setSelectedRight(id);
    setIncorrect(null);

    // If left already selected, check match
    if (selectedLeft !== null) {
      checkMatch(selectedLeft, id);
    }
  };

  const checkMatch = (leftId: number, rightId: number) => {
    const newAttempts = gameStats.totalAttempts + 1;

    // Determine if this is a correct match based on game mode
    let isCorrectMatch = false;

    if (gameMode === 'character-to-pinyin') {
      // Round 4: Match based on pinyin, not ID
      // This handles homophonic characters (e.g., multiple characters with pinyin "mù")
      const leftChar = characters.find((c) => c.id === leftId);
      const rightChar = shuffledRight.find((c) => c.id === rightId);
      isCorrectMatch = leftChar?.pinyin === rightChar?.pinyin;
    } else {
      // Rounds 1-3: Match based on exact ID (story/character matching)
      isCorrectMatch = leftId === rightId;
    }

    if (isCorrectMatch) {
      // Correct match!
      playCorrectSound();

      const newMatched = new Set(matched);

      // For pinyin matching, mark BOTH IDs as matched
      // (they might be different characters with same pronunciation)
      if (gameMode === 'character-to-pinyin') {
        newMatched.add(leftId);
        newMatched.add(rightId);
      } else {
        // For other modes, leftId === rightId, so we only need to add once
        newMatched.add(leftId);
      }

      setMatched(newMatched);
      setSelectedLeft(null);
      setSelectedRight(null);

      const newCorrect = gameStats.correctMatches + 1;
      const newAccuracy = (newCorrect / newAttempts) * 100;

      setGameStats({
        totalAttempts: newAttempts,
        correctMatches: newCorrect,
        accuracy: newAccuracy,
      });

      // Check if round/game is complete
      if (newMatched.size === characters.length) {
        const finalScore = newCorrect * 100; // 100 points per correct match

        if (onRoundComplete) {
          // Multi-round mode - call callback
          setTimeout(() => onRoundComplete(newAccuracy, finalScore), 500);
        } else {
          // Single round mode - save and show completion
          saveGameScore(lesson, finalScore, newAccuracy);
          setTimeout(() => setShowCompletion(true), 500);
        }
      }
    } else {
      // Incorrect match
      playIncorrectSound();

      setIncorrect(rightId);
      setGameStats({
        ...gameStats,
        totalAttempts: newAttempts,
        accuracy: (gameStats.correctMatches / newAttempts) * 100,
      });

      // Show hint with the correct story (only in rounds 2 and 3 where stories aren't visible)
      if (round >= 2) {
        const correctChar = characters.find((c) => c.id === leftId);
        if (correctChar) {
          setHintMessage(correctChar.story);
          setShowHint(true);
        }
      }

      // Reset after animation
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setIncorrect(null);
      }, 600);
    }
  };

  const getStarRating = (accuracy: number): string => {
    if (accuracy >= 90) return '⭐⭐⭐ Gold';
    if (accuracy >= 80) return '⭐⭐ Silver';
    if (accuracy >= 60) return '⭐ Bronze';
    return 'Try Again';
  };

  // Scroll to top when completion modal appears (UX improvement)
  useEffect(() => {
    if (showCompletion) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showCompletion]);

  const resetGame = () => {
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatched(new Set());
    setIncorrect(null);
    setGameStats({
      totalAttempts: 0,
      correctMatches: 0,
      accuracy: 0,
    });
    setShowCompletion(false);
    // Trigger a new shuffle by incrementing the shuffle key
    setShuffleKey((k) => k + 1);
  };

  if (shuffledRight.length === 0) {
    return <div className="text-center p-8">Loading...</div>;
  }

  // Determine what to show on left and right based on game mode
  const getLeftLabel = () => {
    switch (gameMode) {
      case 'story-to-character':
        return 'Mnemonic Stories';
      case 'character-to-story':
        return 'Characters';
      case 'character-to-pinyin':
        return 'Characters';
    }
  };

  const getRightLabel = () => {
    switch (gameMode) {
      case 'story-to-character':
        return 'Characters';
      case 'character-to-story':
        return 'Mnemonic Stories';
      case 'character-to-pinyin':
        return 'Pinyin';
    }
  };

  // Determine what to show based on round (difficulty level)
  const showPinyin = round !== 3; // Hide pinyin in round 3
  const showMeaning = round === 1; // Only show meaning in round 1

  return (
    <div className="max-w-7xl mx-auto p-4">
      <ProgressBar
        current={matched.size}
        total={characters.length}
        lesson={lesson}
        round={round}
        page={page}
        totalPages={totalPages}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center md:text-left">
            {getLeftLabel()}
          </h3>
          {characters.map((char) => {
            // Render left side based on game mode
            if (gameMode === 'story-to-character') {
              return (
                <StoryCard
                  key={`left-${char.id}`}
                  character={char}
                  isSelected={selectedLeft === char.id}
                  isMatched={matched.has(char.id)}
                  isIncorrect={false}
                  onClick={() => handleLeftClick(char.id)}
                />
              );
            } else {
              // character-to-story or character-to-pinyin
              return (
                <CharacterCard
                  key={`left-${char.id}`}
                  character={char}
                  isSelected={selectedLeft === char.id}
                  isMatched={matched.has(char.id)}
                  isIncorrect={false}
                  onClick={() => handleLeftClick(char.id)}
                  showPinyin={showPinyin}
                  showMeaning={showMeaning}
                />
              );
            }
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center md:text-left">
            {getRightLabel()}
          </h3>
          {shuffledRight.map((char) => {
            // Render right side based on game mode
            if (gameMode === 'story-to-character') {
              return (
                <CharacterCard
                  key={`right-${char.id}`}
                  character={char}
                  isSelected={selectedRight === char.id}
                  isMatched={matched.has(char.id)}
                  isIncorrect={incorrect === char.id}
                  onClick={() => handleRightClick(char.id)}
                  showPinyin={showPinyin}
                  showMeaning={showMeaning}
                />
              );
            } else if (gameMode === 'character-to-story') {
              return (
                <StoryCard
                  key={`right-${char.id}`}
                  character={char}
                  isSelected={selectedRight === char.id}
                  isMatched={matched.has(char.id)}
                  isIncorrect={incorrect === char.id}
                  onClick={() => handleRightClick(char.id)}
                />
              );
            } else {
              // character-to-pinyin
              return (
                <PinyinCard
                  key={`right-${char.id}`}
                  character={char}
                  isSelected={selectedRight === char.id}
                  isMatched={matched.has(char.id)}
                  isIncorrect={incorrect === char.id}
                  onClick={() => handleRightClick(char.id)}
                />
              );
            }
          })}
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
              🎉 Round Complete! 🎉
            </h2>
            <div className="space-y-4 text-center">
              <div className="text-5xl mb-4">{getStarRating(gameStats.accuracy)}</div>
              <div className="text-xl">
                <p className="text-gray-700">
                  Accuracy:{' '}
                  <span className="font-bold text-blue-600">{gameStats.accuracy.toFixed(1)}%</span>
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  {gameStats.correctMatches} correct out of {gameStats.totalAttempts} attempts
                </p>
              </div>
              <div className="pt-4 space-y-3">
                <button
                  onClick={resetGame}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Play Again
                </button>
                <button
                  onClick={() => (window.location.href = '/')}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Back to Lessons
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hint Toast */}
      <HintToast show={showHint} message={hintMessage} onClose={() => setShowHint(false)} />
    </div>
  );
}
