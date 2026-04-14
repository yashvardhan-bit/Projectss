export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";

export type RoadmapStep = {
  step: number;
  title: string;
  skills: string[];
  explanation: string;
  resources: string[];
};

export type AnalyzeResponse = {
  role: string;
  existing_skills: string[];
  missing_skills: string[];
  roadmap: RoadmapStep[];
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.toString() ?? "http://127.0.0.1:8000";

export async function fetchRoles(signal?: AbortSignal): Promise<string[]> {
  const res = await fetch(`${API_BASE_URL}/roles`, { signal });
  if (!res.ok) throw new Error(`Failed to load roles (${res.status})`);
  const json = (await res.json()) as { roles: string[] };
  return json.roles ?? [];
}

export async function analyze(params: {
  role: string;
  skills: string[];
  skillLevel: SkillLevel;
  signal?: AbortSignal;
}): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: params.signal,
    body: JSON.stringify({
      role: params.role,
      skills: params.skills,
      skillLevel: params.skillLevel
    })
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`Analyze failed (${res.status}): ${msg || res.statusText}`);
  }
  return (await res.json()) as AnalyzeResponse;
}

