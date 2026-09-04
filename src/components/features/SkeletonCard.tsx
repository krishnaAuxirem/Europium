export default function SkeletonCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className="card-base p-5 space-y-4">
      <div className={`skeleton ${compact ? "h-32" : "h-48"} w-full rounded-xl`} />
      <div className="space-y-2.5">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
      </div>
      <div className="flex gap-2 pt-1">
        <div className="skeleton h-8 w-24 rounded-full" />
        <div className="skeleton h-8 w-20 rounded-full" />
      </div>
    </div>
  );
}
