"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useStore } from "@/lib/store";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";

export default function InvoiceEditPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { invoices } = useStore();
  const invoice = invoices.find((inv) => inv.id === params.id);

  if (!invoice) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">Facture introuvable.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/invoices/${invoice.id}`}
          aria-label="Retour au détail"
          className="rounded-lg p-2 text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Modifier {invoice.number}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {invoice.client.name}
          </p>
        </div>
      </div>

      <InvoiceForm
        invoice={invoice}
        onSaved={() => router.push(`/invoices/${invoice.id}`)}
        onCancel={() => router.push(`/invoices/${invoice.id}`)}
      />
    </div>
  );
}
