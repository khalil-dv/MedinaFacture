"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  FileText,
  LifeBuoy,
  Mail,
  MessageCircle,
  Phone,
  Settings,
  Users,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const FAQS = [
  { qKey: "support.q1", aKey: "support.a1" },
  { qKey: "support.q2", aKey: "support.a2" },
  { qKey: "support.q3", aKey: "support.a3" },
  { qKey: "support.q4", aKey: "support.a4" },
];

const CONTACTS = [
  {
    icon: Mail,
    titleKey: "support.emailUs",
    key: "email",
    value: "support@medinafacture.sn",
    hintKey: "support.responseTime",
  },
  {
    icon: Phone,
    titleKey: "support.contact",
    key: "phone",
    value: "+221 77 123 45 67",
    hintKey: "support.responseTime",
  },
  {
    icon: MessageCircle,
    titleKey: "support.contact",
    key: "chat",
    value: "Disponible dans l'application",
    hintKey: "support.responseTime",
  },
];

export default function SupportPage() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const GUIDES = [
    {
      href: "/invoices/new",
      icon: FileText,
      title: "Créer une facture",
      description: "Émettez votre première facture en quelques secondes.",
    },
    {
      href: "/clients",
      icon: Users,
      title: "Gérer les clients",
      description: "Ajoutez et organisez votre carnet d'adresses.",
    },
    {
      href: "/settings",
      icon: Settings,
      title: "Configurer l'application",
      description: "Devise, TVA, préfixes et modèle de facture.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t("support.title")}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t("support.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Colonne principale */}
        <div className="space-y-6 lg:col-span-2">
          {/* FAQ */}
          <section className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 sm:p-6">
            <div className="flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400">
                <BookOpen className="size-4" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {t("support.faq")}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("support.subtitle")}
                </p>
              </div>
            </div>

            <div className="mt-5 divide-y divide-slate-100 dark:divide-slate-800">
              {FAQS.map((faq, index) => {
                const open = openIndex === index;
                return (
                  <div key={faq.qKey}>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(open ? null : index)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-3 py-4 text-left"
                    >
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {t(faq.qKey)}
                      </span>
                      <ChevronDown
                        className={`size-5 shrink-0 text-slate-400 dark:text-slate-500 transition-transform ${
                          open ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {open && (
                      <p className="pb-4 pr-8 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        {t(faq.aKey)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Guides rapides */}
          <section className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 sm:p-6">
            <div className="flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400">
                <BookOpen className="size-4" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {t("support.title")}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("support.subtitle")}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {GUIDES.map((guide) => (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="group rounded-xl border border-slate-200 dark:border-slate-700 p-4 transition-colors hover:border-emerald-500/50 hover:bg-emerald-50/40 dark:hover:bg-emerald-500/10"
                >
                  <guide.icon
                    className="size-5 text-emerald-600"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700">
                    {guide.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {guide.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Colonne latérale */}
        <aside className="space-y-6">
          {/* Statut du service */}
          <section className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Statut du service
            </h2>
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-500/10 p-4">
              <CheckCircle2
                className="size-6 shrink-0 text-emerald-600"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  Tous les systèmes opérationnels
                </p>
                <p className="text-xs text-emerald-600/80">
                  Dernière vérification : à l&apos;instant.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 sm:p-6">
            <div className="flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400">
                <LifeBuoy className="size-4" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {t("support.contact")}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("support.subtitle")}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {CONTACTS.map((contact) => (
                <div
                  key={contact.key}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-700 p-3.5"
                >
                  <contact.icon
                    className="mt-0.5 size-5 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      {t(contact.titleKey)}
                    </p>
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {contact.value}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t(contact.hintKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Légaux */}
          <section className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Informations légales
            </h2>
            <ul className="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <button className="transition-colors hover:text-emerald-700">
                  Conditions générales d&apos;utilisation
                </button>
              </li>
              <li>
                <button className="transition-colors hover:text-emerald-700">
                  Politique de confidentialité
                </button>
              </li>
              <li>
                <button className="transition-colors hover:text-emerald-700">
                  Mentions légales
                </button>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
