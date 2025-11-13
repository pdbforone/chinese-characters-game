'use client';

interface ReturnUserModalProps {
  lessonNumber: number;
  bestScore: number;
  bestAccuracy: number;
  gamesPlayed: number;
  onReview: () => void;
  onStartGame: () => void;
}

export default function ReturnUserModal({
  lessonNumber,
  bestScore: _bestScore,
  bestAccuracy,
  gamesPlayed,
  onReview,
  onStartGame,
}: ReturnUserModalProps) {
  const getStarRating = (accuracy: number): string => {
    if (accuracy >= 90) return '⭐⭐⭐';
    if (accuracy >= 80) return '⭐⭐';
    if (accuracy >= 60) return '⭐';
    return '—';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
          <p className="text-gray-600">Lesson {lessonNumber}</p>
        </div>

        {/* Stats Display */}
        {gamesPlayed > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">
              Your Best Performance
            </h3>
            <div className="flex justify-around items-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {getStarRating(bestAccuracy)}
                </div>
                <div className="text-xs text-gray-600">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{bestAccuracy.toFixed(0)}%</div>
                <div className="text-xs text-gray-600">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{gamesPlayed}</div>
                <div className="text-xs text-gray-600">Games</div>
              </div>
            </div>
          </div>
        )}

        {/* Options */}
        <div className="space-y-3 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 text-center mb-4">
            What would you like to do?
          </h3>

          <button
            onClick={onReview}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3"
          >
            <span className="text-2xl">📖</span>
            <div className="text-left">
              <div className="font-bold">Review Characters</div>
              <div className="text-sm text-amber-100">Go through the introduction again</div>
            </div>
          </button>

          <button
            onClick={onStartGame}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3"
          >
            <span className="text-2xl">🎮</span>
            <div className="text-left">
              <div className="font-bold">Start Matching Game</div>
              <div className="text-sm text-blue-100">Jump straight to the challenge</div>
            </div>
          </button>
        </div>

        {/* Helpful Tip */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            💡 Tip: Review helps reinforce memory before testing
          </p>
        </div>
      </div>
    </div>
  );
}
