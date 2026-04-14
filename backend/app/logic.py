from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any, Dict, List, Tuple

from .models import RoadmapStep


DATA_PATH = Path(__file__).parent / "data" / "roles.json"


def _normalize_skill(s: str) -> str:
    return re.sub(r"\s+", " ", (s or "").strip()).lower()


def dedupe_preserve_order(items: List[str]) -> List[str]:
    seen = set()
    out: List[str] = []
    for x in items:
        k = _normalize_skill(x)
        if not k or k in seen:
            continue
        seen.add(k)
        out.append(x.strip())
    return out


def load_roles() -> Dict[str, Any]:
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def available_roles() -> List[str]:
    data = load_roles()
    return sorted(list(data.keys()))


def _generic_resources(skill: str) -> List[str]:
    return [
        f"Official docs for {skill}",
        f"Beginner course on {skill}",
        f"Build a small project using {skill}",
    ]


def _build_profile(required_skills: List[str]) -> Dict[str, Any]:
    roadmap = []
    for skill in required_skills:
        roadmap.append(
            {
                "title": f"Learn {skill}",
                "skills": [skill],
                "explanation": f"Build a solid foundation in {skill}, then practice it with a focused real-world project.",
                "resources": _generic_resources(skill),
            }
        )
    return {"required_skills": required_skills, "roadmap": roadmap}


def infer_custom_role_profile(role: str) -> Dict[str, Any]:
    role_norm = _normalize_skill(role)

    keyword_profiles: List[Tuple[List[str], List[str]]] = [
        (["frontend", "front end", "ui"], ["HTML", "CSS", "JavaScript", "React", "Accessibility"]),
        (["backend", "back end", "api"], ["Python", "APIs", "Databases", "Authentication", "Deployment"]),
        (["full stack", "fullstack"], ["HTML", "CSS", "JavaScript", "React", "APIs", "Databases", "Deployment"]),
        (["mobile", "android", "ios"], ["JavaScript", "React Native", "Mobile UI", "APIs", "App Deployment"]),
        (["data scientist", "data science"], ["Python", "Statistics", "Machine Learning", "SQL", "Data Visualization"]),
        (["data analyst", "analytics"], ["SQL", "Excel", "Python", "Data Visualization", "Statistics"]),
        (["machine learning", "ml engineer"], ["Python", "Machine Learning", "Deep Learning", "MLOps", "Deployment"]),
        (["ai engineer", "llm", "genai"], ["Python", "Machine Learning", "Deep Learning", "NLP", "Deployment"]),
        (["devops", "platform", "site reliability", "sre"], ["Linux", "Networking", "Docker", "Kubernetes", "CI/CD", "Cloud"]),
        (["cloud", "aws", "azure", "gcp"], ["Linux", "Cloud", "Networking", "Infrastructure as Code", "Security"]),
        (["cyber", "security"], ["Networking", "Linux", "Security Fundamentals", "Threat Detection", "Scripting"]),
        (["qa", "test", "automation"], ["Testing Fundamentals", "JavaScript", "API Testing", "Automation", "CI/CD"]),
        (["product manager"], ["Product Sense", "User Research", "Roadmapping", "Analytics", "Communication"]),
        (["designer", "ux", "ui/ux"], ["Design Principles", "Wireframing", "Prototyping", "User Research", "Design Systems"]),
        (["game"], ["Programming Fundamentals", "Game Engine Basics", "Math for Games", "3D Concepts", "Optimization"]),
        (["blockchain", "web3"], ["JavaScript", "Solidity", "Smart Contracts", "Cryptography Basics", "Security"]),
    ]

    for keywords, skills in keyword_profiles:
        if any(k in role_norm for k in keywords):
            return _build_profile(skills)

    return _build_profile(
        [
            "Fundamentals",
            "Core Tools",
            "Project Building",
            "Problem Solving",
            "Portfolio",
        ]
    )


def analyze_skill_gap(role: str, user_skills: List[str]) -> Tuple[List[str], List[str], Dict[str, Any]]:
    data = load_roles()
    role_info = data.get(role) or infer_custom_role_profile(role)
    required: List[str] = role_info["required_skills"]

    user_clean = dedupe_preserve_order(user_skills)
    user_norm = {_normalize_skill(s) for s in user_clean}

    existing = [s for s in required if _normalize_skill(s) in user_norm] + [
        s for s in user_clean if _normalize_skill(s) not in {_normalize_skill(r) for r in required}
    ]

    missing = [s for s in required if _normalize_skill(s) not in user_norm]

    # Keep existing skills reasonably ordered, but do not drop user-provided extra skills.
    existing = dedupe_preserve_order(existing)

    return existing, missing, role_info


def fallback_roadmap(role_info: Dict[str, Any], existing_skills: List[str], missing_skills: List[str]) -> List[RoadmapStep]:
    existing_norm = {_normalize_skill(s) for s in existing_skills}
    missing_norm = {_normalize_skill(s) for s in missing_skills}

    steps_raw: List[Dict[str, Any]] = role_info.get("roadmap", [])
    steps: List[RoadmapStep] = []

    step_num = 1
    for item in steps_raw:
        step_skills = item.get("skills", [])
        step_skill_norms = {_normalize_skill(s) for s in step_skills}

        # Include steps that teach missing skills. If nothing is missing, include everything.
        should_include = (not missing_norm) or bool(step_skill_norms & missing_norm)
        if not should_include:
            continue

        steps.append(
            RoadmapStep(
                step=step_num,
                title=item.get("title", f"Step {step_num}"),
                skills=step_skills,
                explanation=item.get("explanation", "Work through this step and practice with small projects."),
                resources=item.get("resources", []),
            )
        )
        step_num += 1

    # If user is missing skills but no roadmap entries matched, provide a generic ordered list.
    if missing_skills and not steps:
        for ms in missing_skills:
            steps.append(
                RoadmapStep(
                    step=len(steps) + 1,
                    title=f"Learn {ms}",
                    skills=[ms],
                    explanation=f"Build fundamentals in {ms}, then apply it in a small hands-on project.",
                    resources=["Official docs", "A beginner-friendly course", "One small project idea"],
                )
            )

    return steps

