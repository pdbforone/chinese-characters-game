/**
 * Achievements Page
 *
 * Displays all achievements (locked and unlocked) in a grid layout.
 * Allows users to toggle achievements on/off.
 */

'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  getAllAchievements,
  getAchievementStats,
  toggleAchievements,
  areAchievementsEnabled,
  resetAchievements,
  type AchievementDef,
  type AchievementState,
} from '@/lib/achievements';

export default function AchievementsPage() {
  const [enabled, setEnabled] = useState(areAchievementsEnabled());
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const achievements = useMemo(() => getAllAchievements(), []);
  const stats = useMemo(() => getAchievementStats(), []);

  const handleToggle = () => {
    const newState = toggleAchievements();
    setEnabled(newState);
  };

  const handleReset = () => {
    resetAchievements();
    setShowResetConfirm(false);
    window.location.reload(); // Reload to reflect reset
  };

  // Group achievements by category
  const byCategory = useMemo(() => {
    const groups: Record<string, Array<AchievementDef & AchievementState>> = {
      mastery: [],
      progression: [],
      'spaced-repetition': [],
    };

    achievements.forEach((ach) => {
      groups[ach.category].push(ach);
    });

    return groups;
  }, [achievements]);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-block"
          >
            ← Back to Lessons
          </Link>

          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
            🏆 Achievements
          </h1>
          <p className="text-gray-600">Track your mastery milestones and learning progress.</p>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white shadow-xl mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Achievements</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Unlocked</p>
              <p className="text-3xl font-bold">{stats.unlocked}</p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Completion</p>
              <p className="text-3xl font-bold">{stats.percentComplete}%</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 bg-white/20 rounded-full h-3">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.percentComplete}%` }}
            />
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-2 border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-800">Achievement Notifications</h3>
              <p className="text-sm text-gray-600">
                {enabled
                  ? 'You will see achievement notifications when unlocked'
                  : 'Achievement tracking is disabled'}
              </p>
            </div>
            <button
              onClick={handleToggle}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                enabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              aria-label="Toggle achievements"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  enabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Reset Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Reset All Achievements
            </button>
          </div>
        </div>

        {/* Reset Confirmation */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Reset Achievements?</h3>
              <p className="text-gray-600 mb-6">
                This will permanently delete all your achievement progress. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Achievement Categories */}
        {Object.entries(byCategory).map(([category, achs]) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize flex items-center gap-2">
              {category === 'mastery' && '🎯'}
              {category === 'progression' && '📚'}
              {category === 'spaced-repetition' && '🧠'}
              <span>{category.replace('-', ' ')}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {achs.map((ach) => {
                const isUnlocked = ach.unlockedAt !== null;
                const hasProgress = (ach.maxProgress ?? 0) > 0;

                return (
                  <div
                    key={ach.id}
                    className={`rounded-lg p-5 border-2 transition-all ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 shadow-md'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    {/* Icon and Status */}
                    <div className="flex items-start justify-between mb-3">
                      <div className={`text-5xl ${isUnlocked ? '' : 'opacity-30 grayscale'}`}>
                        {ach.emoji}
                      </div>
                      {isUnlocked && (
                        <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          ✓ UNLOCKED
                        </div>
                      )}
                    </div>

                    {/* Name and Description */}
                    <h3
                      className={`font-bold mb-1 ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}
                    >
                      {ach.name}
                    </h3>
                    <p className={`text-sm mb-3 ${isUnlocked ? 'text-gray-700' : 'text-gray-400'}`}>
                      {ach.description}
                    </p>

                    {/* Progress Bar (if applicable) */}
                    {hasProgress && !isUnlocked && (
                      <div>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span className="font-bold">{ach.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${ach.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Unlock Date */}
                    {isUnlocked && ach.unlockedAt && (
                      <p className="text-xs text-gray-500 mt-3">
                        Unlocked {new Date(ach.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
