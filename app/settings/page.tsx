/**
 * Settings Page
 *
 * Provides user controls for:
 * - Data export/import (cross-device sync without servers)
 * - Sound preferences
 * - Achievement preferences
 * - Data reset options
 */

'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { downloadBackup, importFromFile } from '@/lib/dataExport';
import { isSoundEnabled, toggleSound } from '@/lib/audio';
import { areAchievementsEnabled, toggleAchievements } from '@/lib/achievements';

export default function SettingsPage() {
  const [soundEnabled, setSoundEnabled] = useState(isSoundEnabled());
  const [achievementsEnabled, setAchievementsEnabled] = useState(areAchievementsEnabled());
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundEnabled(newState);
  };

  const handleAchievementsToggle = () => {
    const newState = toggleAchievements();
    setAchievementsEnabled(newState);
  };

  const handleExport = () => {
    try {
      downloadBackup();
      // Show success feedback
      setImportStatus('success');
      setImportMessage('Backup downloaded successfully!');
      setTimeout(() => setImportStatus('idle'), 3000);
    } catch (error) {
      setImportStatus('error');
      setImportMessage(error instanceof Error ? error.message : 'Export failed');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importFromFile(file);
      setImportStatus('success');
      setImportMessage('Data imported successfully! Reloading...');
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      setImportStatus('error');
      setImportMessage(error instanceof Error ? error.message : 'Import failed');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleResetData = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-block"
          >
            ← Back to Home
          </Link>

          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ⚙️ Settings
          </h1>
          <p className="text-gray-600">Manage your learning preferences and data.</p>
        </div>

        {/* Status Messages */}
        {importStatus !== 'idle' && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              importStatus === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
            role="alert"
          >
            {importMessage}
          </div>
        )}

        {/* Data Backup & Sync */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>💾</span> Data Backup & Sync
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Export your progress to sync across devices. No account needed—your data stays with you!
          </p>

          <div className="space-y-4">
            {/* Export */}
            <div className="border-2 border-blue-100 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Export Data</h3>
              <p className="text-sm text-gray-600 mb-3">
                Download all your progress, achievements, and settings as a backup file.
              </p>
              <button
                onClick={handleExport}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Backup
              </button>
            </div>

            {/* Import */}
            <div className="border-2 border-green-100 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Import Data</h3>
              <p className="text-sm text-gray-600 mb-3">
                Restore your progress from a backup file. This will replace your current data.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={handleImportClick}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Import Backup
              </button>
            </div>
          </div>
        </div>

        {/* App Preferences */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🎛️</span> Preferences
          </h2>

          <div className="space-y-4">
            {/* Sound Toggle */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h3 className="font-semibold text-gray-800">Sound Effects & Audio</h3>
                <p className="text-sm text-gray-600">Play pronunciation audio and sound effects</p>
              </div>
              <button
                onClick={handleSoundToggle}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  soundEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label="Toggle sound"
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    soundEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Achievements Toggle */}
            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="font-semibold text-gray-800">Achievement Notifications</h3>
                <p className="text-sm text-gray-600">Show achievement unlock notifications</p>
              </div>
              <button
                onClick={handleAchievementsToggle}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  achievementsEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label="Toggle achievements"
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    achievementsEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 rounded-lg border-2 border-red-200 p-6">
          <h2 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
            <span>⚠️</span> Danger Zone
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Reset All Data</h3>
              <p className="text-sm text-gray-600 mb-3">
                Permanently delete all your progress, achievements, and settings. This cannot be
                undone.
              </p>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Reset All Data
              </button>
            </div>
          </div>
        </div>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md">
              <h3 className="text-xl font-bold text-gray-800 mb-2">⚠️ Confirm Reset</h3>
              <p className="text-gray-600 mb-6">
                This will permanently delete ALL your data:
                <ul className="list-disc list-inside mt-2 text-sm">
                  <li>All lesson progress</li>
                  <li>All spaced repetition data</li>
                  <li>All achievements</li>
                  <li>All settings</li>
                </ul>
                <br />
                <strong>This action cannot be undone.</strong> Consider exporting a backup first.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetData}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Delete Everything
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700">
            <strong>💡 Tip:</strong> Export your data regularly to keep a backup. Your data is
            stored locally on this device—if you clear your browser data or use a different device,
            you&apos;ll need to import your backup.
          </p>
        </div>
      </div>
    </div>
  );
}
