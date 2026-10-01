
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

