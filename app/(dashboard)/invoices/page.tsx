"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { FileText, Plus, Search } from "lucide-react";
import type { InvoiceStatus } from "@/lib/data";
import { useStore } from "@/lib/store";
import { useTranslation } from "@/lib/i18n";
import { formatDate, formatMoney } from "@/lib/format";
import { StatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/Skeleton";

type Filter = InvoiceStatus | "all";

const FILTERS: { value: Filter; labelKey: string }[] = [
  { value: "all", labelKey: "invoices.filterAll" },
  { value: "draft", labelKey: "invoices.filterDraft" },
  { value: "sent", labelKey: "invoices.filterSent" },
  { value: "paid", labelKey: "invoices.filterPaid" },
  { value: "overdue", labelKey: "invoices.filterOverdue" },
];

const STATUS_COUNTS: Record<Filter, (inv: InvoiceStatus) => boolean> = {
  all: () => true,
  draft: (s) => s === "draft",
  sent: (s) => s === "sent",
  paid: (s) => s === "paid",
  overdue: (s) => s === "overdue",
};

function InvoicesContent() {
  const { t } = useTranslation();
  const { invoices, company, ready } = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");

  const counts = useMemo(() => {
    const result: Record<Filter, number> = {
      all: invoices.length,
      draft: 0,
      sent: 0,
      paid: 0,
      overdue: 0,
    };
    for (const inv of invoices) {
      result[inv.status] += 1;
    }
    return result;
  }, [invoices]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return invoices.filter((inv) => {
      if (!STATUS_COUNTS[filter](inv.status)) return false;
      if (!q) return true;
      return (
        inv.client.name.toLowerCase().includes(q) ||
        inv.number.toLowerCase().includes(q)
      );
    });
  }, [invoices, filter, query]);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
          {t("invoices.title")}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t("invoices.subtitle")}
        </p>
      </div>

      {!ready ? (
        <TableSkeleton rows={5} cols={5} />
      ) : (
        <>
          {/* Filtres + recherche */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex -mx-1 gap-1 overflow-x-auto px-1 pb-1 sm:pb-0">
              {FILTERS.map((f) => {
                const active = filter === f.value;
                return (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 ring-1 ring-inset ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    {t(f.labelKey)}
                    <span
                      className={`rounded-full px-1.5 text-xs font-semibold ${
                        active
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {counts[f.value]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-72">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder={t("invoices.searchPlaceholder")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 pl-9 pr-3 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={FileText}
              title={t("invoices.empty")}
              description={t("invoices.emptyDesc")}
              action={
                <Link
                  href="/invoices/new"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
                >
                  <Plus className="size-4" aria-hidden="true" />
                  {t("invoices.newInvoice")}
                </Link>
              }
            />
          ) : (
            <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-card ring-1 ring-slate-200 dark:ring-slate-800">
              {/* Mobile : cartes */}
              <ul className="divide-y divide-slate-100 dark:divide-slate-800 md:hidden">
                {filtered.map((inv) => (
                  <li key={inv.id}>
                    <Link
                      href={`/invoices/${inv.id}`}
                      className="block px-5 py-4 transition-colors active:bg-slate-50 dark:active:bg-slate-800/60"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {inv.number}
                            </p>
                            <StatusBadge status={inv.status} />
                          </div>
                          <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                            {inv.client.name}
                          </p>
                          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                            {t("invoices.issuedOn", { date: formatDate(inv.issueDate, company.dateFormat) })} · {t("invoices.dueOn", { date: formatDate(inv.dueDate, company.dateFormat) })}
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-bold text-slate-900 dark:text-slate-100">
                          {formatMoney(inv.total, company.currency)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Desktop : tableau */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-y border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      <th className="px-6 py-3">{t("invoices.colInvoice")}</th>
                      <th className="px-4 py-3">{t("invoices.colIssued")}</th>
                      <th className="px-4 py-3">{t("invoices.colDue")}</th>
                      <th className="px-4 py-3">{t("invoices.colStatus")}</th>
                      <th className="px-6 py-3 text-right">{t("invoices.colAmount")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filtered.map((inv) => (
                      <tr
                        key={inv.id}
                        onClick={() => router.push(`/invoices/${inv.id}`)}
                        className="cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/70"
                      >
                        <td className="px-6 py-3.5">
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{inv.number}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{inv.client.name}</p>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-slate-600 dark:text-slate-400">
                          {formatDate(inv.issueDate, company.dateFormat)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-slate-600 dark:text-slate-400">
                          {formatDate(inv.dueDate, company.dateFormat)}
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={inv.status} />
                        </td>
                        <td className="whitespace-nowrap px-6 py-3.5 text-right font-semibold text-slate-900 dark:text-slate-100">
                          {formatMoney(inv.total, company.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function InvoicesPage() {
  return (
    <Suspense fallback={null}>
      <InvoicesContent />
    </Suspense>
  );
}
