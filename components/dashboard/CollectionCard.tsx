import { memo } from "react";
import { Wallet } from "lucide-react";
import type { MockInvoice } from "@/lib/data";
import { computeStats } from "@/lib/data";
import { formatMoney, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/ui/Badge";

interface CollectionCardProps {
  invoices: MockInvoice[];
  currency?: string;
  dateFormat?: string;
}

export const CollectionCard = memo(function CollectionCard({
  invoices,
  currency = "XOF",
  dateFormat,
}: CollectionCardProps) {
  const stats = computeStats(invoices);
  const unpaid = invoices
    .filter((inv) => inv.status === "sent" || inv.status === "overdue")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <div
      className="animate-fade-up flex h-full flex-col rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 sm:p-6"
      style={{ animationDelay: "380ms" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Taux de recouvrement
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Paiements à suivre
          </p>
        </div>
        <div className="grid size-10 place-items-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400">
          <Wallet className="size-5" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-5">
        <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {stats.collectionRate}%
        </p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="animate-grow-x h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"
            style={{
              width: `${stats.collectionRate}%`,
              animationDelay: "600ms",
            }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {formatMoney(stats.collected, currency)} encaissés sur {formatMoney(stats.billed, currency)} facturés
        </p>
      </div>

      <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Paiements en attente
          <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
            {unpaid.length}
          </span>
        </p>

        <ul className="mt-3 space-y-3">
          {unpaid.map((inv, index) => (
            <li
              key={inv.id}
              className="animate-fade-up flex items-center justify-between gap-3"
              style={{ animationDelay: `${650 + index * 90}ms` }}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                  {inv.client.name}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {inv.number} · Échéance {formatDate(inv.dueDate, dateFormat)}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {formatMoney(inv.total - inv.amountPaid, currency)}
                </p>
                <StatusBadge status={inv.status} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});
