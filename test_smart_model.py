import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_keys_str = os.getenv("GEMINI_API_KEY", "")
api_key = api_keys_str.split(",")[0].strip()

genai.configure(api_key=api_key)

def test_smart_model():
    model_name = 'gemini-2.5-pro'
    print(f"Testing model: {model_name}...")
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Hello, are you available?")
        print(f"Success! Response: {response.text}")
        return True
    except Exception as e:
        print(f"Failed to use {model_name}: {e}")
        return False

if __name__ == "__main__":
    test_smart_model()
