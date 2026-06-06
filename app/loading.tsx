export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center py-40">
      <div className="flex flex-col items-center gap-4">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-border border-t-accent" />
        <span className="text-sm text-muted">Loading…</span>
      </div>
    </div>
  );
}
