"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, MailCheck, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input, Label } from "@/components/ui/Fields";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      },
    );

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-card ring-1 ring-slate-200 dark:ring-slate-800 sm:p-8">
      <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Mot de passe oublié
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Entrez votre email pour recevoir un lien de réinitialisation.
      </p>

      {sent ? (
        <div className="mt-6 space-y-4">
          <div className="flex items-start gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
            <MailCheck className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <p>
              Si un compte existe pour <strong>{email.trim()}</strong>, un lien
              de réinitialisation vient d&apos;être envoyé. Cliquez dessus, puis
              choisissez votre nouveau mot de passe.
            </p>
          </div>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setSent(false)}
          >
            Renvoyer l&apos;email
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <Label htmlFor="email">Email</Label>
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

          {error && (
            <p className="rounded-lg bg-red-50 dark:bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            <Send className="size-4" aria-hidden="true" />
            {loading ? "Envoi…" : "Envoyer le lien"}
          </Button>
        </form>
      )}

      <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-700"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Retour à la connexion
        </Link>
      </p>
    </div>
  );
}
