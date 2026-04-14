import { useEffect, useMemo, useRef, useState } from "react";
import { analyze, fetchRoles, type AnalyzeResponse, type SkillLevel } from "./lib/api";
import { SkillTagsInput } from "./components/SkillTagsInput";
import { Spinner } from "./components/Spinner";

const SKILL_SUGGESTIONS = [
  "Python",
  "Statistics",
  "Machine Learning",
  "SQL",
  "Data Visualization",
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Backend Basics",
  "Deep Learning",
  "NLP",
  "Deployment",
  "Docker",
  "Git",
  "APIs"
];

function Card({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-soft backdrop-blur">
      <div className="mb-3 text-sm font-semibold tracking-wide text-white/80">
        {title}
      </div>
      {children}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<"home" | "planner">("home");
  const [roles, setRoles] = useState<string[]>([
    "Data Scientist",
    "Web Developer",
    "AI Engineer"
  ]);
  const [role, setRole] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("Beginner");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    fetchRoles(ac.signal)
      .then((r) => {
        if (r.length) setRoles(r);
      })
      .catch(() => {
        // backend may be down; keep defaults
      });
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canSubmit = role.trim().length > 0;

  const existingCount = useMemo(
    () => (result?.existing_skills?.length ?? 0),
    [result]
  );
  const missingCount = useMemo(
    () => (result?.missing_skills?.length ?? 0),
    [result]
  );

  async function onGenerate() {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await analyze({
        role,
        skills,
        skillLevel,
        signal: ac.signal
      });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_20%_10%,rgba(99,102,241,0.35),transparent_60%),radial-gradient(900px_500px_at_80%_30%,rgba(236,72,153,0.25),transparent_55%),radial-gradient(1100px_600px_at_60%_90%,rgba(34,197,94,0.18),transparent_60%)]" />

      <div className="mx-auto max-w-5xl px-4 py-10">
        {page === "home" ? (
          <div className="animate-fadeUp">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 backdrop-blur">
              Rule-based learning roadmap
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white">
              AI Learning Path Assistant
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
              Tell us what you know today and the career you want to pursue.
              We’ll identify skill gaps and generate a step-by-step learning plan
              you can follow from beginner to advanced.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-soft backdrop-blur">
                <div className="text-sm font-semibold text-white">1) Input</div>
                <div className="mt-2 text-sm text-white/70">
                  Add your current skills and choose or type a target role.
                </div>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-soft backdrop-blur">
                <div className="text-sm font-semibold text-white">2) Gap analysis</div>
                <div className="mt-2 text-sm text-white/70">
                  We compare your skills to the role’s core requirements.
                </div>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-soft backdrop-blur">
                <div className="text-sm font-semibold text-white">3) Roadmap</div>
                <div className="mt-2 text-sm text-white/70">
                  Get a clean plan with explanations and starter resources.
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => setPage("planner")}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:brightness-110"
              >
                <span className="relative z-10">Get started</span>
                <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.25),transparent)] bg-[length:200%_100%] group-hover:animate-shimmer" />
              </button>

              <div className="text-xs text-white/55">
                Tip: try roles like{" "}
                <span className="text-white/70">DevOps Engineer</span>,{" "}
                <span className="text-white/70">Data Analyst</span>, or{" "}
                <span className="text-white/70">Frontend Developer</span>.
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 backdrop-blur">
                  Learning roadmap builder
                </div>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                  Build your learning path
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
                  Start with your current skills, then generate a structured roadmap.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPage("home");
                  setError(null);
                  setResult(null);
                }}
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                ← Home
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Card title="Your profile">
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-white/70">
                      Target role
                    </label>
                    <input
                      list="career-role-options"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Type a career path or choose a suggestion"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-white/30"
                    />
                    <datalist id="career-role-options">
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </datalist>
                    <div className="mt-2 text-xs text-white/50">
                      You can type your own career goal, like "DevOps Engineer" or "Cybersecurity Analyst".
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-white/70">
                      Current skills
                    </label>
                    <SkillTagsInput
                      value={skills}
                      onChange={setSkills}
                      suggestions={SKILL_SUGGESTIONS}
                      placeholder="e.g. Python, SQL, Git…"
                    />
                    <div className="mt-2 text-xs text-white/50">
                      Tip: separate multiple skills with commas.
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-medium text-white/70">
                        Skill level
                      </label>
                      <select
                        value={skillLevel}
                        onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-white/30"
                      >
                        <option value="Beginner" className="bg-slate-900">
                          Beginner
                        </option>
                        <option value="Intermediate" className="bg-slate-900">
                          Intermediate
                        </option>
                        <option value="Advanced" className="bg-slate-900">
                          Advanced
                        </option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={onGenerate}
                    disabled={!canSubmit || loading}
                    className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="relative z-10">
                      {loading ? "Generating…" : "Generate learning roadmap"}
                    </span>
                    <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.25),transparent)] bg-[length:200%_100%] group-hover:animate-shimmer" />
                  </button>

                  {loading ? (
                    <div className="pt-1">
                      <Spinner label="Analyzing skill gaps and building your roadmap…" />
                    </div>
                  ) : null}

                  {error ? (
                    <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-100">
                      {error}
                    </div>
                  ) : null}
                </div>
              </Card>

              <Card title="Results">
                {!result ? (
                  <div className="flex h-full min-h-[220px] items-center justify-center text-sm text-white/60">
                    Run an analysis to see missing skills and a roadmap.
                  </div>
                ) : (
                  <div className="animate-fadeUp space-y-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="text-xs font-medium text-white/60">
                          Existing skills
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-white">
                          {existingCount}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {result.existing_skills.slice(0, 10).map((s) => (
                          <span
                            key={s}
                              className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80"
                          >
                            {s}
                          </span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="text-xs font-medium text-white/60">
                          Missing skills
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-white">
                          {missingCount}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {result.missing_skills.length ? (
                            result.missing_skills.map((s) => (
                              <span
                                key={s}
                                className="rounded-full bg-amber-500/15 px-3 py-1 text-xs text-amber-100"
                              >
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-white/60">
                              You already cover the core skills for this role.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-white">
                        Learning roadmap
                      </div>
                      <div className="text-xs text-white/60">Roadmap</div>
                    </div>

                    <div className="space-y-3">
                      {result.roadmap.map((step) => (
                        <div
                          key={step.step}
                          className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-xs text-white/60">
                                Step {step.step}
                              </div>
                              <div className="mt-1 text-sm font-semibold text-white">
                                {step.title}
                              </div>
                            </div>
                            {step.skills?.length ? (
                              <div className="flex flex-wrap justify-end gap-2">
                                {step.skills.map((s) => (
                                  <span
                                    key={s}
                                    className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs text-indigo-100"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                          </div>
                          <div className="mt-2 text-sm leading-6 text-white/75">
                            {step.explanation}
                          </div>
                          {step.resources?.length ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {step.resources.slice(0, 4).map((r) => (
                                <span
                                  key={r}
                                  className="rounded-full border border-white/10 bg-white/0 px-3 py-1 text-xs text-white/65"
                                >
                                  {r}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>

            <div className="mt-8 text-xs text-white/45">
              Backend: <span className="text-white/65">FastAPI</span> · UI:
              <span className="text-white/65"> React + Tailwind</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

