import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10 dark:bg-slate-950">
      <div className="w-full max-w-md text-center">
        <p className="text-6xl font-extrabold tracking-tight text-emerald-600">
          404
        </p>
        <h1 className="mt-4 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Page introuvable
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}
