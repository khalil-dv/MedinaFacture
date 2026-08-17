"use client";

import { memo } from "react";
import type { InvoiceStatus } from "@/lib/data";
import { useTranslation } from "@/lib/i18n";

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  paid: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  sent: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
  draft: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  overdue: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
};

const STATUS_DOT: Record<InvoiceStatus, string> = {
  paid: "bg-emerald-500",
  sent: "bg-orange-500",
  draft: "bg-slate-400",
  overdue: "bg-red-500",
};

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  paid: "invoice.statusPaid",
  sent: "invoice.statusSent",
  draft: "invoice.statusDraft",
  overdue: "invoice.statusOverdue",
};

interface BadgeProps {
  status: InvoiceStatus;
}

export const StatusBadge = memo(function StatusBadge({ status }: BadgeProps) {
  const { t } = useTranslation();
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[status]}`}
    >
      <span
        className={`size-1.5 rounded-full ${STATUS_DOT[status]}`}
        aria-hidden="true"
      />
      {t(STATUS_LABELS[status])}
    </span>
  );
});
