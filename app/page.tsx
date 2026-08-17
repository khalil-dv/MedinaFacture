"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { useEffect, useRef, useState } from "react";
import {
  FileWarning,
  Calculator,
  Eye,
  Zap,
  Percent,
  BarChart3,
  Users,
  ArrowRight,
  Globe,
  Check,
  Star,
  Menu,
  X,
  Shield,
  CreditCard,
  Banknote,
  ReceiptText,
  Timer,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className} ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─── Mockup Dashboard animé ─── */

const MOCK_STATS = [
  {
    label: "Chiffre d'affaires",
    value: "2 450 000",
    trend: "+12.5",
    icon: Banknote,
    color: "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
    trendColor: "text-emerald-600",
  },
  {
    label: "Encaissé",
    value: "1 875 000",
    trend: "+8.2",
    icon: ReceiptText,
    color: "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
    trendColor: "text-emerald-600",
  },
  {
    label: "En attente",
    value: "425 000",
    trend: "-3.1",
    icon: Timer,
    color: "bg-orange-500/10 text-orange-600",
    trendColor: "text-orange-600",
  },
  {
    label: "En retard",
    value: "150 000",
    trend: "+5.0",
    icon: AlertTriangle,
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
    trendColor: "text-red-600",
  },
];

const MOCK_INVOICES = [
  { number: "MF-2026-0047", client: "Fatou Sow", status: "paid", amount: "350 000", statusColor: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" },
  { number: "MF-2026-0046", client: "Ibrahim Koné", status: "sent", amount: "125 000", statusColor: "bg-blue-500/15 text-blue-700 dark:text-blue-400" },
  { number: "MF-2026-0045", client: "Aminata Bâ", status: "overdue", amount: "89 500", statusColor: "bg-red-500/15 text-red-700 dark:text-red-400" },
  { number: "MF-2026-0044", client: "Moussa Diop", status: "paid", amount: "210 000", statusColor: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" },
  { number: "MF-2026-0043", client: "Cheikh Ndiaye", status: "draft", amount: "67 000", statusColor: "bg-slate-200/60 text-slate-600 dark:bg-slate-700/40 dark:text-slate-400" },
];

function DashboardMockup() {
  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/20 dark:shadow-black/40">
      {/* Window bar */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="size-3 rounded-full bg-red-400/80" />
          <div className="size-3 rounded-full bg-amber-400/80" />
          <div className="size-3 rounded-full bg-emerald-400/80" />
        </div>
        <div className="h-6 flex-1 rounded-md bg-slate-100 dark:bg-slate-800" />
      </div>

      <div className="flex min-h-[300px] sm:min-h-[380px] lg:min-h-[420px]">
        {/* Sidebar mockup */}
        <div className="hidden w-36 shrink-0 border-r border-slate-200 dark:border-slate-800 p-2.5 sm:block sm:w-40 sm:p-3 lg:w-44">
          <div className="mb-3 flex items-center gap-2 px-2 pb-3 sm:mb-4">
            <div className="grid size-6 place-items-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-[8px] font-extrabold text-white sm:size-7 sm:text-[9px]">
              MF
            </div>
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 sm:text-xs">MedinaFacture</span>
          </div>
          <div className="space-y-1 sm:space-y-1.5">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-2 py-1.5 sm:px-2.5 sm:py-2">
              <div className="size-3.5 rounded bg-emerald-500/30 sm:size-4" />
              <div className="h-2 w-16 rounded bg-emerald-500/40 sm:h-2.5 sm:w-20" />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg px-2 py-1.5 sm:px-2.5 sm:py-2">
                <div className="size-3.5 rounded bg-slate-200 dark:bg-slate-700 sm:size-4" />
                <div className="h-2 w-14 rounded bg-slate-200 dark:bg-slate-700 sm:h-2.5 sm:w-16" />
              </div>
            ))}
          </div>
          {/* User block */}
          <div className="mt-4 border-t border-slate-200 dark:border-slate-800 pt-3 sm:mt-6">
            <div className="flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800/60 px-2 py-2">
              <div className="grid size-6 shrink-0 place-items-center rounded-full bg-emerald-600 text-[7px] font-bold text-white sm:size-7 sm:text-[8px]">
                AD
              </div>
              <div className="min-w-0">
                <div className="h-2 w-14 truncate rounded bg-slate-300 dark:bg-slate-600 sm:w-16" />
                <div className="mt-0.5 h-1.5 w-10 rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-3 sm:p-5 lg:p-6">
          {/* Greeting */}
          <div className="mb-4 sm:mb-6">
            <div className="h-5 w-40 rounded bg-slate-200 dark:bg-slate-700 sm:h-6 sm:w-56" />
            <div className="mt-1.5 h-3 w-28 rounded bg-slate-100 dark:bg-slate-800 sm:w-36" />
          </div>

          {/* Stat cards */}
          <div className="mb-4 grid grid-cols-2 gap-2.5 sm:mb-6 sm:gap-3 lg:grid-cols-4">
            {MOCK_STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="animate-fade-up rounded-xl border border-slate-200/60 dark:border-slate-800 p-3 sm:p-4"
                  style={{ animationDelay: `${600 + i * 80}ms` }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="h-2 w-14 rounded bg-slate-200 dark:bg-slate-700" />
                    <div className={`grid size-7 place-items-center rounded-lg ${stat.color} sm:size-8`}>
                      <Icon className="size-3.5 sm:size-4" />
                    </div>
                  </div>
                  <p className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-lg">
                    {stat.value}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-[10px] sm:text-xs">
                    <TrendingUp className={`size-3 ${stat.trendColor}`} />
                    <span className={`font-semibold ${stat.trendColor}`}>{stat.trend}%</span>
                    <span className="text-slate-400 dark:text-slate-500">vs mois dernier</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart mockup */}
          <div className="mb-4 hidden overflow-hidden rounded-xl border border-slate-200/60 dark:border-slate-800 p-4 sm:block sm:mb-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="grid size-7 place-items-center rounded-lg bg-emerald-600/10 text-emerald-700 dark:text-emerald-400">
                <BarChart3 className="size-3.5" />
              </div>
              <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="flex items-end gap-2 sm:h-24 lg:h-32">
              {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
                <div
                  key={i}
                  className="animate-grow-y flex-1 rounded-t bg-emerald-500/70 dark:bg-emerald-500/50"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${800 + i * 50}ms`,
                  }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[9px] text-slate-400 dark:text-slate-500">
              <span>Jan</span><span>Fév</span><span>Mar</span><span>Avr</span><span>Mai</span><span>Jun</span>
              <span className="hidden sm:inline">Jul</span><span className="hidden sm:inline">Aoû</span>
              <span className="hidden sm:inline">Sep</span><span className="hidden sm:inline">Oct</span>
              <span className="hidden sm:inline">Nov</span><span className="hidden sm:inline">Déc</span>
            </div>
          </div>

          {/* Recent invoices */}
          <div className="overflow-hidden rounded-xl border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 px-3 py-2.5 sm:px-4">
              <div className="flex items-center gap-2">
                <div className="grid size-6 place-items-center rounded-md bg-emerald-600/10 sm:size-7">
                  <ReceiptText className="size-3 text-emerald-600 dark:text-emerald-400 sm:size-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 sm:text-sm">Dernières factures</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 sm:text-xs">Tout voir →</span>
            </div>
            {MOCK_INVOICES.map((inv, i) => (
              <div
                key={i}
                className="animate-fade-up flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/60 px-3 py-2.5 last:border-0 sm:gap-4 sm:px-4 sm:py-3"
                style={{ animationDelay: `${1000 + i * 60}ms` }}
              >
                <div className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-500/10 sm:size-8">
                  <span className="text-[8px] font-bold text-emerald-600 dark:text-emerald-400 sm:text-[9px]">
                    {inv.client.split(" ").map((w) => w[0]).join("")}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100 sm:text-sm">
                      {inv.number}
                    </span>
                    <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold sm:px-2 sm:text-[10px] ${inv.statusColor}`}>
                      {inv.status === "paid" ? "Payée" : inv.status === "sent" ? "Envoyée" : inv.status === "overdue" ? "En retard" : "Brouillon"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500 sm:text-xs">{inv.client}</p>
                </div>
                <span className="shrink-0 text-xs font-bold text-slate-900 dark:text-slate-100 sm:text-sm">
                  {inv.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { t, toggleLang } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* ─── Navbar ─── */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/60 dark:border-white/[0.06] bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-6 sm:py-4 lg:px-12">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-xs font-extrabold text-white shadow-md shadow-emerald-900/20 sm:size-9">
              MF
            </div>
            <span className="text-[15px] font-bold tracking-tight sm:text-lg">
              MedinaFacture
            </span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <a
              href="#features"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              {t("landing.nav.features")}
            </a>
            <a
              href="#pricing"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              {t("landing.pricing.title")}
            </a>
          </div>

          <div className="flex items-center gap-3 sm:gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 md:inline-flex"
            >
              {t("landing.nav.login")}
            </Link>
            <button
              onClick={toggleLang}
              className="rounded-lg p-2 text-slate-500 dark:text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 md:inline-flex"
              aria-label="Toggle language"
            >
              <Globe className="size-4" />
            </button>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5 hover:bg-emerald-500 hover:shadow-emerald-500/30 active:scale-[0.97] sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <span className="sm:hidden">{t("landing.nav.startShort")}</span>
              <span className="hidden sm:inline">{t("landing.nav.start")}</span>
            </Link>
            <button
              className="p-2 text-slate-600 dark:text-slate-400 sm:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-slate-950 px-5 py-4 space-y-3">
            <a href="#features" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600">
              {t("landing.nav.features")}
            </a>
            <a href="#pricing" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600">
              {t("landing.pricing.title")}
            </a>
            <Link href="/login" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600">
              {t("landing.nav.login")}
            </Link>
            <button onClick={() => { toggleLang(); setMobileOpen(false); }} className="flex items-center gap-2 py-2 text-sm font-medium text-slate-600 dark:text-slate-400">
              <Globe className="size-4" /> {t("landing.nav.features") === "Fonctionnalités" ? "English" : "Français"}
            </button>
          </div>
        )}
      </nav>

      <main>
        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden px-4 pt-16 pb-16 sm:px-5 sm:pt-24 sm:pb-24 lg:px-12 lg:pt-28 lg:pb-32">
          <div className="absolute left-1/2 top-0 -z-10 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-emerald-500/10 opacity-60 blur-[120px] sm:h-[700px] sm:w-[700px]" />

          <div className="mx-auto max-w-4xl text-center">
            <FadeIn>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 px-3.5 py-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 sm:mb-8 sm:px-4 sm:text-xs">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t("landing.hero.badge")}
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              <h1 className="mb-5 text-[1.75rem] font-bold tracking-tight leading-tight sm:mb-6 sm:text-5xl lg:text-6xl lg:leading-[72px]">
                {t("landing.hero.title1")} <br className="hidden sm:block" />
                <span className="text-emerald-600 dark:text-emerald-400">
                  {t("landing.hero.titleHighlight")}
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={200}>
              <p className="mx-auto mb-8 max-w-2xl text-sm text-slate-500 dark:text-slate-400 sm:mb-10 sm:text-base lg:text-lg">
                {t("landing.hero.subtitle")}
              </p>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/signup"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5 hover:bg-emerald-500 sm:w-auto sm:px-8 sm:py-4 sm:text-base"
                >
                  {t("landing.hero.start")}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-white/10 px-6 py-3.5 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 sm:w-auto sm:px-8 sm:py-4 sm:text-base"
                >
                  {t("landing.hero.demo")}
                </Link>
              </div>
            </FadeIn>

            {/* Dashboard mockup */}
            <FadeIn delay={400}>
              <div className="relative mx-auto mt-12 max-w-5xl sm:mt-16 lg:mt-20">
                <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                  <div className="min-w-[520px]">
                    <DashboardMockup />
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ─── Problems ─── */}
        <section className="px-4 py-16 sm:px-5 sm:py-20 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <div className="mb-12 text-center sm:mb-16">
                <h2 className="mb-3 text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                  {t("landing.problem.title")}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 sm:text-base">
                  {t("landing.problem.subtitle")}
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
              {[
                {
                  icon: FileWarning,
                  titleKey: "landing.problem.p1.title",
                  descKey: "landing.problem.p1.desc",
                  color: "text-red-500 dark:text-red-400 bg-red-500/10",
                },
                {
                  icon: Calculator,
                  titleKey: "landing.problem.p2.title",
                  descKey: "landing.problem.p2.desc",
                  color: "text-amber-500 dark:text-amber-400 bg-amber-500/10",
                },
                {
                  icon: Eye,
                  titleKey: "landing.problem.p3.title",
                  descKey: "landing.problem.p3.desc",
                  color: "text-slate-500 dark:text-slate-400 bg-slate-500/10",
                },
              ].map((item, i) => (
                <FadeIn key={item.titleKey} delay={i * 100}>
                  <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-slate-900 p-6 transition-all hover:-translate-y-1 hover:shadow-lg sm:p-7">
                    <div className={`mb-4 inline-flex size-10 items-center justify-center rounded-xl sm:mb-5 sm:size-11 ${item.color}`}>
                      <item.icon className="size-5" />
                    </div>
                    <h3 className="mb-2 text-sm font-bold sm:text-base">
                      {t(item.titleKey)}
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 sm:text-sm">
                      {t(item.descKey)}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How it works ─── */}
        <section className="border-y border-slate-200/60 dark:border-white/[0.04] bg-slate-50 dark:bg-slate-900/50 px-4 py-16 sm:px-5 sm:py-20 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <div className="mb-12 text-center sm:mb-16">
                <h2 className="mb-3 text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                  {t("landing.how.title")}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 sm:text-base">
                  {t("landing.how.subtitle")}
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-12">
              {[
                {
                  num: "01",
                  icon: Shield,
                  titleKey: "landing.how.s1.title",
                  descKey: "landing.how.s1.desc",
                },
                {
                  num: "02",
                  icon: Zap,
                  titleKey: "landing.how.s2.title",
                  descKey: "landing.how.s2.desc",
                },
                {
                  num: "03",
                  icon: CreditCard,
                  titleKey: "landing.how.s3.title",
                  descKey: "landing.how.s3.desc",
                },
              ].map((step, i) => (
                <FadeIn key={step.num} delay={i * 150}>
                  <div className="relative text-center">
                    <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 sm:mb-6 sm:size-16">
                      <step.icon className="size-6 sm:size-7" />
                    </div>
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 sm:text-xs">
                      {step.num}
                    </div>
                    <h3 className="mb-2 text-base font-bold sm:text-lg">
                      {t(step.titleKey)}
                    </h3>
                    <p className="mx-auto max-w-xs text-xs leading-relaxed text-slate-500 dark:text-slate-400 sm:text-sm">
                      {t(step.descKey)}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Features ─── */}
        <section id="features" className="px-4 py-16 sm:px-5 sm:py-20 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <div className="mb-12 text-center sm:mb-16">
                <h2 className="mb-3 text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                  {t("landing.features.title")}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 sm:text-base">
                  {t("landing.features.subtitle")}
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              {[
                {
                  icon: Zap,
                  titleKey: "landing.features.f1.title",
                  descKey: "landing.features.f1.desc",
                },
                {
                  icon: Percent,
                  titleKey: "landing.features.f2.title",
                  descKey: "landing.features.f2.desc",
                },
                {
                  icon: BarChart3,
                  titleKey: "landing.features.f3.title",
                  descKey: "landing.features.f3.desc",
                },
                {
                  icon: Users,
                  titleKey: "landing.features.f4.title",
                  descKey: "landing.features.f4.desc",
                },
              ].map((item, i) => (
                <FadeIn key={item.titleKey} delay={i * 100}>
                  <div className="flex gap-4 rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-slate-900 p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg sm:gap-5 sm:p-7 group">
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-colors group-hover:bg-emerald-600 group-hover:text-white sm:size-12">
                      <item.icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="mb-1 text-sm font-bold sm:mb-1.5 sm:text-base">
                        {t(item.titleKey)}
                      </h3>
                      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 sm:text-sm">
                        {t(item.descKey)}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Testimonials ─── */}
        <section className="border-y border-slate-200/60 dark:border-white/[0.04] bg-slate-50 dark:bg-slate-900/50 px-4 py-16 sm:px-5 sm:py-20 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <div className="mb-12 text-center sm:mb-16">
                <h2 className="mb-3 text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                  {t("landing.testimonials.title")}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 sm:text-base">
                  {t("landing.testimonials.subtitle")}
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
              {[
                { key: "t1", flag: "🇸🇳" },
                { key: "t2", flag: "🇨🇮" },
                { key: "t3", flag: "🇨🇲" },
              ].map((item, i) => (
                <FadeIn key={item.key} delay={i * 100}>
                  <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-slate-900 p-6 transition-all hover:-translate-y-1 hover:shadow-lg sm:p-7">
                    <div className="mb-3 flex gap-1 text-amber-400 sm:mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="size-3.5 fill-current sm:size-4" />
                      ))}
                    </div>
                    <p className="mb-5 text-xs leading-relaxed text-slate-600 dark:text-slate-300 sm:mb-6 sm:text-sm">
                      &ldquo;{t(`landing.testimonials.${item.key}.text`)}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="grid size-9 place-items-center rounded-full bg-emerald-500/10 text-sm font-bold text-emerald-600 dark:text-emerald-400 sm:size-10">
                        {item.flag}
                      </div>
                      <div>
                        <p className="text-xs font-bold sm:text-sm">
                          {t(`landing.testimonials.${item.key}.name`)}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">
                          {t(`landing.testimonials.${item.key}.role`)}
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Pricing ─── */}
        <section id="pricing" className="px-4 py-16 sm:px-5 sm:py-20 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <div className="mb-12 text-center sm:mb-16">
                <h2 className="mb-3 text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                  {t("landing.pricing.title")}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 sm:text-base">
                  {t("landing.pricing.subtitle")}
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 lg:gap-8">
              {/* Free */}
              <FadeIn delay={0}>
                <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-slate-900 p-6 transition-all hover:-translate-y-1 hover:shadow-lg sm:p-7 lg:p-8">
                  <p className="mb-1 text-xs font-bold text-slate-400 dark:text-slate-500 sm:text-sm">
                    {t("landing.pricing.free")}
                  </p>
                  <p className="mb-4 text-[10px] text-slate-400 dark:text-slate-500 sm:text-xs">
                    {t("landing.pricing.freeDesc")}
                  </p>
                  <div className="mb-5 sm:mb-6">
                    <span className="text-2xl font-extrabold tracking-tight sm:text-3xl">0</span>
                    <span className="text-xs font-medium text-slate-500 sm:text-sm"> FCFA/mois</span>
                  </div>
                  <ul className="mb-6 space-y-2.5 sm:mb-8 sm:space-y-3">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <li key={n} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 sm:gap-2.5 sm:text-sm">
                        <Check className="size-3.5 shrink-0 text-emerald-500 sm:size-4" />
                        {t(`landing.pricing.freeF${n}`)}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-white/10 px-5 py-2.5 text-xs font-bold transition-all hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 sm:px-6 sm:py-3 sm:text-sm"
                  >
                    {t("landing.pricing.freeCta")}
                  </Link>
                </div>
              </FadeIn>

              {/* Pro */}
              <FadeIn delay={100}>
                <div className="relative rounded-2xl border-2 border-emerald-500 bg-white dark:bg-slate-900 p-6 shadow-lg shadow-emerald-500/10 sm:p-7 sm:-translate-y-2 lg:p-8">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-bold text-white shadow-md sm:px-4 sm:text-xs">
                    {t("landing.pricing.popular")}
                  </div>
                  <p className="mb-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 sm:text-sm">
                    {t("landing.pricing.pro")}
                  </p>
                  <p className="mb-4 text-[10px] text-slate-400 dark:text-slate-500 sm:text-xs">
                    {t("landing.pricing.proDesc")}
                  </p>
                  <div className="mb-5 sm:mb-6">
                    <span className="text-2xl font-extrabold tracking-tight sm:text-3xl">5 000</span>
                    <span className="text-xs font-medium text-slate-500 sm:text-sm"> FCFA/mois</span>
                  </div>
                  <ul className="mb-6 space-y-2.5 sm:mb-8 sm:space-y-3">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <li key={n} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 sm:gap-2.5 sm:text-sm">
                        <Check className="size-3.5 shrink-0 text-emerald-500 sm:size-4" />
                        {t(`landing.pricing.proF${n}`)}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5 hover:bg-emerald-500 sm:px-6 sm:py-3 sm:text-sm"
                  >
                    {t("landing.pricing.proCta")}
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </FadeIn>

              {/* Business */}
              <FadeIn delay={200}>
                <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-slate-900 p-6 transition-all hover:-translate-y-1 hover:shadow-lg sm:p-7 lg:p-8">
                  <p className="mb-1 text-xs font-bold text-slate-400 dark:text-slate-500 sm:text-sm">
                    {t("landing.pricing.business")}
                  </p>
                  <p className="mb-4 text-[10px] text-slate-400 dark:text-slate-500 sm:text-xs">
                    {t("landing.pricing.businessDesc")}
                  </p>
                  <div className="mb-5 sm:mb-6">
                    <span className="text-2xl font-extrabold tracking-tight sm:text-3xl">15 000</span>
                    <span className="text-xs font-medium text-slate-500 sm:text-sm"> FCFA/mois</span>
                  </div>
                  <ul className="mb-6 space-y-2.5 sm:mb-8 sm:space-y-3">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <li key={n} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 sm:gap-2.5 sm:text-sm">
                        <Check className="size-3.5 shrink-0 text-emerald-500 sm:size-4" />
                        {t(`landing.pricing.businessF${n}`)}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-white/10 px-5 py-2.5 text-xs font-bold transition-all hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 sm:px-6 sm:py-3 sm:text-sm"
                  >
                    {t("landing.pricing.businessCta")}
                  </Link>
                </div>
              </FadeIn>
            </div>

            <FadeIn>
              <p className="mt-6 text-center text-[10px] text-slate-400 dark:text-slate-500 sm:mt-8 sm:text-xs">
                {t("landing.pricing.noCard")}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ─── CTA Final ─── */}
        <section className="relative overflow-hidden px-4 py-16 sm:px-5 sm:py-20 lg:px-12 lg:py-24">
          <div className="absolute inset-0 bg-emerald-600" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
          <div className="relative mx-auto max-w-3xl text-center text-white">
            <FadeIn>
              <h2 className="mb-5 text-xl font-bold tracking-tight sm:mb-6 sm:text-3xl lg:text-4xl">
                {t("landing.cta.title")}
              </h2>
              <p className="mb-6 text-sm text-emerald-100 sm:mb-8 sm:text-base lg:text-lg">
                {t("landing.hero.badge")}
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-emerald-700 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl sm:px-10 sm:py-5 sm:text-base"
              >
                {t("landing.cta.start")}
                <ArrowRight className="size-4" />
              </Link>
            </FadeIn>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-200/60 dark:border-white/[0.06] bg-slate-50 dark:bg-slate-950 px-4 py-10 sm:px-5 sm:py-14 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-10">
            <div className="col-span-2 sm:col-span-1">
              <Link href="/" className="mb-3 flex items-center gap-2">
                <div className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-[10px] font-extrabold text-white">
                  MF
                </div>
                <span className="text-sm font-bold">MedinaFacture</span>
              </Link>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                © {new Date().getFullYear()} MedinaFacture.{" "}
                {t("landing.footer.tagline")}
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {t("landing.footer.features")}
              </h4>
              <ul className="space-y-1">
                <li>
                  <a href="#features" className="inline-block rounded-lg px-2 py-1.5 text-xs text-slate-500 dark:text-slate-500 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 sm:text-sm">
                    {t("landing.nav.features")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {t("landing.footer.support")}
              </h4>
              <ul className="space-y-1">
                <li>
                  <Link href="/support" className="inline-block rounded-lg px-2 py-1.5 text-xs text-slate-500 dark:text-slate-500 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 sm:text-sm">
                    {t("landing.footer.help")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {t("landing.footer.legal")}
              </h4>
              <ul className="space-y-1">
                <li>
                  <span className="inline-block rounded-lg px-2 py-1.5 text-xs text-slate-400 dark:text-slate-600 sm:text-sm">
                    {t("landing.footer.privacy")}
                  </span>
                </li>
                <li>
                  <span className="inline-block rounded-lg px-2 py-1.5 text-xs text-slate-400 dark:text-slate-600 sm:text-sm">
                    {t("landing.footer.terms")}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
