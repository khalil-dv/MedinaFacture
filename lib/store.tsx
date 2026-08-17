"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { InvoiceStatus, MockClient, MockInvoice } from "@/lib/data";
import { effectiveStatus } from "@/lib/data";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { computeTotals, nextInvoiceNumber } from "@/lib/calculations";

export interface CompanySettings {
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  logoDataUrl?: string;
  defaultVatRate: number;
  currency: string;
  country: string;
  language: string;
  dateFormat: string;
  paymentDueDays: number;
  invoicePrefix: string;
  defaultPaymentMethod: string;
  paymentReminders: boolean;
  defaultNotes: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  waveNumber: string;
  orangeMoneyNumber: string;
}

const DEFAULT_COMPANY: CompanySettings = {
  name: "IziFacture",
  ownerName: "",
  email: "",
  phone: "",
  address: "",
  taxId: "",
  defaultVatRate: 18,
  currency: "XOF",
  country: "Sénégal",
  language: "Français",
  dateFormat: "jj/mm/aaaa",
  paymentDueDays: 30,
  invoicePrefix: "INV",
  defaultPaymentMethod: "Virement bancaire",
  paymentReminders: true,
  defaultNotes: "Paiement à réception. Merci de votre confiance !",
  bankName: "",
  bankAccountName: "",
  bankAccountNumber: "",
  waveNumber: "",
  orangeMoneyNumber: "",
};

export interface InvoiceLineInput {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceInput {
  clientId: string;
  issueDate: string;
  dueDate: string;
  vatRate: number;
  paymentMethod: string;
  notes?: string;
  lines: InvoiceLineInput[];
}

export interface ClientInput {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface StoreShape {
  invoices: MockInvoice[];
  clients: MockClient[];
  company: CompanySettings;
  user: { email: string; fullName: string };
  ready: boolean;
  loadError: string | null;
  retryLoad: () => void;
  updateCompany: (patch: Partial<CompanySettings>) => Promise<void>;
  createInvoice: (
    input: InvoiceInput,
    status: "draft" | "sent",
  ) => Promise<MockInvoice>;
  updateInvoice: (id: string, input: InvoiceInput) => Promise<void>;
  setInvoiceStatus: (id: string, status: InvoiceStatus) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  recordPayment: (id: string, amount: number) => Promise<void>;
  createClient: (input: ClientInput) => Promise<MockClient>;
  updateClient: (id: string, input: ClientInput) => Promise<void>;
  deleteClient: (id: string) => Promise<boolean>;
}

const StoreContext = createContext<StoreShape | null>(null);

interface ClientRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface LineRow {
  description: string;
  quantity: number;
  unit_price: number;
}

interface InvoiceRow {
  id: string;
  number: string;
  client: ClientRow;
  issue_date: string;
  due_date: string;
  status: InvoiceStatus;
  payment_method: string;
  vat_rate: number;
  subtotal: number;
  vat_amount: number;
  total: number;
  amount_paid: number;
  notes: string;
  lines: LineRow[];
}

interface CompanyRow {
  name: string;
  owner_name: string;
  email: string;
  phone: string;
  address: string;
  tax_id: string;
  logo_data_url: string | null;
  default_vat_rate: number;
  currency: string;
  country: string;
  language: string;
  date_format: string;
  payment_due_days: number;
  invoice_prefix: string;
  default_payment_method: string;
  payment_reminders: boolean;
  default_notes: string;
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
  wave_number: string;
  orange_money_number: string;
}

function mapClient(row: ClientRow): MockClient {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    address: row.address,
  };
}

function isMissingColumnError(message: string, column: string): boolean {
  return (
    message.includes(`'${column}'`) &&
    message.toLowerCase().includes("could not find")
  );
}

function mapInvoice(row: InvoiceRow): MockInvoice {
  return {
    id: row.id,
    number: row.number,
    client: mapClient(row.client),
    issueDate: row.issue_date,
    dueDate: row.due_date,
    status: effectiveStatus(row.status, row.due_date),
    paymentMethod: row.payment_method ?? "Virement bancaire",
    subtotal: Number(row.subtotal),
    vatRate: Number(row.vat_rate),
    vatAmount: Number(row.vat_amount),
    total: Number(row.total),
    amountPaid: Number(row.amount_paid),
    notes: row.notes || undefined,
    lines: (row.lines ?? []).map((line) => ({
      description: line.description,
      quantity: Number(line.quantity),
      unitPrice: Number(line.unit_price),
    })),
  };
}

function mapCompany(row: CompanyRow): CompanySettings {
  return {
    name: row.name,
    ownerName: row.owner_name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    taxId: row.tax_id,
    logoDataUrl: row.logo_data_url ?? undefined,
    defaultVatRate: Number(row.default_vat_rate),
    currency: row.currency,
    country: row.country,
    language: row.language,
    dateFormat: row.date_format,
    paymentDueDays: row.payment_due_days,
    invoicePrefix: row.invoice_prefix,
    defaultPaymentMethod: row.default_payment_method,
    paymentReminders: row.payment_reminders,
    defaultNotes: row.default_notes,
    bankName: row.bank_name,
    bankAccountName: row.bank_account_name,
    bankAccountNumber: row.bank_account_number,
    waveNumber: row.wave_number,
    orangeMoneyNumber: row.orange_money_number,
  };
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createSupabaseClient(), []);

  const [invoices, setInvoices] = useState<MockInvoice[]>([]);
  const [clients, setClients] = useState<MockClient[]>([]);
  const [company, setCompany] = useState<CompanySettings>(DEFAULT_COMPANY);
  const [user, setUser] = useState({ email: "", fullName: "" });
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const companyRef = useRef<CompanySettings>(DEFAULT_COMPANY);
  const userIdRef = useRef<string | null>(null);
  const cancelledRef = useRef(false);
  const schemaRef = useRef<{
    paymentMethod?: boolean;
    bankCoords?: boolean;
  }>({});

  useEffect(() => {
    companyRef.current = company;
  }, [company]);

  const loadData = useCallback(async () => {
    setReady(false);
    setLoadError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelledRef.current) return;
      if (!user) {
        setReady(true);
        return;
      }
      userIdRef.current = user.id;
      setUser({
        email: user.email ?? "",
        fullName:
          (user.user_metadata?.full_name as string | undefined) ?? "",
      });

      const [clientsRes, invoicesRes, companyRes] = await Promise.all([
        supabase.from("clients").select("*").order("name"),
        supabase
          .from("invoices")
          .select("*, client:clients(*), lines:invoice_lines(*)")
          .order("created_at", { ascending: false }),
        supabase.from("company_settings").select("*").maybeSingle(),
      ]);
      if (cancelledRef.current) return;

      setClients((clientsRes.data ?? []).map((row) => mapClient(row as ClientRow)));
      setInvoices(
        (invoicesRes.data ?? []).map((row) => mapInvoice(row as InvoiceRow)),
      );
      if (companyRes.data) {
        const mapped = mapCompany(companyRes.data as CompanyRow);
        setCompany(mapped);
        companyRef.current = mapped;
        schemaRef.current.bankCoords =
          "bank_name" in (companyRes.data as Record<string, unknown>);
      }
      const invoiceRows = invoicesRes.data ?? [];
      schemaRef.current.paymentMethod =
        invoiceRows.length === 0
          ? undefined
          : "payment_method" in (invoiceRows[0] as Record<string, unknown>);
      setReady(true);
    } catch (err) {
      if (cancelledRef.current) return;
      setLoadError(
        err instanceof Error
          ? err.message
          : "Impossible de charger vos données.",
      );
      setReady(true);
    }
  }, [supabase]);

  useEffect(() => {
    cancelledRef.current = false;
    loadData();
    return () => {
      cancelledRef.current = true;
    };
  }, [loadData]);

  const updateCompany = useCallback(
    async (patch: Partial<CompanySettings>) => {
      const next = { ...companyRef.current, ...patch };
      companyRef.current = next;
      setCompany(next);

      const userId = userIdRef.current;
      if (!userId) return;

      const payload: Record<string, unknown> = {
        user_id: userId,
        name: next.name,
        owner_name: next.ownerName,
        email: next.email,
        phone: next.phone,
        address: next.address,
        tax_id: next.taxId,
        logo_data_url: next.logoDataUrl ?? null,
        default_vat_rate: next.defaultVatRate,
        currency: next.currency,
        country: next.country,
        language: next.language,
        date_format: next.dateFormat,
        payment_due_days: next.paymentDueDays,
        invoice_prefix: next.invoicePrefix,
        default_payment_method: next.defaultPaymentMethod,
        payment_reminders: next.paymentReminders,
        default_notes: next.defaultNotes,
      };
      if (schemaRef.current.bankCoords !== false) {
        payload.bank_name = next.bankName;
        payload.bank_account_name = next.bankAccountName;
        payload.bank_account_number = next.bankAccountNumber;
        payload.wave_number = next.waveNumber;
        payload.orange_money_number = next.orangeMoneyNumber;
      }

      const { error } = await supabase
        .from("company_settings")
        .upsert(payload, { onConflict: "user_id" });
      if (error) throw new Error(error.message);
    },
    [supabase],
  );

  const createInvoice = useCallback(
    async (input: InvoiceInput, status: "draft" | "sent"): Promise<MockInvoice> => {
      const userId = userIdRef.current;
      if (!userId) throw new Error("Utilisateur non identifié.");

      const number = nextInvoiceNumber(
        companyRef.current.invoicePrefix,
        invoices.map((inv) => inv.number),
      );
      const totals = computeTotals(input.lines, input.vatRate);

      const insertPayload: Record<string, unknown> = {
        user_id: userId,
        client_id: input.clientId,
        number,
        issue_date: input.issueDate,
        due_date: input.dueDate,
        status,
        vat_rate: input.vatRate,
        subtotal: totals.subtotal,
        vat_amount: totals.vatAmount,
        total: totals.total,
        amount_paid: 0,
        notes: input.notes ?? "",
      };
      if (schemaRef.current.paymentMethod !== false) {
        insertPayload.payment_method = input.paymentMethod;
      }

      let { data: inserted, error } = await supabase
        .from("invoices")
        .insert(insertPayload)
        .select("id")
        .single();
      if (
        error &&
        schemaRef.current.paymentMethod !== false &&
        isMissingColumnError(error.message, "payment_method")
      ) {
        schemaRef.current.paymentMethod = false;
        delete insertPayload.payment_method;
        const retry = await supabase
          .from("invoices")
          .insert(insertPayload)
          .select("id")
          .single();
        inserted = retry.data;
        error = retry.error;
      }
      if (error) throw new Error(error.message);
      if (!inserted) throw new Error("La facture n'a pas pu être créée.");

      const { error: linesError } = await supabase.from("invoice_lines").insert(
        input.lines.map((line) => ({
          invoice_id: inserted.id,
          description: line.description,
          quantity: line.quantity,
          unit_price: line.unitPrice,
        })),
      );
      if (linesError) throw new Error(linesError.message);

      const client =
        clients.find((c) => c.id === input.clientId) ??
        ({
          id: input.clientId,
          name: "Client",
          email: "",
          phone: "",
          address: "",
        } satisfies MockClient);

      const invoice: MockInvoice = {
        id: inserted.id,
        number,
        client,
        issueDate: input.issueDate,
        dueDate: input.dueDate,
        status,
        paymentMethod: input.paymentMethod,
        subtotal: totals.subtotal,
        vatRate: input.vatRate,
        vatAmount: totals.vatAmount,
        total: totals.total,
        amountPaid: 0,
        notes: input.notes,
        lines: input.lines,
      };

      setInvoices((prev) => [invoice, ...prev]);
      return invoice;
    },
    [supabase, clients, invoices],
  );

  const updateInvoice = useCallback(
    async (id: string, input: InvoiceInput) => {
      const client = clients.find((c) => c.id === input.clientId);
      const current = invoices.find((inv) => inv.id === id);
      const previousLines = current?.lines ?? [];
      const totals = computeTotals(input.lines, input.vatRate);

      const updatePayload: Record<string, unknown> = {
        client_id: input.clientId,
        issue_date: input.issueDate,
        due_date: input.dueDate,
        vat_rate: input.vatRate,
        subtotal: totals.subtotal,
        vat_amount: totals.vatAmount,
        total: totals.total,
        notes: input.notes ?? "",
      };
      if (schemaRef.current.paymentMethod !== false) {
        updatePayload.payment_method = input.paymentMethod;
      }

      const { error } = await supabase
        .from("invoices")
        .update(updatePayload)
        .eq("id", id);
      if (
        error &&
        schemaRef.current.paymentMethod !== false &&
        isMissingColumnError(error.message, "payment_method")
      ) {
        schemaRef.current.paymentMethod = false;
        delete updatePayload.payment_method;
        const retry = await supabase
          .from("invoices")
          .update(updatePayload)
          .eq("id", id);
        if (retry.error) throw new Error(retry.error.message);
      } else if (error) {
        throw new Error(error.message);
      }

      const { error: delError } = await supabase
        .from("invoice_lines")
        .delete()
        .eq("invoice_id", id);
      if (delError) throw new Error(delError.message);

      const { error: insError } = await supabase.from("invoice_lines").insert(
        input.lines.map((line) => ({
          invoice_id: id,
          description: line.description,
          quantity: line.quantity,
          unit_price: line.unitPrice,
        })),
      );
      if (insError) {
        if (previousLines.length > 0) {
          await supabase.from("invoice_lines").insert(
            previousLines.map((line) => ({
              invoice_id: id,
              description: line.description,
              quantity: line.quantity,
              unit_price: line.unitPrice,
            })),
          );
        }
        throw new Error(insError.message);
      }

      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id !== id) return inv;
          const wasPaid = inv.status === "paid";
          return {
            ...inv,
            client: client ?? inv.client,
            issueDate: input.issueDate,
            dueDate: input.dueDate,
            status: effectiveStatus(inv.status, input.dueDate),
            vatRate: input.vatRate,
            paymentMethod: input.paymentMethod,
            subtotal: totals.subtotal,
            vatAmount: totals.vatAmount,
            total: totals.total,
            amountPaid: wasPaid ? totals.total : inv.amountPaid,
            notes: input.notes,
            lines: input.lines,
          };
        }),
      );
    },
    [supabase, clients, invoices],
  );

  const setInvoiceStatus = useCallback(
    async (id: string, status: InvoiceStatus) => {
      const current = invoices.find((inv) => inv.id === id);
      const amountPaid = status === "paid" ? current?.total ?? 0 : 0;

      const { error } = await supabase
        .from("invoices")
        .update({ status, amount_paid: amountPaid })
        .eq("id", id);
      if (error) throw new Error(error.message);

      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id !== id) return inv;
          return {
            ...inv,
            status: effectiveStatus(status, inv.dueDate),
            amountPaid,
          };
        }),
      );
    },
    [supabase, invoices],
  );

  const deleteInvoice = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("invoices").delete().eq("id", id);
      if (error) throw new Error(error.message);
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    },
    [supabase],
  );

  const recordPayment = useCallback(
    async (id: string, amount: number) => {
      const current = invoices.find((inv) => inv.id === id);
      if (!current) throw new Error("Facture introuvable.");
      if (!Number.isFinite(amount) || amount < 0) {
        throw new Error("Montant invalide.");
      }
      const newPaid = Math.min(amount, current.total);
      const newStatus: InvoiceStatus =
        newPaid >= current.total ? "paid" : current.status;

      const { error } = await supabase
        .from("invoices")
        .update({ amount_paid: newPaid, status: newStatus })
        .eq("id", id);
      if (error) throw new Error(error.message);

      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === id
            ? {
                ...inv,
                amountPaid: newPaid,
                status: effectiveStatus(newStatus, inv.dueDate),
              }
            : inv,
        ),
      );
    },
    [supabase, invoices],
  );

  const createClient = useCallback(
    async (input: ClientInput): Promise<MockClient> => {
      const userId = userIdRef.current;
      if (!userId) throw new Error("Utilisateur non identifié.");

      const { data: inserted, error } = await supabase
        .from("clients")
        .insert({
          user_id: userId,
          name: input.name,
          email: input.email,
          phone: input.phone,
          address: input.address,
        })
        .select("id, name, email, phone, address")
        .single();
      if (error) throw new Error(error.message);

      const client = mapClient(inserted as ClientRow);
      setClients((prev) => [...prev, client]);
      return client;
    },
    [supabase],
  );

  const updateClient = useCallback(
    async (id: string, input: ClientInput) => {
      const { error } = await supabase
        .from("clients")
        .update({
          name: input.name,
          email: input.email,
          phone: input.phone,
          address: input.address,
        })
        .eq("id", id);
      if (error) throw new Error(error.message);

      setClients((prev) =>
        prev.map((c) => (c.id === id ? { id, ...input } : c)),
      );
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.client.id === id ? { ...inv, client: { id, ...input } } : inv,
        ),
      );
    },
    [supabase],
  );

  const deleteClient = useCallback(
    async (id: string): Promise<boolean> => {
      const { count, error } = await supabase
        .from("invoices")
        .select("id", { count: "exact", head: true })
        .eq("client_id", id);
      if (error) throw new Error(error.message);
      if ((count ?? 0) > 0) return false;

      const { error: delError } = await supabase
        .from("clients")
        .delete()
        .eq("id", id);
      if (delError) throw new Error(delError.message);

      setClients((prev) => prev.filter((c) => c.id !== id));
      return true;
    },
    [supabase],
  );

  const value = useMemo(
    () => ({
      invoices,
      clients,
      company,
      user,
      ready,
      loadError,
      retryLoad: loadData,
      updateCompany,
      createInvoice,
      updateInvoice,
      setInvoiceStatus,
      deleteInvoice,
      recordPayment,
      createClient,
      updateClient,
      deleteClient,
    }),
    [
      invoices,
      clients,
      company,
      user,
      ready,
      loadError,
      loadData,
      updateCompany,
      createInvoice,
      updateInvoice,
      setInvoiceStatus,
      deleteInvoice,
      recordPayment,
      createClient,
      updateClient,
      deleteClient,
    ],
  );

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-sm rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
          <div
            className="mx-auto mb-4 flex size-11 items-center justify-center rounded-full bg-red-50 text-xl"
            aria-hidden="true"
          >
            ⚠️
          </div>
          <h2 className="mb-1 text-base font-semibold text-slate-900">
            Une erreur est survenue
          </h2>
          <p className="mb-5 text-sm text-slate-500">
            {loadError}
          </p>
          <button
            type="button"
            onClick={loadData}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500">
          <div
            className="size-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"
            aria-hidden="true"
          />
          <span className="text-sm font-medium">Chargement…</span>
        </div>
      </div>
    );
  }

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreShape {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore doit être utilisé dans <DataProvider>");
  }
  return ctx;
}
