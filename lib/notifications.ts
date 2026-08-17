import type { MockInvoice } from "@/lib/data";
import { formatDate } from "@/lib/format";

export interface AppNotification {
  id: string;
  type: "overdue" | "due-soon";
  title: string;
  message: string;
  invoiceId: string;
  dueDate: string;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseISODate(value: string): Date {
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (iso) {
    return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]), 12, 0, 0);
  }
  return new Date(value);
}

function diffDaysFromToday(iso: string): number {
  const due = startOfDay(parseISODate(iso));
  const today = startOfDay(new Date());
  return Math.round((due.getTime() - today.getTime()) / 86400000);
}

/** Notifications dérivées des factures : retards + échéances proches. */
export function getNotifications(invoices: MockInvoice[]): AppNotification[] {
  const notifications: AppNotification[] = [];

  for (const inv of invoices) {
    const days = diffDaysFromToday(inv.dueDate);
    const isUnpaid = inv.status === "sent" || inv.status === "overdue";

    if (inv.status === "overdue" || (inv.status === "sent" && days < 0)) {
      notifications.push({
        id: `overdue-${inv.id}`,
        type: "overdue",
        title: "Facture en retard",
        message: `La facture ${inv.number} (${inv.client.name}) a dépassé son échéance du ${formatDate(inv.dueDate)} sans être payée.`,
        invoiceId: inv.id,
        dueDate: inv.dueDate,
      });
    } else if (inv.status === "sent" && isUnpaid && days >= 0 && days <= 7) {
      notifications.push({
        id: `due-${inv.id}`,
        type: "due-soon",
        title: "Échéance proche",
        message: `La facture ${inv.number} (${inv.client.name}) arrive à échéance le ${formatDate(inv.dueDate)}.`,
        invoiceId: inv.id,
        dueDate: inv.dueDate,
      });
    }
  }

  // Retards d'abord, puis les échéances les plus proches.
  return notifications.sort((a, b) => {
    if (a.type !== b.type) return a.type === "overdue" ? -1 : 1;
    return a.dueDate.localeCompare(b.dueDate);
  });
}
