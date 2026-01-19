'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Character, LessonData } from '@/lib/types';
import {
  StorySegment,
  extractStorySegments,
  selectGameSegments,
  shuffleSegments,
  checkSegmentOrder,
  getCorrectOrder,
} from '@/lib/storySegments';
import SortableSegmentCard from './SortableSegmentCard';

interface StoryMasonProps {
  characters: Character[];
  lessonData: LessonData;
  lessonNumber: number;
  onComplete: (accuracy: number) => void;
  onBack?: () => void;
}

/**
 * Story Mason - Narrative Sequencing Game
 *
 * Players must rebuild the lesson's narrative by arranging
 * story segments in the correct chronological order.
 *
 * Supports both drag-and-drop (desktop) and tap-to-reorder (mobile).
 */
export default function StoryMason({
  characters,
  lessonData,
  lessonNumber,
  onComplete,
  onBack,
}: StoryMasonProps) {
  // Initialize segments using useMemo with lazy initialization for state
  const { initialSegments, correctOrder } = useMemo(() => {
    const allSegments = extractStorySegments(characters);
    const gameSegments = selectGameSegments(allSegments, 5);
    const shuffled = shuffleSegments(gameSegments);
    const correct = getCorrectOrder(gameSegments);
    return { initialSegments: shuffled, correctOrder: correct };
  }, [characters]);

  // Game state
  const [segments, setSegments] = useState<StorySegment[]>(initialSegments);
  const [attempts, setAttempts] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{ isCorrect: boolean; correctCount: number } | null>(null);

  // Mobile tap-to-reorder state
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // DnD sensors with keyboard support for accessibility
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSegments((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    // Clear mobile selection when dragging
    setSelectedIndex(null);
  }, []);

  // Handle tap-to-reorder (mobile fallback)
  const handleTapSelect = useCallback(
    (index: number) => {
      if (selectedIndex === null) {
        // First tap - select this item
        setSelectedIndex(index);
      } else if (selectedIndex === index) {
        // Tap same item - deselect
        setSelectedIndex(null);
      } else {
        // Second tap - swap items
        setSegments((items) => {
          const newItems = arrayMove(items, selectedIndex, index);
          return newItems;
        });
        setSelectedIndex(null);
      }
    },
    [selectedIndex]
  );

  // Check answer
  const handleCheckAnswer = useCallback(() => {
    setIsChecking(true);
    setAttempts((prev) => prev + 1);

    const checkResult = checkSegmentOrder(segments);
    setResult(checkResult);
    setShowResult(true);

    setTimeout(() => {
      setIsChecking(false);

      if (checkResult.isCorrect) {
        // Calculate accuracy based on attempts
        // 1 attempt = 100%, 2 = 80%, 3 = 60%, 4+ = 40%
        const accuracy = Math.max(0.4, 1 - attempts * 0.2);
        onComplete(accuracy);
      }
    }, 1500);
  }, [segments, attempts, onComplete]);

  // Show correct answer
  const handleShowAnswer = useCallback(() => {
    setSegments(correctOrder);
    setShowResult(false);
    setResult(null);
  }, [correctOrder]);

  if (segments.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-gray-600">Loading story segments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          {onBack && (
            <button
              onClick={onBack}
              className="text-amber-700 hover:text-amber-900 font-medium mb-4 flex items-center gap-2"
            >
              ← Back
            </button>
          )}

          <div className="bg-white rounded-xl p-4 shadow-md border-2 border-amber-200">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🏛️</span>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Story Mason</h1>
                <p className="text-sm text-gray-600">
                  Lesson {lessonNumber}: {lessonData.title}
                </p>
              </div>
            </div>
            <p className="text-sm text-amber-700">
              Rebuild the narrative by arranging the story beats in chronological order.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Tap to select, then tap destination to move • Or drag to reorder
            </p>
          </div>
        </div>

        {/* Story segments */}
        <div className="mb-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={segments} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {segments.map((segment, index) => (
                  <SortableSegmentCard
                    key={segment.id}
                    segment={segment}
                    index={index}
                    isSelected={selectedIndex === index}
                    onTap={() => handleTapSelect(index)}
                    showResult={showResult}
                    isCorrectPosition={showResult && segment.position === index}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Result feedback */}
        {showResult && result && (
          <div
            className={`mb-4 p-4 rounded-xl border-2 ${
              result.isCorrect
                ? 'bg-green-50 border-green-300 text-green-800'
                : 'bg-red-50 border-red-300 text-red-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{result.isCorrect ? '🎉' : '🤔'}</span>
              <div>
                <p className="font-bold">
                  {result.isCorrect
                    ? 'Perfect! The story flows correctly!'
                    : `${result.correctCount} of ${segments.length} in correct position`}
                </p>
                {!result.isCorrect && (
                  <p className="text-sm opacity-80">Try again or view the correct order</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCheckAnswer}
            disabled={isChecking}
            className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {isChecking ? 'Checking...' : 'Check Order'}
          </button>

          {showResult && !result?.isCorrect && (
            <button
              onClick={handleShowAnswer}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-colors"
            >
              Show Answer
            </button>
          )}
        </div>

        {/* Attempts counter */}
        <p className="text-center text-sm text-gray-500 mt-4">Attempts: {attempts}</p>
      </div>
    </div>
  );
}
