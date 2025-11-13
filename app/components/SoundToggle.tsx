'use client';

import { useState, useEffect } from 'react';
import { getSoundManager } from '@/lib/sounds';

export default function SoundToggle() {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Get initial mute state from sound manager
    const soundManager = getSoundManager();
    setIsMuted(soundManager.isSoundMuted());
  }, []);

  const toggleMute = () => {
    const soundManager = getSoundManager();
    const newMutedState = !isMuted;
    soundManager.setMuted(newMutedState);
    setIsMuted(newMutedState);

    // Play a sound when unmuting so user knows it works
    if (!newMutedState) {
      soundManager.playClickSound();
    }
  };

  return (
    <button
      onClick={toggleMute}
      className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2 transition-colors"
      aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
      title={isMuted ? 'Sounds off - Click to enable' : 'Sounds on - Click to disable'}
    >
      <span className="text-xl">{isMuted ? '🔇' : '🔊'}</span>
      <span className="text-sm hidden sm:inline">{isMuted ? 'Sound Off' : 'Sound On'}</span>
    </button>
  );
}
