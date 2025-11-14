'use client';

import { useState, useEffect, useCallback } from 'react';
import { Character } from '@/lib/types';

interface CharacterIntroductionProps {
  characters: Character[];
  lessonNumber: number;
  onComplete: () => void;
}

const TONE_COLORS = {
  1: { color: 'text-blue-600', symbol: '→', label: '1st tone (flat)' },
  2: { color: 'text-green-600', symbol: '↗', label: '2nd tone (rising)' },
  3: { color: 'text-orange-600', symbol: '↘↗', label: '3rd tone (dipping)' },
  4: { color: 'text-red-600', symbol: '↘', label: '4th tone (falling)' },
  5: { color: 'text-gray-600', symbol: '·', label: 'neutral tone' },
};

// Format tone number as ordinal (1 → "1st", 2 → "2nd", etc.)
function formatToneOrdinal(tone: number): string {
  if (tone === 5) return ''; // Neutral tone has no number display
  const ordinals = ['', '1st', '2nd', '3rd', '4th'];
  return ordinals[tone] || `${tone}th`;
}

export default function CharacterIntroduction({
  characters,
  lessonNumber,
  onComplete,
}: CharacterIntroductionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Derive isLastCard directly instead of using useEffect
  const isLastCard = currentIndex === characters.length;
  const currentChar = isLastCard ? null : characters[currentIndex];
  const progress = isLastCard ? 100 : ((currentIndex + 1) / characters.length) * 100;

  const handleNext = useCallback(() => {
    if (currentIndex < characters.length) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, characters.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'Enter' && isLastCard) onComplete();
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [handleNext, handlePrevious, isLastCard, onComplete]);

  const getToneInfo = (tone: number) => {
    return TONE_COLORS[tone as keyof typeof TONE_COLORS] || TONE_COLORS[5];
  };

  // Summary Card (shown after all characters)
  if (isLastCard) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-2xl p-8">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
              RTH Lesson {lessonNumber} - Ready to Test!
            </h2>
            <div className="w-full bg-green-200 rounded-full h-3">
              <div className="bg-green-600 h-full rounded-full" style={{ width: '100%' }} />
            </div>
          </div>

          {/* Celebration */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              You&apos;ve learned all {characters.length} characters!
            </h3>
            <p className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-md mx-auto">
              💡 <strong>Don&apos;t worry!</strong> You&apos;ll practice these in small groups of{' '}
              <strong>4 characters</strong> at a time to reduce cognitive load and improve
              retention.
            </p>
          </div>

          {/* Summary List */}
          <div className="mb-8">
            <p className="text-gray-600 font-medium mb-3">You&apos;ve seen:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {characters.map((char) => (
                <div key={char.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                  <span className="text-2xl font-serif">{char.character}</span>
                  <span className="text-sm text-gray-600">
                    ({char.pinyin}) - {char.meaning}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentIndex(0)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              ← Review Again
            </button>
            <button
              onClick={onComplete}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Start Game! →
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Press Enter to start or ← → arrows to review
          </p>
        </div>
      </div>
    );
  }

  // Character Card - Guard against null currentChar
  if (!currentChar) {
    return null; // Safety check, should not happen due to isLastCard check above
  }

  const toneInfo = getToneInfo(currentChar.tone);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-2xl p-8">
        {/* Header with Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-gray-800">
              RTH Lesson {lessonNumber} - Learning Phase
            </h2>
            <span className="text-sm font-medium text-gray-600">
              Character {currentIndex + 1} of {characters.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-right text-sm text-gray-500 mt-1">{Math.round(progress)}%</div>
        </div>

        {/* Character Display */}
        <div className="text-center mb-8">
          <div className="text-9xl font-serif mb-4 leading-none">{currentChar.character}</div>

          <div className="text-3xl text-gray-700 mb-2">({currentChar.pinyin})</div>

          <div className={`text-xl font-semibold ${toneInfo.color} mb-1`}>
            Tone: {toneInfo.symbol} {formatToneOrdinal(currentChar.tone)}
          </div>

          <div className="text-sm text-gray-500 mb-4">{toneInfo.label}</div>

          <div className="text-2xl font-medium text-gray-800">Meaning: {currentChar.meaning}</div>
        </div>

        {/* Story Box */}
        <div className="mb-6">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">📖 Story:</h3>
            <p className="text-gray-800 text-lg leading-relaxed">{currentChar.story}</p>
          </div>
        </div>

        {/* Primitives */}
        <div className="mb-8">
          <p className="text-sm text-gray-600">
            <strong>Primitives:</strong> {currentChar.primitives.join(', ')}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              currentIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Next →
          </button>
        </div>

        {/* Skip Option */}
        <div className="text-center bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-600 mb-2">Already familiar with these characters?</p>
          <button
            onClick={onComplete}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 underline"
          >
            Skip Introduction & Start Game →
          </button>
        </div>

        {/* Keyboard Hints */}
        <p className="text-center text-xs text-gray-400 mt-4">Use ← → arrow keys to navigate</p>
      </div>
    </div>
  );
}
