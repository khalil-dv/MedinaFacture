"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Globe, Menu, Moon, Plus, Search, Sun } from "lucide-react";
import { useStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { useTranslation } from "@/lib/i18n";
import { getNotifications } from "@/lib/notifications";
import { initialsOf } from "@/lib/format";

interface TopbarProps {
  onMenuClick: () => void;
  /** Affiche le bouton menu sur toutes les tailles d'écran (pas seulement mobile). */
  showMenuAlways?: boolean;
}

export function Topbar({ onMenuClick, showMenuAlways = false }: TopbarProps) {
  const { company, user, invoices } = useStore();
  const { theme, toggleTheme } = useTheme();
  const { t, lang, toggleLang } = useTranslation();
  const router = useRouter();
  const displayName = user.fullName || company.ownerName || t("nav.user");
  const hasNotifications = getNotifications(invoices).length > 0;

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const query = new FormData(form).get("query")?.toString().trim() ?? "";
    router.push(query ? `/invoices?q=${encodeURIComponent(query)}` : "/invoices");
    form.reset();
  };
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        aria-label={t("topbar.openMenu")}
        className={`rounded-lg p-2 text-slate-600 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${
          showMenuAlways ? "" : "lg:hidden"
        }`}
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      {/* Logo mobile : marque visible */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2 lg:hidden"
      >
        <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-xs font-extrabold text-white">
          MF
        </span>
        <span className="text-base font-bold text-slate-900 dark:text-slate-100">MedinaFacture</span>
      </Link>

      {/* Recherche mobile */}
      <form
        role="search"
        onSubmit={handleSearch}
        className="relative ml-1 hidden flex-1 max-w-[180px] sm:max-w-sm md:hidden"
      >
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          aria-hidden="true"
        />
        <input
          name="query"
          type="search"
          placeholder={t("topbar.searchPlaceholder")}
          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 py-2 pl-9 pr-3 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:bg-slate-900"
        />
      </form>

      {/* Recherche desktop */}
      <form
        role="search"
        onSubmit={handleSearch}
        className="relative ml-1 hidden flex-1 max-w-sm md:block"
      >
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          aria-hidden="true"
        />
        <input
          name="query"
          type="search"
          placeholder={t("topbar.searchPlaceholder")}
          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 py-2 pl-9 pr-3 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:bg-slate-900"
        />
      </form>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
        {/* Bouton nouvelle facture */}
        <Link
          href="/invoices/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 sm:px-4 sm:text-sm"
        >
          <Plus className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">{t("topbar.newInvoice")}</span>
          <span className="sm:hidden">{t("topbar.newInvoiceShort")}</span>
        </Link>

        {/* Thème */}
        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? t("topbar.themeLightAria") : t("topbar.themeDarkAria")}
          title={theme === "dark" ? t("topbar.themeLight") : t("topbar.themeDark")}
          className="rounded-lg p-2 text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
        >
          {theme === "dark" ? (
            <Sun className="size-4 sm:size-5" aria-hidden="true" />
          ) : (
            <Moon className="size-4 sm:size-5" aria-hidden="true" />
          )}
        </button>

        {/* Langue */}
        <button
          onClick={toggleLang}
          aria-label="Language"
          title={lang === "fr" ? "English" : "Français"}
          className="hidden rounded-lg p-2 text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 sm:block"
        >
          <Globe className="size-5" aria-hidden="true" />
        </button>

        {/* Notifications */}
        <Link
          href="/notifications"
          aria-label={t("topbar.notifications")}
          className="relative rounded-lg p-2 text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <Bell className="size-4 sm:size-5" aria-hidden="true" />
          {hasNotifications && (
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          )}
        </Link>

        <div className="hidden h-6 w-px bg-slate-200 dark:bg-slate-700 sm:block" aria-hidden="true" />

        {/* Avatar */}
        <button
          aria-label={t("topbar.profile")}
          className="grid size-7 place-items-center rounded-full bg-emerald-600 text-[10px] font-bold text-white transition-opacity hover:opacity-90 sm:size-8 sm:text-xs"
        >
          {initialsOf(displayName)}
        </button>
      </div>
    </header>
  );
}
