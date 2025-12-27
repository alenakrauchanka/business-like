# -*- coding: utf-8 -*-
"""
Generate individual audio files for each English word/phrase
"""

import os
import sys
import time

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Lesson 1 English vocabulary
LESSON_1_WORDS = [
    "Hi",
    "Hey",
    "Hello",
    "Hello, my dear friend",
    "Hello, Mum",
    "Hello, Dad",
    "Hey, folks",
    "Hey, come here",
    "Hey, what is going on?",
    "Hey, what is going on here?",
    "Hey, what are you doing?",
    "See you",
    "mother",
    "father",
    "mummy",
    "I",
    "We",
    "This",
    "To talk",
    "I talk a lot",
    "To have",
    "I have a lot of time",
    "I have a lot of money",
    "I have a lot of friends",
    "Walk",
    "We walk",
    "We walk in the street",
    "To use",
    "I use",
    "I use chalk",
    "To write",
    "I write",
    "I use chalk to write on the blackboard",
    "to eat",
    "When I eat eggs, I don't eat yolks",
    "To go",
    "I go",
    "To come",
    "I come",
    "A lot",
    "A lot of",
    "A lot of time",
    "A lot of money",
    "A lot of friends",
    "In the street",
    "Chalk",
    "Blackboard",
    "On",
    "When",
    "Eggs",
    "Yolk",
    "Please",
    "With",
    "with me",
    "Please, talk with me",
    "Please, use this chalk",
]


def sanitize_filename(text):
    """Create safe filename from text"""
    # Replace special characters
    safe = text.lower()
    safe = safe.replace(" ", "_")
    safe = safe.replace(",", "")
    safe = safe.replace(".", "")
    safe = safe.replace("'", "")
    safe = safe.replace("?", "")
    safe = safe.replace("!", "")
    # Limit length
    if len(safe) > 30:
        safe = safe[:30]
    return safe


def generate_individual_audio(words, output_dir="../audio/lesson1"):
    """Generate individual audio file for each word"""
    try:
        from google import genai
        from google.genai import types
        import wave
        import base64
        
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            print("ERROR: Set GEMINI_API_KEY")
            print('$env:GEMINI_API_KEY = "your_key"')
            return None
        
        client = genai.Client(api_key=api_key)
        
        # Create output directory
        os.makedirs(output_dir, exist_ok=True)
        
        print(f"Generating {len(words)} audio files...")
        print(f"Output directory: {output_dir}")
        print()
        
        generated_files = []
        
        for i, word in enumerate(words):
            filename = f"{i+1:02d}_{sanitize_filename(word)}.wav"
            filepath = os.path.join(output_dir, filename)
            
            try:
                print(f"[{i+1}/{len(words)}] {word}...", end=" ")
                
                response = client.models.generate_content(
                    model="gemini-2.5-flash-preview-tts",
                    contents=word,
                    config=types.GenerateContentConfig(
                        response_modalities=["AUDIO"],
                        speech_config=types.SpeechConfig(
                            voice_config=types.VoiceConfig(
                                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                    voice_name="Kore"
                                )
                            )
                        )
                    )
                )
                
                audio_data = response.candidates[0].content.parts[0].inline_data.data
                
                if isinstance(audio_data, str):
                    audio_data = base64.b64decode(audio_data)
                
                with wave.open(filepath, "wb") as wf:
                    wf.setnchannels(1)
                    wf.setsampwidth(2)
                    wf.setframerate(24000)
                    wf.writeframes(audio_data)
                
                print(f"OK -> {filename}")
                generated_files.append((word, filename))
                
                # Small delay to avoid rate limiting
                time.sleep(0.5)
                
            except Exception as e:
                print(f"FAILED: {e}")
        
        print()
        print(f"Generated {len(generated_files)} / {len(words)} files")
        
        # Generate HTML snippet for copying
        print()
        print("=" * 50)
        print("HTML snippet for lesson page:")
        print("=" * 50)
        
        for word, filename in generated_files:
            print(f'<button class="audio-btn" onclick="playAudio(\'audio/lesson1/{filename}\')">🔊</button>')
        
        return generated_files
        
    except ImportError:
        print("Install: python -m pip install google-genai")
        return None
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return None


if __name__ == "__main__":
    print("=" * 50)
    print("Business Like - Word Audio Generator")
    print("=" * 50)
    print()
    
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Set API key first:")
        print('$env:GEMINI_API_KEY = "your_key"')
    else:
        generate_individual_audio(LESSON_1_WORDS)

