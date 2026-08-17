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
} from "lucide-react";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
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

export default function LandingPage() {
  const { t, toggleLang } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* ─── Navbar ─── */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/60 dark:border-white/[0.06] bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-12">
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
            <a
              href="#pricing"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              {t("landing.pricing.title")}
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
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5 hover:bg-emerald-500 hover:shadow-emerald-500/30 active:scale-[0.97]"
            >
              {t("landing.nav.start")}
            </Link>
            <button
              className="md:hidden p-2 text-slate-600 dark:text-slate-400"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-slate-950 px-5 py-4 space-y-3">
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
        <section className="relative overflow-hidden px-5 pt-20 pb-24 sm:pt-28 sm:pb-32 lg:px-12">
          <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/10 opacity-60 blur-[120px] sm:h-[700px] sm:w-[700px]" />

          <div className="mx-auto max-w-4xl text-center">
            <FadeIn>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 sm:mb-8">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t("landing.hero.badge")}
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[72px]">
                {t("landing.hero.title1")} <br className="hidden sm:block" />
                <span className="text-emerald-600 dark:text-emerald-400">
                  {t("landing.hero.titleHighlight")}
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={200}>
              <p className="mx-auto mb-10 max-w-2xl text-base text-slate-500 dark:text-slate-400 sm:text-lg">
                {t("landing.hero.subtitle")}
              </p>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5 hover:bg-emerald-500 sm:w-auto"
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
            </FadeIn>

            {/* Dashboard mockup */}
            <FadeIn delay={400}>
              <div className="relative mx-auto mt-16 max-w-5xl sm:mt-20">
                <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-slate-900 p-2 shadow-2xl shadow-slate-900/20 dark:shadow-black/40 sm:p-3">
                  <div className="overflow-hidden rounded-xl">
                    <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
                      <div className="flex gap-1.5">
                        <div className="size-3 rounded-full bg-red-400/80" />
                        <div className="size-3 rounded-full bg-amber-400/80" />
                        <div className="size-3 rounded-full bg-emerald-400/80" />
                      </div>
                      <div className="h-6 flex-1 rounded-md bg-slate-100 dark:bg-slate-800" />
                    </div>
                    <div className="flex min-h-[200px] sm:min-h-[300px] lg:min-h-[400px]">
                      <div className="hidden w-44 shrink-0 border-r border-slate-200 dark:border-slate-800 p-3 lg:block">
                        <div className="space-y-2">
                          <div className="h-8 rounded-lg bg-emerald-500/10" />
                          <div className="h-8 rounded-lg bg-slate-100 dark:bg-slate-800" />
                          <div className="h-8 rounded-lg bg-slate-100 dark:bg-slate-800" />
                          <div className="h-8 rounded-lg bg-slate-100 dark:bg-slate-800" />
                        </div>
                      </div>
                      <div className="flex-1 p-4 sm:p-6">
                        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                          {["bg-emerald-400/60", "bg-emerald-400/60", "bg-amber-400/60", "bg-red-400/60"].map(
                            (c, i) => (
                              <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                                <div className="mb-2 h-2 w-16 rounded bg-slate-200 dark:bg-slate-700" />
                                <div className="mb-1 h-5 w-20 rounded bg-slate-300 dark:bg-slate-600" />
                                <div className={`h-1.5 w-12 rounded ${c}`} />
                              </div>
                            ),
                          )}
                        </div>
                        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/60 px-4 py-3 last:border-0">
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
            </FadeIn>
          </div>
        </section>

        {/* ─── Logos / Trust ─── */}
        <section className="border-y border-slate-200/60 dark:border-white/[0.04] bg-slate-50 dark:bg-slate-900/50 px-5 py-10 sm:py-14">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {t("landing.testimonials.title")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-slate-300 dark:text-slate-600">
              {["Wave", "Orange Money", "MTN MoMo", "Free Money"].map((name) => (
                <span key={name} className="text-sm font-bold tracking-wide opacity-60">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Problems ─── */}
        <section className="px-5 py-20 sm:py-24 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <div className="mb-14 text-center sm:mb-16">
                <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  {t("landing.problem.title")}
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  {t("landing.problem.subtitle")}
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
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
                  <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-slate-900 p-7 transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className={`mb-5 inline-flex size-11 items-center justify-center rounded-xl ${item.color}`}>
                      <item.icon className="size-5" />
                    </div>
                    <h3 className="mb-2 text-base font-bold">
                      {t(item.titleKey)}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {t(item.descKey)}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How it works ─── */}
        <section className="border-y border-slate-200/60 dark:border-white/[0.04] bg-slate-50 dark:bg-slate-900/50 px-5 py-20 sm:py-24 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <div className="mb-14 text-center sm:mb-16">
                <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  {t("landing.how.title")}
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
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
                    <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25">
                      <step.icon className="size-7" />
                    </div>
                    <div className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                      {step.num}
                    </div>
                    <h3 className="mb-2 text-lg font-bold">
                      {t(step.titleKey)}
                    </h3>
                    <p className="mx-auto max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {t(step.descKey)}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Features ─── */}
        <section id="features" className="px-5 py-20 sm:py-24 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <div className="mb-14 text-center sm:mb-16">
                <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  {t("landing.features.title")}
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  {t("landing.features.subtitle")}
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                  <div className="flex gap-5 rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-slate-900 p-7 transition-all hover:-translate-y-0.5 hover:shadow-lg group">
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
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Testimonials ─── */}
        <section className="border-y border-slate-200/60 dark:border-white/[0.04] bg-slate-50 dark:bg-slate-900/50 px-5 py-20 sm:py-24 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <div className="mb-14 text-center sm:mb-16">
                <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  {t("landing.testimonials.title")}
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  {t("landing.testimonials.subtitle")}
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { key: "t1", flag: "🇸🇳" },
                { key: "t2", flag: "🇨🇮" },
                { key: "t3", flag: "🇨🇲" },
              ].map((item, i) => (
                <FadeIn key={item.key} delay={i * 100}>
                  <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-slate-900 p-7 transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="mb-4 flex gap-1 text-amber-400">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="size-4 fill-current" />
                      ))}
                    </div>
                    <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      &ldquo;{t(`landing.testimonials.${item.key}.text`)}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="grid size-10 place-items-center rounded-full bg-emerald-500/10 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {item.flag}
                      </div>
                      <div>
                        <p className="text-sm font-bold">
                          {t(`landing.testimonials.${item.key}.name`)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
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
        <section id="pricing" className="px-5 py-20 sm:py-24 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <div className="mb-14 text-center sm:mb-16">
                <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  {t("landing.pricing.title")}
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  {t("landing.pricing.subtitle")}
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
              {/* Free */}
              <FadeIn delay={0}>
                <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-slate-900 p-7 sm:p-8 transition-all hover:-translate-y-1 hover:shadow-lg">
                  <p className="mb-1 text-sm font-bold text-slate-400 dark:text-slate-500">
                    {t("landing.pricing.free")}
                  </p>
                  <p className="mb-4 text-xs text-slate-400 dark:text-slate-500">
                    {t("landing.pricing.freeDesc")}
                  </p>
                  <div className="mb-6">
                    <span className="text-3xl font-extrabold tracking-tight">0</span>
                    <span className="text-sm font-medium text-slate-500"> FCFA/mois</span>
                  </div>
                  <ul className="mb-8 space-y-3">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <li key={n} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                        <Check className="size-4 shrink-0 text-emerald-500" />
                        {t(`landing.pricing.freeF${n}`)}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-white/10 px-6 py-3 text-sm font-bold transition-all hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    {t("landing.pricing.freeCta")}
                  </Link>
                </div>
              </FadeIn>

              {/* Pro */}
              <FadeIn delay={100}>
                <div className="relative rounded-2xl border-2 border-emerald-500 bg-white dark:bg-slate-900 p-7 shadow-lg shadow-emerald-500/10 sm:p-8 sm:-translate-y-2">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-1 text-xs font-bold text-white shadow-md">
                    {t("landing.pricing.popular")}
                  </div>
                  <p className="mb-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {t("landing.pricing.pro")}
                  </p>
                  <p className="mb-4 text-xs text-slate-400 dark:text-slate-500">
                    {t("landing.pricing.proDesc")}
                  </p>
                  <div className="mb-6">
                    <span className="text-3xl font-extrabold tracking-tight">5 000</span>
                    <span className="text-sm font-medium text-slate-500"> FCFA/mois</span>
                  </div>
                  <ul className="mb-8 space-y-3">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <li key={n} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                        <Check className="size-4 shrink-0 text-emerald-500" />
                        {t(`landing.pricing.proF${n}`)}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5 hover:bg-emerald-500"
                  >
                    {t("landing.pricing.proCta")}
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </FadeIn>

              {/* Business */}
              <FadeIn delay={200}>
                <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-slate-900 p-7 sm:p-8 transition-all hover:-translate-y-1 hover:shadow-lg">
                  <p className="mb-1 text-sm font-bold text-slate-400 dark:text-slate-500">
                    {t("landing.pricing.business")}
                  </p>
                  <p className="mb-4 text-xs text-slate-400 dark:text-slate-500">
                    {t("landing.pricing.businessDesc")}
                  </p>
                  <div className="mb-6">
                    <span className="text-3xl font-extrabold tracking-tight">15 000</span>
                    <span className="text-sm font-medium text-slate-500"> FCFA/mois</span>
                  </div>
                  <ul className="mb-8 space-y-3">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <li key={n} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                        <Check className="size-4 shrink-0 text-emerald-500" />
                        {t(`landing.pricing.businessF${n}`)}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-white/10 px-6 py-3 text-sm font-bold transition-all hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    {t("landing.pricing.businessCta")}
                  </Link>
                </div>
              </FadeIn>
            </div>

            <FadeIn>
              <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
                {t("landing.pricing.noCard")}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ─── CTA Final ─── */}
        <section className="relative overflow-hidden px-5 py-20 sm:py-24 lg:px-12">
          <div className="absolute inset-0 bg-emerald-600" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
          <div className="relative mx-auto max-w-3xl text-center text-white">
            <FadeIn>
              <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-4xl">
                {t("landing.cta.title")}
              </h2>
              <p className="mb-8 text-base text-emerald-100 sm:text-lg">
                {t("landing.hero.badge")}
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-5 text-base font-bold text-emerald-700 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                {t("landing.cta.start")}
                <ArrowRight className="size-4" />
              </Link>
            </FadeIn>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-200/60 dark:border-white/[0.06] bg-slate-50 dark:bg-slate-950 px-5 py-14 lg:px-12">
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
                  <a href="#features" className="text-sm text-slate-500 dark:text-slate-500 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400">
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
                  <Link href="/support" className="text-sm text-slate-500 dark:text-slate-500 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400">
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
