"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input, Label } from "@/components/ui/Fields";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const next = searchParams.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const reset = searchParams.get("reset") === "success";
  const authError = searchParams.get("error") === "auth";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? t("login.badCredentials")
          : error.message,
      );
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 sm:p-8">
      <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        {t("login.title")}
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {t("login.subtitle")}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        {reset && (
          <p className="rounded-lg bg-emerald-50 dark:bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">
            {t("login.resetSuccess")}
          </p>
        )}
        {authError && (
          <p className="rounded-lg bg-red-50 dark:bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {t("login.authError")}
          </p>
        )}
        <div>
          <Label htmlFor="email">{t("login.email")}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            placeholder="vous@entreprise.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">{t("login.password")}</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            {t("login.forgot")}
          </Link>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 dark:bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          <LogIn className="size-4" aria-hidden="true" />
          {loading ? t("login.submitting") : t("login.submit")}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
        {t("login.noAccount")}{" "}
        <Link
          href="/signup"
          className="font-semibold text-emerald-600 hover:text-emerald-700"
        >
          {t("login.createAccount")}
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
