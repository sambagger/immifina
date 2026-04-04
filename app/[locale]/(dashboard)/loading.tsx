export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6" aria-busy>
      <div className="h-10 max-w-xs rounded-control bg-border" />
      <div className="h-40 rounded-card border border-border bg-surface" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-24 rounded-card border border-border bg-surface" />
        <div className="h-24 rounded-card border border-border bg-surface" />
        <div className="h-24 rounded-card border border-border bg-surface" />
      </div>
    </div>
  );
}
