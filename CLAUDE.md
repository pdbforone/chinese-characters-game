# CLAUDE.md — The Foundation of Excellence

> _"Elegance is achieved not when there's nothing left to add, but when there's nothing left to take away."_
> — Antoine de Saint-Exupéry

This document is the **philosophical foundation** of the Chinese Characters Learning Game. It articulates the vision, principles, and patterns that guide every line of code. If you're building on this project—whether human or AI—read this first.

---

## Table of Contents

1. [Vision & Purpose](#vision--purpose)
2. [Core Principles](#core-principles)
3. [Architecture Philosophy](#architecture-philosophy)
4. [Pedagogical Design](#pedagogical-design)
5. [Code Patterns & Conventions](#code-patterns--conventions)
6. [Testing & Quality Philosophy](#testing--quality-philosophy)
7. [Accessibility & Inclusivity](#accessibility--inclusivity)
8. [Performance & Optimization](#performance--optimization)
9. [Data Integrity](#data-integrity)
10. [AI Collaboration Guidelines](#ai-collaboration-guidelines)
11. [Lesson Enhancement Workflow](#lesson-enhancement-workflow)
12. [Image Upload Instructions](#image-upload-instructions)
13. [Project Status](#project-status)

---

## Vision & Purpose

### What We're Building

This is not just a flashcard app. It's a **cognitive architecture** for learning Chinese characters through the power of story-based memory encoding.

We implement an original mnemonic methodology created by **Paul David Burton** (PaulDavidBurton@gmail.com), building upon foundational concepts from _Remembering Traditional Hanzi_ by James W. Heisig and Timothy W. Richardson. The human brain remembers stories better than abstract shapes. Each of the 3,035 traditional Chinese characters is encoded with:

- A **vivid mnemonic story** that connects visual primitives to meaning and pronunciation
- **Tone-based onomatopoeia** using English sound-alikes that encode both pinyin pronunciation and tonal patterns
- **Progressive difficulty testing** through 4 rounds that mirror how memory consolidates
- **Immediate feedback loops** that reinforce correct associations and gently correct errors

### The Innovation

The **mnemonic system and tone-onomatopoeia methodology** is the original work of Paul David Burton. The specific character stories implementing this system were AI-generated following his methodology. This is a **work in progress**, with stories and methodology continuing to evolve.

Instead of memorizing abstract pronunciations, learners encode sounds through vivid English onomatopoeia that mirrors the Chinese tone:

- **Tone 1 (flat):** "Yeeee!" for 一 (yī) — sustained, high pitch
- **Tone 2 (rising):** "Why ten?" for 十 (shí) — questioning, upward inflection
- **Tone 3 (dipping):** "Woo" for 五 (wǔ) — low, curved sound
- **Tone 4 (falling):** "ERR!" for 二 (èr) — sharp, downward command

This dual-encoding (visual story + phonetic onomatopoeia) creates stronger memory traces than either approach alone.

### Why This Matters

Learning Chinese characters is often taught as rote memorization. Students trace shapes thousands of times without understanding _why_ a character means what it means.

This method transforms learning:

- **From:** "This shape means 'tree' because I memorized it"
- **To:** "This shape means 'tree' because it _looks_ like a tree, and the story connects it to the sound 'mù' through vivid onomatopoeia"

We're not building software to replace teachers. We're building software to **amplify human memory** through thoughtful pedagogy.

**Acknowledgment:** The mnemonic methodology, story system structure, and tone-encoding innovations are the original work of **Paul David Burton**. Character stories were AI-generated using his system. This work builds upon the story-based foundation of _Remembering Traditional Hanzi_ by James W. Heisig and Timothy W. Richardson.

**Contact:** For questions about the methodology, reach Paul David Burton at PaulDavidBurton@gmail.com

---

## Core Principles

These are **non-negotiable**. Every feature, every line of code, every decision must honor these principles:

### 1. **Pedagogy First, Technology Second**

The learning experience drives the architecture, not the other way around.

- **Example:** We use 4 characters per page because cognitive load research shows humans can hold 3-5 items in working memory. Not because it's easier to code.
- **Example:** The 70% accuracy threshold exists because learners need partial mastery before advancing. Not because it's a round number.

### 2. **Privacy as Default**

Users should never wonder: "Where is my data going?"

- **All data stays local:** `localStorage` only, no backend, no analytics by default
- **Works offline:** No network requests for core functionality
- **No tracking:** No user IDs, no session tracking, no third-party scripts

### 3. **Low Friction, High Engagement**

Every interaction should feel effortless.

- **Keyboard navigation everywhere:** Arrow keys, Enter, Escape—power users should never need a mouse
- **Immediate feedback:** Sound and visual cues within 100ms of user action
- **No sign-up walls:** Open the app, start learning in <5 seconds

### 4. **Progressive Disclosure**

Show only what's needed, when it's needed.

- **Introduction phase:** Full context (story, meaning, pinyin, tone)
- **Round 1:** Stories + hints (building confidence)
- **Round 2:** Partial hints (testing recall)
- **Round 3-4:** No hints (pure mastery)

### 5. **Fail Gracefully**

Errors should never break the learning experience.

- **localStorage unavailable?** Continue with in-memory state
- **Lesson data missing?** Show friendly error, suggest lesson 1
- **Sound fails?** Disable audio but keep visual feedback

### 6. **Code as Craft**

Every function, every component, every abstraction should feel _inevitable_.

- **Naming is precise:** `getToneInfo()` not `processTone()` — names describe _what_, not _how_
- **No magic numbers:** `const ACCURACY_THRESHOLD = 0.7` not `if (score > 0.7)`
- **Single Responsibility:** Components do one thing exceptionally well

---

## Architecture Philosophy

### Why Next.js?

We chose **Next.js 15+ (React 19)** because:

1. **Server Components:** Pre-render lesson lists for instant page loads
2. **File-based routing:** `/lesson/[id]/page.tsx` is self-documenting
3. **Built-in optimization:** Image optimization, font optimization, code splitting
4. **TypeScript-first:** Type safety is foundational, not optional
5. **Modern React:** We use React 19 features (hooks, concurrent rendering) for smooth UX

### Why Static JSON Data?

We could use a database. We chose **static JSON files** (`lib/data/lesson1.json` ... `lesson112.json`) because:

1. **Simplicity:** No database setup, migrations, or connection pooling
2. **Auditability:** Every character's story is version-controlled in Git
3. **Performance:** No database queries—data is bundled at build time
4. **Offline-first:** No network dependency for core functionality
5. **Contributor-friendly:** Anyone can edit lesson data without SQL knowledge

**Trade-off:** Bundle size grows with 112 lessons. Future optimization: lazy-load lessons on demand.

### Why `localStorage`?

We could use cookies or a backend. We chose **`localStorage`** for progress tracking because:

1. **Privacy:** Data never leaves the user's device
2. **Simplicity:** No authentication, no user accounts, no GDPR concerns
3. **Persistence:** Survives page refreshes and browser restarts
4. **Familiar API:** `getItem()` / `setItem()` is universally understood

**Trade-off:** Data is device-specific (doesn't sync across devices). Future: optional cloud sync.

### Why Tailwind CSS?

We chose **Tailwind CSS** because:

1. **Utility-first:** Compose styles without naming fatigue
2. **Consistency:** Design tokens (colors, spacing) enforced through config
3. **Performance:** PurgeCSS removes unused styles automatically
4. **Responsive by default:** Mobile-first breakpoints (`md:`, `lg:`) are standard
5. **Readability:** Class names describe _what_ they do (`text-center`, `flex`, `gap-4`)

---

## Pedagogical Design

### The 4-Round Learning Progression

This is the **heart** of the application. The sequence is carefully designed to match how memory works:

#### **Round 1: Story → Character** (Recognition + Full Context)

- **Left side:** Mnemonic stories
- **Right side:** Characters with pinyin + meaning hints
- **Cognitive load:** Low (all information visible)
- **Goal:** Build initial associations between story and visual form

#### **Round 2: Character → Story** (Recall + Partial Context)

- **Left side:** Characters with pinyin only
- **Right side:** Scrambled stories
- **Cognitive load:** Medium (must recall meaning from pinyin)
- **Goal:** Test if learner can recognize character and remember its story

#### **Round 3: Meaning → Character** (Pure Visual Recall)

- **Left side:** English meanings
- **Right side:** Characters (no hints)
- **Cognitive load:** High (must produce visual form from meaning)
- **Goal:** Test if learner can map meaning → character without scaffolding

#### **Round 4: Character → Pinyin** (Pronunciation Mastery)

- **Left side:** Characters
- **Right side:** Pinyin romanization
- **Cognitive load:** High (must recall pronunciation)
- **Goal:** Test if learner has internalized sound-to-form association

### Why 70% Accuracy?

Research on mastery learning suggests:

- **<60%:** Not enough retention—learner is guessing
- **70-80%:** Sweet spot—learner has partial mastery, ready for next challenge
- **>90%:** May be over-rehearsed—learner could advance sooner

We chose **70%** as the threshold to balance:

- **Confidence:** Learner feels successful (not frustrated)
- **Challenge:** Still room to improve (not bored)
- **Efficiency:** Don't over-drill what's already learned

### Why 4 Characters Per Page?

Cognitive psychology research (Miller's Law, Cowan's research) shows:

- **Working memory capacity:** ~3-5 items
- **Chunking:** Breaking content into small groups improves retention
- **Fatigue prevention:** Small pages = frequent wins = sustained motivation

**4 characters per page** balances:

- **Cognitive load:** Manageable for beginners
- **Progress visibility:** Frequent page transitions = sense of momentum
- **Engagement:** Short feedback loops keep users in flow state

---

## Code Patterns & Conventions

### File Structure

```
/app
├── page.tsx                      # Home: Lesson selection grid
├── /lesson/[id]/page.tsx         # Lesson orchestrator (introduction → game)
├── /components/
│   ├── CharacterIntroduction.tsx # Study phase (card-by-card)
│   ├── MultiRoundGame.tsx        # Game orchestrator (4 rounds)
│   ├── GameBoard.tsx             # Matching game engine
│   ├── CharacterCard.tsx         # Reusable character display
│   ├── StoryCard.tsx             # Story display
│   ├── PinyinCard.tsx            # Pinyin display
│   ├── MeaningCard.tsx           # Meaning display
│   ├── ReturnUserModal.tsx       # Returning user experience
│   ├── ProgressBar.tsx           # Visual progress indicator
│   └── SoundToggle.tsx           # Audio control
/lib
├── types.ts                      # TypeScript interfaces
├── lessonLoader.ts               # Lesson data management
├── storage.ts                    # localStorage abstraction
└── sounds.ts                     # Web Audio API manager
/lib/data
├── lesson1.json ... lesson112.json  # Character data (3,035 total)
```

### TypeScript Conventions

1. **Interfaces over Types** (for data models)

   ```typescript
   // ✅ Good
   export interface Character {
     id: number;
     character: string;
     pinyin: string;
     tone: number;
     meaning: string;
     story: string;
     primitives: string[];
   }

   // ❌ Avoid
   export type Character = {
     id: number;
     // ...
   };
   ```

2. **Explicit return types on exported functions**

   ```typescript
   // ✅ Good
   export function getLessonProgress(lessonId: number): LessonProgress {
     // ...
   }

   // ❌ Avoid (implicit return type)
   export function getLessonProgress(lessonId: number) {
     // ...
   }
   ```

3. **Use TypeScript's discriminated unions for game modes**
   ```typescript
   export type GameMode =
     | 'story-to-character'
     | 'character-to-story'
     | 'meaning-to-character'
     | 'character-to-pinyin';
   ```

### React Conventions

1. **Client Components only when needed**
   - Use `'use client'` only for components with interactivity (state, effects, event handlers)
   - Keep Server Components for static content (lesson lists, character display)

2. **Hooks at the top level**

   ```typescript
   // ✅ Good
   export default function GameBoard() {
     const [state, setState] = useState(initialState);
     useEffect(() => {
       /* ... */
     }, [deps]);
     // ...
   }
   ```

3. **Custom hooks for reusable logic**
   - Future: `useSound()`, `useKeyboard()`, `useLocalStorage()`

4. **Prefer composition over props drilling**
   - Use React Context for cross-cutting concerns (sound settings, theme)

### Naming Conventions

1. **Components:** PascalCase (`CharacterCard`, `GameBoard`)
2. **Functions:** camelCase (`getToneInfo`, `saveGameScore`)
3. **Constants:** SCREAMING_SNAKE_CASE (`ACCURACY_THRESHOLD`, `TONE_COLORS`)
4. **Files:** Match component name (`CharacterCard.tsx`, `types.ts`)

### State Management Principles

1. **Lift state only as high as necessary**
   - Match state lives in `GameBoard.tsx` (not `MultiRoundGame.tsx`)
   - Round progress lives in `MultiRoundGame.tsx` (not `page.tsx`)

2. **Prefer controlled components**
   - Game boards receive `onComplete` callbacks, not direct state mutation

3. **localStorage is write-only from components**
   - Components call `saveGameScore()`, never `localStorage.setItem()` directly

---

## Testing & Quality Philosophy

### Testing Pyramid

1. **E2E Tests (10%):** User journey tests (Playwright)
   - "First-time learner completes lesson 1"
   - "Returning user sees progress modal"

2. **Integration Tests (20%):** Component interaction tests
   - "GameBoard correctly matches cards and updates score"
   - "MultiRoundGame advances rounds after 70% accuracy"

3. **Unit Tests (70%):** Pure function tests
   - "getToneInfo returns correct color for tone 3"
   - "calculateAccuracy handles edge cases"

### What to Test

**DO test:**

- ✅ User-facing behavior (clicks, navigation, feedback)
- ✅ Edge cases (0 characters, invalid lesson IDs, localStorage failures)
- ✅ Accessibility (keyboard navigation, ARIA labels, focus management)
- ✅ Data integrity (all 3,035 characters have required fields)

**DON'T test:**

- ❌ Implementation details (state variable names, internal functions)
- ❌ Framework behavior (React rendering, Next.js routing)
- ❌ Third-party libraries (Tailwind CSS classes)

### Quality Gates

Every commit must pass:

1. **TypeScript compilation** (`npm run build`)
2. **ESLint** (no errors, warnings allowed)
3. **Prettier** (auto-format on commit)
4. **Unit tests** (>80% coverage)
5. **E2E tests** (critical paths pass)

### Code Review Standards

1. **Readability:** Can a new contributor understand this in 5 minutes?
2. **Correctness:** Does it handle edge cases gracefully?
3. **Performance:** Does it scale to 112 lessons?
4. **Accessibility:** Can it be used with keyboard/screen reader?
5. **Tests:** Are critical paths covered?

---

## Accessibility & Inclusivity

### Keyboard Navigation

**Every interactive element must be keyboard-accessible:**

- **Arrow keys:** Navigate character cards, game selections
- **Enter:** Confirm selection, advance to next screen
- **Escape:** Cancel modal, return to previous screen
- **Tab:** Focus next interactive element

**Implementation:**

```typescript
useEffect(() => {
  const handleKeyboard = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') handleCancel();
  };
  window.addEventListener('keydown', handleKeyboard);
  return () => window.removeEventListener('keydown', handleKeyboard);
}, [dependencies]);
```

### Screen Reader Support

**Use semantic HTML and ARIA labels:**

```tsx
<button
  aria-label="Match story to character 木 (mù)"
  onClick={handleMatch}
>
  木
</button>

<div role="alert" aria-live="polite">
  {feedback === 'correct' && 'Correct match!'}
</div>
```

### Color Contrast

**All text must meet WCAG AA standards:**

- **Large text (≥18pt):** 3:1 contrast ratio
- **Normal text:** 4.5:1 contrast ratio

**Use Tailwind's color system for consistency:**

- `text-gray-800` on `bg-white` ✅
- `text-blue-400` on `bg-blue-500` ❌

### Sound as Enhancement, Not Requirement

**Sound should enrich but not block:**

- Visual feedback (green highlight, red shake) always present
- Sound effects complement but don't replace visual cues
- Sound toggle persists in localStorage

---

## Performance & Optimization

### Bundle Size

**Current:** ~2MB (all 112 lessons bundled)

**Future optimization:**

- Lazy-load lessons on demand: `const lesson = await import(`@/lib/data/lesson${id}.json`)`
- Target: <500KB initial bundle, <50KB per lesson

### Rendering Performance

**Guidelines:**

1. **Memoize expensive calculations:**

   ```typescript
   const shuffledCards = useMemo(() => shuffle(cards), [cards]);
   ```

2. **Avoid unnecessary re-renders:**

   ```typescript
   const handleClick = useCallback(() => {
     /* ... */
   }, [deps]);
   ```

3. **Use keys for list items:**
   ```tsx
   {
     characters.map((char) => <CharacterCard key={char.id} character={char} />);
   }
   ```

### Lighthouse Scores (Target)

- **Performance:** ≥90
- **Accessibility:** 100
- **Best Practices:** 100
- **SEO:** ≥90

---

## Data Integrity

### Lesson Data Requirements

Every character in `lib/data/lesson*.json` must have:

```typescript
{
  "id": number,           // Unique within lesson
  "character": string,    // Single traditional Chinese character
  "pinyin": string,       // Romanization (e.g., "mù", "nǐ hǎo")
  "tone": number,         // 1 (flat), 2 (rising), 3 (dipping), 4 (falling), 5 (neutral)
  "meaning": string,      // English meaning (e.g., "tree", "hello")
  "story": string,        // Mnemonic story (≥20 characters)
  "primitives": string[]  // Visual components (e.g., ["木", "口"])
}
```

### Data Validation (Future)

Create `scripts/validate-lessons.ts` to check:

- ✅ All 112 lessons present
- ✅ All characters have non-empty fields
- ✅ All tone values in range 1-5
- ✅ All stories have ≥20 characters (substantive mnemonics)
- ✅ No duplicate character IDs within a lesson

---

## AI Collaboration Guidelines

If you're an AI assistant working on this codebase, follow these principles:

### 1. **Read Before Writing**

Always read existing code before making changes. Understand:

- What patterns already exist?
- Why was it done this way?
- What might break if I change this?

### 2. **Honor the Pedagogy**

The 4-round progression is foundational. Changes to game mechanics must:

- Preserve the pedagogical intent
- Be backed by learning science research
- Be tested with real users

### 3. **Test Everything**

Never commit code without tests. For every feature:

1. Write the test first (TDD)
2. Implement the feature
3. Verify the test passes
4. Check for edge cases

### 4. **Document Decisions**

When making non-obvious choices, document _why_:

```typescript
// We use 70% accuracy threshold based on mastery learning research
// (Bloom, 1968; Guskey, 2010). Lower thresholds lead to frustration,
// higher thresholds cause boredom.
const ACCURACY_THRESHOLD = 0.7;
```

### 5. **Preserve Simplicity**

Before adding a dependency, ask:

- Can we build this in 50 lines ourselves?
- Will this dependency still be maintained in 2 years?
- Does it align with our principles (privacy, offline-first)?

### 6. **Ask When Uncertain**

When facing multiple valid approaches, ask the user:

- "Should we optimize for bundle size or developer experience?"
- "Should we add analytics or stay privacy-first?"

### 7. **Think in Systems**

A change to `GameBoard.tsx` might affect:

- `MultiRoundGame.tsx` (parent component)
- `storage.ts` (progress tracking)
- Tests in `GameBoard.test.tsx`

Trace dependencies before committing.

---

## Lesson Enhancement Workflow

### The Gold Standard: Enhanced Lesson Structure

Each lesson should be enhanced with the following structure. **Lesson 1, 9, and 10 are the current gold standard** — use them as reference.

#### Lesson-Level Metadata

```json
{
  "lesson": 9,
  "title": "The Black Ink Banquet",
  "theme": "A secret underground banquet where scholars gather to copy forbidden manuscripts...",
  "memory_palace": "The Secret Cave Banquet Hall",
  "narrative_arc": "Journey measured → Quantity calculated → Entrance buried → ...",
  "narrative_story": "In a cave buried a thousand Li away, they hold a banquet where you eat only ink...",
  "characters": [...]
}
```

#### Character-Level Enhancement

Each character should have these fields:

```json
{
  "id": 169,
  "character": "里",
  "pinyin": "lǐ",
  "tone": 3,
  "meaning": "a Li (distance unit)",
  "mnemonic_image": "A field atop soil - the earth measured in walking distances",
  "sound_bridge": "LEE = 'LEE-aning under the weight of endless distance'",
  "story": "The journey measures one LI — then another, then a thousand. I GROAN 'Liii...' as my legs sink into field after field...",
  "tone_emotion": "GROAN - guttural weight of the endless journey",
  "primitives": ["field 田", "earth 土"],
  "narrative_position": "The journey begins — measuring the impossible distance to the cave"
}
```

### Tone-Emotion System

The tone-emotion mapping is central to the mnemonic system:

| Tone | Emotion     | Description                   | Color   |
| ---- | ----------- | ----------------------------- | ------- |
| 1    | **SING**    | Sustained high note, operatic | Blue    |
| 2    | **GASP**    | Rising surprise, questioning  | Emerald |
| 3    | **GROAN**   | Low zombie moan, dipping      | Amber   |
| 4    | **COMMAND** | Sharp bark, falling           | Red     |
| 5    | whisper     | Neutral, unstressed           | Gray    |

### Key Reference Files

- **Official Narrative Prose:** `lesson_stories_prose.md` — Contains the official story for each lesson. Always reference this when enhancing a lesson.
- **Neo-Gongbi Prompting Guide:** `docs/neo-gongbi-prompting-guide.md` — Research synthesis for generating character images with Nano Banana (Google Gemini).
- **Lesson Plans:** `docs/lessonX-revision-plan.md` — Detailed enhancement plans for each lesson.
- **Image Prompts:** `docs/lessonX-image-prompts.md` — Neo-Gongbi prompts for generating all character images.

---

## Image Upload Instructions

### Naming Convention

Images should be named by the **Chinese character** they represent:

```
public/images/lesson9/里.png
public/images/lesson9/量.png
public/images/lesson10/木.png
public/images/lesson10/林.png
```

The system supports two naming formats (tries in order):

1. **Primary (recommended):** `{character}.png` — e.g., `里.png`
2. **Fallback (legacy):** `{id}_{pinyin}.png` — e.g., `169_li.png`

### Directory Structure

```
public/images/
├── lesson1/          # Legacy format: 1_yi.png, 2_er.png, etc.
├── lesson9/          # New format: 里.png, 量.png, etc.
├── lesson10/         # New format: 木.png, 林.png, etc.
└── lessonN/          # Create as needed
```

### Image Requirements

- **Format:** PNG (transparent background preferred)
- **Style:** Neo-Gongbi (see `docs/neo-gongbi-prompting-guide.md`)
- **Content:** The Chinese character must be clearly visible and integrated into the scene
- **Naming:** Use the exact Chinese character as filename

### Upload Checklist

When uploading images for a lesson:

1. Create directory: `public/images/lessonX/`
2. Name each image: `{character}.png`
3. Verify count matches lesson character count
4. Alternate versions can be saved as `{character}_alt.png` or `{character} try.png`

### Verification Command

To verify all images are present for a lesson:

```bash
# List main images (excluding alternates)
ls public/images/lessonX/ | grep -v "try" | grep -v "_alt" | grep "\.png$" | wc -l

# Compare against lesson character count
cat lib/data/lessonX.json | jq '.characters | length'
```

---

## Project Status

### Completed Lessons (Gold Standard)

| Lesson | Title                          | Characters | Images | Status   |
| ------ | ------------------------------ | ---------- | ------ | -------- |
| 1      | (Numbers & Basics)             | 27         | ✓ 27   | Complete |
| 9      | The Black Ink Banquet          | 22         | ✓ 22   | Complete |
| 10     | The Forest of Dim-Witted Trees | 32         | ✓ 32   | Complete |

### Lesson Enhancement Process

For each lesson, follow these steps:

1. **Read the official prose** from `lesson_stories_prose.md`
2. **Create revision plan** at `docs/lessonX-revision-plan.md`
3. **Enhance JSON data** at `lib/data/lessonX.json` with all character fields
4. **Create image prompts** at `docs/lessonX-image-prompts.md`
5. **Generate images** using Nano Banana with the prompts
6. **Upload images** to `public/images/lessonX/` using character names
7. **Verify** all images load correctly

### Neo-Gongbi Image Generation

Images are generated using the **Neo-Gongbi** style via **Nano Banana** (Google Gemini). The prompting follows a 5-step "Director's Brief" structure:

1. **Style Anchor** — "In the style of Neo-Gongbi..."
2. **Narrative Context** — Scene description with emotional tone
3. **Shape Constraint** — Where/how the character appears
4. **Material Justification** — Why the shape exists naturally in the scene
5. **Technical Specs** — Aspect ratio, lighting, atmosphere

See `docs/neo-gongbi-prompting-guide.md` for complete guidance.

---

## Closing Thoughts

This codebase is **not just functional code**—it's a **pedagogical artifact**.

Every component, every function, every line exists to serve a single purpose: **help learners remember Chinese characters through story-based memory encoding**.

When you build on this project, ask yourself:

- Does this change make learning easier?
- Does this honor the user's privacy and trust?
- Does this code feel inevitable—like it couldn't be written any other way?

If yes, you're building in the right direction.

If no, step back and reconsider.

---

**Crafted with care.**
**Built to last.**
**Designed to delight.**

---

_This document is a living artifact. As the project evolves, so should this philosophy. Keep it current. Keep it true._
