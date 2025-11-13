'use client';

import { useMemo } from 'react';
import { getUserStats, getUserLevel } from '@/lib/userStats';

export default function UserStatsPanel() {
  const stats = useMemo(() => getUserStats(), []);
  const level = useMemo(() => getUserLevel(), []);

  const progressPercentage = (level.xpInLevel / level.xpForNextLevel) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-indigo-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Level & XP */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {level.level}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Level</p>
              <p className="text-2xl font-bold text-gray-800">{level.level}</p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>{level.xpInLevel} XP</span>
              <span>{level.xpForNextLevel} XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              {Math.round(progressPercentage)}% to next level
            </p>
          </div>
        </div>

        {/* Streak */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg ${
                stats.currentStreak > 0
                  ? 'bg-gradient-to-br from-orange-400 to-red-500 animate-pulse'
                  : 'bg-gray-200'
              }`}
            >
              🔥
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Streak</p>
              <p className="text-2xl font-bold text-gray-800">{stats.currentStreak} days</p>
            </div>
          </div>

          <div className="text-xs text-gray-600">
            <p>
              <span className="font-semibold">Longest:</span> {stats.longestStreak} days
            </p>
            <p className="mt-1">
              <span className="font-semibold">Last study:</span>{' '}
              {new Date(stats.lastStudyDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="space-y-2">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
            <p className="text-xs font-semibold text-gray-500 uppercase">Characters Learned</p>
            <p className="text-2xl font-bold text-indigo-600">{stats.charactersLearned}</p>
            <p className="text-xs text-gray-600">of 3,035 total</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-50 rounded-lg p-2 border border-green-100">
              <p className="text-xs font-semibold text-gray-500">Perfect</p>
              <p className="text-lg font-bold text-green-600">{stats.perfectGames}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-2 border border-purple-100">
              <p className="text-xs font-semibold text-gray-500">Lessons</p>
              <p className="text-lg font-bold text-purple-600">{stats.lessonsCompleted}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement badges */}
      {stats.achievements.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Recent Achievements
          </p>
          <div className="flex flex-wrap gap-2">
            {stats.achievements.slice(-5).map((achievement) => (
              <div
                key={achievement}
                className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1"
              >
                <span className="text-lg">🏆</span>
                <span className="text-xs font-semibold text-yellow-800">
                  {achievement.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
