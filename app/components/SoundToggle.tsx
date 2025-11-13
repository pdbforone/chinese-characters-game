'use client';

import { useState } from 'react';
import { getSoundManager } from '@/lib/sounds';

export default function SoundToggle() {
  // Get initial mute state from sound manager using lazy initializer
  const [isMuted, setIsMuted] = useState(() => {
    const soundManager = getSoundManager();
    return soundManager.isSoundMuted();
  });

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
