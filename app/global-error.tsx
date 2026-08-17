"use client";

import { useTranslation } from "@/lib/i18n";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();
  return (
    <html lang={typeof navigator !== "undefined" ? navigator.language.slice(0, 2) : "fr"}>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10 dark:bg-slate-950">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
            <div
              className="mx-auto mb-4 grid size-11 place-items-center rounded-full bg-red-50 text-xl"
              aria-hidden="true"
            >
              ⚠️
            </div>
            <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {t("globalError.title")}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {t("globalError.desc")}
            </p>
            {process.env.NODE_ENV === "development" && error?.message ? (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-500/10 dark:text-red-300">
                {error.message}
              </p>
            ) : null}
            <button
              type="button"
              onClick={reset}
              className="mt-5 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              {t("globalError.retry")}
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
