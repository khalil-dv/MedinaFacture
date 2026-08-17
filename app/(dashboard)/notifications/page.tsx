"use client";

import Link from "next/link";
import { AlertTriangle, Bell, CalendarClock } from "lucide-react";
import { useStore } from "@/lib/store";
import { getNotifications } from "@/lib/notifications";
import { formatDate } from "@/lib/format";
import { EmptyState } from "@/components/ui/EmptyState";
import { useTranslation } from "@/lib/i18n";

export default function NotificationsPage() {
  const { invoices, company } = useStore();
  const { t } = useTranslation();
  const notifications = getNotifications(invoices);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t("notifications.title")}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t("notifications.subtitle")}
        </p>
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={t("notifications.empty")}
          description={t("notifications.emptyDesc")}
        />
      ) : (
        <ul className="space-y-3">
          {notifications.map((notification) => {
            const isOverdue = notification.type === "overdue";
            return (
              <li key={notification.id}>
                <Link
                  href={`/invoices/${notification.invoiceId}`}
                  className="flex items-start gap-3 rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 transition-colors hover:ring-emerald-500/30"
                >
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                      isOverdue
                        ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                        : "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300"
                    }`}
                  >
                    {isOverdue ? (
                      <AlertTriangle className="size-5" aria-hidden="true" />
                    ) : (
                      <CalendarClock className="size-5" aria-hidden="true" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {notification.title}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          isOverdue
                            ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
                            : "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300"
                        }`}
                      >
                        {formatDate(notification.dueDate, company.dateFormat)}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-sm text-slate-600 dark:text-slate-400">
                      {notification.message}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
