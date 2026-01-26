import os
from dotenv import load_dotenv

# Load env before importing services that might read env vars at module level
load_dotenv()

from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional

from services.llm_service import analyze_risk, rewrite_clause, rag_query

app = FastAPI(title="DocuMind API", description="AI Smart Contract Compliance System")

class RewriterRequest(BaseModel):
    target_clause: str
    user_role: str
    tone: str

class RAGRequest(BaseModel):
    query: str
    context_chunks: str

@app.get("/")
def read_root():
    return {"message": "DocuMind API is running"}

from services.file_service import extract_text_from_file

@app.post("/api/analyze")
async def analyze_contract(file: UploadFile = File(...)):
    try:
        text = await extract_text_from_file(file)
        result = await analyze_risk(text)
        # Inject full text for frontend reconstruction
        if isinstance(result, dict):
            result['full_text'] = text
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/rewrite")
async def rewrite_contract_clause(request: RewriterRequest):
    try:
        result = await rewrite_clause(request.target_clause, request.user_role, request.tone)
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/rag")
async def rag_qa(request: RAGRequest):
    try:
        result = await rag_query(request.query, request.context_chunks)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from fastapi.responses import StreamingResponse
from services.file_service import generate_docx
import urllib.parse

class DocGenRequest(BaseModel):
    text: str
    filename: str

@app.post("/api/generate_document")
async def generate_document(request: DocGenRequest):
    try:
        buffer = generate_docx(request.text)
        new_filename = f"{request.filename}_修正版.docx"
        encoded_filename = urllib.parse.quote(new_filename)
        
        # Proper headers for file download with UTF-8 support
        headers = {
            'Content-Disposition': f"attachment; filename*=UTF-8''{encoded_filename}"
        }
        
        return StreamingResponse(
            buffer, 
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
            headers=headers
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
