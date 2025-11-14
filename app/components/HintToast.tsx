'use client';

import { useEffect } from 'react';

interface HintToastProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export default function HintToast({ show, message, onClose }: HintToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 4000); // Auto-dismiss after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg shadow-2xl p-4 max-w-md border-2 border-amber-600">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div className="flex-1">
            <p className="font-semibold mb-1">Hint:</p>
            <p className="text-sm leading-relaxed">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-amber-100 transition-colors"
            aria-label="Close hint"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
