# Final Architecture Decision: The "Unlockable Mastery" Model

After reconciling the initial pedagogical research with the technical and behavioral critique, we have arrived at a definitive architecture. The "Sequential 6-Round" model is rejected due to high churn risk. We will proceed with an **Unlockable Tiered** model.

## 1. Final Architecture Decision

### A. Integration Model: Tiered Progression (Confidence: High)

Instead of a monolithic 6-round session, we treat the new game modes as a "Mastery Tier" that unlocks only after the core lesson is passed.

- **Tier 1 (Core):** 4-Round Matching (Existing). Focus: Recognition & Recall.
  - _Outcome:_ Unlocks next lesson. Marks lesson as "Complete" (Silver status).

- **Tier 2 (Mastery):** Story Mason + Story Detective. Focus: Context & Production.
  - _Outcome:_ Marks lesson as "Mastered" (Gold status). Earns "Scholar" badge.
  - _Trigger:_ Presented immediately after Tier 1 success via a "Continue to Mastery?" modal, or accessible later from the lesson menu.

### B. Game Sequence (Confidence: High)

The ordering within the Mastery Tier is strict, moving from macro-structure to micro-production.

1. **Core Loop (Rounds 1-4):** _Recognition/Recall_ (Establish the memory trace).
2. **Story Mason (Sequencing):** _Macro-Context_. User reassembles the narrative flow. This primes the brain with the story structure before asking for specific character production.
3. **Story Detective (Cloze):** _Active Production_. User produces specific characters within the now-established context.

### C. Session Design (Confidence: Medium-High)

- **Core Session:** ~4-6 minutes.
- **Mastery Session:** ~3-5 minutes.
- **Total Time (if contiguous):** ~8-11 minutes.
- **Break Point:** The user is explicitly given an "Exit" ramp between Core and Mastery to prevent fatigue-based churn.

---

## 2. Resolved Disputes

### Dispute 1: "Active Production" vs. "Cognitive Overload"

- **Research:** Argued for immediate production to deepen memory traces (Production Effect).
- **Critique:** Warned that 6 mandatory rounds would cause massive drop-off for adult learners who value efficiency.
- **Resolution:** **Optionality is the safety valve.** By gating the high-load production games (Mason/Detective) behind the "Mastery" wall, we protect the daily habit loop while offering deep work for motivated users. We prioritize _retention of the user_ over _perfect pedagogical purity_.

### Dispute 2: Mobile Drag-and-Drop Feasibility

- **Research:** Proposed drag-and-drop for Story Mason.
- **Critique:** Correctly identified that drag-and-drop on mobile is historically high-friction and accessible-hostile.
- **Resolution:** **Hybrid Input.** We will use `@dnd-kit` for the sorting logic but implement a **"Tap-to-Order" fallback**.
  - _Desktop:_ Drag to reorder.
  - _Mobile:_ Tap an item to select, tap a slot to move. This bypasses the frustration of long-press-and-drag scrolling on small screens.

### Dispute 3: React 19 Compatibility

- **Research:** Suggested standard libraries.
- **Critique:** Many DND libraries (`react-beautiful-dnd`) are deprecated or incompatible with React 19.
- **Resolution:** **Standardize on `@dnd-kit`**. It is currently the most robust, accessible, and actively maintained library compatible with modern React patterns (hooks-based, headless). We explicitly reject `react-beautiful-dnd`.

---

## 3. Implementation Specification

### User Flow

1. **Lesson Start** -> Core Game (Rounds 1-4).
2. **Core Success Screen**: "Lesson Complete! [Next Lesson] or [Master This Lesson]".
3. **User Selects "Master This Lesson"**:
4. **Story Mason (Round 5)**:
   - Display: 3-5 sentence strips from the mnemonic story.
   - Task: Reorder them to match the narrative logic.
   - _Feedback:_ Visual snap + "Narrative Position" reinforcement.

5. **Story Detective (Round 6)**:
   - Display: A key sentence with the character replaced by a blank.
   - Task: Select correct character from grid (MVP) or Draw (Post-MVP).

6. **Mastery Success Screen**: "Lesson Mastered". Gold visual indicator applied to lesson node on map.

### State Schema (localStorage)

We will augment the existing `progress` object to support the tiered structure.

```typescript
type LessonStatus = 'locked' | 'unlocked' | 'completed' | 'mastered';

interface UserProgress {
  [lessonId: string]: {
    status: LessonStatus;
    coreAccuracy: number; // 0-100
    masteryAccuracy: number; // 0-100, null if not attempted
    lastPlayed: number; // timestamp
    rounds: {
      [roundId: string]: number; // High score per round
    };
  };
}
```

### Component Hierarchy (React 19 / Next.js)

```jsx
<LessonContainer>
  <GameEngine>
    {/* Core Rounds */}
    <MatchingRound mode="story-to-char" />
    <MatchingRound mode="char-to-story" />

    {/* Interstitial: "Continue to Mastery?" */}
    <MasteryGate>
      {/* Tier 2 Components */}
      <StoryMason>
        <DndContext>
          <SortableList items={storySegments} />
        </DndContext>
      </StoryMason>

      <StoryDetective>
        <ClozeParser text={storyText} target={character} />
        <InputGrid options={distractors} />
      </StoryDetective>
    </MasteryGate>
  </GameEngine>
</LessonContainer>
```

### Success Metrics

1. **Mastery Conversion:** % of users who start Mastery immediately after Core. Target: >30%.
2. **Session Extension:** Increase in average session length without increase in Day 1 churn.
3. **Return Rate:** % of users returning to "Master" old lessons they previously only "Completed".

---

## 4. Risk Mitigation

| Risk                        | Likelihood | Mitigation Strategy                                                                                                                                                                |
| --------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mobile Drag Frustration** | High       | **Tap-to-Order** as primary mobile interaction. Drag is a "power user" feature.                                                                                                    |
| **Session Fatigue**         | Medium     | **Hard Stop** after Round 4. Mastery must be an opt-in, not a forced march.                                                                                                        |
| **Tech Stack Rot**          | Medium     | Use **`@dnd-kit/core`** (headless). Avoid UI-heavy libraries like `react-sortable-tree` which are harder to upgrade.                                                               |
| **Content misalignment**    | Low        | **Algorithmic Validation**: Before enabling Mason/Detective for a lesson, ensure the story data _actually exists_ and isn't a placeholder. Disable Mastery for incomplete lessons. |

---

## 5. Scope Recommendation (MVP)

**Do not roll this out to all 3,000 characters immediately.**

- **Pilot Scope:** Lessons 11–15 (The enhanced narrative arc).
  - _Why:_ Users here are past the tutorial but not yet burnt out. Stories are generally more coherent than in the very first lessons.

- **Timeline:**
  - _Sprint 1:_ Data structure update & "Mastery" UI states (Silver/Gold).
  - _Sprint 2:_ Story Mason implementation (Sequence logic).
  - _Sprint 3:_ Story Detective implementation (Cloze logic).
  - _Sprint 4:_ Pilot Launch & Telemetry.

**Definition of Done for MVP:**

- Users can play Core -> Finish -> Play Mastery -> Finish.
- Mastery status persists in `localStorage`.
- Mobile users can reorder story segments without dragging.
- No regression in Core completion rates.

---

## 6. Open Questions (To Learn via Shipping)

1. **The "Guilt" Factor:** Does seeing a "Silver" (non-mastered) lesson motivate users to return, or does it demotivate them by making them feel their work is "incomplete"? _Test: A/B test the visual prominence of the unearned Gold star._

2. **Sequencing Difficulty:** Is reordering 4 story sentences too easy for adults? Do we need to introduce distractors (fake plot points) to make it challenging enough to be useful?

3. **Drawing vs. Picking:** Will users demand handwriting input for Story Detective immediately, or is multiple-choice sufficient for the MVP?

---

## Final Verdict

Build the **Unlockable Mastery Tier**. It respects the user's time while providing the rigor they need to actually learn. Use `@dnd-kit` for the mechanics, and focus heavily on the "Tap" experience for mobile.
