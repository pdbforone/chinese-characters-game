'use client';

import { Character } from '@/lib/types';
import { getCardClassNames, createCardKeyHandler } from '@/lib/useCardState';

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
  const classNames = getCardClassNames(
    { isSelected, isMatched, isIncorrect },
    { showPulseOnMatch: false }
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
        rounded-lg p-4 cursor-pointer
        transition-all duration-200
        ${isMatched ? 'opacity-50 cursor-not-allowed' : ''}
        min-h-[120px]
        flex flex-col justify-center
        focus:outline-none focus:ring-4 focus:ring-blue-300
      `}
    >
      <p className="text-gray-800 text-sm leading-relaxed">{character.story}</p>
      {isMatched && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-green-600 text-2xl font-bold" aria-label="Correct match">
            ✓
          </span>
          <span className="text-green-700 font-semibold text-sm">Correct!</span>
        </div>
      )}
      {isIncorrect && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-red-600 text-2xl font-bold" aria-label="Incorrect match">
            ✗
          </span>
          <span className="text-red-700 font-semibold text-sm">Try again</span>
        </div>
      )}
    </div>
  );
}
