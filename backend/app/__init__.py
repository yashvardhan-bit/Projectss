
def fallback_roadmap(role_info: Dict[str, Any], existing_skills: List[str], missing_skills: List[str]) -> List[RoadmapStep]:
    """Build a numbered roadmap from the role profile and the user's skill gap.

    Steps are limited to missing skills, unless there is no gap, in which case
    the complete role roadmap is returned. If no profile step covers a missing
    skill, a generic learning step is created for each unmatched skill.
    """
    existing_norm = {_normalize_skill(s) for s in existing_skills}
    missing_norm = {_normalize_skill(s) for s in missing_skills}

    steps_raw: List[Dict[str, Any]] = role_info.get("roadmap", [])
    steps: List[RoadmapStep] = []

    step_num = 1)
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

