'use client';

import { useState, useEffect, useCallback } from 'react';
import { Character, LessonData } from '@/lib/types';
import { getLessonTheme } from '@/lib/lessonThemes';
import { playToneSound, ToneNumber } from '@/lib/toneSounds';
import { MasteryGameResult } from './ToneRecall';

interface CharacterRecallProps {
  characters: Character[];
  lessonData: LessonData;
  lessonNumber: number;
  onComplete: (result: MasteryGameResult) => void;
  onBack?: () => void;
}

// Timer settings
const INITIAL_TIME = 5000; // 5 seconds (longer since recognizing characters is harder)
const TIMER_INTERVAL = 50;

// Variable reward settings
const VR_BASE = 7;
const PITY_THRESHOLD = 14;

/**
 * CharacterRecall - Reverse lookup mastery game
 *
 * Tests pinyin → character association WITHOUT hints.
 * Shows pinyin + meaning, user must select correct character from 4 options.
 *
 * This is the hardest recall direction - producing visual form from sound.
 *
 * Mobile-first design with large touch targets.
 */
export default function CharacterRecall({
  characters,
  lessonData,
  lessonNumber,
  onComplete,
  onBack,
}: CharacterRecallProps) {
  const theme = getLessonTheme(lessonNumber);

  // Helper to generate character options for a character
  const generateCharacterOptions = useCallback(
    (char: Character): string[] => {
      const correctChar = char.character;

      // Get unique characters from the lesson (excluding current)
      const otherChars = characters
        .filter((c) => c.character !== correctChar)
        .map((c) => c.character)
        .filter((ch, i, arr) => arr.indexOf(ch) === i);

      // Shuffle and take 3 distractors
      const shuffledOthers = [...otherChars].sort(() => Math.random() - 0.5);
      const distractors = shuffledOthers.slice(0, 3);

      // If not enough distractors (rare), duplicate with a marker
      while (distractors.length < 3) {
        distractors.push('?');
      }

      const allOptions = [correctChar, ...distractors.slice(0, 3)];
      return allOptions.sort(() => Math.random() - 0.5);
    },
    [characters]
  );

  // Shuffle characters and pre-generate all options on mount
  const [gameState] = useState(() => {
    const chars = [...characters];
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    // Pre-generate options for each character
    const optionsMap: Record<number, string[]> = {};
    chars.forEach((char) => {
      const correctChar = char.character;
      const otherChars = characters
        .filter((c) => c.character !== correctChar)
        .map((c) => c.character)
        .filter((ch, i, arr) => arr.indexOf(ch) === i);
      const shuffledOthers = [...otherChars].sort(() => Math.random() - 0.5);
      const distractors = shuffledOthers.slice(0, 3);
      while (distractors.length < 3) {
        distractors.push('?');
      }
      const allOptions = [correctChar, ...distractors.slice(0, 3)];
      optionsMap[char.id] = allOptions.sort(() => Math.random() - 0.5);
    });
    return { shuffledCharacters: chars, optionsMap };
  });

  const { shuffledCharacters, optionsMap } = gameState;

  // Game state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showBonus, setShowBonus] = useState(false);
  const [trialsSinceBonus, setTrialsSinceBonus] = useState(0);
  const [missedCharacterIds, setMissedCharacterIds] = useState<number[]>([]);

  const currentCharacter = shuffledCharacters[currentIndex];
  const progress = ((currentIndex + 1) / shuffledCharacters.length) * 100;
  const isLastCharacter = currentIndex === shuffledCharacters.length - 1;

  // Get pre-generated options for current character
  const characterOptions =
    optionsMap[currentCharacter.id] || generateCharacterOptions(currentCharacter);

  // Handle timeout
  const handleTimeout = useCallback(() => {
    setIsTimerRunning(false);
    setShowResult(true);
    setIsCorrect(false);
    setStreak(0);
    setTrialsSinceBonus((prev) => prev + 1);
    // Track missed character on timeout
    setMissedCharacterIds((prev) =>
      prev.includes(currentCharacter.id) ? prev : [...prev, currentCharacter.id]
    );
  }, [currentCharacter.id]);

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning || showResult) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= TIMER_INTERVAL) {
          setTimeout(handleTimeout, 0);
          return 0;
        }
        return prev - TIMER_INTERVAL;
      });
    }, TIMER_INTERVAL);

    return () => clearInterval(timer);
  }, [isTimerRunning, showResult, handleTimeout]);

  // Variable reward calculation
  const shouldGetBonus = useCallback(
    (isAnswerCorrect: boolean, currentStreak: number): boolean => {
      if (!isAnswerCorrect) return false;
      if (trialsSinceBonus >= PITY_THRESHOLD) return true;

      const streakMultiplier = 1 + currentStreak * 0.1;
      const baseChance = 1 / VR_BASE;
      return Math.random() < baseChance * streakMultiplier;
    },
    [trialsSinceBonus]
  );

  // Handle character selection
  const handleSelectCharacter = useCallback(
    (char: string) => {
      if (showResult) return;

      setIsTimerRunning(false);
      setSelectedCharacter(char);

      const correct = char === currentCharacter.character;
      setIsCorrect(correct);
      setShowResult(true);

      if (correct) {
        // Play tone sound for correct answer
        playToneSound(currentCharacter.tone as ToneNumber);

        setCorrectCount((prev) => prev + 1);
        const newStreak = streak + 1;
        setStreak(newStreak);

        if (shouldGetBonus(true, newStreak)) {
          setShowBonus(true);
          setTrialsSinceBonus(0);
          setTimeout(() => setShowBonus(false), 1000);
        } else {
          setTrialsSinceBonus((prev) => prev + 1);
        }
      } else {
        setStreak(0);
        setTrialsSinceBonus((prev) => prev + 1);
        // Track missed character on wrong answer
        setMissedCharacterIds((prev) =>
          prev.includes(currentCharacter.id) ? prev : [...prev, currentCharacter.id]
        );
      }
    },
    [showResult, currentCharacter, streak, shouldGetBonus]
  );

  // Handle next character
  const handleNext = useCallback(() => {
    if (isLastCharacter) {
      const accuracy = correctCount / shuffledCharacters.length;
      onComplete({ accuracy, missedCharacterIds });
    } else {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(INITIAL_TIME);
      setIsTimerRunning(true);
      setShowResult(false);
      setSelectedCharacter(null);
      setIsCorrect(false);
    }
  }, [isLastCharacter, correctCount, shuffledCharacters.length, onComplete, missedCharacterIds]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showResult) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNext();
        }
      } else {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 4 && characterOptions[num - 1]) {
          handleSelectCharacter(characterOptions[num - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showResult, handleNext, handleSelectCharacter, characterOptions]);

  // Timer visual
  const timerPercent = (timeLeft / INITIAL_TIME) * 100;
  const timerColor =
    timerPercent > 50 ? 'bg-green-500' : timerPercent > 25 ? 'bg-yellow-500' : 'bg-red-500';

  // Tone colors for pinyin display
  const toneColors: Record<number, string> = {
    1: 'text-blue-400',
    2: 'text-emerald-400',
    3: 'text-amber-400',
    4: 'text-red-400',
    5: 'text-gray-400',
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bgGradient} p-4`}>
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-6">
          {onBack && (
            <button
              onClick={onBack}
              className={`${theme.textMuted} hover:${theme.textPrimary} font-medium mb-4 flex items-center gap-2 transition-colors`}
            >
              ← Back
            </button>
          )}

          <div className={`${theme.headerBg} rounded-xl p-4 shadow-lg border ${theme.cardBorder}`}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-xl font-bold ${theme.headerText}`}>Character Recall</h1>
                <p className={`text-sm ${theme.textMuted}`}>
                  Lesson {lessonNumber}: {lessonData.title}
                </p>
              </div>
              {streak > 0 && (
                <div className={`${theme.streakBg} border rounded-lg px-3 py-1`}>
                  <span className={`${theme.streakText} font-bold`}>{streak}x</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className={`flex justify-between text-sm ${theme.textMuted} mb-1`}>
            <span>
              {currentIndex + 1} / {shuffledCharacters.length}
            </span>
            <span>{correctCount} correct</span>
          </div>
          <div className={`h-2 ${theme.cardBg} rounded-full overflow-hidden`}>
            <div
              className={`h-full bg-gradient-to-r ${theme.accentPrimary} transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Timer bar */}
        {!showResult && (
          <div className="mb-6">
            <div className={`h-2 ${theme.cardBg} rounded-full overflow-hidden`}>
              <div
                className={`h-full ${timerColor} transition-all duration-50`}
                style={{ width: `${timerPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Prompt - Show pinyin and meaning */}
        <div
          className={`${theme.cardBg} rounded-2xl p-8 mb-6 shadow-lg border ${theme.cardBorder} text-center relative`}
        >
          {/* Bonus animation */}
          {showBonus && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`text-4xl font-bold ${theme.streakText} animate-bounce`}>+BONUS!</div>
            </div>
          )}

          <p className={`text-sm ${theme.textMuted} mb-4`}>Which character is this?</p>

          {/* Pinyin - large and colored by tone */}
          <div
            className={`text-5xl sm:text-6xl md:text-7xl font-bold ${toneColors[currentCharacter.tone] || theme.textPrimary} mb-4`}
          >
            {currentCharacter.pinyin}
          </div>

          {/* Meaning */}
          <div className={`text-2xl ${theme.textSecondary} mb-2`}>
            &ldquo;{currentCharacter.meaning}&rdquo;
          </div>

          {/* Only show story hint AFTER answer */}
          {showResult && (
            <div className="mt-6 space-y-2">
              <div
                className={`text-6xl sm:text-7xl md:text-8xl font-serif ${isCorrect ? 'text-green-400' : 'text-amber-400'}`}
              >
                {currentCharacter.character}
              </div>
              {currentCharacter.mnemonic_image && (
                <p className={`text-sm ${theme.textMuted} italic mt-2`}>
                  {currentCharacter.mnemonic_image}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Character options - 2x2 grid for mobile */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {characterOptions.map((char, index) => {
            const isSelected = selectedCharacter === char;
            const isCorrectOption = char === currentCharacter.character;
            const showAsCorrect = showResult && isCorrectOption;
            const showAsWrong = showResult && isSelected && !isCorrectOption;

            return (
              <button
                key={`${char}-${index}`}
                onClick={() => handleSelectCharacter(char)}
                disabled={showResult}
                className={`
                  p-4 rounded-xl transition-all duration-200 min-h-[100px] flex flex-col items-center justify-center
                  ${
                    showAsCorrect
                      ? 'bg-green-500 text-white ring-4 ring-green-300/50 scale-105'
                      : showAsWrong
                        ? 'bg-red-500/50 text-red-200 opacity-50'
                        : showResult
                          ? `${theme.cardBg} ${theme.textMuted} opacity-50`
                          : `${theme.cardBg} ${theme.textPrimary} hover:scale-105 active:scale-95 border ${theme.cardBorder}`
                  }
                  ${showResult ? 'cursor-default' : 'cursor-pointer'}
                `}
              >
                <span className={`text-xs opacity-50 mb-1`}>{index + 1}</span>
                <span className="text-5xl font-serif">{char}</span>
              </button>
            );
          })}
        </div>

        {/* Result feedback */}
        {showResult && (
          <div
            className={`mb-4 p-4 rounded-xl ${
              isCorrect
                ? 'bg-green-900/50 border border-green-500/50 text-green-300'
                : 'bg-red-900/50 border border-red-500/50 text-red-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{isCorrect ? '✓' : '✗'}</span>
              <div>
                {isCorrect ? (
                  <p className="font-bold">
                    Correct!{' '}
                    {streak > 1 && <span className="text-amber-400">({streak}x streak!)</span>}
                  </p>
                ) : (
                  <p className="font-bold">
                    The character was:{' '}
                    <span className="text-amber-400 text-2xl">{currentCharacter.character}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Next button */}
        {showResult && (
          <button
            onClick={handleNext}
            className={`w-full bg-gradient-to-r ${theme.accentPrimary} hover:${theme.accentSecondary} text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl`}
          >
            {isLastCharacter ? 'See Results' : 'Next →'}
          </button>
        )}

        {/* Keyboard hint */}
        <p className={`text-center text-xs ${theme.textMuted} mt-4`}>
          Press 1-4 to select • Enter to continue
        </p>
      </div>
    </div>
  );
}
