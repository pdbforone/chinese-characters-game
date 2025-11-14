/**
 * Achievement Toast Component
 *
 * Displays subtle, non-intrusive achievement notifications.
 * Design principles from research:
 * - Bottom-right position (doesn't block main content)
 * - 3-second auto-dismiss (doesn't interrupt flow)
 * - Smooth animations (delight without distraction)
 * - ARIA announcements (accessibility)
 * - No modal dialogs (low friction)
 */

'use client';

import { useEffect } from 'react';
import type { AchievementDef, AchievementState } from '@/lib/achievements';

interface AchievementToastProps {
  achievement: (AchievementDef & AchievementState) | null;
  onClose: () => void;
}

export default function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  // Auto-dismiss after 3 seconds
  useEffect(() => {
    if (!achievement) return;

    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Achievement unlocked: ${achievement.name}`}
      className="fixed bottom-4 right-4 z-50 animate-slide-up"
    >
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-lg shadow-2xl p-4 max-w-sm border-2 border-amber-300">
        <div className="flex items-start gap-3">
          {/* Achievement Emoji */}
          <div className="text-4xl flex-shrink-0">{achievement.emoji}</div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wide opacity-90">
                Achievement Unlocked!
              </span>
            </div>
            <h3 className="text-lg font-bold mb-1">{achievement.name}</h3>
            <p className="text-sm opacity-90">{achievement.description}</p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Dismiss achievement notification"
            className="text-white/80 hover:text-white transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Progress indicator (for incremental achievements) */}
        {achievement.maxProgress && achievement.progress < 100 && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span className="font-bold">{achievement.progress}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${achievement.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
