'use client';

import { Character } from '@/lib/types';

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
  let borderClass = 'border-2 border-gray-300';
  let bgClass = 'bg-white hover:bg-gray-50';
  let animationClass = '';

  if (isMatched) {
    borderClass = 'border-2 border-green-500';
    bgClass = 'bg-green-50';
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
        rounded-lg p-4 cursor-pointer
        transition-all duration-200
        ${isMatched ? 'opacity-50 cursor-not-allowed' : ''}
        min-h-[120px]
        flex flex-col justify-center
      `}
    >
      <p className="text-gray-800 text-sm leading-relaxed">{character.story}</p>
      {isMatched && (
        <div className="mt-2 flex justify-end">
          <span className="text-green-600 text-xl">✓</span>
        </div>
      )}
    </div>
  );
}
