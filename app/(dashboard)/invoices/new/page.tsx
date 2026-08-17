"use client";

import { useTranslation } from "@/lib/i18n";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";

export default function NewInvoicePage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t("invoice.new.title")}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t("invoice.new.subtitle")}
        </p>
      </div>

      <InvoiceForm wide />
    </div>
  );
}
