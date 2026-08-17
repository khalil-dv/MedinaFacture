"use client";

import { AlertTriangle, Banknote, ReceiptText, Timer } from "lucide-react";
import { computeStats } from "@/lib/data";
import { useStore } from "@/lib/store";
import { useTranslation } from "@/lib/i18n";
import { formatMoney } from "@/lib/format";
import { StatCard } from "@/components/ui/StatCard";
import { StatCardSkeleton, ChartSkeleton } from "@/components/ui/Skeleton";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { CollectionCard } from "@/components/dashboard/CollectionCard";
import { RecentInvoices } from "@/components/dashboard/RecentInvoices";

function monthKey(dateStr: string): string {
  return dateStr.slice(0, 7);
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const { invoices, company, user, ready, loadError, retryLoad } = useStore();
  const stats = computeStats(invoices);
  const currency = company.currency;

  const firstName =
    user.fullName.split(" ")[0] || company.ownerName.split(" ")[0] || "";
  const greeting = firstName ? t("dash.greeting", { name: firstName }) : t("dash.greetingSimple");

  const now = new Date();
  const thisKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevKey = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`;

  const trendFor = (match: (inv: (typeof invoices)[number]) => boolean) => {
    const thisTotal = invoices
      .filter((inv) => monthKey(inv.issueDate) === thisKey && match(inv))
      .reduce((sum, inv) => sum + inv.total, 0);
    const prevTotal = invoices
      .filter((inv) => monthKey(inv.issueDate) === prevKey && match(inv))
      .reduce((sum, inv) => sum + inv.total, 0);
    if (prevTotal === 0) return undefined;
    return ((thisTotal - prevTotal) / prevTotal) * 100;
  };

  const trendBilled = trendFor(() => true);
  const trendCollected = trendFor((inv) => inv.status === "paid");
  const trendPending = trendFor((inv) => inv.status === "sent" || inv.status === "draft");
  const trendOverdue = trendFor((inv) => inv.status === "overdue");

  if (!ready) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="mt-2 h-4 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2"><ChartSkeleton /></div>
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800">
            <div className="h-5 w-36 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-3 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-sm text-red-600 dark:text-red-400">{loadError}</p>
        <button onClick={retryLoad} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">{t("common.retry")}</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {greeting}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t("dash.subtitle")} {company.name}
        </p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t("dash.revenue")}
          value={formatMoney(stats.billed, currency)}
          trend={trendBilled}
          trendLabel={t("dash.vsLastMonth")}
          icon={Banknote}
          tone="brand"
        />
        <StatCard
          label={t("dash.collected")}
          value={formatMoney(stats.collected, currency)}
          trend={trendCollected}
          trendLabel={t("dash.vsLastMonth")}
          icon={ReceiptText}
          tone="success"
        />
        <StatCard
          label={t("dash.pending")}
          value={formatMoney(stats.pending, currency)}
          trend={trendPending}
          trendLabel={t("dash.vsLastMonth")}
          icon={Timer}
          tone="warning"
        />
        <StatCard
          label={t("dash.overdue")}
          value={formatMoney(stats.overdue, currency)}
          trend={trendOverdue}
          trendLabel={t("dash.vsLastMonth")}
          icon={AlertTriangle}
          tone="danger"
        />
      </div>

      {/* Graphique + recouvrement */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart invoices={invoices} currency={currency} />
        </div>
        <CollectionCard
          invoices={invoices}
          currency={currency}
          dateFormat={company.dateFormat}
        />
      </div>

      {/* Dernières factures */}
      <RecentInvoices
        invoices={invoices}
        currency={currency}
        dateFormat={company.dateFormat}
      />
    </div>
  );
}
