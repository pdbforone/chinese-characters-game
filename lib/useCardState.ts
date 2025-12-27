/**
 * Shared Card State Utilities
 *
 * Encapsulates the common styling logic shared across all card components:
 * CharacterCard, StoryCard, PinyinCard, MeaningCard
 *
 * This eliminates ~80 lines of duplicated code per card (320 lines total).
 */

export interface CardState {
  isSelected: boolean;
  isMatched: boolean;
  isIncorrect: boolean;
}

export interface CardClassNames {
  border: string;
  background: string;
  animation: string;
}

/**
 * Derives Tailwind class names from card state.
 * Single source of truth for visual feedback styling.
 *
 * @param state - The current selection/match state of the card
 * @param options - Optional overrides for matched animation
 * @returns Object containing border, background, and animation class strings
 */
export function getCardClassNames(
  state: CardState,
  options: { showPulseOnMatch?: boolean } = {}
): CardClassNames {
  const { isSelected, isMatched, isIncorrect } = state;
  const { showPulseOnMatch = true } = options;

  if (isMatched) {
    return {
      border: 'border-2 border-green-500',
      background: showPulseOnMatch ? 'bg-green-50 animate-pulse-green' : 'bg-green-50',
      animation: '',
    };
  }

  if (isIncorrect) {
    return {
      border: 'border-2 border-red-500',
      background: 'bg-red-50',
      animation: 'animate-shake',
    };
  }

  if (isSelected) {
    return {
      border: 'border-2 border-blue-500',
      background: 'bg-blue-50',
      animation: '',
    };
  }

  // Default (unselected) state
  return {
    border: 'border-2 border-gray-300',
    background: 'bg-white hover:bg-gray-50',
    animation: '',
  };
}

/**
 * Builds the complete className string for a card.
 *
 * @param classNames - The derived class names from getCardClassNames
 * @param isMatched - Whether the card is matched (affects opacity/cursor)
 * @param additionalClasses - Any additional Tailwind classes to include
 * @returns Complete className string ready for use on the card element
 */
export function buildCardClassName(
  classNames: CardClassNames,
  isMatched: boolean,
  additionalClasses: string = ''
): string {
  const baseClasses = `
    ${classNames.border}
    ${classNames.background}
    ${classNames.animation}
    rounded-lg cursor-pointer
    transition-all duration-200
    ${isMatched ? 'opacity-50 cursor-not-allowed' : ''}
    flex flex-col items-center justify-center
    focus:outline-none focus:ring-4 focus:ring-blue-300
    ${additionalClasses}
  `.trim();

  // Clean up extra whitespace
  return baseClasses.replace(/\s+/g, ' ');
}

/**
 * Keyboard event handler for card interaction.
 * Activates on Enter or Space, respecting matched state.
 *
 * @param onClick - The click handler to invoke
 * @param isMatched - Whether the card is already matched
 * @returns Event handler function for onKeyDown
 */
export function createCardKeyHandler(
  onClick: () => void,
  isMatched: boolean
): (e: React.KeyboardEvent) => void {
  return (e: React.KeyboardEvent) => {
    if (!isMatched && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };
}
