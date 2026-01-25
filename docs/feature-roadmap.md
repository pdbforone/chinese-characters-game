# Feature Roadmap & Research Plan

> Created: 2026-01-25
> Purpose: Document brainstormed features, perform KWL analysis, and plan implementation

---

## Feature Categories

### A. Quick Wins (Low effort, High impact)

| Feature                       | Description                                   | Effort | Impact |
| ----------------------------- | --------------------------------------------- | ------ | ------ |
| 1. Missed Character Review    | Replay only wrong answers after mastery games | Low    | High   |
| 2. Session Summary            | Stats at lesson end (time, accuracy, trends)  | Low    | Medium |
| 3. Streak Rewards Enhancement | Better visual/audio celebration at milestones | Low    | Medium |

### B. Core Learning Features (Medium effort, High impact)

| Feature                     | Description                                 | Effort | Impact    |
| --------------------------- | ------------------------------------------- | ------ | --------- |
| 4. Spaced Repetition System | Track character strength, surface weak ones | High   | Very High |
| 5. Tone Drilling Mode       | Focused practice on tones across lessons    | Medium | High      |
| 6. Story Remix Game         | Reconstruct story elements, deeper encoding | Medium | High      |

### C. Advanced Features (Higher effort)

| Feature                       | Description                               | Effort | Impact |
| ----------------------------- | ----------------------------------------- | ------ | ------ |
| 7. Character Writing Practice | Canvas stroke input with gesture matching | High   | High   |
| 8. Progress Visualization     | Heat map of all 112 lessons               | Medium | Medium |

### D. Technical Foundation (Enables future growth)

| Feature                 | Description                     | Effort | Impact    |
| ----------------------- | ------------------------------- | ------ | --------- |
| 9. PWA Setup            | Offline capability, installable | Medium | Very High |
| 10. Lazy Load Lessons   | Reduce initial bundle size      | Low    | Medium    |
| 11. Sound Design System | Web Audio for feedback sounds   | Medium | Medium    |

---

## KWL Analysis

### K - What We Know

| Area               | Knowledge                             |
| ------------------ | ------------------------------------- |
| **React/Next.js**  | Strong - current stack                |
| **localStorage**   | Strong - already using for progress   |
| **Tailwind CSS**   | Strong - current styling              |
| **Game Mechanics** | Strong - 3 mastery games built        |
| **Theme System**   | Strong - implemented for lessons 9-21 |
| **Mobile Touch**   | Moderate - just fixed touch handling  |

### W - What We Want to Know

| Topic                  | Questions                                                                | Priority     |
| ---------------------- | ------------------------------------------------------------------------ | ------------ |
| **Spaced Repetition**  | What algorithm? SM-2? Leitner? How to adapt for character learning?      | High         |
| **PWA Requirements**   | Service worker caching strategies? Manifest requirements for app stores? | High         |
| **Stroke Recognition** | Canvas APIs? Existing libraries? Accuracy requirements?                  | Medium       |
| **Web Audio**          | Best practices for game sounds? Latency issues on mobile?                | Medium       |
| **Capacitor**          | Setup process? Native feature access? Build pipeline?                    | Low (future) |

### L - What We Learned (Research Completed 2026-01-25)

#### 1. Spaced Repetition Algorithm - FSRS is the Winner

**Source**: [FSRS Wiki](https://github.com/open-spaced-repetition/fsrs4anki/wiki/abc-of-fsrs), [FSRS vs SM-2 Guide](https://memoforge.app/blog/fsrs-vs-sm2-anki-algorithm-guide-2025/)

**Key Findings**:

- **FSRS** (Free Spaced Repetition Scheduler) is the modern standard (2023+)
- Created using ML trained on 700 million reviews from 20,000 users
- **20-30% fewer reviews** than SM-2 for same retention level
- Based on "Three Component Model of Memory" (DHP model)
- Better at handling delayed reviews (users taking breaks)
- Default **90% retention** works for most learners
- Works best with **atomic, clear cards** (perfect for our character system)

**Implementation Plan**:

```typescript
interface CharacterMemory {
  characterId: number;
  stability: number; // How well-learned (days until 90% recall)
  difficulty: number; // 0-1, how hard for this user
  lastReview: Date;
  nextReview: Date;
  retrievability: number; // Current probability of recall
  reps: number; // Total successful reviews
  lapses: number; // Times forgotten
}
```

**FSRS Formula** (simplified):

- After correct: `newStability = stability * (1 + exp(difficulty) * (1 - retrievability))`
- After incorrect: `newStability = stability * 0.2` (reset with penalty)
- `nextInterval = stability * ln(0.9) / ln(retrievability)`

#### 2. PWA for App Store Distribution - Clear Path

**Sources**: [Next.js PWA Guide](https://nextjs.org/docs/app/guides/progressive-web-apps), [PWA to Play Store](https://firt.dev/pwa-playstore/), [Bubblewrap Guide](https://dev.to/divyanshulohani/from-web-to-mobile-building-pwas-with-nextjs-bubblewrap-337b)

**Requirements for Google Play**:

1. ✅ HTTPS (Vercel provides)
2. ⬜ Service Worker with fetch handler
3. ⬜ Web App Manifest with 512px icon
4. ⬜ Lighthouse performance score ≥80
5. ⬜ Digital Asset Links (connects app to website)

**Tools**:

- **next-pwa** or **@ducanh2912/next-pwa** - Service worker generation
- **Bubblewrap** (Google) - Wraps PWA as TWA for Play Store
- **PWABuilder** (Microsoft) - Alternative wrapper

**Service Worker Strategy**:

- Cache-first for lesson JSON data (static)
- Network-first for user progress (dynamic)
- Offline fallback page for no connection

**iOS Limitations**:

- No push notifications
- 50MB storage limit (may evict)
- No background sync
- Still works as Add to Home Screen

#### 3. Character Stroke Recognition (Future)

**Research needed**: Yes (but lower priority)
**Likely solution**: HanziWriter library (MIT, well-maintained)

---

## Deep Research Prompts

### Research Prompt 1: Spaced Repetition for Chinese Characters

```
Research the most effective spaced repetition algorithms for learning Chinese characters, specifically:

1. Compare SM-2, SM-5, FSRS, and Leitner systems
2. How do Anki, Skritter, and Pleco implement SRS for Chinese?
3. What intervals work best for character recognition vs recall?
4. How should difficulty be calculated for characters with:
   - Multiple readings (多音字)
   - Similar-looking characters (形近字)
   - Tone confusion patterns
5. Best practices for "leech" detection (characters user keeps failing)
6. How to handle the 4-round game accuracy in SRS calculations
```

### Research Prompt 2: PWA for Mobile App Distribution

```
Research PWA requirements and best practices for mobile app distribution:

1. Google Play Store via PWABuilder/Bubblewrap:
   - Manifest requirements
   - TWA (Trusted Web Activity) setup
   - Required permissions and features

2. Service Worker strategies:
   - Caching strategies for JSON lesson data
   - Offline-first vs cache-first approaches
   - Background sync for progress

3. iOS considerations:
   - Safari PWA limitations (no push notifications, etc.)
   - App Clips as alternative
   - Storage limits and eviction

4. Performance requirements:
   - Core Web Vitals for app store acceptance
   - Lighthouse PWA score requirements
```

---

## Priority Matrix

Based on Impact/Effort analysis:

```
HIGH IMPACT
    │
    │  ┌─────────────────┐   ┌─────────────────┐
    │  │ Spaced Rep (4)  │   │ PWA Setup (9)   │
    │  │ [Research+Build]│   │ [Research+Build]│
    │  └─────────────────┘   └─────────────────┘
    │
    │  ┌─────────────────┐   ┌─────────────────┐
    │  │ Missed Review(1)│   │ Tone Drill (5)  │
    │  │ [Ready to Build]│   │ [Ready to Build]│
    │  └─────────────────┘   └─────────────────┘
    │
    │  ┌─────────────────┐   ┌─────────────────┐
    │  │ Session Stats(2)│   │ Story Remix (6) │
    │  │ [Ready to Build]│   │ [Design Needed] │
    │  └─────────────────┘   └─────────────────┘
    │
LOW ─┼──────────────────────────────────────────► EFFORT
   LOW                                          HIGH
```

---

## Recommended Implementation Order

### Phase 1: Quick Wins (No Research Needed)

1. **Missed Character Review** - Immediate pedagogical value
2. **Session Summary** - User engagement and motivation
3. **Lazy Load Lessons** - Technical debt reduction

### Phase 2: PWA Foundation (Research Then Build)

4. **PWA Setup** - Enables offline, installability, future app stores

### Phase 3: Core Learning (Research Then Build)

5. **Spaced Repetition System** - Long-term retention
6. **Tone Drilling Mode** - Common pain point for learners

### Phase 4: Polish

7. **Sound Design** - Feedback and engagement
8. **Progress Visualization** - Motivation
9. **Streak Enhancements** - Gamification

---

## Next Steps

1. [x] Research spaced repetition algorithms
2. [x] Research PWA requirements
3. [x] Implement Phase 1 features (Missed Character Review)
4. [ ] Research user authentication & cloud sync
5. [ ] Implement user profiles with Supabase
6. [ ] Implement Phase 2 based on research
7. [ ] Iterate based on user feedback

---

## E. User Profiles & Data Persistence (Critical for cross-device sync)

| Feature                 | Description                         | Effort | Impact   |
| ----------------------- | ----------------------------------- | ------ | -------- |
| 12. User Authentication | Login via email/Google/Apple        | Medium | Critical |
| 13. Cloud Database      | Store progress, SRS data in cloud   | Medium | Critical |
| 14. Offline-First Sync  | Work offline, sync when connected   | High   | High     |
| 15. Guest Mode          | Use without account, prompt to save | Low    | Medium   |

### Why This Matters

Current localStorage approach:

- ❌ Lost when browser clears data
- ❌ Device-specific (no sync)
- ❌ Can't implement proper FSRS (needs historical data)
- ❌ No backup

With user profiles:

- ✅ Progress saved permanently
- ✅ Sync across phone, tablet, desktop
- ✅ Full FSRS spaced repetition possible
- ✅ Can track 3,000+ characters over months/years

---

## Deep Research Prompt: User Authentication & Cloud Sync for Learning Apps

```
Research the best practices for implementing user authentication and cloud data sync for a Chinese character learning PWA. The app needs to:

CONTEXT:
- Next.js 15 app deployed on Vercel
- Currently uses localStorage for progress
- Will implement FSRS spaced repetition (needs persistent history)
- Must work offline (PWA)
- Target: free tier for initial launch
- 3,035 characters to track per user

QUESTIONS TO ANSWER:

1. AUTH PROVIDER COMPARISON
   Compare Supabase, Firebase, Clerk, Auth0, and Appwrite for:
   - Free tier limits (monthly active users, API calls)
   - Supported auth methods (email, Google, Apple, magic link)
   - Next.js App Router integration ease
   - Session handling in PWAs (cookies vs tokens)
   - Privacy/GDPR compliance features

2. DATABASE SCHEMA DESIGN
   For a spaced repetition learning app, design schema for:
   - User profiles (minimal PII)
   - Character progress (per-character FSRS state)
   - Lesson completion status
   - Session history (for analytics)
   - What indexes are needed for query performance?
   - Estimated storage per user (3,035 characters × FSRS fields)

3. OFFLINE-FIRST ARCHITECTURE
   How to handle:
   - Offline data storage (IndexedDB vs localStorage)
   - Sync strategy when coming back online
   - Conflict resolution (user practiced on two devices)
   - Queue management for pending writes
   - Service worker coordination with auth state

4. MIGRATION PATH
   Best practices for:
   - Migrating existing localStorage users to cloud
   - "Claim your progress" flow for guest users
   - Handling users who don't want accounts
   - Data export/import for user ownership

5. SECURITY CONSIDERATIONS
   - Row-level security (RLS) for user data isolation
   - Token refresh in PWA context
   - Secure session handling across tabs
   - Rate limiting for free tier abuse prevention

6. UX PATTERNS
   - Guest mode vs required login (what do Duolingo, Anki, Skritter do?)
   - When to prompt for account creation
   - Social proof / gamification with accounts
   - Account recovery flows

7. COST PROJECTION
   For 1K, 10K, 100K monthly active users:
   - Database storage costs
   - Auth provider costs
   - API call costs
   - When does free tier break?

Please provide specific code examples for Next.js 15 App Router where applicable, especially for:
- Auth middleware setup
- Protected API routes
- Client-side auth state management
- Supabase client initialization pattern
```
