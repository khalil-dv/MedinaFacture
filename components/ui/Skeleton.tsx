function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className ?? ""}`}
      {...props}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="size-9 rounded-xl" />
      </div>
      <Skeleton className="mt-3 h-7 w-32" />
      <Skeleton className="mt-2 h-3 w-20" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-card ring-1 ring-slate-200 dark:ring-slate-800">
      <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-5 py-3">
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton
                key={j}
                className={`h-4 ${j === 0 ? "w-40" : j === cols - 1 ? "w-16 ml-auto" : "w-24"}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="mt-3 h-4 w-64" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800">
      <Skeleton className="h-5 w-36" />
      <div className="mt-4 flex items-end gap-2 h-48">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t-lg"
            style={{ height: `${30 + Math.random() * 70}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
  );
}

export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  );
}

export function SettingsFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 sm:p-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-1 h-3 w-56" />
        <div className="mt-5 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function InvoiceDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <CardSkeleton />
          <TableSkeleton rows={3} />
        </div>
        <CardSkeleton />
      </div>
    </div>
  );
}
