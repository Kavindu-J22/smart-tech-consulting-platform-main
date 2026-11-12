// Shown in the main area while a page's data loads. The sidebar stays put.
export default function Loading() {
  return (
    <div role="status" className="flex animate-pulse flex-col gap-6">
      <span className="sr-only">Loading…</span>
      <div className="h-8 w-56 rounded-lg bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-20 rounded-lg bg-muted" />
        <div className="h-20 rounded-lg bg-muted" />
        <div className="h-20 rounded-lg bg-muted" />
        <div className="h-20 rounded-lg bg-muted" />
      </div>
    </div>
  );
}
