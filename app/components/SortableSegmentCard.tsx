'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { StorySegment } from '@/lib/storySegments';

interface SortableSegmentCardProps {
  segment: StorySegment;
  index: number;
  isSelected: boolean;
  onTap: () => void;
  showResult: boolean;
  isCorrectPosition: boolean;
}

/**
 * A draggable/tappable card representing a story segment.
 * Uses @dnd-kit for drag-and-drop with tap-to-select fallback.
 */
export default function SortableSegmentCard({
  segment,
  index,
  isSelected,
  onTap,
  showResult,
  isCorrectPosition,
}: SortableSegmentCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: segment.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Determine card styling based on state
  const getCardClasses = () => {
    const base =
      'relative bg-white rounded-xl p-4 shadow-md border-2 cursor-grab active:cursor-grabbing transition-all duration-200';

    if (isDragging) {
      return `${base} border-amber-400 shadow-xl scale-105 z-50 opacity-90`;
    }

    if (showResult) {
      if (isCorrectPosition) {
        return `${base} border-green-400 bg-green-50`;
      } else {
        return `${base} border-red-300 bg-red-50`;
      }
    }

    if (isSelected) {
      return `${base} border-amber-500 bg-amber-50 ring-2 ring-amber-300`;
    }

    return `${base} border-gray-200 hover:border-amber-300 hover:shadow-lg`;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={getCardClasses()}
      onClick={onTap}
      {...attributes}
      {...listeners}
    >
      {/* Position indicator */}
      <div
        className={`absolute -left-3 -top-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md ${
          showResult && isCorrectPosition
            ? 'bg-green-500 text-white'
            : showResult && !isCorrectPosition
              ? 'bg-red-400 text-white'
              : isSelected
                ? 'bg-amber-500 text-white'
                : 'bg-gray-700 text-white'
        }`}
      >
        {index + 1}
      </div>

      {/* Character badge */}
      <div className="absolute -right-2 -top-2 w-10 h-10 bg-gradient-to-br from-amber-100 to-yellow-200 rounded-lg flex items-center justify-center border-2 border-amber-300 shadow-md">
        <span className="text-xl font-serif text-gray-800">{segment.character}</span>
      </div>

      {/* Content */}
      <div className="pr-8 pl-4">
        <p className="text-gray-800 leading-relaxed">{segment.text}</p>
      </div>

      {/* Drag handle hint */}
      <div className="absolute bottom-2 right-2 text-gray-300">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
        </svg>
      </div>

      {/* Selection indicator for mobile */}
      {isSelected && !isDragging && (
        <div className="absolute inset-0 rounded-xl border-2 border-amber-500 pointer-events-none">
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-amber-600 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
            Tap destination to move
          </div>
        </div>
      )}

      {/* Correct/incorrect indicator */}
      {showResult && (
        <div
          className={`absolute -right-1 -bottom-1 w-6 h-6 rounded-full flex items-center justify-center ${
            isCorrectPosition ? 'bg-green-500' : 'bg-red-400'
          }`}
        >
          <span className="text-white text-sm">{isCorrectPosition ? '✓' : '✗'}</span>
        </div>
      )}
    </div>
  );
}
