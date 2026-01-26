# Gemini Batch Prompt (Anti-Repeat Version)

Use this prompt with smaller batches (100 chars). The explicit indexing prevents repetition.

---

## Prompt

```
TASK: Analyze EXACTLY 100 Chinese characters (index 224-323).

CRITICAL RULES:
1. Process characters IN ORDER by their index number
2. Output EXACTLY 100 entries - no more, no less
3. After every 25 characters, output: "--- CHECKPOINT: Completed through index [N] ---"
4. Do NOT repeat any character

For each character, output:
{
  "index": [preserve from input],
  "character": [preserve],
  "pinyin": [preserve],
  "tone": [preserve],
  "meaning": [preserve],
  "current_lesson": [preserve],
  "category": "pictograph" | "ideograph" | "phono-semantic",
  "semantic_radical": "[radical] [meaning]",
  "phonetic_component": "[component]" or null,
  "phonetic_series": "[char] [pinyin]" or null
}

START WITH INDEX 224 (桃).
END WITH INDEX 323 (獄).

Here is the input:
```

Then paste the contents of `docs/gemini-batch-05.json`

---

## After Gemini Responds

Verify with:

```bash
# Count entries (should be 100)
cat response.json | jq 'length'

# Check for duplicates
cat response.json | jq '[.[].character] | group_by(.) | map(select(length > 1))'

# Verify index range
cat response.json | jq '[.[].index] | [min, max]'
```

---

## If Gemini Still Repeats

Try this nuclear option - ask for ONE character at a time in a loop:

```
Analyze this single character. Output JSON only.

Character: 桃
Index: 224
Current info: {"pinyin": "táo", "tone": 2, "meaning": "peach", "current_lesson": 11}

Required output format:
{"index": 224, "character": "桃", "category": "...", "semantic_radical": "...", "phonetic_component": "...", "phonetic_series": "..."}
```

Then repeat for each character. Tedious but foolproof.
