# Phonetic Series Lesson Restructuring Plan

> **Purpose**: Reorganize 3,035 traditional characters into lessons grouped by phonetic series, with immersive stories rewritten to incorporate phonetic avatars as narrative characters.
>
> **Target**: Traditional characters (繁體字) for maximum reach across Taiwan, Hong Kong, Macau, and overseas Chinese communities.

---

## Scope Clarification: Characters, Not Words

This app teaches **character memorization (字)**, not word memorization (詞) or grammar.

| Learning Layer        | What It Is                               | This App?               |
| --------------------- | ---------------------------------------- | ----------------------- |
| **Characters (字)**   | Individual hanzi: form + meaning + sound | ✅ **Core scope**       |
| **Words (詞)**        | Compounds like 電話, 學生, 北京          | ❌ Future separate game |
| **Sentences/Grammar** | Syntax, particles, structure             | ❌ Future separate game |

**Why this matters:**

- HSK 3.0 emphasizes words and grammar from the start — that's a different pedagogy
- We follow **Zi Ben Wei** (character-based) approach: master the 3,035 building blocks first
- Once characters are known, words become trivially learnable (電 + 話 = telephone)
- Phonetic series grouping teaches _character pronunciation patterns_, not vocabulary

**TonePair game clarification:**

- Uses character pairs for **tone pattern practice** (3+1, 2+4, etc.)
- 北京 is a "3+1 tone pattern example," not "vocabulary word: Beijing"
- Goal: internalize tone transitions, not memorize compound meanings

---

## 1. Project Overview

### Current State

- 112 lessons with ~27 characters each
- Characters grouped by Heisig's primitive-based progression
- Stories are immersive but don't reflect phonetic relationships
- Some phonetic components are scattered across many lessons

### Target State

- Lessons reorganized by **phonetic series** (Sheng Xi 聲系)
- Each major phonetic component becomes a **narrative character/avatar**
- Stories remain rich and immersive, but now **encode structural truth**
- Radicals determine **setting/environment** within each story
- Traditional characters throughout

### Why This Matters

- 80-90% of Chinese characters are phono-semantic compounds
- Grouping by phonetic series accelerates recognition (predict sound from component)
- Stories that encode phonetic truth are more useful than invented etymologies
- Learners gain **generative power** — can guess pronunciation of new characters

---

## 2. The Restructuring Framework

### 2.1 Phonetic Avatar System

Each high-frequency phonetic component gets a consistent **narrative avatar**:

| Phonetic | Pinyin | Avatar Concept    | Personality/Role                                      |
| -------- | ------ | ----------------- | ----------------------------------------------------- |
| 青       | qīng   | The Green Dragon  | Ancient, wise, appears in water/speech/emotion scenes |
| 馬       | mǎ     | The Racing Horse  | Energetic, appears in mother/scold/ant/code scenes    |
| 巴       | bā     | Barry the Clinger | Stubborn, clingy, appears in hold/father/bar scenes   |
| 方       | fāng   | The Square Sage   | Methodical, appears in direction/room/fragrant scenes |
| 包       | bāo    | The Wrapper       | Protective, appears in embrace/satiated/cannon scenes |
| 交       | jiāo   | The Crosser       | Connector, appears in school/glue/suburbs scenes      |
| 皮       | pí     | The Skin Walker   | Transformative, appears in leather/tired/wave scenes  |
| 主       | zhǔ    | The Master        | Authoritative, appears in pillar/note/pour scenes     |
| ...      | ...    | ...               | ...                                                   |

### 2.2 Radical-as-Setting System

Semantic radicals determine the **environment** where the phonetic avatar appears:

| Radical | Setting/Environment                   |
| ------- | ------------------------------------- |
| 氵(水)  | Rivers, rain, ocean, anything wet     |
| 火/灬   | Fire, heat, cooking, forge            |
| 木      | Forest, trees, wooden structures      |
| 金/钅   | Metal workshop, forge, treasury       |
| 土      | Earth, fields, construction sites     |
| 心/忄   | Internal emotional landscapes         |
| 言/讠   | Conversations, debates, proclamations |
| 口      | Mouths, gates, openings, speech       |
| 宀      | Inside buildings, homes, shelters     |
| 辶      | Roads, journeys, movement             |
| 手/扌   | Actions, crafts, manipulation         |
| 目      | Vision, observation, watching         |
| 人/亻   | Human interactions, society           |

### 2.3 Story Structure Template

Each lesson follows this narrative arc:

```
1. OPENING: The phonetic avatar enters a setting (determined by first radical)
2. JOURNEY: Avatar moves through different settings (different radicals)
3. CLIMAX: A challenge that involves multiple characters from the family
4. RESOLUTION: Avatar achieves something, encoding all characters in memory
```

**Example - The 青 (qīng) Lesson:**

> The Green Dragon descends from the mountains seeking clarity. He dives into
> the river [氵→ 清 clear], where the water becomes crystal. Rising, he speaks
> ancient words [言→ 請 invite], inviting the scholars to gather. In his heart
> [心→ 情 emotion], he feels the weight of centuries. Finally, the sun breaks
> through [日→ 晴 sunny], and the dragon's scales shimmer green-gold...

Each scene = one character. The phonetic (Green Dragon = 青 = qīng sound) is constant. The setting changes with the radical.

---

## 3. Phase 1: Phonetic Series Analysis

### 3.1 Extract All Phonetic Components

**Task**: Analyze all 3,035 traditional characters to identify:

- Which phonetic component they contain
- Which semantic radical they have
- Frequency of each phonetic series

**Tool**: Google AI Studio (Gemini)

**Prompt for Analysis**:

```
I have a list of 3,035 traditional Chinese characters from the Heisig RTH system.
For each character, identify:
1. The semantic radical (meaning component)
2. The phonetic component (sound component) if it's a phono-semantic compound
3. The phonetic series it belongs to (e.g., 青 series, 馬 series)
4. Whether it's a pictograph, ideograph, or phono-semantic compound

Output as JSON:
{
  "character": "清",
  "pinyin": "qīng",
  "tone": 1,
  "radical": "氵",
  "radical_meaning": "water",
  "phonetic": "青",
  "phonetic_pinyin": "qīng",
  "phonetic_series": "青 qīng",
  "category": "phono-semantic"
}
```

### 3.2 Group by Phonetic Series

**Expected Output**:

- ~200-300 distinct phonetic series
- Major series (10+ characters): ~50-80
- These major series become the backbone of lesson organization

### 3.3 Identify Lesson Candidates

**Criteria for a "Phonetic Series Lesson"**:

- 4+ characters sharing the same phonetic
- Diverse radicals (different settings for story variety)
- Teaches a recognizable sound pattern

**Hybrid Lessons** (for smaller series):

- Group 2-3 related phonetic series
- Or: Pictograph/ideograph lessons for the ~10% non-compound characters

---

## 4. Phase 2: Lesson Architecture

### 4.1 New Lesson Categories

| Category                 | Description                        | Count (est.) |
| ------------------------ | ---------------------------------- | ------------ |
| **Phonetic Family**      | Single phonetic series, 6-12 chars | ~60 lessons  |
| **Phonetic Cluster**     | 2-3 related phonetics              | ~30 lessons  |
| **Radical Foundation**   | Pictographs + basic radicals       | ~10 lessons  |
| **Ideograph Collection** | Meaning compounds (會意)           | ~12 lessons  |

### 4.2 Lesson Sequencing

**Progression Logic**:

1. Start with high-frequency phonetics that appear in many compounds
2. Introduce radicals progressively (learn 氵 before seeing it in many chars)
3. Build phonetic families on top of known radicals
4. Later lessons can reference earlier avatars (callbacks, crossovers)

### 4.3 Sample Lesson Structure

**Lesson: The 青 Family (Characters: 清請情晴精睛靜菁)**

```json
{
  "lesson": 15,
  "title": "The Green Dragon's Journey",
  "phonetic_series": "青 qīng",
  "phonetic_avatar": {
    "name": "The Green Dragon",
    "description": "An ancient dragon whose scales shimmer blue-green",
    "sound_cue": "qīng - like 'ching' with a sustained note"
  },
  "theme": "The dragon travels through different realms seeking wisdom",
  "memory_palace": "A mountain path leading through water, temples, hearts, and sky",
  "characters": [
    {
      "character": "清",
      "pinyin": "qīng",
      "tone": 1,
      "meaning": "clear, pure",
      "radical": "氵",
      "setting": "A pristine river",
      "story": "The Green Dragon dives into murky waters. Where his scales touch, the water becomes CLEAR...",
      "tone_emotion": "SING - the sustained purity of crystal water"
    },
    ...
  ]
}
```

---

## 5. Phase 3: Story Generation

### 5.1 Google AI Studio Workflow

**Step 1**: Generate phonetic avatar profiles

```
Create a vivid character profile for the phonetic component 青 (qīng).
This avatar will appear in stories for: 清, 請, 情, 晴, 精, 睛, 靜, 菁
The avatar must:
- Have a name that sounds like or evokes "qīng"
- Have visual features that can adapt to different radical-settings
- Have a personality that makes sense across water/speech/heart/sun contexts
- Be memorable and distinctive
```

**Step 2**: Generate lesson narrative arc

```
Create an immersive narrative arc for a lesson featuring these 8 characters:
清(clear), 請(invite), 情(emotion), 晴(sunny), 精(essence), 睛(eye), 靜(quiet), 菁(luxuriant)

The story must:
- Feature the Green Dragon (青 avatar) as the protagonist
- Move through settings determined by each radical (water→speech→heart→sun→rice→eye→contention→grass)
- Each scene teaches one character through vivid action
- Maintain emotional coherence across the journey
- Use the tone-emotion system: 清(SING), 請(GROAN), 情(GASP), 晴(GASP)...
- Be 800-1200 words total
- Traditional Chinese characters only
```

**Step 3**: Generate individual character stories

```
For the character 清 (qīng, tone 1, "clear/pure"):
- Setting: River/water (from radical 氵)
- Avatar: The Green Dragon
- Tone emotion: SING (sustained, high, pure)

Write a 50-80 word mnemonic story that:
- Shows the Green Dragon interacting with water
- Makes the meaning "clear/pure" unforgettable
- Incorporates the SING tone emotion naturally
- Uses vivid sensory details
```

### 5.2 Quality Criteria for Generated Stories

- [ ] Phonetic avatar is consistent across the lesson
- [ ] Radical-setting matches the character's semantic domain
- [ ] Tone-emotion is woven into the narrative (not just labeled)
- [ ] Story is vivid, sensory, and memorable
- [ ] No invented etymologies for phonetic components
- [ ] Traditional characters used throughout
- [ ] Cultural sensitivity maintained

---

## 6. Phase 4: Implementation

### 6.1 Data Migration

1. Export current lesson data
2. Re-tag all characters with phonetic_series and semantic_radical
3. Reorganize into new lesson groupings
4. Generate new stories via Google AI Studio
5. Import into new lesson JSON files
6. Update lesson metadata (title, theme, memory_palace, etc.)

### 6.2 Code Updates

- [ ] Update `lessonLoader.ts` to handle new lesson structure
- [ ] Add phonetic avatar display to `CharacterIntroduction.tsx`
- [ ] Create "Sound Family" filter/view mode
- [ ] Update lesson selection to show phonetic series info
- [ ] Add phonetic series to mastery game character displays

### 6.3 Validation

- [ ] All 3,035 characters assigned to lessons
- [ ] No duplicate characters across lessons
- [ ] All phonetic series tagged correctly
- [ ] All stories pass quality review
- [ ] Traditional characters verified (no simplified leakage)

---

## 7. Execution Timeline

### Sprint 1: Analysis (Google AI Studio Heavy)

- [ ] Extract phonetic components for all 3,035 characters
- [ ] Group into phonetic series
- [ ] Identify major series (10+ chars) vs minor
- [ ] Create phonetic avatar profiles for top 50 series

### Sprint 2: Architecture

- [ ] Design new lesson groupings
- [ ] Determine lesson sequence
- [ ] Create story templates
- [ ] Generate sample lesson (青 family) as proof of concept

### Sprint 3-6: Content Generation (Google AI Studio Heavy)

- [ ] Generate stories for all lessons, ~25 lessons per sprint
- [ ] Quality review each batch
- [ ] Iterate on avatar consistency

### Sprint 7: Integration

- [ ] Code updates
- [ ] Data migration
- [ ] Testing
- [ ] Launch

---

## 8. Google AI Studio Prompts Library

### Prompt A: Phonetic Analysis

```
Analyze these traditional Chinese characters and output JSON with phonetic series information:
[character list]

For each character provide:
- character: the traditional character
- pinyin: romanization with tone number
- radical: semantic radical
- phonetic: phonetic component (if phono-semantic compound)
- phonetic_series: the series name (e.g., "青 qīng")
- category: "pictograph" | "ideograph" | "phono-semantic" | "other"
```

### Prompt B: Avatar Creation

```
Create a memorable character avatar for the phonetic component [X] (pinyin: [Y]).

This avatar will appear in stories for these characters: [list]
With these radicals/settings: [list]

Requirements:
- Name should evoke the sound [Y]
- Visual appearance should be distinctive and adaptable
- Personality should work across all the different settings
- Should be culturally appropriate for Chinese learning context
- Avoid stereotypes; aim for archetypal/mythological feel

Output:
- Name
- Visual description (2-3 sentences)
- Personality traits (3-5 bullet points)
- Signature action or catchphrase
- How the avatar "sounds" when it appears (onomatopoeia/emotion)
```

### Prompt C: Lesson Narrative

```
Write an immersive lesson narrative featuring [Avatar Name] visiting these locations:
[List of radical-settings]

Teaching these characters: [List with meanings]

Requirements:
- 800-1200 words total
- Each setting = one character learned
- Avatar is the consistent protagonist
- Vivid sensory details
- Emotional arc (beginning, middle, climax, resolution)
- Tone-emotions woven naturally into scenes
- Traditional Chinese characters only
- Culturally respectful
```

### Prompt D: Individual Character Story

```
Write a mnemonic story (50-80 words) for:
Character: [X]
Pinyin: [Y] (tone [Z])
Meaning: [meaning]
Radical/Setting: [radical] = [setting]
Avatar: [avatar name]
Tone emotion: [SING/GASP/GROAN/COMMAND]

The story must:
- Feature the avatar in the setting
- Make the meaning unforgettable
- Incorporate the tone emotion
- Use vivid action and sensory details
- Be standalone but fit into the larger lesson narrative
```

---

## 9. Success Metrics

- **Coverage**: 100% of 3,035 characters assigned to phonetic-grouped lessons
- **Consistency**: Phonetic avatars used consistently across all appearances
- **Quality**: Stories pass blind review for memorability and accuracy
- **Retention**: A/B test shows improved recall vs. old lesson structure
- **User Feedback**: Learners report stories as engaging and helpful

---

## 10. Risks and Mitigations

| Risk                                      | Mitigation                                                |
| ----------------------------------------- | --------------------------------------------------------- |
| Some characters don't fit phonetic series | Create "Ideograph" and "Pictograph" lessons for these     |
| Avatar fatigue (same character too often) | Vary avatar's actions/emotions; use supporting characters |
| Tone-emotion conflicts with story mood    | Plan tone distribution per lesson; adjust narrative       |
| Generated stories inconsistent quality    | Human review all output; iteration cycles                 |
| Traditional/Simplified confusion          | Strict validation; Gemini prompt specifies traditional    |

---

## 11. Next Steps

1. **Immediate**: Run phonetic analysis on Lessons 1-15 as pilot
2. **This Week**: Create avatar profiles for 5 major phonetic series
3. **Proof of Concept**: Generate one complete restructured lesson (青 family)
4. **Review**: Assess quality, iterate on prompts
5. **Scale**: Proceed with full restructuring if PoC succeeds

---

_This plan treats the curriculum as a coherent narrative architecture, not just a database of characters. The phonetic avatars become recurring characters in an epic story of language acquisition._
