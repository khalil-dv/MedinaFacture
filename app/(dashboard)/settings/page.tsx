"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Globe2,
  ImagePlus,
  ReceiptText,
  Save,
  Trash2,
  Wallet,
} from "lucide-react";
import { z } from "zod";
import type { CompanySettings } from "@/lib/store";
import { useStore } from "@/lib/store";
import { currencyLabel, formatDate, initialsOf } from "@/lib/format";
import {
  FieldError,
  Input,
  Label,
  Select,
  Textarea,
} from "@/components/ui/Fields";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n";

import {
  ALL_CURRENCIES,
  ALL_LANGUAGES,
  COUNTRIES,
  findByCountry,
} from "@/lib/countries";

const DATE_FORMATS = [
  { value: "jj/mm/aaaa", label: "jj/mm/aaaa — 15/08/2026" },
  { value: "mm/jj/aaaa", label: "mm/jj/aaaa — 08/15/2026" },
  { value: "aaaa-mm-jj", label: "aaaa-mm-jj — 2026-08-15" },
  { value: "jj.mm.aa", label: "jj.mm.aa — 15.08.26" },
] as const;

const PAYMENT_METHODS = [
  "Virement bancaire",
  "Orange Money",
  "Wave",
  "MTN Mobile Money",
  "Moov Money",
  "Espèces",
  "Carte bancaire",
] as const;

const schema = z.object({
  name: z.string().trim().min(1, "Le nom de l'entreprise est requis"),
  ownerName: z.string().trim().min(1, "Le nom du propriétaire est requis"),
  email: z
    .string()
    .trim()
    .email("Adresse email invalide")
    .or(z.literal("")),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
  taxId: z.string().trim().optional(),
  country: z.string().trim().min(1, "Pays requis"),
  language: z.string().trim().min(1, "Langue requise"),
  dateFormat: z.string().trim().min(1, "Format de date requis"),
  defaultVatRate: z.coerce
    .number()
    .min(0, "Taux minimum : 0 %")
    .max(100, "Taux maximum : 100 %"),
  paymentDueDays: z.coerce
    .number()
    .int("Nombre entier")
    .min(0, "Délai positif"),
  invoicePrefix: z
    .string()
    .trim()
    .min(1, "Préfixe requis")
    .max(10, "10 caractères maximum"),
  defaultPaymentMethod: z
    .string()
    .trim()
    .min(1, "Méthode de paiement requise"),
  paymentReminders: z.boolean(),
  defaultNotes: z.string().trim(),
  bankAccountName: z.string().trim().optional(),
  bankName: z.string().trim().optional(),
  bankAccountNumber: z.string().trim().optional(),
  waveNumber: z.string().trim().optional(),
  orangeMoneyNumber: z.string().trim().optional(),
});

interface FormState {
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  logoDataUrl?: string;
  country: string;
  currency: string;
  language: string;
  dateFormat: string;
  defaultVatRate: string;
  paymentDueDays: string;
  invoicePrefix: string;
  defaultPaymentMethod: string;
  paymentReminders: boolean;
  defaultNotes: string;
  bankAccountName: string;
  bankName: string;
  bankAccountNumber: string;
  waveNumber: string;
  orangeMoneyNumber: string;
}

function downscaleImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Impossible de lire le fichier"));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Fichier image invalide"));
      image.onload = () => {
        const max = 160;
        const scale = Math.min(1, max / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas non supporté"));
          return;
        }
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/png"));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function toForm(company: CompanySettings): FormState {
  return {
    name: company.name,
    ownerName: company.ownerName,
    email: company.email,
    phone: company.phone,
    address: company.address,
    taxId: company.taxId,
    logoDataUrl: company.logoDataUrl,
    country: company.country,
    currency: company.currency,
    language: company.language,
    dateFormat: company.dateFormat,
    defaultVatRate: company.defaultVatRate.toString(),
    paymentDueDays: company.paymentDueDays.toString(),
    invoicePrefix: company.invoicePrefix,
    defaultPaymentMethod: company.defaultPaymentMethod,
    paymentReminders: company.paymentReminders,
    defaultNotes: company.defaultNotes,
    bankAccountName: company.bankAccountName,
    bankName: company.bankName,
    bankAccountNumber: company.bankAccountNumber,
    waveNumber: company.waveNumber,
    orangeMoneyNumber: company.orangeMoneyNumber,
  };
}

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid size-9 place-items-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400">
        {icon}
      </div>
      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  id: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-emerald-600" : "bg-slate-200 dark:bg-slate-700"
      }`}
    >
      <span
        className={`inline-block size-4 transform rounded-full bg-white dark:bg-slate-900 shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { company, updateCompany } = useStore();
  const { t } = useTranslation();
  const [form, setForm] = useState<FormState>(() => toForm(company));
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [logoError, setLogoError] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (dirty) return;
    setForm(toForm(company));
  }, [company, dirty]);

  useEffect(() => {
    return () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
    };
  }, []);

  const set = <K extends keyof FormState>(key: K) => (
    value: FormState[K],
  ) => {
    setDirty(true);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setLogoError("Veuillez choisir un fichier image (PNG, JPG, SVG…).");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setLogoError("Image trop lourde (2 Mo maximum).");
      return;
    }
    try {
      const dataUrl = await downscaleImage(file);
      setLogoError(undefined);
      set("logoDataUrl")(dataUrl);
    } catch (err) {
      setLogoError(err instanceof Error ? err.message : "Erreur de lecture.");
    }
  };

  const handleSave = async () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    try {
      await updateCompany({
        name: parsed.data.name,
        ownerName: parsed.data.ownerName,
        email: parsed.data.email,
        phone: parsed.data.phone ?? "",
        address: parsed.data.address ?? "",
        taxId: parsed.data.taxId ?? "",
        logoDataUrl: form.logoDataUrl,
        country: parsed.data.country,
        currency: form.currency,
        language: parsed.data.language,
        dateFormat: parsed.data.dateFormat,
        defaultVatRate: parsed.data.defaultVatRate,
        paymentDueDays: parsed.data.paymentDueDays,
        invoicePrefix: parsed.data.invoicePrefix.toUpperCase(),
        defaultPaymentMethod: parsed.data.defaultPaymentMethod,
        paymentReminders: parsed.data.paymentReminders,
        defaultNotes: parsed.data.defaultNotes,
        bankAccountName: parsed.data.bankAccountName ?? "",
        bankName: parsed.data.bankName ?? "",
        bankAccountNumber: parsed.data.bankAccountNumber ?? "",
        waveNumber: parsed.data.waveNumber ?? "",
        orangeMoneyNumber: parsed.data.orangeMoneyNumber ?? "",
      });
      setErrors({});
      setDirty(false);
      setSaved(true);
      if (savedTimer.current) clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setErrors({
        form:
          err instanceof Error
            ? err.message
            : "Une erreur est survenue lors de l'enregistrement.",
      });
    }
  };

  const initials = initialsOf(form.name || company.name);

  return (
    <div className="space-y-6 pb-24">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
            {t("settings.title")}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("settings.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              {t("settings.saved")}
            </span>
          )}
          {errors.form && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400">
              <AlertCircle className="size-4" aria-hidden="true" />
              {errors.form}
            </span>
          )}
          <Button onClick={handleSave}>
            <Save className="size-4" aria-hidden="true" />
            {t("settings.save")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Colonne principale */}
        <div className="space-y-6 xl:col-span-2">
          {/* Profil de l'entreprise */}
          <section className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 sm:p-6">
            <SectionHeader
              icon={<Building2 className="size-4" aria-hidden="true" />}
              title={t("settings.company")}
              subtitle={t("settings.subtitle")}
            />

            <div className="mt-6 flex items-center gap-4">
              <div className="relative">
                {form.logoDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.logoDataUrl}
                    alt="Logo de l'entreprise"
                    className="size-16 rounded-xl border border-slate-200 dark:border-slate-700 object-cover"
                  />
                ) : (
                  <div className="grid size-16 place-items-center rounded-xl bg-emerald-600/10 text-lg font-bold text-emerald-700 dark:text-emerald-400">
                    {initials}
                  </div>
                )}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus className="size-4" aria-hidden="true" />
                    {form.logoDataUrl ? t("settings.logoUpload") : t("settings.logoUpload")}
                  </Button>
                  {form.logoDataUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        set("logoDataUrl")(undefined);
                        setLogoError(undefined);
                      }}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      {t("settings.logoRemove")}
                    </Button>
                  )}
                </div>
                <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                  PNG, JPG ou SVG — 2 Mo maximum. Redimensionné automatiquement.
                </p>
                <FieldError message={logoError} />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="company-name">{t("settings.companyName")}</Label>
                <Input
                  id="company-name"
                  value={form.name}
                  onChange={(e) => set("name")(e.target.value)}
                  placeholder="Ex. MedinaFacture"
                />
                <FieldError message={errors.name} />
              </div>
              <div>
                <Label htmlFor="owner-name">{t("settings.ownerName")}</Label>
                <Input
                  id="owner-name"
                  value={form.ownerName}
                  onChange={(e) => set("ownerName")(e.target.value)}
                  placeholder="Ex. Amadou Bâ"
                />
                <FieldError message={errors.ownerName} />
              </div>
              <div>
                <Label htmlFor="company-email">{t("settings.email")}</Label>
                <Input
                  id="company-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email")(e.target.value)}
                  placeholder="contact@entreprise.com"
                />
                <FieldError message={errors.email} />
              </div>
              <div>
                <Label htmlFor="company-phone">{t("settings.phone")}</Label>
                <Input
                  id="company-phone"
                  value={form.phone}
                  onChange={(e) => set("phone")(e.target.value)}
                  placeholder="+221 77 123 45 67"
                />
                <FieldError message={errors.phone} />
              </div>
              <div>
                <Label htmlFor="company-tax">{t("settings.taxId")}</Label>
                <Input
                  id="company-tax"
                  value={form.taxId}
                  onChange={(e) => set("taxId")(e.target.value)}
                  placeholder="Ex. RCCM DK-2020-B-00123"
                />
                <FieldError message={errors.taxId} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="company-address">{t("settings.address")}</Label>
                <Textarea
                  id="company-address"
                  rows={2}
                  value={form.address}
                  onChange={(e) => set("address")(e.target.value)}
                  placeholder="Ex. Rue 10, Médina, Dakar — Sénégal"
                />
                <FieldError message={errors.address} />
              </div>
            </div>
          </section>

          {/* Région & Devise */}
          <section className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 sm:p-6">
            <SectionHeader
              icon={<Globe2 className="size-4" aria-hidden="true" />}
              title={t("settings.country")}
              subtitle={t("settings.subtitle")}
            />

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="country">{t("settings.country")}</Label>
                <Select
                  id="country"
                  value={form.country}
                  onChange={(e) => {
                    const name = e.target.value;
                    const info = findByCountry(name);
                    setDirty(true);
                    setForm((prev) => ({
                      ...prev,
                      country: name,
                      currency: info?.currencies[0] ?? prev.currency,
                      language: info?.languages[0] ?? prev.language,
                      dateFormat: info?.dateFormat ?? prev.dateFormat,
                    }));
                  }}
                >
                  <option value="">{t("settings.country")}</option>
                  {!COUNTRIES.some((c) => c.name === form.country) &&
                    form.country && (
                      <option value={form.country}>{form.country}</option>
                    )}
                  {COUNTRIES.map((country) => (
                    <option key={country.name} value={country.name}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </Select>
                <FieldError message={errors.country} />
                {form.country && findByCountry(form.country) && (
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    Devise, langue et format de date ajustés automatiquement —
                    vous pouvez les modifier.
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="currency">{t("settings.currency")}</Label>
                <Select
                  id="currency"
                  value={form.currency}
                  onChange={(e) => set("currency")(e.target.value)}
                >
                  {!ALL_CURRENCIES.includes(form.currency) && form.currency && (
                    <option value={form.currency}>
                      {form.currency} ({currencyLabel(form.currency)})
                    </option>
                  )}
                  {ALL_CURRENCIES.map((code) => (
                    <option key={code} value={code}>
                      {code} ({currencyLabel(code)})
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="language">{t("settings.language")}</Label>
                <Select
                  id="language"
                  value={form.language}
                  onChange={(e) => set("language")(e.target.value)}
                >
                  {!ALL_LANGUAGES.includes(form.language) && form.language && (
                    <option value={form.language}>{form.language}</option>
                  )}
                  {ALL_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </Select>
                <FieldError message={errors.language} />
              </div>
              <div>
                <Label htmlFor="date-format">{t("settings.dateFormat")}</Label>
                <Select
                  id="date-format"
                  value={form.dateFormat}
                  onChange={(e) => set("dateFormat")(e.target.value)}
                >
                  {DATE_FORMATS.map((fmt) => (
                    <option key={fmt.value} value={fmt.value}>
                      {fmt.label}
                    </option>
                  ))}
                </Select>
                <FieldError message={errors.dateFormat} />
              </div>
            </div>
          </section>

          {/* Modèles de facturation */}
          <section className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 sm:p-6">
            <SectionHeader
              icon={<ReceiptText className="size-4" aria-hidden="true" />}
              title={t("settings.invoicing")}
              subtitle={t("settings.subtitle")}
            />

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="vat-rate">{t("settings.vatRate")}</Label>
                <Input
                  id="vat-rate"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={100}
                  step="0.5"
                  value={form.defaultVatRate}
                  onChange={(e) => set("defaultVatRate")(e.target.value)}
                />
                <FieldError message={errors.defaultVatRate} />
              </div>
              <div>
                <Label htmlFor="due-days">{t("settings.dueDays")}</Label>
                <Input
                  id="due-days"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  value={form.paymentDueDays}
                  onChange={(e) => set("paymentDueDays")(e.target.value)}
                />
                <FieldError message={errors.paymentDueDays} />
              </div>
              <div>
                <Label htmlFor="prefix">{t("settings.invoicePrefix")}</Label>
                <Input
                  id="prefix"
                  value={form.invoicePrefix}
                  onChange={(e) =>
                    set("invoicePrefix")(e.target.value.toUpperCase())
                  }
                  placeholder="INV"
                  maxLength={10}
                />
                <FieldError message={errors.invoicePrefix} />
              </div>
              <div>
                <Label htmlFor="payment-method">
                  {t("settings.defaultPaymentMethod")}
                </Label>
                <Select
                  id="payment-method"
                  value={form.defaultPaymentMethod}
                  onChange={(e) => set("defaultPaymentMethod")(e.target.value)}
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </Select>
                <FieldError message={errors.defaultPaymentMethod} />
              </div>
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-4 py-3">
                  <div>
                    <Label htmlFor="payment-reminders" className="mb-0.5">
                      {t("settings.enableReminders")}
                    </Label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Un rappel est envoyé au client lorsque la facture arrive à
                      échéance.
                    </p>
                  </div>
                  <Toggle
                    id="payment-reminders"
                    checked={form.paymentReminders}
                    onChange={(value) => set("paymentReminders")(value)}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="default-notes">{t("settings.defaultNotes")}</Label>
                <Textarea
                  id="default-notes"
                  rows={3}
                  value={form.defaultNotes}
                  onChange={(e) => set("defaultNotes")(e.target.value)}
                  placeholder={t("settings.defaultNotesPlaceholder")}
                />
                <FieldError message={errors.defaultNotes} />
              </div>
            </div>
          </section>

          {/* Coordonnées de paiement */}
          <section className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 sm:p-6">
            <SectionHeader
              icon={<Wallet className="size-4" aria-hidden="true" />}
              title={t("settings.paymentInfo")}
              subtitle={t("settings.subtitle")}
            />

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="bank-account-name">{t("settings.bankAccountName")}</Label>
                <Input
                  id="bank-account-name"
                  value={form.bankAccountName}
                  onChange={(e) => set("bankAccountName")(e.target.value)}
                  placeholder="Ex. Bâ Transport & Fils"
                />
              </div>
              <div>
                <Label htmlFor="bank-name">{t("settings.bankName")}</Label>
                <Input
                  id="bank-name"
                  value={form.bankName}
                  onChange={(e) => set("bankName")(e.target.value)}
                  placeholder="Ex. Société Générale Sénégal"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="bank-account-number">{t("settings.bankAccountNumber")}</Label>
                <Input
                  id="bank-account-number"
                  value={form.bankAccountNumber}
                  onChange={(e) => set("bankAccountNumber")(e.target.value)}
                  placeholder="Ex. SN000 0000 0000 0000 0000 0000"
                />
              </div>
              <div>
                <Label htmlFor="wave-number">{t("settings.waveNumber")}</Label>
                <Input
                  id="wave-number"
                  type="tel"
                  value={form.waveNumber}
                  onChange={(e) => set("waveNumber")(e.target.value)}
                  placeholder="+221 77 000 00 00"
                />
              </div>
              <div>
                <Label htmlFor="orange-number">{t("settings.orangeMoney")}</Label>
                <Input
                  id="orange-number"
                  type="tel"
                  value={form.orangeMoneyNumber}
                  onChange={(e) => set("orangeMoneyNumber")(e.target.value)}
                  placeholder="+221 70 000 00 00"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Aperçu */}
        <aside>
          <section className="xl:sticky xl:top-20 rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t("settings.invoicing")}
            </h2>

            <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {form.logoDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.logoDataUrl}
                      alt=""
                      className="size-10 shrink-0 rounded-lg border border-slate-200 dark:border-slate-700 object-cover"
                    />
                  ) : (
                    <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-600/10 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                      {form.name || "Nom de l'entreprise"}
                    </p>
                    {form.taxId && (
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {form.taxId}
                      </p>
                    )}
                  </div>
                </div>
                <p className="shrink-0 text-xs font-bold uppercase text-slate-400 dark:text-slate-500">
                  {form.invoicePrefix || "INV"}-{new Date().getFullYear()}-0001
                </p>
              </div>

              <dl className="mt-4 space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
                {form.address && (
                  <div className="flex gap-2">
                    <dt className="shrink-0 font-medium text-slate-400 dark:text-slate-500">
                      {t("settings.address")}
                    </dt>
                    <dd className="text-right text-slate-600 dark:text-slate-400">
                      {form.address}
                    </dd>
                  </div>
                )}
                {(form.email || form.phone) && (
                  <div className="flex gap-2">
                    <dt className="shrink-0 font-medium text-slate-400 dark:text-slate-500">
                      {t("settings.email")}
                    </dt>
                    <dd className="text-right text-slate-600 dark:text-slate-400">
                      {[form.phone, form.email].filter(Boolean).join(" · ")}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">{t("settings.vatRate")}</dt>
                <dd className="font-medium text-slate-800 dark:text-slate-200">
                  {form.defaultVatRate}%
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">{t("settings.currency")}</dt>
                <dd className="font-medium text-slate-800 dark:text-slate-200">
                  {form.currency} ({currencyLabel(form.currency)})
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">{t("settings.dueDays")}</dt>
                <dd className="font-medium text-slate-800 dark:text-slate-200">
                  {form.paymentDueDays} jours
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">{t("settings.defaultPaymentMethod")}</dt>
                <dd className="text-right font-medium text-slate-800 dark:text-slate-200">
                  {form.defaultPaymentMethod}
                </dd>
              </div>
            </dl>

            <p className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs text-slate-400 dark:text-slate-500">
              {t("settings.invoicing")} — {formatDate(new Date(), form.dateFormat)} — ces
              réglages seront appliqués aux prochaines factures.
            </p>
          </section>
        </aside>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-end border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/90 px-4 py-3 shadow-[0_-4px_12px_rgba(15,23,42,0.06)] backdrop-blur sm:px-6">
        <div className="flex flex-wrap items-center justify-end gap-3">
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              {t("settings.saved")}
            </span>
          )}
          {errors.form && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400">
              <AlertCircle className="size-4" aria-hidden="true" />
              {errors.form}
            </span>
          )}
          <Button onClick={handleSave}>
            <Save className="size-4" aria-hidden="true" />
            {t("settings.save")}
          </Button>
        </div>
      </div>
    </div>
  );
}
