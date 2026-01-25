# Google AI Studio: Phonetic Series Analysis Prompt

> **Instructions**: Copy the prompt below into Google AI Studio (Gemini), then attach or paste the character data from `all-characters-for-analysis.json`.
>
> **Recommended Model**: Gemini 1.5 Pro (for handling 3,035 characters)
>
> **Output**: JSON file with phonetic series analysis for each character

---

## Prompt

````
You are a Chinese linguistics expert specializing in phonetic series (聲系 Sheng Xi) analysis of traditional Chinese characters.

I have a list of 3,035 traditional Chinese characters from a character memorization app. For each character, I need you to identify its phonetic structure.

## Your Task

For each character in the attached JSON, analyze and output:

1. **character** - The original character (unchanged)
2. **pinyin** - The original pinyin (unchanged)
3. **tone** - The original tone number (unchanged)
4. **meaning** - The original meaning (unchanged)
5. **current_lesson** - The original lesson number (unchanged)
6. **category** - One of: "pictograph", "ideograph", "phono-semantic", "indicative", "other"
7. **semantic_radical** - The meaning-bearing component (e.g., "氵 water", "木 tree", "心 heart")
8. **phonetic_component** - The sound-bearing component if phono-semantic (e.g., "青", "馬", "巴")
9. **phonetic_series** - The series name with pinyin (e.g., "青 qīng", "馬 mǎ", "巴 bā")
10. **phonetic_reliability** - "exact" (same pinyin), "close" (similar sound), "historical" (different in modern Mandarin)

## Important Guidelines

1. **Traditional Characters Only** - All analysis should be for traditional characters (繁體字), not simplified
2. **Focus on Structure, Not Etymology** - Identify the phonetic component based on structural analysis, not folk etymology
3. **Be Conservative** - If a character is genuinely a pictograph or ideograph, mark it as such. Don't force a phonetic analysis
4. **Phonetic Series Naming** - Use the base phonetic component character + its pinyin (e.g., "青 qīng" not just "青")
5. **Handle Edge Cases** - Some characters have unclear origins. Mark these as category: "other"

## Example Output Format

For input:
```json
[
  {"character": "清", "pinyin": "qīng", "tone": 1, "meaning": "clear", "current_lesson": 15}
]
````

Output:

```json
[
  {
    "character": "清",
    "pinyin": "qīng",
    "tone": 1,
    "meaning": "clear",
    "current_lesson": 15,
    "category": "phono-semantic",
    "semantic_radical": "氵 water",
    "phonetic_component": "青",
    "phonetic_series": "青 qīng",
    "phonetic_reliability": "exact"
  }
]
```

## Common Phonetic Series to Watch For

These are high-frequency phonetic components. Group characters that share them:

- 青 qīng → 清, 請, 情, 晴, 精, 睛, 靜
- 馬 mǎ → 媽, 罵, 螞, 碼, 瑪
- 巴 bā → 把, 爸, 吧, 疤, 芭
- 方 fāng → 房, 訪, 放, 防, 芳
- 包 bāo → 抱, 飽, 砲, 泡, 跑
- 交 jiāo → 校, 較, 郊, 餃, 絞
- 皮 pí → 疲, 披, 被, 波, 坡
- 主 zhǔ → 住, 注, 柱, 駐, 蛀
- 占 zhān → 店, 站, 點, 粘, 沾
- 合 hé → 答, 塔, 搭, 給, 洽

## Output Requirements

1. Output as valid JSON array
2. Preserve all original fields exactly
3. Add the 5 new analysis fields
4. Process ALL 3,035 characters
5. If you need to output in chunks, indicate clearly where each chunk ends

Please analyze the attached character list now.

````

---

## After Analysis: Next Steps

Once Gemini returns the analyzed data:

1. **Save the output** as `docs/characters-with-phonetic-analysis.json`

2. **Group by phonetic series** - Run this to see the major series:
   ```bash
   cat docs/characters-with-phonetic-analysis.json | jq 'group_by(.phonetic_series) | map({series: .[0].phonetic_series, count: length, characters: [.[].character]}) | sort_by(-.count) | .[0:50]'
````

3. **Identify lesson candidates** - Series with 4+ characters become lesson groupings

4. **Create avatar profiles** - Use the `Avatar Creation` prompt from `phonetic-series-restructuring-plan.md`

---

## Splitting for Large Context

If Gemini struggles with all 3,035 characters at once, split into batches:

```bash
# Split into 6 batches of ~500 characters
node -e "
const chars = require('./docs/all-characters-for-analysis.json');
const batchSize = 500;
for (let i = 0; i < chars.length; i += batchSize) {
  const batch = chars.slice(i, i + batchSize);
  const batchNum = Math.floor(i / batchSize) + 1;
  require('fs').writeFileSync(
    './docs/batch-' + batchNum + '.json',
    JSON.stringify(batch, null, 2)
  );
  console.log('Created batch-' + batchNum + '.json with', batch.length, 'characters');
}
"
```

Then run the analysis on each batch and combine results.
