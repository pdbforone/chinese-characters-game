'use client';

import { Character, LessonData } from '@/lib/types';
import { getLessonTheme } from '@/lib/lessonThemes';
import { MasteryGameType } from './MasteryGameSelector';

interface MasteryResultProps {
  lessonNumber: number;
  lessonData: LessonData;
  gameType: MasteryGameType;
  accuracy: number;
  missedCharacters: Character[];
  totalCharacters: number;
  onReviewMissed: () => void;
  onContinue: () => void;
  onBack: () => void;
}

const GAME_NAMES: Record<MasteryGameType, string> = {
  'tone-recall': 'Tone Recall',
  'sound-recall': 'Sound Recall',
  'character-recall': 'Character Recall',
};

/**
 * MasteryResult - Shows mastery game results with option to review missed characters
 */
export default function MasteryResult({
  lessonNumber,
  lessonData,
  gameType,
  accuracy,
  missedCharacters,
  totalCharacters,
  onReviewMissed,
  onContinue,
  onBack,
}: MasteryResultProps) {
  const theme = getLessonTheme(lessonNumber);
  const percentCorrect = Math.round(accuracy * 100);
  const correctCount = totalCharacters - missedCharacters.length;
  const hasMissed = missedCharacters.length > 0;

  // Determine result tier
  const tier =
    percentCorrect >= 90 ? 'excellent' : percentCorrect >= 70 ? 'good' : 'needs-practice';

  const tierConfig = {
    excellent: {
      emoji: '🏆',
      title: 'Excellent!',
      subtitle: 'Outstanding mastery',
      color: 'from-amber-400 to-yellow-500',
      textColor: 'text-amber-400',
    },
    good: {
      emoji: '⭐',
      title: 'Good Job!',
      subtitle: 'Solid understanding',
      color: 'from-blue-400 to-blue-500',
      textColor: 'text-blue-400',
    },
    'needs-practice': {
      emoji: '📚',
      title: 'Keep Practicing',
      subtitle: 'Review will help',
      color: 'from-purple-400 to-purple-500',
      textColor: 'text-purple-400',
    },
  };

  const config = tierConfig[tier];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.bgGradient} p-4 flex items-center justify-center`}
    >
      <div className="max-w-lg w-full">
        {/* Result Card */}
        <div
          className={`${theme.cardBg} rounded-2xl p-8 shadow-lg border ${theme.cardBorder} text-center`}
        >
          {/* Header */}
          <div className="mb-6">
            <p className={`text-sm ${theme.textMuted} mb-2`}>{GAME_NAMES[gameType]} Complete</p>
            <h1 className={`text-3xl font-bold ${theme.textPrimary} mb-1`}>
              {lessonData.title || `Lesson ${lessonNumber}`}
            </h1>
          </div>

          {/* Result Tier */}
          <div className="mb-8">
            <div className="text-6xl mb-2">{config.emoji}</div>
            <h2 className={`text-2xl font-bold ${config.textColor}`}>{config.title}</h2>
            <p className={`${theme.textMuted}`}>{config.subtitle}</p>
          </div>

          {/* Score */}
          <div className={`bg-gradient-to-r ${config.color} rounded-xl p-6 mb-6 text-white`}>
            <div className="text-5xl font-bold mb-1">{percentCorrect}%</div>
            <div className="text-sm opacity-90">
              {correctCount} of {totalCharacters} correct
            </div>
          </div>

          {/* Missed Characters Preview */}
          {hasMissed && (
            <div className="mb-6">
              <p className={`text-sm ${theme.textMuted} mb-3`}>
                Characters to review ({missedCharacters.length}):
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {missedCharacters.slice(0, 8).map((char) => (
                  <div
                    key={char.id}
                    className={`w-12 h-12 ${theme.cardBg} border ${theme.cardBorder} rounded-lg flex items-center justify-center`}
                  >
                    <span className={`text-2xl font-serif ${theme.textPrimary}`}>
                      {char.character}
                    </span>
                  </div>
                ))}
                {missedCharacters.length > 8 && (
                  <div
                    className={`w-12 h-12 ${theme.cardBg} border ${theme.cardBorder} rounded-lg flex items-center justify-center`}
                  >
                    <span className={`text-sm ${theme.textMuted}`}>
                      +{missedCharacters.length - 8}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {hasMissed && (
              <button
                onClick={onReviewMissed}
                className={`w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl`}
              >
                Review Missed Characters ({missedCharacters.length})
              </button>
            )}
            <button
              onClick={onContinue}
              className={`w-full ${hasMissed ? `${theme.cardBg} ${theme.textPrimary} border ${theme.cardBorder}` : `bg-gradient-to-r ${theme.accentPrimary} text-white`} font-bold py-4 px-6 rounded-xl transition-all`}
            >
              {hasMissed ? 'Continue Anyway' : 'Continue'}
            </button>
            <button
              onClick={onBack}
              className={`w-full ${theme.textMuted} hover:${theme.textSecondary} font-medium py-2 transition-colors`}
            >
              ← Back to Game Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
