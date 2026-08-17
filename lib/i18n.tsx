"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "fr" | "en";

const STORAGE_KEY = "medinafacture-lang";

const LABELS: Record<Lang, string> = { fr: "Français", en: "English" };

/* ───────── translations ───────── */

const fr: Record<string, string> = {
  // Sidebar
  "nav.main": "Principal",
  "nav.management": "Gestion",
  "nav.dashboard": "Tableau de bord",
  "nav.invoices": "Factures",
  "nav.clients": "Clients",
  "nav.settings": "Paramètres",
  "nav.support": "Aide et support",
  "nav.logout": "Se déconnecter",
  "nav.loggingOut": "Déconnexion…",
  "nav.close": "Fermer le menu",
  "nav.settingsAria": "Paramètres",
  "nav.user": "Utilisateur",

  // Topbar
  "topbar.searchPlaceholder": "Rechercher une facture…",
  "topbar.newInvoice": "Nouvelle facture",
  "topbar.newInvoiceShort": "Facture",
  "topbar.openMenu": "Ouvrir le menu",
  "topbar.themeLight": "Mode clair",
  "topbar.themeDark": "Mode sombre",
  "topbar.themeLightAria": "Activer le mode clair",
  "topbar.themeDarkAria": "Activer le mode sombre",
  "topbar.notifications": "Notifications",
  "topbar.profile": "Profil",

  // Auth layout
  "auth.copyright": "© {year} MedinaFacture —",

  // Login
  "login.title": "Bon retour parmi nous",
  "login.subtitle": "Connectez-vous pour gérer vos factures.",
  "login.email": "Email",
  "login.password": "Mot de passe",
  "login.forgot": "Mot de passe oublié ?",
  "login.submit": "Se connecter",
  "login.submitting": "Connexion…",
  "login.noAccount": "Pas encore de compte ?",
  "login.createAccount": "Créer un compte",
  "login.resetSuccess": "Mot de passe mis à jour. Connectez-vous avec votre nouveau mot de passe.",
  "login.authError": "Le lien est invalide ou a expiré. Réessayez.",
  "login.badCredentials": "Email ou mot de passe incorrect.",

  // Signup
  "signup.title": "Créer un compte",
  "signup.subtitle": "Commencez à facturer en quelques minutes.",
  "signup.fullName": "Nom complet",
  "signup.fullNamePlaceholder": "Ex. Amadou Bâ",
  "signup.email": "Email",
  "signup.password": "Mot de passe",
  "signup.passwordMin": "8 caractères minimum",
  "signup.confirm": "Confirmer le mot de passe",
  "signup.submit": "Créer mon compte",
  "signup.submitting": "Création du compte…",
  "signup.hasAccount": "Déjà inscrit ?",
  "signup.login": "Se connecter",
  "signup.passwordShort": "Le mot de passe doit contenir au moins 8 caractères.",
  "signup.passwordMismatch": "Les mots de passe ne correspondent pas.",
  "signup.confirmEmail": "Un email de confirmation vous a été envoyé. Vérifiez votre boîte mail, puis reconnectez-vous.",

  // Forgot password
  "forgot.title": "Mot de passe oublié",
  "forgot.subtitle": "Entrez votre email pour recevoir un lien de réinitialisation.",
  "forgot.email": "Email",
  "forgot.submit": "Envoyer le lien",
  "forgot.submitting": "Envoi…",
  "forgot.sent": "Si un compte existe pour {email}, un lien de réinitialisation vient d'être envoyé. Cliquez dessus, puis choisissez votre nouveau mot de passe.",
  "forgot.resend": "Renvoyer l'email",
  "forgot.back": "Retour à la connexion",

  // Reset password
  "reset.title": "Nouveau mot de passe",
  "reset.subtitle": "Choisissez un nouveau mot de passe pour votre compte.",
  "reset.password": "Nouveau mot de passe",
  "reset.confirm": "Confirmer le mot de passe",
  "reset.submit": "Réinitialiser le mot de passe",
  "reset.submitting": "Mise à jour…",
  "reset.back": "Retour à la connexion",
  "reset.invalidLink": "Le lien est invalide ou a expiré. Demandez un nouveau lien via « Mot de passe oublié ? ».",
  "reset.passwordShort": "Le mot de passe doit contenir au moins 8 caractères.",
  "reset.passwordMismatch": "Les mots de passe ne correspondent pas.",

  // Dashboard
  "dash.greeting": "Bonjour, {name}",
  "dash.greetingSimple": "Bonjour",
  "dash.subtitle": "Voici un aperçu de votre activité.",
  "dash.revenue": "Chiffre d'affaires",
  "dash.collected": "Encaissé",
  "dash.pending": "En attente",
  "dash.overdue": "En retard",
  "dash.vsLastMonth": "vs mois dernier",
  "dash.recentInvoices": "Dernières factures",
  "dash.viewAll": "Tout voir",

  // Invoices list
  "invoices.title": "Factures",
  "invoices.subtitle": "Gérez et suivez l'ensemble de vos factures.",
  "invoices.filterAll": "Toutes",
  "invoices.filterDraft": "Brouillons",
  "invoices.filterSent": "Envoyées",
  "invoices.filterPaid": "Payées",
  "invoices.filterOverdue": "En retard",
  "invoices.searchPlaceholder": "Rechercher un client ou un numéro…",
  "invoices.empty": "Aucune facture trouvée",
  "invoices.emptyDesc": "Aucune facture ne correspond à vos critères. Essayez d'autres filtres ou créez une nouvelle facture.",
  "invoices.newInvoice": "Nouvelle facture",
  "invoices.colInvoice": "Facture",
  "invoices.colIssued": "Émise le",
  "invoices.colDue": "Échéance",
  "invoices.colStatus": "Statut",
  "invoices.colAmount": "Montant",
  "invoices.issuedOn": "Émise le {date}",
  "invoices.dueOn": "Échéance le {date}",

  // New / Edit invoice
  "invoice.new.title": "Nouvelle facture",
  "invoice.new.subtitle": "Créez et personnalisez vos factures, avec TVA calculée automatiquement.",
  "invoice.edit.title": "Modifier la facture",
  "invoice.edit.subtitle": "Mettez à jour les détails de cette facture.",
  "invoice.lines": "Lignes de facture",
  "invoice.addLine": "Ajouter une ligne",
  "invoice.noLines": "Ajoutez au moins une ligne…",
  "invoice.autoGenerated": "généré automatiquement",
  "invoice.savedSuccess": "La facture {number} est enregistrée. Vous pouvez la modifier et changer son statut à tout moment depuis sa page.",

  // Invoice detail
  "invoice.notFound": "Facture introuvable.",
  "invoice.back": "Retour aux factures",
  "invoice.collect": "Encaisser",
  "invoice.edit": "Modifier",
  "invoice.download": "Télécharger",
  "invoice.downloading": "Préparation…",
  "invoice.delete": "Supprimer",
  "invoice.detail": "Détail de la facture",
  "invoice.description": "Description",
  "invoice.quantity": "Quantité",
  "invoice.unitPrice": "Prix unitaire",
  "invoice.lineTotal": "Total",
  "invoice.statusDraft": "Brouillon",
  "invoice.statusSent": "Envoyée",
  "invoice.statusPaid": "Payée",
  "invoice.statusOverdue": "En retard",
  "invoice.total": "Total",
  "invoice.vat": "TVA",
  "invoice.subtotal": "Sous-total",
  "invoice.amountPaid": "Déjà payé",
  "invoice.remaining": "Reste à payer",
  "invoice.paymentMethod": "Mode de paiement",
  "invoice.notes": "Notes",
  "invoice.clientInfo": "Informations client",
  "invoice.companyInfo": "Informations entreprise",
  "invoice.issueDate": "Date d'émission",
  "invoice.dueDate": "Date d'échéance",

  // Payment modal
  "payment.title": "Enregistrer un paiement",
  "payment.amount": "Montant",
  "payment.amountPlaceholder": "Montant à enregistrer",
  "payment.save": "Enregistrer",
  "payment.saving": "Enregistrement…",
  "payment.cancel": "Annuler",
  "payment.invalidAmount": "Saisissez un montant valide.",
  "payment.error": "Impossible d'enregistrer le paiement.",

  // Confirm delete
  "confirmDelete.title": "Supprimer cette facture ?",
  "confirmDelete.desc": "Cette action est irréversible. La facture et toutes ses lignes seront définitivement supprimées.",
  "confirmDelete.cancel": "Annuler",
  "confirmDelete.confirm": "Supprimer",

  // Clients
  "clients.title": "Clients",
  "clients.subtitle": "Gérez votre base de clients.",
  "clients.newClient": "Nouveau client",
  "clients.searchPlaceholder": "Rechercher un client…",
  "clients.empty": "Aucun client",
  "clients.emptyDesc": "Ajoutez votre premier client pour commencer à créer des factures.",
  "clients.addFirst": "Ajouter un client",
  "clients.client": "Client",
  "clients.email": "Email",
  "clients.phone": "Téléphone",
  "clients.invoices": "factures",
  "clients.delete": "Supprimer",
  "clients.edit": "Modifier",
  "clients.hasInvoices": "Ce client a des factures associées et ne peut pas être supprimé.",

  // Client form modal
  "clientForm.newTitle": "Nouveau client",
  "clientForm.editTitle": "Modifier le client",
  "clientForm.name": "Nom",
  "clientForm.namePlaceholder": "Nom du client",
  "clientForm.email": "Email",
  "clientForm.phone": "Téléphone",
  "clientForm.address": "Adresse",
  "clientForm.save": "Enregistrer",
  "clientForm.cancel": "Annuler",

  // Settings
  "settings.title": "Paramètres",
  "settings.subtitle": "Configurez votre espace de facturation.",
  "settings.company": "Entreprise",
  "settings.companyName": "Nom de l'entreprise",
  "settings.ownerName": "Nom du propriétaire",
  "settings.email": "Email",
  "settings.phone": "Téléphone",
  "settings.address": "Adresse",
  "settings.taxId": "Numéro fiscal",
  "settings.logo": "Logo",
  "settings.logoUpload": "Choisir un logo",
  "settings.logoRemove": "Supprimer",
  "settings.invoicing": "Facturation",
  "settings.currency": "Devise",
  "settings.country": "Pays",
  "settings.language": "Langue",
  "settings.dateFormat": "Format de date",
  "settings.dueDays": "Délai de paiement (jours)",
  "settings.invoicePrefix": "Préfixe des factures",
  "settings.defaultPaymentMethod": "Mode de paiement par défaut",
  "settings.vatRate": "Taux de TVA par défaut (%)",
  "settings.enableReminders": "Activer les rappels de paiement",
  "settings.defaultNotes": "Notes par défaut",
  "settings.defaultNotesPlaceholder": "Notes qui apparaîtront sur chaque facture",
  "settings.paymentInfo": "Coordonnées de paiement",
  "settings.bankName": "Nom de la banque",
  "settings.bankAccountName": "Nom du compte",
  "settings.bankAccountNumber": "Numéro de compte",
  "settings.waveNumber": "Numéro Wave",
  "settings.orangeMoney": "Numéro Orange Money",
  "settings.save": "Enregistrer les modifications",
  "settings.saving": "Enregistrement…",
  "settings.saved": "Modifications enregistrées !",

  // Notifications
  "notifications.title": "Notifications",
  "notifications.subtitle": "Suivez l'activité de vos factures.",
  "notifications.empty": "Aucune notification",
  "notifications.emptyDesc": "Vous serez notifié des changements importants de vos factures.",
  "notifications.overdue": "{count} facture(s) en retard",
  "notifications.overdueDesc": "{name} ({number}) a dépassé la date d'échéance.",
  "notifications.dueSoon": "{count} facture(s) à échéance proche",
  "notifications.dueSoonDesc": "{name} ({number}) arrive à échéance le {date}.",

  // Support
  "support.title": "Aide et support",
  "support.subtitle": "Besoin d'aide ? Contactez-nous ou consultez la FAQ.",
  "support.faq": "Questions fréquentes",
  "support.contact": "Contact",
  "support.emailUs": "Envoyez-nous un email",
  "support.responseTime": "Nous répondons sous 24 à 48h.",
  "support.q1": "Comment créer une facture ?",
  "support.a1": "Allez dans Factures puis cliquez sur « Nouvelle facture ». Remplissez les informations du client, ajoutez vos lignes et enregistrez.",
  "support.q2": "Comment enregistrer un paiement ?",
  "support.a2": "Ouvrez une facture et cliquez sur « Encaisser ». Saisissez le montant reçu et enregistrez.",
  "support.q3": "Comment télécharger une facture en PDF ?",
  "support.a3": "Ouvrez la facture et cliquez sur « Télécharger ». Le PDF sera généré automatiquement.",
  "support.q4": "Comment modifier mes coordonnées de paiement ?",
  "support.a4": "Allez dans Paramètres, section « Coordonnées de paiement », remplissez vos informations bancaires ou mobile money et enregistrez.",

  // Common
  "common.loading": "Chargement…",
  "common.error": "Une erreur est survenue",
  "common.retry": "Réessayer",
  "common.save": "Enregistrer",
  "common.cancel": "Annuler",
  "common.delete": "Supprimer",
  "common.confirm": "Confirmer",
  "common.search": "Rechercher",
  "common.noResults": "Aucun résultat",
  "common.of": "sur",
  "common.items": "éléments",
  "common.view": "Voir",

  // Not found
  "notFound.title": "Page introuvable",
  "notFound.desc": "La page que vous recherchez n'existe pas ou a été déplacée.",
  "notFound.back": "Retour à l'accueil",

  // Global error
  "globalError.title": "Une erreur inattendue est survenue",
  "globalError.desc": "Rafraîchissez la page pour réessayer.",
  "globalError.retry": "Rafraîchir",
};

const en: Record<string, string> = {
  // Sidebar
  "nav.main": "Main",
  "nav.management": "Management",
  "nav.dashboard": "Dashboard",
  "nav.invoices": "Invoices",
  "nav.clients": "Clients",
  "nav.settings": "Settings",
  "nav.support": "Help & Support",
  "nav.logout": "Sign out",
  "nav.loggingOut": "Signing out…",
  "nav.close": "Close menu",
  "nav.settingsAria": "Settings",
  "nav.user": "User",

  // Topbar
  "topbar.searchPlaceholder": "Search an invoice…",
  "topbar.newInvoice": "New invoice",
  "topbar.newInvoiceShort": "Invoice",
  "topbar.openMenu": "Open menu",
  "topbar.themeLight": "Light mode",
  "topbar.themeDark": "Dark mode",
  "topbar.themeLightAria": "Switch to light mode",
  "topbar.themeDarkAria": "Switch to dark mode",
  "topbar.notifications": "Notifications",
  "topbar.profile": "Profile",

  // Auth layout
  "auth.copyright": "© {year} MedinaFacture —",

  // Login
  "login.title": "Welcome back",
  "login.subtitle": "Sign in to manage your invoices.",
  "login.email": "Email",
  "login.password": "Password",
  "login.forgot": "Forgot password?",
  "login.submit": "Sign in",
  "login.submitting": "Signing in…",
  "login.noAccount": "Don't have an account?",
  "login.createAccount": "Create an account",
  "login.resetSuccess": "Password updated. Sign in with your new password.",
  "login.authError": "The link is invalid or has expired. Please try again.",
  "login.badCredentials": "Invalid email or password.",

  // Signup
  "signup.title": "Create an account",
  "signup.subtitle": "Start invoicing in minutes.",
  "signup.fullName": "Full name",
  "signup.fullNamePlaceholder": "e.g. Amadou Bâ",
  "signup.email": "Email",
  "signup.password": "Password",
  "signup.passwordMin": "Minimum 8 characters",
  "signup.confirm": "Confirm password",
  "signup.submit": "Create my account",
  "signup.submitting": "Creating account…",
  "signup.hasAccount": "Already have an account?",
  "signup.login": "Sign in",
  "signup.passwordShort": "Password must be at least 8 characters.",
  "signup.passwordMismatch": "Passwords do not match.",
  "signup.confirmEmail": "A confirmation email has been sent. Check your inbox and sign in again.",

  // Forgot password
  "forgot.title": "Forgot password",
  "forgot.subtitle": "Enter your email to receive a reset link.",
  "forgot.email": "Email",
  "forgot.submit": "Send link",
  "forgot.submitting": "Sending…",
  "forgot.sent": "If an account exists for {email}, a reset link has just been sent. Click it to choose a new password.",
  "forgot.resend": "Resend email",
  "forgot.back": "Back to sign in",

  // Reset password
  "reset.title": "New password",
  "reset.subtitle": "Choose a new password for your account.",
  "reset.password": "New password",
  "reset.confirm": "Confirm password",
  "reset.submit": "Reset password",
  "reset.submitting": "Updating…",
  "reset.back": "Back to sign in",
  "reset.invalidLink": "The link is invalid or has expired. Request a new one via \"Forgot password?\".",
  "reset.passwordShort": "Password must be at least 8 characters.",
  "reset.passwordMismatch": "Passwords do not match.",

  // Dashboard
  "dash.greeting": "Hello, {name}",
  "dash.greetingSimple": "Hello",
  "dash.subtitle": "Here's an overview of your activity.",
  "dash.revenue": "Revenue",
  "dash.collected": "Collected",
  "dash.pending": "Pending",
  "dash.overdue": "Overdue",
  "dash.vsLastMonth": "vs last month",
  "dash.recentInvoices": "Recent invoices",
  "dash.viewAll": "View all",

  // Invoices list
  "invoices.title": "Invoices",
  "invoices.subtitle": "Manage and track all your invoices.",
  "invoices.filterAll": "All",
  "invoices.filterDraft": "Drafts",
  "invoices.filterSent": "Sent",
  "invoices.filterPaid": "Paid",
  "invoices.filterOverdue": "Overdue",
  "invoices.searchPlaceholder": "Search a client or number…",
  "invoices.empty": "No invoices found",
  "invoices.emptyDesc": "No invoices match your criteria. Try different filters or create a new invoice.",
  "invoices.newInvoice": "New invoice",
  "invoices.colInvoice": "Invoice",
  "invoices.colIssued": "Issued",
  "invoices.colDue": "Due",
  "invoices.colStatus": "Status",
  "invoices.colAmount": "Amount",
  "invoices.issuedOn": "Issued on {date}",
  "invoices.dueOn": "Due on {date}",

  // New / Edit invoice
  "invoice.new.title": "New invoice",
  "invoice.new.subtitle": "Create and customize your invoices, with automatic VAT calculation.",
  "invoice.edit.title": "Edit invoice",
  "invoice.edit.subtitle": "Update the details of this invoice.",
  "invoice.lines": "Invoice lines",
  "invoice.addLine": "Add a line",
  "invoice.noLines": "Add at least one line…",
  "invoice.autoGenerated": "auto-generated",
  "invoice.savedSuccess": "Invoice {number} has been saved. You can edit it and change its status at any time from its page.",

  // Invoice detail
  "invoice.notFound": "Invoice not found.",
  "invoice.back": "Back to invoices",
  "invoice.collect": "Collect",
  "invoice.edit": "Edit",
  "invoice.download": "Download",
  "invoice.downloading": "Preparing…",
  "invoice.delete": "Delete",
  "invoice.detail": "Invoice details",
  "invoice.description": "Description",
  "invoice.quantity": "Quantity",
  "invoice.unitPrice": "Unit price",
  "invoice.lineTotal": "Total",
  "invoice.statusDraft": "Draft",
  "invoice.statusSent": "Sent",
  "invoice.statusPaid": "Paid",
  "invoice.statusOverdue": "Overdue",
  "invoice.total": "Total",
  "invoice.vat": "VAT",
  "invoice.subtotal": "Subtotal",
  "invoice.amountPaid": "Already paid",
  "invoice.remaining": "Remaining",
  "invoice.paymentMethod": "Payment method",
  "invoice.notes": "Notes",
  "invoice.clientInfo": "Client information",
  "invoice.companyInfo": "Company information",
  "invoice.issueDate": "Issue date",
  "invoice.dueDate": "Due date",

  // Payment modal
  "payment.title": "Record a payment",
  "payment.amount": "Amount",
  "payment.amountPlaceholder": "Amount to record",
  "payment.save": "Record",
  "payment.saving": "Recording…",
  "payment.cancel": "Cancel",
  "payment.invalidAmount": "Please enter a valid amount.",
  "payment.error": "Unable to record the payment.",

  // Confirm delete
  "confirmDelete.title": "Delete this invoice?",
  "confirmDelete.desc": "This action is irreversible. The invoice and all its lines will be permanently deleted.",
  "confirmDelete.cancel": "Cancel",
  "confirmDelete.confirm": "Delete",

  // Clients
  "clients.title": "Clients",
  "clients.subtitle": "Manage your client database.",
  "clients.newClient": "New client",
  "clients.searchPlaceholder": "Search a client…",
  "clients.empty": "No clients",
  "clients.emptyDesc": "Add your first client to start creating invoices.",
  "clients.addFirst": "Add a client",
  "clients.client": "Client",
  "clients.email": "Email",
  "clients.phone": "Phone",
  "clients.invoices": "invoices",
  "clients.delete": "Delete",
  "clients.edit": "Edit",
  "clients.hasInvoices": "This client has associated invoices and cannot be deleted.",

  // Client form modal
  "clientForm.newTitle": "New client",
  "clientForm.editTitle": "Edit client",
  "clientForm.name": "Name",
  "clientForm.namePlaceholder": "Client name",
  "clientForm.email": "Email",
  "clientForm.phone": "Phone",
  "clientForm.address": "Address",
  "clientForm.save": "Save",
  "clientForm.cancel": "Cancel",

  // Settings
  "settings.title": "Settings",
  "settings.subtitle": "Configure your invoicing workspace.",
  "settings.company": "Company",
  "settings.companyName": "Company name",
  "settings.ownerName": "Owner name",
  "settings.email": "Email",
  "settings.phone": "Phone",
  "settings.address": "Address",
  "settings.taxId": "Tax ID",
  "settings.logo": "Logo",
  "settings.logoUpload": "Choose a logo",
  "settings.logoRemove": "Remove",
  "settings.invoicing": "Invoicing",
  "settings.currency": "Currency",
  "settings.country": "Country",
  "settings.language": "Language",
  "settings.dateFormat": "Date format",
  "settings.dueDays": "Payment due (days)",
  "settings.invoicePrefix": "Invoice prefix",
  "settings.defaultPaymentMethod": "Default payment method",
  "settings.vatRate": "Default VAT rate (%)",
  "settings.enableReminders": "Enable payment reminders",
  "settings.defaultNotes": "Default notes",
  "settings.defaultNotesPlaceholder": "Notes that appear on every invoice",
  "settings.paymentInfo": "Payment details",
  "settings.bankName": "Bank name",
  "settings.bankAccountName": "Account name",
  "settings.bankAccountNumber": "Account number",
  "settings.waveNumber": "Wave number",
  "settings.orangeMoney": "Orange Money number",
  "settings.save": "Save changes",
  "settings.saving": "Saving…",
  "settings.saved": "Changes saved!",

  // Notifications
  "notifications.title": "Notifications",
  "notifications.subtitle": "Track your invoice activity.",
  "notifications.empty": "No notifications",
  "notifications.emptyDesc": "You'll be notified of important invoice changes.",
  "notifications.overdue": "{count} overdue invoice(s)",
  "notifications.overdueDesc": "{name} ({number}) has passed its due date.",
  "notifications.dueSoon": "{count} invoice(s) due soon",
  "notifications.dueSoonDesc": "{name} ({number}) is due on {date}.",

  // Support
  "support.title": "Help & Support",
  "support.subtitle": "Need help? Contact us or check the FAQ.",
  "support.faq": "Frequently Asked Questions",
  "support.contact": "Contact",
  "support.emailUs": "Send us an email",
  "support.responseTime": "We respond within 24-48 hours.",
  "support.q1": "How to create an invoice?",
  "support.a1": "Go to Invoices and click \"New invoice\". Fill in the client information, add your lines and save.",
  "support.q2": "How to record a payment?",
  "support.a2": "Open an invoice and click \"Collect\". Enter the amount received and save.",
  "support.q3": "How to download an invoice as PDF?",
  "support.a3": "Open the invoice and click \"Download\". The PDF will be generated automatically.",
  "support.q4": "How to update my payment details?",
  "support.a4": "Go to Settings, \"Payment details\" section, fill in your bank or mobile money information and save.",

  // Common
  "common.loading": "Loading…",
  "common.error": "An error occurred",
  "common.retry": "Retry",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.confirm": "Confirm",
  "common.search": "Search",
  "common.noResults": "No results",
  "common.of": "of",
  "common.items": "items",
  "common.view": "View",

  // Not found
  "notFound.title": "Page not found",
  "notFound.desc": "The page you're looking for doesn't exist or has been moved.",
  "notFound.back": "Back to home",

  // Global error
  "globalError.title": "An unexpected error occurred",
  "globalError.desc": "Refresh the page to try again.",
  "globalError.retry": "Refresh",
};

const TRANSLATIONS: Record<Lang, Record<string, string>> = { fr, en };

function resolve(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

/* ───────── context ───────── */

interface LangShape {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  langLabel: string;
  toggleLang: () => void;
}

const LangContext = createContext<LangShape | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (hydrated) return;
    let detected: Lang = "fr";
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "fr" || stored === "en") detected = stored;
      else if (navigator.language.startsWith("en")) detected = "en";
    } catch {}
    if (detected !== "fr") setLangState(detected);
    setHydrated(true);
  }, [hydrated]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "fr" ? "en" : "fr");
  }, [lang, setLang]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const raw = TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.fr[key] ?? key;
      return resolve(raw, vars);
    },
    [lang],
  );

  const value = useMemo(
    () => ({ lang, setLang, t, langLabel: LABELS[lang], toggleLang }),
    [lang, setLang, t, toggleLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useTranslation(): LangShape {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useTranslation must be used within <LanguageProvider>");
  return ctx;
}
