'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Character, LessonData } from '@/lib/types';
import { playCharacterPronunciation, preloadCharacterAudio } from '@/lib/audio';
import { getLessonTheme, hasCustomTheme } from '@/lib/lessonThemes';

interface CharacterIntroductionProps {
  characters: Character[];
  lessonNumber: number;
  onComplete: () => void;
  lessonData?: LessonData;
}

// Tone emotion system - research-validated
const TONE_EMOTIONS = {
  1: {
    verb: 'SING',
    description: 'sustained high note',
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgLight: 'bg-blue-50',
    border: 'border-blue-200',
  },
  2: {
    verb: 'GASP',
    description: 'surprised, rising',
    color: 'bg-emerald-500',
    textColor: 'text-emerald-700',
    bgLight: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  3: {
    verb: 'GROAN',
    description: 'low zombie moan',
    color: 'bg-amber-500',
    textColor: 'text-amber-700',
    bgLight: 'bg-amber-50',
    border: 'border-amber-200',
  },
  4: {
    verb: 'COMMAND',
    description: 'sharp bark',
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgLight: 'bg-red-50',
    border: 'border-red-200',
  },
  5: {
    verb: 'whisper',
    description: 'neutral',
    color: 'bg-gray-400',
    textColor: 'text-gray-600',
    bgLight: 'bg-gray-50',
    border: 'border-gray-200',
  },
};

// Get image paths for a character (returns primary and fallback paths)
function getCharacterImagePaths(
  lessonNumber: number,
  characterId: number,
  pinyin: string,
  character: string
): { primary: string; fallback: string } {
  // Primary format (lessons 9+): /images/lesson9/里.png (character-based)
  const primaryPath = `/images/lesson${lessonNumber}/${character}.png`;

  // Fallback format (lesson 1-8): /images/lesson1/1_yi.png (id_pinyin-based)
  const pinyinClean = pinyin.replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/g, (match) => {
    const map: Record<string, string> = {
      ā: 'a',
      á: 'a',
      ǎ: 'a',
      à: 'a',
      ē: 'e',
      é: 'e',
      ě: 'e',
      è: 'e',
      ī: 'i',
      í: 'i',
      ǐ: 'i',
      ì: 'i',
      ō: 'o',
      ó: 'o',
      ǒ: 'o',
      ò: 'o',
      ū: 'u',
      ú: 'u',
      ǔ: 'u',
      ù: 'u',
      ǖ: 'v',
      ǘ: 'v',
      ǚ: 'v',
      ǜ: 'v',
    };
    return map[match] || match;
  });
  const fallbackPath = `/images/lesson${lessonNumber}/${characterId}_${pinyinClean}.png`;

  return { primary: primaryPath, fallback: fallbackPath };
}

export default function CharacterIntroduction({
  characters,
  lessonNumber,
  onComplete,
  lessonData,
}: CharacterIntroductionProps) {
  // Start at narrative intro (-1) only if we have a narrative story, otherwise start at 0
  const [currentIndex, setCurrentIndex] = useState(() => (lessonData?.narrative_story ? -1 : 0));
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [imageError, setImageError] = useState<Record<number, 'none' | 'primary' | 'both'>>({});

  const isNarrativeIntro = currentIndex === -1;
  const isLastCard = currentIndex === characters.length;
  const currentChar = isNarrativeIntro || isLastCard ? null : characters[currentIndex];
  const progress = isNarrativeIntro
    ? 0
    : isLastCard
      ? 100
      : ((currentIndex + 1) / characters.length) * 100;

  const handleNext = useCallback(() => {
    if (currentIndex < characters.length) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, characters.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > -1) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      }
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'Enter' && isLastCard) onComplete();
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [handleNext, handlePrevious, isLastCard, onComplete]);

  // Preload audio for all characters on mount
  useEffect(() => {
    const allCharacters = characters.map((c) => c.character);
    preloadCharacterAudio(allCharacters);
  }, [characters]);

  // Auto-play pronunciation when character changes
  useEffect(() => {
    if (!currentChar) return;

    const playAudio = async () => {
      await playCharacterPronunciation(
        currentChar.character,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false)
      );
    };

    playAudio();
  }, [currentChar]);

  // Manual replay function
  const handleReplayAudio = async () => {
    if (!currentChar || isPlayingAudio) return;

    await playCharacterPronunciation(
      currentChar.character,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );
  };

  const getToneInfo = (tone: number) => {
    return TONE_EMOTIONS[tone as keyof typeof TONE_EMOTIONS] || TONE_EMOTIONS[5];
  };

  // Get theme for this lesson
  const theme = getLessonTheme(lessonNumber);
  const useTheme = hasCustomTheme(lessonNumber);

  // Narrative Introduction Screen
  if (isNarrativeIntro && lessonData?.narrative_story) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-b ${useTheme ? theme.bgGradient : 'from-stone-900 via-stone-800 to-stone-900'} flex items-center justify-center p-4`}
      >
        <div className="max-w-3xl w-full">
          {/* Lesson Header */}
          <div className="text-center mb-8">
            <p
              className={`${useTheme ? theme.textMuted : 'text-amber-400/80'} text-sm tracking-[0.3em] uppercase mb-2`}
            >
              Lesson {lessonNumber}
            </p>
            <h1
              className={`text-4xl md:text-5xl font-serif ${useTheme ? theme.textPrimary : 'text-stone-100'} mb-3`}
            >
              {lessonData.title || `Lesson ${lessonNumber}`}
            </h1>
            {lessonData.memory_palace && (
              <p className={`${useTheme ? theme.textMuted : 'text-stone-400'} text-lg italic`}>
                Memory Palace: {lessonData.memory_palace}
              </p>
            )}
          </div>

          {/* Narrative Story Card */}
          <div
            className={`${useTheme ? theme.cardBg : 'bg-stone-800/50'} border ${useTheme ? theme.cardBorder : 'border-stone-700'} rounded-2xl p-8 mb-8 backdrop-blur`}
          >
            {lessonData.theme && (
              <p
                className={`${useTheme ? theme.textMuted : 'text-amber-400/70'} text-sm mb-4 text-center`}
              >
                {lessonData.theme}
              </p>
            )}
            <p
              className={`${useTheme ? theme.textSecondary : 'text-stone-200'} text-lg leading-relaxed font-serif`}
            >
              {lessonData.narrative_story}
            </p>
          </div>

          {/* Characters Preview - Click to jump to character */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {characters.map((char, index) => (
              <button
                key={char.id}
                onClick={() => setCurrentIndex(index)}
                className={`w-12 h-12 ${useTheme ? theme.cardBg : 'bg-stone-700/50'} border ${useTheme ? theme.cardBorder : 'border-stone-600'} rounded-lg flex items-center justify-center cursor-pointer transition-all hover:scale-110 hover:ring-2 ${useTheme ? 'hover:ring-white/30' : 'hover:ring-amber-400/50'} active:scale-95`}
                aria-label={`Jump to ${char.character} (${char.pinyin})`}
              >
                <span
                  className={`text-2xl ${useTheme ? theme.textPrimary : 'text-stone-200'} font-serif`}
                >
                  {char.character}
                </span>
              </button>
            ))}
          </div>

          {/* Begin Button */}
          <div className="text-center">
            <button
              onClick={handleNext}
              className={`bg-gradient-to-r ${useTheme ? theme.accentPrimary : 'from-amber-500 to-amber-400'} hover:opacity-90 text-white font-semibold py-4 px-12 rounded-xl text-lg transition-all hover:scale-105 shadow-lg`}
            >
              Begin Learning
            </button>
            <p className={`${useTheme ? theme.textMuted : 'text-stone-500'} text-sm mt-4`}>
              Press Space or → to continue
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Skip narrative intro if no narrative story
  if (isNarrativeIntro && !lessonData?.narrative_story) {
    setCurrentIndex(0);
    return null;
  }

  // Summary Card (shown after all characters)
  if (isLastCard) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-b ${useTheme ? theme.bgGradient : 'from-stone-100 to-stone-200'} flex items-center justify-center p-4`}
      >
        <div
          className={`max-w-2xl w-full ${useTheme ? theme.cardBg : 'bg-white'} rounded-2xl shadow-2xl p-8 border ${useTheme ? theme.cardBorder : 'border-stone-200'}`}
        >
          {/* Header */}
          <div className="mb-6">
            <h2
              className={`text-2xl font-bold ${useTheme ? theme.textPrimary : 'text-stone-800'} text-center mb-2`}
            >
              {lessonData?.title || `Lesson ${lessonNumber}`} - Ready to Test!
            </h2>
            <div
              className={`w-full ${useTheme ? 'bg-white/10' : 'bg-emerald-100'} rounded-full h-3`}
            >
              <div
                className={`bg-gradient-to-r ${useTheme ? theme.accentPrimary : 'from-emerald-500 to-emerald-400'} h-full rounded-full`}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Celebration */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎓</div>
            <h3
              className={`text-xl font-semibold ${useTheme ? theme.textPrimary : 'text-stone-700'} mb-2`}
            >
              You&apos;ve learned all {characters.length} characters!
            </h3>
            <p
              className={`text-sm ${useTheme ? theme.textSecondary : 'text-stone-600'} ${useTheme ? theme.cardBg : 'bg-blue-50'} border ${useTheme ? theme.cardBorder : 'border-blue-200'} rounded-lg p-3 max-w-md mx-auto`}
            >
              You&apos;ll practice these in small groups of <strong>4 characters</strong> at a time.
            </p>
          </div>

          {/* Summary Grid - Click to review specific character */}
          <div className="mb-8">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {characters.map((char, index) => {
                const toneInfo = getToneInfo(char.tone);
                return (
                  <button
                    key={char.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`p-3 rounded-xl border-2 ${toneInfo.border} ${toneInfo.bgLight} text-center cursor-pointer transition-all hover:scale-105 hover:shadow-lg active:scale-95`}
                    aria-label={`Review ${char.character} (${char.pinyin})`}
                  >
                    <span
                      className={`text-3xl font-serif ${useTheme ? 'text-stone-800' : 'text-stone-800'} block`}
                    >
                      {char.character}
                    </span>
                    <span className="text-xs text-stone-500">{char.pinyin}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentIndex(-1)}
              className={`flex-1 ${useTheme ? 'bg-white/10 hover:bg-white/20' : 'bg-stone-200 hover:bg-stone-300'} ${useTheme ? theme.textPrimary : 'text-stone-800'} font-semibold py-3 px-6 rounded-xl transition-colors`}
            >
              ← Review Again
            </button>
            <button
              onClick={onComplete}
              className={`flex-1 bg-gradient-to-r ${useTheme ? theme.accentPrimary : 'from-amber-500 to-amber-400'} hover:opacity-90 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg`}
            >
              Start Game! →
            </button>
          </div>

          <p
            className={`text-center text-sm ${useTheme ? theme.textMuted : 'text-stone-400'} mt-4`}
          >
            Press Enter to start or ← → to review
          </p>
        </div>
      </div>
    );
  }

  // Character Card
  if (!currentChar) {
    return null;
  }

  const toneInfo = getToneInfo(currentChar.tone);
  const imagePaths = getCharacterImagePaths(
    lessonNumber,
    currentChar.id,
    currentChar.pinyin,
    currentChar.character
  );
  const errorState = imageError[currentChar.id] || 'none';
  const imagePath =
    errorState === 'none'
      ? imagePaths.primary
      : errorState === 'primary'
        ? imagePaths.fallback
        : '';
  const hasImage = errorState !== 'both';

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${useTheme ? theme.bgGradient : 'from-stone-100 to-stone-200'} flex items-center justify-center p-4`}
    >
      <div className="max-w-4xl w-full">
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2
              className={`text-lg font-medium ${useTheme ? theme.textSecondary : 'text-stone-600'}`}
            >
              {lessonData?.title || `Lesson ${lessonNumber}`}
            </h2>
            <span
              className={`text-sm font-medium ${useTheme ? theme.textMuted : 'text-stone-500'}`}
            >
              {currentIndex + 1} of {characters.length}
            </span>
          </div>
          <div className={`w-full ${useTheme ? 'bg-white/10' : 'bg-stone-300'} rounded-full h-2`}>
            <div
              className={`bg-gradient-to-r ${useTheme ? theme.accentPrimary : 'from-amber-500 to-amber-400'} h-full rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Card */}
        <div
          className={`${useTheme ? theme.cardBg : 'bg-white'} rounded-2xl shadow-2xl overflow-hidden border ${useTheme ? theme.cardBorder : 'border-stone-200'}`}
        >
          <div className="grid md:grid-cols-2">
            {/* Left: Image or Character Display */}
            <div
              className={`relative ${useTheme ? 'bg-black/20' : toneInfo.bgLight} p-8 flex items-center justify-center min-h-[400px]`}
            >
              {hasImage ? (
                <div className="relative w-full h-full min-h-[300px]">
                  <Image
                    src={imagePath}
                    alt={`Mnemonic image for ${currentChar.character}`}
                    fill
                    className="object-contain"
                    onError={() =>
                      setImageError((prev) => ({
                        ...prev,
                        [currentChar.id]: prev[currentChar.id] === 'primary' ? 'both' : 'primary',
                      }))
                    }
                  />
                </div>
              ) : (
                <div className="text-center">
                  <div
                    className={`text-[180px] font-serif leading-none ${useTheme ? theme.textPrimary : 'text-stone-800'} mb-4`}
                  >
                    {currentChar.character}
                  </div>
                  {currentChar.mnemonic_image && (
                    <p
                      className={`${useTheme ? theme.textMuted : 'text-stone-500'} italic text-sm max-w-xs mx-auto`}
                    >
                      {currentChar.mnemonic_image}
                    </p>
                  )}
                </div>
              )}

              {/* Tone Badge */}
              <div
                className={`absolute top-4 right-4 ${toneInfo.color} text-white px-3 py-1 rounded-full text-sm font-bold`}
              >
                {toneInfo.verb}
              </div>
            </div>

            {/* Right: Content */}
            <div className={`p-8 flex flex-col ${useTheme ? '' : ''}`}>
              {/* Character + Pinyin */}
              <div className="text-center mb-6">
                {hasImage && (
                  <div
                    className={`text-7xl font-serif ${useTheme ? theme.textPrimary : 'text-stone-800'} mb-2`}
                  >
                    {currentChar.character}
                  </div>
                )}
                <div className="flex items-center justify-center gap-3">
                  <span className={`text-3xl font-medium ${toneInfo.textColor}`}>
                    {currentChar.pinyin}
                  </span>
                  <button
                    onClick={handleReplayAudio}
                    disabled={isPlayingAudio}
                    aria-label={`Play pronunciation for ${currentChar.character}`}
                    className={`p-2 rounded-full transition-all ${
                      isPlayingAudio
                        ? `${useTheme ? 'bg-white/10 text-white/30' : 'bg-stone-200 text-stone-400'}`
                        : `${useTheme ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-amber-100 hover:bg-amber-200 text-amber-700'}`
                    }`}
                  >
                    🔊
                  </button>
                </div>
                <div
                  className={`text-xl ${useTheme ? theme.textSecondary : 'text-stone-600'} mt-2`}
                >
                  {currentChar.meaning}
                </div>
              </div>

              {/* Sound Bridge */}
              {currentChar.sound_bridge && (
                <div
                  className={`${useTheme ? 'bg-white/5 border-white/10' : `${toneInfo.bgLight} ${toneInfo.border}`} border rounded-xl p-4 mb-4`}
                >
                  <p
                    className={`text-xs uppercase tracking-wider ${useTheme ? theme.textMuted : 'text-stone-500'} mb-1`}
                  >
                    Sound Bridge
                  </p>
                  <p
                    className={`font-semibold ${useTheme ? theme.textPrimary : toneInfo.textColor}`}
                  >
                    {currentChar.sound_bridge}
                  </p>
                </div>
              )}

              {/* Story */}
              <div
                className={`${useTheme ? 'bg-white/5 border-white/10' : 'bg-stone-50 border-stone-200'} border rounded-xl p-4 mb-4 flex-1`}
              >
                <p
                  className={`text-xs uppercase tracking-wider ${useTheme ? theme.textMuted : 'text-stone-500'} mb-2`}
                >
                  Story
                </p>
                <p
                  className={`${useTheme ? theme.textSecondary : 'text-stone-700'} leading-relaxed`}
                >
                  {currentChar.story}
                </p>
              </div>

              {/* Narrative Position */}
              {currentChar.narrative_position && (
                <p
                  className={`text-sm ${useTheme ? theme.textMuted : 'text-stone-400'} italic text-center mb-4`}
                >
                  {currentChar.narrative_position}
                </p>
              )}

              {/* Primitives */}
              <div className="flex flex-wrap gap-2 justify-center">
                {currentChar.primitives.map((primitive, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 ${useTheme ? 'bg-white/10 text-white/70' : 'bg-stone-200 text-stone-600'} rounded-full text-sm`}
                  >
                    {primitive}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handlePrevious}
            className={`flex-1 ${useTheme ? 'bg-white/10 hover:bg-white/20' : 'bg-white hover:bg-stone-50'} ${useTheme ? theme.textPrimary : 'text-stone-700'} font-semibold py-3 px-6 rounded-xl border ${useTheme ? 'border-white/10' : 'border-stone-300'} transition-colors`}
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            className={`flex-1 bg-gradient-to-r ${useTheme ? theme.accentPrimary : 'from-amber-500 to-amber-400'} hover:opacity-90 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg`}
          >
            Next →
          </button>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-4">
          <button
            onClick={onComplete}
            className={`text-sm ${useTheme ? theme.textMuted : 'text-stone-500'} hover:opacity-80 underline`}
          >
            Skip to Game →
          </button>
        </div>

        <p className={`text-center text-xs ${useTheme ? theme.textMuted : 'text-stone-400'} mt-2`}>
          Use ← → or Space to navigate
        </p>
      </div>
    </div>
  );
}
