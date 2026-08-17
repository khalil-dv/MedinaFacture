"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Eye, FileClock, Plus, Save, Trash2 } from "lucide-react";
import { z } from "zod";
import type { MockClient, MockInvoice } from "@/lib/data";
import { PAYMENT_METHODS } from "@/lib/data";
import { useStore, type InvoiceInput } from "@/lib/store";
import { computeLineTotal, computeTotals, nextInvoiceNumber } from "@/lib/calculations";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/Fields";
import { DatePicker } from "@/components/ui/DatePicker";
import { ClientCombobox } from "@/components/ui/ClientCombobox";
import { InvoicePreview } from "@/components/invoices/InvoicePreview";
import { Modal } from "@/components/ui/Modal";
import {
  type InvoiceDraft,
  clearInvoiceDraft,
  invoiceDraftKey,
  isInvoiceDraftEmpty,
  loadInvoiceDraft,
  saveInvoiceDraft,
} from "@/lib/invoice-draft";

interface LineDraft {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
}

interface InvoiceFormProps {
  invoice?: MockInvoice;
  onSaved?: () => void;
  onCancel?: () => void;
  /** Mode large (page de création) : aperçu en 50/50 pour le voir entièrement. */
  wide?: boolean;
}

const lineSchema = z.object({
  description: z.string().trim().min(1, "La description est requise"),
  quantity: z.number().refine(
    (v) => Number.isFinite(v) && v > 0,
    "Quantité positive requise",
  ),
  unitPrice: z.number().refine(
    (v) => Number.isFinite(v) && v > 0 && Number.isInteger(v),
    "Prix entier positif requis",
  ),
});

const invoiceFormSchema = z.object({
  clientQuery: z.string().trim().min(1, "Sélectionnez ou saisissez un client"),
  issueDate: z.string().min(1, "Date d'émission requise"),
  dueDate: z.string().min(1, "Date d'échéance requise"),
  vatRate: z
    .number()
    .refine((v) => Number.isFinite(v) && v >= 0, "Taux invalide")
    .refine((v) => v <= 100, "Taux maximum 100 %"),
  paymentMethod: z.string().trim().min(1, "Mode de paiement requis"),
  lines: z.array(lineSchema).min(1, "Ajoutez au moins une ligne"),
});

function toISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDaysTo(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

function parseNumeric(value: string): number {
  const normalized = value.replace(/\s/g, "").replace(",", ".");
  const parsed = parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

export function InvoiceForm({ invoice, onSaved, onCancel, wide = false }: InvoiceFormProps) {
  const router = useRouter();
  const { clients, invoices, company, user, createInvoice, updateInvoice, createClient } =
    useStore();

  const isEdit = Boolean(invoice);
  const todayISO = toISODate(new Date());
  const draftStorageKey = invoiceDraftKey(user.email);

  const [clientId, setClientId] = useState(invoice?.client.id ?? "");
  const [clientQuery, setClientQuery] = useState(invoice?.client.name ?? "");
  const [issueDate, setIssueDate] = useState(
    invoice?.issueDate ?? todayISO,
  );
  const [dueDate, setDueDate] = useState(
    invoice?.dueDate ??
      addDaysTo(invoice?.issueDate ?? todayISO, company.paymentDueDays),
  );
  const [autoDueDate, setAutoDueDate] = useState(!isEdit);
  const [saveStatus, setSaveStatus] = useState<"draft" | "sent">("draft");
  const [vatRate, setVatRate] = useState(
    invoice?.vatRate.toString() ?? company.defaultVatRate.toString(),
  );
  const [paymentMethod, setPaymentMethod] = useState(
    invoice?.paymentMethod ?? company.defaultPaymentMethod,
  );
  const [notes, setNotes] = useState(invoice?.notes ?? "");
  const [lines, setLines] = useState<LineDraft[]>(() =>
    invoice && invoice.lines.length > 0
      ? invoice.lines.map((line, index) => ({
          id: `l-${index}`,
          description: line.description,
          quantity: line.quantity.toString(),
          unitPrice: line.unitPrice.toString(),
        }))
      : [{ id: "l-0", description: "", quantity: "1", unitPrice: "" }],
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [savedDraft, setSavedDraft] = useState<InvoiceDraft | null>(null);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [savedInvoice, setSavedInvoice] = useState<{
    id: string;
    number: string;
  } | null>(null);

  const latestDraftRef = useRef<InvoiceDraft | null>(null);
  const resumePendingRef = useRef(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    latestDraftRef.current = {
      clientId,
      clientQuery,
      issueDate,
      dueDate,
      vatRate,
      paymentMethod,
      notes,
      lines,
      autoDueDate,
    };
  }, [clientId, clientQuery, issueDate, dueDate, vatRate, paymentMethod, notes, lines, autoDueDate]);

  useEffect(() => {
    if (isEdit) return;
    const existing = loadInvoiceDraft(draftStorageKey);
    if (existing && !isInvoiceDraftEmpty(existing)) {
      resumePendingRef.current = true;
      setSavedDraft(existing);
      setShowResumeDialog(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isEdit || saving || showResumeDialog || resumePendingRef.current || submittedRef.current)
      return;
    const latestDraft = latestDraftRef.current;
    if (!latestDraft) return;
    const timer = setTimeout(() => {
      saveInvoiceDraft(draftStorageKey, latestDraft);
    }, 500);
    return () => clearTimeout(timer);
  }, [
    clientId,
    clientQuery,
    issueDate,
    dueDate,
    vatRate,
    paymentMethod,
    notes,
    lines,
    autoDueDate,
    isEdit,
    saving,
    showResumeDialog,
    draftStorageKey,
  ]);

  useEffect(() => {
    const flush = () => {
      if (
        isEdit ||
        saving ||
        resumePendingRef.current ||
        submittedRef.current ||
        !latestDraftRef.current
      ) {
        return;
      }
      saveInvoiceDraft(draftStorageKey, latestDraftRef.current);
    };
    window.addEventListener("beforeunload", flush);
    return () => {
      window.removeEventListener("beforeunload", flush);
      flush();
    };
  }, [isEdit, saving, draftStorageKey]);

  const resumeSavedDraft = () => {
    if (!savedDraft) return;
    resumePendingRef.current = false;
    setClientId(savedDraft.clientId);
    setClientQuery(savedDraft.clientQuery);
    setIssueDate(savedDraft.issueDate);
    setDueDate(savedDraft.dueDate);
    setVatRate(savedDraft.vatRate);
    setPaymentMethod(savedDraft.paymentMethod);
    setNotes(savedDraft.notes);
    setLines(
      savedDraft.lines.length > 0
        ? savedDraft.lines
        : [{ id: "l-0", description: "", quantity: "1", unitPrice: "" }],
    );
    setAutoDueDate(savedDraft.autoDueDate);
    setShowResumeDialog(false);
    setSavedDraft(null);
  };

  const discardSavedDraft = () => {
    resumePendingRef.current = false;
    clearInvoiceDraft(draftStorageKey);
    setShowResumeDialog(false);
    setSavedDraft(null);
  };

  const nextNumber = nextInvoiceNumber(
    company.invoicePrefix,
    invoices.map((inv) => inv.number),
  );
  const previewNumber = invoice?.number ?? nextNumber;
  const selectedClient =
    clients.find(
      (c) =>
        c.id === clientId &&
        c.name.trim().toLowerCase() === clientQuery.trim().toLowerCase(),
    ) ??
    (clientQuery.trim()
      ? {
          id: "new-client",
          name: clientQuery.trim(),
          email: "",
          phone: "",
          address: "",
        }
      : undefined);

  const handleClientSelect = (client: MockClient) => {
    setClientId(client.id);
    setClientQuery(client.name);
    setErrors((prev) => ({ ...prev, clientQuery: "" }));
  };

  const handleClientClear = () => {
    setClientId("");
    setClientQuery("");
    setErrors((prev) => ({ ...prev, clientQuery: "" }));
  };

  const handleClientQuery = (query: string) => {
    setClientQuery(query);
    setClientId((prevId) => {
      const sel = clients.find((c) => c.id === prevId);
      return sel &&
        query.trim().toLowerCase() === sel.name.trim().toLowerCase()
        ? prevId
        : "";
    });
  };

  const handleIssueDateChange = (iso: string) => {
    setIssueDate(iso);
    setErrors((prev) => ({ ...prev, issueDate: "" }));
    if (autoDueDate) {
      setDueDate(addDaysTo(iso, company.paymentDueDays));
      setErrors((prev) => ({ ...prev, dueDate: "" }));
    }
  };

  const handleDueDateChange = (iso: string) => {
    setAutoDueDate(false);
    setDueDate(iso);
    setErrors((prev) => ({ ...prev, dueDate: "" }));
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key !== "Enter") return;
    const target = e.target as HTMLElement;
    if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) {
      e.preventDefault();
    }
  };

  const parsedLines = lines.map((line) => ({
    id: line.id,
    description: line.description,
    quantity: parseNumeric(line.quantity),
    unitPrice: parseNumeric(line.unitPrice),
  }));

  const totals = computeTotals(
    parsedLines.map(({ quantity, unitPrice }) => ({ quantity, unitPrice })),
    Number.isFinite(parseNumeric(vatRate)) ? parseNumeric(vatRate) : 0,
  );

  const updateLine = (id: string, field: keyof LineDraft, value: string) => {
    setLines((prev) =>
      prev.map((line) => (line.id === id ? { ...line, [field]: value } : line)),
    );
  };

  const addLine = () => {
    setLines((prev) => [
      ...prev,
      { id: `l-${Date.now()}-${prev.length}`, description: "", quantity: "1", unitPrice: "" },
    ]);
  };

  const removeLine = (id: string) => {
    setLines((prev) => prev.filter((line) => line.id !== id));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`line-${id}`];
      return next;
    });
  };

  const handleSubmit = async (status: "draft" | "sent") => {
    const vat = parseNumeric(vatRate);
    const result = invoiceFormSchema.safeParse({
      clientQuery,
      issueDate,
      dueDate,
      vatRate: vat,
      paymentMethod,
      lines: parsedLines,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (key === "lines" && typeof issue.path[1] === "number") {
          const lineId = lines[issue.path[1]]?.id;
          if (lineId) fieldErrors[`line-${lineId}`] = issue.message;
        } else if (key === "lines") {
          fieldErrors.lines = issue.message;
        } else if (typeof key === "string") {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    if (dueDate < issueDate) {
      setErrors((prev) => ({
        ...prev,
        dueDate: "L'échéance doit être après la date d'émission",
      }));
      return;
    }

    const input: InvoiceInput = {
      clientId,
      issueDate: result.data.issueDate,
      dueDate: result.data.dueDate,
      vatRate: result.data.vatRate,
      paymentMethod: result.data.paymentMethod,
      notes: notes.trim() || undefined,
      lines: result.data.lines.map(({ description, quantity, unitPrice }) => ({
        description,
        quantity,
        unitPrice,
      })),
    };

    setSubmitError(null);
    setSaving(true);
    try {
      const matched = clients.find(
        (c) =>
          c.name.trim().toLowerCase() ===
          clientQuery.trim().toLowerCase(),
      );
      let targetClientId = matched?.id ?? clientId;
      if (!targetClientId) {
        const created = await createClient({
          name: clientQuery.trim(),
          email: "",
          phone: "",
          address: "",
        });
        targetClientId = created.id;
      }

      if (isEdit && invoice) {
        await updateInvoice(invoice.id, { ...input, clientId: targetClientId });
        submittedRef.current = true;
        clearInvoiceDraft(draftStorageKey);
        setSaving(false);
        onSaved?.();
      } else {
        const created = await createInvoice(
          { ...input, clientId: targetClientId },
          status,
        );
        submittedRef.current = true;
        clearInvoiceDraft(draftStorageKey);
        setSaving(false);
        setSavedInvoice({ id: created.id, number: created.number });
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de l'enregistrement.",
      );
      setSaving(false);
    }
  };

  const resetForm = () => {
    submittedRef.current = false;
    clearInvoiceDraft(draftStorageKey);
    setSavedInvoice(null);
    setClientId("");
    setClientQuery("");
    setIssueDate(todayISO);
    setDueDate(addDaysTo(todayISO, company.paymentDueDays));
    setAutoDueDate(true);
    setVatRate(company.defaultVatRate.toString());
    setPaymentMethod(company.defaultPaymentMethod);
    setSaveStatus("draft");
    setNotes("");
    setLines([{ id: "l-0", description: "", quantity: "1", unitPrice: "" }]);
    setErrors({});
    setSubmitError(null);
  };

  const viewInvoice = () => {
    const target = savedInvoice;
    setSavedInvoice(null);
    if (target) router.push(`/invoices/${target.id}`);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      onKeyDown={handleFormKeyDown}
      className="space-y-6"
      noValidate
    >
      <div
        className={`grid grid-cols-1 gap-6 ${
          wide ? "lg:grid-cols-2" : isEdit ? "lg:grid-cols-1" : "lg:grid-cols-5"
        }`}
      >
        <div className={`space-y-6 ${wide || isEdit ? "" : "lg:col-span-3"}`}>
      {/* Client et dates */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 sm:p-6">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Informations de la facture
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="client">Client</Label>
            <ClientCombobox
              id="client"
              clients={clients}
              initialName={invoice?.client.name}
              onSelect={handleClientSelect}
              onClear={handleClientClear}
              onQueryChange={handleClientQuery}
            />
            <FieldError message={errors.clientQuery} />
          </div>

          <div>
            <Label htmlFor="issueDate">Date d&apos;émission</Label>
            <DatePicker
              id="issueDate"
              value={issueDate}
              onChange={handleIssueDateChange}
              max={autoDueDate ? undefined : dueDate || undefined}
            />
            <FieldError message={errors.issueDate} />
          </div>

          <div>
            <Label htmlFor="dueDate">Date d&apos;échéance</Label>
            <DatePicker
              id="dueDate"
              value={dueDate}
              onChange={handleDueDateChange}
              min={issueDate || undefined}
            />
            <FieldError message={errors.dueDate} />
            {autoDueDate && (
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Calculée automatiquement — délai de paiement :{" "}
                {company.paymentDueDays} jours
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="vatRate">Taux de TVA (%)</Label>
            <Input
              id="vatRate"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={vatRate}
              onChange={(e) => setVatRate(e.target.value)}
              className="w-full md:w-40"
            />
            <FieldError message={errors.vatRate} />
          </div>

          <div>
            <Label htmlFor="paymentMethod">Mode de paiement</Label>
            <Select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </Select>
            <FieldError message={errors.paymentMethod} />
          </div>

          {!isEdit && (
            <div>
              <Label htmlFor="invoiceStatus">Statut</Label>
              <Select
                id="invoiceStatus"
                value={saveStatus}
                onChange={(e) =>
                  setSaveStatus(e.target.value as "draft" | "sent")
                }
              >
                <option value="draft">Brouillon</option>
                <option value="sent">Envoyée</option>
              </Select>
            </div>
          )}
        </div>

        {!isEdit && (
          <p className="mt-4 rounded-lg bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
            Numéro de facture : <span className="font-semibold">{nextNumber}</span>{" "}
            (généré automatiquement)
          </p>
        )}
      </section>

      {/* Lignes de facture */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 sm:p-6">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Lignes de facture
        </h2>

        <div className="mt-4 hidden grid-cols-12 gap-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 md:grid">
          <div className="col-span-5">Description</div>
          <div className="col-span-2">Quantité</div>
          <div className="col-span-2">Prix unitaire</div>
          <div className="col-span-2 text-right">Total</div>
          <div className="col-span-1" />
        </div>

        <div className="mt-2 space-y-4 md:mt-0">
          {lines.map((line) => {
            const lineTotal = computeLineTotal(
              parsedLines.find((p) => p.id === line.id)?.quantity ?? 0,
              parsedLines.find((p) => p.id === line.id)?.unitPrice ?? 0,
            );

            return (
              <div
                key={line.id}
                className="grid grid-cols-12 items-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-3 first:border-0 first:pt-0 md:border-t md:pt-0"
              >
                <div className="col-span-12 md:col-span-5">
                  <Label className="text-xs md:hidden">Description</Label>
                  <Input
                    type="text"
                    placeholder="Description de la prestation"
                    value={line.description}
                    onChange={(e) =>
                      updateLine(line.id, "description", e.target.value)
                    }
                  />
                  <FieldError message={errors[`line-${line.id}`]} />
                </div>

                <div className="col-span-3 md:col-span-2">
                  <Label className="text-xs md:hidden">Quantité</Label>
                  <Input
                    type="number"
                    min="0"
                    step="any"
                    inputMode="decimal"
                    placeholder="1"
                    value={line.quantity}
                    onChange={(e) =>
                      updateLine(line.id, "quantity", e.target.value)
                    }
                  />
                </div>

                <div className="col-span-4 md:col-span-2">
                  <Label className="text-xs md:hidden">Prix unitaire</Label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    placeholder="0"
                    value={line.unitPrice}
                    onChange={(e) =>
                      updateLine(line.id, "unitPrice", e.target.value)
                    }
                  />
                </div>

                <div className="col-span-4 pb-2 text-right md:col-span-2">
                  <Label className="text-xs md:hidden">Total</Label>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {formatMoney(lineTotal, company.currency)}
                  </p>
                </div>

                <div className="col-span-1 flex justify-end pb-2 md:pb-2.5">
                  <button
                    type="button"
                    onClick={() => removeLine(line.id)}
                    aria-label="Supprimer cette ligne"
                    className="rounded-lg p-2 text-slate-400 dark:text-slate-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <FieldError message={errors.lines} />

        <button
          type="button"
          onClick={addLine}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 transition-colors hover:border-emerald-500 hover:text-emerald-700"
        >
          <Plus className="size-4" aria-hidden="true" />
          Ajouter une ligne
        </button>

        {/* Totaux */}
        <div className="mt-6 flex justify-end border-t border-slate-100 dark:border-slate-800 pt-4">
          <dl className="w-full max-w-xs space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Sous-total</dt>
              <dd className="font-medium text-slate-800 dark:text-slate-200">
                {formatMoney(totals.subtotal, company.currency)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">
                TVA ({Number.isFinite(parseNumeric(vatRate)) ? parseNumeric(vatRate) : 0}%)
              </dt>
              <dd className="font-medium text-slate-800 dark:text-slate-200">
                {formatMoney(totals.vatAmount, company.currency)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 text-base">
              <dt className="font-semibold text-slate-900 dark:text-slate-100">Total TTC</dt>
              <dd className="font-bold text-slate-900 dark:text-slate-100">
                {formatMoney(totals.total, company.currency)}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Notes */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 sm:p-6">
        <Label htmlFor="notes">Notes (optionnel)</Label>
        <Textarea
          id="notes"
          rows={3}
          placeholder="Conditions de paiement, références…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </section>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        {submitError && (
          <p className="mr-auto rounded-lg bg-red-50 dark:bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {submitError}
          </p>
        )}
        <Button variant="ghost" onClick={() => (isEdit ? onCancel?.() : router.push("/invoices"))}>
          Annuler
        </Button>

        {isEdit ? (
          <Button variant="primary" onClick={() => handleSubmit("draft")} disabled={saving}>
            <Save className="size-4" aria-hidden="true" />
            {saving ? "Enregistrement…" : "Enregistrer"}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => handleSubmit(saveStatus)}
            disabled={saving}
          >
            <Save className="size-4" aria-hidden="true" />
            {saving ? "Enregistrement…" : "Enregistrer"}
          </Button>
        )}
      </div>
        </div>

        {/* Aperçu live */}
        {!isEdit && (
          <aside>
            <InvoicePreview
              company={company}
              client={selectedClient}
              number={previewNumber}
              issueDate={issueDate}
              dueDate={dueDate}
              vatRate={
                Number.isFinite(parseNumeric(vatRate))
                  ? parseNumeric(vatRate)
                  : 0
              }
              paymentMethod={paymentMethod}
              lines={parsedLines}
              totals={totals}
              notes={notes}
              onSave={() => handleSubmit(saveStatus)}
              saving={saving}
            />
          </aside>
        )}
      </div>

      {isEdit && (
        <section>
          <InvoicePreview
            company={company}
            client={selectedClient}
            number={previewNumber}
            issueDate={issueDate}
            dueDate={dueDate}
            vatRate={
              Number.isFinite(parseNumeric(vatRate)) ? parseNumeric(vatRate) : 0
            }
            paymentMethod={paymentMethod}
            lines={parsedLines}
            totals={totals}
            notes={notes}
            saving={saving}
          />
        </section>
      )}

      <Modal
        open={showResumeDialog}
        onClose={resumeSavedDraft}
        title="Une facture non terminée a été trouvée"
        description="Un brouillon de facture a été sauvegardé automatiquement. Voulez-vous le terminer ou repartir de zéro ?"
      >
        <div className="space-y-4">
          {savedDraft && (
            <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-4 text-sm text-slate-600 dark:text-slate-400">
              <ul className="space-y-1">
                <li>
                  Client :{" "}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {savedDraft.clientQuery || "—"}
                  </span>
                </li>
                <li>
                  Lignes :{" "}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {savedDraft.lines.length}
                  </span>
                </li>
              </ul>
            </div>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={discardSavedDraft}>
              Nouvelle facture
            </Button>
            <Button onClick={resumeSavedDraft}>
              <FileClock className="size-4" aria-hidden="true" />
              Reprendre le brouillon
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(savedInvoice)}
        onClose={viewInvoice}
        title="Facture enregistrée"
        description="Votre facture a bien été créée et retrouvée dans la section Factures."
      >
        <div className="space-y-4">
          {savedInvoice && (
            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />
              <p>
                La facture{" "}
                <span className="font-semibold">{savedInvoice.number}</span>{" "}
                est enregistrée. Vous pouvez la modifier et changer son statut à
                tout moment depuis sa page.
              </p>
            </div>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={resetForm}>
              <Plus className="size-4" aria-hidden="true" />
              Créer une autre facture
            </Button>
            <Button onClick={viewInvoice}>
              <Eye className="size-4" aria-hidden="true" />
              Voir la facture
            </Button>
          </div>
        </div>
      </Modal>
    </form>
  );
}

