import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CharacterIntroduction from '../CharacterIntroduction';
import { Character } from '@/lib/types';

// Mock characters for testing
const mockCharacters: Character[] = [
  {
    id: 1,
    character: '木',
    pinyin: 'mù',
    tone: 4,
    meaning: 'tree',
    story: 'A tree with branches and roots looks like the character 木',
    primitives: ['木'],
  },
  {
    id: 2,
    character: '林',
    pinyin: 'lín',
    tone: 2,
    meaning: 'forest',
    story: 'Two trees (木木) side by side make a forest',
    primitives: ['木', '木'],
  },
];

describe('CharacterIntroduction', () => {
  it('renders the first character correctly', () => {
    const onComplete = vi.fn();
    render(
      <CharacterIntroduction characters={mockCharacters} lessonNumber={1} onComplete={onComplete} />
    );

    // Check that the character is displayed (will appear in main display and primitives)
    const characters = screen.getAllByText('木');
    expect(characters.length).toBeGreaterThan(0);

    // Check that pinyin is displayed
    expect(screen.getByText('(mù)')).toBeInTheDocument();

    // Check that meaning is displayed
    expect(screen.getByText(/Meaning: tree/i)).toBeInTheDocument();

    // Check that story is displayed
    expect(screen.getByText(/A tree with branches and roots/i)).toBeInTheDocument();
  });

  it('displays tone ordinals correctly', () => {
    const onComplete = vi.fn();
    render(
      <CharacterIntroduction characters={mockCharacters} lessonNumber={1} onComplete={onComplete} />
    );

    // Should show "4th" for tone 4 (appears in tone display and label)
    expect(screen.getByText(/Tone: ↘ 4th/i)).toBeInTheDocument();
    expect(screen.getByText('4th tone (falling)')).toBeInTheDocument();
  });

  it('shows progress indicator', () => {
    const onComplete = vi.fn();
    render(
      <CharacterIntroduction characters={mockCharacters} lessonNumber={1} onComplete={onComplete} />
    );

    // Check progress text
    expect(screen.getByText('Character 1 of 2')).toBeInTheDocument();
  });

  it('displays lesson number in header', () => {
    const onComplete = vi.fn();
    render(
      <CharacterIntroduction characters={mockCharacters} lessonNumber={1} onComplete={onComplete} />
    );

    expect(screen.getByText(/RTH Lesson 1/i)).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    const onComplete = vi.fn();
    render(
      <CharacterIntroduction characters={mockCharacters} lessonNumber={1} onComplete={onComplete} />
    );

    // Previous button should be disabled on first character
    const previousButton = screen.getByRole('button', { name: /previous/i });
    expect(previousButton).toBeDisabled();

    // Next button should be enabled
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeEnabled();
  });

  it('shows skip to game option', () => {
    const onComplete = vi.fn();
    render(
      <CharacterIntroduction characters={mockCharacters} lessonNumber={1} onComplete={onComplete} />
    );

    expect(screen.getByText(/Skip Introduction & Start Game/i)).toBeInTheDocument();
  });
});
