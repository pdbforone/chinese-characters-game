'use client';

import { useState, useEffect } from 'react';
import { Character, GameStats } from '@/lib/types';
import StoryCard from './StoryCard';
import CharacterCard from './CharacterCard';
import ProgressBar from './ProgressBar';

interface GameBoardProps {
  characters: Character[];
  lesson: number;
  round: number;
}

export default function GameBoard({ characters, lesson, round }: GameBoardProps) {
  const [selectedStory, setSelectedStory] = useState<number | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [incorrect, setIncorrect] = useState<number | null>(null);
  const [gameStats, setGameStats] = useState<GameStats>({
    totalAttempts: 0,
    correctMatches: 0,
    accuracy: 0
  });
  const [showCompletion, setShowCompletion] = useState(false);

  // Shuffle characters for display (but keep stories in order)
  const [shuffledCharacters, setShuffledCharacters] = useState<Character[]>([]);

  useEffect(() => {
    // Shuffle characters for the right column
    const shuffled = [...characters].sort(() => Math.random() - 0.5);
    setShuffledCharacters(shuffled);
  }, [characters]);

  const handleStoryClick = (id: number) => {
    if (matched.has(id)) return;
    setSelectedStory(id);
    setIncorrect(null);

    // If character already selected, check match
    if (selectedCharacter !== null) {
      checkMatch(id, selectedCharacter);
    }
  };

  const handleCharacterClick = (id: number) => {
    if (matched.has(id)) return;
    setSelectedCharacter(id);
    setIncorrect(null);

    // If story already selected, check match
    if (selectedStory !== null) {
      checkMatch(selectedStory, id);
    }
  };

  const checkMatch = (storyId: number, characterId: number) => {
    const newAttempts = gameStats.totalAttempts + 1;

    if (storyId === characterId) {
      // Correct match!
      const newMatched = new Set(matched);
      newMatched.add(storyId);
      setMatched(newMatched);
      setSelectedStory(null);
      setSelectedCharacter(null);

      const newCorrect = gameStats.correctMatches + 1;
      const newAccuracy = (newCorrect / newAttempts) * 100;

      setGameStats({
        totalAttempts: newAttempts,
        correctMatches: newCorrect,
        accuracy: newAccuracy
      });

      // Check if game is complete
      if (newMatched.size === characters.length) {
        setTimeout(() => setShowCompletion(true), 500);
      }
    } else {
      // Incorrect match
      setIncorrect(characterId);
      setGameStats({
        ...gameStats,
        totalAttempts: newAttempts,
        accuracy: (gameStats.correctMatches / newAttempts) * 100
      });

      // Reset after animation
      setTimeout(() => {
        setSelectedStory(null);
        setSelectedCharacter(null);
        setIncorrect(null);
      }, 600);
    }
  };

  const getStarRating = (accuracy: number): string => {
    if (accuracy >= 90) return '⭐⭐⭐ Gold';
    if (accuracy >= 80) return '⭐⭐ Silver';
    if (accuracy >= 60) return '⭐ Bronze';
    return 'Try Again';
  };

  const resetGame = () => {
    setSelectedStory(null);
    setSelectedCharacter(null);
    setMatched(new Set());
    setIncorrect(null);
    setGameStats({
      totalAttempts: 0,
      correctMatches: 0,
      accuracy: 0
    });
    setShowCompletion(false);
    // Re-shuffle characters
    const shuffled = [...characters].sort(() => Math.random() - 0.5);
    setShuffledCharacters(shuffled);
  };

  if (shuffledCharacters.length === 0) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <ProgressBar
        current={matched.size}
        total={characters.length}
        lesson={lesson}
        round={round}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Stories Column */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center md:text-left">
            Mnemonic Stories
          </h3>
          {characters.map((char) => (
            <StoryCard
              key={`story-${char.id}`}
              character={char}
              isSelected={selectedStory === char.id}
              isMatched={matched.has(char.id)}
              isIncorrect={false}
              onClick={() => handleStoryClick(char.id)}
            />
          ))}
        </div>

        {/* Characters Column */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center md:text-left">
            Characters
          </h3>
          {shuffledCharacters.map((char) => (
            <CharacterCard
              key={`char-${char.id}`}
              character={char}
              isSelected={selectedCharacter === char.id}
              isMatched={matched.has(char.id)}
              isIncorrect={incorrect === char.id}
              onClick={() => handleCharacterClick(char.id)}
            />
          ))}
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
              🎉 Round Complete! 🎉
            </h2>
            <div className="space-y-4 text-center">
              <div className="text-5xl mb-4">
                {getStarRating(gameStats.accuracy)}
              </div>
              <div className="text-xl">
                <p className="text-gray-700">
                  Accuracy: <span className="font-bold text-blue-600">
                    {gameStats.accuracy.toFixed(1)}%
                  </span>
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  {gameStats.correctMatches} correct out of {gameStats.totalAttempts} attempts
                </p>
              </div>
              <div className="pt-4 space-y-3">
                <button
                  onClick={resetGame}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Play Again
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Back to Lessons
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
