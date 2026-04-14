import { useMemo, useState } from "react";

function normalize(s: string) {
  return s.trim().replace(/\s+/g, " ").toLowerCase();
}

export function SkillTagsInput({
  value,
  onChange,
  placeholder = "Type a skill and press Enter…",
  suggestions
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}) {
  const [text, setText] = useState("");

  const existing = useMemo(() => new Set(value.map(normalize)), [value]);
  const filteredSuggestions = useMemo(() => {
    const s = (suggestions ?? []).filter((x) => !existing.has(normalize(x)));
    const q = normalize(text);
    if (!q) return s.slice(0, 8);
    return s.filter((x) => normalize(x).includes(q)).slice(0, 8);
  }, [suggestions, existing, text]);

  function addMany(raw: string) {
    const parts = raw
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length === 0) return;

    const out = [...value];
    const seen = new Set(out.map(normalize));
    for (const p of parts) {
      const k = normalize(p);
      if (!k || seen.has(k)) continue;
      seen.add(k);
      out.push(p);
    }
    onChange(out);
  }

  function removeAt(idx: number) {
    const out = value.filter((_, i) => i !== idx);
    onChange(out);
  }

  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-3 backdrop-blur">
      <div className="flex flex-wrap gap-2">
        {value.map((skill, idx) => (
          <span
            key={`${skill}-${idx}`}
            className="group inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white/90"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeAt(idx)}
              className="rounded-full px-1 text-white/70 hover:text-white"
              aria-label={`Remove ${skill}`}
              title="Remove"
            >
              ×
            </button>
          </span>
        ))}

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addMany(text);
              setText("");
            }
            if (e.key === "Backspace" && !text && value.length > 0) {
              removeAt(value.length - 1);
            }
          }}
          onBlur={() => {
            if (text.trim()) {
              addMany(text);
              setText("");
            }
          }}
          placeholder={placeholder}
          className="min-w-[180px] flex-1 bg-transparent px-2 py-1 text-sm text-white/90 placeholder:text-white/40 outline-none"
        />
      </div>

      {filteredSuggestions.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {filteredSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addMany(s)}
              className="rounded-full border border-white/15 bg-white/0 px-3 py-1 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

