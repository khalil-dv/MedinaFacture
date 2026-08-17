"use client";

import { useState } from "react";
import { Download, Save } from "lucide-react";
import type { MockClient } from "@/lib/data";
import type { CompanySettings } from "@/lib/store";
import { formatDate, formatMoney, formatQuantity, initialsOf } from "@/lib/format";

interface InvoicePreviewProps {
  company: CompanySettings;
  client?: MockClient;
  number: string;
  issueDate: string;
  dueDate: string;
  vatRate: number;
  paymentMethod: string;
  lines: { description: string; quantity: number; unitPrice: number }[];
  totals: { subtotal: number; vatAmount: number; total: number };
  notes: string;
  onSave?: () => void;
  saving?: boolean;
}

export function InvoicePreview({
  company,
  client,
  number,
  issueDate,
  dueDate,
  vatRate,
  paymentMethod,
  lines,
  totals,
  notes,
  onSave,
  saving = false,
}: InvoicePreviewProps) {
  const initials = initialsOf(company.name);

  const paymentDetails: { label: string; value: string }[] = [
    { label: "Virement bancaire", value: company.bankAccountName },
    { label: "Banque", value: company.bankName },
    { label: "N° de compte", value: company.bankAccountNumber },
    { label: "Wave", value: company.waveNumber },
    { label: "Orange Money", value: company.orangeMoneyNumber },
  ].filter((detail) => detail.value);

  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const { buildPreviewInvoice, downloadInvoicePdf } = await import(
        "@/lib/pdf"
      );
      downloadInvoicePdf(
        buildPreviewInvoice(
          number,
          issueDate,
          dueDate,
          vatRate,
          lines,
          totals,
          notes,
          client,
          paymentMethod,
        ),
        company,
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="sticky top-20 overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-card ring-1 ring-slate-200 dark:ring-slate-800">
      {/* Bandeau */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Aperçu de la facture
          </h2>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
            Mis à jour en temps réel pendant votre saisie.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {onSave && (
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 shadow-sm transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="size-3.5" aria-hidden="true" />
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          )}
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
          >
            <Download className="size-3.5" aria-hidden="true" />
            {downloading ? "Préparation…" : "Télécharger"}
          </button>
        </div>
      </div>

      {/* Document */}
      <div className="p-5 sm:p-6">
        {/* En-tête : entreprise à gauche, infos facture à droite */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            {company.logoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={company.logoDataUrl}
                alt=""
                className="size-12 shrink-0 rounded-lg border border-slate-200 dark:border-slate-700 object-cover"
              />
            ) : (
              <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-emerald-600/10 text-base font-bold text-emerald-700 dark:text-emerald-400">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                {company.name}
              </p>
              {company.taxId && (
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{company.taxId}</p>
              )}
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {company.address}
              </p>
              {company.email && (
                <p className="text-xs text-slate-500 dark:text-slate-400">{company.email}</p>
              )}
              {company.phone && (
                <p className="text-xs text-slate-500 dark:text-slate-400">{company.phone}</p>
              )}
            </div>
          </div>

          <dl className="shrink-0 space-y-1 text-xs">
            <p className="text-right text-sm font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Facture
            </p>
            <div className="flex justify-end gap-3">
              <dt className="text-slate-400 dark:text-slate-500">N°</dt>
              <dd className="font-semibold text-slate-800 dark:text-slate-200">{number}</dd>
            </div>
            <div className="flex justify-end gap-3">
              <dt className="text-slate-400 dark:text-slate-500">Émise le</dt>
              <dd className="text-slate-600 dark:text-slate-400">
                {issueDate ? formatDate(issueDate, company.dateFormat) : "—"}
              </dd>
            </div>
            <div className="flex justify-end gap-3">
              <dt className="text-slate-400 dark:text-slate-500">Échéance</dt>
              <dd className="text-slate-600 dark:text-slate-400">
                {dueDate ? formatDate(dueDate, company.dateFormat) : "—"}
              </dd>
            </div>
            <div className="flex justify-end gap-3">
              <dt className="text-slate-400 dark:text-slate-500">Délai</dt>
              <dd className="text-slate-600 dark:text-slate-400">{company.paymentDueDays} jours</dd>
            </div>
          </dl>
        </div>

        {/* Blocs client + paiement */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Facturé à
            </p>
            {client ? (
              <>
                <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {client.name}
                </p>
                {client.address && (
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {client.address}
                  </p>
                )}
                {(client.phone || client.email) && (
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {[client.phone, client.email].filter(Boolean).join(" · ")}
                  </p>
                )}
              </>
            ) : (
              <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                Sélectionnez un client…
              </p>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Paiement
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
              {paymentMethod}
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Sous {company.paymentDueDays} jours
            </p>
          </div>
        </div>

        {/* Lignes */}
        <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <th className="px-3 py-2 font-semibold">Description</th>
                <th className="px-3 py-2 text-right font-semibold">Qté</th>
                <th className="px-3 py-2 text-right font-semibold">P.U.</th>
                <th className="px-3 py-2 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {lines.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-4 text-center text-slate-400 dark:text-slate-500"
                  >
                    Ajoutez au moins une ligne…
                  </td>
                </tr>
              ) : (
                lines.map((line, index) => (
                  <tr key={index} className="border-t border-slate-100 dark:border-slate-800 first:border-0">
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">
                      {line.description || "—"}
                    </td>
                    <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-400">
                      {formatQuantity(line.quantity)}
                    </td>
                    <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-400">
                      {formatMoney(line.unitPrice, company.currency)}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-slate-800 dark:text-slate-200">
                      {formatMoney(line.quantity * line.unitPrice, company.currency)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Totaux */}
        <dl className="mt-4 ml-auto w-full max-w-[15rem] space-y-1.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500 dark:text-slate-400">Sous-total</dt>
            <dd className="font-medium text-slate-800 dark:text-slate-200">
              {formatMoney(totals.subtotal, company.currency)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500 dark:text-slate-400">TVA ({vatRate}%)</dt>
            <dd className="font-medium text-slate-800 dark:text-slate-200">
              {formatMoney(totals.vatAmount, company.currency)}
            </dd>
          </div>
          <div className="flex justify-between rounded-lg bg-emerald-600/5 px-3 py-2 text-base ring-1 ring-emerald-600/10">
            <dt className="font-semibold text-slate-900 dark:text-slate-100">Total TTC</dt>
            <dd className="font-bold text-emerald-700 dark:text-emerald-400">
              {formatMoney(totals.total, company.currency)}
            </dd>
          </div>
        </dl>

        {/* Mentions + notes */}
        <div className="mt-4 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
          {notes.trim() ? (
            <p className="whitespace-pre-line text-slate-500 dark:text-slate-400">{notes}</p>
          ) : (
            <p className="text-slate-400 dark:text-slate-500">
              Paiement : {paymentMethod}, sous {company.paymentDueDays} jours.
            </p>
          )}
        </div>

        {/* Coordonnées de paiement */}
        {paymentDetails.length > 0 && (
          <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Coordonnées de paiement
            </p>
            <dl className="mt-1.5 space-y-1">
              {paymentDetails.map((detail) => (
                <div
                  key={detail.label}
                  className="flex items-baseline justify-between gap-3"
                >
                  <dt className="text-xs text-slate-500 dark:text-slate-400">
                    {detail.label}
                  </dt>
                  <dd className="text-right text-xs font-medium text-slate-800 dark:text-slate-200">
                    {detail.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <p className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3 text-[10px] text-slate-400 dark:text-slate-500">
          {company.name} — {company.taxId || "Sans N° contribuable"} — {company.email}
        </p>
      </div>
    </div>
  );
}
