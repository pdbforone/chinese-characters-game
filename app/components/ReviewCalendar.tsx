/**
 * Review Calendar Component
 *
 * Visualizes spaced repetition review schedule in a calendar heatmap.
 * Shows which characters are due for review and when.
 */

'use client';

import { useMemo } from 'react';

interface ReviewCalendarProps {
  reviews: Array<{ character: string; dueDate: string; easeFactor: number }>;
}

export default function ReviewCalendar({ reviews }: ReviewCalendarProps) {
  // Group reviews by date
  const reviewsByDate = useMemo(() => {
    const grouped: Record<string, number> = {};
    reviews.forEach((review) => {
      const date = review.dueDate.split('T')[0]; // Get YYYY-MM-DD
      grouped[date] = (grouped[date] || 0) + 1;
    });
    return grouped;
  }, [reviews]);

  // Get next 14 days
  const dates = useMemo(() => {
    const result = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      result.push(date);
    }
    return result;
  }, []);

  const getIntensity = (count: number): string => {
    if (count === 0) return 'bg-gray-100';
    if (count <= 5) return 'bg-green-200';
    if (count <= 10) return 'bg-green-400';
    if (count <= 20) return 'bg-green-600';
    return 'bg-green-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>📅</span> Review Schedule
      </h2>
      <p className="text-sm text-gray-600 mb-4">Characters due for review in the next 2 weeks</p>

      <div className="grid grid-cols-7 gap-2">
        {dates.map((date) => {
          const dateStr = date.toISOString().split('T')[0];
          const count = reviewsByDate[dateStr] || 0;
          const isToday = dateStr === new Date().toISOString().split('T')[0];

          return (
            <div key={dateStr} className="text-center">
              <div className="text-xs text-gray-500 mb-1">
                {date.toLocaleDateString('en-US', { weekday: 'short' })[0]}
              </div>
              <div
                className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold ${getIntensity(count)} ${
                  isToday ? 'ring-2 ring-blue-500' : ''
                }`}
                title={`${count} characters due on ${date.toLocaleDateString()}`}
              >
                {count > 0 ? count : ''}
              </div>
              <div className="text-xs text-gray-400 mt-1">{date.getDate()}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded bg-gray-100"></div>
          <div className="w-4 h-4 rounded bg-green-200"></div>
          <div className="w-4 h-4 rounded bg-green-400"></div>
          <div className="w-4 h-4 rounded bg-green-600"></div>
          <div className="w-4 h-4 rounded bg-green-800"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
