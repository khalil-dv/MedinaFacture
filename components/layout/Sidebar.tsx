"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  FileText,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { initialsOf } from "@/lib/format";
import { useTranslation } from "@/lib/i18n";

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const NAV_MAIN = [
    { href: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { href: "/invoices", label: t("nav.invoices"), icon: FileText },
    { href: "/clients", label: t("nav.clients"), icon: Users },
  ];

  const NAV_OTHER = [
    { href: "/settings", label: t("nav.settings"), icon: Settings },
    { href: "/support", label: t("nav.support"), icon: LifeBuoy },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const renderLink = (
    href: string,
    label: string,
    icon: typeof LayoutDashboard,
  ) => {
    const Icon = icon;
    const active = isActive(href);

    return (
      <Link
        key={href}
        href={href}
        onClick={onNavigate}
        className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          active
            ? "bg-emerald-600/15 text-emerald-400"
            : "text-slate-400 dark:text-slate-500 hover:bg-slate-800 hover:text-slate-100"
        }`}
      >
        <Icon
          className={`size-5 shrink-0 transition-colors ${
            active
              ? "text-emerald-400"
              : "text-slate-500 dark:text-slate-400 group-hover:text-slate-300"
          }`}
          aria-hidden="true"
        />
        {label}
        {active && (
          <span
            className="ml-auto h-5 w-1 rounded-full bg-emerald-400"
            aria-hidden="true"
          />
        )}
      </Link>
    );
  };

  return (
    <nav className="flex-1 space-y-6 px-3 py-6">
      <div>
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {t("nav.main")}
        </p>
        <div className="space-y-1">
          {NAV_MAIN.map((item) => renderLink(item.href, item.label, item.icon))}
        </div>
      </div>

      <div>
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {t("nav.management")}
        </p>
        <div className="space-y-1">
          {NAV_OTHER.map((item) =>
            renderLink(item.href, item.label, item.icon),
          )}
        </div>
      </div>
    </nav>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { company, user } = useStore();
  const router = useRouter();
  const { t } = useTranslation();
  const [signingOut, setSigningOut] = useState(false);

  const displayName = user.fullName || company.ownerName || t("nav.user");

  const handleLogout = async () => {
    if (signingOut) return;
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-800 px-6">
        <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-extrabold text-white shadow-md shadow-emerald-900/40">
          MF
        </div>
        <div className="leading-tight">
          <p className="text-base font-bold text-white">MedinaFacture</p>
        </div>
      </div>

      <NavItems onNavigate={onNavigate} />

      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 p-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-600 text-xs font-bold text-white">
            {initialsOf(displayName)}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold text-white">
              {displayName}
            </p>
            <p className="truncate text-xs text-slate-400 dark:text-slate-500">{company.name}</p>
          </div>
          <Link
            href="/settings"
            aria-label={t("nav.settingsAria")}
            className="rounded-lg p-1.5 text-slate-400 dark:text-slate-500 transition-colors hover:bg-slate-700 hover:text-white"
          >
            <Settings className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <button
          onClick={handleLogout}
          disabled={signingOut}
          className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 dark:text-slate-500 transition-colors hover:bg-slate-800 hover:text-red-400"
        >
          <LogOut className="size-4" aria-hidden="true" />
          {signingOut ? t("nav.loggingOut") : t("nav.logout")}
        </button>
      </div>
    </>
  );
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  /** Affiche la sidebar uniquement en tiroir (menu hamburger), sur toutes les tailles d'écran. */
  drawerAlways?: boolean;
}

export function Sidebar({ open, onClose, drawerAlways = false }: SidebarProps) {
  const { t } = useTranslation();
  return (
    <>
      {/* Sidebar desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 ${
          drawerAlways ? "hidden" : "hidden lg:flex"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Drawer */}
      {open && (
        <div
          className={`fixed inset-0 z-50 ${drawerAlways ? "" : "lg:hidden"}`}
        >
          <div
            className="animate-fade-in absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="animate-slide-in-left absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-slate-900 shadow-2xl">
            <button
              onClick={onClose}
              aria-label={t("nav.close")}
              className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-400 dark:text-slate-500 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
            <SidebarContent onNavigate={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}
