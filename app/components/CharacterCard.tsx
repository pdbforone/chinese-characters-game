'use client';

import { Character } from '@/lib/types';

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  isMatched: boolean;
  isIncorrect: boolean;
  onClick: () => void;
  showPinyin?: boolean; // Show pinyin
  showMeaning?: boolean; // Show meaning
}

export default function CharacterCard({
  character,
  isSelected,
  isMatched,
  isIncorrect,
  onClick,
  showPinyin = true,
  showMeaning = true
}: CharacterCardProps) {
  let borderClass = 'border-2 border-gray-300';
  let bgClass = 'bg-white hover:bg-gray-50';
  let animationClass = '';

  if (isMatched) {
    borderClass = 'border-2 border-green-500';
    bgClass = 'bg-green-50 animate-pulse-green';
  } else if (isIncorrect) {
    borderClass = 'border-2 border-red-500';
    bgClass = 'bg-red-50';
    animationClass = 'animate-shake';
  } else if (isSelected) {
    borderClass = 'border-2 border-blue-500';
    bgClass = 'bg-blue-50';
  }

  return (
    <div
      onClick={isMatched ? undefined : onClick}
      className={`
        ${borderClass}
        ${bgClass}
        ${animationClass}
        rounded-lg p-6 cursor-pointer
        transition-all duration-200
        ${isMatched ? 'opacity-50 cursor-not-allowed' : ''}
        min-h-[160px]
        flex flex-col items-center justify-center
      `}
    >
      <div className="text-6xl mb-2 font-serif text-gray-900">
        {character.character}
      </div>
      {(showPinyin || showMeaning) && (
        <div className="text-sm text-center">
          {showPinyin && (
            <div className="font-medium text-gray-700">{character.pinyin}</div>
          )}
          {showMeaning && (
            <div className="text-gray-600">{character.meaning}</div>
          )}
        </div>
      )}
      {isMatched && (
        <div className="mt-2">
          <span className="text-green-600 text-xl">✓</span>
        </div>
      )}
    </div>
  );
}
