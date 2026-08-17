"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Banknote,
  CalendarClock,
  Download,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Trash2,
} from "lucide-react";
import type { InvoiceStatus } from "@/lib/data";
import { useStore } from "@/lib/store";
import { computeLineTotal } from "@/lib/calculations";
import { formatDate, formatMoney, formatQuantity } from "@/lib/format";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Fields";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function InvoiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const {
    invoices,
    clients,
    company,
    setInvoiceStatus,
    recordPayment,
    deleteInvoice,
  } = useStore();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSaving, setPaymentSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const invoice = invoices.find((inv) => inv.id === params.id);
  const client = clients.find((c) => c.id === invoice?.client.id);

  if (!invoice || !client) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">Facture introuvable.</p>
      </div>
    );
  }

  const statusOptions: { value: InvoiceStatus; label: string }[] = [
    { value: "draft", label: "Brouillon" },
    { value: "sent", label: "Envoyée" },
    { value: "paid", label: "Payée" },
    { value: "overdue", label: "En retard" },
  ];
  const remaining = Math.max(invoice.total - invoice.amountPaid, 0);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const { downloadInvoicePdf } = await import("@/lib/pdf");
      downloadInvoicePdf(invoice, company);
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteInvoice(invoice.id);
      router.push("/invoices");
    } catch {
      router.push("/invoices");
    } finally {
      setConfirmDelete(false);
    }
  };

  const openPayment = () => {
    setPaymentAmount(String(remaining));
    setPaymentError(null);
    setPaymentOpen(true);
  };

  const handlePayment = async () => {
    const amount = Number(paymentAmount.replace(",", "."));
    if (!Number.isFinite(amount) || amount <= 0) {
      setPaymentError("Saisissez un montant valide.");
      return;
    }
    setPaymentSaving(true);
    setPaymentError(null);
    try {
      await recordPayment(invoice.id, amount);
      setPaymentOpen(false);
    } catch (err) {
      setPaymentError(
        err instanceof Error
          ? err.message
          : "Impossible d'enregistrer le paiement.",
      );
    } finally {
      setPaymentSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/invoices"
            aria-label="Retour aux factures"
            className="rounded-lg p-2 text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {invoice.number}
              </h1>
              <StatusBadge status={invoice.status} />
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Émise le {formatDate(invoice.issueDate, company.dateFormat)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {invoice.status !== "paid" && remaining > 0 && (
            <Button onClick={openPayment}>
              <Banknote className="size-4" aria-hidden="true" />
              Encaisser
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => router.push(`/invoices/${invoice.id}/edit`)}
          >
            <Pencil className="size-4" aria-hidden="true" />
            Modifier
          </Button>
          <Button
            variant="secondary"
            onClick={handleDownload}
            disabled={downloading}
          >
            <Download className="size-4" aria-hidden="true" />
            {downloading ? "Préparation…" : "Télécharger"}
          </Button>
          <Button
            variant="danger"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Colonne principale */}
        <div className="space-y-6 lg:col-span-2">
          {/* Lignes */}
          <section className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-card ring-1 ring-slate-200 dark:ring-slate-800">
            <div className="border-b border-slate-100 dark:border-slate-800 px-5 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Détail de la facture
              </h2>
            </div>

            <div className="hidden grid-cols-12 gap-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 md:grid">
              <div className="col-span-5">Description</div>
              <div className="col-span-2">Quantité</div>
              <div className="col-span-2">Prix unitaire</div>
              <div className="col-span-3 text-right">Total</div>
            </div>

            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {invoice.lines.map((line, index) => (
                <li
                  key={index}
                  className="grid grid-cols-2 items-center gap-3 px-5 py-3.5 sm:px-6 md:grid-cols-12"
                >
                  <div className="col-span-2 md:col-span-5">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {line.description}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-slate-400 dark:text-slate-500 md:hidden">Quantité</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {formatQuantity(line.quantity)}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-slate-400 dark:text-slate-500 md:hidden">
                      Prix unitaire
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {formatMoney(line.unitPrice, company.currency)}
                    </p>
                  </div>
                  <div className="text-right md:col-span-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {formatMoney(
                        computeLineTotal(line.quantity, line.unitPrice),
                        company.currency,
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-6 py-4">
              <dl className="w-full max-w-xs space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">Sous-total</dt>
                  <dd className="font-medium text-slate-800 dark:text-slate-200">
                    {formatMoney(invoice.subtotal, company.currency)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">
                    TVA ({invoice.vatRate}%)
                  </dt>
                  <dd className="font-medium text-slate-800 dark:text-slate-200">
                    {formatMoney(invoice.vatAmount, company.currency)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 text-base">
                  <dt className="font-semibold text-slate-900 dark:text-slate-100">Total TTC</dt>
                  <dd className="font-bold text-slate-900 dark:text-slate-100">
                    {formatMoney(invoice.total, company.currency)}
                  </dd>
                </div>
                {invoice.amountPaid > 0 && (
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                    <dt>Encaissé</dt>
                    <dd className="font-semibold">
                      {formatMoney(invoice.amountPaid, company.currency)}
                    </dd>
                  </div>
                )}
                {remaining > 0 && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <dt>Reste dû</dt>
                    <dd className="font-semibold">
                      {formatMoney(remaining, company.currency)}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </section>

          {invoice.notes && (
            <section className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 sm:p-6">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Notes</h2>
              <p className="mt-2 whitespace-pre-line text-sm text-slate-600 dark:text-slate-400">
                {invoice.notes}
              </p>
            </section>
          )}
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Statut */}
          <section className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 sm:p-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Statut</h2>
            <div className="mt-3">
              <Label htmlFor="status">Changer le statut</Label>
              <Select
                id="status"
                value={invoice.status}
                onChange={(e) =>
                  setInvoiceStatus(invoice.id, e.target.value as InvoiceStatus).catch(
                    () => undefined,
                  )
                }
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Le statut « En retard » est aussi appliqué automatiquement
                lorsqu&apos;une facture envoyée arrive à échéance sans être payée.
              </p>
            </div>
          </section>

          {/* Client */}
          <section className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 sm:p-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Client</h2>
            <div className="mt-3 space-y-2.5 text-sm">
              <p className="font-semibold text-slate-900 dark:text-slate-100">{client.name}</p>
              {client.email && (
                <p className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Mail className="size-4 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                  <span className="truncate">{client.email}</span>
                </p>
              )}
              {client.phone && (
                <p className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Phone className="size-4 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                  {client.phone}
                </p>
              )}
              {client.address && (
                <p className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                  {client.address}
                </p>
              )}
            </div>
          </section>

          {/* Échéances */}
          <section className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 sm:p-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Échéances</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Date d&apos;émission</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {formatDate(invoice.issueDate, company.dateFormat)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Date d&apos;échéance</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {formatDate(invoice.dueDate, company.dateFormat)}
                </span>
              </div>
              <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <CalendarClock className="size-4" aria-hidden="true" />
                  Statut actuel
                </span>
                <StatusBadge status={invoice.status} />
              </div>
            </div>
          </section>

          {/* Paiement */}
          <section className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 sm:p-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Paiement</h2>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <Banknote className="size-4 text-slate-400 dark:text-slate-500" aria-hidden="true" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {invoice.paymentMethod || company.defaultPaymentMethod}
              </span>
            </div>

            {(company.bankAccountNumber ||
              company.waveNumber ||
              company.orangeMoneyNumber) && (
              <div className="mt-3 space-y-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-3 text-xs text-slate-600 dark:text-slate-400">
                {company.bankAccountNumber && (
                  <p>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Virement bancaire
                    </span>
                    {" — "}
                    {[company.bankAccountName, company.bankName].filter(Boolean).join(" · ")}
                    {" · "}
                    {company.bankAccountNumber}
                  </p>
                )}
                {company.waveNumber && (
                  <p>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Wave</span> —{" "}
                    {company.waveNumber}
                  </p>
                )}
                {company.orangeMoneyNumber && (
                  <p>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Orange Money
                    </span>{" "}
                    — {company.orangeMoneyNumber}
                  </p>
                )}
              </div>
            )}

            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Échéance : {formatDate(invoice.dueDate, company.dateFormat)} — sous{" "}
              {company.paymentDueDays} jours.
            </p>
          </section>
        </div>
      </div>

      {/* Confirmation suppression */}
      <ConfirmDialog
        open={confirmDelete}
        title="Supprimer cette facture ?"
        description={`La facture ${invoice.number} (${formatMoney(
          invoice.total,
          company.currency,
        )}) sera définitivement supprimée. Cette action est irréversible.`}
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onClose={() => setConfirmDelete(false)}
      />

      {/* Modal d'encaissement */}
      <Modal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        title="Encaisser un paiement"
        description={`Facture ${invoice.number} — reste dû ${formatMoney(
          remaining,
          company.currency,
        )}.`}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="payment-amount">Montant reçu</Label>
            <Input
              id="payment-amount"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="0"
              autoFocus
            />
          </div>
          {paymentError && (
            <p className="text-sm text-red-600 dark:text-red-400">{paymentError}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => setPaymentAmount(String(remaining))}
            >
              Reste dû
            </Button>
            <Button
              variant="secondary"
              onClick={() => setPaymentAmount(String(invoice.total))}
            >
              Total de la facture
            </Button>
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            <Button variant="ghost" onClick={() => setPaymentOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handlePayment} disabled={paymentSaving}>
              {paymentSaving ? "Enregistrement…" : "Enregistrer le paiement"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
