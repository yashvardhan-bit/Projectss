export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-white/80">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white/90" />
      {label ? <span>{label}</span> : null}
    </div>
  );
}

