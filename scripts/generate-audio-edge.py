#!/usr/bin/env python3
"""
Audio Generation Script using Edge TTS (100% Free, No Signup)

Generates pronunciation audio for all 3,035 characters using Microsoft Edge TTS.
This is FREE and requires NO credit card or API keys.

Setup:
    pip install edge-tts

Usage:
    python3 scripts/generate-audio-edge.py

Output:
    /public/audio/char_{CHARACTER}.mp3 (e.g., char_木.mp3)
    /lib/data/audio-manifest.json (maps characters to filenames)

Technical Notes:
- Uses zh-CN-XiaoxiaoNeural voice (female, natural Mandarin tones)
- Generates ~16kHz MP3 at 96kbps (~20KB per character)
- Total size estimate: 3,035 chars × 20KB ≈ 60MB (acceptable for web app)
- Research shows this voice has excellent tone accuracy
"""

import asyncio
import edge_tts
import json
import os
from pathlib import Path

# Paths
ROOT_DIR = Path(__file__).parent.parent
AUDIO_DIR = ROOT_DIR / "public" / "audio"
LESSON_DIR = ROOT_DIR / "lib" / "data"
MANIFEST_FILE = LESSON_DIR / "audio-manifest.json"

# Voice configuration
VOICE = "zh-CN-XiaoxiaoNeural"  # Female voice with excellent tone rendering
RATE = "+0%"  # Normal speed (can adjust: +10% for faster, -10% for slower)
VOLUME = "+0%"  # Normal volume


def get_all_characters():
    """Extract all unique characters from lesson files."""
    characters_map = {}  # character -> {pinyin, tone, meaning}

    for lesson_num in range(1, 113):  # Lessons 1-112
        lesson_file = LESSON_DIR / f"lesson{lesson_num}.json"
        if not lesson_file.exists():
            continue

        with open(lesson_file, 'r', encoding='utf-8') as f:
            lesson_data = json.load(f)

        for char_data in lesson_data:
            char = char_data['character']
            if char not in characters_map:
                characters_map[char] = {
                    'pinyin': char_data['pinyin'],
                    'tone': char_data['tone'],
                    'meaning': char_data['meaning']
                }

    return characters_map


async def generate_audio(character, pinyin):
    """Generate audio file for a single character."""
    # Sanitize filename (some filesystems don't like certain characters)
    safe_char = character.replace('/', '_').replace('\\', '_')
    output_path = AUDIO_DIR / f"char_{safe_char}.mp3"

    # Skip if already exists
    if output_path.exists():
        return output_path, True

    # Create TTS communication
    communicate = edge_tts.Communicate(
        text=character,
        voice=VOICE,
        rate=RATE,
        volume=VOLUME
    )

    # Save audio
    await communicate.save(str(output_path))
    return output_path, False


async def main():
    print("🎵 Chinese Character Audio Generator (Edge TTS)")
    print("=" * 50)
    print()

    # Create output directory
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)

    # Get all characters
    print("📚 Scanning lesson files...")
    characters_map = get_all_characters()
    print(f"   Found {len(characters_map)} unique characters\n")

    # Estimate size
    est_size_mb = (len(characters_map) * 20) / 1024
    print(f"💾 Estimated output size: {est_size_mb:.1f} MB\n")

    print(f"🔊 Generating audio using voice: {VOICE}")
    print("=" * 50)

    # Generate audio files
    manifest = {}
    completed = 0
    skipped = 0
    failed = []

    for i, (character, data) in enumerate(characters_map.items(), 1):
        try:
            output_path, was_skipped = await generate_audio(character, data['pinyin'])

            if was_skipped:
                skipped += 1
                status = "⏭️  SKIP"
            else:
                completed += 1
                status = "✅ NEW"

            # Add to manifest
            manifest[character] = {
                'filename': output_path.name,
                'pinyin': data['pinyin'],
                'tone': data['tone'],
                'meaning': data['meaning']
            }

            print(f"[{i}/{len(characters_map)}] {status}: {character} ({data['pinyin']})")

            # Small delay to be respectful to the service
            await asyncio.sleep(0.1)

        except Exception as e:
            failed.append(character)
            print(f"[{i}/{len(characters_map)}] ❌ FAIL: {character} - {e}")

    # Save manifest
    with open(MANIFEST_FILE, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    # Summary
    print()
    print("=" * 50)
    print("📊 Generation Summary")
    print("=" * 50)
    print(f"✅ Generated: {completed} new files")
    print(f"⏭️  Skipped:   {skipped} existing files")
    print(f"❌ Failed:    {len(failed)} files")
    if failed:
        print(f"   Failed characters: {', '.join(failed)}")
    print(f"\n📁 Audio directory: {AUDIO_DIR}")
    print(f"📄 Manifest file:   {MANIFEST_FILE}")

    # Calculate actual size
    total_size = sum(f.stat().st_size for f in AUDIO_DIR.glob("*.mp3"))
    print(f"💾 Total size:      {total_size / 1024 / 1024:.1f} MB")
    print()
    print("🎉 Audio generation complete!")
    print("   Files are ready to be bundled with the app.")


if __name__ == "__main__":
    asyncio.run(main())
