# 汉字 Learning Game

**Master 3,035 Traditional Chinese Characters Through Story-Based Memory**

A web-based learning application implementing the **Remember These Hanzi (RTH)** methodology. Learn Chinese characters through vivid mnemonic stories and progressive difficulty testing—backed by cognitive science and built with modern web technologies.

---

## 🎯 Overview

Traditional Chinese character learning often relies on rote memorization—tracing shapes thousands of times without understanding their meaning or structure. This app transforms that experience by:

- **Encoding characters as stories**: Each character has a vivid mnemonic that connects its visual form to meaning and pronunciation
- **Testing through progressive difficulty**: 4 rounds that mirror how human memory consolidates information
- **Providing immediate feedback**: Sound and visual cues create an engaging, game-like experience
- **Tracking your progress**: localStorage keeps your best scores and learning history private and local

**Built for learners.** No sign-ups, no ads, no tracking. Just you and 3,035 characters waiting to be learned.

---

## ✨ Features

### 📚 Complete RTH Curriculum

- **112 lessons** covering the full traditional Chinese character set
- **3,035 characters** with pronunciation, meaning, stories, and visual primitives
- Characters organized by learning progression (simple → complex)

### 🎮 4-Round Learning System

1. **Round 1: Story → Character** — Match mnemonic stories to characters (with hints)
2. **Round 2: Character → Story** — Match characters to stories (pinyin only)
3. **Round 3: Meaning → Character** — Match English meanings to characters (no hints)
4. **Round 4: Character → Pinyin** — Match characters to pronunciation (pure recall)

Each round increases cognitive difficulty, mirroring how memory moves from recognition → recall → mastery.

### 🧠 Study Phase

- **Interactive character cards** with large, clear typography
- **Tone visualization** with color coding and arrow symbols (→ ↗ ↘↗ ↘)
- **Primitive/radical breakdown** to understand character structure
- **Keyboard navigation** (arrow keys) for fluid learning

### 📊 Progress Tracking

- **Per-lesson statistics**: Games played, best accuracy, best score
- **Star ratings** based on performance (1-5 stars)
- **Returning user modal** showing your progress and offering choice: Review or Play
- **All data stored locally** (localStorage) — no server, no sync, no privacy concerns

### 🎵 Audio Feedback

- **Correct match**: Pleasant ascending tone (800 → 1000 Hz)
- **Incorrect match**: Gentle error buzz (200 Hz)
- **Page complete**: Ascending arpeggio (C-E-G)
- **Level unlock**: Triumph fanfare (C-E-G-C)
- **Mutable toggle** with persistence (localStorage)

### ♿ Accessibility

- **Keyboard navigation**: Arrow keys, Enter, Tab, Escape
- **High contrast UI**: WCAG AA compliant
- **Graceful degradation**: Works without sound, JavaScript-first with progressive enhancement

### 🚀 Performance

- **Static site generation**: Instant page loads
- **Offline-capable**: All lesson data bundled at build time
- **No external dependencies** for core functionality (no CDNs, no tracking scripts)

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Audio**: Web Audio API (no external libraries)
- **State Management**: React hooks + localStorage
- **Data Storage**: Static JSON files (112 lessons, version-controlled)

**Philosophy**: Keep dependencies minimal, prioritize user privacy, optimize for learning outcomes.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **pnpm** (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/pdbforone/chinese-characters-game.git
cd chinese-characters-game

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run start
```

---

## 📂 Project Structure

```
chinese-characters-game/
├── app/                          # Next.js app directory (routes + layouts)
│   ├── page.tsx                  # Home page (lesson grid)
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles + Tailwind imports
│   ├── /lesson/[id]/page.tsx    # Dynamic lesson route
│   └── /components/              # React components
│       ├── CharacterIntroduction.tsx  # Study phase (card-by-card)
│       ├── MultiRoundGame.tsx         # Game orchestrator (4 rounds)
│       ├── GameBoard.tsx              # Matching game engine
│       ├── CharacterCard.tsx          # Character display card
│       ├── StoryCard.tsx              # Story display card
│       ├── PinyinCard.tsx             # Pinyin display card
│       ├── MeaningCard.tsx            # Meaning display card
│       ├── ReturnUserModal.tsx        # Returning user experience
│       ├── ProgressBar.tsx            # Visual progress indicator
│       └── SoundToggle.tsx            # Audio control button
├── lib/                          # Core utilities
│   ├── types.ts                  # TypeScript interfaces
│   ├── lessonLoader.ts           # Lesson data loader
│   ├── storage.ts                # localStorage abstraction
│   ├── sounds.ts                 # Web Audio API manager
│   └── /data/                    # Lesson data (112 JSON files)
│       ├── lesson1.json
│       ├── lesson2.json
│       └── ... lesson112.json
├── public/                       # Static assets (fonts, icons)
├── CLAUDE.md                     # AI collaboration guide + philosophy
├── README.md                     # This file
├── package.json                  # Dependencies + scripts
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration
└── next.config.ts                # Next.js configuration
```

---

## 🎓 How to Use

### For Learners

1. **Choose a lesson** from the home page (start with Lesson 1 if you're new)
2. **Study the characters** one-by-one:
   - Read the mnemonic story carefully
   - Visualize the scene described
   - Notice how primitives combine to form meaning
   - Use arrow keys (← →) to navigate
3. **Play the matching game**:
   - Complete 4 rounds of progressive difficulty
   - Achieve 70%+ accuracy to advance
   - Get immediate feedback with sound + visual cues
4. **Return anytime** — your progress is saved locally

### For Contributors

1. **Read [CLAUDE.md](./CLAUDE.md)** — Understand the philosophy and patterns
2. **Set up your environment**:
   ```bash
   npm install
   npm run dev
   ```
3. **Run tests** (coming soon):
   ```bash
   npm run test
   npm run test:e2e
   ```
4. **Make your changes**:
   - Follow TypeScript conventions (see CLAUDE.md)
   - Write tests for new features
   - Ensure accessibility (keyboard nav, ARIA labels)
5. **Submit a PR**:
   - Describe _why_ the change is needed
   - Reference any related issues
   - Ensure all tests pass

---

## 🧪 Testing (In Progress)

We're building a comprehensive test suite to ensure quality:

### Test Coverage Goals

- **Unit tests**: 80%+ coverage (pure functions, utilities)
- **Component tests**: All interactive components tested
- **E2E tests**: Critical user journeys validated

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode (development)
npm run test:watch

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

---

## 🛣️ Roadmap

### Phase 1: Foundation (Current)

- [x] Core learning flow (introduction → 4 rounds)
- [x] Complete lesson data (112 lessons, 3,035 characters)
- [x] localStorage progress tracking
- [x] Sound system with Web Audio API
- [x] Keyboard navigation
- [x] **CLAUDE.md** philosophical guide
- [x] **README.md** practical guide
- [ ] Comprehensive test suite
- [ ] ESLint + Prettier + pre-commit hooks
- [ ] CI/CD pipeline (GitHub Actions)

### Phase 2: Polish

- [ ] Enhanced accessibility (ARIA live regions, screen reader optimization)
- [ ] React Error Boundaries for graceful error handling
- [ ] Performance optimization (lazy-load lessons, code splitting)
- [ ] Lighthouse score optimization (>90 performance, 100 accessibility)
- [ ] Data validation script (ensure all 3,035 characters are complete)

### Phase 3: Enhancement

- [ ] Spaced repetition scheduling (remind users to review weak characters)
- [ ] Achievement system (badges, milestones, streaks)
- [ ] Character filtering by primitive/radical
- [ ] Custom lesson creation (user-selected character sets)
- [ ] Time-attack mode for advanced learners
- [ ] Difficulty customization (2-round mode, 6-round mode)

### Phase 4: Scale

- [ ] PWA (Progressive Web App) support for offline + installable
- [ ] Optional cloud sync (cross-device progress)
- [ ] Learning analytics dashboard (identify weak characters)
- [ ] Community features (leaderboards, shared custom lessons)
- [ ] Internationalization (support multiple UI languages)
- [ ] Mobile app wrapper (React Native / Capacitor)

---

## 🤝 Contributing

We welcome contributions! Whether you're:

- Fixing a typo in lesson data
- Adding a new feature
- Improving accessibility
- Writing tests
- Optimizing performance

**Your help makes this better for learners worldwide.**

### Contribution Guidelines

1. **Start with an issue**: Describe the problem or feature request
2. **Read [CLAUDE.md](./CLAUDE.md)**: Understand the philosophy
3. **Fork and branch**: Create a feature branch from `main`
4. **Write tests**: Cover new functionality
5. **Document decisions**: Explain _why_ in comments/commits
6. **Submit a PR**: Link to the issue, describe changes clearly

### Code Standards

- **TypeScript**: Strict mode enabled, no `any` types
- **Formatting**: Prettier (auto-format on commit)
- **Linting**: ESLint (no errors, warnings allowed)
- **Tests**: New features require tests
- **Accessibility**: Keyboard navigation + ARIA labels required

---

## 📄 License

[MIT License](./LICENSE) — Free to use, modify, and distribute.

**Attribution appreciated but not required.** If you build something cool with this, we'd love to hear about it!

---

## 🙏 Acknowledgments

### Remember These Hanzi (RTH)

This application implements the pedagogical methodology developed by the RTH community. The mnemonic stories and character data are derived from the RTH system, which has helped thousands of learners master Chinese characters through story-based memory encoding.

**Learn more**: [Remember These Hanzi](https://www.youtube.com/watch?v=troxvPRmZm8) (methodology overview)

### Built With

- [Next.js](https://nextjs.org/) — The React framework for production
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) — Type safety for JavaScript
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) — Browser-native audio synthesis

---

## 📬 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/pdbforone/chinese-characters-game/issues)
- **Discussions**: [GitHub Discussions](https://github.com/pdbforone/chinese-characters-game/discussions)
- **Email**: [Your contact if you want to add one]

---

## 📊 Project Stats

- **Lessons**: 112
- **Characters**: 3,035 traditional Chinese characters
- **Stories**: 3,035 mnemonic stories
- **Lines of Code**: ~3,500 (excluding lesson data)
- **Dependencies**: 12 (minimal by design)
- **Bundle Size**: ~2MB (target: <500KB after optimization)

---

## 🌟 Star This Repo

If this project helped you learn Chinese characters, consider starring the repo! It helps others discover this resource.

**⭐ Star on GitHub** → [github.com/pdbforone/chinese-characters-game](https://github.com/pdbforone/chinese-characters-game)

---

**Built with care. Designed for learning. Optimized for memory.**

_让学习变得简单而有趣 (Make learning simple and joyful)_
