'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Character, LessonData } from '@/lib/types';
import { playCompletionFanfare, playToneSound, ToneNumber } from '@/lib/toneSounds';
import { getToneInfo } from '@/lib/toneUtils';

interface RewardScreenProps {
  characters: Character[];
  lessonNumber: number;
  lessonData?: LessonData;
  accuracies: number[]; // Accuracies from each round
  onContinue: () => void;
  onReplayLesson?: () => void;
}

// Particle for confetti effect
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

// Determine reward tier based on performance
type RewardTier = 'bronze' | 'silver' | 'gold' | 'perfect';

function getRewardTier(accuracies: number[]): RewardTier {
  const avgAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
  if (avgAccuracy >= 95) return 'perfect';
  if (avgAccuracy >= 85) return 'gold';
  if (avgAccuracy >= 75) return 'silver';
  return 'bronze';
}

// Get image path for a character (matching CharacterIntroduction logic)
function getCharacterImagePath(lessonNumber: number, characterId: number, pinyin: string): string {
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
  return `/images/lesson${lessonNumber}/${characterId}_${pinyinClean}.png`;
}

// Generate initial particles (pure function for lazy init)
function generateInitialParticles(rewardTier: RewardTier, particleColors: string[]): Particle[] {
  const particles: Particle[] = [];
  const particleCount = rewardTier === 'perfect' ? 100 : rewardTier === 'gold' ? 75 : 50;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 3 + 2,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
    });
  }
  return particles;
}

export default function RewardScreen({
  characters,
  lessonNumber,
  lessonData,
  accuracies,
  onContinue,
  onReplayLesson,
}: RewardScreenProps) {
  const [showContent, setShowContent] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const rewardTier = useMemo(() => getRewardTier(accuracies), [accuracies]);
  const avgAccuracy = useMemo(
    () => accuracies.reduce((a, b) => a + b, 0) / accuracies.length,
    [accuracies]
  );

  // Particle colors based on dominant tones in lesson
  const particleColors = useMemo(() => {
    const toneCounts = characters.reduce(
      (acc, char) => {
        acc[char.tone] = (acc[char.tone] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>
    );

    const dominantTone = Object.entries(toneCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '1';

    // Color palettes per tone
    const palettes: Record<string, string[]> = {
      '1': ['#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'], // Blue (SING)
      '2': ['#10B981', '#34D399', '#6EE7B7', '#D1FAE5'], // Emerald (GASP)
      '3': ['#F59E0B', '#FBBF24', '#FCD34D', '#FEF3C7'], // Amber (GROAN)
      '4': ['#EF4444', '#F87171', '#FCA5A5', '#FEE2E2'], // Red (COMMAND)
    };

    return palettes[dominantTone] || palettes['1'];
  }, [characters]);

  // Initialize particles with lazy state initializer (avoids effect)
  const [particles, setParticles] = useState<Particle[]>(() =>
    generateInitialParticles(rewardTier, particleColors)
  );

  // Animate particles and play sounds on mount
  useEffect(() => {
    // Play completion fanfare
    playCompletionFanfare();

    // Animate particles
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.1, // gravity
          rotation: p.rotation + p.rotationSpeed,
        }))
      );
    }, 50);

    // Show content after particle burst
    const contentTimer = setTimeout(() => setShowContent(true), 500);

    return () => {
      clearInterval(interval);
      clearTimeout(contentTimer);
    };
  }, []);

  // Handle character card tap - play tone sound
  const handleCharacterTap = (char: Character) => {
    setSelectedCharacter(char);
    playToneSound(char.tone as ToneNumber);
  };

  const tierConfig = {
    bronze: {
      emoji: '🥉',
      title: 'Lesson Complete!',
      subtitle: 'Keep practicing to improve your score',
      bgGradient: 'from-amber-900 to-stone-900',
    },
    silver: {
      emoji: '🥈',
      title: 'Well Done!',
      subtitle: 'Great progress on your journey',
      bgGradient: 'from-slate-600 to-slate-900',
    },
    gold: {
      emoji: '🥇',
      title: 'Excellent!',
      subtitle: 'Outstanding performance',
      bgGradient: 'from-amber-500 to-amber-800',
    },
    perfect: {
      emoji: '🏆',
      title: 'Perfect Mastery!',
      subtitle: 'Flawless execution - you are a scholar!',
      bgGradient: 'from-purple-600 to-indigo-900',
    },
  };

  const config = tierConfig[rewardTier];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${config.bgGradient} relative overflow-hidden`}>
      {/* Particle Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-sm"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              transform: `rotate(${p.rotation}deg)`,
              opacity: p.y > 100 ? 0 : 1,
              transition: 'opacity 0.5s',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center min-h-screen p-4 transition-all duration-700 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-4 animate-bounce">{config.emoji}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{config.title}</h1>
          <p className="text-white/70 text-lg">{config.subtitle}</p>
          {lessonData?.title && (
            <p className="text-white/50 mt-2">
              Lesson {lessonNumber}: {lessonData.title}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-8 max-w-md w-full">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-white/60 text-sm">Accuracy</p>
              <p className="text-2xl font-bold text-white">{avgAccuracy.toFixed(0)}%</p>
            </div>
            <div>
              <p className="text-white/60 text-sm">Characters</p>
              <p className="text-2xl font-bold text-white">{characters.length}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm">Rounds</p>
              <p className="text-2xl font-bold text-white">{accuracies.length}</p>
            </div>
          </div>

          {/* Round breakdown */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex justify-around text-sm">
              {accuracies.map((acc, i) => (
                <div key={i} className="text-center">
                  <p className="text-white/50">R{i + 1}</p>
                  <p className="text-white font-medium">{acc.toFixed(0)}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Character Gallery */}
        <div className="bg-white/5 backdrop-blur rounded-2xl p-4 mb-8 max-w-4xl w-full">
          <h3 className="text-white/70 text-sm uppercase tracking-wider mb-4 text-center">
            Characters Mastered - Tap to hear tones
          </h3>
          <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-8 gap-2">
            {characters.map((char) => {
              const toneInfo = getToneInfo(char.tone);
              const isSelected = selectedCharacter?.id === char.id;
              const hasImage = !imageErrors[char.id];
              const imagePath = getCharacterImagePath(lessonNumber, char.id, char.pinyin);

              return (
                <button
                  key={char.id}
                  onClick={() => handleCharacterTap(char)}
                  className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-white scale-110 z-10' : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: isSelected ? toneInfo.bgLight : 'rgba(255,255,255,0.1)',
                  }}
                >
                  {hasImage ? (
                    <Image
                      src={imagePath}
                      alt={char.character}
                      fill
                      className="object-cover"
                      onError={() => setImageErrors((prev) => ({ ...prev, [char.id]: true }))}
                    />
                  ) : (
                    <span
                      className={`absolute inset-0 flex items-center justify-center text-2xl font-serif ${
                        isSelected ? 'text-stone-800' : 'text-white'
                      }`}
                    >
                      {char.character}
                    </span>
                  )}

                  {/* Tone indicator dot */}
                  <div
                    className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${toneInfo.color}`}
                  />
                </button>
              );
            })}
          </div>

          {/* Selected character details */}
          {selectedCharacter && (
            <div className="mt-4 p-4 bg-white/10 rounded-xl text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-4xl text-white font-serif">
                  {selectedCharacter.character}
                </span>
                <span className="text-2xl text-white/80">{selectedCharacter.pinyin}</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    getToneInfo(selectedCharacter.tone).color
                  } text-white`}
                >
                  {getToneInfo(selectedCharacter.tone).verb}
                </span>
              </div>
              <p className="text-white/70">{selectedCharacter.meaning}</p>
              {selectedCharacter.sound_bridge && (
                <p className="text-white/50 text-sm mt-1">🔊 {selectedCharacter.sound_bridge}</p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 max-w-md w-full">
          {onReplayLesson && (
            <button
              onClick={onReplayLesson}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-xl transition-colors border border-white/20"
            >
              ← Replay Lesson
            </button>
          )}
          <button
            onClick={onContinue}
            className="flex-1 bg-white hover:bg-white/90 text-stone-900 font-semibold py-4 px-6 rounded-xl transition-colors shadow-lg"
          >
            Continue →
          </button>
        </div>

        {/* Narrative callback */}
        {lessonData?.narrative_story && (
          <div className="mt-8 max-w-2xl text-center">
            <p className="text-white/40 text-sm italic leading-relaxed">
              &ldquo;{lessonData.narrative_story.slice(0, 150)}...&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
