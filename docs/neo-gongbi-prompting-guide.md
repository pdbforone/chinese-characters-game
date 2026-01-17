# Neo-Gongbi Image Prompting Guide for Nano Banana

> Research synthesis for generating mnemonic character images using Google's Gemini-based image generation (Nano Banana / Nano Banana Pro)

**Verified accuracy:** ~95% (Grok validation, January 2026)

---

## Core Principle: "Director's Brief" Not "Tag Soup"

Nano Banana excels at reasoning through natural, conversational language. Use full sentences, narrative flow, and context over comma-separated tags.

**Why it works:**

- Reduces randomness in outputs
- Improves composition and style adherence
- Enables subtle integrations (like character shapes emerging naturally)

---

## Optimal Prompt Structure (5-Step Flow)

### 1. Style Anchor

Start with medium and artistic style to ground the generation.

```
A contemporary Neo-Gongbi painting on sized silk...
```

### 2. Narrative Scene

Build a vivid scene with specific details.

```
...depicting [scene from mnemonic story] with [specific visual elements]...
```

### 3. Shape Constraint

Describe how the character shape emerges from the composition.

```
...the arrangement of elements ultimately resembling the Chinese character [字]...
```

### 4. Material Justification (CRITICAL)

Provide a physical, in-world reason for the shape. This prevents forced or overlaid looks.

**Bad:** "...resembling the character 木"
**Good:** "...as if ancient roots grew in the pattern children traced when learning to write 木"

### 5. Technical Refinement

Add artistic quality markers.

```
...rendered with fine-line gongbi technique, mineral pigments, subtle ink washes, visible silk texture.
```

---

## The "Material Justification" Technique

The model reasons step-by-step. Giving it a logical "why" for the character shape creates organic, believable integrations.

### Examples:

| Character     | Bad Approach            | Good Approach                                                          |
| ------------- | ----------------------- | ---------------------------------------------------------------------- |
| 木 (tree)     | "tree shaped like 木"   | "ancient roots grew in the pattern farmers memorized for generations"  |
| 山 (mountain) | "mountains forming 山"  | "three peaks worn by millennia into the shape scholars painted"        |
| 水 (water)    | "water looking like 水" | "streams carved channels that mirror the calligrapher's brush strokes" |
| 火 (fire)     | "flames shaped as 火"   | "embers rose in the pattern temple guardians recognized as sacred"     |

---

## Character Integration Phrasing

Adjust intensity based on priority:

| Priority                   | Phrasing                                                                | Use Case                    |
| -------------------------- | ----------------------------------------------------------------------- | --------------------------- |
| Subtle (artistic priority) | "ultimately resembling", "subtly evoking", "echoing the form of"        | When aesthetic matters more |
| Medium                     | "arranged to suggest", "forming the silhouette of"                      | Balanced approach           |
| Strong (learning priority) | "precisely tracing", "exact configuration of", "unmistakably depicting" | When recognizability is key |

---

## Neo-Gongbi Keywords

### USE These:

- "contemporary Neo-Gongbi painting"
- "sized silk" or "treated xuan paper"
- "fine-line gongbi technique"
- "mineral pigments" (azurite, malachite, cinnabar)
- "subtle ink washes"
- "meticulous brushwork"
- "layered transparent washes"
- "visible silk/paper texture"
- "gold leaf accents" (sparingly)
- "atmospheric perspective"
- "negative space as compositional element"

### AVOID These:

- "photorealistic" (drifts to Western realism)
- "anime" or "manga" (wrong aesthetic)
- "digital art" (loses traditional feel)
- "cartoon" (undermines sophistication)
- "3D render" (wrong medium)
- "watercolor" (different technique)
- Generic terms: "beautiful", "amazing", "perfect"

### Bonus Tip:

Add "no visible text or calligraphy unless integrated naturally" to prevent unwanted text overlays.

---

## Optimal Prompt Length

**Sweet spot:** 100-150 words (dense and descriptive)
**Acceptable range:** 75-200 words

Nano Banana handles longer prompts well, but concise narrative shines. Dense description wins over sheer length.

---

## Advanced: Multimodal Workflow

Nano Banana strongly supports uploading reference images. This is one of its biggest strengths.

### Workflow:

1. Create a simple B&W sketch of the character
2. Upload as reference image
3. Prompt: "Use this sketch as the exact compositional guide, replacing lines with [natural elements from story]"

### Example Prompt with Reference:

```
Reference the uploaded sketch for exact stroke geometry. Transform each stroke into [element]: the horizontal becomes a fallen log, the vertical a standing pine, the diagonal a leaning bamboo...
```

This gives incredible precision for complex characters.

---

## Template for Character Mnemonic Images

```
A contemporary Neo-Gongbi painting on sized silk depicting [SCENE FROM STORY].

[DETAILED NARRATIVE: 2-3 sentences describing the visual scene with specific elements]

The composition arranges these elements to [INTEGRATION PHRASE] the Chinese character [字], as if [MATERIAL JUSTIFICATION - physical reason for the shape].

Rendered with fine-line gongbi technique, layered mineral pigments (specify: azurite blues, malachite greens, cinnabar reds as appropriate), subtle ink washes for depth, and visible silk texture. [MOOD: atmospheric/intimate/dynamic as fits the story]. No visible text or calligraphy.
```

---

## Tone-Specific Visual Guidance

Match visual energy to the character's tone:

| Tone        | Emotion | Visual Energy                               |
| ----------- | ------- | ------------------------------------------- |
| 1 (flat)    | SING    | Serene, sustained, balanced composition     |
| 2 (rising)  | GASP    | Upward movement, surprise, lifting elements |
| 3 (dipping) | GROAN   | Heavy, grounded, weight pressing down       |
| 4 (falling) | COMMAND | Sharp, decisive, downward energy            |
| 5 (neutral) | whisper | Soft, undefined, subtle presence            |

---

## Quality Checklist

Before finalizing a prompt, verify:

- [ ] Style anchor is first (Neo-Gongbi, silk/paper)
- [ ] Narrative is vivid and specific (not generic)
- [ ] Character shape has material justification
- [ ] Integration phrasing matches priority (subtle vs. strong)
- [ ] Technical keywords reinforce traditional aesthetic
- [ ] No forbidden terms (photorealistic, anime, etc.)
- [ ] Length is 100-150 words
- [ ] Tone emotion is reflected in visual energy

---

## Example: Complete Prompt for 木 (mù, tree)

```
A contemporary Neo-Gongbi painting on sized silk depicting a solitary pine tree in a misty mountain clearing at dawn.

The ancient tree stands resolute, its trunk perfectly vertical while two primary branches extend horizontally at shoulder height, balanced and symmetrical. Below, visible roots spread outward where they grip the rocky soil, their pattern worn by centuries into grooves that local children trace when learning their first characters.

The composition arranges trunk, branches, and roots to subtly evoke the Chinese character 木, as if the tree itself grew to embody the word it represents—nature and language intertwined.

Rendered with fine-line gongbi technique, layered malachite greens and ink washes, atmospheric mist softening the background, visible silk texture. Contemplative and grounded. No visible text.
```

---

_Document created: January 2026_
_Based on multi-model research synthesis (Gemini, Grok, GPT)_
_For use with Chinese Characters Learning Game mnemonic image generation_
