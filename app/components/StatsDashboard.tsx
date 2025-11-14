/**
 * Enhanced Statistics Dashboard
 *
 * Displays learning velocity, retention rates, and progress trends.
 */

'use client';

import { useMemo } from 'react';
import type { LessonProgress } from '@/lib/storage';

interface StatsDashboardProps {
  lessonProgress: Record<number, LessonProgress>;
  totalCharacters: number;
}

export default function StatsDashboard({ lessonProgress, totalCharacters }: StatsDashboardProps) {
  const stats = useMemo(() => {
    const progressArray = Object.values(lessonProgress);

    // Calculate total characters learned (≥70% accuracy)
    const learned = progressArray.reduce((sum, p) => {
      return sum + (p.bestAccuracy >= 70 ? 15 : 0); // Assume 15 chars per lesson
    }, 0);

    // Calculate average accuracy
    const avgAccuracy =
      progressArray.length > 0
        ? progressArray.reduce((sum, p) => sum + p.bestAccuracy, 0) / progressArray.length
        : 0;

    // Learning velocity (last 7 days)
    // Note: Using Date.now() here means stats recalculate daily, which is acceptable
    // eslint-disable-next-line react-hooks/purity
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentLessons = progressArray.filter(
      (p) => new Date(p.lastPlayed).getTime() > sevenDaysAgo
    );
    const velocity = recentLessons.length;

    // Total study time estimate (5 min per game average)
    const totalGames = progressArray.reduce((sum, p) => sum + p.gamesPlayed, 0);
    const estimatedMinutes = totalGames * 5;

    return {
      learned,
      avgAccuracy,
      velocity,
      totalGames,
      estimatedMinutes,
      completion: ((learned / totalCharacters) * 100).toFixed(1),
    };
  }, [lessonProgress, totalCharacters]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>📊</span> Learning Statistics
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Characters Learned */}
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
          <div className="text-3xl font-bold text-blue-600">{stats.learned}</div>
          <div className="text-xs text-gray-600 mt-1">Characters Learned</div>
          <div className="text-xs text-gray-500 mt-1">{stats.completion}% Complete</div>
        </div>

        {/* Average Accuracy */}
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
          <div className="text-3xl font-bold text-green-600">{stats.avgAccuracy.toFixed(0)}%</div>
          <div className="text-xs text-gray-600 mt-1">Avg Accuracy</div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.avgAccuracy >= 70 ? '✓ Passing' : 'Keep practicing!'}
          </div>
        </div>

        {/* Weekly Velocity */}
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
          <div className="text-3xl font-bold text-purple-600">{stats.velocity}</div>
          <div className="text-xs text-gray-600 mt-1">Lessons This Week</div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.velocity > 0 ? '🔥 Active' : 'Start learning!'}
          </div>
        </div>

        {/* Study Time */}
        <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
          <div className="text-3xl font-bold text-amber-600">
            {stats.estimatedMinutes < 60
              ? stats.estimatedMinutes
              : (stats.estimatedMinutes / 60).toFixed(1)}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {stats.estimatedMinutes < 60 ? 'Minutes' : 'Hours'} Studied
          </div>
          <div className="text-xs text-gray-500 mt-1">{stats.totalGames} games played</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Overall Progress</span>
          <span className="font-bold">{stats.completion}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${stats.completion}%` }}
          />
        </div>
      </div>
    </div>
  );
}
