'use client';

import { useState, useEffect, useCallback } from 'react';
import { Character, LessonData } from '@/lib/types';
import { getLessonTheme } from '@/lib/lessonThemes';

export interface MasteryGameResult {
  accuracy: number;
  missedCharacterIds: number[];
}

interface ToneRecallProps {
  characters: Character[];
  lessonData: LessonData;
  lessonNumber: number;
  onComplete: (result: MasteryGameResult) => void;
  onBack?: () => void;
}

// Tone-emotion mapping
const TONE_EMOTIONS = [
  {
    tone: 1,
    label: 'SING',
    color: 'from-blue-500 to-blue-600',
    hoverColor: 'from-blue-600 to-blue-700',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    description: 'High, sustained',
  },
  {
    tone: 2,
    label: 'GASP',
    color: 'from-emerald-500 to-emerald-600',
    hoverColor: 'from-emerald-600 to-emerald-700',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-800',
    description: 'Rising surprise',
  },
  {
    tone: 3,
    label: 'GROAN',
    color: 'from-amber-500 to-amber-600',
    hoverColor: 'from-amber-600 to-amber-700',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-800',
    description: 'Low, dipping',
  },
  {
    tone: 4,
    label: 'COMMAND',
    color: 'from-red-500 to-red-600',
    hoverColor: 'from-red-600 to-red-700',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    description: 'Sharp, falling',
  },
];

// Timer settings
const INITIAL_TIME = 3000; // 3 seconds
const TIMER_INTERVAL = 50; // Update every 50ms for smooth animation

// Variable reward settings (VR-7 schedule)
const VR_BASE = 7; // Average of 1 in 7 chance for bonus
const PITY_THRESHOLD = 14; // Guaranteed bonus after 14 trials without one

/**
 * ToneRecall - Pure recall mastery game
 *
 * Tests character → tone association WITHOUT hints.
 * Shows only the character, user must recall which tone-emotion it uses.
 */
export default function ToneRecall({
  characters,
  lessonData,
  lessonNumber,
  onComplete,
  onBack,
}: ToneRecallProps) {
  // Get lesson-specific theme
  const theme = getLessonTheme(lessonNumber);

  // Shuffle characters once on mount using useState lazy initializer
  // This is the React-approved pattern for one-time initialization with side effects
  const [shuffledCharacters] = useState<Character[]>(() => {
    const chars = [...characters];
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars;
  });

  // Game state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [selectedTone, setSelectedTone] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [_bonusPoints, setBonusPoints] = useState(0);
  const [showBonus, setShowBonus] = useState(false);
  const [trialsSinceBonus, setTrialsSinceBonus] = useState(0);
  const [missedCharacterIds, setMissedCharacterIds] = useState<number[]>([]);

  const currentCharacter = shuffledCharacters[currentIndex];
  const progress = ((currentIndex + 1) / shuffledCharacters.length) * 100;
  const isLastCharacter = currentIndex === shuffledCharacters.length - 1;

  // Handle timeout - called when timer reaches zero
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

  // Timer effect with ref to track timeout handler
  useEffect(() => {
    if (!isTimerRunning || showResult) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= TIMER_INTERVAL) {
          // Use setTimeout to avoid setState in setInterval callback
          setTimeout(handleTimeout, 0);
          return 0;
        }
        return prev - TIMER_INTERVAL;
      });
    }, TIMER_INTERVAL);

    return () => clearInterval(timer);
  }, [isTimerRunning, showResult, handleTimeout]);

  // Calculate variable reward
  const shouldGetBonus = useCallback(
    (isAnswerCorrect: boolean, currentStreak: number): boolean => {
      if (!isAnswerCorrect) return false;

      // Pity timer - guaranteed bonus after PITY_THRESHOLD trials
      if (trialsSinceBonus >= PITY_THRESHOLD) return true;

      // Streak bonus - higher chance with longer streaks
      const streakMultiplier = 1 + currentStreak * 0.1; // 10% increase per streak
      const baseChance = 1 / VR_BASE;
      const adjustedChance = baseChance * streakMultiplier;

      return Math.random() < adjustedChance;
    },
    [trialsSinceBonus]
  );

  // Handle tone selection
  const handleSelectTone = useCallback(
    (tone: number) => {
      if (showResult) return;

      setIsTimerRunning(false);
      setSelectedTone(tone);

      const correct = tone === currentCharacter.tone;
      setIsCorrect(correct);
      setShowResult(true);

      if (correct) {
        setCorrectCount((prev) => prev + 1);
        const newStreak = streak + 1;
        setStreak(newStreak);

        // Check for variable reward bonus
        if (shouldGetBonus(true, newStreak)) {
          const bonus = Math.min(newStreak * 10, 50); // Cap bonus at 50
          setBonusPoints((prev) => prev + bonus);
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
      setSelectedTone(null);
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
        // Number keys 1-4 for tone selection
        const num = parseInt(e.key);
        if (num >= 1 && num <= 4) {
          handleSelectTone(num);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showResult, handleNext, handleSelectTone]);

  // Get the correct tone emotion info
  const correctToneInfo = TONE_EMOTIONS.find((t) => t.tone === currentCharacter.tone);

  // Calculate timer percentage for visual bar
  const timerPercent = (timeLeft / INITIAL_TIME) * 100;
  const timerColor =
    timerPercent > 50 ? 'bg-green-500' : timerPercent > 25 ? 'bg-yellow-500' : 'bg-red-500';

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
                <h1 className={`text-xl font-bold ${theme.headerText}`}>Tone Recall</h1>
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

        {/* Character display - BIG, no hints */}
        <div
          className={`${theme.cardBg} rounded-2xl p-8 mb-6 shadow-lg border ${theme.cardBorder} text-center relative`}
        >
          {/* Bonus animation */}
          {showBonus && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`text-4xl font-bold ${theme.streakText} animate-bounce`}>+BONUS!</div>
            </div>
          )}

          <div className={`text-7xl sm:text-8xl md:text-9xl font-serif ${theme.textPrimary} mb-2`}>
            {currentCharacter.character}
          </div>

          {/* Only show info AFTER answer */}
          {showResult && (
            <div className="mt-4 space-y-2">
              <p className={`text-2xl ${theme.textSecondary}`}>{currentCharacter.pinyin}</p>
              <p className={`text-lg ${theme.textMuted}`}>{currentCharacter.meaning}</p>
            </div>
          )}
        </div>

        {/* Tone buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {TONE_EMOTIONS.map((emotion) => {
            const isSelected = selectedTone === emotion.tone;
            const isCorrectTone = emotion.tone === currentCharacter.tone;
            const showAsCorrect = showResult && isCorrectTone;
            const showAsWrong = showResult && isSelected && !isCorrectTone;

            return (
              <button
                key={emotion.tone}
                onClick={() => handleSelectTone(emotion.tone)}
                disabled={showResult}
                className={`
                  p-4 rounded-xl font-bold text-lg transition-all duration-200 min-h-[72px]
                  ${
                    showAsCorrect
                      ? `bg-gradient-to-r ${emotion.color} text-white ring-4 ring-white/50 scale-105`
                      : showAsWrong
                        ? 'bg-slate-600 text-slate-400 opacity-50'
                        : showResult
                          ? 'bg-slate-700 text-slate-500'
                          : `bg-gradient-to-r ${emotion.color} hover:${emotion.hoverColor} text-white hover:scale-105 active:scale-95`
                  }
                  ${showResult ? 'cursor-default' : 'cursor-pointer'}
                `}
              >
                <span className="text-xs opacity-70 mr-2">{emotion.tone}</span>
                {emotion.label}
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
                  <>
                    <p className="font-bold">
                      The tone was:{' '}
                      <span className={correctToneInfo?.textColor}>{correctToneInfo?.label}</span>
                    </p>
                    {currentCharacter.tone_emotion && (
                      <p className="text-sm opacity-80 mt-1">{currentCharacter.tone_emotion}</p>
                    )}
                  </>
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
