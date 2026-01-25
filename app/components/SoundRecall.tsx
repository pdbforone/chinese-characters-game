'use client';

import { useState, useEffect, useCallback } from 'react';
import { Character, LessonData } from '@/lib/types';
import { getLessonTheme } from '@/lib/lessonThemes';
import { playToneSound, ToneNumber } from '@/lib/toneSounds';

import { MasteryGameResult } from './ToneRecall';

interface SoundRecallProps {
  characters: Character[];
  lessonData: LessonData;
  lessonNumber: number;
  onComplete: (result: MasteryGameResult) => void;
  onBack?: () => void;
}

// Timer settings
const INITIAL_TIME = 4000; // 4 seconds (slightly longer than ToneRecall since reading pinyin takes time)
const TIMER_INTERVAL = 50;

// Variable reward settings
const VR_BASE = 7;
const PITY_THRESHOLD = 14;

/**
 * SoundRecall - Pinyin recall mastery game
 *
 * Tests character → pinyin association WITHOUT hints.
 * Shows only the character, user must select correct pinyin from 4 options.
 *
 * Mobile-first design with large touch targets.
 */
export default function SoundRecall({
  characters,
  lessonData,
  lessonNumber,
  onComplete,
  onBack,
}: SoundRecallProps) {
  const theme = getLessonTheme(lessonNumber);

  // Helper to generate pinyin options for a character
  const generatePinyinOptions = useCallback(
    (char: Character): string[] => {
      const correctPinyin = char.pinyin;

      // Get unique pinyins from the lesson (excluding current)
      const otherPinyins = characters
        .filter((c) => c.pinyin !== correctPinyin)
        .map((c) => c.pinyin)
        .filter((p, i, arr) => arr.indexOf(p) === i);

      // Shuffle and take 3 distractors
      const shuffledOthers = [...otherPinyins].sort(() => Math.random() - 0.5);
      const distractors = shuffledOthers.slice(0, 3);

      // If not enough distractors, pad with variations
      while (distractors.length < 3) {
        const fake = correctPinyin.replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/, 'x');
        if (!distractors.includes(fake) && fake !== correctPinyin) {
          distractors.push(fake);
        } else {
          distractors.push(`${correctPinyin}?`);
        }
      }

      const allOptions = [correctPinyin, ...distractors.slice(0, 3)];
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
      const correctPinyin = char.pinyin;
      const otherPinyins = characters
        .filter((c) => c.pinyin !== correctPinyin)
        .map((c) => c.pinyin)
        .filter((p, i, arr) => arr.indexOf(p) === i);
      const shuffledOthers = [...otherPinyins].sort(() => Math.random() - 0.5);
      const distractors = shuffledOthers.slice(0, 3);
      while (distractors.length < 3) {
        const fake = correctPinyin.replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/, 'x');
        if (!distractors.includes(fake) && fake !== correctPinyin) {
          distractors.push(fake);
        } else {
          distractors.push(`${correctPinyin}?`);
        }
      }
      const allOptions = [correctPinyin, ...distractors.slice(0, 3)];
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
  const [selectedPinyin, setSelectedPinyin] = useState<string | null>(null);
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
  const pinyinOptions = optionsMap[currentCharacter.id] || generatePinyinOptions(currentCharacter);

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

  // Handle pinyin selection
  const handleSelectPinyin = useCallback(
    (pinyin: string) => {
      if (showResult) return;

      setIsTimerRunning(false);
      setSelectedPinyin(pinyin);

      const correct = pinyin === currentCharacter.pinyin;
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
      setSelectedPinyin(null);
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
        if (num >= 1 && num <= 4 && pinyinOptions[num - 1]) {
          handleSelectPinyin(pinyinOptions[num - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showResult, handleNext, handleSelectPinyin, pinyinOptions]);

  // Timer visual
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
                <h1 className={`text-xl font-bold ${theme.headerText}`}>Sound Recall</h1>
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

          <p className={`text-sm ${theme.textMuted} mb-2`}>What is the pinyin?</p>
          <div className={`text-7xl sm:text-8xl md:text-9xl font-serif ${theme.textPrimary} mb-2`}>
            {currentCharacter.character}
          </div>

          {/* Only show info AFTER answer */}
          {showResult && (
            <div className="mt-4 space-y-2">
              <p
                className={`text-2xl font-bold ${isCorrect ? 'text-green-400' : 'text-amber-400'}`}
              >
                {currentCharacter.pinyin}
              </p>
              <p className={`text-lg ${theme.textMuted}`}>{currentCharacter.meaning}</p>
              {currentCharacter.sound_bridge && (
                <p className={`text-sm ${theme.textMuted} italic`}>
                  {currentCharacter.sound_bridge}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Pinyin options - 2x2 grid for mobile */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {pinyinOptions.map((pinyin, index) => {
            const isSelected = selectedPinyin === pinyin;
            const isCorrectOption = pinyin === currentCharacter.pinyin;
            const showAsCorrect = showResult && isCorrectOption;
            const showAsWrong = showResult && isSelected && !isCorrectOption;

            return (
              <button
                key={`${pinyin}-${index}`}
                onClick={() => handleSelectPinyin(pinyin)}
                disabled={showResult}
                className={`
                  p-4 rounded-xl font-bold text-xl transition-all duration-200 min-h-[72px]
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
                <span className="text-xs opacity-50 mr-2">{index + 1}</span>
                {pinyin}
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
                    The pinyin was:{' '}
                    <span className="text-amber-400">{currentCharacter.pinyin}</span>
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
