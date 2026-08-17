import { InvoiceForm } from "@/components/invoices/InvoiceForm";

export const metadata = { title: "Nouvelle facture" };

export default function NewInvoicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Nouvelle facture
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Créez et personnalisez vos factures, avec TVA calculée automatiquement.
        </p>
      </div>

      <InvoiceForm wide />
    </div>
  );
}
