'use client';

import { Character } from '@/lib/types';
import { getCardClassNames, createCardKeyHandler } from '@/lib/useCardState';
import { getToneInfo } from '@/lib/toneUtils';

interface StoryCardProps {
  character: Character;
  isSelected: boolean;
  isMatched: boolean;
  isIncorrect: boolean;
  onClick: () => void;
}

export default function StoryCard({
  character,
  isSelected,
  isMatched,
  isIncorrect,
  onClick,
}: StoryCardProps) {
  const toneInfo = getToneInfo(character.tone);
  const classNames = getCardClassNames(
    { isSelected, isMatched, isIncorrect },
    { showPulseOnMatch: false, useToneColors: true, tone: character.tone }
  );
  const handleKeyDown = createCardKeyHandler(onClick, isMatched);

  return (
    <div
      onClick={isMatched ? undefined : onClick}
      onKeyDown={handleKeyDown}
      tabIndex={isMatched ? -1 : 0}
      role="button"
      aria-label={`Story: ${character.story.substring(0, 100)}...`}
      aria-pressed={isSelected}
      aria-disabled={isMatched}
      className={`
        ${classNames.border}
        ${classNames.background}
        ${classNames.animation}
        rounded-xl p-4 cursor-pointer
        transition-all duration-200
        ${isMatched ? 'opacity-60 cursor-not-allowed' : ''}
        min-h-[120px]
        flex flex-col justify-center
        focus:outline-none focus:ring-4 focus:ring-amber-300
        relative
      `}
    >
      {/* Tone indicator line */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${toneInfo.color} rounded-l-xl`} />

      <p className="text-stone-700 text-sm leading-relaxed pl-2">{character.story}</p>

      {/* Show sound bridge on match */}
      {isMatched && character.sound_bridge && (
        <div className={`mt-2 pl-2 ${toneInfo.bgLight} ${toneInfo.textColor} text-xs rounded p-1`}>
          {character.sound_bridge}
        </div>
      )}

      {isMatched && (
        <div className="mt-2 pl-2 flex items-center gap-2">
          <span className="text-emerald-600 text-2xl font-bold" aria-label="Correct match">
            ✓
          </span>
          <span className="text-emerald-700 font-semibold text-sm">Matched!</span>
        </div>
      )}
      {isIncorrect && (
        <div className="mt-2 pl-2 flex items-center gap-2">
          <span className="text-red-600 text-2xl font-bold" aria-label="Incorrect match">
            ✗
          </span>
          <span className="text-red-700 font-semibold text-sm">Try again</span>
        </div>
      )}
    </div>
  );
}
