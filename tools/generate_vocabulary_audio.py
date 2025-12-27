# -*- coding: utf-8 -*-
"""
Script for generating vocabulary audio using Google Gemini TTS API
Voices English words and their Russian translations

Requirements:
1. Install google-genai: python -m pip install google-genai
2. Get API key: https://aistudio.google.com/apikey
3. Set environment variable GEMINI_API_KEY or specify key in code
"""

import os
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Lesson 1 Vocabulary (from englishcoal.tilda.ws/lesson_1_voc)
LESSON_1_VOCABULARY = [
    # Greetings
    ("Hi", "privet!"),
    ("Hey", "privet!"),
    ("Hello", "Privet! Zdravstvuj! Zdravstvujte!"),
    ("Hello, my dear friend", "Zdravstvuj, moj dorogoj drug."),
    ("Hello, Mum.", "Zdravstvuj, mama."),
    ("Hello, Dad.", "Zdravstvuj, papa."),
    ("Hey, folks", "Privet, rebyata."),
    ("Hey, come here", "Ej, podojdi syuda."),
    ("Hey, what is going on?", "Ej, chto proishodit?"),
    ("See you", "Do vstrechi!"),
    
    # Family
    ("mother", "mat'"),
    ("father", "otec"),
    ("mummy", "mamochka"),
    
    # Pronouns
    ("I", "ya"),
    ("We", "my"),
    ("This", "etot, eta"),
    
    # Verbs
    ("To talk", "govorit'"),
    ("I talk a lot", "Ya mnogo govoryu."),
    ("To have", "imet'"),
    ("I have a lot of time", "U menya mnogo vremeni."),
    ("I have a lot of money", "U menya mnogo deneg."),
    ("I have a lot of friends", "U menya mnogo druzej."),
    ("Walk", "gulyat'"),
    ("We walk", "My gulyaem."),
    ("We walk in the street", "My gulyaem po ulice."),
    ("To use", "ispol'zovat'"),
    ("To write", "pisat'"),
    ("I write", "ya pishu"),
    ("To go", "idti"),
    ("I go", "ya idu"),
    ("To come", "prihodit'"),
    ("I come", "ya prihozhu"),
    
    # Quantity
    ("A lot", "mnogo"),
    ("A lot of time", "mnogo vremeni"),
    ("A lot of money", "mnogo deneg"),
    ("A lot of friends", "mnogo druzej"),
    
    # Other words
    ("In the street", "na ulice"),
    ("Chalk", "mel"),
    ("Blackboard", "doska"),
    ("Please", "pozhalujsta"),
    ("With me", "so mnoj"),
]

# Russian vocabulary with Cyrillic (for display and proper TTS)
LESSON_1_VOCABULARY_CYRILLIC = [
    ("Hi", "привет!"),
    ("Hey", "привет!"),
    ("Hello", "Привет! Здравствуй! Здравствуйте!"),
    ("Hello, my dear friend", "Здравствуй, мой дорогой друг."),
    ("Hello, Mum.", "Здравствуй, мама."),
    ("Hello, Dad.", "Здравствуй, папа."),
    ("Hey, folks", "Привет, ребята."),
    ("Hey, come here", "Эй, подойди сюда."),
    ("Hey, what is going on?", "Эй, что происходит?"),
    ("Hey, what is going on here?", "Эй, что здесь происходит?"),
    ("Hey, what are you doing?", "Эй, что ты делаешь?"),
    ("See you", "До встречи!"),
    ("mother", "мать"),
    ("father", "отец"),
    ("mummy", "мамочка"),
    ("I", "я"),
    ("We", "мы"),
    ("This", "этот, эта"),
    ("To talk", "говорить"),
    ("I talk a lot", "Я много говорю."),
    ("To have", "иметь"),
    ("I have a lot of time", "У меня много времени."),
    ("I have a lot of money", "У меня много денег."),
    ("I have a lot of friends", "У меня много друзей."),
    ("Walk", "гулять"),
    ("We walk", "Мы гуляем."),
    ("We walk in the street", "Мы гуляем по улице."),
    ("To use", "использовать, пользоваться"),
    ("I use", "я использую"),
    ("I use chalk", "я использую мел"),
    ("To write", "писать"),
    ("I write", "я пишу"),
    ("I use chalk to write on the blackboard", "я использую мел, чтобы писать на доске"),
    ("to eat", "кушать"),
    ("When I eat eggs, I don't eat yolks", "Когда я ем яйца, я не ем желтки."),
    ("To go", "идти"),
    ("I go", "я иду"),
    ("To come", "приходить"),
    ("I come", "я прихожу"),
    ("A lot", "много"),
    ("A lot of", "много чего-то"),
    ("A lot of time", "много времени"),
    ("A lot of money", "много денег"),
    ("A lot of friends", "много друзей"),
    ("In the street", "на улице, по улице"),
    ("Chalk", "мел"),
    ("Blackboard", "доска"),
    ("On", "предлог на"),
    ("When", "когда"),
    ("Eggs", "яйца"),
    ("Yolk", "желток"),
    ("Please", "пожалуйста"),
    ("With", "c"),
    ("with me", "со мной"),
    ("Please, talk with me", "Пожалуйста, поговори со мной."),
    ("Please, use this chalk", "Пожалуйста, используй этот мел."),
]


def generate_with_new_sdk(vocabulary, output_file="lesson_1_vocabulary.wav"):
    """
    Generate audio using new google-genai SDK (Gemini 2.5 Flash TTS)
    """
    try:
        from google import genai
        from google.genai import types
        import wave
        import base64
        
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            print("ERROR: Set GEMINI_API_KEY environment variable")
            print("")
            print("How to get API key:")
            print("1. Go to https://aistudio.google.com/apikey")
            print("2. Create new API key")
            print("3. Set environment variable:")
            print("   Windows PowerShell: $env:GEMINI_API_KEY = 'your_key'")
            print("   Windows CMD: set GEMINI_API_KEY=your_key")
            return None
        
        client = genai.Client(api_key=api_key)
        
        # Form text for voicing - English only first, then Russian
        text_parts = []
        for english, russian in vocabulary:
            # Use simple format: English word, pause, Russian translation
            text_parts.append(f"{english}... {russian}")
        
        full_text = "... ".join(text_parts)
        
        print(f"Generating audio for {len(vocabulary)} words/phrases...")
        print(f"Text preview: {full_text[:100]}...")
        
        # Generate audio with Gemini 2.5 Flash TTS
        response = client.models.generate_content(
            model="gemini-2.5-flash-preview-tts",
            contents=full_text,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name="Zephyr"  # Good multilingual voice
                        )
                    )
                )
            )
        )
        
        # Save audio
        audio_data = response.candidates[0].content.parts[0].inline_data.data
        
        # Check if data is base64 encoded
        if isinstance(audio_data, str):
            audio_data = base64.b64decode(audio_data)
        
        with wave.open(output_file, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(24000)
            wf.writeframes(audio_data)
        
        print(f"SUCCESS! Audio saved: {output_file}")
        return output_file
        
    except ImportError:
        print("Install google-genai: python -m pip install google-genai")
        return None
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return None


def generate_individual_files(vocabulary, output_dir="audio"):
    """
    Generate individual audio files for each word/phrase
    Useful for interactive exercises on the website
    """
    try:
        from google import genai
        from google.genai import types
        import wave
        
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            print("ERROR: Set GEMINI_API_KEY environment variable")
            return None
        
        client = genai.Client(api_key=api_key)
        
        os.makedirs(output_dir, exist_ok=True)
        
        for i, (english, russian) in enumerate(vocabulary):
            filename = f"{output_dir}/word_{i+1:03d}.wav"
            text = f"{english}. {russian}."
            
            try:
                response = client.models.generate_content(
                    model="gemini-2.5-flash-preview-tts",
                    contents=text,
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
                
                with wave.open(filename, "wb") as wf:
                    wf.setnchannels(1)
                    wf.setsampwidth(2)
                    wf.setframerate(24000)
                    wf.writeframes(audio_data)
                
                print(f"OK {i+1}/{len(vocabulary)}: {english} -> {filename}")
                
            except Exception as e:
                print(f"ERROR for '{english}': {e}")
        
        print(f"\nAll files saved to: {output_dir}/")
        
    except ImportError:
        print("Install google-genai: python -m pip install google-genai")
        return None


if __name__ == "__main__":
    print("=" * 60)
    print("Business Like - Vocabulary Audio Generator")
    print("=" * 60)
    print()
    
    api_key = os.environ.get("GEMINI_API_KEY")
    
    if not api_key:
        print("WARNING: API key not set!")
        print()
        print("How to get API key:")
        print("1. Go to https://aistudio.google.com/apikey")
        print("2. Create new API key")
        print("3. Set environment variable:")
        print()
        print("   Windows PowerShell:")
        print('   $env:GEMINI_API_KEY = "your_key_here"')
        print()
        print("   Windows CMD:")
        print("   set GEMINI_API_KEY=your_key_here")
        print()
        print("Then run this script again.")
    else:
        print(f"Lesson 1 Vocabulary: {len(LESSON_1_VOCABULARY_CYRILLIC)} words/phrases")
        print()
        
        # Generate one file with all vocabulary
        result = generate_with_new_sdk(LESSON_1_VOCABULARY_CYRILLIC)
        
        if result:
            print()
            print("Done! File can be added to the website.")
