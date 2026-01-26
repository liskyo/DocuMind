import json
import re

def clean_json_output(text: str):
    """
    Cleans the raw text output from the LLM to extract valid JSON.
    Removes markdown code blocks if present.
    """
    try:
        # Check if text is an error message
        if text.startswith("ERROR:") or text.startswith("Error"):
            return {"error": text}

        # Remove markdown code blocks ```json ... ```
        pattern = r"```json\s*(.*?)\s*```"
        match = re.search(pattern, text, re.DOTALL)
        if match:
            json_str = match.group(1)
        else:
            # Try to find the first { and last }
            start = text.find("{")
            end = text.rfind("}")
            if start != -1 and end != -1:
                json_str = text[start:end+1]
            else:
                json_str = text
        
        return json.loads(json_str)
    except json.JSONDecodeError:
        return {
            "error": "Failed to parse JSON response",
            "raw_output": text
        }
