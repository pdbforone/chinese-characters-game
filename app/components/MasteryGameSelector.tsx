'use client';

import { LessonData } from '@/lib/types';
import { getLessonTheme } from '@/lib/lessonThemes';

export type MasteryGameType = 'tone-recall' | 'sound-recall' | 'character-recall';

interface MasteryGameSelectorProps {
  lessonNumber: number;
  lessonData: LessonData;
  onSelectGame: (game: MasteryGameType) => void;
  onBack?: () => void;
  completedGames?: MasteryGameType[];
}

interface GameOption {
  id: MasteryGameType;
  name: string;
  description: string;
  difficulty: 'Medium' | 'Hard' | 'Expert';
  icon: string;
  prompt: string;
  response: string;
}

const MASTERY_GAMES: GameOption[] = [
  {
    id: 'tone-recall',
    name: 'Tone Recall',
    description: 'Test your tone memory',
    difficulty: 'Medium',
    icon: '🎵',
    prompt: 'Character only',
    response: 'Select the tone emotion',
  },
  {
    id: 'sound-recall',
    name: 'Sound Recall',
    description: 'Test your pinyin memory',
    difficulty: 'Hard',
    icon: '🔊',
    prompt: 'Character only',
    response: 'Select the correct pinyin',
  },
  {
    id: 'character-recall',
    name: 'Character Recall',
    description: 'Test your character recognition',
    difficulty: 'Expert',
    icon: '字',
    prompt: 'Pinyin + meaning',
    response: 'Select the correct character',
  },
];

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Medium: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
  Hard: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  Expert: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
};

/**
 * MasteryGameSelector - Choose which mastery game to play
 *
 * Shows all available mastery games with clear descriptions
 * of what each tests and its difficulty level.
 *
 * Mobile-first design with large touch targets.
 */
export default function MasteryGameSelector({
  lessonNumber,
  lessonData,
  onSelectGame,
  onBack,
  completedGames = [],
}: MasteryGameSelectorProps) {
  const theme = getLessonTheme(lessonNumber);

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
              ← Back to Lesson
            </button>
          )}

          <div
            className={`${theme.headerBg} rounded-xl p-6 shadow-lg border ${theme.cardBorder} text-center`}
          >
            <p className={`text-sm ${theme.textMuted} mb-1`}>Lesson {lessonNumber}</p>
            <h1 className={`text-2xl font-bold ${theme.headerText} mb-2`}>
              {lessonData.title || 'Mastery Challenge'}
            </h1>
            <p className={`text-sm ${theme.textMuted}`}>Choose your mastery challenge</p>
          </div>
        </div>

        {/* Completion Progress */}
        <div className={`${theme.cardBg} rounded-xl p-4 mb-6 border ${theme.cardBorder}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${theme.textMuted}`}>Mastery Progress</span>
            <span className={`text-sm font-bold ${theme.textPrimary}`}>
              {completedGames.length} / {MASTERY_GAMES.length}
            </span>
          </div>
          <div className="flex gap-2">
            {MASTERY_GAMES.map((game) => (
              <div
                key={game.id}
                className={`flex-1 h-2 rounded-full ${
                  completedGames.includes(game.id)
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                    : `${theme.cardBg} border ${theme.cardBorder}`
                }`}
              />
            ))}
          </div>
        </div>

        {/* Game Options */}
        <div className="space-y-4">
          {MASTERY_GAMES.map((game) => {
            const isCompleted = completedGames.includes(game.id);
            const diffColors = DIFFICULTY_COLORS[game.difficulty];

            return (
              <button
                key={game.id}
                onClick={() => onSelectGame(game.id)}
                className={`
                  w-full ${theme.cardBg} rounded-xl p-5 border ${theme.cardBorder}
                  text-left transition-all duration-200
                  hover:scale-[1.02] active:scale-[0.98]
                  ${isCompleted ? 'ring-2 ring-amber-500/50' : ''}
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`
                    w-14 h-14 rounded-xl flex items-center justify-center text-2xl
                    bg-gradient-to-br ${theme.accentPrimary}
                  `}
                  >
                    {game.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-bold ${theme.textPrimary}`}>{game.name}</h3>
                      {isCompleted && <span className="text-amber-400">✓</span>}
                    </div>
                    <p className={`text-sm ${theme.textMuted} mb-2`}>{game.description}</p>

                    {/* What it tests */}
                    <div className={`text-xs ${theme.textMuted} space-y-1`}>
                      <div className="flex items-center gap-2">
                        <span className="opacity-60">See:</span>
                        <span className={theme.textSecondary}>{game.prompt}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="opacity-60">Do:</span>
                        <span className={theme.textSecondary}>{game.response}</span>
                      </div>
                    </div>
                  </div>

                  {/* Difficulty badge */}
                  <div
                    className={`${diffColors.bg} ${diffColors.text} border ${diffColors.border} px-2 py-1 rounded text-xs font-bold`}
                  >
                    {game.difficulty}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Info box */}
        <div className={`${theme.cardBg} rounded-xl p-4 mt-6 border ${theme.cardBorder}`}>
          <p className={`text-sm ${theme.textMuted} text-center`}>
            Complete all three games to achieve{' '}
            <span className="text-amber-400 font-bold">Gold Mastery</span>
          </p>
        </div>

        {/* Keyboard hint */}
        <p className={`text-center text-xs ${theme.textMuted} mt-4`}>Tap to select a game</p>
      </div>
    </div>
  );
}
