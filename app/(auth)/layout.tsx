import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-extrabold text-white shadow-md shadow-emerald-900/20">
            IZ
          </div>
          <div className="leading-tight">
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">MedinaFacture</p>
          </div>
        </div>
        {children}
        <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} MedinaFacture —{" "}
          <Link
            href="/login"
            className="hover:text-slate-600 dark:hover:text-slate-300"
          >
            support@medinafacture.sn
          </Link>
        </p>
      </div>
    </div>
  );
}
