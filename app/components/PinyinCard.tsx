'use client';

import { Character } from '@/lib/types';
import { getCardClassNames, createCardKeyHandler } from '@/lib/useCardState';
import { getToneInfo } from '@/lib/toneUtils';

interface PinyinCardProps {
  character: Character;
  isSelected: boolean;
  isMatched: boolean;
  isIncorrect: boolean;
  onClick: () => void;
  showToneIndicators?: boolean; // Hide in Round 3 to increase difficulty
}

export default function PinyinCard({
  character,
  isSelected,
  isMatched,
  isIncorrect,
  onClick,
  showToneIndicators = true,
}: PinyinCardProps) {
  const toneInfo = getToneInfo(character.tone);
  const classNames = getCardClassNames(
    { isSelected, isMatched, isIncorrect },
    { useToneColors: showToneIndicators, tone: character.tone }
  );
  const handleKeyDown = createCardKeyHandler(onClick, isMatched);

  return (
    <div
      onClick={isMatched ? undefined : onClick}
      onKeyDown={handleKeyDown}
      tabIndex={isMatched ? -1 : 0}
      role="button"
      aria-label={`Pinyin: ${character.pinyin}`}
      aria-pressed={isSelected}
      aria-disabled={isMatched}
      className={`
        ${classNames.border}
        ${classNames.background}
        ${classNames.animation}
        rounded-xl p-6 cursor-pointer
        transition-all duration-200
        ${isMatched ? 'opacity-60 cursor-not-allowed' : ''}
        min-h-[140px]
        flex flex-col items-center justify-center
        focus:outline-none focus:ring-4 focus:ring-amber-300
        relative
      `}
    >
      {/* Tone Badge - hidden in Round 3 */}
      {showToneIndicators && !isMatched && (
        <div
          className={`absolute top-2 right-2 ${toneInfo.color} text-white px-2 py-0.5 rounded-full text-xs font-bold`}
        >
          {toneInfo.verb}
        </div>
      )}

      <div
        className={`text-4xl font-semibold ${showToneIndicators ? toneInfo.textColor : 'text-stone-700'} mb-2`}
      >
        {character.pinyin}
      </div>

      {/* Show sound bridge on match */}
      {isMatched && character.sound_bridge && (
        <div className={`text-xs ${toneInfo.textColor} bg-white/50 rounded px-2 py-1 mb-2`}>
          {character.sound_bridge}
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
