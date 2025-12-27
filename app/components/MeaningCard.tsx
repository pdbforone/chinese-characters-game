'use client';

import { Character } from '@/lib/types';
import { getCardClassNames, createCardKeyHandler } from '@/lib/useCardState';

interface MeaningCardProps {
  character: Character;
  isSelected: boolean;
  isMatched: boolean;
  isIncorrect: boolean;
  onClick: () => void;
}

export default function MeaningCard({
  character,
  isSelected,
  isMatched,
  isIncorrect,
  onClick,
}: MeaningCardProps) {
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
      aria-label={`Meaning: ${character.meaning}`}
      aria-pressed={isSelected}
      aria-disabled={isMatched}
      className={`
        ${classNames.border}
        ${classNames.background}
        ${classNames.animation}
        rounded-lg p-6 cursor-pointer
        transition-all duration-200
        ${isMatched ? 'opacity-50 cursor-not-allowed' : ''}
        min-h-[140px]
        flex flex-col items-center justify-center
        focus:outline-none focus:ring-4 focus:ring-blue-300
      `}
    >
      <div className="text-2xl font-semibold text-gray-900 mb-2">{character.meaning}</div>
      {isMatched && (
        <div className="mt-2">
          <span className="text-green-600 text-xl">✓</span>
        </div>
      )}
    </div>
  );
}
