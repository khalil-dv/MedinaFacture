"use client";

import { memo } from "react";
import Link from "next/link";
import { ArrowUpRight, ReceiptText } from "lucide-react";
import type { MockInvoice } from "@/lib/data";
import { formatDate, formatMoney } from "@/lib/format";
import { StatusBadge } from "@/components/ui/Badge";
import { useTranslation } from "@/lib/i18n";

interface RecentInvoicesProps {
  invoices: MockInvoice[];
  currency?: string;
  dateFormat?: string;
}

export const RecentInvoices = memo(function RecentInvoices({
  invoices,
  currency = "XOF",
  dateFormat,
}: RecentInvoicesProps) {
  const { t } = useTranslation();
  const recent = [...invoices]
    .sort((a, b) => b.issueDate.localeCompare(a.issueDate))
    .slice(0, 6);

  return (
    <div
      className="animate-fade-up overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-card ring-1 ring-slate-200 dark:ring-slate-800"
      style={{ animationDelay: "460ms" }}
    >
      <div className="flex items-center justify-between px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400">
            <ReceiptText className="size-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {t("dash.recentInvoices")}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {invoices.length} factures au total
            </p>
          </div>
        </div>
        <Link
          href="/invoices"
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
        >
          {t("dash.viewAll")}
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      {/* Mobile / tablette : cartes empilées */}
      <ul className="divide-y divide-slate-100 dark:divide-slate-800 md:hidden">
        {recent.map((inv, index) => (
          <li key={inv.id} className="animate-fade-up" style={{ animationDelay: `${500 + index * 60}ms` }}>
            <Link
              href={`/invoices/${inv.id}`}
              className="block px-5 py-4 transition-colors active:bg-slate-50 dark:active:bg-slate-800/60 sm:px-6"
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
                    Émise le {formatDate(inv.issueDate, dateFormat)} · Échéance le{" "}
                    {formatDate(inv.dueDate, dateFormat)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {formatMoney(inv.total, currency)}
                  </p>
                  {inv.amountPaid > 0 && inv.amountPaid < inv.total && (
                    <p className="mt-0.5 text-xs font-medium text-emerald-600">
                      {formatMoney(inv.amountPaid, currency)} encaissés
                    </p>
                  )}
                </div>
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
              <th className="px-5 py-3 sm:px-6">Facture</th>
              <th className="px-4 py-3">Émise le</th>
              <th className="hidden px-4 py-3 lg:table-cell">Échéance</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-5 py-3 text-right sm:px-6">Montant</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {recent.map((inv, index) => (
              <tr
                key={inv.id}
                className="animate-fade-up transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/70"
                style={{ animationDelay: `${500 + index * 60}ms` }}
              >
                <td className="px-5 py-3.5 sm:px-6">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{inv.number}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{inv.client.name}</p>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-slate-600 dark:text-slate-400">
                  {formatDate(inv.issueDate, dateFormat)}
                </td>
                <td className="hidden whitespace-nowrap px-4 py-3.5 text-slate-600 dark:text-slate-400 lg:table-cell">
                  {formatDate(inv.dueDate, dateFormat)}
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={inv.status} />
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-right font-semibold text-slate-900 dark:text-slate-100 sm:px-6">
                  {formatMoney(inv.total, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
