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

const FAQS = [
  {
    q: "Comment créer ma première facture ?",
    a: "Cliquez sur « Nouvelle facture » en haut à droite, sélectionnez un client, ajoutez vos prestations avec leurs quantités et prix, puis enregistrez comme brouillon ou envoyez directement. Le total, la TVA et la date d'échéance sont calculés automatiquement.",
  },
  {
    q: "Comment marquer une facture comme payée ?",
    a: "Ouvrez la facture depuis la liste, puis changez son statut en « Payée ». Le montant restant dû est mis à jour automatiquement, et le paiement apparaît dans vos statistiques.",
  },
  {
    q: "Mes clients peuvent-ils payer via mobile money (Wave, Orange Money) ?",
    a: "Oui. Définissez votre méthode de paiement préférée dans Paramètres → Modèles de facturation. Les informations de paiement (numéro Wave ou Orange Money) sont ensuite reprises sur vos factures.",
  },
  {
    q: "La TVA est-elle calculée automatiquement ?",
      a: "Oui, chaque facture applique le taux de TVA par défaut défini dans vos Paramètres (18 % par défaut). Vous pouvez aussi le modifier facture par facture. Les montants sont arrondis, sans centimes.",
  },
  {
    q: "Mes données sont-elles en sécurité ?",
    a: "Toutes vos données (clients, factures, réglages) sont enregistrées localement sur votre appareil et restent privées. Nous n'avons pas accès à vos informations et rien n'est envoyé à des serveurs tiers.",
  },
];

const CONTACTS = [
  {
    icon: Mail,
    title: "Par email",
    value: "support@izifacture.sn",
    hint: "Réponse sous 24 h ouvrées.",
  },
  {
    icon: Phone,
    title: "Par téléphone / WhatsApp",
    value: "+221 77 123 45 67",
    hint: "Lundi–Vendredi, 8 h – 18 h.",
  },
  {
    icon: MessageCircle,
    title: "Chat en ligne",
    value: "Disponible dans l'application",
    hint: "Réponse immédiate pendant les heures ouvrées.",
  },
];

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

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Aide et support
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Des réponses à vos questions, des guides rapides et nos coordonnées.
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
                  Questions fréquentes
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Les réponses aux questions les plus courantes.
                </p>
              </div>
            </div>

            <div className="mt-5 divide-y divide-slate-100 dark:divide-slate-800">
              {FAQS.map((faq, index) => {
                const open = openIndex === index;
                return (
                  <div key={faq.q}>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(open ? null : index)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-3 py-4 text-left"
                    >
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {faq.q}
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
                        {faq.a}
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
                  Guides rapides
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Les actions essentielles pas à pas.
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
                  Nous contacter
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Une question ? On est là pour vous aider.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {CONTACTS.map((contact) => (
                <div
                  key={contact.title}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-700 p-3.5"
                >
                  <contact.icon
                    className="mt-0.5 size-5 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      {contact.title}
                    </p>
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {contact.value}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{contact.hint}</p>
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
