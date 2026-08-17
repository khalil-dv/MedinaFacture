"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
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
} from "lucide-react";

export default function LandingPage() {
  const { t, toggleLang } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* ─── Navbar ─── */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/60 dark:border-white/[0.06] bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-12">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-xs font-extrabold text-white shadow-md shadow-emerald-900/20">
              MF
            </div>
            <span className="text-lg font-bold tracking-tight">
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
            <button
              onClick={toggleLang}
              className="rounded-lg p-2 text-slate-500 dark:text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle language"
            >
              <Globe className="size-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 md:inline-flex"
            >
              {t("landing.nav.login")}
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5 hover:bg-emerald-500 hover:shadow-emerald-500/30 active:scale-[0.97] btn-glow"
            >
              {t("landing.nav.start")}
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden px-5 pt-24 pb-32 md:px-12">
          {/* Glow décoratif */}
          <div className="absolute left-1/2 top-0 -z-10 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/10 opacity-60 blur-[120px]" />

          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {t("landing.hero.badge")}
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl md:leading-[72px]">
              {t("landing.hero.title1")} <br className="hidden sm:block" />
              <span className="text-emerald-600 dark:text-emerald-400 glow-text">
                {t("landing.hero.titleHighlight")}
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-base text-slate-500 dark:text-slate-400 md:text-lg">
              {t("landing.hero.subtitle")}
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5 hover:bg-emerald-500 btn-glow sm:w-auto"
              >
                {t("landing.hero.start")}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-white/10 px-8 py-4 text-base font-medium text-slate-700 dark:text-slate-300 transition-all hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 sm:w-auto"
              >
                {t("landing.hero.demo")}
              </Link>
            </div>

            {/* Mockup dashboard */}
            <div className="relative mx-auto mt-20 max-w-5xl">
              <div className="glass-panel rounded-2xl p-2 shadow-2xl shadow-slate-900/20 dark:shadow-black/40 md:p-3">
                <div className="overflow-hidden rounded-xl border border-slate-200/60 dark:border-white/5">
                  {/* Fake dashboard UI */}
                  <div className="bg-white dark:bg-slate-900">
                    {/* Top bar */}
                    <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
                      <div className="flex gap-1.5">
                        <div className="size-3 rounded-full bg-red-400/80" />
                        <div className="size-3 rounded-full bg-amber-400/80" />
                        <div className="size-3 rounded-full bg-emerald-400/80" />
                      </div>
                      <div className="h-6 flex-1 rounded-md bg-slate-100 dark:bg-slate-800" />
                    </div>
                    {/* Content */}
                    <div className="flex min-h-[240px] sm:min-h-[340px] md:min-h-[400px]">
                      {/* Sidebar */}
                      <div className="hidden w-48 shrink-0 border-r border-slate-200 dark:border-slate-800 p-3 sm:block">
                        <div className="mb-4 space-y-2">
                          <div className="h-8 rounded-lg bg-emerald-500/10" />
                          <div className="h-8 rounded-lg bg-slate-100 dark:bg-slate-800" />
                          <div className="h-8 rounded-lg bg-slate-100 dark:bg-slate-800" />
                          <div className="h-8 rounded-lg bg-slate-100 dark:bg-slate-800" />
                        </div>
                      </div>
                      {/* Main area */}
                      <div className="flex-1 p-4 sm:p-6">
                        {/* Stat cards */}
                        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                            <div className="mb-2 h-2 w-16 rounded bg-slate-200 dark:bg-slate-700" />
                            <div className="mb-1 h-5 w-20 rounded bg-slate-300 dark:bg-slate-600" />
                            <div className="h-1.5 w-12 rounded bg-emerald-400/60" />
                          </div>
                          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                            <div className="mb-2 h-2 w-16 rounded bg-slate-200 dark:bg-slate-700" />
                            <div className="mb-1 h-5 w-20 rounded bg-slate-300 dark:bg-slate-600" />
                            <div className="h-1.5 w-12 rounded bg-emerald-400/60" />
                          </div>
                          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                            <div className="mb-2 h-2 w-16 rounded bg-slate-200 dark:bg-slate-700" />
                            <div className="mb-1 h-5 w-20 rounded bg-slate-300 dark:bg-slate-600" />
                            <div className="h-1.5 w-12 rounded bg-amber-400/60" />
                          </div>
                          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                            <div className="mb-2 h-2 w-16 rounded bg-slate-200 dark:bg-slate-700" />
                            <div className="mb-1 h-5 w-20 rounded bg-slate-300 dark:bg-slate-600" />
                            <div className="h-1.5 w-12 rounded bg-red-400/60" />
                          </div>
                        </div>
                        {/* Table */}
                        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                          <div className="hidden border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 sm:flex sm:gap-4 px-4 py-2.5">
                            <div className="h-2.5 w-24 rounded bg-slate-300 dark:bg-slate-600" />
                            <div className="h-2.5 w-20 rounded bg-slate-200 dark:bg-slate-700" />
                            <div className="ml-auto h-2.5 w-16 rounded bg-slate-200 dark:bg-slate-700" />
                          </div>
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/60 px-4 py-3 last:border-0"
                            >
                              <div className="size-7 shrink-0 rounded-full bg-emerald-500/10" />
                              <div className="flex-1 space-y-1.5">
                                <div className="h-2.5 w-28 rounded bg-slate-300 dark:bg-slate-600" />
                                <div className="h-2 w-20 rounded bg-slate-200 dark:bg-slate-700" />
                              </div>
                              <div className="hidden h-5 w-16 rounded-full bg-emerald-500/15 sm:block" />
                              <div className="h-2.5 w-14 rounded bg-slate-300 dark:bg-slate-600" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Problems ─── */}
        <section className="border-y border-slate-200/60 dark:border-white/[0.04] bg-slate-100/50 dark:bg-slate-900/50 px-5 py-24 md:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
                {t("landing.problem.title")}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                {t("landing.problem.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
              ].map((item) => (
                <div
                  key={item.titleKey}
                  className="glass-panel rounded-2xl p-7 transition-all hover:-translate-y-1"
                >
                  <div
                    className={`mb-5 inline-flex size-11 items-center justify-center rounded-xl ${item.color}`}
                  >
                    <item.icon className="size-5" />
                  </div>
                  <h3 className="mb-2 text-base font-bold">
                    {t(item.titleKey)}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {t(item.descKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Features ─── */}
        <section
          id="features"
          className="px-5 py-24 md:px-12"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
                {t("landing.features.title")}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                {t("landing.features.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
              ].map((item) => (
                <div
                  key={item.titleKey}
                  className="glass-panel flex gap-5 rounded-2xl p-7 transition-all hover:-translate-y-0.5 group"
                >
                  <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                    <item.icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="mb-1.5 text-base font-bold">
                      {t(item.titleKey)}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {t(item.descKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="relative overflow-hidden px-5 py-24 md:px-12">
          <div className="absolute inset-0 bg-emerald-500/5" />
          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
              {t("landing.cta.title")}
            </h2>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-10 py-5 text-base font-bold text-white shadow-xl shadow-emerald-600/25 transition-all hover:-translate-y-1 hover:bg-emerald-500 btn-glow"
            >
              {t("landing.cta.start")}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-200/60 dark:border-white/[0.06] bg-slate-100/80 dark:bg-slate-950 px-5 py-14 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
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
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-sm text-slate-500 dark:text-slate-500 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    {t("landing.nav.features")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {t("landing.footer.support")}
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/support"
                    className="text-sm text-slate-500 dark:text-slate-500 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    {t("landing.footer.help")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {t("landing.footer.legal")}
              </h4>
              <ul className="space-y-2">
                <li>
                  <span className="text-sm text-slate-400 dark:text-slate-600">
                    {t("landing.footer.privacy")}
                  </span>
                </li>
                <li>
                  <span className="text-sm text-slate-400 dark:text-slate-600">
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
