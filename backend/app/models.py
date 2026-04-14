from __future__ import annotations

from enum import Enum
from typing import List

from pydantic import BaseModel, Field


class SkillLevel(str, Enum):
    beginner = "Beginner"
    intermediate = "Intermediate"
    advanced = "Advanced"


class AnalyzeRequest(BaseModel):
    role: str = Field(..., min_length=1)
    skills: List[str] = Field(default_factory=list)
    skillLevel: SkillLevel = SkillLevel.beginner


class RoadmapStep(BaseModel):
    step: int
    title: str
    skills: List[str] = Field(default_factory=list)
    explanation: str
    resources: List[str] = Field(default_factory=list)


class AnalyzeResponse(BaseModel):
    role: str
    existing_skills: List[str]
    missing_skills: List[str]
    roadmap: List[RoadmapStep]

