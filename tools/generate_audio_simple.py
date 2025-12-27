# -*- coding: utf-8 -*-
"""
Simple audio generator - English only first to test
"""

import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Simple test vocabulary - English only
TEST_VOCABULARY = [
    "Hi",
    "Hello", 
    "Good morning",
    "Good evening",
    "Goodbye",
    "See you",
    "Thank you",
    "Please",
]

def generate_english_audio(words, output_file="test_english.wav"):
    """Generate audio for English words only"""
    try:
        from google import genai
        from google.genai import types
        import wave
        import base64
        
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            print("ERROR: Set GEMINI_API_KEY")
            return None
        
        client = genai.Client(api_key=api_key)
        
        # Simple text - just English words with pauses
        full_text = "... ".join(words)
        
        print(f"Generating audio for {len(words)} English words...")
        print(f"Text: {full_text}")
        
        response = client.models.generate_content(
            model="gemini-2.5-flash-preview-tts",
            contents=full_text,
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
        
        # Get audio data
        audio_data = response.candidates[0].content.parts[0].inline_data.data
        
        # Decode if base64
        if isinstance(audio_data, str):
            audio_data = base64.b64decode(audio_data)
        
        with wave.open(output_file, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(24000)
            wf.writeframes(audio_data)
        
        print(f"SUCCESS! Saved: {output_file}")
        return output_file
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return None


def generate_bilingual_audio(output_file="test_bilingual.wav"):
    """Generate audio with both English and Russian"""
    try:
        from google import genai
        from google.genai import types
        import wave
        import base64
        
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            print("ERROR: Set GEMINI_API_KEY")
            return None
        
        client = genai.Client(api_key=api_key)
        
        # Bilingual text
        text = """
        Hi... привет.
        Hello... здравствуйте.
        Good morning... доброе утро.
        Goodbye... до свидания.
        Thank you... спасибо.
        Please... пожалуйста.
        """
        
        print("Generating bilingual audio...")
        print(f"Text: {text[:100]}...")
        
        response = client.models.generate_content(
            model="gemini-2.5-flash-preview-tts",
            contents=text,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name="Zephyr"  # Good for multiple languages
                        )
                    )
                )
            )
        )
        
        audio_data = response.candidates[0].content.parts[0].inline_data.data
        
        if isinstance(audio_data, str):
            audio_data = base64.b64decode(audio_data)
        
        with wave.open(output_file, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(24000)
            wf.writeframes(audio_data)
        
        print(f"SUCCESS! Saved: {output_file}")
        return output_file
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return None


if __name__ == "__main__":
    print("=" * 50)
    print("Simple Audio Test")
    print("=" * 50)
    
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Set API key first:")
        print('$env:GEMINI_API_KEY = "your_key"')
    else:
        print("\n1. Testing English only...")
        result1 = generate_english_audio(TEST_VOCABULARY)
        
        if result1:
            print("\n2. Testing bilingual (English + Russian)...")
            result2 = generate_bilingual_audio()
            
            if result2:
                print("\nBoth tests passed!")

