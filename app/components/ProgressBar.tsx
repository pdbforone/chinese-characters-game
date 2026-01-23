'use client';

import { LessonTheme } from '@/lib/lessonThemes';

interface ProgressBarProps {
  current: number;
  total: number;
  lesson: number;
  round: number;
  page?: number;
  totalPages?: number;
  theme?: LessonTheme;
}

export default function ProgressBar({
  current,
  total,
  lesson,
  round,
  page = 1,
  totalPages = 1,
  theme,
}: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className={`text-xl font-bold ${theme ? theme.textPrimary : 'text-gray-800'}`}>
          Lesson {lesson} - Round {round}
          {totalPages > 1 && (
            <span className={`text-base ${theme ? theme.textMuted : 'text-gray-600'} ml-2`}>
              (Page {page} of {totalPages})
            </span>
          )}
        </h2>
        <span className={`text-sm font-medium ${theme ? theme.textMuted : 'text-gray-600'}`}>
          {current}/{total} matched
        </span>
      </div>
      <div
        className={`w-full ${theme ? 'bg-white/10' : 'bg-gray-200'} rounded-full h-3 overflow-hidden`}
      >
        <div
          className={`${theme ? `bg-gradient-to-r ${theme.accentPrimary}` : 'bg-blue-600'} h-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
