# Multi-Model Research Loop: Mastery Games Critique

Use these prompts in sequence to get validated recommendations.

---

## Prompt 1: Gemini Deep Research

**Goal:** Comprehensive analysis of whether the games reinforce learning objectives

```
I need a deep pedagogical analysis of two "mastery games" in a Chinese character learning app.

CONTEXT: The app teaches 3,035 traditional Chinese characters using mnemonic stories. Each character has:
- A story connecting visual components to meaning and pronunciation
- A "sound bridge" (English approximation of pinyin)
- A "tone emotion" (SING=tone1, GASP=tone2, GROAN=tone3, COMMAND=tone4)

THE CORE LEARNING OBJECTIVE:
Given a character (e.g., 里) → Recall pinyin (lǐ) + tone (3) + meaning (distance unit)

THE WORKING CORE GAME (4 rounds):
1. Stories → Characters (with pinyin+meaning hints)
2. Characters+pinyin → Stories
3. Meanings → Characters (no hints)
4. Characters → Pinyin (no hints)

This progressively removes scaffolding. It works.

THE PROBLEMATIC MASTERY GAMES:

GAME 1 - "Story Mason":
- Shows 5 "narrative_position" strings (lesson-level story beats)
- User arranges them in chronological order
- Example strings: "The journey begins — measuring the impossible distance", "The point of no return — entrance sealed behind"
- Character, pinyin, meaning are NOT involved
- PROBLEM: This tests story sequencing, not character recall

GAME 2 - "Story Detective":
- Shows a character's story with ONE word blanked (either the tone emotion or onomatopoeia)
- User picks from 4 options (SING/GASP/GROAN/COMMAND or sounds like 'Liii...')
- THE CHARACTER, PINYIN, AND MEANING ARE ALL SHOWN AS HINTS
- PROBLEM: User just pattern-matches "tone 3 = GROAN" without recalling character associations

EXAMPLE CHARACTER DATA (里):
{
  "character": "里",
  "pinyin": "lǐ",
  "tone": 3,
  "meaning": "a Li (distance unit)",
  "story": "The journey measures one LI — then another, then a thousand. I GROAN 'Liii...' as my legs sink into field after field.",
  "sound_bridge": "LEE = 'LEE-aning under the weight of endless distance'",
  "tone_emotion": "GROAN - guttural weight of the endless journey",
  "primitives": ["field 田", "earth 土"],
  "narrative_position": "The journey begins — measuring the impossible distance to the cave"
}

RESEARCH QUESTIONS:

1. Are these games testing the right cognitive skills for character memorization?

2. What does learning science say about:
   - Recognition vs. recall in memory formation
   - The role of "desirable difficulty" in learning
   - Scaffolding removal in mastery testing

3. How should mastery games differ from initial learning games?

4. What game mechanics would actually test:
   - Character → Meaning recall
   - Character → Pronunciation recall
   - Character → Tone recall
   - WITHOUT showing the answer in the question?

5. Should we scrap these games entirely, or can they be modified?

6. Propose 3-5 alternative game concepts that would genuinely test mastery.

Please provide specific, actionable recommendations with pedagogical justification.
```

---

## Prompt 2: Grok Critique

**Goal:** Sharp, contrarian analysis to stress-test the Gemini findings

```
I need you to critique a pedagogical analysis of mastery games in a Chinese character learning app. Be sharp and contrarian — find the weaknesses.

BACKGROUND:
- App teaches Chinese characters via mnemonic stories
- Core learning goal: See character → Recall meaning + pronunciation
- Core game (working): 4-round matching with progressive hint removal
- Mastery games (problematic): Story Mason (sequence narrative beats) and Story Detective (fill in blanks with all hints shown)

GEMINI'S ANALYSIS:
[Paste Gemini's response here]

CRITIQUE QUESTIONS:

1. Where is Gemini's analysis weak, incomplete, or potentially wrong?

2. Are there valid pedagogical arguments FOR the current games that Gemini missed?
   - Could narrative sequencing reinforce memory palace associations?
   - Could emotion recognition have transfer value even with hints?

3. Challenge Gemini's alternative game proposals:
   - Which ones are impractical for mobile?
   - Which ones might be too frustrating (causing users to quit)?
   - Which ones might not actually be better than the current games?

4. What's the risk of over-correcting?
   - Making games too hard could hurt engagement
   - Pure recall without any context could feel disconnected from the stories

5. What did Gemini fail to consider about:
   - User motivation and engagement
   - The difference between "testing" and "reinforcing"
   - The role of the mnemonic stories (are they the method or the goal?)

6. Steel-man the current games: Make the best possible case for why Story Mason and Story Detective might actually be pedagogically sound, even if not obviously so.

Be harsh. Find the holes. Challenge assumptions.
```

---

## Prompt 3: GPT Synthesis

**Goal:** Integrate both perspectives into a balanced, implementable plan

```
I need you to synthesize two analyses of mastery games in a Chinese character learning app into a balanced action plan.

BACKGROUND:
- App teaches Chinese characters via mnemonic stories
- Core learning goal: See character → Recall meaning + pronunciation
- Mastery games are meant to be harder challenges after completing core rounds
- Current games: Story Mason (narrative sequencing) and Story Detective (cloze with hints)

GEMINI'S ANALYSIS (research-focused):
[Paste Gemini's response here]

GROK'S CRITIQUE (contrarian):
[Paste Grok's response here]

SYNTHESIS TASKS:

1. Where do Gemini and Grok AGREE? (These are high-confidence findings)

2. Where do they DISAGREE? For each disagreement:
   - Who has the stronger argument?
   - Is there a middle ground?
   - What would we need to know to resolve this?

3. Categorize the current games:
   - Scrap entirely?
   - Modify significantly?
   - Keep with minor tweaks?
   - Keep as optional/supplementary?

4. From all proposed alternatives, select the TOP 3 game concepts that:
   - Actually test the core learning objective
   - Are implementable on mobile
   - Balance difficulty with engagement
   - Use the existing data structure

5. For each recommended game, provide:
   - Clear mechanic description
   - What it tests
   - What data fields it uses
   - Why it's better than current games
   - Potential downsides to watch for

6. Create a DECISION MATRIX:
   | Game Concept | Tests Recall? | Mobile-Friendly? | Uses Existing Data? | Engagement Risk | Recommendation |
   |--------------|---------------|------------------|---------------------|-----------------|----------------|

7. Final recommendation: What should we build? Prioritize 1-2 games to implement first.
```

---

## Prompt 4: Gemini Consensus

**Goal:** Final validation and implementation spec

```
I need you to validate a synthesis of pedagogical research and produce final implementation specifications.

BACKGROUND:
- Chinese character learning app with mnemonic stories
- Core goal: Character → Meaning + Pronunciation recall
- Current mastery games are being evaluated for replacement/modification

PREVIOUS ANALYSES:

GEMINI (initial research):
[Paste or summarize Gemini's key findings]

GROK (critique):
[Paste or summarize Grok's key challenges]

GPT (synthesis):
[Paste GPT's full response including recommendations]

VALIDATION TASKS:

1. Review the synthesis. Is the final recommendation sound?
   - Does it address the core learning objective?
   - Does it balance rigor with engagement?
   - Is anything missing?

2. Flag any remaining concerns or risks.

3. For the TOP 2 recommended games, provide IMPLEMENTATION SPECS:

   GAME A: [Name]
   - Exact user flow (step by step)
   - What is shown on screen at each step
   - What user action is required
   - How scoring works
   - What data fields are used
   - Edge cases to handle
   - Accessibility considerations

   GAME B: [Name]
   - [Same structure]

4. Provide a MIGRATION STRATEGY:
   - Should we replace Story Mason and Story Detective immediately?
   - Or run new games alongside them?
   - How do we handle users who already have "mastered" status?

5. Final verdict:
   - Confidence level (high/medium/low) in recommendations
   - What we'd need to validate through user testing
   - Any recommendations that should wait for more data

This is the final check before implementation. Be thorough.
```

---

## How to Use This Loop

1. **Run Prompt 1** with Gemini (Deep Research mode if available)
2. **Copy Gemini's response** into Prompt 2 and run with Grok
3. **Copy both responses** into Prompt 3 and run with GPT-4
4. **Copy all three** into Prompt 4 and run with Gemini for final validation

The output of Prompt 4 should give you implementation-ready specifications.
