"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Mail, Pencil, Phone, Plus, Trash2, Users } from "lucide-react";
import { z } from "zod";
import type { MockClient } from "@/lib/data";
import { useStore, type ClientInput } from "@/lib/store";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { FieldError, Input, Label, Textarea } from "@/components/ui/Fields";
import { useTranslation } from "@/lib/i18n";
import { TableSkeleton } from "@/components/ui/Skeleton";

const clientSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis"),
  email: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      "Adresse email invalide",
    ),
  phone: z.string().trim(),
  address: z.string().trim(),
});

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

interface ClientFormState {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const EMPTY_FORM: ClientFormState = { name: "", email: "", phone: "", address: "" };

export default function ClientsPage() {
  const { clients, invoices, company, ready, createClient, updateClient, deleteClient } =
    useStore();
  const { t } = useTranslation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MockClient | null>(null);
  const [form, setForm] = useState<ClientFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof ClientFormState, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MockClient | null>(null);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);

  const statsByClient = useMemo(() => {
    const map = new Map<string, { count: number; total: number }>();
    for (const inv of invoices) {
      const entry = map.get(inv.client.id) ?? { count: 0, total: 0 };
      entry.count += 1;
      entry.total += inv.total;
      map.set(inv.client.id, entry);
    }
    return map;
  }, [invoices]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (client: MockClient) => {
    setEditing(client);
    setForm({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
    });
    setErrors({});
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const result = clientSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ClientFormState, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ClientFormState;
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    const input: ClientInput = result.data;
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        await updateClient(editing.id, input);
      } else {
        await createClient(input);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Une erreur est survenue.",
      );
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (client: MockClient) => {
    const stats = statsByClient.get(client.id);
    if (stats && stats.count > 0) {
      setBlockedMessage(
        `Impossible de supprimer « ${client.name} » : ce client a ${stats.count} facture(s). Supprimez d'abord ses factures.`,
      );
      setTimeout(() => setBlockedMessage(null), 6000);
      return;
    }
    setDeleteTarget(client);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteClient(deleteTarget.id);
    } catch (err) {
      setBlockedMessage(
        err instanceof Error
          ? err.message
          : "Impossible de supprimer ce client.",
      );
      setTimeout(() => setBlockedMessage(null), 6000);
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t("clients.title")}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("clients.subtitle")}
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="size-4" aria-hidden="true" />
          {t("clients.newClient")}
        </Button>
      </div>

      {!ready ? (
        <TableSkeleton rows={5} cols={4} />
      ) : (
        <>
          {blockedMessage && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {blockedMessage}
        </div>
      )}

      {clients.length === 0 ? (
        <EmptyState
          icon={Users}
          title={t("clients.empty")}
          description={t("clients.emptyDesc")}
          action={
            <Button onClick={openAdd}>
              <Plus className="size-4" aria-hidden="true" />
              {t("clients.addFirst")}
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-card ring-1 ring-slate-200 dark:ring-slate-800">
          {/* Mobile : cartes */}
          <ul className="divide-y divide-slate-100 dark:divide-slate-800 md:hidden">
            {clients.map((client) => {
              const stats = statsByClient.get(client.id);
              return (
                <li key={client.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-600/10 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                        {initials(client.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {client.name}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {client.email || client.phone || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        onClick={() => openEdit(client)}
                        aria-label={`${t("clients.edit")} ${client.name}`}
                        className="rounded-lg p-2 text-slate-400 dark:text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
                      >
                        <Pencil className="size-4" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => requestDelete(client)}
                        aria-label={`${t("clients.delete")} ${client.name}`}
                        className="rounded-lg p-2 text-slate-400 dark:text-slate-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                    {stats ? `${stats.count} ${t("clients.hasInvoices")} · ${formatMoney(stats.total, company.currency)}` : t("clients.empty")}
                  </p>
                </li>
              );
            })}
          </ul>

          {/* Desktop : tableau */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-y border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-3">{t("clients.client")}</th>
                  <th className="px-4 py-3">{t("clients.phone")}</th>
                  <th className="px-4 py-3">{t("clients.email")}</th>
                  <th className="px-4 py-3 text-center">{t("clients.invoices")}</th>
                  <th className="px-4 py-3 text-right">Total facturé</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {clients.map((client) => {
                  const stats = statsByClient.get(client.id);
                  return (
                    <tr key={client.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/70">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-600/10 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                            {initials(client.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              {client.name}
                            </p>
                            <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                              <Mail className="size-3.5" aria-hidden="true" />
                              {client.email || "—"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Phone className="size-3.5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                          {client.phone || "—"}
                        </span>
                      </td>
                      <td className="max-w-[240px] truncate px-4 py-3.5 text-slate-600 dark:text-slate-400">
                        {client.address || "—"}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex min-w-8 justify-center rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                          {stats?.count ?? 0}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-right font-semibold text-slate-900 dark:text-slate-100">
                        {stats ? formatMoney(stats.total, company.currency) : "—"}
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openEdit(client)}
                            aria-label={`${t("clients.edit")} ${client.name}`}
                            className="rounded-lg p-2 text-slate-400 dark:text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
                          >
                            <Pencil className="size-4" aria-hidden="true" />
                          </button>
                          <button
                            onClick={() => requestDelete(client)}
                            aria-label={`${t("clients.delete")} ${client.name}`}
                            className="rounded-lg p-2 text-slate-400 dark:text-slate-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
        </>
      )}

      {/* Modal ajouter / modifier */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? t("clientForm.editTitle") : t("clientForm.newTitle")}
        description={
          editing
            ? "Mettez à jour les informations du client."
            : "Ajoutez un nouveau client à votre répertoire."
        }
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="client-name">{t("clientForm.name")}</Label>
            <Input
              id="client-name"
              placeholder={t("clientForm.namePlaceholder")}
              value={form.name}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, name: e.target.value }));
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
            />
            <FieldError message={errors.name} />
          </div>

          <div>
            <Label htmlFor="client-email">{t("clientForm.email")}</Label>
            <Input
              id="client-email"
              type="email"
              placeholder="contact@entreprise.sn"
              value={form.email}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, email: e.target.value }));
                setErrors((prev) => ({ ...prev, email: undefined }));
              }}
            />
            <FieldError message={errors.email} />
          </div>

          <div>
            <Label htmlFor="client-phone">{t("clientForm.phone")}</Label>
            <Input
              id="client-phone"
              type="tel"
              placeholder="+221 77 000 00 00"
              value={form.phone}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, phone: e.target.value }));
                setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
            />
            <FieldError message={errors.phone} />
          </div>

          <div>
            <Label htmlFor="client-address">{t("clientForm.address")}</Label>
            <Textarea
              id="client-address"
              rows={2}
              placeholder="Adresse complète"
              value={form.address}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, address: e.target.value }));
                setErrors((prev) => ({ ...prev, address: undefined }));
              }}
            />
            <FieldError message={errors.address} />
          </div>

          {formError && (
            <p className="rounded-lg bg-red-50 dark:bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
              {formError}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              {t("clientForm.cancel")}
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving
                ? t("common.save") + "…"
                : editing
                  ? t("clientForm.save")
                  : t("clients.newClient")}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirmation suppression */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Supprimer ce client ?"
        description={
          deleteTarget
            ? `Le client « ${deleteTarget.name} » sera définitivement supprimé de votre répertoire.`
            : ""
        }
        confirmLabel={t("common.delete")}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
