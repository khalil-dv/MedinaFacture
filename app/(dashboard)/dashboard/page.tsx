"use client";

import { AlertTriangle, Banknote, ReceiptText, Timer } from "lucide-react";
import { computeStats } from "@/lib/data";
import { useStore } from "@/lib/store";
import { formatMoney } from "@/lib/format";
import { StatCard } from "@/components/ui/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { CollectionCard } from "@/components/dashboard/CollectionCard";
import { RecentInvoices } from "@/components/dashboard/RecentInvoices";

function monthKey(dateStr: string): string {
  return dateStr.slice(0, 7);
}

export default function DashboardPage() {
  const { invoices, company, user } = useStore();
  const stats = computeStats(invoices);
  const currency = company.currency;

  const firstName =
    user.fullName.split(" ")[0] || company.ownerName.split(" ")[0] || "";
  const greeting = firstName ? `Bonjour, ${firstName}` : "Bonjour";

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

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {greeting}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Voici un aperçu de votre activité. {company.name}
        </p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Chiffre d'affaires"
          value={formatMoney(stats.billed, currency)}
          trend={trendBilled}
          trendLabel="vs mois dernier"
          icon={Banknote}
          tone="brand"
        />
        <StatCard
          label="Encaissé"
          value={formatMoney(stats.collected, currency)}
          trend={trendCollected}
          trendLabel="vs mois dernier"
          icon={ReceiptText}
          tone="success"
        />
        <StatCard
          label="En attente"
          value={formatMoney(stats.pending, currency)}
          trend={trendPending}
          trendLabel="vs mois dernier"
          icon={Timer}
          tone="warning"
        />
        <StatCard
          label="En retard"
          value={formatMoney(stats.overdue, currency)}
          trend={trendOverdue}
          trendLabel="vs mois dernier"
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
