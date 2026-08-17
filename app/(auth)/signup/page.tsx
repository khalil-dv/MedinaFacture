"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input, Label } from "@/components/ui/Fields";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n";

export default function SignupPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (password.length < 8) {
      setError(t("signup.passwordShort"));
      return;
    }
    if (password !== confirm) {
      setError(t("signup.passwordMismatch"));
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Compte actif immédiatement (confirmation email désactivée)
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    // Confirmation par email requise
    setLoading(false);
    setError(
      t("signup.confirmEmail"),
    );
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 sm:p-8">
      <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        {t("signup.title")}
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {t("signup.subtitle")}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <Label htmlFor="fullName">{t("signup.fullName")}</Label>
          <Input
            id="fullName"
            autoComplete="name"
            required
            placeholder={t("signup.fullNamePlaceholder")}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="email">{t("signup.email")}</Label>
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
          <Label htmlFor="password">{t("signup.password")}</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            placeholder={t("signup.passwordMin")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="confirm">{t("signup.confirm")}</Label>
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            required
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 dark:bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          <UserPlus className="size-4" aria-hidden="true" />
          {loading ? t("signup.submitting") : t("signup.submit")}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
        {t("signup.hasAccount")}{" "}
        <Link
          href="/login"
          className="font-semibold text-emerald-600 hover:text-emerald-700"
        >
          {t("signup.login")}
        </Link>
      </p>
    </div>
  );
}
