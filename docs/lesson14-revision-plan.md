# Lesson 14 Revision Plan: "The Soldier's Dream of Capital"

## Overview

Transform lesson 14 from sparse character data into a rich, cohesive narrative following the gold standard template. This lesson features 23 characters centered around a superfluous army marching toward the capital, carrying dreams of glory through mountains and pavilions.

**Source:** `lesson_stories_prose.md` — official narrative prose

---

## Theme & Narrative Structure

### Title

**"The Soldier's Dream of Capital"**

### Saga

**Empire** — Part of the imperial military narrative arc

### Theme

A superfluous army — an army that no war requires — marches toward the capital. Their thoughts are profound, their armor radiant. Through pits and tall mountains, they learn to enjoy the journey itself. At pavilions they rest, faces shining, until the capital appears — cool, scenic, exactly as the old songs described. The dream was the journey; the capital was just where it ended.

### Memory Palace

**The Road to the Capital** — A long mountain road where soldiers march in formation. The journey moves from superfluous beginning → profound thoughts → radiant army → carrying dreams → crown imagined → dream sustained → pits crossed → tall mountains climbed → enjoyment learned → boots become ripe → pavilions resting → faces shining → capital appears → cool valley → scenery matching songs → arriving at once → circumference walked → soldiers counted → lucky presented → buying supplies → selling begins.

### Callback

Crown recalls Dynasty from Lesson 3

### Narrative Arc

_"The superfluous army marched toward the capital, carrying nothing but a dream."_

Superfluous army → Profound thoughts → Army moves → Radiance catches → Carrying dreams → Crown imagined → Dream sustained → Pits crossed → Tall mountains → Enjoyment learned → Boots ripe → Pavilion rest → Shining faces → Capital appears → Cool descent → Scenery perfect → At once together → Circumference walked → Week to circle → Soldiers counted → Lucky chosen → Buying supplies → Selling begins

---

## Official Narrative Story

From `lesson_stories_prose.md`:

> They were **SUPERFLUOUS (冗)** — an army that no war required.
>
> Their thoughts were **PROFOUND (沉)** — sinking deeper than their footsteps.
>
> The **ARMY (軍)** moved as one, their armor catching **RADIANCE (輝)**.
>
> Each soldier had something **TO CARRY (運)** — a dream, a promise, a reason.
>
> They imagined the **CROWN (冠)** that awaited their general.
>
> This was their **DREAM (夢)** — to witness triumph.
>
> They crossed **PITS (坑)** and valleys without complaint.
>
> The **TALL (高)** mountains did not stop them.
>
> They learned **TO ENJOY (享)** the journey itself.
>
> Their boots became **RIPE (熟)** with dust and memory.
>
> At each **PAVILION (亭)** they rested, their faces **SHINING (亮)**.
>
> Finally: the **CAPITAL (京)** appeared on the horizon.
>
> The air grew **COOL (涼)** as they descended into the valley.
>
> The **SCENERY (景)** was exactly as the old songs described.
>
> They would arrive **AT ONCE (就)** — together, as brothers.
>
> The **CIRCUMFERENCE (周)** of the city walls took a **WEEK (週)** to walk.
>
> Every **SOLDIER (士)** was counted. Every name recorded.
>
> The **LUCKY (吉)** ones would be presented to the Emperor.
>
> They could finally **BUY (買)** supplies — real food, clean clothes.
>
> Street vendors rushed **TO SELL (賣)** them everything.
>
> _The dream was the journey. The capital was just where it ended._

---

## Character Primitives Reference

| Character | Primitives | Notes |
|-----------|------------|-------|
| 冗 | 冖 (cover) + 几 (table/small) | Extra cover = superfluous |
| 沉 | 氵(water) + 沈 (sink) | Water sinking = profound |
| 軍 | 冖 (cover) + 車 (car) | Covered carts = army |
| 輝 | 光 (light) + 車 (car) | Car catching light = radiance |
| 運 | 辶 (walk) + 軍 (army) | Walking army = to carry |
| 冠 | 冖 (cover) + 元 (origin) + 寸 (inch) | Cover with origin = crown |
| 夢 | 艹 + 罒 + 冖 + 夕 | Grass, net, cover, evening = dream |
| 坑 | 土 (earth) + 亢 (high) | Earth high = pit (paradox) |
| 高 | pictograph of tall building | Original tall character |
| 享 | 亠 + 口 + 子 | Roof + mouth + child = enjoy |
| 熟 | 享 (enjoy) + 灬 (fire) | Enjoy over fire = ripe |
| 亭 | 亠 + 口 + 丁 | Roof + mouth + nail = pavilion |
| 亮 | 亠 + 口 + 几 | High, mouth, table = shining |
| 京 | 亠 + 口 + 小 | High, mouth, small = capital |
| 涼 | 氵(water) + 京 (capital) | Water + capital = cool |
| 景 | 日 (sun) + 京 (capital) | Sun over capital = scenery |
| 就 | 京 (capital) + 尤 (dog-like) | Capital + remarkable = at once |
| 周 | 冂 + 土 + 口 | Enclosure, earth, mouth = circumference |
| 週 | 辶 (walk) + 周 (circumference) | Walking circumference = week |
| 士 | pictograph of scholar/soldier | Original soldier character |
| 吉 | 士 (soldier) + 口 (mouth) | Soldier speaks = lucky |
| 買 | 罒 (net) + 貝 (shell) | Net shells = to buy |
| 賣 | 士 + 買 | Soldier selling = to sell |

---

## Tone Distribution Analysis

| Tone | Emotion | Characters |
|------|---------|------------|
| 1 | SING | 軍 (jūn), 輝 (huī), 冠 (guān), 坑 (kēng), 高 (gāo), 亭 (tíng), 京 (jīng), 周 (zhōu), 週 (zhōu) |
| 2 | GASP | 沉 (chén), 涼 (liáng), 吉 (jí) |
| 3 | GROAN | 冗 (rǒng), 享 (xiǎng), 熟 (shú)*, 景 (jǐng), 買 (mǎi) |
| 4 | COMMAND | 運 (yùn), 夢 (mèng), 亮 (liàng), 就 (jiù), 士 (shì), 賣 (mài) |

*Note: 熟 is actually tone 2 (shú), corrected in implementation.

---

## Implementation Checklist

### Phase 1: Data Enhancement
- [ ] Add theme, title, memory_palace, narrative_arc to lesson14.json
- [ ] Enhance all 23 character entries

### Phase 2: Image Assets
- [ ] Create `/public/images/lesson14/` directory
- [ ] Generate Neo-Gongbi images for all 23 characters

### Phase 3: Prompt Documentation
- [ ] Create `/docs/lesson14-image-prompts.md`

---

_Plan created: January 2026_
_For Chinese Characters Learning Game - Lesson 14: The Soldier's Dream of Capital_
