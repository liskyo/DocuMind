import os
import google.generativeai as genai
import json
from prompts.scanner_prompt import SCANNER_SYSTEM_PROMPT
from prompts.rewriter_prompt import REWRITER_SYSTEM_PROMPT
from prompts.rag_prompt import RAG_SYSTEM_PROMPT
from services.parser_service import clean_json_output

# Configure API Key
# Configure API Key
import random

api_keys_str = os.getenv("GEMINI_API_KEY", "")
api_keys = [k.strip() for k in api_keys_str.split(",") if k.strip()]

def get_random_key():
    if not api_keys:
        return None
    return random.choice(api_keys)

async def call_gemini(system_prompt: str, user_content: str, temperature: float = 0.2) -> str:
    current_key = get_random_key()
    if not current_key:
        return "ERROR: GEMINI_API_KEY not found or empty in environment variables."
    
    genai.configure(api_key=current_key)
        
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        # Gemini Pro doesn't strictly support system prompts in the same way as GPT-4, 
        # but we can prepend it or use the new system_instruction if available in the library version.
        # For compatibility, we'll prepend.
        full_prompt = f"{system_prompt}\n\nUser Input:\n{user_content}"
        
        response = model.generate_content(
            full_prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=temperature
            )
        )
        return response.text
    except Exception as e:
        return f"Error calling Gemini: {str(e)}"

async def analyze_risk(text: str):
    # Truncate text if too long for a single pass demo, or handle chunking later
    # For now, we assume reasonable length
    response_text = await call_gemini(SCANNER_SYSTEM_PROMPT, text, temperature=0.1)
    return clean_json_output(response_text)

async def rewrite_clause(clause: str, role: str, tone: str):
    formatted_prompt = REWRITER_SYSTEM_PROMPT.format(
        target_clause=clause,
        user_role=role,
        tone_mode=tone
    )
    # The system prompt is already formatted with inputs in this specific design pattern
    # We pass an empty string as user content because the prompt has everything
    # Or better, we restructure:
    response_text = await call_gemini(formatted_prompt, "", temperature=0.5) 
    return clean_json_output(response_text)

async def rag_query(query: str, context: str):
    formatted_prompt = RAG_SYSTEM_PROMPT.format(
        context_chunks=context,
        user_question=query
    )
    response_text = await call_gemini(formatted_prompt, "", temperature=0.2)
    return {"answer": response_text}
