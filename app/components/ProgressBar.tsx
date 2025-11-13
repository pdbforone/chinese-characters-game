"use client";

interface ProgressBarProps {
  current: number;
  total: number;
  lesson: number;
  round: number;
  page?: number;
  totalPages?: number;
}

export default function ProgressBar({
  current,
  total,
  lesson,
  round,
  page = 1,
  totalPages = 1,
}: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-gray-800">
          RTH Lesson {lesson} - Round {round}
          {totalPages > 1 && (
            <span className="text-base text-gray-600 ml-2">
              (Page {page} of {totalPages})
            </span>
          )}
        </h2>
        <span className="text-sm font-medium text-gray-600">
          {current}/{total} matched
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
