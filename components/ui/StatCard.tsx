import { memo } from "react";
import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

type Tone = "brand" | "success" | "warning" | "danger" | "neutral";

const TONE_STYLES: Record<Tone, { icon: string; trend: string }> = {
  brand: {
    icon: "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
    trend: "text-emerald-600",
  },
  success: {
    icon: "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
    trend: "text-emerald-600",
  },
  warning: {
    icon: "bg-orange-500/10 text-orange-600",
    trend: "text-orange-600",
  },
  danger: {
    icon: "bg-red-500/10 text-red-600 dark:text-red-400",
    trend: "text-red-600 dark:text-red-400",
  },
  neutral: {
    icon: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
    trend: "text-slate-600 dark:text-slate-400",
  },
};

interface StatCardProps {
  label: string;
  value: string;
  trend?: number;
  trendLabel?: string;
  icon: LucideIcon;
  tone?: Tone;
  animationDelay?: number;
}

export const StatCard = memo(function StatCard({
  label,
  value,
  trend,
  trendLabel,
  icon: Icon,
  tone = "neutral",
  animationDelay,
}: StatCardProps) {
  const styles = TONE_STYLES[tone];
  const trendPositive = (trend ?? 0) >= 0;

  return (
    <div
      className="animate-fade-up rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-cardHover"
      style={
        animationDelay !== undefined
          ? { animationDelay: `${animationDelay}ms` }
          : undefined
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
            {value}
          </p>
        </div>
        <div
          className={`grid size-10 shrink-0 place-items-center rounded-xl ${styles.icon}`}
        >
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </div>

      {trend !== undefined && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span
            className={`inline-flex items-center gap-1 font-semibold ${styles.trend}`}
          >
            {trendPositive ? (
              <TrendingUp className="size-3.5" aria-hidden="true" />
            ) : (
              <TrendingDown className="size-3.5" aria-hidden="true" />
            )}
            {trendPositive ? "+" : ""}
            {trend.toLocaleString("fr-FR")}%
          </span>
          <span className="text-slate-400 dark:text-slate-500">{trendLabel}</span>
        </div>
      )}
    </div>
  );
});
