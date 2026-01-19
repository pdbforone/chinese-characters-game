'use client';

import { lessonSupportsMastery } from '@/lib/storage';

interface MasteryGateProps {
  lessonNumber: number;
  coreAccuracy: number;
  onContinueToMastery: () => void;
  onExitToLessons: () => void;
  onNextLesson?: () => void;
}

/**
 * MasteryGate - The "Continue to Mastery?" modal
 *
 * Shown after completing core rounds (1-4) with 70%+ accuracy.
 * Offers the user a choice:
 * - Continue to Mastery tier (Story Mason + Story Detective)
 * - Exit to lesson selection
 * - Go to next lesson (if available)
 */
export default function MasteryGate({
  lessonNumber,
  coreAccuracy,
  onContinueToMastery,
  onExitToLessons,
  onNextLesson,
}: MasteryGateProps) {
  const supportsMastery = lessonSupportsMastery(lessonNumber);
  const accuracyPercent = Math.round(coreAccuracy * 100);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header - Silver completion celebration */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 text-center">
          <div className="text-6xl mb-3">●</div>
          <h2 className="text-2xl font-bold text-gray-800">Lesson Complete!</h2>
          <p className="text-gray-600 mt-1">
            You scored <span className="font-bold text-gray-800">{accuracyPercent}%</span> accuracy
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {supportsMastery ? (
            <>
              {/* Mastery Tier Pitch */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">★</div>
                  <div>
                    <h3 className="font-bold text-amber-800 mb-1">Master This Lesson?</h3>
                    <p className="text-sm text-amber-700 leading-relaxed">
                      Go deeper with <strong>Story Mason</strong> (rebuild the narrative) and{' '}
                      <strong>Story Detective</strong> (produce characters from context).
                    </p>
                    <p className="text-xs text-amber-600 mt-2">~3-5 minutes • Earn Gold status</p>
                  </div>
                </div>
              </div>

              {/* Primary CTA - Continue to Mastery */}
              <button
                onClick={onContinueToMastery}
                className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl mb-3"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>★</span>
                  <span>Continue to Mastery</span>
                </span>
              </button>
            </>
          ) : (
            /* Lesson doesn't support mastery yet */
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="text-2xl">📚</div>
                <div>
                  <h3 className="font-bold text-blue-800 mb-1">Great Progress!</h3>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    You&apos;ve completed the core rounds. Mastery tier is available for lessons
                    9-15.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Secondary actions */}
          <div className="flex gap-3">
            {onNextLesson && (
              <button
                onClick={onNextLesson}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                Next Lesson →
              </button>
            )}
            <button
              onClick={onExitToLessons}
              className={`${onNextLesson ? 'flex-1' : 'w-full'} bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors`}
            >
              Back to Lessons
            </button>
          </div>

          {/* Skip hint for mastery-supported lessons */}
          {supportsMastery && (
            <p className="text-center text-xs text-gray-500 mt-4">
              You can return to master this lesson anytime from the lesson menu.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
