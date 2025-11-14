'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { getAllLessonsMetadata } from '@/lib/lessonLoader';
import { getLessonProgress, type LessonProgress } from '@/lib/storage';
import { getMasteryStats } from '@/lib/spacedRepetition';
import UserStatsPanel from './components/UserStatsPanel';

export default function Home() {
  const lessons = getAllLessonsMetadata();

  // Load progress for all lessons
  const lessonProgress = useMemo(() => {
    const progress: Record<number, LessonProgress> = {};
    lessons.forEach((lesson) => {
      progress[lesson.lessonNumber] = getLessonProgress(lesson.lessonNumber);
    });
    return progress;
  }, [lessons]);

  // Load spaced repetition statistics
  const masteryStats = useMemo(() => getMasteryStats(), []);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-4">
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              汉字 Learning Game
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Master <span className="font-bold text-indigo-600">3,035</span> Traditional Chinese
            Characters through story-based memory and progressive difficulty
          </p>
          <Link
            href="/achievements"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-800 font-semibold transition-colors"
          >
            🏆 View Achievements
          </Link>
        </header>

        {/* User Stats Panel */}
        <UserStatsPanel />

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="text-4xl">📚</div>
              <div>
                <p className="text-sm opacity-90">Total Lessons</p>
                <p className="text-2xl font-bold">{lessons.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="text-4xl">📝</div>
              <div>
                <p className="text-sm opacity-90">Total Characters</p>
                <p className="text-2xl font-bold">
                  {lessons.reduce((sum, l) => sum + l.characterCount, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🎯</div>
              <div>
                <p className="text-sm opacity-90">4 Difficulty Rounds</p>
                <p className="text-2xl font-bold">Progressive</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🧠</div>
              <div>
                <p className="text-sm opacity-90">Spaced Repetition</p>
                <p className="text-2xl font-bold">
                  {masteryStats.dueToday > 0 ? `${masteryStats.dueToday} Due` : 'Active'}
                </p>
                {masteryStats.totalLearned > 0 && (
                  <p className="text-xs opacity-80 mt-1">
                    {masteryStats.totalLearned} learned • Ease: {masteryStats.averageEaseFactor}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-blue-100">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <span>🎮</span> How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-indigo-600 mb-2">📖 Study Phase</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Learn characters one-by-one with vivid mnemonic stories. Each story connects the
                visual form to meaning and pronunciation using memorable imagery.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-indigo-600 mb-2">🎯 4 Progressive Rounds</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">1.</span>
                  <span>Story → Character (with hints)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">2.</span>
                  <span>Character → Story (pinyin only)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">3.</span>
                  <span>Meaning → Character (no hints)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">4.</span>
                  <span>Character → Pinyin (pure recall)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pinyin Primer & Prerequisite Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border-2 border-blue-200">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-4xl">🗣️</div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-2 text-xl">New to Pinyin?</h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                Pinyin is the romanization system for Chinese pronunciation. Each character includes
                tone marks (ā, á, ǎ, à) that indicate how to pronounce it.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div className="bg-white rounded-lg p-2 border border-blue-200">
                  <div className="font-bold text-blue-600 mb-1">1st Tone →</div>
                  <div className="text-gray-600">High & flat (mā)</div>
                </div>
                <div className="bg-white rounded-lg p-2 border border-green-200">
                  <div className="font-bold text-green-600 mb-1">2nd Tone ↗</div>
                  <div className="text-gray-600">Rising (má)</div>
                </div>
                <div className="bg-white rounded-lg p-2 border border-orange-200">
                  <div className="font-bold text-orange-600 mb-1">3rd Tone ↘↗</div>
                  <div className="text-gray-600">Dipping (mǎ)</div>
                </div>
                <div className="bg-white rounded-lg p-2 border border-red-200">
                  <div className="font-bold text-red-600 mb-1">4th Tone ↘</div>
                  <div className="text-gray-600">Falling (mà)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Prerequisite Notice */}
          <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-300">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚠️</div>
              <div>
                <h4 className="font-bold text-amber-900 mb-1">Prerequisites</h4>
                <p className="text-sm text-amber-800 leading-relaxed">
                  This game assumes you already know basic pinyin pronunciation rules. While we
                  provide tone marks and romanization, you&apos;ll need familiarity with pinyin
                  sounds and tone patterns to practice pronunciation effectively. If you&apos;re
                  completely new to Chinese, we recommend learning pinyin basics first through a
                  dedicated pronunciation course.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose Your Lesson</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {lessons.map((lesson) => {
            const progress = lessonProgress[lesson.lessonNumber];
            const completionPercentage = progress?.bestAccuracy
              ? Math.round(progress.bestAccuracy * 100)
              : 0;
            const isStarted = progress?.gamesPlayed > 0 || progress?.introductionCompleted;

            return (
              <Link key={lesson.lessonNumber} href={`/lesson/${lesson.lessonNumber}`}>
                <div className="group relative bg-white rounded-xl p-5 shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-indigo-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -mr-12 -mt-12 opacity-50 group-hover:opacity-100 transition-opacity" />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Lesson number */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                          {lesson.lessonNumber}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">Lesson {lesson.lessonNumber}</p>
                          <p className="text-xs text-gray-500">{lesson.characterCount} chars</p>
                        </div>
                      </div>

                      {/* Status badge */}
                      {isStarted && (
                        <div className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          {completionPercentage}%
                        </div>
                      )}
                    </div>

                    {/* Characters preview */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-3 min-h-[60px] flex items-center justify-center">
                      <p className="text-2xl font-serif text-gray-800 tracking-wider">
                        {lesson.characters.split(', ').slice(0, 4).join(' ')}
                      </p>
                    </div>

                    {/* Progress bar */}
                    {isStarted && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Progress</span>
                          <span className="font-semibold">{completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-400 to-green-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          {progress.gamesPlayed} game{progress.gamesPlayed !== 1 ? 's' : ''} played
                        </p>
                      </div>
                    )}

                    {/* Call to action */}
                    {!isStarted && (
                      <div className="text-center">
                        <span className="text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
                          Start Learning →
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer tip */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border-2 border-amber-200">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Pro Tip</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Each story uses vivid imagery and sound patterns to help you remember. Read
                carefully, visualize the scene, and the characters will stick! Studies show
                story-based memory is{' '}
                <span className="font-bold text-amber-700">10x more effective</span> than rote
                memorization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
