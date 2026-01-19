# Deep Research: Are the Mastery Games Actually Working?

## Context for AI Researchers

This document provides full context for evaluating whether two "mastery games" (Story Mason and Story Detective) actually reinforce the core learning objectives of a Chinese character memorization app. We need honest critique and potential pivots.

---

## Part 1: The Core Learning Goal

The app teaches **3,035 traditional Chinese characters** using a mnemonic system. The fundamental learning objective is:

**Given a character → Recall its meaning AND pronunciation (pinyin + tone)**

Example:

- See: 里
- Recall: "lǐ" (tone 3, the "dipping" tone)
- Recall: "a Li (distance unit)"

### The Mnemonic System

Each character has a **story** that encodes:

1. **Visual components** (primitives) that make up the character
2. **Sound bridge** - an English approximation of the pinyin
3. **Tone emotion** - a visceral emotion that encodes the tone:
   - Tone 1 (flat/high): **SING** - sustained, operatic
   - Tone 2 (rising): **GASP** - surprised, questioning
   - Tone 3 (dipping): **GROAN** - low, weighted
   - Tone 4 (falling): **COMMAND** - sharp, forceful

Example for 里 (lǐ, tone 3, "distance unit"):

```
Story: "The journey measures one LI — then another, then a thousand.
I GROAN 'Liii...' as my legs sink into field after field, soil upon soil."

Sound bridge: LEE = 'LEE-aning under the weight of endless distance'
Tone emotion: GROAN - guttural weight of the endless journey
Primitives: field 田, earth 土
```

The story connects:

- Visual (field 田 + earth 土) → the character shape
- Sound ("Liii...") → the pinyin "lǐ"
- Emotion (GROAN) → tone 3
- Meaning (distance, walking through fields) → "a Li (distance unit)"

---

## Part 2: The Core Game (Working Well)

The app has a **4-round matching game** that progressively removes scaffolding:

| Round | Left Side                | Right Side                    | What's Being Tested                  |
| ----- | ------------------------ | ----------------------------- | ------------------------------------ |
| 1     | Stories                  | Characters + pinyin + meaning | Recognition with full context        |
| 2     | Characters + pinyin only | Stories (scrambled)           | Recall story from character          |
| 3     | Meanings only            | Characters (no hints)         | Produce character from meaning       |
| 4     | Characters only          | Pinyin                        | Produce pronunciation from character |

This progression works because it systematically removes hints and tests the core associations.

---

## Part 3: The Mastery Games (Problematic)

After completing the 4 core rounds, users can unlock "mastery" games. These are the games in question.

### Game 1: Story Mason

**Stated Goal:** "Rebuild the lesson's narrative by arranging story beats in chronological order"

**What Actually Happens:**

1. The game extracts 5 `narrative_position` strings from the lesson's characters
2. These are shuffled and presented as cards
3. User drags/reorders them into "correct" chronological order
4. Accuracy is scored based on position matching

**Example from Lesson 9:**

The 5 segments might be:

1. "The journey begins — measuring the impossible distance to the cave"
2. "Abandoning measurement — commitment over calculation"
3. "The point of no return — entrance sealed behind"
4. "Entering the realm of secrets — blackness engulfs everything"
5. "First adaptation — finding light in darkness"

User arranges these in order. That's it.

**The Problem:**

- The `narrative_position` is **lesson-level framing**, not character-specific mnemonics
- Sequencing these doesn't reinforce: 里 = lǐ = distance
- You could complete this game perfectly without learning a single character
- It tests "can you follow a story arc?" not "can you recall character associations"

**What hints are shown:**

- The character itself
- The narrative position text (which IS the answer)
- No pinyin, no meaning required

---

### Game 2: Story Detective

**Stated Goal:** "Fill in missing words from mnemonic stories, testing recall of tone emotions and sound bridges"

**What Actually Happens:**

1. A character's story is shown with ONE word blanked out
2. The blanked word is either:
   - A tone emotion (SING, GASP, GROAN, COMMAND)
   - An onomatopoeia sound ('Liii...', 'HEIII...', etc.)
3. User picks from 4 multiple-choice options
4. The character, pinyin, AND meaning are all shown as "context"

**Example:**

```
Character: 里
Pinyin: lǐ
Meaning: a Li (distance unit)
[All shown to user as hints]

Story with blank:
"The journey measures one LI — then another, then a thousand.
I _____ 'Liii...' as my legs sink into field after field."

Options: [SING] [GASP] [GROAN] [COMMAND]
```

**The Problem:**

- The character, pinyin, and meaning are GIVEN to you
- You're just doing pattern matching: "tone 3 = GROAN"
- This is pure recognition, not recall
- A user could memorize "tone 3 = GROAN" without ever connecting it to specific characters
- The game doesn't test: "Given 里, what's the pronunciation?" — it TELLS you the pronunciation

**What hints are shown:**

- The character (given)
- The pinyin (given)
- The meaning (given)
- Most of the story (given)
- You just pick which emotion word fits

---

## Part 4: Full Lesson Data (Lesson 9)

Here is the complete data for Lesson 9 so you can see all fields:

```json
{
  "lesson": 9,
  "title": "The Black Ink Banquet",
  "theme": "A secret underground banquet where scholars gather to copy forbidden manuscripts while eating only ink",
  "memory_palace": "The Secret Cave Banquet Hall",
  "narrative_arc": "Journey measured → Quantity calculated → Entrance buried → Blackness engulfs → Spots emerge → Ink consumed → Risk taken → Seekers united → Cave depths reached → Orientation lost → Character esteemed → Texts guarded → Copying finished → Reality found → Completion proclaimed → Nighttime work → Peace in darkness → Banquet celebrated → Invitations mailed → Wealthy attend → Wisdom stored",
  "narrative_story": "In a cave buried a thousand Li away, they hold a banquet where you eat only ink. The journey measured a li — then another, then a thousand. The quantity of distance was meaningless; only commitment mattered. They would bury the entrance after you entered. No going back. Inside, everything was black — the color of secrets, the color of ink. Your eyes adjusted to find spots of lesser darkness. Black ink was the only substance allowed. You drank it. You breathed it. To attend was to risk everything: eyesight, sanity, the surface world. Yet they all came. They were the same — seekers of the hidden word. The cave went deeper than geography. Orientation was a memory. Which way was up? Here, scholars gathered to esteem one thing only: the written character. They guarded texts too dangerous for sunlight. Their task: to finish copying the forbidden manuscripts. This was reality — more real than the kingdoms above. Heralds would proclaim when a new text was complete. All work happened at nighttime — in a cave, there was no day. Despite the darkness, they were peaceful. The ink calmed them. The great banquet came once per year. Invitations were sent by mail — black envelopes, black ink, black wax. Only the wealthy could afford the journey. Those who returned learned to store up what they had learned — hidden, protected, waiting. In a cave buried a thousand Li away, knowledge eats itself and grows stronger.",
  "characters": [
    {
      "id": 169,
      "character": "里",
      "pinyin": "lǐ",
      "tone": 3,
      "meaning": "a Li (distance unit)",
      "mnemonic_image": "A field atop soil - the earth measured in walking distances",
      "sound_bridge": "LEE = 'LEE-aning under the weight of endless distance'",
      "story": "The journey measures one LI — then another, then a thousand. I GROAN 'Liii...' as my legs sink into field after field, soil upon soil. The quantity of distance crushes me, but only commitment matters now.",
      "tone_emotion": "GROAN - guttural weight of the endless journey",
      "primitives": ["field 田", "earth 土"],
      "narrative_position": "The journey begins — measuring the impossible distance to the cave"
    },
    {
      "id": 170,
      "character": "量",
      "pinyin": "liàng",
      "tone": 4,
      "meaning": "quantity",
      "mnemonic_image": "Sun over a li - measuring distance by daylight",
      "sound_bridge": "LYAHNG = 'Lee-YAHNG! Count them sharply!'",
      "story": "The QUANTITY of distance was meaningless. 'LYAHNG!' I COMMAND myself to stop counting. Only commitment matters — not how many li remain. The sun measures what my feet cannot.",
      "tone_emotion": "COMMAND - sharp dismissal of endless calculation",
      "primitives": ["sun 日", "one 一", "li 里"],
      "narrative_position": "Abandoning measurement — commitment over calculation"
    },
    {
      "id": 171,
      "character": "埋",
      "pinyin": "mái",
      "tone": 2,
      "meaning": "to bury",
      "mnemonic_image": "Earth covering the li - the entrance sealed forever",
      "sound_bridge": "MY = 'MY way back is gone?!'",
      "story": "They BURY the entrance after I enter. I GASP 'MY?!' — rising disbelief — as earth swallows the li I just walked. No going back. The soil seals my fate.",
      "tone_emotion": "GASP - rising shock at permanent entombment",
      "primitives": ["earth 土", "li 里"],
      "narrative_position": "The point of no return — entrance sealed behind"
    },
    {
      "id": 172,
      "character": "黑",
      "pinyin": "hēi",
      "tone": 1,
      "meaning": "black",
      "mnemonic_image": "Fire meeting earth in darkness - the color of secrets",
      "sound_bridge": "HAY = 'HAY-lo of absolute darkness'",
      "story": "Inside, everything is BLACK — the color of secrets, the color of ink. I SING 'HEIII...' into the void, my voice sustained and eternal. Fire and earth fused into perfect darkness. I cannot see my own hands.",
      "tone_emotion": "SING - sustained call into absolute blackness",
      "primitives": ["fire dots 灬", "field 田", "earth 土"],
      "narrative_position": "Entering the realm of secrets — blackness engulfs everything"
    },
    {
      "id": 173,
      "character": "點",
      "pinyin": "diǎn",
      "tone": 3,
      "meaning": "spot",
      "mnemonic_image": "Black with a divining mark - spots of lesser darkness",
      "sound_bridge": "DYEN = 'DI-EN, the spots emerge slowly'",
      "story": "My eyes adjust to find SPOTS of lesser darkness. I GROAN 'Dyennn...' — low and straining — as each spot emerges slowly from the black. Divine marks in the void guide my way.",
      "tone_emotion": "GROAN - guttural strain of eyes adjusting",
      "primitives": ["black 黑", "divine 占"],
      "narrative_position": "First adaptation — finding light in darkness"
    },
    {
      "id": 174,
      "character": "墨",
      "pinyin": "mò",
      "tone": 4,
      "meaning": "black ink",
      "mnemonic_image": "Black substance ground from earth - the only food allowed",
      "sound_bridge": "MWO = 'MO-re ink! Drink it!'",
      "story": "BLACK INK is the only substance allowed. 'MO!' I COMMAND myself to drink. You drink it. You breathe it. The ink becomes your blood, your thoughts, your very existence in this cave.",
      "tone_emotion": "COMMAND - sharp demand to consume the forbidden substance",
      "primitives": ["black 黑", "earth 土"],
      "narrative_position": "Total immersion — ink becomes sustenance"
    },
    {
      "id": 175,
      "character": "冒",
      "pinyin": "mào",
      "tone": 4,
      "meaning": "to risk",
      "mnemonic_image": "Eye daring beneath a cover - risking everything",
      "sound_bridge": "MAO = 'MAO-ve forward despite danger!'",
      "story": "To attend is TO RISK everything: eyesight, sanity, the surface world. 'MAO!' I COMMAND my fear to silence. My eye dares what my body fears. There is no retreat.",
      "tone_emotion": "COMMAND - sharp defiance of survival instinct",
      "primitives": ["cover 冃", "eye 目"],
      "narrative_position": "The price of knowledge — risking everything"
    },
    {
      "id": 176,
      "character": "同",
      "pinyin": "tóng",
      "tone": 2,
      "meaning": "same",
      "mnemonic_image": "One mouth within an enclosure - all voices become one",
      "sound_bridge": "TOHNG = 'We're the same... TOHNG-ether?'",
      "story": "Yet they all come. They are the SAME — seekers of the hidden word. I GASP 'TOHNG?!' — are we truly together in this? One mouth, one purpose, enclosed in darkness. We are identical now.",
      "tone_emotion": "GASP - rising recognition of unity",
      "primitives": ["enclosure 冂", "one 一", "mouth 口"],
      "narrative_position": "Unity in darkness — all seekers become one"
    },
    {
      "id": 177,
      "character": "洞",
      "pinyin": "dòng",
      "tone": 4,
      "meaning": "cave",
      "mnemonic_image": "Water flowing through sameness - a cave deeper than geography",
      "sound_bridge": "DONG = 'DONG! The cave echoes deeper'",
      "story": "The CAVE goes deeper than geography. 'DONG!' my footstep COMMANDS an echo that never returns. Water and sameness merge here — all seekers become one in the depths that swallow direction itself.",
      "tone_emotion": "COMMAND - sharp echo swallowed by infinite depth",
      "primitives": ["water 氵", "same 同"],
      "narrative_position": "The descent continues — geography loses meaning"
    },
    {
      "id": 178,
      "character": "向",
      "pinyin": "xiàng",
      "tone": 4,
      "meaning": "orientation",
      "mnemonic_image": "A mouth facing under a roof - which way to speak",
      "sound_bridge": "SHYANG = 'SHYANG! Which direction?!'",
      "story": "ORIENTATION is a memory. 'SHYANG!' I COMMAND my sense of direction to return. Which way is up? The mouth under the roof speaks, but I cannot tell if it faces forward or back.",
      "tone_emotion": "COMMAND - sharp demand for lost bearings",
      "primitives": ["roof 宀", "mouth 口"],
      "narrative_position": "Disorientation — direction becomes meaningless"
    },
    {
      "id": 179,
      "character": "尚",
      "pinyin": "shàng",
      "tone": 4,
      "meaning": "to esteem",
      "mnemonic_image": "Small marks over an enclosure with a mouth - holding something in high regard",
      "sound_bridge": "SHAHNG = 'SHAHNG-tify the written word!'",
      "story": "Here, scholars gather TO ESTEEM one thing only. 'SHAHNG!' they COMMAND reverence for the written word. Small and humble, yet held highest. In darkness, ink is sacred.",
      "tone_emotion": "COMMAND - sharp declaration of reverence",
      "primitives": ["small 小", "enclosure 冂", "mouth 口"],
      "narrative_position": "The purpose revealed — reverence for writing"
    },
    {
      "id": 180,
      "character": "字",
      "pinyin": "zì",
      "tone": 4,
      "meaning": "character",
      "mnemonic_image": "A child under a roof - learning the written word",
      "sound_bridge": "ZIH = 'ZIH! Each character is sacred!'",
      "story": "The written CHARACTER is all that matters here. 'ZIH!' the master COMMANDS attention. A child under a roof, learning stroke by stroke. Each character copied is a child born in darkness.",
      "tone_emotion": "COMMAND - sharp focus on the sacred word",
      "primitives": ["roof 宀", "child 子"],
      "narrative_position": "The object of worship — the written character"
    },
    {
      "id": 181,
      "character": "守",
      "pinyin": "shǒu",
      "tone": 3,
      "meaning": "to guard",
      "mnemonic_image": "Inch by inch under a roof - guarding with patience",
      "sound_bridge": "SHO = 'SHO-ulder the burden of protection'",
      "story": "They GUARD texts too dangerous for sunlight. I GROAN 'Shooo...' — the weight of protection presses down. Inch by inch under this roof, we shoulder secrets that could burn the world above.",
      "tone_emotion": "GROAN - guttural burden of sacred duty",
      "primitives": ["roof 宀", "inch 寸"],
      "narrative_position": "The duty — guarding forbidden knowledge"
    },
    {
      "id": 182,
      "character": "完",
      "pinyin": "wán",
      "tone": 2,
      "meaning": "to finish",
      "mnemonic_image": "Origin completed under a roof - the task fulfilled",
      "sound_bridge": "WAHN = 'WAHN more to go? We're done?!'",
      "story": "Their task: TO FINISH copying the forbidden manuscripts. I GASP 'WAHN?!' — is it truly complete? The origin returns under this roof. What began in darkness ends in darkness.",
      "tone_emotion": "GASP - rising surprise at completion",
      "primitives": ["roof 宀", "origin 元"],
      "narrative_position": "The goal — completing the sacred copies"
    },
    {
      "id": 183,
      "character": "實",
      "pinyin": "shí",
      "tone": 2,
      "meaning": "reality",
      "mnemonic_image": "Piercing truth under a roof - what is truly real",
      "sound_bridge": "SHIH = 'Is SHIH-s real?!'",
      "story": "This is REALITY — more real than the kingdoms above. I GASP 'SHIH?!' — is this the truth? The piercing clarity under this roof reveals: surface life was the illusion. This darkness is real.",
      "tone_emotion": "GASP - rising realization of true reality",
      "primitives": ["roof 宀", "pierce 貫"],
      "narrative_position": "The revelation — this is the true world"
    },
    {
      "id": 184,
      "character": "宣",
      "pinyin": "xuān",
      "tone": 1,
      "meaning": "to proclaim",
      "mnemonic_image": "Spanning announcement under a roof - the herald speaks",
      "sound_bridge": "SHWEN = 'SHWEN-ounce it to all!'",
      "story": "Heralds PROCLAIM when a new text is complete. I SING 'SHWENNN...' — my voice sustained across the cavern. The announcement spans from roof to depths. Another manuscript saved from forgetting.",
      "tone_emotion": "SING - sustained announcement echoing through darkness",
      "primitives": ["roof 宀", "span 亘"],
      "narrative_position": "The celebration — proclaiming each completion"
    },
    {
      "id": 185,
      "character": "宵",
      "pinyin": "xiāo",
      "tone": 1,
      "meaning": "nighttime",
      "mnemonic_image": "Resembling shelter under a roof - eternal night",
      "sound_bridge": "SHYAO = 'SHYAO-w me the night that never ends'",
      "story": "All work happens at NIGHTTIME — in a cave, there is no day. I SING 'SHYAOOO...' — sustained like the endless dark. Night resembles shelter here. We have forgotten what sun looks like.",
      "tone_emotion": "SING - sustained acceptance of eternal night",
      "primitives": ["roof 宀", "resemble 肖"],
      "narrative_position": "The condition — eternal nighttime work"
    },
    {
      "id": 186,
      "character": "安",
      "pinyin": "ān",
      "tone": 1,
      "meaning": "peaceful",
      "mnemonic_image": "A woman safe under a roof - peace found in darkness",
      "sound_bridge": "AHN = 'AHN-xiety dissolves in ink'",
      "story": "Despite the darkness, we are PEACEFUL. I SING 'AAAHN...' — sustained and soft — as the ink calms us all. A woman under a roof: safety in submission. The darkness is not enemy but friend.",
      "tone_emotion": "SING - sustained breath of surrendered peace",
      "primitives": ["roof 宀", "woman 女"],
      "narrative_position": "The transformation — finding peace in eternal dark"
    },
    {
      "id": 187,
      "character": "宴",
      "pinyin": "yàn",
      "tone": 4,
      "meaning": "banquet",
      "mnemonic_image": "Sun and woman feasting under a roof - the annual celebration",
      "sound_bridge": "YAN = 'YAN-k open the feast!'",
      "story": "The great BANQUET comes once per year. 'YAN!' the herald COMMANDS the celebration to begin. Under the cave's roof, sun-memory and women mingle — we feast on knowledge, drunk on ink.",
      "tone_emotion": "COMMAND - sharp call to annual celebration",
      "primitives": ["roof 宀", "sun 日", "woman 女"],
      "narrative_position": "The climax — the annual ink banquet"
    },
    {
      "id": 188,
      "character": "寄",
      "pinyin": "jì",
      "tone": 4,
      "meaning": "to mail",
      "mnemonic_image": "Something strange sent from under a roof - black invitations",
      "sound_bridge": "JEE = 'JEE-liver the black envelope!'",
      "story": "Invitations are sent BY MAIL — black envelopes, black ink, black wax. 'JEE!' the courier COMMANDS the strange package to travel. From under our roof, secrets journey to those worthy of knowing.",
      "tone_emotion": "COMMAND - sharp dispatch of forbidden invitations",
      "primitives": ["roof 宀", "strange 奇"],
      "narrative_position": "The summons — black invitations sent forth"
    },
    {
      "id": 189,
      "character": "富",
      "pinyin": "fù",
      "tone": 4,
      "meaning": "wealthy",
      "mnemonic_image": "A full house under a roof - abundance within",
      "sound_bridge": "FOO = 'FOO-lish not to invest in knowledge!'",
      "story": "Only the WEALTHY can afford the journey. 'FOO!' they COMMAND their gold to carry them here. A full house under a roof — but the true wealth is not gold. It is what they learn in darkness.",
      "tone_emotion": "COMMAND - sharp assertion of what wealth truly means",
      "primitives": ["roof 宀", "full 畐"],
      "narrative_position": "The price — only the wealthy can attend"
    },
    {
      "id": 190,
      "character": "貯",
      "pinyin": "zhù",
      "tone": 4,
      "meaning": "to store up",
      "mnemonic_image": "Shells stored for keeping - preserving wisdom",
      "sound_bridge": "JOO = 'JOO-st keep it safe forever!'",
      "story": "Those who return learn TO STORE UP what they have learned. 'JOO!' I COMMAND myself to preserve every character. Hidden, protected, waiting — shells of knowledge buried like treasure until the world is ready.",
      "tone_emotion": "COMMAND - sharp vow to preserve forbidden knowledge",
      "primitives": ["shell 貝", "store 宁"],
      "narrative_position": "The legacy — storing wisdom for future generations"
    }
  ]
}
```

---

## Part 5: The Critical Questions

### For Story Mason:

1. **Does arranging `narrative_position` strings reinforce character-meaning-sound associations?**
   - The narrative_position is lesson framing, not character mnemonics
   - You never see pinyin, you never produce meanings

2. **What cognitive skill is actually being tested?**
   - Story sequencing / narrative comprehension
   - NOT character recall

3. **Could a user "master" this game without learning any characters?**
   - Yes. The game is entirely about ordering story beats.

4. **Should this game be scrapped, modified, or pivoted?**
   - If modified: How could it incorporate actual character-meaning-sound testing?
   - If pivoted: What game mechanic would actually test character mastery?

### For Story Detective:

1. **Why are the character, pinyin, AND meaning all given as hints?**
   - This reduces the game to "which emotion word fits tone X?"
   - It's pattern matching, not character recall

2. **What if we removed hints?**
   - Show only the story with a blank
   - User must recall which CHARACTER this story belongs to
   - Or: Show the character, blank the SOUND, don't show pinyin

3. **Is testing "tone → emotion" actually useful?**
   - Learning "tone 3 = GROAN" is useful
   - But you should have to PRODUCE this from seeing a character, not recognize it

4. **What would a harder, more useful version look like?**
   - Given: 里 (character only)
   - Task: What emotion word encodes its tone?
   - No pinyin shown, no meaning shown

---

## Part 6: Alternative Game Concepts to Evaluate

### Concept A: "Sound Recall"

- Show: Character only (e.g., 里)
- Task: Type or select the pinyin (lǐ)
- No story, no hints — pure recall
- Tests the actual learning objective

### Concept B: "Emotion Recall"

- Show: Character + meaning (里 = distance)
- Task: Select the tone emotion (SING/GASP/GROAN/COMMAND)
- Tests: Do you remember the tone for this character?

### Concept C: "Story Completion"

- Show: Character + partial story with MULTIPLE blanks
- Task: Fill in sound bridge AND emotion
- Harder because you must recall both

### Concept D: "Reverse Lookup"

- Show: Pinyin only (lǐ, tone 3)
- Task: Select the correct character from 4 options
- Tests sound-to-character association

### Concept E: "Primitive Assembly"

- Show: Meaning + primitives listed (field 田, earth 土)
- Task: Which character is this?
- Tests structural understanding

---

## Part 7: What We Need From This Research

1. **Honest assessment:** Are Story Mason and Story Detective pedagogically valuable as-is?

2. **Diagnosis:** What exactly are they testing vs. what they SHOULD test?

3. **Recommendations:**
   - Scrap and replace?
   - Modify with specific changes?
   - Keep one, replace the other?

4. **Alternative designs:** If we pivot, what game mechanics would actually reinforce:
   - Character → Meaning
   - Character → Pinyin
   - Character → Tone
   - The mnemonic story as a bridge (not as the end goal)

5. **Implementation constraints:**
   - Must work on mobile (touch-friendly)
   - Must use existing lesson data structure
   - Should take 2-5 minutes per lesson
   - Should feel like a "mastery" challenge, not repetition of core rounds

---

## Summary

The current mastery games may be entertaining but they don't clearly reinforce the core learning objective: **see character → recall meaning + pronunciation**.

Story Mason tests narrative sequencing.
Story Detective tests emotion-word recognition with excessive hints.

Neither requires the user to PRODUCE character knowledge from memory.

We need games that remove scaffolding and test actual recall, not recognition.
