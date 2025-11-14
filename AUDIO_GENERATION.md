# Audio Generation Guide

This guide explains how to generate pronunciation audio files for all 3,035 Chinese characters in the learning app.

## Overview

The app uses **pre-recorded audio files** for character pronunciation, ensuring:

- **Privacy**: No external API calls at runtime
- **Offline support**: Works without internet connection
- **Free generation**: Uses Microsoft Edge TTS (no signup required)
- **High quality**: Natural Mandarin tone rendering

## Quick Start

### 1. Install Dependencies

```bash
pip install edge-tts
```

###2. Run Generation Script

```bash
python3 scripts/generate-audio-edge.py
```

### 3. Output

The script will generate:

- **Audio files**: `/public/audio/char_{CHARACTER}.mp3` (e.g., `char_木.mp3`)
- **Manifest**: `/lib/data/audio-manifest.json` (maps characters to files)

**Expected results:**

- **3,035 MP3 files** (~20KB each)
- **Total size**: ~60 MB
- **Generation time**: ~10-15 minutes

## Technical Details

### Voice Configuration

- **Voice**: `zh-CN-XiaoxiaoNeural` (female, natural Mandarin tones)
- **Rate**: Normal speed (+0%)
- **Quality**: 16kHz, 96kbps MP3

Research shows this voice has excellent tone accuracy for the 4 Mandarin tones.

### Audio Manifest

The manifest file (`audio-manifest.json`) maps each character to its audio file:

```json
{
  "木": {
    "filename": "char_木.mp3",
    "pinyin": "mù",
    "tone": 4,
    "meaning": "tree"
  },
  ...
}
```

This is loaded by the app at runtime for efficient audio playback.

### Why Edge TTS?

1. **100% Free**: No API keys, no credit card, no signup
2. **Microsoft Quality**: Same voices as Azure Cognitive Services
3. **No Rate Limits**: For one-time generation
4. **Offline After Generation**: Audio is bundled with the app

### Alternative: Azure TTS (Optional)

If you prefer Azure Cognitive Services TTS (requires free account):

1. Create free Azure account: https://azure.microsoft.com/free/
2. Create Speech resource
3. Set environment variables:
   ```bash
   export AZURE_SPEECH_KEY="your-key"
   export AZURE_SPEECH_REGION="your-region"
   ```
4. Install SDK:
   ```bash
   npm install @azure/cognitiveservices-speech-sdk --save-dev
   ```
5. Run alternative script:
   ```bash
   npx tsx scripts/generate-audio.ts
   ```

**Azure benefits**: More voice options, SSML control, better prosody tuning

**Edge TTS benefits**: No signup, simpler, equally good for basic pronunciation

## Troubleshooting

### Generation Fails Midway

The script resumes from where it left off. Just re-run:

```bash
python3 scripts/generate-audio-edge.py
```

Already-generated files are skipped automatically.

### Audio Not Playing in App

1. Check that `audio-manifest.json` exists in `/lib/data/`
2. Check that audio files exist in `/public/audio/`
3. Verify browser console for audio loading errors
4. Try disabling and re-enabling sound toggle in app

### Large Bundle Size

If 60MB is too large, consider:

1. **Lazy loading**: Load lesson audio on-demand (future enhancement)
2. **Compression**: Use Opus format instead of MP3 (smaller, but less compatible)
3. **CDN hosting**: Host audio externally (sacrifices offline-first principle)

Current recommendation: **Keep all audio bundled** for offline support and privacy.

## Pedagogical Impact

Research shows that hearing pronunciation during character learning improves retention by **10-20%** through multimodal encoding (visual + auditory + story-based memory).

The auto-play during introduction phase builds phonological associations, while the manual replay button during games allows users to verify pronunciation without breaking flow.

## File Structure

```
/public/audio/
├── char_一.mp3   (character: 一, pinyin: yī)
├── char_二.mp3   (character: 二, pinyin: èr)
├── char_三.mp3   (character: 三, pinyin: sān)
└── ... (3,032 more files)

/lib/data/
└── audio-manifest.json  (maps characters to filenames)
```

## Credits

- **TTS Engine**: Microsoft Edge TTS (free community project)
- **Voice**: zh-CN-XiaoxiaoNeural (neural voice model)
- **Library**: [edge-tts](https://github.com/rany2/edge-tts) (Python package)

## License

Audio files generated via Edge TTS are for personal/educational use. For commercial use, consult Microsoft's terms of service or use Azure TTS with appropriate licensing.
