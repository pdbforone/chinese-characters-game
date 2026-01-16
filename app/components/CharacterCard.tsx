'use client';

import { Character } from '@/lib/types';
import { getCardClassNames, createCardKeyHandler } from '@/lib/useCardState';
import { getToneInfo } from '@/lib/toneUtils';

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  isMatched: boolean;
  isIncorrect: boolean;
  onClick: () => void;
  showPinyin?: boolean;
  showMeaning?: boolean;
  showToneBadge?: boolean;
}

export default function CharacterCard({
  character,
  isSelected,
  isMatched,
  isIncorrect,
  onClick,
  showPinyin = true,
  showMeaning = true,
  showToneBadge = true,
}: CharacterCardProps) {
  const toneInfo = getToneInfo(character.tone);
  const classNames = getCardClassNames(
    { isSelected, isMatched, isIncorrect },
    { useToneColors: true, tone: character.tone }
  );
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
        rounded-xl p-6 cursor-pointer
        transition-all duration-200
        ${isMatched ? 'opacity-60 cursor-not-allowed' : ''}
        min-h-[160px]
        flex flex-col items-center justify-center
        focus:outline-none focus:ring-4 focus:ring-amber-300
        relative
      `}
    >
      {/* Tone Badge */}
      {showToneBadge && !isMatched && (
        <div
          className={`absolute top-2 right-2 ${toneInfo.color} text-white px-2 py-0.5 rounded-full text-xs font-bold`}
        >
          {toneInfo.verb}
        </div>
      )}

      <div className="text-6xl mb-2 font-serif text-stone-800">{character.character}</div>
      {(showPinyin || showMeaning) && (
        <div className="text-sm text-center">
          {showPinyin && (
            <div className={`font-medium ${toneInfo.textColor}`}>{character.pinyin}</div>
          )}
          {showMeaning && <div className="text-stone-600">{character.meaning}</div>}
        </div>
      )}
      {isMatched && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-emerald-600 text-2xl font-bold" aria-label="Correct match">
            ✓
          </span>
          <span className="text-emerald-700 font-semibold text-sm">Matched!</span>
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
