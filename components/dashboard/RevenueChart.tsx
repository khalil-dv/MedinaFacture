import { memo } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { MockInvoice } from "@/lib/data";
import { formatCompact, formatMoney } from "@/lib/format";

interface RevenueChartProps {
  invoices: MockInvoice[];
  currency?: string;
}

function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

export const RevenueChart = memo(function RevenueChart({
  invoices,
  currency = "XOF",
}: RevenueChartProps) {
  const now = new Date();
  const months: { key: string; label: string }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: new Intl.DateTimeFormat("fr-FR", { month: "short" })
        .format(d)
        .replace(".", ""),
    });
  }

  const sumMonth = (key: string) =>
    invoices
      .filter((inv) => monthKey(inv.issueDate) === key)
      .reduce((sum, inv) => sum + inv.total, 0);

  const amounts = months.map((m) => sumMonth(m.key));
  const total = amounts.reduce((s, a) => s + a, 0);
  const max = Math.max(...amounts, 1);

  // Période précédente (6 mois avant la fenêtre affichée)
  const prevStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const prevWindow = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const prevTotal = invoices
    .filter((inv) => {
      const key = monthKey(inv.issueDate);
      return key >= monthKey(prevStart.toISOString()) && key < monthKey(prevWindow.toISOString());
    })
    .reduce((sum, inv) => sum + inv.total, 0);

  const variation = prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : null;

  return (
    <div
      className="animate-fade-up rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 sm:p-6"
      style={{ animationDelay: "300ms" }}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Recettes des 6 derniers mois
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Montants facturés, toutes taxes comprises
          </p>
        </div>
        {variation !== null && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
              variation >= 0
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 ring-emerald-600/20"
                : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 ring-red-600/20"
            }`}
          >
            {variation >= 0 ? (
              <TrendingUp className="size-3.5" aria-hidden="true" />
            ) : (
              <TrendingDown className="size-3.5" aria-hidden="true" />
            )}
            {variation >= 0 ? "+" : ""}
            {variation.toLocaleString("fr-FR", { maximumFractionDigits: 1 })}%
            vs période précédente
          </span>
        )}
      </div>

      <div className="mt-6 flex h-44 items-end gap-2 sm:h-52 sm:gap-5">
        {months.map((month, index) => {
          const height = Math.round((amounts[index] / max) * 100);
          const isCurrent = index === months.length - 1;

          return (
            <div
              key={month.key}
              className="group relative flex h-full flex-1 flex-col justify-end"
            >
              {/* Tooltip */}
              <div className="pointer-events-none absolute -top-2 left-1/2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                {month.label} — {formatMoney(amounts[index], currency)}
              </div>

              <div
                className={`animate-grow-y w-full rounded-t-lg transition-colors ${
                  isCurrent
                    ? "bg-emerald-600"
                    : "bg-emerald-600/25 group-hover:bg-emerald-600/45"
                }`}
                style={{
                  height: `${Math.max(height, 4)}%`,
                  animationDelay: `${500 + index * 80}ms`,
                }}
              />
              <p
                className={`mt-2 truncate text-center text-[11px] font-medium capitalize sm:text-xs ${
                  isCurrent ? "text-slate-900 dark:text-slate-100" : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {month.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs text-slate-400 dark:text-slate-500">
        <span>Max : {formatCompact(max, currency)}</span>
        <span>Total : {formatCompact(total, currency)}</span>
      </div>
    </div>
  );
});
