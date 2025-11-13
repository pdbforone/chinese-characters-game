'use client';

import { Character } from '@/lib/types';

interface PinyinCardProps {
  character: Character;
  isSelected: boolean;
  isMatched: boolean;
  isIncorrect: boolean;
  onClick: () => void;
}

export default function PinyinCard({
  character,
  isSelected,
  isMatched,
  isIncorrect,
  onClick,
}: PinyinCardProps) {
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
        min-h-[140px]
        flex flex-col items-center justify-center
      `}
    >
      <div className="text-4xl font-semibold text-gray-900 mb-2">{character.pinyin}</div>
      {isMatched && (
        <div className="mt-2">
          <span className="text-green-600 text-xl">✓</span>
        </div>
      )}
    </div>
  );
}
