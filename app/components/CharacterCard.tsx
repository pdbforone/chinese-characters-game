'use client';

import { Character } from '@/lib/types';
import { getCardClassNames, createCardKeyHandler } from '@/lib/useCardState';

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  isMatched: boolean;
  isIncorrect: boolean;
  onClick: () => void;
  showPinyin?: boolean;
  showMeaning?: boolean;
}

export default function CharacterCard({
  character,
  isSelected,
  isMatched,
  isIncorrect,
  onClick,
  showPinyin = true,
  showMeaning = true,
}: CharacterCardProps) {
  const classNames = getCardClassNames({ isSelected, isMatched, isIncorrect });
  const handleKeyDown = createCardKeyHandler(onClick, isMatched);

  return (
    <div
      onClick={isMatched ? undefined : onClick}
      onKeyDown={handleKeyDown}
      tabIndex={isMatched ? -1 : 0}
      role="button"
      aria-label={`Character ${character.character}, pronounced ${character.pinyin}${showMeaning ? `, meaning ${character.meaning}` : ''}`}
      aria-pressed={isSelected}
      aria-disabled={isMatched}
      className={`
        ${classNames.border}
        ${classNames.background}
        ${classNames.animation}
        rounded-lg p-6 cursor-pointer
        transition-all duration-200
        ${isMatched ? 'opacity-50 cursor-not-allowed' : ''}
        min-h-[160px]
        flex flex-col items-center justify-center
        focus:outline-none focus:ring-4 focus:ring-blue-300
      `}
    >
      <div className="text-6xl mb-2 font-serif text-gray-900">{character.character}</div>
      {(showPinyin || showMeaning) && (
        <div className="text-sm text-center">
          {showPinyin && <div className="font-medium text-gray-700">{character.pinyin}</div>}
          {showMeaning && <div className="text-gray-600">{character.meaning}</div>}
        </div>
      )}
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
