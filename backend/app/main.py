from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .logic import (
    analyze_skill_gap,
    available_roles,
    fallback_roadmap,
)
from .models import AnalyzeRequest, AnalyzeResponse


app = FastAPI(title="AI Learning Path Assistant API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"ok": True}


@app.get("/roles")
def roles():
    return {"roles": available_roles()}


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest):
    try:
        existing, missing, role_info = analyze_skill_gap(req.role, req.skills)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    roadmap = fallback_roadmap(role_info, existing, missing)

    return AnalyzeResponse(
        role=req.role,
        existing_skills=existing,
        missing_skills=missing,
        roadmap=roadmap,
    )

