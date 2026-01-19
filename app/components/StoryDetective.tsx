'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Character, LessonData } from '@/lib/types';
import {
  StoryBlank,
  generateStoryBlanks,
  checkAnswer,
  calculateDetectiveAccuracy,
} from '@/lib/storyBlanks';

interface StoryDetectiveProps {
  characters: Character[];
  lessonData: LessonData;
  lessonNumber: number;
  onComplete: (accuracy: number) => void;
  onBack?: () => void;
}

/**
 * Story Detective - Cloze/Fill-in-the-blank Game
 *
 * Players must fill in missing words from mnemonic stories,
 * testing deeper recall of tone emotions and sound bridges.
 */
export default function StoryDetective({
  characters,
  lessonData,
  lessonNumber,
  onComplete,
  onBack,
}: StoryDetectiveProps) {
  // Generate blanks using useMemo
  const blanks = useMemo(() => {
    return generateStoryBlanks(characters, 5);
  }, [characters]);

  // Game state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const currentBlank = blanks[currentIndex];
  const isLastQuestion = currentIndex === blanks.length - 1;
  const progress = ((currentIndex + 1) / blanks.length) * 100;

  // Handle answer selection
  const handleSelectAnswer = useCallback(
    (answer: string) => {
      if (showResult) return;
      setSelectedAnswer(answer);
    },
    [showResult]
  );

  // Handle submit
  const handleSubmit = useCallback(() => {
    if (!selectedAnswer || !currentBlank) return;

    const correct = checkAnswer(currentBlank, selectedAnswer);
    setIsCorrect(correct);
    setShowResult(true);
    setAnsweredCount((prev) => prev + 1);

    if (correct) {
      setCorrectCount((prev) => prev + 1);
    }
  }, [selectedAnswer, currentBlank]);

  // Handle next question
  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      // Game complete - calculate final accuracy
      const finalCorrect = correctCount + (isCorrect ? 0 : 0); // Already counted
      const accuracy = calculateDetectiveAccuracy(finalCorrect, blanks.length);
      onComplete(accuracy);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
    }
  }, [isLastQuestion, correctCount, isCorrect, blanks.length, onComplete]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (showResult) {
          handleNext();
        } else if (selectedAnswer) {
          handleSubmit();
        }
      } else if (!showResult && currentBlank) {
        // Number keys 1-4 for options
        const num = parseInt(e.key);
        if (num >= 1 && num <= currentBlank.options.length) {
          handleSelectAnswer(currentBlank.options[num - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showResult, selectedAnswer, currentBlank, handleNext, handleSubmit, handleSelectAnswer]);

  if (blanks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-600">No story blanks available for this lesson.</p>
          {onBack && (
            <button
              onClick={onBack}
              className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              ← Go back
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!currentBlank) {
    return null;
  }

  // Get blank type label and icon
  const getBlankTypeInfo = (type: string) => {
    switch (type) {
      case 'tone_emotion':
        return { label: 'Tone Emotion', icon: '🎭' };
      case 'sound':
        return { label: 'Sound', icon: '🔊' };
      case 'meaning':
        return { label: 'Meaning', icon: '📖' };
      default:
        return { label: 'Word', icon: '✏️' };
    }
  };

  const blankInfo = getBlankTypeInfo(currentBlank.blankType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          {onBack && (
            <button
              onClick={onBack}
              className="text-indigo-700 hover:text-indigo-900 font-medium mb-4 flex items-center gap-2"
            >
              ← Back
            </button>
          )}

          <div className="bg-white rounded-xl p-4 shadow-md border-2 border-indigo-200">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🔍</span>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Story Detective</h1>
                <p className="text-sm text-gray-600">
                  Lesson {lessonNumber}: {lessonData.title}
                </p>
              </div>
            </div>
            <p className="text-sm text-indigo-700">Fill in the missing word from each story.</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>
              Question {currentIndex + 1} of {blanks.length}
            </span>
            <span>{correctCount} correct</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Character info */}
        <div className="bg-white rounded-xl p-4 shadow-md mb-4 border-2 border-indigo-100">
          <div className="flex items-center gap-4">
            <div className="text-5xl font-serif">{currentBlank.character.character}</div>
            <div>
              <p className="text-lg font-medium text-gray-800">{currentBlank.character.pinyin}</p>
              <p className="text-sm text-gray-600">{currentBlank.character.meaning}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg">{blankInfo.icon}</span>
                <span className="text-xs text-indigo-600 font-medium">
                  Find the {blankInfo.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Story with blank */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-6 border-2 border-indigo-100">
          <p className="text-lg text-gray-800 leading-relaxed">
            {currentBlank.blankedStory.split('_____').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span
                    className={`inline-block min-w-[80px] mx-1 px-3 py-1 rounded-lg font-bold text-center ${
                      showResult
                        ? isCorrect
                          ? 'bg-green-100 text-green-800 border-2 border-green-300'
                          : 'bg-red-100 text-red-800 border-2 border-red-300'
                        : selectedAnswer
                          ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-300'
                          : 'bg-gray-100 text-gray-400 border-2 border-dashed border-gray-300'
                    }`}
                  >
                    {showResult ? currentBlank.correctAnswer : selectedAnswer || '?'}
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>

        {/* Answer options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {currentBlank.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = option === currentBlank.correctAnswer;
            const showAsCorrect = showResult && isCorrectAnswer;
            const showAsWrong = showResult && isSelected && !isCorrectAnswer;

            return (
              <button
                key={option}
                onClick={() => handleSelectAnswer(option)}
                disabled={showResult}
                className={`
                  p-4 rounded-xl font-semibold text-lg transition-all duration-200
                  ${
                    showAsCorrect
                      ? 'bg-green-500 text-white border-2 border-green-600 shadow-lg'
                      : showAsWrong
                        ? 'bg-red-500 text-white border-2 border-red-600'
                        : isSelected
                          ? 'bg-indigo-500 text-white border-2 border-indigo-600 shadow-lg scale-105'
                          : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                  }
                  ${showResult ? 'cursor-default' : 'cursor-pointer'}
                `}
              >
                <span className="text-xs opacity-70 mr-2">{index + 1}</span>
                {option}
              </button>
            );
          })}
        </div>

        {/* Result feedback */}
        {showResult && (
          <div
            className={`mb-4 p-4 rounded-xl border-2 ${
              isCorrect
                ? 'bg-green-50 border-green-300 text-green-800'
                : 'bg-red-50 border-red-300 text-red-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{isCorrect ? '🎉' : '💡'}</span>
              <div>
                <p className="font-bold">
                  {isCorrect ? 'Correct!' : `The answer was: ${currentBlank.correctAnswer}`}
                </p>
                {!isCorrect && <p className="text-sm opacity-80">{currentBlank.hint}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Action button */}
        {!showResult ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isLastQuestion ? 'See Results' : 'Next Question →'}
          </button>
        )}

        {/* Keyboard hint */}
        <p className="text-center text-xs text-gray-500 mt-4">
          Press 1-4 to select • Enter to submit
        </p>
      </div>
    </div>
  );
}
